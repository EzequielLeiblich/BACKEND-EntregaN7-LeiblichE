import mongoose from "mongoose";
import { userModel } from "./models/user.model.js";

export default class UserManager {
  // connection = mongoose.connect('mongodb+srv://ezequielleiblich:1Q2w3e4r@leibliche.nmve4kb.mongodb.net/?retryWrites=true&w=majority')
  async getUser(email) {
    const user = await userModel.findOne({
        email: email,
    });
    return user;
  }
  async authUser(email, password) {
      const user = await userModel.findOne({
          email: email,
          password: password,
      });
      console.log(user);
      if (!user) return false;
      else return user;
  }
  async createUser(data) {
      const exist = await this.getUser(data.email);
      console.log(exist);
      if (exist) {
          return false;
      } else {
          data.rol = "usuario";
          console.log(data);
          const res = await userModel.create(data);
          return true, res;
      }
  }
}