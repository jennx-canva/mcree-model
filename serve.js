#!/usr/bin/env node
/**
 * Simple HTTP server for running the Pass Through Portals static website locally.
 * Usage: node serve.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8000;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.glb': 'model/gltf-binary',
    '.gltf': 'model/gltf+json'
};

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}

function checkRequiredFiles() {
    const requiredFiles = ['index.html', 'low_poly_mccree-transformed.glb'];
    const missingFiles = [];
    
    for (const file of requiredFiles) {
        if (!fs.existsSync(file)) {
            missingFiles.push(file);
        }
    }
    
    if (missingFiles.length > 0) {
        console.error(`Error: Missing required files: ${missingFiles.join(', ')}`);
        console.error('Please ensure all files are in the same directory as this script.');
        process.exit(1);
    }
}

function openBrowser(url) {
    const platform = process.platform;
    let command;
    
    if (platform === 'darwin') {
        command = 'open';
    } else if (platform === 'win32') {
        command = 'start';
    } else {
        command = 'xdg-open';
    }
    
    try {
        spawn(command, [url], { stdio: 'ignore', detached: true });
        console.log('Opening browser...');
    } catch (error) {
        console.log(`Could not open browser automatically: ${error.message}`);
        console.log(`Please manually open: ${url}`);
    }
}

const server = http.createServer((req, res) => {
    // Parse URL and remove query parameters
    let filePath = req.url.split('?')[0];
    
    // Default to index.html for root path
    if (filePath === '/') {
        filePath = '/index.html';
    }
    
    // Remove leading slash and resolve to local file
    const localPath = path.join(__dirname, filePath.substring(1));
    
    // Check if file exists
    fs.access(localPath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
            return;
        }
        
        // Get file stats
        fs.stat(localPath, (err, stats) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
                return;
            }
            
            if (stats.isDirectory()) {
                // Directory - return 403 Forbidden
                res.writeHead(403, { 'Content-Type': 'text/plain' });
                res.end('403 Forbidden');
                return;
            }
            
            // Read and serve file
            fs.readFile(localPath, (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('500 Internal Server Error');
                    return;
                }
                
                const mimeType = getMimeType(localPath);
                res.writeHead(200, { 
                    'Content-Type': mimeType,
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                });
                res.end(data);
            });
        });
    });
});

function main() {
    // Check if required files exist
    checkRequiredFiles();
    
    // Start server
    server.listen(PORT, () => {
        console.log('Pass Through Portals - Static Website');
        console.log(`Server running at: http://localhost:${PORT}`);
        console.log('Press Ctrl+C to stop the server');
        
        // Open browser
        openBrowser(`http://localhost:${PORT}`);
    });
    
    // Handle server shutdown
    process.on('SIGINT', () => {
        console.log('\nShutting down server...');
        server.close(() => {
            console.log('Server stopped.');
            process.exit(0);
        });
    });
}

if (require.main === module) {
    main();
} 