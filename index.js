/*
 * Webpack plugin for supershort classNames generation
 * It works like that:
 * 1) Creates classNames generator uniqueIdGenerator, which will be used by css-loader in `getLocalIdent` option
 *    It doesnt matter in which order css files will be processed at first load (before `optimize-tree` stage)
 * 2) At stage `optimize-tree` (but before ExtractTextPlugin `optimize-tree`!) it finds all css modules (css file + loader) and sort them by absolute path name
 * 3) Creates new `uniqueIdGenerator` and process all css modules in ordered manner
 * 4) Each css module is rebuilded using new `uniqueIdGenerator`, so at that stage plugin generates proper and reproducible classNames
 */

const incstr = require('incstr')
const async = require('neo-async')

let uniqueIdGenerator

function getPath(request) {
  const index = request.lastIndexOf('!')

  return request.substr(index + 1)
}

// https://medium.freecodecamp.org/reducing-css-bundle-size-70-by-cutting-the-class-names-and-using-scope-isolation-625440de600b
function createUniqueIdGenerator (extraOpts = {}) {
  const index = {}

  const generateNextId = incstr.idGenerator({
    alphabet: extraOpts.alphabet || this.options.alphabet
  })

  const func = (name) => {
    if (index[name]) {
      return index[name]
    }

    func.i++

    let nextId

    // Removed "d" letter to avoid accidental "ad" construct.
    // @see https://medium.com/@mbrevda/just-make-sure-ad-isnt-being-used-as-a-class-name-prefix-or-you-might-suffer-the-wrath-of-the-558d65502793
    do {
      // Class name cannot start with a number.
      nextId = generateNextId()
    } while (/^[0-9]|^(ad)/i.test(nextId))

    index[name] = nextId

    return index[name]
  }

  func.i
  func.index = index

  return func
}

function ComponentTreePlugin (options) {
  this.options = {
    alphabet: 'abcdefghijklmnopqrstuvwxyz',
    ...options,
  }

  this.createUniqueIdGenerator = createUniqueIdGenerator
}

ComponentTreePlugin.prototype.apply = function (compiler) {
  uniqueIdGenerator = this.createUniqueIdGenerator({ alphabet: 'DOeSNt_MATER' })

  compiler.plugin('this-compilation', (compilation) => {
    const allCssModules = []

    compilation.plugin('optimize-tree', (chunks, modules, callback) => {
      // Traverser all modules and aggreaget them to `allCssModules` variable
      async.each(compilation.chunks, (chunk, callback1) => {
        async.each(chunk.mapModules(c => c), (module, cb) => {
          if (module.request.endsWith('.css')) {
            allCssModules.push(module)
          }

          cb()
        }, (err) => callback1(err))
      }, (err) => {
        if (err) {
          callback(err)

          return
        }

        // uniqueIdGenerator.index === whatever, we dont care

        // All modules traversed and placed to allCssModules
        // Now, lets sort them and rebuild with new `uniqueIdGenerator`
        uniqueIdGenerator = this.createUniqueIdGenerator()

        // uniqueIdGenerator.index === {} here

        const sortedCssModules = allCssModules.slice().sort((a, b) => {
          const pathA = getPath(a.request)
          const pathB = getPath(b.request)

          if (pathA > pathB) {
            return 1
          } else if (pathA < pathB) {
            return -1
          } else {
            // @todo rewrite it in a proper common way
            if (a.request.indexOf('css-loader') !== -1) {
              return 1
            }
          }

          return -1
        })

        async.eachSeries(sortedCssModules, (m, cb2) => {
          compilation.rebuildModule(m, cb2)
        }, callback)

      })
    })
  })
}

module.exports = ComponentTreePlugin

module.exports.getClassName = (context, localIdentName, localName, options) => {
  const index = context.request.lastIndexOf('!')
  const req = context.request.substr(index + 1)

  return uniqueIdGenerator(`${req}${localName}`)
}
