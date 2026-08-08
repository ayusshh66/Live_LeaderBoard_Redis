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

app.post("/leaderboard/add", async(req: Request,res :Response) => {

    const {player, score} = req.body;

    if(!player || !score){
        return res.status(400).json({error : `enter player name and score`})
    }

    try {

        const existingPlayer = await redis.zscore(LEADERBOARD_KEY, player);

        if(existingPlayer !== null){
            return res.status(400).json({message : "This player is already in the leaderboard"})
        }

        await redis.zadd(LEADERBOARD_KEY,score, player);

        return res.status(200).json({status : "success"})
        
    } catch (error) {
        return res.status(500).json({error : "internal server error"})
    }



})

app.listen(PORT, () =>{

    console.log(`Server is up and running on PORT : ${PORT}`);

})