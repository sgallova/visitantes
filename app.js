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

      await Visitor.findOne({'name': nombre}, function (err, result) {
        
        if (err) return handleError(err);

        if(result && nombre!=='Anónimo'){
           
         Visitor.updateOne({_id:result.id},{count: result.count+1}, function (err, result) {
            if (err) return handleError(err); 
        });

        }else if(!result || nombre==='Anónimo'){

            Visitor.create(
                {name:nombre, count:1}, function(err) {
                    if (err) return console.error(err)
                });
        } 
      });

      Visitor.find(function (err, resultado) {
        if (err) return handleError(err);
        resultado.forEach(element => {
            $tagValue+=`<tr><td>${element._id}</td><td>${element.name}</td><td>${element.count}</td></tr>`
        });

      res.send(`<table><tr><th>Id</th><th>Name</th><th>Visits</th></tr>${$tagValue}</table>`)

    });

});

app.listen(3000, () => console.log('Listening on port 3000!'));