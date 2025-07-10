const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: '/', // ✅ Với Netlify luôn là '/'
  transpileDependencies: true
})
// module.exports = {
//   publicPath: '/new-demo/' // <--- tên repo của bạn
// }
