let fs      = require('fs')
let path    = require('path')
let logPath = path.resolve('.','room.log')
let outPath = path.resolve('.','docs','result.md')

const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );

let content = fs.readFileSync(logPath, 'utf8')
content     = content.replace(/,\n$/,'').split(',\n')
//test12
class Parser {
    constructor(){}

    parse(channelId, dev){
        this.$content   = []
        this.$users     = {}
        this.$channelId = channelId;
        this.$baseUrl   = dev ? 'http://logdev.youshiyuwen.cn' : 'https://log.doushenmingxi.cn'
        this.$cols      = ['时间','类型','附加数据']
        this.$type_hash = {
            '?operation':['',''],
            'member_add': ['用户加入','blue'],
            'nextpage': ['切页','orange'],
            'enablemagic': ['交出魔法棒','#28bb93'],
            'disablemagic': ['收回魔法棒','#28bb93'],
            '*startcourse': ['开始上课','red'],
            '#putdance': ['上台','#15a2c3'],
            '#backdance': ['下台','#15a2c3'],
            'member_leave': ['离开','darkgray'],
            '#unmuteall': ['关闭所有人声音','purple'],
            '#muteall': ['开启所有人声音','purple'],
            '*stopcourse': ['结束课程','pink'],
            '*showranks': ['打开排行榜','#8b75b7'],
            '*hideranks': ['关闭排行榜','#8b75b7'],
            'shareclip': ['分享截屏','#b775b2'],
            'endshare': ['关闭分享截屏','#b775b2'],
            '#coursepause': ['暂停上课','#9bb77'],
            '#courseresume': ['恢复上课','#9bb77']
        }
        this.$lines     = [this.$cols.join('|'), this.$cols.map(_=>'-').join('|')]
        this.$types     = {}
        this.__query_logs()
    }

    __type(enType){
        return `<font style='color:${(this.$type_hash[enType]||[])[1] || '#000'}; font-weight:bold;'>${this.$type_hash[enType][0] || enType}</font>`
    }

    __query_logs(){
        $.ajax(this.$baseUrl + '/api/channel_log', {
            method : "POST",
            data: {
                channel_id: this.$channelId
            },
            dataType: "json",
            success: (res)=>{
                if (res && res.data && res.data.logs) {
                    res.data.logs.map((log)=>{
                        this.$content.push(log.content)
                    })
                    this.__parse_user()
                }
            },
            error: (...args)=>{
                console.log('request error',url,...args);
            }
        })

    }

    __parse_user(){
        this.$content = this.$content.sort((itemA, itemB)=>{
            itemA = JSON.parse(itemA)
            itemB = JSON.parse(itemB)
            return itemA.created_at > itemB.created_at ? 1 : -1
        }).map(_=>JSON.parse(_))
        this.$content.map((item)=>{
            if (item && item.type == 'member_add') {
                let userinfos = item.userinfos || []
                userinfos.map((user)=>{
                    this.$users[user.id] = user
                })
            }
        })
        this.$content.map((item, index)=>{
            let line = `${this.__time(item.created_at)}|${this.__type(item.type)}|`
            let extra  = ''
            switch (item.type) {
                case '?operation':
                    break;
                case 'member_add':
                    extra = item.userinfos.map((user)=>{
                        return this.__user_display(user.id)
                    }).join(' ')
                    break;

                case 'nextpage':
                    extra = `第${item.message.cursor+1}页`
                    break;
                case '#putdance':
                case '#backdance':
                    extra = this.__user_display(item.message.id)
                    break;
                case "member_leave":
                    extra = item.userinfos.map((id)=>{
                        return this.__user_display(id)
                    }).join(' ')
                    break;
                default:
                    extra = '无'
                    break;
            }
            if (extra) {
                line += extra
                this.$lines.push(line)
            }
        })
        
        fs.writeFileSync(outPath, this.$lines.join('\n'), 'utf8')

    }
    __user_display(id){
        return `<img src="${this.__avatar(id)}" width="30" height="30" >【${this.__master(id) ? "老师#" : ""}${this.__name(id)}#${id}】`
    }
    __user_by_id(id){ return this.$users[id] || {} }
    __name(id){ return this.__user_by_id(id).child_name || id }
    __avatar(id){ return this.__user_by_id(id).avatarurl || 'https://static.dsmx02.cn/default_avatar.jpg'}
    __master(id){ return !!this.__user_by_id(id).isMaster }
    __time(num) {
        const formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
        const returnArr = [];
        const date = new Date(num);
        returnArr.push(date.getFullYear()); // 取得4位数的年份
        returnArr.push(this.__format_number(date.getMonth() + 1)); // 取得日期中的月份，其中0表示1月，11表示12月
        returnArr.push(this.__format_number(date.getDate())); // 返回日期月份中的天数（1到31）
        returnArr.push(this.__format_number(date.getHours())); // 返回日期中的小时数（0到23）
        returnArr.push(this.__format_number(date.getMinutes())); // 返回日期中的分钟数（0到59）
        returnArr.push(this.__format_number(date.getSeconds())); // 返回日期中的秒数（0到59）
        let format = 'Y-M-D h-m-s'
        for (const i in returnArr) {
            if ({}.hasOwnProperty.call(returnArr, i)) {
                format = format.replace(formateArr[i], returnArr[i]); // 替换
            }
        }
        return format.replace('2020-','').replace('2021-','').replace('2022-','').replace('2023-','').replace('2024-','');
    }
    __format_number(n) {
        n = n.toString();
        return n[1] ? n : `0${n}`;
    }
}

module.exports = new Parser