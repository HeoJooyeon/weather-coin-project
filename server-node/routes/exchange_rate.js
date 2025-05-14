const express = require('express');
const router = express.Router();
const ExchangeRateController = require('../controllers/exchange_rate');

// 환율 데이터 조회
router.get('/', ExchangeRateController.getExchangeRates);

// 특정 ID의 환율 데이터 조회
router.get('/:rateId', ExchangeRateController.getExchangeRateById);

// 특정 통화 및 날짜의 환율 데이터 조회
router.get('/currency/:baseCurrency/:targetCurrency/date/:rateDate', ExchangeRateController.getExchangeRateByCurrencies);

// 환율 데이터 생성
router.post('/', ExchangeRateController.createExchangeRate);

// 환율 데이터 수정
router.put('/:rateId', ExchangeRateController.updateExchangeRate);

// 환율 데이터 삭제
router.delete('/:rateId', ExchangeRateController.deleteExchangeRate);

module.exports = router; 