//packages
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { setFlagsFromString } = require("v8");
//connection
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
//database
mongoose.connect("mongodb+srv://ziyad:ziyad@cluster0.qzthgrr.mongodb.net/?retryWrites=true&w=majority/studentsDB",{useNewUrlParser: true});
//routes
app.get("/students/:id", function(req,res){
    console.log(req.params['id']);
    Student.findOne({id: req.params['id']}, function(err, foundList){
        if(!err){
            console.log(foundList);
        }else{
            console.log(err);
        }
    });

});
app.get("/", function(req,res){
    res.render("index");
    const studentSchema = {
        id: String,
        name: String,
        batch: String,
        meals: String,

      };
      
      const Student = mongoose.model("Student", studentSchema);
      const orderSchema={
        id:String,
        product: String,
        qty: String,
        orderNumber: String
      }
      const Order = mongoose.model("Order",orderSchema)
})



//listen
app.listen(3000, function(req,res){
    console.log("server spin up in port 3000");
})
