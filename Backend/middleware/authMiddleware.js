import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // 1. Get token from HTTP-only cookie
  const token = req.cookies?.token;

  // 2. Check if token is missing
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // 3. Verify the token using secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Attach user info to the request
    req.user = decoded;

    // 5. Proceed to next middleware/route
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
