/**
 * 港台城市與代表經度（真太陽時校正用）。
 *
 * 時區：UTC+8（CST），中央經線 120°E。
 * 台灣各縣市與香港、澳門的長期經度差，會用真太陽時補正。
 */

export interface CityZh {
  /** 顯示名（例：台北市） */
  name: string;
  /** 代表城市（例：台北） */
  capital: string;
  /** 經度（東經） */
  longitude: number;
}

export const CITIES_ZH: CityZh[] = [
  { name: '台北市', capital: '台北', longitude: 121.56 },
  { name: '新北市', capital: '板橋', longitude: 121.46 },
  { name: '桃園市', capital: '桃園', longitude: 121.30 },
  { name: '台中市', capital: '台中', longitude: 120.68 },
  { name: '台南市', capital: '台南', longitude: 120.21 },
  { name: '高雄市', capital: '高雄', longitude: 120.30 },
  { name: '基隆市', capital: '基隆', longitude: 121.74 },
  { name: '新竹市', capital: '新竹', longitude: 120.97 },
  { name: '新竹縣', capital: '竹北', longitude: 121.02 },
  { name: '苗栗縣', capital: '苗栗', longitude: 120.82 },
  { name: '彰化縣', capital: '彰化', longitude: 120.54 },
  { name: '南投縣', capital: '南投', longitude: 120.68 },
  { name: '雲林縣', capital: '斗六', longitude: 120.54 },
  { name: '嘉義市', capital: '嘉義', longitude: 120.45 },
  { name: '嘉義縣', capital: '太保', longitude: 120.44 },
  { name: '屏東縣', capital: '屏東', longitude: 120.49 },
  { name: '宜蘭縣', capital: '宜蘭', longitude: 121.75 },
  { name: '花蓮縣', capital: '花蓮', longitude: 121.60 },
  { name: '台東縣', capital: '台東', longitude: 121.15 },
  { name: '澎湖縣', capital: '馬公', longitude: 119.57 },
  { name: '金門縣', capital: '金城', longitude: 118.32 },
  { name: '連江縣', capital: '南竿', longitude: 119.95 },
  { name: '香港', capital: '中環', longitude: 114.17 },
  { name: '澳門', capital: '澳門', longitude: 113.55 },
];

export function getCity(name: string): CityZh | undefined {
  return CITIES_ZH.find((c) => c.name === name);
}

/** UTC+8 的中央經線（120°E） */
export const CST_MERIDIAN = 120;
/** UTC+8（分鐘） */
export const CST_OFFSET_MINUTES = 480;

/** 十二時辰（地支 → 顯示名） */
export const SHICHEN_ZH = ['子時', '丑時', '寅時', '卯時', '辰時', '巳時', '午時', '未時', '申時', '酉時', '戌時', '亥時'];

export function shichenZh(branch: number): string {
  return SHICHEN_ZH[branch] ?? '';
}
