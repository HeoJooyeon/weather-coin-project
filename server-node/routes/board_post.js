const express = require('express');
const router = express.Router();
const BoardPostController = require('../controllers/board_post');

// 게시글 목록 조회
router.get('/', BoardPostController.getPosts);

// 특정 ID의 게시글 조회
router.get('/:postId', BoardPostController.getPostDetail);

// 새로운 게시글 생성
router.post('/', BoardPostController.createPost);

// 게시글 수정
router.put('/:postId', BoardPostController.updatePost);

// 게시글 삭제
router.delete('/:postId', BoardPostController.deletePost);

module.exports = router; 