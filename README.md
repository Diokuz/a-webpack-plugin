# ab-webpack-plugin

## How to use

First, you should use `css-loader`

Install `ab-webpack-plugin` plugin
```
npm i ab-webpack-plugin --save-dev
```

Then add three lines of code to your webpack config(s)
```js
const AbPlugin = require('ab-webpack-plugin') // 1

...

const config = {
  rules: {
  	test: /\.(css)$/,
    use: [
      { loader: 'style-loader' },
      {
        loader: 'css-loader',
        options: {
          modules: true,
          getLocalIdent: AbPlugin.getClassName, // 2 ← define `ab` classnames generator
        },
      },
      'postcss-loader',
    ],
  }
  ...
  plugins: [
    new AbPlugin(), // 3
    ...
  ],
  ...
}
```

Same if you use ExtractTextPlugin
```js
const AbPlugin = require('ab-webpack-plugin') // 1

...

const config = {
  rules: {
  	test: /\.(css)$/,
    use: ExtractTextPlugin.extract({
      use: [
        {
          loader: 'css-loader',
          options: {
            modules: true,
            getLocalIdent: AbPlugin.getClassName, // 2
          },
        },
        'postcss-loader',
      ],
    }),
  }
  ...
  plugins: [
    new AbPlugin(), // 3 ← Before ExtractTextPlugin!
    new ExtractTextPlugin(),
    ...
  ],
  ...
}
```