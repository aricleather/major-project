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
      inventoryPush(playerInventory, spawnItem(this.name, 1));
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
    
    // Draw the rectangle around me
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
    // For loading saves from cookies
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

class BattleMenuObject extends GameObject  {
  constructor(battleImage, battleText, name) {
    super(width * (2 * battleMenuNumber + 1) / 6, height / 2, width / 6, height / 2);
    this.battleImage = battleImage;
    this.battleText = battleText;
    this.name = name;
    this.level = battleMenuNumber + 1;
    this.position = battleMenuNumber;

    battleMenuNumber++;

    // Scaling
    this.imageWidth = width / 5;
    this.imageHeight = width / 5 * this.battleImage.width / this.battleImage.height;
    this.tSize = this.width / 10;

    // Interactive objects
    let battleButtonFunc = function() {
      startBattle(this.level, this.name);
    }.bind(this);
    this.battleButton = new ImageButton(this.x, this.y, this.imageWidth, this.imageHeight, 0, this.battleImage, 
      battleButtonFunc, 1.05, "");
    // Positioning 
    this.textY = this.y + this.imageHeight / 2;
  }

  run () {
    this.battleButton.run();
    textSize(this.tSize);
    textAlign(CENTER, TOP);
    text(this.battleText, this.x, this.textY);
  }

  resize() {
    this.x = width * (2 * this.position + 1) / 6;
    this.y = height / 2;
    this.width = width / 6;
    this.height = height / 2;

    this.imageWidth = width / 5;
    this.imageHeight = width / 5 * this.battleImage.width / this.battleImage.height;
    this.tSize = this.width / 10;
    this.textY = this.y + this.imageHeight / 2;

    this.battleButton.resize(this.x, this.y, this.imageWidth, this.imageHeight);
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
  constructor(x, y, width, text, duration) {
    super(x, y, width, 1);
    // Vars
    this.textAlpha = 255;
    this.tSize = this.width / 15;
    this.objText = text;
    this.fadeTime = millis() + duration;
    this.close = false;
  }

  // If toggled, display the text
  run() {
    fill(0, this.textAlpha);
    noStroke();
    textSize(this.tSize);
    textAlign(CENTER, CENTER);
    text(this.objText, this.x, this.y);

    // If fadeTime surpassed, start fading then untoggle
    if(this.fadeTime < millis()) {
      this.textAlpha -= 8.5;
      if(this.textAlpha <= 0) {
        this.close = true;
      }
    }
  }

  resize(x, y, width) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = 1;
    this.tSize = this.width / 15;
    this.objText = formatText(this.objText, this.width, this.tSize);
  }
}

class TextInput extends GameObject {
  constructor(x, y, width, tSize, maxLength, id) {
    super(x, y, width, tSize);
    this.id = id;
    this.currentText = "";
    this.tSize = tSize;
    this.maxLength = maxLength;
    this.blinkToggle = true;
    this.reToggleBlink = 0;
    this.endInput = false;

    // Add event listener to 
    this.keyboardFunction = this.getInput.bind(this);
    window.addEventListener("keydown", this.keyboardFunction);
  }

  run() {
    textSize(this.tSize);
    fill(255);
    textAlign(LEFT, CENTER);
    text(this.currentText, this.x, this.y);
    this.blinkingTextLine();
    if(this.endInput) {
      buttonSelect1.play();
      return this.currentText;
    }
  }

