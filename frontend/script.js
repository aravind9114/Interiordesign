// Budget-Constrained AI Interior Design System
// 100% Original Frontend Implementation

const BACKEND_URL = "http://localhost:8000";

// DOM Elements
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const previewImage = document.getElementById("preview-image");
const removeImageBtn = document.getElementById("remove-image");
const originalDisplay = document.getElementById("original-display");
const generatedDisplay = document.getElementById("generated-display");
const loadingState = document.getElementById("loading-state");
const generatedImage = document.getElementById("generated-image");
const downloadBtn = document.getElementById("download-btn");
const generateBtn = document.getElementById("generate-btn");
const btnText = document.getElementById("btn-text");
const btnLoader = document.getElementById("btn-loader");
const detectBtn = document.getElementById("detect-btn");
const detectText = document.getElementById("detect-text");
const detectLoader = document.getElementById("detect-loader");
const errorMessage = document.getElementById("error-message");
const infoCards = document.getElementById("info-cards");
const detectionResults = document.getElementById("detection-results");
const detectionsList = document.getElementById("detections-list");
const suggestionsList = document.getElementById("suggestions-list");
const remainingBudgetSpan = document.getElementById("remaining-budget");
const tabLocal = document.getElementById("tab-local");
const tabOnline = document.getElementById("tab-online");
const localSuggestions = document.getElementById("local-suggestions");
const onlineSuggestions = document.getElementById("online-suggestions");
const onlineSuggestionsList = document.getElementById(
  "online-suggestions-list"
);

// Form inputs
const roomTypeSelect = document.getElementById("room-type");
const styleSelect = document.getElementById("style");
const providerSelect = document.getElementById("provider");
const budgetInput = document.getElementById("budget");

//Info displays
const estimatedCostSpan = document.getElementById("estimated-cost");
const yourBudgetSpan = document.getElementById("your-budget");
const budgetBadge = document.getElementById("budget-badge");
const providerUsedSpan = document.getElementById("provider-used");
const timeTakenSpan = document.getElementById("time-taken");

// State
let uploadedFile = null;
let isGenerating = false;
let isDetecting = false;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
});

function setupEventListeners() {
  // Drop zone click
  dropZone.addEventListener("click", () => {
    if (!uploadedFile) {
      fileInput.click();
    }
  });

  // File input change
  fileInput.addEventListener("change", handleFileSelect);

  // Drag and drop
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  });

  // Remove image
  removeImageBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    resetUpload();
  });

  // Generate button
  generateBtn.addEventListener("click", handleGenerate);

  // Detect button
  detectBtn.addEventListener("click", handleDetect);

  // Tab switching
  tabLocal.addEventListener("click", () => switchTab("local"));
  tabOnline.addEventListener("click", () => switchTab("online"));

  // Download button
  downloadBtn.addEventListener("click", handleDownload);
}

function switchTab(tab) {
  if (tab === "local") {
    tabLocal.classList.add("active");
    tabOnline.classList.remove("active");
    localSuggestions.classList.remove("hidden");
    onlineSuggestions.classList.add("hidden");
  } else {
    tabOnline.classList.add("active");
    tabLocal.classList.remove("active");
    onlineSuggestions.classList.remove("hidden");
    localSuggestions.classList.add("hidden");
  }
}

function handleFileSelect(e) {
  const file = e.target.files[0];
  if (file) {
    handleFileUpload(file);
  }
}

function handleFileUpload(file) {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    showError("Please upload an image file (PNG, JPG, etc.)");
    return;
  }

  // Validate file size (10MB max)
  if (file.size > 10 * 1024 * 1024) {
    showError("Image size must be less than 10MB");
    return;
  }

  uploadedFile = file;

  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImage.src = e.target.result;
    previewImage.classList.remove("hidden");
    removeImageBtn.classList.remove("hidden");

    // Hide drop zone content
    document.querySelector(".drop-zone-content").style.display = "none";

    // Update original display
    originalDisplay.innerHTML = `<img src="${e.target.result}" alt="Original room" style="width: 100%; height: 100%; object-fit: cover;">`;
    originalDisplay.classList.remove("empty");

    // Enable generate button
    generateBtn.disabled = false;
    detectBtn.disabled = false;

    hideError();
  };
  reader.readAsDataURL(file);
}

function resetUpload() {
  uploadedFile = null;
  fileInput.value = "";
  previewImage.src = "";
  previewImage.classList.add("hidden");
  removeImageBtn.classList.add("hidden");
  document.querySelector(".drop-zone-content").style.display = "flex";

  originalDisplay.innerHTML = "<p>Upload an image to begin</p>";
  originalDisplay.classList.add("empty");

  generateBtn.disabled = true;

  // Reset generated image
  resetGeneratedImage();
}

