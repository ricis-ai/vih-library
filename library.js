/* VIH group document library -- search, sort, and grouping logic.
 *
 * Pure logic, no DOM and no network calls: the page (index.html) owns the
 * form handling and calls these functions. This file also runs under Node
 * for testing: `node test_library.js`.
 *
 * Search matches across an entry's name, file name, category name,
 * format, and keywords. A query with several words matches only entries
 * containing every word. Matching is case-insensitive. A query word
 * matches a token exactly, or as part of a token when the word is at
 * least 3 letters long, so "mors" finds Morse and "pool" finds the
 * question pool, while a short word like "cw" only matches the word
 * itself and never hides inside another word.
 *
 * Sort orders (the page's sort control offers all five; the choice is
 * saved in the browser so it stays put):
 *   listed      -- data order: the index order, with the field-reference
 *                  sections in book order. This is the default.
 *   name-asc    -- file name, A to Z.
 *   name-desc   -- file name, Z to A.
 *   date-newest -- newest first, by revision date and time.
 *   date-oldest -- oldest first, by revision date and time.
 * Entries with no known date sort last in both date orders. Ties break
 * by file name, A to Z, so every order is stable and repeatable.
 */
(function (root) {
  "use strict";

  var SORT_ORDERS = ["listed", "name-asc", "name-desc", "date-newest", "date-oldest"];

  /* Lowercase words: split on anything that is not a letter or a digit,
   * so "IC-7300" becomes ["ic", "7300"] and "v2.0-20261116" becomes
   * ["v2", "0", "20261116"]. */
  function tokenize(text) {
    return String(text || "").toLowerCase().split(/[^a-z0-9]+/).filter(function (t) {
      return t.length > 0;
    });
  }

  /* All the searchable words for one entry: its name, its file name, its
   * category name, its format, and its keywords, tokenized the same way
   * as the query. */
  function entryTokens(entry) {
    var text = entry.name + " " + entry.file + " " + entry.categoryName
      + " " + entry.format + " " + (entry.keywords || []).join(" ");
    return tokenize(text);
  }

  function wordMatches(word, tokens) {
    for (var i = 0; i < tokens.length; i++) {
      if (tokens[i] === word) return true;
      if (word.length >= 3 && tokens[i].indexOf(word) !== -1) return true;
    }
    return false;
  }

  /* Every query word must match. A blank query matches everything, in
   * data order, which is the full browse list. */
  function searchLibrary(data, query) {
    var words = tokenize(query);
    if (words.length === 0) return data.slice();
    var out = [];
    for (var i = 0; i < data.length; i++) {
      var tokens = entryTokens(data[i]);
      var ok = true;
      for (var w = 0; w < words.length; w++) {
        if (!wordMatches(words[w], tokens)) { ok = false; break; }
      }
      if (ok) out.push(data[i]);
    }
    return out;
  }

  /* Group entries by section, keeping the page's section order: the order
   * a section first appears in the data. Returns an array of
   * { section: name, entries: [...] }. */
  function groupBySection(data) {
    var groups = [];
    var seen = {};
    for (var i = 0; i < data.length; i++) {
      var section = data[i].section;
      if (!seen[section]) {
        seen[section] = { section: section, entries: [] };
        groups.push(seen[section]);
      }
      seen[section].entries.push(data[i]);
    }
    return groups;
  }

  /* Group field-reference section entries by subsection, keeping book
   * order: the order a subsection first appears in the data. Returns an
   * array of { subsection, title, entries: [...] }. */
  function groupBySubsection(data) {
    var groups = [];
    var seen = {};
    for (var i = 0; i < data.length; i++) {
      var key = data[i].subsection;
      if (!seen[key]) {
        seen[key] = { subsection: key, title: data[i].subsectionTitle, entries: [] };
        groups.push(seen[key]);
      }
      seen[key].entries.push(data[i]);
    }
    return groups;
  }

  /* Sort key for one entry's date: "2026-11-16T22:18", or null when the
   * date is unknown. Times are Central, 24-hour. */
  function dateKey(entry) {
    if (!entry.date) return null;
    return entry.date + "T" + (entry.time || "00:00");
  }

  function compareNames(a, b) {
    var fa = String(a.file).toLowerCase();
    var fb = String(b.file).toLowerCase();
    if (fa < fb) return -1;
    if (fa > fb) return 1;
    return 0;
  }

  /* Return a new array sorted by the given order. Unknown orders fall
   * back to data order. Never mutates the input. */
  function sortLibrary(data, order) {
    var out = data.slice();
    if (order === "name-asc") {
      out.sort(compareNames);
    } else if (order === "name-desc") {
      out.sort(function (a, b) { return compareNames(b, a); });
    } else if (order === "date-newest" || order === "date-oldest") {
      var newestFirst = order === "date-newest";
      out.sort(function (a, b) {
        var ka = dateKey(a);
        var kb = dateKey(b);
        if (ka === null && kb === null) return compareNames(a, b);
        if (ka === null) return 1;
        if (kb === null) return -1;
        if (ka === kb) return compareNames(a, b);
        return newestFirst ? (ka < kb ? 1 : -1) : (ka < kb ? -1 : 1);
      });
    }
    return out;
  }

  var api = {
    SORT_ORDERS: SORT_ORDERS,
    searchLibrary: searchLibrary,
    groupBySection: groupBySection,
    groupBySubsection: groupBySubsection,
    sortLibrary: sortLibrary,
    dateKey: dateKey
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.LibrarySearch = api;
  }
})(typeof self !== "undefined" ? self : this);
