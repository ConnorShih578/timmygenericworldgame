// Realistic geographical shapes for countries to draw high quality world borders
export interface CountryPath {
  id: string;
  name: string;
  d: string; // SVG path string
}

export const COUNTRY_PATHS: CountryPath[] = [
  // NORTH AMERICA
  {
    id: 'usa',
    name: 'United States',
    d: 'M 115 175 C 150 170, 260 165, 315 172 C 345 220, 335 275, 325 295 C 295 310, 275 345, 275 365 C 245 350, 230 330, 205 325 C 150 310, 110 260, 115 175 Z'
  },
  {
    id: 'britannia',
    name: 'Britannia',
    d: 'M 432 175 C 445 160, 458 170, 455 195 C 442 215, 435 200, 432 175 Z'
  },
  {
    id: 'canada',
    name: 'Canada',
    d: 'M 65 95 C 120 75, 250 65, 330 85 C 345 140, 315 170, 270 170 C 180 165, 110 170, 65 95 Z'
  },
  {
    id: 'thirteen_colonies',
    name: 'Thirteen Colonies',
    d: 'M 265 180 C 290 185, 320 210, 315 285 C 295 290, 275 240, 265 180 Z'
  },
  {
    id: 'mexico',
    name: 'Mexico',
    d: 'M 135 295 C 200 320, 245 340, 275 375 C 265 410, 230 400, 180 345 Z'
  },
  {
    id: 'aztec',
    name: 'Aztec Empire',
    d: 'M 160 310 C 220 330, 260 360, 250 400 C 210 390, 175 350, 160 310 Z'
  },

  // SOUTH AMERICA
  {
    id: 'brazil',
    name: 'Brazil',
    d: 'M 260 435 C 310 425, 365 450, 395 510 C 385 585, 340 625, 305 605 C 275 540, 260 480, 260 435 Z'
  },
  {
    id: 'argentina',
    name: 'Argentina',
    d: 'M 275 540 C 310 565, 325 615, 305 665 C 285 665, 270 595, 275 540 Z'
  },
  {
    id: 'incan',
    name: 'Incan Empire',
    d: 'M 245 425 C 265 440, 270 520, 265 560 C 250 540, 240 470, 245 425 Z'
  },

  // EUROPE / WESTERN EURASIA
  {
    id: 'france',
    name: 'France',
    d: 'M 440 215 C 465 205, 480 215, 475 250 C 455 265, 440 250, 440 215 Z'
  },
  {
    id: 'germany',
    name: 'Germany',
    d: 'M 475 195 C 510 190, 520 210, 515 240 C 485 245, 475 225, 475 195 Z'
  },
  {
    id: 'germania',
    name: 'Germania',
    d: 'M 470 185 C 525 180, 535 210, 520 245 C 480 245, 470 215, 470 185 Z'
  },
  {
    id: 'spain',
    name: 'Spain',
    d: 'M 415 245 C 445 240, 450 265, 440 290 C 410 290, 405 265, 415 245 Z'
  },
  {
    id: 'rome',
    name: 'Roman Republic',
    d: 'M 435 240 C 495 225, 520 260, 515 295 C 465 315, 430 285, 435 240 Z'
  },
  {
    id: 'roman_empire',
    name: 'Roman Empire',
    d: 'M 415 210 C 510 195, 570 240, 560 315 C 480 325, 410 285, 415 210 Z'
  },
  {
    id: 'russia',
    name: 'Russia',
    d: 'M 535 120 C 650 100, 850 85, 940 115 C 930 205, 750 225, 545 210 Z'
  },
  {
    id: 'russian_empire',
    name: 'Russian Empire',
    d: 'M 525 110 C 660 90, 880 75, 950 105 C 940 215, 740 230, 535 215 Z'
  },
  {
    id: 'ussr',
    name: 'Soviet Union',
    d: 'M 530 110 C 670 90, 890 75, 950 110 C 930 220, 740 235, 530 215 Z'
  },

  // MIDDLE EAST & AFRICA
  {
    id: 'egypt',
    name: 'Egypt',
    d: 'M 535 305 C 570 300, 595 305, 590 355 C 555 355, 535 340, 535 305 Z'
  },
  {
    id: 'carthage',
    name: 'Carthage',
    d: 'M 445 295 C 495 290, 525 300, 520 330 C 475 330, 440 315, 445 295 Z'
  },
  {
    id: 'ottoman',
    name: 'Ottoman Empire',
    d: 'M 510 245 C 595 235, 625 285, 605 345 C 535 350, 505 295, 510 245 Z'
  },
  {
    id: 'persian_empire',
    name: 'Persian Empire',
    d: 'M 585 255 C 655 245, 685 285, 670 340 C 605 350, 575 300, 585 255 Z'
  },
  {
    id: 'south_africa',
    name: 'South Africa',
    d: 'M 515 540 C 555 540, 570 575, 545 635 C 510 635, 500 585, 515 540 Z'
  },

  // ASIA & OCEANIA
  {
    id: 'china',
    name: 'China',
    d: 'M 685 215 C 785 200, 855 235, 840 345 C 760 365, 675 315, 685 215 Z'
  },
  {
    id: 'mongol_empire',
    name: 'Mongol Empire',
    d: 'M 565 140 C 745 125, 895 155, 875 315 C 725 345, 555 265, 565 140 Z'
  },
  {
    id: 'han_dynasty',
    name: 'Han Dynasty',
    d: 'M 695 225 C 795 210, 845 245, 830 335 C 750 355, 685 305, 695 225 Z'
  },
  {
    id: 'india',
    name: 'India',
    d: 'M 645 295 C 705 285, 735 330, 715 415 C 675 415, 635 365, 645 295 Z'
  },
  {
    id: 'maurya',
    name: 'Mauryan Empire',
    d: 'M 625 275 C 715 265, 745 320, 725 405 C 665 410, 615 355, 625 275 Z'
  },
  {
    id: 'mughal',
    name: 'Mughal Empire',
    d: 'M 635 270 C 715 260, 740 315, 720 400 C 660 405, 620 350, 635 270 Z'
  },
  {
    id: 'japan',
    name: 'Japan',
    d: 'M 865 215 C 885 205, 895 245, 875 285 C 855 275, 855 235, 865 215 Z'
  },
  {
    id: 'australia',
    name: 'Australia',
    d: 'M 805 480 C 895 465, 945 525, 915 625 C 835 635, 795 565, 805 480 Z'
  }
];

