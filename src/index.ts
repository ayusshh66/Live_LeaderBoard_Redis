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

//Adding player an score in leaderboard
app.post("/leaderboard/add", async(req: Request,res :Response) => {

    const payload = {
        player : req.body.player,
        score : Number(req.body.score)
    }

    if(!payload.player || !payload.score){
        return res.status(400).json({error : `enter player name and score`})
    }

    try {

        const existingPlayer = await redis.zscore(LEADERBOARD_KEY, payload.player); // posts score of a player

        if(existingPlayer !== null){
            return res.status(400).json({message : "This player is already in the leaderboard"})
        }

        await redis.zadd(LEADERBOARD_KEY, payload.score, payload.player);

        return res.status(200).json({status : "success"})
        
    } catch (error) {
        return res.status(500).json({error : "internal server error", cause : error})
    }



})

// increasing the score of a player in leaderboard
app.post("/leaderboard/increment", async(req:Request, res:Response) => {

    const payload = {
        player : req.body.player,
        score : Number(req.body.score),
    }

    try {

        if(payload.score < 0){
            return res.status(400).json({message : "you can only increase the score of a player"})
        }else {
            await redis.zincrby(LEADERBOARD_KEY, payload.score, payload.player); // adds score in exisiting score and can be negetive

        return res.status(200).json({message : "player score increased"})
        }
        
    } catch (error) {
        return res.status(500).json({error : "internal server error", message : error})
    }

})

// fetch the rank of player from leaderboard
app.get("/leaderboard/rank", async(req:Request, res:Response) => {

    const player = req.body.player;

    const exisitingPlayer = await redis.zscore(LEADERBOARD_KEY,player);

    if(exisitingPlayer == null){
        return res.status(400).json({error : `${player} does not exist in the leaderboard`})
    }

    if(!player){
        return res.status(400).json({error : "enter player name"})
    }

    
    try {

        const defaultRank = await redis.zrevrank(LEADERBOARD_KEY,player); // revrank means rank from reverse and redis starts from 0
        const rank = defaultRank? defaultRank+1 : 1; // redis starts from 0 thats why rank +1 ;

        return res.status(200).json({message : `The rank of ${player} is ${rank}`})
        
    } catch (error) {
        return res.status(500).json({error : "internal server error", message : error})
    }

})

// get all teh players in leaderboard by range from params
app.get("/leaderboard/top/:range", async(req: Request,res: Response) => {

    const paramsRange = Number(req.params.range);
    const range = paramsRange - 1;

    try {

        const data = await redis.zrevrange(LEADERBOARD_KEY,0,range, "WITHSCORES");

        return res.status(200).json({message : `the leader-board for top ${paramsRange} is : `, data})
        
    } catch (error) {
        return res.status(500).json({error : "internal server error", message : error})
    }
    

})

app.delete("/leaderboard/remove", async(req: Request,res: Response) => {

    const player = req.body.player;

    if(!player){
        return res.status(400).json({error : "enter player name"})
    }

    const exisitingPlayer = await redis.zscore(LEADERBOARD_KEY,player);

    if(exisitingPlayer == null){
        return res.status(400).json({error : `${player} does not exist in the leaderboard`})
    }

    try{

        await redis.zrem(LEADERBOARD_KEY,player);

        return res.status(200).json({message : `${player} has been removed from leaderboard`})

    }catch(error){
        return res.status(500).json({error : "internal server error", message : error})
    }

})

app.listen(PORT, () =>{

    console.log(`Server is up and running on PORT : ${PORT}`);

})