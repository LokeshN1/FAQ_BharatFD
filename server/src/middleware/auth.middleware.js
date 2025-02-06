import jwt from "jsonwebtoken";
export const verifyAdmin = (req, res, next) => {
  console.log("Cookies received:", req.cookies); // Debug cookies here
  const token = req.cookies?.adminToken;
  console.log("Recived Admin Token: ", token);
  if (!token) {
    return res.status(401).json({message: "Unauthorized: No token provided"});
  }

  try {
    console.log(process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({message: "Unauthorized - Invalid Token"});
    }
    next();
  } catch (err) {
    return res.status(403).json({message: "Invalid token"});
  }
};
