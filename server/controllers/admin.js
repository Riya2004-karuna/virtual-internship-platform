import TryCatch from "../middleware/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { promisify } from "util";
import fs from "fs";
import { User } from "../models/User.js";

const unlinkAsync = promisify(fs.unlink);

async function removeFileIfExists(path) {
    if (!path) return;

    try {
        await unlinkAsync(path);
    } catch (error) {
        if (error.code !== "ENOENT") {
            console.error(`Failed to delete file ${path}:`, error.message);
        }
    }
}

export const createCourse = TryCatch(async (req, res) => {
    const { title, description, category, createdBy, duration, price } = req.body;
    const image = req.file;

    await Courses.create({
        title,
        description,
        category,
        createdBy,
        image: image?.path,
        duration,
        price,
    });

    res.status(201).json({
        message: "Courses created successfully",
    });
});

export const updateCourse = TryCatch(async (req, res) => {
    const course = await Courses.findById(req.params.id);

    if (!course) {
        return res.status(404).json({
            message: "Course not found",
        });
    }

    const { title, description, category, createdBy, duration, price } = req.body;

    if (title !== undefined) course.title = title;
    if (description !== undefined) course.description = description;
    if (category !== undefined) course.category = category;
    if (createdBy !== undefined) course.createdBy = createdBy;
    if (duration !== undefined) course.duration = duration;
    if (price !== undefined) course.price = price;

    if (req.file) {
        if (course.image) {
            await removeFileIfExists(course.image);
        }

        course.image = req.file.path;
    }

    await course.save();

    res.json({
        message: "Course updated successfully",
        course,
    });
});

export const addLectures = TryCatch(async (req, res) => {
    const course = await Courses.findById(req.params.id);
    if (!course)
        return res.status(404).json({
            message: "no courses with this id",
        });

    const { title, description } = req.body;
    if (!req.file) {
        return res.status(400).json({
            message: "Lecture video is required",
        });
    }

    const lecture = await Lecture.create({
        title,
        description,
        video: req.file.filename,
        course: course._id,
    });

    res.status(201).json({
        message: "Lecture added",
        lecture,
    });
});

export const deleteLecture = TryCatch(async (req, res) => {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
        return res.status(404).json({
            message: "Lecture not found",
        });
    }

    await removeFileIfExists(`uploads/${lecture.video}`);

    await lecture.deleteOne();
    res.json({ message: "Lecture Deleted" });
});

export const deleteCourse = TryCatch(async (req, res) => {
    const course = await Courses.findById(req.params.id);
    if (!course) {
        return res.status(404).json({
            message: "Course not found",
        });
    }

    const lectures = await Lecture.find({ course: course._id });

    await Promise.all(
        lectures.map(async (lecture) => {
            await removeFileIfExists(`uploads/${lecture.video}`);
            console.log("video deleted");
        })
    );

    await removeFileIfExists(course.image);

    await Lecture.find({ course: req.params.id }).deleteMany();
    await course.deleteOne();
    await User.updateMany({}, { $pull: { courses: req.params.id } });
    res.json({
        message: "Course deleted",
    });
});

export const getAllStats = TryCatch(async (req, res) => {
    const totalCoures = (await Courses.find()).length;
    const totalLectures = (await Lecture.find()).length;
    const totalUsers = (await User.find()).length;

    const stats = {
        totalCoures,
        totalLectures,
        totalUsers,
    };

    res.json({
        stats,
    });
});

