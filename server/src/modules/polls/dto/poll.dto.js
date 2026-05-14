export function toPollSummaryDto(poll) {
  return {
    id: poll.id,
    slug: poll.slug,
    title: poll.title,
    description: poll.description,
    responseMode: poll.responseMode,
    expiresAt: poll.expiresAt,
    isPublished: poll.isPublished,
    publishedAt: poll.publishedAt,
    responseCount: poll.responseCount,
    createdAt: poll.createdAt,
    updatedAt: poll.updatedAt,
  };
}

export function toPollDetailDto(poll, questions = []) {
  return {
    ...toPollSummaryDto(poll),
    questions: questions.map((question) => ({
      id: question.id,
      title: question.title,
      isRequired: question.isRequired,
      position: question.position,
      options: question.options.map((option) => ({
        id: option.id,
        label: option.label,
        position: option.position,
      })),
    })),
  };
}
