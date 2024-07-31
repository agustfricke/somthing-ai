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
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const tokenUserID = decodedToken._id;

    const fileName = path.basename(req.url);
    const fileNameIs = `/private/${fileName}`;
    const image = await Image.findOne({ path: fileNameIs });

    if (!image) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    if (image.userId.toString() !== tokenUserID && !image.isPublic) {
      return res.status(403).json({ message: "No tienes permiso para acceder a esta imagen" });
    }

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
    return res.status(500).json({ message: "Error en la autenticación" });
  }
}
