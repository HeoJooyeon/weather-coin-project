
// pages/Discussion.js
import { COIN_LIST } from "../app/api/conapi.js";

// 샘플 게시글 데이터 (PostDetail.js에서도 이와 유사한 데이터를 사용)
const samplePosts = [
  { id:1, coinSymbol: "BTC", title: "비트코인 지금이라도 타야할까요? 분위기가 심상치 않네요", author: "코린이탐험대", date: "2025-05-11 10:30", views: 1245, likes: 78, commentsCount: 32, prediction: "상승", content: "최근 비트코인 가격 변동성이 커지면서 많은 분들이 고민이실 것 같습니다. 저는 장기적으로 우상향 할 것이라고 보는데, 여러분의 생각은 어떠신가요? 함께 이야기 나눠봐요!" },
  { id:2, coinSymbol: "ETH", title: "이더리움, 다음주 중요한 발표 예정! 미리 선점하세요", author: "정보분석가", date: "2025-05-10 15:45", views: 982, likes: 56, commentsCount: 24, prediction: "상승", content: "이더리움 재단에서 다음 주 중대 발표가 있을 예정이라는 소식입니다. 이번 발표 내용에 따라 시장에 큰 파장이 예상되니, 관심있게 지켜보시는 것이 좋겠습니다." },
  { id:3, coinSymbol: "XRP", title: "리플 소송 결과 임박? 단기 변동성 주의하세요", author: "법률전문가", date: "2025-05-09 09:12", views: 756, likes: 23, commentsCount: 41, prediction: "중립", content: "리플과 SEC 간의 소송 결과가 곧 나올 것이라는 전망이 나오고 있습니다. 결과에 따라 가격이 급등락할 수 있으니, 투자에 각별히 유의하시기 바랍니다." },
  { id:4, coinSymbol: "SOL", title: "솔라나 기반 밈코인, 다시 한번 불장 올까요?", author: "밈코인헌터", date: "2025-05-08 18:20", views: 634, likes: 89, commentsCount: 15, prediction: "상승", content: "최근 솔라나 네트워크의 안정성이 향상되면서 솔라나 기반 밈코인들이 다시 주목받고 있습니다. 제2의 봉크, 도그위프햇이 나올 수 있을지 기대되네요." },
  { id:5, coinSymbol: "BTC", title: "단타매매 수익 인증합니다 (하루 +15%)", author: "스캘핑마스터", date: "2025-05-07 22:05", views: 2056, likes: 152, commentsCount: 68, prediction: "중립", content: "오늘 장중 변동성을 이용해서 짧게 수익 실현했습니다. 매매는 짧고 굵게! 다들 성투하세요~ (매매 내역 첨부)" },
];


