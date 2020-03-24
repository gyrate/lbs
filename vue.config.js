const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

// 定义页面title
const name = '城市脉搏'

module.exports = {

  // 基本路径
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',

  // 开发环境，打开ESlint约束
  // lintOnSave: process.env.NODE_ENV !== 'production',
  lintOnSave: false,

  transpileDependencies: ['element-ui'],

  devServer: {

    // 遮罩显示ESLint告警或错误
    // overlay: {
    //   warnings: true,
    //   errors: true
    // },

    // port: port,
    // open: true, // When open is enabled, the dev server will open the browser.
    // overlay: {
    //   warnings: false, //Shows a full-screen overlay in the browser when there are compiler errors or warnings
    //   errors: true
    // },
    proxy: {
      // change dev_api/login => easyMockHost/login
      // detail: https://www.webpackjs.com/configuration/dev-server/#devserver
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://219.135.145.180:10007/csmb', // target host
        // target: 'http://192.168.1.58:39001/csmb', // target host
        // target: 'http://192.168.1.145:10007/csmb', // target host
        changeOrigin: true, // change location.origin
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: '' // rewite the matched string
        }
      },
      '/mock': {
        target: `http://localhost:3000`,
        changeOrigin: true,
        pathRewrite: {
          '^/mock': ''
        }
      }
    }
  },

  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    externals: {
      'AMap': 'AMap', // 高德地图配置
      'AMapUI': 'AMapUI'
    }
  },

  css: {
    sourceMap: true,
    loaderOptions: {
      sass: {
        data: `@import "@/assets/variables.scss";`
      }
    }
  },

  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'Index Page',
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
    // subpage: 'src/subpage/main.js'
  }

}
