import multer  from "multer";
import {v4 as uuid} from 'uuid';

const storage = multer.diskStorage({
    destination(req,file,cb){
        cb(null,"uploads")

    },

    filename(req,file,cb){

        const id =uuid()
        // this is used for the where we are taking the image we are using the extension 

        const extName =file.originalname.split(".").pop();

        const fileName =`${id}.${extName}`;

        cb(null,fileName);
        // random file genration because i dont have the same file  in the database
// that way we are using the npm i uuid for generating the randon id.S

    },
    
});

export const uploadFiles = multer({
  storage,
  limits: {
    fileSize: 100000000  // 100 MB ✅
  }
}).single("file");

