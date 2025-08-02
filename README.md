# Workflow Editor

A visual workflow orchestration editor built on [FlowGram.AI](https://github.com/bytedance/flowgram.ai), supporting drag-and-drop node configuration and process design.

This project is part of the FlowGram.AI ecosystem, leveraging its powerful node-based flow building engine to provide developers with flexible workflow design experience.

## 🚀 Features

- **Visual Editing**: Drag-and-drop node configuration with intuitive process design interface
- **Multiple Node Types**: Supports start, end, LLM, condition, loop, comment, and various other node types
- **Real-time Preview**: Built-in runtime engine supporting real-time workflow testing and debugging
- **Responsive Design**: Adapts to different screen sizes, providing excellent user experience
- **Plugin Architecture**: Modular design supporting feature extensions
- **Keyboard Shortcuts**: Rich keyboard shortcuts to improve editing efficiency
- **Backend Integration**: Seamless integration with [LinkMind](https://github.com/landingbj/LinkMind) enterprise-level AI middleware

## 📋 Supported Node Types

| Node Type | Description | Icon |
|-----------|-------------|------|
| Start | Workflow start node | 🟢 |
| End | Workflow end node | 🔴 |
| LLM | Large Language Model node | 🤖 |
| Condition | Conditional judgment node | ❓ |
| Loop | Loop control node | 🔄 |
| Block Start | Code block start | 📦 |
| Block End | Code block end | 📦 |
| Comment | Comment node | 💬 |
| Knowledge Base | Knowledge base node | 📚 |
| Intent Recognition | Intent recognition node | 🎯 |

## 🚀 Quick Start

### Requirements

- Node.js >= 16
- npm >= 8

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

The browser will automatically open and navigate to `http://localhost:8080`

### Build Production Version

```bash
npm run build
```

Build artifacts will be output to the `dist` directory.

## Project Structure

```
workflow/
├── src/
│   ├── components/          # Component directory
│   ├── form-components/    # Form components
│   ├── hooks/              # React Hooks
│   ├── nodes/              # Node definitions
│   ├── plugins/            # Plugin system
│   ├── services/           # Service layer
│   ├── shortcuts/          # Keyboard shortcuts
│   ├── styles/             # Style files
│   ├── typings/            # Type definitions
│   ├── utils/              # Utility functions
│   ├── app.tsx            # Application entry
│   ├── editor.tsx         # Editor component
│   └── index.ts           # Main entry
├── package.json           # Project configuration
├── rsbuild.config.ts      # Build configuration
└── tsconfig.json          # TypeScript configuration
```

## 🎯 Core Features

### Editor Core
- **Free Layout**: Supports free drag and positioning of nodes
- **Connection System**: Visualizes node connection relationships
- **Grouping Function**: Supports node grouping management
- **Minimap**: Provides canvas navigation functionality

### Node System
- **Node Registration**: Modular node registration mechanism
- **Form Configuration**: Each node supports custom configuration forms
- **Type Safety**: Complete TypeScript type definitions

### Plugin System
- **Context Menu**: Right-click menu plugin
- **Runtime**: Workflow execution engine
- **Variable Panel**: Global variable management

### Backend Services
- **LLM Integration**: Connect to multiple AI models through LinkMind
- **RAG Services**: Enhanced retrieval capabilities with vector databases
- **API Gateway**: RESTful API endpoints for external integrations
- **Security Layer**: Built-in content filtering and conversation control 

## 🔗 Backend Integration

This workflow editor can be seamlessly integrated with [LinkMind](https://github.com/landingbj/LinkMind), an enterprise-level composite multimodal large model middleware developed by Beijing Liandong North Technology Co., Ltd.

### LinkMind Features
- **Multi-Model Support**: Supports various LLM models including GPT, Claude, Gemini, Qwen, ChatGLM, and more
- **RAG Enhancement**: More accurate retrieval enhancement through refined data management
- **Medusa Cache**: Faster pre-read cache mechanism for improved performance
- **Intent Detection**: Powerful intent detection using knowledge graph technology
- **Auto-Switching**: Stable automatic switching between large models with backup mechanisms
- **Security Features**: Built-in sensitive word filtering and conversation control

### Quick Integration
1. Deploy LinkMind backend following their [documentation](https://github.com/landingbj/LinkMind)
2. Configure API endpoints in the workflow editor
3. Connect LLM nodes to LinkMind services
4. Enable RAG capabilities for knowledge base nodes

## 🔧 Development Guide

### Adding New Node Types

1. Create a new node directory under `src/nodes/`
2. Implement the node's `index.ts` and `form-meta.tsx`
3. Register the new node in `src/nodes/index.ts`
4. Add the node type enum in `src/nodes/constants.ts`

### Custom Plugins

1. Create a plugin directory under `src/plugins/`
2. Implement the plugin's core logic
3. Register the plugin in the editor

### Backend Integration

1. Configure LinkMind backend services in `src/services/`
2. Implement API client for LinkMind integration
3. Add authentication and security layers
4. Test integration with various AI models

### Style Customization

The project uses Less and Styled Components for style management:
- Global styles: `src/styles/index.css`
- Component styles: Style files in each component directory

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [FlowGram.AI](https://github.com/bytedance/flowgram.ai) - Powerful node-based flow building engine providing core technical support for this project
- [LinkMind](https://github.com/landingbj/LinkMind) - Enterprise-level AI middleware for backend integration
- [Semi UI](https://semi.design/) - Excellent React UI component library
- [Rsbuild](https://rsbuild.dev/) - Modern build tool
- [React](https://react.dev/) - User interface library

---

**Note**: This project is built on [FlowGram.AI](https://github.com/bytedance/flowgram.ai) and is part of the FlowGram.AI ecosystem, primarily used for demonstration and development purposes. 