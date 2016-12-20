'use strict';

import 'document-register-element';
import './vendor/native-shim.js';

import { Scroller } from './components/scroller/scroller.js';

customElements.define('pull-refresh', Scroller);
document.getElementById('scroller-demo').appendChild(new Scroller());
