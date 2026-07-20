import type { Era } from '../types/game';

// Define the continent polygons for the background vector map
export interface ContinentPolygon {
  name: string;
  points: [number, number][];
}

export const CONTINENTS: ContinentPolygon[] = [
  {
    name: 'Greenland',
    points: [[360, 60], [420, 50], [460, 80], [430, 130], [390, 120]]
  },
  {
    name: 'North America',
    points: [[60, 160], [220, 130], [280, 160], [330, 220], [340, 300], [320, 340], [260, 400], [280, 440], [250, 460], [230, 420], [210, 360], [130, 360], [100, 310], [50, 240]]
  },
  {
    name: 'South America',
    points: [[250, 450], [300, 450], [360, 500], [390, 560], [370, 640], [330, 660], [300, 600], [270, 540]]
  },
  {
    name: 'Africa',
    points: [[400, 400], [460, 380], [530, 400], [580, 440], [570, 510], [540, 620], [500, 640], [490, 560], [440, 520], [380, 460]]
  },
  {
    name: 'Eurasia',
    points: [[440, 260], [460, 200], [510, 130], [560, 100], [700, 90], [880, 100], [940, 180], [880, 330], [840, 420], [780, 440], [730, 400], [670, 400], [620, 360], [560, 360], [510, 310]]
  },
  {
    name: 'Australia',
    points: [[780, 540], [860, 530], [890, 580], [870, 630], [800, 620], [770, 580]]
  },
  {
    name: 'Great Britain',
    points: [[430, 220], [450, 200], [460, 230], [440, 250]]
  },
  {
    name: 'Japan',
    points: [[890, 230], [910, 260], [900, 310], [880, 280]]
  },
  {
    name: 'Madagascar',
    points: [[570, 570], [590, 590], [580, 630], [560, 610]]
  },
  {
    name: 'Iceland',
    points: [[390, 160], [410, 150], [420, 170], [400, 180]]
  }
];

