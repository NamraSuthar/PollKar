import { asyncHandler } from "../../common/utility/async-handler.js";
import { responseService } from "./response.service.js";

export const submitResponse = asyncHandler(async (req, res) => {
    const response = await responseService.submitResponse(
        req.validatedData.params.slug,
        req.validatedData.body,
        req.user || null
    );

    res.status(201).json({
        success: true,
        message: "Response submitted successfully",
        data: { response },
    });
});
