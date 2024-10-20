import { Elysia } from "elysia";
import { staticPlugin } from "@elysiajs/static";
import { handleGetUser } from "./handlers";
import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "./App";

const app = new Elysia()
  .use(staticPlugin())
  .get("/", ({ set }) => {
    const userId = "example-user-id";
    const userName = "John Doe";
    const token = "example-token";

    const app = ReactDOMServer.renderToString(
      React.createElement(App, { userId, userName, token })
    );

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Replex-Auth</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div id="root">${app}</div>
      </body>
      </html>
    `;

    set.headers["Content-Type"] = "text/html";
    return html;
  })
  .get("/api/getUser", handleGetUser)
  .listen(3000);

console.log(`Listening on localhost:${app.server?.port}`);
