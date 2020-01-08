class AirFilter extends HTMLElement {
  constructor() {
    super()
    this.fan_mode = {
      'auto': '自动模式',
      'silent': '睡眠模式',
      'favorite': '最爱模式'
    }
    const shadow = this.attachShadow({ mode: 'open' });
    const div = document.createElement('ha-card');
    div.className = 'ha-air-filter-panel off'
    div.innerHTML = `
            
            <div class="card-header">
                <a class="name">
                    <ha-icon icon="mdi:air-filter"></ha-icon> 
                    <span class="title">空气净化器</span>
                </a>
                <paper-icon-button icon="mdi:menu" style="margin-top:-8px;"></paper-icon-button> 
            </div>
            <div class="duang">
            <div class="body">
                <div class="content">
                  <p>PM2.5(μg/m³)</p>
                  <p class="var-aqi">38</p>
                  <p>室内空气 <span class="var-quality">优</span></p>
                </div>
                <div class="content-bg">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
            </div>
            </div>
            <div class="tmp-body">
                <div>
                  <span>40</span>
                  <p>温度(℃)</p>
                </div>
                <div>
                  <span>50</span>
                  <p>湿度(%)</p>
                </div>
            </div>
            <div class="footer">
              <div class="status">
                <span ><ha-icon icon="mdi:power" ></ha-icon></span>
                <p>开机</p>
              </div>
              <div>
              <span><ha-icon icon="mdi:brightness-auto" ></ha-icon></span>
                <p>自动</p>
              </div>
              <div>
              <span><ha-icon icon="mdi:power-sleep" ></ha-icon></span>
                <p>睡眠</p>
              </div>
              <div>
              <span><ha-icon icon="mdi:heart" ></ha-icon></span>
                <p>最爱</p>
              </div>      
            </div>
            <div>
              
            </div>
        `
    shadow.appendChild(div)

    const style = document.createElement('style')
    style.textContent = `.ha-air-filter-panel{overflow:hidden;}            
            .card-header{display:flex;justify-content: space-between;}
            .card-header .name{cursor: pointer;text-decoration: none;}
                        
           .content-bg{
              height: 300px;
              width: 300px;
              border-radius: 50%;}
           .content-bg div{position:absolute;height: 310px;width: 290px;border-radius: 50%;}
           .content-bg div:nth-child(1){
              transform: rotate(0deg);
              animation: a1 5s linear 2s infinite alternate;
           }
           .content-bg div:nth-child(2){
            transform: rotate(60deg);
            animation: a2 4s linear 1s infinite alternate;
           }
           .content-bg div:nth-child(3){
            transform: rotate(120deg);
            animation: a3 3s linear 1s infinite alternate;
           }

           @keyframes a1{
              from {transform: rotate(0deg);}
              to {transform: rotate(360deg);}
           }
           @keyframes a2{
              from {transform: rotate(60deg);}
              to {transform: rotate(300deg);}              
            }
            @keyframes a3{
              from {transform: rotate(120deg);}
              to {transform: rotate(240deg);}
            }
           
            .content{width:290px;height:290px;position:absolute;border-radius: 50%;margin-top:10px;z-index:1;text-align: center;}
            .content p{padding:0;margin:0;}
            .content p:nth-child(1){padding-top: 70px;font-size:12px;color:#ddd;}
            .content p:nth-child(2){font-size:80px;color:white;}
            .content p:nth-child(3){color:#eee;}

            .body{width: 300px;margin: 0 auto;}
            .tmp-body{display:flex;padding:30px 0;}
            .tmp-body div{flex:1;}
            .tmp-body div span{font-size:40px;}
            .tmp-body div p{margin:0;font-size:12px;color:gray;}
            .tmp-body div:nth-child(1){text-align:right;border-right:1px solid silver;padding-right:20px;}
            .tmp-body div:nth-child(2){padding-left:20px;}
            .footer{display:flex;}
            .footer div{flex:1;text-align:center;}
            .footer div ha-icon{font-size:25px;cursor:pointer;}
            .footer div span{display:inline-block;border:1px solid silver;padding:10px;border-radius:50%;text-align:center;}            
            .footer div p{color:gray;}

            /**开机**/
            .on .content-bg div{background: rgba(1,182,165,.1);}
            .on .content{background:#01b6a5;}
            .on .footer .status span{background:#f44336;color:white;}
            .on .footer .status p{color:#222;}
            .on .footer div.active span{background:#01b6a5;color:white;}
            .on .footer div.active p{color:#222;}
            .on .tmp-body div span{color:#01b6a5;}
            
            /**空气状态**/
            .on .level-1{background-color:#01be9e;}
            .on .level-2{background-color:#01be9e;}
            .on .level-3{background-color:#01be9e;}
            .on .level-4{background-color:blue;}
            .on .level-5{background-color:red;}
            .on .level-6{background-color:red;}

            /**关机**/
            .off .content-bg div{background: rgba(0,0,0,.1);}
            .off .content{background:#607d8b;}
            .off .footer div{color:gray!important;}
            .off .footer .status span{background:#01b6a5;color:white;}
            .off .footer .status p{color:#222;}
        `
    shadow.appendChild(style);

    this.shadow = shadow
    const $ = this.shadow.querySelector.bind(this.shadow)
    this.$ = $
    // 开-关机
    $('.footer div:nth-child(1) span').onclick = () => {
      let ls = $('.ha-air-filter-panel').classList
      if (ls.contains('off')) {
        ls.remove('off')
        ls.add('on')
        this.toast('开启设备')
        this.duang()
      } else {
        ls.remove('on')
        ls.add('off')
        this.toast('关闭设备')
      }
      this.call('toggle')
    }
    // 自动
    $('.footer div:nth-child(2) span').onclick = this.set_speed.bind(this, 'Auto')
    // 睡眠
    $('.footer div:nth-child(3) span').onclick = this.set_speed.bind(this, 'Silent')
    // 最爱
    $('.footer div:nth-child(4) span').onclick = this.set_speed.bind(this, 'Favorite')
    // 更多
    $('.card-header paper-icon-button').onclick = () => {
      const entityId = this.config.entity;
      this.fire('hass-more-info', { entityId })
    }
  }

  // 特效
  duang() {
    const { $ } = this
    if($('.duang .lizi')) return;
    let arr = []
    let f = document.createDocumentFragment()
    // 左边
    for (let i = 0; i < 20; i++) {
      let s = Math.round(Math.random() * 5) + 5
      let y = Math.round(Math.random() * 300)
      let kf = `dust-y${y}`
      let span = document.createElement('span')
      span.className='lizi'
      span.style.cssText = `animation: ${kf} ${s}s linear 1s infinite;left:-5px; margin-top:${y}px;`

      if (!arr.includes(kf)) {
        arr.push(`@keyframes ${kf}{from {left:0; margin-top:${y}px;}to {left:50%; margin-top:200px;}}`)
      }
      f.appendChild(span)
    }
    // 右边
    for (let i = 0; i < 20; i++) {
      let s = Math.round(Math.random() * 5) + 5
      let y = Math.round(Math.random() * 300)
      let kf = `dust-x${y}`
      let span = document.createElement('span')
      span.className='lizi'

      span.style.cssText = `animation: ${kf} ${s}s linear 1s infinite;right:-5px; margin-top:${y}px;`
      if (!arr.includes(kf)) {
        arr.push(`@keyframes ${kf}{from {right:0; margin-top:${y}px;}to {right:50%; margin-top:200px;}}`)
      }
      
      f.appendChild(span)
    }
    // 样式
    let style = document.createElement('style')
    style.textContent = `
      /**灰尘**/
      .duang{position: relative;overflow:hidden;padding-bottom:10px;}
      .duang .lizi{
        display:block;
        width:3px;height:3px;
        border-radius:50%;
        background-color: #01b6a5;
        position: absolute;
      }
      ${arr.join('')}`
    f.appendChild(style)
    $('.duang').insertBefore(f, $('.body'))
  }

  // 设置速度
  set_speed(speed) {
    this.toast(`设置速度【${speed}】`)
    this.call('set_speed', { speed })
  }

  // 通知
  toast(message) {
    this.fire("hass-notification", { message })
  }

  // 触发事件
  fire(type, data) {
    const event = new Event(type, {
      bubbles: true,
      cancelable: false,
      composed: true
    });
    event.detail = data;
    document.querySelector('home-assistant').dispatchEvent(event);
  }

  // 服务
  call(name, data = {}) {
    const entity_id = this.config.entity;
    this._hass.callService('fan', name, {
      entity_id,
      ...data
    })
  }

  // led灯切换
  toggleLed() {
    const entity_id = this.config.entity;
    const state = hass.states[entityId];
    const attrs = state.attributes;
    // 如果当前开就关
    hass.callService('fan', attrs['led'] ? 'xiaomi_miio_set_led_off' : 'xiaomi_miio_set_led_on', {
      entity_id
    });
  }

  update({ title, mode, aqi, filter_life_remaining, temperature, humidity, state }) {
    const { $ } = this
    // 开启&关闭
    let ls = $('.ha-air-filter-panel').classList
    if (state === 'on' && ls.contains('off')) {
      ls.remove('off')
      ls.add('on')
      $('.footer div:nth-child(1) p').textContent = '关闭'
      this.duang()
    } else if (state === 'off' && ls.contains('on')) {
      ls.remove('on')
      ls.add('off')
      $('.footer div:nth-child(1) p').textContent = '开启'
    }
    $('.title').textContent = title
    // 温湿度
    $('.tmp-body div:nth-child(1) span').textContent = temperature
    $('.tmp-body div:nth-child(2) span').textContent = humidity

    // 质量
    let qls = $('.content').classList
    qls.remove('level-1', 'level-2', 'level-3', 'level-4', 'level-5', 'level-6')
    let quality = '优'
    if (aqi < 50) {
      quality = '优'
      qls.add('level-1')
    }
    else if (aqi < 100) {
      quality = '良'
      qls.add('level-2')
    }
    else if (aqi < 150) {
      quality = '轻度污染'
      qls.add('level-3')
    }
    else if (aqi < 200) {
      quality = '中度污染'
      qls.add('level-4')
    }
    else if (aqi < 300) {
      quality = '重度污染'
      qls.add('level-5')
    }
    else {
      quality = '严重污染'
      qls.add('level-6')
    }
    $('.var-quality').textContent = quality
    $('.var-aqi').textContent = aqi
    // 模式
    let mls2 = $('.footer div:nth-child(2)').classList
    let mls3 = $('.footer div:nth-child(3)').classList
    let mls4 = $('.footer div:nth-child(4)').classList
    mls2.remove('active')
    mls3.remove('active')
    mls4.remove('active')
    if (mode == 'auto') {
      mls2.add('active')
    } else if (mode == 'silent') {
      mls3.add('active')
    } else if (mode == 'favorite') {
      mls4.add('active')
    }
  }

  set hass(hass) {
    this._hass = hass
    const entityId = this.config.entity;
    const state = hass.states[entityId];
    const attrs = state.attributes;
    if (state) {
      this.update({
        title: attrs['friendly_name'] || '空气净化器',
        mode: attrs['mode'] || '',
        aqi: attrs['aqi'] || 0,
        filter_life_remaining: attrs['filter_life_remaining'] || 0,
        temperature: attrs['temperature'] || 0,
        humidity: attrs['humidity'] || 0,
        state: state.state,
        filter_hours_used: attrs['filter_hours_used'] || 0,
        purify_volume: attrs['purify_volume'] || 0,
        led: attrs['led'] ? '开启' : '关闭'
      })
    }
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('你需要定义一个实体\n entity: 实体');
    }
    this.config = config;
  }

  getCardSize() {
    return 2;
  }
}

customElements.define('air-filter', AirFilter);