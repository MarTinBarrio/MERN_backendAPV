import express from "express"; //para esto hay q agregar a mano en packake.json la línea "type": "module",
import dotenv from "dotenv";
import conectarDB from "./config/db.js";
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js'
import cors from 'cors';

dotenv.config(); //esto busca el archivo donde están las variables de entorno...
//console.log(process.env.MONGO_URI);

const app = express();
app.use(express.json());

conectarDB();
const PORT = process.env.PORT || 4000;

const dominiosPermitidos = [process.env.FRONTEND_URL, process.env.BACKEND_URL, 'https://main--lively-bienenstitch-c68675.netlify.app/'];
                             
const corsOptions = {
    origin: function (origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            //El origen del request está permitido
            callback(null, true)
        }else{
            callback(new Error('No permitido por CORS'))
        }
    }
}

app.use(cors(corsOptions));

app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

app.listen(PORT, () =>{
    console.log('servidor funcionando en el puerto: ', PORT);
});