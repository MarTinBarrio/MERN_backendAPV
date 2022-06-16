import express from 'express';
import { registrar, perfil, confirmar, autenticar, 
         olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword } from '../controlers/veterinarioControler.js';
import checkAuth from '../middelware/authMiddelWare.js';

const router = express.Router();

/**
 * accesos públicos
 * los us pueden ingresar sin estar registrado en las siguiente links
 */
router.post ('/', registrar);
                     //:token es un argumento dinámico q lo leo con req.params y está en la url
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);

router.post('/olvide-password', olvidePassword);
//router.get('/olvide-password/:token', comprobarToken);
//router.post('/olvide-password/:token', nuevoPassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword); //otra forma de escribir lo mismo...
/****************************************************************** */


/**
 * Accesos privados | deben estar autenticados
 */

router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actualizar-password', checkAuth, actualizarPassword);
/*********** */

export default router;