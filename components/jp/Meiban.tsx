import type { JpChartFacts } from '@/lib/jp/facts';

const GRID_POS: Record<number, [number, number]> = {
  5: [1, 1],
  6: [1, 2],
  7: [1, 3],
  8: [1, 4],
  4: [2, 1],
  9: [2, 4],
  3: [3, 1],
  10: [3, 4],
  2: [4, 1],
  1: [4, 2],
  0: [4, 3],
  11: [4, 4],
};

const HUA_CLASS: Record<string, string> = {
  禄: 'ja-hua-lu',
  权: 'ja-hua-quan',
  権: 'ja-hua-quan',
  科: 'ja-hua-ke',
  忌: 'ja-hua-ji',
};

const HUA_LABEL: Record<string, string> = {
  禄: '禄',
  权: '権',
  権: '権',
  科: '科',
  忌: '忌',
};

export default function Meiban({
  facts,
  focus,
}: {
  facts: JpChartFacts;
  /** 強調する宮（例：夫妻＝恋愛レポート） */
  focus?: string;
}) {
  const dxByBranch = new Map(facts.chart.daXians.map((d) => [d.palaceBranch, d]));

  return (
    <div>
      <div className="ja-meiban" role="group" aria-label="命盤（十二宮）">
        {facts.palaces.map((p) => {
          const [row, col] = GRID_POS[p.branch] ?? [1, 1];
          const dx = dxByBranch.get(p.branch);
          const isMing = p.name === '命宫';
          const isFocus = focus ? p.name === focus : false;
          const majors = p.stars.filter((s) => s.type === 'major');
          const others = p.stars.filter((s) => s.type !== 'major').slice(0, 4);
          return (
            <div
              key={p.name}
              className={`ja-palace ${isMing ? 'is-ming' : ''} ${isFocus ? 'is-focus' : ''}`}
              style={{ gridRow: row, gridColumn: col }}
            >
              <div className="ja-palace-top">
                <span>
                  {p.stemName}
                  {p.branchName}
                </span>
                {dx && (
                  <span>
                    {dx.startAge}–{dx.endAge}
                  </span>
                )}
              </div>
              <div className="ja-palace-name">{p.nameJa}</div>
              <div className="ja-palace-stars">
                {majors.map((s) => (
                  <span key={s.name} className="ja-star major">
                    {s.ja.nameJa}
                    {s.brightness && <span className="br">{s.brightness.label}</span>}
                    {s.siHua && (
                      <span className={`hua ${HUA_CLASS[s.siHua] ?? ''}`}>
                        {HUA_LABEL[s.siHua] ?? s.siHua}
                      </span>
                    )}
                  </span>
                ))}
                {majors.length === 0 && (
                  <span className="ja-star" style={{ color: '#8a8577' }}>
                    空宮
                  </span>
                )}
                {others.map((s) => (
                  <span key={s.name} className="ja-star">
                    {s.ja.nameJa}
                  </span>
                ))}
              </div>
            </div>
          );
        })}

        <div className="ja-meiban-center">
          <div className="title">紫微斗数</div>
          <div className="sub">
            {facts.wuxingJuName} ・ {facts.yinYangGender}
          </div>
          <div className="sub">
            命主 {facts.mingZhu} ／ 身主 {facts.shenZhu}
          </div>
          <div className="sub">生年 {facts.chart.lunarInfo.lunarYear}年</div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px 14px',
          marginTop: 12,
          fontSize: 11,
          color: '#8a8577',
        }}
      >
        <span>
          <span className="ja-hua-lu">禄</span> 恵み
        </span>
        <span>
          <span className="ja-hua-quan">権</span> 主導
        </span>
        <span>
          <span className="ja-hua-ke">科</span> 名声
        </span>
        <span>
          <span className="ja-hua-ji">忌</span> こだわり
        </span>
        <span>数字は大限の年齢</span>
      </div>
    </div>
  );
}
