import { Application, Response, Request} from "express";
import path from "node:path";

import { getFilesFromDirectory } from "../helpers/dirScans";
import { MOVIE_DIR } from "../fileoperations";

type MovieData = {
  languages: {language: string, path: string}[],
  subtitles: {language: string, path: string}[],
  description: string
}

export function registerMovieEndpoint(appHandle: Application){
  appHandle.get("/movie/:name", (req: Request, res: Response) => {
    // get all files from directory recursively
    let { languages, subtitles, description} = getFilesFromDirectory(path.join(MOVIE_DIR, req.params.name))

    const movie: MovieData = {
      languages,
      subtitles, 
      description 
    }  
  
    res.json(movie);
  });
}
