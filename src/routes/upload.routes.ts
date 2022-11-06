import { Router } from "express";
import multer from "multer";
import { checkSameExtension, unlinkfile } from "../utils/file";
import multerConfig from "../config/multer";
import { errors } from "../contants/error";
const uploader = multer(multerConfig);

const uploadRouter = Router();

uploadRouter.post("/", uploader.array("files", 2), async (request, response) => {
  const files = request.files as Express.Multer.File[] | undefined;

  if (!files) {
    return response.status(400).json({
      message: errors.NO_FILE_UPLOADED,
    });
  }

  if (files.length === 1) {
    return response.status(400).json({
      message: errors.INVALID_UPLOAD_QUANTITY,
    });
  }

  if (checkSameExtension(files, [".png", ".pdf"])) {
    for (const file of files) {
      await unlinkfile(file.path);
    }

    return response.status(400).json({
      message: errors.FILES_WITH_SAME_EXTENSION,
    });
  }

  return response.json(request.files);
});

export default uploadRouter;
