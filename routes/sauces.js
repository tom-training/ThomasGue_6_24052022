const express = require('express');
const router = express.Router();

const saucesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/', auth, multer, saucesCtrl.postModelsSauce);

router.put('/:id', auth, multer, saucesCtrl.putModelsSauce);

router.delete('/:id', auth, saucesCtrl.deleteModelsSauce);

router.get('/:id', auth, saucesCtrl.getOneModelsSauce);
router.get('/', auth, saucesCtrl.getModelsSauce);

router.post('/:id/like', auth, saucesCtrl.postLikeModelsSauce);

module.exports = router;