/* Build library.json for the VIH group document library page.
 *
 * Run: node build_library.js
 * Writes: library.json (77 entries, one per file in the Document Index,
 * third edition, 2026-11-16).
 *
 * Source of truth for the inventory: the Document Index at
 * ~/workspace/goals/visually-inconvenienced-hams-automated-group-posts/files/!Document-Index.txt
 *
 * NAME RULE: field-reference entries carry their RENAMED file names
 * (stamp _v2.0-20261116-2218-AB9MZ), matching the rename Gregory ordered
 * on 2026-11-16. The generator verifies every renamed name exists in
 * ~/workspace/field-reference-files-renamed/ and fails loudly if one is
 * missing. Download URLs point at the field-reference repository, which
 * keeps the PLAIN kit names (the selector loads section files by those
 * names), so the displayed file name and the URL's file name differ for
 * those entries — that is deliberate, and the BUILD-REPORT says so.
 *
 * URL RULE: files that will live in the new library repository use
 * relative URLs (LIC/..., CNTST/...), so they work whatever the repo is
 * called. Files already on GitHub use absolute Pages URLs. The kit zip
 * lives only on Facebook Files, so it links to its group Files post.
 * The superseded index has url null and no download link.
 */
"use strict";
const fs = require("fs");
const path = require("path");

const STAMP = "_v2.0-20261116-2218-AB9MZ";
const FR = "https://ricis-ai.github.io/field-reference/";
const TECH = "https://ricis-ai.github.io/technician-class/";
/* Renamed kit zip post, uploaded 2026-11-16 22:21 (rename batch 1). */
const ZIP_POST = "https://www.facebook.com/groups/742838019382868/permalink/3039961369670510/";

const RENAMED_DIR = path.join(process.env.HOME, "workspace/field-reference-files-renamed");
const renamedOnDisk = new Set(fs.readdirSync(RENAMED_DIR));
function stamped(stem, ext) {
  const name = stem + STAMP + ext;
  if (!renamedOnDisk.has(name)) {
    throw new Error("renamed file missing from staging: " + name);
  }
  return name;
}

/* The 22 field-reference sections in BOOK order (the order in the index
 * and in the book itself), each with its title and search keywords. */
const SECTIONS = [
  ["guide", "Using and printing this book", ["guide", "printing", "using", "how to use", "book"]],
  ["phonetics", "Phonetic alphabet", ["phonetics", "alphabet", "nato", "alpha", "bravo", "spelling"]],
  ["morse", "Morse code and procedural signals", ["morse", "code", "cw", "procedural", "dit", "dah", "signals"]],
  ["emergency", "Emergency operating procedures", ["emergency", "procedures", "emcomm", "disaster"]],
  ["voice", "Voice and repeater operation", ["voice", "repeater", "fm", "phone", "ssb"]],
  ["cw", "CW abbreviations", ["cw", "abbreviations", "morse", "prosigns", "shorthand"]],
  ["qsignals", "Q signals and net codes", ["q signals", "qsl", "qth", "net", "codes", "q codes"]],
  ["reports", "Signal reporting", ["signal", "reporting", "rst", "readability", "strength"]],
  ["bands", "US band privileges", ["bands", "privileges", "band plan", "frequency", "allocation"]],
  ["digital", "Digital modes and linked systems", ["digital", "modes", "ft8", "packet", "dmr", "linked", "systems"]],
  ["station", "Antennas, power, and station checks", ["station", "antennas", "power", "checks", "antenna"]],
  ["deployment", "Accessible deployment", ["deployment", "accessible", "field", "go kit", "portable"]],
  ["ares", "ARES", ["ares", "amateur radio emergency service", "emergency"]],
  ["races", "RACES", ["races", "radio amateur civil emergency service", "civil emergency"]],
  ["mars", "MARS", ["mars", "military auxiliary radio system", "military"]],
  ["cap", "Civil Air Patrol", ["cap", "civil air patrol"]],
  ["shares", "SHARES", ["shares", "shared resources", "hf", "emergency"]],
  ["observer", "Official Observer and Volunteer Monitor", ["observer", "volunteer monitor", "oo", "vm", "official observer"]],
  ["traffic", "National Traffic System", ["traffic", "nts", "messages", "radiogram", "national traffic system"]],
  ["forms", "Message forms, logs, and PACE plan", ["forms", "logs", "pace", "message", "log"]],
  ["weather", "Weather radio and storm reports", ["weather", "storm", "skywarn", "noaa", "weather radio"]],
  ["reference", "Glossary and review checklist", ["glossary", "checklist", "reference", "review", "terms"]]
];

const FIELD = {
  category: "FIELD",
  categoryName: "Field Reference",
  section: "AB9MZ Master Field Reference",
  version: "2.0",
  date: "2026-11-16",
  time: "22:18",
  author: "AB9MZ",
  status: "available"
};

