import * as vscode from 'vscode';
import axios from 'axios';

// Declare a variable to hold the secret storage instance
let secretStorage: vscode.SecretStorage;

// Function to activate the extension
export async function activate(context: vscode.ExtensionContext) {
    // Initialize secret storage from the extension context
    secretStorage = context.secrets;
    console.log('Grok extension is now active!');

    // Function to get the API key from secret storage
    const getApiKey = async () => {
        // Retrieve the API key from secret storage
        const apiKey = await secretStorage.get('grokApiKey');
        if (!apiKey) {
            // Show a message if no API key is found and prompt to set one
            vscode.window.showInformationMessage('No Grok API key found. Please set one using the "Set Grok API Key" command. Visit "ide.x.ai" to sign up for an API key.', 'Set API Key').then(result => {
                if (result === 'Set API Key') {
                    // Execute the command to set the API key
                    vscode.commands.executeCommand('grok.setApiKey');
                }
            });
            return null;
        }
        return apiKey;
    };

    // Register the command to set the API key
    let setApiKeyDisposable = vscode.commands.registerCommand('grok.setApiKey', async () => {
        // Prompt the user to enter the API key
        const apiKey = await vscode.window.showInputBox({ prompt: 'Enter your Grok API key', password: true });
        if (apiKey) {
            // Store the API key in secret storage
            await secretStorage.store('grokApiKey', apiKey);
            vscode.window.showInformationMessage('Grok API key set successfully!');
        }
    });

    // Register the command to ask Grok with selected text
    let askDisposable = vscode.commands.registerCommand('grok.ask', async () => {
        // Get the active text editor
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            // Get the selected text
            const selection = editor.selection;
            const text = editor.document.getText(selection);
            // Get the API key
            const apiKey = await getApiKey();
            if (!apiKey) return;

            try {
                // Make a POST request to the Grok API
                const response = await axios.post('GROK_API_ENDPOINT', {
                    query: text
                }, {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`
                    }
                });

                // Show the response message and prompt for action
                const result = await vscode.window.showInformationMessage(response.data.message, 'Accept', 'Decline');
                if (result === 'Accept') {
                    vscode.window.showInformationMessage('Response accepted');
                } else {
                    vscode.window.showInformationMessage('Response declined');
                }
            } catch (error) {
                // Show an error message if the request fails
                vscode.window.showErrorMessage(`Error communicating with Grok: ${error.message}`);
            }
        }
    });

    // Register the command to paste and ask Grok
    let pasteAndAskDisposable = vscode.commands.registerCommand('grok.pasteAndAsk', async () => {
        // Prompt the user to paste their code
        const text = await vscode.window.showInputBox({ prompt: 'Paste your code here' });
        // Get the API key
        const apiKey = await getApiKey();
        if (!apiKey || !text) return;

        try {
            // Make a POST request to the Grok API
            const response = await axios.post('GROK_API_ENDPOINT', {
                query: text
                // other necessary parameters
            }, {
                headers: {
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            // Show the response message and prompt for action
            const result = await vscode.window.showInformationMessage(response.data.message, 'Accept', 'Decline');
            if (result === 'Accept') {
                vscode.window.showInformationMessage('Response accepted');
                // Here you might want to insert the response into the editor or do something with it
            } else {
                vscode.window.showInformationMessage('Response declined');
            }
        } catch (error) {
            // Show an error message if the request fails
            vscode.window.showErrorMessage(`Error communicating with Grok: ${error.message}`);
        }
    });

    // Add the disposables to the context's subscriptions
    context.subscriptions.push(setApiKeyDisposable, askDisposable, pasteAndAskDisposable);
}

// Function to deactivate the extension
export function deactivate() {}
