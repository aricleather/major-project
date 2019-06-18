class GameObjectMobile {
  constructor(x, y, width, height) {
    this.touched;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    // Objects in my game check if they are clicked on by themselves. This variable is set to true when the mouse is clicked
    // Which blocks further clicks, until the mouse button is released (this function given in subclasses)
    this.calcTouch = function() {
      if(touches.length > 0) {
        this.touched = Math.abs(touches[0].x - this.x) <= this.width / 2 && Math.abs(touches[0].y - this.y) <= this.height / 2;
      }
    };
  }
}

class ButtonMobile extends GameObjectMobile {
  constructor(x, y, width, height, buttonText, touchFunc = 0, rgb = 0) {
    super(x, y, width, height);
    // Vars
    this.tSize = this.width / 10;
    this.buttonText = buttonText;
    this.touchFunc = touchFunc ? touchFunc :
      function(){
        void 0;
      };
    this.alreadyClicked = false;
    this.color;

    this.rgb = rgb || [40, 40, 40];
    this.hoverRgb = rgb ? lerpColor(color(this.rgb), color([0, 0, 0]), 0.1) : [80, 80, 80];
    this.hoverOverride = false;
  }

  run() {
    console.log(this.touched);
    // When a Button is run, calculate if mouse is on top, draw the rectangle around it, fill it in with
    // a shade of gray dependent on whether the mouse is inside or not, then the text inside
    this.calcTouch();

    // Darkens button if mouse inside
    if(this.touched && !this.hoverOverride) {
      this.color = this.hoverRgb;
    }
    else {
      this.color = this.rgb;
    }

    // Formatting and drawing rectangle, text
    stroke(255);
    strokeWeight(3);
    fill(this.color);
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height);
    noStroke();
    fill(255);
    textSize(this.tSize);
    textAlign(CENTER, CENTER);
    text(this.buttonText, this.x, this.y);
  
    this.alreadyTouched = false;
    this.checkTouched();

    return this.alreadyTouched;
      
  }

  checkTouched() {
    if(this.touched && singleTouch && !touchBlock) {
      this.touchFunc();
      this.alreadyTouched = 1;
      touchBlock = true;
    }
  }
  
  resize(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.tSize = this.width / 10;
    this.text = formatText(this.buttonText, this.width, this.tSize);
  }
}

class ImageObjectMobile extends GameObjectMobile {
  constructor(x, y, width, height, objImage, touchFunc, extendRun = 0) {
    super(x, y, width, height);
    // Vars
    this.objImage = objImage;
    this.touchFunc = touchFunc;
    this.extendRun = extendRun;
  }
  
  run() {
    // Image objects when run() draw their image to the screen with specified x, y, width, height
    this.calcTouch();
    tint(255, 255);
    fill(0, 255);
  
    // If ImageObject has extendRun function (passed during construction), run it here before drawing image
    // Used in classes that want images to have more functionality (ex. ImageButton)
    if(this.extendRun) {
      this.extendRun();
    }
    imageMode(CENTER);
    image(this.objImage, this.x, this.y, this.width, this.height);
  
    // Again, utilizing calcMouse() and this.alreadyClicked to run this.clicked() on click only *once*
    if(this.touched && singleTouch && !touchBlock) {
      this.touchFunc();
    }
  }
      
