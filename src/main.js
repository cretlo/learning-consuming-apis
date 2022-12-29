'use strict';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { setupCounter } from './counter.js';

const cardContainer = document.querySelector('[data-card-container]');
let apis;

fetch('https://api.publicapis.org/entries')
  .then(res => {
    if (!res.ok) {
      throw Error("Couldn't get data");
      return;
    }

    return res.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(err => console.log(err));
