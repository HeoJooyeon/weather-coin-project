// src/pages/PostDetail.js

import {
  fetchCoinsFromServerAPI, // COIN_LIST 대신 실제 API로 가져오기
  fetchBoardPostDetail,
  fetchComments,
  formatApiTimestamp,
} from "../app/api/conapi.js";

// 코인 목록 캐시 변수 (API 호출 최소화)
let cachedCoins = [];

export async function renderPostDetailPage(container, postIdStr) {
  container.innerHTML = "";
  const postId = parseInt(postIdStr);

  if (!postId || isNaN(postId)) {
    showErrorMessage(container, "잘못된 게시글 ID입니다.");
    return;
  }

  // 로딩 표시
  const loadingIndicator = document.createElement("div");
  loadingIndicator.className = "loading-indicator";
  loadingIndicator.innerHTML = `
    <div class="spinner"></div>
    <p>게시글을 불러오는 중입니다...</p>
  `;
  container.appendChild(loadingIndicator);

  try {
    // 필요한 경우 코인 목록 로드
    if (cachedCoins.length === 0) {
      try {
        cachedCoins = await fetchCoinsFromServerAPI();
        console.log("PostDetail: API에서 코인 목록 가져옴:", cachedCoins);
      } catch (error) {
        console.error("코인 목록을 가져오는 중 오류:", error);
      }
    }

    // API를 통해 게시글 상세 정보 가져오기
    const post = await fetchBoardPostDetail(postId);

    // 로딩 인디케이터 제거
    container.innerHTML = "";

    // 게시글이 없는 경우
    if (!post) {
      showErrorMessage(
        container,
        `요청하신 게시글을 찾을 수 없습니다. (ID: ${postIdStr})`,
      );
      return;
    }

    const pageWrapper = document.createElement("div");
    pageWrapper.className = "post-detail-page-wrapper";

    // 상단: 목록으로 가기 버튼
    const backButtonTop = createBackButton(post.coinSymbol);
    pageWrapper.appendChild(backButtonTop);

    // 게시글 컨테이너
    const postDetailContainer = document.createElement("article");
    postDetailContainer.className = "post-detail-container";

    // 헤더 영역 (제목, 작성자 정보 등)
    const header = await createPostHeader(post);
    postDetailContainer.appendChild(header);

    // 본문 내용
    const content = document.createElement("div");
    content.className = "post-detail-content";
    content.innerHTML = post.content.replace(/\n/g, "<br>");
    postDetailContainer.appendChild(content);

    // 하단 액션 (좋아요, 공유 등)
    const actions = createActionButtons(post);
    postDetailContainer.appendChild(actions);

    pageWrapper.appendChild(postDetailContainer);

    // 댓글 섹션
    const commentsSection = await createCommentsSection(postId);
    pageWrapper.appendChild(commentsSection);

    // 하단: 목록으로 가기 버튼
    const backButtonBottom = createBackButton(post.coinSymbol);
    backButtonBottom.className = "back-to-list-button bottom";
    pageWrapper.appendChild(backButtonBottom);

    container.appendChild(pageWrapper);
  } catch (error) {
    console.error("게시글 상세 정보 로딩 중 오류:", error);
    showErrorMessage(container, "게시글을 불러오는 중 오류가 발생했습니다.");
  }
}

// 에러 메시지 표시 함수
function showErrorMessage(container, message) {
  const errorWrapper = document.createElement("div");
  errorWrapper.className = "error-wrapper";

  const errorMessage = document.createElement("p");
  errorMessage.className = "error-message";
  errorMessage.textContent = message;

  const backButton = document.createElement("button");
  backButton.className = "back-to-list-button top";
  backButton.textContent = "목록으로 돌아가기";
  backButton.onclick = () => {
    window.location.hash = "#discussion";
  };

  errorWrapper.appendChild(errorMessage);
  errorWrapper.appendChild(backButton);
  container.appendChild(errorWrapper);
}

// 뒤로가기 버튼 생성
function createBackButton(coinSymbol) {
  const backButton = document.createElement("button");
  backButton.className = "back-to-list-button top";
  backButton.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg> 목록으로`;
  backButton.onclick = () => {
    window.location.hash = `#discussion${coinSymbol ? "/" + coinSymbol : ""}`;
  };
  return backButton;
}

