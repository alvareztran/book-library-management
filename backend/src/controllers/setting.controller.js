import * as settingService from "../services/setting.service.js";

export const getSetting = async (req, res) => {
  const setting = await settingService.getSetting();
  return res.status(200).json({
    success: true,
    data: setting,
  });
};

export const updateSetting = async (req, res) => {
  const updatedSetting = await settingService.updateSetting(req.body);
  return res.status(200).json({
    success: true,
    message: "Setting updated successfully.",
    data: updatedSetting,
  });
};
