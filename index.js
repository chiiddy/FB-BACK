import express from 'express'
import * as dotenv from 'dotenv'
import connectDB from './src/config/mongo.js'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import cors from 'cors'
import router from './src/routes/route.js'


dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  app.use("/api", router);

  async function connect() {
    try{
        app.listen(8000, () => {
            // connectDB(process.env.MONGODB_PASSWORD);
            connectDB('mongodb+srv://chidicolly11:Comfortanthony10@cluster0.hx4ygrl.mongodb.net/?retryWrites=true&w=majority');

            console.log("server is running on port 8000")
        });
    } catch (err) {
        console.log(err);
    }
  }
  connect ();

  // to generate jwt token
// import crypto from 'crypto'
// const secrectkeys = () => {
// const secrectkey = crypto.randomBytes(32).toString('hex');
// console.log(secrectkey);
// }
//  secrectkeys();