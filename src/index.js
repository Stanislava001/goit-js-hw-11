import imagesTpl from './templates/images.hbs';
import './sass/main.scss';
import LoadMoreBtn from './js/loadMoreBtn';
import ImagesApiService from './js/picturesAPI';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('[name="searchQuery"]'),
  galleryContainer: document.querySelector('.gallery'),};

const imagesApiService = new ImagesApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: ".load-more",
  hidden: true,
});

refs.form.addEventListener('submit', onSearchBtnClick);
loadMoreBtn.refs.button.addEventListener('click', onLoadBtnClick)

function onSearchBtnClick(e) {
  e.preventDefault();

  imagesApiService.query = refs.input.value.trim();
  imagesApiService.resetPage();
  console.log(imagesApiService.page);
  clearImagesContainer();
  loadMoreBtn.hide();

  if (imagesApiService.query === '') {
    onFetchError();
    return
  }

  imagesApiService.fetchPictures().then(images => {

    if (images.hits.length === 0) {
      onFetchError();

      loadMoreBtn.hide();
      return
    }
    if (images.hits.length <= 40)  {
      loadMoreBtn.show();
      clearImagesContainer();
      appendImagesMarkup(images);
      Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
    }
  });

  e.currentTarget.reset();
}

function onLoadBtnClick() {
  loadMoreBtn.enable();

  imagesApiService.fetchPictures().then(images => {
  appendImagesMarkup(images);
   
  console.log(imagesApiService.page);
  });
}

async function appendImagesMarkup(images) {
    const markup = await imagesTpl(images.hits)
    refs.galleryContainer.insertAdjacentHTML('beforeend', markup);
  if (
    (images.hits.length < 40 && images.hits.length >= 1) ||
    images.hits.length === images.totalHits
  ) {
    onFetchInfo();
    loadMoreBtn.hide();
  }
  
  lightbox.refresh('show.simpleLightbox');
}

function clearImagesContainer() {
  refs.galleryContainer.innerHTML = '';
}

function onFetchError() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
  );
}

function onFetchInfo() {
  Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  navText: ['←', '→'],
  heightRatio: 1,
  spinner: true,
});