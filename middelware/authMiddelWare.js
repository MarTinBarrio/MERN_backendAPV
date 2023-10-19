import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {
    //console.log(req.headers.authorization);
    //Bearer xxx

    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        //res.json({msg: 'Tiene el token con el bearer'});

        try {
            token = req.headers.authorization.split(' ')[1] //saco la palabra Bearer
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            //console.log(decoded); //{ id: '62a1f33a1e8ec5ddee97d883', iat: 1654788181, exp: 1655047381 }
            
            req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado"); 
            //sin el - elijo q campos mostrar, //.select ("nombre email telefono")
            return next();            
        } catch (error) {
            const e = new Error('Token no válido');
            return res.status(403).json({ msg: e.message });
        }
    }

    if (!token){
        const error = new Error('Token no válido o inexistente');
        return res.status(403).json({ msg: error.message });
    }
    next();
};

export default checkAuth;
