import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Courses } from "../models/Courses.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, "..");
const frontendAssets = path.resolve(serverRoot, "..", "fswd", "src", "assets");
const uploadsDir = path.resolve(serverRoot, "uploads");

const assetCopies = [
  {
    source: path.join(frontendAssets, "Java.png"),
    target: path.join(uploadsDir, "java-course.png"),
  },
  {
    source: path.join(frontendAssets, "Java.png"),
    target: path.join(uploadsDir, "python-course.png"),
  },
  {
    source: path.join(frontendAssets, "hero.png"),
    target: path.join(uploadsDir, "web-development.png"),
  },
];

const demoCourses = [
  {
    title: "Java",
    description: "Complete Java programming course for beginners with practical concepts.",
    category: "Programming",
    createdBy: "Prashant Kumar",
    duration: 5,
    price: 1299,
    image: "uploads\\java-course.png",
  },
  {
    title: "Python",
    description: "Learn Python fundamentals, problem solving, and real project basics.",
    category: "Programming",
    createdBy: "Prashant Kumar",
    duration: 4,
    price: 1199,
    image: "uploads\\python-course.png",
  },
  {
    title: "Web Development",
    description: "Understand HTML, CSS, JavaScript, and responsive website building.",
    category: "Web Development",
    createdBy: "Prashant Kumar",
    duration: 6,
    price: 1499,
    image: "uploads\\web-development.png",
  },
];

async function seedDemoCourses() {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });

    for (const file of assetCopies) {
      fs.copyFileSync(file.source, file.target);
    }

    await mongoose.connect(process.env.DB);

    for (const course of demoCourses) {
      await Courses.findOneAndUpdate(
        { title: new RegExp(`^${course.title}$`, "i") },
        { $set: course },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      );
    }

    const finalCourses = await Courses.find({}, "title category createdBy price duration image")
      .sort({ createdAt: 1 })
      .lean();

    console.log("Demo courses seeded successfully:");
    console.log(JSON.stringify(finalCourses, null, 2));
  } catch (error) {
    console.error("Failed to seed demo courses:");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDemoCourses();
