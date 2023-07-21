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
const MongoDBSession = require("connect-mongodb-session")(session);
const PORT = process.env.PORT || 3500;

app.use("/uploads/paintings", express.static(__dirname + "/uploads/paintings"));
app.use("/uploads/blog", express.static(__dirname + "/uploads/blog"));
app.use(express.static("public"));

app.use(cors({ credentials: true, origin: "https://vitbeta.onrender.com" }));

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGOURL);

/*
const store = new MongoDBSession({
  uri: process.env.MONGOURL,
  collection: "mySessions",
});

app.use(
  session({
    secret: "aslkjdsalksjdkajsd",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
*/
/*
middleware to get to authorized pages
const isAuth = (req, res, next) => {
  if(req.session.isAuth){
    next()
  }else{
    res.status(404).json('isAuth doesnt exist')
  }
}
*/

// Middleware to verify JWT so use it!
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};


app.get("/", (req, res) => {
  const cookies = req.cookies;
  res.json({ cookies, message: "jedu" }); 
});

app.post("/register", async (req, res) => {
  const { name, password, email } = req.body;
  try {
    const duplicateName = await User.findOne({ name });
    if (duplicateName)
      return res.status(409).json({ message: "duplicate name" });

    const duplicateEmail = await User.findOne({ email });
    if (duplicateEmail)
      return res.status(409).json({ message: "duplicate email" });

    await User.create({
      name,
      password: bcrypt.hashSync(password, 10),
      email,
    });

    res.status(201).json({ message: "user created" });
  } catch (err) {
    return res.status(400).json({ message: "bad request" });
  }
});

app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  const userDoc = await User.findOne({ name });

  if (!userDoc) return res.status(404).json("user doesnt exist");

  const legitPassword = bcrypt.compareSync(password, userDoc.password);

  if (legitPassword) {
    JWT.sign(
      { name, id: userDoc._id, role: userDoc.role },
      process.env.ACCESS_TOKEN_SECRET,
      { },
      (err, token) => {
        if (err) return res.status(500).json("internal error");
        localStorage.setItem("token",token)
        console.log(localStorage.getItem("token"))
        res.cookie("token", token, { maxAge: 10 * 24 * 60 * 60 * 1000}).status(200).json({ name, id: userDoc._id});
      }
    );
  } else {
    res.status(400).json("wrong credentials");
  }
});

app.post('/islloged',(req,res) => {
//const { token } = req.cookies;
const token = localStorage.getItem("token")
if(!token) return res.status(401).json("unauthorized")
  const userDoc = JWT.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, info) => {
      if (err) return res.status(400).json(err.message);
   
        return res.status(200).json({name: info.name, role :info.role});      
    }
  );

})



app.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    const { name, password, _id } = user;
    const payload = {
      name,
      password,
    };

    const token = JWT.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "900s",
    });

 
    const result = `${_id}/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MYEMAIL,
        pass: process.env.APPPASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MYEMAIL,
      to: email,
      subject: "password reset",
      text: `click on the link below to reser your password:\r\r https://vitbeta.onrender.com/passwordreset/${result}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        res.send("error" + err);
      } else {
        console.log("Email sent: " + info.response);
        res.status(200).json("email sent");
      }
    });
  } else {
    res.status(404).json("email not found");
  }
});

app.post("/passwordreset", async (req, res) => {
  const { newPassword, id} = req.body;
  const token = localStorage.getItem("token")
  const verify = JWT.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, verified) => {
      if (err) return res.status(401).json(err.message);

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: "user not found" });
      }

      const hashedPWD = bcrypt.hashSync(newPassword, 10);
      await user.updateOne({ password: hashedPWD });
      res.status(200).json({ message: "success", password: newPassword, user });
    }
  );
});

app.post("/logout", (req, res) => {
  /*
  req.session.destroy((err) => {
    if(err) console.log(err)
  })
  */
  res.cookie("token", "").json("logout success")
  localStorage.clear()
 // res.json("logout success");
});

app.post("/checkrole", (req, res) => {
  //const { token } = req.cookies;
  const token =localStorage.getItem("token")
  const userDoc = JWT.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, info) => {
      if (err) return res.status(400).json(err.message);
      if (info.role === "admin") {
        return res.status(200).json("ok");
      }
      return res.status(403).json("forbidden");
    }
  );
});

