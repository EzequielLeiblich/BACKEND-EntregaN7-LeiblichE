import passport from 'passport';
import local from 'passport-local';
import userModel from '../daos/mongodb/models/users.model.js';
import { createHash, isValidPassword } from '../utils.js';
import ManagerCarts from '../daos/mongodb/CartManager.class.js';

const localStrategy = local.Strategy;
const managerCarts = new ManagerCarts();

export const initializePassportLocal = () => {

    // Primera estrategia - Registro:

    passport.use('register', new localStrategy({
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            const {
                first_name,
                last_name,
                email,
                age
            } = req.body;
            try {
                const exist = await userModel.findOne({
                    email: username
                });
                if (exist) {
                    const errorMessage = 'El usuario ya existe. Presione "Ingresa aquí" para iniciar sesión.';
                    return done(null, false, {
                        message: errorMessage
                    });
                } else {
                    const cart = await managerCarts.crearCart();
                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: createHash(password),
                        role: 'User',
                        cart: cart._id,
                    };
                    const result = await userModel.create(newUser);
                    return done(null, result);
                }
            } catch (error) {
                return done('Error de registro', error);
            }
        }
    ));

    // Segunda estrategia - Login:

    passport.use(
        'login',
        new localStrategy({
            usernameField: 'email'
        }, async (username, password, done) => {
            try {
                const user = await userModel.findOne({
                    email: username
                });
                if (!user) {
                    const errorMessage = 'No hay una cuenta registrada con este correo. Presione "Regístrarse aquí" para crear una cuenta.';
                    return done(null, false, {
                        message: errorMessage
                    });
                }
                if (!isValidPassword(user, password)) {
                    const errorMessage = 'El correo sí se encuentra registrado pero, la contraseña ingresada es incorrecta.';
                    return done(null, false, {
                        message: errorMessage
                    });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        })
    );

};