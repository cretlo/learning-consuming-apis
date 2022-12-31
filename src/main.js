'use strict';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/collapse';

let apiData = JSON.parse(localStorage.getItem('publicApis'));
let publicApis, keyApis, oAuthApis, otherApis;
let apiLists = [];

// If there isnt local storage from api already stored, get all the data, save in storage, and render the data
if (!apiData) {
  console.log('Making fetch call');
  fetch('https://api.publicapis.org/entries')
    .then(res => {
      if (!res.ok) {
        throw Error("Couldn't get data");
      }

      return res.json();
    })
    .then(data => {
      localStorage.setItem('publicApis', JSON.stringify(data));
      apiData = data;
      initApiStructure();
      organizeApiData(apiData);
      renderAccordionContents(apiLists);
    })
    .catch(err => console.log(err));
} else {
  initApiStructure();
  organizeApiData(apiData);
  renderAccordionContents(apiLists);
}

function initApiStructure() {
  /*
    Getting a deep clone of an object is difficult. 
    Alot of ways make shadow copies.
      - JSON.parse(JSON.stringify(object))
      - Object.create({}, objToClone)
    Could use structuredClone(object) however is fairly new and not supported everywhere.
  */
  const apiStruct = {
    apiType: '',
    apiArr: [],
  };

  publicApis = {
    apiType: '',
    apiArr: [],
  };
  publicApis.apiType = 'Public APIs';

  keyApis = {
    apiType: '',
    apiArr: [],
  };
  keyApis.apiType = 'Key APIs';
  oAuthApis = {
    apiType: '',
    apiArr: [],
  };
  oAuthApis.apiType = 'OAuth APIs';
  otherApis = {
    apitType: '',
    apiArr: [],
  };
  otherApis.apiType = 'Other APIs';

  apiLists = [publicApis, keyApis, oAuthApis, otherApis];
}

function organizeApiData(apiData) {
  for (let api of apiData.entries) {
    // Empty string indicates it is public
    if (!api.Auth) {
      publicApis.apiArr.push(api);
      continue;
    }

    if (api.Auth == 'apiKey') {
      keyApis.apiArr.push(api);
      continue;
    }

    if (api.Auth == 'OAuth') {
      oAuthApis.apiArr.push(api);
      continue;
    }

    otherApis.apiArr.push(api);
  }
}

function renderAccordionContents(apiLists) {
  let output = ``;
  for (let i = 0; i < apiLists.length; i++) {
    console.log(apiLists[i].apiArr.length);
    output += createAccordionItem(apiLists[i], i);
  }

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
       ${apiList.apiType} 
      </button>
    </h2>
    <div id="collapse${index}" class="accordion-collapse collapse ${show}" aria-labelledby="heading${index}" data-bs-parent="#api-accordion">
      <div class="accordion-body">
        <table class="table table-sm table-striped">
          <thead class="thead-dark">
            <tr>
              <th scope="col">#</th> 
              <th scope="col">Name</th> 
              <th scope="col">Description</th> 
              <th scope="col">Link</th> 
              <th scope="col">HTTPS</th>
              <th scope ="col">Category</th>
            </tr>
          </thead>
          <tbody>
            ${apiList.apiArr
              .map((api, index) => createTable(api, index))
              .join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `;
}

function createTable(api, index) {
  return `
    <tr>
      <th scope="row">${index + 1}</th> 
      <td>${api.API}</td>
      <td>${api.Description}</td>
      <td><a href="${api.Link}">${api.Link}</a></td>
      <td>${api.HTTPS}</td>
      <td>${api.Category}</td>
    </tr> 
  `;
}
