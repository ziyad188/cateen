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
mongoose.connect("mongodb+srv://ziyad:ziyad@cluster0.qzthgrr.mongodb.net/studentsDB?retryWrites=true&w=majority",{useNewUrlParser: true});
//routes
//collections
//admin portal
const adminSchema ={
    username: String,
    password: String
};
const Admin = mongoose.model("Admin",adminSchema);
//food hostler bill
const hostlerSchema = {
    id: String,
    name:String,
    date:String,
    breakfast: String ,
    lunch: String,
    dinner: String,
    amount: String
}
const Bill = mongoose.model("Bill",hostlerSchema);
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
     
    Student.findOne({id: req.params['id']}, function(err, foundList){
        var idreq = req.params['id'];
        if(!err){
            console.log(foundList);
            if(foundList.batch === "hostler"){
                
                var datetime = new Date();
                console.log(datetime.getDay());
                var day = datetime.getDate();
                var month = datetime.getMonth();
                var year = datetime.getFullYear();
                var date = day+"/"+month+"/"+year;
                var hour = datetime.getHours();
                
                if((hour>6 && hour<9) && breakfast == 0){
                    breakfast=1;
                  Bill.findOne({id:idreq} && {date:date},function(err,foundlist){
                    if(foundlist == null){
                        const bill = new Bill({
                            id:idreq,
                            name:foundList.name,
                            date:date,
                            breakfast:"yes",
                            amount:135
                        })
                        bill.save(function(err){
                            if(!err){
                                res.render("auth",{text:"Authenticated"});
                            }
                        });
                    }else{
                        Bill.findOneAndUpdate({id: idreq},{breakfast:"yes"},function(err,result){
                            if(!err){
                                res.render("auth",{text:"Authenticated"});
                            }
                        }) 
                    }
                  })
                    

                }else if((hour>9 && hour<15) && lunch == 0){
                    lunch=1;
                    Bill.findOne({id:idreq} && {date:date},function(err,foundlist){
                        if(foundlist == null){
                            const bill = new Bill({
                                id:idreq,
                                name:foundList.name,
                                date:date,
                                lunch:"yes",
                                amount:135
                            })
                            bill.save(function(err){
                                if(!err){
                                    res.render("auth",{text:"Authenticated"});
                                }
                            });
                        }else{
                            Bill.findOneAndUpdate({id: idreq} && {date:date},{lunch:"yes"},function(err,result){
                                if(!err){
                                    res.render("auth",{text:"Authenticated"});
                                }
                            }) 
                        }
                      })
                        

                }else if((hour>15 && hour<19) && snacks == 0){
                    res.render("auth",{text:"Authenticated"});
                    snacks = 1;
                   

                }else if ((hour>19 ) && dinnner ==0){
                    
                    dinnner = 1;
                    Bill.findOne({id:idreq},function(err,foundlist){
                        if(foundlist == null){
                            const bill = new Bill({
                                id:idreq,
                                name:foundList.name,
                                date:date,
                                dinner:"yes",
                                amount:135
                            })
                            bill.save(function(err){
                                if(!err){
                                    res.render("auth",{text:"Authenticated"});
                                }
                            });
                        }else{
                            Bill.findOneAndUpdate({id: idreq},{dinner:"yes"},function(err,result){
                                if(!err){
                                    res.render("auth",{text:"Authenticated"});
                                }
                            }) 
                        }
                      })
                        
                }else{
                    res.render("auth",{text:"You already purchased your food"});
                }

                
            }else{
                    if(foundList.meals>0){
                    var meal = foundList.meals-1;
                    Student.findOneAndUpdate({id:idreq},{meals:meal},function(err,result){
                        if(!err){
                           res.render("auth",{text:"Authenticated"});
                        }
                    });
                }else{
                    res.render("auth",{text:"Please recharge your wallet"});
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
