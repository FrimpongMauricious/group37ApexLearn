// import { account } from '../appwrite/appwriteConfig';

// export const registerUser = async (email, password, name) => {
//   try {
//     const result = await account.create('unique()', email, password, name);
//     return result;
//   } catch (err) {
//     throw err;
//   }
// };
import { account, Client, ID } from '../appwrite/appwriteConfig';

export const registerUser = async (email, password, name) => {
  try {
    const result = await account.create('unique()', email, password, name);
    return result;
  } catch (err) {
    throw err;
  }
};
