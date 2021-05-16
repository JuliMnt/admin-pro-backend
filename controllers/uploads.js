const path = require ('path');
const fs = require('fs');

const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");

const fileUpload = (req, res = response) => {

    const tipo = parseInt(req.params.tipo);
    const id = req.params.id;

    //Validar tipo
    var tiposValidos = [0, 1, 2];
    if (tiposValidos.indexOf(tipo)<0) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un médico, usuario u hospital'
        });
    }

    // Validar que exista un archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'no hay ningún archivo'
        });
    }


    // Procesar la imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];


    //Validar extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión permitida'
        });
    }

    // Generar el nombre del archivo
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;


    // Path para guardar la imagen
    const path = `./uploads/${obtieneNombre(tipo)}/${nombreArchivo}`;


    // Mover la imagen 
    file.mv(path, (err) => {
        if (err){
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }

        // Actualizar la base de datos
        actualizarImagen(obtieneNombre(tipo), id, nombreArchivo);






        res.json({
            ok: true,
            msg: ' Archivo subido',
            nombreArchivo
        })
    });    

};




const retornaImagen = (req, res = response) => {

    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    // Imagen por defecto
    if(fs.existsSync(pathImg)){
        res.sendFile(pathImg);
        
    } else {

        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg)

    }

}

const obtieneNombre = (tipo) => {
    let nombreTipo = 'usuarios'; 
    switch(tipo){
        case 0:
            nombreTipo = 'usuarios';
        break;
        case 1: 
            nombreTipo = 'medicos'; 
        break;
        case 2: 
            nombreTipo = 'hospitales';
        break;
    }
    return nombreTipo;
}






module.exports = {
    fileUpload,
    retornaImagen
}