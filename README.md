# Auto Direction

A simple Chrome extension that automatically detects Persian and English text and applies the correct text direction (RTL/LTR) on websites.

## Features

- Automatically detects Persian and English text.
- Applies RTL or LTR direction to HTML elements independently.
- Supports input, textarea, select, and contenteditable elements.
- Detects dynamically added or modified content.
- Updates text direction while typing.
- Reapplies text direction by clicking the extension icon.
- No page reload required.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/amir-m-mazloumi/autoDirection-extension.git
   ```

2. Open Google Chrome and navigate to:

   ```text
   chrome://extensions
   ```

3. Enable **Developer mode**.

4. Click **Load unpacked**.

5. Select the project directory.

## Usage

The extension automatically detects text direction when a webpage loads.

You can also click the Auto Direction extension icon to reapply direction detection without reloading the page.

## Technologies

- JavaScript
- HTML
- CSS
- Chrome Extensions API (Manifest V3)

## Limitations

- Chrome internal pages and restricted websites do not allow content script execution.
- Direction detection is based on the first recognizable Persian or English character.

## License

MIT License