# Thunderoll — Enhancement Backlog

Ideas to implement later. Not promises, not deadlines — just a queue so nothing gets lost.

## Shipped

### Exact-Score Win + Partial Combos (2026-05-17)

Shipped as a setup toggle: **Exact-Score Win — must hit target exactly; partial combos allowed.**

Design decisions made during implementation (the unresolved questions in the original proposal, now answered):

- **Overshoot when banking would exceed the target** — Bank is disabled when projected total > winScore. Player must keep rolling (or bust).
- **Exception to "forced reroll on partial selection"** — if the current selection lands the projected total *exactly* on the target, Bank is enabled even with scoring dice left unselected. Without this exception many exact wins would be unreachable (e.g. roll 1-5 needing 100, must take just the 1 and bank).
- **"One last turn" courtesy is skipped** — under exact-score, the first player to hit the target wins immediately. Overshoot is already prevented at bank time, so == is the only way to cross.
- **Break-in rule interacts independently** — break-in still requires the threshold in a single turn; exact-score doesn't override it.
- **Roll that would push you over no matter what** — the AI takes the smallest scoring subset to minimize damage, then is forced to keep rolling (Bank stays disabled). Human players see the same overshoot lock and must keep rolling. There's no auto-bust; the bust comes naturally from the forced rerolls.

AI changes: when this rule is on, Thunderbot brute-forces the 2^n subsets of the current roll's scoring dice (n ≤ 6 → 64 max) and picks the highest-scoring subset that doesn't overshoot. Falls back to the smallest scoring subset when every option overshoots.

Rule-hint UI: when exact-score is on, the hint line shows "Need exactly N more to hit X" / "On target — bank to win!" / "Over the target by N — can't bank, must reroll."

## Rule variations (proposed)

*(none currently queued)*
