
// pages/PostDetail.js
import { COIN_LIST } from "../app/api/conapi.js";

// Discussion.js와 동일한 샘플 데이터를 사용 (실제로는 API 호출 또는 props/상태 관리로 전달)
const samplePostsData = [
  { id:1, coinSymbol: "BTC", title: "비트코인 지금이라도 타야할까요? 분위기가 심상치 않네요", author: "코린이탐험대", date: "2025-05-11 10:30", views: 1245, likes: 78, commentsCount: 32, prediction: "상승", content: "최근 비트코인 가격 변동성이 커지면서 많은 분들이 고민이실 것 같습니다. 저는 장기적으로 우상향 할 것이라고 보는데, 여러분의 생각은 어떠신가요? 함께 이야기 나눠봐요!\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n두 번째 단락입니다. 여기에는 조금 더 긴 내용이 들어갈 수 있습니다. 게시글 상세 페이지에서는 전체 내용을 보여주는 것이 중요합니다. 사용자들이 충분한 정보를 얻을 수 있도록 상세하게 작성하는 것이 좋습니다." },
  { id:2, coinSymbol: "ETH", title: "이더리움, 다음주 중요한 발표 예정! 미리 선점하세요", author: "정보분석가", date: "2025-05-10 15:45", views: 982, likes: 56, commentsCount: 24, prediction: "상승", content: "이더리움 재단에서 다음 주 중대 발표가 있을 예정이라는 소식입니다. 이번 발표 내용에 따라 시장에 큰 파장이 예상되니, 관심있게 지켜보시는 것이 좋겠습니다. \n\n상세 내용은 다음과 같습니다: [상세 내용] 이 부분은 추후 업데이트될 예정입니다." },
  { id:3, coinSymbol: "XRP", title: "리플 소송 결과 임박? 단기 변동성 주의하세요", author: "법률전문가", date: "2025-05-09 09:12", views: 756, likes: 23, commentsCount: 41, prediction: "중립", content: "리플과 SEC 간의 소송 결과가 곧 나올 것이라는 전망이 나오고 있습니다. 결과에 따라 가격이 급등락할 수 있으니, 투자에 각별히 유의하시기 바랍니다. \n\n법률적인 관점에서 볼 때, 이번 소송은 암호화폐 시장 전체에 큰 영향을 미칠 수 있는 중요한 사건입니다." },
  { id:4, coinSymbol: "SOL", title: "솔라나 기반 밈코인, 다시 한번 불장 올까요?", author: "밈코인헌터", date: "2025-05-08 18:20", views: 634, likes: 89, commentsCount: 15, prediction: "상승", content: "최근 솔라나 네트워크의 안정성이 향상되면서 솔라나 기반 밈코인들이 다시 주목받고 있습니다. 제2의 봉크, 도그위프햇이 나올 수 있을지 기대되네요. \n\n밈코인 투자는 매우 높은 변동성을 동반하므로, 신중한 접근이 필요합니다." },
  { id:5, coinSymbol: "BTC", title: "단타매매 수익 인증합니다 (하루 +15%)", author: "스캘핑마스터", date: "2025-05-07 22:05", views: 2056, likes: 152, commentsCount: 68, prediction: "중립", content: "오늘 장중 변동성을 이용해서 짧게 수익 실현했습니다. 매매는 짧고 굵게! 다들 성투하세요~ (매매 내역 첨부)\n\n차트 분석과 빠른 판단이 단타 매매의 핵심입니다. 첨부된 이미지를 통해 실제 매매 타점을 확인해보세요." },
];

// 임시 댓글 데이터
const sampleComments = [
    { id: 1, postId: 1, author: "댓글러1", date: "2025-05-11 11:00", content: "좋은 분석 감사합니다! 저도 장기적으로 보고 있어요." },
    { id: 2, postId: 1, author: "BTC신봉자", date: "2025-05-11 11:30", content: "비트코인은 결국 우상향입니다. 걱정마세요!" },
    { id: 3, postId: 2, author: "이더최고", date: "2025-05-10 16:00", content: "정보 감사합니다. 기대되네요!" }
];


