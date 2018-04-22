module.exports = {
  webpack: (config) => {
    // Fixes npm packages that depend on `fs` module
    config.node = {
      fs: 'empty'
    }

    // https://github.com/zeit/next.js/issues/1582#issuecomment-291025361
    config.plugins = config.plugins.filter(plugin => {
      if (plugin.constructor.name === 'UglifyJsPlugin') {
        return false
      } else {
        return true
      }
    })
    
    return config
  }
}
