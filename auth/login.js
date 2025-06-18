// // import { account } from '../appwrite/appwriteConfig';
// import {account} from '../appwrite/appwriteConfig'

// export const loginUser = async (email, password) => {
//   try {
//     const session = await account.createEmailPasswordSession(email,password)
//     return session;
//   } catch (err) {
//     throw err;
//   }
// };
// import { account } from '../appwrite/appwriteConfig';

// export const loginUser = async (email, password) => {
//   try {
//     const session = await account.createEmailSession(email, password);
//     return session;
//   } catch (err) {
//     throw err;
//   }
// };
import { account } from '../appwrite/appwriteConfig';

export const loginUser = async (email, password) => {
  try {
    // Log out if there's an active session
    try {
      await account.get(); // check if session exists
      await account.deleteSession('current'); // log out
    } catch {
      // no active session, do nothing
    }
    
    // Now create a new session
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (err) {
    throw err;
  }
};


