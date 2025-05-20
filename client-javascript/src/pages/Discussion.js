// src/pages/Discussion.js

import {
  fetchCoinsFromServerAPI, // COIN_LIST 대신 실제 API로 가져오기
  fetchBoardPosts,
  fetchBoardPostDetail,
  fetchComments,
  createBoardPost,
  formatApiTimestamp,
} from "../app/api/conapi.js";

// 코인 목록 캐시 변수 (API 호출 최소화)
let cachedCoins = [];

export async function renderDiscussionPage(container, coinSymbolParam = "") {
  container.innerHTML = "";
  const discussionContainer = document.createElement("div");
  discussionContainer.className = "discussion-container";

  // 코인 목록 가져오기 (캐싱 적용)
  try {
    if (cachedCoins.length === 0) {
      cachedCoins = await fetchCoinsFromServerAPI();
      console.log("API에서 코인 목록 가져옴:", cachedCoins);
    }
  } catch (error) {
    console.error("코인 목록을 가져오는 중 오류:", error);
    cachedCoins = [];
  }

  const header = document.createElement("header");
  header.className = "discussion-header";
  const title = document.createElement("h2");

  // 현재 선택된 코인 정보를 API 데이터에서 찾기
  const selectedCoinInfo = cachedCoins.find(
    (c) => c.symbol === coinSymbolParam,
  );
  title.textContent = selectedCoinInfo
    ? `${selectedCoinInfo.graphicSymbol || selectedCoinInfo.symbol} ${selectedCoinInfo.name} 게시판`
    : "커뮤니티";
  header.appendChild(title);
  discussionContainer.appendChild(header);

  const tabMenu = document.createElement("div");
  tabMenu.className = "discussion-tabs";
  const tabs = ["인기", "최신", "상승예측", "하락예측"];
  tabs.forEach((tabName) => {
    const tabButton = document.createElement("button");
    tabButton.className =
      tabName === "인기" ? "tab-button active" : "tab-button";
    tabButton.textContent = tabName;
    tabButton.addEventListener("click", (e) => {
      document
        .querySelectorAll(".discussion-tabs .tab-button")
        .forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");
      filterDiscussions(tabName, postsList, coinSymbolParam);
    });
    tabMenu.appendChild(tabButton);
  });
  discussionContainer.appendChild(tabMenu);

  const topControls = document.createElement("div");
  topControls.className = "discussion-top-controls";

  const coinFilter = document.createElement("div");
  coinFilter.className = "coin-filter";
  const filterLabel = document.createElement("label");
  filterLabel.htmlFor = "coin-filter-select";
  filterLabel.textContent = "종목:";
  coinFilter.appendChild(filterLabel);
  const selectCoin = document.createElement("select");
  selectCoin.id = "coin-filter-select";
  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "전체";
  selectCoin.appendChild(allOption);

  // API에서 가져온 코인 목록으로 드롭다운 채우기
  cachedCoins.forEach((coin) => {
    const option = document.createElement("option");
    option.value = coin.symbol;
    option.textContent = `${coin.name} (${coin.symbol})`;
    if (coin.symbol === coinSymbolParam) {
      option.selected = true;
    }
    selectCoin.appendChild(option);
  });

  selectCoin.addEventListener("change", (e) => {
    window.location.hash = e.target.value
      ? `#discussion/${e.target.value}`
      : "#discussion";
  });
  coinFilter.appendChild(selectCoin);
  topControls.appendChild(coinFilter);

  const searchBox = document.createElement("div");
  searchBox.className = "search-box";
  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = "게시글 검색...";
  searchBox.appendChild(searchInput);
  const searchButton = document.createElement("button");
  searchButton.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>`;
  searchButton.addEventListener("click", () => {
    searchDiscussions(searchInput.value, postsList, coinSymbolParam);
  });
  searchBox.appendChild(searchButton);
  topControls.appendChild(searchBox);

  const writeButton = document.createElement("button");
  writeButton.className = "write-button";
  writeButton.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg> 새 글 작성`;
  writeButton.addEventListener("click", () => {
    showWriteForm(discussionContainer, coinSymbolParam);
  });
  topControls.appendChild(writeButton);
  discussionContainer.appendChild(topControls);

  const postsArea = document.createElement("div");
  postsArea.className = "posts-area";
  const postsList = document.createElement("ul");
  postsList.className = "posts-list";

  // coinSymbolParam을 사용하여 초기 게시글 필터링
  await loadBoardPosts(postsList, coinSymbolParam);
  postsArea.appendChild(postsList);
  discussionContainer.appendChild(postsArea);

  const pagination = document.createElement("div");
  pagination.className = "pagination";
  for (let i = 1; i <= 5; i++) {
    const pageLink = document.createElement("a");
    pageLink.href = "#";
    pageLink.textContent = i;
    if (i === 1) pageLink.className = "active";
    pageLink.addEventListener("click", (e) => {
      e.preventDefault();
      // API 연동 시 여기서 페이지 변경 처리
      document
        .querySelectorAll(".pagination a")
        .forEach((a) => a.classList.remove("active"));
      pageLink.classList.add("active");
      loadPageData(i, postsList, coinSymbolParam);
    });
    pagination.appendChild(pageLink);
  }
  discussionContainer.appendChild(pagination);

  container.appendChild(discussionContainer);
}

