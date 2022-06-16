import mongoose from "mongoose";
import bcrypt from "bcrypt";

const veterinarioShema = mongoose.Schema({
    nombre: {
        type: String,
        required: true, //campo obligatorio
        trim: true, // esta línea asegura q no se ingresen espacios en blanco al inicio y final del campos: nombre
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    telefono: {
        type: String,
        default: null,
        trim: true,
    },
    web: {
        type: String,
        default: null,
    },
    token: {
        type: String,
        default: null,
    },
    confirmado: {
        type: Boolean,
        default: false,
    }
});

//hasheo la psw antes de guardar en la DB
veterinarioShema.pre ('save', async function(next){
    //console.log("Antes de almacenar...");
    //console.log(this); //muestra el objeto antes de guardarlo en la DB.
    
    if (!this.isModified('password')){next()} //Esto es por si un passw está hasheado no lo vuelva a hashear.
    //por si al modificar los datos del us, en un futuro, m evito el doble hasheo de la psw
    
    const salt = await bcrypt.genSalt(10); //10 por default...., si le pongo mas, ejem 12 puede tardar mucho
    this.password = await bcrypt.hash (this.password, salt);
})



veterinarioShema.methods.comprobarPassword = async function (pswFormulario) {
    return await bcrypt.compare(pswFormulario, this.password);
};

const Veterinario = mongoose.model("Veterinario", veterinarioShema);

export default Veterinario;