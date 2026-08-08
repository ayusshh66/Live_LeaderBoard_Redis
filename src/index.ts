import express, {Request, Response} from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8000;

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
});

const LEADERBOARD_KEY = "leaderboard:ayush";



app.listen(PORT, () =>{

    console.log(`Server is up and running on PORT : ${PORT}`);

})