import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Replace with your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC-V84kYPWQb0GjZXE9QRZvpWj0qIzfY3I",
    authDomain: "group1-sapo.firebaseapp.com",
    projectId: "group1-sapo",
    storageBucket: "group1-sapo.appspot.com",
    messagingSenderId: "839212361736",
    appId: "1:839212361736:web:946995926607472da789bd",
    measurementId: "G-Z7DBBTGJGX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
