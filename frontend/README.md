# CLEAR Frontend

Modern React.js frontend for CLEAR cloud removal application with beautiful UI and real-time image processing.

## Features

- 🎨 Modern React UI with Tailwind CSS
- 🚀 Framer Motion animations
- 📤 Drag-and-drop image upload
- 🧠 Model selection interface
- 📊 Real-time processing metrics
- 👁️ Before/after image comparison
- 📱 Responsive design
- 🔔 Toast notifications

## Tech Stack

- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Axios** - API client
- **React Hot Toast** - Notifications
- **React Dropzone** - File upload
- **React Image Compare** - Image comparison

## Installation

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Configure environment variables:**
Edit `.env` file:
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_API_TIMEOUT=30000
REACT_APP_MAX_FILE_SIZE=10485760
```

3. **Start development server:**
```bash
npm start
```

The application will open at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── Upload/
│   │   │   ├── ImageUpload.jsx
│   │   │   └── DragDropZone.jsx
│   │   ├── Results/
│   │   │   ├── ResultDisplay.jsx
│   │   │   ├── ImageComparison.jsx
│   │   │   └── MetricsDisplay.jsx
│   │   └── Common/
│   │       ├── Button.jsx
│   │       ├── LoadingSpinner.jsx
│   │       └── ModelSelector.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   └── Documentation.jsx
│   ├── services/
│   │   └── api.js
│   ├── hooks/
│   │   └── useImageProcessing.js
│   ├── utils/
│   │   ├── validation.js
│   │   └── constants.js
│   ├── styles/
│   │   └── globals.css
│   ├── App.jsx
│   ├── App.css
│   └── index.js
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── .env
```

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Design System

### Colors
- **Primary**: Deep blue (#1a365d)
- **Secondary**: Teal (#2c7a7b)
- **Accent**: Orange (#ed8936)
- **Background**: Light gray (#f7fafc)

### Typography
- **Headers**: Inter or Poppins (bold)
- **Body**: Inter or System fonts
- **Monospace**: JetBrains Mono

### Components
- **Header**: Glass-morphism effect
- **Sidebar**: Collapsible with gradient
- **Upload**: Drag-and-drop with animated border
- **Results**: Side-by-side comparison
- **Metrics**: Animated cards with counters

## Pages

### Home Page
- Hero section with animated background
- Image upload interface
- Model selection
- Real-time processing
- Results display and comparison

### About Page
- Project overview
- Architecture information
- Tech stack showcase
- Performance metrics

### Documentation Page
- How to use guide
- Model information
- Dataset details
- Troubleshooting tips

## API Integration

The frontend communicates with the FastAPI backend using the following endpoints:

- `GET /api/health` - Health check
- `GET /api/models` - Get available models
- `POST /api/process` - Process image
- `POST /api/batch-process` - Batch processing

## Features Implementation

### File Upload
- Drag and drop functionality
- File validation (image formats only)
- Preview thumbnail
- Size validation (max 10MB)

### Image Processing
- Real-time progress indication
- Error handling with user-friendly messages
- Cancel processing option

### Results Display
- Side-by-side comparison
- Image comparison slider
- Download processed image
- Display metrics (PSNR, SSIM, processing time)

### State Management
- Loading states for async operations
- Success/error notifications
- Persistent model selection

## Responsive Design

- Mobile-first approach
- Tablet and desktop breakpoints
- Touch-friendly interactions
- Collapsible sidebar

## Performance Optimization

- Code splitting with React.lazy
- Image optimization
- API request caching
- Debounced user inputs

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

### Adding New Components
1. Create component file in appropriate directory
2. Follow existing naming conventions
3. Use Tailwind CSS for styling
4. Add Framer Motion animations
5. Export as default

### Styling Guidelines
- Use Tailwind utility classes
- Follow the design system colors
- Maintain consistent spacing
- Ensure responsive design
- Add hover states

### Testing
```bash
npm test
```

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
npx kill-port 3000
```

### Dependency issues
```bash
rm -rf node_modules package-lock.json
npm install
```

### API connection issues
- Check backend is running on port 8000
- Verify CORS configuration
- Check environment variables

## License

This project is developed for educational and research purposes.