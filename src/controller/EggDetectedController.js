// const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../server.js');
const { Storage } = require('@google-cloud/storage');


const EggDetectedController = {

    //ENDPOINT API MENGAMBIL DATA TELUR DARI RENTANG TANGGAL TERTENTU / HANYA SATU TANGGAL TERTENTU BERDASARKAN USERID
    async getEggsByDateRangeUser(request, h) {
        try {
            const { startDate, endDate, date, userId } = request.query;

            if ((startDate && endDate) && !date) {
                // Date range query
                const startDateTime = new Date(startDate);
                const endDateTime = new Date(endDate);
                endDateTime.setDate(endDateTime.getDate() + 1); // Increment by 1 day for inclusive end

                const eggsRef = db.collection('Egg-detected');
                const snapshot = await eggsRef
                    .where('detectionTimestamp', '>=', startDateTime)
                    .where('detectionTimestamp', '<', endDateTime) // Less than the day after endDate
                    .where('userId', '==', userId)
                    .get();

                const eggs = [];
                snapshot.forEach((doc) => {
                    const eggData = doc.data();
                    const fertilizationStatus = eggData.fertilization ? 'Fertil' : 'Infertil';
                    const egg = {
                        detectionTimestamp: eggData.detectionTimestamp.toDate(),
                        fertilization: fertilizationStatus,
                        phase: eggData.phase,
                        imageUrl: eggData.imageUrl,
                        userId: eggData.userId
                    };
                    eggs.push(egg);
                });

                return {
                    status: 'success',
                    eggs,
                };
            } else if (date && !startDate && !endDate) {
                // Single date query
                const dateTime = new Date(date);
                const nextDay = new Date(dateTime);
                nextDay.setDate(nextDay.getDate() + 1); // Next day from the given date

                const eggsRef = db.collection('Egg-detected');
                const snapshot = await eggsRef
                    .where('detectionTimestamp', '>=', dateTime)
                    .where('detectionTimestamp', '<', nextDay) // Less than the next day
                    .where('userId', '==', userId)
                    .get();

                const eggs = [];
                snapshot.forEach((doc) => {
                    const eggData = doc.data();
                    const fertilizationStatus = eggData.fertilization ? 'Fertil' : 'Infertil';
                    const egg = {
                        detectionTimestamp: eggData.detectionTimestamp.toDate(),
                        fertilization: fertilizationStatus,
                        phase: eggData.phase,
                        imageUrl: eggData.imageUrl,
                        userId: eggData.userId
                    };
                    eggs.push(egg);
                });
                return {
                    status: 'success',
                    eggs,
                };
            } else {
                return h.response({ error: 'Parameter tidak valid' }).code(400);
            }
        } catch (error) {
            console.error('Error fetching eggs:', error);
            return h.response({ error: 'Gagal mengambil data telur' }).code(500);
        }
    },

    // ENDPOINT API MENAMBAHKAN IMAGES KE CLOUD STORAGE (PADA COLLECTION EGG_DETECTED) BERDASARKAN USERID
    async addEggDetected(request, h, bucket) {
        try {
            console.log('Bucket status:', bucket);
            const { detectionTimestamp, label } = request.payload;
            const { userId } = request.params;
            const { images } = request.payload;

            // Pengecekan apakah bucket telah diinisialisasi dengan benar sebelum digunakan
            // if (!bucket) {
            //     console.error('Bucket initialization failed.');
            //     return h.response({ error: 'Bucket initialization failed.' }).code(500);
            // }
            // if (!images) {
            //     return h.response('No file uploaded').code(400);
            // }

            const imageBuffer = images._data;
            const fileName = images.hapi.filename;

            const uniqueFileName = uuidv4() + '_' + fileName;
            const gcsFileName = `images/${userId}/${uniqueFileName}`;
            // console.log('gcsFileName:', gcsFileName); 
            // console.log('Value of bucket:', bucket);
            const stream = bucket.file(gcsFileName).createWriteStream({
                metadata: {
                  contentType: images.hapi.headers['content-type'],
                },
            });

            stream.on('error', (err) => {const storage = new Storage({
                projectId: 'avid-lock-405816',
                credentials: require('./serviceAccountKey.json')
              });
                console.error(err);
                return h.response({ error: 'Gagal mengunggah file' }).code(500);
            });

            stream.on('finish', async () => {
                const imageUrl = `https://storage.googleapis.com/${bucket.name}/${gcsFileName}`;

                const newEgg = {
                    detectionTimestamp: new Date(Date.parse(detectionTimestamp)),
                    // fertilization: fertilization,
                    // phase: phase,
                    label: label,
                    userId: userId,
                    imageUrl: imageUrl,
                };

                await db.collection('Egg-detected').add(newEgg);

                return h.response({
                    status: 'success',
                    message: 'Data telur baru berhasil ditambahkan',
                    imageUrl: imageUrl,
                }).code(200);
            });

            stream.end(imageBuffer);
        } catch (error) {
            console.error(error);
            return h.response({ error: 'Gagal menambahkan data telur baru' }).code(500);
        }
    },



    // ENDPOINT API Mengambil Data Telur berdasarkan fase yang ditentukan
    async getEggsByPhase(request, h) {
        try {
            const { phase } = request.params;

            const eggsRef = db.collection('Egg-detected');
            const snapshot = await eggsRef.where('phase', '==', phase).get();

            const eggs = [];
            snapshot.forEach((doc) => {
                const eggData = doc.data();
                const fertilizationStatus = eggData.fertilization ? 'Fertil' : 'Infertil';
                // Manipulasi data sesuai kebutuhan
                const egg = {
                    document_id: doc.id,
                    detectionTimestamp: eggData.detectionTimestamp,
                    fertilization: fertilizationStatus,
                    // pixels: eggData.pixels,
                    phase: eggData.phase,
                    userId: eggData.userId,
                };
                eggs.push(egg);
            });

            return {
                status: 'success',
                eggs,
            };
        } catch (error) {
            return h.response({ error: 'Gagal mengambil data telur berdasarkan phase' }).code(500);
        }
    },

    // ENDPOINT API Mengambil Data Telur berdasarkan fertilization yang ditentukan
    async getEggsByFertilization(request, h) {
        try {
            const { fertilizationStatus } = request.params;

            const eggsRef = db.collection('Egg-detected');
            const snapshot = await eggsRef.where('fertilization', '==', (fertilizationStatus === 'Fertil')).get();

            const eggs = [];
            snapshot.forEach((doc) => {
                const eggData = doc.data();
                const fertilizationStatus = eggData.fertilization ? 'Fertil' : 'Infertil';
                // Manipulasi data sesuai kebutuhan
                const egg = {
                    id: doc.id,
                    detectionTimestamp: eggData.detectionTimestamp,
                    fertilization: fertilizationStatus,
                    // pixels: eggData.pixels,
                    // phase: eggData.phase,
                    userId: eggData.userId,
                };
                eggs.push(egg);
            });

            return {
                status: 'success',
                eggs,
            };
        } catch (error) {
            return h.response({ error: 'Gagal mengambil data telur berdasarkan fertilization' }).code(500);
        }
    },

    // ENDPOINT API Mendapatkan Data Telur berdasarkan Id Document
    async getEggsById(request, h) {
        try {
            const { eggId } = request.params;

            const eggRef = db.collection('Egg-detected').doc(eggId);
            const doc = await eggRef.get();

            if (!doc.exists) {
                return h.response({ error: 'Dokumen telur tidak ditemukan' }).code(404);
            }

            const eggData = doc.data();
            const fertilizationStatus = eggData.fertilization ? 'Fertil' : 'Infertil';
            const egg = {
                id: doc.id,
                detectionTimestamp: eggData.detectionTimestamp,
                fertilization: fertilizationStatus,
                // pixels: eggData.pixels,
                phase: eggData.phase,
                userId: eggData.userId,
            };

            return {
                status: 'success',
                egg,
            };
        } catch (error) {
            return h.response({ error: 'Gagal mengambil data telur berdasarkan ID' }).code(500);
        }
    },

};

module.exports = EggDetectedController;