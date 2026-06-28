// These tests exercise the Red Planet "top workplaces" / "top workers" scripts
// (server/src/scripts/top-workplaces.ts and top-workers.ts). They run those
// scripts and assert the output is non-empty, valid JSON.
//
// NOTE: Both scripts ship as unimplemented placeholders, so these tests are
// EXPECTED TO FAIL until you implement the scripts. A passing run only
// confirms each script runs and emits a non-empty JSON array; it does not
// check that the values are correct.
import { exec } from "child_process";
import * as path from "path";
import * as JSON5 from "json5";

const packageDir = path.resolve(__dirname, "../server");

async function runTopEntitiesScript(entity: "Workplaces" | "Workers"): Promise<string> {
  const command = `npm run start:top${entity} --silent`;
  return new Promise((resolve, reject) => {
    exec(command, { cwd: packageDir }, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing command: ${error}`);
        return;
      }
      if (stderr) {
        reject(`Error executing script: ${stderr}`);
        return;
      }
      resolve(stdout.toString());
    });
  });
}

describe("Top Workplaces / Top Workers scripts (EXPECTED TO FAIL until the scripts in server/src/scripts are implemented)", () => {
  it.each([{ entity: "Workplaces" as const }, { entity: "Workers" as const }])(
    "should run the Top $entity script successfully",
    async ({ entity }) => {
      const scriptOutput = await runTopEntitiesScript(entity);
      expect(scriptOutput).toBeDefined();
      expect(scriptOutput.trim()).not.toBe("");
    },
  );

  it.each([{ entity: "Workplaces" as const }, { entity: "Workers" as const }])(
    "should produce valid JSON output for Top $entity",
    async ({ entity }) => {
      const scriptOutput = await runTopEntitiesScript(entity);
      const parsedOutput = JSON5.parse(scriptOutput.toString().toLowerCase());
      expect(parsedOutput).toBeDefined();
      expect(Array.isArray(parsedOutput)).toBe(true);
    },
  );
});
