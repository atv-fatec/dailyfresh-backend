import { getFirestore } from "firebase/firestore"
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage"
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.FB_KEY,
  authDomain: process.env.FB_DOMAIN,
  projectId: process.env.FB_PROJECTID,
  storageBucket: process.env.FB_BUCKET,
  messagingSenderId: process.env.FB_MESSAGING,
  appId: process.env.FB_APPID
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const authFirebase = getAuth(app)
export const storage = getStorage(app)
export const database = getDatabase(app)