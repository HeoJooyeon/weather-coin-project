const CoinPastInfo = require('../models/coin_past_info');

exports.getCoinList = async (req, res) => {
    const { pair, startDate, endDate, limit = 20 } = req.query;

    try {
        const coins = await CoinPastInfo.findAll({
            pair,
            startDate,
            endDate,
            limit: parseInt(limit)
        });

        res.status(200).json({
            success: true,
            data: coins
        });
    } catch (error) {
        console.error('코인 과거 정보 목록 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '코인 과거 정보 목록 조회 중 오류가 발생했습니다.'
        });
    }
};

exports.getCoinDetail = async (req, res) => {
    const { id } = req.params;

    try {
        const coin = await CoinPastInfo.findOne({ id });
        if (!coin) {
            return res.status(404).json({
                success: false,
                message: '해당 코인 정보를 찾을 수 없습니다.'
            });
        }

        res.status(200).json({
            success: true,
            data: coin
        });
    } catch (error) {
        console.error('코인 과거 정보 상세 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '코인 과거 정보 상세 조회 중 오류가 발생했습니다.'
        });
    }
}; 