function resetGeneratedImage() {
  generatedImage.src = "";
  generatedImage.classList.add("hidden");
  downloadBtn.classList.add("hidden");
  loadingState.classList.add("hidden");
  generatedDisplay.querySelector("p").style.display = "block";
  infoCards.classList.add("hidden");
}

async function handleGenerate() {
  if (!uploadedFile || isGenerating) return;

  isGenerating = true;
  generateBtn.disabled = true;
  btnText.textContent = "Generating...";
  btnLoader.classList.remove("hidden");

  // Show loading state
  generatedDisplay.querySelector("p").style.display = "none";
  loadingState.classList.remove("hidden");
  generatedImage.classList.add("hidden");
  downloadBtn.classList.add("hidden");
  infoCards.classList.add("hidden");

  hideError();

  try {
    // Prepare form data
    const formData = new FormData();
    formData.append("image", uploadedFile);
    formData.append("room_type", roomTypeSelect.value);
    formData.append("style", styleSelect.value);
    formData.append("budget", budgetInput.value);
    formData.append("provider", providerSelect.value);

    // Call backend API
    const response = await fetch(`${BACKEND_URL}/api/generate`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Generation failed");
    }

    const result = await response.json();

    // Display generated image
    generatedImage.src = result.image_url;
    generatedImage.onload = () => {
      loadingState.classList.add("hidden");
      generatedImage.classList.remove("hidden");
      downloadBtn.classList.remove("hidden"); // Fixed: should SHOW button
    };

    // Display info cards immediately
    displayGenerationInfo(result);
  } catch (error) {
    showError(`Failed to generate design: ${error.message}`);
    loadingState.classList.add("hidden");
    generatedDisplay.querySelector("p").style.display = "block";
  } finally {
    isGenerating = false;
    generateBtn.disabled = false;
    btnText.textContent = "Generate Design";
    btnLoader.classList.add("hidden");
  }
}

function displayGenerationInfo(result) {
  // Budget status
  estimatedCostSpan.textContent = `₹${result.estimated_cost.toLocaleString()}`;
  yourBudgetSpan.textContent = `₹${result.budget.toLocaleString()}`;

  budgetBadge.textContent =
    result.status === "within_budget" ? "✓ Within Budget" : "⚠ Over Budget";
  budgetBadge.className = "badge";
  budgetBadge.classList.add(
    result.status === "within_budget" ? "within-budget" : "over-budget"
  );

  // Provider info
  const providerNames = {
    offline: "Offline (Local GPU)",
    replicate: "Replicate (Online)",
    hf: "HuggingFace (Online)",
  };
  providerUsedSpan.textContent =
    providerNames[result.provider_used] || result.provider_used;
  timeTakenSpan.textContent = `${result.time_taken_sec}s`;

  // Show info cards
  infoCards.classList.remove("hidden");
}

