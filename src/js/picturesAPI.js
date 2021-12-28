import axios from 'axios';
const API_KEY = '24835779-0f65b5f1ebc58d529319d0b23';
const BASE_URL = 'https://pixabay.com/api/';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.per_page = 40;
  }

    async fetchPictures() {
      const url = `${BASE_URL}/?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.per_page}`;

       try {
    const response = await axios.get(url);
         const data = response.data;
         this.incrementPage();
         return data;
      } catch (error) {
        console.log(error);
      }
    }

    incrementPage() {
      this.page += 1;
    }

    resetPage() {
      this.page = 1;
    }

    get query() {
      return this.searchQuery;
    }

    set query(newQuery) {
      this.searchQuery = newQuery;
    }
}
