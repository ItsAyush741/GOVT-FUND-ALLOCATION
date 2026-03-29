// update-contract-address.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("🚀 Starting Truffle migration and updating contract address...");

try {
  // Run truffle migrate --reset
  console.log("Running: truffle migrate --reset");
  const output = execSync('truffle migrate --reset', { encoding: 'utf8' });
  console.log(output);

  // Read the latest contract address from GovFundAllocation.json
  const artifactPath = path.join(__dirname, 'build', 'contracts', 'GovFundAllocation.json');
  
  if (!fs.existsSync(artifactPath)) {
    console.error("❌ Artifact file not found. Migration may have failed.");
    process.exit(1);
  }

  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  const networkId = Object.keys(artifact.networks)[0]; // Usually "5777" for Ganache
  const newAddress = artifact.networks[networkId]?.address;

  if (!newAddress) {
    console.error("❌ Could not find deployed address in artifact.");
    process.exit(1);
  }

  console.log(`✅ New Contract Address: ${newAddress}`);

  // Update index.html
  const htmlPath = path.join(__dirname, 'index.html');
  let htmlContent = fs.readFileSync(htmlPath, 'utf8');

  // Replace the contract address line
  htmlContent = htmlContent.replace(
    /const CONTRACT_ADDRESS = "0x[a-fA-F0-9]{40}";/,
    `const CONTRACT_ADDRESS = "${newAddress}";`
  );

  fs.writeFileSync(htmlPath, htmlContent);
  console.log(`✅ Successfully updated index.html with new address: ${newAddress}`);

} catch (error) {
  console.error("❌ Error:", error.message);
}