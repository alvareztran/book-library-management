import jwt from "jsonwebtoken";
import Reader from "../models/reader.model.js";
import Staff from "../models/staff.model.js";

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Bạn chưa đăng nhập.",
      });
    }
    const accessToken = authHeader.split(" ")[1];

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const { sub, userType } = decoded;

    const Model =
      userType === "DocGia" ? Reader : userType === "NhanVien" ? Staff : null;

    if (!Model) {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ.",
      });
    }

    const user = await Model.findById(sub);

    if (!user || user.Status !== "active") {
      return res.status(401).json({
        success: false,
        message: "Tài khoản không tồn tại hoặc không hoạt động.",
      });
    }
    req.user = user;
    req.userId = user._id;
    req.userType = userType;

    next();
  } catch (err) {
    if (
      err.name === "TokenExpiredError" ||
      err.name === "JsonWebTokenError" ||
      err.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Access token không hợp lệ hoặc đã hết hạn.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Lỗi máy chủ",
    });
  }
};
