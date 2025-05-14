const express = require('express');
const router = express.Router();
const CoinMasterController = require('../controllers/coin_master');
const CoinMaster = require('../models/coin_master');

// 코인 목록 조회
router.get('/', CoinMasterController.getCoinMasters);

// 코인 상세 조회
router.get('/detail', async (req, res) => {
    const { id, symbol, pair } = req.query;
    
    try {
        if (!id && !symbol && !pair) {
            return res.status(400).json({
                success: false,
                message: 'id, symbol, pair 중 하나는 필수입니다.'
            });
        }
        
        let data = null;
        
        if (id) {
            data = await CoinMaster.findOne(id);
        } else if (symbol) {
            data = await CoinMaster.findBySymbol(symbol);
        } else if (pair) {
            data = await CoinMaster.findByPair(pair);
        }
        
        if (!data || (Array.isArray(data) && data.length === 0)) {
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
        console.error('코인 상세 조회 오류:', error);
        res.status(500).json({
            success: false,
            message: '데이터 조회 중 오류가 발생했습니다.'
        });
    }
});

// 특정 거래쌍의 코인 정보
router.get('/pair/:pair', CoinMasterController.getCoinMasterByPair);

// 특정 심볼의 코인 정보
router.get('/symbol/:symbol', CoinMasterController.getCoinMasterBySymbol);

// 특정 ID의 코인 정보
router.get('/:id', CoinMasterController.getCoinMasterById);

router.post('/', CoinMasterController.createCoinMaster);
router.put('/:id', CoinMasterController.updateCoinMaster);
router.delete('/:id', CoinMasterController.deleteCoinMaster);

module.exports = router; 