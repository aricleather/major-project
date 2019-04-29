// All classes used in my game to create clickable, interactive objects on screen
// Use of mouseClicked() removed due to built in mouse-related functions and global
// gMouseControl() function to control what can be clicked, how much, and when

class GameObject {
  // Main class used in game. Gives x coord, y coord, width, and height
  // Gives function calcMouse to check if mouse is on object
  constructor(x, y, width, height) {
    this.mouse;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    // Objects in my game check if they are clicked on by themselves. This variable is set to true when the mouse is clicked
    // Which blocks further clicks, until the mouse button is released (this function given in subclasses)
    this.calcMouse = function() {
      this.mouse = Math.abs(mouseX - this.x) <= this.width / 2 && Math.abs(mouseY - this.y) <= this.height / 2;
    };
  }
}
  
class Button extends GameObject {
  constructor(x, y, width, height, priority, buttonText, clicked = 0, rgb = 0) {
    super(x, y, width, height);
    // Vars
    this.priority = priority;
    this.tSize = this.width / 10;
    this.buttonText = formatText(buttonText, this.width, this.tSize);
    this.clicked = clicked ? clicked :
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
    // When a Button is run, calculate if mouse is on top, draw the rectangle around it, fill it in with
    // a shade of gray dependent on whether the mouse is inside or not, then the text inside
    this.calcMouse();

    // Darkens button if mouse inside
    if(this.mouse && !this.hoverOverride) {
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
  
    this.alreadyClicked = false;
    this.checkClicked();

    return this.alreadyClicked;
      
  }

  checkClicked() {
    if(this.mouse && mouseIsPressed && gMouse <= this.priority) {
      this.clicked();
      this.alreadyClicked = 1;
      // After a click, set gMouseToggle to true temporarily to block further clicks until mouse button released
      gMouseToggle.val = this.priority + 1;
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

  
class ImageObject extends GameObject {
  constructor(x, y, width, height, objImage, clicked, extendRun = 0) {
    super(x, y, width, height);
    // Vars
    this.objImage = objImage;
    this.clicked = clicked;
    this.extendRun = extendRun;
  }
  
  run() {
    // Image objects when run() draw their image to the screen with specified x, y, width, height
    this.calcMouse();
    tint(255, 255);
    fill(0, 255);
  
    // If ImageObject has extendRun function (passed during construction), run it here before drawing image
    // Used in classes that want images to have more functionality (ex. ImageButton)
    if(this.extendRun) {
      this.extendRun();
    }
    image(this.objImage, this.x, this.y, this.width, this.height);
  
    // Again, utilizing calcMouse() and this.alreadyClicked to run this.clicked() on click only *once*
    if(this.mouse) {
      if(mouseIsPressed && gMouse < 1) {
        this.clicked();
        gMouseToggle.val = 1;
      }
    }
  }
      
  resize(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class SpinImage extends GameObject {
  constructor(x, y, width, height, objImage, speed) {
    // Creates an object you can .run() to draw its image spinning 
    // Complete one full rotation per "this.speed" frames
    // Vars
    super(x, y, width, height);
    this.objImage = objImage;
    this.speed = speed;
    this.spinCount = 0;
    this.rotateAmount;
  }

  // Translate to the x and y of the object, rotate, draw image, rotate back, translate back
  run() {
    this.rotateAmount = 360 * (this.spinCount % this.speed / this.speed);
    console.log(this.rotateAmount);
    translate(this.x, this.y);
    rotate(this.rotateAmount);
    imageMode(CENTER);
    fill("white");
    image(this.objImage, 0, 0, this.width, this.height);
    rotate(-this.rotateAmount);
    translate(-this.x, -this.y);
    this.spinCount++;
  }
}


class ImageButton extends GameObject {
  // Same as ImageObject but enlarges on hover for a more button-like effect
  constructor(x, y, width, height, priority, objImage, clicked, hoverScalar, objText) {
    super(x, y, width, height);
    // Vars
    this.priority = priority;
    this.objImage = objImage;
    this.clicked = clicked;
    this.hoverScalar = hoverScalar;
    this.tSize = this.width / 6;
    this.objText = formatText(objText, this.width, this.tSize);
    this.minWidth = this.width;
    this.minHeight = this.height;
  }
  
  run() {
    // Check if mouse is on top then enlarge image based on hoverScalar if mouse hovering
    this.calcMouse();
    if(this.mouse && gMouse <= this.priority && this.width === this.minWidth) {
      this.width *= this.hoverScalar;
      this.height *= this.hoverScalar;
    }
    else if (!this.mouse && this.width > this.minWidth) {
      this.width = this.minWidth;
      this.height = this.minHeight;
    }
    
    tint(255, 255);
    fill(0, 255);
    image(this.objImage, this.x, this.y, this.width, this.height);
  
    textAlign(CENTER, TOP);
    textSize(this.tSize);
    noStroke();
    text(this.objText, this.x, this.y + this.minHeight * 0.6);

    // Allow clicking only once before releasing mouse
    if(this.mouse) {
      if(mouseIsPressed && gMouse <= this.priority) {
        this.clicked();
        gMouseToggle.val = this.priority + 1;
      }
    }
  }
  
  resize(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.minWidth = this.width;
    this.minHeight = this.height;
    this.tSize = this.width / 6;
    this.objText = formatText(this.objText, this.width, this.tSize);
  }
}

class TabButton extends GameObject {
  constructor(x, y, width, height, clicked, rgb, buttonText) {
    super(x, y, width, height);
    this.clicked = clicked;
    this.rgb = rgb;
    this.hoverRgb = lerpColor(color(this.rgb), color([0, 0, 0]), 0.1);
    this.buttonText = buttonText;
    this.tSize = this.width / 15;
  }

  run() {
    this.calcMouse();

    if(this.mouse && !gMouse) {
      fill(this.hoverRgb);
      if(mouseIsPressed) {
        this.clicked();
        gMouseToggle.val = 1;
      }
    }
    else {
      fill(this.rgb);
    }


    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height, 10, 10, 0, 0);

    textAlign(CENTER, CENTER);
    textSize(this.tSize);
    fill(0, 200);
    text(this.buttonText, this.x, this.y);
  }

  resize(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}
  
class ShopObject extends GameObject {
  constructor(imageWidth, imageHeight, objImage, name, metaText, price, cps) {
    // Used to construct an object in the shop
    super(width * 0.76, height * 0.125 * (shopNumber * 2 + 1), width * 0.0002 * imageWidth, width * 0.0002 * imageHeight);
  
    // Vars
    this.objImage = objImage;
    this.name = name;
    this.metaText = metaText;
    this.basePrice = price;
    this.price = price;
    this.cps = cps;
  
    this.position = shopNumber;
    this.owned = 0;
  
    this.textX = width * 0.825;
    this.tSize = 15 * scalars.textScalar;
    this.rectX = width * 0.85;
    this.scrollAmount = 0;
    this.scrollPosition = width * 0.0625;

    this.text = this.name + "\nCost: " + str(this.price) + " Cookies\n" + str(this.cps) + " CPS\nOwned: " + str(this.owned);
  
    // shopNumber just keeps track of order in the shop, so that the next shopObject construction knows it comes after
    shopNumber++;
  }
  
  // The clicked() function here checks if you have enough money then does stuff if you do
  clicked() {
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
    this.calcMouse();
      
    // Darken image if player cannot afford item
    if(cookies < this.price) {
      tint(50);
    }
    else {
      tint(255);
    }
    fill(0, 255);
    image(this.objImage, this.x, this.y, this.width, this.height);
  
    // Again utilizing calcMouse() and alreadyClicked to run this.clicked() on click only once
    if(this.mouse && gMouse < 1) {
      // If mouseHover exists run when mouse hovering
      displayTextBox(this.metaText, mouseX, mouseY);
      
      if(mouseIsPressed) {
        this.clicked();
        gMouseToggle.val = 1;
      }
    }
    
    rectMode(CENTER);
    fill(30, 70);
    noStroke();
    rect(this.rectX, this.y, width * 0.3, height * 0.2);
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
  
  mouseScroll(event) { 
    if(event > 0) {
      this.scrollAmount++;
    }
    else {
      this.scrollAmount--;
    }
    this.scrollAmount = constrain(this.scrollAmount, 0, 7);
    this.y = height * (2 * this.position + 1) * 0.125 - this.scrollPosition * this.scrollAmount; 
  }

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

class ShopWeaponObject extends GameObject {
  constructor(objImage, name, metaText, price, power, powerType) {
    // Used to construct an object in the shop
    super(width * 0.76, height * 0.125 * (shopWeaponNumber * 2 + 1), width * 0.06, width * 0.06);
  
    // Vars
    this.objImage = objImage;
    this.name = name;
    this.metaText = metaText;
    this.basePrice = price;
    this.price = price;
    this.power = power;
    this.powerType = powerType;
  
    this.position = shopWeaponNumber;
    this.owned = 0;
  
    this.textX = width * 0.825;
    this.tSize = 15 * scalars.textScalar;
    this.rectX = width * 0.85;
    this.scrollAmount = 0;
    this.scrollPosition = width * 0.0625;

    this.text = this.owned < 1 ? this.name + "\nCost: " + str(this.price) + " Cookies\n" + str(this.power) + " " + this.powerType + " Power"
      : "Purchased!";
  
    // shopWeaponNumber just keeps track of order in the shop, so that the next shopWeaponObject construction knows it comes after
    shopWeaponNumber++;
  }
  
  // The clicked() function here checks if you have enough money then does stuff if you do
  clicked() {
    if(cookies >= this.price && this.owned < 1) {
      cookies -= this.price;
      purchaseSound.play();
      this.owned++;
      // this.price = Math.ceil(this.basePrice * Math.pow(Math.E, this.owned / 4));
      this.updateText();
      playerInventory.addItem(new GameWeapon(this.objImage, "physical", this.name, this.metaText));
    }
    else {
      errorSound.play();
    }
  }
  
  // The extendRun for ShopObject draws the rectangle behind the ShopObject and it's text
  // Then, it sets a tint value for when the image is drawn (in ImageObjects run()) based on whether
  // or not the player has enough cookies. If mouse hovering, call metaTextBox
  run() {
    this.calcMouse();
      
    // Darken image if player cannot afford item
    if(cookies < this.price) {
      tint(50);
    }
    else {
      tint(255);
    }
    fill(0, 255);
    image(this.objImage, this.x, this.y, this.width, this.height);
  
    // Again utilizing calcMouse() and alreadyClicked to run this.clicked() on click only once
    if(this.mouse && gMouse < 1) {
      // If mouseHover exists run when mouse hovering
      displayTextBox(this.metaText, mouseX, mouseY);
      
      if(mouseIsPressed) {
        this.clicked();
        gMouseToggle.val = 1;
      }
    }
    
    rectMode(CENTER);
    fill(30, 70);
    noStroke();
    rect(this.rectX, this.y, width * 0.3, height * 0.2);
    textAlign(LEFT, CENTER);
    fill(0);
    textSize(this.tSize);
    text(this.text, this.textX, this.y);
  }
  
  // Updates the text drawn by this object when called to match current data. Run once on construction and once on purchase
  updateText() {
    this.text = this.owned < 1 ? this.name + "\nCost: " + str(this.price) + " Cookies\n" + str(this.power) + " " + this.powerType + " Power"
      : "Purchased!";
  }
  
  // Since shopObjects are always in the same relative spot on the screen, resize should be called with no params
  // to let this extendResize function reset the scaling and position variables
  resize() {
    this.scrollPosition = width * 0.0625;
    this.x = width * 0.76;
    this.y = height * (2 * this.position + 1) * 0.125 - this.scrollPosition * this.scrollAmount;
    this.width = width * 0.06;
    this.height = width * 0.06;
    this.textX = width * 0.825;
    this.tSize = 15 * scalars.textScalar;
    this.rectX = width * 0.85;
  }
  
  // mouseHover() is run in run() if it exists. Here it uses function displayTextBox() to
  // display the little box over the item with some info
  
  mouseScroll(event) { 
    if(event > 0) {
      this.scrollAmount++;
    }
    else {
      this.scrollAmount--;
    }
    this.scrollAmount = constrain(this.scrollAmount, 0, 7);
    this.y = height * (2 * this.position + 1) * 0.125 - this.scrollPosition * this.scrollAmount; 
  }

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

class ScrollBar extends GameObject {
  constructor(x, y, scrollBarWidth, scrollCount, scrollDistance) {
    // For scroll bars in game, for example in the shop
    super(x, y, scrollBarWidth, scrollDistance / scrollCount);
    this.scrollCount = scrollCount; // Amount of times it can scroll before reaching bottom
    this.scrollBarHeight = scrollDistance / scrollCount; // Scroll bar height is the distance it scroll in divided by how many times it can so it fits
    this.scrollDistance = scrollDistance - this.scrollBarHeight; // Edit scroll distance not to include the scroll bar height so nothing goes off screen
    this.scrollAmount = 0; // Originally, the scroll bar has not been scrolled at all
    this.deltaY = 0; // This is edited when the mouse is scrolled by how much the scroll bar needs to move
    this.run = function() {
      noStroke();
      fill(75, 200);
      rectMode(CENTER);
      // Rect mode is center, so half the height is the center of it, plus its original y coord and the deltaY from scrolling
      rect(this.x, this.y + this.scrollBarHeight / 2 + this.deltaY, this.width, this.height);
    };
  }
  
  mouseScroll(event) {
    if(shopState) {
      if(event > 0) {
        this.scrollAmount++;
      }
      else {
        this.scrollAmount--;
      }
      // this.scrollAmount = constrain(this.scrollAmount, 0, this.scrollCount);
      this.scrollAmount = constrain(this.scrollAmount, 0, this.scrollCount);
      this.deltaY = this.scrollAmount * (this.scrollDistance / this.scrollCount);
    }
  }
      
  resize(x, y, scrollBarWidth, scrollDistance) {
    this.x = x;
    this.y = y;
    this.width = scrollBarWidth;
    this.height = scrollDistance / this.scrollCount;
    
    this.scrollBarHeight = this.scrollDistance / this.scrollCount;
    this.scrollDistance = scrollDistance - this.scrollBarHeight;
    this.deltaY = this.scrollAmount * (this.scrollDistance / this.scrollCount);
  }
}

class DialogBox extends GameObject {
  // When constructing, first send x strings then x functions
  constructor(dialogText, priority, ...textAndFunctions) {
    super(width / 2, height * 0.25, width / 2, height * 0.3);

    // Take in args, first half of rest param is text on buttons, second half is functions to run on button press
    // Stored in arrays
    this.buttonText = textAndFunctions.slice(0, textAndFunctions.length / 2);
    this.buttonFunctions = textAndFunctions.slice(textAndFunctions.length / 2);
    this.buttons = this.buttonText.length;
    this.buttonClicked = false;

    this.priority = priority;

    // Text formatting
    this.textY = this.y - this.height / 2 + this.height * 0.1; // Y coord text drawn at
    this.tSize = this.width * 0.8 / 25;
    this.dialogText = formatText(dialogText, this.width * 0.8, this.tSize);

    // Button formatting
    this.buttonArr = [];
    this.buttonY = this.y + this.height / 2 - this.height * 0.2;
    this.buttonWidth = this.width / (this.buttons + 2);
    this.buttonHeight = this.height / 5;
    // Push new buttons into this.buttonArr
    for(let i = 0; i < this.buttons; i++) {
      this.buttonArr.push(new Button(this.x - this.width / 2 + this.width * (i + 1) / (this.buttons + 1), this.buttonY, this.buttonWidth, this.buttonHeight, this.priority,
        this.buttonText[i], this.buttonFunctions[i]));
    }
  }

  run() {
    //Formatting
    rectMode(CENTER);
    stroke(0);
    strokeWeight(4);
    fill(186, 211, 252);

    // Main box
    rect(this.x, this.y, this.width, this.height);

    // Text in main box
    textSize(this.tSize);
    textAlign(CENTER, TOP);
    fill(0);
    noStroke();
    text(this.dialogText, this.x, this.textY);

    // Run the buttons
    for(let i = 0; i < this.buttons; i++) {
      // While clicked, buttons will return a true, which is utilized to close dialog boxes
      this.buttonClicked = this.buttonArr[i].run();
      if(this.buttonClicked) {
        closeDialog(1);
        this.buttonClicked = false;
      }
    }

    gMouseToggle.val = this.priority;
  }

  resize() {
    // Main resizing
    this.x = width / 2;
    this.y = height * 0.25;
    this.width = width / 2;
    this.height = height * 0.3;

    // Resize the text
    this.tSize = this.width * 0.8 / 25;
    this.dialogText = formatText(this.dialogText, this.width * 0.8, this.tSize);
    this.textY = this.y - this.height / 2 + this.height * 0.1;

    // Recalculate button sizes and call resize on each button to finish resizing
    this.buttonY = this.y + this.height / 2 - this.height * 0.2;
    this.buttonWidth = this.width / (this.buttons + 2);
    this.buttonHeight = this.height / 5;
    for(let i = 0; i < this.buttons; i++) {
      this.buttonArr[i].resize(this.x - this.width / 2 + this.width * (i + 1) / (this.buttons + 1), this.buttonY, this.buttonWidth, this.buttonHeight);
    }
  }
}

class GlobalMessage extends GameObject {
  constructor() {
    super(width / 2, height / 5, width * 0.6, height * 0.2);
    // Vars
    this.textAlpha = 0;
    this.tSize = this.width / 20;
    this.toggled = false;
    this.objText = "";
  }

  // If toggled, display the text
  run() {
    if(this.toggled) {
      fill(0, this.textAlpha);
      noStroke();
      textSize(this.tSize);
      textAlign(CENTER, CENTER);
      text(this.objText, this.x, this.y);

      // If fadeTime surpassed, start fading then untoggle
      if(this.fadeTime < millis()) {
        this.textAlpha -= 8.5;
        if(this.textAlpha <= 0) {
          this.toggled = false;
        }
      }
    }
  }
    
  // Call toggle on a GlobalMessage with a duration to have one display for that duration
  toggle(objText, duration) {
    this.objText = formatText(objText, this.width, this.tSize);
    this.textAlpha = 255;
    this.toggled = true;
    // Will start fading when duration has passed, fadeTime = current time + duration
    this.fadeTime = millis() + duration;
  }

  resize() {
    this.x = width / 2;
    this.y = height / 5;
    this.width = width * 0.6;
    this.height = height * 0.2;
    this.tSize = this.width / 20;
    this.objText = formatText(this.objText, this.width, this.tSize);
  }
}

class TextInput extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this.currentText = "";
    this.tSize = 50;
    this.blinkToggle = true;
    this.reToggleBlink = 0;
    this.endInput = false;
  }

  run() {
    textSize(50);
    fill(255);
    textAlign(LEFT, CENTER);
    text(this.currentText, this.x, this.y);
    this.blinkingTextLine();
    if(this.endInput) {
      buttonSelect1.play();
      return this.currentText;
    }
  }

  getInput(key) {
    if(key.length === 1 && key.toUpperCase() !== key.toLowerCase()) {
      this.currentText += key;
      this.reToggleBlink = millis() + 500;
      this.blinkToggle = false;
    }
    else if(key === "Backspace") {
      this.currentText = this.currentText.slice(0, -1);
    }
    else if(key === " ") {
      this.currentText += key;
    }
    else if(key === "Enter") {
      buttonSelect1.play();
      this.endInput = true;
    }
  }

  blinkingTextLine() {
    // If toggled, make the little line blink. If not, make it stay constant
    if(this.blinkToggle) {
      if(Math.floor((millis() - this.reToggleBlink) / 500) % 2 === 0) {
        fill(255);
      }
      else {
        fill(0);
      }
    }
    else {
      fill(255);
      if(millis() > this.reToggleBlink) {
        this.blinkToggle = true;
      }
    }
    noStroke();
    rectMode(CENTER);
    rect(this.x + textWidth(this.currentText) + 5, this.y, 3, this.tSize);
  }
}

class AchievementObject extends GameObject {
  constructor(imageWidth, imageHeight, objImage, tiers, tier, goals, metaText, achvText) {
    super(width * 0.06, height * 0.125 * (achievementNumber * 2 + 1), width * 0.0002 * imageWidth, width * 0.0002 * imageHeight);
    this.objImage = objImage;
    this.tiers = tiers; 
    this.tier = tier;
    this.completion;
    
    this.goals = goals;
    this.position = achievementNumber;
    achievementNumber++;

    this.achvText = achvText;
    this.metaText = metaText;
    this.rectX = width * 0.15;
    this.textX = width * 0.125;
    this.starX = width * 0.135;
    this.starY = this.y + height * 0.07;
    this.starSize = 40;
    this.starDist = this.starSize * 1.4;
    this.tSize = 15 * scalars.textScalar;

    this.scrollPosition = width * 0.0625;
    this.scrollAmount = 0;
  }

  clicked() {
    void 0;
  }
  
  run() {
    this.calcMouse();
  
    // Again utilizing calcMouse() and alreadyClicked to run this.clicked() on click only once
    
    rectMode(CENTER);
    fill(212, 175, 55, 150);
    noStroke();
    rect(this.rectX, this.y, width * 0.3, height * 0.2);
    textAlign(LEFT, CENTER);
    fill(0, 255);
    textSize(this.tSize);
    text(this.achvText, this.textX, this.y);

    tint(255, 255);
    fill(0, 255);
    image(this.objImage, this.x, this.y, this.width, this.height);

    for(let i = 0; i < this.tiers; i++) {
      if(i < this.tier) {
        tint(255, 255);
      }
      else {
        tint(50, 255);
      }
      image(goldStar, this.starX + i * this.starDist, this.starY, this.starSize, this.starSize);
    }

    if(this.mouse && gMouse < 1) {
      // If mouseHover exists run when mouse hovering
      displayTextBox(this.metaText, mouseX, mouseY);
      
      if(mouseIsPressed) {
        this.clicked();
        gMouseToggle.val = 1;
      }
    }
  }
  
  // Since shopObjects are always in the same relative spot on the screen, resize should be called with no params
  // to let this extendResize function reset the scaling and position variables
  resize() {
    this.scrollPosition = width * 0.0625;
    this.x = width * 0.06;
    this.y = height * (2 * this.position + 1) * 0.125 - this.scrollPosition * this.scrollAmount;
    this.width = width * this.objImage.width * 0.0002;
    this.height = width * this.objImage.height * 0.0002;
    this.textX = width * 0.125;
    this.tSize = 15 * scalars.textScalar;
    this.rectX = width * 0.15;

    this.starX = width * 0.135;
    this.starY = this.y + height * 0.07;
    this.starSize = 40;
    this.starDist = this.starSize * 1.4;
  }
  
  // mouseHover() is run in run() if it exists. Here it uses function displayTextBox() to
  // display the little box over the item with some info
  
  mouseScroll(event) {
    if(event > 0) {
      this.scrollAmount++;
    }
    else {
      this.scrollAmount--;
    }
    this.scrollAmount = constrain(this.scrollAmount, 0, 7);
    this.y = height * (2 * this.position + 1) * 0.125 - this.scrollPosition * this.scrollAmount;
    this.starY = this.y + height * 0.07;
  }

  updateCompletion(completion) {
    this.completion = completion;
  }

  updateTier(tier, updatedText) {
    this.tier = tier;
    this.achvText = updatedText;
  }

  reset() {
    void 0;
    // this.price = this.basePrice;
    // this.owned = 0;
    // this.updateText();
  }
}

class ExperienceBar extends GameObject {
  constructor(x, y, width, height, exp, expToNextLevel) {
    // Vars
    super(x, y, width, height);
    this._exp = exp;
    this.expToNextLevel = expToNextLevel;
    this.expToGain = 0;
    this.expToGainCounter = 0;

    // Special vars for green filling so rectMode can be CORNER
    this.expGreenX = this.x - this.width / 2;
    this.expGreenY = this.y - this.height / 2;
    this.expGreenWidth = this.width * this._exp / this.expToNextLevel || 0;
  }

  run() {
    this.calcMouse();

    if(this.expToGain) {
      this.animate();
    }

    // Exp bar itself
    fill("green");
    noStroke();
    rectMode(CORNER);
    rect(this.expGreenX, this.expGreenY, this.expGreenWidth, this.height);
    noFill();
    stroke(0);
    rectMode(CENTER);
    rect(this.x, this.y, this.width, this.height);

    if(this.mouse && !gMouse) {
      displayTextBox("Exp: " + this._exp.toFixed(0) + "/" + str(this.expToNextLevel), this.x, this.y + this.height * 1.5, "center", "small");
      if(mouseIsPressed) {
        this.clicked();
        gMouseToggle.val = 1;
      }
    }
  }

  clicked() {
    void 0;
  }

  set exp(val) {
    // For direct setting, used by loadSaveFile();
    this._exp = val;
    this.resizeGreen();
  }

  resizeGreen() {
    // When called, calculate new width necessary to display current exp amount
    this.expGreenWidth = this.width * this._exp / this.expToNextLevel || 0;
  }

  expGain(exp) {
    // The function that is actually called to increment the exp bar, will cause animation to take place
    this.expToGain = this._exp + exp;
    this.expToGainCounter = 60;
    expGainSound.play();
  }

  animate() {
    // Animates exp bar by making it move toward where it is supposed to be at a decreasing rate
    this._exp += (this.expToGain - this._exp) * 1/10;
    this.expToGainCounter--;

    // After 60 frames, animation is cut off
    if(!this.expToGainCounter) {
      this._exp = this.expToGain;
      this.expToGain = 0;
    }
    this.resizeGreen();
  }

  resize(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.expGreenX = this.x - this.width / 2;
    this.expGreenY = this.y - this.height / 2;
    this.expGreenWidth = this.width * this._exp / this.expToNextLevel || 0;
  }
}

class BackgroundBox extends GameObject {
  constructor(x, y, width, height, rgb, priority, mode) {
    super(x, y, width, height);
    this.rgb = rgb;
    this.priority = priority;
    this.close = false;
    this.open = true;
    this.animFrames = 1;
    this.mode = mode;
    this.contentToRun = [];
  }

  run() {
    if(this.open) {
      this.openAnimation();
      gMouseToggle.val = this.priority + 1;
    }
    else {
      this.calcMouse();

      stroke(0);
      strokeWeight(3);
      fill(this.rgb);
      rectMode(CENTER);
      rect(this.x, this.y, this.width, this.height);
  
      // I would like to rework my Window system at some point, the amount of code to manage "box.close" 
      // is rather painful to me. Maybe the classes utilizing the box should manage it themselves
      if(this.mode === "click" && !this.mouse && gMouse <= this.priority) {
        if(mouseIsPressed) {
          console.log("box log: gMouse is: " + str(gMouse) + " my priority is: " + str(this.priority));
          this.close = true;
        }
        else {
          this.close = false;
        }
      }
      else if(this.mode === "hover") {
        if(!this.mouse) {
          this.close = true;
        }
        else {
          this.close = false;
        }
      }
      if(gMouse > this.priority) {
        this.close = false;
      }
      for(let i = 0; i < this.contentToRun.length; i++) {
        this.contentToRun[i].run();
      }
    }
    
    gMouseToggle.bound = this.priority;
  }

  openAnimation() {
    stroke(0);
    strokeWeight(3);
    fill(this.rgb);
    rectMode(CENTER);
    rect(this.x, this.y, this.animFrames / 5 * this.width, this.height);

    this.animFrames++;
    if(this.animFrames === 5) {
      this.open = false;
    }
  }

  resize(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

class InventoryScreen extends GameObject {
  constructor(x, y, width, rgb, priority, cols, rows) {
    // Vars
    super(x, y, width, width / cols * rows);
    this.cols = cols;
    this.rows = rows;
    this.mouseXPos = null;
    this.mouseYPos = null;
    this.mouseHeldItem = null;

    // Somewhere to put the inventory screen
    this.box = new BackgroundBox(this.x, this.y, this.width, this.height, rgb, priority, "click");
    this.optionsBox = new OptionsBox(300, 300, 100, 150, priority + 1, ["Info", "Move", "Upgrade"]);
    this.upgradeBox;
    this.clickedItemCoords = null;
    this.toggleOptionsBox = false;
    this.priority = priority;

    // Corner useful for the for loop drawing the 2d array and checking what box mouse is in
    this.leftX = this.x - this.width / 2;
    this.rightX = this.x + this.width / 2;
    this.topY = this.y - this.height / 2;
    this.bottomY = this.y + this.height / 2;

    // Box size for calculating what box mouse is in
    this.boxSize = this.width / cols;
    this.boxSizeOffset = this.boxSize / 2;

    this.itemArr = [];
    for(let i = 0; i < rows; i++) {
      let emptyArr = [];
      for(let j = 0; j < cols; j++) {
        emptyArr.push(0);
      }
      this.itemArr.push(emptyArr);
    }
  }

  run() {
    this.calcMouse();
    this.box.run();

    // Draw the lines separating each item box
    stroke(0, 200);
    strokeWeight(2);
    for(let i = 1; i <= this.cols; i++) {
      let x = this.leftX + i / this.cols * this.width;
      line(x, this.topY, x, this.bottomY);
    }
    for(let j = 1; j <= this.rows; j++) {
      let y = this.topY + j / this.rows * this.height;
      line(this.leftX, y, this.rightX, y);
    }

    // Draw the image of the object if there is one in that slot
    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.cols; j++) {
        if(this.itemArr[i][j].type === "weapon") {
          tint(255, 255);
          image(this.itemArr[i][j].img, j * this.boxSize + this.boxSizeOffset + this.leftX, i * this.boxSize + this.boxSizeOffset + this.topY, this.boxSize * 0.8, this.boxSize * 0.8);
        }
      }
    }

    // Display meta text in a text box if an item is in a slot
    if(this.mouse) {
      // Calculate what box is the mouse inside
      this.mouseXPos = constrain(Math.floor((mouseX - this.leftX) / this.boxSize), 0, this.cols - 1);
      this.mouseYPos = constrain(Math.floor((mouseY - this.topY) / this.boxSize), 0, this.rows - 1);
      if(!mouseIsPressed && !this.mouseHeldItem && !this.toggleOptionsBox & !this.upgradeBox) {     
        if(this.itemArr[this.mouseYPos][this.mouseXPos]) {
          let hoveredThing = this.itemArr[this.mouseYPos][this.mouseXPos];
          displayTextBox(hoveredThing.metaText, mouseX, mouseY);
        }
      }

      else if(!this.toggleOptionsBox && !this.upgradeBox && this.itemArr[this.mouseYPos][this.mouseXPos] && mouseIsPressed && gMouse === this.priority) {
        this.optionsBox.moveBox(this.leftX + this.boxSize * (this.mouseXPos + 1) + 50, this.topY + this.boxSize * this.mouseYPos);
        this.toggleOptionsBox = 1;
        // So that the item that was clicked is still known, mouse may move off of it
        this.clickedItemCoords = [this.mouseYPos, this.mouseXPos];
        gMouseToggle.val = this.priority + 1;
      }
    }

    if(this.mouseHeldItem) {
      image(this.mouseHeldItem.img, mouseX, mouseY, this.boxSize * 0.8, this.boxSize * 0.8);
      if(this.mouse && mouseIsPressed && gMouse === this.priority) {
        this.mouseDropItem(this.mouseYPos, this.mouseXPos);
        gMouseToggle.val = this.priority + 1;
      }
    }

    // If options box is toggled and it isn't being closed, run the optionsBox
    
    if(this.upgradeBox) {
      this.runUpgradeBox();
    }

    if(this.toggleOptionsBox) {
      this.runOptionsBox();
    }

    if(this.box.close && !this.toggleOptionsBox && gMouse <= this.priority) {
      console.log(this.box.close);
      closeInventory();
      // So it doesn't auto-close next time
      this.box.close = false;

      // If the user was holding an item when the box was closed, put it back where it was
      // Possible because when an item is picked up it is given "pickedUpFrom" attribute
      if(this.mouseHeldItem) {
        this.itemArr[this.mouseHeldItem.pickedUpFrom[0]][this.mouseHeldItem.pickedUpFrom[1]] = this.mouseHeldItem;
        this.mouseHeldItem = 0;
      }
    }
  }

  runOptionsBox() {
    // Actually run the box
    this.optionsBox.run();

    // If info button pressed...
    if(this.optionsBox.buttonPressed === 0) {
      console.log("Not yet");
      this.resetOptionsBox();
    }

    // If move button pressed pick up the item at location that was stored in clickedItemCoords
    else if(this.optionsBox.buttonPressed === 1) {
      this.mousePickUpItem(this.clickedItemCoords[0], this.clickedItemCoords[1]);
      this.resetOptionsBox();
      gMouseToggle.val = this.priority + 1;
    }

    // If upgrade button pressed open upgrade menu with item that was stored in clickedItemCoords
    else if(this.optionsBox.buttonPressed === 2) {
      this.upgradeBox = new UpgradeMenu(this.x, this.y, this.width * 0.8, this.height * 0.8, [63, 102, 141, 255], this.priority + 1, this.itemArr[this.clickedItemCoords[0]][this.clickedItemCoords[1]]);
      this.resetOptionsBox();
      gMouseToggle.val = this.priority + 1;
    }

    // Once options box is closed due to whatever reason, un-toggle it and reset it
    if(this.optionsBox.close) {
      this.toggleOptionsBox = 0;
      this.optionsBox.mouseHasEnteredBox = false;
      this.optionsBox.close = false;
      this.optionsBox.buttonPressed = null;
    }
  }

  runUpgradeBox() {
    this.upgradeBox.run();
    if(this.upgradeBox.close) {
      this.upgradeBox = null;
    }
  }

  resetOptionsBox() {
    this.toggleOptionsBox = 0;
    this.optionsBox.mouseHasEnteredBox = false;
    this.optionsBox.close = false;
    this.optionsBox.buttonPressed = null;
  }

  mousePickUpItem(row, col) {
    // If the user isn't holding an item and the mouse is pressed, pick it up
    this.mouseHeldItem = this.itemArr[row][col];
    this.mouseHeldItem.pickedUpFrom = [row, col];
    this.itemArr[row][col] = 0;
    gMouseToggle.val = this.priority + 1;
  }

  mouseDropItem() {
    // If the user is holding an item and mouse is pressed, put it where the mouse is
    this.itemArr[this.mouseYPos][this.mouseXPos] = this.mouseHeldItem;
    this.mouseHeldItem = 0;
    gMouseToggle.val = this.priority + 1;
  }

  addItem(item) {
    // When called, puts item into first unused slot
    let slot = this.firstUnusedSlot();
    this.itemArr[slot[0]][slot[1]] = item;
  }

  firstUnusedSlot() {
    // Returns array with [row, column] of first empty slot in this.itemArr
    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.cols; j++) {
        if(this.itemArr[i][j] === 0) {
          return [i, j];
        }
      }
    }
    return false;
  }

  extractDataForSave() {
    // Saves as [xpos, ypos, itemName; xpos, ypos, itemName;] etc.. in a string
    let returnString = "";
    for(let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.cols; j++) {
        if(this.itemArr[i][j].type === "weapon") {
          returnString += str(i) + "," + str(j) + "," + this.itemArr[i][j].name + ";";
        }
      }
    }
    return returnString;
  }

  saveLoad(data) {
    // Breaks up data as it is expected from extractDataForSave in a string
    data = data.split(";");
    data.pop();
    let itemCount = data.length;
    for(let i = 0; i < itemCount; i++) {
      // Spawn an identical copy of that item given theItem in data
      let theItem = data[i].split(",");
      this.itemArr[int(theItem[0])][int(theItem[1])] = spawnItem(theItem[2]);
    }
  }

  resize(x, y, width) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = width / this.cols * this.rows;

    this.leftX = this.x - this.width / 2;
    this.rightX = this.x + this.width / 2;
    this.topY = this.y - this.height / 2;
    this.bottomY = this.y + this.height / 2;

    this.boxSize = this.width / this.cols;
    this.boxSizeOffset = this.boxSize / 2;

    this.box.resize(this.x, this.y, this.width, this.height);
  }
}

class GameWeapon {
  constructor(weaponImage, weaponType, name, metaText, weaponLevel) {
    this.img = weaponImage;
    this.weaponType = weaponType;
    this.name = name;
    this.metaText = metaText;
    this.weaponlevel = weaponLevel;

    this.type = "weapon";
  }
}

class OptionsBox extends GameObject {
  constructor(x, y, width, height, priority, buttonText, buttonFunctions = 0) {
    super(x, y, width, height);
    // Vars
    this.priority = priority;
    this.buttonText = buttonText;
    // Funcs can be passed in or handled by something that created an instance of OptionsBox through this.buttonPressed
    this.buttonFunctions = buttonFunctions;
    this.buttonCount = this.buttonText.length;

    this.mouseHasEnteredBox = false;
    this.topY = this.y - this.height / 2;
    this.buttonHeight = this.height / this.buttonText.length;
    this.buttonOffset = this.buttonHeight / 2;

    // Spawn a button with appropriate text for each element in buttonText array passed in
    this.buttons = [];
    for(let i = 0; i < this.buttonCount; i++) {
      this.buttons.push(new Button(this.x, this.topY + this.buttonHeight * i + this.buttonOffset, this.width, this.buttonHeight, this.priority, this.buttonText[i]));
    }

    this.close = false;
    this.buttonPressed = null;
  }

  run() {
    this.calcMouse();
    if(!this.mouseHasEnteredBox && this.mouse) {
      this.mouseHasEnteredBox = true;
    }
    if(this.mouseHasEnteredBox && !this.mouse) {
      this.close = true;
    }

    for(let i = 0; i < this.buttonCount; i++) {
      this.buttons[i].run();
      if(this.buttons[i].alreadyClicked) {
        if(this.buttonFunctions) {
          this.buttonFunctions[i]();
        }
        else {
          this.buttonPressed = i;
        }
      }
    }
  }

  moveBox(x, y) {
    this.x = x;
    this.y = y;
    this.topY = this.y - this.height / 2;

    for(let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].resize(this.x, this.topY + this.buttonHeight * i + this.buttonOffset, this.width, this.buttonHeight, this.buttonText[i]);
    }
  }
  
  resize() {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.topY = this.y - this.height / 2;
    this.buttonHeight = this.height / this.buttonText.length;
    this.buttonOffset = this.buttonHeight / 2;

    for(let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].resize(this.x, this.topY + this.buttonHeight * i + this.buttonOffset, this.width, this.buttonHeight, this.buttonText[i]);
    }
  }
}

class UpgradeMenu extends GameObject {
  constructor(x, y, width, height, backgroundRgb, priority, upgItem) {
    super(x, y, width, height);
    // Vars from input
    this.upgItem = upgItem;
  
    // Positioning and scaling of elements in upgrade menu
    this.buttonX = this.x + this.width / 5;
    this.buttonY = this.y + this.height * 0.35;
    this.counterWidth = this.width * 0.4;
    this.counterHeight = this.height / 6;
    this.levelsToUpgradeCounterY = this.y - this.height * 0.35;
    this.displayPriceY = this.y;
    this.imageX = this.x - this.width / 4;
    this.imageSize = this.width / 4;
    
    // Generating all the stuff needed to run in menu
    this.box = new BackgroundBox(x, y, width, height, backgroundRgb, priority, "click");
    this.levelsToUpgradeCounter = new NumberCounter(this.buttonX, this.levelsToUpgradeCounterY, this.counterWidth, this.counterHeight, "Level", 0, [79, 128, 176], true, priority, 0);
    this.displayPrice = new NumberCounter(this.buttonX, this.displayPriceY, this.counterWidth, this.counterHeight, "Price", 1000, [79, 128, 176], false);
    this.upgradeButton = new Button(this.buttonX, this.buttonY, 125, 30, priority, "Upgrade!", 0, [76, 187, 23]);

    this.close = false;
  }

