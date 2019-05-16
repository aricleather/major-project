// Classes that when run play animations, which may be interactive (ex. intro animation, prompting for player name)

class TitleScreenAnimation1 {
  constructor() {
    // Vars
    this.animationPhase = 0;
    this.titleText = "Cookie Clicker";
    this.currentText = "";
    this.tSize = 75 * scalars.textScalar;

    // This gets the right x value so that, after typing anim is complete, the text is centered
    this.x = width / 2 - this.tSize * this.titleText.length / 2;
    this.y = height * 0.2;
    this.showNextLetter = millis() + 2000;

    // Toggles that little line where you are currently typing to be blinking or not during the anim
    this.blinkToggle = true;
    this.button = titleNewGameButton;
  }

  run() {
    gMouseToggle.val = 1;
    gameState = 4;
    background(0);

    if(this.animationPhase === 0) {
      // After 2000ms, then after each 125ms, add a letter onto the title text for a typing effect
      this.formatText();
      text(this.currentText, this.x, this.y);
      this.blinkingTextLine();

      if(millis() > this.showNextLetter) {
        this.blinkToggle = false;
        this.currentText = this.currentText + this.titleText[this.currentText.length];
        random([keyType1, keyType2]).play();
        this.showNextLetter = millis() + 125;
        // Once the whole title is on the screen
        if(this.currentText.length === this.titleText.length) {
          this.animationPhase = 1;
          this.showButton = millis() + 2500;
        }
      }
    }

    else if(this.animationPhase === 1) {
      // Keep the text constant and line blinking now, the new game button will come in
      this.formatText();
      text(this.titleText, this.x, this.y);
      this.blinkToggle = true;
      this.blinkingTextLine();

      if(millis() > this.showButton) {
        // When the button is clicked, this if will become true, starting next phase
        if(this.button.run()) {
          this.animationPhase = 2;
          this.deleteNextLetter = millis() + 1000;
        }
      }
    }

    else if(this.animationPhase === 2) {
      // Now erases the letters from the title screen
      this.formatText();
      text(this.currentText, this.x, this.y);
      this.blinkingTextLine();
      if(millis() > this.deleteNextLetter) {
        this.blinkToggle = false;
        this.currentText = this.currentText.substring(0, this.currentText.length - 1);
        keyType2.play();
        this.deleteNextLetter = millis() + 125;
        if(this.currentText.length === 0) {
          this.animationPhase = 3;
          this.nextAnimation = millis() + 1500;
        }
      }
    }
    
    else if(this.animationPhase === 3) {
      this.blinkToggle = true;
      this.blinkingTextLine();
      if(millis() > this.nextAnimation) {
        void 0;
      }
    }
  }

  blinkingTextLine() {
    // If toggled, make the little line blink. If not, make it stay constant
    if(this.blinkToggle) {
      if(Math.floor(millis() / 500) % 2 === 0) {
        fill(255);
      }
      else {
        fill(0);
      }
    }
    else{
      fill(255);
    }

    // Formatting and draw the actual line
    noStroke();
    rectMode(CENTER);
    rect(this.x + textWidth(this.currentText) + 5, this.y, 3, this.tSize);
  }

  formatText() {
    textSize(this.tSize);
    textAlign(LEFT, CENTER);
    fill(255);
  }
}

animFunctions = {
  // Functions used in this .js file
  displayMessageOnScreen: function(theText, tSize, x, y, alpha) {
    // Displays the white text on black screen in animations
    textAlign(CENTER, TOP);
    textSize(tSize);
    fill(255, alpha);
    text(theText, x, y);
  },

  characterAdder: function(time, textToAddTo, textToAddFrom) {
    // Used in animations. If strings aren't of equal length, play textBlip and return a string
    // with one more character along with the time the next character should be added
    let returnText;
    if(millis() > time) {
      textBlip.play();
      returnText = textToAddTo + textToAddFrom[textToAddTo.length];
      return [returnText, returnText.substr(-1) === "\n" ? millis() + 1000 : millis() + 50];
    }
    else {
      return false;
    }
  },

  messageOnScreenAnim: function() {
    // Simply displays the currentText and runs characterAdder.
    // Used with .call(this) inside an animation so it can access and change necessary variables
    // Once animFunctions.characterAdder returns "done", this returns true, the animation code may do something then

    if(this.currentText.length !== this.fullText.length) {
      animFunctions.displayMessageOnScreen(this.currentText, this.tSize, this.x, this.y, 255);
      let textVar = animFunctions.characterAdder(this.nextLetterTime, this.currentText, this.fullText);

      if(textVar) {
        this.currentText = textVar[0];
        this.nextLetterTime = textVar[1];
        return false;
      }
      return false;
    }
    return true;
  },

  messageOnScreenFade: function() {
    // Changes the text alpha of thing called with and draws currentText to screen, returns true if text faded
    animFunctions.displayMessageOnScreen(this.currentText, this.tSize, this.x, this.y, this.textAlpha);
    if(millis() > this.fadeOutTime) {
      this.textAlpha -= 8.5;
    }
    return this.textAlpha <= 0;
  },
};

let gameMessages = {
  // Provides short intro where player is being spoken to. Player is asked for their name which
  // is stored as playerName using a textInput field.
  intro: [new Message("Hello."),
    new Message("You appear to be new here..."), 
    new Message("Tell me, what is your name?", function() {
      this.tempId = inputFieldIdCounter.val;
      openInputFields.set(this.tempId, new TextInput(width * 0.3 + 5, height * 0.85, width / 3, height * 0.03, 9, this.tempId));
    }, 
    function() {
      if(!openInputFields.get(this.tempId).endInput) {
        return false;
      }
      else {
        return "skip";
      }
    },
    function() {
      playerName = openInputFields.get(this.tempId).currentText;
      openInputFields.delete(this.tempId);
    }
    ), new Message("Come. There is lots to show you."),
    new Message("And we are running out of time...")],
};

let textBoxSpawners = {
  intro: function() {
    let tempId = textBoxIdCounter.val;
    openTextBoxes.set(tempId, new TextBox(width / 2, height * 0.8, width * 0.4, height * 0.15, 1, gameMessages.intro, width / 50, tempId, 0, function() {
      background(0);
    }, function() {
      gameState = 1;
    }));
  }
};

let animations = {
  blackScroll: {
    run: function() {
      rectMode(CORNER);
      fill(0);
      rect(0, 0, this.rectWidth, height);
      this.rectWidth += this.acc;
      this.acc *= 1.17;
      if(this.rectWidth >= width) {
        this.end = true;
      }
    },

    reset: function() {
      this.rectWidth = 0;
      this.end = false;
      this.acc = 1;
    },

    rectWidth: 0,
    end: false,
    acc: 1,
  },

  blackScrollReverse: {
    run: function() {
      rectMode(CORNER);
      fill(0);
      rect(width, 0, -width + this.rectWidth, height);
      this.rectWidth += this.acc;
      this.acc *= 1.17;
      if(this.rectWidth >= width) {
        this.end = true;
      }
    },

    reset: function() {
      this.rectWidth = 0;
      this.end = false;
      this.acc = 1;
    },

    rectWidth: 0,
    end: false,
    acc: 1,
  },
};