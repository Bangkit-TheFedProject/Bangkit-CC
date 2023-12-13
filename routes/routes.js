const userController = require('../controller/userController');
const EggDetectedController = require('../controller/EggDetectedController');
const { bucket } = require('../server.js');

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
    method: 'DELETE',
    path: '/deleteuser/{userId}',
    handler: userController.deleteUser,
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
    method: 'PUT',
    path: '/updateEggById/{eggId}',
    handler: EggDetectedController.updateEggById,
  },
  {
    method: 'DELETE',
    path: '/deleteEggById/{eggId}',
    handler: EggDetectedController.deleteEggById,
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
];

module.exports = routes; 