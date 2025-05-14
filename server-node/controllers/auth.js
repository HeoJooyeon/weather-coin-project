// const User = require("../models/user.js");

const User = require("../models/user");

exports.register = async (req, res) => {
    const { userId, password } = req.body;

    try {
        const user = await User.findOne({ where: { userId } });
        if (user) {
            return res.status(400).json({
                success: false,
                message: '이미 존재하는 아이디입니다.'
            });
        }

        const newUser = await User.create({
            userId,
            password: password,
            savedCoins: []
        });

        res.status(201).json({
            success: true,
            message: '회원가입 성공',
            user: {
                id: newUser.id,
                userId: newUser.userId
            }
        });
    } catch (error) {
        console.error('회원가입 오류:', error);
        res.status(500).json({
            success: false,
            message: '회원가입 오류'
        });
    }
};

exports.login = async (req, res) => {
    const { userId, password } = req.body;

    try {
        const user = await User.findOne({ where: { userId } });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: '존재하지 않는 아이디입니다.'
            });
        }

        if (user.password !== password) {
            return res.status(400).json({
                success: false,
                message: '비밀번호가 일치하지 않습니다.'
            });
        }

        res.status(200).json({
            success: true,
            message: '로그인 성공',
            user: {
                id: user.id,
                userId: user.userId
            }
        });
    } catch (error) {
        console.error('로그인 오류:', error);
        res.status(500).json({
            success: false,
            message: '로그인 오류'
        });
    }
};