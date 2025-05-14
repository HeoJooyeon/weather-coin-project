const express = require('express');
const router = express.Router();
const CoinIndicatorDayController = require('../controllers/coin_indicator_day');

// 코인 일별 지표 목록 조회
router.get('/', CoinIndicatorDayController.getIndicators);

// 특정 거래쌍과 시간의 일별 지표 조회
router.get('/:pair/:openTime', CoinIndicatorDayController.getIndicatorByTime);

module.exports = router; 