  run() {
    // Do upgrade if this.upgItem is valid, else set close to true
    if(this.upgItem) {
      // Run the background box and our "upgrade" button
      this.box.run();
      this.upgradeButton.run();
      this.levelsToUpgradeCounter.run();
      this.displayPrice.run();

      // In this case, if user clicks outside of box, set close to true
      if(this.box.close) {
        this.close = true;
      }

      // Draw image of upgItem
      this.calcMouse();
      tint(255, 255);
      image(this.upgItem.img, this.imageX, this.y, this.imageSize, this.imageSize);

      // If upgradeButton clicked, run doUpgradeAndClose
      if(this.upgradeButton.alreadyClicked) {
        this.doUpgradeAndClose();
      }
    }

    else {
      this.close = true;
    }
  }

  doUpgradeAndClose() {
    this.close = true;
  }
}

class ItemInfoMenu extends GameObject {
  constructor(x, y, width, height, backgroundRgb, priority, theItem) {
    super(x, y, width, height);
    // Vars from input
    this.theItem = theItem;
  
    // Positioning and scaling of elements in upgrade menu
    this.counterWidth = this.width * 0.4;
    this.counterHeight = this.height / 6;

    this.levelDisplayY = this.y - this.height * 0.35;
    this.damageDisplayY = this.y;
    this.somethingDisplayY = this.y + this.height * 0.35;
    this.imageX = this.x - this.width / 4;
    this.imageSize = this.width / 4;
    
    // Generating all the stuff needed to run in menu
    this.box = new BackgroundBox(x, y, width, height, backgroundRgb, priority, "click");
    this.levelsToUpgradeCounter = new NumberCounter(this.buttonX, this.levelsToUpgradeCounterY, this.counterWidth, this.counterHeight, "Level", 0, [79, 128, 176], true, priority, 0);
    this.displayPrice = new NumberCounter(this.buttonX, this.displayPriceY, this.counterWidth, this.counterHeight, "Price", 1000, [79, 128, 176], false);
    this.upgradeButton = new Button(this.buttonX, this.buttonY, 125, 30, "Upgrade!", 0, [76, 187, 23]);

    this.close = false;
  }
}

class NumberCounter extends GameObject {
  constructor(x, y, width, height, counterText = 0, startingVal = 0, rgb = 0, enabled, priority = 0) {
    super(x, y, width, height);
    // Vals from input
    this.enabled = enabled;
    this.val = startingVal || 0;
    this.priority = priority;
    this.rgb = rgb || [40, 40, 40];
    this.counterText = counterText || null;

    // Formatting, positioning, scaling
    this.tSize = this.width / 10;
    this.counterTSize = this.height / 2;
    this.textY = this.y + this.height * 0.5 + this.tSize;
    this.leftX = this.x - this.width / 4;
    this.rightX = this.x + this.width / 4;
  }

