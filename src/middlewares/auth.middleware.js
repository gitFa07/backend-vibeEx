const jwt = require("jsonwebtoken");

async function authArtist(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized: Token Absent",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "artist") {
      return res.status(403).json({
        message: "No access to create an Album",
      });
    }

    req.user = decoded;

    next(); //Transfers control to controller
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "Unauthorized: Invalid Token",
    });
  }
}

module.exports = {
  authArtist,
};
