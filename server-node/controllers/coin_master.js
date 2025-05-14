const CoinMaster = require('../models/coin_master');

class CoinMasterController {
    static async getCoinMasters(req, res) {
        try {
            const { name, symbol, pair, limit } = req.query;
            const data = await CoinMaster.findAll({ name, symbol, pair, limit });
            res.json({
                success: true,
                data
            });
        } catch (error) {
            console.error('코인 마스터 정보 조회 오류:', error);
            res.status(500).json({ 
                success: false,
                message: '데이터 조회 중 오류가 발생했습니다.' 
            });
        }
    }

    static async getCoinMasterById(req, res) {
        try {
            const { id } = req.params;
            const data = await CoinMaster.findOne(id);
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
            console.error('특정 코인 마스터 정보 조회 오류:', error);
            res.status(500).json({ 
                success: false,
                message: '데이터 조회 중 오류가 발생했습니다.' 
            });
        }
    }

    static async getCoinMasterByPair(req, res) {
        try {
            const { pair } = req.params;
            const data = await CoinMaster.findByPair(pair);
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
            console.error('특정 거래쌍 코인 마스터 정보 조회 오류:', error);
            res.status(500).json({ 
                success: false,
                message: '데이터 조회 중 오류가 발생했습니다.' 
            });
        }
    }

    static async getCoinMasterBySymbol(req, res) {
        try {
            const { symbol } = req.params;
            const data = await CoinMaster.findBySymbol(symbol);
            if (!data || data.length === 0) {
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
            console.error('특정 심볼 코인 마스터 정보 조회 오류:', error);
            res.status(500).json({ 
                success: false,
                message: '데이터 조회 중 오류가 발생했습니다.' 
            });
        }
    }

    static async createCoinMaster(req, res) {
        try {
            const coinData = req.body;
            
            // 필수 필드 검증
            if (!coinData.name || !coinData.symbol || !coinData.pair) {
                return res.status(400).json({
                    success: false,
                    message: '코인 이름, 심볼, 거래쌍은 필수 입력 사항입니다.'
                });
            }

            // 중복 체크
            const existingData = await CoinMaster.findByPair(coinData.pair);
            if (existingData) {
                return res.status(409).json({
                    success: false,
                    message: '이미 동일한 거래쌍의 코인 정보가 존재합니다.'
                });
            }

            const newData = await CoinMaster.create(coinData);
            res.status(201).json({
                success: true,
                message: '코인 마스터 정보가 성공적으로 생성되었습니다.',
                data: newData
            });
        } catch (error) {
            console.error('코인 마스터 정보 생성 오류:', error);
            res.status(500).json({
                success: false,
                message: '데이터 생성 중 오류가 발생했습니다.'
            });
        }
    }

    static async updateCoinMaster(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            // 데이터 존재 확인
            const existingData = await CoinMaster.findOne(id);
            if (!existingData) {
                return res.status(404).json({
                    success: false,
                    message: '업데이트할 데이터를 찾을 수 없습니다.'
                });
            }

            // 이미 존재하는 pair로 변경하려는 경우 체크
            if (updateData.pair && updateData.pair !== existingData.pair) {
                const duplicatePair = await CoinMaster.findByPair(updateData.pair);
                if (duplicatePair) {
                    return res.status(409).json({
                        success: false,
                        message: '이미 동일한 거래쌍의 코인 정보가 존재합니다.'
                    });
                }
            }

            const updated = await CoinMaster.update(id, updateData);
            if (updated) {
                res.status(200).json({
                    success: true,
                    message: '코인 마스터 정보가 성공적으로 업데이트되었습니다.'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: '데이터 업데이트에 실패했습니다.'
                });
            }
        } catch (error) {
            console.error('코인 마스터 정보 업데이트 오류:', error);
            res.status(500).json({
                success: false,
                message: '데이터 업데이트 중 오류가 발생했습니다.'
            });
        }
    }

    static async deleteCoinMaster(req, res) {
        try {
            const { id } = req.params;
            
            // 데이터 존재 확인
            const existingData = await CoinMaster.findOne(id);
            if (!existingData) {
                return res.status(404).json({
                    success: false,
                    message: '삭제할 데이터를 찾을 수 없습니다.'
                });
            }

            const deleted = await CoinMaster.delete(id);
            if (deleted) {
                res.status(200).json({
                    success: true,
                    message: '코인 마스터 정보가 성공적으로 삭제되었습니다.'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: '데이터 삭제에 실패했습니다.'
                });
            }
        } catch (error) {
            console.error('코인 마스터 정보 삭제 오류:', error);
            res.status(500).json({
                success: false,
                message: '데이터 삭제 중 오류가 발생했습니다.'
            });
        }
    }
}

module.exports = CoinMasterController; 