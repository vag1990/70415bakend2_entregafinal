// public/js/login.js
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
  
    try {
      const res = await fetch("/api/session/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
  
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/products";
      } else {
        document.getElementById("loginError").textContent =
          data.error || "Error al iniciar sesión";
      }
    } catch (err) {
      document.getElementById("loginError").textContent = "Error en el servidor";
    }
  });
  