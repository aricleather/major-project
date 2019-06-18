// Generate all game objects for mobile
function initMobileObjects() {
  // Buttons
  titleStartButton = new ButtonMobile(width / 2, height / 2, scalars.menuButtonW, scalars.menuButtonH, "Play", function() {
    gameState = 1;
  }, 0);
  titleOptionsButton = new ButtonMobile(width / 2, height * 0.65, scalars.menuButtonW, scalars.menuButtonH, "Options", function() {
    gameState = 3;
  }, 0);
  openShopButton = new TabButtonMobile(width / 2, height * 0.05, width, height * 0.1, function() {
    gameState = 2;
  }, [40, 40, 40], "Open Shop");
  closeShopButton = new TabButtonMobile(width / 2, height * 0.05, width, height * 0.1, function() {
    gameState = 1;
  }, [40, 40, 40], "Go back");
  optionsBackButton = new TabButtonMobile(width / 2, height * 0.05, width, height * 0.1, function() {
    gameState = 0;
  }, [40, 40, 40], "Go back");
  optionsCheatButton = new ButtonMobile(width / 2, height / 2, scalars.menuButtonW, scalars.menuButtonH, "Cheat", function() {
    cookies = 1000000;
  }, 0);

  // Image Objects
  mainCookie = new ImageObjectMobile(width / 2, height / 2, scalars.mainCookieScalar, scalars.mainCookieScalar, cookie, function() {
    mobileCookieIncrement();
    this.width = 1.15 * this.width;
    this.height = 1.15 * this.height;
  }, function() {
    this.width -= 1/10 * (this.width - scalars.mainCookieScalar);
    this.height -= 1/10 * (this.height - scalars.mainCookieScalar);
    this.width = constrain(this.width, scalars.mainCookieScalar, scalars.mainCookieScalar * 1.25);
    this.height = constrain(this.height, scalars.mainCookieScalar, scalars.mainCookieScalar * 1.25);
  });

  // Shop Objects
  ovenObj = new ShopObjectMobile(oven.width, oven.height, oven, "Oven", "Bake more cookies!", 5, 0.1);
  bakeryObj = new ShopObjectMobile(bakery.width, bakery.height, bakery, "Baker", "Mmm, smells good...", 150, 1);
  factoryObj = new ShopObjectMobile(factory.width, factory.height, factory,"Factory", "Autonomous cookie production.", 500, 5);
}

// Called when window resized to properly resize all game objects
function resizeMobileObjects() {
  void 0;
}

