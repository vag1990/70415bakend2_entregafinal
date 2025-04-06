export const checkAuth = (req, res, next) => {
  const user = req.user;  // Asumiendo que el usuario está disponible en req.user

  if (!user) {
    return res.status(401).json({ error: "No autenticado" });
  }

  next();
};

export const authorizeRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
      const user = req.user;
  
      if (!user) {
        return res.status(401).json({ error: "No autenticado" });
      }
  
      if (!rolesPermitidos.includes(user.role)) {
        return res.status(403).json({ error: "No tienes permisos para esta acción" });
      }
  
      next();
    };
  };
  