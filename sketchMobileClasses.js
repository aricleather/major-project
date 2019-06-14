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

class ButtonMobile extends GameObject {
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
    this.checkClicked();

    return this.alreadyTouched;
      
  }

  checkClicked() {
    if(this.touched) {
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