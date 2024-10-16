import styles from '../styles/Home.module.css';
import Movie from './Movie';
import 'antd/dist/reset.css';
import { Button, Popover } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';


function Home() {
  const [apiMovies, setApiMovies] = useState([]);
  const [likedMovies, setLikedMovies] = useState([]);
  const [movieSearch, setMovieSearch] = useState('');

  useEffect(() => {
    fetch('https://dim-movies-back.vercel.app/movies')
      .then(response => response.json())
      .then(data => {
        setApiMovies(data.movies);
      })
      .catch(err => console.error('error:' + err));
  }, []);

  const updateLikedMovies = (movieTitle) => {
    const isIncluded = likedMovies.includes(movieTitle);
    if (!isIncluded) {
      setLikedMovies([...likedMovies, movieTitle])
    } else {
      setLikedMovies(likedMovies.filter(e => e !== movieTitle))
    }
  }

  const movies = apiMovies.map(data => {
    let shortOverview = data.overview;
    if (data.overview.length > 250) {
      shortOverview = data.overview.slice(0, 250) + " ...";
    }

    let poster = `https://image.tmdb.org/t/p/w500/${data.poster_path}`;
    if (!data.poster_path) {
      poster = `poster.jpg`
    }

    return <Movie key={data.id} movieId={data.id} poster={poster} title={data.title} overview={shortOverview} voteAverage={data.vote_average} voteCount={data.vote_count} updateLikedMovies={updateLikedMovies} />;
  });

  const content = likedMovies.map(title => {
    return <div className={styles.likedContainer}>
      <p>{title}</p>
      <FontAwesomeIcon onClick={() => updateLikedMovies(title)} icon={faCircleXmark} className={styles.circleX} />
    </div>
  });

  const likedNumber = likedMovies.length;


  const handleSearch = (param) => {
    console.log(param)

    fetch(`https://dim-movies-back.vercel.app/search/${movieSearch}`)
      .then(response => response.json())
      .then(data => {
        setApiMovies(data.results);
      })
      .catch(err => console.error('error:' + err));
  }

  const handleKey = param => param === "Enter" ? handleSearch(movieSearch) : null;

  return (
    <div>
      <div className={styles.header}>
        <div>
          <img className={styles.images} src="/logo.png" alt="Logo" />
          <img className={styles.imagesLetter} src="/logoletter.png" alt="Letter logo" />
        </div>
        <div className={styles.searchDiv}>
          <input className={styles.searchInput} type='text' placeholder='Vous cherchez un film?' id="movieSearch" onChange={(e) => setMovieSearch(e.target.value)} value={movieSearch} onKeyDown={e => handleKey(e.code)} />
          <FontAwesomeIcon icon={faMagnifyingGlass} size='xl' style={{ color: "#021334", }} onClick={() => handleSearch(movieSearch)} />
        </div>
        <div>
          <Popover content={content} title="Mes films ♥" trigger="click">
            <Button className={styles.buttonStyle} type="primary">♥ {likedNumber} movie(s)</Button>
          </Popover>
        </div>
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>
          Films à découvrir
        </h1>
        <main className={styles.main}>
          {movies}
        </main>
      </div>
    </div>
  );
}

export default Home;
