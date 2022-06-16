import mongoose from "mongoose";

const conectarDB = async () => {
    try {

        const db = await mongoose.connect (process.env.MONGO_URI, {
            //las siguiente líneas las requiere mongoDB
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const url = `${db.connection.host}:${db.connection.port}`;
        console.log("Mongo DB conectado en : ", url);

    } catch (error) {
        console.log(`error: ${error.message}`);
        process.exit (1);
    }
}

export default conectarDB;