import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const checkUserAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token format: Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Access Denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token." });
  }
};
