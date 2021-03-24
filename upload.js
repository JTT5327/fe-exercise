var fs = require('fs'),
    path = require('path'),
    request = require('request');

var formData = {
    file: fs.createReadStream(path.resolve(__dirname, 'index.js')), // 上传的文件
    name: 'test.js',
    path: '201801', // 文件将上传到该目录下，文件名与上传的文件名相同
    project: 'show', // 项目名，xxxx传'show'， VMS传'vms'
    token: 'c6b0c68f$81134af1a85ca8042cb3017a' // access token，临时都传这个值
};


request.post({
    url: 'http://localhost:8080/openApi/upload',
    formData: formData
}, function (err, response, body) {
    var data;

    if (!err) {
        try {
            data = JSON.parse(body);
        } catch (e) {
            data = body
        }

        if (typeof data === 'object' && data.status && data.status.code === 0) {
            console.log('success: ', data);
        } else {
            err = data || '上传文件失败';
        }
    }

    err && console.log('error: ', err);
});