  run() {
    this.calcMouse();

    // Draw a box around
    strokeWeight(3);
    stroke(0);
    fill(this.rgb);
    rect(this.x, this.y, this.width, this.height);

    // Show the current value
    noStroke();
    fill(0);
    textSize(this.counterTSize);
    text(str(this.val), this.x, this.y);

    rectMode(CENTER);
    fill(0);
    if(this.enabled) {
      rect(this.leftX, this.y, 5, 5);
      rect(this.rightX, this.y, 5, 5);
    }

    if(this.counterText) {
      textSize(this.tSize);
      textAlign(CENTER, CENTER);
      text(this.counterText, this.x, this.textY);
    }

    if(this.enabled && this.mouse && gMouse <= this.priority) {
      // I can perform this simple check to see what side the mouse is on because
      // this.mouse prevents anything from happening if the mouse isn't inside the box 
      let side = mouseX < this.x ? "left" : "right";
      if(mouseIsPressed) {
        if(side === "left") {
          this.clicked(-1);
        }
        else{
          this.clicked(1);
        }
        gMouseToggle.val = this.priority + 1;
      }

      else {
        fill(0, 50);
        if(side === "left") {
          rect(this.leftX, this.y, this.width / 2, this.height);
        }
        else {
          rect(this.rightX, this.y, this.width / 2, this.height);
        }
      }
    }
  }

