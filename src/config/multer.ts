import { Request } from "express";
import multer, { StorageEngine } from "multer";
import { extname } from "node:path";

function fileFilter(req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const type = extname(file.originalname);
  const typesEnabled = [".pdf", ".png"];
  if (typesEnabled.includes(!!type ? type : "")) {
    cb(null, true);
    return;
  }

  cb(null, false);
}

const storage: StorageEngine = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/../../tmp/`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + extname(file.originalname));
  },
});

export default {
  storage,
  fileFilter,
} as multer.Options;
