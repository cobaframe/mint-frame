const CONTRACT_ADDRESS = "0xdF310B440935e37B8b42555C819b689B4e8A6079";
const TOKEN_ID = 0;
const QUANTITY = 1;
const PRICE_ETH = "0"; // free mint
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

let ABI = null;
async function loadAbi() {
  const res = await fetch("abi.json");
  ABI = await res.json();
}
loadAbi();

const connectBtn = document.getElementById("connect");
const mintBtn = document.getElementById("mint");
const statusDiv = document.getElementById("status");

function setStatus(text){ statusDiv.innerText = "Status: " + text; }

let provider, signer, userAddress;

connectBtn.onclick = async () => {
  try {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = provider.getSigner();
    userAddress = await signer.getAddress();
    setStatus("Connected: " + userAddress);
    connectBtn.disabled = true;
    mintBtn.disabled = false;
  } catch(e){
    setStatus("Gagal connect wallet");
  }
};

mintBtn.onclick = async () => {
  try {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    const tx = await contract.claimTo(
      userAddress,
      TOKEN_ID,
      QUANTITY,
      ZERO_ADDRESS,
      ethers.utils.parseEther(PRICE_ETH),
      { proof: [], quantityLimitPerWallet: 0, pricePerToken: 0, currency: ZERO_ADDRESS }
    );

    setStatus("Menunggu konfirmasi...");
    await tx.wait();
    setStatus("Mint berhasil!");
    alert("Mint sukses!");
  } catch(e){
    console.log(e);
    alert("Mint gagal!");
    setStatus("Mint gagal");
  }
};