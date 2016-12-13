'use strict';

import './feed.css';

let cards = [];
let listDOMNode = null;
let totalCount = 0;

export const Feed = {
  bootstrap: bootstrap,
  refresh: refresh
}

function refresh() {
  listDOMNode.appendChild(generateCards(1));
}

function generateCards(count) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    totalCount += 1;
    const card = document.createElement('li');
    card.className = 'card';
    card.innerHTML = `${totalCount}`;
    frag.appendChild(card);
  }
  return frag;
}

function bootstrap(target) {
  cards = generateCards(10);
  listDOMNode = document.getElementById(target); 
  listDOMNode.appendChild(cards);
}