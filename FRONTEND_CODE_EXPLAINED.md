# Frontend Code Explained - Line by Line

This document provides a detailed explanation of every line of code in the frontend (HTML, CSS, and JavaScript).

---

## Table of Contents

1. [index.html - Structure](#indexhtml---structure)
2. [styles.css - Styling](#stylescss---styling)
3. [script.js - Functionality](#scriptjs---functionality)

---

## index.html - Structure

The HTML provides the complete user interface structure.

### Document Setup (Lines 1-8)

```html
<!DOCTYPE html>
```

**Purpose**: Declare HTML5 document type

- Tells browser this is modern HTML

```html
<html lang="en"></html>
```

**Purpose**: Root HTML element

- `lang="en"`: Page language is English (accessibility)

```html
<head>
  <meta charset="UTF-8" />
</head>
```

**Purpose**: Character encoding

- UTF-8: Supports all languages and symbols

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

**Purpose**: Responsive design meta tag

- `width=device-width`: Match screen width
- `initial-scale=1.0`: Don't zoom in/out by default
- Essential for mobile responsiveness

```html
<title>Budget-Constrained AI Interior Design System</title>
```

**Purpose**: Page title shown in browser tab

```html
<link rel="stylesheet" href="styles.css" />
```

**Purpose**: Link to CSS file

- All styling in separate file

```html
</head>
```

**Purpose**: End of head section

### Body Structure (Lines 9-148)

```html
<body>
  <div class="container"></div>
</body>
```

**Purpose**: Main wrapper

- `.container`: CSS class for centering and max-width

#### Header (Lines 11-14)

```html
<header class="header">
  <h1>🎨 AI Interior Design System</h1>
  <p>Budget-Constrained AI-Based Interior Design Recommendation System</p>
</header>
```

**Purpose**: Page header

- `<h1>`: Main heading
- `<p>`: Subtitle description

#### Main Content (Lines 16-140)

```html
<main class="main-content"></main>
```

**Purpose**: Main content area

- Semantic HTML5 element

```html
<!-- Error Display -->
<div id="error-message" class="error-message hidden"></div>
```

**Purpose**: Error message placeholder

- Initially hidden (`.hidden` class)
- JavaScript fills in error text when needed
- `id`: For JavaScript to access

```html
<!-- Upload Section -->
<section class="upload-section">
  <h2>Upload Room Photo</h2>
</section>
```

**Purpose**: Upload area

- `<section>`: Semantic grouping
- `<h2>`: Section heading

```html
<div id="drop-zone" class="drop-zone"></div>
```

**Purpose**: Drag-and-drop area

- `id="drop-zone"`: JavaScript needs to access this

```html
<div class="drop-zone-content">
  <svg
    class="upload-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
</div>
```

**Purpose**: Upload icon

- SVG: Scalable vector graphic
- Draws an upload arrow icon

```html
<p>Drag & drop your room image here</p>
<p class="drop-zone-hint">or click to browse</p>
```

**Purpose**: Instructions for user

```html
<input type="file" id="file-input" accept="image/*" hidden />
```

**Purpose**: Hidden file input

- `type="file"`: File picker
- `accept="image/*"`: Only allow images
- `hidden`: Not visible (activated by clicking drop zone)
- JavaScript triggers this

```html
        </div>
        <img id="preview-image" class="preview-image hidden" alt="Uploaded room">
```

**Purpose**: Image preview

- Initially hidden
- JavaScript sets `src` when image uploaded

```html
<button id="remove-image" class="remove-btn hidden">✕</button>
```

**Purpose**: Remove image button

- `✕`: Close/remove symbol
- Initially hidden
- Shows when image uploaded

#### Controls Section (Lines 44-85)

```html
<section class="controls-section">
  <h2>Design Settings</h2>
  <div class="controls-grid"></div>
</section>
```

**Purpose**: Settings area

- Grid layout for form controls

```html
<div class="control-group">
  <label for="room-type">Room Type</label>
  <select id="room-type" class="select-input">
    <option value="Living Room">Living Room</option>
    <option value="Bedroom">Bedroom</option>
    <option value="Kitchen">Kitchen</option>
    <option value="Bathroom">Bathroom</option>
    <option value="Office">Office</option>
    <option value="Dining Room">Dining Room</option>
  </select>
</div>
```

**Purpose**: Room type dropdown

- `<label for="...">`: Associates label with input
- `<select>`: Dropdown menu
- `<option>`: Each choice
- JavaScript reads `value` when generating

**Similar structure for:**

- Style selector (Minimalist, Modern, Vintage, Professional)
- Provider selector (Offline, Replicate, HuggingFace)
- Budget input (number field)

```html
<button id="generate-btn" class="generate-btn" disabled>
  <span id="btn-text">Generate Design</span>
  <span id="btn-loader" class="loader hidden"></span>
</button>
```

**Purpose**: Generate button

- `disabled`: Initially disabled (no image yet)
- `#btn-text`: Button label
- `#btn-loader`: Loading spinner (hidden initially)

#### Results Section (Lines 87-135)

```html
<section class="results-section">
  <div class="results-grid"></div>
</section>
```

**Purpose**: Display area for original and generated images

```html
<!-- Original Image -->
<div class="result-panel">
  <h3>Original Photo</h3>
  <div id="original-display" class="image-display empty">
    <p>Upload an image to begin</p>
  </div>
</div>
```

**Purpose**: Original image display

- `.empty`: Show placeholder text
- JavaScript replaces content when image uploaded

```html
<!-- Generated Image -->
<div class="result-panel">
  <h3>AI Design</h3>
  <div id="generated-display" class="image-display empty">
    <p>Your design will appear here</p>
    <div id="loading-state" class="loading-state hidden">
      <div class="spinner"></div>
      <p>Generating your design...</p>
    </div>
  </div>
</div>
```

**Purpose**: Generated image display

- Placeholder text initially
- Loading state (spinner) during generation
- JavaScript adds generated image here

```html
<img
  id="generated-image"
  class="generated-image hidden"
  alt="Generated design"
/>
```

**Purpose**: Actual generated image

- Initially hidden
- JavaScript sets `src` and shows when ready

```html
<button id="download-btn" class="download-btn hidden">
  <svg>...</svg>
  Download
</button>
```

**Purpose**: Download button

- Hidden until image generated
- SVG download icon

```html
<!-- Info Cards -->
<div id="info-cards" class="info-cards hidden">
  <div class="info-card budget-card">
    <h4>💰 Budget Status</h4>
    <div class="budget-details">
      <p>Estimated Cost: <span id="estimated-cost">-</span></p>
      <p>Your Budget: <span id="your-budget">-</span></p>
      <span id="budget-badge" class="badge">-</span>
    </div>
  </div>
</div>
```

**Purpose**: Budget information card

- Hidden until generation complete
- JavaScript fills in values

```html
        <div class="info-card provider-card">
            <h4>⚡ Generation Info</h4>
            <div class="provider-details">
                <p>Provider: <span id="provider-used">-</span></p>
                <p>Time Taken: <span id="time-taken">-</span></p>
            </div>
        </div>
    </div>
```

**Purpose**: Generation info card

- Provider name and time

#### Footer (Lines 141-143)

```html
<footer class="footer">
  <p>MSc Interior Design AI System | GPU-Accelerated Offline Generation</p>
</footer>
```

**Purpose**: Page footer

```html
    <script src="script.js"></script>
</body>
</html>
```

**Purpose**: Load JavaScript

- At end of body for faster page load

---

## styles.css - Styling

All visual styling for the application.

### Reset & Variables (Lines 1-18)

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

**Purpose**: CSS reset

- Remove default browser margins/padding
- `box-sizing: border-box`: Padding/border included in width

```css
:root {
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --success: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
  --bg: #f9fafb;
  --surface: #ffffff;
  --text: #111827;
  --text-muted: #6b7280;
  --border: #e5e7eb;
  --shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

**Purpose**: CSS custom properties (variables)

- Define color scheme
- Reused throughout CSS
- Easy to change theme

### Body & Container (Lines 20-28)

```css
body {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  background-color: var(--bg);
  color: var(--text);
  line-height: 1.6;
}
```

**Purpose**: Base body styling

- System font stack (native fonts)
- Light gray background
- Dark text color
- 1.6 line height for readability

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
```

**Purpose**: Content wrapper

- Max 1200px wide
- Centered (auto margins)
- 20px padding on sides

### Header (Lines 30-42)

```css
.header {
  text-align: center;
  padding: 40px 20px;
  background: linear-gradient(
    135deg,
    var(--primary) 0%,
    var(--primary-dark) 100%
  );
  color: white;
  border-radius: 12px;
  margin-bottom: 30px;
}
```

**Purpose**: Header styling

- Centered text
- Blue gradient background
- White text
- Rounded corners

### Drop Zone (Lines 72-158)

```css
.drop-zone {
  position: relative;
  border: 2px dashed var(--border);
  border-radius: 12px;
  padding: 60px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}
```

**Purpose**: Upload area styling

- Dashed border
- Large padding
- Cursor shows it's clickable
- Smooth transitions

```css
.drop-zone:hover {
  border-color: var(--primary);
  background-color: #eff6ff;
}
```

**Purpose**: Hover effect

- Blue border on hover
- Light blue background
- Visual feedback for interaction

```css
.drop-zone.dragover {
  border-color: var(--primary);
  background-color: #dbeafe;
}
```

**Purpose**: Drag-over state

- When dragging file over zone
- Darker blue background
- JavaScript adds this class

### Generate Button (Lines 195-235)

```css
.generate-btn {
  width: 100%;
  padding: 15px;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
```

**Purpose**: Primary action button

- Full width
- Blue background
- Large, readable text
- Flexbox for centering content

```css
.generate-btn:hover:not(:disabled) {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

**Purpose**: Hover effect (if not disabled)

- Darker blue
- Lifts up 2px
- Drop shadow
- Feels interactive

```css
.generate-btn:disabled {
  background-color: var(--text-muted);
  cursor: not-allowed;
  opacity: 0.6;
}
```

**Purpose**: Disabled state

- Gray color
- "Not allowed" cursor
- Faded appearance

### Loading Spinner (Lines 222-235)

```css
.loader {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

**Purpose**: Spinning loader animation

- Circular border
- Top border white (creates spinning effect)
- Rotates continuously
- Shown during generation

### Image Displays (Lines 264-292)

```css
.image-display {
  position: relative;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
```

**Purpose**: Image container

- Fixed aspect ratio (4:3)
- Flexbox centers content
- Hidden overflow (clips image)

### Budget Badge (Lines 372-386)

```css
.badge.within-budget {
  background-color: #d1fae5;
  color: #065f46;
}

.badge.over-budget {
  background-color: #fee2e2;
  color: #991b1b;
}
```

**Purpose**: Color-coded budget status

- Green for within budget
- Red for over budget
- JavaScript adds appropriate class

### Responsive Design (Lines 396-411)

```css
@media (max-width: 768px) {
  .header h1 {
    font-size: 1.8rem;
  }

  .controls-grid {
    grid-template-columns: 1fr;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }
}
```

**Purpose**: Mobile responsiveness

- Smaller heading on phones
- Single column layout
- Stacks vertically on narrow screens

---

## script.js - Functionality

All interactive behavior.

### Setup (Lines 1-42)

```javascript
const BACKEND_URL = "http://localhost:8000";
```

**Purpose**: Backend server address

- Single place to change if port differs

```javascript
// DOM Elements
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
// ... etc
```

**Purpose**: Get references to HTML elements

- `getElementById`: Find element by ID
- Store in constants for easy access
- Done once at startup

```javascript
// State
let uploadedFile = null;
let isGenerating = false;
```

**Purpose**: Application state

- `uploadedFile`: Stores the File object
- `isGenerating`: Prevents double-clicks

```javascript
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
});
```

**Purpose**: Wait for page to load

- `DOMContentLoaded`: Fired when HTML fully loaded
- Then set up all event listeners

### Event Listeners (Lines 44-86)

```javascript
function setupEventListeners() {
    // Drop zone click
    dropZone.addEventListener('click', () => {
        if (!uploadedFile) {
            fileInput.click();
        }
    });
```

**Purpose**: Click drop zone to browse files

- Only if no file uploaded yet
- Triggers hidden file input

```javascript
// File input change
fileInput.addEventListener("change", handleFileSelect);
```

**Purpose**: When user selects file via browser

- Calls `handleFileSelect` function

```javascript
// Drag and drop
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});
```

**Purpose**: Drag over zone

- `e.preventDefault()`: Allow drop (default is reject)
- Add `dragover` class (CSS changes appearance)

```javascript
dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("dragover");
});
```

**Purpose**: Drag leaves zone

- Remove highlight

```javascript
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFileUpload(files[0]);
  }
});
```

**Purpose**: File dropped

- Prevent default (don't open file in browser)
- Remove highlight
- Get dropped files
- Process first file

### File Upload (Lines 88-130)

```javascript
function handleFileUpload(file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
        showError('Please upload an image file (PNG, JPG, etc.)');
        return;
    }
```

**Purpose**: Validate it's an image

- Check MIME type starts with "image/"
- Show error if not

```javascript
// Validate file size (10MB max)
if (file.size > 10 * 1024 * 1024) {
  showError("Image size must be less than 10MB");
  return;
}
```

**Purpose**: Validate size

- 10MB = 10 _ 1024 _ 1024 bytes
- Reject if too large

```javascript
uploadedFile = file;
```

**Purpose**: Store file in memory

```javascript
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.classList.remove('hidden');
        removeImageBtn.classList.remove('hidden');

        // Hide drop zone content
        document.querySelector('.drop-zone-content').style.display = 'none';
```

**Purpose**: Read file and show preview

- `FileReader`: Reads file as base64 data URL
- `onload`: Callback when read complete
- `e.target.result`: Base64 string
- Set as image `src`
- Show image and remove button
- Hide upload instructions

```javascript
// Update original display
originalDisplay.innerHTML = `<img src="${e.target.result}" alt="Original room" style="width: 100%; height: 100%; object-fit: cover;">`;
originalDisplay.classList.remove("empty");
```

**Purpose**: Also show in results area

- Create `<img>` tag with base64 src
- Replace placeholder content

```javascript
// Enable generate button
generateBtn.disabled = false;
```

**Purpose**: Allow user to generate now

```javascript
reader.readAsDataURL(file);
```

**Purpose**: Start reading file

- Triggers `onload` when done

### Generation (Lines 158-218)

```javascript
async function handleGenerate() {
    if (!uploadedFile || isGenerating) return;
```

**Purpose**: Guard clause

- Don't run if no file or already generating

```javascript
isGenerating = true;
generateBtn.disabled = true;
btnText.textContent = "Generating...";
btnLoader.classList.remove("hidden");
```

**Purpose**: Set loading state

- Disable button
- Change text
- Show spinner

```javascript
// Show loading state
generatedDisplay.querySelector("p").style.display = "none";
loadingState.classList.remove("hidden");
generatedImage.classList.add("hidden");
downloadBtn.classList.add("hidden");
infoCards.classList.add("hidden");
```

**Purpose**: Update UI for generation

- Hide placeholder text
- Show loading spinner
- Hide previous results

```javascript
    try {
        // Prepare form data
        const formData = new FormData();
        formData.append('image', uploadedFile);
        formData.append('room_type', roomTypeSelect.value);
        formData.append('style', styleSelect.value);
        formData.append('budget', budgetInput.value);
        formData.append('provider', providerSelect.value);
```

**Purpose**: Build form data for API

- `FormData`: HTML5 API for multipart forms
- Append file and all form values
- Exactly what backend expects

```javascript
// Call backend API
const response = await fetch(`${BACKEND_URL}/api/generate`, {
  method: "POST",
  body: formData,
});
```

**Purpose**: **SEND REQUEST TO BACKEND**

- `fetch`: Modern HTTP request API
- `await`: Wait for response
- POST to `/api/generate`
- Send FormData as body (automatically sets correct headers)

```javascript
if (!response.ok) {
  const errorData = await response.json();
  throw new Error(errorData.detail || "Generation failed");
}
```

**Purpose**: Check for error response

- `response.ok`: True if status 200-299
- If error, parse error message
- Throw error (caught below)

```javascript
const result = await response.json();
```

**Purpose**: Parse JSON response

- Contains `image_url`, `estimated_cost`, etc.

```javascript
// Display generated image
generatedImage.src = result.image_url;
generatedImage.onload = () => {
  loadingState.classList.add("hidden");
  generatedImage.classList.remove("hidden");
  downloadBtn.classList.remove("hidden");
};
```

**Purpose**: Show generated image

- Set `src` to image URL from backend
- `onload`: Wait for image to load
- Then hide loading, show image and download button

```javascript
// Display info cards immediately
displayGenerationInfo(result);
```

**Purpose**: Show budget and time info

- Call function to populate info cards

```javascript
    } catch (error) {
        showError(`Failed to generate design: ${error.message}`);
        loadingState.classList.add('hidden');
        generatedDisplay.querySelector('p').style.display = 'block';
    }
```

**Purpose**: Error handling

- Show error message to user
- Hide loading state
- Show placeholder again

```javascript
    finally {
        isGenerating = false;
        generateBtn.disabled = false;
        btnText.textContent = 'Generate Design';
        btnLoader.classList.add('hidden');
    }
```

**Purpose**: Cleanup (runs always)

- Re-enable button
- Reset text
- Hide spinner

### Display Info (Lines 220-240)

```javascript
function displayGenerationInfo(result) {
    // Budget status
    estimatedCostSpan.textContent = `₹${result.estimated_cost.toLocaleString()}`;
    yourBudgetSpan.textContent = `₹${result.budget.toLocaleString()}`;
```

**Purpose**: Show costs with rupee symbol

- `toLocaleString()`: Adds thousand separators (e.g., "250,000")

```javascript
budgetBadge.textContent =
  result.status === "within_budget" ? "✓ Within Budget" : "⚠ Over Budget";
budgetBadge.className = "badge";
budgetBadge.classList.add(
  result.status === "within_budget" ? "within-budget" : "over-budget"
);
```

**Purpose**: Set badge text and color

- Ternary operator: `condition ? if_true : if_false`
- Reset classes, then add appropriate one
- CSS colors it green or red

```javascript
// Provider info
const providerNames = {
  offline: "Offline (Local GPU)",
  replicate: "Replicate (Online)",
  hf: "HuggingFace (Online)",
};
providerUsedSpan.textContent =
  providerNames[result.provider_used] || result.provider_used;
```

**Purpose**: Convert provider code to friendly name

- Dictionary lookup
- Falls back to raw value if not found

```javascript
timeTakenSpan.textContent = `${result.time_taken_sec}s`;
```

**Purpose**: Show generation time

```javascript
// Show info cards
infoCards.classList.remove("hidden");
```

**Purpose**: Make cards visible

### Download (Lines 242-262)

```javascript
async function handleDownload() {
    if (generatedImage.src) {
        try {
            // Fetch the image as a blob to handle CORS properly
            const response = await fetch(generatedImage.src);
            const blob = await response.blob();
```

**Purpose**: Download image as file

- `fetch` the image URL
- `.blob()`: Get as binary data
- Necessary for cross-origin images

```javascript
// Create a download link
const url = window.URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = url;
link.download = `interior-design-${Date.now()}.png`;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
```

**Purpose**: Programmatic download

- Create blob URL
- Create `<a>` element
- Set href and download name
- Add to DOM (required for click to work)
- Click it (triggers download)
- Remove from DOM

```javascript
// Clean up the blob URL
window.URL.revokeObjectURL(url);
```

**Purpose**: Free memory

- Blob URLs take up memory
- Revoke when done

### Error Handling (Lines 264-272)

```javascript
function showError(message) {
  errorMessage.textContent = `⚠ ${message}`;
  errorMessage.classList.remove("hidden");

  // Auto-hide after 5 seconds
  setTimeout(() => {
    hideError();
  }, 5000);
}
```

**Purpose**: Display error message

- Set text
- Show element
- Auto-hide after 5 seconds

```javascript
function hideError() {
  errorMessage.classList.add("hidden");
}
```

**Purpose**: Hide error message

### Drag Prevention (Lines 274-276)

```javascript
// Prevent default drag behavior on document
document.addEventListener("dragover", (e) => e.preventDefault());
document.addEventListener("drop", (e) => e.preventDefault());
```

**Purpose**: Prevent accidental file opens

- By default, dropping file on page opens it
- This prevents that (we only want drop in drop zone)

---

## Summary

The frontend is a **single-page application** built with vanilla HTML/CSS/JS:

### HTML Structure:

- Header with title
- Upload section with drag & drop
- Controls section with form inputs
- Results section with image displays
- Info cards for budget and provider

### CSS Styling:

- Modern, clean design
- Responsive layout
- Color-coded feedback
- Smooth animations
- Professional appearance

### JavaScript Functionality:

- File upload with validation
- Drag and drop support
- API communication with backend
- Dynamic UI updates
- Error handling
- Image download

**Complete Flow:**

1. User uploads image → Preview shown
2. User configures settings
3. User clicks generate
4. JavaScript sends request to backend
5. Shows loading state
6. Receives generated image
7. Displays image and info
8. User can download

**100% original, no frameworks, fully functional!** 🎉
