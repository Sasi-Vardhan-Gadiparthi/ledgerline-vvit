# LedgerLine VVIT - Secure AI Ledger System
### VVIT Nambur | Snovasys Internship Project | Sasi Vardhan Gadiparthi

**Secure Node.js backend for AI-powered financial ledger with prompt injection protection.**

### 🚀 Features
- **Secure AI Backend:** Prompt injection defense middleware blocks `ignore previous instructions`, `system prompt`, `jailbreak` attacks
- **Concurrency Control:** `test_concurrency.js` simulates 50 parallel ledger transactions with locking
- **Immutable Audit Trail:** `schema.sql` with double-entry bookkeeping and hash-chained logs
- **Threat Model:** Documented OWASP LLM Top 10 mitigations in `THREATS.md`
- **Secure Prompts:** `PROMPTS.md` with least-privilege AI prompts

### 🛡️ Security Architecture
Request -> `middleware/security.js` (detectInjection) -> `index.js` -> DB
- Input sanitization (1000 char limit)
- Regex pattern matching for injection
- 403 block on suspicious prompts

### 📁 Project Structure
