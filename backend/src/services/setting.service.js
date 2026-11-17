import Setting from "../models/setting.model.js";
import ApiError from "../utils/api-error.js";

const SETTING_FIELDS = ["maxBorrowBooks", "maxBorrowDurationDays", "finePerDay"];

export const getSetting = async () => {
  const setting = await Setting.findOne();
  return setting ?? new Setting();
};

export const updateSetting = async (data) => {
  const updates = {};

  for (const field of SETTING_FIELDS) {
    if (data[field] === undefined) {
      continue;
    }
    if (
      typeof data[field] !== "number" ||
      !Number.isFinite(data[field]) ||
      data[field] < 0
    ) {
      throw new ApiError(400, `${field} is invalid.`);
    }
    updates[field] = data[field];
  }

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, "Missing required fields.");
  }

  const updatedSetting = await Setting.findOneAndUpdate({}, updates, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });

  return updatedSetting;
};
