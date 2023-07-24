import { Router } from "express";
import userModel from "../daos/mongodb//models/users.model.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";
import CartManager from '../daos/mongodb/CartManager.class.js';
import jwt from 'jsonwebtoken';

const router = Router();
const cartManager = new CartManager();

// REGISTRO

router.post('/register', (req, res, next) => {
    passport.authenticate('register', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                message: info.message
            });
        }
        res.json({
            message: 'Registro exitoso',
            user
        });
    })(req, res, next);
});

//LOGIN

router.post('/login', (req, res, next) => {

    passport.authenticate('login', { session: false },(err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({
                message: info.message
            });
        } else{
            let token = jwt.sign({email: user.email, first_name: user.first_name}, 'CoderSecret',{
            expiresIn: 10 * 10 * 10, });
            res.cookie('coderCookie', token, {httpOnly: true}).send({status: 'success'});
        }

    })(req, res, next);
});

// CURRENT

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) =>{
    res.send(req.user);
});

// GITHUB

router.get('/github', passport.authenticate('github', {session: false, scope: 'user: email'}));

router.get('/githubcallback', (req, res, next) => {
    passport.authenticate('github', { session: false }, async (err, user) => {
        if (err || !user) {
            return res.status(401).json({ message: 'Error en la autenticación con GitHub.' });
        } else {
            try {
                const token = jwt.sign({ email: user.email, first_name: user.first_name }, 'CoderSecret', { expiresIn: '1h' });
                res.cookie('coderCookie', token, { httpOnly: true }).redirect('/realtimeproducts');
            } catch (error) {
                return next(error);
            }
        }
    })(req, res, next);
});

export default router;