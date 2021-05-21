import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./server/server";

const app = createApp();

if (process.env.NODE_ENV === "production") {
  app.listen(process.env.PORT, process.env.IP, () => {
    console.log(
      `server is up and listening on ${process.env.IP}:${process.env.PORT}`
    );
  });
} else {
  app.listen(3001, () => {
    console.log(`server is up and listening on port 3001`);
  });
}
