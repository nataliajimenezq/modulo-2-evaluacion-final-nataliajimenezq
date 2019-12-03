'use strict';

//Llamo a los elementos
const elementUl = document.querySelector('#list');
const elementForm = document.querySelector('#search-form');
const buttonSearch = document.querySelector('#search-button');
const searchInput = document.querySelector('#search-input');
//const favouriteList = document.querySelector('.favourites');
const favouriteSeries = document.querySelector('.favourite__series');

let elementsListSeries;

//Creo un array vacío para guardar los favoritos
let favouriteSeriesArray = [];

//URL base de me aplicación y la imagen default
const urlBase = 'http://api.tvmaze.com/search/shows?q=';
const imgDefault = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';

const connectToAPI = () => {
  fetch(urlBase + `${searchInput.value}`)
    .then(response => response.json())
    .then(dataFromResponse => {
      displaySeries(dataFromResponse)
      elementsListSeries = document.querySelectorAll('.list__serie');
    })
    .catch(error => console.log(error))
}

function loadFavouriteHandler() {
  //Leo mi localstorage la primera vez
  const mylocalStorage = localStorage.getItem("favSeries");
  //esta vacío mi localstorage?
  if(mylocalStorage !== null) {
    favouriteSeriesArray= JSON.parse(mylocalStorage);
  }
  paintFavourites(favouriteSeriesArray);

}
//funcion para pintar las series 
const displaySeries = (seriesArray) => {
  for (const serie of seriesArray) {
    const series = serie.show;
    const seriesName = series.name;
    const seriesImg = series.image;

    const elementLi = document.createElement('li');
    const spanElement = document.createElement('span');
    const imgElement = document.createElement('img');
    const spanContent = document.createTextNode(seriesName);
    elementLi.classList.add('list__serie');
    imgElement.classList.add('img__serie');
    spanElement.classList.add('tittle__serie');
    spanElement.appendChild(spanContent);
    elementLi.appendChild(spanElement);
    elementLi.appendChild(imgElement);
    elementUl.appendChild(elementLi);
    elementLi.addEventListener('click', addFavourite);

    if (seriesImg === null) {
      imgElement.src = imgDefault;
    } else {
      imgElement.src = seriesImg.medium;
    }
  }
}
function addFavourite(event) {

  let favouriteSerie = event.currentTarget;
  favouriteSerie.classList.toggle('selected');

  const favoriteImage = favouriteSerie.querySelector('.img__serie');
  const favoriteName = favouriteSerie.querySelector('.tittle__serie');
  

  const favInfo = {
    name: favoriteName.innerHTML,
    image:favoriteImage.src
  };

  if (favouriteSerie.classList.contains('selected')) {
    favouriteSeriesArray.push(favInfo);
    paintFavourites();
    setLocalStorage();
  }
}

function paintFavourites() {
  favouriteSeries.innerHTML = '';
  for (let favourite of favouriteSeriesArray) {
    const favouriteImg = favourite.image;
    const favouriteName = favourite.name;

    const serieList = document.createElement('li');
    const serieName = document.createElement('span');
    const serieImg = document.createElement('img');
    const spanContent = document.createTextNode(favouriteName);

    serieName.appendChild(spanContent);
    serieList.appendChild(serieImg);
    serieList.appendChild(serieName);
    favouriteSeries.appendChild(serieList);
    serieImg.src = favouriteImg;
    serieList.classList.add('favourite__item');
    serieImg.classList.add('favourite__item-img')

  }
}
function setLocalStorage() {
  localStorage.setItem("favSeries", JSON.stringify(favouriteSeriesArray));
}

function searchSeriesHandler() {
  connectToAPI(urlBase.toLowerCase(), displaySeries);
}

buttonSearch.addEventListener('click', searchSeriesHandler);
window.addEventListener('load',loadFavouriteHandler);

