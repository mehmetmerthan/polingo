import { signOut } from "aws-amplify/auth";

export default async function handleSignOut() {
  try {
    await signOut();
  } catch (error) {
    console.log("error signing out: ", error);
  }
}
