const admin = require('firebase-admin');
const axios = require('axios');
const serviceAccount = require('../serviceAccountKey.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
const { db } = require('../server.js');
const UserController = {

     //ENDPOINT API REGISTER
     async register(request, h) {
        try {
            const { email, password, displayName } = request.payload;
            // Buat pengguna baru di Firebase Authentication
            const newUser = await admin.auth().createUser({
                email: email,
                password: password,
                displayName: displayName
            });

            // Tambahkan informasi pengguna ke Firestore
            const userDocRef = db.collection('users').doc(newUser.uid);
            await userDocRef.set({
                email: email,
                displayName: displayName,
            });

            return {
                status: 'success',
                message: 'Pengguna berhasil didaftarkan dan informasi pengguna ditambahkan ke Firestore'
            };
        } catch (error) {
            console.error('Error:', error);
            return h.response({ error: 'Gagal mendaftarkan pengguna atau menambahkan informasi pengguna ke Firestore' }).code(500);
        }
    },

    //ENDPOINT API LOGIN
    async login(request, h) {
        try {
            const { email, password } = request.payload;

            const firebaseAuthURL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=
        AIzaSyChTv4I5oaxL-wnJl5FqFP5kJVah5XDoxs`;
            const requestBody = {
                email: email,
                password: password,
                returnSecureToken: true
            };

            const response = await axios.post(firebaseAuthURL, requestBody);
            const userData = response.data;

            return {
                status: 'success',
                message: 'Login berhasil',
                user: {
                    idToken: userData.idToken,
                    userId: userData.localId,
                    email: userData.email,
                    displayName: userData.displayName
                }
            };
        } catch (error) {
            console.error('Error:', error);
            return h.response({ error: 'Login gagal, email atau password tidak valid' }).code(401);
        }
    },

    async apiuser(request, h) {
    try {
        // Registrasi ekstensi ke dalam server
        // await server.register(loggingExtension);

        const snapshot = await db.collection('users').get();
        const data = snapshot.docs.map(doc => doc.data());

        return data;
      } catch (error) {
        return h.response({ error: 'Gagal mengambil data users' }).code(500);
      }
    },

};

module.exports = UserController;