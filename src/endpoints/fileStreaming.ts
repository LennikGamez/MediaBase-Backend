import { Application, Response, Request } from "express"; 
import fs from "node:fs";

import { fileOfTypes, fileSecurityCheck, parseLanguageFromFile, absolutePath, VIDEO_FORMATS, AUDIO_FORMATS, SUBTITLE_FORMATS } from "../helpers/fileoperations"; 
import { loadFile } from "../streaming"; 

export function registerStreamingEndpoints(appHandle: Application){
  // ENDPOINT?file=Filme/Antigone/Antigone[GER].mp4
  appHandle.get("/stream", (req: Request, res: Response)=>{
    // Filme/Antigone/Antigone[GER].mp4
    const {file}= req.query;

    if(!fileOfTypes(file as string, VIDEO_FORMATS.concat(AUDIO_FORMATS))) {
      res.status(403).send("This file format is not supported by this endpoint...");
      return;
    }
    if (!fileSecurityCheck(file as string, res)) return;

    loadFile(absolutePath(file as string), req, res);
  
  });

  appHandle.get("/subtitle", (req: Request, res: Response)=>{
    const {file} = req.query;

    if(!fileOfTypes(file as string, SUBTITLE_FORMATS)){
      res.status(403).send("This file format is not supported by this endpoint...");
      return;
    }
    if(!fileSecurityCheck(file as string, res)) return;

    let data: {data: string, language: string} = {data: "", language: ""};
    data["data"] = fs.readFileSync(absolutePath(file as string), {encoding: "utf-8"});
    data["language"] = parseLanguageFromFile(file as string); // going to be replaced by frontend refactor
    res.send(data);
  });

}

