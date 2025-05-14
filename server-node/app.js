// Express 서버, DB에서 데이터 가져오는 API
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const authRoutes = require('./routes/auth'); // auth.js 라우트 가져오기
const coinPastInfoRoutes = require('./routes/coin_past_info'); // coin_past_info.js 라우트 가져오기
const coinPredictionRoutes = require('./routes/coin_prediction'); // coin_prediction.js 라우트 가져오기
const coinIndicatorDayRoutes = require('./routes/coin_indicator_day'); // coin_indicator_day.js 라우트 가져오기
const coinIndicatorHourRoutes = require('./routes/coin_indicator_hour'); // coin_indicator_hour.js 라우트 가져오기
const boardPostRoutes = require('./routes/board_post'); // board_post.js 라우트 가져오기
const boardCommentRoutes = require('./routes/board_comment'); // board_comment.js 라우트 가져오기
const binanceOHLCVRoutes = require('./routes/binance_ohlcv_1h'); // binance_ohlcv_1h.js 라우트 가져오기
const coinNewsRoutes = require('./routes/coin_news'); // coin_news.js 라우트 가져오기
const goldPriceRoutes = require('./routes/gold_price'); // gold_price.js 라우트 가져오기
const exchangeRateRoutes = require('./routes/exchange_rate'); // exchange_rate.js 라우트 가져오기
const coinMasterRoutes = require('./routes/coin_master'); // coin_master.js 라우트 가져오기
const connection = require('./config/database');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

//비트코인 이름을 파라미터로 받아서 조회
router.get('/:name', (req, res) => {
    const name = req.params.name;
    res.send(`Hello ${name}`);
});

const app = express();

// JSON 요청 본문 파싱을 위한 미들웨어
app.use(express.json());

// CORS 설정
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

// 라우트 등록
app.use('/api/auth', authRoutes);
app.use('/api/coin/past', coinPastInfoRoutes);
app.use('/api/prediction', coinPredictionRoutes);
app.use('/api/indicator/day', coinIndicatorDayRoutes);
app.use('/api/indicator/hour', coinIndicatorHourRoutes);
app.use('/api/board/post', boardPostRoutes);
app.use('/api/board/comment', boardCommentRoutes);
app.use('/api/ohlcv', binanceOHLCVRoutes);
app.use('/api/news', coinNewsRoutes);
app.use('/api/gold', goldPriceRoutes);
app.use('/api/exchange', exchangeRateRoutes);
app.use('/api/coins', coinMasterRoutes);

// Swagger UI 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: '서버 오류가 발생했습니다.'
    });
});

// 서버 시작
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`서버가 ${PORT} 포트에서 실행 중입니다.`);
});

module.exports = { app, connection };

