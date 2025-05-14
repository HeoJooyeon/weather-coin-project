const GoldPrice = require('../models/gold_price');

class GoldPriceController {
    static async getGoldPrices(req, res) {
        try {
            const { itemName, startDate, endDate, limit } = req.query;
            const data = await GoldPrice.findAll({ itemName, startDate, endDate, limit });
            res.json({
                success: true,
                data
            });
        } catch (error) {
            console.error('금 시세 데이터 조회 오류:', error);
            res.status(500).json({ 
                success: false,
                message: '데이터 조회 중 오류가 발생했습니다.' 
            });
        }
    }

    static async getGoldPriceById(req, res) {
        try {
            const { goldId } = req.params;
            const data = await GoldPrice.findOne(goldId);
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
            console.error('특정 금 시세 데이터 조회 오류:', error);
            res.status(500).json({ 
                success: false,
                message: '데이터 조회 중 오류가 발생했습니다.' 
            });
        }
    }

    static async getGoldPriceByItemAndDate(req, res) {
        try {
            const { itemName, baseDate } = req.params;
            const data = await GoldPrice.findByItemAndDate(itemName, baseDate);
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
            console.error('특정 금 시세 데이터 조회 오류:', error);
            res.status(500).json({ 
                success: false,
                message: '데이터 조회 중 오류가 발생했습니다.' 
            });
        }
    }

    static async createGoldPrice(req, res) {
        try {
            const goldData = req.body;
            
            // 필수 필드 검증
            if (!goldData.item_name || !goldData.base_date || !goldData.price_krw) {
                return res.status(400).json({
                    success: false,
                    message: '상품명, 기준일자, 가격은 필수 입력 사항입니다.'
                });
            }

            // 중복 체크
            const existingData = await GoldPrice.findByItemAndDate(goldData.item_name, goldData.base_date);
            if (existingData) {
                return res.status(409).json({
                    success: false,
                    message: '이미 동일한 상품과 날짜의 데이터가 존재합니다.'
                });
            }

            const newData = await GoldPrice.create(goldData);
            res.status(201).json({
                success: true,
                message: '금 시세 데이터가 성공적으로 생성되었습니다.',
                data: newData
            });
        } catch (error) {
            console.error('금 시세 데이터 생성 오류:', error);
            res.status(500).json({
                success: false,
                message: '데이터 생성 중 오류가 발생했습니다.'
            });
        }
    }

    static async updateGoldPrice(req, res) {
        try {
            const { goldId } = req.params;
            const updateData = req.body;

            // 데이터 존재 확인
            const existingData = await GoldPrice.findOne(goldId);
            if (!existingData) {
                return res.status(404).json({
                    success: false,
                    message: '업데이트할 데이터를 찾을 수 없습니다.'
                });
            }

            const updated = await GoldPrice.update(goldId, updateData);
            if (updated) {
                res.status(200).json({
                    success: true,
                    message: '금 시세 데이터가 성공적으로 업데이트되었습니다.'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: '데이터 업데이트에 실패했습니다.'
                });
            }
        } catch (error) {
            console.error('금 시세 데이터 업데이트 오류:', error);
            res.status(500).json({
                success: false,
                message: '데이터 업데이트 중 오류가 발생했습니다.'
            });
        }
    }

    static async deleteGoldPrice(req, res) {
        try {
            const { goldId } = req.params;
            
            // 데이터 존재 확인
            const existingData = await GoldPrice.findOne(goldId);
            if (!existingData) {
                return res.status(404).json({
                    success: false,
                    message: '삭제할 데이터를 찾을 수 없습니다.'
                });
            }

            const deleted = await GoldPrice.delete(goldId);
            if (deleted) {
                res.status(200).json({
                    success: true,
                    message: '금 시세 데이터가 성공적으로 삭제되었습니다.'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: '데이터 삭제에 실패했습니다.'
                });
            }
        } catch (error) {
            console.error('금 시세 데이터 삭제 오류:', error);
            res.status(500).json({
                success: false,
                message: '데이터 삭제 중 오류가 발생했습니다.'
            });
        }
    }
}

module.exports = GoldPriceController; 