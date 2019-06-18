let singleTouch = false;
let touchBlock = false;
let positions;

function initMobileScalarsPositions() {
  scalars = {
    // Buttons
    menuButtonW: width * 0.55,
    menuButtonH: height * 0.12,

    // Store
    storeOpenScalarW: width,
    storeOpenScalarH: height * 0.15,

    mainCookieScalar: width * 0.6,
    cookieGetScalar: width * 0.07,

    // Menu
    menuCookieScalar: width * 0.15,

    menuAnimScalar: 1,
    menuAnimSpeed: 0.0112,
  };

  positions = {
    middleW: width * 0.5,

    menuCookie1: width * 0.115,
    menuCookie2: width * 0.885,

    cookieTextY: height * 0.9,
  };
}

function drawMobile() {
  // Check state and do that state
  if(gameState === 0)  {
    menuMobile();
  }
  else if(gameState === 1) {
    mainGameMobile();
    mobileAnimateCookieGet();
  }
  else if(gameState === 2) {
    mobileShop();
  }
  else if(gameState === 3) {
    mobileOptions();
  }

  mobileBackgroundCookies();
  handleTouches();
}

function handleTouches() {
  singleTouch = false;
  if(touches.length === 0) {
    touchBlock = false;
  }
}

function menuMobile() {
  // Text
  textSize(width / 8);
  text("Cookie\nClicker", width / 2, height * 0.2);

  // Two cookies on menu screen
  imageMode(CENTER);
  image(cookie, positions.menuCookie1, height / 2, scalars.menuCookieScalar  * scalars.menuAnimScalar, scalars.menuCookieScalar  * scalars.menuAnimScalar);
  image(cookie, positions.menuCookie2, height / 2, scalars.menuCookieScalar  * scalars.menuAnimScalar, scalars.menuCookieScalar  * scalars.menuAnimScalar);
  animateMenuMobile();

  // Play and options button
  titleStartButton.run();
  titleOptionsButton.run();
}

function animateMenuMobile() {
  // Make the cookies get big and get small. It looks cool
  if (scalars.menuAnimScalar > 1.07) {
    scalars.menuAnimSpeed = -scalars.menuAnimSpeed;
    scalars.menuAnimScalar = 1.05;
  }
  else if (scalars.menuAnimScalar < 0.93) {
    scalars.menuAnimSpeed = -scalars.menuAnimSpeed;
    scalars.menuAnimScalar = 0.95;
  }
  scalars.menuAnimScalar += scalars.menuAnimSpeed;
}

function mainGameMobile() {
  // Show cookie on screen
  mainCookie.run();

  // Text showing amount of cookies
  fill(0, 255);
  textSize(width / 15);
  text(cookies.toFixed(0) + " Cookies", positions.middleW, positions.cookieTextY);
  
  // Show shop button or show shop, depending on shopState
  if(shopState === 0) {
    openShopButton.run();
  }
  else {
    mobileShop();
  }
}

function mobileCookieIncrement() {
  cookies++;
}

function mobileBackgroundCookies() {
  // Increments the cookie amount 4 times a second
  if (autoCookies > 0 && millis() - lastMillis > 25) {
    cookies += autoCookies / 40;
    lastMillis = millis();
    increments++;
    if (increments % 40 === 0) {
      mobileCookieGet();
    }
  } 
}

function mobileCookieGet() {
  // This function creates the effect underneath cookie total showing cookies gained every second
  // Random location somewhere under cookie total text
  cookieGetX = random(width * 0.3, width * 0.7);
  cookieGetY = height * 0.95;
  cookieGetAlpha = 255;
  // Temporary variable for the "+" and cookies just gained in a string
  tempText = "+" + autoCookies.toFixed(1);
}

function mobileAnimateCookieGet() {
  // Draws tempText to screen with a cookie beside it every second, showing how many cookies gained that second
  if (cookieGetAlpha > 0) {
    fill(0, cookieGetAlpha);
    textSize(width / 30);
    noStroke();
    text(tempText, cookieGetX, cookieGetY);
    tint(255, cookieGetAlpha);
    image(cookie, cookieGetX + textWidth(tempText) , cookieGetY, scalars.cookieGetScalar, scalars.cookieGetScalar);
    // Reduces alpha value so that it fades away
    cookieGetAlpha -= 8.5;
  }
}

function mobileShop() {
  // Lines separating items
  for(let i = 1; i < 3; i++) {
    let h = height * (0.1 + 0.9 / 3 * i);
    stroke(0);
    line(0, h, width, h);
  }

  ovenObj.run();
  bakeryObj.run();
  factoryObj.run();

  closeShopButton.run();
}

function mobileOptions() {
  optionsBackButton.run();
  optionsCheatButton.run();
}

function touchStarted() {
  return false;
}

function touchEnded() {
  // Basically singleTouch gets set to false at the end of every frame, meaning there is only a one frame window
  // where objects can register touches, leading to the player's ability to only touch things ONCE
  singleTouch = true;
}