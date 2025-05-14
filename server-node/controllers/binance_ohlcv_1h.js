const BinanceOHLCV = require('../models/binance_ohlcv_1h');

class BinanceOHLCVController {
    static async getOHLCV(req, res) {
        try {
            const { pair, startTime, endTime, limit } = req.query;
            const data = await BinanceOHLCV.findAll({ pair, startTime, endTime, limit });
            res.json({
                success: true,
                data
            });
        } catch (error) {
            console.error('OHLCV 데이터 조회 오류:', error);
            res.status(500).json({ 
                success: false,
                message: '데이터 조회 중 오류가 발생했습니다.' 
            });
        }
    }

    static async getOHLCVByTime(req, res) {
        try {
            const { pair, openTime } = req.params;
            const data = await BinanceOHLCV.findOne({ pair, openTime });
            if (!data) {
                return res.status(404).json({ 
                    success: false,
                    message: '데이터를 찾을 수 없습니다.' 
                });
            }
            res.json({
                success: true,
                data
            });
        } catch (error) {
            console.error('특정 시간 OHLCV 데이터 조회 오류:', error);
            res.status(500).json({ 
                success: false,
                message: '데이터 조회 중 오류가 발생했습니다.' 
            });
        }
    }

    static async createOHLCV(req, res) {
        try {
            const ohlcvData = req.body;
            
            // 필수 필드 검증
            if (!ohlcvData.pair || !ohlcvData.open_time) {
                return res.status(400).json({
                    success: false,
                    message: '거래쌍(pair)과 시작 시간(open_time)은 필수 입력 사항입니다.'
                });
            }

            const newData = await BinanceOHLCV.create(ohlcvData);
            res.status(201).json({
                success: true,
                message: 'OHLCV 데이터가 성공적으로 생성되었습니다.',
                data: newData
            });
        } catch (error) {
            console.error('OHLCV 데이터 생성 오류:', error);
            res.status(500).json({
                success: false,
                message: '데이터 생성 중 오류가 발생했습니다.'
            });
        }
    }

    static async updateOHLCV(req, res) {
        try {
            const { pair, openTime } = req.params;
            const updateData = req.body;

            // 데이터 존재 확인
            const existingData = await BinanceOHLCV.findOne({ pair, openTime });
            if (!existingData) {
                return res.status(404).json({
                    success: false,
                    message: '업데이트할 데이터를 찾을 수 없습니다.'
                });
            }

            const updated = await BinanceOHLCV.update(pair, openTime, updateData);
            if (updated) {
                res.status(200).json({
                    success: true,
                    message: 'OHLCV 데이터가 성공적으로 업데이트되었습니다.'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: '데이터 업데이트에 실패했습니다.'
                });
            }
        } catch (error) {
            console.error('OHLCV 데이터 업데이트 오류:', error);
            res.status(500).json({
                success: false,
                message: '데이터 업데이트 중 오류가 발생했습니다.'
            });
        }
    }
}

module.exports = BinanceOHLCVController; 