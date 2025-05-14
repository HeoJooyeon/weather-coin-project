const express = require('express');
const router = express.Router();
const { getNewsList, getNewsDetail, createNews, updateNews, deleteNews } = require('../controllers/coin_news');

// 뉴스 목록 조회
router.get('/', getNewsList);

// 뉴스 상세 조회
router.get('/:newsId', getNewsDetail);

// 뉴스 등록
router.post('/', createNews);

// 뉴스 수정
router.put('/:newsId', updateNews);

// 뉴스 삭제
router.delete('/:newsId', deleteNews);

module.exports = router; 