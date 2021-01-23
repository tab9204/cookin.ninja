import {lightbox} from './data.js';

var initialX = null;
var initialY = null;

function attachEventHandlers(){
  var lightbox =  document.getElementsByClassName("lightbox")[0];
  //swipe commands
  lightbox.addEventListener("touchstart", startTouch);
  lightbox.addEventListener("touchmove", moveTouch);

};

function startTouch(e) {
  initialX = e.touches[0].clientX;
  initialY = e.touches[0].clientY;
};

function moveTouch(e) {
  if (initialX === null) {
    return;
  }
  if (initialY === null) {
    return;
  }
  var currentX = e.touches[0].clientX;
  var currentY = e.touches[0].clientY;
  var diffX = initialX - currentX;
  var diffY = initialY - currentY;
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // sliding horizontally
    if (diffX > 0) {
      // swiped left
      console.log("swiped left");
      lightbox.close();
    } else {
      // swiped right
      console.log("swiped right");
    }
  } else {
    // sliding vertically
    if (diffY > 0) {
      // swiped up
        console.log("swiped up");
    } else {
      // swiped down
      console.log("swiped down");
    }
  }
  initialX = null;
  initialY = null;
  e.preventDefault();
};

export{attachEventHandlers};
