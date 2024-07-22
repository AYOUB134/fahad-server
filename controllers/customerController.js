const Customer = require('../models/Customer');
const moment = require('moment');

// Convert a date string to a JavaScript Date object, supporting both DD/MM/YYYY and ISO formats
const convertToDate = (dateString) => {
    const date = moment(dateString, ['DD/MM/YYYY', moment.ISO_8601], true).toDate();
    return isNaN(date) ? null : date;
};

// Add Customer Controller
const addCustomer = async (req, res) => {
    try {
        // Log the incoming request data
        console.log('Incoming Request Data:', req.body);

        const {
            saleDate,
            name,
            contactNumber,
            fatherName,
            nation,
            CNICNumber,
            permanentAddress,
            businessAddress,
            sellingItemName,
            model,
            horsePowers,
            color,
            engineNumber,
            chamberNumber,
            totalPayment,
            advancePayment,
            specialDue,
            totalMonths
        } = req.body;

        const saleDateMoment = convertToDate(saleDate);
        if (!saleDateMoment) throw new Error('Invalid saleDate format');

        // Calculate the total special dues amount
        const totalSpecialDueAmount = specialDue.reduce((acc, due) => acc + due.amount, 0);

        // Calculate the remaining payment excluding special dues
        const remainingPayment = totalPayment - advancePayment - totalSpecialDueAmount;

        // Calculate per month installment amount
        const perMonthInstallment = remainingPayment / totalMonths;

        // Generate installments
        let installments = [];
        for (let i = 0; i < totalMonths; i++) {
            const installmentDate = moment(saleDateMoment).add(i + 1, 'months').format('DD/MM/YYYY');
            const installmentDateMoment = convertToDate(installmentDate);
            if (!installmentDateMoment) throw new Error(`Invalid date format for installment ${i + 1}`);
            installments.push({
                date: installmentDateMoment,
                amount: perMonthInstallment,
                status: false
            });
        }

        const customer = new Customer({
            saleDate: saleDateMoment,
            name,
            contactNumber,
            fatherName,
            nation,
            CNICNumber,
            permanentAddress,
            businessAddress,
            sellingItemName,
            model,
            horsePowers,
            color,
            engineNumber,
            chamberNumber,
            totalPayment,
            advancePayment,
            specialDue: specialDue.map(due => {
                const dueDateMoment = convertToDate(due.dueDate);
                if (!dueDateMoment) throw new Error(`Invalid date format for special due`);
                return {
                    amount: due.amount,
                    dueDate: dueDateMoment,
                    status: due.status
                };
            }),
            totalMonths,
            perMonthInstallment,
            installments,
            customerClear: false
        });

        // Log the customer data before saving
        console.log('Customer Data to be Saved:', customer);

        await customer.save();
        res.status(201).json(customer);
    } catch (error) {
        // Log the error details
        console.error('Error adding customer:', error);
        res.status(500).json({ error: error.message });
    }
};

// Update Customer Controller
const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Update the customer with the provided fields
        const customer = await Customer.findByIdAndUpdate(id, updateData, { new: true });

        if (!customer) {
            return res.status(404).json({ msg: 'Customer not found' });
        }

        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Installments Controller
const updateInstallments = async (req, res) => {
    try {
        const { id } = req.params;
        const { installments } = req.body;

        // Validate input
        if (!Array.isArray(installments)) {
            return res.status(400).json({ msg: 'Invalid installments format' });
        }

        // Find the customer by ID
        const customer = await Customer.findById(id);

        if (!customer) {
            return res.status(404).json({ msg: 'Customer not found' });
        }

        // Update installments
        customer.installments = customer.installments.map(inst => {
            const update = installments.find(upd => new Date(upd.date).toISOString() === new Date(inst.date).toISOString());
            return update ? { ...inst, ...update } : inst;
        });

        await customer.save();
        res.json(customer);
    } catch (error) {
        console.error('Error updating installments:', error);
        res.status(500).json({ error: error.message });
    }
};


// Update Special Dues Controller
const updateSpecialDues = async (req, res) => {
    try {
        const { id } = req.params;
        const { specialDue } = req.body;

        if (!Array.isArray(specialDue)) {
            return res.status(400).json({ msg: 'Invalid special due format' });
        }

        const customer = await Customer.findById(id);

        if (!customer) {
            return res.status(404).json({ msg: 'Customer not found' });
        }

        customer.specialDue = customer.specialDue.map(due => {
            const update = specialDue.find(upd => new Date(upd.dueDate).toISOString() === new Date(due.dueDate).toISOString());
            return update ? { ...due, ...update } : due;
        });

        await customer.save();
        res.json(customer);
    } catch (error) {
        console.error('Error updating special dues:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get Customer by ID Controller
const getCustomerById = async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await Customer.findById(id);

        if (!customer) {
            return res.status(404).json({ msg: 'Customer not found' });
        }

        // Convert date fields to DD/MM/YYYY format
        customer.saleDate = moment(customer.saleDate).format('DD/MM/YYYY');
        customer.installments = customer.installments.map(installment => ({
            ...installment,
            date: moment(installment.date).format('DD/MM/YYYY')
        }));
        customer.specialDue = customer.specialDue.map(due => ({
            ...due,
            dueDate: moment(due.dueDate).format('DD/MM/YYYY')
        }));

        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Customers Controller
const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Patch Customer Controller
const patchCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const customer = await Customer.findByIdAndUpdate(id, updateData, { new: true });

        if (!customer) {
            return res.status(404).json({ msg: 'Customer not found' });
        }

        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    addCustomer,
    updateCustomer,
    updateInstallments,
    updateSpecialDues,
    getCustomerById,
    getAllCustomers,
    patchCustomer
};
