const CoinPrediction = require('../models/coin_prediction');

class CoinPredictionController {
    static async getPredictions(req, res) {
        try {
            const { pair, limit } = req.query;
            const data = await CoinPrediction.findAll({ pair, limit });
            res.json(data);
        } catch (error) {
            console.error('예측 데이터 조회 오류:', error);
            res.status(500).json({ error: '데이터 조회 중 오류가 발생했습니다.' });
        }
    }

    static async getPredictionById(req, res) {
        try {
            const { predictId } = req.params;
            const data = await CoinPrediction.findOne({ predictId });
            if (!data) {
                return res.status(404).json({ error: '데이터를 찾을 수 없습니다.' });
            }
            res.json(data);
        } catch (error) {
            console.error('특정 예측 데이터 조회 오류:', error);
            res.status(500).json({ error: '데이터 조회 중 오류가 발생했습니다.' });
        }
    }
}

module.exports = CoinPredictionController; 