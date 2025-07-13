import fs from "node:fs";
import { Request, Response } from "express"; 

export function loadFile(videoPath: string, req: Request, res: Response, contentType='video/mp4'){
    if(req.headers.connection === 'close'){
        res.sendFile(videoPath);
    }else{
        streamFile(videoPath, req, res, contentType);
    }
}




export function streamFile(path: string, req: Request, res: Response, contentType='video/mp4'){
    var videoPath = path;
    const range = req.headers.range as string;
    if(!range){
        res.status(400).send("Requires Range header");
    }


    const videoSize = fs.statSync(videoPath).size;

    let start = 0;
    let end = 1;
    
    if (!(range == "bytes=0-1")){
        const CHUNK_SIZE = 10**6;
        start = parseInt(range.split('=')[1].split('-')[0]);
        end = parseInt(range.split('-')[1]);
        
        if (Number.isNaN(end)){
            end = Math.min(start + CHUNK_SIZE, videoSize -1);
        }
    }

    const contentLength = end - start + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": contentType
    }
    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, { start, end });
    videoStream.pipe(res);
}
