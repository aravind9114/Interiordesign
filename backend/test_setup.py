"""
Quick test script to verify backend setup and dependencies.
Run this before starting the main backend server.
"""
import sys

def test_imports():
    """Test if all required packages are installed."""
    print("Testing package imports...")
    
    required_packages = {
        "fastapi": "FastAPI",
        "uvicorn": "Uvicorn",
        "torch": "PyTorch",
        "diffusers": "Diffusers",
        "PIL": "Pillow",
        "transformers": "Transformers",
    }
    
    missing = []
    for module, name in required_packages.items():
        try:
            __import__(module)
            print(f"  ✓ {name}")
        except ImportError:
            print(f"  ✗ {name} - MISSING")
            missing.append(name)
    
    if missing:
        print(f"\n⚠️  Missing packages: {', '.join(missing)}")
        print("Run: pip install -r requirements.txt")
        return False
    
    print("\n✓ All packages installed!")
    return True


def test_cuda():
    """Test CUDA availability."""
    print("\nTesting CUDA availability...")
    
    try:
        import torch
        
        if torch.cuda.is_available():
            device_name = torch.cuda.get_device_name(0)
            print(f"  ✓ CUDA is available!")
            print(f"  ✓ GPU: {device_name}")
            print(f"  ✓ CUDA Version: {torch.version.cuda}")
        else:
            print("  ⚠️  CUDA not available - will use CPU (slower)")
            print("  💡 This is OK, but generation will take ~2-5 minutes per image")
    except Exception as e:
        print(f"  ✗ Error checking CUDA: {e}")


def test_directories():
    """Test if storage directories exist."""
    print("\nTesting storage directories...")
    
    from pathlib import Path
    
    storage_dir = Path(__file__).parent / "storage"
    uploads_dir = storage_dir / "uploads"
    generated_dir = storage_dir / "generated"
    
    for dir_path, name in [(uploads_dir, "uploads"), (generated_dir, "generated")]:
        if dir_path.exists():
            print(f"  ✓ {name}/ exists")
        else:
            print(f"  ⚠️  {name}/ does not exist (will be created on first run)")


if __name__ == "__main__":
    print("=" * 60)
    print("Backend Setup Verification")
    print("=" * 60)
    print()
    
    # Test imports
    if not test_imports():
        sys.exit(1)
    
    # Test CUDA
    test_cuda()
    
    # Test directories
    test_directories()
    
    print()
    print("=" * 60)
    print("✓ Setup verification complete!")
    print()
    print("To start the backend server, run:")
    print("  python main.py")
    print()
    print("Backend will be available at: http://localhost:8000")
    print("=" * 60)
