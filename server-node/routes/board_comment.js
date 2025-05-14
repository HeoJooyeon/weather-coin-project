const express = require('express');
const router = express.Router();
const BoardCommentController = require('../controllers/board_comment');

// 댓글 목록 조회 (전체)
router.get('/', (req, res) => {
    res.status(501).json({
        success: false,
        message: '아직 구현되지 않은 기능입니다.'
    });
});

// 특정 ID의 댓글 조회
router.get('/:commentId', BoardCommentController.getCommentDetail);

// 특정 게시글의 댓글 목록 조회
router.get('/post/:postId', BoardCommentController.getCommentsByPostId);

// 새로운 댓글 생성
router.post('/', BoardCommentController.createComment);

// 댓글 수정
router.put('/:commentId', BoardCommentController.updateComment);

// 댓글 삭제
router.delete('/:commentId', BoardCommentController.deleteComment);

module.exports = router; 