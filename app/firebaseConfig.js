import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDCkLY6bFRet3_MunpX_lcuWg-C3_x0XAE",
  authDomain: "planteki-f74bc.firebaseapp.com",
  projectId: "planteki-f74bc",
  storageBucket: "planteki-f74bc.firebasestorage.app",
  messagingSenderId: "562319773959",
  appId: "1:562319773959:web:8dcfb6b0e7b7f68282f5a2",
  measurementId: "G-JF3TVNS6W5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
