import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path = "./data.json";
const git = simpleGit(process.cwd());

async function commitEveryDay() {
  const remotes = await git.getRemotes(true);
  const origin = remotes.find(r => r.name === "origin")?.name || "origin";
  const branchSummary = await git.branch();
  const branch = branchSummary.current;

  console.log(`→ Remote: ${origin}`);
  console.log(`→ Branch: ${branch}`);

  const startDate = moment("2024-01-01", "YYYY-MM-DD");
  const endDate   = moment("2025-07-17", "YYYY-MM-DD");

  try {
    for (
      let m = startDate.clone();
      m.isSameOrBefore(endDate, "day");
      m.add(1, "day")
    ) {
      const date = m.format();

      await jsonfile.writeFile(path, { date }, { spaces: 0 });

      await git.add(path);
      await git.commit(date, { "--date": date });

      console.log(`✅ Commit criado para ${date}`);
    }

    await git.push(origin, branch);
    console.log(`🚀 Todos os commits foram empurrados para ${origin}/${branch}!`);
  } catch (err) {
    console.error("❌ Erro durante o processo:", err);
    process.exit(1);
  }
}

commitEveryDay();
