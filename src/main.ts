import { Application } from "express"; 
import express from "express";
import cors from "cors";

import { registerEpisodeEndpoint } from "./endpoints/episode"; 
import { registerSeriesEndpoint } from "./endpoints/series"; 
import { registerMovieEndpoint } from "./endpoints/movie"; 
import { registerStreamingEndpoints } from "./endpoints/fileStreaming"; 
import { registerLibraryEndpoint } from "./endpoints/library"; 
import { registerAudioEndpoint } from "./endpoints/audio";
import { registerPosterPathEndpoint } from "./endpoints/poster";

const app: Application = express();

app.use(cors());

type FileStructure = {
  FistLevel: "Filme" | "Serien" | "Hörbücher"
}

registerEpisodeEndpoint(app);
registerSeriesEndpoint(app);
registerMovieEndpoint(app);
registerStreamingEndpoints(app);
registerLibraryEndpoint(app);
registerAudioEndpoint(app);
registerPosterPathEndpoint(app);

const PORT = 3000
console.log("Listening to " + PORT);
app.listen(PORT);

