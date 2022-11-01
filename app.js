//packages
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { setFlagsFromString } = require("v8");
var id;
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
//orders
const orderSchema ={
    username:String,
    item: String,
    qty: Number
}
const Order = mongoose.model("Order",orderSchema);
const orderManagerSchema ={
    id:String,
    name:String,
    item: String,
    qty: Number
}
const OrderMan = mongoose.model("OrderMan",orderManagerSchema);
//stocks
const stockSchema = {
    itemId:String,
    itemName:String,
    price: Number,
    stock: Number

}
const Stock = mongoose.model("Stoke",stockSchema);
const studentSchema = {
    id: String,
    name: String,
    batch: String,
    meals: Number,

  };
  
  const Student = mongoose.model("Student", studentSchema);
//meal const
var breakfast =1;
var lunch=1;
var snacks=1;
var dinnner=1;
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
                var date = "1"+"/"+month+"/"+year;
                var hour = datetime.getHours();
                console.log(date)
                if((hour > 6 && hour < 9)){
                    if(breakfast == 1){
                    breakfast=0;
                  Bill.findOne({id:idreq} && {date:date},function(err,foundlist){
                    if(foundlist == null){
                        console.log("hi");
                        const bill = new Bill({
                            id:idreq,
                            name:foundList.name,
                            date:date,
                            breakfast:"yes",
                            lunch:"",
                            dinner:"",
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
                }else{
                    res.render("auth",{text:"You already purchased your food"});
                }
                    

                }else if((hour > 9 && hour < 15)){
                    if(lunch == 1){
                    lunch=0;
                    Bill.findOne({id:idreq} && {date:date},function(err,foundlist){
                        if(foundlist == null){
                            const bill = new Bill({
                                id:idreq,
                                name:foundList.name,
                                date:date,
                                breakfast:"",
                                lunch:"yes",
                                dinner:"",
                                amount:135
                            })
                            bill.save(function(err){
                                if(!err){
                                    res.render("auth",{text:"Authenticated"});
                                }
                            });
                        }else{
                            Bill.findOneAndUpdate({id: idreq} && {date:date},{lunch:"yes"},function(err,result){
                                console.log("meals")
                                if(!err){
                                    res.render("auth",{text:"Authenticated"});
                                }
                            }) 
                        }

                      })
                    }else{
                        res.render("auth",{text:"You already purchased your food"});
                    }
                        

                }else if((hour > 15 && hour < 19)){
                    if(snacks == 1){
                    res.render("auth",{text:"Authenticated"});
                    snacks = 0;
                    }else{
                        res.render("auth",{text:"You already purchased your food"});

                    }

                }else if ((hour > 19)){
                    if(dinnner == 1){
                    
                    dinnner = 0;
                    Bill.findOne({id:idreq},function(err,foundlist){
                        if(foundlist == null){
                            const bill = new Bill({
                                id:idreq,
                                name:foundList.name,
                                date:date,
                                breakfast:"",
                                lunch:"",
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
app.get("/jj", function(req,res){
    res.render("index");
    
      
})

app.get("/kitchen", function(req,res){
    Order.find({},function(err, orders){
        console.log(orders)
        res.render("kitchen",{orders:orders})
    })
    
    
    

});
app.post("/kitchen", function(req,res){
    checked = req.body.checkbox;
    Order.findByIdAndRemove(checked, function(err){
        if (!err) {
          console.log("Successfully deleted checked item.");
          res.redirect("/kitchen");
        }
      });
})
//manager
app.get("/manager9099091092910912090912",function(req,res){
    Stock.find({},function(err,found){
        res.render("manager",{stokes:found});

    })
})
app.get("/managerlog", function(req,res){
    res.render("managerlogin",{text:""});

    
   
})
app.post("/auth",function(req,res){
    if(req.body.email === "admin"){
        if(req.body.password === "admin"){
            res.redirect("/manager9099091092910912090912")
        }else{
            res.render("managerlogin",{text:"Invalid Creditionals"});
            

        }
    }else{
        res.render("managerlogin",{text:"Invalid Creditionals"});

    }
})
app.post("/addItem", function(req,res){
    res.render("edit",{type:"Add"})
})
app.post("/itemadd", function(req,res){

    const stock = new Stock({
        itemId:req.body.id,
        itemName:req.body.name,
        price:req.body.price,
        stock: req.body.stock
    })
    stock.save(function(err){
        if(!err){
            res.redirect("/manager9099091092910912090912")
        }
    });
})
app.post("/manager", function(req,res){
    if(req.body.delete=== undefined){
        Stock.findOne({_id:req.body.edit},function(err,found){
            console.log(found)
            res.render("editcopy",{sid:found._id,id:found.itemId,name:found.itemName,price:found.price,stokes:found.stock});
        })
        
        
    }else if(req.body.edit === undefined){
        Stock.findByIdAndRemove(req.body.delete, function(err){
            if (!err) {
              console.log("Successfully deleted checked item.");
              res.redirect("/manager9099091092910912090912");
            }
          });
    }

})
app.post("/edit",function(req,res){
    console.log(req.body);
    Stock.findOneAndUpdate({_id:req.body.edit},{itemId:req.body.id,name:req.body.name,price:req.body.price,stock:req.body.stock},function(err,result){
        if(!err){
           res.redirect("/manager9099091092910912090912");
        }
    });

})
app.get("/billing", function(req,res){
    res.render("billing");
})
app.post("/billing", function(req,res){
    Bill.find({id:req.body.id}, function(err,result){
        console.log(result)
        res.render("billing-1",{orders:result})
    })
})
app.get("/sales", function(req,res){
res.render("sales");
})
//listen
app.listen(process.env.PORT || 3000, function(req,res){
    console.log("server spin up in port 3000");
})
