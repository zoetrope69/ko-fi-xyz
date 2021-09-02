import { Magic } from "magic-sdk";

console.log("process.env", process.env);
const { NEXT_PUBLIC_MAGIC_PUBLIC_API_KEY } = process.env;

const magic =
  process.browser && new Magic(NEXT_PUBLIC_MAGIC_PUBLIC_API_KEY);

export async function getDIDWithEmail(email) {
  if (!magic) {
    return null;
  }

  const did = await magic.auth.loginWithMagicLink({ email });

  return did;
}
