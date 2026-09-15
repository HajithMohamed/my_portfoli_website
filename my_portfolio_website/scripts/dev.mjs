import { spawn } from "node:child_process";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const children = ["backend", "frontend"].map((workspace) =>
  spawn(npm, ["run", "dev", "--workspace", workspace], {
    stdio: "inherit",
    shell: process.platform === "win32",
  }),
);

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
