import { Application, Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";

import { absolutePath, BASE_DIRECTORY } from "../helpers/fileoperations"; 
import { MediaTypes, enumToString, mapStringToMediaType } from "../helpers/util"; 
import { filterFiles } from "../helpers/dirScans";
import { relativePath } from "../fileoperations";

export type LibEntry = {
  name: string,
  type: MediaTypes,
  group: string
}
export function registerLibraryEndpoint(appHandle: Application){
  appHandle.get("/library", (req: Request, res: Response) => {
    // [{name: "FilmName", type: "MOVIE"}]
    const groupName = req.query.group as string;
    const groupType = parseInt(req.query.grouptype as string) as MediaTypes;

    const lib: LibEntry[] = [];
    if (groupName && groupType != undefined){
      readGroupDirectory(lib, groupName, groupType);
    }else{
      readLibraryFromRoot(lib);      
    }

    res.json(lib);
  })
}


function readGroupDirectory(lib: LibEntry[], groupName: string, groupType: MediaTypes){

      const groupPath = absolutePath(`${enumToString(groupType)}/${groupName}`);
      const groupFiles = fs.readdirSync(groupPath).filter((file)=>{
        return fs.statSync(path.join(groupPath, file)).isDirectory();
      });
      groupFiles.forEach((media)=> {
        const isGroup = (media.startsWith("[") && media.endsWith("]"));

        lib.push({
          name: media,
          type: groupType,
          group: isGroup ? groupName + "/" + media : ""
        })
        
      })
}

function readLibraryFromRoot(lib: LibEntry[]){
      const firstLevel = fs.readdirSync(BASE_DIRECTORY)
      firstLevel.forEach((dir) => {
        const joinedPath = absolutePath(dir);
        if (!fs.statSync(joinedPath).isDirectory) return;
        const mediaType = mapStringToMediaType(dir);

        const secondLevel = fs.readdirSync(joinedPath);
        secondLevel.forEach((media) => {
          // insert the check if the folder is a group indicated by [NAME]

          const isGroup = (media.startsWith("[") && media.endsWith("]"));

          lib.push({
            name: isGroup ? media.slice(1,-1): media,
            type: mediaType,
            group: isGroup ? media : ""
          })
        })
      })
  
}
