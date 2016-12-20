'use strict';

import './feed.css';

let cards = [];
let listDOMNode = null;
let totalCount = 0;

export class Feed extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `<ul id="card-list"></ul>`;
    cards = generateCards(10);
  }

  connectedCallback() {
    listDOMNode = document.getElementById('card-list');
    listDOMNode.appendChild(cards);  
  }

  refresh() {
    listDOMNode.appendChild(generateCards(1));
  }
}

function generateCards(count) {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    totalCount += 1;
    const card = document.createElement('li');
    card.className = 'card';
    card.innerHTML = `${totalCount}`;
    fragment.appendChild(card);
  }
  return fragment;
}