app.post("/postpainting", uploadPaintings.array("file"), async (req, res) => {
  const Items = [];

  req.files.map((file) => {
    const { originalname, path } = file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    Items.push(path + "." + ext);
  });

  //const { token } = req.cookies;
  const token =localStorage.getItem("token")
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, async (err, info) => {
    if (err) throw err;
    const { title, body, year, serie, additionalInfo } = req.body;
    const postPics = await PaintingsModel.create({
      title,
      body,
      serie,
      year,
      cover: Items[0],
      bigCover: Items[1],
      additionalCover: Items[2] ? Items[2] : null,
      additionalInfo,
      author: info.id,
    });
    res.json(postPics);
  });
});

app.get("/getpaintings", async (req, res) => {
  const result = await PaintingsModel.find();
  if (result) {
    res.status(200).json(result);
  } else {
    res.status(500).json({ message: "nic tam neni" });
  }
});

app.get("/downloadpaintings", (req, res) => {
  //const { token } = req.cookies;
  const token =localStorage.getItem("token")
  const verify = JWT.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, info) => {
      if (err) return res.status(403).json("forbidden");

      const filePath = path.join(__dirname, "public", "docs", "Vit.rar");
      const fileName = "Vit.rar";
      res.download(filePath, fileName, (err) => {
        if (err) {
          return res.status(500).json("internal error");
        } else {
          console.log("file downloaded successfully");
        }
      });
    }
  );
});

app.post("/getsinglepainting", async (req, res) => {
  try {
    const { id } = req.body;
    const result = await PaintingsModel.findById(id);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post("/contact", (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(500).json("internal error");
  }

  fs.appendFile(
    path.join(__dirname, "records", "emails"),
    `\"${email}\",`,
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("email saved");
      }
    }
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: process.env.MYEMAIL,
      pass: process.env.APPPASSWORD,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.MYEMAIL,
    subject: subject,
    text: `message:\r ${message} \r\r\r send by:\r ${email}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      res.send("error" + err);
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).json("success");
    }
  });
});

app.post("/postblog", uploadBlog.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const ext = parts[parts.length - 1];
  const newPath = path + "." + ext;
  fs.renameSync(path, newPath);

  //const { token } = req.cookies;
  const token =localStorage.getItem("token")
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, async (err, info) => {
    if (err) return res.status(500).json("internal error");
    const { title, text } = req.body;
    const postBlog = await Blog.create({
      title,
      text,
      picture: newPath,
      author: info.id,
    });
    res.json(postBlog.comments);
  });
});

app.get("/getblogposts", async (req, res) => {
  const result = await Blog.find();
  res.json(result);
});

app.post("/getsinglepost", async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(500).json("internal error");
  const result = await Blog.findById(id);
  if (!result) return res.status(500).json("internal error");
  res.status(200).json(result);
});

app.post("/postcomment", async (req, res) => {

  const newComment = req.body[0].newComment;
  const id = req.body[1].id;
  //const { token } = req.cookies;
  const token =localStorage.getItem("token")
  console.log("Request Cookies:", req.cookies);
  try {
    // Verify the token and get the user information
    const decodedToken = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const name = decodedToken.name;

    const result = await Blog.findById(id);
    const numberOfComments = result.comments.filter((comment) => comment.name === name);
    const maxNumber = numberOfComments.length;

    if (maxNumber >= 5) {
      return res.status(403).json("limit exceeded");
    }

    result.comments.push({ name, comment: newComment });
    await result.save();

    res.status(201).json("comment saved");
  } catch (err) {
    return res.status(401).json(`unauthorized ${err}  ${token}`);
  }
  /*
  const newComment = req.body[0].newComment;
  const id = req.body[1].id;
  const { token } = req.cookies;

  const credentials = JWT.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, info) => {
      if (err) return res.status(401).json(`unauthorized ${err}  ${token}`);
      const name = info.name;
      const result = await Blog.findById(id);
      const numberOfComments = result.comments.map(
        (comment) => comment.name === name
      );
      const maxNumber = numberOfComments.filter((obj) => obj).length;
      if (maxNumber >= 5) return res.status(403).json("limit exceeded");
      result.comments.push({ name, comment: newComment });
      await result.save();
      res.status(201).json("comment saved");
    }
  );*/
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
