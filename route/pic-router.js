'use strict';

//node modules
const path = require('path');
const fs = require('fs');

//npm modules
const AWS = require('aws-sdk');
const createError = require('http-errors');
const multer = require('multer');
const debug = require('debug')('murakami:pic-router');

const User = require('../model/user.js');
const Pic = require('../model/pic.js');
const Gallery = require('../model/gallery.js');

//module constants
const s3 = new AWS.S3(); 
const upload = multer({dest: `${__dirname}/../data`});
const picRouter = module.exports = require('express').Router();

picRouter
  .post('/api/gallery/:galleryID/pic', upload.single('image'),     function(req, res, next){
  debug('POST /api/gallery/:galleryID/pic');
  console.log('req.file', req.file);
  if(!req.file) return next(createError(400, 'not found');
  if(!req.file.path) return next(createError(500, 'file not saved');

  var ext = path.extname(req.file.originalname) //'.png'
  var params = {
    ACL: 'public-read',
    Bucket: 'murakami-assets',
    Key: `${req.file.filename}${ext}`
    Body: fs.createReadStream(req.file.path),
  }
  s3.upload(params, function(err, s3data){
    if(err) return next(err)
    //create a picture
    Gallery.findById(req.params.galleryID)
    .then(gallery => {
      var picData = {
        name: req.body.name,
        desc: req.body.desc,
        imageURI: s3data.Location,
        galleryID: gallery._id,
      }
      return new Pic(picData).save()
    })
    .then(pic => res.json(pic))
    .catch(next)
    console.log('s3data', s3data)
    res.json({msg: 's3data success'})
  })
});
