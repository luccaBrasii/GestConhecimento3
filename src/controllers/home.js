
const homeCtrl = {};

const {Image} = require('../models/index');

homeCtrl.index = async (req, res) => {
    const images = await Image.find().sort({timestamp: -1});
    res.render('index', {images: images});
};



module.exports = homeCtrl;