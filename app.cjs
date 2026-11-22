// Startup file for cPanel "Setup Node.js App" (Phusion Passenger).
// Passenger loads the startup file with require(), but the built server is an ES module
// (.output/server/index.mjs), so this CommonJS file imports it. Passenger provides PORT.
// Build first on the server: `npm install` then `npm run build`. Not used by `npm run dev`.
import("./.output/server/index.mjs").catch((error) => {
  console.error("Failed to start the Bellvicks server:", error);
  process.exit(1);
});
