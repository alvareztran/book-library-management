import * as authService from "../services/auth.service.js";

export const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);
        return res.status(201).json({
            success: true,
            message: "Đăng ký thành công.",
            data: user
        });
    } catch (err) {
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });
    }
}