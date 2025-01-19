import { useEffect, useState } from 'react';
import axios from 'axios';
import css from './Gallery.module.css';
import Loader from '../Loader/Loader';

function Gallery() {
  const [cats, setCats] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [favCats, setFavCats] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCat, setSelectedCat] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const LIMIT = 12;

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
    fetchCatsByBreed(selectedBreed);
  }, [currentPage, selectedBreed]);

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
        page: currentPage - 1,
        has_breeds: 1,
        order: 'DESC',
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

      const totalCountHeader = response.headers['pagination-count'];
      setTotalResults(totalCountHeader ? parseInt(totalCountHeader, 10) : 0);
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
    setCurrentPage(1);
  };

  //   setIsLoading(true);

  //   try {
  //     const params = new URLSearchParams({
  //       limit: 12,
  //       has_breeds: 1,
  //       page: currentPage,
  //     });

  //     const response = await axios.get(
  //       `https://api.thecatapi.com/v1/images/search?${params.toString()}`,
  //       {
  //         headers: {
  //           'x-api-key':
  //             'live_iaAOnvzBcCLSq3YnMc5rp2mq3MWxDBMPjTxxBIa4VefaMX3KZfxUREophgjP6862',
  //         },
  //       }
  //     );

  //     setCats(response.data);
  //   } catch (error) {
  //     console.error('Error fetching random cats:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const openModal = (cat) => {
    setSelectedCat(cat);
  };

  const closeModal = () => {
    setSelectedCat(null);
  };

  const filteredCats = showFavorites ? favCats : cats;

  function updateModalImage(index) {
    const currentIndex = filteredCats.findIndex(
      (cat) => cat.id === selectedCat.id
    );
    const newIndex =
      (currentIndex + index + filteredCats.length) % filteredCats.length;
    setSelectedCat(filteredCats[newIndex]);
  }

  return (
    <>
      <header>
        <div>Cat Gallery</div>
      </header>
      {isLoading && <Loader />}
      {selectedCat && (
        <div className={css.modalOverlay} onClick={closeModal}>
          <div
            className={css.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedCat.url}
              alt={selectedCat.breeds[0]?.name || 'Cat'}
            />
            <button
              className={css.modalPrev}
              onClick={() => {
                updateModalImage(-1);
              }}
            >
              &lt;
            </button>
            <button
              className={css.modalNext}
              onClick={() => {
                updateModalImage(1);
              }}
            >
              &gt;
            </button>
            <button className={css.closeBtn} onClick={closeModal}>
              ✖
            </button>
          </div>
        </div>
      )}
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
              <li
                key={cat.id}
                className={`${css.galleryItem} ${
                  isFavorite ? css.favoriteBorder : ''
                }`}
              >
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
                  alt={cat.breeds[0]?.name || 'Cat'}
                  onClick={() => openModal(cat)}
                ></img>
                <div className={css.content}>
                  <h3 className={css.name}>
                    {cat.breeds[0]?.name || 'Unknown Breed'}
                  </h3>

                  <p className={css.temperament}>
                    Temperament:
                    <span className={css.label}>
                      {cat.breeds[0]?.temperament ||
                        'Information not available'}
                    </span>
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        {!showFavorites && (
          <div className={css.pagination}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous Page
            </button>
            <span>
              Page {currentPage} of {Math.ceil(totalResults / LIMIT)}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < Math.ceil(totalResults / LIMIT) ? prev + 1 : prev
                )
              }
              disabled={currentPage >= Math.ceil(totalResults / LIMIT)}
            >
              Next Page
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Gallery;
