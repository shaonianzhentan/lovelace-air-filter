class HaIcon extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' });
    let link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/@mdi/font@4.7.95/css/materialdesignicons.min.css'
    shadow.appendChild(link)
    this.shadow = shadow
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log('Custom square element attributes changed.');
    let span = document.createElement('span')
    span.className = `mdi ${newValue.replace(':', '-')}`
    this.shadow.appendChild(span)


  }

  static get observedAttributes() { return ['icon']; }
}

customElements.define('ha-icon', HaIcon);