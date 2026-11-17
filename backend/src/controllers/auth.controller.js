import * as authService from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json({
      success: true,
      message: "Đăng ký thành công.",
      data: user,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.statusCode ? err.message : "Lỗi máy chủ",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { accessToken, refreshToken, user } = await authService.login(
      req.body,
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth",
    });
    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công.",
      data: {
        accessToken,
        user,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.statusCode ? err.message : "Lỗi máy chủ.",
    });
  }
};

export const refresh = async (req, res) => {
  try {
    const { accessToken, refreshToken } = await authService.refresh(
      req.cookies?.refreshToken,
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/api/auth",
    });
    res.status(200).json({
      success: true,
      message: "Làm mới token thành công.",
      data: {
        accessToken,
      },
    });
  } catch (err) {
    if (err.statusCode === 401) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/auth",
      });
    }
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.statusCode ? err.message : "Lỗi máy chủ.",
    });
  }
};

export const logout = async (req, res) => {
  try {
    await authService.logout(req.cookies?.refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
    });

    return res.status(200).json({
      success: true,
      message: "Đăng xuất thành công.",
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.statusCode ? err.message : "Lỗi máy chủ.",
    });
  }
};
