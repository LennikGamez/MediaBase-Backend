import path from "node:path";


export function fileOfTypes(absFilePath: string, filetypes: string[]){
  path.extname(absFilePath).toLowerCase();

  return filetypes.includes(absFilePath);
}