// API에서 게시글 데이터를 불러오는 함수
async function loadBoardPosts(
  listContainer,
  currentCoinSymbol = "",
  sort = "popular",
  page = 1,
) {
  listContainer.innerHTML =
    '<li class="loading-message">게시글을 불러오는 중...</li>';

  try {
    // API 호출 파라미터 설정
    const params = {
      limit: 10,
      offset: (page - 1) * 10,
    };

    // 코인 심볼 필터링
    if (currentCoinSymbol) {
      params.coinSymbol = currentCoinSymbol;
    }

    // 정렬 방식
    if (sort) {
      params.sort = sort;
    }

    // API 호출
    const postData = await fetchBoardPosts(params);
    renderPostItems(listContainer, postData, currentCoinSymbol);
  } catch (error) {
    console.error("게시글 데이터 로딩 중 오류:", error);
    listContainer.innerHTML =
      '<li class="error-message">게시글을 불러오는 데 실패했습니다.</li>';
  }
}

// API 응답으로 게시글 목록을 표시하는 함수
async function renderPostItems(listContainer, posts, currentCoinSymbol = "") {
  listContainer.innerHTML = "";

  if (!posts || posts.length === 0) {
    const noPostsMessage = document.createElement("li");
    noPostsMessage.className = "no-posts-message";

    // 코인 이름 찾기
    let coinName = currentCoinSymbol;
    if (currentCoinSymbol && cachedCoins.length > 0) {
      const coinInfo = cachedCoins.find((c) => c.symbol === currentCoinSymbol);
      if (coinInfo) {
        coinName = coinInfo.name;
      }
    }

    noPostsMessage.textContent = currentCoinSymbol
      ? `${coinName} 관련 게시글이 아직 없습니다.`
      : "게시글이 아직 없습니다. 첫 글을 작성해보세요!";
    listContainer.appendChild(noPostsMessage);
    return;
  }

  for (const post of posts) {
    const postItem = document.createElement("li");
    postItem.className = "post-item";
    postItem.dataset.postId = post.postid;

    postItem.addEventListener("click", () => {
      window.location.hash = `post/${post.postid}`;
    });

    // 게시글 헤더 영역 (작성자, 날짜 등)
    const postCardHeader = document.createElement("div");
    postCardHeader.className = "post-card-header";

    // 작성자 정보
    const authorInfo = document.createElement("div");
    authorInfo.className = "post-author-info";

    const authorAvatar = document.createElement("span");
    authorAvatar.className = "post-author-avatar";
    authorAvatar.textContent = "U"; // User의 첫 글자

    const authorNameAndDate = document.createElement("div");
    authorNameAndDate.className = "post-author-name-date";

    const authorName = document.createElement("span");
    authorName.className = "post-author-name";
    authorName.textContent = `사용자 ${post.writerid}`;

    const postDate = document.createElement("span");
    postDate.className = "post-date";
    postDate.textContent = formatApiTimestamp(post.createdat, false);

    authorNameAndDate.appendChild(authorName);
    authorNameAndDate.appendChild(postDate);
    authorInfo.appendChild(authorAvatar);
    authorInfo.appendChild(authorNameAndDate);

    const rightHeaderItems = document.createElement("div");
    rightHeaderItems.className = "post-card-header-right";

    // 코인 태그 표시 (데이터에 해당 정보가 있다면)
    if (post.coinSymbol && cachedCoins.length > 0) {
      const coin = cachedCoins.find((c) => c.symbol === post.coinSymbol);
      if (coin) {
        const coinTag = document.createElement("span");
        coinTag.className = "post-item-coin-tag";
        coinTag.textContent = `${coin.graphicSymbol || coin.symbol}`;
        coinTag.title = coin.name;
        rightHeaderItems.appendChild(coinTag);
      }
    }

    postCardHeader.appendChild(authorInfo);
    postCardHeader.appendChild(rightHeaderItems);

    // 게시글 내용 영역
    const postCardBody = document.createElement("div");
    postCardBody.className = "post-card-body";

    const postTitle = document.createElement("h3");
    postTitle.className = "post-title";
    postTitle.textContent = post.title;

    const postExcerpt = document.createElement("p");
    postExcerpt.className = "post-excerpt";
    postExcerpt.textContent =
      post.content?.substring(0, 120) +
      (post.content?.length > 120 ? "..." : "");

    postCardBody.appendChild(postTitle);
    postCardBody.appendChild(postExcerpt);

    // 게시글 푸터 영역 (조회수, 좋아요, 댓글)
    const postCardFooter = document.createElement("div");
    postCardFooter.className = "post-card-footer";

    const postStats = document.createElement("div");
    postStats.className = "post-stats";

    // API 응답의 viewcount, likes 필드 사용
    postStats.innerHTML = `
      <span><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg> ${post.viewcount || 0}</span>
      <span><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.07.07-.07-.07C7.32 14.48 4 11.61 4 8.5S6.01 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c1.99 0 4 2.52 4 5.5 0 3.11-3.32 5.98-7.97 10.05z"></path></svg> ${post.likes || 0}</span>
      <span><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"></path></svg> 0</span>
    `;

    const postActions = document.createElement("div");
    postActions.className = "post-actions";

    const likeButton = document.createElement("button");
    likeButton.className = "action-button like-button";
    likeButton.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.07.07-.07-.07C7.32 14.48 4 11.61 4 8.5S6.01 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c1.99 0 4 2.52 4 5.5 0 3.11-3.32 5.98-7.97 10.05z"></path></svg><span>좋아요</span>`;

    const commentButton = document.createElement("button");
    commentButton.className = "action-button comment-button";
    commentButton.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"></path></svg><span>댓글</span>`;

    // 이벤트 전파 방지
    likeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      alert("좋아요 기능 구현 예정");
    });
    commentButton.addEventListener("click", (e) => {
      e.stopPropagation();
      alert("댓글 기능 구현 예정");
    });

    postActions.appendChild(likeButton);
    postActions.appendChild(commentButton);
    postCardFooter.appendChild(postStats);
    postCardFooter.appendChild(postActions);

    // 모든 요소를 게시글 아이템에 추가
    postItem.appendChild(postCardHeader);
    postItem.appendChild(postCardBody);
    postItem.appendChild(postCardFooter);
    listContainer.appendChild(postItem);
  }
}

