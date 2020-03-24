module.exports = {
  presets: [
    [
      '@vue/app',
      {
        polyfill: [
          'es6.promise',
          'es6.symbol'
        ],
        useBuiltIns: 'entry'
      }
    ]
  ]
}