export function renderDiscussionPage(container, coinSymbolParam = "") { // coinSymbol -> coinSymbolParam으로 변경 (함수 스코프 내 변수와 혼동 방지)
  container.innerHTML = ""; 

  const discussionContainer = document.createElement("div");
  discussionContainer.className = "discussion-container";

  const header = document.createElement("header");
  header.className = "discussion-header";
  const title = document.createElement("h2");
  // coinSymbolParam을 사용하여 현재 선택된 코인 정보 가져오기
  const selectedCoinInfo = COIN_LIST.find((c) => c.symbol === coinSymbolParam);
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
    tabButton.className = tabName === "인기" ? "tab-button active" : "tab-button";
    tabButton.textContent = tabName;
    tabButton.addEventListener("click", (e) => {
      document.querySelectorAll(".discussion-tabs .tab-button").forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");
      filterDiscussions(tabName, postsList); 
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
  COIN_LIST.forEach((coin) => {
    const option = document.createElement("option");
    option.value = coin.symbol;
    option.textContent = `${coin.name} (${coin.symbol})`;
    if (coin.symbol === coinSymbolParam) { // coinSymbol -> coinSymbolParam
      option.selected = true;
    }
    selectCoin.appendChild(option);
  });
  selectCoin.addEventListener('change', (e) => {
    window.location.hash = e.target.value ? `#discussion/${e.target.value}` : '#discussion';
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
    alert(`"${searchInput.value}" 검색 결과 (구현 예정)`);
  });
  searchBox.appendChild(searchButton);
  topControls.appendChild(searchBox);

  const writeButton = document.createElement("button");
  writeButton.className = "write-button";
  writeButton.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path></svg> 새 글 작성`;
  writeButton.addEventListener("click", () => {
    showWriteForm(coinSymbolParam); // 현재 필터링된 코인 심볼 전달
  });
  topControls.appendChild(writeButton);
  discussionContainer.appendChild(topControls);

  const postsArea = document.createElement("div");
  postsArea.className = "posts-area";
  const postsList = document.createElement("ul"); 
  postsList.className = "posts-list";
  // coinSymbolParam을 사용하여 초기 게시글 필터링
  createSamplePosts(postsList, coinSymbolParam); 
  postsArea.appendChild(postsList);
  discussionContainer.appendChild(postsArea);

  const pagination = document.createElement("div");
  pagination.className = "pagination";
  for (let i = 1; i <= 5; i++) {
    const pageLink = document.createElement("a");
    pageLink.href = "#"; 
    pageLink.textContent = i;
    if (i === 1) pageLink.className = "active";
    pagination.appendChild(pageLink);
  }
  discussionContainer.appendChild(pagination);

  container.appendChild(discussionContainer);
}

function createSamplePosts(listContainer, currentCoinSymbol = "") {
  listContainer.innerHTML = ''; 
  
  // 현재 선택된 코인 심볼에 따라 게시글 필터링
  const filteredPosts = currentCoinSymbol 
    ? samplePosts.filter(post => post.coinSymbol === currentCoinSymbol) 
    : samplePosts;

  if (filteredPosts.length === 0) {
      const noPostsMessage = document.createElement("p");
      noPostsMessage.className = "filter-message"; // 스타일 적용을 위한 클래스
      noPostsMessage.textContent = currentCoinSymbol 
          ? `${COIN_LIST.find(c=>c.symbol === currentCoinSymbol)?.name || currentCoinSymbol} 관련 게시글이 아직 없습니다.`
          : "게시글이 아직 없습니다. 첫 글을 작성해보세요!";
      listContainer.appendChild(noPostsMessage);
      return;
  }

  filteredPosts.forEach((post) => {
    const postItem = document.createElement("li"); 
    postItem.className = "post-item";
    postItem.dataset.postId = post.id; // 데이터 속성으로 post ID 저장
    postItem.addEventListener('click', () => {
        // ✅ 상세 페이지로 이동
        window.location.hash = `post/${post.id}`; 
    });

    const postCardHeader = document.createElement("div");
    postCardHeader.className = "post-card-header";
    const authorInfo = document.createElement("div");
    authorInfo.className = "post-author-info";
    const authorAvatar = document.createElement("span");
    authorAvatar.className = "post-author-avatar";
    authorAvatar.textContent = post.author.charAt(0).toUpperCase();
    const authorNameAndDate = document.createElement("div");
    authorNameAndDate.className = "post-author-name-date";
    const authorName = document.createElement("span");
    authorName.className = "post-author-name";
    authorName.textContent = post.author;
    const postDate = document.createElement("span");
    postDate.className = "post-date";
    postDate.textContent = post.date; 
    authorNameAndDate.appendChild(authorName);
    authorNameAndDate.appendChild(postDate);
    authorInfo.appendChild(authorAvatar);
    authorInfo.appendChild(authorNameAndDate);
    
    const rightHeaderItems = document.createElement("div"); // 오른쪽 상단 요소들을 묶을 div
    rightHeaderItems.className = "post-card-header-right";

    if (post.prediction && post.prediction !== "예측 없음") {
        const predictionTag = document.createElement("span");
        predictionTag.className = `prediction-tag ${post.prediction}`;
        predictionTag.textContent = post.prediction;
        rightHeaderItems.appendChild(predictionTag);
    }
    
    // 코인 태그 추가 (게시글 데이터에 coinSymbol이 있다고 가정)
    if (post.coinSymbol) {
        const coin = COIN_LIST.find(c => c.symbol === post.coinSymbol);
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


    const postCardBody = document.createElement("div");
    postCardBody.className = "post-card-body";
    const postTitle = document.createElement("h3");
    postTitle.className = "post-title";
    postTitle.textContent = post.title;
    const postExcerpt = document.createElement("p");
    postExcerpt.className = "post-excerpt";
    postExcerpt.textContent = post.content.substring(0, 120) + (post.content.length > 120 ? "..." : "");
    postCardBody.appendChild(postTitle);
    postCardBody.appendChild(postExcerpt);

    const postCardFooter = document.createElement("div");
    postCardFooter.className = "post-card-footer";
    const postStats = document.createElement("div");
    postStats.className = "post-stats";
    postStats.innerHTML = `
      <span><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg> ${post.views}</span>
      <span><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.07.07-.07-.07C7.32 14.48 4 11.61 4 8.5S6.01 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c1.99 0 4 2.52 4 5.5 0 3.11-3.32 5.98-7.97 10.05z"></path></svg> ${post.likes}</span>
      <span><svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"></path></svg> ${post.commentsCount}</span>
    `; // post.comments -> post.commentsCount
    const postActions = document.createElement("div");
    postActions.className = "post-actions";
    const likeButton = document.createElement("button");
    likeButton.className = "action-button like-button";
    likeButton.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.07.07-.07-.07C7.32 14.48 4 11.61 4 8.5S6.01 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c1.99 0 4 2.52 4 5.5 0 3.11-3.32 5.98-7.97 10.05z"></path></svg><span>좋아요</span>`;
    const commentButton = document.createElement("button");
    commentButton.className = "action-button comment-button";
    commentButton.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"></path></svg><span>댓글</span>`;
    
    // 이벤트 전파 방지
    likeButton.addEventListener('click', (e) => { e.stopPropagation(); alert('좋아요 기능 구현 예정'); });
    commentButton.addEventListener('click', (e) => { e.stopPropagation(); alert('댓글 기능 구현 예정'); });

    postActions.appendChild(likeButton);
    postActions.appendChild(commentButton);
    postCardFooter.appendChild(postStats);
    postCardFooter.appendChild(postActions);

    postItem.appendChild(postCardHeader);
    postItem.appendChild(postCardBody);
    postItem.appendChild(postCardFooter);
    listContainer.appendChild(postItem);
  });
}

