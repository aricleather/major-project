// With sketchClasses.js, actually creates all the objects necessary for game function

// Global button declarations
let titleStartButton, titleOptionsButton;

// Global image object, image button and image spinner declarations
let mainCookie;
let openShopButton, closeShopButton;
let cookieSpinner;

// Global shop Object declarations
let bakeryObj, ovenObj, factoryObj;
let shopItems;

// Global scroll bar declarations
let shopScrollBar;

// Global dialog object declarations
let returnToMenuDialog;

// Global vars used for initializing objects
let shopNumber = 0;
let shopWeaponNumber = 0;
let achievementNumber = 0;

let spawners;

let playerInventory = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]];

// Generate all game objects
function initObjects() {
  // Buttons
  titleNewGameButton = new Button(width / 2, height / 2, scalars.menuButtonW, scalars.menuButtonH, 1, "New Game", function() {
    buttonSelect1.play();
    // gameState = 1; // Defines "start" menu button, on click switches to gameState 1 (mainGame())
  });
  titleOptionsButton = new Button(width / 2, height * 0.62, scalars.menuButtonW, scalars.menuButtonH, 0, "Options", function() { // Options button on main menu
    gameState = 2; // Defines "options" menu button, on click switches to gameState 2 (mainGame())
  });
  titleLoadButton = new Button(width / 2, height / 2, scalars.menuButtonW, scalars.menuButtonH, 0, "Load Game", function() {
    gameState = 1;
  });
  optionsDeleteDataButton = new Button(width / 2, height * 0.5, scalars.menuButtonW, scalars.menuButtonH * 1.5, 0, "Delete Data", function() {
    newDialogBox(deleteDataDialog);
  });

  // Image objects
  // Main cookie object. On click, cookieIncrement() and increase width and height of cookie to create popping animation
  // The extended run of this object refers to scalars.mainCookieScalar to complete popping animation
  mainCookie = new ImageObject(width / 2, height / 2, scalars.mainCookieScalar, scalars.mainCookieScalar, cookie, 
    function() {
      cookieIncrement();
      this.width = 1.15 * this.width;
      this.height = 1.15 * this.height;
    },
    function() {
      this.width -= 1/10 * (this.width - scalars.mainCookieScalar);
      this.height -= 1/10 * (this.height - scalars.mainCookieScalar);
      this.width = constrain(this.width, scalars.mainCookieScalar, scalars.mainCookieScalar * 1.25);
      this.height = constrain(this.height, scalars.mainCookieScalar, scalars.mainCookieScalar * 1.25);
    });

  // Image buttons
  openShopButton = new ImageButton(width * 0.97, height * 0.105, scalars.storeCoinScalar, scalars.storeCoinScalar, 0, coin, function() {
    shopState = 1;
  }, 1.05, "Open Shop");
  closeShopButton = new ImageButton(width * 0.67, height * 0.105, scalars.storeCloseScalar, scalars.storeCloseScalar, 0, rightArrow, function() {
    shopState = 0;
  }, 1.05, "Close Shop");
  openAchievementsButton = new ImageButton(width * 0.03, height * 0.105, scalars.openAchievementsScalar, scalars.openAchievementsScalar, 0, goldStar, function() {
    achievementState = 1;
  }, 1.05, "");
  closeAchievementsButton = new ImageButton(width * 0.33, height * 0.105, scalars.closeAchievementsScalar, scalars.closeAchievementsScalar, 0, leftArrow, function() {
    achievementState = 0;
  }, 1.05, "Close");
  inventoryOpenButton = new ImageButton(width * 0.97, height * 0.305, scalars.inventoryOpenScalar, scalars.inventoryOpenScalar, 1, inventoryButton, function() {
    let tempId = openWindowIdCounter.val;
    openWindows.set(tempId, new BackgroundBox(width / 2, height * 0.22, 400, 200, tempId, [63, 102, 141, 200], 1, "click"));
    spawners.playerInventory.call(openWindows.get(tempId));
  }, 1.05, "Items");
  miniGamesButton = new ImageButton(width * 0.97, height * 0.505, scalars.inventoryOpenScalar, scalars.inventoryOpenScalar, 0, minigameIcon, function() {
    let tempId = openWindowIdCounter.val;
    openWindows.set(tempId, new BackgroundBox(width / 2, height * 0.22, 400, 200, tempId, [63, 102, 141, 200], 1, "click"));
    spawners.minigames.call(openWindows.get(tempId));
  }, 1.05, "Minigames");

  // Tab buttons
  autoCookiesTab = new TabButton(width * 0.775, height * 0.975, width * 0.15, height * 0.05, function() {
    shopTab = 1;
  }, [83, 140, 198], "Cookies");
  weaponsTab = new TabButton(width * 0.925, height * 0.975, width * 0.15, height * 0.05, function() {
    shopTab = 2;
  }, [214, 41, 41], "Weapons");

  cookieSpinner = new SpinImage(width / 2, height / 2, 500, 500, coin, 60);

  // Scroll bars for shop
  shopScrollBar = new ScrollBar(width * 0.995, 0, width * 0.01, 7, height * 0.95);
  shopWeaponScrollBar = new ScrollBar(width * 0.995, 0, width * 0.01, 7, height * 0.95);

  // Shop Objects
  ovenObj = new ShopObject(oven.width, oven.height, oven, "Oven", "Bake more cookies!", 5, 0.1);
  bakeryObj = new ShopObject(bakery.width, bakery.height, bakery, "Bakery", "Mmm, smells good...", 150, 1);
  factoryObj = new ShopObject(factory.width, factory.height, factory, "Factory", "Autonomous cookie production.", 500, 5);
  shopItems = [ovenObj, bakeryObj, factoryObj];

  // Shop weapon objects
  woodenSwordObj = new ShopWeaponObject(woodenSword, "Wooden Sword", "Breaks easily, but leaves splinters.", 100, 5, "Attack");
  stoneAxeObj = new ShopWeaponObject(stoneAxe, "Stone Axe", "Packs a heavy punch while remaining durable.", 1000, 20, "Attack");

  // Dialog objects
  returnToMenuDialog = new DialogBox("Go back to main menu?", 1, "Yes", "No", function() {
    gameState = 0;
    saveGame();
    loadSaveFile();
    if(window.localStorage.length === 0) {
      startAnimation("titleScreenAnimation1");
    }
  },
  function() {
    void 0;
  });
  deleteDataDialog = new DialogBox("Really delete all data?", 1, "Yes", "No", function() {
    resetGame();
    loadSaveFile();
  },
  function() {
    void 0;
  });

  // Global messages

  // Exp bars
  playerExpBar = new ExperienceBar(width * 0.25 + 16 * (width * 0.15 / 20), height * 0.02, width * 0.4, height * 0.02, 0, 10);



  spawners = {
    playerInventory: function() {
      this.contentToRun.push(new InventoryScreen(width / 2, height * 0.22, 400, 200, this.id, 1, playerInventory));
    },
    minigames: function() {
      this.contentToRun.push(new ImageButton(this.x - this.width / 4, this.y - this.height / 4, this.width / 8, this.width / 8, this.priority, minigameIcon, function() {
        let tempId = openWindowIdCounter.val;
        openWindows.set(tempId, new BackgroundBox(width / 2, height * 0.3, 800, 400, tempId, [63, 102, 141, 250], this.priority + 1, "click"));
        spawners.memoryPuzzle.call(openWindows.get(tempId));
      }, 1.05, "Memory Game"));
      this.contentToRun.push(new ImageButton(this.x, this.y - this.height / 4, this.width / 8, this.width / 8, this.priority, minigameIcon, function() {
        let tempId = openWindowIdCounter.val;
        openWindows.set(tempId, new BackgroundBox(width / 2, height * 0.3, 800, 400, tempId, [63, 102, 141, 250], this.priority + 1, "click"));
        spawners.rhythmGame.call(openWindows.get(tempId));
      }, 1.05, "Rhythm Game"));
      this.contentToRun.push(new ImageButton(this.x + this.width / 4, this.y - this.height / 4, this.width / 8, this.width / 8, this.priority, cookie, function() {
        cookies += 10000;
        autoCookies += 100;
      }, 1.05, "Teacher Button"));
    },
    memoryPuzzle: function() {
      this.contentToRun.push(new MemoryPuzzle(this.x, this.y, this.width, this.height, this.priority));
    },
    rhythmGame: function() {
      this.contentToRun.push(new RhythmGame(this.x, this.y, this.width, this.height, this.priority));
    },
    inventoryContextMenu: function() {
      // In order to pass more than one function into one of these buttons and still use bind to call
      // a function of parent, they can be assigned temporary variables then placed inside an anon. function
      let moveButtonFunction = this.parent.mousePickUpItem.bind(this.parent, 0);
      let upgradeButtonFunction = this.parent.openUpgradeMenu.bind(this.parent, 0);
      let infoButtonFunction = this.parent.openInfoMenu.bind(this.parent, 0);

      // This function accesses the id of the context menu stored inside of the inventory screen and causes it to close
      let closeContextFunction = function() {
        openWindows.get(this.contextId).close = true;
      }.bind(this.parent, 0);

      this.contentToRun.push(new Button(this.x, this.y - this.height * 2/6, this.width, this.height / 3, this.priority, "Info", function() {
        infoButtonFunction();
        closeContextFunction();
      }));
      this.contentToRun.push(new Button(this.x, this.y, this.width, this.height / 3, this.priority, "Move", function () {
        moveButtonFunction();
        closeContextFunction();
      }, 0));
      this.contentToRun.push(new Button(this.x, this.y + this.height * 2/6, this.width, this.height / 3, this.priority, "Upgrade", function() {
        upgradeButtonFunction();
        closeContextFunction();
      }, 0));
    },
    inventoryUpgradeMenu: function() {
      this.contentToRun.push(new UpgradeMenu(this.x, this.y, this.width, this.height, this.priority, 
        this.parent.itemArr[this.parent.clickedItemCoords[0]][this.parent.clickedItemCoords[1]]));
    },
    inventoryInfoMenu: function() {
      this.contentToRun.push(new ItemInfoMenu(this.x, this.y, this.width, this.height, this.priority, 
        this.parent.itemArr[this.parent.clickedItemCoords[0]][this.parent.clickedItemCoords[1]]));
    },
  };

}

