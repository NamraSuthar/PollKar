export function toAuthUserDto(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
}

export function toAuthResponseDto(user, accessToken) {
  return {
    user: toAuthUserDto(user),
    accessToken,
    token: accessToken,
  };
}
