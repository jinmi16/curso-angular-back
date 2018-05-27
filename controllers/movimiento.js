'use strict'
// modulos
// modelos
var User = require('../models/usuario');
var Movimiento = require('../models/movimiento');
// metodos acciones

function pruebas(req, res) {
    res.status(200).send({
        mensaje: 'probando controlador de usuarios',
        user: req.user
    });
}


function saveMovimiento(req, res) {
    var movimiento = new Movimiento();
    var params = req.body;
    console.log(params);
    if (params.monto) {
        movimiento.titulo = params.titulo;
        movimiento.descripcion = params.descripcion;
        movimiento.monto = params.monto;
        movimiento.fecha = params.fecha;
        movimiento.usuario = req.user.sub;
        movimiento.categoria = null;
        movimiento.tipomovimiento = null;

        movimiento.save((err, movimientoStored) => {
            if (err) {
                res.status(500).send({
                    mensaje: 'error en el servido'
                });
            } else {
                if (!movimientoStored) {
                    res.status(404).send({
                        mensaje: 'no se guardo movimiento'
                    });
                } else {
                    res.status(200).send({
                        mensaje: 'se guardo movimiento',
                        movimiento: movimientoStored
                    });

                }
            }
        });

    } else {

        res.status(200).send({
            mensaje: 'monto es obligatorio'
        });
    }



}

function getMovimientos(req, res) {
    Movimiento.find({}).populate({path:'usuario'}).exec((err, movimientos) => {
        if (err) {
            res.status(500).send({
                mensaje: 'error de peticion'
            });

        } else {
            if (!movimientos) {
                res.status(404).send({
                    mensaje: 'no hay movimientos'
                });

            } else {
                res.status(404).send({
                    movimientos: movimientos
                });
            }

        }
    });

}

module.exports = {
    pruebas,
    saveMovimiento,
    getMovimientos
};