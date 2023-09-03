import express from 'express';
import { create, list, updateAdress, Id, read, removeAdress ,updateInfoAdress} from '../controllers/InfoUser';
const router = express.Router();

router.post('/info-user-add', create);

router.get('/info-user', list);
router.get('/info-user/:id', read);

router.post('/info-user-upload-addres', updateAdress);
router.post('/info-user-upload-info-addres', updateInfoAdress);

router.post('/remove-adress', removeAdress);

router.param('id', Id);


module.exports = router;