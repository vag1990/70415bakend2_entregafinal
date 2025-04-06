async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    const res = await fetch("/api/session/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await res.json();
  
    if (res.ok) {
      const token = data.token;
      localStorage.setItem("token", token);
  
      // Obtener current user
      const currentRes = await fetch("/api/session/current", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const currentData = await currentRes.json();
      localStorage.setItem("cartId", currentData.user.cart);
  
      document.getElementById("login-section").style.display = "none";
      document.getElementById("app-section").style.display = "block";
  
      fetchProducts();
    } else {
      alert("Error al iniciar sesión");
    }
  }
  
  async function fetchProducts() {
    const token = localStorage.getItem("token");
  
    const res = await fetch("/api/products", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    const data = await res.json();
  
    const productsDiv = document.getElementById("products");
    productsDiv.innerHTML = "";
  
    data.payload.forEach((prod) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <p><strong>${prod.title}</strong> - $${prod.price}</p>
        <button onclick="addToCart('${prod._id}')">Agregar al carrito</button>
      `;
      productsDiv.appendChild(div);
    });
  }
  
  async function addToCart(productId) {
    const token = localStorage.getItem("token");
    const cartId = localStorage.getItem("cartId");
  
    const res = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (res.ok) {
      alert("Producto agregado al carrito!");
    } else {
      alert("Error al agregar producto");
    }
  }
  
  async function purchaseCart() {
    const token = localStorage.getItem("token");
    const cartId = localStorage.getItem("cartId");
  
    const res = await fetch(`/api/carts/${cartId}/purchase`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    const data = await res.json();
  
    if (res.ok) {
      const ticketDiv = document.getElementById("ticket");
      ticketDiv.innerHTML = `
        <h3>🎫 Ticket generado:</h3>
        <p><strong>Código:</strong> ${data.ticket.code}</p>
        <p><strong>Total:</strong> $${data.ticket.amount}</p>
        <p><strong>Comprador:</strong> ${data.ticket.purchaser}</p>
        <p><strong>Fecha:</strong> ${new Date(data.ticket.purchase_datetime).toLocaleString()}</p>
      `;
    } else {
      alert("Error al comprar carrito");
    }
  }
  
  function logout() {
    localStorage.clear();
    location.reload();
  }
  