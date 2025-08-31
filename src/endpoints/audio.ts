import path from "path"; 
import { Application, Request, Response } from "express";

import { readAllFilesFromDirectory, filterFiles } from "../helpers/dirScans";
import { AUDIO_DIR, fileSecurityCheck, readDescription, relativePath } from "../helpers/fileoperations";
import { AUDIO_FORMATS, DESCRIPTION_FORMATS } from "../helpers/fileoperations";

type AudioData = {
  description: string,
  audioFiles: string[]
}

export function registerAudioEndpoint(appHandle: Application){
  appHandle.get("/audio/{*path}", (req: Request, res: Response)=>{
    // get all files for this AudioBook
    const pathToAudio = (req.params.path as unknown as string[]).join("/");
    if(!fileSecurityCheck(path.join(AUDIO_DIR, pathToAudio), res)){
      return;
    }
    const allFiles = readAllFilesFromDirectory(path.join(AUDIO_DIR, pathToAudio));

    const audioFiles = filterFiles(allFiles, AUDIO_FORMATS);
    const descriptionFile = filterFiles(allFiles, DESCRIPTION_FORMATS)[0];

    let description = readDescription(descriptionFile);
      

    const audiobook: AudioData = {
      audioFiles: audioFiles.map((file)=> relativePath(path.join(file.parentPath, file.name))),
      description
    }
  
    res.json(audiobook);
  });
}
