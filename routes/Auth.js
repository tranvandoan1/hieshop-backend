import express from "express";
import { signup, signin, signout } from "../controllers/Auth";

import multer from "multer";

const storage = multer.diskStorage({
    destination: "Uploads",
    filename: function (req, file, callBack) {
        const extension = file.originalname.split(".").pop();
        callBack(null, `${file.fieldname}-${Date.now()}.${extension}`);
    },
});
// single
const upload = multer({ storage: storage });
const router = express.Router();
router.post("/signin", signin);
router.post("/signup", upload.single("files"), signup);
router.get("/signout", signout);

module.exports = router;
