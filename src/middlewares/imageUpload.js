import path from 'path';
import multer from 'multer';

const storageLocation = 'uploads';
const allowedFileExtensions = ['.png', '.jpeg', '.jpg'];
const allowedFileMimetypes = ['image/jpeg', 'image/png'];
const maxFileSize = 1024 * 1024 * 2;

const fileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype.toLowerCase();
  if (allowedFileExtensions.indexOf(extension) < 0 || allowedFileMimetypes.indexOf(mimetype) < 0) {
    // https://stackoverflow.com/a/35069987/9160306
    const err = new Error('Not an image');
    err.status = 422;
    return cb(err, false);
  }
  // if (file.size > maxFileSize) { // 4 MB
  //   const err = new Error(`Image size should not be greater than ${maxFileSize} MB`);
  //   err.status = 422;
  //   return cb(err, false);
  // }
  return cb(null, true);
};

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, storageLocation);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: maxFileSize }
});
