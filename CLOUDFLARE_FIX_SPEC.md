# HAxBRO AI — Cloudflare Compatibility & Fix Specification

## MASTER DIRECTIVE

This document defines the required final state of HAxBRO AI after migration to Cloudflare.

The implementation must inspect the existing repository and correct **all compatibility problems**, not just the first error encountered.

Do not patch individual symptoms while leaving the underlying architecture broken.

The final application must be a fully functional Cloudflare-compatible HAxBRO AI application.

---

# 1. PRODUCT GOAL

HAxBRO AI is a futuristic AI workspace.

It is not merely a marketing website.

The final Cloudflare deployment must allow a user to:

* enter HAxBRO AI
* use the AI chat
* create new conversations
* retain conversation context
* switch AI modes
* use specialist agents
* use coding tools
* use research tools
* use cybersecurity tools
* use creative tools
* use visual/image functionality
* use voice functionality where supported
* use Prompt Maker
* use Project Maker Helper
* use Code Writer
* use KAI orchestration
* use light/dark mode
* use the application on desktop and mobile

The marketing page may exist at the public root, but clicking **Enter HAxBRO AI** must reliably open the actual application.

---

# 2. CRITICAL CURRENT PROBLEM

The Cloudflare deployment currently has an application-loading failure.

Observed behavior:

```text
User opens HAxBRO
        ↓
Application appears briefly
        ↓
Application disappears
        ↓
Marketing/login page appears
```

This happens because the application performs startup/session checks against backend routes that have not been fully migrated to Cloudflare.

The migration must eliminate this class of failure completely.

---

# 3. SESSION ROUTE PROBLEM

The existing application calls:

```text
/api/session
```

from the application frontend.

The Cloudflare deployment must provide a compatible implementation.

The frontend must never assume that an old Hatchable endpoint exists.

If `/api/session` is required, create the corresponding Cloudflare Function.

Expected architecture:

```text
public/app/index.html
        ↓
/api/session
        ↓
Cloudflare Function
        ↓
Cloudflare-compatible authentication/session logic
```

The function must return predictable JSON.

Example:

```json
{
  "ok": true,
  "signedIn": true,
  "user": {
    "name": "username"
  }
}
```

If username-only authentication is being used, do not require Google/Gmail authentication.

---

# 4. LOGIN REDIRECT PROBLEM

The existing application contains fallback behavior that redirects to:

```text
/login?next=/app/
```

when the session request fails.

This must not turn a backend migration failure into a misleading login redirect.

The implementation must distinguish:

```text
Unauthenticated user
```

from:

```text
Backend/session service unavailable
```

A server failure must not masquerade as a user logout.

Example behavior:

```text
session valid
→ open app

session says unauthenticated
→ open login

session API fails
→ show controlled error/retry state
→ DO NOT silently redirect to marketing
```

---

# 5. ROUTE COMPATIBILITY

Every frontend API request must have a corresponding Cloudflare Function.

Before deployment, scan the frontend for:

```text
fetch(
XMLHttpRequest
/api/
location.href
location.replace
location.assign
forms
WebSocket
```

Build a route inventory.

Every required route must either:

1. exist as a Cloudflare Function, or
2. be replaced with a deliberate Cloudflare-compatible implementation.

Do not leave dead API calls.

---

# 6. HATCHABLE DEPENDENCY PROBLEM

Cloudflare runtime code must not depend on:

```js
import { db } from 'hatchable'
import { ai } from 'hatchable'
import { browser } from 'hatchable'
import { storage } from 'hatchable'
```

The Cloudflare application must run independently.

Hatchable must remain untouched.

Do not solve Cloudflare problems by reintroducing Hatchable dependencies.

---

# 7. NODE RUNTIME PROBLEM

Cloudflare Functions must not depend on Node-only assumptions.

Remove or replace incompatible usage of:

```text
require()
process.env
fs
net
child_process
Node-specific modules
```

Use:

```js
context.env
context.request
fetch()
Web APIs
Cloudflare bindings
```

where appropriate.

---

# 8. API HANDLER PROBLEM

Legacy handlers such as:

```js
async function(req, res)
```

must not be copied into Cloudflare Functions.

Use Cloudflare's function model:

```js
export async function onRequest(context) {
  const { request, env } = context;
}
```

or:

```js
export async function onRequestPost(context) {
  const { request, env } = context;
}
```

---

# 9. AI PROVIDER PROBLEM

The old architecture must not depend on one AI provider.

The final provider chain is:

```text
OpenRouter
    ↓
Groq
    ↓
OpenAI
    ↓
Google Gemini
    ↓
Mistral
    ↓
KAI final fallback/orchestration
```

If one provider fails, automatically continue to the next provider.

The UI must remain functional.

---

# 10. PROVIDER ERROR PROBLEM

Never expose raw provider errors to users.

Bad:

```text
OpenAI 401
fetch failed
TypeError
undefined
```

