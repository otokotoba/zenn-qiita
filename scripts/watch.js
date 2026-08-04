import chokidar from "chokidar";
import { exec } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TARGET_DIR = path.join(__dirname, "../zeta");
const watcher = chokidar.watch(`${TARGET_DIR}/`, {
  ignored: (path, stats) => stats?.isFile() && !path.endsWith(".md"),
  ignoreInitial: true,
});

function execute(command) {
  console.log(`Executing command: ${command}`);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
    }
    if (stdout) {
      console.log(`stdout: ${stdout}`);
    }
  });
}

function getFileName(filePath) {
  return path.basename(filePath, ".md");
}

watcher
  .on("add", (path) => execute(`zeta build ${getFileName(path)}`))
  .on("change", (path) => execute(`zeta build ${getFileName(path)}`))
  .on("unlink", (path) => execute(`zeta remove ${getFileName(path)}`));

console.log(`Watching ${TARGET_DIR}`);