const entries = [];
function add(e) { entries.push(e); }

/* ---- The whole kit: zip, read-me, full book in three formats ---- */
add(Object.assign({}, FIELD, {
  name: "AB9MZ Master Field Reference, complete kit — zip file",
  file: stamped("AB9MZ_Field_Reference_Complete_Kit", ".zip"),
  list: "field-kit",
  format: "Zip file",
  url: ZIP_POST,
  keywords: ["field reference", "kit", "zip", "complete", "whole book", "ab9mz", "download"],
  note: "The whole kit in one download: the full book, all 22 sections in all formats, the offline section selector, and the build files. The zip is still on Facebook Files for now — it is not yet in the field-reference repository."
}));
add(Object.assign({}, FIELD, {
  name: "AB9MZ Master Field Reference — read me first",
  file: stamped("READ_ME_FIRST", ".txt"),
  list: "field-kit",
  format: "Plain text",
  url: FR + "READ_ME_FIRST.txt",
  keywords: ["field reference", "read me", "readme", "how the kit is organized", "ab9mz"],
  note: "How the kit is organized and what is in it. Start here if you downloaded the zip."
}));
add(Object.assign({}, FIELD, {
  name: "AB9MZ Master Field Reference, full book — large-print PDF",
  file: stamped("AB9MZ_Amateur_Radio_Field_Reference", ".pdf"),
  list: "field-kit",
  format: "Large-print PDF",
  url: FR + "AB9MZ_Amateur_Radio_Field_Reference.pdf",
  keywords: ["field reference", "full book", "complete", "pdf", "large print", "ab9mz"],
  note: "The full book, all 22 sections, large-print PDF. 22 point text, 28 point headings."
}));
add(Object.assign({}, FIELD, {
  name: "AB9MZ Master Field Reference, full book — Word document",
  file: stamped("AB9MZ_Amateur_Radio_Field_Reference", ".docx"),
  list: "field-kit",
  format: "Word document",
  url: FR + "AB9MZ_Amateur_Radio_Field_Reference.docx",
  keywords: ["field reference", "full book", "complete", "word", "docx", "ab9mz"],
  note: "The full book, all 22 sections, Word document."
}));
add(Object.assign({}, FIELD, {
  name: "AB9MZ Master Field Reference, full book — tagged PDF",
  file: stamped("AB9MZ_Amateur_Radio_Field_Reference-tagged", ".pdf"),
  list: "field-kit",
  format: "Tagged PDF",
  url: FR + "tagged/AB9MZ_Amateur_Radio_Field_Reference.pdf",
  keywords: ["field reference", "full book", "complete", "tagged", "pdf", "screen reader", "ab9mz"],
  note: "The full book, all 22 sections, tagged PDF. Screen readers navigate it by heading."
}));

/* ---- The 22 sections, three formats each, in book order ---- */
const FORMATS = [
  ["Large-print PDF", ".pdf", "sections/", ["pdf", "large print"],
   "Large-print PDF. 22 point text, 28 point headings."],
  ["Word document", ".docx", "sections/", ["word", "docx"],
   "Word document."],
  ["Tagged PDF", ".pdf", "tagged/", ["tagged", "pdf", "screen reader"],
   "Tagged PDF. Screen readers navigate it by heading."]
];
SECTIONS.forEach(function (s) {
  const stem = s[0];
  const title = s[1];
  const keys = s[2];
  FORMATS.forEach(function (f) {
    const format = f[0];
    const ext = f[1];
    const folder = f[2];
    const formatKeys = f[3];
    const formatNote = f[4];
    const isTagged = format === "Tagged PDF";
    const fileStem = isTagged ? stem + "-tagged" : stem;
    add(Object.assign({}, FIELD, {
      name: title + " — " + format,
      file: stamped(fileStem, ext),
      list: "field-sections",
      subsection: stem,
      subsectionTitle: title,
      format: format,
      url: FR + folder + stem + ext,
      keywords: ["field reference"].concat(keys).concat(formatKeys),
      note: formatNote
    }));
  });
});

/* ---- Contests: the standing schedule, group-maintained ---- */
add({
  name: "Contest schedule — rolling 30-day window",
  file: "$Contest-Schedule.txt",
  category: "CNTST",
  categoryName: "Contests",
  section: "Contests",
  list: "cntst",
  format: "Plain text",
  url: "CNTST/$Contest-Schedule.txt",
  version: null,
  date: "2026-11-12",
  time: "10:00",
  author: null,
  keywords: ["contest", "schedule", "events", "on-air", "sweepstakes", "contests"],
  status: "available",
  maintained: true,
  note: "Group-maintained file. The standing contest and on-air events schedule, covering a rolling 30-day window. It is checked every morning and replaced with a new edition when the contest list changes or the edition is a week old."
});

