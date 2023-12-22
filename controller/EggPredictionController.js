const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const Path = require('path');
const tf = require('@tensorflow/tfjs-node');
const sharp = require('sharp');
const { bucket } = require('../server.js');
const { db } = require('../server.js');
const admin = require('firebase-admin');

const modelLocation = Path.join(__dirname, "../model/tfjs_model");
const imgSaveLocation = Path.join(__dirname, '/uploaded-img');

// Fungsi untuk menyimpan gambar ke Cloud Storage
async function saveImageToStorage(imagePath, imageName, userId, bucket) {
    const customDestination = `images/${userId}/${imageName}`; // Mengubah customDestination sesuai dengan kebutuhan bucket
    await bucket.upload(imagePath, {
        destination: customDestination, // Nama file untuk disimpan di Cloud Storage
    });

    console.log(`Gambar berhasil diunggah ke Cloud Storage dengan nama ${customDestination}`);
}

const EggPredictionController = {
    async predict(request, h) {
        try {
            const userId = request.payload.userId;
            const label = request.payload.label;
            const data = request.payload.image; // Data unggahan file dari request

            if (!data || !data.path) {
                return h.response('File tidak ditemukan').code(400);
            }

            const filePath = data.path;
            const imgBuffer = await sharp(filePath).resize(224, 224).raw().toBuffer();
            const uint8Array = new Uint8Array(imgBuffer);
            const normalizedArray = Array.from(uint8Array).map((value) => value / 255);
            const tensorGambar = tf.tensor(normalizedArray, [224, 224, 3]);

            const model_json = Path.join(modelLocation, "/model.json");
            const model = await tf.loadGraphModel(`file://${model_json}`);

            const className = ['Pertengahan', 'Tahap Akhir', 'Tahap Awal', 'Telur Mati'];

            try {
                const hasilPrediksi = model.predict(tensorGambar.expandDims(0)).squeeze().arraySync();
                const totalProbabilitas = hasilPrediksi.reduce((total, probabilitas) => total + probabilitas, 0);

                const prediksi = hasilPrediksi.map((probabilitas, index) => ({
                    kelas: className[index],
                    probabilitas: (probabilitas / totalProbabilitas) * 100 // Menghitung persentase probabilitas
                }));
                // Simpan gambar ke Cloud Storage
                const imageName = `gambar_${userId}_${Date.now()}.jpg`; // Nama unik untuk gambar
                await saveImageToStorage(filePath, imageName, userId, bucket);
                // URL Gambar di cloud storage
                const customDestination = `images/${userId}/${imageName}`; // Menggunakan kembali customDestination yang sudah didefinisikan di fungsi sebelumnya
                const imageURL = `https://storage.googleapis.com/${bucket.name}/${customDestination}`; // Menggunakan customDestination yang sudah disesuaikan
                // Buat ID dokumen yang unik
                const timestamp = Date.now(); // Waktu saat ini
                const docId = `${userId}_${timestamp}`;
                // Ubah timestamp menjadi format tanggal yang lebih mudah dibaca
                const date = new Date(timestamp);
                const formattedDate = date.toLocaleString(); // Ubah ke format tanggal yang dapat dibaca manusia
                // Simpan hasil prediksi ke Firestore
                const predictionRef = db.collection('Egg-detected').doc(docId);
                await predictionRef.set({
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                    phase: prediksi,
                    imageURL: imageURL,
                    label: label,
                    userId: userId
                });
                // Balas respons dengan hasil prediksi dan URL gambar di Cloud Storage
                return h.response({ timestamp: formattedDate, phase: prediksi, imageURL, userId: userId, label: label });
            } catch (error) {
                console.error('Terjadi kesalahan dalam proses prediksi:', error);
            }
        } catch (error) {
            console.error(error);
            return h.response('Terjadi kesalahan dalam pemrosesan file').code(500);
        }
    }
}

module.exports = EggPredictionController;
