import express from 'express';
import { create, list, update, Id, read, remove } from '../controllers/Oder';
const router = express.Router();

router.post('/oders', create);

router.get('/oders', list);
router.get('/oders/:id', read);

router.put('/oders/:id', update);

router.delete('/oders/:id', remove);

router.param('id', Id);


module.exports = router;