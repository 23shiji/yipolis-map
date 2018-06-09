let localnet_vm;
plugin_on_init(function(store){
    const APP_ID = "xpTHT125IoWveEQ4cYi8qf52-MdYXbMMI"
    const CLIENT_KEY = "OnbuOgk8HfQFXNavO6JhKtha"
    AV.initialize(APP_ID, CLIENT_KEY)
    const MapMsg = AV.Object.extend('MapMsg')
    localnet_vm = new Vue({
        el: '#local_net_chat_app',
        data: {
            display: false,
            network_on: true,
            msg_content: '',
            lng: 0,
            lat: 0,
            messages: [],
            timer: null,
            name_content: localStorage['localnet.name_content'] || ''
        },
        methods: {
            switch_panel(){
                this.display = !this.display
            },
            send_local_msg(){
                if(!this.name_content){
                    alert("未填写昵称")
                    return
                }
                let msg = new MapMsg()
                let pos = new AV.GeoPoint({latitude: this.lat, longitude: this.lng})
                localStorage['localnet.name_content'] = this.name_content
                msg.set("nickname", this.name_content)
                msg.set("content",  this.msg_content)
                msg.set("position", pos)
                msg.save()
                .then((msg) => {
                    this.add_message({
                        nickname: this.name_content,
                        content: this.msg_content
                    })
                    this.msg_content = ''
                })
                .catch((error) => {
                    alert("发送失败")
                    console.error(error)
                })
            },
            add_message({nickname, content}){
                this.messages.push({
                    nickname,
                    content,
                    x: Math.floor(window.innerWidth),
                    y: Math.floor(Math.random() * window.innerHeight)
                })
            },
            query_by_pos({lat, lng}){
                lat = -lat
                let ne = new AV.GeoPoint({latitude: lat+5, longitude: lng+5})
                let sw = new AV.GeoPoint({latitude: lat-5, longitude: lng-5})
                let query = new AV.Query("MapMsg")
                query.descending("createdAt")
                query.withinGeoBox("position", sw, ne)
                query.limit(50)
                this.lng = lng
                this.lat = lat
                query.find()
                .then(msgs => {
                    this.messages = []
                    msgs.forEach(m => {
                        this.add_message({
                            nickname: m.get("nickname"),
                            content: m.get("content")
                        })
                    })
                }).catch(error => {
                    console.error(error)
                })
            }
        },
        created(){
            this.query_by_pos({
                lat: this.lat,
                lng: this.lng
            })
            setInterval( () => {
                this.messages.forEach(m => {
                    m.x -= 4
                    if(m.x < -500){
                        m.x = Math.floor(window.innerWidth)
                        m.y = Math.floor(Math.random() * window.innerHeight)
                    }
                })
            }, 20)
        }
    })
})

plugin_on_event("click", function(pos){
    localnet_vm.query_by_pos(pos)
})

plugin_on_exit(function(){
    
})