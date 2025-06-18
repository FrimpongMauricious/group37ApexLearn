// // utils/getAccessToken.js
// import { SignJWT } from 'jose';
// import axios from 'axios';
// import serviceAccount from '../apexbot-service-key.json';

// export const getAccessToken = async () => {
//   const iat = Math.floor(Date.now() / 1000);
//   const exp = iat + 3600;

//   const jwt = await new SignJWT({
//     iss: serviceAccount.client_email,
//     scope: 'https://www.googleapis.com/auth/dialogflow',
//     aud: serviceAccount.token_uri,
//     iat,
//     exp,
//   })
//     .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
//     .sign(importKey(serviceAccount.private_key));

//   const response = await axios.post(serviceAccount.token_uri, {
//     grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
//     assertion: jwt,
//   });

//   return response.data.access_token;
// };

// // Helper to parse the private key
// async function importKey(pem) {
//   const binaryDerString = atob(pem.replace(/-----.*?-----/g, '').replace(/\n/g, ''));
//   const binaryDer = new Uint8Array([...binaryDerString].map(c => c.charCodeAt(0)));
//   return await crypto.subtle.importKey(
//     'pkcs8',
//     binaryDer.buffer,
//     {
//       name: 'RSASSA-PKCS1-v1_5',
//       hash: 'SHA-256',
//     },
//     true,
//     ['sign']
//   );
// }
