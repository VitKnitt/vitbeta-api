const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const multer = require("multer");
const uploadPaintings = multer({ dest: "uploads/paintings" });
const uploadBlog = multer({ dest: "uploads/blog" });
const User = require("./models/User");
const Blog = require("./models/Blog");
const PaintingsModel = require("./models/PaintingsModel");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
//const MongoDBSession = require("connect-mongodb-session")(session);
const PORT = process.env.PORT || 3500;


const indexPage = require('./routes/general/indexPage')
const register = require('./routes/userActions/register')
const login = require('./routes/userActions/login')
const isLogged = require('./routes/userActions/isLogged')
const forgotPassword = require('./routes/userActions/forgotPassword')
const passwordReset = require('./routes/userActions/passwordReset')
const logout = require('./routes/userActions/logout')
const checkRole = require('./routes/userActions/checkRole')
const postPainting = require('./routes/paintings/postPaintings')
const getPaintings = require("./routes/paintings/getPaintings")
const downloadPaintings = require('./routes/paintings/downloadPaintings')
const singlePainting = require('./routes/paintings/singlePainting')
const contact = require('./routes/contact/contact')
const postBlog = require('./routes/blog/postBlog')
const blogposts = require('./routes/blog/blogPosts')
const singlePost = require('./routes/blog/singlePost')
const postComment = require('./routes/blog/postComment')


app.use("/uploads/paintings", express.static(__dirname + "/uploads/paintings"));
app.use("/uploads/blog", express.static(__dirname + "/uploads/blog"));
app.use(express.static("public"));
/*app.use(express.static(path.join(__dirname, 'client/public')));*/


//const allowedPages = ['http://localhost:3000', 'https://vitbeta.onrender.com', 'https://www.edgetale.com']



//app.use(cors({ origin: ['http://localhost:3000', 'https://vitbeta.onrender.com', 'https://www.edgetale.com'], credentials: true }))
//app.use(cors({ origin: 'https://vitbeta.onrender.com', credentials: true }))


/*
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  const allowedOrigins = ['http://localhost:3000', 'https://vitbeta.onrender.com', 'https://www.edgetale.com'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
  next();
});
*/


/*
app.use(cors({ 
  origin: (origin, callback) => {
    const isAllowedPages = allowedPages.includes(origin);
    const allowPage = isAllowedPages ? origin : false;
    callback(null, allowPage);
  },  
  credentials: true }));
*/

const allowedPages = ['http://localhost:3000', 'https://vitbeta.onrender.com', 'https://www.edgetale.com'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests without an origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);

    const isAllowedPages = allowedPages.includes(origin);
    const allowPage = isAllowedPages ? origin : false;
    callback(null, allowPage);
  },
  credentials: true
}));

// Define your routes and other middleware here

// Handle preflight requests (OPTIONS) for all routes
app.options('*', cors());




app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGOURL);


// Middleware to verify JWT so use it!
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

//--------general--------//

app.use('/',indexPage)

//--------user actions--------//

app.use('/register',register)

app.use('/login',login)

app.use('/islogged',isLogged)

app.use('/forgotpassword',forgotPassword)

app.use('/passwordreset/:id/:token',passwordReset)

app.use('/logout',logout)

app.use('/checkrole',checkRole)

//--------paintings--------//

app.use('/postpainting',uploadPaintings.array("file"),postPainting)

app.use('/getpaintings',getPaintings)

app.use('/downloadpaintings',downloadPaintings)

app.use('/getsinglepainting',singlePainting)

//--------contact--------//

app.use('/contact',contact)

//--------blog--------//

app.use('/postblog',uploadBlog.single("file"),postBlog)

app.use('/getblogposts',blogposts)

app.use('/getsinglepost',singlePost)

app.use('/postcomment',postComment)

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
