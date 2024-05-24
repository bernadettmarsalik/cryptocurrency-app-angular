import { initializeApp } from "@angular/fire/app/firebase";

export const environment = {
  API_URL: 'https://rest.coinapi.io/v1/',
  API_KEY: '4E8C07B5-B5DA-4AC4-B8D4-3B9A9E2358B9',
};

const firebaseConfig = {
  apiKey: "AIzaSyAEDe3ay3RYZt-qiWu_dShFr2n-J_BEqRY",
  authDomain: "piggywallet-22950.firebaseapp.com",
  projectId: "piggywallet-22950",
  storageBucket: "piggywallet-22950.appspot.com",
  messagingSenderId: "581351356406",
  appId: "1:581351356406:web:9a804f190823b5708f39d7",
  measurementId: "G-F5YTETK2HK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
