const ASSET_NAMES = [
  'ship.svg',
  'bullet.svg',
  'skin1.svg',
  'skin2.svg',
  'skin3.svg',
  'skin4.svg',
  'skin5.svg',
  'skin6.svg',
  'skin7.svg',
  'skin8.svg',
  'skin9.svg',
];

const assets = {};

const downloadPromise = Promise.all(ASSET_NAMES.map(downloadAsset));

function downloadAsset(assetName) {
  return new Promise(resolve => {
    const asset = new Image();
    asset.onload = () => {
      console.log(`Downloaded ${assetName}`);
      assets[assetName] = asset;
      resolve();
    };
    asset.src = `/assets/${assetName}`;
  });
}

export const downloadAssets = () => downloadPromise;

export const getAsset = assetName => assets[assetName];
