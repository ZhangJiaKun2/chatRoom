import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
    plugins: [
      vue(),
      Components({
        resolvers: [AntDesignVueResolver({ importStyle: 'less' })]
        // 如果需要自定义主题色，则需要配置importStyle: 'less',并安装less: npm install less --save-dev

      }),

    ],
    server: {
        port:3000,
        proxy: {
            '/socket': {
                target: 'http://localhost:8082',
                ws: true,
                changeOrigin: true
            },

        },
    },

    css: {
        // css预处理器
        preprocessorOptions: {
            less: {
                charset: false,
                additionalData: '@import "./src/assets/style/global.less";',
                javascriptEnabled: true
            },
        },
    },

})


