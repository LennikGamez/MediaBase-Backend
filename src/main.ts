import { Application, Request, Response } from "express"; 
// const express = require("express");
import express from "express";
import fs from "node:fs";
import path from "node:path"; 


import { loadFile, streamFile } from "./streaming";
import { fileOfTypes } from "./fileoperations";

const BASE_DIRECTORY = process.env.BASE_DIRECTORY as string;

function isFileInBaseDir(file: string){
  const absolutePath = path.resolve(file);
  return absolutePath.startsWith(BASE_DIRECTORY);
}
function relativePath(path: string): string{
  return path.replace(BASE_DIRECTORY, '');
}

function absolutePath(relpath: string): string{
  return path.join(BASE_DIRECTORY, relpath);
}

const app: Application = express();


type FileStructure = {
  FistLevel: "Filme" | "Serien" | "Hörbücher"
}

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

app.get("/library", (_req: Request, res: Response) => {
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


type MovieData = {
  name: string,
  languages: {language: string, path: string}[],
  subtitles: {language: string, path: string}[],
  poster: string
}

app.get("/movie/:name", (req: Request, res: Response) => {
  // get all files from directory recursively
  let allFiles = fs.readdirSync(path.join(BASE_DIRECTORY, "Filme", req.params.name), {recursive: true, withFileTypes: true});
  allFiles = allFiles.filter((file)=> {return !fs.statSync(path.join(file.parentPath, file.name)).isDirectory()});

  const languages = allFiles.filter((file) => {return fileOfTypes(file.name, [".mp4"])});

  const subtitles = allFiles.filter((file) => {return fileOfTypes(file.name, [".vtt"])});

  const poster = allFiles.filter((file) => {return fileOfTypes(file.name, [".png", ".jpg"])})[0];


  const movie: MovieData = {
    name: req.params.name,
    languages: languages.map((file) => {return {language: "Deutsch", path: path.join(relativePath(file.parentPath), file.name)}}),
    subtitles: subtitles.map((file) => {return {language: "Deutsch", path: path.join(relativePath(file.parentPath), file.name)}}),
    poster: path.join(relativePath(poster.parentPath), poster.name)
    
  }
  
  
  res.json(movie);
});


function fileSecurityCheck(file: string, res: Response): boolean{
    if (!isFileInBaseDir(path.join(BASE_DIRECTORY, file as string))) {
      res.sendStatus(403);
      return false;
  };
  return true;
}

// ENDPOINT?file=Filme/Antigone/Antigone[GER].mp4
app.get("/stream", (req: Request, res: Response)=>{
  // Filme/Antigone/Antigone[GER].mp4
  const {file}= req.query;

  if(!fileOfTypes(file as string, [".mp4"])) {
    res.status(403).send("This file format is not supported by this endpoint...");
    return;
  }
  if (!fileSecurityCheck(file as string, res)) return;

  loadFile(path.join(BASE_DIRECTORY, file as string), req, res);
  
});

app.get("/subtitle", (req: Request, res: Response)=>{
  const {file} = req.query;

  if(!fileOfTypes(file as string, [".vtt"])){
    res.status(403).send("This file format is not supported by this endpoint...");
    return;
  }
  if(!fileSecurityCheck(file as string, res)) return;

  let data: {data: string, language: string} = {data: "", language: ""};
  data["data"] = fs.readFileSync(absolutePath(file as string), {encoding: "utf-8"});
  data["language"] = "Deutsch"; // going to be replaced by frontend refactor
  res.send(data);
});


app.get("/poster", (req: Request, res: Response) => {
  const {file} = req.query;

  if(!fileOfTypes(file as string, [".png", ".jpg"])) {
    res.status(403).send("This file format is not supported by this endpoint...");
    return;
  }
  if(!fileSecurityCheck(file as string, res)) return;

  res.sendFile(path.join(BASE_DIRECTORY, file as string))
});


const PORT = 3000
console.log("Listening to " + PORT);
app.listen(PORT);

