const path = require('path');

module.exports = {
  webpack: (config, env) => {
    config.module.rules.push({
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader', // Добавьте postcss-loader для обработки Tailwind
      ],
    });
    return config;
  },
};