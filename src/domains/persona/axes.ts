// src/domain/persona/axes.ts
// 把问卷答案聚合成三轴：NE（负向情绪）、AR（生理激活）、COG（认知风格：反刍↔回避）
// - 归一化到 0..1
// - EMA 平滑（alpha）
// - 支持 quick.json / deep.json 中的元数据：axis/weight/type/min/max
// - 情境多选（type=multi/single）默认不计入轴

export type Axes = { NE: number; AR: number; COG: number };
export type Answers = Record<string, number | string | string[]>;

type AxisKey = keyof Axes;
type ItemMeta = {
  axis?: AxisKey;
  weight?: number;
  type?: 'slider' | 'multi' | 'single';
  min?: number;
  max?: number;
};

// ---- 配置读取（含默认值） ---------------------------------------------------
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

// ---- 元数据映射：把 forms 里的每个 item 做成 lookup 表 ---------------------
function buildMeta(): Record<string, ItemMeta> {
  const meta: Record<string, ItemMeta> = {};
  const forms: any[] = [];
  try { forms.push(require('../../content/forms/quick.json')); } catch {}
  try { forms.push(require('../../content/forms/deep.json')); } catch {}

  for (const form of forms) {
    for (const sec of form?.sections ?? []) {
      const secType = sec?.type as ItemMeta['type'] | undefined;
      for (const it of sec?.items ?? []) {
        if (!it?.id) continue;
        meta[it.id] = {
          axis: it.axis as AxisKey | undefined,
          weight: typeof it.weight === 'number' ? it.weight : 1,
          type: (it.type ?? secType) as ItemMeta['type'],
          min: typeof it.min === 'number' ? it.min : undefined,
          max: typeof it.max === 'number' ? it.max : undefined,
        };
      }
    }
  }
  return meta;
}

const META = buildMeta();

const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);

// 把一个 item 的答案（0..3 或滑杆值）转为 0..1 的贡献值
function itemContribution(id: string, value: number, m: ItemMeta): number {
  // slider: 用 min/max 归一化；Valence(可能 min<0,max>0) 会自动反向（越负 → NE 越高）
  if (m.type === 'slider') {
    const min = typeof m.min === 'number' ? m.min : 0;
    const max = typeof m.max === 'number' ? m.max : 1;
    if (max === min) return 0;
    let t = (value - min) / (max - min); // 0..1
    // 如果是 NE 且滑杆跨越 0（如 Valence -3..3），使用反向：越小（负向）→ NE 越大
    if (m.axis === 'NE' && min < 0 && max > 0) {
      t = 1 - t;
    }
    return clamp01(t) * (m.weight ?? 1);
  }
  // 普通量表：默认 0..3 打到 0..1
  const t = clamp01(value / 3);
  return t * (m.weight ?? 1);
}

// ---- 主函数：Answers -> Axes ----------------------------------------------
export function computeAxesFromAnswers(
  answers: Answers,
  prevAxes?: Axes
): Axes {
  const { alpha } = readCfg();

  const raw: Axes = { NE: 0, AR: 0, COG: 0 };
  const max: Axes = { NE: 0, AR: 0, COG: 0 };

  for (const [id, v] of Object.entries(answers ?? {})) {
    const meta = META[id];
    if (!meta || !meta.axis) continue; // 非计分项（情境/单选）直接跳过

    // 只接受数字值（slider/量表）；其余略过
    const num =
      typeof v === 'number'
        ? v
        : typeof v === 'string'
        ? Number(v)
        : NaN;
    if (Number.isNaN(num)) continue;

    const contrib = itemContribution(id, num, meta);
    raw[meta.axis] += contrib;
    // max 的“题数 * 1”作为上限（权重用于贡献，max 用题目个数衡量）
    max[meta.axis] += 1;
  }

  // 归一化（没有题目的轴给 0.5 作为中性）
  const norm: Axes = {
    NE: max.NE > 0 ? clamp01(raw.NE / max.NE) : 0.5,
    AR: max.AR > 0 ? clamp01(raw.AR / max.AR) : 0.5,
    COG: max.COG > 0 ? clamp01(raw.COG / max.COG) : 0.5,
  };

  // EMA 平滑：new = (1-α)*prev + α*norm
  const ema: Axes = {
    NE: prevAxes ? (1 - alpha) * prevAxes.NE + alpha * norm.NE : norm.NE,
    AR: prevAxes ? (1 - alpha) * prevAxes.AR + alpha * norm.AR : norm.AR,
    COG: prevAxes ? (1 - alpha) * prevAxes.COG + alpha * norm.COG : norm.COG,
  };

  return ema;
}
