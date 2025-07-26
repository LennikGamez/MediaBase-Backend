import {Application, Request, Response} from "express";

import { getFilesFromDirectory, readAllFilesFromDirectory } from "../helpers/dirScans";
import { readDescription } from "../fileoperations";

export type Episode = {
  name: string,
  path: string
}


export function registerEpisodeEndpoint(appHandle: Application){
  appHandle.get("/episode-description", (req: Request, res: Response)=>{
    const {dir} = req.query;

    const allFiles = readAllFilesFromDirectory(dir as string);
    const descriptionFile = allFiles.filter(file=>file.name.endsWith(".txt"))[0];
    const description = readDescription(descriptionFile);
    res.json(description);
  });
  
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


