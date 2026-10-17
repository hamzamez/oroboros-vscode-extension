# Oroboros (.oro)

A Visual Studio Code extension providing TextMate syntax highlighting for
[Oroboros](https://github.com/hamzamez/Oroboros) — a small language that
compiles to Go, JavaScript, the JVM and x86-64 assembly.

## What it highlights

`.oro` files in the oroboros repo come in two coexisting surface notations
and this grammar highlights both:

- **J surface** (block / brace style) — used by `examples/**/*.oro`:
  `export fn main() { ... }`, `//` comments, `var b := array { 0 : _ ∈ 0..n-1 }`,
  `loop i = 0 { guard -> ...; else -> again(...) }`, `case` / `if` / `try` /
  `expect` / `assert`, set formers, tagged variants (`'ok(v)`), host bodies
  (`host expr "…" import "…"`), TLA+ operators in both their mathematical
  symbols (`∪`, `∈`, `⇒`) and their ASCII spellings, integer ranges
  (`-2^31..2^31-1`), and host-qualified operator calls like `go.`+``.

- **Target-file / library notation** — used by `targets/**/*.oro` and
  `lib/**/*.oro`: `set T = host "…"`, `repr 0..255 host "byte"`,
  `axiom T ⊆ I`, `structural fold_range `loop` pure`, `provides T M { … }`,
  `module p { … }`, `build "go build -o %s %s"`, `artifact "main.exe"`,
  `link "kernel32"`, `data "… qword 0"`, `fact max_len …`, `backend x86_64`,
  MASM templates with `${#}`, `${r:b}` splices, and quoted host operator
  names such as `` go.`>=` `` and `` `big+` ``.

Everything is a single `source.oroboros` scope — see
[syntaxes/Oroboros.tmLanguage.json](./syntaxes/Oroboros.tmLanguage.json).

## Install

### As a VS Code extension (VSIX)

```sh
npm i -g @vscode/vsce   # one-time install
vsce package             # in this folder
```

Then in VS Code: `Ctrl+Shift+P` → **Extensions: Install from VSIX…** and pick
the generated `.vsix`.

### As a local development install

```sh
code --install-extension oroboros-0.1.0.vsix
```

Opening any `.oro` file activates the language contribution; no runtime
services are required.

## Development

```sh
# Tokenize a .oro file offline to spot-check the grammar.
npm i --no-save onigasm vscode-textmate
node test.js syntaxes/Oroboros.tmLanguage.json path/to/file.oro [limitLines]
```

Or open this folder in VS Code as an extension source (F5 in the
Extensions view) to reload the grammar live.

## Layout

```
package.json                 language + grammar contribution, activation events
language-configuration.json  comment / bracket / folding metadata
extension.js                 no-op activation entry point
syntaxes/
  Oroboros.tmLanguage.json   the TextMate grammar
icons/
  oro-light.svg               light file-type icon
  oro-dark.svg                dark file-type icon
test.js                      offline tokenization harness (dev only)
```

## Scopes

The grammar emits a small, stable set of scopes under the
`source.oroboros` root. Any VS Code colour theme that maps the usual
TextMate scopes will render the language sanely; themes that add
explicit `.oroboros` rules will override:

| Scope | Meaning |
|---|---|
| `comment.line.oroboros` | `// …` line comment |
| `keyword.control.import.oroboros` | `use`, `as` |
| `keyword.module.oroboros` | `module`, `provides` |
| `keyword.other.declaration.oroboros` | `fn`, `spec`, `lemma`, `set` |
| `keyword.other.visibility.oroboros` | `private`, `export` |
| `keyword.other.target-data.oroboros` | `repr`, `set`, `axiom`, `structural`, `build`, `backend`, `artifact`, `link`, `fact`, `data`, `type`, `const`, `host` |
| `keyword.other.repr-choice.oroboros` | `word`, `niche`, `narrow`, `library`, `shift`, `ref`, `limbs`, `big` |
| `keyword.other.host.oroboros` | `host` (body / clause) |
| `keyword.other.host-kind.oroboros` | `expr`, `stmt` |
| `keyword.other.host-clause.oroboros` | `import`, `lib`, `checked`, `jump`, `comma_ok` |
| `keyword.other.modifier.oroboros` | `pure`, `where`, `ensure`, `invariant`, `index`, `variadic`, `success`, `relevant`, `in`, `out`, `linear`, `inout` |
| `keyword.control.loop.oroboros` | `loop` |
| `keyword.control.case.oroboros` | `case`, `else`, `when` |
| `keyword.control.if.oroboros` | `if`, `else` |
| `keyword.control.again.oroboros` | `again` |
| `keyword.other.control.oroboros` | `try`, `expect`, `assert`, `ignore`, `seq`, `let`, `and`, `or`, `not`, `cond` |
| `keyword.operator.assignment.oroboros` | `:=` |
| `keyword.operator.arrow.oroboros` | `->` |
| `keyword.operator.range.oroboros` | `..` |
| `keyword.operator.spread.oroboros` | `...` |
| `keyword.operator.set.oroboros` | `∪ ∩ ∖ × ⊆ ⊂ ∈ ∉` and ASCII spellings |
| `keyword.operator.math.oroboros` | `∀ ∃ ⇒ ⇔` |
| `keyword.operator.comparison.oroboros` | `== != <= >= < >` |
| `keyword.operator.logic.oroboros` | `&& \|\| !` |
| `keyword.operator.arithmetic.oroboros` | `+ - * / % ^ ++` |
| `entity.name.type.oroboros` | `Int`, `F64`, `Bool`, `String`, `Array`, `Map`, `error`, `num`, `word`, … |
| `entity.name.type.module.oroboros` | module path segments |
| `constant.other.tag.oroboros` | `'ok`, `'err`, … |
| `constant.numeric.integer.oroboros` | decimal / hex integers |
| `constant.numeric.float.oroboros` | floats with optional exponent |
| `constant.numeric.range-bound.oroboros` | endpoints of a `lo..hi` range |
| `constant.other.infinity.oroboros` | `+inf`, `-inf` |
| `constant.language.boolean.oroboros` | `true`, `false` |
| `string.quoted.double.oroboros` | `"` host template / string |
| `string.quoted.backtick.oroboros` | `` `…` `` quoted name |
| `variable.other.splice.oroboros` | `${x}`, `${#}`, `${r:b}` splices inside strings |
| `variable.parameter.oroboros` | parameter names inside `(...)` |
| `variable.other.oroboros` | identifiers |
| `punctuation.terminator.oroboros` | `:`, `,`, `;` |
