module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: {
          entry: './src/main.js',
          externals: {
            'better-sqlite3': 'commonjs better-sqlite3',
          },
        },
        renderer: {
          config: {
            module: {
              rules: [
                {
                  test: /\.(js|jsx)$/,
                  exclude: /node_modules/,
                  use: {
                    loader: 'babel-loader',
                    options: {
                      presets: ['@babel/preset-react'],
                    },
                  },
                },
                {
                  test: /\.css$/,
                  use: ['style-loader', 'css-loader'],
                },
              ],
            },
          },
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/app.js',
              name: 'main_window',
              preload: {
                js: './src/preload.js',
              },
            },
          ],
        },
      },
    },
  ],
};