  getInput() {
    if(key.length === 1 && this.currentText.length < this.maxLength && key.toUpperCase() !== key.toLowerCase() && !this.endInput) {
      this.currentText += key;
      this.reToggleBlink = millis() + 500;
      this.blinkToggle = false;
    }
    else if(key === "Backspace") {
      this.currentText = this.currentText.slice(0, -1);
    }
    else if(key === " " && this.currentText.length < this.maxLength) {
      this.currentText += key;
    }
    else if(key === "Enter") {
      buttonSelect1.play();
      window.removeEventListener("keydown", this.keyboardFunction);
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
  constructor(x, y, width, height, id, rgb, priority, mode, parent = 0) {
    super(x, y, width, height);
    this.id = id;
    this.rgb = rgb;
    this.priority = priority;
    this.close = false;
    this.hovered = false;
    this.open = true;
    this.animFrames = 1;
    this.mode = mode;
    this.contentToRun = [];
    this.parent = parent || 0;

    // For resizing canvas
    this.originalWidth = width;
    this.originalHeight = height;
  }

  run() {
    // Run a small box open animation before running box content, block mouse clicks throughout
    if(this.open) {
      if(this.mode === "click") {
        this.openAnimation();
      }
      else{
        this.open = false;
      }
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
          this.close = true;
        }
        else {
          this.close = false;
        }
      }
      // This is never really used but technically will close once the mouse enters then leaves the area
      else if(this.mode === "hover") {
        if(!this.hovered && this.mouse) {
          this.hovered = true;
        }
        else if(!this.hovered && mouseIsPressed) {
          this.close = true;
        }
        else if(this.hovered && !this.mouse) {
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
        if(this.contentToRun[i].close === true) {
          this.close = true;
        }
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

  resize(x = 0, y = 0, width = 0, height = 0) {
    this.x = x || this.x;
    this.y = y || this.y;
    this.width = width || this.width;
    this.height = height || this.height;
    this.originalWidth = width || this.width;
    this.originalHeight = height || this.height;
  }

  cnvResize(oldWidth, oldHeight, newWidth, newHeight) {
    let relativeX = this.x / oldWidth;
    let relativeY = this.y / oldHeight;
    this.x = newWidth * relativeX;
    this.y = newHeight * relativeY;
    this.width = this.originalWidth * sqrt(newWidth / 1920);
    this.height = this.originalHeight * sqrt(newHeight / 1080);

    for(let content of this.contentToRun) {
      content.resize(this.x, this.y, this.width, this.height);
    }
  }
}

class InventoryScreen extends GameObject {
  constructor(x, y, width, height, boxId, priority, theInventory) {
    // Vars
    super(x, y, width, height);

    // Window ids for various features that can be accessed using inventory menu
    this.id = boxId;
    this.infoId = null;
    this.contextId = null;
    this.upgradeId = null;

    // When constructed, give it a global inventory to work with
    this.itemArr = theInventory;

    // Get inventory size from inventory. Assumes each row is same size (it should be)
    this.rows = this.itemArr.length;
    this.cols = this.itemArr[0].length;
    this.mouseXPos = null;
    this.mouseYPos = null;
    this.mouseHeldItem = null;
    
    // Resize self to perfectly fit the inventory and stay within parent box
    // The id passed on creation is used to force resize on parent window
    this.boxSize = this.height / this.rows;
    this.boxSizeOffset = this.boxSize / 2;
    if(this.boxSize * this.cols < this.width) {
      this.width = this.boxSize * this.cols;
      openWindows.get(this.id).resize(0, 0, this.width, 0);
    }

    this.clickedItemCoords = [];
    this.priority = priority;

    // Corner data useful for the for loop drawing the 2d array and checking what box mouse is in
    this.leftX = this.x - this.width / 2;
    this.rightX = this.x + this.width / 2;
    this.topY = this.y - this.height / 2;
    this.bottomY = this.y + this.height / 2;
  }

  run() {
    this.calcMouse();

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

    // If an item is held, have it follow the mouse
    if(this.mouseHeldItem) {
      image(this.mouseHeldItem.img, mouseX, mouseY, this.boxSize * 0.8, this.boxSize * 0.8);
      openWindows.get(this.id).close = false;
    }

    // Display meta text in a text box if an item is in a slot
    if(this.mouse && gMouse <= this.priority) {
      // Calculate what box is the mouse inside
      this.mouseXPos = constrain(Math.floor((mouseX - this.leftX) / this.boxSize), 0, this.cols - 1);
      this.mouseYPos = constrain(Math.floor((mouseY - this.topY) / this.boxSize), 0, this.rows - 1);
      if(!mouseIsPressed && !this.mouseHeldItem) {     
        if(this.itemArr[this.mouseYPos][this.mouseXPos]) {
          let hoveredThing = this.itemArr[this.mouseYPos][this.mouseXPos];
          displayTextBox(hoveredThing.metaText, mouseX, mouseY);
        }
      }

      else if(this.mouse && this.mouseHeldItem && mouseIsPressed) {
        this.mouseDropItem();
      }

      // If we click, and there is an item at that position, and a context menu is not open now...
      else if(this.itemArr[this.mouseYPos][this.mouseXPos] && mouseIsPressed && !openWindows.has(this.contextId)) {
        this.openContextMenu();
      }
    }
  }

  openInfoMenu() {
    // Save item coords so that the item that was clicked is still known, because mouse may move off of it
    this.clickedItemCoords = [this.mouseYPos, this.mouseXPos];

    // Get an id for the new window, then that window can be accessed 
    this.infoId = openWindowIdCounter.val;
    openWindows.set(this.infoId, new BackgroundBox(this.x, this.y, this.width * 0.8, this.height * 0.8, this.infoId, [63, 102, 141, 250], this.priority + 1, "click", this));
    spawners.inventoryInfoMenu.call(openWindows.get(this.infoId));
  }

  openContextMenu() {
    // Based on the item clicked on, open the options menu at that location
    this.clickedItemCoords = [this.mouseYPos, this.mouseXPos];

    this.contextId = openWindowIdCounter.val;
    openWindows.set(this.contextId, new BackgroundBox(this.leftX + this.boxSize * (this.mouseXPos + 1) + 50, this.topY + this.boxSize * this.mouseYPos, 100, 200, this.contextId, [63, 102, 141, 250], this.priority + 1, "hover", this));
    spawners.inventoryContextMenu.call(openWindows.get(this.contextId));
  }

  openUpgradeMenu() {
    // Opens the upgrade menu when selected from the contextMenu
    this.clickedItemCoords = [this.mouseYPos, this.mouseXPos];

    this.upgradeId = openWindowIdCounter.val;
    openWindows.set(this.upgradeId, new BackgroundBox(this.x, this.y, this.width * 1.2, this.height * 0.8, this.upgradeId, [63, 102, 141, 250], this.priority + 1, "click", this));
    spawners.inventoryUpgradeMenu.call(openWindows.get(this.upgradeId));
  }

  mousePickUpItem() {
    // When move is seleceted from the options menu, pick up that item
    this.mouseHeldItem = this.itemArr[this.clickedItemCoords[0]][this.clickedItemCoords[1]];
    this.itemArr[this.clickedItemCoords[0]][this.clickedItemCoords[1]] = 0;
  }

  mouseDropItem() {
    // Put item into hovered box, clear related variables
    this.itemArr[this.mouseYPos][this.mouseXPos] = this.mouseHeldItem;
    this.mouseHeldItem = null;
    this.clickedItemCoords = [];
    gMouseToggle.val = this.priority + 1;
  }

  resize(x, y, width) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = width / this.cols * this.rows;
    openWindows.get(this.id).height = this.height;

    this.leftX = this.x - this.width / 2;
    this.rightX = this.x + this.width / 2;
    this.topY = this.y - this.height / 2;
    this.bottomY = this.y + this.height / 2;

    this.boxSize = this.width / this.cols;
    this.boxSizeOffset = this.boxSize / 2;
  }
}

class GameWeapon {
  constructor(weaponImage, weaponType, name, id, metaText, weaponLevel) {
    this.img = weaponImage;
    this.weaponType = weaponType;
    this.name = name;
    this.id = id;
    this.metaText = metaText;
    this.weaponLevel = weaponLevel;

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
  constructor(x, y, width, height, priority, upgItem) {
    super(x, y, width, height);
    // Vars from input
    this.upgItem = upgItem;
  
    // Positioning and scaling of elements in upgrade menu
    this.counterXLeft = this.x;
    this.counterXRight = this.x + this.width / 3;
    this.buttonX = this.x + this.width / 6;
    this.buttonY = this.y + this.height * 0.35;
    this.counterWidth = this.width * 0.26;
    this.counterHeight = this.height / 6;
    this.levelsToUpgradeCounterY = this.y - this.height * 0.35;
    this.displayPriceY = this.y;
    this.imageX = this.x - this.width / 3;
    this.imageSize = this.width / 6;
    
    // Generating all the stuff needed to run in menu
    this.levelsToUpgradeCounter = new NumberCounter(this.counterXLeft, this.levelsToUpgradeCounterY, this.counterWidth, this.counterHeight,
      "Level", this.upgItem.weaponLevel, this.upgItem.weaponLevel, weaponUpgradeData[this.upgItem.id].maxLevel, [79, 128, 176], true, priority, 0);
    this.displayPrice = new NumberCounter(this.counterXLeft, this.displayPriceY, this.counterWidth, this.counterHeight, "Price", 
      0, 0, 0, [79, 128, 176], false);
    this.displayDamage = new NumberCounter(this.counterXRight, this.levelsToUpgradeCounterY, this.counterWidth, this.counterHeight, 
      "New Damage", this.upgItem.stats.damage, 0, 0, [79, 128, 176], false);
    this.displayDurability = new NumberCounter(this.counterXRight, this.displayPriceY, this.counterWidth, this.counterHeight, "Max Dura.",
      weaponUpgradeData[this.upgItem.id].durability[str(this.upgItem.weaponLevel)], 0, 0, [79, 128, 176], false);
    this.upgradeButton = new Button(this.buttonX, this.buttonY, this.width * 0.3, this.height * 0.2, priority, "Upgrade!", 0, [76, 187, 23]);

    this.close = false;
  }

  run() {
    // Do upgrade if this.upgItem is valid, else set close to true
    if(this.upgItem) {
      // Run the background box and our "upgrade" button
      this.upgradeButton.run();
      this.levelsToUpgradeCounter.run();
      this.displayPrice.run();
      this.displayDamage.run();
      this.displayDurability.run();

      // See how many levels the player wants to upgrade, fetch price accordingly, then update price display
      let upgradeCost = 0;
      let levelsToUpgrade = this.levelsToUpgradeCounter.val - this.upgItem.weaponLevel;
      for(let i = this.upgItem.weaponLevel; i < levelsToUpgrade + this.upgItem.weaponLevel; i++) {
        upgradeCost += weaponUpgradeData[this.upgItem.id].price[str(i)];
      }
      this.displayPrice.val = upgradeCost;
      this.displayDamage.val = weaponUpgradeData[this.upgItem.id].damage[str(this.upgItem.weaponLevel + levelsToUpgrade)];
      this.displayDurability.val = weaponUpgradeData[this.upgItem.id].durability[str(this.upgItem.weaponLevel + levelsToUpgrade)];

      // Draw image of upgItem
      this.calcMouse();
      tint(255, 255);
      image(this.upgItem.img, this.imageX, this.y, this.imageSize, this.imageSize);

      // If upgradeButton clicked, check if enough cookies, if so do the upgrade then close window
      if(this.upgradeButton.alreadyClicked) {
        if(cookies < upgradeCost) {
          this.upgradeButton.alreadyClicked = false;
          // errorSound.play();
        }
        else {
          this.doUpgradeAndClose(upgradeCost, levelsToUpgrade);
        }
      }
    }

    // In case an invalid item loads or an item did not load, will just close menu
    else {
      this.close = true;
    }
  }

  doUpgradeAndClose(cost, levelsToUpgrade) {
    buttonSelect1.play();
    cookies -= cost;
    this.upgItem.weaponLevel += levelsToUpgrade;
    this.upgItem.stats.damage = weaponUpgradeData[this.upgItem.id].damage[str(this.upgItem.weaponLevel)];
    this.upgItem.stats.maxDurability = weaponUpgradeData[this.upgItem.id].durability[str(this.upgItem.weaponLevel)];
    openGlobalMessages.push(new GlobalMessage(this.x, this.y + this.height / 2 + this.width / 15 + 10, this.width, "Upraded to level " + str(this.upgItem.weaponLevel) + ".", 2000));
    this.close = true;
  }

  resize(x = 0, y = 0, width = 0, height = 0) {
    // Resize the window space
    this.x = x || this.x;
    this.y = y || this.y;
    this.width = width || this.width;
    this.height = height || this.height;

    // Resize everything needed for object placement
    this.counterXLeft = this.x;
    this.counterXRight = this.x + this.width / 3;
    this.buttonX = this.x + this.width / 6;
    this.buttonY = this.y + this.height * 0.35;
    this.counterWidth = this.width * 0.26;
    this.counterHeight = this.height / 6;
    this.levelsToUpgradeCounterY = this.y - this.height * 0.35;
    this.displayPriceY = this.y;
    this.imageX = this.x - this.width / 3;
    this.imageSize = this.width / 6;

    // Resize objects
    this.levelsToUpgradeCounter.resize(this.counterXLeft, this.levelsToUpgradeCounterY, this.counterWidth, this.counterHeight);
    this.displayPrice.resize(this.counterXLeft, this.displayPriceY, this.counterWidth, this.counterHeight);
    this.displayDamage.resize(this.counterXRight, this.levelsToUpgradeCounterY, this.counterWidth, this.counterHeight);
    this.displayDurability.resize(this.counterXRight, this.displayPriceY, this.counterWidth, this.counterHeight);
    this.upgradeButton.resize(this.buttonX, this.buttonY, this.width * 0.3, this.height * 0.2);
  }

}

class ItemInfoMenu extends GameObject {
  constructor(x, y, width, height, priority, theItem) {
    super(x, y, width, height);
    // Vars from input
    this.item = theItem;
    this.priority = priority;
  
    // Positioning and scaling of elements in info menu
    this.counterWidth = this.width * 0.4;
    this.counterHeight = this.height / 6;

    this.counterX = this.x + this.width / 5;
    this.damageDisplayY = this.y - this.height * 0.35;
    this.typeDisplayY = this.y - this.height * 0.05;
    this.durabilityDisplayY = this.y + this.height * 0.25;
    this.somethingDisplayY = this.y + this.height * 0.35;
    this.imageX = this.x - this.width / 4;
    this.imageSize = this.width / 4;
    this.tSize = this.imageSize / 7;
    this.textY = this.y + this.imageSize / 2 + this.tSize;
    
    // Generating all the stuff needed to run in menu
    this.typeText = this.item.weaponType.substr(0, 1).toUpperCase() + this.item.weaponType.substr(1);
    this.durabilityText = str(this.item.stats.durability) + "/" + str(this.item.stats.maxDurability);
    this.damageDisplay = new NumberCounter(this.counterX, this.damageDisplayY, this.counterWidth, this.counterHeight, "Damage", this.item.stats.damage, 0, 0, [79, 128, 176], false, this.priority);
    this.typeDisplay = new NumberCounter(this.counterX, this.typeDisplayY, this.counterWidth, this.counterHeight, "Type", this.typeText, 0, 0, [79, 128, 176], false, this.priority);
    this.durabilityDisplay = new NumberCounter(this.counterX, this.durabilityDisplayY, this.counterWidth, this.counterHeight, "Durability", this.durabilityText, 0, 0, [79, 128, 176], false, this.priority);
    this.close = false;
  }

  run() {
    if(this.item) {
      this.damageDisplay.run();
      this.typeDisplay.run();
      this.durabilityDisplay.run();
      
      this.calcMouse();
      tint(255, 255);
      image(this.item.img, this.imageX, this.y, this.imageSize, this.imageSize);

      textSize(this.tSize);
      textAlign(CENTER, TOP);
      text(this.item.name + "\nLevel: " + str(this.item.weaponLevel), this.imageX, this.textY);
    }

    else {
      this.close = true;
    }
  }

  resize(x = 0, y = 0, width = 0, height = 0) {
    // Resize area
    this.x = x || this.x;
    this.y = y || this.y;
    this.width = width || this.width;
    this.height = height || this.height;

    // Recalculate all vars for positioning
    this.counterWidth = this.width * 0.4;
    this.counterHeight = this.height / 6;

    this.counterX = this.x + this.width / 5;
    this.damageDisplayY = this.y - this.height * 0.35;
    this.typeDisplayY = this.y - this.height * 0.05;
    this.durabilityDisplayY = this.y + this.height * 0.25;
    this.somethingDisplayY = this.y + this.height * 0.35;
    this.imageX = this.x - this.width / 4;
    this.imageSize = this.width / 4;
    this.tSize = this.imageSize / 7;
    this.textY = this.y + this.imageSize / 2 + this.tSize;

    // Resize objects
    this.damageDisplay.resize(this.counterX, this.damageDisplayY, this.counterWidth, this.counterHeight);
    this.typeDisplay.resize(this.counterX, this.typeDisplayY, this.counterWidth, this.counterHeight);
    this.durabilityDisplay.resize(this.counterX, this.durabilityDisplayY, this.counterWidth, this.counterHeight);
  }
}

class NumberCounter extends GameObject {
  constructor(x, y, width, height, counterText = 0, startingVal = 0, min = 0, max = 0, rgb = 0, enabled, priority = 0) {
    super(x, y, width, height);
    // Vals from input
    this.enabled = enabled;
    this.val = startingVal || 0;
    this.min = min;
    this.max = max;
    this.priority = priority;
    this.rgb = rgb || [40, 40, 40];
    this.counterText = counterText || null;

    // Formatting, positioning, scaling
    this.numberTSize = this.width / 10;
    this.counterTSize = this.height / 2;
    this.textY = this.y + this.height * 0.5 + this.numberTSize;
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
    textAlign(CENTER, CENTER);
    textSize(this.counterTSize);
    text(str(this.val), this.x, this.y);

    rectMode(CENTER);
    fill(0);
    if(this.enabled) {
      rect(this.leftX, this.y, 5, 5);
      rect(this.rightX, this.y, 5, 5);
    }

    if(this.counterText) {
      textSize(this.numberTSize);
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
    let newVal = this.val + inc;
    if(newVal > this.max || newVal < this.min) {
      void 0;
      // errorSound.play();
    }
    else {
      this.val += inc;
    }
  }

  resize(x = 0, y = 0, width = 0, height = 0) {
    // Resize size of box
    this.x = x || this.x;
    this.y = y || this.y;
    this.width = width || this.width;
    this.height = height || this.height;

    // Recalculate positioning vars
    this.numberTSize = this.width / 10;
    this.counterTSize = this.height / 2;
    this.textY = this.y + this.height * 0.5 + this.numberTSize;
    this.leftX = this.x - this.width / 4;
    this.rightX = this.x + this.width / 4;
  }
}

class MemoryPuzzle extends GameObject {
  constructor(x, y, width, height, priority) {
    super(x, y, width, height);
    // Formats gameObject to be capped out at the height it was called with
    this.width = this.height > this.width ? this.width : this.height;
    this.playerMatches = 0;
    this.playerFailures = 0;
    this.playerWin;
    this.close = false;
    this.gamePhase = 0;
    this.priority = priority;
    this.topTextDuringPlayerGame = "Pick two";
    this.startGameButton = new Button(this.x, this.y, this.width * 0.4, this.width * 0.2, this.priority, "Start", 0, 0);

    // Formatting and positioning stuff
    this.cardSize = this.height / 5.5;
    this.cardSizeWithGap = this.cardSize * 1.1;
    this.cardToFlip = 0;
    this.tSizeTop = this.width / 11;
    this.tSizeCard = this.cardSize * 0.75;

    // Just for proper formatting of title text
    this.titleText = formatText("Win 100 cookies for winning!", this.width, this.tSizeTop / 1.5);

    this.topYCard = this.y - this.height * 0.41;
    this.topYText = this.y - this.height * 0.42;
    this.bottomYText = this.y + this.height * 0.35;
    this.leftX = this.x - this.width / 2;
    this.mouseXOffset = this.leftX;
    this.mouseYOffset = this.topYCard + this.height / 10;

    // Player input values
    this.cardMouseX;
    this.cardMouseY;

    // Time values
    this.timeToStartFlipping;
    this.flipNextCard;
    this.memoryCountdown;
    this.flipBackOverAfterGuess;
    this.closeGameTime;

    // Values that will be displayed on the cards
    this.cardValues = ["A", "B", "C", "D", "E", "F", "G", "H"];

    // Set up two arrays: one stores card values, other stores whether a card is "flipped" or not
    this.cardArray = [];
    this.cardFlipArray = [];
    this.playerChoices = [0, [null, null], [null, null]];
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

  resize(x = 0, y = 0, width = 0, height = 0) {
    // Resize size of box
    this.x = x || this.x;
    this.y = y || this.y;
    this.width = width || this.width;
    this.width = this.height > this.width ? this.width : this.height;
    this.height = height || this.height;

    // Formatting and positioning stuff
    this.cardSize = this.height / 5.5;
    this.cardSizeWithGap = this.cardSize * 1.1;
    this.cardToFlip = 0;
    this.tSizeTop = this.width / 11;
    this.tSizeCard = this.cardSize * 0.75;

    this.titleText = formatText("Win 100 cookies for winning!", this.width, this.tSizeTop / 1.5);

    this.topYCard = this.y - this.height * 0.41;
    this.topYText = this.y - this.height * 0.42;
    this.bottomYText = this.y + this.height * 0.35;
    this.leftX = this.x - this.width / 2;
    this.mouseXOffset = this.leftX;
    this.mouseYOffset = this.topYCard + this.height / 10;

    // Objects resize
    this.startGameButton.resize(this.x, this.y, this.width * 0.4, this.width * 0.2);
  }

  run() {
    this.calcMouse();

    // Formatting
    rectMode(CENTER);
    textAlign(CENTER, CENTER);

    this.displayTextDuringGame();
    if(this.gamePhase > 0) {
      this.drawCards();
      this.drawFailures();
    }
    // Run based on current phase
    if(this.gamePhase === 0) {
      this.runMenu();
    }
    if(this.gamePhase === 1) {
      this.runIntro();
    }
    if(this.gamePhase === 2) {
      this.runMemorize();
    }
    if(this.gamePhase === 3) {
      this.runPlayerGame();
    }
    if(this.gamePhase === 4) {
      this.runOutro();
    }
    
    
  }

  drawCards() {
    textSize(this.tSizeCard);
    for(let i = 0; i < 4; i++) {
      for(let j = 1; j < 5; j++) {
        stroke(0);
        strokeWeight(2);
        if(this.cardArray[i][j - 1]) {
          if(this.mouse && this.playerChoices[0] < 2 && this.gamePhase < 4 && this.cardMouseX === i && this.cardMouseY === j - 1) {
            fill(170);
          }
          else {
            fill(220);
          }
          rect(this.leftX + (i + 0.5) / 5 * this.width, this.topYCard + j / 5 * this.height, this.cardSize, this.cardSize);
          if(this.cardFlipArray[i][j - 1]) {
            fill(0);
            noStroke();
            text(this.cardArray[i][j - 1], this.leftX + (i + 0.5) / 5 * this.width, this.topYCard + j / 5 * this.height);
          }
        }
      }
    }
  }

  drawFailures() {
    // Draws the boxes that will contain x's when the player makes a mistake
    // Formatting
    textSize(this.tSizeCard);
    for(let i = 0; i < 3; i++) {
      stroke(0);
      strokeWeight(2);
      fill(178, 34, 34);
      rect(this.leftX + 0.9 * this.width, this.topYCard + (i + 1.5) / 5 * this.height, this.cardSize, this.cardSize);
      if(this.playerFailures > i) {
        fill(0);
        noStroke();
        text("X", this.leftX + 0.9 * this.width, this.topYCard + (i + 1.5) / 5 * this.height);
      }
    }
  }

  displayTextDuringGame() {
    // Formatting
    fill(0);
    noStroke();
    textSize(this.tSizeTop);

    // Text displayed on top during the minigame
    if(this.gamePhase === 0) {
      text("Memory Game", this.x, this.topYText);
      textSize(this.tSizeTop / 1.5);
      text(this.titleText, this.x, this.bottomYText);
    }
    else if(this.gamePhase === 1) {
      text("Memorize!", this.x, this.topYText);
    }
    else if(this.gamePhase === 2) {
      // This if else switches text from black to white
      if(Math.ceil((this.memoryCountdown - millis()) / 500) % 2) {
        fill(255);
      }
      else {
        fill(0);
      }
      // Tells player how many seconds left to memorize
      text(str(Math.floor((this.memoryCountdown - millis()) / 1000)) + " Seconds!", this.x, this.topYText);
    }
    else if(this.gamePhase > 2) {
      text(this.topTextDuringPlayerGame, this.x, this.topYText);
    }
  }

  runMenu() {
    // Run start game button. Once pressed, set times for animation and switch game phase
    this.startGameButton.run();
    if(this.startGameButton.alreadyClicked) {
      this.timeToStartFlipping = millis() + 1000;
      this.flipNextCard = millis() + 1100;
      this.gamePhase = 1;
    }
  }

  runIntro() {
    // Flip all the cards one by one so the player can start memorizing
    if(millis() > this.timeToStartFlipping) {
      if(millis() > this.flipNextCard) {
        this.cardFlipArray[this.cardToFlip % 4][Math.floor(this.cardToFlip / 4)] = 1;
        this.cardToFlip++;
        this.flipNextCard += 100;
        if(this.cardToFlip === 16) {
          this.gamePhase = 2;
          this.memoryCountdown = millis() + 6000;
        }
      }
    }
  }

  runMemorize() {
    // Checks if timer is up. If so, flip all cards back over and go to next game phase
    if(millis() >= this.memoryCountdown) {
      this.clearFlipArray();
      this.gamePhase = 3;
    }
  }

  runPlayerGame() {
    if(this.mouse && this.playerChoices[0] < 2) {
      if(this.playerFailures === 3) {
        // If a player guesses incorrectly 3 times, set the time to close game, set the win variable to false,
        // flip all cards over, and switch to the next game state
        this.playerWin = false;
        this.gamePhase = 4;
        this.closeGameTime = millis() + 3000;
        this.topTextDuringPlayerGame = "You lost!";
        for(let i = 0; i < 4; i++) {
          this.cardFlipArray[i] = [1, 1, 1, 1];
        }
      }
      else if(this.playerMatches === 8) {
        // Same as above, but win variable set to true, and prize added
        this.playerWin = true;
        this.gamePhase = 4;
        this.closeGameTime = millis() + 3000;
        this.topTextDuringPlayerGame = "You win!";
      }
      else {
        // Calculate which card player is hovering on, it is darkened in drawCards()
        this.cardMouseX = constrain(Math.floor((mouseX - this.mouseXOffset) / this.cardSizeWithGap), 0, 3);
        this.cardMouseY = constrain(Math.floor((mouseY - this.mouseYOffset) / this.cardSizeWithGap), 0, 3);
        if(mouseIsPressed && gMouse <= this.priority) {
          this.cardFlipArray[this.cardMouseX][this.cardMouseY] = 1;
          this.playerChoices[0]++;
          this.playerChoices[this.playerChoices[0]] = [this.cardMouseX, this.cardMouseY];
          gMouseToggle.val = this.priority + 1;
        }
      }
    }

    this.checkIfMatch();
  }
  
  runOutro() {
    if(millis() > this.closeGameTime) {
      this.close = true;
      if(this.playerWin) {
        cookies += 100;
      }
    }
  }

  clearFlipArray() {
    for(let i = 0; i < 4; i++) {
      this.cardFlipArray[i] = [0, 0, 0, 0];
    }
  }

  clearPlayerChoices() {
    this.playerChoices = [0, [null, null], [null, null]];
  }

  checkIfMatch() {
    // Once player has made two choices, see if the cards have the same value. If they do, change the top
    // text accordingly, remove them from game and add score if they are the same, then flip all back over after 1 sec
    if(this.playerChoices[0] === 2) {
      if(this.cardArray[this.playerChoices[1][0]][this.playerChoices[1][1]] === this.cardArray[this.playerChoices[2][0]][this.playerChoices[2][1]]) {
        this.topTextDuringPlayerGame = "Match!";
        this.playerMatches++;
        this.cardArray[this.playerChoices[1][0]][this.playerChoices[1][1]] = null;
        this.cardArray[this.playerChoices[2][0]][this.playerChoices[2][1]] = null;
      }
      else {
        this.topTextDuringPlayerGame = "Try again";
        this.playerFailures++;
      }
      this.playerChoices[0]++;
      this.flipBackOverAfterGuess = millis() + 1000;
    }
    else if(this.playerChoices[0] === 3 && millis() > this.flipBackOverAfterGuess) {
      this.clearFlipArray();
      this.clearPlayerChoices();
      this.topTextDuringPlayerGame = "Pick two";
    }
  }
}

class RhythmGame extends GameObject {
  constructor(x, y, width, height, priority) {
    super(x, y, width, height);
    // Vars
    this.priority = priority;
    this.gamePhase = 0;
    this.close = false;
    this.songChoice = null;
    this.currentScore = 0;

    // Song data
    this.songMetaData = [["My Name is Jonas", "Weezer"]];
    this.loadedSong = null;
    this.currentNotes = [];

    // Formatting and positioning of non-game elements
    this.tSizeTop = this.width / 20;
    this.tSizeBottom = this.width / 50;
    this.topY = this.y - this.height / 2;
    this.topYText = this.y - this.height * 0.42;
    this.bottomYText = this.y + this.height * 0.3;

    // Formatting and positioning of game elements
    this.beatsToDisplay = 8;
    this.trackBarWidth = this.width * 0.1;
    this.trackBarTopY = this.y - this.height * 0.45;
    this.trackBarBottomY = this.y + this.height * 0.45;    
    this.trackBarHeight = this.trackBarBottomY - this.trackBarTopY;
    this.trackBarCellHeight = this.height * 1 / 9;
    this.trackBarPositioning = [this.x - this.trackBarWidth * 3, this.x - this.trackBarWidth * 2, this.x - this.trackBarWidth, this.x, this.x + this.trackBarWidth];
    this.trackBarInputY = this.trackBarTopY + this.trackBarHeight - this.trackBarCellHeight;

    // Timing
    this.startSongTime;
    this.closeGameTime;
    this.noteUpdateInterval;
    this.ticks = 0;
    this.currentTickTime;

    // Interactive objects
    this.startGameButton = new Button(this.x, this.y, this.width / 4, this.width / 8, this.priority, "Play", 0, 0);
    this.songButtons = [];
    this.songButtons.push(new Button(this.x, this.y - this.height * 0.1, this.width / 4, this.width / 12, this.priority, "Song name", 0, 0));
    this.songButtons.push(new Button(this.x, this.y + this.height * 0.1, this.width / 4, this.width / 12, this.priority, "Not done", 0, 0));
    this.songButtons.push(new Button(this.x, this.y + this.height * 0.3, this.width / 4, this.width / 12, this.priority, "Not done", 0, 0));
    this.keyMap = new Map();

    // Event listener and interval IDs so I can clear them later
    this.interval_id;
    this.eventlistener1_id;
    this.eventlistener2_id;
  }

  resize(x = 0, y = 0, width = 0, height = 0) {
    // Resize size of box
    this.x = x || this.x;
    this.y = y || this.y;
    this.width = width || this.width;
    this.height = height || this.height;

    // Formatting and positioning of non-game elements
    this.tSizeTop = this.width / 20;
    this.tSizeBottom = this.width / 50;
    this.topY = this.y - this.height / 2;
    this.topYText = this.y - this.height * 0.42;
    this.bottomYText = this.y + this.height * 0.3;

    // Formatting and positioning of game elements
    this.beatsToDisplay = 8;
    this.trackBarWidth = this.width * 0.1;
    this.trackBarTopY = this.y - this.height * 0.45;
    this.trackBarBottomY = this.y + this.height * 0.45;    
    this.trackBarHeight = this.trackBarBottomY - this.trackBarTopY;
    this.trackBarCellHeight = this.height * 1 / 9;
    this.trackBarPositioning = [this.x - this.trackBarWidth * 3, this.x - this.trackBarWidth * 2, this.x - this.trackBarWidth, this.x, this.x + this.trackBarWidth];
    this.trackBarInputY = this.trackBarTopY + this.trackBarHeight - this.trackBarCellHeight;

    // Resize objects
    this.startGameButton.resize(this.x, this.y, this.width / 4, this.width / 8);
    this.songButtons[0].resize(this.x, this.y - this.height * 0.1, this.width / 4, this.width / 12);
    this.songButtons[1].resize(this.x, this.y + this.height * 0.1, this.width / 4, this.width / 12);
    this.songButtons[2].resize(this.x, this.y + this.height * 0.3, this.width / 4, this.width / 12);
  }

  run() {
    // Which phase?
    this.displayText();
    if(this.gamePhase === 0) {
      this.runMainMenu();
    }
    else if(this.gamePhase === 1) {
      this.runSelectMenu();
    }
    else if(this.gamePhase === 2) {
      this.runLoad();
    }
    else if(this.gamePhase === 3) {
      this.runMainGame();
    }
    else if(this.gamePhase === 4) {
      this.runRewards();
    }
  }

  displayText() {
    // Displays text based on gamePhase during minigame
    // Formatting
    textSize(this.tSizeTop);
    noStroke();
    fill(0);
    if(this.gamePhase === 0) {
      text("Rhythm Minigame", this.x, this.topYText);
      textSize(this.tSizeBottom);
      text("Hit notes to win cookies!", this.x, this.bottomYText);
    }
    else if(this.gamePhase === 1) {
      text("Select Song", this.x, this.topYText);
    }
    else if(this.gamePhase === 2) {
      text("Loading song...", this.x, this.topYText);
      textSize(this.tSizeTop * 0.7);
      text(this.songMetaData[this.songChoice][0] + "\nby " + this.songMetaData[this.songChoice][1], this.x, this.topYText + this.tSizeTop * 2);
    }
    else if(this.gamePhase === 3) {
      textSize(this.tSizeBottom);
      if(millis() < this.startSongTime) {
        text("Start in:\n" + str(Math.ceil((this.startSongTime - millis()) / 1000)), this.x + this.width * 0.3, this.y);
      }
      else {
        text("Score: " + str(this.currentScore), this.x + this.width * 0.3, this.y);
      }
    }
    else if(this.gamePhase === 4) {
      text("Congratulations!", this.x, this.topYText);
      textSize(this.tSizeBottom * 1.5); 
      text("You won " + str(this.currentScore) + " cookies!", this.x, this.y);
    }
  }

  runMainMenu() {
    // Runs play button, switches game phase when clicked
    this.startGameButton.run();
    if(this.startGameButton.alreadyClicked) {
      this.gamePhase = 1;
    }
  }

  runSelectMenu() {
    // Runs buttons allowing selection of song
    for(let i = 0; i < this.songButtons.length; i++) {
      this.songButtons[i].run();
      if(this.songButtons[i].alreadyClicked && i === 0) {
        this.songChoice = i;
        this.gamePhase = 2;
      }
    }
  }

  runLoad() {
    // Load the song, set up the event listeners which will handle key presses
    // I am using bind here so that the functions are called in the scope of the rhythm game
    // object, as opposed to the scope of "window"
    this.loadedSong = songs.myNameIsJonas;
    this.noteUpdateInterval = 1 / (this.loadedSong.bpm / 60) * 1000;
    // Also, setting these while also setting them as vars so I can save the ids so these
    // things are deleteable later
    this.interval_id = window.setInterval(this.updateNotes.bind(this), this.noteUpdateInterval);
    this.eventlistener1_id = window.addEventListener("keydown", this.keyPress.bind(this));
    this.eventlistener2_id = window.addEventListener("keyup", this.keyLift.bind(this));
    this.gamePhase = 3;
    this.startSongTime = millis() + 3000;
    myNameIsJonasSong.play(3);
  }

  runMainGame() {
    noStroke();
    strokeWeight(0);
    fill("green");
    rectMode(CORNER);
    // Fills in the input spaces with colour when the corresponding key is being pressed
    for(let theKey of this.keyMap.keys()) {
      if(theKey === "1") {
        rect(this.trackBarPositioning[0], this.trackBarInputY, this.trackBarWidth, this.trackBarCellHeight);
      }
      else if(theKey === "2") {
        rect(this.trackBarPositioning[1], this.trackBarInputY, this.trackBarWidth, this.trackBarCellHeight);
      }
      else if(theKey === "3") {
        rect(this.trackBarPositioning[2], this.trackBarInputY, this.trackBarWidth, this.trackBarCellHeight);
      }
      else if(theKey === "4") {
        rect(this.trackBarPositioning[3], this.trackBarInputY, this.trackBarWidth, this.trackBarCellHeight);
      }
    }

    fill(10, 240);
    // Fills in spaces with black notes as they should appear
    for(let i = 0; i < 7; i++) {
      if(this.currentNotes[i] && this.currentNotes[i][0] !== null) {
        for(let note of this.currentNotes[i]) {
          let tempY = this.trackBarTopY + this.trackBarHeight * i / this.beatsToDisplay;
          rect(this.trackBarPositioning[note], tempY, this.trackBarWidth, this.trackBarCellHeight);
        }
      }
    }

    stroke(0);
    strokeWeight(3);
    strokeCap(SQUARE);
    fill(0);
    // Vertical lines
    for(let i = 0; i < 5; i++) {
      line(this.trackBarPositioning[i], this.trackBarTopY, this.trackBarPositioning[i], this.trackBarBottomY);
    }
    // Horizontal lines
    for(let i = 0; i < this.beatsToDisplay + 1; i++) {
      let tempY = this.trackBarTopY + this.trackBarHeight * i / this.beatsToDisplay;
      line(this.trackBarPositioning[0], tempY, this.trackBarPositioning[4], tempY);
    }
  }

  runRewards() {
    if(millis() > this.closeGameTime) {
      cookies += this.currentScore;
      this.close = true;
    }
  }

  updateNotes() {
    // This ensures the first note crosses the line the second the song starts
    if(this.startSongTime - this.noteUpdateInterval * 8 < millis()) {
      let startTick = this.ticks - 8 >= 0 ? this.ticks - 8 : 0;
      // Use slice to get the chunk of notes that should currently be displayed
      this.currentNotes = this.loadedSong.noteArr.slice(startTick, this.ticks + 1);
      // This function also handles finishing the song
      if(this.ticks - this.loadedSong.noteArr.length > 8) {
        // Sets close game time, clears interval and listeners, stops song playing, switches gamePhase
        this.closeGameTime = millis() + 5000;
        window.clearInterval(this.interval_id);
        window.removeEventListener("keydown", this.eventlistener1_id);
        window.removeEventListener("keyup", this.eventlistener2_id);
        myNameIsJonasSong.stop();
        this.gamePhase = 4;
      }
      // If the song is done, push null so the notes keep moving until the song is done
      else if(this.ticks > this.loadedSong.noteArr.length) {
        for(let i = 0; i < this.ticks - this.loadedSong.noteArr.length; i++) {
          this.currentNotes.push([null]);
        }
      }
      // Reverse it so the notes move DOWN the board, not up
      this.currentNotes.reverse();
      this.ticks++;
      this.currentTickTime = millis();
      this.checkNoteHit();

    }
    // Then we are going to check if the player hit the last note
  }

  checkNoteHit() {
    // Fetch last note
    let notesToHit = this.currentNotes[7] ? this.currentNotes[7] : [null];
    if(notesToHit[0] !== null) {
      let scoreGainedThisTick = 0;
      // For each note in the last note
      for(let note of notesToHit) {
        // If that note exists in the key map (first note is 0, but in the key map it shows up as "1", hence str(note+1))
        if(this.keyMap.has(str(note + 1))) {
          // See if it was hit soon enough
          let timeDifference = Math.abs(this.keyMap.get(str(note + 1)) - this.currentTickTime);
          if(timeDifference < 75) {
            // Add some score if so
            scoreGainedThisTick += 50;
          }
        }
      }
      this.currentScore += scoreGainedThisTick;
    }
  }

  keyPress() {
    // In keyMap, keep track of what buttons are pressed and when they were pressed
    // This is used in the minigame to check if the buttons are pressed at the right time
    if(!this.keyMap.has(event.key)) {
      this.keyMap.set(event.key, millis());
    } 
  }

  keyLift() {
    // Once a key is lifted, delete it from keyMap
    this.keyMap.delete(event.key);
  }
}

let songs = {
  myNameIsJonas: {
    bpm: 372,
    noteArr: [[1], [3], [2], [1], [3], [2],
      [0], [2], [1], [0], [3], [2],
      [1], [3], [2], [1], [3], [2], 
      [0], [2], [1], [0], [3], [2],
      [1], [3], [2], [1], [3], [2],
      [0], [2], [1], [0], [3], [2],
      [1], [3], [2], [1], [3], [2], 
      [0], [2], [1], [0], [3], [2],
      [2, 3], [null], [2, 3], [null], [2, 3], [null],
      [1, 3], [null], [1, 3], [null], [1, 3], [null],
      [1, 2], [null], [1, 2], [null], [1, 2], [null],
      [0, 2], [null], [0, 2], [null], [0, 2], [null],
    ],
  },
};

class Message {
  constructor(message, delay = 0, preFunc = 0, whileFunc = 0, postFunc = 0) {
    this.message = message;
    this.delay = delay;
    this.preFunc = preFunc;
    this.whileFunc = whileFunc;
    this.postFunc = postFunc;
  }
}

class TextBox extends GameObject {
  constructor(x, y, width, height, priority, messageArr, tSize, id, preFunc = 0, whileFunc = 0, postFunc = 0) {
    super(x, y, width, height);
    // Vars
    this.priority = priority;
    this.messageArr = messageArr;
    this.tSize = tSize;
    this.id = id;
    this.skip = false;
    this.preFunc = preFunc;
    this.whileFunc = whileFunc;
    this.postFunc = postFunc;
    this.nextBlock = false;
    this.enter = false;

    // Call formatText on first message to ensure it fits width of text box (calls after this are handled on message switch)
    // Also grab the delay from the first message, calls after this also handled on message switch
    this.messageArr[0].message = formatText(this.messageArr[0].message, this.width, this.tSize);
    this.delay = millis() + messageArr[0].delay * 1000 || null;

    // Keep track of message functions, if they were done yet
    this.messagePreFuncRan = false;
    this.mainPreFuncRan = false;

    // Allows the writing of string to screen letter by letter
    this.messageBeingWritten = "";

    // Timing for the "click to continue" blinker after text is written
    this.blinkTimer = null;
    this.blinkOrientation = true;

    // Formatting stuff
    this.leftX = this.x - this.width / 2;
    this.topY = this.y - this.height / 2;
    this.blinkX = this.x + this.width / 2 - 10;
    this.blinkY = this.y + this.height / 2 - 15;

    // For when all the text is exhausted
    this.close = false;

    // Use a bound function to allow enter to go to next message with an eventListener
    this.enterFunction = this.enterPress.bind(this);
    window.addEventListener("keydown", this.enterFunction);
  }
 
  run() {
    // Run functions at the right time 
    this.calcMouse();
    if(!this.mainPreFuncRan && this.preFunc) {
      this.preFunc();
    }
    else {
      this.mainPreFuncRan = true;
    }

    if(this.whileFunc) {
      this.whileFunc();
    }

    gMouseToggle.bound = this.priority;

    if(this.messageArr[0].preFunc && !this.messagePreFuncRan) {
      this.messageArr[0].preFunc();
      this.messagePreFuncRan = true;
    }

    // Check whether or not to skip while running the message's whileFunc
    else if(this.messageArr[0].whileFunc) {
      let whileFuncCheck = this.messageArr[0].whileFunc();
      if(whileFuncCheck === "skip") {
        this.skip = true;
      }
      else if(!(whileFuncCheck === undefined || whileFuncCheck === true)) {
        this.nextBlock = true;
      }
      else {
        this.nextBlock = false;
      }
    }

    // If the message has a delay, nothing happens until the delay has passed
    if(this.delay !== null && millis() > this.delay) {
    // Formatting
      rectMode(CENTER);
      stroke(255);
      fill(0);
      textAlign(LEFT, TOP);
      textSize(this.tSize);
   
      // Draw the rectangle
      rect(this.x, this.y, this.width, this.height);

      // Add new letter every frame until all letters added
      if(this.messageBeingWritten.length !== this.messageArr[0].message.length) {
        this.messageBeingWritten += this.messageArr[0].message[this.messageBeingWritten.length];
      }
    
      // Once all letters added, add a little up down blinker that moves every 500ms
      // If nextBlock remains true, this will never fire, the blinker will never appear
      else if (!this.nextBlock && this.blinkTimer === null) {
        this.blinkTimer = millis() + 500;
      }
      else if (this.blinkTimer) {
      // "true" is up, "false" is down
        if(millis() > this.blinkTimer) {
          this.blinkOrientation = !this.blinkOrientation;
          this.blinkTimer = millis() + 500;
        }
        fill(0);
        if(this.blinkOrientation) {
          rect(this.blinkX, this.blinkY, 5, 5);
        }
        else {
          rect(this.blinkX, this.blinkY + 5, 5, 5);
        }
      }

      // Draw text at current length, if box clicked on switch to next message,
      // else delete self from text boxes map
      noStroke();
      fill(255);
      text(this.messageBeingWritten, this.leftX + 5, this.topY + 5);
      // On skip call from message func, or enter press when next is not blocked, or mouse press when x is not blocked, move to next msg
      if(this.skip || this.enter && !this.nextBlock || !this.nextBlock && mouseIsPressed && this.mouse && gMouse <= this.priority) {
        this.messageBeingWritten = "";
        this.skip = false;
        this.nextBlock = false;
        this.enter = false;
        this.blinkTimer = null;
      
        if(this.messageArr[0].postFunc) {
          this.messageArr[0].postFunc();
        }

        // Slice so that message "1" is now message "0", moving forward
        gMouseToggle.val = this.priority + 1;
        if(this.messageArr[1]) {
          this.messageArr = this.messageArr.slice(1);
          this.messageArr[0].message = formatText(this.messageArr[0].message, this.width, this.tSize);
          this.delay = this.messageArr[0].delay * 1000 + millis() || null;
        }

        else {
        // Destroy self and remove enter event listener
          window.removeEventListener("keydown", this.enterFunction);
          if(this.postFunc) {
            this.postFunc();
          }
          openTextBoxes.delete(this.id);
        }
      }
    }
  }

  enterPress() {
    this.enter = true;
  }
}

class Battle {
  constructor(level, name) {
    this.level = level;
    this.name = name;
    this.battlePhase = 1;
    this.map = battleMaps["1"];
    this.difficulty = "easy";

    // Controls amount of tiles drawn to screen
    this.gridRows = 20;
    this.gridCols = 40;
    this.tileWidth = width / this.gridCols;
    this.tileHeight = height / this.gridRows;

    // [x, y] coord of mouse in terms of tile
    this.mCoord = [];

    // Player/game data
    this.health = 100;
    this.round = 1;
    this.money = 100;
    this.roundInProgress = false;
    this.towerLocations = [];

    // Enemies
    this.enemies = [];
    this.projectiles = [];
    this.enemiesDefeated = 0;
    this.totalEnemyCountThisRound = 0;

    // Positioning
    this.positions = {
      dataRectX: width * 0.03,
      dataRectY: height * 0.94 + 2,
      dataRectWidth: width * 0.3,
      dataRectHeight: height * 0.06,

      menuRectX: width * 0.6 + 2,
      menuRectY: height * 0.88 + 2,
      menuRectWidth: width * 0.4,
      menuRectHeight: height * 0.12,

      healthX: width * 0.04,
      healthY: height * 0.975,

      moneyX: width * 0.96,
      moneyY: height * 0.86,

      roundX: width * 0.04 * 3.5,

      heartX: width * 0.04 * 2.5,
    };

    this.scalars = {
      dataTSize: width * 0.015,
      heartSize: width * 0.025,

      cookieGunScalar: cookieGun.height / cookieGun.width,
    };

    // Phase 0
    this.animCreated = false;

    // Interactive objects
    this.beginRoundFunc = this.startRound.bind(this);
    this.beginRoundButton = new Button(width / 2, height * 0.9, width * 0.1, height * 0.075, 0, "Start Round", this.beginRoundFunc, 0);

    this.purchasedTower = null;

    this.towerImageButtons = [];
    let cookieGunFunc = function() {
      if(gMouse <= 0 && this.money >= 65) {
        this.purchasedTower = "cookieGun";
        this.money -= 65;
      }
    }.bind(this);
    this.towerImageButtons.push(new ImageButton(width * 0.68, height * 0.92, width * 0.06, width * 0.06 * this.scalars.cookieGunScalar, 1, cookieGun, cookieGunFunc, 1, "Cookie Gun"));
  }

  run() {
    if(this.battlePhase === 0) {
      // Do the intro animation, the animation will switch the battle phase
      if(!this.animCreated) {
        this.introAnim();
      }
    }


    else if(this.battlePhase === 1) {
      // Do all the game stuff in the right order
      this.fillTiles();
      this.mouseTile();
      this.drawGrid();
      this.drawTowers();
      this.drawProjectiles();
      this.displayData();
      this.displayMenu();
      this.displayButtons();
      if(this.purchasedTower) {
        this.purchaseFunc();
      }

      if(this.roundInProgress) {
        if(this.enemiesDefeated === this.totalEnemyCountThisRound) {
          this.endRound();
        }
        this.runEnemies();
        this.operateTowers();
      }
    }
  }

  purchaseFunc() {
    gMouseToggle.bound = 1;
    // If the player has purchased a tower and is holding it, draw it depending on type.
    // Each if statement for type tells what to do when the tower is placed
    if(this.purchasedTower === "cookieGun") {
      image(cookieGun, mouseX, mouseY, 50, 50 * this.scalars.cookieGunScalar);
      if(mouseIsPressed && gMouse <= 1) {
        let theTile = [this.mCoord[0], this.mCoord[1]];
        if(this.map.graphic[theTile[1]][theTile[0]] !== 1) {
          this.towerLocations.push(theTile);
          this.map.player[theTile[1]][theTile[0]] = new BattleTower(theTile, "cookieGun", this.tileWidth, this.tileHeight);
          this.purchasedTower = null;
        }
      }
    }
  }

  introAnim() {
    // Spawns the "level 1" thing animation
    let animFunc = function() {
      this.battlePhase = 1;
    }.bind(this);
    let animMsg = "Level " + str(this.level) + ":\n" + this.name + "\n\n\nBattle!";
    startAnimation(animations.blackScrollFullMessage, 0, 0, animFunc, animMsg);
    this.animCreated = true;
  }

  drawGrid() {
    // Draw the grid
    stroke(0, 100);
    strokeWeight(1);
    for(let i = 1; i < this.gridRows; i++) { // Rows
      let tempY = i / this.gridRows * height;
      line(0, tempY, width, tempY);
    }
    for(let i = 1; i < this.gridCols; i++) { // Columns
      let tempX = i / this.gridCols * width;
      line(tempX, 0, tempX, height);
    }
  }

  drawTowers() {
    // Looks up where all the towers are in battleMaps and draws them
    for(let coord of this.towerLocations) {
      let theTile = this.map.player[coord[1]][coord[0]];
      if(theTile.type === "cookieGun") {
        theTile.displayRadius();
        image(theTile.image, theTile.x, theTile.y, this.tileWidth, this.tileHeight * this.scalars.cookieGun);
      }
    }
  }
  
  drawProjectiles() {
    // Looks up all the projectiles and draws them
    for(let i = 0; i < this.projectiles.length; i++) {
      this.projectiles[i].run();
      if(this.projectiles[i].hitEnemy) {
        this.projectiles.splice(i, 1);
      }
    }
  }
  
  operateTowers() {
    for(let coord of this.towerLocations) {
      // For each tower the player has, identify it, let it detect what enemy to target
      // (if any), and attack it. Then check if it killed an enemy
      let theTower = this.map.player[coord[1]][coord[0]];
      theTower.detectNearestEnemy(this.enemies);
      let killCheck = theTower.attack(this.enemies, this.projectiles);
      if(killCheck === 1) {
        this.enemiesDefeated++;
      }
    }
  }

  mouseTile() {
    // Calculate tile mouse is in
    void 0;
    let x = Math.floor(mouseX / (width / this.gridCols));
    let y = Math.floor(mouseY / (height / this.gridRows));
    this.mCoord = [x, y];

    // Fill the tile
    let rectX = x / this.gridCols * width;
    let rectY = y / this.gridRows * height;
    if(mouseIsPressed) {
      fill(20, 100);
    }
    else {
      fill(20, 75);
    }

    noStroke();
    rectMode(CORNER);
    rect(rectX, rectY, this.tileWidth, this.tileHeight);
  }

  fillTiles() {
    // Fills the tiles based on the map
    rectMode(CORNER);
    for(let i = 0; i < this.gridCols; i++) {
      let rectX = i / this.gridCols * width;
      for(let j = 0; j < this.gridRows; j++) {
        let rectY = j / this.gridRows * height;
        if(this.map.graphic[j][i] === 1) {
          fill(197, 178, 128);
        }
        else {
          fill(34, 139, 34);
        }
        rect(rectX, rectY, this.tileWidth, this.tileHeight);
      }
    }
  }

  displayButtons() {
    // Just displays start round if a round is not in progress
    if(!this.roundInProgress) {
      this.beginRoundButton.run();
    }
  }

  displayMenu() {
    // Display how much money player has
    textAlign(CENTER, CENTER);
    text("$" + str(this.money), this.positions.moneyX, this.positions.moneyY);

    // Draw the box for the menu
    rectMode(CORNER);
    fill(119, 136, 153, 255);
    stroke(0);
    strokeWeight(2);
    rect(this.positions.menuRectX, this.positions.menuRectY, this.positions.menuRectWidth, this.positions.menuRectHeight, 7, 0, 0, 0);

    for(let tower of this.towerImageButtons) {
      tower.run();
    }
    text("$65", width * 0.72, height * 0.92);
  }

  startRound() {
    this.spawnEnemies();
    this.totalEnemyCountThisRound = battleSpawns[this.difficulty][str(this.round)][0];
    this.roundInProgress = true;
  }

  spawnEnemies() {
    // Look up the enemies to spawn for the round number based on difficulty
    let enemiesToSpawn = battleSpawns[this.difficulty][str(this.round)].slice(1);
    // For each arr in enemiesToSpawn, basically each enemy type, spawn that type
    // with correct number, level, and interval between spawnings specified by data
    for(let arr of enemiesToSpawn) {
      let spawnFunc = function(level, type) {
        this.enemies.push(new BattleEnemy(this.tileWidth * 0.8, type, level, "right", this.map));
      }.bind(this);
      for(let i = 0; i < arr[2]; i++) {
        let levelToPass = arr[1];
        let typeToPass = arr[0];
        window.setTimeout(spawnFunc, i * arr[3], levelToPass, typeToPass);

      }
    }
  }

  runEnemies() {
    // Runs backwards through enemy array, first running them enemies then checking if they
    // are dead. If they are dead, grant correct reward and delete them from array, incrementing enemiesDefeated
    let count = this.enemies.length - 1;
    for(let i = count; i >= 0; i--) {
      this.enemies[i].display();
      this.enemies[i].move();
      if(this.enemies[i].dead) {
        this.money += battleRewardData.killRewards[this.enemies[i].type][this.enemies[i].level - 1];
        this.enemies.splice(i, 1);
        this.enemiesDefeated++;
      }
    }
  }

  endRound() {
    // Resets vars and gives a reward
    this.roundInProgress = false;
    this.enemies = [];
    this.enemiesDefeated = 0;
    this.totalEnemyCountThisRound = 0;
    this.money += battleRewardData[this.difficulty][str(this.level)][this.round];
    this.round++;
  }

  displayData() {
    // Box for data at bottom of screne
    fill(119, 136, 153, 255);
    stroke(0);
    strokeWeight(2);
    rectMode(CORNER);
    rect(this.positions.dataRectX, this.positions.dataRectY, this.positions.dataRectWidth, this.positions.dataRectHeight, 7, 7, 0, 0);

    // Text showing how much health player has
    textAlign(LEFT, CENTER);
    textSize(this.scalars.dataTSize);
    fill(0);
    noStroke();
    text(str(this.health), this.positions.healthX, this.positions.healthY);
    text("Round: " + str(this.round), this.positions.roundX, this.positions.healthY);

    // Heart next to health
    image(heart, this.positions.heartX, this.positions.healthY, this.scalars.heartSize, this.scalars.heartSize);
  }
  
  tileCenterCalc(x, y) {
    let xPos = x / this.gridCols * width + this.tileWidth / 2;
    let yPos = y / this.gridRows * height + this.tileHeight / 2;
    return [xPos, yPos];
  }
}

// So that enemies know which number on my map corresponds to which direction
let dMap = new Map();
dMap.set(2, "up");
dMap.set(3, "right");
dMap.set(4, "down");
dMap.set(5, "left");

class BattleEnemy {
  constructor(size, enemyType, level, startingDirection, map) {
    // Set up vars
    this.width = size;
    this.level = level;
    this.direction = startingDirection;
    this.distance = 0;
    this.gridRows = 20;
    this.gridCols = 40;
    this.map = map;
    this.tile = this.map.startTile.slice();
    this.dead = false;

    // Set up more vars based on enemy type
    if(enemyType === "goblin") {
      this.type = "goblin";
      this.imageSet = goblin;
      this.speed = 2.5;
    }
    if(enemyType === "giant") {
      this.type = "giant";
      this.imageSet = giant;
      this.speed = 4;
    }

    this.maxHP = enemyData[this.type][str(this.level)];
    this.hitpoints = this.maxHP;

    // Initial positioning, all positioning in this class designed to keep centre of image
    // in centre of tiles on screen
    this.height = this.width * this.imageSet[this.direction].height / this.imageSet[this.direction].width;
    this.x = this.tile[0] / this.gridCols * width + this.width / 2;
    this.y = this.tile[1] / this.gridRows * height + this.width / 2;
    
    // Figure out where to put the health bar
    this.positions = {
      healthBarWidth: 30,
      healthBarHeight: 7,
      healthBarX: this.x - 30 / 2,
      healthBarY: this.y - this.height / 2 - 7 / 2 - 2,
    };
  }

  display() {
    // Display the enemy
    imageMode(CENTER);
    image(this.imageSet[this.direction], this.x, this.y, this.width, this.height);

    if(this.hitpoints !== this.maxHP) {
      if(this.hitpoints === 0) {
        this.dead = true;
      }
      // HP Bar red filling
      let hpWidth = this.hitpoints / this.maxHP * this.positions.healthBarWidth;
      noStroke();
      fill("red");
      rect(this.positions.healthBarX, this.positions.healthBarY, hpWidth, this.positions.healthBarHeight);

      // HP Bar outline
      rectMode(CORNER);
      strokeWeight(1);
      stroke(0);
      fill(255, 0);
      rect(this.positions.healthBarX, this.positions.healthBarY, this.positions.healthBarWidth, this.positions.healthBarHeight);
    }
  }

  move() {
    // Moved based on direction and on speed (also moves the health bar by same amount)
    this.distance += this.speed;
    if(this.direction === "right") {
      this.x += this.speed;
      this.positions.healthBarX += this.speed;
    }
    else if(this.direction === "up") {
      this.y -= this.speed;
      this.positions.healthBarY -= this.speed;
    }
    else if(this.direction === "down") {
      this.y += this.speed;
      this.positions.healthBarY += this.speed;
    }
    else if(this.direction === "left") {
      this.positions.healthBarX -= this.speed;
      this.x -= this.speed;
    }

    // After moving, check if the tile we are on now is different
    // If it is different, check if we need to change direction
    let oldTile = this.tile.slice();
    this.calcTile();
    if (oldTile[0] !== this.tile[0] || oldTile[1] !== this.tile[1]) {
      this.direction = this.changeDirection();
    }
  }

  calcTile() {
    // The formulas used here are the reverse of the other positioning formulas, designed
    // to extrapolate tile from x or y pos. Need to use "floor" or "ceil" when going different
    // directions in order to correctly calculate if we have moved fully onto a new tile
    if(this.direction === "right") {
      this.tile[0] = Math.floor((this.x - this.width / 2) * this.gridCols / width);
    }
    else if(this.direction === "up") {
      this.tile[1] = Math.ceil((this.y - this.width / 2) * this.gridRows / height);
    }
    else if(this.direction === "down") {
      this.tile[1] = Math.floor((this.y - this.width / 2) * this.gridRows / height);
    }
    else if(this.direction === "left") {
      this.tile[0] = Math.ceil((this.x - this.width / 2) * this.gridCols / width);
    }
  }

  changeDirection() {
    // Check the direction map from the current map to see if we need to change direction
    // If so, switch this.direction by accessing dMap to see what direction the data is indicating
    // Also moves health bar
    let theDirection = dMap.get(this.map.direction[this.tile[1]][this.tile[0]]);
    if(theDirection && theDirection !== this.direction) {
      this.x = this.tile[0] / this.gridCols * width + this.width / 2;
      this.y = this.tile[1] / this.gridRows * height + this.width / 2;
      this.healthBarX = this.x - 30 / 2;
      this.healthBarY = this.y - this.height / 2 - 7 / 2 - 2;
      return theDirection;
    }
    else {
      return this.direction;
    }

  }
}

class BattleTower {
  constructor(tile, towerType, tileWidth, tileHeight) {
    // Take in vars
    this.tile = tile;
    this.gridCols = 40;
    this.gridRows = 20;
    this.x = tile[0] / this.gridCols * width + tileWidth / 2;
    this.y = tile[1] / this.gridRows * height + tileHeight / 2;
    
    // Set own vars depending on type
    if(towerType === "cookieGun") {
      this.type = "cookieGun";
      this.hitSpeed = 500;
      this.cooldown = 0;
      this.damage = 1;
      this.image = cookieGun;
      this.radius = tileWidth * 7;
    }
  }

  // Show the circle where enemies can be hit
  displayRadius() {
    fill(220, 50);
    ellipse(this.x, this.y, this.radius);
  }

  detectNearestEnemy(enemies) {
    if(millis() > this.cooldown) {
      // First find all enemies within the radius of the tower
      let enemiesInRadius = [];
      for(let i = 0; i < enemies.length; i++) {
        let distanceFromEnemy = dist(this.x, this.y, enemies[i].x, enemies[i].y);
        if(distanceFromEnemy <= this.radius / 2) {
          enemiesInRadius.push(i);
        }
      }
      // Compare the distances of all enemies within radius to determine the one to be shot at
      let mostDistance = 0;
      let nearestEnemy = null;
      for(let enemy of enemiesInRadius) {
        if (enemies[enemy].distance > mostDistance) {
          mostDistance = enemies[enemy].distance;
          nearestEnemy = enemy;
        }
      }
      this.targetedEnemy = nearestEnemy;
    }
  }

  attack(enemies, projectiles) {
    // Knowing which enemy is nearest, spawn a projectile that will travel toward it and damage it
    if(millis() > this.cooldown && this.targetedEnemy !== null) {
      let projectileFunc = function(damage) {
        this.hitpoints -= damage;
      }.bind(enemies[this.targetedEnemy]);
      projectiles.push(new BattleProjectile(this.x, this.y, 10, enemies[this.targetedEnemy], "cookieBullet", this.damage, projectileFunc));
      this.cooldown = millis() + this.hitSpeed;
    }
  }
}

class BattleProjectile {
  constructor(x, y, size, enemy, type, damage, func) {
    // Various vars
    this.x = x;
    this.y = y;
    this.size = size;
    this.enemy = enemy;
    this.damage = damage;
    this.func = func;
    
    // Based on type, set more vars
    if(type === "cookieBullet") {
      this.type = "cookieBullet";
      this.speed = 10;
      this.pImage = projectiles.cookieBullet;
    }

    // Based on enemy, set angle, speed, etc.
    this.destX = this.enemy.x;
    this.destY = this.enemy.y;
    this.angle = Math.atan((this.destX - this.x) / (this.destY - this.y));
    this.dx = this.destY < this.y ? Math.sin(this.angle) * -this.speed : Math.sin(this.angle) * this.speed;
    this.dy = this.destY < this.y ? Math.cos(this.angle) * -this.speed : Math.cos(this.angle) * this.speed;
    
    // Used to keep track of when enemy was hit. When they are, do damage and despawn projectile
    this.hitEnemy = false;
  }


  run() {
    // Every 5 frames, look up the enemy's location so as to keep the projectile continuously moving toward the enemy seamlessly
    if(frameCount % 5 === 0) {
      this.reCalculateDest();
    }

    // Use calculates dx and dy to move toward enemy
    image(this.pImage, this.x, this.y, this.size, this.size);
    this.x += this.dx;
    this.y += this.dy;

    // Based on the 4 cases, do damage once one of those cases is met
    if(this.dx < 0 && this.x <= this.destX) { // left
      if(this.dy > 0 && this.y >= this.destY) { // down
        this.doDamage();
      }
      else if(this.dy < 0 && this.y <= this.destY) { // up
        this.doDamage();
      }
    }
    else if(this.dx > 0 && this.x >= this.destX) { // right
      if(this.dy > 0 && this.y >= this.destY) { // down
        this.doDamage();
      }
      else if(this.dy < 0 && this.y <= this.destY) { // up
        this.doDamage();
      }
    }
  }

  doDamage() {
    // Use the passed function to damage the targeted enemy
    this.func(this.damage);
    this.hitEnemy = true;
  }

  reCalculateDest() {
    // Find the enemy's location and re-do the math to calculate where to go and how fast
    this.destX = this.enemy.x;
    this.destY = this.enemy.y;
    this.angle = Math.atan((this.destX - this.x) / (this.destY - this.y));

    this.dx = this.destY < this.y ? Math.sin(this.angle) * -this.speed : Math.sin(this.angle) * this.speed;
    this.dy = this.destY < this.y ? Math.cos(this.angle) * -this.speed : Math.cos(this.angle) * this.speed;
  }
}

class HelpText extends GameObject {
  constructor(x, y, width, height, text) {
    super(x, y, width, height);
    this.tSize = this.width / 25;
    this.text = formatText(text, this.width, this.tSize);

    // Positioning
    this.leftX = this.x - this.width / 2 + this.tSize / 2;
    this.topY = this.y - this.height / 2 + this.tSize / 2;
  }

  run() {
    fill(0);
    noStroke(0);
    textAlign(LEFT, TOP);
    textSize(this.tSize);
    text(this.text, this.leftX, this.topY);
  }

  resize(x = 0, y = 0, width = 0, height = 0) {
    // Move box
    this.x = x || this.x;
    this.y = y || this.y;
    this.width = width || this.width;
    this.height = height || this.height;

    // Recalculate positioning and sizing
    this.tSize = this.width / 25;
    this.text = formatText(this.text, this.width, this.tSize);
    this.leftX = this.x - this.width / 2 + this.tSize / 2;
    this.topY = this.y - this.height / 2 + this.tSize / 2;
  }
}