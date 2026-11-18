# 日本語版・予測コンテンツ生成フロー

紫微館の「診断結果」「鑑定書」「相性」が、どのコードを通って生成されるかの整理。

> 結論：**排盘はエンジン、文章は TypeScript テンプレート、AI は任意（現在オフ）**。  
> 同じ出生情報・同じ年・同じコードなら、出力は決定的。

## 全体フロー

```mermaid
flowchart TD
  A[トップ / 診断フォーム / 相性フォーム] --> B[URL パラメータ<br/>y m d h mi u g p]
  B --> C[lib/jp/birth.ts<br/>JST・真太陽時・晚子時・時刻不明]
  C --> D[lib/ziwei/algorithm.ts<br/>generateChart]
  D --> E[iztro<br/>十二宮・主星・四化・大限]
  D --> F[lunar-javascript<br/>旧暦・節気・干支]
  E --> G[lib/jp/facts.ts<br/>buildJpFacts]
  F --> G
  G --> H[lib/jp/glossary.ts<br/>starJa / 宮位 / 四化 / 格局]
  G --> I[lib/jp/interpret.ts<br/>無料読み解き]
  G --> J[lib/jp/report.ts<br/>恋愛・事業鑑定書]
  G --> K[lib/jp/compat.ts<br/>相性]
  I --> L[app/ja/result]
  J --> M[app/ja/report<br/>+ lib/jp/access.ts]
  K --> N[app/ja/aishou/result]
  L --> O[AiReading（任意）]
  O --> P[/api/ja/interpret]
  P --> Q[lib/jp/llm.ts]
  Q --> R[外部 LLM]
```

## テキスト版

```text
入力（URL パラメータ）
  → lib/jp/birth.ts
      日本時間 / 135°E 真太陽時 / 晚子時は翌日 / 時刻不明は正午
  → lib/ziwei/algorithm.ts: generateChart()
      iztro（十二宮・主星・四化・大限）
      lunar-javascript（旧暦・節気・干支）
  → lib/jp/facts.ts: buildJpFacts(chart, year, patterns)
      命宮・夫妻・官禄・財帛・田宅…
      主星・明暗・四化・吉星・煞星
      大限・流年
      glossary.ts の starJa() で日本語名に変換
  → 生成
      interpret.ts  buildFreeReading(facts)
      report.ts     buildReport(facts, type)
      compat.ts     buildCompat(factsA, factsB)
  → 画面
      app/ja/result
      app/ja/report（access.ts でロック/ベータ無料）
      app/ja/aishou/result
  → 任意
      AiReading → /api/ja/interpret → llm.ts → 外部 LLM
```

## レイヤーと編集箇所

| レイヤー | ファイル | 性質 | 変更するとき |
|---|---|---|---|
| 出生情報 | `lib/jp/birth.ts` | 決定的 | 時区・真太陽時・晚子時のルール |
| 排盘 | `lib/ziwei/algorithm.ts` + `iztro` | 決定的 | 命理ルール、宮位・星曜の算法 |
| 事実整理 | `lib/jp/facts.ts` | 決定的 | どの宮・星を取るか、日本語への対応 |
| 星曜文案 | `lib/jp/glossary.ts` | 手書きテンプレート | 14 主星・12 宮・四化・格局の言い回し |
| 格局 | `lib/ziwei/patterns.ts` + `patterns-dinggui.ts` / `patterns-dingfu.ts` + `lib/jp/glossary.ts` | 判定は決定的・訳文は手書き | 判定ロジック、《全書》定貴局/定富局の収録範囲、日本語訳 |
| 無料読み解き | `lib/jp/interpret.ts` | テンプレート結合 | 本質・恋愛・仕事・今年 |
| 恋愛鑑定書 | `lib/jp/report.ts` | テンプレート結合 | 6 項目・要約・書き出し |
| 事業鑑定書 | `lib/jp/report.ts` | テンプレート結合 | 仕事・お金・官禄・財帛 |
| 相性 | `lib/jp/compat.ts` | テンプレート結合 | 六合・三合・冲、五行、大限 |
| 2027 | `app/ja/2027/page.tsx` | 静的 + 年干データ | 四化・春節の説明 |
| 記事 | `lib/jp/articles.ts` | 静的 | 6 本の長文 |
| AI | `lib/jp/llm.ts` | LLM リアルタイム | prompt・モデル・オン/オフ |

## 決定的な部分 / 変わる部分

**決定的（同じ入力なら同じ結果）**

- 命宮の位置、主星、廟旺利陷
- 四化がどの宮に入るか
- 大限の開始・終了年齢、流年干支
- 夫妻宮・官禄宮・財帛宮の星
- 格局の判定（どの格が立つか。訳文と並び順は `glossary.ts` / `facts.ts`）

**手書き（コードに固定）**

- 「七殺は突破力と独立心を象徴する星です」のような星の説明
- 「恋愛の進み方は…」のような段落テンプレート
- 記事、2027 の説明、法務ページ

**LLM（現在オフ）**

- AI パネルの文章のみ
- `JP_LLM_API_KEY` 未設定時は 501 を返し、パネル自体を表示しない

## 出力が変わる条件

1. `glossary.ts` / `interpret.ts` / `report.ts` / `compat.ts` の文案を変更
2. 年を変更（流年の四化が変わる）
3. 現在日付が変更（虚歳・大限が変わる）
4. AI を有効化（その部分だけ非決定的）

## テストとの関係

- `jp-birth`：時区・真太陽時・晚子時
- `jp-content`：用語・文案・明暗
- `jp-report`：空宮・簡体字・欠落
- `jp-edge`：大限境界・立春/春節
- `jp-compat`：相性の分岐
- `jp-patterns`：格局の並び順・出典・未翻訳＋金標準盤（空宮・晚子時・読年非依存）（`NODE_OPTIONS=--conditions=react-server` で実行）
- `jp-ratelimit` / `jp-ai-token`：AI の入口

文案を変えたら `npm test` と `smoke:ja` を通すこと。
