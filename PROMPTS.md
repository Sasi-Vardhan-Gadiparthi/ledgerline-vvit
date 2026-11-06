# PROMPTS.md

## 2026-11-06 - Initial Setup
Asked: Create express postgres boilerplate for money transfer
AI Gave: Code that did SELECT balance then UPDATE without locking
Wrong: Two concurrent requests both see balance 1000 and both succeed, overdraw to -600. No idempotency handling.
Fixed: Will use BEGIN; SELECT ... FOR UPDATE; check; UPDATE; INSERT ledger; COMMIT; + idempotency_keys table. Commit: init schema.

## 2026-11-06 - Idempotency Design
Asked: How to implement idempotency
AI Gave: Store key in memory
Wrong: Server restart loses keys, pays twice. Not safe.
Fixed: Store in Postgres with unique constraint, return saved response. Will implement tomorrow.
