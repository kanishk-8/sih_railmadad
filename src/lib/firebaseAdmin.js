// // lib/firebaseAdmin.js
// import admin from "firebase-admin";

// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert(
//       JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
//     ),
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   });
// }

// const auth = admin.auth();
// export { auth };