// 게시글 필터링 함수 - API 호출 사용
async function filterDiscussions(tabName, listContainer, coinSymbolParam) {
  const currentCoinSymbol =
    document.getElementById("coin-filter-select")?.value ||
    coinSymbolParam ||
    "";
  console.log(`${tabName} 탭 선택됨. 코인: ${currentCoinSymbol || "전체"}`);

  // 로딩 메시지 표시
  listContainer.innerHTML =
    "<li class='loading-message'>게시글을 불러오는 중...</li>";

  try {
    // 탭에 따른 다른 정렬이나 필터 파라미터 설정
    const params = {
      limit: 10,
      offset: 0,
    };

    // 코인 심볼이 있으면 추가
    if (currentCoinSymbol) {
      params.coinSymbol = currentCoinSymbol;
    }

    // 탭에 따른 정렬 방식 적용
    if (tabName === "인기") {
      params.sort = "popular";
    } else if (tabName === "최신") {
      params.sort = "latest";
    } else if (tabName === "상승예측" || tabName === "하락예측") {
      params.prediction = tabName === "상승예측" ? "up" : "down";
    }

    // API 호출
    const postData = await fetchBoardPosts(params);
    renderPostItems(listContainer, postData, currentCoinSymbol);
  } catch (error) {
    console.error("게시글 필터링 중 오류:", error);
    listContainer.innerHTML =
      "<li class='error-message'>게시글을 불러오는 데 실패했습니다.</li>";
  }
}

