const path = require('path');
const fs = require('fs-extra');
const {randomNumber} = require('../helpers/helper');
const md5 = require('md5');

const {Image, Comment} = require('../models/index');

const imageCtrl = {}

imageCtrl.index = async (req, res) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}});
    if(image) {
        image.views = image.views + 1;
        await image.save();
        const comments = await Comment.find({image_id: image._id})
        res.render('image', {image, comments});
    }
    
    else {
        res.redirect('/');
    }
};

imageCtrl.create = (req, res) => {

    const saveImage = async () => {
        const imgUrl = randomNumber();
        const images = await Image.find({filename: imgUrl});

        if(images.length < 0) {
            saveImage();
        }

        else{
            const imageTempPath = req.file.path;
            const ext = path.extname(req.file.originalname).toLocaleLowerCase(); 
            const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);
        
            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
               await fs.rename(imageTempPath, targetPath);
               const newImg = new Image ({
                   title: req.body.title,
                   filename: imgUrl + ext,
                   description: req.body.description
               });
               const imageSaved = await newImg.save();
             res.redirect('/images/' + imgUrl);
            }
        
            else {
                await fs.unlink(imageTempPath);
                res.status(500).json({
                    ok: false,
                    mensaje: 'El archivo no es del tipo correcto'
                });
            }
        }
        
    }

    saveImage();
};


imageCtrl.like = async (req, res) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}});
    if(image) {

        image.likes = image.likes + 1;
        await image.save();
        res.json({likes: image.likes});
    }
};

imageCtrl.coment = async (req, res) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}});
    if(image) {

        const newComment = new Comment (req.body);
        newComment.gravatar = md5(newComment.email);
        newComment.image_id = image._id;
        await newComment.save();
        res.redirect('/images/' + image.uniqueId);
    }

};

imageCtrl.remove = async (req, res) => {
    const image = await Image.findOne({filename: {$regex: req.params.image_id}});
    if (image) {
        await fs.unlink(path.resolve('./src/public/upload/' + image.filename));
        await Comment.deleteOne({image_id: image._id});
        await image.remove();
        res.json(true);
      } else {
        res.json({response: 'Bad Request.'})
      }
};

module.exports = imageCtrl;