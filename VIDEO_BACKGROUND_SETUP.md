# Video Background Setup for Login Page 🎥

## Current Implementation

The login page now has an **ambulance video background** from YouTube playing subtly behind the login form.

---

## What Was Added

### 1. **YouTube Video Embed**
- Video URL: https://youtu.be/MwXuv4EHDUo
- Autoplay: ✅ Yes (muted for browser compatibility)
- Loop: ✅ Yes (continuous playback)
- Controls: ❌ Hidden (clean aesthetic)
- Aspect: Zoomed 300% for full coverage

### 2. **Overlay Layers**
```
┌─────────────────────────────────┐
│  Layer 4: Login Form (z-10)     │
│  Layer 3: Gradient Overlay      │
│  Layer 2: Dark Overlay (60%)    │
│  Layer 1: Video Background      │
└─────────────────────────────────┘
```

**Dark Overlay**: 60% black opacity for readability
**Gradient Overlay**: Blue → Purple gradient (40% opacity)

---

## Code Implementation

### Component: `swiftaid-loginform.tsx`

```tsx
return (
  <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10 overflow-hidden bg-black">
    {/* Video Background */}
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <iframe
        className="absolute top-1/2 left-1/2 w-[300%] h-[300%] pointer-events-none"
        style={{
          transform: 'translate(-50%, -50%)',
          objectFit: 'cover',
        }}
        src="https://www.youtube.com/embed/MwXuv4EHDUo?autoplay=1&mute=1&loop=1&playlist=MwXuv4EHDUo&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
        title="Ambulance Background"
        allow="autoplay; encrypted-media"
        allowFullScreen
      />
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/60"></div>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-transparent"></div>
    </div>
    
    <div className="w-full max-w-sm md:max-w-3xl relative z-10">
      {/* Login Form */}
    </div>
  </div>
);
```

---

## YouTube Embed Parameters

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `autoplay=1` | On | Start video immediately |
| `mute=1` | On | Required for autoplay |
| `loop=1` | On | Continuous playback |
| `playlist=MwXuv4EHDUo` | Video ID | Required for loop |
| `controls=0` | Off | Hide player controls |
| `showinfo=0` | Off | Hide video title |
| `rel=0` | Off | Don't show related videos |
| `modestbranding=1` | On | Minimal YouTube branding |
| `playsinline=1` | On | Mobile compatibility |
| `enablejsapi=1` | On | JavaScript API access |

---

## Alternative: Local Video File (Recommended for Production)

For better performance and control, use a local video file:

### Step 1: Download High-Quality Video

**Option A: Manual Download**
1. Visit: https://youtu.be/MwXuv4EHDUo
2. Use a YouTube downloader (e.g., 4K Video Downloader, yt-dlp)
3. Download in **1080p MP4 format**
4. Name it: `ambulance-bg.mp4`

**Option B: Using yt-dlp (Command Line)**
```bash
# Install yt-dlp
brew install yt-dlp

# Download video
cd /Users/gewu/Documents/GitHub/SwiftAid/swiftaid-next/public
yt-dlp -f "bestvideo[height<=1080]+bestaudio/best[height<=1080]" -o "ambulance-bg.mp4" "https://youtu.be/MwXuv4EHDUo"
```

### Step 2: Place Video in Public Folder
```
swiftaid-next/
  └── public/
      └── ambulance-bg.mp4  ← Place video here
```

### Step 3: Update Component to Use Local Video

Replace the iframe with:

```tsx
<div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10 overflow-hidden bg-black">
  {/* Local Video Background */}
  <div className="absolute inset-0 w-full h-full overflow-hidden">
    <video
      autoPlay
      loop
      muted
      playsInline
      className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto transform -translate-x-1/2 -translate-y-1/2 object-cover"
    >
      <source src="/ambulance-bg.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    {/* Dark overlay */}
    <div className="absolute inset-0 bg-black/60"></div>
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-transparent"></div>
  </div>
  
  <div className="w-full max-w-sm md:max-w-3xl relative z-10">
    {/* Login Form */}
  </div>
</div>
```

---

## Visual Structure

```
┌────────────────────────────────────────┐
│                                        │
│  🚑 Ambulance Video (Subtle, Blurred)  │
│    ▼ Dark Overlay (60% opacity)        │
│    ▼ Gradient Overlay (Blue→Purple)    │
│                                        │
│         ┌──────────────┐               │
│         │              │               │
│         │ LOGIN FORM   │               │
│         │  (z-index:10)│               │
│         │              │               │
│         └──────────────┘               │
│                                        │
│  🎥 Video continues playing in loop    │
│                                        │
└────────────────────────────────────────┘
```

---

## Browser Compatibility

