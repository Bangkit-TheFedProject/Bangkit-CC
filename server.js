const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const dotenv = require('dotenv');
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');

dotenv.config();
const serviceAccount = {
  private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
  bucket: process.env.FIREBASE_ADMIN_BUCKET_CS
};
 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const storage = new Storage({
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  credentials: {
    client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n')
  }
});

const bucket = storage.bucket(process.env.FIREBASE_ADMIN_BUCKET_CS); // Ganti dengan nama bucket yang sesuai
// console.log('Objek bucket:', bucket); // Tambahkan log ini setelah inisialisasi bucket di server.js

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
  });

  try {
    await server.register(Inert);
    server.route(require('./routes/routes'));

    await server.start();
    console.log('Server berjalan di', server.info.uri);

    return { server, db, storage, bucket }; // Mengembalikan objek yang berisi bucket
  } catch (err) {
    console.error('Terjadi kesalahan saat memulai server:', err);
    process.exit(1);
  }
};
 
init().catch((err) => {
  console.error(err);
  process.exit(1);
});

module.exports = {db, bucket};  