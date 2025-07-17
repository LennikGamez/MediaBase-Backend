import { Application, Request, Response } from "express"; 
import express from "express";

import { registerEpisodeEndpoint } from "./endpoints/episode"; 
import { registerSeriesEndpoint } from "./endpoints/series"; 
import { registerMovieEndpoint } from "./endpoints/movie"; 
import { registerStreamingEndpoints } from "./endpoints/fileStreaming"; 
import { registerLibraryEndpoint } from "./endpoints/library"; 

const app: Application = express();


type FileStructure = {
  FistLevel: "Filme" | "Serien" | "Hörbücher"
}

registerEpisodeEndpoint(app);
registerSeriesEndpoint(app);
registerMovieEndpoint(app);
registerStreamingEndpoints(app);
registerLibraryEndpoint(app);


const PORT = 3000
console.log("Listening to " + PORT);
app.listen(PORT);

