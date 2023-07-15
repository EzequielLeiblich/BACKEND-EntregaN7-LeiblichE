import { Router } from "express";
import UserManager from "../daos/mongodb/UserManager.class.js";
import { createHash, validatePassword } from "../utils.js";
import passport from "passport";

const userManager = new UserManager();
const router = Router();

router.post("/register", async (req, res) => {
  const data = req.body;
  let response = await userManager.createUser(data);
  if (response === false) {
      return res
          .status(400)
          .send({ status: "error", message: "El usuario ya existe" });
  } else {
      res.send({ status: "success", message: "usuario  registrado" });
  }
});

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {
      if (!req.user)
          return res
              .status(400)
              .send({ status: "error", message: "Invalid credentials" });
      req.session.user = {
          name: req.user.first_name + " " + req.user.last_name,
          email: req.user.email,
          age: req.user.age,
          role: req.user.rol,
      };
      return res.send({ status: "success", payload: req.user });
  }
);

router.get("api/sessions/faillogin", (req, res) => {
  res.send({ error: "Failed to login" });
});

router.post("/restartPassword", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
      return res
          .status(400)
          .send({ status: "error", message: "Complete los campos" });
  const user = await UsersManagers.getUser(email);

  if (!user)
      return res
          .status(400)
          .send({ status: "error", message: "Usuario no Encontrado" });
  const newHashedPassword = createHash(password);
  const pass = await UsersManagers.updatePasswordUser(
      user,
      newHashedPassword
  );
  console.log("esto es pass", pass);
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

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/" }),
  async (req, res) => {
      console.log("exito");
      req.session.user = req.user;
      res.redirect("/home");
  }
);

router.post('/logout', async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(400).send({status: "error", details: "The session couldn't be destroyed"})
    }
    res.clearCookie('connect.sid')
    res.send({status: "sucess"})
  })
})

export default router;