// 검색 기능 구현
async function searchDiscussions(searchText, listContainer, coinSymbolParam) {
  if (!searchText.trim()) {
    alert("검색어를 입력해주세요.");
    return;
  }

  const currentCoinSymbol =
    document.getElementById("coin-filter-select")?.value ||
    coinSymbolParam ||
    "";
  console.log(`검색: "${searchText}" 코인: ${currentCoinSymbol || "전체"}`);

  // 로딩 상태 표시
  listContainer.innerHTML =
    "<li class='loading-message'>검색 결과를 불러오는 중...</li>";

  try {
    // 검색 API 호출 파라미터 설정
    const params = {
      limit: 10,
      offset: 0,
      search: searchText,
    };

    if (currentCoinSymbol) {
      params.coinSymbol = currentCoinSymbol;
    }

    // API 호출 (검색 API가 있다고 가정)
    // const searchResults = await fetchSearchPosts(params);

    // 검색 결과가 없을 때
    listContainer.innerHTML = `<li class='no-results-message'>검색어 "${searchText}"에 대한 결과가 없습니다.</li>`;
  } catch (error) {
    console.error("검색 중 오류:", error);
    listContainer.innerHTML =
      "<li class='error-message'>검색 중 오류가 발생했습니다.</li>";
  }
}

// 페이지네이션 구현
async function loadPageData(page, listContainer, coinSymbolParam) {
  try {
    const currentCoinSymbol =
      document.getElementById("coin-filter-select")?.value ||
      coinSymbolParam ||
      "";
    const activeTab =
      document.querySelector(".discussion-tabs .tab-button.active")
        ?.textContent || "인기";

    console.log(
      `페이지 ${page} 데이터 로드. 코인: ${currentCoinSymbol || "전체"}, 탭: ${activeTab}`,
    );

    // 로딩 상태 표시
    listContainer.innerHTML =
      "<li class='loading-message'>페이지 데이터를 불러오는 중...</li>";

    // 탭에 따른 정렬 방식 결정
    let sort = "popular";
    if (activeTab === "최신") sort = "latest";

    // API 호출 파라미터
    const params = {
      limit: 10,
      offset: (page - 1) * 10,
      sort: sort,
    };

    if (currentCoinSymbol) {
      params.coinSymbol = currentCoinSymbol;
    }

    if (activeTab === "상승예측" || activeTab === "하락예측") {
      params.prediction = activeTab === "상승예측" ? "up" : "down";
    }

    // API 호출
    const postData = await fetchBoardPosts(params);
    renderPostItems(listContainer, postData, currentCoinSymbol);
  } catch (error) {
    console.error(`페이지 ${page} 데이터 로딩 중 오류:`, error);
    listContainer.innerHTML =
      "<li class='error-message'>페이지 데이터를 불러오는 데 실패했습니다.</li>";
  }
}

