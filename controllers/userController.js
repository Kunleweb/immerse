const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../starter/dev-data/data/tours-simple.json`));




exports.getAllusers = (req,res)=>{
    res.status(500).json({ status: 'error', 
        message: 'this route is not yet defined'})}

exports.getUser = (req,res)=>{
    res.status(500).json({ status: 'error', 
        message: 'this route is not yet defined'})}

exports.createUsers = (req,res)=>{
    res.status(500).json({ status: 'error', 
        message: 'this route is not yet defined'})}

exports.updateUser = (req,res)=>{
    res.status(500).json({ status: 'error', 
        message: 'this route is not yet defined'})}

exports.deleteUser = (req,res)=>{
    res.status(500).json({ status: 'error', 
        message: 'this route is not yet defined'})}


