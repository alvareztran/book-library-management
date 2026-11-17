export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Bạn chưa đăng nhập.",
      });
    }

    const role = req.userType === "DocGia" ? "reader" : req.user.ChucVu;

    if (!roles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền thực hiện thao tác này.",
      });
    }

    next();
  };
};
