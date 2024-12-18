import { getCurrentUser } from "aws-amplify/auth";

export const getUserId = async () => {
  try {
    const { userId } = await getCurrentUser();
    return userId;
  } catch (error) {
    console.error("Error getting user ID", error);
  }
};
