import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBi5bp_Udmic1scojCPjXsYomTKUhuwX9E",
  authDomain: "hemir-57272.firebaseapp.com",
  projectId: "hemir-57272",
  storageBucket: "hemir-57272.appspot.com",
  messagingSenderId: "1039407591834",
  appId: "1:1039407591834:web:db8568eb6266dc57e30a23",
  measurementId: "G-XQ69L4C7ZQ"
};


if (!firebase.apps.length){
firebase.initializeApp(firebaseConfig)
}
export { firebase }