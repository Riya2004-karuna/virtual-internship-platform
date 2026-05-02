import { createTransport } from "nodemailer"

const sendMail =async(email,subject,data) => {

    const gmailUser = process.env.Gmail?.trim();
    const gmailPassword = process.env.Password?.replace(/\s/g, "");

    if (!gmailUser || !gmailPassword) {
        throw new Error("Email service is not configured. Please set Gmail and Password in server/.env.");
    }

    const transport = createTransport({
        service:"gmail",
        auth:{
            user:gmailUser,
            pass:gmailPassword,
        }                

    });
     

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: red;
        }
        p {
            margin-bottom: 20px;
            color: #666;
        }
        .otp {
            font-size: 36px;
            color: #7b68ee; /* Purple text */
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>OTP Verification</h1>
        <p>Hello ${data.name} your (One-Time Password) for your account verification is.</p>
        <p class="otp">${data.otp}</p> 
    </div>
</body>
</html>
`;




    try {
        await transport.sendMail({
        from: gmailUser,
        to:email,
        subject,
        html,

        });
    } catch (error) {
        console.error("Mail send failed:", error.message);
        throw new Error("Could not send OTP email. Create a new Google App Password for the same Gmail account and update Password in server/.env.");
    }
};



export default sendMail;
