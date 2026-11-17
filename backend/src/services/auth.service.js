import Reader from "../models/reader.model.js";
import Staff from "../models/staff.model.js";
import Session from "../models/session.model.js";
import ApiError from "../utils/api-error.js";
import { comparePassword, hashPassword } from "../utils/password.util.js";
import { hashRefreshToken } from "../utils/refresh-token.util.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token.util.js";

export const register = async (data) => {
  const { HoLot, Ten, NgaySinh, Phai, Email, Password, SoDienThoai, DiaChi } =
    data;

  if (
    !HoLot?.trim() ||
    !Ten?.trim() ||
    !NgaySinh ||
    !Email?.trim() ||
    !Password ||
    !SoDienThoai?.trim()
  ) {
    throw new ApiError(400, "Missing required fields.");
  }

  const birthDate = new Date(NgaySinh);
  if (Number.isNaN(birthDate.getTime())) {
    throw new ApiError(400, "Birthday is invalid.");
  }

  if (Phai && !["male", "female", "other"].includes(Phai)) {
    throw new ApiError(400, "Gender is invalid.");
  }

  const normalizedEmail = Email.trim().toLowerCase();

  const [existingReader, existingStaff] = await Promise.all([
    Reader.findOne({ Email: normalizedEmail }),
    Staff.findOne({ Email: normalizedEmail }),
  ]);
  if (existingReader || existingStaff) {
    throw new ApiError(400, "Email has already been used.");
  }

  const passwordHash = await hashPassword(Password);

  const reader = await Reader.create({
    HoLot: HoLot.trim(),
    Ten: Ten.trim(),
    NgaySinh: birthDate,
    Phai,
    Email: normalizedEmail,
    Password: passwordHash,
    SoDienThoai: SoDienThoai.trim(),
    DiaChi: DiaChi?.trim() || undefined,
  });

  return {
    id: reader._id,
    HoLot: reader.HoLot,
    Ten: reader.Ten,
    Email: reader.Email,
  };
};

export const login = async ({ Email, Password }) => {
  if (!Email?.trim() || !Password) {
    throw new ApiError(400, "Please enter both Email and Password.");
  }

  const normalizedEmail = Email.trim().toLowerCase();

  const [reader, staff] = await Promise.all([
    Reader.findOne({ Email: normalizedEmail }).select("+Password"),
    Staff.findOne({ Email: normalizedEmail }).select("+Password"),
  ]);

  if (!reader && !staff) {
    throw new ApiError(401, "Email or password is incorrect.");
  }

  const user = reader || staff;
  const userType = reader ? "DocGia" : "NhanVien";

  const matched = await comparePassword(Password, user.Password);

  if (!matched) {
    throw new ApiError(401, "Email or password is incorrect.");
  }

  if (user.Status !== "active") {
    throw new ApiError(403, "Account is not active.");
  }

  const session = new Session({
    userId: user._id,
    userType,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const accessToken = generateAccessToken(user, userType);
  const refreshToken = generateRefreshToken(user, session._id);

  session.refreshTokenHash = hashRefreshToken(refreshToken);
  await session.save();

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      ...(userType === "DocGia"
        ? { HoLot: user.HoLot, Ten: user.Ten }
        : { HoTenNV: user.HoTenNV }),
      Email: user.Email,
      userType,
      role: userType === "DocGia" ? "reader" : user.ChucVu,
    },
  };
};

export const refresh = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, "Please log in again.");
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, "Token is invalid or has expired.");
  }

  const { sub: userId, sid: sessionId } = decoded;

  const session = await Session.findOne({
    _id: sessionId,
    userId: userId,
    expiresAt: { $gt: new Date() },
  }).select("+refreshTokenHash");

  if (!session) {
    throw new ApiError(401, "Session does not exist or has expired.");
  }

  const incomingHash = hashRefreshToken(refreshToken);

  if (session.refreshTokenHash !== incomingHash) {
    await Session.deleteOne({ _id: sessionId });
    throw new ApiError(401, "Refresh token is invalid.");
  }

  const Model =
    session.userType === "DocGia"
      ? Reader
      : session.userType === "NhanVien"
        ? Staff
        : null;
  if (!Model) {
    throw new ApiError(401, "Invalid user type.");
  }

  const user = await Model.findById(userId);

  if (!user || user.Status !== "active") {
    await Session.deleteOne({ _id: sessionId });
    throw new ApiError(401, "Invalid account.");
  }

  const newAccessToken = generateAccessToken(user, session.userType);
  const newRefreshToken = generateRefreshToken(user, sessionId);

  const result = await Session.updateOne(
    {
      _id: sessionId,
      userId,
      userType: session.userType,
      refreshTokenHash: incomingHash,
      expiresAt: { $gt: new Date() },
    },
    {
      $set: {
        refreshTokenHash: hashRefreshToken(newRefreshToken),
      },
    },
  );

  if (result.modifiedCount !== 1) {
    throw new ApiError(401, "Refresh token has already been used.");
  }

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const logout = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, "You are not logged in.");
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new ApiError(401, "Refresh token is invalid.");
  }

  const session = await Session.findOne({
    _id: decoded.sid,
    userId: decoded.sub,
  }).select("+refreshTokenHash");

  if (!session) {
    throw new ApiError(401, "Session does not exist.");
  }

  const incommingHash = hashRefreshToken(refreshToken);
  if (session.refreshTokenHash !== incommingHash) {
    throw new ApiError(401, "Refresh token is invalid.");
  }

  await Session.deleteOne({ _id: decoded.sid });

  return true;
};
