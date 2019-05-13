let weaponUpgradeData = {
  woodenSword: {
    maxLevel: 6,
    price: {
      // 1 means price to upgrade from level 1 to level 2
      1: 200,
      2: 300,
      3: 400,
      4: 500,
      5: 1000,
    },
    damage: {
      // 1 means damage at level 1 (same with durability)
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 7,
    },
    durability: {
      1: 10,
      2: 10,
      3: 10,
      4: 10,
      5: 15,
      6: 15,
    }
  },
  stoneAxe: {
    maxLevel: 10,
    price: {
      1: 1250,
      2: 1500,
      3: 1750,
      4: 2000,
      5: 3000,
      6: 4000,
      7: 5000,
      8: 7500,
      9: 10000,
    },
    damage: {
      1: 5,
      2: 7,
      3: 9,
      4: 11,
      5: 14,
      6: 17,
      7: 20,
      8: 23,
      9: 26,
      10: 40,
    },
    durability: {
      1: 50,
      2: 50,
      3: 50,
      4: 50,
      5: 65,
      6: 65,
      7: 65,
      8: 70,
      9: 70,
      10: 80,
    }
  },
};