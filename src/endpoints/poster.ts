import { Application, Request, Response } from "express";
import { Dirent, readdirSync } from "node:fs";
import { join } from "node:path";
import { absolutePath, fileOfTypes } from "../helpers/fileoperations";
import { enumToString } from "../helpers/util";
import { POSTER_FORMATS } from "../helpers/fileoperations";

export function registerPosterPathEndpoint(appHandle: Application){
  appHandle.get("/poster/:name/:type", (req: Request, res: Response)=>{
    const group = req.query.group as string || "";
    const type = parseInt(req.params.type);
    let name = req.params.name as string;
    if (group){
      name = group + "/" + name;
    }
    const firstLevel = readdirSync(join(absolutePath(enumToString(type)), name), {withFileTypes: true});
    const posterFile: Dirent<string> | undefined = firstLevel.find((file)=> fileOfTypes(file.name, POSTER_FORMATS));

    if(!posterFile){
      res.sendFile(process.cwd() + "/dist/assets/default.png"); // server must be started with shell inside root folder
      return;
    }

    const path = join(posterFile.parentPath, posterFile.name);
    res.sendFile(path);
  });
}
