'use strict'
// modulos
var bcrypt = require('bcrypt-nodejs');
// modelos
var User = require('../models/usuario');
// services jwt

var jwt = require('../services/jwt');

// metodos acciones

function pruebas(req, res) {
    res.status(200).send({
        mensaje: 'probando controlador de usuarios',
        user: req.user
    });
}

// insertar usuario

function saveUser(req, res) {
    // creo el objeto del usuario
    var user = new User();
    // recojer parametros peticion
    var params = req.body;
    console.log(params);
    if (params.nikname && params.password && params.nombre && params.apellido) {
        // asignar valores al objeto usuario
        user.nikname = params.nikname;
        user.password = params.password;
        user.nombre = params.nombre;
        user.apellido = params.apellido;
        user.email = params.email;
        user.telefono = params.telefono;
        user.edad = params.edad;
        User.findOne({
            email: user.email.toLowerCase()
        }, (err, issetUser) => {
            if (err) {
                res.status(500).send({
                    mensaje: 'Error al comprobar el usuario'
                });

            } else {
                if (!issetUser) {
                    // ciframos contraseña

                    bcrypt.hash(params.password, null, null, function (err, hash) {
                        user.password = hash;
                        //guardar usuario en la BD
                        user.save((err, userStored) => {
                            if (err) {
                                res.status(500).send({
                                    mensaje: 'Error al guardar el usuario'
                                });
                            } else {
                                if (!userStored) {
                                    res.status(404).send({
                                        mensaje: 'No se ha registrado el usuario'
                                    });
                                } else {

                                    res.status(200).send({
                                        user: userStored
                                    });
                                }

                            }

                        });
                    });


                } else {
                    res.status(200).send({
                        mensaje: 'El usuario ya existe'
                    });
                }
            }

        });



    } else {
        res.status(200).send({
            mensaje: 'ingresa datos correctamente'
        });
    }
}

function login(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;
    //comprobamos que el usuario existe
    User.findOne({
        email: email.toLowerCase()
    }, (err, user) => {
        if (err) {
            res.status(500).send({
                mensaje: 'Error al comprobar el usuario'
            });

        } else {

            if (user) {
                // usuario existe-> validamos contraseña
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {

                        /* res.status(200).send({
                            user
                            });
                        */
                        if (params.gettoken) {
                            // devolvemos token
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            res.status(200).send({
                                user
                            });

                        }
                    } else {
                        res.status(404).send({
                            mensaje: 'El usuario no ha podido logearce correctamente'
                        });
                    }
                });


            } else {
                res.status(404).send({
                    mensaje: 'El usuario no ha podido logearse'
                });

            }
        }
    });


    /*
        res.status(200).send({
            mensaje: 'probando metodo login',
            user: req.user
        });
    */
}

function updateUser(req, res) {

	var userId = req.params.id;
	var update = req.body;

    // validamos 
	if (userId != req.user.sub) {
		res.status(500).
		send({
			mensaje: 'no tienes permiso para actualizar el usuario'
		});

	}
// actualizamos
	User.findByIdAndUpdate(userId, update, {
		new: true
	}, (err, userUpdated) => {
		if (err) {
			res.status(500).send({
				mensaje: 'error al actualizar usuario '
			});
		} else {
			if (!userUpdated) {
				res.status(500).send({
					mensaje: 'No se ha podido actualizar usuario '
				});
			} else {
				res.status(200).send({
					user: userUpdated
				});
			}
		}
	});

}

function getUser(req, res) {

    User.find().exec((err, users) => {
		if (err) {

			res.status(500).send({
				mensaje: 'error en la peticion'
			});

		} else {

			if (!users) {
				res.status(404).send({
					mensaje: 'no hay usuarios'
				});

			} else {

				res.status(200).send(users);
			}
		}
	});
   
}

function getUserId(req, res) {
    var userId = req.params.id;
    User.find({
        _id:userId
    }).exec((err, users) => {
		if (err) {

			res.status(500).send({
				mensaje: 'error en la peticion'
			});

		} else {

			if (!users) {
				res.status(404).send({
					mensaje: 'no hay usuarios'
				});

			} else {

				res.status(200).send(users);
			}
		}
	});
   
}
function getUserSearch(req, res) {

    User.find({
        $or:[{nombre : new RegExp(req.params.q, 'i')},{apellido : new RegExp(req.params.q, 'i')}] 
    }).exec((err, users) => {
		if (err) {

			res.status(500).send({
				mensaje: 'error en la peticion'
			});

		} else {

			if (!users) {
				res.status(404).send({
					mensaje: 'no hay usuarios'
				});

			} else {

				res.status(200).send(users);
			}
		}
	});
   
}

function deleteUser(req, res) {
    var userId = req.params.id;
    User.findByIdAndRemove(userId,(err,userRemove)=>{
        if(err){
            res.status(500).send({
				mensaje: 'error en la peticion'
			});
        }else{
            if (!userRemove) {
				res.status(404).send({
					mensaje: 'no se a borrado el usuario'
				});

			} else {

				res.status(200).send(userRemove);
			}
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    login,
    updateUser,
    getUser,
    getUserId,
    getUserSearch,
    deleteUser
};