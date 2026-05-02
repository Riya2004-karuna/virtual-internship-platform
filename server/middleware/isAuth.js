import jwt from 'jsonwebtoken';
import {User} from "../models/User.js";

export const  isAuth =async(req,res,next)=>{
    try{
        const token =
          req.headers.token ||
          req.header("Authorization")?.replace("Bearer ", "");
        

        if (!token) return res.status(403).json({
            message:"please login",
        });



        const decodedData =jwt.verify(token,process.env.Jwt_Sec);
        req.user =await User.findById(decodedData._id)

        if (!req.user) {
            return res.status(404).json({
                message:"user not found",
            });
        }

        next()

    }
    catch (error){
        res.status(401).json({
            message:"login first",
        });
    }

};


export const isAdmin = (req,res,next) => {
    try{
        if(req.user.role !== "admin")
            return res.status(403).json({
            message:'you are not admin',
        });



      next(); //  because to leave the function   
    }
    catch(error){
        res.status(500).json({
            message:error.message,
        });
    }
};



