// Snovasys Secure AI Backend - Prompt Injection Defense
const BLOCKED_PATTERNS = [
  /ignore previous instructions/i,
  /ignore all instructions/i,
  /system prompt/i,
  /you are now/i,
  /reveal your prompt/i,
  /disregard/i,
  /jailbreak/i,
  /DAN mode/i,
  /pretend you are/i
];

const BLOCKED_WORDS = ["ignore", "system:", "jailbreak", "exfiltrate"];

function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return '';
  return input.trim().slice(0, 1000);
}

function detectInjection(prompt) {
  const cleanPrompt = sanitizeInput(prompt).toLowerCase();
  
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(cleanPrompt)) {
      return { isInjection: true, reason: `Blocked pattern: ${pattern}` };
    }
  }
  
  if (cleanPrompt.length > 500) {
    const suspiciousCount = BLOCKED_WORDS.filter(w => cleanPrompt.includes(w)).length;
    if (suspiciousCount >= 2) {
      return { isInjection: true, reason: "Multiple suspicious keywords" };
    }
  }
  
  return { isInjection: false };
}

function securityMiddleware(req, res, next) {
  const userPrompt = req.body?.prompt || req.body?.message || "";
  
  const result = detectInjection(userPrompt);
  
  if (result.isInjection) {
    console.warn(`[SECURITY] Blocked injection: ${result.reason}`);
    return res.status(403).json({
      error: "Security violation detected",
      message: "Your request contains blocked content. Please rephrase.",
      blocked: true
    });
  }
  
  next();
}

module.exports = { securityMiddleware, detectInjection, sanitizeInput };
