export function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}

export function appendSlugSuffix(slug) {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${slug}-${suffix}`;
}
