const express = require('express');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development' });
} else {
  dotenv.config({ path: '.env.production' });
}

const router = express.Router();
const SECRET_KEY = process.env.JWT_KEY;
const ISSUER = process.env.JWT_ISSUER;

const { User } = require('../../models/user');

router.post('/', async (req, res) => {
  console.log('[request] login.js 진입 : ' / '');
  const { kakaoId } = req.body;

  const thatUser = User.findOne({
    where: { kakaoId: kakaoId },
  });

  if (thatUser === null) {
    // 만약에 해당 카카오 고유 id를 가진 유저가 없다면 돌려보내서 인증 및 가입하도록 한다.
    res.status(200).json({ success: false });
  }
  // 유저가 있으면, DB 상의 id와 userName을 담아 jwt를 발급한다.
  const token = jwt.sign(
    {
      type: 'JWT',
      id: thatUser.id,
      userName: thatUser.userName,
    },
    SECRET_KEY,
    {
      expiresIn: '30m',
      issuer: ISSUER,
    }
  );
  return res.status(200).json({ success: true, token: token });
});

router.get('/', async (req, res) => {
  res.send('login router');
});

module.exports = router;
