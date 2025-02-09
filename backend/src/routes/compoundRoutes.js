const express = require('express');
const { getCompounds,getMoleculeTypes,getCompoundDetails } = require('../controllers/compoundController');
const router = express.Router();

router.get('/compounds', getCompounds);
router.get("/molecule-types", getMoleculeTypes); 
router.get("/compounds/:chembl_id", getCompoundDetails);
module.exports = router;