// 게시글 헤더 영역 생성
async function createPostHeader(post) {
  const header = document.createElement("header");
  header.className = "post-detail-header";

  // 제목
  const title = document.createElement("h1");
  title.className = "post-detail-title";
  title.textContent = post.title;

  // 코인 태그 (있는 경우)
  if (post.coinSymbol) {
    // 필요한 경우 코인 목록 가져오기
    if (cachedCoins.length === 0) {
      try {
        cachedCoins = await fetchCoinsFromServerAPI();
      } catch (error) {
        console.error("코인 정보를 가져오는 중 오류:", error);
      }
    }

    const coinInfo = cachedCoins.find((c) => c.symbol === post.coinSymbol);
    if (coinInfo) {
      const coinTag = document.createElement("span");
      coinTag.className = "post-detail-coin-tag";
      coinTag.textContent = `${coinInfo.graphicSymbol || coinInfo.symbol} ${coinInfo.name}`;
      coinTag.onclick = () =>
        (window.location.hash = `#coin/${coinInfo.symbol}`);
      header.appendChild(coinTag);
    }
  }

  header.appendChild(title);

  // 메타 정보 (작성자, 날짜, 조회수 등)
  const metaInfo = document.createElement("div");
  metaInfo.className = "post-detail-meta";

  // 작성자 아바타
  const authorAvatar = document.createElement("span");
  authorAvatar.className = "post-author-avatar detail-avatar";
  authorAvatar.textContent = "U"; // User의 첫 글자

  // 작성자 ID
  const authorName = document.createElement("span");
  authorName.className = "post-author-name";
  authorName.textContent = `사용자 ${post.writerid}`;

  // 날짜
  const postDate = document.createElement("span");
  postDate.className = "post-date";
  postDate.textContent = `작성일: ${formatApiTimestamp(post.createdat)}`;

  // 조회수
  const views = document.createElement("span");
  views.className = "post-views";
  views.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg> ${post.viewcount || 0}`;

  metaInfo.appendChild(authorAvatar);
  metaInfo.appendChild(authorName);
  metaInfo.appendChild(postDate);
  metaInfo.appendChild(views);

  header.appendChild(metaInfo);
  return header;
}

// 액션 버튼 생성 (좋아요 등)
function createActionButtons(post) {
  const actions = document.createElement("div");
  actions.className = "post-detail-actions";

  const likeButton = document.createElement("button");
  likeButton.className = "action-button like-button";
  likeButton.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.07.07-.07-.07C7.32 14.48 4 11.61 4 8.5S6.01 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c1.99 0 4 2.52 4 5.5 0 3.11-3.32 5.98-7.97 10.05z"></path></svg> 좋아요 (${post.likes || 0})`;

  // 이벤트 핸들러 (실제로는 API 호출이 필요함)
  likeButton.addEventListener("click", () => {
    alert("좋아요 기능은 아직 구현되지 않았습니다.");
  });

  actions.appendChild(likeButton);
  return actions;
}

// 댓글 섹션 생성
async function createCommentsSection(postId) {
  const commentsSection = document.createElement("section");
  commentsSection.className = "comments-section";

  // 댓글 수를 표시할 헤더
  const commentsTitle = document.createElement("h3");
  commentsTitle.textContent = "댓글 불러오는 중...";
  commentsSection.appendChild(commentsTitle);

  // 댓글 작성 폼
  const commentForm = document.createElement("form");
  commentForm.className = "comment-form";

  const commentTextarea = document.createElement("textarea");
  commentTextarea.placeholder = "댓글을 입력하세요...";
  commentTextarea.rows = 3;

  const commentSubmitButton = document.createElement("button");
  commentSubmitButton.type = "submit";
  commentSubmitButton.textContent = "댓글 등록";

  commentForm.appendChild(commentTextarea);
  commentForm.appendChild(commentSubmitButton);

  // 폼 제출 이벤트
  commentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (commentTextarea.value.trim()) {
      alert(`댓글 작성 기능은 아직 구현되지 않았습니다.`);
      commentTextarea.value = "";
    }
  });

  commentsSection.appendChild(commentForm);

  // 댓글 목록 컨테이너
  const commentsList = document.createElement("ul");
  commentsList.className = "comments-list";
  commentsList.innerHTML =
    "<li class='loading-message'>댓글을 불러오는 중...</li>";

  try {
    // API를 통해 댓글 데이터 가져오기
    const comments = await fetchComments(postId);

    // 댓글 수 업데이트
    commentsTitle.textContent = `댓글 (${comments.length})`;

    // 댓글 목록 렌더링
    commentsList.innerHTML = "";

    if (comments.length > 0) {
      comments.forEach((comment) => {
        const commentItem = document.createElement("li");
        commentItem.className = "comment-item";

        commentItem.innerHTML = `
          <div class="comment-author-info">
            <span class="post-author-avatar comment-avatar">U</span>
            <span class="post-author-name">사용자 ${comment.writerid}</span>
            <span class="post-date">${formatApiTimestamp(comment.createdat)}</span>
          </div>
          <p class="comment-content">${comment.content}</p>
        `;

        commentsList.appendChild(commentItem);
      });
    } else {
      const noComments = document.createElement("li");
      noComments.textContent = "아직 댓글이 없습니다.";
      noComments.className = "no-comments";
      commentsList.appendChild(noComments);
    }
  } catch (error) {
    console.error("댓글 불러오기 실패:", error);
    commentsList.innerHTML =
      "<li class='error-message'>댓글을 불러오는데 실패했습니다.</li>";
  }

  commentsSection.appendChild(commentsList);
  return commentsSection;
}
