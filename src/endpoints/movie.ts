import { Application, Response, Request} from "express";
import fs from "node:fs";
import path from "node:path";

import { BASE_DIRECTORY, fileOfTypes, parseLanguageFromFile, relativePath } from "../helpers/fileoperations";

type MovieData = {
  name: string,
  languages: {language: string, path: string}[],
  subtitles: {language: string, path: string}[],
  poster: string
}

export function registerMovieEndpoint(appHandle: Application){
  appHandle.get("/movie/:name", (req: Request, res: Response) => {
    // get all files from directory recursively
    let allFiles = fs.readdirSync(path.join(BASE_DIRECTORY, "Filme", req.params.name), {recursive: true, withFileTypes: true});
    allFiles = allFiles.filter((file)=> {return !fs.statSync(path.join(file.parentPath, file.name)).isDirectory()});

    const languages = allFiles.filter((file) => {return fileOfTypes(file.name, [".mp4"])});

    const subtitles = allFiles.filter((file) => {return fileOfTypes(file.name, [".vtt"])});

    const poster = allFiles.filter((file) => {return fileOfTypes(file.name, [".png", ".jpg"])})[0];


    const movie: MovieData = {
      name: req.params.name,
      languages: languages.map((file) => {return {language: parseLanguageFromFile(file.name), path: path.join(relativePath(file.parentPath), file.name)}}),
      subtitles: subtitles.map((file) => {return {language: parseLanguageFromFile(file.name), path: path.join(relativePath(file.parentPath), file.name)}}),
      poster: path.join(relativePath(poster.parentPath), poster.name)
    
    }
  
  
    res.json(movie);
  });
}
