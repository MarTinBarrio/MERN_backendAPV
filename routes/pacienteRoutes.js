import express from "express";
import { agregarPaciente, obtenerPacientes, obtenerPaciente, 
        actualizarPaciente, eliminarPaciente} from "../controlers/pacienteController.js";
import checkAuth from "../middelware/authMiddelWare.js";

const router = express.Router();

//Agrego el checkAuth a las rutas para proteger los endpoints ya q sólo un us registrado y logeado puede manipular la información
router
    .route('/')
    .post (checkAuth, agregarPaciente)
    .get(checkAuth, obtenerPacientes);

router
    .route('/:id')
    .get (checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente) //para actualizar podría usarse el vervo PATCH, pero es mas común usar PUT
    .delete(checkAuth, eliminarPaciente);

export default router;