let carritoId = null;

document.addEventListener("DOMContentLoaded", async () => {
  // Verificar si hay un carrito creado
  carritoId = localStorage.getItem("carritoId");
  if (!carritoId) {
    try {
      const response = await fetch("/api/carts", { method: "POST" });
      const data = await response.json();
      carritoId = data._id || data.cart._id;
      localStorage.setItem("carritoId", carritoId);
      console.log("Carrito creado:", carritoId);
    } catch (error) {
      console.error("Error creando carrito", error);
    }
  }

  // Escuchar clicks en botones de productos
  document.querySelectorAll(".btn-agregar").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const productId = btn.dataset.id;
      try {
        const response = await fetch(`/api/carts/${carritoId}/product/${productId}`, {
          method: "POST",
        });
        const result = await response.json();
        console.log("Producto agregado", result);
        alert("Producto agregado al carrito");
      } catch (error) {
        console.error("Error agregando producto", error);
      }
    });
  });

  // Botón comprar
  document.getElementById("btn-comprar").addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Primero tenés que iniciar sesión");

    try {
      const response = await fetch(`/api/carts/${carritoId}/purchase`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Compra realizada:", data);
        alert("Compra realizada. Código de ticket: " + data.ticket.code);
      } else {
        alert(data.error || "No se pudo completar la compra");
      }
    } catch (err) {
      console.error("Error al comprar", err);
    }
  });
});
