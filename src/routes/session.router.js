import { Router } from "express";
import UserManager from "../daos/mongodb/UserManager.class.js";
import { createHash, validatePassword } from "../utils.js";
import passport from "passport";

const userManager = new UserManager();
const router = Router();

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  const exists = await userModel.findOne({ email });
  if (exists)
      return res
      .status(400)
      .send({ status: "error", message: "usuario ya registrado" });
  let result = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
  });
  res.send({ status: "success", message: "usuario  registrado" });
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body
  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    req.session.user = {
      name: "Admin",
      email: "adminCoder@coder.com",
      role: "admin"
    }
    return res.send({status: "success", user: req.session.user})
  }
  let user = await userManager.findUser(email, password)
  if (!user) {
    return res.status(400).send({status: "error", details: "User can't be found"})
  }
  req.session.user = {
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    age: user.age,
    role: "user"
  }
  res.send({status: "success", user: req.session.user})
})

router.post('/resetpassword',async(req,res)=>{
  const {email,password} = req.body;
  if(!email||!password) return res.status(400).send({status:"error",error:"Incomplete Values"});
  const user = await userModel.findOne({email});
  if(!user) return res.status(404).send({status:"error",error:"Not user found"});
  const newHashedPassword = createHash(password);
  await userModel.updateOne({_id:user._id},{$set:{password:newHashedPassword}});
  res.send({status:"success",message:"Contraseña restaurada"});
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
});

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