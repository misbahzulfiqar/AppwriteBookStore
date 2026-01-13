import { Client, Account, Storage, Databases, Query } from "appwrite";

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject("694bc436001e80f4822d");

// Create service instances
export const account = new Account(client);
export const storage = new Storage(client);
export const databases = new Databases(client);

// Export helpers
export { Query };
export { client };
