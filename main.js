const API_KEY = `e00547fc94aa7e12a23d470d3d86281d`;
const IMG_URL = "https://image.tmdb.org/t/p/w500/";
let movieList = [];
const menus = document.querySelectorAll(".menus button");

menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getMovieByCategory(event))
);
let url = new URL(
  `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`
);

let totalResult = 0;
let page = 1;
const pageSize = 20; // TMDB API는 pageSize를 지원하지 않음 또한 고정값이 20 이다
let groupSize = 10;

var input = document.getElementById("search-input");

// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("search-button").click();
  }
});

const getMovies = async () => {
  try {
    url.searchParams.set("page", page);
    // url.searchParams.set("pageSize", pageSize); // 이 줄은 필요 없음

    const response = await fetch(url);
    const data = await response.json();
    if (response.status === 200) {
      if (data.results.length === 0) {
        throw new Error("검색 결과가 없습니다.");
      }
      movieList = data.results;
      totalResult = data.total_results;
      render();
      paginationRender();
    } else {
      throw new Error(data.status_message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const getLatestMovie = async () => {
  url = new URL(
    `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`
  );
  page = 1;
  getMovies();
};

const getMovieByCategory = async (event) => {
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
  url = new URL(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ko-KR&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=${genreId}`
  );
  page = 1;
  document.getElementById("selected-category").innerText = category; // 선택된 카테고리 제목 업데이트
  getMovies();
};

const getMovieByKeyword = async () => {
  const keyword = document.getElementById("search-input").value;
  url = new URL(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ko-KR&query=${keyword}`
  );
  page = 1;
  document.getElementById("selected-category").innerText =
    `'` + keyword + `'` + "으로 검색한 결과"; // 카테고리 제목에 업데이트
  getMovies();
};

const render = () => {
  const movieHTML = movieList
    .map(
      (movie) => `<div class="movie">
                    <img src="${IMG_URL}${movie.poster_path}"
                        class="movie-img" alt="image">

                    <div class="movie-info">
                        <h4>${movie.title}</h4>
                        <span class="${getColor(
                          movie.vote_average
                        )}">${movie.vote_average.toFixed(1)}</span>
                    </div>

                    <div class="overview">
                        ${movie.overview}
                    </div>
                </div>`
    )
    .join("");

  document.getElementById("movie-board").innerHTML = movieHTML;
};

const errorRender = (errorMessage) => {
  const errorHTML = `<div>
  ${errorMessage}
</div>`;

  document.getElementById("movie-board").innerHTML = errorHTML;
};

const paginationRender = () => {
  //totalResult
  //page
  //pagesize
  //totalPages
  const totalPages = Math.ceil(totalResult / 20);
  // pageSize가 고정값인 20으로 대체
  //groupSize
  // 검색결과없음에 페이지네이션 없애기
  //pageGroup
  const pageGroup = Math.ceil(page / groupSize);
  //lastPage
  let lastPage = pageGroup * groupSize;
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }
  //firstPage
  const firstPage =
    lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

  let paginationHTML = `<li class="page-item" onclick="moveToPage(1)">
                        <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
                      </li><li class="page-item" onclick="moveToPage(${
                        page - 1
                      })"><a class="page-link" href="#">&lt;</a></li>`;

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item  ${
      i === page ? "active" : ""
    }"onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
  }

  paginationHTML += `<li class="page-item" onclick="moveToPage(${
    page + 1
  })"><a class="page-link" href="#">&gt;</a></li>
  <li class="page-item" onclick="moveToPage(500)">
                        <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
                       </li>`;
  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  console.log("dfsdf", pageNum);
  page = pageNum;
  getMovies();
};
getLatestMovie();

const openSearchBox = () => {
  let inputArea = document.getElementById("input-area");
  if (inputArea.style.display === "inline") {
    inputArea.style.display = "none";
  } else {
    inputArea.style.display = "inline";
  }
};

function getColor(vote) {
  if (vote >= 8) {
    return "green";
  } else if (vote >= 5) {
    return "orange";
  } else {
    return "red";
  }
}
