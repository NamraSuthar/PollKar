export function toAnalyticsDto({ poll, questions, totalResponses, optionCounts }) {
  return {
    poll: {
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
    },
    summary: {
      totalResponses,
      completionStatus: poll.isPublished ? "published" : "collecting",
      isExpired: poll.expiresAt ? new Date(poll.expiresAt) <= new Date() : false,
    },
    questions: questions.map((question) => {
      const options = question.options.map((option) => {
        const count = optionCounts.get(option.id) || 0;

        return {
          id: option.id,
          label: option.label,
          count,
          percentage:
            totalResponses === 0 ? 0 : Math.round((count / totalResponses) * 100),
        };
      });

      return {
        id: question.id,
        title: question.title,
        isRequired: question.isRequired,
        position: question.position,
        options,
      };
    }),
  };
}
