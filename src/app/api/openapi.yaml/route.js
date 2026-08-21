import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  const filePath = path.join(process.cwd(), "docs", "openapi.yaml");
  const content = await readFile(filePath, "utf8");

  return new Response(content, {
    headers: { "Content-Type": "text/yaml; charset=utf-8" },
  });
}
