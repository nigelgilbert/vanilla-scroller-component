'use strict';

import debounce from 'lodash.debounce';
import TWEEN from 'tween.js';
import async from 'async';
import tweener from '../../services/tweener.js';
import visibility from '../../services/visibility.js';
import styles from './scroller.css';

import { Feed } from '../feed/feed.js';

customElements.define('card-feed', Feed);

let tween = null;
let isAnimating = false;
let buffer = null;
let feed = null;

export class Scroller extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <div id="inertial-container">
        <div id="top-buffer" class="buffer">
          Pull to Refresh
        </div>
        <div id="feed-container" class="scroller"></div>
      </div>
    `;
  }

  connectedCallback() {
    buffer = document.getElementById('top-buffer');
    async.series([resetAnimationPosition, enablePulldown]);
    visibility(onNotVisible);
    feed = new Feed();
    document.getElementById('feed-container').appendChild(feed);
  }

  disconnectedCallback() {
    window.onscroll = null;
    window.onmousewheel = null;
    cleanupAnimation();
  }
}

function enablePulldown(callback) {
  window.onscroll = onScroll;
  window.onmousewheel = onScroll;
  document.body.style.overflowY = 'scroll';
  isAnimating = false;
  if (callback) callback();
}

function disablePulldown(callback) {
  window.onscroll = preventDefaultHandler;
  window.onmousewheel = preventDefaultHandler;
  document.body.style.overflowY = 'hidden';
  if (callback) callback();
}

function preventDefaultHandler(event) {
  event = event || window.event;
  if (event.preventDefault) {
    event.preventDefault();
  }
  event.returnValue = false;
}

var onScroll = debounce(function onScroll() {
  console.log('onscroll');
  const topBufferRect = buffer.getBoundingClientRect();
  if (!isAnimating && topBufferRect.bottom > 0) {
    setTimeout(checkAjaxTrigger(topBufferRect), 0);
    async.series([disablePulldown, () => beginAnimation(topBufferRect)]);
  }
}, 250);

function onNotVisible() {
  async.series([cleanupAnimation, resetAnimationPosition, enablePulldown]);
}

function checkAjaxTrigger(topBufferRect) {
  if (topBufferRect.top > 0) {
    setTimeout(feed.refresh, 0);
  }
}

function beginAnimation(topBufferRect) {
  isAnimating = true;

  const current = { y: window.pageYOffset };
  const target = { y: window.pageYOffset + topBufferRect.bottom };
  const timespan = 400;

  tween = tweener(current, target, timespan)
    .easing(TWEEN.Easing.Circular.Out)
    .onUpdate(function() {
      window.scrollTo(0, this.y);
    })
    .onComplete(() => async.series([cleanupAnimation, enablePulldown]))
    .start();
}

function resetAnimationPosition(callback) {
  const topBufferRect = buffer.getBoundingClientRect();
  if (topBufferRect.bottom > 0) {
    window.scrollTo(0, window.pageYOffset + topBufferRect.bottom);
  }
  if (callback) callback();
}

function cleanupAnimation(callback) {
  if (tween !== null) {
    tween.stop();
    tween = null;
  };
  if (callback) callback();
}