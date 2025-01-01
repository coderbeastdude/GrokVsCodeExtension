# Grok VS Code Extension

A Visual Studio Code extension to interact with Grok AI as a coding assistant.

## Features

- **Set API Key**: Securely store your Grok API key within VS Code.
- **Ask Grok**: Use selected text or pasted code to query Grok for coding assistance.
- **Paste and Ask**: Directly paste code into a prompt to query Grok.

## Installation

1. **Install from VS Code Marketplace**: Once published, search for "Grok" in the VS Code extensions marketplace.
2. **Manual Installation**:
   - Clone this repository
   - In VS Code, go to `View` -> `Command Palette` and run `Extensions: Install from VSIX...`
   - Select the `.vsix` file from the `vsix` directory after building the project.

## Usage

1. **Set your API Key**:
   - Open Command Palette with `Ctrl+Shift+P` or `Cmd+Shift+P`, type "Grok: Set API Key", and enter your key.
   - You can get an API key from [ide.x.ai](https://ide.x.ai).

2. **Interact with Grok**:
   - Select code or text and run "Grok: Ask" from the command palette.
   - Alternatively, use "Grok: Paste and Ask" to input new code.

## Development

### Prerequisites

- Node.js (with npm)
- TypeScript

### Setup

```bash
npm install
