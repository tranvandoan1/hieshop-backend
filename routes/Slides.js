import express from 'express';
import { create, list, update, SliderById, read, remove } from '../controllers/Slides';
const router = express.Router();

router.post('/slides', create);
router.get('/slides', list);
router.get('/slides/:slidesId', read);

router.put('/slides/:slidesId', update);

router.delete('/slides/:slidesId', remove);

router.param('slidesId', SliderById);

module.exports = router;