const express = require('express');
const {
    addCustomer,
    updateCustomer,
    updateInstallments,
    updateSpecialDues,
    getCustomerById,
    getAllCustomers
} = require('../controllers/customerController');

const router = express.Router();

router.post('/add', addCustomer);
router.get('/', getAllCustomers);
router.patch('/update/:id', updateCustomer); // Handles general updates
router.patch('/update/installments/:id', updateInstallments); // Handles installment updates
router.patch('/update/specialdues/:id', updateSpecialDues); // Handles special due updates
router.get('/:id', getCustomerById);

module.exports = router;
