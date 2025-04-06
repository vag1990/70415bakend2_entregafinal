import express from "express";
import CartDAO from "../dao/cart.dao.js"; 
import { checkAuth } from "../middlewares/authorize.middleware.js"; 
import ProductModel from "../models/product.model.js";

const router = express.Router();

// Crear un carrito nuevo
router.post("/", checkAuth, async (req, res) => {
  try {
    const newCart = await CartDAO.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Obtener un carrito con productos
router.get("/:cartId", checkAuth, async (req, res) => {
  try {
    const cart = await CartDAO.obtenerCarritoConProductos(req.params.cartId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Agregar producto al carrito
router.post("/:cartId/products", checkAuth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await CartDAO.agregarProducto(req.params.cartId, productId, quantity);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Eliminar producto del carrito
router.delete("/:cartId/products/:productId", checkAuth, async (req, res) => {
  try {
    const cart = await CartDAO.eliminarProducto(req.params.cartId, req.params.productId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Vaciar el carrito
router.delete("/:cartId", checkAuth, async (req, res) => {
  try {
    const cart = await CartDAO.vaciarCarrito(req.params.cartId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Actualizar los productos del carrito
router.put("/:cartId/products", checkAuth, async (req, res) => {
  try {
    const { updatedProducts } = req.body;
    const cart = await CartDAO.actualizarProductos(req.params.cartId, updatedProducts);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Actualizar cantidad de un producto en el carrito
router.put("/:cartId/products/:productId", checkAuth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await CartDAO.actualizarCantidad(req.params.cartId, req.params.productId, quantity);
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Finalizar compra (crea un ticket)
router.post("/:cartId/checkout", checkAuth, async (req, res) => {
  try {
    const user = req.user; // Asumiendo que el usuario autenticado está disponible en req.user
    const { ticket, productosNoComprados } = await CartDAO.finalizarCompra(req.params.cartId, user);
    res.status(200).json({ ticket, productosNoComprados });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
