import styles from './color-disc.scss';

export default class ColorDisc extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return [
      'size',
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      switch (name) {
        case 'size':
          this.__render();
          break;
      }
    }
  }

  connectedCallback() {
    this.__render();
    this.__observeStage();
  }

  __render() {
    const { locals } = styles;
    this.setAttribute('color', 'hsl(0, 100%, 50%)');
    this.padding = 20;
    this._size = (parseInt(this.getAttribute('size'), 10) || 390);
    this.shadowRoot.innerHTML = `
      <style>
        ${styles.toString().replace(/\n|\t/g, '')}
      </style>
      <div
        class="${locals.colorDisc}"
        style="width: ${this._size}px; height: ${this._size}px;"
      >
        <color-stage
          size="${this._size}"
          padding="${this.padding}"
        ></color-stage>
      </div>
      `;
  }

  __observeStage() {
    const target = this.shadowRoot.querySelector('color-stage');
    const config = { attributes: true };
    const callback = (mutationsList) => {
      mutationsList.forEach((mutation) => {
        const h = mutation.target.getAttribute('h');
        const s = mutation.target.getAttribute('s');
        const l = mutation.target.getAttribute('l');
        this.setAttribute('color', `hsl(${h}, ${s}%, ${l}%)`);
      });
    };
    const mutationObserver = new MutationObserver(callback);
    mutationObserver.observe(target, config);
  }
}