Good:

```text
The current AI provider is unavailable.
Trying another provider…
```

If all providers fail:

```text
AI service is temporarily unavailable.
Please try again shortly.
```

---

# 11. FIVE SPECIALIST AGENTS

The system must use five task-specialized agents.

## Visual Agent

Handles:

* image understanding
* screenshots
* visual reasoning
* visual debugging
* image generation orchestration

## Coding Agent

Handles:

* programming
* debugging
* refactoring
* architecture
* code review
* implementation

## Knowledge Agent

Handles:

* research
* web research
* facts
* documentation
* summarization
* comparisons

## Cybersecurity Agent

Handles:

* defensive security
* secure coding
* threat modeling
* vulnerability analysis
* incident analysis
* CVE analysis

## Creative Agent

Handles:

* writing
* advertising
* marketing
* scripts
* content
* creative concepts

KAI decides which specialist should handle a request.

---

# 12. KAI PROBLEM

KAI must be the orchestration layer.

Architecture:

```text
User
 ↓
KAI
 ↓
Task Classification
 ↓
Specialist Agent
 ↓
Provider Router
 ↓
Provider
 ↓
Fallback if required
 ↓
KAI
 ↓
User
```

KAI must not expose internal provider information unnecessarily.

KAI must enforce authorization before sensitive operations.

---

# 13. AUTHORIZATION PROBLEM

Authorization must be centralized.

The system must:

* fail closed
* validate capabilities
* validate requested actions
* validate targets
* protect destructive operations
* require confirmation where appropriate
* reject unauthorized requests

No individual API route should invent its own inconsistent authorization system.

---

# 14. SECURITY TARGET PROBLEM

Security tools must block dangerous internal targets.

Block:

```text
localhost
127.0.0.1
0.0.0.0
::1
private network ranges
cloud metadata endpoints
```

Security functionality is for authorized defensive use.

Do not create uncontrolled exploitation functionality.

---

# 15. DESTRUCTIVE ACTION PROBLEM

Dangerous operations require confirmation.

Examples:

```text
delete
destroy
reset
credential changes
infrastructure changes
destructive deployment
```

Informational operations may execute normally.

---

# 16. FRONTEND FAILURE PROBLEM

The frontend must never disappear because one API request fails.

Bad:

```text
API failure
→ exception
→ redirect
→ marketing page
```

Correct:

```text
API failure
→ controlled error state
→ retry
→ preserve application UI
```

The application shell must remain visible even when a backend service is temporarily unavailable.

---

# 17. MARKETING PAGE PROBLEM

The root marketing page and application must be clearly separated.

Expected:

```text
/
    → marketing page

/app/
    → HAxBRO application
```

The Enter button must point to the application.

It must not create an accidental redirect loop.

The application must never redirect back to the marketing page because of a temporary API failure.

---

# 18. APPLICATION STARTUP

Application startup must follow:

```text
Load HTML
 ↓
Render application shell immediately
 ↓
Initialize local state
 ↓
Initialize session
 ↓
Initialize AI services
 ↓
Initialize optional tools
```

Optional services failing must not prevent the main UI from loading.

---

# 19. CHAT

Chat must support:

* Normal mode
* Beast mode
* Hacker mode
* conversation history
* context
* streaming where supported
* provider fallback
* specialist routing
* controlled errors

The composer must always remain available.

---

# 20. UI REQUIREMENT

The old UI must not simply be copied into Cloudflare.

The final UI must be redesigned as a futuristic AI workspace.

Use:

* smooth animations
* subtle gradients
* modern glass effects
* polished buttons
* clear hierarchy
* responsive panels
* clean typography
* intelligent loading states
* micro-interactions
* modern empty states

Avoid:

* clunky old panels
* obsolete visual components
* excessive neon
* distracting animations
* broken mobile layouts

---

# 21. MOBILE REQUIREMENT

Mobile must work independently.

Required:

* hamburger sidebar
* compact composer
* compact microphone
* arrow send button
* touch-friendly controls
* no horizontal overflow
* no accidental input zoom
* responsive dialogs
* responsive agent panels

---

# 22. ANIMATION REQUIREMENT

Animations should include:

* message entrance
* sidebar open/close
* modal transitions
* agent selection
* loading states
* provider fallback state
* theme transitions
* button feedback

Support:

```css
@media (prefers-reduced-motion: reduce)
```

Animations must never block functionality.

---

# 23. CODE WRITER

Code Writer must support:

* large code generation
* multiple files
* copy buttons
* syntax highlighting
* structured output
* language detection

Do not execute arbitrary generated code automatically.

Do not restore the old broken Python executor.

---

# 24. PROMPT MAKER

Keep the name:

**Prompt Maker**

It generates:

* app prompts
* implementation specifications
* coding prompts
* architecture prompts
* agent prompts
* deployment specifications

