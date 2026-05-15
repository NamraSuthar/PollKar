const SESSION_TOKEN_KEY = "pulsekar_session_token";

export function getOrCreateSessionToken() {
    const existingToken = localStorage.getItem(SESSION_TOKEN_KEY);

    if (existingToken) {
        return existingToken;
    }

    const token = crypto.randomUUID();
    localStorage.setItem(SESSION_TOKEN_KEY, token);
    return token;
}
