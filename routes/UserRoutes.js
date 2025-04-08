// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const login = require('../middleware/login');
const RolesController = require('../controllers/RolesController');

router.get('/', login.obrigatorio, UserController.getAllUsers);
router.post('/', login.obrigatorio, UserController.salvar);
router.put('/:id', login.obrigatorio, UserController.atualizar);
router.delete('/:id', login.obrigatorio, UserController.delete);
// Outros endpoints para outras operações CRUD

router.get('/roles', login.obrigatorio, RolesController.getAllRoles);
router.get('/users-roles', login.obrigatorio, RolesController.getAllUsersRoles);
router.get('/roles/:id', login.obrigatorio, RolesController.getRolesUserById);

router.post('/login', UserController.login);
router.post('/refresh-token', UserController.refreshToken);

module.exports = router;


