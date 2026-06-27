import * as vscode from 'vscode';
import { execFile } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

let diagnosticCollection: vscode.DiagnosticCollection;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
    // Show activation message in status bar
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.text = 'RustSchema: Ready';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Show notification on activation
    vscode.window.showInformationMessage('RustSchema is ready. Validation engine: github.com/Stranger6667/jsonschema');

    diagnosticCollection = vscode.languages.createDiagnosticCollection('rustschema');
    context.subscriptions.push(diagnosticCollection);

    // Manual validate command
    const validateCommand = vscode.commands.registerCommand('rustschema.validate', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('RustSchema: No active file open');
            return;
        }
        validateDocument(editor.document);
    });

    // Auto validate on open
    const onOpen = vscode.workspace.onDidOpenTextDocument((doc) => {
        if (doc.languageId === 'json') {
            validateDocument(doc);
        }
    });

    // Auto validate on save
    const onSave = vscode.workspace.onDidSaveTextDocument((doc) => {
        if (doc.languageId === 'json') {
            validateDocument(doc);
        }
    });

    context.subscriptions.push(validateCommand, onOpen, onSave);
}

function getSchemaPath(document: vscode.TextDocument): string | null {
    // Method 1 — Auto detect from $schema key inside the JSON file
    try {
        const content = document.getText();
        const parsed = JSON.parse(content);

        if (parsed['$schema']) {
            const schemaValue = parsed['$schema'] as string;

            // Resolve relative path from the JSON file's location
            const docDir = path.dirname(document.uri.fsPath);
            const resolvedSchema = path.resolve(docDir, schemaValue);

            if (fs.existsSync(resolvedSchema)) {
                return resolvedSchema;
            }
        }
    } catch {
        // JSON is malformed, skip auto detection
    }

    // Method 2 — Fall back to settings
    const config = vscode.workspace.getConfiguration('rustschema');
    const schemaPath = config.get<string>('schemaPath', '');

    if (schemaPath) {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
        const resolvedSchema = path.resolve(workspaceFolder, schemaPath);
        if (fs.existsSync(resolvedSchema)) {
            return resolvedSchema;
        }
    }

    return null;
}

function validateDocument(document: vscode.TextDocument) {
    const schemaPath = getSchemaPath(document);

    if (!schemaPath) {
        // Silently skip if no schema found — not every JSON needs validation
        statusBarItem.text = 'RustSchema: No schema found';
        return;
    }

    statusBarItem.text = 'RustSchema: Validating...';

    const instancePath = document.uri.fsPath;

    execFile(
        '/Users/aditya/.cargo/bin/jsonschema-cli',
        ['validate', schemaPath, '-i', instancePath],
        (error, stdout, stderr) => {
            diagnosticCollection.clear();

            const output = stdout + stderr;

        if (!error) {
            statusBarItem.text = 'RustSchema: Valid schema, no errors';
            vscode.window.showInformationMessage('RustSchema: Valid schema, no errors found');
            return;
        }

            const diagnostics: vscode.Diagnostic[] = [];
            const lines = output.split('\n').filter(line => line.trim() !== '');

            lines.forEach(line => {
                const range = new vscode.Range(0, 0, 0, 0);
                const diagnostic = new vscode.Diagnostic(
                    range,
                    line.trim(),
                    vscode.DiagnosticSeverity.Error
                );
                diagnostic.source = 'RustSchema';
                diagnostics.push(diagnostic);
            });

            diagnosticCollection.set(document.uri, diagnostics);
            statusBarItem.text = `RustSchema: ${diagnostics.length} error(s)`;
        }
    );
}

export function deactivate() {
    diagnosticCollection.clear();
    statusBarItem.dispose();
}