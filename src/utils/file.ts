import { extname } from "node:path";
import { unlink, promises } from "node:fs";
import { errors } from "../contants/error";

export function checkSameExtension(files: Express.Multer.File[], extensions: string[]): boolean {
  let hasDuplicated = false;

  extensions.forEach((extension) => {
    if (hasDuplicated) {
      return;
    }
    if (files.every((el) => extname(el.originalname) === extension)) {
      hasDuplicated = true;
      return;
    }
    hasDuplicated = false;
  });

  return hasDuplicated;
}

export async function unlinkfile(path: string): Promise<void> {
  try {
    await promises.stat(path);
    unlink(path, (err) => {
      if (err) {
        throw new Error(errors.REMOVE_FILE);
      }
    });
  } catch (err) {
    throw new Error(errors.INVALID_PATH);
  }
}
