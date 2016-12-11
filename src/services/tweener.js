'use strict';

const TWEEN = require('tween.js');

let tweenCompletionHandler = null;
let isTweening = false;

// Wrapper Service for the Tween.js lib that handles AnimationFrame
// setup and cleanup.  Alows multiple animations to use the
// same AnimationFrame.
export default function tweener(initial, target, duration) {

  // Cancel the previous cleanup because we're gonna 
  // animate for longer.
  if (tweenCompletionHandler !== null) {
    clearTimeout(tweenCompletionHandler);
  }

  const toggleOff = () => {
    isTweening = false;
    tweenCompletionHandler = null;
  };

  // Timeout to turn the animation frame off.
  // keep a reference so that next time it's called we can cancel
  // it and continue tweening.
  tweenCompletionHandler = setTimeout(toggleOff, duration + 25);

  // Begin the recursive tween loop.
  isTweening = true;
  requestAnimationFrame(updateTween);
  return new TWEEN.Tween(initial).to(target, duration);
}

// Calls itself (thereby updating the tween) until the animation
// is complete.
function updateTween(time) {
  TWEEN.update(time);
  if (isTweening) requestAnimationFrame(updateTween);
}
