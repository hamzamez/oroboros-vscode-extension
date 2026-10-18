# Spec-check: j.md → `syntaxes/Oroboros.tmLanguage.json`

Maps each section of the Oroboros J-surface spec (`docs/spec/j.md`) to the
grammar rule(s) that implement its token scoping. Use when editing the
grammar to confirm every spec requirement still has a corresponding rule,
and to find which rule owns a particular token.

The grammar is a **TextMate highlighter**, not a parser. It cannot enforce
precedence (§3), well-formedness (J1–J9, §5), or layout (§6); those are
meaning, not syntax. What it *can* do — and what this table tracks — is
assign the right **scope** to each lexical token so themes color it the way
a reader would expect.

Legend for "rule" column: repo rules are `#name`; top-level `patterns`
entries are listed by their include name.

---

## §1 Lexical structure

| Spec requirement | Grammar rule(s) | Notes |
|---|---|---|
| **§1.1** UTF-8 / bidirectional controls refused | n/a | Lexing concern, not a scope; onigasm regexes simply never match U+202A–202E. |
| **§1.2** Comment `//` to EOL; no block/datum comments | `#comment` | Single rule; matches `//.*$` only. No other comment forms exist, per spec. |
| **§1.3** identifier (UAX #31, optional trailing `?`) | `#identifier` | `[A-Za-z_$][A-Za-z0-9_\-]*` + trailing `?`. |
| **§1.3** quoted name `` `…` `` | `#quoted-name` | Used for host operators `` go.`>=` ``, repr ops `` `big+` ``. |
| **§1.3** integer / float | `#literal` | decimal; float `0.5` `1.5e-3`; `+inf`/`-inf` → `constant.other.infinity`. |
| **§1.3** string `"` with 6 escapes + `\u{H}` | `#string` | escapes + `\u{…}`; host template = string. |
| **§1.3** tag `'name` (apostrophe + identifier) | `#tags` | `constant.other.tag`. |
| **§1.3** prime `x'` (apostrophe after identifier) | `#tags` shares `'` | Spec distinguishes by one char before/after; grammar uses the same rule — a prime after an identifier is rare in source and reads as a tag start; acceptable for highlighting. |
| **§1.4** reserved words (`fn spec lemma set array map var loop again case if else try expect assert use module provides private export axiom true false`) | `#declaration`, `#statement`, `#control`, `#loop`, `#use`, `#module`, `#provides`, `#literal` | Each reserved word is matched in the context where it's a keyword; `true`/`false` via `#literal`. |
| **§1.4** contextual words (`where ensure invariant pure index variadic inout out linear as host expr stmt import lib checked jump comma_ok success relevant` + model-data words) | `#clause`, `#markers`, `#parameter-list`, `#host-body`, `#target-data`, `#decl-modifier` | Contextual = keyword only in clause positions; `#markers`/`#clause` cover the declaration/header positions. |
| **§1.5** spelling: `-`→`_`; quoted names; `σ_J` | n/a | Orthography, not tokenization. |
| **§1.6** math symbols **and** their TLA+ ASCII spellings | `#set-operators` | Both the Unicode symbol *and* the `\`-prefixed ASCII form tokenize as `keyword.operator.set`. See "TLA+ ASCII fix" below. |
| **§1.6** ASCII operators and punctuation | `#operators` | maximal-munch order respected: `...` before `..` before `.`, `:=` before `:`, `==` before `=`, `<=>` before `<=`, `=>` before `=`, `->` before `-`. |
| **§1.7** newline-ends-statement rule | n/a | Grammar is line-oriented; the "cannot end here" cases are about parsing, not scoping. |

### TLA+ ASCII operators (spec §1.6) — fix applied

The spec table:

| symbol | ASCII |
|---|---|
| `∈` `∉` | `\in` `\notin` |
| `∪` `∩` `∖` | `\cup` `\cap` `\` |
| `⊆` `⊂` | `\subseteq` `\subset` |
| `∀` `∃` | `\A` `\E` |
| `⇒` `⇔` | `=>` `<=>` |
| `×` | `\X` |

`#set-operators` now matches **both** the Unicode symbol (one regex
alternative) and the backslash-prefixed ASCII spelling (another), so either
form in a source file is highlighted identically. The set-difference ASCII
form is a bare backslash `\` (followed by a space in use); the regex
handles `\` as a literal backslash. `=>` / `<=>` are matched by the same
rule.

## §2 Grammar (forms)

| Spec form | Grammar rule(s) | Notes |
|---|---|---|
| **§2.1** `use path [as ident]` | `#use` + `#use-path` + `#module-path` | `as` → `keyword.control.import.as`; path → `support.module`. |
| **§2.1** `module path { item* }` | `#module` | begin/end on `module` … `}`. |
| **§2.1** `provides ident path { item* }` | `#provides` | Same shape; keyword → `keyword.module`. |
| **§2.2** `fn/spec/lemma/set` declarations | `#declaration` + `#declaration-body` | visibility `private`/`export` → `keyword.other.visibility`. |
| **§2.2** parameter/result lists | `#parameter-list`, `#result-list` | `∈`/`⊆` ownership → `keyword.operator.ownership`. |
| **§2.2** clauses `where/ensure/invariant/pure/index/variadic` | `#clause`, `#markers` | formula positions include `#formula`. |
| **§2.2** markers `success tag` / `relevant` | `#markers` | `success`/`relevant` → `keyword.other.modifier`. |
| **§2.2** `value_decl` `binder = (expr \| host_body)` | `#value-declaration` | Top-level `Name = …`. |
| **§2.2** `axiom expr` | `#axiom` | `T ⊆ I` style. |
| **§2.5** host body `{ host [expr\|stmt] "…" clauses }` | `#host-body` + `#host-clause` | `expr`/`stmt` → `keyword.other.host-kind`; `import/lib/checked/jump/comma_ok` clauses → `keyword.other.host-clause`. |
| **§2.6** block/statement (`var`, `:=`, local `fn`, `expect`, `assert`, write) | `#block` + `#statement` | `var` → `keyword.other.var`; `expect/assert/ignore` → `keyword.other.statement`; `loop/case/if/else/when/again` → control keywords. |
| **§2.7** expressions, application, indexing, lambda, `if`, former, `map(…)` | `#expression`, `#loop`, `#case`, `#set-former` | `fn` lambda → `#control` `#lambda`. |
| **§2.8** `case`/`loop`/`try`/`expect` | `#case`, `#loop`, `#control` (`try`/`expect`/`assert`/`ignore`) | arms, `->`, `else`, `invariant`, `again` positional. |
| **§2.9** set formers `array/set/map { … }`, ranges `lo..hi` | `#set-former`, `#range` | `range` handles `-2^63..2^63-1`, `+inf`, `-inf`. |
| **§2.10** formulas, quantifiers `∀/∃ :`, `⇒ ⇔` | `#formula` + `#set-operators` | claim positions. |
| **§2.11** host templates `${x}`, `${#}`, `${r:b}`, `$${` | `#string` (splice sub-pattern) | `${…}` → `variable.other.splice`. |
| **§2.12** model's data (`repr … host "…"`, `backend`, `link`, `structural`, `fact`, `underlying`, `max_len`, `big_repr`, `int_repr`) | `#target-data` | Target-file/fragment forms; positional `%s` holes stay in the string. |

