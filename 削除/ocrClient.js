const { spawn } = require("child_process");
const readline = require("readline");

let python = null;
let rl = null;

const queue = [];

function startOCR() {
  if (python) {
    return;
  }

  python = spawn("py", ["-3.13", "ocr/ocr_server.py"], {
    stdio: ["pipe", "pipe", "pipe"],
  });

  rl = readline.createInterface({
    input: python.stdout,
  });

  rl.on("line", (line) => {
    // PaddleOCRのログを無視
    if (!line.startsWith("{")) {
      return;
    }

    const resolve = queue.shift();

    if (resolve) {
      try {
        resolve(JSON.parse(line));
      } catch (error) {
        console.log("JSON失敗:", line);

        resolve({
          result: null,
          error: error.message,
          raw: line,
        });
      }
    }
  });

  python.stderr.on("data", (data) => {
    console.error(data.toString());
  });
}

function readOCR(imagePath, mode = "number") {
  return new Promise((resolve) => {
    startOCR();

    queue.push(resolve);

    console.log("Pythonへ送信", imagePath);

    python.stdin.write(
      JSON.stringify({
        image: imagePath.replace(/\\/g, "/"),
        mode,
      }) + "\n",
    );
  });
}

function stopOCR() {
  if (python) {
    python.kill();

    python = null;
    rl = null;
  }
}

module.exports = {
  readOCR,
  stopOCR,
};
