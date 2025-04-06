import CartModel from "../models/cart.model.js";

class CartDAO {
    async createCart() {
        const newCart = new CartModel({ products: [] });
        return await newCart.save();
    }

    async getCartById(cartId) {
        return await CartModel.findById(cartId);
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await this.getCartById(cartId);
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

    async removeProductFromCart(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) throw new Error("Carrito no encontrado");

        cart.products = cart.products.filter(item => item.product.toString() !== productId);
        return await cart.save();
    }

    async updateCart(cartId, updatedProducts) {
        const cart = await CartModel.findById(cartId);
        if (!cart) throw new Error("Carrito no encontrado");

        cart.products = updatedProducts;
        cart.markModified("products");
        return await cart.save();
    }

    async updateProductQuantity(cartId, productId, newQuantity) {
        const cart = await CartModel.findById(cartId);
        if (!cart) throw new Error("Carrito no encontrado");

        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);
        if (productIndex === -1) throw new Error("Producto no encontrado en el carrito");

        cart.products[productIndex].quantity = newQuantity;
        cart.markModified("products");
        return await cart.save();
    }

    async clearCart(cartId) {
        const cart = await CartModel.findByIdAndUpdate(cartId, { products: [] }, { new: true });
        if (!cart) throw new Error("Carrito no encontrado");
        return cart;
    }
}

export default CartDAO;
