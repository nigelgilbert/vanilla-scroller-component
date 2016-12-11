'use strict';

// source:
// http://bit.ly/2hdWqA4

let stateKey;
let eventKey;

const keys = {
  hidden: 'visibilitychange',
  webkitHidden: 'webkitvisibilitychange',
  mozHidden: 'mozvisibilitychange',
  msHidden: 'msvisibilitychange'
};

for (stateKey in keys) {
  if (stateKey in document) {
    eventKey = keys[stateKey];
    break;
  }
}

// Fires a callback when the document tab isn't visible.
export default function (callback) {
  if (callback) document.addEventListener(eventKey, callback);
  return !document[stateKey];
}
