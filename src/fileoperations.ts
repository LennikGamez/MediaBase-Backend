import path from "node:path";
import iso from "iso-639-1";


export function fileOfTypes(absFilePath: string, filetypes: string[]){
  const extension = path.extname(absFilePath).toLowerCase();

  return filetypes.includes(extension);
}

export function parseLanguageFromFile(absFilePath: string): string{
  
  const filename = path.basename(absFilePath);
  const languageCode = filename.split('[')[1].split(']')[0].toLowerCase();
  const language = iso.getNativeName(languageCode);

  if(language == ''){
    return languageCode.charAt(0).toUpperCase() + languageCode.slice(1);
  }
  return language
}

