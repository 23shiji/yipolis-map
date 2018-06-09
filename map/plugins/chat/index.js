let localnet_vm;
plugin_on_init(function(store){
    const POS_RADIS = 1
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
                if(!this.msg_content){
                    return
                }
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
                    // this.add_message({
                    //     nickname: this.name_content,
                    //     content: this.msg_content
                    // })
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
                if(this.$refs.message_container){
                    this.$nextTick(() => {
                        this.$refs.message_container.scrollTop =
                            this.$refs.message_container.scrollHeight
                            -
                            this.$refs.message_container.clientHeight
                    })
                }
            },
            query_by_pos({lat, lng}){
                lat = -lat
                let ne = new AV.GeoPoint({latitude: lat+POS_RADIS, longitude: lng+POS_RADIS})
                let sw = new AV.GeoPoint({latitude: lat-POS_RADIS, longitude: lng-POS_RADIS})
                let query = new AV.Query("MapMsg")
                query.ascending("createdAt")
                query.withinGeoBox("position", sw, ne)
                query.limit(50)
                this.lng = lng
                this.lat = lat
                query.find()
                .then(msgs => {
                    this.messages = []
                    console.log("Messages:", msgs.length, lat, lng)
                    msgs.forEach(m => {
                        this.add_message({
                            nickname: m.get("nickname"),
                            content: m.get("content")
                        })
                    })
                }).catch(error => {
                    console.error(error)
                })
            },
            subscribe(){
                let query = new AV.Query('MapMsg')
                query.subscribe().then((liveQuery) => {
                    liveQuery.on('create', (msg) => {
                        let pos = msg.get("position")
                        if(
                            pos.latitude <= this.lat + POS_RADIS &&
                            pos.latitude >= this.lat - POS_RADIS &&
                            pos.longitude <= this.lng + POS_RADIS &&
                            pos.longitude >= this.lng - POS_RADIS
                        ){
                            this.add_message({
                                nickname: msg.get("nickname"),
                                content: msg.get("content"),
                            })
                        }
                    })
                })
            }
        },
        created(){
            this.query_by_pos({
                lat: this.lat,
                lng: this.lng
            })
            this.subscribe()
            // setInterval( () => {
            //     this.messages.forEach(m => {
            //         m.x -= 4
            //         if(m.x < -500){
            //             m.x = Math.floor(window.innerWidth)
            //             m.y = Math.floor(Math.random() * window.innerHeight)
            //         }
            //     })
            // }, 20)
        }
    })
})

plugin_on_event("click", function(pos){
    localnet_vm.query_by_pos(pos)
})

plugin_on_exit(function(){
    
})