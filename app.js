var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));


//app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.get('/hello', (req, res, next) => {
  res.render('index', {title: "world"});
})



let harry = {
  name: "Harry Potter",
  profile: "Harry Potter is the boy who live. He defeated Voldemort when he was only a year old by deflecting the killing curse",
  picture: "https://upload.wikimedia.org/wikipedia/en/d/d7/Harry_Potter_character_poster.jpg"
}
let alex = {
  name: "Alex Shapiro",
  profile: "Alex Shapiro is a senior majoring in Computer Science and Applied Mathematics. He began learning computer science when he was in 10th grade. He hopes to teach math and computer science in a high school one day.",
  picture: "https://static.wixstatic.com/media/0752c4_a38f845890ca48018261198e22ed1646~mv2.png/v1/crop/x_0,y_171,w_472,h_472/fill/w_544,h_544,al_c,lg_1,q_85,enc_auto/Screen%20Shot%202019-12-05%20at%201_14_13%20PM.png"
}
let ninad = {
  name : "Ninad Chaudhari",
  profile: "Ninad Chaudhari is the TA for ICSI 418Y. He knows a ton about computer science. He has been a TA at UAlbany for many years, and was one of the TAs for ISCI 213 in spring 2020.",
  picture: "https://avatars.githubusercontent.com/u/1305825?v=4"
}

let students = [ harry, alex, ninad]


app.get('/', (req, res, next) => {
  res.render(    'studentProfile'   ,    {  students: students  }     );
});


// *****************************************************************************
// db Operations
// *****************************************************************************
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017/';
//const url = 'mongodb://myuser:mypassword@mongo:27017/'; 
//  GET THE HOSTNAME, username & password & the DB name from environment vars. 
// Example: console.log(process.env.NODE_ENV);

const dbName = 'magicWorld';
const client = new MongoClient(url);

app.get('/db', async function(req, res, next) {
  try {
    
    const studentsCopy = JSON.parse(JSON.stringify(students));
    // Try removing this! Can you answer why a deep copy is required here? 
    // What happens if same wizards array is used?

    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('students');
    
    const insertResult = await collection.insertMany(studentsCopy);
  
    console.log('Inserted documents =>', insertResult);

    const findResult = await collection.find({}).toArray();
    //res.send(findResult);
    res.render('studentProfile', {students: findResult});

  } catch (error) {
    console.log(error);
    next(error)
  } finally {
    client.close()
  }
  
});

// *****************************************************************************
// *****************************************************************************

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
