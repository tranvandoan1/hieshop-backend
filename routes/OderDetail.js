import express from 'express';
import { create, list, Id, read, remove } from '../controllers/OderDetail';
const router = express.Router();

router.post('/oderdetail', create);

router.get('/oderdetail', list);
router.get('/oderdetail/:id', read);

// router.put('/oderdetail/:id', update);

router.delete('/oderdetail/:id', remove);

router.param('id', Id);


module.exports = router;