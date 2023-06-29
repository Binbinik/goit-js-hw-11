import axios from 'axios';

export async function fetchImages(query, page) {
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

  const images = response.data.hits;
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
  return { data: response.data, markup };
}
