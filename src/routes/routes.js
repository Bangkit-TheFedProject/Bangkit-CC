const userController = require('../controller/userController');
const EggDetectedController = require('../controller/EggDetectedController');
const { bucket }  = require('../server.js');


const routes = [
  {
    method: 'POST',
    path: '/register',
    handler: userController.register,
  },
  {
    method: 'POST',
    path: '/login',
    handler: userController.login,
  },
  {
    method: 'GET',
    path: '/get-eggs-by-date-range-user',
    handler: EggDetectedController.getEggsByDateRangeUser,
  },
  {
    method: 'POST',
    path: '/add-egg-detected/{userId}',
    handler: (request, h) => {
      EggDetectedController.addEggDetected(request, h, bucket)
      return h.response({ message: 'Request berhasil' }).code(200);
    },
      options: {
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true,
      },
    },
  },
  {
    method: 'GET',
    path: '/get-eggs-by-phase/{phase}',
    handler: EggDetectedController.getEggsByPhase,
  },
  {
    method: 'GET',
    path: '/get-eggs-by-fertilization/{fertilizationStatus}',
    handler: EggDetectedController.getEggsByFertilization,
  },
  {
    method: 'GET',
    path: '/get-egg-by-id/{eggId}',
    handler: EggDetectedController.getEggsById,
  },
  {
    method: 'GET',
    path: '/api/users',
    handler: userController.apiuser,
  },
  // {
  //   method: 'POST',
  //   path: '/upload-image-and-update-firestore/{userId}',
  //   handler: EggDetectedController.saveImageToStorage
  // }
];

module.exports = routes;