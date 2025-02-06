import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";


const firebaseConfig = {

  apiKey: "AIzaSyDBNO3PaIuoXwHArEoWye1q4rWnwq0kerw",
  authDomain: "clone-3a332.firebaseapp.com",
  projectId: "clone-3a332",
  storageBucket: "clone-3a332.appspot.com",
  messagingSenderId: "120430690516",
  appId: "1:120430690516:web:4ea222ba6aa1b20f093b41",
  measurementId: "G-ZVEYFGVEBN"

};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();

export {db, auth};