export function renderPostDetailPage(container, postIdStr) {
  container.innerHTML = "";
  const postId = parseInt(postIdStr);
  const post = samplePostsForDetail.find(p => p.id === postId);

  const pageWrapper = document.createElement("div");
  pageWrapper.className = "post-detail-page-wrapper";

  if (!post) {
    pageWrapper.innerHTML = `<p class="error-message">요청하신 게시글을 찾을 수 없습니다. (ID: ${postIdStr})</p>`;
    const backButton = document.createElement("button");
    backButton.className = "back-to-list-button top";
    backButton.textContent = "목록으로 돌아가기";
    backButton.onclick = () => { window.location.hash = "#discussion"; };
    pageWrapper.insertBefore(backButton, pageWrapper.firstChild);
    container.appendChild(pageWrapper);
    return;
  }

  const coinInfo = COIN_LIST.find(c => c.symbol === post.coinSymbol);

  // 상단: 목록으로 가기 버튼
  const backButtonTop = document.createElement("button");
  backButtonTop.className = "back-to-list-button top";
  backButtonTop.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg> 목록으로`;
  backButtonTop.onclick = () => { window.location.hash = `#discussion${post.coinSymbol ? '/' + post.coinSymbol : ''}`; };
  pageWrapper.appendChild(backButtonTop);

  // 게시글 컨테이너
  const postDetailContainer = document.createElement("article");
  postDetailContainer.className = "post-detail-container";

  // 헤더
  const header = document.createElement("header");
  header.className = "post-detail-header";
  const title = document.createElement("h1");
  title.className = "post-detail-title";
  title.textContent = post.title;

  if (coinInfo) {
    const coinTag = document.createElement("span");
    coinTag.className = "post-detail-coin-tag";
    coinTag.textContent = `${coinInfo.graphicSymbol || coinInfo.symbol} ${coinInfo.name}`;
    coinTag.onclick = () => window.location.hash = `#coin/${coinInfo.symbol}`;
    header.appendChild(coinTag);
  }
  header.appendChild(title);
  
  // 메타 정보 (작성자, 날짜, 조회수 등)
  const metaInfo = document.createElement("div");
  metaInfo.className = "post-detail-meta";
  const authorAvatar = document.createElement("span");
  authorAvatar.className = "post-author-avatar detail-avatar"; // 추가 클래스
  authorAvatar.textContent = post.author.charAt(0).toUpperCase();
  const authorName = document.createElement("span");
  authorName.className = "post-author-name";
  authorName.textContent = post.author;
  const postDate = document.createElement("span");
  postDate.className = "post-date";
  postDate.textContent = `작성일: ${post.date}`;
  const views = document.createElement("span");
  views.className = "post-views";
  views.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg> ${post.views}`;
  if (post.prediction && post.prediction !== "예측 없음") {
    const predictionTag = document.createElement("span");
    predictionTag.className = `prediction-tag ${post.prediction} detail-tag`;
    predictionTag.textContent = post.prediction;
    metaInfo.appendChild(predictionTag);
  }
  metaInfo.appendChild(authorAvatar);
  metaInfo.appendChild(authorName);
  metaInfo.appendChild(postDate);
  metaInfo.appendChild(views);
  header.appendChild(metaInfo);
  postDetailContainer.appendChild(header);

  // 본문 내용
  const content = document.createElement("div");
  content.className = "post-detail-content";
  // content.textContent = post.content; // 단순 텍스트일 경우
  // HTML 내용을 허용하려면 innerHTML 사용 (보안 주의) 또는 Markdown 파서 사용
  // 여기서는 \n을 <br>로 변환하여 줄바꿈 표시
  content.innerHTML = post.content.replace(/\n/g, "<br>");
  postDetailContainer.appendChild(content);

  // 하단 액션 (좋아요, 공유 등 - 임시)
  const actions = document.createElement("div");
  actions.className = "post-detail-actions";
  const likeButton = document.createElement("button");
  likeButton.className = "action-button like-button";
  likeButton.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.07.07-.07-.07C7.32 14.48 4 11.61 4 8.5S6.01 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c1.99 0 4 2.52 4 5.5 0 3.11-3.32 5.98-7.97 10.05z"></path></svg> 좋아요 (${post.likes})`;
  // TODO: 좋아요 기능 구현
  actions.appendChild(likeButton);
  // 다른 액션 버튼들 (예: 수정, 삭제 - 권한 필요)
  postDetailContainer.appendChild(actions);
  pageWrapper.appendChild(postDetailContainer);

  // 댓글 섹션
  const commentsSection = document.createElement("section");
  commentsSection.className = "comments-section";
  const commentsTitle = document.createElement("h3");
  commentsTitle.textContent = `댓글 (${post.commentsCount || 0})`; // Discussion.js samplePosts에 commentsCount 추가 가정
  commentsSection.appendChild(commentsTitle);

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
  commentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (commentTextarea.value.trim()) {
          alert(`댓글: "${commentTextarea.value}" (등록 기능 구현 예정)`);
          commentTextarea.value = "";
          // TODO: 댓글 등록 및 목록 업데이트 로직
      }
  });
  commentsSection.appendChild(commentForm);

  const commentsList = document.createElement("ul");
  commentsList.className = "comments-list";
  const postComments = sampleComments.filter(comment => comment.postId === postId);
  if (postComments.length > 0) {
    postComments.forEach(comment => {
      const commentItem = document.createElement("li");
      commentItem.className = "comment-item";
      commentItem.innerHTML = `
        <div class="comment-author-info">
          <span class="post-author-avatar comment-avatar">${comment.author.charAt(0).toUpperCase()}</span>
          <span class="post-author-name">${comment.author}</span>
          <span class="post-date">${comment.date}</span>
        </div>
        <p class="comment-content">${comment.content}</p>
      `;
      commentsList.appendChild(commentItem);
    });
  } else {
    const noComments = document.createElement("p");
    noComments.textContent = "아직 댓글이 없습니다.";
    noComments.className = "no-comments";
    commentsList.appendChild(noComments);
  }
  commentsSection.appendChild(commentsList);
  pageWrapper.appendChild(commentsSection);

  // 하단: 목록으로 가기 버튼
  const backButtonBottom = document.createElement("button");
  backButtonBottom.className = "back-to-list-button bottom";
  backButtonBottom.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg> 목록으로`;
  backButtonBottom.onclick = () => { window.location.hash = `#discussion${post.coinSymbol ? '/' + post.coinSymbol : ''}`; };
  pageWrapper.appendChild(backButtonBottom);

  container.appendChild(pageWrapper);
}

