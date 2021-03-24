<script>
    (function() {
        var win = window;
        var loc = location;
        var doc = document;
        //var detector = require('detector');
        if (win.watcher) return;
        var W =  win.watcher = { };
        var random = function(){
            return (+new Date()) + '.r' + Math.floor(Math.random() * 1000);
        };
        /**
         * [name description]
         * @return {[type]} [description]
         */
        W.name = function(name){
        window.WDMOD = name;
        }
        /**
         * [error 浏览器抛错]
         * @param  {[type]} err [description]
         * @return {[type]}    [description]
         */
        W.error = function(err) {
            if (!(err instanceof Error)) {
                return;
            }
            return error({
        type : 'catched',
                msg  : err.message || err.description,
                file : err.filename || err.fileName || err.sourceURL,
                line : err.lineno || err.lineNumber || err.line,
                col  : err.colno || err.columnNumber
            });
        };
        /**
         * [ajaxErr ajax请求抛错]
         * @param  {[type]} res [服务器返回错误信息]
         * @return {[type]}     [description]
         * @todo [增加接口名字的上报]
         */
        W.ajaxErr = function(obj){
            return error({
        type    : 'ajaxErr',
                ajaxurl : obj.url,
                ajaxreq : obj.req,
                ajaxrep : obj.rep,
                errorType : obj.errorType
            });
            // return error('ajaxErr','','','','',obj.url,obj.req,obj.rep,);
        };
        /**
         * JavaScript 异常统一处理函数
         * @param  {String} msg  [报错信息]
         * @param  {String} file [报错所在文件]
         * @param  {Number} line [报错行数]
         * @return [Array]      [description]
         */
        function error(obj) {
            var type      = obj.type,
                    msg       = encodeURIComponent(obj.msg) || '',
                    file      = encodeURIComponent(obj.file) || '',
                    line      = encodeURIComponent(obj.line) || '',
                    col       = encodeURIComponent(obj.col) || '',
                    ajaxurl   = encodeURIComponent(obj.ajaxurl) || '',
                    ajaxreq   = JSON.stringify(obj.ajaxreq) || '',
                    ajaxrep   = JSON.stringify(obj.ajaxrep) || '',
                    errorType = obj.errorType || '';
            var data = {
        projectName:'d_weidian',//需要手动传
                url: encodeURIComponent(loc.href),
                param:{//扩展字段
        ref: encodeURIComponent(doc.referrer) || "-",
                    errGetFrom:type,
                    clnt:{
        appCodeName:navigator.appCodeName,
                        appName:navigator.appName,
                        platform:navigator.platform,
                        appVersion:navigator.appVersion,
                        UA:navigator.userAgent
                    }
                }
            };
            if(type === 'window' || type =='catched'){
        data.type = 1;//1,js报错，2，接口报错
                data.errorParam = {
        errorMessage: msg || '',
                    scriptURI: file || '',
                    lineNumber: line || 0,
                    columnNumber: col || 0,
                    errorObj:''////错误的详细信息
                }
            }else{
        data.type = errorType ? errorType : 2;//1,js报错，2，接口报错
                data.errorParam = {
        apiUrl:ajaxurl,
                    apiRequest:ajaxreq,
                    apiResponse:ajaxrep
                }
            }
            //防止浏览器内存回收导致get请求无法发出
            var n = 'img_' + random(),
                    img = win[n] = new Image();
            img.onload = img.onerror = img.onabort = function(){
        img.onload = img.onerror = img.onabort = null;
                win[n] = null;
            };
            var url = '//tjsdk.api.weidian.com/H5Exception/log/upload.do?param='+JSON.stringify(data);
            img.src = url;
        }
        win.onerror = function(msg,file,line,col) {
        error({
            type: 'window',
            msg: msg,
            file: file,
            line: line,
            col: col
        });
            return false;
        }
    })();
</script>