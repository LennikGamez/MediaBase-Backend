import { Response } from "express"; 
import path from "node:path";
import iso from "iso-639-1";
import fs, { Dirent } from "node:fs";

export const VIDEO_FORMATS = [".mp4", ".webm"];
export const AUDIO_FORMATS = [".mp3"];
export const SUBTITLE_FORMATS = [".vtt"];
export const DESCRIPTION_FORMATS = [".txt"];
export const POSTER_FORMATS = [".png", ".jpg", ".jpeg"];

export const BASE_DIRECTORY = process.env.BASE_DIRECTORY as string;

export const MOVIE_DIR = "Filme";
export const SERIES_DIR = "Serien";
export const AUDIO_DIR = "Hörbücher";

export function fileOfTypes(absFilePath: string, filetypes: string[]){
  const extension = path.extname(absFilePath).toLowerCase();

  return filetypes.includes(extension);
}

export function parseLanguageFromFile(absFilePath: string): string{
  
  const filename = path.basename(absFilePath);
  if(!filename.includes("[") || !filename.includes("]")){
    return filename.split(".")[0];
  }
  const languageCode = filename.split('[')[1].split(']')[0].toLowerCase();
  const language = iso.getNativeName(languageCode);

  if(language == ''){
    return languageCode.charAt(0).toUpperCase() + languageCode.slice(1);
  }
  return language
}


export function isFileInBaseDir(file: string){
  const absolutePath = path.resolve(file);
  return absolutePath.startsWith(BASE_DIRECTORY);
}
export function relativePath(path: string): string{
  return path.replace(BASE_DIRECTORY, '');
}

export function absolutePath(relpath: string): string{
  return path.join(BASE_DIRECTORY, relpath);
}

export function fileSecurityCheck(file: string, res: Response): boolean{
    if (!isFileInBaseDir(path.join(BASE_DIRECTORY, file as string))) {
      res.sendStatus(403);
      return false;
  };
  return true;
}

export function readDescription(descriptionFile: Dirent | undefined): string{
  let description = "";
  if (descriptionFile){
    description = fs.readFileSync(path.join(descriptionFile.parentPath, descriptionFile.name), {encoding: "utf8"});
  }
  return description;
}
