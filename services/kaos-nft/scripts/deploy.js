// scripts/deploy.js

async function main() {
  // Get the deployer's account details
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Get the balance of the deployer
  const balance = await deployer.getBalance();
  console.log("Account balance:", balance.toString());

  // Deploy the AllCodeNFT contract
  const AllCodeNFT = await ethers.getContractFactory("AllCodeNFT");
  const allCodeNFT = await AllCodeNFT.deploy();

  console.log("AllCodeNFT deployed to:", allCodeNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

