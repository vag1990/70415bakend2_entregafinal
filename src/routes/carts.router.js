import express from "express";
import passport from "passport";

import CartDAO from "../dao/cart.dao.js";
import productDAO from "../dao/product.dao.js";
import TicketService from "../services/ticket.service.js";

const router = express.Router();
const cartDAO = new CartDAO();

const ticketService = new TicketService();

// Crear carrito
router.post("/", async (req, res) => {
  try {
    const nuevoCarrito = await cartDAO.crearCarrito();
    res.json(nuevoCarrito);
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Obtener productos de un carrito
router.get("/:cid", async (req, res) => {
  try {
    const carrito = await cartDAO.obtenerCarritoConProductos(req.params.cid);
    if (!carrito) return res.status(404).json({ error: "Carrito no encontrado" });

    res.json(carrito.products);
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Agregar producto a carrito
router.post(
  "/:cid/product/:pid",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const quantity = req.body.quantity || 1;
      const updatedCart = await cartDAO.agregarProducto(cid, pid, quantity);

      res.json(updatedCart);
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

// Eliminar producto de carrito
router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartDAO.eliminarProducto(cid, pid);
    res.json({ message: "Producto eliminado", updatedCart });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar productos del carrito
router.put("/:cid", async (req, res) => {
  try {
    const updatedCart = await cartDAO.actualizarProductos(
      req.params.cid,
      req.body
    );
    res.json(updatedCart);
  } catch (error) {
    console.error("Error al actualizar carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Actualizar cantidad de un producto
router.put("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const updatedCart = await cartDAO.actualizarCantidad(cid, pid, quantity);
    res.json({ message: "Cantidad actualizada", updatedCart });
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Vaciar carrito
router.delete("/:cid", async (req, res) => {
  try {
    const updatedCart = await cartDAO.vaciarCarrito(req.params.cid);
    res.json({ message: "Carrito vaciado", updatedCart });
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Finalizar compra y generar ticket
router.post(
  "/:cid/purchase",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const cartId = req.params.cid;
      const userEmail = req.user.email;

      const carrito = await cartDAO.obtenerCarritoConProductos(cartId);
      if (!carrito) return res.status(404).json({ error: "Carrito no encontrado" });

      const productosComprados = [];
      const productosNoComprados = [];

      for (const item of carrito.products) {
        const producto = await productDAO.getById(item.product._id);

        if (producto.stock >= item.quantity) {
          producto.stock -= item.quantity;
          await productDAO.update(producto._id, { stock: producto.stock });
          productosComprados.push({
            product: producto._id,
            quantity: item.quantity,
            price: producto.price,
          });
        } else {
          productosNoComprados.push(item.product._id);
        }
      }

      const total = productosComprados.reduce(
        (acc, p) => acc + p.quantity * p.price,
        0
      );

      const ticket = await ticketService.createTicket({
        amount: total,
        purchaser: userEmail,
      });

      await cartDAO.actualizarProductos(
        cartId,
        carrito.products.filter((item) =>
          productosNoComprados.includes(item.product._id.toString())
        )
      );

      res.json({
        message:
          productosNoComprados.length > 0
            ? "Compra parcial realizada. Algunos productos no tenían stock suficiente."
            : "Compra completa realizada.",
        ticket,
        productosNoComprados,
      });
    } catch (error) {
      console.error("Error al procesar compra:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
);

export default router;
