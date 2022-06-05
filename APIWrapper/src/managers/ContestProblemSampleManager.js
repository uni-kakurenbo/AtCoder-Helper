"use strict";

const { CachedManager } = require("./CachedManager");
const { ContestProblemSample } = require("../structures/ContestProblemSample");

const { RawContestProblemSampleDataProvider } = require("../providers/RawContestProblemSampleDataProvider");
const { ContestProblemSampleDataScraper } = require("../scrapers/ContestProblemSampleDataScraper");

class ContestProblemSampleManager extends CachedManager {
  constructor(problem, iterable) {
    super(problem.client, ContestProblemSample, iterable);

    this.problem = problem;
    this.provider = new RawContestProblemSampleDataProvider(this);
    this.scraper = new ContestProblemSampleDataScraper(this);
  }

  async fetch(problem, { cache = true, force = false, all = true } = {}) {
    const id = this.resolver.resolveId(problem)?.toLowerCase();

    if (!force) {
      const existing = this.cache.get(id);
      if (existing) return existing;
    }

    return this._add(await this.provider.fromId(id, { cache, force, all }), cache, { extras: [this.problem] });
  }

  async exists() {
    return this.scraper.exists();
  }
}

module.exports = { ContestProblemSampleManager };
