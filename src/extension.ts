"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { ts2joi } from "./ts2joi";
import { enum2strings } from "./enum2strings";

export function activate(context: vscode.ExtensionContext) {
    console.log("activate tsutils");

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let ts2joiDisposable = vscode.commands.registerCommand(
        "extension.ts2joi",
        () => {
            var editor = vscode.window.activeTextEditor;
            if (!editor) {
                // No open text editor
                return;
            }

            // Get text from selection
            var selection = editor.selection;
            var text = editor.document.getText(selection);

            // Replace selection with converted text
            editor.edit(builder => {
                builder.replace(selection, ts2joi(text));
            });
        }
    );

    context.subscriptions.push(ts2joiDisposable);

    let enum2stringsDisposable = vscode.commands.registerCommand(
        "extension.enum2strings",
        () => {
            var editor = vscode.window.activeTextEditor;
            if (!editor) {
                // No open text editor
                return;
            }

            // Get text from selection
            var selection = editor.selection;
            var text = editor.document.getText(selection);

            // Replace selection with converted text
            editor.edit(builder => {
                builder.replace(selection, enum2strings(text));
            });
        }
    );

    context.subscriptions.push(enum2stringsDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
