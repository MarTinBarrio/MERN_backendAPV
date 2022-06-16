import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) => {
    const paciente = new Paciente (req.body);
    //en req.veterinario, tengo los datos del veterinario q utilizó el token para acceder a este endpoint.
    //console.log (req.veterinario._id); //_id así lo guarda mongoo
    paciente.veterinario = req.veterinario._id;
    
    try {
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado);
    } catch (error) {
        console.log(error);
    }
};

const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);
    res.json(pacientes);
};

const obtenerPaciente = async (req, res) => {
    //console.log(req.params.id); //viene en la URL y le paso el id,
    
    const {id} = req.params;
    //const paciente = await Paciente.findById(id).where('veterinario').equals(req.veterinario);
    const paciente = await Paciente.findById(id);

    if (!paciente){
        return res.status(400).json({msg: "Paciente no encontrado"});
    }

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()){ //le agrego el toString xq comparar los ObjID y siempre serán objetos diferentes
        return res.status(400).json({msg: `Acción inválida: |${paciente.veterinario._id}| vs |${req.veterinario._id}|`});
    }
    
    res.json(paciente);
};

const actualizarPaciente = async (req, res) => {
    const {id} = req.params;
    //const paciente = await Paciente.findById(id).where('veterinario').equals(req.veterinario);
    const paciente = await Paciente.findById(id);

    if (!paciente){
        return res.status(400).json({msg: "Paciente no encontrado"});
    }

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()){ //le agrego el toString xq comparar los ObjID y siempre serán objetos diferentes
        return res.status(400).json({msg: `Acción inválida`});
    }
    
    //Actualizar Paciente
    paciente.nombre = req.body.nombre || paciente.nombre; //si viene el campo le pongo el q viene, sino el q ya tenía
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        console.log(error);
    }
};

const eliminarPaciente = async (req, res) => {
    const {id} = req.params;
    //const paciente = await Paciente.findById(id).where('veterinario').equals(req.veterinario);
    const paciente = await Paciente.findById(id);

    if (!paciente){
        return res.status(400).json({msg: "Paciente no encontrado"});
    }

    if (paciente.veterinario._id.toString() !== req.veterinario._id.toString()){ //le agrego el toString xq comparar los ObjID y siempre serán objetos diferentes
        return res.status(400).json({msg: `Acción inválida`});
    }

    //Eliminar paciente
    try {
        await paciente.deleteOne();
        res.json({msg: "Paciente Eliminado"});
    } catch (error) {
        console.log(error);
    }
};

export {agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente}