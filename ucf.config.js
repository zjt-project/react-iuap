/**
 * UCF配置文件 更多说明文档请看 https://github.com/iuap-design/ucf-web/blob/master/packages/ucf-scripts/README.md
 * 语雀全新详细文档请访问 https://www.yuque.com/ucf-web/book/zfy8x1
 */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
    const isBuild = argv[0] === 'build';
    return {
        context: 'leasing',
        // 启动所有模块，默认这个配置，速度慢的时候使用另外的配置
        //bootList: true,
        // 启动这两个模块，启动调试、构建
        bootList: [
            "login",
            "home",
            "communication",
        ],
        // 代理的配置
        proxy: [
            {
                enable: true,
                headers: {
                    "Referer": "http://localhost:8088"
                },
                //要代理访问的对方路由
                router: [
                    '/leasing','jic-leasing',
                ],
                url: 'http://localhost:8088'
            },
        ],
        // 静态托管服务
        static: 'ucf-common/src/static',
        // 展开打包后的资源文件，包含图片、字体图标相关
        res_extra: true,
        // 构建资源的时候产出sourceMap，调试服务不会生效
        open_source_map: false,
        // CSS loader 控制选项
        css: {
            modules: false
        },
        // 全局环境变量
        global_env: {
            __MODE__: JSON.stringify(env),
            'process.env.NODE_ENV': JSON.stringify(env),
            'process.env.STATIC_HTTP_PATH': env == 'development' ? JSON.stringify("static") : JSON.stringify("../static"),
            'process.env.NODE_ENV': JSON.stringify("production"),
            GROBAL_HTTP_CTX: JSON.stringify("/leasing"),
            //前台默认上下文
            GROBAL_PORTAL_ID: JSON.stringify("leasing"),
            GROBAL_PORTAL_CTX: JSON.stringify("/leasing"),
            GROBAL_PACKAGE_NAME: JSON.stringify("leasing"),
        },
        static: 'ucf-common/src',
        // 别名配置
        alias: {
            components: path.resolve(__dirname, 'ucf-common/src/components'),
            utils: path.resolve(__dirname, 'ucf-common/src/utils'),
            static: path.resolve(__dirname, 'ucf-common/src/static'),
            styles: path.resolve(__dirname, 'ucf-common/src/styles'),
            //'ucf-apps': path.resolve(__dirname, 'ucf-apps/')
        },
        // 构建排除指定包
        externals: {
            "react": "React",
            "react-dom": "ReactDOM",
            "tinper-bee": "TinperBee",
            "prop-types": "PropTypes"
        },
        // 加载器Loader
        loader: [

        ],
        // 调试服务需要运行的插件
        devPlugins: [],
        // 构建服务需要运行的插件
        buildPlugins: [
            new CopyWebpackPlugin([
                {
                    from: 'ucf-common/src/static/',
                    to: `static`
                }
            ])
        ],
    }
}
