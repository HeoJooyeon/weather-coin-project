const express = require('express');
const router = express.Router();
const CoinPastInfoController = require('../controllers/coin_past_info');

// 코인 과거 정보 목록 조회
router.get('/', CoinPastInfoController.getCoinList);

// 특정 ID의 코인 과거 정보 조회
router.get('/:id', CoinPastInfoController.getCoinDetail);

module.exports = router; 