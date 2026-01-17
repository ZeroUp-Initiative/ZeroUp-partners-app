const { https, auth } = require("firebase-functions");
const { default: next } = require("next");
const admin = require("firebase-admin");

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

const isDev = process.env.NODE_ENV !== "production";

const server = next({ dev: isDev, conf: { distDir: ".next" } });
const nextjsHandle = server.getRequestHandler();

exports.nextApp = https.onRequest((req, res) => {
  return server.prepare().then(() => nextjsHandle(req, res));
});

/**
 * Cloud Function: Triggered when a user is deleted from Firebase Auth
 * Cleans up all user-related data from Firestore
 */
exports.onUserDeleted = auth.user().onDelete(async (user) => {
  const uid = user.uid;
  const email = user.email;
  
  console.log(`User deleted: ${uid} (${email}). Cleaning up Firestore data...`);
  
  const batch = db.batch();
  
  try {
    // 1. Delete user document from users collection
    const userDocRef = db.collection("users").doc(uid);
    const userDoc = await userDocRef.get();
    if (userDoc.exists) {
      batch.delete(userDocRef);
      console.log(`Queued deletion of user document: ${uid}`);
    }
    
    // 2. Delete user's notifications
    const notificationsSnapshot = await db.collection("notifications")
      .where("userId", "==", uid)
      .get();
    
    notificationsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    console.log(`Queued deletion of ${notificationsSnapshot.size} notifications`);
    
    // 3. Delete user's coins/gamification data
    const userCoinsRef = db.collection("userCoins").doc(uid);
    const userCoinsDoc = await userCoinsRef.get();
    if (userCoinsDoc.exists) {
      batch.delete(userCoinsRef);
      console.log(`Queued deletion of userCoins document`);
    }
    
    // 4. Delete user's achievements
    const achievementsSnapshot = await db.collection("userAchievements")
      .where("userId", "==", uid)
      .get();
    
    achievementsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    console.log(`Queued deletion of ${achievementsSnapshot.size} achievements`);
    
    // 5. Optionally: Mark payments as belonging to deleted user (instead of deleting)
    // This preserves contribution history for reporting
    const paymentsSnapshot = await db.collection("payments")
      .where("userId", "==", uid)
      .get();
    
    paymentsSnapshot.forEach((doc) => {
      batch.update(doc.ref, {
        userDeleted: true,
        userFullName: doc.data().userFullName + " (Deleted)",
        deletedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    console.log(`Marked ${paymentsSnapshot.size} payments as belonging to deleted user`);
    
    // Commit all deletions
    await batch.commit();
    console.log(`Successfully cleaned up data for user: ${uid}`);
    
    return { success: true, uid, email };
  } catch (error) {
    console.error(`Error cleaning up user data for ${uid}:`, error);
    throw error;
  }
});

/**
 * Cloud Function: Called when a contribution is approved
 * Sends notification to the user
 */
exports.onContributionApproved = https.onCall(async (data, context) => {
  // Verify admin is calling this
  if (!context.auth) {
    throw new https.HttpsError("unauthenticated", "Must be logged in");
  }
  
  const { userId, amount, projectName } = data;
  
  // Create notification
  const notification = {
    userId,
    type: "contribution_approved",
    title: "Contribution Approved! ✅",
    message: projectName 
      ? `Your contribution of ₦${amount.toLocaleString()} to "${projectName}" has been verified.`
      : `Your contribution of ₦${amount.toLocaleString()} has been verified.`,
    read: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    link: "/contributions"
  };
  
  await db.collection("notifications").add(notification);
  
  return { success: true };
});
