'use strict';

var express = require('express');
var controller = require('./log.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/user/:user_id', controller.index);
router.get('/voltage/user/:user_id', controller.voltage);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
