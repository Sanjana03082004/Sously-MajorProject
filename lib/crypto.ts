import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.ENCRYPTION_KEY || "your-32-char-secret"; // must match in .env

export function encrypt(text: string) {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

export function decrypt(cipher: string) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error("❌ Decryption error:", err);
    return "";
  }
}
