import { Application, Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";

import { BASE_DIRECTORY } from "../helpers/fileoperations"; 
import { MediaTypes, mapStringToMediaType } from "../helpers/util"; 
import { filterFiles } from "../helpers/dirScans";

export type LibEntry = {
  name: string,
  type: MediaTypes,
  poster: string
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
        const thirdLevel = fs.readdirSync(path.join(joinedPath, media), {withFileTypes: true});
        const poster = filterFiles(thirdLevel, [".png", ".jpg"])[0];

        lib.push({
          name: media,
          type: mediaType,
          poster: path.join(poster.parentPath, poster.name).replace(BASE_DIRECTORY, '')
        })
      })

    })
    res.json(lib);
  })
}
