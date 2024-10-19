export function generateHtmlResponse(userId: string, userName: string | null, token: string): Response {
  const htmlResponse = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Replex-Auth</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        p { color: #555; }
      </style>
    </head>
    <body>
      <h1>Replex-Auth</h1>
      <p><strong>User ID:</strong> ${userId}</p>
      <p><strong>User Name:</strong> ${userName || "Unknown"}</p>
      <p><strong>Token:</strong> ${token}</p>
    </body>
    </html>`;

  return new Response(htmlResponse, {
    headers: { "Content-Type": "text/html" }
  });
}
