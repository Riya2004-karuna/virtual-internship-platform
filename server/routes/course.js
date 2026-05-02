import express from 'express';
import { getAllCourses, getSingleCourse, fetchLectures, fetchLecture, getMyCourses, checkout, paymentVerification, getRazorpayKey } from '../controllers/course.js';
import { isAuth } from '../middleware/isAuth.js';

const router = express.Router();

router.get('/course/all', getAllCourses);
router.get('/course/:id', getSingleCourse);
router.get('/lectures/:id', isAuth, fetchLectures);
router.get('/lecture/:id', isAuth, fetchLecture);
router.get('/mycourse', isAuth, getMyCourses);
router.get('/payment/key', isAuth, getRazorpayKey);
router.post('/course/checkout/:id', isAuth, checkout);
router.post('/course/payment-verification/:id', isAuth, paymentVerification);
router.post('/verification/:id', isAuth, paymentVerification);

export default router;
