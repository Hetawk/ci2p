import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || "default-secret-change-in-production"
);

export interface AuthJWTPayload {
  userId?: string;
  email?: string;
  role?: string;
  dashboard: "portfolio" | "herpromise";
  authenticatedAt: number;
}

export async function signToken(payload: AuthJWTPayload): Promise<string> {
  const token = await new SignJWT({
    ...payload,
    userId: payload.userId || undefined,
    email: payload.email || undefined,
    role: payload.role || undefined,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // 7 days
    .sign(JWT_SECRET);

  return token;
}

export async function verifyToken(
  token: string
): Promise<AuthJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string | undefined,
      email: payload.email as string | undefined,
      role: payload.role as string | undefined,
      dashboard: payload.dashboard as "portfolio" | "herpromise",
      authenticatedAt: payload.authenticatedAt as number,
    };
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export async function refreshToken(oldToken: string): Promise<string | null> {
  const payload = await verifyToken(oldToken);
  if (!payload) return null;

  // Create new token with updated timestamp
  const newPayload: AuthJWTPayload = {
    ...payload,
    authenticatedAt: Date.now(),
  };

  return signToken(newPayload);
}

/**
 * Verify authentication token for API routes
 * Returns payload if valid, null if invalid
 */
export async function verifyAuth(
  token: string
): Promise<AuthJWTPayload | null> {
  return verifyToken(token);
}
