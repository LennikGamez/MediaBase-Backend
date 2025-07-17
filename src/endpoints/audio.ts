import path from "path"; 
import { Application, Request, Response } from "express";

import { readAllFilesFromDirectory, filterFiles } from "../helpers/dirScans";
import { AUDIO_DIR, relativePath } from "../fileoperations";

type AudioData = {
  audioFiles: string[]
}

export function registerAudioEndpoint(appHandle: Application){
  appHandle.get("/audio/:name", (req: Request, res: Response)=>{
    // get all files for this AudioBook
    const allFiles = readAllFilesFromDirectory(path.join(AUDIO_DIR, req.params.name));

    const audioFiles = filterFiles(allFiles, [".mp3"]);
      

    const audiobook: AudioData = {
      audioFiles: audioFiles.map((file)=> relativePath(path.join(file.parentPath, file.name)))
    }
  
    res.json(audiobook);
  });
}
