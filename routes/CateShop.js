import express from "express";
import {
  create,
  list,
  update,
  Id,
  read,
  remove,
} from "../controllers/CateShop";
const router = express.Router();

router.post("/cate-shop", create);
router.get("/cate-shop", list);
router.get("/cate-shop/:Id", read);

router.post("/cate-shop-upload", update);

router.delete("/cate-shop/:Id", remove);

router.param("Id", Id);

module.exports = router;
