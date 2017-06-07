/**
 * Created by projo on 2017-06-07.
 */

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('map', { title: 'Map' });

});

module.exports = router;
