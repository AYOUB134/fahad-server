const mongoose = require('mongoose');

const installmentSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    amount: { type: Number, default: 0 },
    status: { type: Boolean, default: false }
});

const specialDueSchema = new mongoose.Schema({
    amount: Number,
    dueDate: Date,
    status: { type: Boolean, default: false }
});

const customerSchema = new mongoose.Schema({
    saleDate: { type: Date, required: true },
    name: { type: String, required: true },
    contactNumber: { type: String, required: true },
    fatherName: { type: String, required: true },
    nation: { type: String, required: true },
    CNICNumber: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    businessAddress: String,
    sellingItemName: { type: String, required: true },
    model: { type: String, required: true },
    horsePowers: { type: Number, required: true },
    color: { type: String, required: true },
    engineNumber: { type: String, required: true },
    chamberNumber: { type: String, required: true },
    totalPayment: { type: Number, required: true },
    advancePayment: { type: Number, required: true },
    specialDue: { type: [specialDueSchema], default: [] },
    totalMonths: { type: Number, required: true },
    perMonthInstallment: { type: Number, required: true },
    installments: { type: [installmentSchema], default: [] },
    customerClear: { type: Boolean, default: false }
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
