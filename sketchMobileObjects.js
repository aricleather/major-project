// Generate all game objects
function initMobileObjects() {
  // Buttons
  titleStartButton = new ButtonMobile(width / 2, height / 2, scalars.menuButtonW, scalars.menuButtonH, "Play", function() {
    gameState = 1;
  }, 0);

  // Image Objects
  mainCookie = new ImageObjectMobile(width / 2, height / 2, height / 2, height / 2, cookie, function() {
    cookies++;
    this.width = 1.15 * this.width;
    this.height = 1.15 * this.height;
  }, function() {
    this.width = scalars.mainCookieScalar;
    this.height = scalars.mainCookieScalar;
  });
}

// Called when window resized to properly resize all game objects
function resizeMobileObjects() {
  void 0;
}

