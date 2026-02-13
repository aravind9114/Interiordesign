# Online Providers Setup Guide

This guide explains how to set up and use Replicate and HuggingFace providers for AI image generation.

---

## Why Use Online Providers?

While the **offline mode** works perfectly without any setup, online providers offer:

- **No GPU Required**: Run on any computer, even without NVIDIA GPU
- **Faster on Low-End Hardware**: Cloud GPUs are powerful
- **Different Models**: Access to alternative AI models
- **Scalability**: No local resource constraints

**Cost Comparison:**

- **Offline**: 100% Free, requires GPU (or slow on CPU)
- **Replicate**: ~$0.002-0.01 per image
- **HuggingFace**: Free tier available (limited requests/month)

---

## Option 1: Replicate (Recommended)

Replicate offers high-quality AI models via a simple API.

### Step 1: Create Account

1. Go to **https://replicate.com**
2. Click **"Sign up"** (top right)
3. Sign up with:
   - GitHub account (easiest), or
   - Google account, or
   - Email

### Step 2: Get API Token

1. After logging in, go to **Account Settings**
   - Direct link: https://replicate.com/account/api-tokens
2. Click **"Create token"** or use the default token
3. **Copy the token** (starts with `r8_...`)
   - ⚠️ Save it somewhere safe!
   - You won't be able to see it again

**Example token**: `r8_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`

### Step 3: Add Token to Backend

1. Open your backend directory:

   ```bash
   cd C:\Users\[YourName]\Desktop\interior-designer-ai\backend
   ```

