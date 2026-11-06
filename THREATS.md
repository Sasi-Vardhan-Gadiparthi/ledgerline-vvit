# THREATS.md - Day 1 Thinking

## Threats Identified
1. Race condition - two withdrawals at same time can overdraw
2. Double spend - retry with same request pays twice
3. Auth bypass - user moves money from other's account
4. Ledger tampering - UPDATE/DELETE ledger row
5. Negative balance via concurrent requests

## Mitigations Planned
- SELECT FOR UPDATE row locking
- Idempotency-Key table
- Server-side authorization check on every request
- Append-only ledger (only INSERT allowed)
- Atomic transaction for all money moves
