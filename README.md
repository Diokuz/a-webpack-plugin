# a-webpack-plugin

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

`a-webpack-plugin` is not stable for now, use it at your own risk)

But it works)

## How to use

First, you should use `css-loader`

Install `a-webpack-plugin` plugin
```
npm i a-webpack-plugin --save-dev
```

Then add three lines of code to your webpack config(s)
```js
const APlugin = require('a-webpack-plugin') // 1

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
          getLocalIdent: APlugin.getClassName, // 2 ← define `ab` classnames generator
        },
      },
      'postcss-loader',
    ],
  }
  ...
  plugins: [
    new APlugin(), // 3
    ...
  ],
  ...
}
```

Same if you use ExtractTextPlugin
```js
const APlugin = require('a-webpack-plugin') // 1

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
            getLocalIdent: APlugin.getClassName, // 2
          },
        },
        'postcss-loader',
      ],
    }),
  }
  ...
  plugins: [
    new APlugin(), // 3 ← Before ExtractTextPlugin!
    new ExtractTextPlugin(),
    ...
  ],
  ...
}
```

If you have server-side rendering, dont forget to do the same thing for your server-side bundle.

If you use `css-require-hook` instead of webpack-bundling for server-side, you cannot use `a-webpack-plugin` for now (but you will be able to do that in near future!).

## Custor alphabet

Default alphabet is `a..z`. If you want to change it (eg. `A..Za..z0..9`), just change it:

```js
new APlugin({ alphabet: 'A..Za..z0..9' })
```

Read more about [incstr package](https://www.npmjs.com/package/incstr).

## Why I need this plugin?

*Why cant I just use `APlugin.getClassName` for `getLocalIdent`?*

Well, the problem is that webpack doesnt guarantee you an order in which css files are processed through loaders. Because of that:

1. Client-side and server-side build may differ
2. Each build may differ from each other (non-deterministic build)

`a-webpack-plugin` solves this _order_ problem.
