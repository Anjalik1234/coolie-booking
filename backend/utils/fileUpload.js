const fs = require('fs');
const path = require('path');

/**
 * Saves a base64 string as a file in a user-specific directory.
 * @param {string} base64Data - The base64 string (including data prefix)
 * @param {string} userId - The unique identifier for the user (to create a sub-folder)
 * @param {string} fileName - The name to save the file as (e.g., 'aadhar.png')
 * @returns {string} - The relative URL path to the saved file
 */
exports.saveBase64Image = (base64Data, userId, fileName) => {
  if (!base64Data || !base64Data.includes('base64,')) return base64Data;

  try {
    const [header, data] = base64Data.split('base64,');
    const extension = header.split(';')[0].split('/')[1] || 'png';
    const finalFileName = `${fileName.split('.')[0]}.${extension}`;
    
    const userFolderPath = path.join(__dirname, '../uploads', String(userId));
    if (!fs.existsSync(userFolderPath)) {
      fs.mkdirSync(userFolderPath, { recursive: true });
    }

    const filePath = path.join(userFolderPath, finalFileName);
    fs.writeFileSync(filePath, data, 'base64');

    // Return the relative URL for the frontend
    return `/uploads/${userId}/${finalFileName}`;
  } catch (error) {
    console.error('Error saving image:', error);
    return base64Data; // Fallback to base64 if it fails
  }
};
