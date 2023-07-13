import passport from "passport";
import GithubStrategy from "passport-github2";
import { userModel } from "../daos/mongodb/models/user.model.js";

const initializePassport = () => {
    passport.use(
        "github",
        new GithubStrategy({
            clientID: "Iv1.5564b75d299d8092",
            clientSecret: "d55b1d18f6f6db4742b4666684a89fb9be1ff22e",
            callbackURL: "http://localhost:8080/api/session/githubcallback",
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile)
            let user = await userModel.findOne({ email: profile._json.email });
            if (!user) {
                let newUser = {
                    first_name: profile.username,
                    last_name: "test lastname",
                    email: profile.profileUrl ,
                    age: 35,
                    password: "1234",
                };
                const result = await userModel.create(newUser);
                done(null, result);
            } else {
                done(null, false);
            }
        })
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    let user = await userModel.findById(id);
    done(null, user);
    });
};

export default initializePassport;