It must not falsely claim that it deployed an application when it only generated a specification.

---

# 25. PROJECT MAKER HELPER

Project Maker Helper should:

* open as its own workspace/tab
* generate project specifications
* help plan architecture
* create implementation plans
* work independently from the normal chat

---

# 26. IMAGE FEATURES

Image functionality must work through the Visual Agent.

Support where available:

* gallery upload
* camera
* screenshots
* image analysis
* image generation

Failures must show controlled UI states.

---

# 27. VOICE

Voice interaction should behave like a modern AI assistant:

```text
Press microphone
 ↓
Recording
 ↓
Stop
 ↓
Transcription
 ↓
AI processing
 ↓
Response
```

Do not permanently activate the microphone.

---

# 28. THEMES

Support:

```text
Dark
Light
```

Mode colors:

```text
Normal → Blue
Beast → Orange
Hacker → Red
```

Theme changes must be smooth and persistent.

---

# 29. LOGIN

Do not add Google/Gmail login.

The intended login is username-based.

Do not introduce OAuth merely to make the application look more advanced.

---

# 30. SECRET MANAGEMENT

Secrets must remain server-side.

Expected provider secrets:

```text
OPENROUTER_API_KEY
GROQ_API_KEY
OPENAI_API_KEY
GOOGLE_API_KEY
MISTRAL_API_KEY
```

Never:

* hard-code keys
* expose keys to frontend
* put keys in localStorage
* put keys in URLs
* return keys from APIs

---

# 31. LOGGING

Internal logs should record:

```text
request
classification
agent
provider
model
latency
fallback
authorization
errors
```

Do not show these internal details in ordinary user chat.

---

# 32. FUTURE-PROOF ARCHITECTURE

The final architecture must allow future additions without rewriting the whole system:

* additional AI providers
* local models
* RAG
* knowledge bases
* agent memory
* voice generation
* video generation
* advanced visual tools
* additional specialist agents
* team workspaces
* billing
* analytics
* custom agents

---

# 33. CLOUDFLARE REQUIREMENT

The entire production application must be compatible with:

```text
Cloudflare Pages
Cloudflare Pages Functions
Cloudflare environment variables/secrets
Cloudflare-compatible Web APIs
```

The Cloudflare deployment must include all required Functions.

Do not deploy a frontend-only shell while leaving the required backend routes missing.

---

# 34. AUTOMATIC COMPATIBILITY AUDIT

Before considering the migration complete, inspect the entire repository for:

```text
/api/
fetch('/api/
fetch("/api/
location.replace
location.assign
window.location
Hatchable imports
process.env
require(
fs.
net
child_process
browser
db
ai
storage
```

Every discovered dependency must be deliberately handled.

Do not assume that the currently known problem list is complete.

---

# 35. ROUTE AUDIT

Create a complete route map:

```text
Frontend request
      ↓
Required API route
      ↓
Cloudflare Function
      ↓
Cloudflare-compatible implementation
```

Any missing link is a migration bug.

---

# 36. NO SILENT FALLBACK

Never allow this:

```text
App
 ↓
error
 ↓
marketing page
```

Instead:

```text
App
 ↓
error
 ↓
error UI
 ↓
retry
```

The user must know they are still inside HAxBRO.

---

# 37. FINAL ACCEPTANCE TEST

The deployment is considered successful only if:

### Entry

```text
/
 ↓
Enter HAxBRO AI
 ↓
/app/
 ↓
application stays open
```

### Session

```text
/app/
 ↓
/api/session
 ↓
valid JSON
 ↓
application remains visible
```

### Chat

```text
message
 ↓
/api/chat
 ↓
specialist
 ↓
provider
 ↓
fallback if necessary
 ↓
response
```

### Provider failure

```text
Provider unavailable
 ↓
next provider
 ↓
response
```

### Total provider failure

```text
controlled error
```

### Security

```text
unauthorized action
 ↓
rejected
```

### Mobile

```text
open
 ↓
login/session
 ↓
chat
 ↓
send
 ↓
response
```

All must work.

---

# 38. MOST IMPORTANT RULE

Do not merely fix the exact error currently visible.

**Audit the entire application for the same underlying class of problem.**

If `/api/session` is missing, inspect all other `/api/*` dependencies.

If one Hatchable import exists, inspect every Cloudflare runtime file for Hatchable imports.

If one Node-only API exists, audit all backend files for Node-only APIs.

If one redirect causes the application to disappear, audit every authentication and startup redirect.

---

# 39. FINAL GOAL

The finished HAxBRO AI Cloudflare deployment must feel like:

> **A real futuristic AI operating system running on Cloudflare.**

Not:

> **A partially migrated old Hatchable application.**

The implementation should preserve the useful identity and functionality of HAxBRO AI while replacing obsolete architecture, broken dependencies, missing routes, outdated UI behavior, and fragile startup logic.

**Build for the final architecture, not the temporary error.**
