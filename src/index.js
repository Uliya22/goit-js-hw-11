import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';



 const searchForm = document.querySelector('.search-form');
 const galleryBox = document.querySelector('.gallery');
 const loadMoreBtn = document.querySelector('.load-more');
 const endText = document.querySelector('.end-text')

 let currentPage = 1;
 let currentHits = 40;
 let imagesColetion = "";

 let lightbox = new SimpleLightbox('.photo-card a', {
    captions: true,
    captionsData: 'alt',
    captionDelay: 250,
  });


searchForm.addEventListener('submit', onFormSubmit);

async function onFormSubmit (e) {
    e.preventDefault();
  imagesColetion = e.currentTarget.searchQuery.value;
  
  console.log(imagesColetion);
  currentPage = 1;
  currentHits = 40;
  loadMoreBtn.classList.add('is-hidden');
  endText.classList.add('is-hidden');
  clearMarkup(); 

        if (
            imagesColetion === '') {
        
        return}

        const imageCards = await getImageCards(imagesColetion, currentPage);
  

        if (imageCards.totalHits > 40) {
            loadMoreBtn.classList.remove('is-hidden');
          } else {
            loadMoreBtn.classList.add('is-hidden');
          }  
    
    try {  
        if (imageCards.totalHits > 0) {

          Notify.success(`Hooray! We found ${imageCards.totalHits} images.`);

          clearMarkup(); 

          renderCardImage(imageCards.hits);

          lightbox.refresh();
          }   
    
        else {
            Notify.failure('Sorry, there are no images matching your search query. Please try again')
        }

  
    } catch (error) {
      console.log(error);
    }
}

// Функція пошуку і ренедеру розмітки
async function getImageCards  (value, page)  {
    
        const API_KEY = '29802953-73b28e5a5bd13a1bc7d407030';
        const OPTIONS = 'image_type=photo&orientation=horizontal&safesearch=true&lang=en&lang=uk&page=4&per_page=40'
        const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&q=${value}&${OPTIONS}&page=${page}`;
        const imageCards = (await axios.get(`${BASE_URL}`).then(response => response.data));
          return imageCards;
        
    };

    
// Функція створення розмітки

function renderCardImage(arr) {
   
  const markup =  arr.map(({ webformatURL,largeImageURL,tags,likes, views,comments, downloads}) => {
  return `<div class="photo-card">
              <a class="photo-card" href= "${largeImageURL}">
                  <img src="${webformatURL}" alt="${tags}" loading="lazy" width=100% />   
              </a>
              <div class="info">
                  <p class="info-item">
                      <b>Likes: </b>${likes}
                  </p>
                  <p class="info-item">
                      <b>Views: </b>${views}
                  </p>
                  <p class="info-item">
                      <b>Comments: </b>${comments}
                  </p>
                  <p class="info-item">
                      <b>Downloads: </b>${downloads}
                  </p>
              </div>
          </div>`}).join('');

          galleryBox.insertAdjacentHTML('beforeend', markup); 
  }


// Функція очистки розмітки
const clearMarkup  = function () {
    galleryBox.innerHTML = '';
}

// Блок перемикання сторінок

loadMoreBtn.addEventListener('click', onClickLoadMoreBtn);

async function onClickLoadMoreBtn() {

  currentPage += 1;

  const response = await getImageCards(imagesColetion, currentPage);
  const imageCardsArray = response.hits;
  
  console.log(imageCardsArray);     
  renderCardImage(response.hits);

  lightbox.refresh();
  currentHits += imageCardsArray.length;
  console.log(currentHits);
  
  if (currentHits === response.totalHits) {
    loadMoreBtn.classList.add('is-hidden');
    endText.classList.remove('is-hidden');
  }
}


