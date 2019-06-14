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
    if(this.touched && singleTouch) {
      this.touchFunc();
      this.alreadyTouched = 1;
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
    if(this.touched && singleTouch) {
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