import jwt from "jsonwebtoken";

export const decodeToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { id: decoded.id, role: decoded.role }; // Return both id and role
  } catch (err) {
    console.error("Invalid token:", err.message);
    return null;
  }
};