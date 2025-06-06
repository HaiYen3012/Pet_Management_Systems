require("dotenv").config({ path: __dirname + "/.env" });
const http = require("http");
const app = require("./app");
const { logger } = require("./utils/logger");
const exitHook = require("async-exit-hook");
const pool = require("./config");

const START_SERVER = () => {
  const server = http.createServer(app);

  const PORT = process.env.PORT || 8080;

  server.listen(PORT, () => logger.info(`Magic happening on port: ${PORT}`));

  exitHook(() => {
    console.log("4. Server is shutting down...");
    pool.end();
    console.log("5. Disconnected from Postgres");
  });
};
(async () => {
  try {
    console.log("1. Connecting database...");
    await pool.connect();
    console.log("2. Connected database!");

    START_SERVER();
  } catch (error) {
    console.error(error);
    process.exit(0);
  }
})();
