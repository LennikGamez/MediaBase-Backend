import path from "node:path";


export function fileOfTypes(absFilePath: string, filetypes: string[]){
  const extension = path.extname(absFilePath).toLowerCase();

  return filetypes.includes(extension);
}


