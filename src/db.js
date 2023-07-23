import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://ezequielleiblich:1Q2w3e4r@leibliche.nmve4kb.mongodb.net/?retryWrites=true&w=majority/"
    );
    console.log("Conexión exitosa a la base de datos");
  } 
  catch (error) {
    console.error("Error al conectar a la base de datos", error);
  }
};

export default connectDB;