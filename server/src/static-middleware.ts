import jwt from "jsonwebtoken";
import path from "path";
import Image from "./models/images.js";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "The token is missing." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Formato de token inválido" });
  }

  try {
    const decodedToken = jwt.verify(token, 'some-key');
    const tokenUserID = decodedToken._id;

    const fileName = path.basename(req.url);
    const image = await Image.findOne({ path: fileName });

    if (!image) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    // Verificar si el usuario del token tiene permiso para acceder a la imagen
    if (image.userId.toString() !== tokenUserID && !image.isPublic) {
      return res.status(403).json({ message: "No tienes permiso para acceder a esta imagen" });
    }

    // Añadir la información de la imagen a req para uso posterior si es necesario
    req.image = image;
    req.user = decodedToken;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Token inválido" });
    }
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expirado" });
    }
    console.error(error);
    return res.status(500).json({ message: "Error en la autenticación" });
  }
}
