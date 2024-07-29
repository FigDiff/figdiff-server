import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: "ap-northeast-2",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY as string,
    secretAccessKey: process.env.S3_SECRET as string,
  },
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: "figdiff",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const uniqueKey = `${Date.now().toString()}-${uuidv4()}-${file.originalname}`;

      cb(null, uniqueKey);
    },
  }),
});

export default upload;
