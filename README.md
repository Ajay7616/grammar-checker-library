# Grammar Checker Libs

A React component library for grammar checking and rectification with real-time suggestions and corrections.

## Features

- Real-time grammar checking
- Intelligent error detection and suggestions
- Fast and reliable grammar corrections
- Free and open-source
- Easy integration with existing React applications

## Installation

```bash
npm install grammar-checker-libs axios
```

or

```bash
yarn add grammar-checker-libs axios
```

## Quick Start

### 1. Install the Library

```bash
#for npm
npm install grammar-checker-libs axios

#for yarn
yarn add grammar-checker-libs axios
```

### 2. Setup Backend Server

This library requires a backend server to process grammar checks. Download and setup the server:

**Clone the backend repository:**
```bash
git clone https://github.com/Ajay7616/grammar-check-backend.git
cd grammar-check-backend
```

**Start the Java LanguageTool Server (Port 8081):**
```bash
java -cp "LanguageTool-6.3/languagetool-server.jar" org.languagetool.server.HTTPServer --port 8081
```

**Start the Python Server:**
```bash
pip install -r requirements.txt
python app.py
```

> Note: Run the Java server first, then the Python server. Both must be running for the grammar checker to work.

## Usage Examples

### Basic Usage with Textarea

```javascript
import { GrammarRectifier } from 'grammar-checker-libs';

function MyComponent() {
  return (
    <GrammarRectifier>
      <textarea placeholder="Type something with mistakes..." />
    </GrammarRectifier>
  );
}
```

### With Input Field

```javascript
import { GrammarRectifier } from 'grammar-checker-libs';

function MyComponent() {
  return (
    <GrammarRectifier>
      <input type="text" placeholder="Try typing 'teh' or 'definately'" />
    </GrammarRectifier>
  );
}
```

### Using API Utilities

```javascript
import { GrammarRectifier } from 'grammar-checker-libs';
import * as api from 'grammar-checker-libs';

async function checkGrammar(text) {
  try {
    const result = await api.checkGrammar(text);
    console.log(result);
  } catch (error) {
    console.error('Grammar check failed:', error);
  }
}
```

### For Create React App (Webpack 5) Users

If you're using Create React App and encounter module resolution errors with `http`, `https`, `stream`, etc., you need to configure webpack polyfills:

**1. Install required packages:**
```bash
npm install --save-dev react-app-rewired node-polyfill-webpack-plugin stream-http https-browserify url assert stream-browserify util browserify-zlib
```

**2. Create `config-overrides.js` in your project root:**
```javascript
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    url: require.resolve('url'),
    assert: require.resolve('assert'),
    stream: require.resolve('stream-browserify'),
    util: require.resolve('util'),
    zlib: require.resolve('browserify-zlib'),
  };
  
  config.plugins.push(new NodePolyfillPlugin());
  
  return config;
};
```

**3. Update your `package.json` scripts:**
```json
{
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test"
  }
}
```

**Note:** This is only required for Create React App with Webpack 5. Modern tools like Vite, Next.js, or newer React frameworks handle this automatically.

## API Documentation

### Components

#### `<GrammarRectifier />`

The main component for grammar checking and correction.

**Important:** This component only works with `<input type="text">` and `<textarea>` elements wrapped inside it.

**Supported Usage:**

```javascript
<GrammarRectifier>
  <input type="text" />
</GrammarRectifier>

<GrammarRectifier>
  <textarea />
</GrammarRectifier>
```

### Utility Functions

Functions exported from `utils/api.js`:

#### `checkGrammar(text)`

Checks the provided text for grammar errors.

**Parameters:**
- `text` (string): The text to check

**Returns:**
- Promise with grammar check results

**Example:**
```javascript
import { checkGrammar } from 'grammar-checker-libs';

const result = await checkGrammar("This are wrong.");
```

## Backend Setup Details

### Prerequisites

- **Java**: JDK 8 or higher
- **Python**: Python 3.7 or higher
- **Package Manager**: Node.js 14+ / Yarn 1.22.x

### Backend Repository

Download the backend server files:
```bash
git clone https://github.com/Ajay7616/grammar-check-backend.git
```

### Running the Servers

1. **Start Java LanguageTool Server:**
   ```bash
   cd grammar-check-backend
   java -cp "LanguageTool-6.3/languagetool-server.jar" org.languagetool.server.HTTPServer --port 8081
   ```
   
   Wait for the message: `Server started on http://localhost:8081`

2. **Start Python Server:**
   ```bash
   pip install -r requirements.txt
   python app.py
   ```
   
   The server will start on `http://localhost:5555`

### Verifying Setup

Test if servers are running:
```bash
# Test Java server
curl http://localhost:8081/v2/check -d "language=en-US&text=This are wrong"

# Test Python server
curl -X POST http://127.0.0.1:5555/api/check -H "Content-Type: application/json" -d "{\"text\":\"i recieve many emails every day, but the most important ones are definetly from my colleagues.\"}"
```

## Why This Approach?

This library uses a **free, reliable, and fast** approach by leveraging:

- **LanguageTool**: Industry-standard open-source grammar checker
- **Local Processing**: No external API calls, complete privacy
- **High Performance**: Fast response times with local servers
- **No Cost**: Completely free to use
- **Reliable**: No rate limits or API restrictions

## Development

### Build the Library

```bash
npm run build
```

### Run Tests

```bash
npm test
```

## Troubleshooting

### "Cannot connect to server"

Make sure both Java and Python servers are running:
```bash
# Check if Java server is running (Port 8081)
curl http://localhost:8081

# Check if Python server is running (Port 5555)
curl http://localhost:5555
```

Note: Java server runs on port 8081 and Python server runs on port 5555. If you need to use different ports, update the API endpoint in your component configuration.

### Java Server Not Starting

Ensure you have Java installed:
```bash
java -version
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions:
- GitHub Issues: [[Issues](https://github.com/Ajay7616/grammar-checker-librar/issues)]
- Email: [[Email](u.ajaykumar7616@gmail.com)]

## Acknowledgments

- [LanguageTool](https://languagetool.org/) - Open-source grammar checker
- [language-tool-python](https://github.com/jxmorris12/language-tool-python) by Jack Morris - Backend support
- React community

---

Made with love for better writing