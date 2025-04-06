import { Router } from "express";
import passport from "passport";
import cartDAO from "../dao/cart.dao.js";

const router = Router();

// Crear un carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartDAO.createCart(); // este método ya existe con el nombre correcto ahora
    res.status(201).json({ status: "success", payload: newCart });
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ status: "error", error: "Error interno del servidor" });
  }
});

// ... el resto de las rutas está perfecto, no necesita cambio

export default router;
