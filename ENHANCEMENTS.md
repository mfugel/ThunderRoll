# Thunderoll — Enhancement Backlog

Ideas to implement later. Not promises, not deadlines — just a queue so nothing gets lost.

## Shipped

### Exact-Score Win + Partial Combos (2026-05-17)

Shipped as a setup toggle: **Exact-Score Win — must hit target exactly; partial combos allowed.**

Design decisions made during implementation (the unresolved questions in the original proposal, now answered):

- **Overshoot when banking would exceed the target** — Bank is disabled when projected total > winScore. Player must keep rolling (or bust).
- **Forced reroll on partial selection is strict — no exception.** If any scoring die is unselected, Bank is disabled. Even if the current selection happens to project to the exact target, the player must still roll the leftover scoring dice (which sometimes busts the turn). The only path to winning is to roll dice whose scoring total equals the headroom exactly, take all of them, and bank. *(Earlier shipping had a "partial selection lands on target" exception; removed per Mark's direction — the strict version is the intended rule.)*
- **"One last turn" courtesy is skipped** — under exact-score, the first player to hit the target wins immediately. Overshoot is already prevented at bank time, so == is the only way to cross.
- **Break-in rule interacts independently** — break-in still requires the threshold in a single turn; exact-score doesn't override it.
- **Roll that would push you over no matter what** — auto-busted. After a roll resolves, if no scoring subset fits within the headroom, the roll is treated as a BUST (with a distinct "Every combo would overshoot the target" message and "OVERSHOOT BUST" subtitle). Avoids forcing the player into a guaranteed-loss reroll loop.
- **Click protection** — clicks that would push the current selection past the target are silently rejected with a brief "Can't take that — would overshoot" hint; the player can't accidentally lock themselves out via the UI.

AI changes: when this rule is on, Thunderbot brute-forces the 2^n subsets of the current roll's scoring dice (n ≤ 6 → 64 max) and picks the highest-scoring subset that doesn't overshoot. Falls back to the smallest scoring subset when every option overshoots.

Rule-hint UI: when exact-score is on, the hint line shows "Need exactly N more to hit X" / "On target — bank to win!" / "Over the target by N — can't bank, must reroll."

## Rule variations (proposed)

*(none currently queued)*
