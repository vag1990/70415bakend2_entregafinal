

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll(".btn-agregar");
  
    buttons.forEach(button => {
      button.addEventListener("click", async () => {
        const productId = button.dataset.id;
  
        
        const cartId = "tu_cart_id_aca"; 
  
        try {
          const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            }
          });
  
          if (!response.ok) throw new Error("Error al agregar producto");
  
          const result = await response.json();
          alert("Producto agregado al carrito!");
          console.log(result);
        } catch (error) {
          console.error("Error:", error);
          alert("No se pudo agregar el producto");
        }
      });
    });
  });
  