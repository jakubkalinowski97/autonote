const { withNxMetro } = require('@nx/expo');
const { getDefaultConfig } = require('@expo/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const customConfig = {
  cacheVersion: 'app',
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    // This is a temporary workaround for the issue with the 'local' package in the monorepo.
    // The 'assetExts' and 'sourceExts' are not being correctly resolved from the default config.
    assetExts: require('@expo/metro-config/build/defaults').assetExts.filter(
      (ext) => ext !== 'svg'
    ),
    sourceExts: [
      ...require('@expo/metro-config/build/defaults').sourceExts,
      'cjs',
      'mjs',
      'svg',
    ],
  },
};

module.exports = withNxMetro(customConfig, {
  // Change this to true to see debugging info.
  // Useful if you have issues resolving modules
  debug: false,
  // all the file extensions used for imports other than 'ts', 'tsx', 'js', 'jsx', 'json'
  extensions: [],
  // Specify folders to watch, in addition to Nx defaults (workspace libraries and node_modules)
  watchFolders: [],
});
