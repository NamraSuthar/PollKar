import { asyncHandler } from "../../common/utility/async-handler.js";
import { pollService } from "./poll.service.js";

export const createPoll = asyncHandler(async (req, res) => {
  const poll = await pollService.createPoll(req.user.id, req.validatedData.body);

  res.status(201).json({
    success: true,
    message: "Poll created successfully",
    data: { poll },
  });
});

export const listPolls = asyncHandler(async (req, res) => {
  const polls = await pollService.listCreatorPolls(req.user.id);

  res.status(200).json({
    success: true,
    data: { polls },
  });
});

export const getPoll = asyncHandler(async (req, res) => {
  const poll = await pollService.getCreatorPoll(
    req.validatedData.params.id,
    req.user.id
  );

  res.status(200).json({
    success: true,
    data: { poll },
  });
});

export const getPublicPoll = asyncHandler(async (req, res) => {
  const poll = await pollService.getPublicPoll(req.validatedData.params.slug);

  res.status(200).json({
    success: true,
    data: { poll },
  });
});

export const updatePoll = asyncHandler(async (req, res) => {
  const poll = await pollService.updatePoll(
    req.validatedData.params.id,
    req.user.id,
    req.validatedData.body
  );

  res.status(200).json({
    success: true,
    message: "Poll updated successfully",
    data: { poll },
  });
});

export const deletePoll = asyncHandler(async (req, res) => {
  await pollService.deletePoll(req.validatedData.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: "Poll deleted successfully",
  });
});

export const publishResults = asyncHandler(async (req, res) => {
  const poll = await pollService.publishResults(
    req.validatedData.params.id,
    req.user.id
  );

  res.status(200).json({
    success: true,
    message: "Poll results published successfully",
    data: { poll },
  });
});
