const API_KEY = `e00547fc94aa7e12a23d470d3d86281d`;
const IMG_URL = "https://image.tmdb.org/t/p/w500/";
let movieList = [];

const getLatestMovie = async () => {
  const url = new URL(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`
  );
  const response = await fetch(url);
  const data = await response.json();
  movieList = data.results;
  render();
  console.log("dddd", movieList);
};

const render = () => {
  const movieHTML = movieList
    .map(
      (movie) => `<div class="movie">
                    <img src="${IMG_URL}${movie.poster_path}"
                        class="movie-img" alt="image">

                    <div class="movie-info">
                        <h3>${movie.title}</h3>
                        <span class="green">${movie.vote_average.toFixed(
                          1
                        )}</span>
                    </div>

                    <div class="overview">
                        ${movie.overview}

                    </div>
                </div>`
    )
    .join("");

  document.getElementById("movie-board").innerHTML = movieHTML;
};

getLatestMovie();
