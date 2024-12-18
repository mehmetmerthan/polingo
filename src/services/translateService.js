import { translate } from "@vitalets/google-translate-api";

export async function translateText({ text, setError, translateTo = "en" }) {
  try {
    const { text: translated } = await translate(text, {
      to: translateTo,
    });
    return translated;
  } catch (e) {
    if (e.name === "TooManyRequestsError") {
      console.log("Too many requests");
      setError("Too many requests. Please try again later.");
    }
    console.log("Error while translating:", e);
  }
}
