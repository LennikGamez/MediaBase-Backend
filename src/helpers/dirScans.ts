import fs from "node:fs";
import { Dirent } from "node:fs"; 
import path from "node:path"; 
import { absolutePath, fileOfTypes } from "./fileoperations";

import { parseLanguageFromFile, relativePath } from "./fileoperations";
import { readDescription } from "../fileoperations";


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

    const languages = filterFiles(allFiles, [".mp4"]);
    // let languages = allFiles.filter((file) => {return fileOfTypes(file.name, [".mp4"])});

    const subtitles = filterFiles(allFiles, [".vtt"]);
    // let subtitles = allFiles.filter((file) => {return fileOfTypes(file.name, [".vtt"])});

    const descriptionFile = filterFiles(allFiles, [".txt"])[0];
    let description = readDescription(descriptionFile);

    return{
          languages: languages.map((file) => {return {language: parseLanguageFromFile(file.name), path: path.join(relativePath(file.parentPath), file.name)}}),
          subtitles:  subtitles.map((file) => {return {language: parseLanguageFromFile(file.name), path: path.join(relativePath(file.parentPath), file.name)}}),
          description  
      }

}
