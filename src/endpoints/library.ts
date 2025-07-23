import { Application, Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";

import { absolutePath, BASE_DIRECTORY } from "../helpers/fileoperations"; 
import { MediaTypes, mapStringToMediaType } from "../helpers/util"; 
import { filterFiles } from "../helpers/dirScans";
import { relativePath } from "../fileoperations";

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
      const joinedPath = absolutePath(dir);
      if (!fs.statSync(joinedPath).isDirectory) return;
      const mediaType = mapStringToMediaType(dir);

      const secondLevel = fs.readdirSync(joinedPath);
      secondLevel.forEach((media) => {
        // insert the check if the folder is a group indicated by [NAME]
        lib.push({
          name: media,
          type: mediaType,
        })
      })

    })
    res.json(lib);
  })
}
