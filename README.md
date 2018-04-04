# ab-webpack-plugin

Isomorphic (universal) css supershort classNames generator for webpack.

## What is this for?

If you are crazy `need for mobile speed` super optimizator, you may want to shortinize your classNames in a hardcore ultimate way:

```html
<div class="mz nb">
	<label class="ea">
		<span class="ej em el eo">Some text</span>
		<input name="phoneNumber" label="Phone" class="ed eg ef">
	</label>
	<div class="nh ni">
		<span class="mr">Some other text</span>
	</div>
</div>
```

`ab-webpack-plugin` is not stable for now, use it at your own risk)

But it works)

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

## Why I need this plugin?

*Why cant I just use `AbPlugin.getClassName` for `getLocalIdent`?*

Well, the problem is that webpack doesnt guarantee you an order in which css files are processed through loaders. Because of that:

1. Client-side and server-side build may differ
2. Each build may differ from each other (non-deterministic build)

`ab-webpack-plugin` solves this _order_ problem.
