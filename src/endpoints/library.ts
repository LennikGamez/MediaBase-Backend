import { Application, Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";

import { BASE_DIRECTORY } from "../helpers/fileoperations"; 
import { MediaTypes, mapStringToMediaType } from "../helpers/util"; 

export type LibEntry = {
  name: string,
  type: MediaTypes
}
export function registerLibraryEndpoint(appHandle: Application){
  appHandle.get("/library", (_req: Request, res: Response) => {
    // [{name: "FilmName", type: "MOVIE"}]

    const lib: LibEntry[] = [];
    const firstLevel = fs.readdirSync(BASE_DIRECTORY)
    firstLevel.forEach((dir) => {
      const joinedPath = path.join(BASE_DIRECTORY, dir);
      if (!fs.statSync(joinedPath).isDirectory) return;
      const mediaType = mapStringToMediaType(dir);

      const secondLevel = fs.readdirSync(joinedPath);
      secondLevel.forEach((media) => {
        lib.push({
          name: media,
          type: mediaType
        })
      })

    })
    res.json(lib);
  })
}
