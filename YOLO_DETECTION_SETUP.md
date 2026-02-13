# YOLO Detection & Shopping Feature - Setup

## Quick Install

```bash
cd backend
pip install ultralytics opencv-python
python main.py  # Restart backend
```

## Features

### Furniture Detection

- YOLOv8 object detection (GPU accelerated)
- Detects: sofa, bed, table, chair, TV
- 90%+ confidence detection
- Real-time bounding boxes

### Smart Suggestions

**Local Catalog** (📦 tab):

- 41 furniture items total
- 6-8 replacements per detected category
- Price range: ₹6.5k - ₹2.25L
- Sorted by price (budget to premium)

**Online Vendors** (🌐 tab):

- 5 curated vendor links per category
- Instant (0ms latency, no API calls)
- Real Indian websites: Pepperfry, Urban Ladder, IKEA, Amazon, WoodenStreet
- Direct shopping links with verified URLs
- Approximate prices in descriptions

### Budget Tracking

- Calculates cheapest replacement cost
- Shows remaining budget
- Within/Over budget status

## Usage

1. Upload furnished room image
2. Enter budget
3. Click "🔍 Re-Design (Detect Furniture)"
4. View detected furniture with confidence scores
5. **Switch tabs** to compare suggestions:
   - 📦 Local Replacements - Catalog items
   - 🌐 Online Suggestions - Vendor links
6. Click vendor links to shop

## Performance

- **GPU**: ~1-2 seconds detection
- **CPU**: ~5-10 seconds detection
- **Vendor suggestions**: Instant (0ms)
- **First run**: ~6MB YOLO model downloads

## Testing

Test image requirements:

- Contains visible furniture
- Clear, well-lit room photo
- Minimum 640px width recommended
