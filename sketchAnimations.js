let gameMessages = {
  // Provides short intro where player is being spoken to. Player is asked for their name which
  // is stored as playerName using a textInput field.
  intro: [new Message("Hello.", 1),
    new Message("You appear to be new here...", 1), 
    new Message("Tell me, what is your name?", 0, function() {
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
    openTextBoxes.set(tempId, new TextBox(width / 2, height * 0.8, width * 0.4, height * 0.15, 1, gameMessages.intro, width / 50, tempId, function() {
      gameState = 4;
    }, function() {
      background(0);
    }, function() {
      startAnimation(animations.blackScrollHalf);
      gameState = 1;
    }));
  }
};

let animations = {
  blackScrollFull: {
    run: function() {
      rectMode(CORNER);
      fill(0);
      if(!this.reverse) {
        rect(0, 0, this.rectWidth, height);
        if(this.rectWidth >= width) {
          if(this.midFunc) {
            this.midFunc();
          }
          this.reverse = true;
          this.rectWidth = 0;
        }
      }
      else {
        rect(width, 0, -width + this.rectWidth, height);
        if(this.rectWidth >= width) {
          this.end = true;
        }
      }
      this.rectWidth += this.acc;
      this.acc = this.reverse ? this.acc /= 1.17 : this.acc *= 1.17;
    },

    reset: function() {
      this.rectWidth = 0;
      this.end = false;
      this.acc = 1;
      this.reverse = false;
    },

    reverse: false,
    rectWidth: 0,
    end: false,
    acc: 1,
  },

  blackScrollFullMessage: {
    run: function() {
      rectMode(CORNER);
      fill(0);
      if(!this.reverse) {
        rect(0, 0, this.rectWidth, height);
        if(this.rectWidth >= width) {
          if(this.delay === 0) {
            textSize(30);
            fill(0, this.alpha);
            text(this.message, width / 2, height / 2);
            if(this.alpha < 255) {
                
              this.alpha += 8.5;
            }
            else {
              this.delay = millis() + 1000;
            }
          }
          else if (millis() > this.delay) {
            if(this.midFunc) {
              this.midFunc();
            }
            this.reverse = true;
            this.rectWidth = 0;
          }
        }
      }
      else {
        rect(width, 0, -width + this.rectWidth, height);
        if(this.rectWidth >= width) {
          this.end = true;
        }
      }
      this.rectWidth += this.acc;
      this.acc = this.reverse ? this.acc /= 1.17 : this.acc *= 1.17;
    },
  
    reset: function() {
      this.rectWidth = 0;
      this.end = false;
      this.acc = 1;
      this.reverse = false;
      this.message = "";
      this.delay = 0;
      this.alpha = 0;
    },
  
    alpha: 0,
    delay: 0,
    message: "",
    reverse: false,
    rectWidth: 0,
    end: false,
    acc: 1,
  },

  blackScrollHalf: {
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