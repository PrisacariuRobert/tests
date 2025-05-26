const { defineConfig } = require("cypress");

module.exports = {
  projectId: "6z4ima", // <--- ADD THIS LINE (or ensure it's there)

  e2e: {
    baseUrl: 'https://r0984452-realbeans.myshopify.com', // Replace with your store URL
    setupNodeEvents(on, config) {
      // Implement node event listeners here if needed
    },
  },
};
