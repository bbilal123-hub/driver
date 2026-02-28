// services/appwrite.ts
import { Client, Account, ID, Databases } from "appwrite";

const client = new Client()
  .setEndpoint("https://nyc.cloud.appwrite.io/v1") // your endpoint
  .setProject("686e348a000905c237fe"); // your project ID

export const account = new Account(client);
export const databases = new Databases(client);

export { ID };
