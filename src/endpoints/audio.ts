import path from "path"; 
import { Application, Request, Response } from "express";

import { readAllFilesFromDirectory, filterFiles } from "../helpers/dirScans";
import { AUDIO_DIR, readDescription, relativePath } from "../fileoperations";

type AudioData = {
  description: string,
  audioFiles: string[]
}

export function registerAudioEndpoint(appHandle: Application){
  appHandle.get("/audio/:name", (req: Request, res: Response)=>{
    // get all files for this AudioBook
    const allFiles = readAllFilesFromDirectory(path.join(AUDIO_DIR, req.params.name));

    const audioFiles = filterFiles(allFiles, [".mp3"]);
    const descriptionFile = filterFiles(allFiles, [".txt"])[0];

    let description = readDescription(descriptionFile);
      

    const audiobook: AudioData = {
      audioFiles: audioFiles.map((file)=> relativePath(path.join(file.parentPath, file.name))),
      description
    }
  
    res.json(audiobook);
  });
}
