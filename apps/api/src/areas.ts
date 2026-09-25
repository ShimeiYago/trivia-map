import coordinates from './area-coords.json' with { type: 'json' };

type Park = 'L' | 'S';
type Polygon = Array<[number, number]>;
type Area = { name: string; children?: Record<string, Area> };

const areas: Record<Park, Area> = {
  L: { name: 'ランド', children: { WB: { name: 'ワールドバザール' }, DLPL: { name: 'プラザ' }, AL: { name: 'アドベンチャーランド', children: { RST: { name: 'ロイヤルストリート' } } }, WL: { name: 'ウエスタンランド', children: { TSI: { name: 'トムソーヤ島' } } }, CC: { name: 'クリッターカントリー' }, FL: { name: 'ファンタジーランド', children: { NFL: { name: 'ニューファンタジーランド' } } }, TT: { name: 'トゥーンタウン' }, TL: { name: 'トゥモローランド' } } },
  S: { name: 'シー', children: { DSPL: { name: 'プラザ' }, MH: { name: 'メディテレーニアンハーバー', children: { PP: { name: 'ポルトパラディーゾ' }, PC: { name: 'パラッツォカナル' }, EL: { name: 'エクスプローラーズランディング' } } }, AW: { name: 'アメリカンウォーターフロント', children: { NY: { name: 'ニューヨーク' }, CCOD: { name: 'ケープコッド' }, TTP: { name: 'トイビルトロリーパーク' } } }, PD: { name: 'ポートディスカバリー' }, FS: { name: 'ファンタジースプリングス', children: { FK: { name: 'フローズンキングダム' }, PN: { name: 'ピーターパンのネバーランド' }, RF: { name: 'ラプンツェルの森' } } }, LD: { name: 'ロストリバーデルタ' }, AC: { name: 'アラビアンコースト' }, ML: { name: 'マーメイドラグーン' }, MI: { name: 'ミステリアスアイランド' } } },
};

const inside = (point: [number, number], polygon: Array<[number, number]>) => {
  let result = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i]; const [xj, yj] = polygon[j];
    if ((yi > point[1]) !== (yj > point[1]) && point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi) result = !result;
  }
  return result;
};

export const guessAreaNames = (lat: number, lng: number, park: Park) => {
  const descend = (area: Area, ids: Record<string, Polygon>, names: string[]): string[] => {
    const result = [...names, area.name];
    for (const [id, child] of Object.entries(area.children ?? {})) if (ids[id] && inside([lat, lng], ids[id])) return descend(child, ids, result);
    return result;
  };
  return descend(areas[park], coordinates[park] as unknown as Record<string, Polygon>, []);
};
