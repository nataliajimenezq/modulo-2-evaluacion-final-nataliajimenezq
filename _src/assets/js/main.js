'use strict';

//Llamo a los elementos
const elementUl = document.querySelector('#list');
const elementForm = document.querySelector('#search-form');
const buttonSearch = document.querySelector('#search-button');
const searchInput = document.querySelector('#search-input');
//const favouriteList = document.querySelector('.favourites');
const favouriteSeries = document.querySelector('.favourite__series');


//Creo un array vacío para guardar los favoritos
let favouriteSeriesArray = [];
let seriesArray=[];

//URL base de me aplicación y la imagen default
const urlBase = 'http://api.tvmaze.com/search/shows?q=';
const imgDefault = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';

//función para conectar a la api
const connectToAPI = () => {
  fetch(urlBase + `${searchInput.value}`)
    .then(response => response.json())
    .then(dataFromResponse => displaySeries(dataFromResponse))
    .catch(error => console.log(error))
}
//funcion para leer mi localStorage por primera vez, si está vacío
function loadFavouriteHandler() {
  const mylocalStorage = localStorage.getItem("favSeries");
  if (mylocalStorage !== null) {
    favouriteSeriesArray = JSON.parse(mylocalStorage);
  }
  paintFavourites(favouriteSeriesArray);
}


//función para guardar mi array de favoritos en el localStorage
function setLocalStorage() {
  localStorage.setItem("favSeries", JSON.stringify(favouriteSeriesArray));
}
//handle para conectar a la api y pintar las series (función que agregamos como listener del boton)
function searchSeriesHandler() {
  connectToAPI(urlBase.toLowerCase(), displaySeries);
}
//función para buscar dando enter en el buscador
function enterKeyHandle(event) {
  event.preventDefault();
  searchSeriesHandler();
}
//funcion para pintar las series 
const displaySeries = (seriesArray) => {
    elementUl.innerHTML="";
  for (const serie of seriesArray) {
    const seriesName = serie.show.name;
    const seriesImg = serie.show.image;

    const elementLi = document.createElement('li');
    const imgElement = document.createElement('img');
    const spanElement = document.createElement('span');

    const spanContent = document.createTextNode(seriesName);
    elementLi.classList.add('serie__item');
    imgElement.classList.add('serie__img');
    spanElement.classList.add('serie__tittle');
    spanElement.appendChild(spanContent);
    elementLi.appendChild(imgElement);
    elementLi.appendChild(spanElement);
    elementUl.appendChild(elementLi);
    elementLi.addEventListener('click', addFavourite);

    if (seriesImg === null) {
      imgElement.src = imgDefault;
    } else {
      imgElement.src = seriesImg.medium;
    }
  }
}
//función para añadir a favoritos //eventcurrent del input
//Intento de borrar del array de favoritos al hacer click

function addFavourite(event) {
  let favouriteSerie = event.currentTarget;
  favouriteSerie.classList.toggle('selected');
  const favoriteImage = favouriteSerie.querySelector('.serie__img');
  const favoriteName = favouriteSerie.querySelector('.serie__tittle');

  const favInfo = {
    name: favoriteName.innerHTML,
    image: favoriteImage.src
  };

  if (favouriteSerie.classList.contains('selected')) {
    favouriteSeriesArray.push(favInfo);
    paintFavourites();
    setLocalStorage();
  } else{
    for(let i=0;i<favouriteSeriesArray.length;i++){
      if(favouriteSeriesArray[i].name===favoriteName.innerHTML){
        favouriteSeriesArray.splice(i,1);
      }
    }  
  }
  setLocalStorage();
}
 //función para esconder los favoritos (visualmente)
function deleteFromFav(event){
  event.currentTarget.closest('li').classList.add('hidden');
}

//función para pintar los favoritos
function paintFavourites() {
  favouriteSeries.innerHTML = '';
  for (let favourite of favouriteSeriesArray) {
    const favouriteImg = favourite.image;
    const favouriteName = favourite.name;

    const favElementList = document.createElement('li');
    const favElementSpan = document.createElement('span');
    const favElementImg = document.createElement('img');
    const favElementDel = document.createElement('div');

    const spanContent = document.createTextNode(favouriteName);

    favElementSpan.appendChild(spanContent);
    favElementList.appendChild(favElementImg);
    favElementList.appendChild(favElementSpan);
    favElementList.appendChild(favElementDel);
    favouriteSeries.appendChild(favElementList);

    favElementImg.src = favouriteImg;
    favElementList.classList.add('favourite__item');
    favElementImg.classList.add('favourite__item-img');
    favElementDel.classList.add('favourite__item-del');
    favElementDel.addEventListener('click', deleteFromFav);
    
  }
}

buttonSearch.addEventListener('click', searchSeriesHandler);
elementForm.addEventListener('submit', enterKeyHandle);
window.addEventListener('load', loadFavouriteHandler);

