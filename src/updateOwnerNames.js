const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require('./serviceAccountKey.json'))
});

const db = admin.firestore();
const auth = admin.auth();

async function updateItemsWithOwnerName() {
  const itemsRef = db.collection('items');
  const snapshot = await itemsRef.get();

  for (const doc of snapshot.docs) {
    const data = doc.data();
    // Only update if ownerName is missing and owner (UID) exists
    if (!data.ownerName && data.owner) {
      try {
        const userRecord = await auth.getUser(data.owner);
        const ownerName = userRecord.displayName || userRecord.email || 'Unknown';
        await doc.ref.update({ ownerName });
        console.log(`Updated item ${doc.id} with ownerName: ${ownerName}`);
      } catch (err) {
        console.error(`Failed to update item ${doc.id}:`, err.message);
      }
    }
  }
  console.log('Update complete!');
}

updateItemsWithOwnerName();
