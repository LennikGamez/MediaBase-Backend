import { Application, Response, Request} from "express";
import path from "node:path";

import { getFilesFromDirectory } from "../helpers/dirScans";
import { fileSecurityCheck, MOVIE_DIR } from "../fileoperations";

type MovieData = {
  languages: {language: string, path: string}[],
  subtitles: {language: string, path: string}[],
  description: string
}

export function registerMovieEndpoint(appHandle: Application){
  appHandle.get("/movie/{*path}", (req: Request, res: Response) => {
    // get all files from directory recursively
    const urlPathToMovie = (req.params.path as unknown as string[]).join("/");

    if(!fileSecurityCheck(path.join(MOVIE_DIR, urlPathToMovie), res)){
      return;
    }
    
    let { languages, subtitles, description} = getFilesFromDirectory(path.join(MOVIE_DIR, urlPathToMovie))

    const movie: MovieData = {
      languages,
      subtitles, 
      description 
    }  
  
    res.json(movie);
  });
}
