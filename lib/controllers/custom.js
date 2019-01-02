'use strict';



var mongoose = require('mongoose'),
    async = require('async')
    ,Customer = mongoose.model('Custom');

var _ = require('underscore');

var ObjectId = require('mongoose').Types.ObjectId;

exports.list= function(req, res,nex) {

    Customer.find().exec(function(err, result) {
        if (err)  return next(err);
        return res.json(result)
    })
}
exports.get= function(req, res,next) {
    Customer.findById(req.params.id,function (err, result) {
        if (err) return next(err);
        res.json(result);
    });

}

exports.add= async function(req, res,next) {

    if (req.query.update){
        let arr = req.query.update.split(' ');
        let newVal ={};
        for (var i= 0,l=arr.length;i<l;i++){
            if (req.body[arr[i]]){newVal[arr[i]]= req.body[arr[i]];} else {console.log('нет - ',arr[i])}
        }
        //console.log('newVal',newVal);
        let invoice = await Customer.findOne({_id:req.body._id}).lean().exec();
        //console.log(invoice)
        Customer.update({_id:req.body._id},{$set:newVal}, function (err,result) {
            if (err) return  next(err)
            console.log(result);
            res.json({id:req.body._id})
        });


    } else {
        console.log(req.body);
        //req.body.filters=JSON.stringify(req.body.filters);
        //console.log(req.body.filters);
//http://stackoverflow.com/questions/7267102/how-do-i-update-upsert-a-document-in-mongoose
//How do I update/upsert a document in Mongoose?
        var stuff = new Customer(req.body);

        var upsertData = stuff.toObject();
        console.log(upsertData);
        delete upsertData._id;
        Customer.update({_id: stuff.id}, upsertData, {upsert: true}, function (err) {
            if (err) return next(err);
            // saved!
            res.json({});
        })
    }



}

exports.delete = function(req,res,next){
    Customer.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send(200);
    })
}

