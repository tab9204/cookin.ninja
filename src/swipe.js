//element => the html element to attach the swipe commands to
//swipes => object containing the functions to run on left, right, up, and down swipes
class swiper {
  constructor(element, swipes) {
    this.element = element;
    this.swipes = swipes;
    this.initialX = null;
    this.initialY = null;
    this.attachEventHandlers();
  }
  attachEventHandlers(){//attached event handlers
    //swipe commands
    this.element.addEventListener("touchstart", (event) => this.startTouch(event));
    this.element.addEventListener("touchmove", (event) => this.moveTouch(event,this.swipes));

  }
  startTouch(e) {
    this.initialX = e.touches[0].clientX;
    this.initialY = e.touches[0].clientY;
  }
  moveTouch(e,swipes) {
    if (this.initialX === null) {
      return;
    }
    if (this.initialY === null) {
      return;
    }

    var currentX = e.touches[0].clientX;
    var currentY = e.touches[0].clientY;
    var diffX = this.initialX - currentX;
    var diffY = this.initialY - currentY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // sliding horizontally
      if (diffX > 0 && swipes.left) {
        // swiped left
        swipes.left();
      } else if(swipes.right) {
        // swiped right
        swipes.right();
      }
    } else {
      // sliding vertically
      if (diffY > 0 && swipes.up) {
        // swiped up
        swipes.up();
      } else if(swipes.down) {
        // swiped down
        swipes.down();
      }
    }

    this.initialX = null;
    this.initialY = null;
    e.preventDefault();
  }
}


export{swiper};
