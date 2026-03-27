import TryCatch from "../middleware/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import {rm} from "fs";
import{promisify} from 'util';
import fs from 'fs';
import { User } from "../models/User.js";

export  const createCourse =TryCatch(async(req,res)=>{
    const {title,description,category,createdBy,duration,price}=req.body;
    const image =req.file;


    await Courses.create({
    title,
    description,
    category,
    createdBy,
    image:image?.path,
    duration,       
    price,

    });

    res.status(201).json({
        message:"Courses created successfully",

    });
  
  

});


// for the saving the image in server we use the multer..



export const addLectures = TryCatch(async(req,res)=>{

const course = await Courses.findById(req.params.id);// i want to find the lecture byt he id
if(!course)
    return res.status(404).json({
    message:"no courses with this id",// for this if nor get the lecture
    });

    // what if we got the lecture we get extract the following things


    const {title,description}=req.body

    const file = req.file

// by following this lecture was created
    const lecture = await Lecture.create({
        title,
        description,
        video:req.file.filename,
        course:course._id,                                
    });

    res.status(201).json({
    message:"Lecture added",
    lecture,

    });
  
});


// for the delet lecture

export const deleteLecture = TryCatch(async(req,res)=>{
    const lecture = await Lecture.findById(req.params.id);

// removing only one video
    rm(lecture.video,()=>{
        console.log("Video deleted");

    });

    // also delete from the db..

    await lecture.deleteOne();
    res.json({message:"Lecture Deleted"});

});

const unlikeAsync = promisify(fs.unlink)

export const deleteCourse = TryCatch(async(req,res)=>{
    const course = await Courses.findById(req.params.id)

    const lectures = await Lecture.find({course: course._id})

    // delete the all courses
    await Promise.all(
        lectures.map(async(lecture)=>{
            await unlikeAsync(lecture.video);
            console.log("video deleted");
        })
    );

    rm(course.image,()=>{
        console.log("image deleted");

    });

    await Lecture.find({course:req.params.id}).deleteMany();
    //delete from the db
    await course.deleteOne();
    await User.updateMany({},{$pull:{Subscription:req.params.id}});
    res.json({
        message:"Course deleted",
    });

});


export const getAllStats = TryCatch(async(req , res)=>{
    const totalCoures = (await Courses.find()).length;
    const totalLectures = (await Lecture.find()).length;
    const totalUsers =(await User.find()).length;


    const stats ={
        totalCoures,
        totalLectures,
        totalUsers,
    };

    res.json({
        stats,
    });
});