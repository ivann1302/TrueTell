import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

// Directories to process
const DIRS = ['public', 'src/images'];
// Image extensions to process
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
// Output quality (0-100)
const JPEG_QUALITY = 80;
const PNG_QUALITY = 80;
const WEBP_QUALITY = 75;

// Function to check if a file is an image based on its extension
const isImage = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return IMAGE_EXTENSIONS.includes(ext);
};

// Function to optimize an image
async function optimizeImage(filePath) {
  try {
    console.log(`Processing: ${filePath}`);
    const ext = path.extname(filePath).toLowerCase();
    const image = sharp(filePath);
    
    // Get image metadata
    const metadata = await image.metadata();
    
    // Skip if image is already optimized (check file size or other criteria)
    const stats = await fs.stat(filePath);
    if (stats.size < 10000) { // Skip if less than 10KB
      console.log(`Skipping small image: ${filePath}`);
      return;
    }
    
    let optimizedImage;
    
    // Apply different optimization based on image type
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        optimizedImage = await image
          .jpeg({ quality: JPEG_QUALITY, progressive: true })
          .toBuffer();
        break;
      case '.png':
        optimizedImage = await image
          .png({ quality: PNG_QUALITY, compressionLevel: 9 })
          .toBuffer();
        break;
      case '.webp':
        optimizedImage = await image
          .webp({ quality: WEBP_QUALITY })
          .toBuffer();
        break;
      default:
        console.log(`Unsupported image format: ${ext}`);
        return;
    }
    
    // Save the optimized image, overwriting the original
    await fs.writeFile(filePath, optimizedImage);
    
    // Get stats after optimization
    const newStats = await fs.stat(filePath);
    const savingsPercent = ((stats.size - newStats.size) / stats.size * 100).toFixed(2);
    
    console.log(`Optimized: ${filePath}`);
    console.log(`Original size: ${(stats.size / 1024).toFixed(2)}KB`);
    console.log(`New size: ${(newStats.size / 1024).toFixed(2)}KB`);
    console.log(`Saved: ${savingsPercent}%`);
    
  } catch (error) {
    console.error(`Error optimizing ${filePath}:`, error);
  }
}

// Function to process a directory recursively
async function processDirectory(directory) {
  try {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively process subdirectories
        await processDirectory(fullPath);
      } else if (isImage(fullPath)) {
        // Optimize image
        await optimizeImage(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${directory}:`, error);
  }
}

// Main function
async function main() {
  console.log('Starting image optimization...');
  
  for (const dir of DIRS) {
    try {
      // Check if directory exists
      await fs.access(dir);
      console.log(`Processing directory: ${dir}`);
      await processDirectory(dir);
    } catch (error) {
      console.log(`Directory ${dir} does not exist or cannot be accessed.`);
    }
  }
  
  console.log('Image optimization complete!');
}

main().catch(console.error);