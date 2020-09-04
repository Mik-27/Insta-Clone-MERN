const express = require('express')
      mongoose = require('mongoose')
      User = require('./models/user')
      Post = require('./models/post')
      require('dotenv').config()

const app = express();

// mongoose.connect("mongodb://localhost:27017/insta_clone", {
//     useNewUrlParser: true, 
//     useUnifiedTopology: true
// });

mongoose.connect(process.env.MONGOURI, {
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on('connected', ()=> {
    console.log('Connected to Mongo...')
})

mongoose.connection.on('error', (err)=> {
    console.log(err)
})

app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

app.get("/", (req, res) => {
    res.send("Hello");
});

app.listen(5000, ()=> {
    console.log("Server Running...");
});