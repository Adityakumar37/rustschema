# RustSchema

A VS Code extension for JSON Schema validation, powered by the high-performance Rust engine [jsonschema](https://github.com/Stranger6667/jsonschema) by @Stranger6667.

Validates your JSON files automatically as you work — no configuration required if your file includes a `$schema` key.

---

## Features

- Auto detects schema from the `$schema` key in your JSON file
- Validates on open and on save — no manual trigger needed
- Errors appear instantly in the Problems panel
- Falls back to a manually configured schema path via settings
- Status bar indicator shows validation state at a glance
- Built on an open source Rust validation engine — fast and spec-compliant

---

## How It Works

```
You open or save a JSON file
        ↓
RustSchema reads the $schema key
        ↓
Resolves the schema file path
        ↓
Calls jsonschema-cli (Rust engine)
        ↓
Errors appear in the Problems panel
```

---

## Requirements

This extension requires `jsonschema-cli` to be installed on your machine. It is the CLI tool from the [Stranger6667/jsonschema](https://github.com/Stranger6667/jsonschema) Rust repository.

**Install Rust first:**
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

**Then install jsonschema-cli:**
```bash
cargo install jsonschema-cli
```

---

## Usage

### Auto Detection (recommended)

Add a `$schema` key to your JSON file pointing to your schema:

```json
{
  "$schema": "./schema.json",
  "name": "John",
  "age": 25
}
```

RustSchema will automatically find and validate against that schema every time you open or save the file.

### Manual Configuration

If you prefer not to add `$schema` to your files, set the schema path globally in VS Code settings:

1. Open Settings (`Cmd + ,` on Mac, `Ctrl + ,` on Windows)
2. Search for `rustschema`
3. Set `RustSchema: Schema Path` to the path of your schema file relative to the workspace root

Example: `schema.json` or `schemas/my-schema.json`

### Manual Validate Command

You can also trigger validation manually:

1. Open a JSON file
2. Press `Cmd + Shift + P` (Mac) or `Ctrl + Shift + P` (Windows)
3. Type `RustSchema: Validate JSON against Schema`
4. Press Enter

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

**Problems panel will show:**
```
1. 123 is not of type "string"
2. "wrong" is not of type "number"
```

---

## Roadmap

These are features planned for future versions:

- **Draft switcher** — jsonschema supports Draft 4, 6, 7, 2019-09, and 2020-12. A future version will let you switch between drafts and see how validation results differ across them. This is useful for teams migrating between schema versions or exploring compatibility.
- **Inline error highlighting** — show errors on the exact line instead of Line 1
- **Schema auto-discovery** — scan the workspace for schema files automatically
- **Multi-file validation** — validate all JSON files in a folder at once

---

## Contributing

Contributions are welcome. If you have an idea, found a bug, or want to improve the extension, feel free to open an issue or submit a pull request.

This project is intentionally kept simple so it is easy to contribute to even if you are new to VS Code extension development or Rust.

To get started:

```bash
git clone https://github.com/adityakumar37/rustschema
cd rustschema
npm install
```

Press `F5` in VS Code to launch the Extension Development Host and start testing your changes.

---

## Built On Open Source

The validation engine powering this extension is [jsonschema](https://github.com/Stranger6667/jsonschema) by Dmitry Dygalo (Stranger6667), licensed under MIT. This extension would not exist without that work.

---

## License

MIT