  clicked(inc) {
    this.val += inc;
  }
}

class MemoryPuzzle extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    // Formats gameObject to be capped out at the height it was called with
    this.width = this.height > this.width ? this.width : this.height;
    this.playerWin = null;
    this.gamePhase = 0;

    // Formatting and positioning stuff
    this.cardSize = this.height / 5.5;
    this.cardSizeWithGap = this.cardSize * 1.1;
    this.cardToFlip = 0;
    this.tSizeTop = this.width / 11;
    this.tSizeCard = this.cardSize * 0.75;

    this.topYCard = this.y - this.height * 0.41;
    this.topYText = this.y - this.height * 0.42;
    this.leftX = this.x - this.width / 2;
    this.mouseXOffset = this.leftX + this.width / 10;
    this.mouseYOffset = this.topYCard + this.height / 10;

    // Player input values
    this.cardMouseX;
    this.cardMouseY;

    // Time values
    this.timeToStartFlipping = millis() + 1000;
    this.flipNextCard = millis() + 1100;
    this.memoryCountdown;

    // Values that will be displayed on the cards
    this.cardValues = ["A", "B", "C", "D", "E", "F", "G", "H"];

    // Set up two arrays: one stores card values, other stores whether a card is "flipped" or not
    this.cardArray = [];
    this.cardFlipArray = [];
    for(let i = 0; i < 4; i++) {
      this.cardArray.push([0, 0, 0, 0]);
      this.cardFlipArray.push([0, 0, 0, 0]);
    }
    
