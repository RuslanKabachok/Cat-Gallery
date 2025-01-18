import { useEffect, useState } from 'react';
import axios from 'axios';
import css from './Gallery.module.css';

function Gallery() {
  const [cats, setCats] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [favCats, setFavCats] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchBreeds() {
      try {
        const response = await axios.get('https://api.thecatapi.com/v1/breeds');
        setBreeds(response.data);
      } catch (error) {
        console.error('Error fetching breeds:', error);
      }
    }
    fetchBreeds();
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favoriteCats');
    if (savedFavorites) {
      setFavCats(JSON.parse(savedFavorites));
    }
    fetchRandomCats();
  }, []);

  const toggleFavorite = (cat) => {
    setFavCats((prevFavs) => {
      let newFavs;
      if (prevFavs.some((favCat) => favCat.id === cat.id)) {
        newFavs = prevFavs.filter((favCat) => favCat.id !== cat.id);
      } else {
        newFavs = [...prevFavs, cat];
      }
      localStorage.setItem('favoriteCats', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const fetchCatsByBreed = async (breedId) => {
    setIsLoading(true);

    try {
      let url = 'https://api.thecatapi.com/v1/images/search';
      const params = new URLSearchParams({
        limit: 12,
        has_breeds: 1,
      });

      if (breedId) {
        const breed = breeds.find((b) => b.name === breedId);
        if (breed) {
          params.append('breed_ids', breed.id);
        }
      }

      const response = await axios.get(`${url}?${params.toString()}`, {
        headers: {
          'x-api-key':
            'live_iaAOnvzBcCLSq3YnMc5rp2mq3MWxDBMPjTxxBIa4VefaMX3KZfxUREophgjP6862',
        },
      });

      setCats(response.data);
    } catch (error) {
      console.error('Error searching cats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBreedChange = (e) => {
    const breedId = e.target.value;
    setSelectedBreed(breedId);
    fetchCatsByBreed(breedId);
    console.log(cats);
  };

  const fetchRandomCats = async () => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        limit: 12,
        has_breeds: 1,
      });

      const response = await axios.get(
        `https://api.thecatapi.com/v1/images/search?${params.toString()}`,
        {
          headers: {
            'x-api-key':
              'live_iaAOnvzBcCLSq3YnMc5rp2mq3MWxDBMPjTxxBIa4VefaMX3KZfxUREophgjP6862',
          },
        }
      );

      setCats(response.data);
    } catch (error) {
      console.error('Error fetching random cats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCats = showFavorites ? favCats : cats;

  return (
    <>
      <header>
        <div>Cat Gallery</div>
      </header>
      <div className={css.galleryWrapper}>
        <div className={css.filter}>
          <div>
            <select
              name="breed"
              id="breed"
              value={selectedBreed}
              onChange={handleBreedChange}
            >
              <option value="">All breeds</option>
              {breeds.map((breed) => (
                <option key={breed.id} value={breed.name}>
                  {breed.name}
                </option>
              ))}
            </select>
          </div>

          <div className={css.favourites}>
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={showFavorites ? css.active : ''}
            >
              Favourites ❤️
            </button>
          </div>
        </div>
        <ul className={css.gallery}>
          {filteredCats.map((cat) => {
            const isFavorite = favCats.some((favCat) => favCat.id === cat.id);

            return (
              <li key={cat.id} className={css.galleryItem}>
                <div className={css.favouriteBox}>
                  <button
                    className={`${css.favouriteBtn} ${
                      isFavorite ? css.active : ''
                    }`}
                    onClick={() => toggleFavorite(cat)}
                  >
                    ❤️
                  </button>
                </div>
                <img
                  src={cat.url}
                  className={css.img}
                  alt={cat.breeds[0].name}
                ></img>
                <div className={css.content}>
                  <h3 className={css.name}>{cat.breeds[0].name}</h3>

                  <p className={css.temperament}>
                    Temperament:{' '}
                    <span className={css.label}>
                      {cat.breeds[0].temperament}
                    </span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Gallery;
