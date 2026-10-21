import crypto from "node:crypto";
import * as OTPAuth from "otpauth";
import QRCode from "qrcode";

// Generates a fresh random TOTP secret and the otpauth:// URI + QR code
// data URL for scanning into an authenticator app. Called once per setup
// attempt — the secret isn't persisted until the admin proves they can
// actually generate a valid code from it (see verifyTotp + storage's
// enableAdminMfa), so an abandoned setup never leaves a half-registered
// secret in the database.
export function generateTotpSecret() {
  const secret = new OTPAuth.Secret({ size: 20 });
  return secret.base32;
}

function buildTotp(base32Secret) {
  return new OTPAuth.TOTP({
    issuer: "Jen Voyage",
    label: "Admin",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(base32Secret),
  });
}

export async function totpQrDataUrl(base32Secret) {
  const uri = buildTotp(base32Secret).toString();
  return QRCode.toDataURL(uri);
}

// window:1 accepts the previous/next 30s step too, to tolerate normal
// clock drift between the server and the admin's phone.
export function verifyTotp(base32Secret, code) {
  if (!/^\d{6}$/.test(String(code || ""))) return false;
  const delta = buildTotp(base32Secret).validate({ token: String(code), window: 1 });
  return delta !== null;
}

// Backup codes are shown once, in plaintext, at enrollment — only their
// hash is ever persisted, same principle as a password.
export function generateBackupCodes(count = 8) {
  const codes = [];
  for (let i = 0; i < count; i++) {
    const raw = crypto.randomBytes(5).toString("hex").toUpperCase(); // 10 hex chars
    codes.push(`${raw.slice(0, 5)}-${raw.slice(5)}`);
  }
  return codes;
}

export function hashBackupCode(code) {
  return crypto.createHash("sha256").update(code.trim().toUpperCase()).digest("hex");
}
