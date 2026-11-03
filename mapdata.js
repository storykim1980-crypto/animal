/* =========================================================================
   都道府県データ（緯度経度は県庁所在地付近の代表点）
   ========================================================================= */
window.REGIONS = [
  { key: 'hokkaido-tohoku', name: '北海道・東北', en: 'NORTH' },
  { key: 'kanto',           name: '関東',         en: 'EAST' },
  { key: 'chubu',           name: '中部',         en: 'CENTRAL' },
  { key: 'kinki',           name: '近畿',         en: 'WEST' },
  { key: 'chugoku',         name: '中国',         en: 'WESTERN' },
  { key: 'shikoku',         name: '四国',         en: 'SOUTH' },
  { key: 'kyushu-okinawa',  name: '九州・沖縄',   en: 'SOUTH-WEST' }
];

window.PREFECTURES = [
  { name: '北海道',   region: 'hokkaido-tohoku', lat: 43.06, lon: 141.35 },
  { name: '青森県',   region: 'hokkaido-tohoku', lat: 40.82, lon: 140.74 },
  { name: '岩手県',   region: 'hokkaido-tohoku', lat: 39.70, lon: 141.15 },
  { name: '宮城県',   region: 'hokkaido-tohoku', lat: 38.27, lon: 140.87 },
  { name: '秋田県',   region: 'hokkaido-tohoku', lat: 39.72, lon: 140.10 },
  { name: '山形県',   region: 'hokkaido-tohoku', lat: 38.24, lon: 140.36 },
  { name: '福島県',   region: 'hokkaido-tohoku', lat: 37.75, lon: 140.47 },

  { name: '茨城県',   region: 'kanto', lat: 36.34, lon: 140.45 },
  { name: '栃木県',   region: 'kanto', lat: 36.57, lon: 139.88 },
  { name: '群馬県',   region: 'kanto', lat: 36.39, lon: 139.06 },
  { name: '埼玉県',   region: 'kanto', lat: 35.86, lon: 139.65 },
  { name: '千葉県',   region: 'kanto', lat: 35.61, lon: 140.12 },
  { name: '東京都',   region: 'kanto', lat: 35.69, lon: 139.69 },
  { name: '神奈川県', region: 'kanto', lat: 35.45, lon: 139.64 },

  { name: '新潟県',   region: 'chubu', lat: 37.90, lon: 139.02 },
  { name: '富山県',   region: 'chubu', lat: 36.70, lon: 137.21 },
  { name: '石川県',   region: 'chubu', lat: 36.59, lon: 136.63 },
  { name: '福井県',   region: 'chubu', lat: 36.07, lon: 136.22 },
  { name: '山梨県',   region: 'chubu', lat: 35.66, lon: 138.57 },
  { name: '長野県',   region: 'chubu', lat: 36.23, lon: 138.18 },
  { name: '岐阜県',   region: 'chubu', lat: 35.39, lon: 136.72 },
  { name: '静岡県',   region: 'chubu', lat: 34.98, lon: 138.38 },
  { name: '愛知県',   region: 'chubu', lat: 35.18, lon: 136.91 },

  { name: '三重県',   region: 'kinki', lat: 34.73, lon: 136.51 },
  { name: '滋賀県',   region: 'kinki', lat: 35.00, lon: 135.87 },
  { name: '京都府',   region: 'kinki', lat: 35.02, lon: 135.76 },
  { name: '大阪府',   region: 'kinki', lat: 34.69, lon: 135.50 },
  { name: '兵庫県',   region: 'kinki', lat: 34.69, lon: 135.18 },
  { name: '奈良県',   region: 'kinki', lat: 34.69, lon: 135.83 },
  { name: '和歌山県', region: 'kinki', lat: 34.23, lon: 135.17 },

  { name: '鳥取県',   region: 'chugoku', lat: 35.50, lon: 134.24 },
  { name: '島根県',   region: 'chugoku', lat: 35.47, lon: 133.05 },
  { name: '岡山県',   region: 'chugoku', lat: 34.66, lon: 133.93 },
  { name: '広島県',   region: 'chugoku', lat: 34.40, lon: 132.46 },
  { name: '山口県',   region: 'chugoku', lat: 34.19, lon: 131.47 },

  { name: '徳島県',   region: 'shikoku', lat: 34.07, lon: 134.55 },
  { name: '香川県',   region: 'shikoku', lat: 34.34, lon: 134.05 },
  { name: '愛媛県',   region: 'shikoku', lat: 33.84, lon: 132.77 },
  { name: '高知県',   region: 'shikoku', lat: 33.56, lon: 133.53 },

  { name: '福岡県',   region: 'kyushu-okinawa', lat: 33.61, lon: 130.42 },
  { name: '佐賀県',   region: 'kyushu-okinawa', lat: 33.25, lon: 130.30 },
  { name: '長崎県',   region: 'kyushu-okinawa', lat: 32.75, lon: 129.87 },
  { name: '熊本県',   region: 'kyushu-okinawa', lat: 32.79, lon: 130.74 },
  { name: '大分県',   region: 'kyushu-okinawa', lat: 33.24, lon: 131.61 },
  { name: '宮崎県',   region: 'kyushu-okinawa', lat: 31.91, lon: 131.42 },
  { name: '鹿児島県', region: 'kyushu-okinawa', lat: 31.56, lon: 130.56 },
  { name: '沖縄県',   region: 'kyushu-okinawa', lat: 26.21, lon: 127.68 }
];
