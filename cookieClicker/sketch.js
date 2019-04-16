// State Variables Assignment
// Aric Leather
// Date: March 25, 2019
// 
// State variables: my game has many state variables. Examples include: gameState (main game, main menu, options menu),
// shopState (is the shop open or not in mainGame), animationState (my game has an intro animation and will have more, dictates current animation)
//
// Extra for Experts:
// - My game incorporates sound effects
// - My game successfully utilizes class notation pretty much everywhere
// - I have experimented with my index.html (see style.css and my p5_loading div for preLoad())
// - My game successfully utilizes window.localStorage to load, save, and clear saved data

window.onbeforeunload = saveGame;

let playerName;
let playerLevel = 1;
let playerExpToNextLevel = [10, 20, 40, 80];

let currentInv = null;

let saveFile;
let gMouseToggle = {
  _val: 0,
  _bound: 0,

  set val(x) {
    this._val = x;
    if(this._val) {
      gMouseControl(false);
    }
  },
  set bound(x) {
    this._bound = x > this._bound ? x : this._bound;
  },
  end: function() {
    this._bound = 0;
  },
  get val() {
    return this._val;
  },
  get bound() {
    return this._bound;
  },
};
let gMouse = 0;
let currentDialog = [];
let input = null;

function gMouseControl(end) {
  // This function exists so that gMouseToggle can be called at any time in draw loop and
  // still block clicks. gMouseControl is run at end of draw loop so that if anything 
  // sets gMouseToggle to true, gMouse will also be true at end of draw loop, blocking clicks
  if(gMouseToggle.val && !end) {
    // If something toggles two different priorities, always keep the higher
    gMouse = gMouseToggle.val > gMouse ? gMouseToggle.val : gMouse;
    console.log("Non-end: ", gMouse);
  }

  if(!mouseIsPressed) {
    gMouse = gMouseToggle.bound;
  }
  if(end) {
    gMouseToggle.end();
  }
}

function newInput(whichInput, x, y, width, height) {
  if(whichInput === "text") {
    input = new TextInput(x, y, width, height);
  }
}

function cookieIncrement() {
  // Increment cookie counter on click and begin "popping" animation
  cookies += clickPower;
  clicks++;
  popSound.play();
  updateAchievements();
  // newFallingCookie();
}

// Load content used in game
let cookie, coin, oven, bakery, factory, rightArrow, gameCursor, clickUpgrade, goldStar; // Images
let coinSound, popSound, textBlip; // Sounds
let gameFont; // Fonts

// Position / scaling variables
let scalars; // Scalars used throughout code definied in initScalars()
let cookieGetAlpha; // Alpha / transparency values
let messageAlpha = 0; 
let cookieGetX, cookieGetY; // Position values
let cookiesFalling = [];

// Game states:
let gameState = 0;
let shopState = 0;
let shopTab = 1;
let achievementState = 0;

// Clicker game variables:
let cookies = 0;
let autoCookies = 0;
let clickPower = 1;
let lastMillis = 0;
let increments = 0;
let clicks = 0;

// Variables used for menu()
let titleText = "Cookie Clicker"; // strings
let hoverFillStart = 200;         // button rectangle fills
let hoverFillOptions = 200;

// variables used for shop()

let cookieGetText;
let tempText;

