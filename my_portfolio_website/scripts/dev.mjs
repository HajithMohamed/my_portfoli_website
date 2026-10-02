import { spawn } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const websiteRoot = resolve(__dirname, "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";

const children = [
  spawn(npm, ["run", "start:dev"], {
    cwd: resolve(websiteRoot, "backend"),
    stdio: "inherit",
    shell: process.platform === "win32",
  }),
  spawn(npm, ["run", "dev"], {
    cwd: resolve(websiteRoot, "frontend"),
    stdio: "inherit",
    shell: process.platform === "win32",
  }),
];

let shuttingDown = false;
function shutdown(signal = "SIGTERM") {
  if (shuttingDown) return;
  shuttingDown = true;
  children.forEach((child) => child.kill(signal));
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
children.forEach((child) => child.on("exit", (code) => {
  if (!shuttingDown && code) {
    shutdown();
    process.exitCode = code;
  }
}));
