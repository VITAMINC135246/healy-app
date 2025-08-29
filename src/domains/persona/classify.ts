// src/domain/persona/classify.ts
// 把三轴映射为 8 原型（含混合/滞回），并提供“从答案一步到位”的封装函数

import { computeAxesFromAnswers, type Axes, type Answers } from './axes';

export type PersonaCode = 'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H';
export type Persona = PersonaCode | 'Mixed';

export type ClassifyResult = {
  persona: Persona;       // Mixed 或 A..H
  major: PersonaCode;     // 主型
  minor?: PersonaCode;    // 混合时的副型
  axes: Axes;             // 三轴（0..1）
  confidence: number;     // 0..1（离阈值越远越大）
};

type AxesConfig = { alpha: number; hi: number; lo: number; switchDelta: number };
const DEFAULT_CFG: AxesConfig = { alpha: 0.3, hi: 0.6, lo: 0.4, switchDelta: 0.15 };

function readCfg(): AxesConfig {
  try {
    const cfg = require('../../config/config.json');
    const axes = (cfg?.axes ?? {}) as Partial<AxesConfig>;
    return { ...DEFAULT_CFG, ...axes };
  } catch {
    return DEFAULT_CFG;
  }
}

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

function band(v: number, lo: number, hi: number): 'L'|'M'|'H' {
  if (v <= lo) return 'L';
  if (v >= hi) return 'H';
  return 'M';
}

function mapToPersona(ne: 'L'|'M'|'H', ar: 'L'|'M'|'H', cog: 'L'|'M'|'H'): PersonaCode {
  // 只在 H/L 情况下才用于主型映射；M（中间带）在上层处理成 Mixed
  const NE = ne === 'H';
  const AR = ar === 'H';
  const COG = cog === 'H';
  // 8 桶映射（与我们之前讨论一致）
  if (NE && AR && COG) return 'A';        // 紧绷-反刍
  if (NE && AR && !COG) return 'B';       // 惊惧-回避
  if (NE && !AR && COG) return 'C';       // 低能-反刍
  if (NE && !AR && !COG) return 'D';      // 低能-回避
  if (!NE && AR && COG) return 'E';       // 高活-反刍
  if (!NE && AR && !COG) return 'F';      // 高活-行动
  if (!NE && !AR && COG) return 'G';      // 平稳-思考
  return 'H';                              // 平静-随性（!NE && !AR && !COG）
}

function flipBand(b: 'L'|'M'|'H'): 'L'|'H' {
  return b === 'H' ? 'L' : 'H';
}

// 粗略“置信度”：主轴与最近阈值的最小距离（越大越稳）
function confidenceOfBands(ne: 'L'|'M'|'H', ar: 'L'|'M'|'H', cog: 'L'|'M'|'H', axes: Axes, lo: number, hi: number): number {
  const dist = (v: number, b: 'L'|'M'|'H') => {
    if (b === 'L') return clamp01((lo - v));      // v ≤ lo：离 hi/lo 的距离，用 lo - v（0..1 内小量）
    if (b === 'H') return clamp01((v - hi));
    // M：在中间，置信度最低
    return 0;
  };
  return clamp01(Math.min(dist(axes.NE, ne), dist(axes.AR, ar), dist(axes.COG, cog)) + 0.0001);
}

// 主函数：三轴 → 原型（带混合/滞回）
export function classifyAxes(axes: Axes, prevPersona?: PersonaCode): ClassifyResult {
  const { lo, hi, switchDelta } = readCfg();

  const bNE = band(axes.NE, lo, hi);
  const bAR = band(axes.AR, lo, hi);
  const bCOG = band(axes.COG, lo, hi);

  const hasMid = bNE === 'M' || bAR === 'M' || bCOG === 'M';

  // 先按边界压成 H/L 得出一个主型
  const major = mapToPersona(bNE === 'M' ? (axes.NE >= 0.5 ? 'H' : 'L') : bNE,
                             bAR === 'M' ? (axes.AR >= 0.5 ? 'H' : 'L') : bAR,
                             bCOG === 'M' ? (axes.COG >= 0.5 ? 'H' : 'L') : bCOG);

  // 计算一个“备选副型”：把最接近中线的那条轴翻转
  let minor: PersonaCode | undefined = undefined;
  if (hasMid) {
    const mids: Array<['NE'|'AR'|'COG', number]> = [];
    if (bNE === 'M') mids.push(['NE', Math.abs(axes.NE - 0.5)]);
    if (bAR === 'M') mids.push(['AR', Math.abs(axes.AR - 0.5)]);
    if (bCOG === 'M') mids.push(['COG', Math.abs(axes.COG - 0.5)]);
    mids.sort((a, b) => a[1] - b[1]); // 最靠近 0.5 的优先
    const [axis] = mids[0];
    const fbNE = axis === 'NE' ? flipBand(bNE) : bNE;
    const fbAR = axis === 'AR' ? flipBand(bAR) : bAR;
    const fbCOG = axis === 'COG' ? flipBand(bCOG) : bCOG;
    minor = mapToPersona(fbNE === 'M' ? 'L' : fbNE, fbAR === 'M' ? 'L' : fbAR, fbCOG === 'M' ? 'L' : fbCOG);
  }

  // 滞回：若之前的 persona 与当前 major 不同，而“当前置信度 - 之前置信度 < switchDelta”，则保持不切换
  const nowConf = confidenceOfBands(
    bNE === 'M' ? (axes.NE >= 0.5 ? 'H' : 'L') : bNE,
    bAR === 'M' ? (axes.AR >= 0.5 ? 'H' : 'L') : bAR,
    bCOG === 'M' ? (axes.COG >= 0.5 ? 'H' : 'L') : bCOG,
    axes, lo, hi
  );

  let persona: PersonaCode | 'Mixed' = major;

  if (prevPersona && prevPersona !== major) {
    // 估个“之前的置信度”
    const prevNe = prevPersona === 'A' || prevPersona === 'B' || prevPersona === 'C' || prevPersona === 'D' ? 'H' : 'L';
    const prevAr = prevPersona === 'A' || prevPersona === 'B' || prevPersona === 'E' || prevPersona === 'F' ? 'H' : 'L';
    const prevCg = prevPersona === 'A' || prevPersona === 'C' || prevPersona === 'E' || prevPersona === 'G' ? 'H' : 'L';
    const prevConf = confidenceOfBands(prevNe as any, prevAr as any, prevCg as any, axes, lo, hi);

    if (nowConf - prevConf < switchDelta) {
      // 差距不够大，维持旧型
      persona = prevPersona;
    }
  }

  if (hasMid) persona = 'Mixed';

  return {
    persona,
    major,
    minor,
    axes,
    confidence: clamp01(nowConf),
  };
}

// 便捷函数：从 answers 一步到位得到结果（会做 EMA，因为 computeAxesFromAnswers 支持传 prevAxes）
export function classifyFromAnswers(
  answers: Answers,
  prevAxes?: Axes,
  prevPersona?: PersonaCode
): ClassifyResult {
  const axes = computeAxesFromAnswers(answers, prevAxes);
  return classifyAxes(axes, prevPersona);
}
