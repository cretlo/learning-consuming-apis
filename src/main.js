'use strict';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/collapse';

let apiData = JSON.parse(localStorage.getItem('publicApis'));
let publicApis = [],
  keyApis = [],
  oAuthApis = [],
  otherApis = [];
let apiGroupList = [publicApis, keyApis, oAuthApis, otherApis];

if (!apiData) {
  console.log('Making fetch call');
  fetch('https://api.publicapis.org/entries')
    .then(res => {
      if (!res.ok) {
        throw Error("Couldn't get data");
        return;
      }

      return res.json();
    })
    .then(data => {
      localStorage.setItem('publicApis', JSON.stringify(data));
    })
    .catch(err => console.log(err));
}
bucketApiData();
renderAccordionContents();

function bucketApiData() {
  for (let api of apiData.entries) {
    if (!api.Auth) {
      publicApis.push(api);
      continue;
    }

    if (api.Auth == 'apiKey') {
      keyApis.push(api);
      continue;
    }

    if (api.Auth == 'OAuth') {
      oAuthApis.push(api);
      continue;
    }

    otherApis.push(api);
  }
}

function renderAccordionContents() {
  let output = ``;
  for (let i = 0; i < apiGroupList.length; i++) {
    output += createAccordionItem(apiGroupList[i], i);
  }

  console.log(document.querySelector('.accordion'));
  document.querySelector('.accordion').innerHTML = output;
}

function createAccordionItem(apiList, index) {
  const show = index === 0 ? 'show' : '';
  const expanded = index === 0 ? true : false;
  const collapsed = index !== 0 ? 'collapsed' : '';

  return `
  <div class="accordion-item">
    <h2 class="accordion-header" id="heading${index}">
      <button class="accordion-button ${collapsed}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="${expanded}" aria-controls="collapse${index}">
       Public APIs 
      </button>
    </h2>
    <div id="collapse${index}" class="accordion-collapse collapse ${show}" aria-labelledby="heading${index}" data-bs-parent="#api-accordion">
      <div class="accordion-body">
        <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
      </div>
    </div>
  </div>
  `;
}
