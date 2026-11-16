/**
 * 日本の都道府県別・代表経度（県庁所在地ベース）
 *
 * 真太陽時の補正に使う。日本標準時は UTC+9（中央経線 135°E）。
 * 県内でも東西に幅があるため、±10分程度の誤差は残る（出生時刻が时辰境界に近い場合のみ影響）。
 */

export interface PrefectureJa {
  /** 表示名（例：東京都） */
  name: string;
  /** 読み */
  kana: string;
  /** 代表都市（例：新宿） */
  capital: string;
  /** 経度（東経） */
  longitude: number;
}

export const PREFECTURES_JA: PrefectureJa[] = [
  { name: '北海道', kana: 'ほっかいどう', capital: '札幌', longitude: 141.35 },
  { name: '青森県', kana: 'あおもりけん', capital: '青森', longitude: 140.74 },
  { name: '岩手県', kana: 'いわてけん', capital: '盛岡', longitude: 141.15 },
  { name: '宮城県', kana: 'みやぎけん', capital: '仙台', longitude: 140.87 },
  { name: '秋田県', kana: 'あきたけん', capital: '秋田', longitude: 140.10 },
  { name: '山形県', kana: 'やまがたけん', capital: '山形', longitude: 140.33 },
  { name: '福島県', kana: 'ふくしまけん', capital: '福島', longitude: 140.47 },
  { name: '茨城県', kana: 'いばらきけん', capital: '水戸', longitude: 140.45 },
  { name: '栃木県', kana: 'とちぎけん', capital: '宇都宮', longitude: 139.88 },
  { name: '群馬県', kana: 'ぐんまけん', capital: '前橋', longitude: 139.06 },
  { name: '埼玉県', kana: 'さいたまけん', capital: 'さいたま', longitude: 139.65 },
  { name: '千葉県', kana: 'ちばけん', capital: '千葉', longitude: 140.12 },
  { name: '東京都', kana: 'とうきょうと', capital: '新宿', longitude: 139.69 },
  { name: '神奈川県', kana: 'かながわけん', capital: '横浜', longitude: 139.64 },
  { name: '新潟県', kana: 'にいがたけん', capital: '新潟', longitude: 139.02 },
  { name: '富山県', kana: 'とやまけん', capital: '富山', longitude: 137.21 },
  { name: '石川県', kana: 'いしかわけん', capital: '金沢', longitude: 136.66 },
  { name: '福井県', kana: 'ふくいけん', capital: '福井', longitude: 136.22 },
  { name: '山梨県', kana: 'やまなしけん', capital: '甲府', longitude: 138.57 },
  { name: '長野県', kana: 'ながのけん', capital: '長野', longitude: 138.18 },
  { name: '岐阜県', kana: 'ぎふけん', capital: '岐阜', longitude: 136.76 },
  { name: '静岡県', kana: 'しずおかけん', capital: '静岡', longitude: 138.38 },
  { name: '愛知県', kana: 'あいちけん', capital: '名古屋', longitude: 136.91 },
  { name: '三重県', kana: 'みえけん', capital: '津', longitude: 136.51 },
  { name: '滋賀県', kana: 'しがけん', capital: '大津', longitude: 135.87 },
  { name: '京都府', kana: 'きょうとふ', capital: '京都', longitude: 135.77 },
  { name: '大阪府', kana: 'おおさかふ', capital: '大阪', longitude: 135.50 },
  { name: '兵庫県', kana: 'ひょうごけん', capital: '神戸', longitude: 135.20 },
  { name: '奈良県', kana: 'ならけん', capital: '奈良', longitude: 135.83 },
  { name: '和歌山県', kana: 'わかやまけん', capital: '和歌山', longitude: 135.17 },
  { name: '鳥取県', kana: 'とっとりけん', capital: '鳥取', longitude: 134.24 },
  { name: '島根県', kana: 'しまねけん', capital: '松江', longitude: 133.05 },
  { name: '岡山県', kana: 'おかやまけん', capital: '岡山', longitude: 133.93 },
  { name: '広島県', kana: 'ひろしまけん', capital: '広島', longitude: 132.46 },
  { name: '山口県', kana: 'やまぐちけん', capital: '山口', longitude: 131.47 },
  { name: '徳島県', kana: 'とくしまけん', capital: '徳島', longitude: 134.55 },
  { name: '香川県', kana: 'かがわけん', capital: '高松', longitude: 134.05 },
  { name: '愛媛県', kana: 'えひめけん', capital: '松山', longitude: 132.77 },
  { name: '高知県', kana: 'こうちけん', capital: '高知', longitude: 133.53 },
  { name: '福岡県', kana: 'ふくおかけん', capital: '福岡', longitude: 130.40 },
  { name: '佐賀県', kana: 'さがけん', capital: '佐賀', longitude: 130.30 },
  { name: '長崎県', kana: 'ながさきけん', capital: '長崎', longitude: 129.87 },
  { name: '熊本県', kana: 'くまもとけん', capital: '熊本', longitude: 130.71 },
  { name: '大分県', kana: 'おおいたけん', capital: '大分', longitude: 131.61 },
  { name: '宮崎県', kana: 'みやざきけん', capital: '宮崎', longitude: 131.42 },
  { name: '鹿児島県', kana: 'かごしまけん', capital: '鹿児島', longitude: 130.56 },
  { name: '沖縄県', kana: 'おきなわけん', capital: '那覇', longitude: 127.68 },
];

export function getPrefecture(name: string): PrefectureJa | undefined {
  return PREFECTURES_JA.find((p) => p.name === name);
}

/** 都道府県名から経度を取得（不明なら undefined） */
export function longitudeOfPrefecture(name: string): number | undefined {
  return getPrefecture(name)?.longitude;
}

/** 日本標準時の中央経線（UTC+9） */
export const JST_MERIDIAN = 135;
export const JST_OFFSET_MINUTES = 540;
