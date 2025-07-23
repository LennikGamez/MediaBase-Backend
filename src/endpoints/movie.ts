import { Application, Response, Request} from "express";
import path from "node:path";

import { getFilesFromDirectory } from "../helpers/dirScans";
import { MOVIE_DIR } from "../fileoperations";

type MovieData = {
  name: string,
  languages: {language: string, path: string}[],
  subtitles: {language: string, path: string}[],
  posterPath: string,
  description: string
}

export function registerMovieEndpoint(appHandle: Application){
  appHandle.get("/movie/:name", (req: Request, res: Response) => {
    // get all files from directory recursively
    let { languages, subtitles, posterPath, description} = getFilesFromDirectory(path.join(MOVIE_DIR, req.params.name))

    const movie: MovieData = {
      name: req.params.name,
      languages,
      subtitles, 
      posterPath,
      description 
    }  
  
    res.json(movie);
  });
}
