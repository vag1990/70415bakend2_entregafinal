import express from "express";
import productRepository from "../repositories/product.repository.js";
import { authorizeRoles } from "../middlewares/authorize.middleware.js";

const router = express.Router();

// GET con paginación y filtros
router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const productos = await productRepository.getAllProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: 'success',
            payload: productos.docs,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.hasPrevPage ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: productos.hasNextPage ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}` : null,
        });

    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({ status: 'error', error: "Error interno del servidor" });
    }
});

// GET producto por ID
router.get("/:pid", async (req, res) => {
    const id = req.params.pid;
    try {
        const producto = await productRepository.getProductById(id);
        if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

        res.json(producto);
    } catch (error) {
        console.error("Error al obtener producto", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// POST crear producto
router.post("/", authorizeRoles("admin"), async (req, res) => {
    const nuevoProducto = req.body;
    try {
        const result = await productRepository.createProduct(nuevoProducto);
        res.status(201).json({ message: "Producto agregado exitosamente", product: result });
    } catch (error) {
        console.error("Error al agregar producto", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// PUT actualizar producto
router.put("/:pid", authorizeRoles("admin"), async (req, res) => {
    const id = req.params.pid;
    const productoActualizado = req.body;
    try {
        const result = await productRepository.updateProduct(id, productoActualizado);
        res.json({ message: "Producto actualizado exitosamente", product: result });
    } catch (error) {
        console.error("Error al actualizar producto", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// DELETE eliminar producto
router.delete("/:pid", authorizeRoles("admin"), async (req, res) => {
    const id = req.params.pid;
    try {
        await productRepository.deleteProduct(id);
        res.json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar producto", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;
