import { asyncHandler } from "../../common/utility/async-handler.js";
import { analyticsService } from "./analytics.service.js";

export const getCreatorAnalytics = asyncHandler(async (req, res) => {
  const analytics = await analyticsService.getCreatorAnalytics(
    req.validatedData.params.pollId,
    req.user.id
  );

  res.status(200).json({
    success: true,
    data: { analytics },
  });
});

export const getPublicAnalytics = asyncHandler(async (req, res) => {
  const analytics = await analyticsService.getPublicAnalytics(
    req.validatedData.params.slug
  );

  res.status(200).json({
    success: true,
    data: { analytics },
  });
});
