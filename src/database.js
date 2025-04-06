import mongoose from "mongoose";

mongoose.connect("mongodb+srv://atlasvag:atlasvagatlas@cluster0.nwn5d.mongodb.net/crudo?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Conectados con éxito!!"))
  .catch(err => console.error("Error de conexión:", err));
