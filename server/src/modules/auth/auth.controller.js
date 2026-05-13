import { asyncHandler } from "../../common/utility/async-handler.js";
import { authService } from "./auth.service.js";

export const register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.validatedData.body)

    res.status(201).json({
        success: true,
        data: result,
        message: "Account created successfully"
    });
})


export const login = asyncHandler(async (req, res) => {
    const result = await authService.login(req.validatedData.body)

    res.status(200).json({
        success: true,
        data: result,
        message: "Logged in successfully"
    })
})


export const me = asyncHandler(async (req, res) => {
    const user = await authService.getCurrentUser(req.user.id)

    res.status(200).json({
        success: true,
        data: { user },
        message: "Current user fetched successfully"
    })


})