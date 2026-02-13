# YOLO Detection Feature - Installation

## 1. Install Dependencies

```bash
cd backend
pip install ultralytics opencv-python
```

## 2. Verify Installation

The YOLO model will download automatically on first use (~6MB).

## 3. Restart Backend

```bash
python main.py
```

## 4. Usage

1. Upload furnished room image
2. Enter budget
3. Click "🔍 Re-Design (Detect Furniture)"
4. View detected furniture and replacement suggestions

## Features

- YOLOv8 object detection (GPU accelerated)
- Detects: sofa, bed, table, chair, TV
- Suggests 3 cheapest replacements per item
- Shows remaining budget

## Testing

Test image requirements:

- Contains visible furniture
- Clear, well-lit room photo
- Minimum 640px width recommended

## Performance

- GPU: ~1-2 seconds detection
- CPU: ~5-10 seconds detection
- Generation remains unchanged (~8 seconds GPU)
