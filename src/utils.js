import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';

// Hashea
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Compara
export const validatePassword = (user, password) => bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 

// console.log(__filename)
// console.log(__dirname)

export default __dirname; // Basicamente, __dirname es el directorio donde se encuentra este archivo