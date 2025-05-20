// server-node/controllers/coin_indicator_day.js

const CoinIndicatorDay = require("../models/coin_indicator_day");

class CoinIndicatorDayController {
  static async getIndicators(req, res) {
    try {
      const { pair, startTime, endTime } = req.query;
      let queryLimit = req.query.limit; // 요청으로부터 limit 값을 받음

      let numericLimit;
      if (queryLimit !== undefined) {
        numericLimit = parseInt(queryLimit, 10); // 문자열을 정수로 변환
        // 변환된 값이 유효한 숫자가 아니거나 0 이하인 경우 기본값 사용 또는 오류 처리
        if (isNaN(numericLimit) || numericLimit <= 0) {
          // 예: 유효하지 않은 경우 기본값 100으로 설정
          console.warn(
            `Invalid limit value: ${queryLimit}. Defaulting to 100.`,
          );
          numericLimit = 100;
        }
      } else {
        // limit 값이 제공되지 않은 경우 기본값 사용 (모델의 기본값과 일치시키거나 여기서 정의)
        numericLimit = 100; // 모델의 기본값은 100입니다.
      }

      // 수정된 numericLimit 값을 모델 함수에 전달
      const data = await CoinIndicatorDay.findAll({
        pair,
        startTime,
        endTime,
        limit: numericLimit,
      });

      // 응답 형식은 프로젝트의 기존 형식을 따르는 것이 좋습니다.
      // 예시: res.json({ success: true, data }); 또는 res.json(data);
      res.json(data); // 기존 코드에서는 res.json(data); 였으므로 이를 따름
    } catch (error) {
      console.error("일별 지표 데이터 조회 오류:", error);
      // 응답 형식은 프로젝트의 기존 형식을 따르는 것이 좋습니다.
      res.status(500).json({
        // success: false, // 필요시 추가
        // message: '데이터 조회 중 오류가 발생했습니다.', // 필요시 추가
        error: "데이터 조회 중 오류가 발생했습니다.", // 기존 코드 형식
      });
    }
  }

  static async getIndicatorByTime(req, res) {
    try {
      const { pair, openTime } = req.params;
      const data = await CoinIndicatorDay.findOne({ pair, openTime });
      if (!data) {
        // 응답 형식은 프로젝트의 기존 형식을 따르는 것이 좋습니다.
        return res.status(404).json({
          // success: false, // 필요시 추가
          // message: '데이터를 찾을 수 없습니다.', // 필요시 추가
          error: "데이터를 찾을 수 없습니다.", // 기존 코드 형식
        });
      }
      // 응답 형식은 프로젝트의 기존 형식을 따르는 것이 좋습니다.
      res.json(data); // 기존 코드 형식
    } catch (error) {
      console.error("특정 시간 일별 지표 데이터 조회 오류:", error);
      // 응답 형식은 프로젝트의 기존 형식을 따르는 것이 좋습니다.
      res.status(500).json({
        // success: false, // 필요시 추가
        // message: '데이터 조회 중 오류가 발생했습니다.', // 필요시 추가
        error: "데이터 조회 중 오류가 발생했습니다.", // 기존 코드 형식
      });
    }
  }
}

module.exports = CoinIndicatorDayController;
