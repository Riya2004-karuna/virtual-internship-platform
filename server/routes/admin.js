import express from 'express';
import { isAdmin, isAuth } from '../middleware/isAuth.js';
import { addLectures, createCourse, deleteCourse, deleteLecture, getAllStats, updateCourse } from '../controllers/admin.js';
import { uploadFiles } from '../middleware/multer.js';

const router = express.Router();

router.post('/course/new', isAuth, isAdmin, uploadFiles, createCourse);
router.put('/course/:id', isAuth, isAdmin, uploadFiles, updateCourse);
router.post('/course/:id', isAuth, isAdmin, uploadFiles, addLectures);
router.delete('/course/:id', isAuth, isAdmin, deleteCourse);
router.delete('/lecture/:id', isAuth, isAdmin, deleteLecture);
router.get('/stats', isAuth, isAdmin, getAllStats);

export default router;
