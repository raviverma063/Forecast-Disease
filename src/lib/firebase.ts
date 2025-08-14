
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "forecast-frontier-4i7ow",
  appId: "1:739990883833:web:da0acd6ece19f9a51e8128",
  storageBucket: "forecast-frontier-4i7ow.firebasestorage.app",
  apiKey: "AIzaSyCZl6SScpEvPYZa6a-UvsP_uQAd1NkuDdY",
  authDomain: "forecast-frontier-4i7ow.firebaseapp.com",
  messagingSenderId: "739990883833",
  measurementId: ""
};


const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
