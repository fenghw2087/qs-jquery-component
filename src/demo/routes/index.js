var express = require('express');
var router = express.Router();
var config = require('../config/chunkConfig');
var multer  = require('multer');
var upload = multer({ dest: 'upload/' });

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index',{ hash: config.hashChunks['introduce']});
});

var navList = require("../common/navList");

navList.forEach(function (v) {
    router.get('/component'+v.url, function(req, res, next) {
        res.render( v.url.substr(1)+'.html',{ hash:config.hashChunks[v.url.substr(1)] || '' });
    });
});

router.post('/uploadFile', upload.single('file'), function(req, res){
    res.send({ret_code: '0',data:req.file.originalname});
});

module.exports = router;
