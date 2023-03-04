/** 
 * Without this, you don't get verbose errors when it loads
 * your background file as a service worker.
 */
try {
  importScripts("background.js");
} catch (e) {
  console.error(e);
}