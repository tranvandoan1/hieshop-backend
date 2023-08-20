import express from 'express';
import { create, list, update, Id, read, remove } from '../controllers/Statistical';
const router = express.Router();

router.post('/statistical', create);

router.get('/statistical', list);
router.get('/statistical/:id', read);

router.put('/statistical/:id', update);

router.delete('/statistical/:id', remove);

router.param('id', Id);


module.exports = router;