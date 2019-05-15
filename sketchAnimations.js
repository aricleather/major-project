// Classes that when run play animations, which may be interactive (ex. intro animation, prompting for player name)



class NewGameAnimation {
  // Run automatically when new player detected. Introduces player, asks them their name
  constructor() {
    // Vars
    this.animationPhase = 0;
    this.lastAnimationPhase = null;
    this.toggleFadeBackground = false;
    this.fadeBackgroundAlpha = 255;

    this.tSize = width / 40;
    this.textAlpha = 255;
    this.x = width / 2;
    this.y = height / 3;

    this.texts = 
    [
      "A novice cookie baker, hmm...\n" +
      "Yes, I have been expecting you.\n" +
      "Come, we must begin.",
      "What is your name?",
      "Well, nice to meet you, ",
      "Let me guide you."];
    this.fullText = this.texts[this.animationPhase];

    this.input = new TextInput(width * 0.3, height * 0.8, 100, 100); // Used to ask player's name
    this.nextLetterTime = millis() + 500;
    this.fadeOutTime;
    this.currentText = "";
  }

  run() {
    // User cannot make any input during anim
    gMouseToggle.val = 2;
    

    if(this.toggleFadeBackground) {

      // Fade in the game using a rectangle being filled with a lowering alpha value
      fill(0, this.fadeBackgroundAlpha);
      rectMode(CORNER);
      rect(0, 0, width, height);
      this.fadeBackgroundAlpha -= 4.25;
      if(this.fadeBackgroundAlpha <= 0) {
        // Once game faded in, end animation
        animationState = false;
      }
    }

    else {
      background(0);
    
      // What is happening here? messageOnScreenAnim is called in the 'this' scope. When it becomes true (text is fully drawn),
      // the player name input comes up if animationPhase is 1. If not, setFadeTime() is called,
      // but it will only set this.fadeOutTime once due to a variable that tracks whether or not it has been done
      // Once messageOnScreenFade has reduced the alpha to 0, it becomes true, then nextPhase() is run, resetting
      // the process until all 4 animation phases have occured
      if(animFunctions.messageOnScreenAnim.call(this)) {
        if(this.animationPhase === 1 && !playerName) {
          animFunctions.displayMessageOnScreen(animFunctions.displayMessageOnScreen(this.currentText, this.tSize, this.x, this.y, this.textAlpha));
          // Links input to this.input so keyPressed can pass its event
          input = this.input;
          if(this.input.run()) {
            playerName = this.input.run();
            this.texts[2] += playerName + ".";
            input = null;
          }
        }

        else {
          this.setFadeTime();
          if(animFunctions.messageOnScreenFade.call(this)) {
            this.nextPhase();
          }
        }
      }
    }
  }

  setFadeTime() {
    if(this.animationPhase !== this.lastAnimationPhase) {
      this.fadeOutTime = millis() + 2500;
      this.lastAnimationPhase = this.animationPhase;
    }
  }

  nextPhase() {
    if(this.animationPhase === 3) {
      // Once all 4 are done, end the animation
      gameState = 1;
      this.toggleFadeBackground = true;
    }
    this.animationPhase += 1;
    this.fullText = this.texts[this.animationPhase];
    this.currentText = "";
    this.textAlpha = 255;
  }
}

class TitleScreenAnimation1 {
  // Unlike newGameAnimation, everything going on here only ever happens once,
  // so there is no need to compact it down into reoccuring functions like I did with newGameAnimation
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
    gameState = 3;
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
        startAnimation("newGameAnimation");
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