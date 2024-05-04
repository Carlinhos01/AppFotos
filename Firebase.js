import {initializeApp} from "firebase/app";
import {getStorage} from "firebase/storage";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCvth69GkFep-nYpNdycXtj46EWUgY-tas",
    authDomain: "appfotos-8cef8.firebaseapp.com",
    projectId: "appfotos-8cef8",
    storageBucket: "appfotos-8cef8.appspot.com",
    messagingSenderId: "530247824569",
    appId: "1:530247824569:web:16e5cb8713975777501768"
  };
  
  const app = initializeApp(firebaseConfig);
  export const storage = getStorage(app);
  export const fire = getFirestore(app);