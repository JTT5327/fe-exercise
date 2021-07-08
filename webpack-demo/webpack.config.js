module.exports = {
    mode: 'development',
    entry:{
        index: './src/index.js',
        other: './src/add.js'
    },
    output:{
        filename: '[name].js'
    },
    optimization:{
        runtimeChunk: 'single',
        splitChunks:{
            cacheGroups:{
                commons:{
                    chunks: 'initial',
                    minChunks: 2,
                    minSize: 0
                },
                vendor:{
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    enforce: true
                }
            }
        },
    }
}