✅ **Works on:**
- Chrome 90+ (autoplay with mute)
- Firefox 88+ (autoplay with mute)
- Safari 14+ (requires playsInline)
- Edge 90+ (autoplay with mute)

⚠️ **Notes:**
- Video must be **muted** for autoplay to work
- iOS requires `playsInline` attribute
- YouTube embed may have slight loading delay
- Local video has better performance

---

## Performance Optimization

### For YouTube Embed (Current):
- ✅ No file size on your server
- ⚠️ Requires internet connection
- ⚠️ Slight loading delay
- ⚠️ Depends on YouTube availability

### For Local Video (Recommended):
1. **Compress video** to reduce file size:
   ```bash
   # Using ffmpeg
   ffmpeg -i ambulance-bg.mp4 -c:v libx264 -crf 28 -preset slow -vf scale=1920:-2 -c:a aac -b:a 128k ambulance-bg-compressed.mp4
   ```

2. **Optimize for web**:
   - Resolution: 1920×1080 (1080p)
   - Bitrate: ~2-3 Mbps
   - Format: MP4 (H.264 codec)
   - Audio: Optional (can remove for smaller size)

3. **Lazy loading** (optional):
   ```tsx
   <video preload="auto" />  // Load in background
   ```

---

## Customization Options

### Adjust Video Opacity
```tsx
{/* Change /60 to /40 for lighter, /80 for darker */}
<div className="absolute inset-0 bg-black/60"></div>
```

### Change Gradient Color
```tsx
{/* Modify colors: from-red-900/40 via-orange-900/40 */}
<div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/40 to-transparent"></div>
```

### Adjust Video Zoom
```tsx
{/* Change w-[300%] to w-[200%] for less zoom */}
<iframe className="w-[300%] h-[300%]" />
```

### Remove Gradient (Keep Only Dark Overlay)
```tsx
{/* Remove this line */}
{/* <div className="absolute inset-0 bg-gradient-to-br ..."></div> */}
```

---

## Troubleshooting

### Video Not Playing
1. **Check browser autoplay policy**
   - Must be muted for autoplay
   - User interaction may be required on some browsers

2. **YouTube embed not loading**
   - Check internet connection
   - Verify YouTube isn't blocked
   - Try incognito mode to test without extensions

3. **Video too dark/bright**
   - Adjust overlay opacity: `bg-black/60` → `bg-black/40` (lighter) or `bg-black/80` (darker)

### Performance Issues
1. **Use local video** instead of YouTube embed
2. **Compress video** to reduce file size
3. **Lower resolution** to 720p if needed
4. **Remove audio track** from video file

---

## File Changes Summary

| File | Change | Description |
|------|--------|-------------|
| `swiftaid-loginform.tsx` | Modified | Added video background with overlays |
| `ambulance-bg.mp4` | NEW (optional) | Local video file for better performance |

---

## Next Steps

### Current Setup (YouTube Embed):
✅ **Working now** - Visit http://localhost:3000/auth/login to see it

### Recommended Upgrade (Local Video):
1. Download video in 1080p using yt-dlp or online tool
2. Place in `/swiftaid-next/public/ambulance-bg.mp4`
3. Update component to use `<video>` tag instead of `<iframe>`
4. Test for better performance and reliability

---

## Visual Preview

**Before (Gradient + Orbs):**
```
┌─────────────────────────┐
│  🔵    Gradient    🟣   │
│                         │
│   ┌───────────┐         │
│   │ Login     │         │
│   └───────────┘         │
│  🩷                     │
└─────────────────────────┘
```

**After (Video Background):**
```
┌─────────────────────────┐
│  🚑 Ambulance Video 🚨  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │
│   ┌───────────┐         │
│   │ Login     │         │
│   └───────────┘         │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   │
└─────────────────────────┘
```

---

## Benefits

✨ **Enhanced User Experience:**
- Dynamic, engaging background
- Medical/emergency theme reinforcement
- Professional appearance
- Memorable first impression

🎯 **Brand Consistency:**
- Aligns with SwiftAid's ambulance service
- Shows real-world context
- Builds trust and credibility

🚀 **Modern Design:**
- Video backgrounds are trendy
- Premium feel
- Stands out from competitors

---

## Status

✅ **COMPLETED** - YouTube video background is now live!

**Current State:**
- YouTube embed playing in background
- Autoplay, loop, no controls
- Dark + gradient overlays for readability
- Login form clearly visible on top

**Recommended Next Action:**
Download and use local video file for production deployment

---

**Date**: November 13, 2025  
**Component**: SwiftAid Login Form  
**Enhancement**: Ambulance Video Background (High Resolution)  
**Video Source**: https://youtu.be/MwXuv4EHDUo