// 글쓰기 폼 표시 함수
async function showWriteForm(discussionContainer, currentCoinSymbol = "") {
  // 코인 목록 업데이트 (필요한 경우)
  if (cachedCoins.length === 0) {
    try {
      cachedCoins = await fetchCoinsFromServerAPI();
    } catch (error) {
      console.error("코인 목록을 가져오는 중 오류:", error);
    }
  }

  const existingForm = document.querySelector(".write-form-overlay");
  if (existingForm) existingForm.remove();

  const writeFormOverlay = document.createElement("div");
  writeFormOverlay.className = "write-form-overlay";
  writeFormOverlay.addEventListener("click", (e) => {
    if (e.target === writeFormOverlay) {
      document.body.removeChild(writeFormOverlay);
    }
  });

  const writeForm = document.createElement("div");
  writeForm.className = "write-form";

  const formHeader = document.createElement("h3");
  formHeader.textContent = "새 글 작성";

  // 코인 선택 드롭다운 (글쓰기 폼 내부)
  const formCoinSelectLabel = document.createElement("label");
  formCoinSelectLabel.textContent = "코인 선택 (선택 사항):";
  formCoinSelectLabel.style.display = "block";
  formCoinSelectLabel.style.marginBottom = "5px";
  const formCoinSelect = document.createElement("select");
  formCoinSelect.style.width = "100%";
  formCoinSelect.style.marginBottom = "15px";
  const noCoinOption = document.createElement("option");
  noCoinOption.value = "";
  noCoinOption.textContent = "코인 선택 안 함";
  formCoinSelect.appendChild(noCoinOption);

  // API에서 가져온 코인 목록으로 드롭다운 채우기
  cachedCoins.forEach((coin) => {
    const option = document.createElement("option");
    option.value = coin.symbol;
    option.textContent = `${coin.name} (${coin.symbol})`;
    if (coin.symbol === currentCoinSymbol) {
      option.selected = true;
    }
    formCoinSelect.appendChild(option);
  });

  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.placeholder = "제목을 입력하세요";
  const contentTextarea = document.createElement("textarea");
  contentTextarea.placeholder = "내용을 입력하세요";
  contentTextarea.rows = 8;

  const predictionDiv = document.createElement("div");
  predictionDiv.style.marginBottom = "15px";
  predictionDiv.style.marginTop = "10px";
  const predictionLabel = document.createElement("label");
  predictionLabel.textContent = "예측: ";
  predictionLabel.style.marginRight = "10px";
  const predictionSelect = document.createElement("select");
  ["예측 없음", "상승", "하락", "중립"].forEach((pred) => {
    const option = document.createElement("option");
    option.value = pred;
    option.textContent = pred;
    predictionSelect.appendChild(option);
  });
  predictionDiv.appendChild(predictionLabel);
  predictionDiv.appendChild(predictionSelect);

  const buttonArea = document.createElement("div");
  buttonArea.className = "form-buttons";

  const cancelButton = document.createElement("button");
  cancelButton.textContent = "취소";
  cancelButton.className = "cancel-button";
  cancelButton.addEventListener("click", () => {
    document.body.removeChild(writeFormOverlay);
  });

  const submitButton = document.createElement("button");
  submitButton.textContent = "등록";
  submitButton.className = "submit-button";
  submitButton.addEventListener("click", async () => {
    if (!titleInput.value.trim() || !contentTextarea.value.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      // 로그인 확인
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      const userId = localStorage.getItem("id");

      if (!isLoggedIn || !userId) {
        alert("로그인이 필요한 기능입니다.");
        window.location.hash = "#login";
        document.body.removeChild(writeFormOverlay);
        return;
      }

      // API 호출 데이터 준비
      const postData = {
        title: titleInput.value.trim(),
        content: contentTextarea.value.trim(),
        writerId: parseInt(userId),
        coinSymbol: formCoinSelect.value || null,
        prediction:
          predictionSelect.value === "예측 없음"
            ? null
            : predictionSelect.value,
      };

      // 실제 API 호출
      const response = await createBoardPost(postData);
      if (response) {
        alert("게시글이 등록되었습니다.");

        // 게시글 목록 새로고침
        const postsList = document.querySelector(".posts-list");
        if (postsList) {
          const activeTab =
            document.querySelector(".discussion-tabs .tab-button.active")
              ?.textContent || "최신";
          filterDiscussions(
            activeTab,
            postsList,
            document.getElementById("coin-filter-select")?.value,
          );
        }
      } else {
        alert("게시글 등록에 실패했습니다. 다시 시도해주세요.");
      }

      document.body.removeChild(writeFormOverlay);
    } catch (error) {
      console.error("게시글 등록 중 오류:", error);
      alert("게시글 등록에 실패했습니다. 다시 시도해주세요.");
    }
  });

  buttonArea.appendChild(cancelButton);
  buttonArea.appendChild(submitButton);

  writeForm.appendChild(formHeader);
  writeForm.appendChild(formCoinSelectLabel);
  writeForm.appendChild(formCoinSelect);
  writeForm.appendChild(titleInput);
  writeForm.appendChild(contentTextarea);
  writeForm.appendChild(predictionDiv);
  writeForm.appendChild(buttonArea);

  writeFormOverlay.appendChild(writeForm);
  document.body.appendChild(writeFormOverlay);
}
