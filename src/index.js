import Notiflix from 'notiflix';
import { fetchImages } from './search-api.js';

let page = 1;
let query = '';
let isLoadMoreClicked = false;

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

form.addEventListener('submit', formSubmitHandler);
loadMoreButton.addEventListener('click', loadMoreHandler);

function formSubmitHandler(event) {
  event.preventDefault();

  query = event.currentTarget.elements.searchQuery.value.trim();

  if (!query) {
    Notiflix.Notify.failure('The search string cannot be empty');
    return;
  }

  page = 1;
  gallery.innerHTML = '';
  loadMoreButton.style.display = 'none';

  fetchAndDisplayImages();
}

function loadMoreHandler() {
  page += 1;
  isLoadMoreClicked = true;
  fetchAndDisplayImages();
}

async function fetchAndDisplayImages() {
  try {
    const { data, markup } = await fetchImages(query, page);
    gallery.insertAdjacentHTML('beforeend', markup);

    if (data.totalHits > page * 40) {
      loadMoreButton.style.display = 'block';
    } else if (isLoadMoreClicked) {
      loadMoreButton.style.display = 'none';
      setTimeout(() => {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }, 0);
    }

    if (page === 1) {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      }
    }
  } catch (error) {
    console.log('Error:', error);
    Notiflix.Notify.failure(
      'An error occurred while fetching images. Please try again.'
    );
  }
}
