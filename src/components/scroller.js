'use strict';

import debounce from 'lodash.debounce';
import TWEEN from 'tween.js';
import async from 'async';
import tweener from '../services/tweener.js';
import visibility from '../services/visibility.js';
import './scroller.css';

let tween = null;
let isAnimating = false;

export const Scroller = {
  draw: draw
}

function onLoad() {
  resetAnimation();
  enableScrolling();
  visibility(onNotVisible);
}

function onUnload() {}

function enableScrolling(callback) {
  window.onscroll = debounce(onScroll, 250);
  window.onmousewheel = debounce(onScroll, 250);
  document.body.style.overflow = "scroll";
  isAnimating = false;
  if (callback) callback();
}

function disableScrolling(callback) {
  document.body.style.overflow = "hidden";
  window.onscroll = preventDefault;
  window.onmousewheel = preventDefault;
  if (callback) callback();
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
    async.series([disableScrolling, beginAnimation]);
  }
}

function onNotVisible() {
  async.series([cleanupAnimation, resetAnimation, enableScrolling]);
}

function resetAnimation(callback) {
  const topBufferRect = document.getElementById('top-buffer').getBoundingClientRect();
  if (topBufferRect.bottom > 0) {
    window.scrollTo(0, window.pageYOffset + topBufferRect.bottom);
  }
  if (callback) callback();
}

function checkAjaxTrigger(topBufferRect) {
  const ajaxTriggerRect = document.getElementById('ajax-trigger').getBoundingClientRect();
  if (ajaxTriggerRect.bottom > 0) {
    setTimeout(() => {
      console.log('data loaded;');
    }, 100);
  }
}

function beginAnimation() {
  const bounds = document.getElementById('top-buffer').getBoundingClientRect();
  isAnimating = true;

  const current = { y: window.pageYOffset };
  const target = { y: window.pageYOffset + bounds.bottom };
  const timespan = 400;

  tween = tweener(current, target, timespan)
  .easing(TWEEN.Easing.Circular.Out)
  .onUpdate(function() {
    window.scrollTo(0, this.y);
  })
  .onComplete(() => async.series([cleanupAnimation, resetAnimation, enableScrolling]))
  .start();
}

function cleanupAnimation(callback) {
  if (tween !== null) {
    tween = null;
  };
  if (callback) callback();
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