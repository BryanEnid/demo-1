// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// ! BryanEnid97@gmail.com
// const firebaseConfig = {
//   apiKey: "AIzaSyCsTyQ4pDo8YdamQSV4gbgAsrLcJwpMkG4",
//   authDomain: "observe-pwa.firebaseapp.com",
//   projectId: "observe-pwa",
//   storageBucket: "observe-pwa.appspot.com",
//   messagingSenderId: "739038573394",
//   appId: "1:739038573394:web:bf037fa7f31efdf2a3c08b",
//   measurementId: "G-SSC04E6R17",
// };

const firebaseConfig = {
	apiKey: 'AIzaSyAoHRD5Y_qq6PtrcWDwRbRJ5ooVbr1Xu38',
	authDomain: 'observe-93479.firebaseapp.com',
	projectId: 'observe-93479',
	storageBucket: 'observe-93479.appspot.com',
	messagingSenderId: '720749345099',
	appId: '1:720749345099:web:a68f0b9300e7b9743350ce',
	measurementId: 'G-9H9M4JBRDN'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
