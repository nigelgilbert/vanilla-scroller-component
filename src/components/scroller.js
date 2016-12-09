'use strict';

import debounce from 'lodash.debounce';
import TWEEN from 'tween.js';
import tweener from '../services/tweener.js';
import './scroller.css';

let tween = null;
let isAnimating = false;
let wheelHandler = null;
let scrollHandler = null;

export const Scroller = {
  draw: draw
}

function onLoad() {
  enableScrolling();
}

function onUnload() {}

function enableScrolling() {
  setTimeout(() => {
    document.body.style.overflow = "scroll";
    window.onscroll = debounce(onScroll, 250);
    window.onmousewheel = debounce(onScroll, 250);
  }, 150);
}

function disableScrolling() {
  document.body.style.overflow = "hidden";
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

function onScroll() {
  const topBufferRect = document.getElementById('top-buffer').getBoundingClientRect();
  checkAjaxTrigger(topBufferRect);
  if (!isAnimating && topBufferRect.bottom > 0) {
    beginAnimation(topBufferRect);
  }
}

function checkAnimationCompletion() {
  const topBufferRect = document.getElementById('top-buffer').getBoundingClientRect();
  if (topBufferRect.bottom <= 0 && tween !== null) {
    stopAnimation();
  }
}

function checkAjaxTrigger(topBufferRect) {
  const ajaxTriggerRect = document.getElementById('ajax-trigger').getBoundingClientRect();
  if (ajaxTriggerRect.bottom <= 0) {
    // simulate ajax
    setTimeout(() => {
      console.log('Data loaded.');
    }, 100);
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
    .onComplete(() => stopAnimation())
    .onComplete(() => onScroll())
    .start();
}

function stopAnimation() {
  if (tween !== null) {
    tween.stop();
    tween = null;
  };

  isAnimating = false;
  enableScrolling();
}

function draw(target) {
  target = target || 'scroller';

  window.onload = onLoad;
  window.onbeforeunload = onUnload;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById(target).innerHTML  = `
      <div id="inertial-container">
        <div id="top-buffer" class="buffer">
          <div id="ajax-trigger">Loading</div>
        </div>
        <div class="scroller"></div>
        <div id="bottom-buffer" class="buffer"></div>
      </div>
    `;
  });
}