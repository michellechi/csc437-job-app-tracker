(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();var V,we;class at extends Error{}at.prototype.name="InvalidTokenError";function qs(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Bs(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return qs(t)}catch{return atob(t)}}function Ge(r,t){if(typeof r!="string")throw new at("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new at(`Invalid token specified: missing part #${e+1}`);let i;try{i=Bs(s)}catch(n){throw new at(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new at(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Ws="mu:context",Kt=`${Ws}:change`;class Ys{constructor(t,e){this._proxy=Qs(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ee extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Ys(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Kt,t),t}detach(t){this.removeEventListener(Kt,t)}}function Qs(r,t){return new Proxy(r,{get:(s,i,n)=>{if(i==="then")return;const o=Reflect.get(s,i,n);return console.log(`Context['${i}'] => `,o),o},set:(s,i,n,o)=>{const c=r[i];console.log(`Context['${i.toString()}'] <= `,n);const a=Reflect.set(s,i,n,o);if(a){let d=new CustomEvent(Kt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:i,oldValue:c,value:n}),t.dispatchEvent(d)}else console.log(`Context['${i}] was not set to ${n}`);return a}})}function Ks(r,t){const e=Ze(t,r);return new Promise((s,i)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function Ze(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return Ze(r,i.host)}class Js extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function Xe(r="mu:message"){return(t,...e)=>t.dispatchEvent(new Js(e,r))}class se{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function Gs(r){return t=>({...t,...r})}const Jt="mu:auth:jwt",ts=class es extends se{constructor(t,e){super((s,i)=>this.update(s,i),t,es.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(Xs(s)),Vt(i);case"auth/signout":return e(ti()),Vt(this._redirectForLogin);case"auth/redirect":return Vt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};ts.EVENT_TYPE="auth:message";let ss=ts;const is=Xe(ss.EVENT_TYPE);function Vt(r,t={}){if(!r)return;const e=window.location.href,s=new URL(r,e);return Object.entries(t).forEach(([i,n])=>s.searchParams.set(i,n)),()=>{console.log("Redirecting to ",r),window.location.assign(s)}}class Zs extends ee{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=K.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new ss(this.context,this.redirect).attach(this)}}class Q{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(Jt),t}}class K extends Q{constructor(t){super();const e=Ge(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new K(t);return localStorage.setItem(Jt,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(Jt);return t?K.authenticate(t):new Q}}function Xs(r){return Gs({user:K.authenticate(r),token:r})}function ti(){return r=>{const t=r.user;return{user:t&&t.authenticated?Q.deauthenticate(t):t,token:""}}}function ei(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function si(r){return r.authenticated?Ge(r.token||""):{}}const ie=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:K,Provider:Zs,User:Q,dispatch:is,headers:ei,payload:si},Symbol.toStringTag,{value:"Module"}));function St(r,t,e){const s=r.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,i),s.dispatchEvent(i),r.stopPropagation()}function Gt(r,t="*"){return r.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const ii=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:Gt,relay:St},Symbol.toStringTag,{value:"Module"}));function rs(r,...t){const e=r.map((i,n)=>n?[t[n-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const ri=new DOMParser;function j(r,...t){const e=t.map(c),s=r.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),i=ri.parseFromString(s,"text/html"),n=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u==null||u.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function c(a,d){if(a===null)return"";switch(typeof a){case"string":return Ae(a);case"bigint":case"boolean":case"number":case"symbol":return Ae(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(c);return f.replaceChildren(...u),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Ae(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ut(r,t={mode:"open"}){const e=r.attachShadow(t),s={template:i,styles:n};return s;function i(o){const c=o.firstElementChild,a=c&&c.tagName==="TEMPLATE"?c:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}V=class extends HTMLElement{constructor(){super(),this._state={},Ut(this).template(V.template).styles(V.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),St(r,"mu-form:submit",this._state)})}set init(r){this._state=r||{},ni(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}},V.template=j`
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
  `,V.styles=rs`
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
  `;function ni(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const c=o;c.checked=!!i;break;case"date":o.value=i.toISOString().substr(0,10);break;default:o.value=i;break}}}return r}const ns=class os extends se{constructor(t){super((e,s)=>this.update(e,s),t,os.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(ai(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(ci(s,i));break}}}};ns.EVENT_TYPE="history:message";let re=ns;class Ee extends ee{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=oi(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ne(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new re(this.context).attach(this)}}function oi(r){const t=r.currentTarget,e=s=>s.tagName=="A"&&s.href;if(r.button===0)if(r.composed){const i=r.composedPath().find(e);return i||void 0}else{for(let s=r.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function ai(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function ci(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const ne=Xe(re.EVENT_TYPE),li=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Ee,Provider:Ee,Service:re,dispatch:ne},Symbol.toStringTag,{value:"Module"}));class ut{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Se(this._provider,t);this._effects.push(i),e(i)}else Ks(this._target,this._contextLabel).then(i=>{const n=new Se(i,t);this._provider=i,this._effects.push(n),i.attach(o=>this._handleChange(o)),e(n)}).catch(i=>console.log(`Observer ${this._contextLabel}: ${i}`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Se{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const as=class cs extends HTMLElement{constructor(){super(),this._state={},this._user=new Q,this._authObserver=new ut(this,"blazing:auth"),Ut(this).template(cs.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;hi(i,this._state,e,this.authorization).then(n=>it(n,this)).then(n=>{const o=`mu-rest-form:${s}`,c=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:i}});this.dispatchEvent(c)}).catch(n=>{const o="mu-rest-form:error",c=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:i,request:this._state}});this.dispatchEvent(c)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},it(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&xe(this.src,this.authorization).then(e=>{this._state=e,it(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&xe(this.src,this.authorization).then(i=>{this._state=i,it(i,this)});break;case"new":s&&(this._state={},it({},this));break}}};as.observedAttributes=["src","new","action"];as.template=j`
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
  `;function xe(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function it(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const c=o;c.checked=!!i;break;default:o.value=i;break}}}return r}function hi(r,t,e="PUT",s={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const ls=class hs extends se{constructor(t,e){super(e,t,hs.EVENT_TYPE,!1)}};ls.EVENT_TYPE="mu:message";let us=ls;class ui extends ee{constructor(t,e,s){super(e),this._user=new Q,this._updateFn=t,this._authObserver=new ut(this,s)}connectedCallback(){const t=new us(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const ds=Object.freeze(Object.defineProperty({__proto__:null,Provider:ui,Service:us},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const At=globalThis,oe=At.ShadowRoot&&(At.ShadyCSS===void 0||At.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ae=Symbol(),Pe=new WeakMap;let ps=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ae)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(oe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Pe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Pe.set(e,t))}return t}toString(){return this.cssText}};const di=r=>new ps(typeof r=="string"?r:r+"",void 0,ae),pi=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new ps(e,r,ae)},fi=(r,t)=>{if(oe)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=At.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},ke=oe?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return di(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:mi,defineProperty:gi,getOwnPropertyDescriptor:yi,getOwnPropertyNames:_i,getOwnPropertySymbols:vi,getPrototypeOf:$i}=Object,J=globalThis,Ce=J.trustedTypes,bi=Ce?Ce.emptyScript:"",Oe=J.reactiveElementPolyfillSupport,ct=(r,t)=>r,xt={toAttribute(r,t){switch(t){case Boolean:r=r?bi:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ce=(r,t)=>!mi(r,t),Te={attribute:!0,type:String,converter:xt,reflect:!1,hasChanged:ce};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),J.litPropertyMetadata??(J.litPropertyMetadata=new WeakMap);let B=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Te){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&gi(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=yi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const c=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Te}static _$Ei(){if(this.hasOwnProperty(ct("elementProperties")))return;const t=$i(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ct("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ct("properties"))){const e=this.properties,s=[..._i(e),...vi(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(ke(i))}else t!==void 0&&e.push(ke(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fi(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:xt).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=i.getPropertyOptions(n),c=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:xt;this._$Em=n,this[n]=c.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ce)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};B.elementStyles=[],B.shadowRootOptions={mode:"open"},B[ct("elementProperties")]=new Map,B[ct("finalized")]=new Map,Oe==null||Oe({ReactiveElement:B}),(J.reactiveElementVersions??(J.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pt=globalThis,kt=Pt.trustedTypes,Re=kt?kt.createPolicy("lit-html",{createHTML:r=>r}):void 0,fs="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,ms="?"+P,wi=`<${ms}>`,H=document,dt=()=>H.createComment(""),pt=r=>r===null||typeof r!="object"&&typeof r!="function",le=Array.isArray,Ai=r=>le(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",qt=`[ 	
\f\r]`,rt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ue=/-->/g,Ne=/>/g,N=RegExp(`>|${qt}(?:([^\\s"'>=/]+)(${qt}*=${qt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Me=/'/g,Le=/"/g,gs=/^(?:script|style|textarea|title)$/i,Ei=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),nt=Ei(1),G=Symbol.for("lit-noChange"),v=Symbol.for("lit-nothing"),Ie=new WeakMap,L=H.createTreeWalker(H,129);function ys(r,t){if(!le(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Re!==void 0?Re.createHTML(t):t}const Si=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=rt;for(let c=0;c<e;c++){const a=r[c];let d,f,u=-1,l=0;for(;l<a.length&&(o.lastIndex=l,f=o.exec(a),f!==null);)l=o.lastIndex,o===rt?f[1]==="!--"?o=Ue:f[1]!==void 0?o=Ne:f[2]!==void 0?(gs.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=N):f[3]!==void 0&&(o=N):o===N?f[0]===">"?(o=i??rt,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?N:f[3]==='"'?Le:Me):o===Le||o===Me?o=N:o===Ue||o===Ne?o=rt:(o=N,i=void 0);const h=o===N&&r[c+1].startsWith("/>")?" ":"";n+=o===rt?a+wi:u>=0?(s.push(d),a.slice(0,u)+fs+a.slice(u)+P+h):a+P+(u===-2?c:h)}return[ys(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let Zt=class _s{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const c=t.length-1,a=this.parts,[d,f]=Si(t,e);if(this.el=_s.createElement(d,s),L.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=L.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(fs)){const l=f[o++],h=i.getAttribute(u).split(P),p=/([.?@])?(.*)/.exec(l);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Pi:p[1]==="?"?ki:p[1]==="@"?Ci:Nt}),i.removeAttribute(u)}else u.startsWith(P)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(gs.test(i.tagName)){const u=i.textContent.split(P),l=u.length-1;if(l>0){i.textContent=kt?kt.emptyScript:"";for(let h=0;h<l;h++)i.append(u[h],dt()),L.nextNode(),a.push({type:2,index:++n});i.append(u[l],dt())}}}else if(i.nodeType===8)if(i.data===ms)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(P,u+1))!==-1;)a.push({type:7,index:n}),u+=P.length-1}n++}}static createElement(t,e){const s=H.createElement("template");return s.innerHTML=t,s}};function Z(r,t,e=r,s){var i,n;if(t===G)return t;let o=s!==void 0?(i=e.o)==null?void 0:i[s]:e.l;const c=pt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==c&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),c===void 0?o=void 0:(o=new c(r),o._$AT(r,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=Z(r,o._$AS(r,t.values),o,s)),t}class xi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??H).importNode(e,!0);L.currentNode=i;let n=L.nextNode(),o=0,c=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new _t(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Oi(n,this,t)),this._$AV.push(d),a=s[++c]}o!==(a==null?void 0:a.index)&&(n=L.nextNode(),o++)}return L.currentNode=H,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class _t{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,i){this.type=2,this._$AH=v,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),pt(t)?t===v||t==null||t===""?(this._$AH!==v&&this._$AR(),this._$AH=v):t!==this._$AH&&t!==G&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ai(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==v&&pt(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Zt.createElement(ys(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new xi(n,this),c=o.u(this.options);o.p(s),this.T(c),this._$AH=o}}_$AC(t){let e=Ie.get(t.strings);return e===void 0&&Ie.set(t.strings,e=new Zt(t)),e}k(t){le(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new _t(this.O(dt()),this.O(dt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Nt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=v,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=v}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=Z(this,t,e,0),o=!pt(t)||t!==this._$AH&&t!==G,o&&(this._$AH=t);else{const c=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=Z(this,c[s+a],e,a),d===G&&(d=this._$AH[a]),o||(o=!pt(d)||d!==this._$AH[a]),d===v?t=v:t!==v&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===v?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Pi extends Nt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===v?void 0:t}}class ki extends Nt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==v)}}class Ci extends Nt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??v)===G)return;const s=this._$AH,i=t===v&&s!==v||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==v&&(s===v||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Oi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const je=Pt.litHtmlPolyfillSupport;je==null||je(Zt,_t),(Pt.litHtmlVersions??(Pt.litHtmlVersions=[])).push("3.2.0");const Ti=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new _t(t.insertBefore(dt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Y=class extends B{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Ti(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return G}};Y._$litElement$=!0,Y.finalized=!0,(we=globalThis.litElementHydrateSupport)==null||we.call(globalThis,{LitElement:Y});const He=globalThis.litElementPolyfillSupport;He==null||He({LitElement:Y});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ri={attribute:!0,type:String,converter:xt,reflect:!1,hasChanged:ce},Ui=(r=Ri,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(c){const a=t.get.call(this);t.set.call(this,c),this.requestUpdate(o,a,r)},init(c){return c!==void 0&&this.P(o,void 0,r),c}}}if(s==="setter"){const{name:o}=e;return function(c){const a=this[o];t.call(this,c),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function vs(r){return(t,e)=>typeof e=="object"?Ui(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function $s(r){return vs({...r,state:!0,attribute:!1})}function Ni(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function Mi(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var bs={};(function(r){var t=function(){var e=function(u,l,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=l);return h},s=[1,9],i=[1,10],n=[1,11],o=[1,12],c=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(l,h,p,g,m,y,jt){var A=y.length-1;switch(m){case 1:return new g.Root({},[y[A-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[y[A-1],y[A]]);break;case 4:case 5:this.$=y[A];break;case 6:this.$=new g.Literal({value:y[A]});break;case 7:this.$=new g.Splat({name:y[A]});break;case 8:this.$=new g.Param({name:y[A]});break;case 9:this.$=new g.Optional({},[y[A-1]]);break;case 10:this.$=l;break;case 11:case 12:this.$=l.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[2,2]},e(c,[2,4]),e(c,[2,5]),e(c,[2,6]),e(c,[2,7]),e(c,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},e(c,[2,10]),e(c,[2,11]),e(c,[2,12]),{1:[2,1]},e(c,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:n,15:o},e(c,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(l,h){if(h.recoverable)this.trace(l);else{let p=function(g,m){this.message=g,this.hash=m};throw p.prototype=Error,new p(l,h)}},parse:function(l){var h=this,p=[0],g=[null],m=[],y=this.table,jt="",A=0,ve=0,zs=2,$e=1,Ds=m.slice.call(arguments,1),_=Object.create(this.lexer),R={yy:{}};for(var Ht in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Ht)&&(R.yy[Ht]=this.yy[Ht]);_.setInput(l,R.yy),R.yy.lexer=_,R.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var zt=_.yylloc;m.push(zt);var Fs=_.options&&_.options.ranges;typeof R.yy.parseError=="function"?this.parseError=R.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Vs=function(){var F;return F=_.lex()||$e,typeof F!="number"&&(F=h.symbols_[F]||F),F},w,U,E,Dt,D={},bt,S,be,wt;;){if(U=p[p.length-1],this.defaultActions[U]?E=this.defaultActions[U]:((w===null||typeof w>"u")&&(w=Vs()),E=y[U]&&y[U][w]),typeof E>"u"||!E.length||!E[0]){var Ft="";wt=[];for(bt in y[U])this.terminals_[bt]&&bt>zs&&wt.push("'"+this.terminals_[bt]+"'");_.showPosition?Ft="Parse error on line "+(A+1)+`:
`+_.showPosition()+`
Expecting `+wt.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Ft="Parse error on line "+(A+1)+": Unexpected "+(w==$e?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Ft,{text:_.match,token:this.terminals_[w]||w,line:_.yylineno,loc:zt,expected:wt})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+U+", token: "+w);switch(E[0]){case 1:p.push(w),g.push(_.yytext),m.push(_.yylloc),p.push(E[1]),w=null,ve=_.yyleng,jt=_.yytext,A=_.yylineno,zt=_.yylloc;break;case 2:if(S=this.productions_[E[1]][1],D.$=g[g.length-S],D._$={first_line:m[m.length-(S||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(S||1)].first_column,last_column:m[m.length-1].last_column},Fs&&(D._$.range=[m[m.length-(S||1)].range[0],m[m.length-1].range[1]]),Dt=this.performAction.apply(D,[jt,ve,A,R.yy,E[1],g,m].concat(Ds)),typeof Dt<"u")return Dt;S&&(p=p.slice(0,-1*S*2),g=g.slice(0,-1*S),m=m.slice(0,-1*S)),p.push(this.productions_[E[1]][0]),g.push(D.$),m.push(D._$),be=y[p[p.length-2]][p[p.length-1]],p.push(be);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(l,h){return this.yy=h||this.yy||{},this._input=l,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var l=this._input[0];this.yytext+=l,this.yyleng++,this.offset++,this.match+=l,this.matched+=l;var h=l.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),l},unput:function(l){var h=l.length,p=l.split(/(?:\r\n?|\n)/g);this._input=l+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(l){this.unput(this.match.slice(l))},pastInput:function(){var l=this.matched.substr(0,this.matched.length-this.match.length);return(l.length>20?"...":"")+l.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var l=this.match;return l.length<20&&(l+=this._input.substr(0,20-l.length)),(l.substr(0,20)+(l.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var l=this.pastInput(),h=new Array(l.length+1).join("-");return l+this.upcomingInput()+`
`+h+"^"},test_match:function(l,h){var p,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=l[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+l[0].length},this.yytext+=l[0],this.match+=l[0],this.matches=l,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(l[0].length),this.matched+=l[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in m)this[y]=m[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var l,h,p,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),y=0;y<m.length;y++)if(p=this._input.match(this.rules[m[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,g=y,this.options.backtrack_lexer){if(l=this.test_match(p,m[y]),l!==!1)return l;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(l=this.test_match(h,m[g]),l!==!1?l:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Mi<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(bs);function q(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var ws={Root:q("Root"),Concat:q("Concat"),Literal:q("Literal"),Splat:q("Splat"),Param:q("Param"),Optional:q("Optional")},As=bs.parser;As.yy=ws;var Li=As,Ii=Object.keys(ws);function ji(r){return Ii.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var Es=ji,Hi=Es,zi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Ss(r){this.captures=r.captures,this.re=r.re}Ss.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var Di=Hi({Concat:function(r){return r.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(zi,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new Ss({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Fi=Di,Vi=Es,qi=Vi({Concat:function(r,t){var e=r.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),Bi=qi,Wi=Li,Yi=Fi,Qi=Bi;vt.prototype=Object.create(null);vt.prototype.match=function(r){var t=Yi.visit(this.ast),e=t.match(r);return e||!1};vt.prototype.reverse=function(r){return Qi.visit(this.ast,r)};function vt(r){var t;if(this?t=this:t=Object.create(vt.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=Wi.parse(r),t}var Ki=vt,Ji=Ki,Gi=Ji;const Zi=Ni(Gi);var Xi=Object.defineProperty,xs=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Xi(t,e,i),i};const Ps=class extends Y{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>nt` <h1>Not Found</h1> `,this._cases=t.map(i=>({...i,route:new Zi(i.path)})),this._historyObserver=new ut(this,e),this._authObserver=new ut(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),nt` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(is(this,"auth/redirect"),nt` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):nt` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),nt` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),n=s+e;for(const o of this._cases){const c=o.route.match(n);if(c)return{...o,path:s,params:c,query:i}}}redirect(t){ne(this,"history/redirect",{href:t})}};Ps.styles=pi`
    :host,
    main {
      display: contents;
    }
  `;let Ct=Ps;xs([$s()],Ct.prototype,"_user");xs([$s()],Ct.prototype,"_match");const tr=Object.freeze(Object.defineProperty({__proto__:null,Element:Ct,Switch:Ct},Symbol.toStringTag,{value:"Module"})),er=class ks extends HTMLElement{constructor(){if(super(),Ut(this).template(ks.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};er.template=j`
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
  `;const Cs=class Xt extends HTMLElement{constructor(){super(),this._array=[],Ut(this).template(Xt.template).styles(Xt.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Os("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{Gt(t,"button.add")?St(t,"input-array:add"):Gt(t,"button.remove")&&St(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],sr(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Cs.template=j`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Cs.styles=rs`
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
  `;function sr(r,t){t.replaceChildren(),r.forEach((e,s)=>t.append(Os(e)))}function Os(r,t){const e=r===void 0?j`<input />`:j`<input value="${r}" />`;return j`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function Mt(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var ir=Object.defineProperty,rr=Object.getOwnPropertyDescriptor,nr=(r,t,e,s)=>{for(var i=rr(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&ir(t,e,i),i};class Ts extends Y{constructor(t){super(),this._pending=[],this._observer=new ut(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}nr([vs()],Ts.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Et=globalThis,he=Et.ShadowRoot&&(Et.ShadyCSS===void 0||Et.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ue=Symbol(),ze=new WeakMap;let Rs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ue)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(he&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=ze.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&ze.set(e,t))}return t}toString(){return this.cssText}};const or=r=>new Rs(typeof r=="string"?r:r+"",void 0,ue),Lt=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new Rs(e,r,ue)},ar=(r,t)=>{if(he)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=Et.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},De=he?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return or(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:cr,defineProperty:lr,getOwnPropertyDescriptor:hr,getOwnPropertyNames:ur,getOwnPropertySymbols:dr,getPrototypeOf:pr}=Object,C=globalThis,Fe=C.trustedTypes,fr=Fe?Fe.emptyScript:"",Bt=C.reactiveElementPolyfillSupport,lt=(r,t)=>r,Ot={toAttribute(r,t){switch(t){case Boolean:r=r?fr:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},de=(r,t)=>!cr(r,t),Ve={attribute:!0,type:String,converter:Ot,reflect:!1,hasChanged:de};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),C.litPropertyMetadata??(C.litPropertyMetadata=new WeakMap);class W extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ve){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&lr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=hr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const c=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ve}static _$Ei(){if(this.hasOwnProperty(lt("elementProperties")))return;const t=pr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(lt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(lt("properties"))){const e=this.properties,s=[...ur(e),...dr(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(De(i))}else t!==void 0&&e.push(De(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ar(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var n;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Ot).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),c=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:Ot;this._$Em=i,this[i]=c.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??de)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}W.elementStyles=[],W.shadowRootOptions={mode:"open"},W[lt("elementProperties")]=new Map,W[lt("finalized")]=new Map,Bt==null||Bt({ReactiveElement:W}),(C.reactiveElementVersions??(C.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ht=globalThis,Tt=ht.trustedTypes,qe=Tt?Tt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Us="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,Ns="?"+k,mr=`<${Ns}>`,z=document,ft=()=>z.createComment(""),mt=r=>r===null||typeof r!="object"&&typeof r!="function",pe=Array.isArray,gr=r=>pe(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Wt=`[ 	
\f\r]`,ot=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Be=/-->/g,We=/>/g,M=RegExp(`>|${Wt}(?:([^\\s"'>=/]+)(${Wt}*=${Wt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ye=/'/g,Qe=/"/g,Ms=/^(?:script|style|textarea|title)$/i,yr=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),b=yr(1),X=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Ke=new WeakMap,I=z.createTreeWalker(z,129);function Ls(r,t){if(!pe(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return qe!==void 0?qe.createHTML(t):t}const _r=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=ot;for(let c=0;c<e;c++){const a=r[c];let d,f,u=-1,l=0;for(;l<a.length&&(o.lastIndex=l,f=o.exec(a),f!==null);)l=o.lastIndex,o===ot?f[1]==="!--"?o=Be:f[1]!==void 0?o=We:f[2]!==void 0?(Ms.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=M):f[3]!==void 0&&(o=M):o===M?f[0]===">"?(o=i??ot,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?M:f[3]==='"'?Qe:Ye):o===Qe||o===Ye?o=M:o===Be||o===We?o=ot:(o=M,i=void 0);const h=o===M&&r[c+1].startsWith("/>")?" ":"";n+=o===ot?a+mr:u>=0?(s.push(d),a.slice(0,u)+Us+a.slice(u)+k+h):a+k+(u===-2?c:h)}return[Ls(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class gt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const c=t.length-1,a=this.parts,[d,f]=_r(t,e);if(this.el=gt.createElement(d,s),I.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=I.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Us)){const l=f[o++],h=i.getAttribute(u).split(k),p=/([.?@])?(.*)/.exec(l);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?$r:p[1]==="?"?br:p[1]==="@"?wr:It}),i.removeAttribute(u)}else u.startsWith(k)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(Ms.test(i.tagName)){const u=i.textContent.split(k),l=u.length-1;if(l>0){i.textContent=Tt?Tt.emptyScript:"";for(let h=0;h<l;h++)i.append(u[h],ft()),I.nextNode(),a.push({type:2,index:++n});i.append(u[l],ft())}}}else if(i.nodeType===8)if(i.data===Ns)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(k,u+1))!==-1;)a.push({type:7,index:n}),u+=k.length-1}n++}}static createElement(t,e){const s=z.createElement("template");return s.innerHTML=t,s}}function tt(r,t,e=r,s){var o,c;if(t===X)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=mt(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((c=i==null?void 0:i._$AO)==null||c.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=tt(r,i._$AS(r,t.values),i,s)),t}class vr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??z).importNode(e,!0);I.currentNode=i;let n=I.nextNode(),o=0,c=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new $t(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Ar(n,this,t)),this._$AV.push(d),a=s[++c]}o!==(a==null?void 0:a.index)&&(n=I.nextNode(),o++)}return I.currentNode=z,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class $t{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),mt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==X&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):gr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&mt(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=gt.createElement(Ls(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{const o=new vr(i,this),c=o.u(this.options);o.p(e),this.T(c),this._$AH=o}}_$AC(t){let e=Ke.get(t.strings);return e===void 0&&Ke.set(t.strings,e=new gt(t)),e}k(t){pe(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new $t(this.O(ft()),this.O(ft()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class It{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=tt(this,t,e,0),o=!mt(t)||t!==this._$AH&&t!==X,o&&(this._$AH=t);else{const c=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=tt(this,c[s+a],e,a),d===X&&(d=this._$AH[a]),o||(o=!mt(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class $r extends It{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class br extends It{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class wr extends It{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??$)===X)return;const s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Ar{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const Yt=ht.litHtmlPolyfillSupport;Yt==null||Yt(gt,$t),(ht.litHtmlVersions??(ht.litHtmlVersions=[])).push("3.2.1");const Er=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new $t(t.insertBefore(ft(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let O=class extends W{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Er(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return X}};var Je;O._$litElement$=!0,O.finalized=!0,(Je=globalThis.litElementHydrateSupport)==null||Je.call(globalThis,{LitElement:O});const Qt=globalThis.litElementPolyfillSupport;Qt==null||Qt({LitElement:O});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");const fe=class fe extends O{render(){return b`
            <header class="header_layout">
                <!-- TODO: insert contents of header here -->
                <h1>Grocery Guru</h1>
                <nav class="nav_links">
                    <a href="../index.html">Home</a>
                    <a href="../nav_links/applications.html">Applications</a>
                    <a href="../nav_links/recipes.html">Recipes</a>
                    <a href="../nav_links/about.html">About</a>
                </nav>
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
                <a slot="actuator">
                    Hello,
                    <span id="userid"></span>
                </a>
                <div class="login">
                    <a href="nav_links/login.html">Login</a>
                </div>
            </header>
        `}toggleDarkMode(t){const e=t.target.checked;document.body.classList.toggle("dark-mode",e)}};fe.styles=Lt`
      /* TODO: Style the header here */

      .header_layout {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;

      }

      .header_layout .nav_links {
        display: flex;
        gap: 20px;
        padding-left: 25px;
      }

      .header_layout .login {
        margin-left: auto;
        padding-right: 10px;
      }

      body {
        font-family: var(--font-family-header);
        background-color: var(--color-background-page);
      }

      header {
        font-family: var(--font-family-header);
        background-color: var(--color-background-header);
        color: var(--color-text-inverted);

      }

      header a {
        color: var(--color-link-inverted);
      }

      body > section {
      }

      h1 {
        font-size: var(--size-type-xxlarge);
        font-style: oblique;
        line-height: 1;
        font-weight: var(--font-weight-bold);
      }

      h2 {
        font-size: var(--size-type-large);
        fontweight: var(--font-weight-bold);
      }

      h3 {
        font-size: var(--size-type-mlarge)
      }

      ul {
        font-size: var(--size-type-body);
      }

      a:link {
        color: var(--color-link);
      }
      
    `;let Rt=fe;Mt({"all-header":Rt,"mu-auth":ie.Provider});window.relayEvent=ii.relay;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Sr={attribute:!0,type:String,converter:Ot,reflect:!1,hasChanged:de},xr=(r=Sr,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(c){const a=t.get.call(this);t.set.call(this,c),this.requestUpdate(o,a,r)},init(c){return c!==void 0&&this.P(o,void 0,r),c}}}if(s==="setter"){const{name:o}=e;return function(c){const a=this[o];t.call(this,c),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function Is(r){return(t,e)=>typeof e=="object"?xr(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function T(r){return Is({...r,state:!0,attribute:!1})}var Pr=Object.defineProperty,kr=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Pr(t,e,i),i};const me=class me extends Ts{constructor(){super("guru:model"),this.searchQuery=""}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["applications/load"])}handleSearch(){const t=this.searchQuery.toLowerCase();this.dispatchMessage(["search/item",{query:t}]),this.searchQuery=""}render(){const{cartItems:t=[],totalCost:e=0}=this.model;return b`
      <main>
        <section class="search-section">
          <h2>Search for Items</h2>
          <div class="search-bar">
            <input
              type="text"
              id="item-name"
              placeholder="Enter item name..."
              .value="${this.searchQuery}"
              @input="${s=>this.searchQuery=s.target.value}"
            />
            <button @click="${this.handleSearch}">Add to Cart</button>
          </div>
        </section>

        <section class="cart-section">
          <h2>Your Cart</h2>
          <div class="cart-summary">
            <p>Total Items: ${t.length}</p>
            <p>Estimated Total: $${e.toFixed(2)}</p>
          </div>
          <ul class="cart-items">
            ${t.map(s=>b`
                  <li>
                    ${s.name} (Application: ${s.applicationName}): $
                    ${s.price.toFixed(2)}
                  </li>
                `)}
          </ul>
        </section>
      </main>
    `}};me.styles=Lt`
      main {
        padding: 20px;
      }

      .search-section {
        margin-bottom: 20px;
      }

      .search-bar {
        display: flex;
        gap: 10px;
      }

      input {
        flex: 1;
        padding: 10px;
      }

      button {
        padding: 10px 20px;
        cursor: pointer;
      }

      .cart-section {
        margin-top: 20px;
      }

      .cart-items {
        list-style-type: none;
        padding: 0;
        margin: 10px 0;
      }

      .cart-items li {
        padding: 5px 0;
      }
    `;let yt=me;kr([T()],yt.prototype,"searchQuery");Mt({"home-view":yt});var Cr=Object.defineProperty,js=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Cr(t,e,i),i};const ge=class ge extends O{constructor(){super(...arguments),this.itemId="",this.recipe=null}connectedCallback(){super.connectedCallback(),console.log("ConnectedCallback -> Item ID:",this.itemId),this.itemId?this.hydrate():console.error("Missing itemId for recipe.")}hydrate(){console.log("Fetching recipe with ID:",this.itemId),fetch(`/api/recipes/${this.itemId}`).then(t=>{if(t.ok)return t.json();throw new Error(`Error fetching recipe: ${t.statusText}`)}).then(t=>{this.recipe={...t,ingredients:t.ingredients||[],instructions:t.instructions||[]}}).catch(t=>{console.error("Failed to fetch recipe:",t)})}render(){if(!this.recipe)return b`<p>Loading recipe...</p>`;const{name:t,servings:e,prepTime:s,ingredients:i,instructions:n,notes:o}=this.recipe;return b`
      <main>
        <section class="recipe-section">
          <h2>${t}</h2>
          <p>Store: ${this.recipe.store}</p>
          <p>Servings: ${e}</p>
          <p>Prep Time: ${s}</p>

          <div class="ingredients">
            <h3>Ingredients</h3>
            <ul>
              ${i.map(c=>b`
                <li>${c.quantity} ${c.unit} ${c.itemName}</li>
              `)}
            </ul>
          </div>

          <div class="instructions">
            <h3>Instructions</h3>
            <ol>
              ${n.map(c=>b`<li>${c}</li>`)}
            </ol>
          </div>

          <div class="notes">
            <h3>Notes</h3>
            <p>${o||"No additional notes"}</p>
          </div>
        </section>
      </main>
    `}};ge.styles=Lt`
      main {
        padding: 20px;
      }

      .recipe-section {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      h2 {
        font-size: var(--size-type-xxlarge);
        font-family: var(--font-family-header);
        text-align: center;
      }

      .ingredients, .instructions, .notes {
        margin-top: 20px;
      }

      .ingredients ul, .instructions ol {
        padding-left: 20px;
        line-height: 1.6;
      }

      .notes p {
        font-style: italic;
      }
    `;let et=ge;js([Is({type:String})],et.prototype,"itemId");js([T()],et.prototype,"recipe");var Or=Object.defineProperty,st=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Or(t,e,i),i};const ye=class ye extends O{constructor(){super(...arguments),this.username="",this.password="",this.confirmPassword="",this.errorMessage="",this.successMessage="",this.isRegister=!1}handleLogin(){console.log("Attempting login with:",{username:this.username}),fetch("/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:this.username,password:this.password})}).then(t=>{if(t.ok)console.log("Login successful!"),window.location.href="/app";else throw new Error("Invalid username or password")}).catch(t=>{console.error("Login failed:",t),this.errorMessage="Invalid username or password. Please try again."})}handleRegister(){if(console.log("Attempting registration with:",{username:this.username,password:this.password,confirmPassword:this.confirmPassword}),this.password!==this.confirmPassword){this.errorMessage="Passwords do not match!";return}fetch("/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:this.username,password:this.password})}).then(t=>{if(t.ok)console.log("Registration successful!"),this.successMessage="Registration successful! You can now log in.",this.isRegister=!1,this.errorMessage="";else return t.json().then(e=>{throw new Error(e.message||"Registration failed")})}).catch(t=>{console.error("Registration failed:",t),this.errorMessage=t.message||"Registration failed. Please try again."})}toggleView(){this.isRegister=!this.isRegister,this.errorMessage="",this.successMessage="",this.username="",this.password="",this.confirmPassword=""}render(){return b`
        <main class="page">
            <section>
                <h3>${this.isRegister?"Register":"Login"}</h3>
                ${this.errorMessage?b`<p class="error-message">${this.errorMessage}</p>`:""}
                ${this.successMessage?b`<p class="success-message">${this.successMessage}</p>`:""}

                <form @submit="${t=>t.preventDefault()}">
                    <div>
                        <label for="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Enter your username"
                            .value="${this.username}"
                            @input="${t=>this.username=t.target.value}"
                        />
                    </div>
                    <div>
                        <label for="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            .value="${this.password}"
                            @input="${t=>this.password=t.target.value}"
                        />
                    </div>

                    ${this.isRegister?b`
                            <div>
                                <label for="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="Confirm your password"
                                    .value="${this.confirmPassword}"
                                    @input="${t=>this.confirmPassword=t.target.value}"
                                />
                            </div>
                          `:""}

                    <button @click="${this.isRegister?this.handleRegister:this.handleLogin}">
                        ${this.isRegister?"Register":"Login"}
                    </button>
                </form>

                <p>
                    ${this.isRegister?b`
                            Already have an account?
                            <a @click="${this.toggleView}" href="javascript:void(0)">Login</a>
                          `:b`
                            Don't have an account?
                            <a @click="${this.toggleView}" href="javascript:void(0)">Register</a>
                          `}
                </p>
            </section>
        </main>
      `}};ye.styles=Lt`
      main.page {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: var(--color-background);
      }

      section {
        max-width: 400px;
        width: 100%;
        background-color: var(--color-background-card);
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      h3 {
        text-align: center;
        margin-bottom: 20px;
      }

      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }

      input {
        width: 100%;
        padding: 10px;
        margin-bottom: 15px;
        border: 1px solid var(--color-border);
        border-radius: 4px;
      }

      button {
        width: 100%;
        padding: 10px;
        background-color: var(--color-primary);
        color: var(--color-text-light);
        font-size: var(--size-type-medium);
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      button:hover {
        background-color: var(--color-primary-dark);
      }

      p {
        text-align: center;
        margin-top: 15px;
      }

      .error-message {
        color: var(--color-error);
        text-align: center;
        margin-bottom: 10px;
      }

      .success-message {
        color: var(--color-success);
        text-align: center;
        margin-bottom: 10px;
      }
    `;let x=ye;st([T()],x.prototype,"username");st([T()],x.prototype,"password");st([T()],x.prototype,"confirmPassword");st([T()],x.prototype,"errorMessage");st([T()],x.prototype,"successMessage");st([T()],x.prototype,"isRegister");const Tr={applications:[],cartItems:[],totalCost:0};function Hs(r,t,e){switch(r[0]){case"applications/load":Rr(e).then(n=>t(o=>({...o,applications:n}))).catch(n=>{console.error("Failed to fetch applications:",n)});break;case"search/item":const{query:s}=r[1];t(n=>{const o=s.toLowerCase();let c=null;if(n.applications.forEach(a=>{a.items.forEach(d=>{d.name.toLowerCase().includes(o)&&(!c||d.price<c.price)&&(c={name:d.name,price:d.price,applicationName:a.name})})}),c){const{price:a}=c;return{...n,cartItems:[...n.cartItems,c],totalCost:n.totalCost+a}}else return console.warn(`No items found for query: ${s}`),n});break;case"cart/add":t(n=>({...n,cartItems:[...n.cartItems,r[1].item],totalCost:n.totalCost+r[1].item.price}));break;default:const i=r[0];throw new Error(`Unhandled Auth message "${i}"`)}}function Rr(r){return fetch("/api/applications",{headers:ie.headers(r)}).then(t=>{if(!t.ok)throw t.status===401?new Error("Unauthorized: User must log in."):new Error(`API error: ${t.statusText}`);return t.json()}).then(t=>{if(Array.isArray(t))return t;throw new Error("Unexpected response format")})}const _e=class _e extends O{render(){return b`
            <mu-switch></mu-switch>`}connectedCallback(){super.connectedCallback()}};_e.uses=Mt({"home-view":yt,"recipe-view":et,"login-view":x,"mu-store":class extends ds.Provider{constructor(){super(Hs,Tr,"guru:auth")}}});let te=_e;const Ur=[{path:"/app/recipes/:id",view:r=>b`
            <recipe-view itemId="${r.id}"></recipe-view>
        `},{path:"/app/login",view:()=>b`
            <login-view></login-view>`},{path:"/app",view:()=>b`
            <home-view></home-view>
        `},{path:"/",redirect:"/app"}];Mt({"mu-auth":ie.Provider,"mu-history":li.Provider,"mu-store":class extends ds.Provider{constructor(){super(Hs,{cartItems:[],applications:[],totalCost:0},"guru:auth")}},"mu-switch":class extends tr.Element{constructor(){super(Ur,"guru:history","guru:auth")}},"grocery-guru-app":te,"all-header":Rt,"recipe-view":et});
