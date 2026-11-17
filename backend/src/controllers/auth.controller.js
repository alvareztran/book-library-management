import * as authService from "../services/auth.service.js";

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/auth",
};

export const register = async (req, res) => {
  const user = await authService.register(req.body);
  return res.status(201).json({
    success: true,
    message: "Registration successful.",
    data: user,
  });
};

export const login = async (req, res) => {
  const { accessToken, refreshToken, user } = await authService.login(
    req.body,
  );
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
  return res.status(200).json({
    success: true,
    message: "Login successful.",
    data: {
      accessToken,
      user,
    },
  });
};

export const refresh = async (req, res) => {
  try {
    const { accessToken, refreshToken } = await authService.refresh(
      req.cookies?.refreshToken,
    );
    res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
    return res.status(200).json({
      success: true,
      message: "Token refresh successful.",
      data: {
        accessToken,
      },
    });
  } catch (err) {
    if (err.statusCode === 401) {
      res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
    }
    throw err;
  }
};

export const logout = async (req, res) => {
  try {
    await authService.logout(req.cookies?.refreshToken);
  } finally {
    res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
  }

  return res.status(200).json({
    success: true,
    message: "Logout successful.",
  });
};
