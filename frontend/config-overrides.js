const path = require('path');

module.exports = function override(config, env) {
    // `baseUrl` と `paths` を設定して Webpack のエイリアスを調整
    config.resolve = {
        ...config.resolve, // 既存の設定を保持
        alias: {
            ...config.resolve.alias, // 既存のエイリアスを保持
            '@': path.resolve(__dirname, 'src') // `@` を `src` ディレクトリにマッピング
        }
    };

    // カスタマイズした設定を返す
    return config;
};
