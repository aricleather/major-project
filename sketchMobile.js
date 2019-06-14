let singleTouch = false;
let touchBlock = false;

function initMobileScalarsPositions() {
  scalars = {
    menuButtonW: width * 0.4,
    menuButtonH: height * 0.15,

    mainCookieScalar: width * 0.6,
  };
}

function drawMobile() {
  text(frameRate().toFixed(0), width * 0.1, height * 0.9);
  if(gameState === 0)  {
    menuMobile();
  }
  else if(gameState === 1) {
    mainGameMobile();
  }

  singleTouch = false;
}

function menuMobile() {
  titleStartButton.run();
}

function mainGameMobile() {
  mainCookie.run();
  text(str(cookies), width / 2, height * 0.8);
}

function touchStarted() {
  return false;
}

function touchEnded() {
  singleTouch = true;
}