// Called when window resized to properly resize all game objects
function resizeObjects() {
  // Image objects
  mainCookie.resize(width / 2, height / 2, scalars.mainCookieScalar, scalars.mainCookieScalar);

  // Image buttons
  openShopButton.resize(width * 0.97, height * 0.105, scalars.storeCoinScalar, scalars.storeCoinScalar);
  closeShopButton.resize(width * 0.67, height * 0.105, scalars.storeCloseScalar, scalars.storeCloseScalar);
  openAchievementsButton.resize(width * 0.03, height * 0.105, scalars.openAchievementsScalar, scalars.openAchievementsScalar);
  closeAchievementsButton.resize(width * 0.33, height * 0.105, scalars.closeAchievementsScalar, scalars.closeAchievementsScalar);
  inventoryOpenButton.resize(width * 0.97, height * 0.305, scalars.inventoryOpenScalar, scalars.inventoryOpenScalar);
  miniGamesButton.resize(width * 0.97, height * 0.505, scalars.inventoryOpenScalar, scalars.inventoryOpenScalar);

  // Buttons
  titleNewGameButton.resize(width / 2, height / 2, scalars.menuButtonW, scalars.menuButtonH);
  titleOptionsButton.resize(width / 2, height * 0.62, scalars.menuButtonW, scalars.menuButtonH);
  titleLoadButton.resize(width / 2, height / 2, scalars.menuButtonW, scalars.menuButtonH);
  optionsDeleteDataButton.resize(width / 2, height / 2, scalars.menuButtonW, scalars.menuButtonH * 1.5);

  // Shop objects get resized with no params, taken care of by their resize function
  ovenObj.resize();
  bakeryObj.resize();
  factoryObj.resize();
  woodenSwordObj.resize();
  stoneAxeObj.resize();

  // Same with achievements
  achievements.clicks.obj.resize();
  
  // Tab buttons (shop tabs)
  autoCookiesTab.resize(width * 0.775, height * 0.975, width * 0.15, height * 0.05);
  weaponsTab.resize(width * 0.925, height * 0.975, width * 0.15, height * 0.05);

  // Scroll bars
  shopScrollBar.resize(width * 0.995, 0, width * 0.01, height * 0.95);
  shopWeaponScrollBar.resize(width * 0.995, 0, width * 0.01, height * 0.95);

  // Dialog objects
  returnToMenuDialog.resize();
  deleteDataDialog.resize();


  // Exp bars
  playerExpBar.resize(width * 0.25 + 16 * (width * 0.15 / 20), height * 0.02, width * 0.4, height * 0.02);

  // playerInventory.resize(width / 2, height * 0.22, 400);
}