function preload() {
  // Images
  cookie = loadImage("assets/cookie1.png");
  coin = loadImage("assets/coin.png");
  oven = loadImage("assets/oven.png");
  rightArrow = loadImage("assets/rightarrow.png");
  leftArrow = loadImage("assets/leftarrow.png");
  gameCursor = loadImage("assets/cursor.png");
  bakery = loadImage("assets/bakery.png");
  factory = loadImage("assets/factory.png");
  clickUpgrade = loadImage("assets/clickUpgrade.png");
  goldStar = loadImage("assets/goldStar.png");
  woodenSword = loadImage("assets/woodenSword.png");
  inventoryButton = loadImage("assets/invButton.png");

  // Sounds and fonts
  gameFont = loadFont("assets/gameFont.ttf");
  coinSound = loadSound("assets/coinSound.wav");
  popSound = loadSound("assets/pop.ogg");
  expGainSound = loadSound("assets/expGain.wav");
  textBlip = loadSound("assets/textBlip.wav");
  keyType1 = loadSound("assets/keyType1.wav");
  keyType2 = loadSound("assets/keyType2.wav");
  buttonSelect1 = loadSound("assets/buttonSelect1.wav");
  errorSound = loadSound("assets/error.wav");
  purchaseSound = loadSound("assets/purchase.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(gameFont); // Font used throughout whole game
  imageMode(CENTER);
  initScalarsPositions();
  initObjects();

  angleMode(DEGREES);
  loadSaveFile();
  if(window.localStorage.length === 0) {
    startAnimation("titleScreenAnimation1");
  }
  initAchievements();

  coinSound.setVolume(0.08);
  popSound.setVolume(0.15);
  textBlip.setVolume(0.1);
  keyType1.setVolume(0.2);
  keyType2.setVolume(0.2);
  buttonSelect1.setVolume(0.8);
  expGainSound.setVolume(0.25);
}

function loadSaveFile() {
  if(window.localStorage.length === 0) {
    void 0;
  }
  else {
    // As long as a save game exists, take data from window.localStorage and import it
    cookies = int(window.localStorage.getItem("cookies"));
    autoCookies = float(window.localStorage.getItem("autoCookies"));
    clicks = int(window.localStorage.getItem("clicks"));
    playerName = window.localStorage.getItem("playerName");
    playerLevel = window.localStorage.getItem("playerLevel");
    playerExpBar.exp = int(window.localStorage.getItem("playerExp")) || 0;
    playerExpBar.expToNextLevel = int(playerExpToNextLevel[playerLevel - 1]);
    ovenObj.saveLoad(window.localStorage.getItem("oven").split(","));
    bakeryObj.saveLoad(window.localStorage.getItem("bakery").split(","));
    factoryObj.saveLoad(window.localStorage.getItem("factory").split(","));
    woodenSwordObj.saveLoad(window.localStorage.getItem("woodenSword").split(","));
    // Loading the playerInventory
    playerInventory.saveLoad(window.localStorage.getItem("playerInventory"));
  }
}

function saveGame() {
  // Takes data from game that needs to be saved in order for player to be able to resume
  // and stores it in window.localStorage
  if(cookies > 0) {
    window.localStorage.setItem("cookies", cookies);
    window.localStorage.setItem("autoCookies", autoCookies);
    window.localStorage.setItem("clicks", clicks);
    window.localStorage.setItem("playerName", playerName);
    window.localStorage.setItem("playerLevel", playerLevel);
    window.localStorage.setItem("playerExp", playerExpBar._exp);
    window.localStorage.setItem("oven", [ovenObj.price, ovenObj.owned]);
    window.localStorage.setItem("bakery", [bakeryObj.price, bakeryObj.owned]);
    window.localStorage.setItem("factory", [factoryObj.price, factoryObj.owned]);
    window.localStorage.setItem("woodenSword", [woodenSwordObj.price, woodenSwordObj.owned]);
    // Saving the playerInventory
    window.localStorage.setItem("playerInventory", playerInventory.extractDataForSave());
  }
}

function initScalarsPositions() {
  scalars = {
    // Click or hover based:
    storeHoverScalar: 1,
    storeCloseHoverScalar: 1,

    // Animation based:
    menuAnimScalar: 1,
    menuAnimSpeed: 0.008,
    scrollScalar: width * 0.0625,

    // Buttons:
    menuButtonW: width * 0.16,
    menuButtonH: height * 0.08,
  
    // Image based:
    mainCookieScalar: width * 0.15,
    titleScreenCookie: width * 0.06,
    storeCoinScalar: width * 0.05,
    storeCloseScalar: width * 0.05,
    openAchievementsScalar: width * 0.05,
    closeAchievementsScalar: width * 0.05,
    inventoryOpenScalar: width * 0.05,
    cookieGetScalar: width * 0.025,
    fallingCookieScalar: 50,
  
    // Text based:
    textScalar: width / 1920,
  };
}

function draw() {
  background(102, 153, 204);
  // cursor("assets/cursor.png");
  textSize(15);
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  text(frameRate().toFixed(0), 20, height - 60);
  if (gameState === 0) {
    menu();
  } 
  else if (gameState === 1) {
    mainGame();
  }
  else if (gameState === 2) {
    displayOptions();
  }
  else if (gameState === 3) {
    // Gamestate during some animations
    void 0;
  }
  runDialogBoxes();
  if(input) {
    input.run();
  }
  globalMessage.run();
  displayAnimation();
  gMouseControl(true);
}

function menu() { // gameState 0
  displayMenu();
  animateMenu();
  if(window.localStorage.length > 0) {
    titleLoadButton.run();
  }
  else {
    titleNewGameButton.run();
  }
  titleOptionsButton.run();
  // If save file was stored as cookie in browser, show load option
}

function mainGame() { // gameState 1
  incrementAutoCookies();
  displayGame();
  animateCookieGet();
  if(currentInv) {
    currentInv.run();
  }
  if (shopState) {
    shop();
  }
  else {
    openShopButton.run();
  }
  if(achievementState) {
    displayAchievementsMenu();
  }
  else {
    openAchievementsButton.run();
  }
  displayPlayerData();
}

function displayGame() {
  cookieFall();
  // cookieSpinner.run();
  mainCookie.run();
  inventoryOpenButton.run();

  // Draws cookie amount text to screen
  noStroke();
  textFont(gameFont);
  textSize(40 * scalars.textScalar);
  textAlign(CENTER, CENTER);
  text(str(Math.floor(cookies)) + " Cookies" , width / 2, height * 0.85);

  displayTrackedAchievment();
}

function displayPlayerData() {
  // Displays player name and level, and a box for the main player EXP bar

  // The two rects at top of screen
  strokeWeight(3);
  stroke(0);
  fill(186, 211, 252, 255);
  rectMode(CENTER);
  rect(width * 0.425, height * 0.02, width * 0.75, height * 0.04);

  // The text player name and level text
  fill(0);
  noStroke();
  textSize(width * 0.15 / 20);
  textAlign(LEFT, CENTER);
  text(playerName + " Lvl " + playerLevel, width * 0.055, height * 0.02);

  playerExpBar.run();
}

function incrementAutoCookies() {
  // Increments the cookie amount 4 times a second
  if (autoCookies > 0 && millis() - lastMillis > 25) {
    cookies += autoCookies / 40;
    lastMillis = millis();
    increments ++;
    if (increments % 40 === 0) {
      cookieGet();
    }
  } 
}

function cookieGet() {
  // This function creates the effect underneath cookie total showing cookies gained every second
  // Random location somewhere under cookie total text
  cookieGetX = random(width * 0.4, width * 0.6);
  cookieGetY = height * 0.9;
  cookieGetAlpha = 255;
  // Temporary variable for the "+" and cookies just gained in a string
  tempText = "+" + autoCookies.toFixed(1);
}

function animateCookieGet() {
  // Draws tempText to screen with a cookie beside it every second, showing how many cookies gained that second
  if (cookieGetAlpha > 0) {
    fill(0, cookieGetAlpha);
    textSize(15 * scalars.textScalar);
    noStroke();
    text(tempText, cookieGetX, cookieGetY);
    tint(255, cookieGetAlpha);
    image(cookie, cookieGetX + textWidth(tempText) , cookieGetY, scalars.cookieGetScalar, scalars.cookieGetScalar);
    // Reduces alpha value so that it fades away
    cookieGetAlpha -= 8.5;
  }
}

function displayMenu() {
  // Draws everything to screen in menu()
  // Game title text
  fill(255);
  textSize(75 * scalars.textScalar);
  textAlign(CENTER, CENTER);
  text(titleText , width / 2, height * 0.2);

  // Cookies that are next to title text, positions based on length of titleText
  tint(255, 255);
  image(cookie, width / 2 - textWidth(titleText) / 2 - scalars.titleScreenCookie, height * 0.2, scalars.titleScreenCookie * scalars.menuAnimScalar, scalars.titleScreenCookie * scalars.menuAnimScalar);
  image(cookie, width / 2 + textWidth(titleText) / 2 + scalars.titleScreenCookie, height * 0.2, scalars.titleScreenCookie * scalars.menuAnimScalar, scalars.titleScreenCookie * scalars.menuAnimScalar);
}

function animateMenu() {
  // Animates the text and cookies on menu by alternating a scalar
  if (scalars.menuAnimScalar > 1.05) {
    scalars.menuAnimSpeed = -scalars.menuAnimSpeed;
    scalars.menuAnimScalar = 1.05;
  }
  else if (scalars.menuAnimScalar < 0.95) {
    scalars.menuAnimSpeed = -scalars.menuAnimSpeed;
    scalars.menuAnimScalar = 0.95;
  }
  scalars.menuAnimScalar += scalars.menuAnimSpeed;
}

function displayOptions() {
  optionsDeleteDataButton.run();
  textSize(25);
  text("(Press 'm' to go back)", width * 0.5, height * 0.9);
}

function shop() {
  // Run objects for game shop
  closeShopButton.run();
  if(shopTab === 1) {
    // Draws background in shop 
    rectMode(CENTER);
    fill(83, 140, 198);
    rect(width * 0.85, height / 2, width * 0.3, height);

    ovenObj.run();
    bakeryObj.run();
    factoryObj.run();
    shopScrollBar.run();
  }
  else{
    rectMode(CENTER);
    fill(214, 41, 41);

    rect(width * 0.85, height / 2, width * 0.3, height);
    woodenSwordObj.run();
    shopWeaponScrollBar.run();
  }

  autoCookiesTab.run();
  weaponsTab.run();
}

function displayTextBox(theText, x, y, mode = 0, size = 0) {
  // Called from within shop objects in mouseHover() 
  // Displays a shop object's metaText in a box if hovered over

  // Position vars
  let rectWidth = size === "small" ? width / 15 : width / 10;
  let tSize = size === "small" ? Math.ceil(rectWidth / theText.length * 0.85) : Math.ceil(rectWidth / 15);
  let formattedText = formatText(theText, rectWidth, tSize);
  let rectHeight = size === "small" ? formattedText.split("\n").length * tSize * 1.7 : formattedText.split("\n").length * tSize * 1.5;

  // Formatting
  textSize(tSize);
  stroke(0);
  strokeWeight(3);
  fill(186, 211, 252, 255);
  // Draw the rectangle
  if(mode === "center") {
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    rect(x, y, rectWidth, rectHeight);
    noStroke();
    fill(0);
    // Text inside
    text(formattedText, x, y);
  }

  else if(x - rectWidth < 0) {
    rectMode(CORNERS);
    textAlign(LEFT, TOP);
    rect(x + rectWidth, y - rectHeight, x, y);
    noStroke();
    fill(0);
    // Text inside
    text(formattedText, x + 5, y - rectHeight + 5);
  }

  else {
    rectMode(CORNERS);
    textAlign(LEFT, TOP);
    rect(x - rectWidth, y - rectHeight, x, y);
    noStroke();
    fill(0);
    text(formattedText, x - rectWidth + 5, y - rectHeight + 5);
  }
}

function newFallingCookie() {
  // Creates a new cookie object to be drawn with cookieFall(), called when mousePressed() on main cookie
  let tempCookie = {
    x: random(0, width),
    y: -25,
    grav: 0,
  };
  cookiesFalling.push(tempCookie);
}

function cookieFall() {
  // For each object in cookiesFalling, draws a semi-transparent cookie that falls from top of screen
  tint(255, 200);
  let theCookie;
  for(let i = 0; i < cookiesFalling.length; i++) {
    theCookie = cookiesFalling[i];
    theCookie.y += theCookie.grav;
    theCookie.grav++;
    image(cookie, theCookie.x, theCookie.y, scalars.fallingCookieScalar, scalars.fallingCookieScalar);
    if (theCookie.y > height + scalars.fallingCookieScalar) {
      // When cookie leaves screen, remove from list
      cookiesFalling.splice(i, 1);
    }
  }
}

function newDialogBox(theDialog) {
  // If arg is a dialog box, push to currentDialog. Will be run in draw()
  if (theDialog.constructor.name === "DialogBox") {
    currentDialog.push(theDialog);
  }
}

function runDialogBoxes() {
  // Run in draw, calls run on all dialog boxes in currentDialog
  for(let i = 0; i < currentDialog.length; i++) {
    currentDialog[i].run();
  }
}

function closeDialog() {
  // Called from dialog boxes when a button is clicked, removing itself from currentDialog
  currentDialog.shift();
}

function calculateTextSize(theString, theWidth, theHeight = 0) {
  theString = theString.split(" ");
  let longestWord = "";
  for(let i = 0; i < theString.length; i++) {
    if (theString[i].length > longestWord.length) {
      longestWord = theString[i];
    }
  }
  tSize = theWidth / longestWord.length * 0.7;
  textSize(tSize);
  if(theHeight) {
    if(textAscent(theString) > theHeight * 0.7) {
      tSize = theHeight * 0.7;
    }
  }

  return tSize;
}

function formatText(theString, theWidth, tSize) {
  // Many functions require the ability to break text in the right location so it doesn't go "out of bounds."
  // This function returns an edited string with line breaks that fit into the specified width given the text size and width
  
  // In case it's passed an empty string
  if(!theString) {
    return theString;
  }

  // Set up data
  theString = theString.split(" ");
  let widthCounter = 0;
  let returnString = "";
  textSize(tSize);

  // Remove pre-existing new-lines from string
  for(let i = 0; i < theString.length; i++) {
    if(theString[i].includes("\n")) {
      let theString1 = theString.slice(0, i);
      let splitString = theString[i].split("\n");
      let theString2 = theString.slice(i + 1);
      theString = theString1.concat(splitString, theString2);
    }
  }

  // For one word
  if(theString.length === 1) {
    theString = theString[0].split("");
    // By counting width with textWidth, add new lines in appropiate places, for 1 word strings
    for(let i = 0; i < theString.length; i++) {
      widthCounter += textWidth(theString[i]);
      if(widthCounter >= theWidth) {
        returnString += "\n" + theString[i];
        widthCounter = textWidth(theString[i]);
      } 
      else {
        returnString += theString[i];
      }
    }
  }

  // For many words
  else {
    // By counting width with textWidth, add new lines in appropiate places, for many word strings
    for(let i = 0; i < theString.length; i++) {
      if(i !== theString.length - 1) {
        widthCounter += textWidth(theString[i] + " ");
      }
      else {
        widthCounter += textWidth(theString[i]);
      }
      if(widthCounter >= theWidth) {
        returnString += "\n" + theString[i];
        widthCounter = textWidth(theString[i]);
      } 
      else {
        returnString += " " + theString[i];
      }
    }
  }

  // This method may leave whitespace on front of string, trim to remove it
  return returnString.trim();
}

function keyPressed() {
  if (gameState === 1 || gameState === 2) {
    if (key === "r" && gameState === 1) {
      // Resets game upon pressing "r" on keyboard. resetAlpha is used in mainGame() to draw "Game reset!" to screen which fades away
      void 0;
    }  
    else if (key === "m") {
      newDialogBox(returnToMenuDialog);
    }
    else if(key === "i") {
      openInventory("player");
    }
  }
  if(input) {
    input.getInput(key);
  }
}

function resetGame() {
  cookies = 0;
  autoCookies = 0;
  clicks = 0;
  playerName = "";
  playerLevel = 1;

  ovenObj.reset();
  bakeryObj.reset();
  factoryObj.reset();
  playerExpBar.exp = 0;

  // Delete save file
  window.localStorage.clear();
  initAchievements();
}

function mouseWheel(event) {
  if(shopState && mouseX >= width * 0.7) {
    if(shopTab === 1) {
      ovenObj.mouseScroll(event.delta);
      bakeryObj.mouseScroll(event.delta);
      factoryObj.mouseScroll(event.delta);
      shopScrollBar.mouseScroll(event.delta);
    }
    else {
      woodenSwordObj.mouseScroll(event.delta);
      shopWeaponScrollBar.mouseScroll(event.delta);
    }
    
  }

  if(achievementState && mouseX <= width * 0.3) {

    achievements.clicks.obj.mouseScroll(event.delta);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initScalarsPositions();
  resizeObjects();
}

function openInventory(theInventory) {
  currentInv = theInventory === "player" ? playerInventory : null;
}

function closeInventory() {
  // Going along with the comment in the BackgroundBox, this prevents boxes
  // from being closed unless gMouse is currently their own priority, stopping
  // unwanted, immediate closing when opening inventories with on-screen buttons
  // currentInv = gMouse === currentInv.priority ? null : currentInv;
  currentInv = null;
}

function spawnItem(itemToSpawn, levelOfItem = 2) {
  if(itemToSpawn === "Wooden Sword") {
    return new GameWeapon(woodenSword, "physical", "Wooden Sword", "Breaks easily, but leaves splinters.", levelOfItem);
  }
}