const mongoose = require("mongoose");

const contractsSchema = new mongoose.Schema({
   roomId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Room",
    required:true
   },
   startDate:{
    type:Date,
    default:Date.now,
    required:true
   },
   endDate:{
    type:Date,
    required:true
   },
   depositFee:{
    type:Number,
    required:true
   },
   rentFee:{
    type:Number,
    required:true
   },
   electricityFee:{
    type:Number,
    required:true
   },
   waterFee:{
    type:Number,
    required:true   
   },
   serviceFee:{
    type:Number,
    required:true
   },
   tenantId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Tenant",
    required:false
   },
   landlordId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Landlord",
    required:true
   },
   utilities: {
        electricity: {
            unitPrice: Number,
            initialReading: Number,
            currentReading: Number,
            lastUpdated: Date
        },
        water: {
            unitPrice: Number,
            initialReading: Number,
            currentReading: Number,
            lastUpdated: Date
        }
    },
    monthlyFees: [{
        month: Date,
        electricity: {
            previousReading: Number,
            currentReading: Number,
            units: Number,
            amount: Number
        },
        water: {
            previousReading: Number,
            currentReading: Number,
            units: Number,
            amount: Number
        },
        serviceFee: Number,
        total: Number,
        status: {
            type: String,
            enum: ['pending', 'paid'],
            default: 'pending'
        },
        paidAt: Date
    }],
    status: {
        type: String,
        enum: ['active', 'terminated', 'expired'],
        default: 'active'
    }
});
module.exports = mongoose.model("Contracts", contractsSchema)