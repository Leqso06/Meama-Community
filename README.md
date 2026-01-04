
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Meama Community App

## Run Locally

**Prerequisites:** Node.js

1. `npm install`
2. `npm run dev`

## Backend Setup (Google Apps Script)

**SCRIPT VERSION: v4.1-OPTIMIZED**

1. Go to **Extensions** > **Apps Script**.
2. Replace code with:

```javascript
/*
 * SCRIPT VERSION: v4.1-OPTIMIZED
 * Deploy as Web App -> Execute as 'Me' -> Access: 'Anyone'
 */

function doGet(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
     return jsonResponse({error: "Server busy"});
  }
  
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var data = {
      version: "v4.1-OPTIMIZED", 
      baristas: getSheetData(doc, 'Baristas'),
      reviews: getSheetData(doc, 'Reviews')
    };
    return jsonResponse(data);
  } catch(e) {
      return jsonResponse({error: e.toString()});
  } finally {
    lock.releaseLock();
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) {
     return jsonResponse({ "status": "error", "error": "Server busy" });
  }

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName('Reviews');
    var data = JSON.parse(e.postData.contents);
    
    // Sync Usernames
    if (data.customerId && data.username) {
        syncUsernames(sheet, data.customerId, data.username);
    }

    // Process Image
    var imageUrl = "";
    if (data.image && data.image.length > 100) {
       imageUrl = saveImageToDrive(data.image);
    }

    // Generate ID
    var newId = "R" + ("0000000" + (sheet.getLastRow() + 1)).slice(-7);
    
    sheet.appendRow([
      newId,                
      new Date(),           
      data.customerId,      
      sanitize(data.username), 
      data.baristaId,       
      sanitize(data.branch),   
      data.rating,          
      sanitize(data.review),   
      imageUrl,             
      "active"              
    ]);

    return jsonResponse({ "status": "success", "id": newId });

  } catch (e) {
    return jsonResponse({ "status": "error", "error": e.toString() });
  } finally {
    lock.releaseLock();
  }
}

// --- Helpers ---

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheetData(doc, name) {
  var sheet = doc.getSheetByName(name);
  return sheet ? sheet.getDataRange().getDisplayValues() : [];
}

function sanitize(input) {
  if (typeof input !== 'string') return input;
  // Prevent Formula Injection
  if (/^[\=\+\-\@]/.test(input)) return "'" + input;
  return input;
}

function syncUsernames(sheet, customerId, newUsername) {
    var data = sheet.getDataRange().getValues();
    var cleanId = String(customerId).trim();
    var cleanName = String(newUsername).trim();
    
    // Column C (index 2) is CustomerID, Column D (index 3) is Username
    for (var i = 1; i < data.length; i++) {
        if (String(data[i][2]).trim() === cleanId && data[i][3] !== cleanName) {
            sheet.getRange(i + 1, 4).setValue(sanitize(cleanName));
        }
    }
}

function saveImageToDrive(base64String) {
    try {
        var folderId = "1XfMjVeI3q8CC0uSUDKOPyiHi27CwQU_F"; // HARDCODED FOLDER ID
        var folder;
        try { folder = DriveApp.getFolderById(folderId); } 
        catch(e) { folder = DriveApp.getFoldersByName("Review Images").next(); }

        var encoded = base64String.includes("base64,") ? base64String.split(",")[1] : base64String;
        var decoded = Utilities.base64Decode(encoded);
        var blob = Utilities.newBlob(decoded, "image/jpeg", "img_" + Utilities.getUuid() + ".jpg");
        
        // Magic Byte Check (JPG=FFD8, PNG=8950, WEBP=5249)
        var bytes = blob.getBytes();
        var header = "";
        for (var i=0; i<4; i++) header += (bytes[i] & 0xFF).toString(16);
        
        if (!/^(ffd8|8950|5249)/i.test(header)) {
             throw new Error("Security: Invalid Image Format");
        }

        var file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        return "https://drive.google.com/uc?export=view&id=" + file.getId();
    } catch (e) {
        Logger.log("Image Save Error: " + e);
        return "";
    }
}
```
