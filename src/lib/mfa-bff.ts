export function formatMfaChallengeResponse(data: unknown, remember = false) {
  if (!data || typeof data !== "object" || !("mfa_required" in data)) {
    return null;
  }

  const record = data as Record<string, unknown>;
  if (!record.mfa_required) {
    return null;
  }

  return {
    mfaRequired: true as const,
    mfaToken: typeof record.mfa_token === "string" ? record.mfa_token : "",
    mfaMethod:
      typeof record.mfa_method === "string"
        ? (record.mfa_method as "EMAIL_OTP" | "SMS_OTP" | "AUTHENTICATOR_APP")
        : "EMAIL_OTP",
    mfaDestination: typeof record.mfa_destination === "string" ? record.mfa_destination : "",
    emailDestination: typeof record.email_destination === "string" ? record.email_destination : "",
    phoneDestination: typeof record.phone_destination === "string" ? record.phone_destination : null,
    availableMethods: Array.isArray(record.available_methods)
      ? (record.available_methods as Array<"EMAIL_OTP" | "SMS_OTP" | "AUTHENTICATOR_APP">)
      : ["EMAIL_OTP"],
    remember,
  };
}
