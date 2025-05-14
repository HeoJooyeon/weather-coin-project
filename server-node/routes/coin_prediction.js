const express = require('express');
const router = express.Router();
const CoinPredictionController = require('../controllers/coin_prediction');

// 코인 예측 정보 목록 조회
router.get('/', CoinPredictionController.getPredictions);

// 특정 ID의 코인 예측 정보 조회
router.get('/:predictId', CoinPredictionController.getPredictionById);

module.exports = router; 