import { Application, Request, Response } from "express"; 
// const express = require("express");
import express from "express";
import fs from "node:fs";
import path from "node:path"; 

const BASE_DIRECTORY = process.env.BASE_DIRECTORY as string;

const app: Application = express();

enum MediaTypes {
  MOVIE,
  SHOW,
  AUDIO,
  UNDEFINED
}

type LibEntry = {
  name: string,
  type: MediaTypes
}

function mapStringToMediaType(str: string): MediaTypes{
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

app.get("/library", (req: Request, res: Response) => {
  // [{name: "FilmName", type: "MOVIE"}]

  const lib: LibEntry[] = [];
  const firstLevel = fs.readdirSync(BASE_DIRECTORY)
  firstLevel.forEach((dir) => {
    const joinedPath = path.join(BASE_DIRECTORY, dir);
    if (!fs.statSync(joinedPath).isDirectory) return;
    const mediaType = mapStringToMediaType(dir);

    const secondLevel = fs.readdirSync(joinedPath);
    secondLevel.forEach((media) => {
      lib.push({
        name: media,
        type: mediaType
      })
    })

  })
  res.json(lib);
})



const PORT = 3000
console.log("Listening to " + PORT);
app.listen(PORT);

