const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Prompt for the input directory
rl.question('Enter the path of the input directory containing WEBP images: ', inputDir => {
  const outputDir = path.join(inputDir, 'converted-to-png');

  // Create the output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Convert WEBP to PNG
  const convertWebpToPng = async (inputPath, outputPath) => {
    try {
      if (!fs.existsSync(outputPath)) {
        await sharp(inputPath)
          .toFormat('png')
          .toFile(outputPath);
        console.log(`Converted: ${inputPath} to ${outputPath}`);
      } else {
        console.log(`Skipped (already exists): ${outputPath}`);
      }
    } catch (error) {
      console.error(`Error converting ${inputPath}:`, error);
    }
  };

  // Read the input directory and process each file
  fs.readdir(inputDir, (err, files) => {
    if (err) {
      console.error('Error reading input directory:', err);
      return;
    }
    files.forEach(file => {
      if (path.extname(file).toLowerCase() === '.webp') {
        const inputPath = path.join(inputDir, file);
        const outputPath = path.join(outputDir, path.basename(file, '.webp') + '.png');
        convertWebpToPng(inputPath, outputPath);
      }
    });
  });

  // Close the readline interface
  rl.close();
});
