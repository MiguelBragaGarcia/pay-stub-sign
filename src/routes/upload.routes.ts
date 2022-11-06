import { Router } from "express";
import multer from "multer";
import { checkSameExtension, unlinkfile } from "../utils/file";
import multerConfig from "../config/multer";
import { errors } from "../contants/error";
import { PDFDocument } from "pdf-lib";
import { readFileSync } from "fs";
import { extname } from "node:path";
import { Readable } from "node:stream";

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

  const pdfObject = files.find((el) => extname(el.originalname) === ".pdf");
  const pngObject = files.find((el) => extname(el.originalname) === ".png");

  const pngBuffer = Buffer.from(readFileSync(pngObject!.path));
  const pdfBuffer = Buffer.from(readFileSync(pdfObject!.path));

  const pdfDoc = await PDFDocument.load(pdfBuffer);

  const pngEmbed = await pdfDoc.embedPng(pngBuffer);
  const date = new Intl.DateTimeFormat("pt-BR").format(new Date());

  const pages = pdfDoc.getPages();

  pages[0].drawText(date, {
    x: 45,
    y: 70,
    size: 12,
  });

  pages[0].drawImage(pngEmbed, {
    x: 420,
    y: 60,
    width: 100,
    height: 20,
  });

  pages[0].drawText(date, {
    x: 45,
    y: 462,
    size: 12,
  });

  pages[0].drawImage(pngEmbed, {
    x: 420,
    y: 452,
    width: 100,
    height: 20,
  });

  const result = Buffer.from(await pdfDoc.save());
  response.setHeader("Content-Type", "application/pdf");
  response.setHeader("Content-Disposition", "attachment; filename=quote.pdf");
  const file = Readable.from(result);

  for (const file of files) {
    await unlinkfile(file.path);
  }

  return file.pipe(response);
});

export default uploadRouter;
