import express from "express";
import {
  create,
  list,
  update,
  uploadSaveOrders,
  saveoderId,
  read,
  remove,
  removes,
  updateProOrder
} from "../controllers/SaveOder";
const router = express.Router();

router.post("/saveoders", create);
router.get("/saveoders", list);
router.get("/saveoders/:id", read);

router.post("/upload-saveoder", update);
router.post("/upload-saveoderCart", updateProOrder);
router.patch("/saveoders/check", uploadSaveOrders);
router.post('/removes-saveoders', removes);

router.delete("/saveoders/:id", remove);

router.param("id", saveoderId);

module.exports = router;