2. Create a file named `.env` (if it doesn't exist):

   ```bash
   notepad .env
   ```

3. Add this line to the file:

   ```
   REPLICATE_API_TOKEN=r8_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
   ```

   _(Replace with your actual token)_

4. Save and close the file

### Step 4: Restart Backend

```bash
# In the backend terminal, press Ctrl+C to stop

# Restart the backend
python main.py
```

You should see:

```
[INFO] Starting Budget-Constrained AI Interior Design Backend
[INFO] Provider: offline (Diffusers img2img)
```

### Step 5: Use Replicate

1. Open your browser to: **http://localhost:8080**
2. In the **"AI Provider"** dropdown, select **"Replicate (Online)"**
3. Upload an image and click **"Generate Design"**

**What happens:**

- Your image is sent to Replicate's servers
- Replicate runs the AI model on their GPUs
- Generated image is returned to you
- **Time**: ~20-40 seconds
- **Cost**: Automatically charged to your Replicate account

### Pricing

Replicate charges per second of GPU usage:

- **Stable Diffusion 1.5**: ~$0.002-0.005 per image
- **Premium models**: ~$0.01-0.02 per image
- **Free tier**: $5 free credit (many images!)

Check current pricing: https://replicate.com/pricing

### Monitoring Usage

1. Go to https://replicate.com/account
2. Click **"Usage"** to see:
   - Number of predictions
   - Cost per prediction
   - Total spend

---

## Option 2: HuggingFace Inference API

HuggingFace offers free and paid AI model hosting.

### Step 1: Create Account

1. Go to **https://huggingface.co**
2. Click **"Sign up"** (top right)
3. Create account with:
   - Email and password, or
   - GitHub, or
   - Google

### Step 2: Get API Token

1. After logging in, click your **profile picture** (top right)
2. Select **"Settings"**
3. Click **"Access Tokens"** in the left sidebar
   - Direct link: https://huggingface.co/settings/tokens
4. Click **"New token"**
5. Configure:
   - **Name**: "Interior Design App"
   - **Role**: Select **"Read"** (sufficient for inference)
6. Click **"Generate token"**
7. **Copy the token** (starts with `hf_...`)

**Example token**: `hf_AbCdEfGhIjKlMnOpQrStUvWxYz1234567890`

### Step 3: Add Token to Backend

1. Open `backend/.env` file:

   ```bash
   notepad backend\.env
   ```

2. Add this line:

   ```
   HF_API_TOKEN=hf_AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
   ```

   _(Replace with your actual token)_

3. If you also have Replicate, your `.env` will look like:

   ```
   REPLICATE_API_TOKEN=r8_abc123...
   HF_API_TOKEN=hf_AbCdEf...
   ```

4. Save and close

### Step 4: Restart Backend

```bash
# Press Ctrl+C in backend terminal

# Restart
python main.py
```

### Step 5: Use HuggingFace

1. Open browser: **http://localhost:8080**
2. Select **"HuggingFace (Online)"** from provider dropdown
3. Upload image and generate

**What happens:**

- Request sent to HuggingFace Inference API
- Runs on HuggingFace's cloud GPUs
- Returns generated image
- **Time**: ~30-60 seconds (can be slower during high traffic)

### Pricing

HuggingFace Inference API:

- **Free tier**:
  - 30,000 tokens/month free
  - ~100-200 image generations
  - Good for testing and demos

- **Pro tier** ($9/month):
  - More requests
  - Priority access
  - Faster inference

- **Enterprise**: Custom pricing

Check: https://huggingface.co/pricing

### Rate Limits

Free tier limits:

- **Requests per minute**: ~60
- **Requests per month**: Based on compute units
- If exceeded: Temporary cooldown

---

## Using Both Providers

You can configure both and switch between them:

**Your `.env` file:**

```
REPLICATE_API_TOKEN=r8_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
HF_API_TOKEN=hf_AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
```

**In the app:**

- Select provider from dropdown
- Switch any time
- Each request uses only the selected provider

---

## Comparison Table

| Feature          | Offline                    | Replicate                 | HuggingFace          |
| ---------------- | -------------------------- | ------------------------- | -------------------- |
| **Speed**        | 8-10s (GPU) / 2-5min (CPU) | 20-40s                    | 30-60s               |
| **Cost**         | Free                       | ~$0.005/image             | Free tier available  |
| **Quality**      | High                       | Excellent                 | Good                 |
| **Requirements** | GPU (optional)             | Internet + API token      | Internet + API token |
| **Privacy**      | 100% local                 | Images sent to cloud      | Images sent to cloud |
| **Setup**        | None                       | API token                 | API token            |
| **Best For**     | Privacy, speed, no cost    | Best quality, reliability | Testing, free tier   |

---

## Troubleshooting

### Error: "Invalid API token"

**For Replicate:**

1. Check token in `.env` starts with `r8_`
2. Verify token is valid at https://replicate.com/account/api-tokens
3. Ensure no extra spaces in `.env`
4. Restart backend after adding token

**For HuggingFace:**

1. Check token in `.env` starts with `hf_`
2. Verify token at https://huggingface.co/settings/tokens
3. Ensure token has "Read" permission
4. Restart backend

### Error: "Rate limit exceeded"

**Replicate**: Wait a moment or upgrade account

**HuggingFace Free Tier**:

- Wait for rate limit to reset (usually hourly/daily)
- Or upgrade to Pro tier

### Error: "Model loading timeout"

**HuggingFace**:

- First request can be slow (model loading)
- Try again after 1-2 minutes
- Model stays loaded for ~30 minutes

### Backend doesn't recognize token

**Check:**

1. File is named exactly `.env` (not `.env.txt`)
2. No spaces around `=` sign
3. Token copied correctly (no extra characters)
4. Backend restarted after adding token

**To verify:**

```bash
# In backend directory
type .env    # Windows
cat .env     # Mac/Linux
```

You should see:

```
REPLICATE_API_TOKEN=r8_...
HF_API_TOKEN=hf_...
```

---

## Security Best Practices

### ✅ DO:

- Keep tokens in `.env` file
- Add `.env` to `.gitignore` (already done)
- Never share tokens publicly
- Regenerate tokens if compromised

### ❌ DON'T:

- Commit `.env` to git
- Share tokens in screenshots
- Hardcode tokens in code
- Share tokens with others

### If Token Compromised:

**Replicate:**

1. Go to https://replicate.com/account/api-tokens
2. Delete compromised token
3. Create new token
4. Update `.env`

**HuggingFace:**

1. Go to https://huggingface.co/settings/tokens
2. Revoke compromised token
3. Generate new token
4. Update `.env`

---

## Testing Providers

### Quick Test

1. **Start backend and frontend**
2. **Upload a test image**
3. **Try each provider:**
   - Offline → Should work immediately
   - Replicate → Needs token
   - HuggingFace → Needs token

### Example Test Flow

```
Test 1: Offline
- Provider: Offline (Local GPU)
- Expected: ~8-10 seconds (GPU) or 2-5 minutes (CPU)
- Result: ✓ Works

Test 2: Replicate
- Provider: Replicate (Online)
- Expected: ~20-40 seconds
- Result: ✓ Works (check your Replicate dashboard for usage)

Test 3: HuggingFace
- Provider: HuggingFace (Online)
- Expected: ~30-60 seconds (first request slower)
- Result: ✓ Works
```

### Compare Quality

Generate the same room with all three providers and compare:

- Visual quality
- Style accuracy
- Speed
- Cost

---

## Cost Examples

### Budget Scenario: Testing (10 images)

**Offline**: Free  
**Replicate**: ~$0.05 (10 × $0.005)  
**HuggingFace**: Free (within free tier)

### Budget Scenario: Demo (100 images)

**Offline**: Free  
**Replicate**: ~$0.50 (100 × $0.005)  
**HuggingFace**: Free or $9/month Pro

### Budget Scenario: Production (1000 images/month)

**Offline**: Free (but need good GPU)  
**Replicate**: ~$5 (1000 × $0.005)  
**HuggingFace**: $9/month Pro or Enterprise

---

## Recommendations

### For MSc Demo/Submission:

- **Use Offline**: Shows technical skills, no cost
- **Add one online provider**: Shows API integration skills
- **Replicate recommended**: More reliable for demos

### For Development/Testing:

- **Use Offline**: Fast iteration, no cost

### For Production:

- **Start with Offline**: Lowest cost per image
- **Scale with Replicate**: Better reliability and quality
- **HuggingFace**: Good for free tier testing

---

## Next Steps

1. ✅ Set up at least one online provider
2. ✅ Test all three providers
3. ✅ Compare quality and speed
4. ✅ Document results for your MSc report
5. ✅ Include cost analysis in your documentation

---

## Summary

**You now have three working AI providers:**

1. **Offline (Local)**: Free, fast with GPU, completely private
2. **Replicate**: Best quality, ~$0.005/image, very reliable
3. **HuggingFace**: Free tier available, good for testing

**All providers:**

- ✅ Use the same interface (no code changes needed)
- ✅ Return same format results
- ✅ Work with the same frontend
- ✅ Support all room types and styles

**Your system is now enterprise-ready!** 🚀
