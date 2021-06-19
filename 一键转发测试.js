var _window = window;
var copy = $("#J_copy"),
	ab = $('#a'),
    forward = $(".J_forward");


var Index = {
	init: function() {
		this.render(function(result){
			alert(result);
		});
	},
	render: function(callback) {
		var self = this,
        _text = $(".text-img-list p");
		copy.click(function(){
			// var script = document.createElement("script");
			// script.src = "https://s.geilicdn.com/script/common/jsbridge.min.js";
			// document.body.appendChild(script);

			KDJSBridge2.call("Clipboard", "copy", {'text':ab.text()}, function(data){
				var code = data.bridgeParam && Number(data.bridgeParam.status.status_code);
			    if (code === -5) {
			        //当前客户端不支持该identifier，则按照老版本jsbridge方式调用
			        self.doOldJSBridgeMethod();
			    }else if(code === 0) {
			        //调用成功！客户端会将回调给前端的数据放置在 data.param 里面，直接使用即可
			        callback(data.param);
			    }
			});
		});
        forward.on("click",function(e){
            KDJSBridge2.call("Moments","share",{
                "text":_text.text(),
                "imgUrls":[
                    'https://si.geilicdn.com/daily_hz_fxweb_0b18000001588aaf03130a016558_1024_683.jpeg?w=640&h=640',
                    'https://si.geilicdn.com/vshop1538824-1468800487631-E40B6-s1.jpg?w=640&h=640',
                    'https://si.geilicdn.com/vshop1538824-1468541827453-04F9E-s1.jpg?w=640&h=640'
                ]
            },function(data){
                callback(data.param);
            });
        });
	},
	doOldJSBridgeMethod: function() {
		_window.Cambridge && _window.Cambridge.call("Clipboard", "copy", {'text':ab.text()}, function(result){
			if (result.status.code === 0) {
		        alert(JSON.stringify(result.data))
		    } else {
		        alert(result.status.msg);
		    }
		});
	}
}

Index.init('body');