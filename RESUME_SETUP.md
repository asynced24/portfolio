# Resume PDF Setup Instructions

## How to Add Your Resume for Download

The tactical dashboard is configured to download `resume.pdf` when users click the "REQUEST CLEARANCE" button.

### Option 1: Add PDF to Project Directory (Recommended)
1. Place your resume PDF file in the project root directory:
   ```
   c:\Users\aryan\OneDrive\Desktop\Personal projects\aryan-cyberpunk-portfolio\resume.pdf
   ```
2. That's it! The download will work automatically.

### Option 2: Use a Different Filename/Path
If you want to use a different filename or location:

1. Open `app.js`
2. Find line 212 (in the `initDownloadClearance` function)
3. Change `'resume.pdf'` to your preferred path:
   ```javascript
   window.open('path/to/your-resume.pdf', '_blank');
   ```

### Testing the Download
1. Open `index.html` in your browser
2. Scroll to the "SECURITY CLEARANCE" section
3. Click "REQUEST CLEARANCE"
4. Watch the PS5-style progress bar animate
5. The PDF should open in a new tab when complete

---

**Note:** Make sure your resume PDF is named exactly as specified (case-sensitive on some systems).
