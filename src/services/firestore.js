import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "../firebase.js";

function getUserDocument(uid) {
  return doc(
    db,
    "users",
    uid,
    "projectMinusZero",
    "main",
  );
}

export async function saveCloudData(uid, data) {
  if (!uid) {
    return;
  }

  const userDocument = getUserDocument(uid);

  await setDoc(
    userDocument,
    {
      project: data.project ?? {},
      transactions: Array.isArray(data.transactions)
        ? data.transactions
        : [],
      updatedAt: serverTimestamp(),
    },
    {
      merge: true,
    },
  );
}

export function subscribeCloudData(
  uid,
  onData,
  onEmpty,
  onError,
) {
  if (!uid) {
    return () => {};
  }

  const userDocument = getUserDocument(uid);

  return onSnapshot(
    userDocument,
    (snapshot) => {
      if (!snapshot.exists()) {
        onEmpty();
        return;
      }

      const cloudData = snapshot.data();

      onData({
        project: cloudData.project ?? {},
        transactions: Array.isArray(
          cloudData.transactions,
        )
          ? cloudData.transactions
          : [],
      });
    },
    onError,
  );
}