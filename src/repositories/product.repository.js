import productDAO from "../dao/products.dao.js";

class ProductRepository {
  async getAllProducts({ limit, page, sort, query }) {
    return productDAO.getAll({ limit, page, sort, query });
  }

  async getProductById(id) {
    return productDAO.getById(id);
  }

  async createProduct(data) {
    return productDAO.create(data);
  }

  async updateProduct(id, data) {
    return productDAO.update(id, data);
  }

  async deleteProduct(id) {
    return productDAO.delete(id);
  }
}

export default new ProductRepository();