## §3 Precedence

The 14-level precedence table is **not** implemented — TextMate has no
precedence. It only matters for a parser. The grammar's operator matching
order in `#operators` follows maximal-munch for *token boundaries*
(`...` vs `..` vs `.`), which is all a highlighter can do.

## §4 / §5 / §6 (abs_J, well-formedness, printing)

Out of scope for a highlighter. `print_J`'s canonical spellings (e.g. it
prefers the symbol over `\cup`) are irrelevant to scoping — both spellings
are highlighted the same way, which is exactly what the reader accepts.

---

## Known / accepted limitations

- **Prime vs tag** share `'`: the grammar uses one rule; a prime (`x'`)
  reads visually as a tag start. Minor; rare in real source.
- **`seq` / `let` removed**: `let` explicitly leaves J (§0.2 C2); `seq`
  is in neither the reserved nor contextual word lists (§1.4). They are
  not J keywords and are no longer highlighted as such.
- **No precedence enforcement** (§3) — by design of a TextMate grammar.

---

## How to use this table

When changing a token's scope:
1. Find the spec section that governs that token.
2. Find the rule(s) listed for it.
3. Confirm the rule still matches what the spec says, and that no *other*
   rule now shadows it.
4. Run the `test.js` harness against a representative `.oro` file to
   confirm the new scope, and re-package.
