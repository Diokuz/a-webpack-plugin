This guy not working right now

```bash
npm run test

# Hello World! { className1: 'a', className2: 'b' }
```

Plugin `mini-css-extract-plugin` dont want to work with `a-webpack-plugin` for some reasons.

Just remove `new APlugin()` line – css file will be there. Set it back – no css file generated.
