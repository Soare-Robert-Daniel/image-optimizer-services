import express from "express";
import bodyParser from "body-parser";
import db from './db'
import cors from 'cors'

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("DB has been cleared!")
// })

const app = express();

app.use(cors)
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  // res.status(200).json({
  //   message: "I am using babel in NodeJS - noice",
  //   status: "success",
  // });
  res.send('Hello World').end();
});

const PORT = process.env.PORT || 8500;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});
// const server = http.createServer(app)
// server.listen(PORT, )