import type { Express, Request } from "express";
import type {FileFilterCallback} from "multer";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/avatar/')
    },
    filename: function (req, file, cb) {
        const userId = req.userId;
        cb(null, userId + '-' + Date.now() + path.extname(file.originalname));
    }
});

function fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG, JPEG, and PNG files are allowed'));
    }
}

const upload = multer({ storage, fileFilter,limits: {fileSize: 20 * 1024 * 1024} });

export default upload;