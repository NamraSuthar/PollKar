export function toAuthUserDto(user) {
  if (!user) return null;

  return {
    id: user.id ?? user.user_id ?? null,
    name: user.name ?? user.full_name ?? "",
    email: user.email ?? user.user_email ?? "",
    isVerified: user.isVerified ?? user.is_verified ?? false,
    createdAt: user.createdAt ?? user.created_at ?? null,
  };
}

export function toAuthResponseDto(user, accessToken) {
  return {
    user: toAuthUserDto(user),
    accessToken,
    token: accessToken,
  };
}
