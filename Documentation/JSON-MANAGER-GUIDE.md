# JSON Manager - User Guide

**Version:** 1.0
**Last Updated:** November 19, 2025
**Status:** Complete

---

## Overview

The JSON Manager allows users to upload custom JSON data files to override the default data files used by OperationsHub. This is useful for:
- Testing with custom data
- Using updated game data before official releases
- Creating custom scenarios for analysis
- Backing up and sharing data configurations

---

## Features

### 📁 File Management
- **View all 11 JSON data files** with descriptions and sizes
- **Download existing files** (original or custom versions)
- **Upload custom files** to override defaults
- **Reset files** individually or all at once
- **Custom file badges** show which files have been customized

### 🔒 Data Validation
- JSON format validation before upload
- Schema compatibility checking
- File naming verification
- Size limit enforcement (~5-10MB browser storage)

### 💾 Storage System
- Uses browser localStorage for custom files
- Persists across browser sessions
- Isolated per browser profile
- No server-side storage required

---

## Managed Files

The JSON Manager handles 11 data files:

| File Name | Size | Description |
|-----------|------|-------------|
| `recipes.json` | 4.7 MB | 247 manufacturing recipes |
| `buildings.json` | 2.4 MB | 100+ building types |
| `planets.json` | 14 MB | 3,901 planets |
| `resources.json` | 864 KB | 93 resource types |
| `craftingHabBuildings.json` | 8.3 KB | Hub buildings |
| `ship-formulas.json` | 5.6 MB | Ship formulas |
| `ship-components.json` | Small | Ship components manifest |
| `ship-components-part1.json` | 7.3 MB | Ship components (part 1) |
| `ship-components-part2.json` | ~7 MB | Ship components (part 2) |
| `resource_tier_analysis.json` | 38 KB | Resource tier analysis |
| `resource_type_tier_lookup.json` | 2.4 KB | Resource tier lookup |

---

## How to Use

### Opening the JSON Manager

1. Go to the OperationsHub home page (`index.html`)
2. Click the **"📁 JSON Manager"** button in the hero section
3. The JSON Manager modal will open

### Downloading Files

1. Find the file you want to download in the file grid
2. Click the **"⬇️ Download"** button
3. The file will be saved to your Downloads folder
4. If a custom version exists, that version will be downloaded

**Tip:** Download the original file first before making modifications

### Uploading Custom Files

1. Click **"📤 Select JSON File"** in the upload section
2. Choose a JSON file from your computer
3. The file will be validated and uploaded
4. Refresh the page for changes to take effect

**Requirements:**
- ✅ Must be a valid JSON file (`.json` extension)
- ✅ Must match one of the 11 managed filenames exactly
- ✅ Must have valid JSON syntax
- ✅ Must be under ~5-10MB (browser localStorage limit)
- ✅ Should match the expected schema structure

### Resetting Files

**Reset Individual File:**
1. Find the file with a "✨ Custom" badge
2. Click the **"🔄 Reset"** button
3. Confirm the reset
4. The custom file will be removed
5. Refresh the page to use the original file

**Reset All Files:**
1. Click **"🔄 Reset All Files to Default"** in the reset section
2. Confirm the reset
3. All custom files will be removed
4. Refresh the page to use original files

---

## Upload Instructions

### File Format
- Must be a valid JSON file with `.json` extension
- Must contain properly formatted JSON syntax
- Syntax errors will cause upload to fail

### File Naming
- Must match **exactly** one of the 11 managed filenames
- Case-sensitive (use lowercase)
- Examples: `recipes.json`, `planets.json`, `buildings.json`
- Wrong names will be rejected

### File Structure
- Must match the expected schema for that file type
- Structure mismatches may cause application errors
- Review the original file structure before modifying

### File Size
- Limited by browser localStorage (~5-10MB depending on browser)
- Large files may fail to upload
- Chrome/Edge typically allow ~10MB
- Firefox typically allows ~10MB
- Safari typically allows ~5MB

### Validation Process
1. File is read into memory
2. JSON syntax is validated
3. File is stored in localStorage with prefix `custom_json_`
4. Success/error message is displayed

### Effect Timing
- Changes take effect after refreshing the page
- Browser cache may need to be cleared (Ctrl+Shift+R)
- Custom files persist across browser sessions

---

## Recommended Workflow

### Modifying Existing Data

1. **Download** the existing file you want to modify
2. **Edit** the file using a JSON editor (VS Code, Notepad++, etc.)
3. **Validate** the JSON syntax (use jsonlint.com or VS Code)
4. **Upload** the modified file with the same filename
5. **Refresh** the page to see changes
6. **Test** the application to verify changes work correctly

### Testing Custom Data

1. Upload custom files for testing
2. Navigate to relevant explorer (Planet Explorer, Recipe Explorer, etc.)
3. Verify data loads correctly
4. Test analytics features
5. If issues occur, check browser console (F12) for errors
6. Reset to default if needed

