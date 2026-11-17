import jwt from "jsonwebtoken";

export const generateAccessToken = (user, userType) => {
  const role = userType === "DocGia" ? "reader" : user.ChucVu;
  return jwt.sign(
    {
      sub: user._id.toString(),
      userType,
      role
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
    },
  );
};

export const generateRefreshToken = (user, sessionId) => {
  return jwt.sign(
    {
      sub: user._id,
      sid: sessionId.toString(),
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    },
  );
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};
