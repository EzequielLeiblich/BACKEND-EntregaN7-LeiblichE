import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

// Hashea
export const createHash = password => 
    bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Compara
export const isValidPassword = (user, password) => 
    bcrypt.compareSync(password, user.password);

// Obtener el nombre de archivo y el nombre de directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 

// Exportar nombre directorio actual
export default __dirname;