import generarID from "../helpers/generarID.js";
import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJwT.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
    //res.send( {url: 'Desde API/veterinarios'}); || //res.json( {url: 'Desde API/veterinarios'});
    //console.log(req.body);

    //const {nombre, email, password} = req.body; //console.log(nombre, email, password);
    const {email, nombre} = req.body; //viene de lo q el us escribe en el form
    
    //Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne ({ email }); //({ email: email }) 
 
    if (existeUsuario){
        //console.log("El us ya está registrado...")
        const error = new Error ('Usuario ya registrado');
        return res.status(400).json({ msg: error.message});
    }

    try {
        //Guardar un nuevo veterinario
        const veterinario = new Veterinario (req.body);
        veterinario.token = generarID();
        const veterinarioGuardado = await veterinario.save();
        //res.json( {msg: 'Registrando usuario...'});

        //Enviar el email, el veterinario ya está creado y guardado en la base de datos.
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        })

        res.json(veterinarioGuardado);

    } catch (error) {
        console.log(error);
    }
};

const perfil = (req, res) => {
    //res.send({url: 'Desde /API/veterinarios/perfil'});
    //console.log(req.veterinario); //aca tengo la info en un json
    const {veterinario} = req;
    res.json({veterinario});
};


const confirmar = async (req, res) => {
    //res.send({url: 'Desde /API/veterinarios/perfil'});
    //console.log(req.params.token);
    const {token} = req.params; //viene en la URL

    const usuarioConfirmar = await Veterinario.findOne({ token });
    //console.log('Imprime us: ', usuarioConfirmar); //imprime el objeto q trae de la DB.

    if (!usuarioConfirmar){
        const error = new Error ('Token no válido');
        return res.status(404).json({ msg: error.message});
    }

    try {
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;

        await usuarioConfirmar.save();

        res.status(200).json({msg: 'Usuario Confirmado'});   

    } catch (error) {
        console.log(error);
    }
};

const autenticar = async (req, res) => {//console.log(req.body);

    const {email, password} = req.body; //viene de lo q el us escribe en el form

    //Comprobar si existe el us
    const usuario = await Veterinario.findOne({email});
    if (!usuario){
        const error = new Error ('El usuario no existe');
        return res.status(403).json({ msg: error.message});
    }

    //comprobar si el us está confirmado
    if (!usuario.confirmado){
        const error = new Error ('Su cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message});
    }
    
    //Comprobar la password utilizando el método q cree con bcrypt en Veterinario.js de models
    if (await usuario.comprobarPassword(password)){
        //res.json({ msg: "password correcto"});
        //Autenticar...
        
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),
            
        })

    }else{
        const error = new Error ('El password es Incorrecto');
        return res.status(403).json({ msg: error.message});
    }

};


const olvidePassword = async (req, res) => {
    const {email} = req.body; //viene de lo q el us escribe en el form

    const existeVeterinario = await Veterinario.findOne ({ email });
    
    if (!existeVeterinario){
        const error = new Error ('El usuario no existe');
        return res.status(400).json({ msg: error.message});  
    }

    try {
        existeVeterinario.token = generarID();
        await existeVeterinario.save();

        //Enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token,
        });

        res.json({msg: "Hemos enviado un email con las instrucciones"});
    } catch (error) {
        console.log(error);
    }
}

const comprobarToken = async (req, res) => {
    //console.log(req.params);
    const {token} = req.params; //viene en la URL
    const tokenValido = await Veterinario.findOne ({ token });
    if (tokenValido){
        //us existe y token válido
        res.json({msg: "Token válido y el us existe"});
        
    }else{
        const error = new Error ('Token no valido');
        return res.status(400).json({ msg: error.message});  
    }
}

const nuevoPassword = async (req, res) => {
    const {token} = req.params; //esto viene en la URL
    const {password} = req.body; // esto es lo q el us escribe

    const veterinario = await Veterinario.findOne ({token}) ;
    if (!veterinario){
        const error = new Error ('Hubo un error');
        return res.status(400).json({ msg: error.message});  
    }

    try {
        veterinario.token=null;
        veterinario.password = password;
        await veterinario.save();
        res.json({msg: "Password modificada correctamente"});
    } catch (error) {
        console.log(error);
    }
}

const actualizarPerfil = async (req, res) => {
    //console.log(req.params); //viene en la url
    //console.log(req.body); //viene en el body
    const veterinario = await Veterinario.findById(req.params.id)
    if(!veterinario){
        const error = new Error ('Hubo un error');
        return res.status(400).json({msg: error.message})
    }

    const { email } = req.body;
    if(veterinario.email !== email) {
        const existeEmail = await Veterinario.findOne({email});
        if (existeEmail){
            const error = new Error ('Ese email ya está en uso');
        return res.status(400).json({msg: error.message})
        }
    }

    try {
         veterinario.nombre = req.body.nombre || veterinario.nombre;
         veterinario.email = req.body.email || veterinario.email;
         veterinario.telefono = req.body.telefono;
         veterinario.web = req.body.web;

         const veterinarioActulizado = await veterinario.save();
         res.json(veterinarioActulizado);

    } catch (error) {
        console.log(error);
    }
}

const actualizarPassword = async (req, res) => {
    //console.log(req.veterinario);
    //console.log(req.body);

    //Leer los datos
    const {id} = req.veterinario;
    const {psw_actual, psw_nuevo} = req.body;

    //Comprobar q el veterinario exista
    const veterinario = await Veterinario.findById(id)
    if(!veterinario){
        const error = new Error ('Hubo un error');
        return res.status(400).json({msg: error.message})
    }

    //Comprobar su password
    if (await veterinario.comprobarPassword(psw_actual)){
        //Guardar el nuevo password
        veterinario.password = psw_nuevo;
        await veterinario.save();
        res.json({msg: 'Password almacenado correctamente'})
    }else{
        const error = new Error ('El password actual no coincide con el almacenado');
        return res.status(400).json({msg: error.message})
    }

    
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}