/**
 * ORBIT ASCII Art
 */

const ORBIT_ASCII = `
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ██████╗ ██████╗ ██████╗ ██╗████████╗                      ║
║  ██╔═══██╗██╔══██╗██╔══██╗██║╚══██╔══╝                      ║
║  ██║   ██║██████╔╝██████╔╝██║   ██║                         ║
║  ██║   ██║██╔══██╗██╔══██╗██║   ██║                         ║
║  ╚██████╔╝██║  ██║██████╔╝██║   ██║                         ║
║   ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝   ╚═╝                         ║
║                                                               ║
║              Test Automation Framework                        ║
║                    by Certa                                   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`;

/**
 * Display ORBIT ASCII art with optional message
 */
function showAsciiArt(message = '') {
  console.log('\x1b[36m%s\x1b[0m', ORBIT_ASCII); // Cyan color
  if (message) {
    console.log('\x1b[33m%s\x1b[0m\n', message); // Yellow color
  }
}

module.exports = {
  ORBIT_ASCII,
  showAsciiArt,
};
