(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();var V,Pe;class dt extends Error{}dt.prototype.name="InvalidTokenError";function Gs(o){return decodeURIComponent(atob(o).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Zs(o){let t=o.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Gs(t)}catch{return atob(t)}}function is(o,t){if(typeof o!="string")throw new dt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=o.split(".")[e];if(typeof s!="string")throw new dt(`Invalid token specified: missing part #${e+1}`);let i;try{i=Zs(s)}catch(r){throw new dt(`Invalid token specified: invalid base64 for part #${e+1} (${r.message})`)}try{return JSON.parse(i)}catch(r){throw new dt(`Invalid token specified: invalid json for part #${e+1} (${r.message})`)}}const Xs="mu:context",te=`${Xs}:change`;class ti{constructor(t,e){this._proxy=ei(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ne extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new ti(t,this),this.style.display="contents"}attach(t){return this.addEventListener(te,t),t}detach(t){this.removeEventListener(te,t)}}function ei(o,t){return new Proxy(o,{get:(s,i,r)=>{if(i==="then")return;const n=Reflect.get(s,i,r);return console.log(`Context['${i}'] => `,n),n},set:(s,i,r,n)=>{const l=o[i];console.log(`Context['${i.toString()}'] <= `,r);const a=Reflect.set(s,i,r,n);if(a){let u=new CustomEvent(te,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(u,{property:i,oldValue:l,value:r}),t.dispatchEvent(u)}else console.log(`Context['${i}] was not set to ${r}`);return a}})}function si(o,t){const e=os(t,o);return new Promise((s,i)=>{if(e){const r=e.localName;customElements.whenDefined(r).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function os(o,t){const e=`[provides="${o}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return os(o,i.host)}class ii extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function rs(o="mu:message"){return(t,...e)=>t.dispatchEvent(new ii(e,o))}class ae{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function oi(o){return t=>({...t,...o})}const ee="mu:auth:jwt",ns=class as extends ae{constructor(t,e){super((s,i)=>this.update(s,i),t,as.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(ni(s)),Qt(i);case"auth/signout":return e(ai()),Qt(this._redirectForLogin);case"auth/redirect":return Qt(this._redirectForLogin,{next:window.location.href});default:const r=t[0];throw new Error(`Unhandled Auth message "${r}"`)}}};ns.EVENT_TYPE="auth:message";let ls=ns;const cs=rs(ls.EVENT_TYPE);function Qt(o,t={}){if(!o)return;const e=window.location.href,s=new URL(o,e);return Object.entries(t).forEach(([i,r])=>s.searchParams.set(i,r)),()=>{console.log("Redirecting to ",o),window.location.assign(s)}}class ri extends ne{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=G.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new ls(this.context,this.redirect).attach(this)}}class K{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ee),t}}class G extends K{constructor(t){super();const e=is(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new G(t);return localStorage.setItem(ee,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ee);return t?G.authenticate(t):new K}}function ni(o){return oi({user:G.authenticate(o),token:o})}function ai(){return o=>{const t=o.user;return{user:t&&t.authenticated?K.deauthenticate(t):t,token:""}}}function li(o){return o.authenticated?{Authorization:`Bearer ${o.token||"NO_TOKEN"}`}:{}}function ci(o){return o.authenticated?is(o.token||""):{}}const jt=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:G,Provider:ri,User:K,dispatch:cs,headers:li,payload:ci},Symbol.toStringTag,{value:"Module"}));function Ct(o,t,e){const s=o.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${o.type}:`,i),s.dispatchEvent(i),o.stopPropagation()}function se(o,t="*"){return o.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const hs=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:se,relay:Ct},Symbol.toStringTag,{value:"Module"}));function ps(o,...t){const e=o.map((i,r)=>r?[t[r-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const hi=new DOMParser;function z(o,...t){const e=t.map(l),s=o.map((a,u)=>{if(u===0)return[a];const f=e[u-1];return f instanceof Node?[`<ins id="mu-html-${u-1}"></ins>`,a]:[f,a]}).flat().join(""),i=hi.parseFromString(s,"text/html"),r=i.head.childElementCount?i.head.children:i.body.children,n=new DocumentFragment;return n.replaceChildren(...r),e.forEach((a,u)=>{if(a instanceof Node){const f=n.querySelector(`ins#mu-html-${u}`);if(f){const p=f.parentNode;p==null||p.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${u}`)}}),n;function l(a,u){if(a===null)return"";switch(typeof a){case"string":return Ce(a);case"bigint":case"boolean":case"number":case"symbol":return Ce(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,p=a.map(l);return f.replaceChildren(...p),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Ce(o){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ht(o,t={mode:"open"}){const e=o.attachShadow(t),s={template:i,styles:r};return s;function i(n){const l=n.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function r(...n){e.adoptedStyleSheets=n}}V=class extends HTMLElement{constructor(){super(),this._state={},Ht(this).template(V.template).styles(V.styles),this.addEventListener("change",o=>{const t=o.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",o=>{o.preventDefault(),Ct(o,"mu-form:submit",this._state)})}set init(o){this._state=o||{},pi(this._state,this)}get form(){var o;return(o=this.shadowRoot)==null?void 0:o.querySelector("form")}},V.template=z`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,V.styles=ps`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `;function pi(o,t){const e=Object.entries(o);for(const[s,i]of e){const r=t.querySelector(`[name="${s}"]`);if(r){const n=r;switch(n.type){case"checkbox":const l=n;l.checked=!!i;break;case"date":n.value=i.toISOString().substr(0,10);break;default:n.value=i;break}}}return o}const ds=class us extends ae{constructor(t){super((e,s)=>this.update(e,s),t,us.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(ui(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(fi(s,i));break}}}};ds.EVENT_TYPE="history:message";let le=ds;class Te extends ne{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=di(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ce(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new le(this.context).attach(this)}}function di(o){const t=o.currentTarget,e=s=>s.tagName=="A"&&s.href;if(o.button===0)if(o.composed){const i=o.composedPath().find(e);return i||void 0}else{for(let s=o.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function ui(o,t={}){return history.pushState(t,"",o),()=>({location:document.location,state:history.state})}function fi(o,t={}){return history.replaceState(t,"",o),()=>({location:document.location,state:history.state})}const ce=rs(le.EVENT_TYPE),mi=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Te,Provider:Te,Service:le,dispatch:ce},Symbol.toStringTag,{value:"Module"}));class Z{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Re(this._provider,t);this._effects.push(i),e(i)}else si(this._target,this._contextLabel).then(i=>{const r=new Re(i,t);this._provider=i,this._effects.push(r),i.attach(n=>this._handleChange(n)),e(r)}).catch(i=>console.log(`Observer ${this._contextLabel}: ${i}`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Re{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const fs=class ms extends HTMLElement{constructor(){super(),this._state={},this._user=new K,this._authObserver=new Z(this,"blazing:auth"),Ht(this).template(ms.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;gi(i,this._state,e,this.authorization).then(r=>lt(r,this)).then(r=>{const n=`mu-rest-form:${s}`,l=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,[s]:r,url:i}});this.dispatchEvent(l)}).catch(r=>{const n="mu-rest-form:error",l=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,error:r,url:i,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},lt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Oe(this.src,this.authorization).then(e=>{this._state=e,lt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Oe(this.src,this.authorization).then(i=>{this._state=i,lt(i,this)});break;case"new":s&&(this._state={},lt({},this));break}}};fs.observedAttributes=["src","new","action"];fs.template=z`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function Oe(o,t){return fetch(o,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${o}:`,e))}function lt(o,t){const e=Object.entries(o);for(const[s,i]of e){const r=t.querySelector(`[name="${s}"]`);if(r){const n=r;switch(n.type){case"checkbox":const l=n;l.checked=!!i;break;default:n.value=i;break}}}return o}function gi(o,t,e="PUT",s={}){return fetch(o,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const gs=class ys extends ae{constructor(t,e){super(e,t,ys.EVENT_TYPE,!1)}};gs.EVENT_TYPE="mu:message";let vs=gs;class yi extends ne{constructor(t,e,s){super(e),this._user=new K,this._updateFn=t,this._authObserver=new Z(this,s)}connectedCallback(){const t=new vs(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const bs=Object.freeze(Object.defineProperty({__proto__:null,Provider:yi,Service:vs},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kt=globalThis,he=kt.ShadowRoot&&(kt.ShadyCSS===void 0||kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,pe=Symbol(),Ne=new WeakMap;let _s=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==pe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(he&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ne.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ne.set(e,t))}return t}toString(){return this.cssText}};const vi=o=>new _s(typeof o=="string"?o:o+"",void 0,pe),bi=(o,...t)=>{const e=o.length===1?o[0]:t.reduce((s,i,r)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[r+1],o[0]);return new _s(e,o,pe)},_i=(o,t)=>{if(he)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=kt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,o.appendChild(s)}},Me=he?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return vi(e)})(o):o;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:$i,defineProperty:wi,getOwnPropertyDescriptor:xi,getOwnPropertyNames:Ai,getOwnPropertySymbols:Si,getPrototypeOf:Ei}=Object,X=globalThis,Ue=X.trustedTypes,ki=Ue?Ue.emptyScript:"",Le=X.reactiveElementPolyfillSupport,ut=(o,t)=>o,Tt={toAttribute(o,t){switch(t){case Boolean:o=o?ki:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},de=(o,t)=>!$i(o,t),Ie={attribute:!0,type:String,converter:Tt,reflect:!1,hasChanged:de};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),X.litPropertyMetadata??(X.litPropertyMetadata=new WeakMap);let Y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ie){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&wi(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=xi(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get(){return i==null?void 0:i.call(this)},set(n){const l=i==null?void 0:i.call(this);r.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ie}static _$Ei(){if(this.hasOwnProperty(ut("elementProperties")))return;const t=Ei(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ut("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ut("properties"))){const e=this.properties,s=[...Ai(e),...Si(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Me(i))}else t!==void 0&&e.push(Me(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _i(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(r!==void 0&&i.reflect===!0){const n=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:Tt).toAttribute(e,i.type);this._$Em=t,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,r=i._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const n=i.getPropertyOptions(r),l=typeof n.converter=="function"?{fromAttribute:n.converter}:((s=n.converter)==null?void 0:s.fromAttribute)!==void 0?n.converter:Tt;this._$Em=r,this[r]=l.fromAttribute(e,n.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??de)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,n]of this._$Ep)this[r]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[r,n]of i)n.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],n)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var r;return(r=i.hostUpdate)==null?void 0:r.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},Y[ut("elementProperties")]=new Map,Y[ut("finalized")]=new Map,Le==null||Le({ReactiveElement:Y}),(X.reactiveElementVersions??(X.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rt=globalThis,Ot=Rt.trustedTypes,je=Ot?Ot.createPolicy("lit-html",{createHTML:o=>o}):void 0,$s="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,ws="?"+T,Pi=`<${ws}>`,D=document,gt=()=>D.createComment(""),yt=o=>o===null||typeof o!="object"&&typeof o!="function",ue=Array.isArray,Ci=o=>ue(o)||typeof(o==null?void 0:o[Symbol.iterator])=="function",Jt=`[ 	
\f\r]`,ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,He=/-->/g,ze=/>/g,L=RegExp(`>|${Jt}(?:([^\\s"'>=/]+)(${Jt}*=${Jt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),De=/'/g,Fe=/"/g,xs=/^(?:script|style|textarea|title)$/i,Ti=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),ht=Ti(1),tt=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),qe=new WeakMap,j=D.createTreeWalker(D,129);function As(o,t){if(!ue(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return je!==void 0?je.createHTML(t):t}const Ri=(o,t)=>{const e=o.length-1,s=[];let i,r=t===2?"<svg>":t===3?"<math>":"",n=ct;for(let l=0;l<e;l++){const a=o[l];let u,f,p=-1,c=0;for(;c<a.length&&(n.lastIndex=c,f=n.exec(a),f!==null);)c=n.lastIndex,n===ct?f[1]==="!--"?n=He:f[1]!==void 0?n=ze:f[2]!==void 0?(xs.test(f[2])&&(i=RegExp("</"+f[2],"g")),n=L):f[3]!==void 0&&(n=L):n===L?f[0]===">"?(n=i??ct,p=-1):f[1]===void 0?p=-2:(p=n.lastIndex-f[2].length,u=f[1],n=f[3]===void 0?L:f[3]==='"'?Fe:De):n===Fe||n===De?n=L:n===He||n===ze?n=ct:(n=L,i=void 0);const h=n===L&&o[l+1].startsWith("/>")?" ":"";r+=n===ct?a+Pi:p>=0?(s.push(u),a.slice(0,p)+$s+a.slice(p)+T+h):a+T+(p===-2?l:h)}return[As(o,r+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let ie=class Ss{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,n=0;const l=t.length-1,a=this.parts,[u,f]=Ri(t,e);if(this.el=Ss.createElement(u,s),j.currentNode=this.el.content,e===2||e===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=j.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const p of i.getAttributeNames())if(p.endsWith($s)){const c=f[n++],h=i.getAttribute(p).split(T),d=/([.?@])?(.*)/.exec(c);a.push({type:1,index:r,name:d[2],strings:h,ctor:d[1]==="."?Ni:d[1]==="?"?Mi:d[1]==="@"?Ui:zt}),i.removeAttribute(p)}else p.startsWith(T)&&(a.push({type:6,index:r}),i.removeAttribute(p));if(xs.test(i.tagName)){const p=i.textContent.split(T),c=p.length-1;if(c>0){i.textContent=Ot?Ot.emptyScript:"";for(let h=0;h<c;h++)i.append(p[h],gt()),j.nextNode(),a.push({type:2,index:++r});i.append(p[c],gt())}}}else if(i.nodeType===8)if(i.data===ws)a.push({type:2,index:r});else{let p=-1;for(;(p=i.data.indexOf(T,p+1))!==-1;)a.push({type:7,index:r}),p+=T.length-1}r++}}static createElement(t,e){const s=D.createElement("template");return s.innerHTML=t,s}};function et(o,t,e=o,s){var i,r;if(t===tt)return t;let n=s!==void 0?(i=e.o)==null?void 0:i[s]:e.l;const l=yt(t)?void 0:t._$litDirective$;return(n==null?void 0:n.constructor)!==l&&((r=n==null?void 0:n._$AO)==null||r.call(n,!1),l===void 0?n=void 0:(n=new l(o),n._$AT(o,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=n:e.l=n),n!==void 0&&(t=et(o,n._$AS(o,t.values),n,s)),t}class Oi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??D).importNode(e,!0);j.currentNode=i;let r=j.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let u;a.type===2?u=new wt(r,r.nextSibling,this,t):a.type===1?u=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(u=new Li(r,this,t)),this._$AV.push(u),a=s[++l]}n!==(a==null?void 0:a.index)&&(r=j.nextNode(),n++)}return j.currentNode=D,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class wt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=et(this,t,e),yt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==tt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ci(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&yt(this._$AH)?this._$AA.nextSibling.data=t:this.T(D.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,r=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=ie.createElement(As(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===r)this._$AH.p(s);else{const n=new Oi(r,this),l=n.u(this.options);n.p(s),this.T(l),this._$AH=n}}_$AC(t){let e=qe.get(t.strings);return e===void 0&&qe.set(t.strings,e=new ie(t)),e}k(t){ue(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new wt(this.O(gt()),this.O(gt()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class zt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){const r=this.strings;let n=!1;if(r===void 0)t=et(this,t,e,0),n=!yt(t)||t!==this._$AH&&t!==tt,n&&(this._$AH=t);else{const l=t;let a,u;for(t=r[0],a=0;a<r.length-1;a++)u=et(this,l[s+a],e,a),u===tt&&(u=this._$AH[a]),n||(n=!yt(u)||u!==this._$AH[a]),u===$?t=$:t!==$&&(t+=(u??"")+r[a+1]),this._$AH[a]=u}n&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ni extends zt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Mi extends zt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Ui extends zt{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=et(this,t,e,0)??$)===tt)return;const s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Li{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){et(this,t)}}const Be=Rt.litHtmlPolyfillSupport;Be==null||Be(ie,wt),(Rt.litHtmlVersions??(Rt.litHtmlVersions=[])).push("3.2.0");const Ii=(o,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const r=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new wt(t.insertBefore(gt(),r),r,void 0,e??{})}return i._$AI(o),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let J=class extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Ii(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return tt}};J._$litElement$=!0,J.finalized=!0,(Pe=globalThis.litElementHydrateSupport)==null||Pe.call(globalThis,{LitElement:J});const Ve=globalThis.litElementPolyfillSupport;Ve==null||Ve({LitElement:J});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ji={attribute:!0,type:String,converter:Tt,reflect:!1,hasChanged:de},Hi=(o=ji,t,e)=>{const{kind:s,metadata:i}=e;let r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),r.set(e.name,o),s==="accessor"){const{name:n}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,o)},init(l){return l!==void 0&&this.P(n,void 0,o),l}}}if(s==="setter"){const{name:n}=e;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,o)}}throw Error("Unsupported decorator location: "+s)};function Es(o){return(t,e)=>typeof e=="object"?Hi(o,t,e):((s,i,r)=>{const n=i.hasOwnProperty(r);return i.constructor.createProperty(r,n?{...s,wrapped:!0}:s),n?Object.getOwnPropertyDescriptor(i,r):void 0})(o,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ks(o){return Es({...o,state:!0,attribute:!1})}function zi(o){return o&&o.__esModule&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o}function Di(o){throw new Error('Could not dynamically require "'+o+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ps={};(function(o){var t=function(){var e=function(p,c,h,d){for(h=h||{},d=p.length;d--;h[p[d]]=c);return h},s=[1,9],i=[1,10],r=[1,11],n=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,d,m,g,v,qt){var S=v.length-1;switch(g){case 1:return new m.Root({},[v[S-1]]);case 2:return new m.Root({},[new m.Literal({value:""})]);case 3:this.$=new m.Concat({},[v[S-1],v[S]]);break;case 4:case 5:this.$=v[S];break;case 6:this.$=new m.Literal({value:v[S]});break;case 7:this.$=new m.Splat({name:v[S]});break;case 8:this.$=new m.Param({name:v[S]});break;case 9:this.$=new m.Optional({},[v[S-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:r,15:n},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:r,15:n},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:r,15:n},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:r,15:n},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let d=function(m,g){this.message=m,this.hash=g};throw d.prototype=Error,new d(c,h)}},parse:function(c){var h=this,d=[0],m=[null],g=[],v=this.table,qt="",S=0,Se=0,Ys=2,Ee=1,Qs=g.slice.call(arguments,1),_=Object.create(this.lexer),M={yy:{}};for(var Bt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Bt)&&(M.yy[Bt]=this.yy[Bt]);_.setInput(c,M.yy),M.yy.lexer=_,M.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var Vt=_.yylloc;g.push(Vt);var Js=_.options&&_.options.ranges;typeof M.yy.parseError=="function"?this.parseError=M.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Ks=function(){var B;return B=_.lex()||Ee,typeof B!="number"&&(B=h.symbols_[B]||B),B},A,U,k,Wt,q={},St,P,ke,Et;;){if(U=d[d.length-1],this.defaultActions[U]?k=this.defaultActions[U]:((A===null||typeof A>"u")&&(A=Ks()),k=v[U]&&v[U][A]),typeof k>"u"||!k.length||!k[0]){var Yt="";Et=[];for(St in v[U])this.terminals_[St]&&St>Ys&&Et.push("'"+this.terminals_[St]+"'");_.showPosition?Yt="Parse error on line "+(S+1)+`:
`+_.showPosition()+`
Expecting `+Et.join(", ")+", got '"+(this.terminals_[A]||A)+"'":Yt="Parse error on line "+(S+1)+": Unexpected "+(A==Ee?"end of input":"'"+(this.terminals_[A]||A)+"'"),this.parseError(Yt,{text:_.match,token:this.terminals_[A]||A,line:_.yylineno,loc:Vt,expected:Et})}if(k[0]instanceof Array&&k.length>1)throw new Error("Parse Error: multiple actions possible at state: "+U+", token: "+A);switch(k[0]){case 1:d.push(A),m.push(_.yytext),g.push(_.yylloc),d.push(k[1]),A=null,Se=_.yyleng,qt=_.yytext,S=_.yylineno,Vt=_.yylloc;break;case 2:if(P=this.productions_[k[1]][1],q.$=m[m.length-P],q._$={first_line:g[g.length-(P||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(P||1)].first_column,last_column:g[g.length-1].last_column},Js&&(q._$.range=[g[g.length-(P||1)].range[0],g[g.length-1].range[1]]),Wt=this.performAction.apply(q,[qt,Se,S,M.yy,k[1],m,g].concat(Qs)),typeof Wt<"u")return Wt;P&&(d=d.slice(0,-1*P*2),m=m.slice(0,-1*P),g=g.slice(0,-1*P)),d.push(this.productions_[k[1]][0]),m.push(q.$),g.push(q._$),ke=v[d[d.length-2]][d[d.length-1]],d.push(ke);break;case 3:return!0}}return!0}},u=function(){var p={EOF:1,parseError:function(h,d){if(this.yy.parser)this.yy.parser.parseError(h,d);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,d=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var m=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),d.length-1&&(this.yylineno-=d.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:d?(d.length===m.length?this.yylloc.first_column:0)+m[m.length-d.length].length-d[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var d,m,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),m=c[0].match(/(?:\r\n?|\n).*/g),m&&(this.yylineno+=m.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:m?m[m.length-1].length-m[m.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],d=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),d)return d;if(this._backtrack){for(var v in g)this[v]=g[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,d,m;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),v=0;v<g.length;v++)if(d=this._input.match(this.rules[g[v]]),d&&(!h||d[0].length>h[0].length)){if(h=d,m=v,this.options.backtrack_lexer){if(c=this.test_match(d,g[v]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,g[m]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,d,m,g){switch(m){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return p}();a.lexer=u;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Di<"u"&&(o.parser=t,o.Parser=t.Parser,o.parse=function(){return t.parse.apply(t,arguments)})})(Ps);function W(o){return function(t,e){return{displayName:o,props:t,children:e||[]}}}var Cs={Root:W("Root"),Concat:W("Concat"),Literal:W("Literal"),Splat:W("Splat"),Param:W("Param"),Optional:W("Optional")},Ts=Ps.parser;Ts.yy=Cs;var Fi=Ts,qi=Object.keys(Cs);function Bi(o){return qi.forEach(function(t){if(typeof o[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:o}}var Rs=Bi,Vi=Rs,Wi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Os(o){this.captures=o.captures,this.re=o.re}Os.prototype.match=function(o){var t=this.re.exec(o),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var Yi=Vi({Concat:function(o){return o.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(o){return{re:o.props.value.replace(Wi,"\\$&"),captures:[]}},Splat:function(o){return{re:"([^?]*?)",captures:[o.props.name]}},Param:function(o){return{re:"([^\\/\\?]+)",captures:[o.props.name]}},Optional:function(o){var t=this.visit(o.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(o){var t=this.visit(o.children[0]);return new Os({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Qi=Yi,Ji=Rs,Ki=Ji({Concat:function(o,t){var e=o.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(o){return decodeURI(o.props.value)},Splat:function(o,t){return t[o.props.name]?t[o.props.name]:!1},Param:function(o,t){return t[o.props.name]?t[o.props.name]:!1},Optional:function(o,t){var e=this.visit(o.children[0],t);return e||""},Root:function(o,t){t=t||{};var e=this.visit(o.children[0],t);return e?encodeURI(e):!1}}),Gi=Ki,Zi=Fi,Xi=Qi,to=Gi;xt.prototype=Object.create(null);xt.prototype.match=function(o){var t=Xi.visit(this.ast),e=t.match(o);return e||!1};xt.prototype.reverse=function(o){return to.visit(this.ast,o)};function xt(o){var t;if(this?t=this:t=Object.create(xt.prototype),typeof o>"u")throw new Error("A route spec is required");return t.spec=o,t.ast=Zi.parse(o),t}var eo=xt,so=eo,io=so;const oo=zi(io);var ro=Object.defineProperty,Ns=(o,t,e,s)=>{for(var i=void 0,r=o.length-1,n;r>=0;r--)(n=o[r])&&(i=n(t,e,i)||i);return i&&ro(t,e,i),i};const Ms=class extends J{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>ht` <h1>Not Found</h1> `,this._cases=t.map(i=>({...i,route:new oo(i.path)})),this._historyObserver=new Z(this,e),this._authObserver=new Z(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ht` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(cs(this,"auth/redirect"),ht` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):ht` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),ht` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),r=s+e;for(const n of this._cases){const l=n.route.match(r);if(l)return{...n,path:s,params:l,query:i}}}redirect(t){ce(this,"history/redirect",{href:t})}};Ms.styles=bi`
    :host,
    main {
      display: contents;
    }
  `;let Nt=Ms;Ns([ks()],Nt.prototype,"_user");Ns([ks()],Nt.prototype,"_match");const no=Object.freeze(Object.defineProperty({__proto__:null,Element:Nt,Switch:Nt},Symbol.toStringTag,{value:"Module"})),ao=class Us extends HTMLElement{constructor(){if(super(),Ht(this).template(Us.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};ao.template=z`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const Ls=class oe extends HTMLElement{constructor(){super(),this._array=[],Ht(this).template(oe.template).styles(oe.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Is("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,r=e.closest("label");if(r){const n=Array.from(this.children).indexOf(r);this._array[n]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{se(t,"button.add")?Ct(t,"input-array:add"):se(t,"button.remove")&&Ct(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],lo(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Ls.template=z`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Ls.styles=ps`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;function lo(o,t){t.replaceChildren(),o.forEach((e,s)=>t.append(Is(e)))}function Is(o,t){const e=o===void 0?z`<input />`:z`<input value="${o}" />`;return z`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function rt(o){return Object.entries(o).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var co=Object.defineProperty,ho=Object.getOwnPropertyDescriptor,po=(o,t,e,s)=>{for(var i=ho(t,e),r=o.length-1,n;r>=0;r--)(n=o[r])&&(i=n(t,e,i)||i);return i&&co(t,e,i),i};class Dt extends J{constructor(t){super(),this._pending=[],this._observer=new Z(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}po([Es()],Dt.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pt=globalThis,fe=Pt.ShadowRoot&&(Pt.ShadyCSS===void 0||Pt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,me=Symbol(),We=new WeakMap;let js=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==me)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(fe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=We.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&We.set(e,t))}return t}toString(){return this.cssText}};const uo=o=>new js(typeof o=="string"?o:o+"",void 0,me),nt=(o,...t)=>{const e=o.length===1?o[0]:t.reduce((s,i,r)=>s+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+o[r+1],o[0]);return new js(e,o,me)},fo=(o,t)=>{if(fe)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=Pt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,o.appendChild(s)}},Ye=fe?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return uo(e)})(o):o;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:mo,defineProperty:go,getOwnPropertyDescriptor:yo,getOwnPropertyNames:vo,getOwnPropertySymbols:bo,getPrototypeOf:_o}=Object,O=globalThis,Qe=O.trustedTypes,$o=Qe?Qe.emptyScript:"",Kt=O.reactiveElementPolyfillSupport,ft=(o,t)=>o,Mt={toAttribute(o,t){switch(t){case Boolean:o=o?$o:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let e=o;switch(t){case Boolean:e=o!==null;break;case Number:e=o===null?null:Number(o);break;case Object:case Array:try{e=JSON.parse(o)}catch{e=null}}return e}},ge=(o,t)=>!mo(o,t),Je={attribute:!0,type:String,converter:Mt,reflect:!1,hasChanged:ge};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),O.litPropertyMetadata??(O.litPropertyMetadata=new WeakMap);class Q extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Je){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&go(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=yo(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get(){return i==null?void 0:i.call(this)},set(n){const l=i==null?void 0:i.call(this);r.call(this,n),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Je}static _$Ei(){if(this.hasOwnProperty(ft("elementProperties")))return;const t=_o(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ft("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ft("properties"))){const e=this.properties,s=[...vo(e),...bo(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Ye(i))}else t!==void 0&&e.push(Ye(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fo(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var r;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const n=(((r=s.converter)==null?void 0:r.toAttribute)!==void 0?s.converter:Mt).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){var r;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const n=s.getPropertyOptions(i),l=typeof n.converter=="function"?{fromAttribute:n.converter}:((r=n.converter)==null?void 0:r.fromAttribute)!==void 0?n.converter:Mt;this._$Em=i,this[i]=l.fromAttribute(e,n.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ge)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,n]of this._$Ep)this[r]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[r,n]of i)n.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],n)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var r;return(r=i.hostUpdate)==null?void 0:r.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}Q.elementStyles=[],Q.shadowRootOptions={mode:"open"},Q[ft("elementProperties")]=new Map,Q[ft("finalized")]=new Map,Kt==null||Kt({ReactiveElement:Q}),(O.reactiveElementVersions??(O.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const mt=globalThis,Ut=mt.trustedTypes,Ke=Ut?Ut.createPolicy("lit-html",{createHTML:o=>o}):void 0,Hs="$lit$",R=`lit$${Math.random().toFixed(9).slice(2)}$`,zs="?"+R,wo=`<${zs}>`,F=document,vt=()=>F.createComment(""),bt=o=>o===null||typeof o!="object"&&typeof o!="function",ye=Array.isArray,xo=o=>ye(o)||typeof(o==null?void 0:o[Symbol.iterator])=="function",Gt=`[ 	
\f\r]`,pt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ge=/-->/g,Ze=/>/g,I=RegExp(`>|${Gt}(?:([^\\s"'>=/]+)(${Gt}*=${Gt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Xe=/'/g,ts=/"/g,Ds=/^(?:script|style|textarea|title)$/i,Ao=o=>(t,...e)=>({_$litType$:o,strings:t,values:e}),y=Ao(1),st=Symbol.for("lit-noChange"),w=Symbol.for("lit-nothing"),es=new WeakMap,H=F.createTreeWalker(F,129);function Fs(o,t){if(!ye(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ke!==void 0?Ke.createHTML(t):t}const So=(o,t)=>{const e=o.length-1,s=[];let i,r=t===2?"<svg>":t===3?"<math>":"",n=pt;for(let l=0;l<e;l++){const a=o[l];let u,f,p=-1,c=0;for(;c<a.length&&(n.lastIndex=c,f=n.exec(a),f!==null);)c=n.lastIndex,n===pt?f[1]==="!--"?n=Ge:f[1]!==void 0?n=Ze:f[2]!==void 0?(Ds.test(f[2])&&(i=RegExp("</"+f[2],"g")),n=I):f[3]!==void 0&&(n=I):n===I?f[0]===">"?(n=i??pt,p=-1):f[1]===void 0?p=-2:(p=n.lastIndex-f[2].length,u=f[1],n=f[3]===void 0?I:f[3]==='"'?ts:Xe):n===ts||n===Xe?n=I:n===Ge||n===Ze?n=pt:(n=I,i=void 0);const h=n===I&&o[l+1].startsWith("/>")?" ":"";r+=n===pt?a+wo:p>=0?(s.push(u),a.slice(0,p)+Hs+a.slice(p)+R+h):a+R+(p===-2?l:h)}return[Fs(o,r+(o[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class _t{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,n=0;const l=t.length-1,a=this.parts,[u,f]=So(t,e);if(this.el=_t.createElement(u,s),H.currentNode=this.el.content,e===2||e===3){const p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(i=H.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const p of i.getAttributeNames())if(p.endsWith(Hs)){const c=f[n++],h=i.getAttribute(p).split(R),d=/([.?@])?(.*)/.exec(c);a.push({type:1,index:r,name:d[2],strings:h,ctor:d[1]==="."?ko:d[1]==="?"?Po:d[1]==="@"?Co:Ft}),i.removeAttribute(p)}else p.startsWith(R)&&(a.push({type:6,index:r}),i.removeAttribute(p));if(Ds.test(i.tagName)){const p=i.textContent.split(R),c=p.length-1;if(c>0){i.textContent=Ut?Ut.emptyScript:"";for(let h=0;h<c;h++)i.append(p[h],vt()),H.nextNode(),a.push({type:2,index:++r});i.append(p[c],vt())}}}else if(i.nodeType===8)if(i.data===zs)a.push({type:2,index:r});else{let p=-1;for(;(p=i.data.indexOf(R,p+1))!==-1;)a.push({type:7,index:r}),p+=R.length-1}r++}}static createElement(t,e){const s=F.createElement("template");return s.innerHTML=t,s}}function it(o,t,e=o,s){var n,l;if(t===st)return t;let i=s!==void 0?(n=e._$Co)==null?void 0:n[s]:e._$Cl;const r=bt(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==r&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),r===void 0?i=void 0:(i=new r(o),i._$AT(o,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=it(o,i._$AS(o,t.values),i,s)),t}class Eo{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??F).importNode(e,!0);H.currentNode=i;let r=H.nextNode(),n=0,l=0,a=s[0];for(;a!==void 0;){if(n===a.index){let u;a.type===2?u=new At(r,r.nextSibling,this,t):a.type===1?u=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(u=new To(r,this,t)),this._$AV.push(u),a=s[++l]}n!==(a==null?void 0:a.index)&&(r=H.nextNode(),n++)}return H.currentNode=F,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class At{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=w,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=it(this,t,e),bt(t)?t===w||t==null||t===""?(this._$AH!==w&&this._$AR(),this._$AH=w):t!==this._$AH&&t!==st&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):xo(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==w&&bt(this._$AH)?this._$AA.nextSibling.data=t:this.T(F.createTextNode(t)),this._$AH=t}$(t){var r;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=_t.createElement(Fs(s.h,s.h[0]),this.options)),s);if(((r=this._$AH)==null?void 0:r._$AD)===i)this._$AH.p(e);else{const n=new Eo(i,this),l=n.u(this.options);n.p(e),this.T(l),this._$AH=n}}_$AC(t){let e=es.get(t.strings);return e===void 0&&es.set(t.strings,e=new _t(t)),e}k(t){ye(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new At(this.O(vt()),this.O(vt()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Ft{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=w,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=w}_$AI(t,e=this,s,i){const r=this.strings;let n=!1;if(r===void 0)t=it(this,t,e,0),n=!bt(t)||t!==this._$AH&&t!==st,n&&(this._$AH=t);else{const l=t;let a,u;for(t=r[0],a=0;a<r.length-1;a++)u=it(this,l[s+a],e,a),u===st&&(u=this._$AH[a]),n||(n=!bt(u)||u!==this._$AH[a]),u===w?t=w:t!==w&&(t+=(u??"")+r[a+1]),this._$AH[a]=u}n&&!i&&this.j(t)}j(t){t===w?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ko extends Ft{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===w?void 0:t}}class Po extends Ft{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==w)}}class Co extends Ft{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=it(this,t,e,0)??w)===st)return;const s=this._$AH,i=t===w&&s!==w||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==w&&(s===w||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class To{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){it(this,t)}}const Zt=mt.litHtmlPolyfillSupport;Zt==null||Zt(_t,At),(mt.litHtmlVersions??(mt.litHtmlVersions=[])).push("3.2.1");const Ro=(o,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const r=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new At(t.insertBefore(vt(),r),r,void 0,e??{})}return i._$AI(o),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let N=class extends Q{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ro(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return st}};var ss;N._$litElement$=!0,N.finalized=!0,(ss=globalThis.litElementHydrateSupport)==null||ss.call(globalThis,{LitElement:N});const Xt=globalThis.litElementPolyfillSupport;Xt==null||Xt({LitElement:N});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");const ve=class ve extends N{constructor(){super(...arguments),this.username="",this._authObserver=new Z(this,"apptrak:auth")}connectedCallback(){super.connectedCallback(),this.username=localStorage.getItem("username")||""}toggleDarkMode(t){const e=t.target.checked;document.body.classList.toggle("dark-mode",e)}signOut(t){hs.relay(t,"auth:message",["auth/signout"])}render(){return y`
      <header class="header_layout">
        <h1>AppTrak</h1>
        <nav class="nav_links">
          <a href="../app">Dashboard</a>
          <a href="../app/application-search-view">Applications</a>
        </nav>
        <div class="action-container">
          <div class="dark-mode-container">
            <label>
              <input
                type="checkbox"
                autocomplete="off"
                class="dark-mode-switch"
                id="dark-mode-checkbox"
                @change="${this.toggleDarkMode}"
              />
              Dark mode
            </label>
          </div>

          <div class="login">
            ${this.username?y`
                  <span>Hello, ${this.username}</span>
                  <button @click="${this.signOut}">Sign Out</button>
                `:y`<a href="../app/login">Login</a>`}
          </div>
        </div>
      </header>
    `}};ve.styles=nt`
    :host {
      display: contents;
      font-family: Aleo, Poppins, Arial;
    }

    .header_layout {
      background-color: var(--color-background-header);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 20px;
    }

    .header_layout h1 {
      color: var(--color-title);
      margin-right: auto;
      margin-left: 40px;
    }

    .header_layout .nav_links {
      display: flex;
      gap: 80px; /* Space between navigation links */
      margin-right: auto;
      margin-left: 40px;
    }

    .header_layout .nav_links a {
      color: var(--color-title);
      text-decoration: none;
      font-size: var(--font-size-action);
      transition: color 0.3s ease, transform 0.3s ease;
    }

    .header_layout .nav_links a:hover {
      color: var(--color-gray);
    }

    .action-container {
      display: flex;
      align-items: center;
      font-size: var(--font-size-nav);
      gap: 20px; /* Add spacing between dark mode and login */
    }

    .dark-mode-container {
      color: var(--color-title);
      display: flex;
      align-items: center;
      gap: 20px; /* Space between label and checkbox */
    }

    .login a {
      color: var(--color-title);
      text-decoration: none;
      transition: color 0.3s ease, transform 0.3s ease;
      margin-right: 20px;
    }

    .login a:hover {
      color: var(--color-gray);
    }

    .login span {
      font-weight: bold;
      color: var(--color-title);
    }

    .login button {
      background: none;
      border: none;
      color: var(--color-title);
      cursor: pointer;
      font-size: 14px;
      margin-left: 10px;
      transition: color 0.3s ease, transform 0.3s ease;
    }

    .login button:hover {
      color: var(--color-gray);
    }

    #dark-mode-checkbox {
      margin-left: 5px;
    }
  `;let Lt=ve;rt({"all-header":Lt,"mu-auth":jt.Provider});window.relayEvent=hs.relay;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Oo={attribute:!0,type:String,converter:Mt,reflect:!1,hasChanged:ge},No=(o=Oo,t,e)=>{const{kind:s,metadata:i}=e;let r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),r.set(e.name,o),s==="accessor"){const{name:n}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(n,a,o)},init(l){return l!==void 0&&this.P(n,void 0,o),l}}}if(s==="setter"){const{name:n}=e;return function(l){const a=this[n];t.call(this,l),this.requestUpdate(n,a,o)}}throw Error("Unsupported decorator location: "+s)};function qs(o){return(t,e)=>typeof e=="object"?No(o,t,e):((s,i,r)=>{const n=i.hasOwnProperty(r);return i.constructor.createProperty(r,n?{...s,wrapped:!0}:s),n?Object.getOwnPropertyDescriptor(i,r):void 0})(o,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function b(o){return qs({...o,state:!0,attribute:!1})}var Mo=Object.defineProperty,Uo=(o,t,e,s)=>{for(var i=void 0,r=o.length-1,n;r>=0;r--)(n=o[r])&&(i=n(t,e,i)||i);return i&&Mo(t,e,i),i};const be=class be extends Dt{constructor(){super("apptrak:model"),this.searchQuery=""}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["applications/load"])}handleSearch(){const t=this.searchQuery.toLowerCase();this.dispatchMessage(["search/item",{query:t}]),this.searchQuery=""}render(){const{applications:t=[]}=this.model,e={total:t.length,pending:t.filter(i=>i.status==="Pending").length,submitted:t.filter(i=>i.status==="Submitted").length,interview:t.filter(i=>i.status==="Interview Scheduled").length,accepted:t.filter(i=>i.status==="Accepted").length,rejected:t.filter(i=>i.status==="Rejected").length},s=t.slice(0,5);return y`
      <main>
        <!-- Dashboard Section -->
        <section class="dashboard-section">
          <h2 class="section-title">Dashboard</h2>
          <div class="statistics">
            <p>Total Applications: ${e.total}</p>
            <p>Submitted: ${e.submitted}</p>
            <p>Interview Scheduled: ${e.interview}</p>
            <p>Accepted: ${e.accepted}</p>
            <p>Rejected: ${e.rejected}</p>
          </div>
          <h3>Recent Applications</h3>
          <div class="recent-applications">
            ${s.map(i=>y`
                <div class="app-card">
                  <p><strong>${i.title}</strong></p>
                  <p>Company: ${i.company.name}</p>
                  <p>Status: ${i.status}</p>
                </div>
              `)}
          </div>
        </section>
      </main>
    `}};be.styles=nt`
    main {
      padding: 20px;
      font-family: Poppins, "Arial", sans-serif;
      background-color: var(--color-background-page);
    }
    
    /* Dashboard Section Styling */
    .dashboard-section {
      background-color: var(--color-background-section);
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      margin-bottom: 30px;
    }

    .section-title {
      color: var(--color-text-statistics);
      font-size: 1.6em;
      font-weight: 600;
      margin-bottom: 20px;
    }

    .statistics {
      margin-bottom: 20px;
      font-size: 1.1em;
      color: var(--color-text-statistics);
    }

    .statistics p {
      margin: 8px 0;
    }

    h3 {
      color: var(--color-text-statistics);
    }

    /* Recent Applications Styling */
    .recent-applications {
      color: var(--color-text-statistics);
      display: flex;
      justify-content: space-between;
      gap: 15px;
      margin-top: 20px;
    }

    .app-card {
      background: #dd7535;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      width: 18%;
      transition: background 0.3s ease, box-shadow 0.3s ease;
      text-align: center;
      color: 
    }

    .app-card p {
      margin: 5px 0;
      font-size: 1.1em;
      font-color: var(--color-text);
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .search-bar {
        flex-direction: column;
      }

      input {
        width: 100%;
      }

      .recent-applications {
        flex-direction: column;
        align-items: center;
      }

      .app-card {
        width: 80%;
      }
    }
  `;let $t=be;Uo([b()],$t.prototype,"searchQuery");rt({"home-view":$t});const _e=class _e extends Dt{constructor(){super("apptrak:model")}render(){return y`
      <main>
        <section class="about-section">
          <div class="about-content">
            <h1>About AppTrak</h1>
            <p>
              AppTrak is dedicated to tackling food waste and helping families save money. We aggregate grocery prices from a wide range of stores, allowing users to compare and find the best deals. By encouraging stores to sell near-expiry items, we play a crucial role in reducing food waste while making shopping more affordable.
            </p>
          </div>
        </section>
      </main>
    `}};_e.styles=nt`
    header.header_layout {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      background-color: #f8f8f8;
    }
    header h1 {
      margin: 0;
    }
    .nav_links {
      display: flex;
      gap: 15px;
    }
    .nav_links a {
      text-decoration: none;
      color: #333;
      font-weight: bold;
    }
    .login a {
      text-decoration: none;
      color: #333;
    }
    main {
      padding: 20px;
    }
    .about-section {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin: 40px 0;
    }
    .about-content {
      flex: 1;
      padding-right: 20px;
    }
    .about-content h1 {
      font-size: 2.5em;
      margin-bottom: 20px;
    }
    .about-content p {
      font-size: 1.2em;
      line-height: 1.6;
    }
    .about-image {
      flex: 1;
      text-align: center;
    }
    .about-image img {
      max-width: 100%;
      height: auto;
    }
  `;let It=_e;rt({"about-view":It});var Lo=Object.defineProperty,at=(o,t,e,s)=>{for(var i=void 0,r=o.length-1,n;r>=0;r--)(n=o[r])&&(i=n(t,e,i)||i);return i&&Lo(t,e,i),i};const $e=class $e extends N{constructor(){super(...arguments),this.username="",this.password="",this.confirmPassword="",this.errorMessage="",this.successMessage="",this.isRegister=!1}handleLogin(){console.log("Attempting login with:",{username:this.username}),fetch("/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:this.username,password:this.password})}).then(t=>{if(t.ok)console.log("Login successful!"),window.location.href="/";else throw new Error("Invalid username or password")}).catch(t=>{console.error("Login failed:",t),this.errorMessage="Invalid username or password. Please try again."})}handleRegister(){if(console.log("Attempting registration with:",{username:this.username,password:this.password,confirmPassword:this.confirmPassword}),this.password!==this.confirmPassword){this.errorMessage="Passwords do not match!";return}fetch("/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:this.username,password:this.password})}).then(t=>{if(t.ok)console.log("Registration successful!"),this.successMessage="Registration successful! You can now log in.",this.isRegister=!1,this.errorMessage="";else return t.json().then(e=>{throw new Error(e.message||"Registration failed")})}).catch(t=>{console.error("Registration failed:",t),this.errorMessage=t.message||"Registration failed. Please try again."})}toggleView(){this.isRegister=!this.isRegister,this.errorMessage="",this.successMessage="",this.username="",this.password="",this.confirmPassword=""}render(){return y`
      <main class="page">
        <section class="form-container">
          <h3>${this.isRegister?"Register":"Log in"}</h3>
          
          <!-- Display error or success messages -->
          ${this.errorMessage?y`<p class="error-message">${this.errorMessage}</p>`:""}
          ${this.successMessage?y`<p class="success-message">${this.successMessage}</p>`:""}

          <!-- Form for login or registration -->
          <form @submit="${t=>t.preventDefault()}">
            <div class="form-group">
              <label for="username">Username</label>
              <input
                type="text"
                id="username"
                placeholder="Enter your username"
                .value="${this.username}"
                @input="${t=>this.username=t.target.value}"
                required
                aria-describedby="username-help"
              />
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                .value="${this.password}"
                @input="${t=>this.password=t.target.value}"
                required
                aria-describedby="password-help"
              />
            </div>

            ${this.isRegister?y`
                  <div class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      placeholder="Confirm your password"
                      .value="${this.confirmPassword}"
                      @input="${t=>this.confirmPassword=t.target.value}"
                      required
                      aria-describedby="confirm-password-help"
                    />
                  </div>
                `:""}

            <button
              @click="${this.isRegister?this.handleRegister:this.handleLogin}"
              aria-label="${this.isRegister?"Register":"Login"}"
            >
              ${this.isRegister?"Register":"Login"}
            </button>
          </form>

          <!-- Toggle between login and registration view -->
          <p class="toggle-link">
            ${this.isRegister?y`
                  Already have an account?
                  <a @click="${this.toggleView}" href="javascript:void(0)"
                    >Login</a
                  >
                `:y`
                  Don't have an account?
                  <a @click="${this.toggleView}" href="javascript:void(0)"
                    >Register</a
                  >
                `}
          </p>
        </section>
      </main>
    `}};$e.styles=nt`
    :host {
      display: block;
      height: 100%
      background-color: #f7f7f7;
      font-family: 'Arial', sans-serif;
    }

    main.page {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
    }

    .form-container {
      max-width: 400px;
      width: 100%;
      background-color: #fff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      border: 1px solid #e0e0e0;
      margin-top: 100px;
    }

    h3 {
      text-align: center;
      margin-bottom: 25px;
      font-size: 1.5em;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      font-weight: bold;
      margin-bottom: 5px;
      display: block;
      color: #333;
    }

    input {
      width: calc(100% - 20px);
      padding: 10px;
      margin-bottom: 15px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }

    button {
      width: 100%;
      padding: 12px;
      background-color: #e46212;
      color: #fff;
      font-size: 1em;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    button:hover {
      background-color: #dd7535;
    }

    p.toggle-link {
      text-align: center;
      margin-top: 20px;
    }

    p.toggle-link a {
      color: #007bff;
      text-decoration: none;
    }

    .error-message {
      color: #f44336;
      text-align: center;
      margin-bottom: 10px;
    }

    .success-message {
      color: #4caf50;
      text-align: center;
      margin-bottom: 10px;
    }
  `;let C=$e;at([b()],C.prototype,"username");at([b()],C.prototype,"password");at([b()],C.prototype,"confirmPassword");at([b()],C.prototype,"errorMessage");at([b()],C.prototype,"successMessage");at([b()],C.prototype,"isRegister");var Io=Object.defineProperty,Bs=(o,t,e,s)=>{for(var i=void 0,r=o.length-1,n;r>=0;r--)(n=o[r])&&(i=n(t,e,i)||i);return i&&Io(t,e,i),i};const we=class we extends N{constructor(){super(...arguments),this.itemId="",this.application=null}connectedCallback(){super.connectedCallback(),console.log("ConnectedCallback -> Item ID:",this.itemId),this.itemId?this.hydrate():console.error("Missing itemId for application.")}hydrate(){this.itemId?(console.log("Fetching application with ID:",this.itemId),fetch(`/api/applications/${this.itemId}`).then(t=>{if(t.ok)return t.json();throw new Error(`Error fetching application: ${t.statusText}`)}).then(t=>{this.application={...t,status:t.status||"Not specified"}}).catch(t=>{console.error("Failed to fetch application:",t)})):(console.log("Fetching all applications..."),fetch("/api/applications").then(t=>{if(t.ok)return t.json();throw new Error(`Error fetching applications: ${t.statusText}`)}).then(t=>{console.log("Fetched applications:",t),this.application=t.length>0?t[0]:null}).catch(t=>{console.error("Failed to fetch applications:",t)}))}handleBackButton(){window.history.back()}handleDelete(){this.itemId?fetch(`/api/applications/${this.itemId}`,{method:"DELETE",headers:{"Content-Type":"application/json"}}).then(t=>{if(t.ok)console.log("Application deleted successfully."),window.history.back();else throw new Error(`Error deleting application: ${t.statusText}`)}).catch(t=>{console.error("Failed to delete application:",t)}):console.error("No itemId provided for deletion.")}render(){if(!this.application)return y`<p>Loading application...</p>`;const{title:t,status:e,appliedDate:s,method:i,notes:r,company:n}=this.application,{name:l,state:a,city:u,streetAddress:f}=n,p=new Date(s).toLocaleDateString();return y`
      <main>
        <section class="application-section">
          <!-- Flexbox container for back button and title -->
          <div class="header">
            <button @click="${this.handleBackButton}" class="back-button">← Back</button>
            <h2 class="title">${t}</h2>
          </div>

          <div class="company-info">
            <h3>Company: ${l}</h3>
            <p><strong>Location:</strong> ${u}, ${a}</p>
            <p><strong>Address:</strong> ${f}</p>
          </div>

          <div class="application-details">
            <p><strong>Applied on:</strong> ${p}</p>
            <p><strong>Status:</strong> ${e}</p>
            <p><strong>Application Method:</strong> ${i||"Not specified"}</p>

            <div class="notes">
              <h3>Notes</h3>
              <p>${r||"No notes available"}</p>
            </div>
          </div>

          <!-- Delete button -->
          <div class="action-buttons">
            <button @click="${this.handleDelete}" class="delete-button">Delete Application</button>
          </div>
        </section>
      </main>
    `}};we.styles=nt`
      main {
        padding: 20px;
        font-family: Arial, sans-serif;
      }

      .application-section {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      /* Flexbox container for the header (back button + title) */
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between; /* Space out the items */
      }

      .title {
        flex-grow: 1; /* Allow the title to take up the remaining space */
        text-align: center; /* Center the title */
        font-size: 2em;
        font-weight: bold;
        color: #333;
        margin: 0; /* Remove default margin for better alignment */
      }

      .company-info {
        margin-top: 20px;
        padding: 15px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #f9f9f9;
      }

      .company-info h3 {
        font-size: 1.5em;
        margin-bottom: 10px;
      }

      .application-details p {
        font-size: 1.1em;
        line-height: 1.6;
      }

      .notes p {
        font-style: italic;
      }

      .notes h3 {
        font-size: 1.3em;
        margin-top: 20px;
      }

      .back-button, .delete-button {
        padding: 10px 20px;
        font-size: 1.2em;
        background-color: #e46212;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }

      .back-button:hover, .delete-button:hover {
        background-color: #dd7535;
      }

      .action-buttons {
        margin-top: 20px;
      }
    `;let ot=we;Bs([qs({type:String})],ot.prototype,"itemId");Bs([b()],ot.prototype,"application");var jo=Object.defineProperty,E=(o,t,e,s)=>{for(var i=void 0,r=o.length-1,n;r>=0;r--)(n=o[r])&&(i=n(t,e,i)||i);return i&&jo(t,e,i),i};const xe=class xe extends Dt{constructor(){super("apptrak:model"),this.searchQuery="",this.showModal=!1,this.applicationTitle="",this.applicationAppliedDate="",this.applicationStatus="",this.applicationMethod="",this.applicationNotes="",this.companyName="",this.companyCity="",this.companyState="",this.companyStreetAddress="",this.successMessage="",this.errorMessage=""}toggleModal(){this.showModal=!this.showModal}connectedCallback(){super.connectedCallback(),console.log("Component connected. Loading all applications..."),this.loadAllApplications()}loadAllApplications(){this.dispatchMessage(["applications/load"])}handleSearch(){const t=this.searchQuery.toLowerCase();console.log("Search query:",t),this.dispatchMessage(["applications/search",{query:t}]),this.searchQuery=""}handleAddApplication(){const t={name:this.companyName,items:[],city:this.companyCity,state:this.companyState,streetAddress:this.companyStreetAddress};fetch("/applications/add",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:this.applicationTitle,company:t,appliedDate:new Date,status:this.applicationStatus,method:this.applicationMethod,notes:this.applicationNotes})}).then(e=>{if(e.ok)console.log("Application added successfully!"),this.successMessage="Application added successfully!",this.toggleModal(),this.clearForm(),window.location.href="/app/application-search-view";else throw new Error("Failed to add application")}).catch(e=>{console.error("Application addition failed:",e),this.errorMessage="Failed to add application. Please try again."})}clearForm(){this.applicationTitle="",this.companyName="",this.companyCity="",this.companyState="",this.companyStreetAddress="",this.applicationAppliedDate="",this.applicationStatus="Pending",this.applicationMethod="",this.applicationNotes=""}render(){const{applications:t=[]}=this.model;return y`
      <main>
        <section class="search-section">
          <h2>Search Your Applications</h2>
          <div class="search-bar">
            <input
              type="text"
              id="application-keyword"
              placeholder="Search by job title or company..."
              .value="${this.searchQuery}"
              @input="${e=>this.searchQuery=e.target.value}"
            />
            <button @click="${this.handleSearch}">Search</button>
          </div>
        </section>

        <!-- Add Application Button -->
        <section class="add-application-section">
          <button @click="${this.toggleModal}">Add Application</button>
        </section>

        <!-- Modal for Adding an Application -->
        ${this.showModal?y`
              <div class="modal">
                <div class="modal-content">
                  <h3>Add New Application</h3>

                  <!-- Application Title -->
                  <label for="title">Job Title</label>
                  <input
                    type="text"
                    id="title"
                    .value="${this.applicationTitle}"
                    @input="${e=>this.applicationTitle=e.target.value}"
                  />

                  <!-- Company Information -->
                  <label for="company-name">Company Name</label>
                  <input
                    type="text"
                    id="company-name"
                    .value="${this.companyName}"
                    @input="${e=>this.companyName=e.target.value}"
                  />
                  <label for="company-city">City</label>
                  <input
                    type="text"
                    id="company-city"
                    .value="${this.companyCity}"
                    @input="${e=>this.companyCity=e.target.value}"
                  />
                  <label for="company-state">State</label>
                  <input
                    type="text"
                    id="company-state"
                    .value="${this.companyState}"
                    @input="${e=>this.companyState=e.target.value}"
                  />
                  <label for="company-street-address">Street Address</label>
                  <input
                    type="text"
                    id="company-street-address"
                    .value="${this.companyStreetAddress}"
                    @input="${e=>this.companyStreetAddress=e.target.value}"
                  />

                  <!-- Application Date -->
                  <label for="applied-date">Application Date</label>
                  <input
                    type="date"
                    id="applied-date"
                    .value="${this.applicationAppliedDate}"
                    @input="${e=>this.applicationAppliedDate=e.target.value}"
                  />

                  <!-- Application Status -->
                  <label for="status">Application Status</label>
                  <select
                    id="status"
                    .value="${this.applicationStatus}"
                    @change="${e=>this.applicationStatus=e.target.value}"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>

                  <!-- Application Method -->
                  <label for="method">Application Method</label>
                  <select
                    id="method"
                    .value="${this.applicationMethod}"
                    @change="${e=>this.applicationMethod=e.target.value}"
                  >
                    <option value="Company Site">Company Site</option>
                    <option value="Email">Email</option>
                    <option value="Referral">Referral</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Recruiter">Recruiter</option>
                    <option value="Handshake">Handshake</option>
                  </select>

                  <!-- Notes -->
                  <label for="notes">Notes</label>
                  <textarea
                    id="notes"
                    .value="${this.applicationNotes}"
                    @input="${e=>this.applicationNotes=e.target.value}"
                  ></textarea>

                  <button @click="${this.handleAddApplication}">Submit Application</button>
                  <button @click="${this.toggleModal}">Cancel</button>
                </div>
              </div>
            `:""}

        <section class="results-section">
          <h2>Results</h2>
          ${t.length===0?y`<p>No applications found. Try a different keyword.</p>`:y`
                <ul class="application-list">
                  ${t.map(e=>y`
                        <li>
                          <a href="applications/${e.id}">${e.title}</a>
                        </li>
                      `)}
                </ul>
              `}
        </section>
      </main>

    `}};xe.styles=nt`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    /* General Container */
    main {
      padding: 30px;
      font-family: 'Poppins', sans-serif;
      background-color: var(--color-background-page);
      color: #333;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }

    /* Search Section */
    .search-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 30px;
      width: 100%;
      max-width: 700px;
    }

    /* Title */
    h2 {
      font-size: 1.8rem;
      color: var(--color-text-statistics);
      font-weight: 600;
      margin-bottom: 15px;
    }

    /* Search Bar */
    .search-bar {
      display: flex;
      flex-direction: row;
      width: 100%;
      max-width: 600px;
      border-radius: 40px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .search-bar input {
      flex: 1;
      padding: 15px;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-right: none;
      border-top-left-radius: 30px;
      border-bottom-left-radius: 30px;
      outline: none;
      transition: border-color 0.3s ease;
      color: #333;
      background-color: white;
    }

    .search-bar input:focus {
      border-color: #007bff;
    }

    .search-bar button {
      padding: 15px 20px;
      font-size: 1rem;
      cursor: pointer;
      border: 1px solid #007bff;
      border-left: none;
      border-top-right-radius: 30px;
      border-bottom-right-radius: 30px;
      background-color: #007bff;
      color: white;
      transition: background-color 0.3s ease, transform 0.2s ease;
      margin-left: 10px;
    }

    .search-bar button:hover {
      background-color: #0056b3;
    }

    .add-application-section button {
      background-color: #007bff; 
      color: white;
      padding: 10px 20px;
      font-size: 16px;
      border: none; 
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .add-application-section button:hover {
      background-color: #0056b3;
    }

    /* Results Section */
    .results-section {
      margin-top: 20px;
      width: 100%;
      max-width: 700px;
    }

    .results-section h2 {
      font-size: 1.6rem;
      color: var(--color-text-statistics);
      font-weight: 600;
      margin-bottom: 15px;
    }

    .application-list {
      list-style-type: none;
      padding: 0;
      margin: 10px 0;
    }

    .application-list li {
      padding: 15px;
      margin-bottom: 10px;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      background-color: var(--color-results-li);
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
    }

    .application-list li:hover {
      background-color: #f5f5f5;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }

    .application-list a {
      text-decoration: none;
      color: #007bff;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .application-list a:hover {
      color: #0056b3;
    }

    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
    }

    .modal-content {
      background-color: white;
      padding: 30px;
      border-radius: 10px; /* Fully rounded corners */
      width: 30%;
      max-height: 90%;
      overflow-y: auto;
    }

    .modal h3 {
      margin-bottom: 20px;
      font-size: 1.5rem;
    }

    .modal label {
      font-weight: 600;
      margin-top: 10px;
    }

    .modal input,
    .modal select,
    .modal textarea {
      width: 100%;
      padding: 10px;
      margin-bottom: 15px;
      font-size: 1rem;
      border-radius: 5px;
      border: 1px solid #ccc;
    }

    .modal textarea {
      min-height: 100px;
      resize: vertical;
    }

    .modal button {
      padding: 12px 20px;
      font-size: 1rem;
      cursor: pointer;
      border-radius: 8px;
      background-color: #007bff;
      color: white;
      border: none;
      transition: background-color 0.3s ease;
      margin-right: 10px;
      margin-top: 10px;
    }

    .modal button:hover {
      background-color: #0056b3;
    }

    .modal button:last-child {
      background-color: #ccc;
    }

    .modal button:last-child:hover {
      background-color: #bbb;
    }

    /* Responsive Design */
    @media (max-width: 600px) {
      .search-section {
        margin-bottom: 20px;
      }

      .search-bar {
        flex-direction: column;
        width: 100%;
        max-width: 100%;
      }

      .search-bar input,
      .search-bar button {
        width: 100%;
        margin-bottom: 10px;
      }

      .application-list {
        padding: 0 10px;
      }

      /* Modal */
      .modal-content {
        width: 90%;
        padding: 20px;
      }
      
      .modal input,
      .modal select,
      .modal textarea {
        font-size: 0.9rem;
      }

      .modal button {
        width: 100%;
        margin-top: 10px;
      }
        
    }
      
    /* Dark Mode */
    :host([theme="dark"]) {
      --background-color: #121212;
      --primary-text-color: #f4f7fa;
      --secondary-text-color: #b0b0b0;
      --card-background: #333;
      --button-background: #6200ea;
      --button-hover-background: #3700b3;
    }
  `;let x=xe;E([b()],x.prototype,"searchQuery");E([b()],x.prototype,"showModal");E([b()],x.prototype,"applicationTitle");E([b()],x.prototype,"applicationAppliedDate");E([b()],x.prototype,"applicationStatus");E([b()],x.prototype,"applicationMethod");E([b()],x.prototype,"applicationNotes");E([b()],x.prototype,"companyName");E([b()],x.prototype,"companyCity");E([b()],x.prototype,"companyState");E([b()],x.prototype,"companyStreetAddress");E([b()],x.prototype,"successMessage");E([b()],x.prototype,"errorMessage");rt({"application-search-view":x});const Ho={companys:[],totalCost:0,applications:[]};function Vs(o,t,e){switch(o[0]){case"companys/load":zo(e).then(h=>t(d=>({...d,companys:h}))).catch(h=>{console.error("Failed to fetch companys:",h)});break;case"applications/load":Ws(e).then(h=>t(d=>({...d,applications:h}))).catch(h=>{console.error("Failed to fetch applications:",h)});break;case"applications/search":console.log("DISPATCHING SEARCH QUERY:",o[1].query),Do(o[1].query,t,e);break;case"applications/delete":const{id:s}=o[1];t(h=>{const d=h.applications.filter(m=>m.id!==s);return{...h,applications:d}});break;case"applications/add":const[i,{title:r,company:n,appliedDate:l,status:a,method:u,notes:f}]=o,p={id:Math.random().toString(36).substr(2,9),title:r,company:n,appliedDate:l,status:a,method:u,notes:f};t(h=>({...h,applications:[...h.applications,p]}));break;default:const c=o[0];throw new Error(`Unhandled Auth message "${c}"`)}}function zo(o){return fetch("/api/companys",{headers:jt.headers(o)}).then(t=>{if(!t.ok)throw t.status===401?new Error("Unauthorized: User must log in."):new Error(`API error: ${t.statusText}`);return t.json()}).then(t=>{if(Array.isArray(t))return t;throw new Error("Unexpected response format")})}function Ws(o){return fetch("/api/applications",{headers:jt.headers(o)}).then(t=>{if(!t.ok)throw t.status===401?new Error("Unauthorized: User must log in."):new Error(`API error: ${t.statusText}`);return t.json()}).then(t=>{if(Array.isArray(t))return t;throw new Error("Unexpected response format")})}function Do(o,t,e){Ws(e).then(s=>{console.log("FETCHED APPLICATIONS: ",s);const i=o.toLowerCase(),r=s.filter(n=>n.title.toLowerCase().includes(i));t(n=>({...n,applications:r}))}).catch(s=>{console.error("Failed to fetch applications:",s)})}const Ae=class Ae extends N{render(){return y`
            <mu-switch></mu-switch>`}connectedCallback(){super.connectedCallback()}};Ae.uses=rt({"home-view":$t,"login-view":C,"about-view":It,"application-view":ot,"application-search-view":x,"mu-store":class extends bs.Provider{constructor(){super(Vs,Ho,"apptrak:auth")}}});let re=Ae;const Fo=[{path:"/app/login",view:()=>y`
            <login-view></login-view>`},{path:"/app/about-view",view:()=>y`
            <about-view></about-view>
        `},{path:"/app/applications/:id",view:o=>y`
            <application-view itemId="${o.id}"></application-view>
        `},{path:"/app/application-search-view",view:()=>y`
            <application-search-view></application-search-view>
        `},{path:"/app/add-application",view:()=>y`
            <application-add-view></application-add-view>
        `},{path:"/app",view:()=>y`
            <home-view></home-view>
        `},{path:"/",redirect:"/app"}];rt({"mu-auth":jt.Provider,"mu-history":mi.Provider,"mu-store":class extends bs.Provider{constructor(){super(Vs,{companys:[],totalCost:0,applications:[]},"apptrak:auth")}},"mu-switch":class extends no.Element{constructor(){super(Fo,"apptrak:history","apptrak:auth")}},"apptrak-app":re,"all-header":Lt,"application-view":ot});
