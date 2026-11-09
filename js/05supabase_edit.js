// Supabase JavaScript 라이브러리를 가져옵니다.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// 실습 1: Supabase 프로젝트 URL을 입력합니다.
// Supabase 프로젝트마다 고유한 주소가 있습니다.
const SUPABASE_URL = "https://syljtwvtmfvzyrextgeu.supabase.co";

// 실습 2: Supabase anon key를 입력합니다.
// ★anon key 대신 service role key (secret) 로 작성해야함!★
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5bGp0d3Z0bWZ2enlyZXh0Z2V1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDE1ODYzOCwiZXhwIjoyMTA5NzM0NjM4fQ.HB801nHun_3sx2ABbp2hzP6swsKXNgcyIcwcyNL_ljo";


// Supabase 연결 도구를 만듭니다.
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 저장된 영화 목록을 보여줄 HTML 영역을 찾습니다.
const savedMovieList = document.querySelector("#savedMovieList");

// 페이지가 열리면 바로 저장된 영화 목록을 불러옵니다.
loadSavedMovies();

// 저장된 영화 목록을 불러오는 함수입니다.
async function loadSavedMovies() {
  // movies 테이블에서 모든 데이터를 가져옵니다.  (* : 모든것들)
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .order("id", { ascending: false });

  // 오류가 있으면 화면에 실패 메시지를 보여줍니다.
  if (error) {
    console.log(error);
    savedMovieList.innerHTML = "<p>데이터를 불러오지 못했습니다.</p>";
    return;
  }

  // 데이터가 있으면 카드 형태로 화면에 출력합니다.
  renderSavedMovies(data);
}

// 특정 영화의 메모를 수정하는 함수입니다.
// id는 어떤 영화를 수정할지 구분하는 고유 번호입니다.
async function updateMovie(id) {
  // 실습 1: update()로 memo 값을 수정합니다.
  // eq("id", id)는 id가 같은 데이터만 수정하겠다는 조건입니다.
  const { error } = await supabase
    .from("movies")
    .update({ memo: "수정된 메모입니다." })
    .eq("id", id);

  // 수정 중 오류가 발생한 경우입니다.
  if (error) {
    console.log(error);
    alert("수정에 실패했습니다.");
    return;
  }

  // 수정 성공 메시지를 보여줍니다.
  alert("메모를 수정했습니다.");

  // 수정된 내용을 다시 화면에 반영하기 위해 목록을 다시 불러옵니다.
  await loadSavedMovies();
}

// 특정 영화를 삭제하는 함수입니다.
async function deleteMovie(id) {
  // 실습 2: delete()로 데이터를 삭제합니다.
  // eq("id", id)는 id가 같은 데이터만 삭제하겠다는 조건입니다.
  const { error } = await supabase
    .from("movies")
    .delete()
    .eq("id", id);

  // 삭제 중 오류가 발생한 경우입니다.
  if (error) {
    console.log(error);
    alert("삭제에 실패했습니다.");
    return;
  }

  // 삭제 성공 메시지를 보여줍니다.
  alert("영화를 삭제했습니다.");

  // 삭제 후 최신 목록을 다시 불러옵니다.
  await loadSavedMovies();
}

// 영화 목록을 카드 형태로 화면에 출력하는 함수입니다.
function renderSavedMovies(movies) {
  // 기존 화면 내용을 지웁니다.
  savedMovieList.innerHTML = "";

  // 영화 배열을 하나씩 반복합니다.
  movies.forEach(function (movie) {
    // 카드 역할을 할 article 태그를 새로 만듭니다.
    const card = document.createElement("article");

    // CSS 디자인을 적용하기 위해 class를 붙입니다.
    card.className = "movie-card";

    // 카드 내부 HTML을 작성합니다.
    // 수정 버튼과 삭제 버튼도 함께 만듭니다.
    card.innerHTML = `
      <img src="${movie.poster_url}" alt="${movie.title} 포스터">
      <h2>${movie.title}</h2>
      <p>개봉일: ${movie.release_date}</p>
      <p>메모: ${movie.memo || "없음"}</p>
      <button class="btn update-btn" type="button">메모 수정</button>
      <button class="btn delete-btn" type="button">삭제</button>
    `;

    // 카드 안에서 수정 버튼을 찾습니다.
    const updateBtn = card.querySelector(".update-btn");

    // 카드 안에서 삭제 버튼을 찾습니다.
    const deleteBtn = card.querySelector(".delete-btn");

    // 수정 버튼을 클릭하면 해당 영화의 id를 updateMovie에 전달합니다.
    updateBtn.addEventListener("click", function () {
      updateMovie(movie.id);
    });

    // 삭제 버튼을 클릭하면 해당 영화의 id를 deleteMovie에 전달합니다.
    deleteBtn.addEventListener("click", function () {
      deleteMovie(movie.id);
    });

    // 완성된 카드를 화면에 추가합니다.
    savedMovieList.appendChild(card);
  });
}