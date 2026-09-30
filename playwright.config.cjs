const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  // The original portfolio tests are retained, but target the previous design.
  testMatch: "redesign.spec.cjs",
  fullyParallel: true,
  workers: 2,
  timeout: 45000,
  use: {
    baseURL: "http://127.0.0.1:4180",
    browserName: "chromium",
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  webServer: {
    // Isolated from existing preview servers; larger backlog suits parallel browsers.
    command:
      "python -c \"from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler; ThreadingHTTPServer.request_queue_size = 128; ThreadingHTTPServer(('127.0.0.1', 4180), SimpleHTTPRequestHandler).serve_forever()\"",
    url: "http://127.0.0.1:4180",
    reuseExistingServer: false,
    // Browsers cancel pending lazy images when a test closes; suppress server noise.
    stdout: "ignore",
    stderr: "ignore",
  },
});
