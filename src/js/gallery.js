import { UnsplashAPI } from './UnsplashAPI';
import { createGalleryCard } from './render-gallery';
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.min.css';
import { Notify } from 'notiflix';

const formRef = document.querySelector('.js-search-form');
const api = new UnsplashAPI();
const galleryList = document.querySelector('.js-gallery');
const container = document.getElementById('tui-pagination-container');
const options = {
  // below default value of options
  totalItems: 0,
  itemsPerPage: 12,
  visiblePages: 5,
  page: 1,
  template: {
    page: '<a href="#" class="tui-page-btn">{{page}}</a>',
    currentPage:
      '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
    moveButton:
      '<a href="#" class="tui-page-btn tui-{{type}}">' +
      '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</a>',
    disabledMoveButton:
      '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
      '<span class="tui-ico-{{type}}">{{type}}</span>' +
      '</span>',
    moreButton:
      '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
      '<span class="tui-ico-ellip">...</span>' +
      '</a>',
  },
};
const pagination = new Pagination(container, options);
const page = pagination.getCurrentPage();

formRef.addEventListener('submit', searchByQuery);

api
  .getPopularImages(page)
  .then(({ results, total }) => {
    console.log(total, results);
    const markup = createGalleryCard(results);
    galleryList.innerHTML = markup;
    pagination.reset(total);
  })
  .catch(err => console.log(err));

pagination.on('afterMove', getPopular);

function getPopular(event) {
  const currentPage = event.page;

  api
    .getPopularImages(currentPage)
    .then(({ results, total }) => {
      console.log(total, results);
      const markup = createGalleryCard(results);
      galleryList.innerHTML = markup;
    })
    .catch(err => console.log(err));
}

function searchByQuery(e) {
  e.preventDefault();
  const { query } = e.target.elements;
  console.log(query);
  const queryValue = query.value.trim();
  if (!queryValue) return Notify.info('Enter something to search');
  pagination.off('afterMove', getPopular);
  pagination.off('afterMove', getImages);
  api.query = queryValue;
  container.style.display = 'block';
  api
    .getImagesByQuery(page)
    .then(({ total, results }) => {
      if (total === 0) return Notify.failure('No images were found');
      if (total <= 12) container.style.display = 'none';
      const markup = createGalleryCard(results);
      galleryList.innerHTML = markup;
      Notify.success(`We found ${total} images`);
      pagination.reset(total);
    })
    .catch(err => Notify.failure('Something went wrong'));
  query.value = '';
  pagination.on('afterMove', getImages);
}

function getImages(event) {
  const currentPage = event.page;

  api
    .getImagesByQuery(currentPage)
    .then(({ results, total }) => {
      console.log(total, results);
      const markup = createGalleryCard(results);
      galleryList.innerHTML = markup;
    })
    .catch(err => console.log(err));
}
