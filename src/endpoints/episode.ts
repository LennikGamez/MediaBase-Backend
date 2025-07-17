import {Application, Request, Response} from "express";
import fs from "node:fs";
import path from "node:path";

import { absolutePath, fileOfTypes, parseLanguageFromFile, relativePath } from "../helpers/fileoperations"; 

export type Episode = {
  name: string,
  path: string
}


export function registerEpisodeEndpoint(appHandle: Application){
  
  appHandle.get("/episode", (req: Request, res: Response)=>{
    const {dir} = req.query;

    const allFiles = fs.readdirSync(absolutePath(dir as string), {withFileTypes: true, recursive: true});
    const languages = allFiles.filter((file) => {return fileOfTypes(file.name, [".mp4"])});

    const subtitles = allFiles.filter((file) => {return fileOfTypes(file.name, [".vtt"])});

    const episodeData = {
      languages: languages.map((file) => {return {language: parseLanguageFromFile(file.name), path: path.join(relativePath(file.parentPath), file.name)}}),
      subtitles: subtitles.map((file) => {return {language: parseLanguageFromFile(file.name), path: path.join(relativePath(file.parentPath), file.name)}}),
  
    }
    res.json(episodeData);
  });

}


