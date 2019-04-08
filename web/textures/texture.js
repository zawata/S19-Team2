/**
 * loadTexture
 * Wraps Three.js loader function in a promise
 */
export const loadTexture = (path, loader, onProgress) => { 
  return new Promise((resolve, reject) => {
      loader.load(path, resolve, onProgress, reject);
  });
}