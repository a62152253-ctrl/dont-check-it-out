import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDoc
} from "firebase/firestore";
import { db, auth } from "../../../lib/firebase";
import { VaultRepository } from "./VaultRepository";
import type {  EncryptedSecretEntry, VaultConfig  } from "../types";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export class FirebaseVaultRepository implements VaultRepository {
  subscribeToEntries(
    uid: string,
    onUpdate: (entries: EncryptedSecretEntry[]) => void,
    onError: (err: Error) => void
  ): () => void {
    const path = "passwords";
    const q = query(
      collection(db, path),
      where("uid", "==", uid),
      orderBy("updatedAt", "desc")
    );

    return onSnapshot(
      q, 
      (snapshot) => {
        const records: EncryptedSecretEntry[] = [];
        snapshot.forEach((docSnap) => {
          records.push({ id: docSnap.id, ...docSnap.data() } as EncryptedSecretEntry);
        });
        onUpdate(records);
      },
      (err) => {
        console.warn("Firestore subscription error:", err);
        onError(err);
      }
    );
  }

  async saveEntry(
    uid: string,
    id: string | null,
    entry: Omit<EncryptedSecretEntry, "id" | "uid">
  ): Promise<string> {
    const path = "passwords";
    try {
      if (id) {
        const docRef = doc(db, path, id);
        await updateDoc(docRef, entry);
        return id;
      } else {
        const docRef = await addDoc(collection(db, path), {
          uid,
          ...entry
        });
        return docRef.id;
      }
    } catch (err) {
      handleFirestoreError(err, id ? OperationType.UPDATE : OperationType.CREATE, `${path}/${id || ''}`);
    }
  }

  async deleteEntry(id: string): Promise<void> {
    const path = "passwords";
    try {
      await deleteDoc(doc(db, path, id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${path}/${id}`);
    }
  }

  async updateFavoriteStatus(id: string, isFavorite: boolean): Promise<void> {
    const path = "passwords";
    try {
      const docRef = doc(db, path, id);
      await updateDoc(docRef, {
        isFavorite,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${path}/${id}`);
    }
  }

  async updateTrashStatus(id: string, isTrash: boolean): Promise<void> {
    const path = "passwords";
    try {
      const docRef = doc(db, path, id);
      await updateDoc(docRef, {
        isTrash,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${path}/${id}`);
    }
  }

  async getVaultConfig(uid: string): Promise<VaultConfig | null> {
    const path = "users";
    try {
      const userRef = doc(db, path, uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.vaultConfig) {
          return userData.vaultConfig as VaultConfig;
        }
      }
      return null;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `${path}/${uid}`);
    }
  }

  async saveVaultConfig(uid: string, config: VaultConfig | null): Promise<void> {
    const path = "users";
    try {
      const userRef = doc(db, path, uid);
      await updateDoc(userRef, {
        vaultConfig: config
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `${path}/${uid}`);
    }
  }

  async resetVault(uid: string, entries: EncryptedSecretEntry[]): Promise<void> {
    try {
      // 1. Delete all passwords documents
      const batchPromises = entries.map((entry) => 
        deleteDoc(doc(db, "passwords", entry.id!))
      );
      await Promise.all(batchPromises);

      // 2. Clear vaultConfig from user doc
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, {
        vaultConfig: null
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
    }
  }
}
