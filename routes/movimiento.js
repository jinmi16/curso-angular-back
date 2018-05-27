'use strict'
var express = require('express');
var UsuarioController = require('../controllers/usuario');
var MovimientoController = require('../controllers/movimiento');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var md_admin = require('../middlewares/is_admin');



//api.get('/pruebas-del-controlador',UsuarioController.pruebas);
api.get('/pruebas', md_auth.ensureAuth, MovimientoController.pruebas);
api.post('/register-movimiento', md_auth.ensureAuth, MovimientoController.saveMovimiento);
api.get('/list-movimiento',MovimientoController.getMovimientos);


module.exports = api;