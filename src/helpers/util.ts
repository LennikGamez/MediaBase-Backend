
export enum MediaTypes {
  MOVIE,
  SHOW,
  AUDIO,
  UNDEFINED
}

export function mapStringToMediaType(str: string): MediaTypes{
  switch(str){
    case "Filme":
      return MediaTypes.MOVIE;
    case "Serien":
      return MediaTypes.SHOW;
    case "Hörbücher":
      return MediaTypes.AUDIO;
    default:
      return MediaTypes.UNDEFINED;
  }
}
export function enumToString(e: MediaTypes){
  const types = ["Filme", "Serien", "Hörbücher"];
  return types[e];
}
