import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set, update } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDsIoUrFdyyj7OhSAc09lfRChkc3IimUho",
  authDomain: "learning-bf767.firebaseapp.com",
  projectId: "learning-bf767",
  storageBucket: "learning-bf767.appspot.com",
  messagingSenderId: "832008327658",
  appId: "1:832008327658:web:fec534f7e29239de8f6293",
  measurementId: "G-WTKSKWF2M1"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database, ref, set, update };
