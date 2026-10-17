// @ts-check
'use strict';

const vscode = require('vscode');

/**
 * Oroboros language support.
 *
 * The language contribution (TextMate grammar + language configuration) is
 * declared entirely in package.json / language-configuration.json, so there is
 * no runtime work for activation. This entry point exists so that VS Code has
 * a module to load when the language is activated, and is a hook for any
 * future extension (linting, snippets, etc.).
 *
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // No-op: pure TextMate highlighting needs no services.
  // Register any future commands here, e.g.:
  // context.subscriptions.push(vscode.commands.registerCommand('oro.foo', ...));
}

function deactivate() {}

module.exports = { activate, deactivate };
