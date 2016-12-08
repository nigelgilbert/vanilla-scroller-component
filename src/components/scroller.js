"use strict";

import debounce from "debounce";
import TWEEN from "tween.js";
import tweener from "../services/tweener.js";
import "./scroller.css";

let tween = null;
let isAnimating = false;
let wheelHandler = null;
let scrollHandler = null;

export const Scroller = {
  draw: draw
}

function onLoad() {
  enableScrolling()
}

function onUnload() {}

function enableScrolling() {
  setTimeout(() => {
    window.onscroll = debounce(onScroll, 400);
    window.onmousewheel = debounce(onScroll, 400); 
  }, 250);
}

function disableScrolling() {
  window.onscroll = preventDefault;
  window.onmousewheel = preventDefault;
}

function preventDefault(event) {
  event = event || window.event;
  if (event.preventDefault) {
    event.preventDefault();
  }
  event.returnValue = false;  
}

function onScroll(event) {
  const topBufferRect = document.getElementById("top-buffer").getBoundingClientRect();
  if (!isAnimating && topBufferRect.bottom > 0) {
    beginAnimation(topBufferRect);
  }
}

function checkAnimationCompletion() {
  const topBufferRect = document.getElementById("top-buffer").getBoundingClientRect();
  if (topBufferRect.bottom <= 0 && tween !== null) {
    stopAnimation();
  }
}

function beginAnimation(bounds) {
  isAnimating = true;
  disableScrolling();
  
  const current = { y: window.pageYOffset };
  const target = { y: window.pageYOffset + bounds.bottom };
  const timespan = 400;

  tween = tweener(current, target, timespan)
    .easing(TWEEN.Easing.Circular.Out)
    .onUpdate(function() {
      window.scrollTo(0, this.y);
      checkAnimationCompletion();
    })
    .onComplete(() => isAnimating = false)
    .start();
}

function stopAnimation() {
  tween.stop();
  tween = null;
  isAnimating = false;
  enableScrolling();
}

function draw(target) {
  target = target || 'scroller';

  window.onload = onLoad;
  window.onbeforeunload = onUnload;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById(target).innerHTML  = `
      <div id="inertia" class="inertial-container">
        <div id="top-buffer" class="buffer"></div>
        <div class="scroller"></div>
        <div id="bottom-buffer" class="buffer"></div>
      </div>
    `;
  });
}