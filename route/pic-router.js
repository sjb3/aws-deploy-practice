'use strict';

const createError = require('http-errors');
const multer = require('multer');
const debug = require('debug')('murakami:pic-router');

const User = require('../model/user.js');
const Pic = require('../model/pic.js');
const Gallery = require('../model/gallery.js');

const upload = multer({dest: `${__dirname}/../data`});
const picRouter = module.exports = require('express').Router();

picRouter
  .post('/api/gallery/:galleryID/pic', upload.single('image'),     function(req, res, next){
  debug('POST /api/gallery/:galleryID/pic');
  console.log('req.file', req.file)
  res.sendStatus(200)
});
