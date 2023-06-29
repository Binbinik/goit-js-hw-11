import axios from 'axios';
import Notiflix from 'notiflix';

let page = 1;
let query = '';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

form.addEventListener('submit', formSubmitHandler);
loadMoreButton.addEventListener('click', loadMoreHandler);

async function formSubmitHandler(event) {
  event.preventDefault();

  query = event.currentTarget.elements.searchQuery.value.trim();

  if (!query) {
    Notiflix.Notify.failure('The search string cannot be empty');
    return;
  }

  page = 1;
  gallery.innerHTML = '';
  loadMoreButton.style.display = 'none';

  fetchImages();
}

async function loadMoreHandler() {
  page += 1;
  fetchImages();
}

async function fetchImages() {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '37954176-d6863041698ad18b712857b48',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40,
      },
    });

    console.log(response.data);

    const images = response.data.hits;
    if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    const markup = images
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `
                    <div class="photo-card">
                        <img src="${webformatURL}" alt="${tags}" loading="lazy" data-source="${largeImageURL}" />
                        <div class="info">
                            <p class="info-item"><b>Likes:</b> ${likes}</p>
                            <p class="info-item"><b>Views:</b> ${views}</p>
                            <p class="info-item"><b>Comments:</b> ${comments}</p>
                            <p class="info-item"><b>Downloads:</b> ${downloads}</p>
                        </div>
                    </div>
                `;
        }
      )
      .join('');

    gallery.insertAdjacentHTML('beforeend', markup);

    if (response.data.totalHits > page * 40) {
      loadMoreButton.style.display = 'block';
    } else {
      loadMoreButton.style.display = 'none';
      setTimeout(() => {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }, 0);
    }

    if (page === 1) {
      Notiflix.Notify.success(
        `Hooray! We found ${response.data.totalHits} images.`
      );
    }
  } catch (error) {
    console.log('Error:', error);
    Notiflix.Notify.failure(
      'An error occurred while fetching images. Please try again.'
    );
  }
}
