const CoinNews = require('../models/coin_news');

exports.getNewsList = async (req, res) => {
    const { symbol, pair, limit = 10 } = req.query;

    try {
        const news = await CoinNews.findAll({
            symbol,
            pair,
            limit: parseInt(limit)
        });

        res.status(200).json({
            success: true,
            data: news
        });
    } catch (error) {
        console.error('뉴스 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '뉴스 조회 중 오류가 발생했습니다.'
        });
    }
};

exports.getNewsDetail = async (req, res) => {
    const { newsId } = req.params;

    try {
        const news = await CoinNews.findOne(newsId);
        if (!news) {
            return res.status(404).json({
                success: false,
                message: '해당 뉴스를 찾을 수 없습니다.'
            });
        }

        res.status(200).json({
            success: true,
            data: news
        });
    } catch (error) {
        console.error('뉴스 상세 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '뉴스 상세 조회 중 오류가 발생했습니다.'
        });
    }
};

exports.createNews = async (req, res) => {
    const { title, pair, symbol, content, url, publish_time } = req.body;

    // 필수 필드 검증
    if (!title || !pair || !content) {
        return res.status(400).json({
            success: false,
            message: '제목, 거래쌍, 내용은 필수 입력 사항입니다.'
        });
    }

    try {
        const newsData = {
            title,
            pair,
            symbol,
            content,
            url,
            publish_time: publish_time || new Date()
        };

        const newNews = await CoinNews.create(newsData);

        res.status(201).json({
            success: true,
            message: '뉴스가 성공적으로 등록되었습니다.',
            data: newNews
        });
    } catch (error) {
        console.error('뉴스 등록 오류:', error);
        res.status(500).json({
            success: false,
            message: '뉴스 등록 중 오류가 발생했습니다.'
        });
    }
};

exports.updateNews = async (req, res) => {
    const { newsId } = req.params;
    const { title, pair, symbol, content, url, publish_time } = req.body;

    try {
        const news = await CoinNews.findOne(newsId);
        if (!news) {
            return res.status(404).json({
                success: false,
                message: '해당 뉴스를 찾을 수 없습니다.'
            });
        }

        // 업데이트할 데이터만 포함
        const updateData = {};
        if (title) updateData.title = title;
        if (pair) updateData.pair = pair;
        if (symbol) updateData.symbol = symbol;
        if (content) updateData.content = content;
        if (url) updateData.url = url;
        if (publish_time) updateData.publish_time = publish_time;

        const updated = await CoinNews.update(newsId, updateData);

        if (updated) {
            res.status(200).json({
                success: true,
                message: '뉴스가 성공적으로 수정되었습니다.'
            });
        } else {
            res.status(500).json({
                success: false,
                message: '뉴스 수정에 실패했습니다.'
            });
        }
    } catch (error) {
        console.error('뉴스 수정 오류:', error);
        res.status(500).json({
            success: false,
            message: '뉴스 수정 중 오류가 발생했습니다.'
        });
    }
};

exports.deleteNews = async (req, res) => {
    const { newsId } = req.params;

    try {
        const news = await CoinNews.findOne(newsId);
        if (!news) {
            return res.status(404).json({
                success: false,
                message: '해당 뉴스를 찾을 수 없습니다.'
            });
        }

        const deleted = await CoinNews.delete(newsId);

        if (deleted) {
            res.status(200).json({
                success: true,
                message: '뉴스가 성공적으로 삭제되었습니다.'
            });
        } else {
            res.status(500).json({
                success: false,
                message: '뉴스 삭제에 실패했습니다.'
            });
        }
    } catch (error) {
        console.error('뉴스 삭제 오류:', error);
        res.status(500).json({
            success: false,
            message: '뉴스 삭제 중 오류가 발생했습니다.'
        });
    }
}; 