// High-detail world continent base paths for background realistic landmasses
export const DETAILED_CONTINENTS = [
  // NORTH AMERICA & GREENLAND
  {
    name: 'North America',
    d: 'M 50 110 C 90 70, 220 50, 340 70 C 400 40, 440 70, 390 135 C 340 160, 320 220, 335 280 C 310 320, 270 360, 270 415 C 240 410, 210 370, 160 330 C 110 310, 100 240, 115 170 C 80 160, 40 140, 50 110 Z'
  },
  // SOUTH AMERICA
  {
    name: 'South America',
    d: 'M 250 420 C 310 405, 375 435, 395 510 C 385 595, 330 670, 300 675 C 275 675, 260 580, 245 480 C 240 440, 245 425, 250 420 Z'
  },
  // EUROPE
  {
    name: 'Europe',
    d: 'M 410 240 C 420 180, 475 140, 530 110 C 600 110, 620 190, 560 250 C 510 290, 440 295, 410 240 Z'
  },
  // AFRICA
  {
    name: 'Africa',
    d: 'M 420 300 C 510 290, 600 300, 630 390 C 600 480, 560 635, 510 630 C 460 610, 430 460, 415 370 C 410 330, 415 310, 420 300 Z'
  },
  // ASIA & SIBERIA
  {
    name: 'Asia',
    d: 'M 545 110 C 720 80, 930 70, 960 140 C 950 250, 875 370, 770 380 C 680 375, 600 320, 545 110 Z'
  },
  // AUSTRALIA & OCEANIA
  {
    name: 'Australia',
    d: 'M 795 470 C 885 455, 945 510, 925 615 C 845 635, 785 570, 795 470 Z'
  }
];
