import { Application, Request, Response } from "express"; 
// const express = require("express");
import express from "express";


const app: Application = express();

app.get("/library", (req: Request, res: Response) => {
  // [{name: "FilmName", type: "MOVIE"}]

  
})



const PORT = 3000
console.log("Listening to " + PORT);
app.listen(PORT);

