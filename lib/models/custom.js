'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
/**
 * User Schema
 */
var CustomSchema = new Schema({
    vin:String,
    model:String,
    name: String,
    email:String,
    phone:String,
    notes:String
});
mongoose.model('Custom', CustomSchema);

var JobTypeSchema = new Schema({
    name:String,
    ratio:{ type: Number, default: 1 }
});
mongoose.model('JobType', JobTypeSchema);

/*
var MasterSchema = new Schema({
    name:String
});
mongoose.model('Master', MasterSchema);
*/


var JobNameSchema = new Schema({
    name:String,
    norma:Number,
    jobType: {type : Schema.ObjectId, ref : 'JobType'}
});

mongoose.model('JobName', JobNameSchema);


var JobTicketSchema = new Schema({
    balance: { type: Number, default: 0 },
    customer :{type : Schema.ObjectId, ref : 'Custom'},
    mile     :Number,
    date     : { type: Date, default: Date.now },
    dateClose:Date,
    resSum:Number,
    resPay:Number,
    worker:String,
    createByAPI:String,
    jobs:[{
        name: String,
        norma:Number,
        q:Number,
        jobType: {type : Schema.ObjectId, ref : 'JobType'},
        date:Date,
        worker:String,
        sum:Number,
      currency:String,
      incomeSum:Number,
      supplier:String,
      supplierType:Boolean,
    }],
    sparks:[{
        name:String,
        code:String,
        sku:String,
        price:Number,
        q:Number,
        shipPrice:Number,
        date:Date,
        incomePrice:Number,
        invoice:String,
        supplier:String,
        producer:String,
      status:Number,
        rn:String,
    }],
    pay:[{
        date:Date,
        val:Number
    }],
    payGrn:[{
        date:Date,
        val:Number
    }],
    payBank:[{
        date:Date,
        val:Number
    }],
    exchange:[{
        date:Date,
        debet:Number,
        credit:Number,
        debetCurrency:String,
        creditCurrency:String,
        rate:Number,
    }],

    text:String,
    rate:Number
});


mongoose.model('JobTicket', JobTicketSchema);


var JobTicketSchemaArch = new Schema({
    balance:Number,
    customer :{type : Schema.ObjectId, ref : 'Custom'},
    mile     :Number,
    date     : { type: Date, default: Date.now },
    dateClose: { type: Date, default: Date.now },
    resSum:Number,
    resPay:Number,
    worker:String,
    createByAPI:String,
    jobs:[{
        name: String,
        norma:Number,
        q:Number,
        jobType: {type : Schema.ObjectId, ref : 'JobType'},
        date:Date,
        worker:String,
        currency:String,
        sum:Number,
      incomeSum:Number,
      supplier:String,
      supplierType:Boolean,

    }],
    sparks:[{
        name:String,
        code:String,
        sku:String,
        price:Number,
        q:Number,
        shipPrice:Number,
        date:Date,
        incomePrice:Number,
        invoice:String,
        supplier:String,
        producer:String,
        account:Boolean,
      status:Number,
        rn:String,
    }],
    
    pay:[{
        date:Date,
        val:Number
    }],
    payGrn:[{
        date:Date,
        val:Number
    }],
    payBank:[{
        date:Date,
        val:Number
    }],
    exchange:[{
        date:Date,
        debet:Number,
        credit:Number,
        debetCurrency:String,
        creditCurrency:String,
        rate:Number,
    }],
    text:String,
    rate:Number

});


mongoose.model('JobTicketArch', JobTicketSchemaArch);

var WorkerSchema = new Schema({
    name:String,
    ratio:{ type: Number, default: 0.5 }
});
mongoose.model('Worker', WorkerSchema);


var LinkedJobSchema = new Schema({
    spark:{ type: String, index: true },
    jobs:[{
        job: {type : Schema.ObjectId, ref : 'JobName'},
        category: {type : Schema.ObjectId, ref : 'JobType'}
    }]
});
mongoose.model('LinkedJob', LinkedJobSchema);

