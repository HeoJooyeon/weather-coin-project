const CoinIndicatorDay = require('../models/coin_indicator_day');

class CoinIndicatorDayController {
    static async getIndicators(req, res) {
        try {
            const { pair, startTime, endTime, limit } = req.query;
            const data = await CoinIndicatorDay.findAll({ pair, startTime, endTime, limit });
            res.json(data);
        } catch (error) {
            console.error('일별 지표 데이터 조회 오류:', error);
            res.status(500).json({ error: '데이터 조회 중 오류가 발생했습니다.' });
        }
    }

    static async getIndicatorByTime(req, res) {
        try {
            const { pair, openTime } = req.params;
            const data = await CoinIndicatorDay.findOne({ pair, openTime });
            if (!data) {
                return res.status(404).json({ error: '데이터를 찾을 수 없습니다.' });
            }
            res.json(data);
        } catch (error) {
            console.error('특정 시간 일별 지표 데이터 조회 오류:', error);
            res.status(500).json({ error: '데이터 조회 중 오류가 발생했습니다.' });
        }
    }
}

module.exports = CoinIndicatorDayController; 