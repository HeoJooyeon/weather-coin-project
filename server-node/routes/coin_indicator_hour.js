const express = require('express');
const router = express.Router();
const CoinIndicatorHourController = require('../controllers/coin_indicator_hour');

// 시간별 지표 목록 조회
router.get('/', CoinIndicatorHourController.getHourIndicators);

// 특정 ID의 시간별 지표 조회
router.get('/:indicatorId', CoinIndicatorHourController.getHourIndicatorDetail);

module.exports = router; 