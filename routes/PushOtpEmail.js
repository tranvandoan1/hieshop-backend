import express from 'express';
import { getOtpEmail, uploadEmail } from '../controllers/PushOtpEmail';

const router = express.Router();
router.post('/get-otp-email', getOtpEmail);

module.exports = router;