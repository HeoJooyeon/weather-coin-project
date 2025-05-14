const express = require('express');
const router = express.Router();
const BinanceOHLCVController = require('../controllers/binance_ohlcv_1h');

// OHLCV 데이터 조회
router.get('/', BinanceOHLCVController.getOHLCV);

// 특정 시간 OHLCV 데이터 조회
router.get('/:pair/:openTime', BinanceOHLCVController.getOHLCVByTime);

// OHLCV 데이터 생성
router.post('/', BinanceOHLCVController.createOHLCV);

// OHLCV 데이터 수정
router.put('/:pair/:openTime', BinanceOHLCVController.updateOHLCV);

module.exports = router; 