import { readFile } from "fs/promises";
import { glob } from "glob";

type Cantica = "inferno" | "purgatorio" | "paradiso";
type AnalysisDocument = { cantica: Cantica; canto: string; author: string, date: Date };
type AnalysisData = { canto: string; date: Date; sintesi: string | null; authors: { name: string; filePath: string }[] };

export function getFilePath(doc: AnalysisDocument) {
  return `/analisi/${doc.cantica}/canto-${doc.canto}/${doc.author}.pdf`;
}

export async function getAnalysis(filters?: Partial<AnalysisDocument>) {
  const pattern = "public/analisi/" +
    (filters?.cantica || "*") + "/" +
    (filters?.canto || "*") + "/" +
    "*/" +
    "{" + (filters?.author || "*") + ".pdf,sintesi.txt}";
  const urls = await glob(pattern).then(paths => 
    paths.map((path) => path.replace(/^public/, ""))
  );
  const meta: Record<Cantica, AnalysisData[]> = { inferno: [], purgatorio: [], paradiso: [] };
  for (const path of urls) {
    const parsed = parseFilePath(path);
    if (parsed) {
      let cantoEntry = meta[parsed.cantica].find((entry) => entry.canto === parsed.canto);
      if (!cantoEntry) {
        cantoEntry = { canto: parsed.canto, date: parsed.date, sintesi: null, authors: [] };
        meta[parsed.cantica].push(cantoEntry);
      }
      if (parsed.author === "sintesi") {
        cantoEntry.sintesi = (await readFile("public" + path)).toString().trim() || null;
      } else {
        cantoEntry.authors.push({ name: parsed.author, filePath: path });
      }
    }
  }
  return Object.fromEntries(
    Object.entries(meta).map(([cantica, analisi]) => ([cantica, Sorting.sortMeta(analisi)]))
  ) as Record<Cantica, AnalysisData[]>;
}

function parseFilePath(filePath: string): AnalysisDocument | null {
  const regex = /^\/analisi\/(inferno|purgatorio|paradiso)\/canto-([IVXLCDM]+)\/(\d{4}-\d{2}-\d{2})\/(sintesi\.txt|[^/]+\.pdf)$/;
  const match = filePath.match(regex);
  if (match) {
    const [, cantica, canto, dateStr, author] = match;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return { cantica: cantica as Cantica, canto, date, author: author.slice(0, -4) };
  }
  return null; // no match
}

namespace Sorting {
  export function sortMeta(meta: AnalysisData[]) {
    meta.forEach((a) => a.authors.sort((a, b) => a.name.localeCompare(b.name)));
    return meta.sort((a, b) => {
      const cantoA = romanToInt(a.canto);
      const cantoB = romanToInt(b.canto);
      if (cantoA !== cantoB) return cantoA - cantoB;
      return a.date.getTime() - b.date.getTime();
    });
  }
  
  function romanToInt(string: string) {
    let result = 0, current, previous = 0;
    for (const char of string.split("").reverse()) {
      current = romanValues.get(char);
      if (!current) return 0;
      if (current >= previous) result += current;
      else result -= current;
      previous = current;
    }
    return result;
  }

  const romanValues = new Map([
    ['I', 1],
    ['V', 5],
    ['X', 10],
    ['L', 50],
    ['C', 100],
    ['D', 500],
    ['M', 1000],
    // ...
  ]);
  
}