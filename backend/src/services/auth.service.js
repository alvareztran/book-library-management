import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { comparePassword, hashPassword } from "../utils/password.util.js";
import { hashRefreshToken } from "../utils/refresh-token.util.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.util.js";

export const register = async (data) => {
  const { fullName, email, password, phone, address } = data;

  if (!fullName || !email || !password || !phone) {
    throw new ApiError("Vui lòng nhập đầy đủ thông tin.", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Email đã được sử dụng.");
  }
  const passwordHash = await hashPassword(password);
  const user = await User.create({
    fullName,
    email,
    passwordHash,
    phone,
    address,
    role: "reader",
  });
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
};

export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(400, "Vui lòng nhập đủ email và password.");
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select(
    "+passwordHash",
  );
  if (!user) {
    throw new ApiError(401, "Email hoặc mật khẩu không chính xác.");
  }
  const match = await comparePassword(password, user.passwordHash);
  if (!match) {
    throw new ApiError(401, "Email hoặc mật khẩu không chính xác.");
  }
  if (user.status !== "active") {
    throw new ApiError(403, "Tài khoản hiện không thể đăng nhập.");
  }

  const session = new Session({
    userId: user._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, session._id);

  session.refreshTokenHash = await hashRefreshToken(refreshToken);
  await session.save();

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
};
