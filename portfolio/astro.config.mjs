import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

// Écrit les derniers commits réels du dépôt dans src/data/commits.json au démarrage
// (dev et build). Si git est absent, le dernier fichier committé reste utilisé.
function gitLog() {
  return {
    name: "git-log",
    hooks: {
      "astro:config:setup": () => {
        try {
          const out = execSync("git log -6 --date=short --pretty=format:%h%x09%ad%x09%s", { encoding: "utf8" });
          const commits = out.trim().split("\n").map((line) => {
            const [hash, date, ...subject] = line.split("\t");
            return { hash, date, subject: subject.join("\t") };
          });
          writeFileSync(new URL("./src/data/commits.json", import.meta.url), JSON.stringify(commits, null, 2) + "\n");
        } catch {
          // Pas de git disponible : on garde le fichier existant
        }
      },
    },
  };
}

export default defineConfig({
  integrations: [gitLog()],
  adapter: cloudflare(),
  vite: { plugins: [tailwindcss()] },
});