  resize(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class TabButtonMobile extends GameObjectMobile {
  constructor(x, y, width, height, touchFunc, rgb, buttonText) {
    super(x, y, width, height);
    this.touchFunc = touchFunc;
    this.rgb = rgb;
    this.hoverRgb = lerpColor(color(this.rgb), color([0, 0, 0]), 0.1);
    this.buttonText = buttonText;
    this.tSize = this.width / 15;
  }

  // Same as normal tab button, it's a rounded button that can be tapped on to open the store in this case
  run() {
    this.calcTouch();

    if(this.touched) {
      fill(this.hoverRgb);
      if(singleTouch && !touchBlock) {
        this.touchFunc();
        touchBlock = true;
      }
    }
    else {
      fill(this.rgb);
    }

    stroke(255);
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height, 0, 0, 10, 10);

    textAlign(CENTER, CENTER);
    textSize(this.tSize);
    fill(255);
    noStroke();
    text(this.buttonText, this.x, this.y);
  }
}

class ShopObjectMobile extends GameObjectMobile {
  constructor(imageWidth, imageHeight, objImage, name, metaText, price, cps) {
    // Used to construct an object in the shop
    super(width * 0.25, height * 0.9 * (2 * shopNumber + 1) / 6 + height * 0.1, width * 0.001 * imageWidth, width * 0.001 * imageHeight);
  
    // Vars
    this.objImage = objImage;
    this.name = name;
    this.metaText = metaText;
    this.basePrice = price;
    this.price = price;
    this.cps = cps;
  
    this.position = shopNumber;
    this.owned = 0;
  
    this.textX = width * 0.5;
    this.tSize = 10;

    this.text = this.name + "\nCost: " + str(this.price) + " Cookies\n" + str(this.cps) + " CPS\nOwned: " + str(this.owned);
  
    // shopNumber just keeps track of order in the shop, so that the next shopObject construction knows it comes after
    shopNumber++;
  }
  
  // The touchFunc() function here checks if you have enough money then does stuff if you do
  touchFunc() {
    if(cookies >= this.price) {
      autoCookies += this.cps;
      cookies -= this.price;
      purchaseSound.play();
      this.owned++;
      this.price = Math.ceil(this.basePrice * Math.pow(Math.E, this.owned / 4));
      this.updateText();
    }
    else{
      // If unable to play, play a little noise
      errorSound.play();
    }
  }
  
  // The extendRun for ShopObject draws the rectangle behind the ShopObject and it's text
  // Then, it sets a tint value for when the image is drawn (in ImageObjects run()) based on whether
  // or not the player has enough cookies. If mouse hovering, call metaTextBox
  run() {
    this.calcTouch();
      
    // Darken image if player cannot afford item
    if(cookies < this.price) {
      tint(50);
    }
    else {
      tint(255);
    }
    fill(0, 255);
    imageMode(CENTER);
    image(this.objImage, this.x, this.y, this.width, this.height);
  
    
    if(this.touched && !touchBlock) {
      if(singleTouch) {
        this.touchFunc();
        gMouseToggle.val = 1;
      }
    }
  
    noStroke();
    textAlign(LEFT, CENTER);
    fill(0);
    textSize(this.tSize);
    text(this.text, this.textX, this.y);
  }
  
  // Updates the text drawn by this object when called to match current data. Run once on construction and once on purchase
  updateText() {
    this.text = this.name + "\nCost: " + str(this.price) + " Cookies\n" + str(this.cps) + " CPS\nOwned: " + str(this.owned);
  }
  
  // Since shopObjects are always in the same relative spot on the screen, resize should be called with no params
  // to let this extendResize function reset the scaling and position variables
  resize() {
    this.scrollPosition = width * 0.0625;
    this.x = width * 0.76;
    this.y = height * (2 * this.position + 1) * 0.125 - this.scrollPosition * this.scrollAmount;
    this.width = width * this.objImage.width * 0.0002;
    this.height = width * this.objImage.height * 0.0002;
    this.textX = width * 0.825;
    this.tSize = 15 * scalars.textScalar;
    this.rectX = width * 0.85;
  }
  
  // mouseHover() is run in run() if it exists. Here it uses function displayTextBox() to
  // display the little box over the item with some info

  saveLoad(arr) {
    this.price = int(arr[0]);
    this.owned = int(arr[1]);
    this.updateText();
  }

  reset() {
    this.price = this.basePrice;
    this.owned = 0;
    this.updateText();
  }
}