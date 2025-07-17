import {Application, Request, Response} from "express";

import { getFilesFromDirectory } from "../helpers/dirScans";

export type Episode = {
  name: string,
  path: string
}


export function registerEpisodeEndpoint(appHandle: Application){
  
  appHandle.get("/episode", (req: Request, res: Response)=>{
    const {dir} = req.query;

    let { languages, subtitles } = getFilesFromDirectory(dir as string); // not optimal to only use two of the three provided variables but good enough for now

    const episodeData = {
      languages,
      subtitles  
    }
    res.json(episodeData);
  });

}


