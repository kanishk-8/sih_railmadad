// // src/pages/api/setAdmin.js
// import { auth } from "@/lib/firebaseAdmin";

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     const { uid } = req.body;

//     try {
//       await auth.setCustomUserClaims(uid, { admin: true });
//       res.status(200).json({ message: "Admin privileges assigned." });
//     } catch (error) {
//       console.error("Error setting custom claims:", error);
//       res.status(500).json({ error: "Failed to set admin privileges." });
//     }
//   } else {
//     res.status(405).json({ error: "Method not allowed" });
//   }
// }
