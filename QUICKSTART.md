# Quick Start Guide

## Step 1: Install Backend Dependencies

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows

# Install all packages
pip install -r requirements.txt

# Install PyTorch with CUDA (for GPU acceleration)
# Check your CUDA version first: nvidia-smi
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121

# Verify installation
python test_setup.py
```

## Step 2: Start Backend

```bash
# Make sure you're in backend/ directory and venv is activated
python main.py
```

Backend will run at: `http://localhost:8000`

**On first run**: Model files (~4GB) will download automatically. This may take 10-30 minutes.

## Step 3: Start Frontend (New Terminal)

```bash
# From project root directory
bun install
bun dev
```

Frontend will run at: `http://localhost:3000`

## Step 4: Use the App

1. Open browser to `http://localhost:3000`
2. Upload a room photo
3. Select room type and style
4. Select provider: **"Offline (Local GPU)"** (no API key needed!)
5. Enter budget
6. Click "Generate Design"

**Expected time**:

- GPU: ~10-30 seconds
- CPU: ~2-5 minutes

---

## Troubleshooting

### "No module named 'fastapi'"

```bash
cd backend
pip install -r requirements.txt
```

### "CUDA not available"

- Install NVIDIA drivers
- Reinstall PyTorch with CUDA: `pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121`
- OR accept CPU mode (slower but works)

### Frontend can't connect

- Make sure backend is running at `localhost:8000`
- Check browser console for errors

---

## Optional: Configure Online Providers

Create `backend/.env`:

```
REPLICATE_API_TOKEN=your_token_here
HF_API_TOKEN=your_token_here
```

Then select online providers in the UI dropdown.

---

**That's it! You now have a fully functional offline AI interior design system! 🎨✨**
