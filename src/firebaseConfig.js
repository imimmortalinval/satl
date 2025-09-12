import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDDevY0SGtLu1Nq3sy8RMXzjkfqZomVoEM",
  authDomain: "satlab-a52bc.firebaseapp.com",
  projectId: "satlab-a52bc",
  storageBucket: "satlab-a52bc.firebasestorage.app",
  messagingSenderId: "995932897857",
  appId: "1:995932897857:web:0bf381e86f43d21b95fcc0",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
