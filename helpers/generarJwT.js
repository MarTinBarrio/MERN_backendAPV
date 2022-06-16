import jwt from 'jsonwebtoken';

const generarJWT = (id) => {
    return jwt.sign ({id}, process.env.JWT_SECRET,{
        expiresIn: "3d",
    });
}

//expiración del jwt
//3d = 3 días
//1m = 1 minuto
//1h = 1hora

export default generarJWT;