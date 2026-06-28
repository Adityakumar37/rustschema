# RustSchema

A VS Code extension for JSON Schema validation, powered by the Rust engine [jsonschema](https://github.com/Stranger6667/jsonschema) by Stranger6667.

Validates your JSON files automatically as you work. No configuration needed if your file includes a `$schema` key.

---

## Install

### One command

```bash
curl -L https://github.com/adityakumar37/rustschema/releases/download/v0.0.1/rustschema-0.0.1.vsix -o rustschema.vsix && code --install-extension rustschema.vsix
```

### Manual

1. Go to [Releases](https://github.com/adityakumar37/rustschema/releases)
2. Download `rustschema-0.0.1.vsix`
3. Run:
```bash
code --install-extension rustschema-0.0.1.vsix
```

### From Source

```bash
git clone https://github.com/adityakumar37/rustschema
cd rustschema
npm install
npm run compile
```

Press `F5` in VS Code to run.

---

## Requirements

Install Rust and jsonschema-cli before using the extension.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install jsonschema-cli
```

---

## Usage

### Auto Detection

Add a `$schema` key to your JSON file:

```json
{
  "$schema": "./schema.json",
  "name": "John",
  "age": 25
}
```

RustSchema reads the key, finds the schema, and validates automatically on open and save.

### Manual Trigger

Press `Cmd + Shift + P` → type `RustSchema: Validate JSON against Schema`

### Settings

If you prefer not to add `$schema` to your files, set a global schema path:

1. Open Settings (`Cmd + ,`)
2. Search `rustschema`
3. Set `RustSchema: Schema Path` to the path of your schema relative to the workspace root

---

## Example

**schema.json**
```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "number" }
  },
  "required": ["name", "age"]
}
```

**data.json**
```json
{
  "$schema": "./schema.json",
  "name": 123,
  "age": "wrong"
}
```

**Problems panel shows:**
```
1. 123 is not of type "string"
2. "wrong" is not of type "number"
```

---

## Roadmap

- Draft switcher — switch between JSON Schema drafts (4, 6, 7, 2019-09, 2020-12) and compare validation results
- Inline error highlighting on the exact line
- Schema auto-discovery across the workspace
- Publish to VS Code Marketplace

---

## Contributing

Contributions are welcome. If you have an idea, found a bug, or want to implement something from the roadmap, open an issue or submit a pull request.

```bash
git clone https://github.com/adityakumar37/rustschema
cd rustschema
npm install
```

Press `F5` to launch the Extension Development Host and start testing.

---

## Built On Open Source

The validation engine is [jsonschema](https://github.com/Stranger6667/jsonschema) by Dmitry Dygalo, licensed under MIT.

---

## License

MIT
