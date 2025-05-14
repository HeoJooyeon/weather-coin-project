const ExchangeRate = require('../models/exchange_rate');

class ExchangeRateController {
    static async getExchangeRates(req, res) {
        try {
            const { baseCurrency, targetCurrency, startDate, endDate, limit } = req.query;
            const data = await ExchangeRate.findAll({ baseCurrency, targetCurrency, startDate, endDate, limit });
            res.json({
                success: true,
                data
            });
        } catch (error) {
            console.error('환율 데이터 조회 오류:', error);
            res.status(500).json({ 
                success: false,
                message: '데이터 조회 중 오류가 발생했습니다.' 
            });
        }
    }

    static async getExchangeRateById(req, res) {
        try {
            const { rateId } = req.params;
            const data = await ExchangeRate.findOne(rateId);
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
            console.error('특정 환율 데이터 조회 오류:', error);
            res.status(500).json({ 
                success: false,
                message: '데이터 조회 중 오류가 발생했습니다.' 
            });
        }
    }

    static async getExchangeRateByCurrencies(req, res) {
        try {
            const { baseCurrency, targetCurrency, rateDate } = req.params;
            const data = await ExchangeRate.findByCurrencies(baseCurrency, targetCurrency, rateDate);
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
            console.error('특정 환율 데이터 조회 오류:', error);
            res.status(500).json({ 
                success: false,
                message: '데이터 조회 중 오류가 발생했습니다.' 
            });
        }
    }

    static async createExchangeRate(req, res) {
        try {
            const rateData = req.body;
            
            // 필수 필드 검증
            if (!rateData.base_currency || !rateData.target_currency || !rateData.rate || !rateData.rate_date) {
                return res.status(400).json({
                    success: false,
                    message: '기준 통화, 대상 통화, 환율, 기준 날짜는 필수 입력 사항입니다.'
                });
            }

            // 중복 체크
            const existingData = await ExchangeRate.findByCurrencies(
                rateData.base_currency, 
                rateData.target_currency, 
                rateData.rate_date
            );
            if (existingData) {
                return res.status(409).json({
                    success: false,
                    message: '이미 동일한 통화와 날짜의 환율 데이터가 존재합니다.'
                });
            }

            const newData = await ExchangeRate.create(rateData);
            res.status(201).json({
                success: true,
                message: '환율 데이터가 성공적으로 생성되었습니다.',
                data: newData
            });
        } catch (error) {
            console.error('환율 데이터 생성 오류:', error);
            res.status(500).json({
                success: false,
                message: '데이터 생성 중 오류가 발생했습니다.'
            });
        }
    }

    static async updateExchangeRate(req, res) {
        try {
            const { rateId } = req.params;
            const updateData = req.body;

            // 데이터 존재 확인
            const existingData = await ExchangeRate.findOne(rateId);
            if (!existingData) {
                return res.status(404).json({
                    success: false,
                    message: '업데이트할 데이터를 찾을 수 없습니다.'
                });
            }

            const updated = await ExchangeRate.update(rateId, updateData);
            if (updated) {
                res.status(200).json({
                    success: true,
                    message: '환율 데이터가 성공적으로 업데이트되었습니다.'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: '데이터 업데이트에 실패했습니다.'
                });
            }
        } catch (error) {
            console.error('환율 데이터 업데이트 오류:', error);
            res.status(500).json({
                success: false,
                message: '데이터 업데이트 중 오류가 발생했습니다.'
            });
        }
    }

    static async deleteExchangeRate(req, res) {
        try {
            const { rateId } = req.params;
            
            // 데이터 존재 확인
            const existingData = await ExchangeRate.findOne(rateId);
            if (!existingData) {
                return res.status(404).json({
                    success: false,
                    message: '삭제할 데이터를 찾을 수 없습니다.'
                });
            }

            const deleted = await ExchangeRate.delete(rateId);
            if (deleted) {
                res.status(200).json({
                    success: true,
                    message: '환율 데이터가 성공적으로 삭제되었습니다.'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: '데이터 삭제에 실패했습니다.'
                });
            }
        } catch (error) {
            console.error('환율 데이터 삭제 오류:', error);
            res.status(500).json({
                success: false,
                message: '데이터 삭제 중 오류가 발생했습니다.'
            });
        }
    }
}

module.exports = ExchangeRateController; 