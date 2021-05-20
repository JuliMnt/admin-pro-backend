const { response } = require('express');

const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medicos = require('../models/medicos');




const getTodo = async (req, res = response) => {

    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');


    const [usuarios, hospital, medicos] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Hospital.find({ nombre: regex }),
        Medicos.find({ nombre: regex }),
    ]);

    res.json({
        ok: true,
        usuarios,
        hospital,
        medicos
    })
}


const getDocumentosColeccion = async (req, res = response) => {


    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    let data = [];


    switch (tabla) {
        case 'medicos':
            data = await Medicos.find({ nombre: regex })
                                .populate('usuario', 'nombre img')
                                .populate('hospitales', 'nombre img')
            break;
        case 'hospitales':
            data = await Hospital.find({ nombre: regex })
                                .populate('usuario', 'nombre img')
            break;
        case 'usuarios':
            data = await Usuario.find({ nombre: regex });
            break;
        default:
            return res.status(400).json({
                ok:false,
                msg: 'La tabla tiene que ser usuario/medicos/hospitales'
            });
    }

    res.json({
    ok:true,
    resultados: data
    })
}


    










module.exports = {
    getTodo,
    getDocumentosColeccion
}