import { Application, Request, Response } from "express";
import { Dirent, readdirSync } from "node:fs";
import { join } from "node:path";
import { absolutePath, fileOfTypes, relativePath } from "../fileoperations";
import { enumToString } from "../helpers/util";

export function registerPosterPathEndpoint(appHandle: Application){
  appHandle.get("/poster/:name/:type", (req: Request, res: Response)=>{
    const type = parseInt(req.params.type);
    const name = req.params.name as string;
    const firstLevel = readdirSync(join(absolutePath(enumToString(type)), name), {withFileTypes: true});
    const posterFile: Dirent<string> | undefined = firstLevel.find((file)=> fileOfTypes(file.name, [".png", ".jpg"]));

    if(!posterFile){
      res.status(404).send("No poster was found!");
      return;
    }

    const path = join(posterFile.parentPath, posterFile.name);
    res.sendFile(path);
  });
}
