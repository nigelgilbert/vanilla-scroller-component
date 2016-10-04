"use strict";

import debounce from "debounce";
import TWEEN from "tween.js";
import tweener from "../services/tweener.js";
import "./scroller.css";

function scrollTo(y) {
    window.scrollTo(0,y);
}

export class Scroller {
  constructor() {
    this.tween = null;
    this.onScroll = this.onScroll.bind(this);
    this.onLoad = this.onLoad.bind(this);
    this.onUnload = this.onUnload.bind(this);
    this.animate = this.animate.bind(this);
    this.disableScrolling = this.disableScrolling.bind(this);
    this.draw = this.draw.bind(this);
  }
    
  // initialize window event handlers
  onLoad() {
    console.log("load");
    window.addEventListener("mousewheel", debounce(this.onScroll, 750));
    window.addEventListener("scroll", debounce(this.onScroll, 750));
  //  window.addEventListener("resize", this.handleResize);
  }

  // tear down window event handlers
  onUnload() {
    console.log("unload");
  }

  onScroll() {
    if (!this.animating) {
      this.disableScrolling();
      const topBuffer = document.getElementById("top-buffer").getBoundingClientRect();
      if (topBuffer.bottom > 0) {
        this.animate(topBuffer);
      }
    }
  }

  animate(bounds) {
    this.animating = true;
    const current = { y: window.pageYOffset };
    const target = { y: window.pageYOffset + bounds.bottom };
    const timespan = 400;

    this.tween = tweener(current, target, timespan)
      .easing(TWEEN.Easing.Circular.Out)
      .onUpdate(function() {
        scrollTo(this.y);
      })
      .onComplete(() => this.animating = false)
      .start();
  }

  draw() {
    window.onload = this.onLoad;
    window.onbeforeunload = this.onUnload;
    
    document.addEventListener("DOMContentLoaded", () => {
      document.getElementById("scroller").innerHTML  = `
        <div id="inertia" class="inertial-container">
          <div id="top-buffer" class="buffer"></div>
          <div class="scroller"></div>
          <div id="bottom-buffer" class="buffer"></div>
        </div>
      `;
    });
  }
};

