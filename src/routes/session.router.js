import { Router } from "express";
import express from "express";
import UserDTO from "../dto/user.dto.js";
import passport from "passport";

const router = express.Router();

const JWT_SECRET = "secretoJWT123";

// Ruta de login básica
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    const user = await UserModel.findOne({ email });
  
    if (!user || user.password !== password) { // ¡Reemplazá con hash real en producción!
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
  
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
  
    res.json({ token });
  });
// Estrategia "current"
router.get("/current", passport.authenticate('jwt', { session: false }), (req, res) => {
  const safeUser = new UserDTO(req.user);
  res.json({ user: safeUser });
});

export default router;
