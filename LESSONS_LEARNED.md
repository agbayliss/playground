# Lessons Learned

## WebMCP

### Fundamentals

**What it is:** A browser-based standard (not the same as Anthropic's MCP) that lets websites expose structured tools to AI agents. Joint Google/Microsoft project under W3C standardization. Runs client-side via `navigator.modelContext`.

**Two APIs:**
- **Declarative** — Add `toolname`/`tooldescription` to a `<form>` tag. Browser auto-generates JSON schema. Zero JS required. Best for simple form-based actions.
- **Imperative** — Use `navigator.modelContext.registerTool()` with name, description, inputSchema, and execute function. Returns structured data. Best for dynamic workflows and tool chaining.

### Tool Design Principles

#### Tool chaining is implicit, not configured
The agent infers call order from tool descriptions and `required` fields in inputSchema. If a tool says "requires an ID — use search_aliens first to find IDs," the agent follows the hint. Vague descriptions lead to unreliable behavior. Tool descriptions are prompt engineering for the agent.

#### Design tools around how users think, not how data is structured
Users come in "sideways" — e.g., asking by name when the tool only accepts IDs. Fix: accept multiple input types and let the execute function figure out which one it got. Every time an agent says "I can't do that" is a signal that the tool's input design is too rigid.

#### `enum` vs free-text tradeoff
Use `enum` for fixed, known sets (reliable but rigid). Use free-text `description` with examples for flexible/numerous values (forgiving but less predictable). Partial matching via `.includes()` works well for free-text.

#### Synonym handling
The LLM usually makes semantic leaps (e.g., "calm" → `gentle`) based on enum options. To make this more reliable, add synonym hints in the `description` field — e.g., "'gentle' includes calm, loving, docile, and sweet-natured aliens." No special WebMCP feature needed.

#### `toolautosubmit` and human-in-the-loop
Without it: agent fills form, user must click submit (safer). With it: agent fills AND submits. Key learning: the agent may claim it submitted even when it only filled fields. Fix by being explicit in `tooldescription` — e.g., "This tool ONLY fills fields, it does NOT submit."

### Spec vs Reality (as of March 2026)

#### Declarative API events don't fire reliably
The spec defines `toolactivated`, `toolcancel`, `SubmitEvent.agentInvoked`, and `SubmitEvent.respondWith()`. In practice, these don't fire reliably in current Chrome Canary builds. Workaround: poll form field values every 500ms and log changes as detected.

#### Declarative tool logging requires a workaround
Imperative tools can log directly inside their `execute` function. Declarative tools have no hook. Workaround: snapshot all field values on page load, then poll for differences on an interval to catch programmatic changes that don't fire normal `input` events.

### Bugs & Fixes

#### `let` hoisting issue on index.html
`renderCatalog()` called `closeDetail()` on initial load, but `closeDetail` referenced `currentDetailId` declared with `let` further down. `let` isn't hoisted like `function` — caused "Cannot access before initialization" error. Fix: moved `let currentDetailId = null;` above `renderCatalog`.

#### GitHub authentication
GitHub no longer accepts passwords — must use a PAT. Generate at: GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic). Scope: `repo`. Cursor won't move when pasting (security feature). Credentials cached after first push.

#### Repository URL mismatch
After cloning with placeholder username, remote URL was wrong. Fix: `git remote set-url origin https://github.com/actual-username/actual-repo.git`. Always check `git remote -v` if push fails.

#### Cowork can't `git push`
The Cowork sandbox doesn't have cached GitHub credentials, so `git push` fails with "could not read Username." Commits are made locally but you need to run `git push` from your own terminal to deploy. Always check `git status` after committing — "Your branch is ahead of origin/main" means it hasn't been pushed yet.

## Bookmarklets

### Encoding a bookmarklet in an HTML `href`
Bookmarklet code lives inside `href="javascript:..."` on an `<a>` tag. Key constraints: double quotes inside the JS conflict with the HTML attribute quotes, so use single quotes throughout the JS or URL-encode them. `&` must be `%26`, `#` must be `%23`. Naive auto-minification breaks quoted CSS selector strings — hand-minification or careful escaping is safer for bookmarklets with complex selectors.

### Layered DOM selector strategy
AI platforms change their markup frequently. Rather than relying on a single fragile selector, use a layered fallback approach: try the most specific selectors first (semantic class names like "source"/"citation"), then structural selectors (role="dialog", panels, drawers), then platform-specific patterns, then a broad content-area sweep. Stop as soon as you get ≥2 results to avoid noise from the broader layers.
