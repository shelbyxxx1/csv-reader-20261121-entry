[![make.fun · csv-reader-speed-01-run-20261121](https://make.fun/badge/csv-reader-speed-01-run-20261121.svg)](https://make.fun/bounty/csv-reader-speed-01-run-20261121?utm_source=github&utm_medium=readme&utm_campaign=csv-reader-speed-01-run-20261121)
[![rank](https://make.fun/badge/csv-reader-speed-01-run-20261121/shelbyxxx1/csv-reader-20261121-entry/rank.svg)](https://make.fun/bounty/csv-reader-speed-01-run-20261121/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=csv-reader-speed-01-run-20261121)
[![reward](https://make.fun/badge/csv-reader-speed-01-run-20261121/shelbyxxx1/csv-reader-20261121-entry/reward.svg)](https://make.fun/bounty/csv-reader-speed-01-run-20261121?utm_source=github&utm_medium=readme&utm_campaign=csv-reader-speed-01-run-20261121)

# Fast broken-CSV reader

A dependency-free JavaScript reader implementing csv-reader 1.0.0's string fields,
ragged-row repair, and ordered error reporting. Cached `indexOf` delimiter searches
and string slices avoid character-by-character field construction. Quoted fields
use quote searches, with normalization only when doubled quotes or CRs occur.
All parser state is local to each call.

Run with Node.js 22.18 or later:

```sh
node main.ts
```

The driver reads `/input/cases.json` and writes `/output/answers.json`.
For local runs, set `MAKEFUN_INPUT_DIR` and `MAKEFUN_OUTPUT_DIR` to existing directories.

Local verification on Node.js 22.23.5: all six practice cases, 110 edge checks, and
100,000 deterministic randomized inputs matched the reference. Median end-to-end
wall time over nine six-case runs was 617 ms versus the baseline's 1,584 ms (2.57×).
These are local measurements, not competition results. Docker was unavailable;
two empty-environment runs of a read-only copy matched the baseline byte-for-byte,
and the kit scorer reported 6/6 cases passed.
