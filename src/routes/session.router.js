import express from "express";
import UserDTO from "../dto/user.dto.js";
import passport from "passport";

const router = express.Router();

// Estrategia "current"
router.get("/current", passport.authenticate('jwt', { session: false }), (req, res) => {
  const safeUser = new UserDTO(req.user);
  res.json({ user: safeUser });
});

export default router;
