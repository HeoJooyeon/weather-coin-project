const BoardComment = require('../models/board_comment');
const BoardPost = require('../models/board_post');

exports.getCommentsByPostId = async (req, res) => {
    const { postId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    try {
        // 게시글 존재 여부 확인
        const post = await BoardPost.findOne(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: '해당 게시글을 찾을 수 없습니다.'
            });
        }

        const comments = await BoardComment.findByPostId(postId, {
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            success: true,
            data: comments
        });
    } catch (error) {
        console.error('댓글 목록 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '댓글 목록 조회 중 오류가 발생했습니다.'
        });
    }
};

exports.getCommentDetail = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await BoardComment.findOne(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: '해당 댓글을 찾을 수 없습니다.'
            });
        }

        res.status(200).json({
            success: true,
            data: comment
        });
    } catch (error) {
        console.error('댓글 상세 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '댓글 상세 조회 중 오류가 발생했습니다.'
        });
    }
};

exports.createComment = async (req, res) => {
    const { post_id, writer_id, content } = req.body;

    // 필수 필드 검증
    if (!post_id || !writer_id || !content) {
        return res.status(400).json({
            success: false,
            message: '게시글 ID, 작성자 ID, 내용은 필수 입력 사항입니다.'
        });
    }

    try {
        // 게시글 존재 여부 확인
        const post = await BoardPost.findOne(post_id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: '댓글을 작성할 게시글이 존재하지 않습니다.'
            });
        }

        const newComment = await BoardComment.create({
            post_id,
            writer_id,
            content
        });

        res.status(201).json({
            success: true,
            message: '댓글이 성공적으로 작성되었습니다.',
            data: newComment
        });
    } catch (error) {
        console.error('댓글 작성 오류:', error);
        res.status(500).json({
            success: false,
            message: '댓글 작성 중 오류가 발생했습니다.'
        });
    }
};

exports.updateComment = async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    // 필수 필드 검증
    if (!content) {
        return res.status(400).json({
            success: false,
            message: '댓글 내용은 필수 입력 사항입니다.'
        });
    }

    try {
        const comment = await BoardComment.findOne(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: '해당 댓글을 찾을 수 없습니다.'
            });
        }

        const updated = await BoardComment.update(commentId, { content });

        if (updated) {
            res.status(200).json({
                success: true,
                message: '댓글이 성공적으로 수정되었습니다.'
            });
        } else {
            res.status(500).json({
                success: false,
                message: '댓글 수정에 실패했습니다.'
            });
        }
    } catch (error) {
        console.error('댓글 수정 오류:', error);
        res.status(500).json({
            success: false,
            message: '댓글 수정 중 오류가 발생했습니다.'
        });
    }
};

exports.deleteComment = async (req, res) => {
    const { commentId } = req.params;

    try {
        const comment = await BoardComment.findOne(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: '해당 댓글을 찾을 수 없습니다.'
            });
        }

        const deleted = await BoardComment.delete(commentId);

        if (deleted) {
            res.status(200).json({
                success: true,
                message: '댓글이 성공적으로 삭제되었습니다.'
            });
        } else {
            res.status(500).json({
                success: false,
                message: '댓글 삭제에 실패했습니다.'
            });
        }
    } catch (error) {
        console.error('댓글 삭제 오류:', error);
        res.status(500).json({
            success: false,
            message: '댓글 삭제 중 오류가 발생했습니다.'
        });
    }
}; 