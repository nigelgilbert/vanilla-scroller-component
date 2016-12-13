'use strict';

import debounce from 'lodash.debounce';
import TWEEN from 'tween.js';
import async from 'async';
import tweener from '../../services/tweener.js';
import visibility from '../../services/visibility.js';
import './scroller.css';

import { Feed } from '../feed/feed.js';

let tween = null;
let isAnimating = false;

let buffer;

export const Scroller = {
  bootstrap: bootstrap
  // onPulldown: onPulldown,
  // onLoad: onLoad 
}

function onLoad() {
  async.series([resetAnimation, enableScrolling]);
  visibility(onNotVisible);
}

function onMount() {
  buffer = document.getElementById('top-buffer');
  Feed.bootstrap('card-feed');
}

function onRefresh() {
  Feed.refresh();
}

function enableScrolling(callback) {
  window.onscroll = debounce(onScroll, 250);
  window.onmousewheel = debounce(onScroll, 250);
  document.body.style.overflow = "scroll";
  isAnimating = false;
  if (callback) callback();
}

function disableScrolling(callback) {
  document.body.style.overflow = "hidden";
  window.onscroll = preventDefaultHandler;
  window.onmousewheel = preventDefaultHandler;
  if (callback) callback();
}

function preventDefaultHandler(event) {
  event = event || window.event;
  if (event.preventDefault) {
    event.preventDefault();
  }
  event.returnValue = false;
}

function onScroll() {
  const topBufferRect = buffer.getBoundingClientRect();
  if (!isAnimating && topBufferRect.bottom > 0) {
    setTimeout(checkAjaxTrigger(topBufferRect), 0);
    async.series([disableScrolling, () => { beginAnimation(topBufferRect) }]);
  }
}

function onNotVisible() {
  async.series([cleanupAnimation, resetAnimation, enableScrolling]);
}

function resetAnimation(callback) {
  const topBufferRect = buffer.getBoundingClientRect();
  if (topBufferRect.bottom > 0) {
    window.scrollTo(0, window.pageYOffset + topBufferRect.bottom);
  }
  if (callback) callback();
}

function checkAjaxTrigger(ajaxTriggerRect) {
  // const ajaxTriggerRect = document.getElementById('ajax-trigger').getBoundingClientRect();
  if (ajaxTriggerRect.top > 0) {
    setTimeout(onRefresh, 0);
  }
}

function beginAnimation(topBufferRect) {
  // const topBufferRect = document.getElementById('top-buffer').getBoundingClientRect();
  isAnimating = true;

  const current = { y: window.pageYOffset };
  const target = { y: window.pageYOffset + topBufferRect.bottom };
  const timespan = 400;

  tween = tweener(current, target, timespan)
    .easing(TWEEN.Easing.Circular.Out)
    .onUpdate(function() {
      window.scrollTo(0, this.y);
    })
    .onComplete(() => async.series([cleanupAnimation, enableScrolling]))
    .start();
}

function cleanupAnimation(callback) {
  if (tween !== null) {
    // teen.stop(); is this necessary?
    tween = null;
  };
  if (callback) callback();
}

function bootstrap(target, params = {}) {
  window.onload = onLoad;

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById(target).innerHTML  = `
      <div id="inertial-container">
        <div id="top-buffer" class="buffer">
          Pull to Refresh
        </div>
        <div id="card-feed" class="scroller"></div>
      </div>
    `;

    onMount();
  });
}