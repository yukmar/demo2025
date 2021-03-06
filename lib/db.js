import firebase from '@/lib/firebase';
const firestore = firebase.firestore();

export function updateUser(uid, data) {
  return firestore.collection('user').doc(uid).update(data);
}

export function createUser(uid, data) {
  console.log(data);
  return firestore
      .collection('users')
      .doc(uid)
      .set({uid, ...data}, {merge: true});
}

export function createFeedback(data) {
  return firestore.collection('feedback').add(data);
}
