import fs from "fs";
import path from "path";

async function saveToJSON(object: Record<string, unknown>): Promise<void> {
  return new Promise((resolve) => {
    const stringJSON = JSON.stringify(object);
    const projectPath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "spotifyKeys.json"
    );
    // to do: make this do something if it errors
    fs.writeFile(projectPath, stringJSON, () => resolve());
  });
}

export { saveToJSON };
