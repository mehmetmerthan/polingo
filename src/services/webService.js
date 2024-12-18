import { generateClient } from "aws-amplify/api";
import { listWebsites } from "../graphql/queries";
const client = generateClient();

export async function fetchWebsiteList() {
  try {
    const { data } = await client.graphql({ query: listWebsites });
    const allWebsites = data.listWebsites.items;
    return allWebsites;
  } catch (error) {
    console.error("Error fetching websites", error);
  }
}
