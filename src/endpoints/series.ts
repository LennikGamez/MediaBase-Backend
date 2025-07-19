import { Application, Response, Request } from "express";
import fs from "node:fs";
import path from "node:path";

import { BASE_DIRECTORY } from "../helpers/fileoperations"; 
import { Episode } from "./episode"; 
import { relativePath, SERIES_DIR } from "../fileoperations";

export type Season = {
  seasonNum: number,
  episodes: Episode[]
}

export function registerSeriesEndpoint(appHandle: Application){
  appHandle.get("/series/:name", (req: Request, res:Response)=>{
    let seasons: Season[] = []
    const SEASON_FOLDER_STRUTURE_PREFIX = "Staffel -";
    const firstLevelFiles = fs.readdirSync(path.join(BASE_DIRECTORY, SERIES_DIR, req.params.name), {withFileTypes: true});
    const seasonDirs = firstLevelFiles.filter((file)=> {
      const stats = fs.statSync(path.join(file.parentPath, file.name));
      return stats.isDirectory() && file.name.startsWith(SEASON_FOLDER_STRUTURE_PREFIX);
    });

    // loop according to ideal file structure
    seasonDirs.forEach((seasonDir)=>{
      const seasonNum = parseInt(seasonDir.name.replace(SEASON_FOLDER_STRUTURE_PREFIX, '').trim());
      seasons.push({seasonNum, episodes: []});
  
      // episodes
      const episodeDirs = fs.readdirSync(path.join(seasonDir.parentPath, seasonDir.name));
      episodeDirs.forEach((episodeName)=>{
        seasons.find(o => o.seasonNum == seasonNum)?.episodes.push({
          name: episodeName,
          path: relativePath(path.join(seasonDir.parentPath, seasonDir.name, episodeName))
        });
      });

    });
    res.json({seasons});
  });
}
