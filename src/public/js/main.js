let token = "";
let cartId = null;

function guardarToken() {
  token = document.getElementById("tokenInput").value;
  alert("Token guardado");
}

async function cargarProductos() {
  const res = await fetch("/api/products");
  const data = await res.json();
  const container = document.getElementById("productos");

  container.innerHTML = "";
  data.payload.forEach(prod => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${prod.title}</strong> - $${prod.price}</p>
      <button onclick="agregarAlCarrito('${prod._id}')">Agregar al carrito</button>
    `;
    container.appendChild(div);
  });
}

async function obtenerOCrearCarrito() {
  if (cartId) return cartId;

  // Podés ajustar si tenés un endpoint específico para obtener el carrito del usuario
  const res = await fetch("/api/carts", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  cartId = data._id || data.cid || data.cart || data; // depende cómo devuelvas
  return cartId;
}

async function agregarAlCarrito(productId) {
  const cid = await obtenerOCrearCarrito();

  const res = await fetch(`/api/carts/${cid}/product/${productId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  console.log("Producto agregado:", data);
  alert("Producto agregado al carrito");
}

async function realizarCompra() {
  const cid = await obtenerOCrearCarrito();

  const res = await fetch(`/api/carts/${cid}/purchase`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });

  const data = await res.json();
  console.log("Compra realizada:", data);
  alert(`Compra realizada. Código de ticket: ${data.ticket?.code}`);
}

cargarProductos();