/* ---- General: the index itself — this page replaces it ---- */
add({
  name: "Document index",
  file: "!Document-Index.txt",
  category: "GEN",
  categoryName: "General",
  section: "General",
  list: "gen",
  format: "Plain text",
  url: null,
  version: null,
  date: "2026-11-16",
  time: "20:41",
  author: null,
  keywords: ["index", "document index", "contents", "categories"],
  status: "superseded",
  maintained: true,
  note: "Group-maintained file. This page is now the document index, so the text file is no longer updated. Everything the index listed is on this page, with search and sort."
});

/* ---- Licensing and Exams: the Technician question pool ---- */
add({
  name: "Technician question pool 2026-2030 — plain text",
  file: "Technician-Question-Pool-2026-2030.txt",
  category: "LIC",
  categoryName: "Licensing and Exams",
  section: "Licensing and Exams",
  list: "lic",
  format: "Plain text",
  url: "LIC/Technician-Question-Pool-2026-2030.txt",
  version: null,
  date: "2026-11-16",
  time: "17:49",
  author: null,
  keywords: ["technician", "question pool", "exam", "license", "2026-2030", "questions", "licensing"],
  status: "available",
  note: "Public domain. The full 2026-2030 Technician question pool, all 409 questions, in plain text."
});
add({
  name: "Technician question pool 2026-2030 — Braille",
  file: "Technician-Question-Pool-2026-2030.brf",
  category: "LIC",
  categoryName: "Licensing and Exams",
  section: "Licensing and Exams",
  list: "lic",
  format: "Braille",
  url: TECH + "braille/Technician-Question-Pool-2026-2030.brf",
  version: null,
  date: "2026-11-16",
  time: "17:50",
  author: null,
  keywords: ["technician", "question pool", "exam", "license", "2026-2030", "braille", "brf", "licensing"],
  status: "available",
  note: "Public domain. The same question pool in contracted Braille (UEB grade 2), for Braille displays and embossers."
});

/* ---- Radios: the Tonne article — links to the author's own copy ---- */
add({
  name: "Improved audio-frequency bandpass filter for Morse code reception — Tonne",
  file: "Improved Audio-Frequency Bandpass Filter for Morse Code Reception - Tonne.pdf",
  category: "RADIO",
  categoryName: "Radios",
  section: "Radios",
  list: "radio",
  format: "PDF",
  url: "https://tonnesoftware.com/downloads/2017-mar-apr-qex-Tonne.pdf",
  version: null,
  date: null,
  time: null,
  author: null,
  keywords: ["tonne", "bandpass", "filter", "audio", "morse", "cw", "reception"],
  status: "available",
  note: "By James L. Tonne, W4ENE, QEX March/April 2017, copyright ARRL. The author hosts it himself, so the page links to his copy rather than hosting one. It is also still in the group's Facebook Files."
});

/* ---- Resources: the blind-population reference — Gregory's own graph, hosted ---- */
add({
  name: "Blind population distribution in the United States",
  file: "Blind-Population-Distribution.pdf",
  category: "RES",
  categoryName: "Resources",
  section: "Resources",
  list: "res",
  format: "PDF",
  url: "RES/Blind-Population-Distribution.pdf",
  version: null,
  date: null,
  time: null,
  author: null,
  keywords: ["blind", "population", "distribution", "statistics", "reference"],
  status: "available",
  note: "Made by Gregory AB9MZ from public data: data.gov, the World Health Organization (who.int), and resources from national blind organizations. Data as of May 29, 2025. The disability categories overlap, so the percentages add to more than 100."
});

/* ---- Counts must match the index exactly ---- */
if (entries.length !== 77) {
  throw new Error("expected 77 entries, built " + entries.length);
}
const byList = {};
entries.forEach(function (e) { byList[e.list] = (byList[e.list] || 0) + 1; });
const expected = { "field-kit": 5, "field-sections": 66, "cntst": 1, "gen": 1, "lic": 2, "radio": 1, "res": 1 };
Object.keys(expected).forEach(function (k) {
  if (byList[k] !== expected[k]) {
    throw new Error("list " + k + ": expected " + expected[k] + ", built " + (byList[k] || 0));
  }
});
const urls = entries.filter(function (e) { return e.url; }).map(function (e) { return e.url; });
if (new Set(urls).size !== urls.length) {
  throw new Error("duplicate URLs in library.json");
}

fs.writeFileSync(
  path.join(__dirname, "library.json"),
  JSON.stringify(entries, null, 2) + "\n",
  "utf8"
);
console.log("library.json written: " + entries.length + " entries");
console.log("by list: " + JSON.stringify(byList));
console.log("with download links: " + urls.length + "; without: " + (entries.length - urls.length));
