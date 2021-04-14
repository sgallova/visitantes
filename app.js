const express= require('express');
const app = express();
const mongoose=require('mongoose');

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });
mongoose.connection.on("error", function(e) { console.error(e); });

var schema=mongoose.Schema({
    date:{type: Date, default: Date.now},
    name: String
});

var Visitor= mongoose.model("Visitor",schema);

app.get('/:name',(req,res) =>{
    let nombre = req.params.name || 'Anónimo';
    Visitor.create(
        {name:nombre}, function(err) {
            if (err) return console.error(err)
        });
   
    res.send('<h1>El visitante fue almacenado con éxito</h1>');
});

app.listen(3000, () => console.log('Listening on port 3000!'));