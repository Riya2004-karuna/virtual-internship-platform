import { instance } from "../index.js";
import TryCatch from "../middleware/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";
import crypto from "crypto";
import { Payment } from "../models/Payment.js";

export const getRazorpayKey = TryCatch(async (req, res) => {
  res.status(200).json({
    key: process.env.Razorpay_Key,
  });
});

export const createCourse = async (req, res) => {
  try {
    const course = await Courses.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      createdBy: req.body.createdBy || "Riya",
      duration: req.body.duration,
      price: req.body.price,
      image: req.file ? req.file.path : null,
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find();
  res.json({
    courses,
  });
});

export const getSingleCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      message: "Course not found",
    });
  }

  res.json({
    course,
  });
});

export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });
  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.json({ lectures });
  }

  const hasAccess = user.courses.some((courseId) => String(courseId) === String(req.params.id));

  if (!hasAccess) {
    return res.status(400).json({
      message: "you have not subscribed to this course",
    });
  }

  res.json({
    lectures,
  });
});

export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  const user = await User.findById(req.user._id);

  if (!lecture) {
    return res.status(404).json({
      message: "Lecture not found",
    });
  }

  if (user.role === "admin") {
    return res.json({ lecture });
  }

  const hasAccess = user.courses.some((courseId) => String(courseId) === String(lecture.course));

  if (!hasAccess) {
    return res.status(400).json({
      message: "you have not subscribed to this course",
    });
  }

  res.json({
    lecture,
  });
});

export const getMyCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find({ _id: { $in: req.user.courses } });
  res.json({
    courses,
  });
});

export const checkout = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  const course = await Courses.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (!course) {
    return res.status(404).json({
      message: "Course not found",
    });
  }

  const alreadySubscribed = user.courses.some((courseId) => String(courseId) === String(course._id));

  if (alreadySubscribed) {
    return res.status(400).json({
      message: "you already have this course",
    });
  }

  const options = {
    amount: Number(course.price * 100),
    currency: "INR",
  };

  const order = await instance.orders.create(options);

  res.status(201).json({
    message: "Checkout created successfully",
    order,
    course,
  });
});

export const paymentVerification = TryCatch(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.Razorpay_Secret)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    return res.status(400).json({
      message: "Payment Failed",
    });
  }

  await Payment.create({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  const user = await User.findById(req.user._id);
  const course = await Courses.findById(req.params.id);

  if (!user || !course) {
    return res.status(404).json({
      message: "User or course not found",
    });
  }

  const alreadySubscribed = user.courses.some((courseId) => String(courseId) === String(course._id));

  if (!alreadySubscribed) {
    user.courses.push(course._id);
    await user.save();
  }

  res.status(200).json({
    message: "Course purchased successfully",
  });
});