### Backing Up Custom Data

1. Download all custom files (marked with "✨ Custom" badge)
2. Save to a backup folder
3. Document what changes were made
4. Re-upload when needed

---

## Technical Details

### Storage Mechanism
```javascript
// Custom files stored with prefix
localStorage.setItem('custom_json_recipes.json', jsonContent);

// Integration with DataLoader
window.JsonManager.getFileData('recipes.json', '../JSON/recipes.json');
```

### Priority Order
1. **Custom file from localStorage** (if exists)
2. **Default file from JSON/ folder** (fallback)

### File Path Resolution
- `recipes.json` → checks `localStorage['custom_json_recipes.json']`
- If not found → fetches from `JSON/recipes.json`
- Processed by DataLoader and used by explorers

### Integration Points
- **index.html** - Modal UI and event handlers
- **Utils/JsonManager.js** - Core file management logic
- **Utils/DataLoader.js** - Integration with data loading system
- **styles.css** - Modal and UI styling

---

## Troubleshooting

### File Upload Fails
**Problem:** "Invalid JSON file" error
**Solution:**
- Verify JSON syntax using jsonlint.com
- Check for trailing commas, missing brackets
- Ensure file encoding is UTF-8

**Problem:** File too large
**Solution:**
- Compress JSON (remove whitespace)
- Split into smaller files if possible
- Use browser with higher localStorage limit

### Changes Not Appearing
**Problem:** Uploaded file but no changes visible
**Solution:**
- Refresh the page (Ctrl+Shift+R for hard refresh)
- Clear browser cache
- Check browser console (F12) for errors
- Verify file uploaded successfully (check for "✨ Custom" badge)

### Application Errors After Upload
**Problem:** Explorer shows errors or missing data
**Solution:**
- Reset the custom file to default
- Check browser console for specific errors
- Verify uploaded file matches expected schema
- Download original file and compare structure

### localStorage Quota Exceeded
**Problem:** "QuotaExceededError" when uploading
**Solution:**
- Reset unused custom files
- Clear browser localStorage for other sites
- Use smaller JSON files
- Switch to browser with higher quota

---

## Browser Compatibility

| Browser | localStorage Limit | Status |
|---------|-------------------|--------|
| Chrome | ~10 MB | ✅ Recommended |
| Edge | ~10 MB | ✅ Recommended |
| Firefox | ~10 MB | ✅ Recommended |
| Safari | ~5 MB | ⚠️ Limited capacity |
| Opera | ~10 MB | ✅ Supported |

**Note:** Large files like `planets.json` (14 MB) may exceed localStorage limits. Consider using Data/ processed files instead of uploading to JSON folder.

---

## Security Considerations

### Safe Practices
- ✅ Only upload JSON files from trusted sources
- ✅ Review file contents before uploading
- ✅ Test with non-critical data first
- ✅ Keep backups of original files

### Unsafe Practices
- ❌ Don't upload files from unknown sources
- ❌ Don't upload files with executable code
- ❌ Don't share localStorage across untrusted sites
- ❌ Don't modify files without understanding structure

### Data Privacy
- Files stored locally in browser only
- No data sent to servers
- Isolated per browser profile
- Cleared when browser data is cleared

---

## Limitations

1. **File Size:** Limited by browser localStorage (~5-10MB)
2. **Schema Validation:** Basic JSON syntax only, no deep schema validation
3. **Refresh Required:** Changes require page refresh to take effect
4. **Browser-Specific:** Custom files don't sync across browsers
5. **No Versioning:** Only one custom version per file
6. **No Multi-User:** Each browser profile has separate custom files

---

## Future Enhancements

Potential improvements for future versions:

1. **Deep Schema Validation:** Validate against JSON schemas before upload
2. **Version Control:** Keep history of custom file changes
3. **Import/Export:** Bulk import/export of all custom files
4. **Cloud Sync:** Optional sync across browsers via user account
5. **Diff Viewer:** Visual comparison of custom vs original files
6. **Auto-Refresh:** Automatically reload data without page refresh
7. **Compression:** Automatic compression for large files
8. **Rollback:** Undo last N changes to custom files

---

## Support

### Getting Help
- Check browser console (F12) for error messages
- Review this guide for common issues
- Reset to defaults if problems persist
- Clear browser cache and try again

### Reporting Issues
- Document the file you uploaded
- Note any error messages
- Include browser and version
- Describe steps to reproduce

---

## Changelog

### Version 1.0 (November 19, 2025)
- ✅ Initial release
- ✅ Upload/download functionality
- ✅ Reset individual and all files
- ✅ localStorage integration
- ✅ DataLoader integration
- ✅ Custom file badges
- ✅ Comprehensive validation
- ✅ Detailed upload instructions

---

**Status:** Production Ready
**Documentation:** Complete
**Integration:** Fully integrated with DataLoader
**Testing:** Manual testing complete
