import React from 'react';
import css from './Loader.module.css';

function Loader() {
  return (
    <div className={css.loaderWrapper}>
      <div className={css.loader}></div>
    </div>
  );
}

export default Loader;
