import { useEffect, useState } from 'react';
import axios from 'axios';
import css from './Gallery.module.css';

function Gallery() {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    async function fetchCats() {
      const response = await axios.get(
        'https://api.thecatapi.com/v1/images/search?limit=12&has_breeds=1&api_key=live_iaAOnvzBcCLSq3YnMc5rp2mq3MWxDBMPjTxxBIa4VefaMX3KZfxUREophgjP6862'
      );

      setCats(response.data);
    }

    fetchCats();
  }, []);

  return (
    <>
      <div className={css.galleryWrapper}>
        <ul className={css.gallery}>
          {cats.map((cat) => {
            return (
              <li key={cat.id} className={css.galleryItem}>
                <img src={cat.url} className={css.img}></img>
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
