const express= require('express');
const app = express();
const mongoose=require('mongoose');

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });
mongoose.connection.on("error", function(e) { console.error(e); });

var schema=mongoose.Schema({
    name: String,
    count:{type: Number, default:0}
});

var Visitor= mongoose.model("Visitor",schema);

app.get('/', async (req,res) =>{

    let $tagValue;
    let nombre = req.query.name || 'Anónimo';

    try{
      const visitante= await Visitor.findOne({'name': nombre});

      if(visitante && nombre!=='Anónimo'){
          await Visitor.updateOne({_id:visitante.id},{count: visitante.count+1});
      }else if(!visitante || nombre==='Anónimo'){
          await Visitor.create({name: nombre, count: 1});
      } 
     
      const resultado= await Visitor.find();
        resultado.forEach(element => {
            $tagValue+=`<tr><td>${element._id}</td><td>${element.name}</td><td>${element.count}</td></tr>`
        });

        res.send(`<table><thead><tr><th>Id</th><th>Name</th><th>Visits</th></tr></thead>${$tagValue}</table>`)

    }catch(err){
      console.error(err);
    }

});

app.listen(3000, () => console.log('Listening on port 3000!'));