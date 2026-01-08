import { Client, Account, Storage } from "appwrite";  // ✅ Add Storage import

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject("694bc436001e80f4822d");

export const account = new Account(client);
export const storage = new Storage(client);  // ✅ Add Storage export
export { client };  // Optional: export client too