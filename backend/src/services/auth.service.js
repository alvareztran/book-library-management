import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import { hashPassword } from "../utils/password.util.js";

export const register = async (data) => {
  const { fullName, email, password, phone, address } = data;

  if (!fullName || !email || !password || !phone) {
    throw new ApiError("Vui lòng nhập đầy đủ thông tin.", 400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError("Email đã được sử dụng.", 400);
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
