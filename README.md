# Interactive Multimedia Fusion Studio

## 📋 Project Overview

The **Interactive Multimedia Fusion Studio** is a web-based multimedia management platform featuring real-time audio visualization, responsive visual effects, and seamless file handling. Built with p5.js, it delivers an immersive audio-visual experience with persistent storage and interactive controls.

### Key Objectives
✓ Create a multi-media management system  
✓ Develop real-time visual effects responsive to audio and user input  
✓ Build an intuitive, persistent playlist system  
✓ Provide full keyboard and mouse interactivity  

---

## ✨ Core Features

**1. Welcome Page** - Animated gradient landing page with smooth transitions  
**2. Multimedia Upload** - Support for audio, video, and image files  
**3. Asset Folder Integration** - Pre-load media files automatically  
**4. Interactive Playlist** - Click to play, delete to remove items  
**5. Advanced Controls** - Play/Pause/Stop, Previous/Next navigation  
**6. Player Settings** - Volume (0-100%) and Speed (0.5x-2x) sliders  
**7. Zoom Controls** - Scale videos and photos from 0.5x to 3x  
**8. Keyboard Shortcuts** - Spacebar (play/pause), Up/Down arrows (volume)  
**9. Real-Time Visualization** - Frequency bars and particles react to audio  
**10. Idle Animations** - Continuous visual effects (wavy lines, pulsing circles, floating particles)

---

## 🛠️ Technical Stack

| Component | Technology |
|-----------|------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Graphics | p5.js v1.9.0 |
| Audio | p5.sound library (FFT analysis) |
| Storage | Browser localStorage |

---

## 📁 Project Structure

```
MULTIMEDIA PROJECT2/
├── Index.html          # Main HTML with welcome page & layout
├── script.js           # Core application logic (450 lines)
├── style.css           # Styling & animations (120 lines)
├── README.md           # This file
└── assets/             # Pre-loaded media folder
    └── [Your media files here]
```

---

## 🚀 Quick Start

1. **Download & Extract** the project folder
2. **Add Media** to the `assets` folder (optional)
3. **Update `script.js`** with file names in the `assetFiles` array:
   ```javascript
   const assetFiles = [
     {name: 'song.mp3', type: 'audio'},
     {name: 'video.mp4', type: 'video'},
     {name: 'photo.jpg', type: 'photo'}
   ];
   ```
4. **Start Server**: `python -m http.server 8000`
5. **Open Browser**: `http://localhost:8000`

---

## 💡 How to Use

### Getting Started
- Open the app → See welcome page → Click "Enter the Studio"

### Playing Media
1. **Upload files** using the upload buttons OR
2. **Click playlist items** to select media
3. **Use controls**: Play, Pause, Stop, Next, Prev

### Using Controls
- **Volume Slider**: Adjust audio level (0-100%)
- **Speed Slider**: Change playback speed (0.5x-2x)
- **Zoom Slider**: Scale videos/photos (0.5x-3x)
- **Keyboard**: Spacebar (play/pause), Up/Down arrows (volume)
- **Mouse**: Click video to toggle playback OR move mouse to see tracked circle

### Managing Playlist
- Click item → Plays immediately
- Click "Delete" → Removes from playlist
- Playlist persists after page refresh

---

## 🎨 Visual Effects

### During Audio Playback
- **Frequency Bars**: Real-time FFT visualization of frequency spectrum
- **Particle System**: Particles react to bass energy
- **Tracking Circle**: Yellow circle follows your mouse

### During Video/Photo Display
- **Centered Display**: Media shown at original size
- **Zoom Support**: Scale video/photo while preserving aspect ratio
- **Tracking Circle**: Yellow circle still follows mouse

### Idle/Stopped Media
- **Wavy Lines**: Animated sine wave patterns
- **Pulsing Circles**: Orbiting circles that scale dynamically
- **Floating Particles**: Drifting upward continuously
- **Mouse Tracking**: Yellow circle follows cursor

---

## 🎵 Audio Processing

The app uses **FFT (Fast Fourier Transform)** for real-time audio analysis:
- Analyzes 256 frequency bands simultaneously
- Creates responsive frequency bars
- Extracts bass energy for particle animation
- All processing happens client-side (browser)

---

## 💾 Data Persistence

Files uploaded or loaded are saved to **localStorage**:
- Survives page refreshes
- Stored as base64 data URLs
- Loaded automatically on app startup
- Typical limit: 5-10MB per domain

---

## 🔧 Customization