// PostDetail.js에서 사용할 샘플 데이터 (Discussion.js의 데이터와 동일하거나 확장)
const samplePostsForDetail = [
    { id:1, coinSymbol: "BTC", title: "비트코인 지금이라도 타야할까요? 분위기가 심상치 않네요", author: "코린이탐험대", date: "2025-05-11 10:30", views: 1245, likes: 78, commentsCount: 2, prediction: "상승", content: "최근 비트코인 가격 변동성이 커지면서 많은 분들이 고민이실 것 같습니다. 저는 장기적으로 우상향 할 것이라고 보는데, 여러분의 생각은 어떠신가요? 함께 이야기 나눠봐요!\n\n추가 내용: 비트코인의 역사적 데이터를 살펴보면, 큰 하락 이후에는 항상 더 큰 상승이 있었습니다. 물론 과거가 미래를 보장하는 것은 아니지만, 현재 시장 상황과 여러 지표들을 종합적으로 고려했을 때 긍정적인 신호들이 많이 보입니다. 특히 기관 투자자들의 유입과 ETF 승인 가능성 등은 장기적인 상승 동력이 될 수 있습니다.\n\n다만, 단기적인 변동성은 여전히 클 수 있으므로 투자에는 항상 신중해야 합니다. 분할 매수와 리스크 관리는 필수입니다!" },
    { id:2, coinSymbol: "ETH", title: "이더리움, 다음주 중요한 발표 예정! 미리 선점하세요", author: "정보분석가", date: "2025-05-10 15:45", views: 982, likes: 56, commentsCount: 1, prediction: "상승", content: "이더리움 재단에서 다음 주 중대 발표가 있을 예정이라는 소식입니다. 이번 발표 내용에 따라 시장에 큰 파장이 예상되니, 관심있게 지켜보시는 것이 좋겠습니다. \n\n들리는 소문에 의하면, 이번 발표는 이더리움 2.0 업그레이드의 다음 단계와 관련된 로드맵, 그리고 새로운 확장성 솔루션에 대한 내용일 가능성이 높다고 합니다. 만약 이것이 사실이라면 이더리움 생태계에 엄청난 호재로 작용할 수 있습니다." },
    { id:3, coinSymbol: "XRP", title: "리플 소송 결과 임박? 단기 변동성 주의하세요", author: "법률전문가", date: "2025-05-09 09:12", views: 756, likes: 23, commentsCount: 0, prediction: "중립", content: "리플과 SEC 간의 소송 결과가 곧 나올 것이라는 전망이 나오고 있습니다. 결과에 따라 가격이 급등락할 수 있으니, 투자에 각별히 유의하시기 바랍니다. \n\n현재까지 나온 정보들을 종합해 보면, 완전한 승소나 패소보다는 양측에 일부 유리한 판결이 나올 가능성이 점쳐지고 있습니다. 하지만 법원의 최종 판단은 예측하기 어려우므로, 결과 발표 전후로 변동성이 극심해질 수 있습니다. 투자자들은 관련 뉴스에 귀를 기울이고, 리스크 관리에 만전을 기해야 할 것입니다." },
    { id:4, coinSymbol: "SOL", title: "솔라나 기반 밈코인, 다시 한번 불장 올까요?", author: "밈코인헌터", date: "2025-05-08 18:20", views: 634, likes: 89, commentsCount: 0, prediction: "상승", content: "최근 솔라나 네트워크의 안정성이 향상되면서 솔라나 기반 밈코인들이 다시 주목받고 있습니다. 제2의 봉크, 도그위프햇이 나올 수 있을지 기대되네요. \n\n특히 최근 출시된 몇몇 밈코인들이 커뮤니티의 강력한 지지를 받으며 빠르게 성장하고 있습니다. 하지만 밈코인 투자는 하이 리스크 하이 리턴의 전형적인 예이므로, 투자금의 극히 일부만으로 재미삼아 접근하는 것이 현명할 수 있습니다." },
    { id:5, coinSymbol: "BTC", title: "단타매매 수익 인증합니다 (하루 +15%)", author: "스캘핑마스터", date: "2025-05-07 22:05", views: 2056, likes: 152, commentsCount: 0, prediction: "중립", content: "오늘 장중 변동성을 이용해서 짧게 수익 실현했습니다. 매매는 짧고 굵게! 다들 성투하세요~ (매매 내역 첨부)\n\n저의 주요 전략은 지지선과 저항선을 활용한 돌파 매매입니다. 오늘은 비트코인이 주요 지지선에서 반등하는 모습을 포착하여 매수했고, 단기 저항선 부근에서 빠르게 매도하여 수익을 확정했습니다. 시장 상황이 유동적이므로 항상 손절 라인을 설정하고 기계적으로 대응하는 것이 중요합니다." },
];
