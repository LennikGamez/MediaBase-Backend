import fs from "node:fs";
import { Dirent } from "node:fs"; 
import path from "node:path"; 
import { absolutePath, DESCRIPTION_FORMATS, fileOfTypes, SUBTITLE_FORMATS, VIDEO_FORMATS } from "./fileoperations";

import { parseLanguageFromFile, relativePath } from "./fileoperations";
import { readDescription } from "../helpers/fileoperations";


export function readAllFilesFromDirectory(relativeDir: string){
    let allFiles = fs.readdirSync(absolutePath(relativeDir), {recursive: true, withFileTypes: true});
    return allFiles.filter((file)=> {return !fs.statSync(path.join(file.parentPath, file.name)).isDirectory()});
}
export function filterFiles(allFiles: Dirent[], acceptedFileTypes: string[]){
    return allFiles.filter((file)=> {return fileOfTypes(file.name, acceptedFileTypes)})
}

export function getFilesFromDirectory(relativeDir: string){
    // get all files from directory recursively
    const allFiles = readAllFilesFromDirectory(relativeDir);

    const languages = filterFiles(allFiles, VIDEO_FORMATS);
    // let languages = allFiles.filter((file) => {return fileOfTypes(file.name, [".mp4"])});

    const subtitles = filterFiles(allFiles, SUBTITLE_FORMATS);
    // let subtitles = allFiles.filter((file) => {return fileOfTypes(file.name, [".vtt"])});

    const descriptionFile = filterFiles(allFiles, DESCRIPTION_FORMATS)[0];
    let description = readDescription(descriptionFile);

    return{
          languages: languages.map((file) => {return {language: parseLanguageFromFile(file.name), path: path.join(relativePath(file.parentPath), file.name)}}),
          subtitles:  subtitles.map((file) => {return {language: parseLanguageFromFile(file.name), path: path.join(relativePath(file.parentPath), file.name)}}),
          description  
      }

}
