const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
module.exports = (async () => {
    const {
      resolver: { assetExts },
    } = await getDefaultConfig();
    return {
      resolver: {
        assetExts: [...assetExts, 'png'], // Add extensions for assets
      },
    };
  })();
