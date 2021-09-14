import * as firebase from 'firebase'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDUyd5krJWnlV5UIXUuV66da6zLK_3bCTk",
    authDomain: "seniordesignminiproject-8b95f.firebaseapp.com",
    projectId: "seniordesignminiproject-8b95f",
    storageBucket: "seniordesignminiproject-8b95f.appspot.com",
    messagingSenderId: "107579648655",
    appId: "1:107579648655:web:f260c4f3b5b8969d741efa"
};

if (firebase.apps.length == 0) {
    firebase.initializeApp(firebaseConfig)
}

export const db = firebase.firestore()