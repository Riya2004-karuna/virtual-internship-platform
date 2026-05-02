


import { User } from "../models/User.js";
import bcrypt from   'bcrypt';
import jwt from 'jsonwebtoken'
import sendMail from "../middleware/sendMail.js";
import TryCatch from "../middleware/TryCatch.js";

export const register = TryCatch(async(req,res)=>{
    const{email,name,password} = req.body

       let user = await User.findOne({email})

       if(user)   
        return res.status(400).json({
    message: "User Already exists",
    });


     const hashPassword =await bcrypt.hash(password,10)


    
    user={
        name,
        email,
        password:hashPassword
    }


    const otp = String(Math.floor(100000 + Math.random() * 900000));

    const activationToken = jwt.sign({
        user,
        otp,

    }, process.env.Activation_Secret,{
        expiresIn: "5m",
    }  );


            const data ={
                name,
                otp,
            };   
            
            

            let devOtp;

            try {
                await sendMail(
                    email,
                    "mega fswd",
                    data
                )
            } catch (error) {
                if (process.env.NODE_ENV === "production") {
                    throw error;
                }

                devOtp = otp;
                console.warn("OTP email failed. Development OTP:", otp);
            }

            res.status(200).json({
                message: devOtp ? "OTP email failed, use the development OTP shown here" : "otp send to your mail",
                activationToken,
                devOtp,

            });

});


export const verifyUser = TryCatch(async(req,res)=>{
    const {otp ,activationToken} = req.body

    if (!activationToken) {
        return res.status(400).json({
            message:"Activation token missing",
        });
    }

    const verify = jwt.verify(activationToken,process.env.Activation_Secret)
    if (!verify) 
    return res.status(400).json({
        message:"Otp Expired",
    })  ; 

    const receivedOtp = String(otp ?? "").trim();
    const storedOtp = String(verify.otp ?? "").trim();

    if(storedOtp !== receivedOtp)
         return  res.status(400).json({
        message:"Otp wrong ",
    })  ;  

    await User.create({
        name:verify.user.name,
        email:verify.user.email,
        password:verify.user.password,
    })





    res.json({
        message:"User registerd",
    });

});


export const loginUser = TryCatch(async(req,res)=>{
    const {email,password} =req.body
    const user =await User.findOne({email})

    if(!user) return res.status(401).json({
        message: 'No account found with this email. Please register and verify your OTP first.',
    });


    const mathPassword =await bcrypt.compare(password,user.password);

    if(!mathPassword) return res.status(401).json({
        message:"Wrong password",
    });



    const token =await jwt.sign({_id: user._id},process.env.Jwt_Sec,{
        expiresIn: "15d",


    });
    


    res.json({
        message:`Welcome back ${user.name}`,
        token,
        user,
    });
});



export const myProfile = TryCatch(async(req,res)=>{
    const user = await User.findById(req.user._id)
    res.json({user });
});