export const ERAS: Era[] = [
  {
    id: 'modern',
    name: 'Modern Era',
    preamble: 'The year is 2026. Tensions have reached a boiling point. Cyber warfare has blinded global satellite systems, disabling international monitoring. The UN has broken down, and a series of localized skirmishes threatens to trigger World War III. Major powers scramble to secure borders, build defenses, and conquer resources in real-time.',
    nodes: [
      // USA (3 Star)
      { id: 'us_cap', name: 'Washington D.C.', type: 'capital', countryId: 'usa', countryName: 'USA', stars: 3, x: 250, y: 280, troops: 15, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'us_city', name: 'New York', type: 'city', countryId: 'usa', countryName: 'USA', stars: 3, x: 270, y: 250, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'us_base', name: 'Norfolk Naval Station', type: 'military_base', countryId: 'usa', countryName: 'USA', stars: 3, x: 260, y: 310, troops: 12, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'us_la', name: 'Los Angeles', type: 'city', countryId: 'usa', countryName: 'USA', stars: 3, x: 140, y: 300, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'us_chi', name: 'Chicago', type: 'city', countryId: 'usa', countryName: 'USA', stars: 3, x: 210, y: 240, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // China (3 Star)
      { id: 'cn_cap', name: 'Beijing', type: 'capital', countryId: 'china', countryName: 'China', stars: 3, x: 800, y: 220, troops: 15, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'cn_city', name: 'Shanghai', type: 'city', countryId: 'china', countryName: 'China', stars: 3, x: 830, y: 260, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'cn_base', name: 'Hainan Base', type: 'military_base', countryId: 'china', countryName: 'China', stars: 3, x: 790, y: 320, troops: 12, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'cn_hk', name: 'Guangzhou', type: 'city', countryId: 'china', countryName: 'China', stars: 3, x: 810, y: 310, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // Russia (3 Star)
      { id: 'ru_cap', name: 'Moscow', type: 'capital', countryId: 'russia', countryName: 'Russia', stars: 3, x: 570, y: 170, troops: 15, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'ru_city', name: 'St. Petersburg', type: 'city', countryId: 'russia', countryName: 'Russia', stars: 3, x: 540, y: 140, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'ru_base', name: 'Sevastopol Base', type: 'military_base', countryId: 'russia', countryName: 'Russia', stars: 3, x: 560, y: 220, troops: 12, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'ru_sib', name: 'Novosibirsk', type: 'city', countryId: 'russia', countryName: 'Russia', stars: 3, x: 710, y: 160, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // Germany (2 Star)
      { id: 'de_cap', name: 'Berlin', type: 'capital', countryId: 'germany', countryName: 'Germany', stars: 2, x: 500, y: 200, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'de_city', name: 'Munich', type: 'city', countryId: 'germany', countryName: 'Germany', stars: 2, x: 490, y: 230, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // India (2 Star)
      { id: 'in_cap', name: 'New Delhi', type: 'capital', countryId: 'india', countryName: 'India', stars: 2, x: 700, y: 300, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'in_city', name: 'Mumbai', type: 'city', countryId: 'india', countryName: 'India', stars: 2, x: 680, y: 340, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'in_kol', name: 'Kolkata', type: 'city', countryId: 'india', countryName: 'India', stars: 2, x: 730, y: 320, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // Brazil (2 Star)
      { id: 'br_cap', name: 'Brasilia', type: 'capital', countryId: 'brazil', countryName: 'Brazil', stars: 2, x: 330, y: 530, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'br_city', name: 'Rio de Janeiro', type: 'city', countryId: 'brazil', countryName: 'Brazil', stars: 2, x: 350, y: 560, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // UK (2 Star)
      { id: 'uk_cap', name: 'London', type: 'capital', countryId: 'uk', countryName: 'United Kingdom', stars: 2, x: 440, y: 210, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'uk_base', name: 'Gibraltar Base', type: 'military_base', countryId: 'uk', countryName: 'United Kingdom', stars: 2, x: 430, y: 310, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // France (2 Star)
      { id: 'fr_cap', name: 'Paris', type: 'capital', countryId: 'france', countryName: 'France', stars: 2, x: 460, y: 230, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'fr_city', name: 'Marseille', type: 'city', countryId: 'france', countryName: 'France', stars: 2, x: 470, y: 260, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // Japan (2 Star)
      { id: 'jp_cap', name: 'Tokyo', type: 'capital', countryId: 'japan', countryName: 'Japan', stars: 2, x: 890, y: 250, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // 1 Star Countries
      { id: 'za_cap', name: 'Pretoria', type: 'capital', countryId: 'south_africa', countryName: 'South Africa', stars: 1, x: 520, y: 580, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'au_cap', name: 'Canberra', type: 'capital', countryId: 'australia', countryName: 'Australia', stars: 1, x: 840, y: 580, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'au_syd', name: 'Sydney', type: 'city', countryId: 'australia', countryName: 'Australia', stars: 1, x: 860, y: 570, troops: 6, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'cv_cap', name: 'Praia', type: 'capital', countryId: 'cape_verde', countryName: 'Cape Verde', stars: 1, x: 360, y: 430, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'eg_cap', name: 'Cairo', type: 'capital', countryId: 'egypt', countryName: 'Egypt', stars: 1, x: 550, y: 320, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'eg_alex', name: 'Alexandria', type: 'city', countryId: 'egypt', countryName: 'Egypt', stars: 1, x: 535, y: 310, troops: 6, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'mx_cap', name: 'Mexico City', type: 'capital', countryId: 'mexico', countryName: 'Mexico', stars: 1, x: 180, y: 400, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'ar_cap', name: 'Buenos Aires', type: 'capital', countryId: 'argentina', countryName: 'Argentina', stars: 1, x: 320, y: 620, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'ng_cap', name: 'Lagos', type: 'capital', countryId: 'nigeria', countryName: 'Nigeria', stars: 1, x: 450, y: 450, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'tr_cap', name: 'Istanbul', type: 'capital', countryId: 'turkey', countryName: 'Turkey', stars: 1, x: 560, y: 260, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} }
    ],
    connections: [
      // Internal USA
      { from: 'us_cap', to: 'us_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'us_cap', to: 'us_base', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'us_city', to: 'us_base', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'us_cap', to: 'us_la', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'us_cap', to: 'us_chi', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'us_la', to: 'us_chi', barrierName: null, defenseMultiplier: 1.0 },

      // Internal China
      { from: 'cn_cap', to: 'cn_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'cn_cap', to: 'cn_base', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'cn_city', to: 'cn_base', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'cn_city', to: 'cn_hk', barrierName: null, defenseMultiplier: 1.0 },

      // Internal Russia
      { from: 'ru_cap', to: 'ru_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'ru_cap', to: 'ru_base', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'ru_city', to: 'ru_base', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'ru_cap', to: 'ru_sib', barrierName: null, defenseMultiplier: 1.0 },

      // Internal Germany / Europe
      { from: 'de_cap', to: 'de_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'uk_cap', to: 'uk_base', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'fr_cap', to: 'fr_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'uk_cap', to: 'fr_cap', barrierName: 'English Channel', defenseMultiplier: 1.3 },
      { from: 'fr_cap', to: 'de_cap', barrierName: 'Rhine River', defenseMultiplier: 1.2 },
      { from: 'fr_city', to: 'uk_base', barrierName: null, defenseMultiplier: 1.0 },

      // Internal India
      { from: 'in_cap', to: 'in_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'in_cap', to: 'in_kol', barrierName: null, defenseMultiplier: 1.0 },

      // Internal Brazil / Americas
      { from: 'br_cap', to: 'br_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'us_la', to: 'mx_cap', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'mx_cap', to: 'br_cap', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'br_city', to: 'ar_cap', barrierName: null, defenseMultiplier: 1.0 },

      // Egypt / Middle East
      { from: 'eg_cap', to: 'eg_alex', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'eg_cap', to: 'tr_cap', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'tr_cap', to: 'ru_base', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'tr_cap', to: 'de_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'ng_cap', to: 'cv_cap', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'ng_cap', to: 'za_cap', barrierName: null, defenseMultiplier: 1.0 },

      // Asia / Australia / Global Links
      { from: 'jp_cap', to: 'cn_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'au_cap', to: 'au_syd', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'cn_hk', to: 'au_syd', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'us_la', to: 'jp_cap', barrierName: 'Pacific Ocean', defenseMultiplier: 1.2 },
      { from: 'us_city', to: 'uk_cap', barrierName: 'Atlantic Ocean', defenseMultiplier: 1.2 },
      { from: 'us_city', to: 'ru_city', barrierName: 'Bering Strait', defenseMultiplier: 1.3 },
      { from: 'us_base', to: 'br_cap', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'br_city', to: 'cv_cap', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'cv_cap', to: 'za_cap', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'cv_cap', to: 'de_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'de_cap', to: 'ru_base', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'de_city', to: 'eg_cap', barrierName: 'The Alps', defenseMultiplier: 1.4 },
      { from: 'eg_cap', to: 'za_cap', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'eg_cap', to: 'in_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'ru_cap', to: 'cn_cap', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'in_cap', to: 'cn_base', barrierName: 'The Himalayas', defenseMultiplier: 1.6 },
      { from: 'cn_city', to: 'au_cap', barrierName: null, defenseMultiplier: 1.0 },

      // Australia to South Africa
      { from: 'au_cap', to: 'za_cap', barrierName: null, defenseMultiplier: 1.0 }
    ]
  },
  {
    id: 'ww2',
    name: 'World War II',
    preamble: 'The year is 1939. The globe is plunged into the deadliest conflict in human history. The Axis and Allied coalitions prepare to clash. Total mobilization is active. Neutral states fortify their borders as heavy armored columns and air wings threaten sudden incursions.',
    nodes: [
      // Germany (3 Star)
      { id: 'w2_de_cap', name: 'Berlin', type: 'capital', countryId: 'germany', countryName: 'Germany', stars: 3, x: 500, y: 200, troops: 15, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w2_de_city', name: 'Munich', type: 'city', countryId: 'germany', countryName: 'Germany', stars: 3, x: 490, y: 230, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w2_de_base', name: 'Kiel Naval Station', type: 'military_base', countryId: 'germany', countryName: 'Germany', stars: 3, x: 485, y: 175, troops: 12, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // USA (3 Star)
      { id: 'w2_us_cap', name: 'Washington D.C.', type: 'capital', countryId: 'usa', countryName: 'USA', stars: 3, x: 250, y: 280, troops: 15, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w2_us_city', name: 'New York', type: 'city', countryId: 'usa', countryName: 'USA', stars: 3, x: 270, y: 250, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w2_us_base', name: 'Norfolk Naval Base', type: 'military_base', countryId: 'usa', countryName: 'USA', stars: 3, x: 260, y: 310, troops: 12, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // USSR (3 Star)
      { id: 'w2_su_cap', name: 'Moscow', type: 'capital', countryId: 'ussr', countryName: 'USSR', stars: 3, x: 570, y: 170, troops: 15, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w2_su_city', name: 'Stalingrad', type: 'city', countryId: 'ussr', countryName: 'USSR', stars: 3, x: 600, y: 220, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w2_su_base', name: 'Murmansk Base', type: 'military_base', countryId: 'ussr', countryName: 'USSR', stars: 3, x: 550, y: 110, troops: 12, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // UK (2 Star)
      { id: 'w2_uk_cap', name: 'London', type: 'capital', countryId: 'uk', countryName: 'UK', stars: 2, x: 445, y: 225, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w2_uk_city', name: 'Scapa Flow Base', type: 'military_base', countryId: 'uk', countryName: 'UK', stars: 2, x: 440, y: 200, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // Japan (2 Star)
      { id: 'w2_jp_cap', name: 'Tokyo', type: 'capital', countryId: 'japan', countryName: 'Japan', stars: 2, x: 890, y: 260, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w2_jp_base', name: 'Kure Naval Port', type: 'military_base', countryId: 'japan', countryName: 'Japan', stars: 2, x: 870, y: 290, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // France (2 Star)
      { id: 'w2_fr_cap', name: 'Paris', type: 'capital', countryId: 'france', countryName: 'France', stars: 2, x: 450, y: 250, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w2_fr_city', name: 'Marseille', type: 'city', countryId: 'france', countryName: 'France', stars: 2, x: 460, y: 280, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // 1 Star Countries
      { id: 'w2_es_cap', name: 'Madrid', type: 'capital', countryId: 'spain', countryName: 'Spain', stars: 1, x: 410, y: 310, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w2_fi_cap', name: 'Helsinki', type: 'capital', countryId: 'finland', countryName: 'Finland', stars: 1, x: 530, y: 130, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w2_tr_cap', name: 'Ankara', type: 'capital', countryId: 'turkey', countryName: 'Turkey', stars: 1, x: 590, y: 310, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w2_br_cap', name: 'Rio de Janeiro', type: 'capital', countryId: 'brazil', countryName: 'Brazil', stars: 1, x: 340, y: 550, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} }
    ],
    connections: [
      // Internal Germany
      { from: 'w2_de_cap', to: 'w2_de_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'w2_de_cap', to: 'w2_de_base', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'w2_de_city', to: 'w2_de_base', barrierName: null, defenseMultiplier: 1.0 },

      // Internal USA
      { from: 'w2_us_cap', to: 'w2_us_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'w2_us_cap', to: 'w2_us_base', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'w2_us_city', to: 'w2_us_base', barrierName: null, defenseMultiplier: 1.0 },

      // Internal USSR
      { from: 'w2_su_cap', to: 'w2_su_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'w2_su_cap', to: 'w2_su_base', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'w2_su_city', to: 'w2_su_base', barrierName: null, defenseMultiplier: 1.0 },

      // Internal UK
      { from: 'w2_uk_cap', to: 'w2_uk_city', barrierName: null, defenseMultiplier: 1.0 },

      // Internal Japan
      { from: 'w2_jp_cap', to: 'w2_jp_base', barrierName: null, defenseMultiplier: 1.0 },

      // Internal France
      { from: 'w2_fr_cap', to: 'w2_fr_city', barrierName: null, defenseMultiplier: 1.0 },

      // Global Connections
      // UK to USA
      { from: 'w2_uk_city', to: 'w2_us_city', barrierName: null, defenseMultiplier: 1.0 },
      // USA to Japan
      { from: 'w2_us_base', to: 'w2_jp_base', barrierName: 'Bering Strait', defenseMultiplier: 1.3 },
      // USA to Brazil
      { from: 'w2_us_cap', to: 'w2_br_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Brazil to Spain
      { from: 'w2_br_cap', to: 'w2_es_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Spain to France
      { from: 'w2_es_cap', to: 'w2_fr_city', barrierName: 'Pyrenees Mountains', defenseMultiplier: 1.4 },
      // France to UK
      { from: 'w2_fr_cap', to: 'w2_uk_cap', barrierName: 'English Channel', defenseMultiplier: 1.3 },
      // France to Germany
      { from: 'w2_fr_cap', to: 'w2_de_city', barrierName: 'Maginot Line', defenseMultiplier: 1.5 },
      // Germany to UK
      { from: 'w2_de_base', to: 'w2_uk_cap', barrierName: 'English Channel', defenseMultiplier: 1.3 },
      // Germany to USSR
      { from: 'w2_de_cap', to: 'w2_su_city', barrierName: null, defenseMultiplier: 1.0 },
      // Finland to USSR
      { from: 'w2_fi_cap', to: 'w2_su_base', barrierName: null, defenseMultiplier: 1.0 },
      // Finland to Germany
      { from: 'w2_fi_cap', to: 'w2_de_base', barrierName: null, defenseMultiplier: 1.0 },
      // Germany to Turkey
      { from: 'w2_de_city', to: 'w2_tr_cap', barrierName: 'The Alps', defenseMultiplier: 1.4 },
      // Turkey to USSR
      { from: 'w2_tr_cap', to: 'w2_su_city', barrierName: null, defenseMultiplier: 1.0 },
      // USSR to Japan
      { from: 'w2_su_city', to: 'w2_jp_cap', barrierName: null, defenseMultiplier: 1.0 }
    ]
  },
  {
    id: 'ww1',
    name: 'World War I',
    preamble: 'The year is 1914. A single pistol shot in Sarajevo triggers secret mobilization pacts across Europe. The Great Powers deploy millions of men to the trenches. A war to end all wars begins, defined by static fronts and industrial siege warfare.',
    nodes: [
      // German Empire (3 Star)
      { id: 'w1_ge_cap', name: 'Berlin', type: 'capital', countryId: 'germany', countryName: 'German Empire', stars: 3, x: 500, y: 200, troops: 15, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w1_ge_city', name: 'Ruhr Valley', type: 'city', countryId: 'germany', countryName: 'German Empire', stars: 3, x: 480, y: 220, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w1_ge_base', name: 'Kiel Fortress', type: 'military_base', countryId: 'germany', countryName: 'German Empire', stars: 3, x: 485, y: 175, troops: 12, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // British Empire (3 Star)
      { id: 'w1_be_cap', name: 'London', type: 'capital', countryId: 'uk', countryName: 'British Empire', stars: 3, x: 445, y: 225, troops: 15, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w1_be_city', name: 'Glasgow Ports', type: 'city', countryId: 'uk', countryName: 'British Empire', stars: 3, x: 435, y: 195, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w1_be_base', name: 'Gibraltar Naval Base', type: 'military_base', countryId: 'uk', countryName: 'British Empire', stars: 3, x: 400, y: 330, troops: 12, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // Russian Empire (3 Star)
      { id: 'w1_re_cap', name: 'Petrograd', type: 'capital', countryId: 'russia', countryName: 'Russian Empire', stars: 3, x: 540, y: 140, troops: 15, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w1_re_city', name: 'Moscow', type: 'city', countryId: 'russia', countryName: 'Russian Empire', stars: 3, x: 570, y: 170, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w1_re_base', name: 'Sevastopol Fort', type: 'military_base', countryId: 'russia', countryName: 'Russian Empire', stars: 3, x: 560, y: 220, troops: 12, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // France (2 Star)
      { id: 'w1_fr_cap', name: 'Paris', type: 'capital', countryId: 'france', countryName: 'France', stars: 2, x: 450, y: 250, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w1_fr_city', name: 'Verdun Fortress', type: 'military_base', countryId: 'france', countryName: 'France', stars: 2, x: 465, y: 240, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // Austro-Hungarian Empire (2 Star)
      { id: 'w1_ah_cap', name: 'Vienna', type: 'capital', countryId: 'austria_hungary', countryName: 'Austro-Hungarian Empire', stars: 2, x: 515, y: 235, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w1_ah_city', name: 'Budapest', type: 'city', countryId: 'austria_hungary', countryName: 'Austro-Hungarian Empire', stars: 2, x: 535, y: 245, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // Ottoman Empire (2 Star)
      { id: 'w1_oe_cap', name: 'Constantinople', type: 'capital', countryId: 'ottoman', countryName: 'Ottoman Empire', stars: 2, x: 580, y: 280, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w1_oe_city', name: 'Baghdad', type: 'city', countryId: 'ottoman', countryName: 'Ottoman Empire', stars: 2, x: 620, y: 320, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // 1 Star Countries
      { id: 'w1_it_cap', name: 'Rome', type: 'capital', countryId: 'italy', countryName: 'Italy', stars: 1, x: 495, y: 275, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w1_us_cap', name: 'Washington D.C.', type: 'capital', countryId: 'usa', countryName: 'USA', stars: 1, x: 250, y: 280, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w1_ch_cap', name: 'Bern', type: 'capital', countryId: 'switzerland', countryName: 'Switzerland', stars: 1, x: 475, y: 245, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'w1_be_cap_1', name: 'Brussels', type: 'capital', countryId: 'belgium', countryName: 'Belgium', stars: 1, x: 460, y: 220, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} }
    ],
    connections: [
      // Internal German Empire
      { from: 'w1_ge_cap', to: 'w1_ge_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'w1_ge_cap', to: 'w1_ge_base', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'w1_ge_city', to: 'w1_ge_base', barrierName: null, defenseMultiplier: 1.0 },

      // Internal British Empire
      { from: 'w1_be_cap', to: 'w1_be_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'w1_be_cap', to: 'w1_be_base', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'w1_be_city', to: 'w1_be_base', barrierName: null, defenseMultiplier: 1.0 },

      // Internal Russian Empire
      { from: 'w1_re_cap', to: 'w1_re_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'w1_re_cap', to: 'w1_re_base', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'w1_re_city', to: 'w1_re_base', barrierName: null, defenseMultiplier: 1.0 },

      // Internal France
      { from: 'w1_fr_cap', to: 'w1_fr_city', barrierName: null, defenseMultiplier: 1.0 },

      // Internal Austro-Hungarian Empire
      { from: 'w1_ah_cap', to: 'w1_ah_city', barrierName: null, defenseMultiplier: 1.0 },

      // Internal Ottoman Empire
      { from: 'w1_oe_cap', to: 'w1_oe_city', barrierName: null, defenseMultiplier: 1.0 },

      // Global Connections
      // USA to Britain
      { from: 'w1_us_cap', to: 'w1_be_city', barrierName: null, defenseMultiplier: 1.0 },
      // Britain to Belgium
      { from: 'w1_be_cap', to: 'w1_be_cap_1', barrierName: 'English Channel', defenseMultiplier: 1.3 },
      // Belgium to Germany
      { from: 'w1_be_cap_1', to: 'w1_ge_city', barrierName: null, defenseMultiplier: 1.0 },
      // Belgium to France
      { from: 'w1_be_cap_1', to: 'w1_fr_cap', barrierName: null, defenseMultiplier: 1.0 },
      // France to Germany
      { from: 'w1_fr_city', to: 'w1_ge_city', barrierName: 'Hindenburg Line', defenseMultiplier: 1.5 },
      // France to Switzerland
      { from: 'w1_fr_city', to: 'w1_ch_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Switzerland to Germany
      { from: 'w1_ch_cap', to: 'w1_ge_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Switzerland to Italy
      { from: 'w1_ch_cap', to: 'w1_it_cap', barrierName: 'The Alps', defenseMultiplier: 1.4 },
      // Germany to Austria-Hungary
      { from: 'w1_ge_cap', to: 'w1_ah_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Austria-Hungary to Italy
      { from: 'w1_ah_cap', to: 'w1_it_cap', barrierName: 'The Alps', defenseMultiplier: 1.4 },
      // Austria-Hungary to Russia
      { from: 'w1_ah_city', to: 'w1_re_base', barrierName: null, defenseMultiplier: 1.0 },
      // Russia to Germany
      { from: 'w1_re_city', to: 'w1_ge_base', barrierName: null, defenseMultiplier: 1.0 },
      // Russia to Ottoman Empire
      { from: 'w1_re_base', to: 'w1_oe_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Ottoman Empire to Austria-Hungary
      { from: 'w1_oe_cap', to: 'w1_ah_city', barrierName: null, defenseMultiplier: 1.0 },
      // Gibraltar to Spain/Italy
      { from: 'w1_be_base', to: 'w1_it_cap', barrierName: null, defenseMultiplier: 1.0 }
    ]
  },
  {
    id: 'british_empire',
    name: 'Pax Britannica (Dismantled)',
    preamble: 'The year is 1890. The Sun finally sets. British colonial holdings rebel simultaneously as the global League of Nations dissolves. Great Britain starts as a 3-star empire, but its territories are spread thin across Canada, India, and Australia, while consolidated powers on the continents prepare to overrun them.',
    nodes: [
      // British Empire (3 Star, fragmented!)
      { id: 'br_uk', name: 'British Isles', type: 'capital', countryId: 'uk', countryName: 'British Empire', stars: 3, x: 445, y: 225, troops: 15, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'br_ca', name: 'Canada (Quebec)', type: 'city', countryId: 'uk', countryName: 'British Empire', stars: 3, x: 220, y: 220, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'br_in', name: 'India (Bengal)', type: 'military_base', countryId: 'uk', countryName: 'British Empire', stars: 3, x: 700, y: 320, troops: 12, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // Russian Empire (3 Star)
      { id: 'br_ru_cap', name: 'St. Petersburg', type: 'capital', countryId: 'russia', countryName: 'Russian Empire', stars: 3, x: 540, y: 140, troops: 15, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'br_ru_city', name: 'Moscow', type: 'city', countryId: 'russia', countryName: 'Russian Empire', stars: 3, x: 570, y: 170, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'br_ru_base', name: 'Vladivostok Base', type: 'military_base', countryId: 'russia', countryName: 'Russian Empire', stars: 3, x: 860, y: 160, troops: 12, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // Qing Dynasty (3 Star)
      { id: 'br_cn_cap', name: 'Beijing', type: 'capital', countryId: 'china', countryName: 'Qing Dynasty', stars: 3, x: 800, y: 220, troops: 15, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'br_cn_city', name: 'Canton', type: 'city', countryId: 'china', countryName: 'Qing Dynasty', stars: 3, x: 820, y: 280, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'br_cn_base', name: 'Lhasa Garrison', type: 'military_base', countryId: 'china', countryName: 'Qing Dynasty', stars: 3, x: 740, y: 280, troops: 12, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // French Third Republic (2 Star)
      { id: 'br_fr_cap', name: 'Paris', type: 'capital', countryId: 'france', countryName: 'French Republic', stars: 2, x: 450, y: 250, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'br_fr_city', name: 'Algiers Port', type: 'city', countryId: 'france', countryName: 'French Republic', stars: 2, x: 460, y: 390, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // United States (2 Star)
      { id: 'br_us_cap', name: 'Washington D.C.', type: 'capital', countryId: 'usa', countryName: 'United States', stars: 2, x: 250, y: 280, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'br_us_city', name: 'San Francisco', type: 'city', countryId: 'usa', countryName: 'United States', stars: 2, x: 130, y: 290, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // 1 Star Countries
      { id: 'br_es_cap', name: 'Madrid', type: 'capital', countryId: 'spain', countryName: 'Kingdom of Spain', stars: 1, x: 410, y: 310, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'br_ir_cap', name: 'Tehran', type: 'capital', countryId: 'iran', countryName: 'Qajar Iran', stars: 1, x: 650, y: 290, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'br_th_cap', name: 'Bangkok', type: 'capital', countryId: 'siam', countryName: 'Kingdom of Siam', stars: 1, x: 780, y: 360, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'br_ar_cap', name: 'Buenos Aires', type: 'capital', countryId: 'argentina', countryName: 'Argentina', stars: 1, x: 310, y: 640, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} }
    ],
    connections: [
      // British Empire Internal Links (Open Transit but geographically far)
      { from: 'br_uk', to: 'br_ca', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'br_uk', to: 'br_in', barrierName: null, defenseMultiplier: 1.0 },

      // Russian Empire Internal Links
      { from: 'br_ru_cap', to: 'br_ru_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'br_ru_city', to: 'br_ru_base', barrierName: null, defenseMultiplier: 1.0 },

      // Qing Dynasty Internal Links
      { from: 'br_cn_cap', to: 'br_cn_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'br_cn_cap', to: 'br_cn_base', barrierName: null, defenseMultiplier: 1.0 },

      // French Republic Internal Links
      { from: 'br_fr_cap', to: 'br_fr_city', barrierName: null, defenseMultiplier: 1.0 },

      // United States Internal Links
      { from: 'br_us_cap', to: 'br_us_city', barrierName: null, defenseMultiplier: 1.0 },

      // Global borders & chokepoints
      // UK to France
      { from: 'br_uk', to: 'br_fr_cap', barrierName: 'English Channel', defenseMultiplier: 1.3 },
      // Canada to US D.C.
      { from: 'br_ca', to: 'br_us_cap', barrierName: null, defenseMultiplier: 1.0 },
      // San Francisco to Vladivostok
      { from: 'br_us_city', to: 'br_ru_base', barrierName: 'Bering Strait', defenseMultiplier: 1.3 },
      // San Francisco to Argentina
      { from: 'br_us_city', to: 'br_ar_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Argentina to France Algiers
      { from: 'br_ar_cap', to: 'br_fr_city', barrierName: null, defenseMultiplier: 1.0 },
      // France Algiers to Spain
      { from: 'br_fr_city', to: 'br_es_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Spain to France Paris
      { from: 'br_es_cap', to: 'br_fr_cap', barrierName: 'Pyrenees Mountains', defenseMultiplier: 1.4 },
      // France Paris to Russia
      { from: 'br_fr_cap', to: 'br_ru_city', barrierName: null, defenseMultiplier: 1.0 },
      // Algiers to Iran
      { from: 'br_fr_city', to: 'br_ir_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Iran to Russia
      { from: 'br_ir_cap', to: 'br_ru_city', barrierName: null, defenseMultiplier: 1.0 },
      // Iran to India
      { from: 'br_ir_cap', to: 'br_in', barrierName: null, defenseMultiplier: 1.0 },
      // India to Qing Beijing (Himalayas)
      { from: 'br_in', to: 'br_cn_base', barrierName: 'The Himalayas', defenseMultiplier: 1.6 },
      // India to Siam
      { from: 'br_in', to: 'br_th_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Siam to Qing Canton
      { from: 'br_th_cap', to: 'br_cn_city', barrierName: null, defenseMultiplier: 1.0 },
      // Vladivostok to Beijing
      { from: 'br_ru_base', to: 'br_cn_cap', barrierName: null, defenseMultiplier: 1.0 }
    ]
  },
  {
    id: 'napoleonic',
    name: 'Napoleonic Era',
    preamble: 'The year is 1812. The grand ambition of Napoleon Bonaparte has set all of Europe ablaze. The French Empire reigns supreme, but is surrounded by an uneasy coalition. Britain rules the waves while the Russian winter waits in the East. Official coalitions must form to break the French hegemony.',
    nodes: [
      // French Empire (3 Star, powerful but central!)
      { id: 'nap_fr_cap', name: 'Paris', type: 'capital', countryId: 'france', countryName: 'French Empire', stars: 3, x: 450, y: 250, troops: 15, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'nap_fr_city', name: 'Lyon', type: 'city', countryId: 'france', countryName: 'French Empire', stars: 3, x: 470, y: 270, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'nap_fr_base', name: 'Brest Naval Base', type: 'military_base', countryId: 'france', countryName: 'French Empire', stars: 3, x: 420, y: 250, troops: 12, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // British Empire (3 Star)
      { id: 'nap_uk_cap', name: 'London', type: 'capital', countryId: 'uk', countryName: 'British Empire', stars: 3, x: 445, y: 225, troops: 15, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'nap_uk_city', name: 'Portsmouth Dockyard', type: 'city', countryId: 'uk', countryName: 'British Empire', stars: 3, x: 435, y: 235, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'nap_uk_base', name: 'Gibraltar Garrison', type: 'military_base', countryId: 'uk', countryName: 'British Empire', stars: 3, x: 400, y: 330, troops: 12, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // Russian Empire (3 Star)
      { id: 'nap_ru_cap', name: 'St. Petersburg', type: 'capital', countryId: 'russia', countryName: 'Russian Empire', stars: 3, x: 540, y: 140, troops: 15, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'nap_ru_city', name: 'Moscow', type: 'city', countryId: 'russia', countryName: 'Russian Empire', stars: 3, x: 570, y: 170, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'nap_ru_base', name: 'Sevastopol Fort', type: 'military_base', countryId: 'russia', countryName: 'Russian Empire', stars: 3, x: 560, y: 220, troops: 12, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // Austrian Empire (2 Star)
      { id: 'nap_at_cap', name: 'Vienna', type: 'capital', countryId: 'austria', countryName: 'Austrian Empire', stars: 2, x: 515, y: 235, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'nap_at_city', name: 'Prague', type: 'city', countryId: 'austria', countryName: 'Austrian Empire', stars: 2, x: 505, y: 215, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // Kingdom of Prussia (2 Star)
      { id: 'nap_pr_cap', name: 'Berlin', type: 'capital', countryId: 'prussia', countryName: 'Prussia', stars: 2, x: 500, y: 200, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'nap_pr_city', name: 'Danzig', type: 'city', countryId: 'prussia', countryName: 'Prussia', stars: 2, x: 520, y: 180, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // 1 Star Countries
      { id: 'nap_es_cap', name: 'Madrid', type: 'capital', countryId: 'spain', countryName: 'Spanish Empire', stars: 1, x: 410, y: 310, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'nap_se_cap', name: 'Stockholm', type: 'capital', countryId: 'sweden', countryName: 'Kingdom of Sweden', stars: 1, x: 510, y: 110, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'nap_tr_cap', name: 'Constantinople', type: 'capital', countryId: 'ottoman', countryName: 'Ottoman Empire', stars: 1, x: 580, y: 280, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'nap_us_cap', name: 'Washington D.C.', type: 'capital', countryId: 'usa', countryName: 'United States', stars: 1, x: 250, y: 280, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} }
    ],
    connections: [
      // Internal France
      { from: 'nap_fr_cap', to: 'nap_fr_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'nap_fr_cap', to: 'nap_fr_base', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'nap_fr_city', to: 'nap_fr_base', barrierName: null, defenseMultiplier: 1.0 },

      // Internal Britain
      { from: 'nap_uk_cap', to: 'nap_uk_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'nap_uk_cap', to: 'nap_uk_base', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'nap_uk_city', to: 'nap_uk_base', barrierName: null, defenseMultiplier: 1.0 },

      // Internal Russia
      { from: 'nap_ru_cap', to: 'nap_ru_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'nap_ru_cap', to: 'nap_ru_base', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'nap_ru_city', to: 'nap_ru_base', barrierName: null, defenseMultiplier: 1.0 },

      // Internal Austria
      { from: 'nap_at_cap', to: 'nap_at_city', barrierName: null, defenseMultiplier: 1.0 },

      // Internal Prussia
      { from: 'nap_pr_cap', to: 'nap_pr_city', barrierName: null, defenseMultiplier: 1.0 },

      // Global links
      // USA to Britain
      { from: 'nap_us_cap', to: 'nap_uk_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Britain to France
      { from: 'nap_uk_city', to: 'nap_fr_base', barrierName: 'English Channel', defenseMultiplier: 1.3 },
      // France to Spain
      { from: 'nap_fr_base', to: 'nap_es_cap', barrierName: 'Pyrenees Mountains', defenseMultiplier: 1.4 },
      // Gibraltar to Spain
      { from: 'nap_uk_base', to: 'nap_es_cap', barrierName: null, defenseMultiplier: 1.0 },
      // France to Prussia
      { from: 'nap_fr_cap', to: 'nap_pr_cap', barrierName: null, defenseMultiplier: 1.0 },
      // France to Austria
      { from: 'nap_fr_city', to: 'nap_at_city', barrierName: 'The Alps', defenseMultiplier: 1.4 },
      // Prussia to Russia
      { from: 'nap_pr_city', to: 'nap_ru_city', barrierName: null, defenseMultiplier: 1.0 },
      // Austria to Russia
      { from: 'nap_at_cap', to: 'nap_ru_base', barrierName: null, defenseMultiplier: 1.0 },
      // Austria to Turkey
      { from: 'nap_at_cap', to: 'nap_tr_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Turkey to Russia
      { from: 'nap_tr_cap', to: 'nap_ru_base', barrierName: null, defenseMultiplier: 1.0 },
      // Sweden to Russia
      { from: 'nap_se_cap', to: 'nap_ru_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Sweden to Prussia
      { from: 'nap_se_cap', to: 'nap_pr_city', barrierName: null, defenseMultiplier: 1.0 }
    ]
  },
  {
    id: 'roman',
    name: 'Roman Times',
    preamble: 'The year is 117 AD. The Roman Empire reaches its absolute zenith under Emperor Trajan. But boundaries are heavily pressured: the legions line the Rhine, Hadrian builds his wall in the north, and Parthia rises in the East. Civil war is brewing, and rival factions must form alliances to seize the throne.',
    nodes: [
      // Roman Empire (3 Star, massive but stretched)
      { id: 'rom_it_cap', name: 'Rome', type: 'capital', countryId: 'rome', countryName: 'Roman Empire', stars: 3, x: 495, y: 275, troops: 15, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'rom_it_city', name: 'Byzantium', type: 'city', countryId: 'rome', countryName: 'Roman Empire', stars: 3, x: 575, y: 275, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'rom_it_base', name: 'Castra Regina base', type: 'military_base', countryId: 'rome', countryName: 'Roman Empire', stars: 3, x: 500, y: 220, troops: 12, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // Carthage (3 Star)
      { id: 'rom_ca_cap', name: 'Carthage', type: 'capital', countryId: 'carthage', countryName: 'Carthage', stars: 3, x: 460, y: 340, troops: 15, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'rom_ca_city', name: 'Leptis Magna', type: 'city', countryId: 'carthage', countryName: 'Carthage', stars: 3, x: 490, y: 380, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'rom_ca_base', name: 'New Carthage Fort', type: 'military_base', countryId: 'carthage', countryName: 'Carthage', stars: 3, x: 400, y: 330, troops: 12, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // Parthian Empire (3 Star)
      { id: 'rom_pa_cap', name: 'Ctesiphon', type: 'capital', countryId: 'parthia', countryName: 'Parthian Empire', stars: 3, x: 670, y: 310, troops: 15, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'rom_pa_city', name: 'Babylon', type: 'city', countryId: 'parthia', countryName: 'Parthian Empire', stars: 3, x: 660, y: 330, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'rom_pa_base', name: 'Hecatompylos base', type: 'military_base', countryId: 'parthia', countryName: 'Parthian Empire', stars: 3, x: 720, y: 300, troops: 12, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // Ptolemaic Egypt (2 Star)
      { id: 'rom_eg_cap', name: 'Alexandria', type: 'capital', countryId: 'egypt', countryName: 'Ptolemaic Egypt', stars: 2, x: 560, y: 360, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'rom_eg_city', name: 'Thebes', type: 'city', countryId: 'egypt', countryName: 'Ptolemaic Egypt', stars: 2, x: 570, y: 410, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // Seleucid Empire (2 Star)
      { id: 'rom_sl_cap', name: 'Antioch', type: 'capital', countryId: 'seleucid', countryName: 'Seleucid Empire', stars: 2, x: 610, y: 300, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'rom_sl_city', name: 'Seleucia', type: 'city', countryId: 'seleucid', countryName: 'Seleucid Empire', stars: 2, x: 640, y: 310, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // Gaul (2 Star)
      { id: 'rom_ga_cap', name: 'Lutetia', type: 'capital', countryId: 'gaul', countryName: 'Gaul', stars: 2, x: 450, y: 220, troops: 10, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'rom_ga_city', name: 'Massilia', type: 'city', countryId: 'gaul', countryName: 'Gaul', stars: 2, x: 460, y: 250, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },

      // 1 Star Countries
      { id: 'rom_br_cap', name: 'Londinium', type: 'capital', countryId: 'britannia', countryName: 'Britannia', stars: 1, x: 435, y: 210, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'rom_ge_cap', name: 'Magna Germania', type: 'capital', countryId: 'germania', countryName: 'Germanic Tribes', stars: 1, x: 490, y: 190, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'rom_am_cap', name: 'Artaxata', type: 'capital', countryId: 'armenia', countryName: 'Armenia', stars: 1, x: 620, y: 260, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} },
      { id: 'rom_ib_cap', name: 'Numantia', type: 'capital', countryId: 'iberia', countryName: 'Iberia', stars: 1, x: 390, y: 290, troops: 8, ownerId: null, isFortified: false, vulnerableUntil: null, scoutedBy: {} }
    ],
    connections: [
      // Internal Rome
      { from: 'rom_it_cap', to: 'rom_it_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'rom_it_cap', to: 'rom_it_base', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'rom_it_city', to: 'rom_it_base', barrierName: null, defenseMultiplier: 1.0 },

      // Internal Carthage
      { from: 'rom_ca_cap', to: 'rom_ca_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'rom_ca_cap', to: 'rom_ca_base', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'rom_ca_city', to: 'rom_ca_base', barrierName: null, defenseMultiplier: 1.0 },

      // Internal Parthia
      { from: 'rom_pa_cap', to: 'rom_pa_city', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'rom_pa_cap', to: 'rom_pa_base', barrierName: null, defenseMultiplier: 1.0 },
      { from: 'rom_pa_city', to: 'rom_pa_base', barrierName: null, defenseMultiplier: 1.0 },

      // Internal Egypt
      { from: 'rom_eg_cap', to: 'rom_eg_city', barrierName: null, defenseMultiplier: 1.0 },

      // Internal Seleucid
      { from: 'rom_sl_cap', to: 'rom_sl_city', barrierName: null, defenseMultiplier: 1.0 },

      // Internal Gaul
      { from: 'rom_ga_cap', to: 'rom_ga_city', barrierName: null, defenseMultiplier: 1.0 },

      // Global links
      // Britannia to Gaul (English Channel)
      { from: 'rom_br_cap', to: 'rom_ga_cap', barrierName: "Hadrian's Wall", defenseMultiplier: 1.5 },
      // Britannia to Germania
      { from: 'rom_br_cap', to: 'rom_ge_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Gaul to Iberia
      { from: 'rom_ga_city', to: 'rom_ib_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Iberia to Rome
      { from: 'rom_ib_cap', to: 'rom_it_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Iberia to Carthage Base
      { from: 'rom_ib_cap', to: 'rom_ca_base', barrierName: null, defenseMultiplier: 1.0 },
      // Carthage Base to Carthage Cap
      { from: 'rom_ca_base', to: 'rom_ca_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Carthage Cap to Rome
      { from: 'rom_ca_cap', to: 'rom_it_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Carthage City to Egypt
      { from: 'rom_ca_city', to: 'rom_eg_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Egypt to Seleucid
      { from: 'rom_eg_cap', to: 'rom_sl_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Seleucid to Parthia
      { from: 'rom_sl_city', to: 'rom_pa_city', barrierName: null, defenseMultiplier: 1.0 },
      // Parthia to Armenia
      { from: 'rom_pa_cap', to: 'rom_am_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Armenia to Rome City
      { from: 'rom_am_cap', to: 'rom_it_city', barrierName: null, defenseMultiplier: 1.0 },
      // Rome City to Seleucid Cap
      { from: 'rom_it_city', to: 'rom_sl_cap', barrierName: null, defenseMultiplier: 1.0 },
      // Rome Base to Germania
      { from: 'rom_it_base', to: 'rom_ge_cap', barrierName: 'Rhine River', defenseMultiplier: 1.3 },
      // Germania to Gaul
      { from: 'rom_ge_cap', to: 'rom_ga_cap', barrierName: null, defenseMultiplier: 1.0 }
    ]
  }
];
