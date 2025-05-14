const BoardPost = require('../models/board_post');

exports.getPosts = async (req, res) => {
    const { limit = 20, offset = 0 } = req.query;

    try {
        const posts = await BoardPost.findAll({
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            success: true,
            data: posts
        });
    } catch (error) {
        console.error('게시글 목록 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '게시글 목록 조회 중 오류가 발생했습니다.'
        });
    }
};

exports.getPostDetail = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await BoardPost.findOne(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: '해당 게시글을 찾을 수 없습니다.'
            });
        }

        res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        console.error('게시글 상세 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '게시글 상세 조회 중 오류가 발생했습니다.'
        });
    }
};

exports.createPost = async (req, res) => {
    const { title, content, writer_id } = req.body;

    // 필수 필드 검증
    if (!title || !content || !writer_id) {
        return res.status(400).json({
            success: false,
            message: '제목, 내용, 작성자 ID는 필수 입력 사항입니다.'
        });
    }

    try {
        const newPost = await BoardPost.create({
            title,
            content,
            writer_id
        });

        res.status(201).json({
            success: true,
            message: '게시글이 성공적으로 작성되었습니다.',
            data: newPost
        });
    } catch (error) {
        console.error('게시글 작성 오류:', error);
        res.status(500).json({
            success: false,
            message: '게시글 작성 중 오류가 발생했습니다.'
        });
    }
};

exports.updatePost = async (req, res) => {
    const { postId } = req.params;
    const { title, content } = req.body;

    // 필수 필드 검증
    if (!title && !content) {
        return res.status(400).json({
            success: false,
            message: '제목 또는 내용 중 하나 이상의 필드가 필요합니다.'
        });
    }

    try {
        const post = await BoardPost.findOne(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: '해당 게시글을 찾을 수 없습니다.'
            });
        }

        // 업데이트할 데이터만 포함
        const updateData = {};
        if (title) updateData.title = title;
        if (content) updateData.content = content;

        const updated = await BoardPost.update(postId, updateData);

        if (updated) {
            res.status(200).json({
                success: true,
                message: '게시글이 성공적으로 수정되었습니다.'
            });
        } else {
            res.status(500).json({
                success: false,
                message: '게시글 수정에 실패했습니다.'
            });
        }
    } catch (error) {
        console.error('게시글 수정 오류:', error);
        res.status(500).json({
            success: false,
            message: '게시글 수정 중 오류가 발생했습니다.'
        });
    }
};

exports.deletePost = async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await BoardPost.findOne(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: '해당 게시글을 찾을 수 없습니다.'
            });
        }

        const deleted = await BoardPost.delete(postId);

        if (deleted) {
            res.status(200).json({
                success: true,
                message: '게시글이 성공적으로 삭제되었습니다.'
            });
        } else {
            res.status(500).json({
                success: false,
                message: '게시글 삭제에 실패했습니다.'
            });
        }
    } catch (error) {
        console.error('게시글 삭제 오류:', error);
        res.status(500).json({
            success: false,
            message: '게시글 삭제 중 오류가 발생했습니다.'
        });
    }
}; 