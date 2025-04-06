import CartModel from "../models/cart.model.js";
import ProductModel from "../models/product.model.js";
import TicketModel from "../models/ticket.model.js";
import { v4 as uuidv4 } from "uuid";

class CartDAO {
  async createCart() {
    const newCart = new CartModel({ products: [] });
    return await newCart.save();
  }

  async obtenerCarritoConProductos(cartId) {
    const cart = await CartModel.findById(cartId).populate("products.product");
    if (!cart) throw new Error("Carrito no encontrado");
    return cart;
  }

  async agregarProducto(cartId, productId, quantity = 1) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const existingProduct = cart.products.find(item => item.product.toString() === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    cart.markModified("products");
    return await cart.save();
  }

  async eliminarProducto(cartId, productId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = cart.products.filter(item => item.product.toString() !== productId);
    return await cart.save();
  }

  async vaciarCarrito(cartId) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = [];
    return await cart.save();
  }

  async actualizarProductos(cartId, updatedProducts) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    cart.products = updatedProducts;
    cart.markModified("products");
    return await cart.save();
  }

  async actualizarCantidad(cartId, productId, quantity) {
    const cart = await CartModel.findById(cartId);
    if (!cart) throw new Error("Carrito no encontrado");

    const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
    if (productIndex === -1) throw new Error("Producto no encontrado en el carrito");

    cart.products[productIndex].quantity = quantity;
    cart.markModified("products");
    return await cart.save();
  }

  async finalizarCompra(cartId, user) {
    const cart = await CartModel.findById(cartId).populate("products.product");
    if (!cart) throw new Error("Carrito no encontrado");

    let totalAmount = 0;
    const productosComprados = [];
    const productosNoComprados = [];

    for (const item of cart.products) {
      const producto = item.product;
      const cantidad = item.quantity;

      if (producto.stock >= cantidad) {
        producto.stock -= cantidad;
        await producto.save();

        totalAmount += producto.price * cantidad;
        productosComprados.push({
          product: producto._id,
          quantity: cantidad,
        });
      } else {
        productosNoComprados.push(item);
      }
    }

    const ticketData = {
      code: uuidv4(),
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: user.email,
    };

    const ticket = await TicketModel.create(ticketData);

    cart.products = productosNoComprados;
    await cart.save();

    return {
      ticket,
      productosNoComprados,
    };
  }
}

export default new CartDAO();
