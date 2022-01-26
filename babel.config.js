module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
        alias: {
          assets: './src/assets',
          components: './src/components',
          common: './src/common',
          constants: './src/constants',
          contexts: './src/contexts',
          hooks: './src/hooks',
          internationalization: './src/internationalization',
          networking: './src/networking',
          screens: './src/screens',
          utils: './src/utils',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
