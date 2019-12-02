'use strict';

//Llamo a los elementos

const elementUl = document.querySelector('#list');
const elementForm = document.querySelector('#search-form');
const buttonSearch = document.querySelector('#search-button');
const searchInput = document.querySelector('#search-input');
//Creo un array vacío para guardar los favoritos
//let favouriteSeries = [];
//URL base de me aplicación
const urlBase = 'http://api.tvmaze.com/search/shows?q=';



const connectToAPI = () => {
    fetch(urlBase+`${searchInput.value}`)
        .then(response => response.json())
        .then(dataFromResponse => displaySeries(dataFromResponse))
        .catch(error => console.log(error))
}


const displaySeries = (seriesArray) => {
    for (const serie of seriesArray) {
        const liElement = document.createElement('li');
        const spanElement = document.createElement('span');
        const imgElement = document.createElement('img');
        const spanContent = document.createTextNode(serie.show.name);
        imgElement.src=serie.show.image.medium;
        spanElement.appendChild(spanContent);
        liElement.appendChild(spanElement);
        liElement.appendChild(imgElement);
        elementUl.appendChild(liElement);
    }
}

function searchSeriesHandler() {
    connectToAPI(urlBase.toLowerCase(),displaySeries)
  }

buttonSearch.addEventListener('click',searchSeriesHandler);
