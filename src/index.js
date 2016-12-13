"use strict";

import "./index.html";
import { Scroller } from "./components/scroller/scroller.js";

Scroller.bootstrap('scroller-demo');

/*
import installCE from 'document-register-element/pony';
installCE(global, 'force');

class MyGreetings extends HTMLElement {
  attachedCallback() {
    alert('we in business!');
  }
  test() {
    alert('testing 123');
  }
}

customElements.define('my-greetings', MyGreetings);

var myGreetings = new MyGreetings();
document.getElementById('greetings-target').appendChild(myGreetings);
myGreetings.test();
*/