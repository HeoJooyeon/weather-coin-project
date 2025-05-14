const express = require('express');
const router = express.Router();
const GoldPriceController = require('../controllers/gold_price');

// 금 시세 데이터 조회
router.get('/', GoldPriceController.getGoldPrices);

// 특정 ID의 금 시세 데이터 조회
router.get('/:goldId', GoldPriceController.getGoldPriceById);

// 특정 상품 및 날짜의 금 시세 데이터 조회
router.get('/item/:itemName/date/:baseDate', GoldPriceController.getGoldPriceByItemAndDate);

// 금 시세 데이터 생성
router.post('/', GoldPriceController.createGoldPrice);

// 금 시세 데이터 수정
router.put('/:goldId', GoldPriceController.updateGoldPrice);

// 금 시세 데이터 삭제
router.delete('/:goldId', GoldPriceController.deleteGoldPrice);

module.exports = router; 