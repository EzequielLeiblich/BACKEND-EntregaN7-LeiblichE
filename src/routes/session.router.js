import { Router } from "express";
import userModel from "../daos/mongodb//models/users.model.js";
import UserManager from "../daos/mongodb/UserManager.class.js";
import { createHash, validatePassword } from "../utils.js";
import passport from "passport";

const userManager = new UserManager();
const router = Router();

router.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    const exists = await userModel.findOne({ email });

    if (exists){
        return res
        .status(400)
        .send({ status: "error", message: "usuario ya registrado" });
    }
    let result = await userModel.create({
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
    });
    res.redirect('/api/login');
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
        return res.redirect('/api/login');
    }
    if (!validatePassword(user, password)){
        return res.redirect('/api/login');
    }
    req.session.user = {
        name: user.first_name+" "+user.last_name,
        email: user.email,
        age: user.age,
        rol: user.rol,
    };
    res.send({ status: "success", message: req.session.user });
});

router.get("api/sessions/faillogin", (req, res) => {
    res.send({ error: "Failed to login" });
});

router.post("/restartPassword", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res
            .status(400)
            .send({ status: "error", message: "Complete los campos" });
    const user = await userManager.getUser(email);

    if (!user)
        return res
            .status(400)
            .send({ status: "error", message: "Usuario no Encontrado" 
        });
    const newHashedPassword = createHash(password);
    const pass = await userManager.updatePasswordUser(
        user,
        newHashedPassword
    );
    console.log("Pass segura", pass);
    if (pass === true) {
        return res.status(200).send({
            status: "success",
            message: "Contraseña restaurada",
        });
    } else {
        return res
            .status(400)
            .send({
                status: "error",
                message:
                    "Problemas al cambiar la Contraseña intente denuevo mas tarde",
            });
    }
});

router.get(
    "/github",
    passport.authenticate("github", { scope: "user:email" }),
    (req, res) => {}
);

router.get('/githubcallback',passport.authenticate('github', {failureRedirect: '/login'}),async (req, res)=>{
    console.log('exito')
    req.session.user = req.user
    res.redirect('/')
})

router.get('/current', passport.authenticate('session'), (req, res) => {
    res.send(req.user);
    console.log(req.user)
})

export default router;