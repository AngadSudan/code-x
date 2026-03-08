import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function checkJWT(token: string): any {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}
