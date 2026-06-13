const { execFileSync } = require("node:child_process");
const { existsSync, readFileSync } = require("node:fs");
const path = require("node:path");
const { Client } = require("pg");

const requiredTables = ["User", "AudioFile", "Tag", "AudioFileTag"];

function loadEnvFile(fileName) {
  const filePath = path.join(process.cwd(), fileName);
  if (!existsSync(filePath)) return;

  const content = readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] = value;
  }
}

function printOk(message) {
  console.log(`OK ${message}`);
}

function printFail(message) {
  console.error(`FAIL ${message}`);
}

function maskedDatabaseUrl(value) {
  try {
    const url = new URL(value);
    if (url.password) url.password = "*****";
    return url.toString();
  } catch {
    return "(invalid DATABASE_URL)";
  }
}

function runPrismaCommand(args, label) {
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  execFileSync(npx, args, {
    cwd: process.cwd(),
    env: process.env,
    stdio: "pipe",
    encoding: "utf8",
  });
  printOk(label);
}

async function main() {
  loadEnvFile(".env");
  loadEnvFile(".env.local");

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    printFail("DATABASE_URL is missing.");
    process.exit(1);
  }

  printOk(`DATABASE_URL exists: ${maskedDatabaseUrl(databaseUrl)}`);

  const client = new Client({ connectionString: databaseUrl });
  try {
    await client.connect();
    printOk("Connected to PostgreSQL");

    const databaseResult = await client.query("select current_database() as database");
    printOk(`Database exists: ${databaseResult.rows[0].database}`);

    const tablesResult = await client.query(
      "select table_name from information_schema.tables where table_schema = 'public'",
    );
    const tableNames = new Set(tablesResult.rows.map((row) => row.table_name));
    const missingTables = requiredTables.filter((table) => !tableNames.has(table));

    if (missingTables.length > 0) {
      printFail(`Missing required tables: ${missingTables.join(", ")}`);
      process.exitCode = 1;
    } else {
      printOk(`Required tables found: ${requiredTables.join(", ")}`);
    }
  } catch (error) {
    printFail("PostgreSQL connection failed.");
    console.error(error);
    process.exit(1);
  } finally {
    await client.end().catch(() => {});
  }

  try {
    runPrismaCommand(["prisma", "db", "pull", "--print"], "Prisma introspection works");
    runPrismaCommand(["prisma", "migrate", "status"], "Prisma migration status works");
  } catch (error) {
    printFail("Prisma CLI check failed.");
    const output = [error.stdout, error.stderr].filter(Boolean).join("\n");
    if (output) console.error(output.trim());
    process.exit(1);
  }

  if (process.exitCode) process.exit(process.exitCode);
}

main().catch((error) => {
  printFail("Unexpected database check failure.");
  console.error(error);
  process.exit(1);
});