### Change Welcome Page Colors
In `style.css`:
```css
#welcome-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Adjust Animation Speed
In `script.js` draw function:
```javascript
frameCount * 0.02  // Decrease for slower animation
```

### Modify Particle Count
In `script.js` setup function:
```javascript
for (let i = 0; i < 100; i++) {  // Change 100 to desired amount
```

### Change Frequency Bar Color
In `script.js` draw function:
```javascript
fill(0, 255, 255);  // Change RGB values (currently cyan)
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Audio won't load | Check file format (mp3, m4a, wav supported) |
| Video shows black | Ensure H.264 codec, try different format |
| Playlist disappears | Enable localStorage in browser settings |
| Large files fail | Use smaller files (localStorage has limits) |
| Slow animations | Close other tabs, update browser |
| Assets don't appear | Verify exact filename in assetFiles array |

---

## 📊 Code Architecture

### Key Functions
- `setup()` - Initialize canvas, particles, controls
- `draw()` - Main animation loop (60 FPS)
- `loadAssets()` - Load pre-defined media files
- `addToPlaylist()` - Handle file uploads
- `selectMedia()` - Select and play/display media
- `keyPressed() / mousePressed()` - User interactions
- `Particle class` - Individual particle behavior

### Global Variables
```javascript
let currentMedia = null;     // Currently selected media
let zoomLevel = 1;           // Current zoom level
let playlist = [];           // Array of all media items
let circleX, circleY;        // Tracking circle position
```

---

## 📱 Browser Compatibility

✓ Chrome 90+  
✓ Firefox 88+  
✓ Safari 14+  
✓ Edge 90+  
✓ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🎯 Use Cases

- **Music Production**: Visualize audio frequencies in real-time
- **Presentations**: Display media with professional animations
- **Events**: Show photos/videos with dynamic visual effects
- **Educational**: Learn about audio visualization and web APIs
- **Digital Art**: Interactive canvas for creative expression
- **Entertainment**: Immersive multimedia experience

---

## ✅ Performance Specs

| Metric | Value |
|--------|-------|
| Canvas Size | 90% width × 400px |
| Frame Rate | 60 FPS |
| Particles | 100 active |
| Frequency Bands | 256 (FFT) |
| File Format Support | 10+ audio/video/image types |

---

## 🔐 Security & Privacy

- **100% Client-Side**: No data sent to servers
- **Local Storage Only**: Files stored in browser
- **Private**: No tracking or analytics
- **Open Source**: Code transparency

---

## 👥 Team Members

This project was developed by 6 team members:
- [Member 1]
- [Member 2]
- [Member 3]
- [Member 4]
- [Member 5]
- [Member 6]

---

## 📜 License & Credits

**Open Source** - Free to use, modify, and distribute
- **p5.js**: MIT License (Open-source graphics library)
- **p5.sound**: MIT License (Audio processing library)

---

## ✨ Standout Features

1. **Real-Time Audio Visualization** - FFT-based frequency analysis that responds instantly
2. **Persistent Playlist** - Files survive page refreshes using localStorage
3. **Multi-Format Support** - Audio, video, and images in one unified system
4. **Responsive Animations** - Visual effects automatically adapt to content type
5. **Full Input Control** - Complete keyboard and mouse integration
6. **Professional UI** - Modern glassmorphism design with smooth animations
7. **Asset Folder System** - Pre-load files without uploading
8. **Zoom Functionality** - View media at custom scales while preserving quality
9. **No Backend Required** - Fully client-side, no server dependencies
10. **Educational Value** - Learn web development, creative coding, audio processing

---

## 🎓 What We Learned

This project demonstrates:
✓ Full-stack web development (HTML/CSS/JavaScript)  
✓ Canvas graphics and animation  
✓ Audio processing and visualization  
✓ Web storage and data persistence  
✓ Event handling and user interaction  
✓ Responsive design principles  
✓ Creative coding and problem-solving  

---

## 📈 Statistics

- **Total Code**: ~650 lines
- **Functions**: 15+
- **Features**: 20+
- **Animation Types**: 5+
- **Supported File Types**: 10+

---

## 🎉 Ready for Presentation!

The application is **production-ready** and perfect for demonstration. All features are functional, well-documented, and visually impressive.

**Demo Checklist:**
☐ Upload audio and watch frequency bars animate  
☐ Load video and use zoom slider  
☐ Import photo and zoom in/out  
☐ Use keyboard shortcuts (spacebar, arrows)  
☐ Click next/prev to navigate playlist  
☐ Show persistent storage (refresh page)  
☐ Demonstrate delete functionality  
☐ Toggle between different media types  
☐ Show animations in idle mode  

---

**Version**: 1.0 | **Status**: ✅ Production Ready  
**Created**: February 2026 | **Team Project**: Interactive Multimedia Fusion Studio

**Happy Creating! 🎨🎵🎬**

