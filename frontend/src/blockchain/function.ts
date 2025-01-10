import { Contract } from "ethers";

export async function ownerOfMintedTokens(
  _contract: Contract,
  _address: string
) {
  const tokenArray: number[] = await _contract.ownerOfMintedTokens(_address);
  return tokenArray;
}
export async function tokenURI(_contract: Contract, _tokenId: number) {
  const uri: string = await _contract.tokenURI(_tokenId);
  return uri;
}
export async function prices(_contract: Contract, _pieceString: string) {
  const price: BigInt = await _contract.prices(_pieceString);
  return price;
}
export async function randomCratePrice(_contract: Contract) {
  const price: BigInt = await _contract.randomCratePrice();
  return price;
}
export async function paused(_contract: Contract) {
  const isPause: boolean = await _contract.paused();
  return isPause;
}



//crate function
export async function openCrate(_contract: Contract, _price: BigInt) {
  const tx = await _contract.openCrate({
    value: _price.toString(),
  });
  const receipt = await tx.wait();
  console.log(receipt,tx)
  return receipt;
}
export async function openCrateKing(_contract: Contract, _price: BigInt) {
  const tx = await _contract.openCrateKing({
    value: _price.toString(),
  });
  const receipt = await tx.wait();
  console.log(receipt,tx)
  return receipt;
}
export async function openCrateQueen(_contract: Contract, _price: BigInt) {
  const tx = await _contract.openCrateQueen({
    value: _price.toString(),
  });
  const receipt = await tx.wait();
  console.log(receipt,tx)
  return receipt;
}
export async function openCrateBishop(_contract: Contract, _price: BigInt) {
  const tx = await _contract.openCrateBishop({
    value: _price.toString(),
  });
  const receipt = await tx.wait();
  console.log(receipt,tx)
  return receipt;
}
export async function openCrateRook(_contract: Contract, _price: BigInt) {
  const tx = await _contract.openCrateRook({
    value: _price.toString(),
  });
  const receipt = await tx.wait();
  console.log(receipt,tx)
  return receipt;
}
export async function openCrateKnight(_contract: Contract, _price: BigInt) {
  const tx = await _contract.openCrateKnight({
    value: _price.toString(),
  });
  const receipt = await tx.wait();
  console.log(receipt,tx)
  return receipt;
}
export async function openCratePawn(_contract: Contract, _price: BigInt) {
  const tx = await _contract.openCratePawn({
    value: _price.toString(),
  });
  const receipt = await tx.wait();
  console.log(receipt,tx)
  return receipt;
}