async function handleDownload() {
  if (generatedImage.src) {
    try {
      // Fetch the image as a blob to handle CORS properly
      const response = await fetch(generatedImage.src);
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `interior-design-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      showError(
        'Failed to download image. Please try right-clicking the image and selecting "Save Image As"'
      );
    }
  }
}

async function handleDetect() {
  if (!uploadedFile || isDetecting) return;

  isDetecting = true;
  detectBtn.disabled = true;
  detectText.textContent = "Detecting...";
  detectLoader.classList.remove("hidden");

  // Hide previous results
  detectionResults.classList.add("hidden");
  infoCards.classList.add("hidden");

  try {
    const formData = new FormData();
    formData.append("image", uploadedFile);
    formData.append("budget", budgetInput.value);

    const response = await fetch(`${BACKEND_URL}/vision/detect`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Detection failed");
    }

    const result = await response.json();

    // Display detections
    displayDetections(result.detections);

    // Display suggestions
    displaySuggestions(result.suggestions);

    // Display online suggestions
    if (result.online_suggestions) {
      displayOnlineSuggestions(result.online_suggestions);
    }

    // Show remaining budget
    remainingBudgetSpan.textContent = `₹${result.remaining_budget.toLocaleString()}`;

    // Show results
    detectionResults.classList.remove("hidden");
  } catch (error) {
    showError(`Detection failed: ${error.message}`);
  } finally {
    isDetecting = false;
    detectBtn.disabled = false;
    detectText.textContent = "🔍 Re-Design (Detect Furniture)";
    detectLoader.classList.add("hidden");
  }
}

function displayDetections(detections) {
  detectionsList.innerHTML = "";

  if (detections.length === 0) {
    detectionsList.innerHTML = "<p>No furniture detected in this image.</p>";
    return;
  }

  detections.forEach((detection) => {
    const item = document.createElement("div");
    item.className = "detection-item";
    item.innerHTML = `
            <h4>${detection.label}</h4>
            <p class="detection-confidence">${(detection.confidence * 100).toFixed(0)}% confident</p>
        `;
    detectionsList.appendChild(item);
  });
}

function displaySuggestions(suggestions) {
  suggestionsList.innerHTML = "";

  if (suggestions.length === 0) {
    suggestionsList.innerHTML = "<p>No replacement suggestions available.</p>";
    return;
  }

  suggestions.forEach((suggestion) => {
    const card = document.createElement("div");
    card.className = "suggestion-card";

    const detected = suggestion.detected;
    const items = suggestion.suggested_items;

    let itemsHTML = items
      .map(
        (item) => `
            <div class="furniture-item">
                <h5>${item.name}</h5>
                <div class="furniture-price">₹${item.price.toLocaleString()}</div>
                <div class="furniture-vendor">
                    Vendor: <a href="${item.vendor_link || "#"}" target="_blank">${item.vendor}</a>
                </div>
            </div>
        `
      )
      .join("");

    card.innerHTML = `
            <h4>Replace ${detected.label} (${detected.category})</h4>
            ${itemsHTML}
        `;

    suggestionsList.appendChild(card);
  });
}

function displayOnlineSuggestions(onlineSuggestions) {
  onlineSuggestionsList.innerHTML = "";

  // Check if we have any suggestions
  const hasResults = Object.values(onlineSuggestions).some(
    (cat) => cat.results && cat.results.length > 0
  );

  if (!hasResults) {
    onlineSuggestionsList.innerHTML =
      "<p>No online suggestions available. Check your internet connection or try the Local Replacements tab.</p>";
    return;
  }

  // Display by category
  Object.entries(onlineSuggestions).forEach(([category, data]) => {
    if (!data.results || data.results.length === 0) return;

    // Category title
    const categoryTitle = document.createElement("h4");
    categoryTitle.className = "online-category-title";
    categoryTitle.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} Options`;
    onlineSuggestionsList.appendChild(categoryTitle);

    // Add cache/latency info
    const metaInfo = document.createElement("p");
    metaInfo.style.fontSize = "0.8rem";
    metaInfo.style.color = "var(--text-muted)";
    metaInfo.textContent = `Source: DuckDuckGo | ${data.cache === "hit" ? "🟢 Cached" : "🔵 Fresh"} | ${data.latency_ms}ms`;
    onlineSuggestionsList.appendChild(metaInfo);

    // Display each result
    data.results.forEach((item) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "online-item";

      const header = document.createElement("div");
      header.className = "online-item-header";

      const titleLink = document.createElement("a");
      titleLink.className = "online-item-title";
      titleLink.href = item.url;
      titleLink.target = "_blank";
      titleLink.textContent = item.title;

      const badges = document.createElement("div");
      badges.className = "online-badges";

      // Domain badge
      const domainBadge = document.createElement("span");
      domainBadge.className = "domain-badge";
      domainBadge.textContent = item.domain;
      badges.appendChild(domainBadge);

      // Price badge (if available)
      if (item.approx_price) {
        const priceBadge = document.createElement("span");
        priceBadge.className = "price-badge";
        priceBadge.textContent = `~₹${item.approx_price.toLocaleString()}`;
        badges.appendChild(priceBadge);
      }

      header.appendChild(titleLink);
      header.appendChild(badges);

      const snippet = document.createElement("p");
      snippet.className = "online-item-snippet";
      snippet.textContent = item.snippet;

      itemDiv.appendChild(header);
      itemDiv.appendChild(snippet);

      onlineSuggestionsList.appendChild(itemDiv);
    });
  });
}

function showError(message) {
  errorMessage.textContent = `⚠ ${message}`;
  errorMessage.classList.remove("hidden");

  // Auto-hide after 5 seconds
  setTimeout(() => {
    hideError();
  }, 5000);
}

function hideError() {
  errorMessage.classList.add("hidden");
}

// Prevent default drag behavior on document
document.addEventListener("dragover", (e) => e.preventDefault());
document.addEventListener("drop", (e) => e.preventDefault());
