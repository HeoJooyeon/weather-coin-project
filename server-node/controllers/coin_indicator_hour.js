const CoinIndicatorHour = require('../models/coin_indicator_hour');

exports.getHourIndicators = async (req, res) => {
    const { pair, limit = 10 } = req.query;

    try {
        const indicators = await CoinIndicatorHour.findAll({
            pair,
            limit: parseInt(limit)
        });

        res.status(200).json({
            success: true,
            data: indicators
        });
    } catch (error) {
        console.error('시간별 지표 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '시간별 지표 조회 중 오류가 발생했습니다.'
        });
    }
};

exports.getHourIndicatorDetail = async (req, res) => {
    const { indicatorId } = req.params;

    try {
        const indicator = await CoinIndicatorHour.findOne({ indicatorId });
        if (!indicator) {
            return res.status(404).json({
                success: false,
                message: '해당 시간별 지표를 찾을 수 없습니다.'
            });
        }

        res.status(200).json({
            success: true,
            data: indicator
        });
    } catch (error) {
        console.error('시간별 지표 상세 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '시간별 지표 상세 조회 중 오류가 발생했습니다.'
        });
    }
}; 