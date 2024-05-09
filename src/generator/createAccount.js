import axios from 'axios';

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

export default (email, password) => new Promise(async (resolve) => {
    let appConfig = {
        apiKey: 'AIzaSyDP4SIjKaw6A4c-zvfYxICpbEjn1rRnN50',
        authDomain: 'shellshockio-181719.firebaseapp.com',
        databaseURL: 'https://shellshockio-181719.firebaseio.com',
        projectId: 'shellshockio-181719',
        storageBucket: 'shellshockio-181719.appspot.com',
        messagingSenderId: '68327206324'
    };

    let liveApp = initializeApp(appConfig);
    let app = getAuth(liveApp);

    onAuthStateChanged(app, async (user) => {
        if (!user) return;

        const sendRequest = () => axios.post('https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=' + appConfig.apiKey, {
            requestType: 'VERIFY_EMAIL',
            idToken: user.accessToken
        }).then(r => resolve(r.data)).catch(r => setTimeout(() => sendRequest(), Math.floor(Math.random() * 5000) + 1000));

        sendRequest();
    });

    await createUserWithEmailAndPassword(app, email, password);
});