const express = require('express');
const path = require('path');
const fs= require ('fs');
const app = express();
let session = require('express-session');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
  session({
    secret: 'my-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);
const books = [
  { title: 'Lord of the Flies' , link : 'flies'},
  { title: 'The Grapes of Wrath' , link : 'grapes' },
  { title: 'Leaves of Grass' , link : 'leaves'},
  { title: 'The Sun and Her Flowers' , link : 'sun' },
  { title: 'Dune' , link :'dune' },
  { title: 'To Kill a Mockingbird' , link : 'mockingbird' },
];

fs.writeFileSync('books.json', JSON.stringify(books), 'utf8');



const users = 'users.json'
let registered
try {
  registered = JSON.parse(fs.readFileSync(users))
} catch (err) {
  registered = []
}

function addBookToReadlist(req,booktitle) {
  const loggedInUsername = req.session.username;

  const user = registered.find((user) => user.username === loggedInUsername);
  const read = user.readlist.find((b) => b === booktitle)
  if(!read){
    user.readlist.push(booktitle);
    req.session.readlist.push(booktitle);
  }

  fs.writeFileSync(users, JSON.stringify(registered));
}


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/home',function(req,res){
  if(req.session.username)
    res.render('home')
  else
    res.redirect('/')
});
app.get('/',function(req,res){
  res.render('login')
});
app.get('/novel',function(req,res){
  if(req.session.username)
    res.render('novel')
  else
    res.redirect('/')
});
app.get('/poetry',function(req,res){
  if(req.session.username)
    res.render('poetry')
  else
    res.redirect('/')
});
app.get('/fiction',function(req,res){
  if(req.session.username)
    res.render('fiction')
  else
    res.redirect('/')
});
app.get('/dune',function(req,res){
  if(req.session.username)
    res.render('dune')
  else
    res.redirect('/')
});
app.post("/dune", function(req, res) {
  const {book} = req.body;
  if(book) {
    addBookToReadlist(req, book);
    res.render('dune')
  }

});
app.get('/mockingbird',function(req,res){
  if(req.session.username)
    res.render('mockingbird')
  else
    res.redirect('/')
});
app.post("/mockingbird", function(req, res) {
  const {book} = req.body;
  if(book) {
    addBookToReadlist(req, book);
    res.render('mockingbird')
  }

});
app.get('/flies',function(req,res){
  if(req.session.username)
    res.render('flies')
  else
    res.redirect('/')
});
app.post("/flies", function(req, res) {
  const {book} = req.body;
  if(book) {
    addBookToReadlist(req, book);
    res.render('flies')
  }

});

app.get('/grapes',function(req,res){
  if(req.session.username)
    res.render('grapes')
  else
    res.redirect('/')
});
app.post("/grapes", function(req, res) {
  const {book} = req.body;
  if(book) {
    addBookToReadlist(req, book);
    res.render('grapes')
  }

});
app.get('/leaves',function(req,res){
  if(req.session.username)
    res.render('leaves')
  else
    res.redirect('/')
});
app.post("/leaves", function(req, res) {
  const {book} = req.body;
  if(book) {
    addBookToReadlist(req, book);
    res.render('leaves')
  }
});

app.get('/registration',function(req,res){
  res.render('registration')
});
app.get('/sun',function(req,res){
  if(req.session.username)
    res.render('sun')
  else
    res.redirect('/')
});
app.post("/sun", function(req, res) {
  const {book} = req.body;
  if(book) {
    addBookToReadlist(req, book);
    res.render('sun')
    
  }

});

app.get('/searchresults',function(req,res){
  if(req.session.username)
    res.render('searchresults')
  else
    res.redirect('/')
});

app.use(bodyParser.json());

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.send({
      error: 'Username and password are required'
    });
  }

  if (registered.find(u => u.username === username)) {
    return res.send({
      error: 'Username already exists'
    });
  }

  const user = {
    username,
    password,
    readlist:[]
  };
  registered.push(user);
  fs.writeFileSync(users, JSON.stringify(registered))
  res.redirect('/');


});





app.post('/', (req, res) => {
  const { username, password } = req.body;

  const user = registered.find(u => u.username === username && u.password === password);

  if (user) {
      req.session.username=user.username
      req.session.readlist=user.readlist
      res.redirect('/home');

  } else {
    res.send({
      error: 'Wrong Username or Password'
    });
  }
});

app.get('/readlist',(req,res) => {
  if(req.session.username){
    console.log(req.session.readlist)
    res.render('readlist',{readlist : req.session.readlist})
  }
  else
    res.redirect('/')
})

const bookdata = JSON.parse(fs.readFileSync('books.json', 'utf8'));

app.post('/search', (req, res) => {
  const {Search} = req.body;
  const searchResults = bookdata.filter(book => book.title.toLowerCase().includes(Search.toLowerCase()));
  if(searchResults!=0)
    res.render('searchresults', { searchResults });
  else{
    res.send({
      error:'book not found'
    })
  }
});



if(process.env.PORT){
  app.listen(process.env.PORT,function(){console.log('Server started')});
}
else{
  app.listen(3000,function(){console.log('Server started on port 3000')});
}



