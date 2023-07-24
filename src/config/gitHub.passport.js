// github.passport.js

import passport from 'passport';
import { Strategy as GitHubStrategy} from 'passport-github2';
import userModel from '../daos/mongodb/models/users.model.js';
import ManagerCarts from '../daos/mongodb/CartManager.class.js';

const managerCarts = new ManagerCarts();

export const initializePassportGitHub = () => {

    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.5564b75d299d8092",
        clientSecret: "d89cc291bfa82b89f0f29e4b10e846b4a47a830d",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
}, async (accessToken, refreshToken, profile, done) => {

        try {
            let user = await userModel.findOne({
                first_name: profile._json.name,
            })

            if (!user) {
                const cart = await managerCarts.crearCart();

                let newUser = {
                    first_name: profile._json.name,
                    last_name: "Github user",
                    email: profile._json.email ||"Github user",
                    age: 35,
                    password: "Github user",
                    role: "User",
                    cart: cart._id
                };
                const result = await userModel.create(newUser);
                return done(null, result);
            } else {
                return done(null, user);
            }

        } catch (error) {
            return done(error);
        }
    }));

};