    // Push two cards of the same value 8 times into random locations into cardArray, being sure not to overlap
    for(let i = 0; i < 8; i++) {
      for(let j = 0; j < 2; j++) {
        let x1 = Math.floor(random(0, 4));
        let y1 = Math.floor(random(0, 4));
        while(this.cardArray[x1][y1] !== 0) {
          x1 = Math.floor(random(0, 4));
          y1 = Math.floor(random(0, 4));
        }
        this.cardArray[x1][y1] = this.cardValues[i];
      }
    }

  }

  run() {
    this.calcMouse();

    // Formatting
    rectMode(CENTER);
    textAlign(CENTER, CENTER);

    this.drawCards();
    // Run based on current phase
    if(this.gamePhase === 0) {
      this.runIntro();
    }
    if(this.gamePhase === 1) {
      this.runMemorize();
    }
    if(this.gamePhase === 2) {
      this.runPlayerGame();
    }
    
    
  }

  drawCards() {
    textSize(this.tSizeCard);
    for(let i = 1; i < 5; i++) {
      for(let j = 1; j < 5; j++) {
        stroke(0);
        strokeWeight(2);
        if(this.cardMouseX === i - 1 && this.cardMouseY === j - 1) {
          fill(170);
        }
        else {
          fill(220);
        }
        rect(this.leftX + i / 5 * this.width, this.topYCard + j / 5 * this.height, this.cardSize, this.cardSize);
        if(this.cardFlipArray[i - 1][j - 1]) {
          fill(0);
          noStroke();
          text(this.cardArray[i - 1][j - 1], this.leftX + i / 5 * this.width, this.topYCard + j / 5 * this.height);
        }
      }
    }
  }

  runIntro() {
    // Text displayed on top
    fill(0);
    noStroke();
    textSize(this.tSizeTop);
    text("Memorize!", this.x, this.topYText);

    if(millis() > this.timeToStartFlipping) {
      if(millis() > this.flipNextCard) {
        this.cardFlipArray[this.cardToFlip % 4][Math.floor(this.cardToFlip / 4)] = 1;
        this.cardToFlip++;
        this.flipNextCard += 100;
        if(this.cardToFlip === 16) {
          this.gamePhase = 1;
          this.memoryCountdown = millis() + 6000;
        }
      }
    }
  }

  runMemorize() {
    // Switches the text from black to white for effect
    if(Math.ceil((this.memoryCountdown - millis()) / 500) % 2) {
      fill(255);
    }
    else {
      fill(0);
    }
    
    // Draws the timer
    noStroke();
    textSize(this.tSizeTop);
    text(str(Math.floor((this.memoryCountdown - millis()) / 1000)) + " Seconds!", this.x, this.topYText);
    
    // Checks if timer is up. If so, flip all cards back over and go to next game phase
    if(millis() >= this.memoryCountdown) {
      for(let i = 0; i < 4; i++) {
        this.cardFlipArray[i] = [0, 0, 0, 0];
      }
      this.gamePhase = 2;
    }
  }

  runPlayerGame() {
    fill(0);
    noStroke();
    textSize(this.tSizeTop);
    text("Coming soon lol", this.x, this.topYText);
    if(this.mouse) {
      this.cardMouseX = constrain(Math.floor((mouseX - this.mouseXOffset) / this.cardSizeWithGap), 0, 3);
      this.cardMouseY = constrain(Math.floor((mouseY - this.mouseYOffset) / this.cardSizeWithGap), 0, 3);

    }
  }
}