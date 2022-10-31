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
//collections
const studentSchema = {
    id: String,
    name: String,
    batch: String,
    meals: Number,

  };
  
  const Student = mongoose.model("Student", studentSchema);
//meal const
var breakfast =0;
var lunch=0;
var snacks=0;
var dinnner=0;
app.get("/students/:id", function(req,res){
    console.log(req.params['id']);
    var idreq = req.params['id']; 
    Student.findOne({id: req.params['id']}, function(err, foundList){
        var ide = req.params['id'];
        if(!err){
            console.log(foundList);
            if(foundList.batch === "host"){
                
                var datetime = new Date();
                var hour = datetime.getHours();
                if((hour>6 && hour<9) && breakfast!=1){
                    res.send("authenticated");
                    breakfast=1;

                }else if((hour>11 && hour<15) && lunch!=1){
                    res.send("authenticated");
                    lunch=1;

                }else if((hour>15 && hour<17) && snacks!=1){
                    res.send("authenticated");
                    snacks = 1;

                }else if ((hour>19 && hour<21) && dinnner!=1){
                    res.send("authenticated");
                    dinnner = 1;

                }else{
                    res.send("you already purchased");
                }
                
            }else{
                    if(foundList.meals>0){
                    var meal = foundList.meals-1;
                    Student.findOneAndUpdate({id:ide},{meals:meal},function(err,result){
                        if(err){
                           res.send("authenticated");
                        }
                    });
                }else{
                    res.send("please recharge your nfc tag");
                }
            }
        }else{
            console.log(err);
        }
    });

});
app.get("/", function(req,res){
    res.render("index");
    
      const orderSchema={
        id:String,
        product: String,
        qty: String,
        orderNumber: String
      }
      const Order = mongoose.model("Order",orderSchema)
})



//listen
app.listen(process.env.PORT || 3000, function(req,res){
    console.log("server spin up in port 3000");
})