function filterDiscussions(tabName, listContainer) {
  const currentCoinSymbol = document.getElementById("coin-filter-select")?.value || "";
  console.log(`${tabName} 탭 선택됨. 코인: ${currentCoinSymbol || '전체'}. 게시글 필터링 (현재는 샘플데이터 재로드)`);
  // TODO: 실제 구현 시, API를 호출하여 해당 탭과 코인 필터에 맞는 데이터를 가져오고 listContainer를 업데이트.
  createSamplePosts(listContainer, currentCoinSymbol); // 필터링된 코인 심볼 전달
}

function showWriteForm(currentCoinSymbol = "") {
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
  COIN_LIST.forEach(coin => {
      const option = document.createElement("option");
      option.value = coin.symbol;
      option.textContent = `${coin.name} (${coin.symbol})`;
      if (coin.symbol === currentCoinSymbol) { // 현재 토론방 필터 코인 기본 선택
          option.selected = true;
      }
      formCoinSelect.appendChild(option);
  });


  const titleInput = document.createElement("input");
  titleInput.type = "text";
  titleInput.placeholder = "제목을 입력하세요";

  const contentTextarea = document.createElement("textarea");
  contentTextarea.placeholder = "내용을 입력하세요";
  contentTextarea.rows = 8; // 줄 수 조정

  const predictionDiv = document.createElement('div');
  predictionDiv.style.marginBottom = '15px';
  predictionDiv.style.marginTop = '10px';
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
  submitButton.addEventListener("click", () => {
    if (!titleInput.value.trim() || !contentTextarea.value.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    const newPost = {
        id: samplePosts.length + 1, // 임시 ID
        coinSymbol: formCoinSelect.value,
        title: titleInput.value,
        author: "현재사용자", // 임시 작성자
        date: new Date().toISOString().slice(0,16).replace('T', ' '),
        views: 0,
        likes: 0,
        commentsCount: 0,
        prediction: predictionSelect.value === "예측 없음" ? "중립" : predictionSelect.value,
        content: contentTextarea.value,
    };
    samplePosts.unshift(newPost); // 새 글을 맨 앞에 추가
    filterDiscussions(document.querySelector('.discussion-tabs .tab-button.active')?.textContent || '최신', document.querySelector('.posts-list')); // 목록 새로고침
    alert("게시글이 등록되었습니다.");
    document.body.removeChild(writeFormOverlay);
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
