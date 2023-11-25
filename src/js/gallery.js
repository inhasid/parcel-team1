import { UnsplashAPI } from './UnsplashAPI';
import { createGalleryCard } from './render-gallery';
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.min.css';

const api = new UnsplashAPI();
const galleryList = document.querySelector('.js-gallery');
const container = document.getElementById('tui-pagination-container');
const options = { // below default value of options
    totalItems: 0,
    itemsPerPage: 12,
    visiblePages: 5,
    page: 1,
}
const pagination = new Pagination(container, options);
const page = pagination.getCurrentPage();




api
    .getPopularImages(page)
    .then(({ results, total }) => {
        console.log(total, results);
        const markup = createGalleryCard(results);
        galleryList.innerHTML = markup;
        pagination.reset(total);
    }
)
  .catch(err => console.log(err));
  
pagination.on('afterMove', event => {
    const currentPage = event.page;
    
api
  .getPopularImages(currentPage)
  .then(({ results, total }) => {
    console.log(total, results);
    const markup = createGalleryCard(results);
    galleryList.innerHTML = markup;
  })
  .catch(err => console.log(err));
});