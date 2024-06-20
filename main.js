const API_KEY = `e00547fc94aa7e12a23d470d3d86281d`;
const IMG_URL = "https://image.tmdb.org/t/p/w500/";
let movieList = [];
const menus = document.querySelectorAll(".menus button");

menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getMovieByCategory(event))
);

const getLatestMovie = async () => {
  try {
    const url = new URL(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`
    );
    const response = await fetch(url);
    const data = await response.json();
    movieList = data.results;
    render();
    console.log("dddd", movieList);
  } catch (error) {
    console.error("Failed to fetch latest movies:", error);
  }
};

const getMovieByCategory = async (event) => {
  try {
    const category = event.target.innerText; // 여기에 장르 이름을 ID로 변환하는 로직이 필요합니다.
    const genreMap = {
      액션: 28,
      모험: 12,
      애니메이션: 16,
      코미디: 35,
      범죄: 80,
      다큐멘터리: 99,
      드라마: 18,
      가족: 10751,
      판타지: 14,
      역사: 36,
      공포: 27,
      음악: 10402,
      미스터리: 9648,
      로맨스: 10749,
      SF: 878,
      TV영화: 10770,
      스릴러: 53,
      전쟁: 10752,
      서부: 37,
      // 필요한 장르 추가
    };
    const genreId = genreMap[category];
    const url = new URL(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ko-KR&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreId}`
    );
    const response = await fetch(url);
    const data = await response.json();
    movieList = data.results;
    render();
    console.log("dddd", movieList);
  } catch (error) {
    console.error("Failed to fetch movies by category:", error);
  }
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
