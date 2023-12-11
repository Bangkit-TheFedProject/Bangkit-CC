const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');

const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const storage = new Storage({
  projectId: 'avid-lock-405816',
  credentials: require('./serviceAccountKey.json')
});

const bucket = storage.bucket('avid-lock-405816.appspot.com'); // Ganti dengan nama bucket yang sesuai
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