class AirFilter extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' });
    const div = document.createElement('div');
    div.className = 'ha-air-filter-panel'
    div.innerHTML = `
            <div>
              空气净化器
            </div>
            <div class="body">
                <div class="content t1">
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
            <div class="footer">
              
            </div>
            <div>
              
            </div>
        `
    shadow.appendChild(div)

    const style = document.createElement('style')
    style.textContent = `           
           .content-bg{
              height: 300px;
              width: 300px;
              border-radius: 50%;}
           .content-bg div{position:absolute;height: 310px;width: 290px;background: rgba(0,0,0,.1);border-radius: 50%;}
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

           .content.t1{background:#01b6a5;}
           .content{width:290px;height:290px;position:absolute;border-radius: 50%;margin-top:10px;z-index:1;
              text-align: center;
            }
            .content p{padding:0;margin:0;}
            .content p:nth-child(1){padding-top: 70px;font-size:12px;color:#ddd;}
            .content p:nth-child(2){font-size:80px;color:white;}
            .content p:nth-child(3){color:#eee;}
        `
    shadow.appendChild(style);

    this.shadow = shadow
  }

  set hass(hass) {

    const entityId = this.config.entity;
    const style = this.config.style || '';
    const state = hass.states[entityId];
    const attrs = state.attributes;

    if (!this.card) {

      //let root = this.attachShadow({ mode: 'closed' });

      const card = document.createElement('ha-card');
      card.className = 'air-filter'

      // 创建背景效果
      if (!style) {
        const container = getBg()
        card.appendChild(container)
      }

      // 创建UI
      const ui = getUI()
      card.appendChild(ui)
      // 定义事件
      ui.querySelector('.var-state').onclick = () => {
        log('开关')
        hass.callService('fan', 'toggle', {
          entity_id: entityId
        });
      }
      ui.querySelector('.var-auto').onclick = () => {
        log('自动')
        hass.callService('fan', 'set_speed', {
          entity_id: entityId,
          speed: 'Auto'
        });
      }
      ui.querySelector('.var-silent').onclick = () => {
        log('睡眠')
        hass.callService('fan', 'set_speed', {
          entity_id: entityId,
          speed: 'Silent'
        });
      }
      ui.querySelector('.var-favorite').onclick = () => {
        log('最爱')
        hass.callService('fan', 'set_speed', {
          entity_id: entityId,
          speed: 'Favorite'
        });
      }
      ui.querySelector('.var-title').onclick = () => {
        log('最爱')
        card.querySelector('.dialog').style.display = 'block'
      }

      // 创建更多信息
      const dialog = getDialog()
      card.appendChild(dialog)

      dialog.querySelector('.dialog-close').onclick = () => {
        dialog.style.display = 'none'
      }

      // led点击
      dialog.querySelector('.var-led').onclick = () => {
        let ledState = attrs['led']
        // 如果当前开就关
        hass.callService('fan', ledState ? 'xiaomi_miio_set_led_off' : 'xiaomi_miio_set_led_on', {
          entity_id: entityId
        });
        // 提示操作
        hass.callService('persistent_notification', 'create', {
          message: `${ledState ? '关闭' : '开启'}了${attrs['friendly_name']}的LED灯`,
          title: `【${new Date().toLocaleTimeString()}】执行LED操作`
        });
      }

      // 添加样式
      let styleElement = document.createElement('style');
      styleElement.innerHTML = `.air-filter{background:black;position: relative;height: 463px;overflow: hidden; width: 100%;}
      ${style}`;
      card.appendChild(styleElement);

      this.card = card;

      this.appendChild(card);
    }

    //设置值
    setUI(this.card.querySelector('.air-filter-panel'), {
      title: attrs['friendly_name'] || '空气净化器',
      mode: attrs['mode'],
      aqi: attrs['aqi'],
      filter_life_remaining: attrs['filter_life_remaining'],
      temperature: attrs['temperature'],
      humidity: attrs['humidity'],
      state: state.state
    })
    //设置更多信息值
    setDialog(this.card.querySelector('.dialog'), {
      filter_hours_used: attrs['filter_hours_used'] || 0,
      purify_volume: attrs['purify_volume'] || 0,
      led: attrs['led'] ? '开启' : '关闭'
    })
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('你需要定义一个实体');
    }
    this.config = config;
  }

  // The height of your card. Home Assistant uses this to automatically
  // distribute all cards over the available columns.
  getCardSize() {
    return 3;
  }
}

customElements.define('air-filter', AirFilter);