export function toResponseSubmissionDto(response, poll) {
    return {
        id: response.id,
        pollId: response.pollId,
        submittedAt: response.submittedAt,
        responseCount: poll.responseCount,
    };
}
