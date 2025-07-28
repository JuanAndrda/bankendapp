import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// Creates a user document in Firestore if it doesn't exist
export const createUserDocIfNotExists = async (user) => {
  if (!user) return;
  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      role: 'user', // default role
      createdAt: new Date()
    });
  }
}; 