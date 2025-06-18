import { Client, Account } from "appwrite";

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // or your self-hosted endpoint
  .setProject('683476230013106bdb58');

const account = new Account(client);

export { client, account };
// new 683476230013106bdb58
// old '682a3d240005f02f8262'