(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function e(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(s){if(s.ep)return;s.ep=!0;const o=e(s);fetch(s.href,o)}})();var V,Oe;class ht extends Error{}ht.prototype.name="InvalidTokenError";function ti(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let i=e.charCodeAt(0).toString(16).toUpperCase();return i.length<2&&(i="0"+i),"%"+i}))}function ei(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return ti(t)}catch{return atob(t)}}function as(r,t){if(typeof r!="string")throw new ht("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,i=r.split(".")[e];if(typeof i!="string")throw new ht(`Invalid token specified: missing part #${e+1}`);let s;try{s=ei(i)}catch(o){throw new ht(`Invalid token specified: invalid base64 for part #${e+1} (${o.message})`)}try{return JSON.parse(s)}catch(o){throw new ht(`Invalid token specified: invalid json for part #${e+1} (${o.message})`)}}const si="mu:context",ee=`${si}:change`;class ii{constructor(t,e){this._proxy=ri(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ae extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new ii(t,this),this.style.display="contents"}attach(t){return this.addEventListener(ee,t),t}detach(t){this.removeEventListener(ee,t)}}function ri(r,t){return new Proxy(r,{get:(i,s,o)=>{if(s==="then")return;const n=Reflect.get(i,s,o);return console.log(`Context['${s}'] => `,n),n},set:(i,s,o,n)=>{const c=r[s];console.log(`Context['${s.toString()}'] <= `,o);const a=Reflect.set(i,s,o,n);if(a){let u=new CustomEvent(ee,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(u,{property:s,oldValue:c,value:o}),t.dispatchEvent(u)}else console.log(`Context['${s}] was not set to ${o}`);return a}})}function oi(r,t){const e=cs(t,r);return new Promise((i,s)=>{if(e){const o=e.localName;customElements.whenDefined(o).then(()=>i(e))}else s({context:t,reason:`No provider for this context "${t}:`})})}function cs(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const i=t.closest(e);if(i)return i;const s=t.getRootNode();if(s instanceof ShadowRoot)return cs(r,s.host)}class ni extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function ls(r="mu:message"){return(t,...e)=>t.dispatchEvent(new ni(e,r))}class ce{constructor(t,e,i="service:message",s=!0){this._pending=[],this._context=e,this._update=t,this._eventType=i,this._running=s}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const i=e.detail;this.consume(i)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function ai(r){return t=>({...t,...r})}const se="mu:auth:jwt",hs=class us extends ce{constructor(t,e){super((i,s)=>this.update(i,s),t,us.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:i,redirect:s}=t[1];return e(li(i)),Kt(s);case"auth/signout":return e(hi()),Kt(this._redirectForLogin);case"auth/redirect":return Kt(this._redirectForLogin,{next:window.location.href});default:const o=t[0];throw new Error(`Unhandled Auth message "${o}"`)}}};hs.EVENT_TYPE="auth:message";let ds=hs;const ps=ls(ds.EVENT_TYPE);function Kt(r,t={}){if(!r)return;const e=window.location.href,i=new URL(r,e);return Object.entries(t).forEach(([s,o])=>i.searchParams.set(s,o)),()=>{console.log("Redirecting to ",r),window.location.assign(i)}}class ci extends ae{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=G.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new ds(this.context,this.redirect).attach(this)}}class J{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(se),t}}class G extends J{constructor(t){super();const e=as(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new G(t);return localStorage.setItem(se,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(se);return t?G.authenticate(t):new J}}function li(r){return ai({user:G.authenticate(r),token:r})}function hi(){return r=>{const t=r.user;return{user:t&&t.authenticated?J.deauthenticate(t):t,token:""}}}function ui(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function di(r){return r.authenticated?as(r.token||""):{}}const xt=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:G,Provider:ci,User:J,dispatch:ps,headers:ui,payload:di},Symbol.toStringTag,{value:"Module"}));function Ot(r,t,e){const i=r.target,s=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,s),i.dispatchEvent(s),r.stopPropagation()}function ie(r,t="*"){return r.composedPath().find(i=>{const s=i;return s.tagName&&s.matches(t)})}const pi=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:ie,relay:Ot},Symbol.toStringTag,{value:"Module"}));function fs(r,...t){const e=r.map((s,o)=>o?[t[o-1],s]:[s]).flat().join("");let i=new CSSStyleSheet;return i.replaceSync(e),i}const fi=new DOMParser;function H(r,...t){const e=t.map(c),i=r.map((a,u)=>{if(u===0)return[a];const p=e[u-1];return p instanceof Node?[`<ins id="mu-html-${u-1}"></ins>`,a]:[p,a]}).flat().join(""),s=fi.parseFromString(i,"text/html"),o=s.head.childElementCount?s.head.children:s.body.children,n=new DocumentFragment;return n.replaceChildren(...o),e.forEach((a,u)=>{if(a instanceof Node){const p=n.querySelector(`ins#mu-html-${u}`);if(p){const h=p.parentNode;h==null||h.replaceChild(a,p)}else console.log("Missing insertion point:",`ins#mu-html-${u}`)}}),n;function c(a,u){if(a===null)return"";switch(typeof a){case"string":return Ue(a);case"bigint":case"boolean":case"number":case"symbol":return Ue(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const p=new DocumentFragment,h=a.map(c);return p.replaceChildren(...h),p}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Ue(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Dt(r,t={mode:"open"}){const e=r.attachShadow(t),i={template:s,styles:o};return i;function s(n){const c=n.firstElementChild,a=c&&c.tagName==="TEMPLATE"?c:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),i}function o(...n){e.adoptedStyleSheets=n}}V=class extends HTMLElement{constructor(){super(),this._state={},Dt(this).template(V.template).styles(V.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,i=t.value;e&&(this._state[e]=i)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),Ot(r,"mu-form:submit",this._state)})}set init(r){this._state=r||{},gi(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}},V.template=H`
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
  `,V.styles=fs`
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
  `;function gi(r,t){const e=Object.entries(r);for(const[i,s]of e){const o=t.querySelector(`[name="${i}"]`);if(o){const n=o;switch(n.type){case"checkbox":const c=n;c.checked=!!s;break;case"date":n.value=s.toISOString().substr(0,10);break;default:n.value=s;break}}}return r}const gs=class ms extends ce{constructor(t){super((e,i)=>this.update(e,i),t,ms.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:i,state:s}=t[1];e(yi(i,s));break}case"history/redirect":{const{href:i,state:s}=t[1];e(vi(i,s));break}}}};gs.EVENT_TYPE="history:message";let le=gs;class Ne extends ae{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=mi(t);if(e){const i=new URL(e.href);i.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),he(e,"history/navigate",{href:i.pathname+i.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new le(this.context).attach(this)}}function mi(r){const t=r.currentTarget,e=i=>i.tagName=="A"&&i.href;if(r.button===0)if(r.composed){const s=r.composedPath().find(e);return s||void 0}else{for(let i=r.target;i;i===t?null:i.parentElement)if(e(i))return i;return}}function yi(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function vi(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const he=ls(le.EVENT_TYPE),bi=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Ne,Provider:Ne,Service:le,dispatch:he},Symbol.toStringTag,{value:"Module"}));class ft{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,i)=>{if(this._provider){const s=new Ie(this._provider,t);this._effects.push(s),e(s)}else oi(this._target,this._contextLabel).then(s=>{const o=new Ie(s,t);this._provider=s,this._effects.push(o),s.attach(n=>this._handleChange(n)),e(o)}).catch(s=>console.log(`Observer ${this._contextLabel}: ${s}`,s))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Ie{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const ys=class vs extends HTMLElement{constructor(){super(),this._state={},this._user=new J,this._authObserver=new ft(this,"blazing:auth"),Dt(this).template(vs.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",i=this.isNew?"created":"updated",s=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;_i(s,this._state,e,this.authorization).then(o=>nt(o,this)).then(o=>{const n=`mu-rest-form:${i}`,c=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,[i]:o,url:s}});this.dispatchEvent(c)}).catch(o=>{const n="mu-rest-form:error",c=new CustomEvent(n,{bubbles:!0,composed:!0,detail:{method:e,error:o,url:s,request:this._state}});this.dispatchEvent(c)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const i=e.name,s=e.value;i&&(this._state[i]=s)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},nt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Le(this.src,this.authorization).then(e=>{this._state=e,nt(e,this)}))})}attributeChangedCallback(t,e,i){switch(t){case"src":this.src&&i&&i!==e&&!this.isNew&&Le(this.src,this.authorization).then(s=>{this._state=s,nt(s,this)});break;case"new":i&&(this._state={},nt({},this));break}}};ys.observedAttributes=["src","new","action"];ys.template=H`
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
  `;function Le(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function nt(r,t){const e=Object.entries(r);for(const[i,s]of e){const o=t.querySelector(`[name="${i}"]`);if(o){const n=o;switch(n.type){case"checkbox":const c=n;c.checked=!!s;break;default:n.value=s;break}}}return r}function _i(r,t,e="PUT",i={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...i},body:JSON.stringify(t)}).then(s=>{if(s.status!=200&&s.status!=201)throw`Form submission failed: Status ${s.status}`;return s.json()})}const bs=class _s extends ce{constructor(t,e){super(e,t,_s.EVENT_TYPE,!1)}};bs.EVENT_TYPE="mu:message";let $s=bs;class $i extends ae{constructor(t,e,i){super(e),this._user=new J,this._updateFn=t,this._authObserver=new ft(this,i)}connectedCallback(){const t=new $s(this.context,(e,i)=>this._updateFn(e,i,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const ws=Object.freeze(Object.defineProperty({__proto__:null,Provider:$i,Service:$s},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tt=globalThis,ue=Tt.ShadowRoot&&(Tt.ShadyCSS===void 0||Tt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,de=Symbol(),Me=new WeakMap;let xs=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==de)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ue&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=Me.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Me.set(e,t))}return t}toString(){return this.cssText}};const wi=r=>new xs(typeof r=="string"?r:r+"",void 0,de),xi=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((i,s,o)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[o+1],r[0]);return new xs(e,r,de)},Ai=(r,t)=>{if(ue)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),s=Tt.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},je=ue?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return wi(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ei,defineProperty:Si,getOwnPropertyDescriptor:ki,getOwnPropertyNames:Pi,getOwnPropertySymbols:Ci,getPrototypeOf:Ti}=Object,Z=globalThis,He=Z.trustedTypes,Ri=He?He.emptyScript:"",ze=Z.reactiveElementPolyfillSupport,ut=(r,t)=>r,Ut={toAttribute(r,t){switch(t){case Boolean:r=r?Ri:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},pe=(r,t)=>!Ei(r,t),De={attribute:!0,type:String,converter:Ut,reflect:!1,hasChanged:pe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Z.litPropertyMetadata??(Z.litPropertyMetadata=new WeakMap);let W=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=De){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&Si(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=ki(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get(){return s==null?void 0:s.call(this)},set(n){const c=s==null?void 0:s.call(this);o.call(this,n),this.requestUpdate(t,c,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??De}static _$Ei(){if(this.hasOwnProperty(ut("elementProperties")))return;const t=Ti(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ut("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ut("properties"))){const e=this.properties,i=[...Pi(e),...Ci(e)];for(const s of i)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const s of i)e.unshift(je(s))}else t!==void 0&&e.push(je(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ai(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostConnected)==null?void 0:i.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostDisconnected)==null?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){var i;const s=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,s);if(o!==void 0&&s.reflect===!0){const n=(((i=s.converter)==null?void 0:i.toAttribute)!==void 0?s.converter:Ut).toAttribute(e,s.type);this._$Em=t,n==null?this.removeAttribute(o):this.setAttribute(o,n),this._$Em=null}}_$AK(t,e){var i;const s=this.constructor,o=s._$Eh.get(t);if(o!==void 0&&this._$Em!==o){const n=s.getPropertyOptions(o),c=typeof n.converter=="function"?{fromAttribute:n.converter}:((i=n.converter)==null?void 0:i.fromAttribute)!==void 0?n.converter:Ut;this._$Em=o,this[o]=c.fromAttribute(e,n.type),this._$Em=null}}requestUpdate(t,e,i){if(t!==void 0){if(i??(i=this.constructor.getPropertyOptions(t)),!(i.hasChanged??pe)(this[t],e))return;this.P(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),i.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[o,n]of s)n.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],n)}let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),(t=this._$EO)==null||t.forEach(s=>{var o;return(o=s.hostUpdate)==null?void 0:o.call(s)}),this.update(i)):this._$EU()}catch(s){throw e=!1,this._$EU(),s}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};W.elementStyles=[],W.shadowRootOptions={mode:"open"},W[ut("elementProperties")]=new Map,W[ut("finalized")]=new Map,ze==null||ze({ReactiveElement:W}),(Z.reactiveElementVersions??(Z.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Nt=globalThis,It=Nt.trustedTypes,Fe=It?It.createPolicy("lit-html",{createHTML:r=>r}):void 0,As="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,Es="?"+C,Oi=`<${Es}>`,z=document,gt=()=>z.createComment(""),mt=r=>r===null||typeof r!="object"&&typeof r!="function",fe=Array.isArray,Ui=r=>fe(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Jt=`[ 	
\f\r]`,at=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,qe=/-->/g,Be=/>/g,I=RegExp(`>|${Jt}(?:([^\\s"'>=/]+)(${Jt}*=${Jt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ve=/'/g,Qe=/"/g,Ss=/^(?:script|style|textarea|title)$/i,Ni=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),ct=Ni(1),X=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),We=new WeakMap,M=z.createTreeWalker(z,129);function ks(r,t){if(!fe(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Fe!==void 0?Fe.createHTML(t):t}const Ii=(r,t)=>{const e=r.length-1,i=[];let s,o=t===2?"<svg>":t===3?"<math>":"",n=at;for(let c=0;c<e;c++){const a=r[c];let u,p,h=-1,l=0;for(;l<a.length&&(n.lastIndex=l,p=n.exec(a),p!==null);)l=n.lastIndex,n===at?p[1]==="!--"?n=qe:p[1]!==void 0?n=Be:p[2]!==void 0?(Ss.test(p[2])&&(s=RegExp("</"+p[2],"g")),n=I):p[3]!==void 0&&(n=I):n===I?p[0]===">"?(n=s??at,h=-1):p[1]===void 0?h=-2:(h=n.lastIndex-p[2].length,u=p[1],n=p[3]===void 0?I:p[3]==='"'?Qe:Ve):n===Qe||n===Ve?n=I:n===qe||n===Be?n=at:(n=I,s=void 0);const d=n===I&&r[c+1].startsWith("/>")?" ":"";o+=n===at?a+Oi:h>=0?(i.push(u),a.slice(0,h)+As+a.slice(h)+C+d):a+C+(h===-2?c:d)}return[ks(r,o+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]};let re=class Ps{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const c=t.length-1,a=this.parts,[u,p]=Ii(t,e);if(this.el=Ps.createElement(u,i),M.currentNode=this.el.content,e===2||e===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=M.nextNode())!==null&&a.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(const h of s.getAttributeNames())if(h.endsWith(As)){const l=p[n++],d=s.getAttribute(h).split(C),f=/([.?@])?(.*)/.exec(l);a.push({type:1,index:o,name:f[2],strings:d,ctor:f[1]==="."?Mi:f[1]==="?"?ji:f[1]==="@"?Hi:Ft}),s.removeAttribute(h)}else h.startsWith(C)&&(a.push({type:6,index:o}),s.removeAttribute(h));if(Ss.test(s.tagName)){const h=s.textContent.split(C),l=h.length-1;if(l>0){s.textContent=It?It.emptyScript:"";for(let d=0;d<l;d++)s.append(h[d],gt()),M.nextNode(),a.push({type:2,index:++o});s.append(h[l],gt())}}}else if(s.nodeType===8)if(s.data===Es)a.push({type:2,index:o});else{let h=-1;for(;(h=s.data.indexOf(C,h+1))!==-1;)a.push({type:7,index:o}),h+=C.length-1}o++}}static createElement(t,e){const i=z.createElement("template");return i.innerHTML=t,i}};function tt(r,t,e=r,i){var s,o;if(t===X)return t;let n=i!==void 0?(s=e.o)==null?void 0:s[i]:e.l;const c=mt(t)?void 0:t._$litDirective$;return(n==null?void 0:n.constructor)!==c&&((o=n==null?void 0:n._$AO)==null||o.call(n,!1),c===void 0?n=void 0:(n=new c(r),n._$AT(r,e,i)),i!==void 0?(e.o??(e.o=[]))[i]=n:e.l=n),n!==void 0&&(t=tt(r,n._$AS(r,t.values),n,i)),t}class Li{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=((t==null?void 0:t.creationScope)??z).importNode(e,!0);M.currentNode=s;let o=M.nextNode(),n=0,c=0,a=i[0];for(;a!==void 0;){if(n===a.index){let u;a.type===2?u=new At(o,o.nextSibling,this,t):a.type===1?u=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(u=new zi(o,this,t)),this._$AV.push(u),a=i[++c]}n!==(a==null?void 0:a.index)&&(o=M.nextNode(),n++)}return M.currentNode=z,s}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class At{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,i,s){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this.v=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),mt(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==X&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ui(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&mt(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){var e;const{values:i,_$litType$:s}=t,o=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=re.createElement(ks(s.h,s.h[0]),this.options)),s);if(((e=this._$AH)==null?void 0:e._$AD)===o)this._$AH.p(i);else{const n=new Li(o,this),c=n.u(this.options);n.p(i),this.T(c),this._$AH=n}}_$AC(t){let e=We.get(t.strings);return e===void 0&&We.set(t.strings,e=new re(t)),e}k(t){fe(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new At(this.O(gt()),this.O(gt()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Ft{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=_}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(o===void 0)t=tt(this,t,e,0),n=!mt(t)||t!==this._$AH&&t!==X,n&&(this._$AH=t);else{const c=t;let a,u;for(t=o[0],a=0;a<o.length-1;a++)u=tt(this,c[i+a],e,a),u===X&&(u=this._$AH[a]),n||(n=!mt(u)||u!==this._$AH[a]),u===_?t=_:t!==_&&(t+=(u??"")+o[a+1]),this._$AH[a]=u}n&&!s&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Mi extends Ft{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}}class ji extends Ft{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}}class Hi extends Ft{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??_)===X)return;const i=this._$AH,s=t===_&&i!==_||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==_&&(i===_||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class zi{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const Ye=Nt.litHtmlPolyfillSupport;Ye==null||Ye(re,At),(Nt.litHtmlVersions??(Nt.litHtmlVersions=[])).push("3.2.0");const Di=(r,t,e)=>{const i=(e==null?void 0:e.renderBefore)??t;let s=i._$litPart$;if(s===void 0){const o=(e==null?void 0:e.renderBefore)??null;i._$litPart$=s=new At(t.insertBefore(gt(),o),o,void 0,e??{})}return s._$AI(r),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let K=class extends W{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Di(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return X}};K._$litElement$=!0,K.finalized=!0,(Oe=globalThis.litElementHydrateSupport)==null||Oe.call(globalThis,{LitElement:K});const Ke=globalThis.litElementPolyfillSupport;Ke==null||Ke({LitElement:K});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Fi={attribute:!0,type:String,converter:Ut,reflect:!1,hasChanged:pe},qi=(r=Fi,t,e)=>{const{kind:i,metadata:s}=e;let o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),o.set(e.name,r),i==="accessor"){const{name:n}=e;return{set(c){const a=t.get.call(this);t.set.call(this,c),this.requestUpdate(n,a,r)},init(c){return c!==void 0&&this.P(n,void 0,r),c}}}if(i==="setter"){const{name:n}=e;return function(c){const a=this[n];t.call(this,c),this.requestUpdate(n,a,r)}}throw Error("Unsupported decorator location: "+i)};function Cs(r){return(t,e)=>typeof e=="object"?qi(r,t,e):((i,s,o)=>{const n=s.hasOwnProperty(o);return s.constructor.createProperty(o,n?{...i,wrapped:!0}:i),n?Object.getOwnPropertyDescriptor(s,o):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ts(r){return Cs({...r,state:!0,attribute:!1})}function Bi(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function Vi(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Rs={};(function(r){var t=function(){var e=function(h,l,d,f){for(d=d||{},f=h.length;f--;d[h[f]]=l);return d},i=[1,9],s=[1,10],o=[1,11],n=[1,12],c=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(l,d,f,m,g,v,Bt){var x=v.length-1;switch(g){case 1:return new m.Root({},[v[x-1]]);case 2:return new m.Root({},[new m.Literal({value:""})]);case 3:this.$=new m.Concat({},[v[x-1],v[x]]);break;case 4:case 5:this.$=v[x];break;case 6:this.$=new m.Literal({value:v[x]});break;case 7:this.$=new m.Splat({name:v[x]});break;case 8:this.$=new m.Param({name:v[x]});break;case 9:this.$=new m.Optional({},[v[x-1]]);break;case 10:this.$=l;break;case 11:case 12:this.$=l.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:i,13:s,14:o,15:n},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:i,13:s,14:o,15:n},{1:[2,2]},e(c,[2,4]),e(c,[2,5]),e(c,[2,6]),e(c,[2,7]),e(c,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:i,13:s,14:o,15:n},e(c,[2,10]),e(c,[2,11]),e(c,[2,12]),{1:[2,1]},e(c,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:i,12:[1,16],13:s,14:o,15:n},e(c,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(l,d){if(d.recoverable)this.trace(l);else{let f=function(m,g){this.message=m,this.hash=g};throw f.prototype=Error,new f(l,d)}},parse:function(l){var d=this,f=[0],m=[null],g=[],v=this.table,Bt="",x=0,Ce=0,Js=2,Te=1,Gs=g.slice.call(arguments,1),b=Object.create(this.lexer),U={yy:{}};for(var Vt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Vt)&&(U.yy[Vt]=this.yy[Vt]);b.setInput(l,U.yy),U.yy.lexer=b,U.yy.parser=this,typeof b.yylloc>"u"&&(b.yylloc={});var Qt=b.yylloc;g.push(Qt);var Zs=b.options&&b.options.ranges;typeof U.yy.parseError=="function"?this.parseError=U.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Xs=function(){var B;return B=b.lex()||Te,typeof B!="number"&&(B=d.symbols_[B]||B),B},w,N,A,Wt,q={},Pt,S,Re,Ct;;){if(N=f[f.length-1],this.defaultActions[N]?A=this.defaultActions[N]:((w===null||typeof w>"u")&&(w=Xs()),A=v[N]&&v[N][w]),typeof A>"u"||!A.length||!A[0]){var Yt="";Ct=[];for(Pt in v[N])this.terminals_[Pt]&&Pt>Js&&Ct.push("'"+this.terminals_[Pt]+"'");b.showPosition?Yt="Parse error on line "+(x+1)+`:
`+b.showPosition()+`
Expecting `+Ct.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Yt="Parse error on line "+(x+1)+": Unexpected "+(w==Te?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Yt,{text:b.match,token:this.terminals_[w]||w,line:b.yylineno,loc:Qt,expected:Ct})}if(A[0]instanceof Array&&A.length>1)throw new Error("Parse Error: multiple actions possible at state: "+N+", token: "+w);switch(A[0]){case 1:f.push(w),m.push(b.yytext),g.push(b.yylloc),f.push(A[1]),w=null,Ce=b.yyleng,Bt=b.yytext,x=b.yylineno,Qt=b.yylloc;break;case 2:if(S=this.productions_[A[1]][1],q.$=m[m.length-S],q._$={first_line:g[g.length-(S||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(S||1)].first_column,last_column:g[g.length-1].last_column},Zs&&(q._$.range=[g[g.length-(S||1)].range[0],g[g.length-1].range[1]]),Wt=this.performAction.apply(q,[Bt,Ce,x,U.yy,A[1],m,g].concat(Gs)),typeof Wt<"u")return Wt;S&&(f=f.slice(0,-1*S*2),m=m.slice(0,-1*S),g=g.slice(0,-1*S)),f.push(this.productions_[A[1]][0]),m.push(q.$),g.push(q._$),Re=v[f[f.length-2]][f[f.length-1]],f.push(Re);break;case 3:return!0}}return!0}},u=function(){var h={EOF:1,parseError:function(d,f){if(this.yy.parser)this.yy.parser.parseError(d,f);else throw new Error(d)},setInput:function(l,d){return this.yy=d||this.yy||{},this._input=l,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var l=this._input[0];this.yytext+=l,this.yyleng++,this.offset++,this.match+=l,this.matched+=l;var d=l.match(/(?:\r\n?|\n).*/g);return d?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),l},unput:function(l){var d=l.length,f=l.split(/(?:\r\n?|\n)/g);this._input=l+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-d),this.offset-=d;var m=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),f.length-1&&(this.yylineno-=f.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:f?(f.length===m.length?this.yylloc.first_column:0)+m[m.length-f.length].length-f[0].length:this.yylloc.first_column-d},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-d]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(l){this.unput(this.match.slice(l))},pastInput:function(){var l=this.matched.substr(0,this.matched.length-this.match.length);return(l.length>20?"...":"")+l.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var l=this.match;return l.length<20&&(l+=this._input.substr(0,20-l.length)),(l.substr(0,20)+(l.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var l=this.pastInput(),d=new Array(l.length+1).join("-");return l+this.upcomingInput()+`
`+d+"^"},test_match:function(l,d){var f,m,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),m=l[0].match(/(?:\r\n?|\n).*/g),m&&(this.yylineno+=m.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:m?m[m.length-1].length-m[m.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+l[0].length},this.yytext+=l[0],this.match+=l[0],this.matches=l,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(l[0].length),this.matched+=l[0],f=this.performAction.call(this,this.yy,this,d,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),f)return f;if(this._backtrack){for(var v in g)this[v]=g[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var l,d,f,m;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),v=0;v<g.length;v++)if(f=this._input.match(this.rules[g[v]]),f&&(!d||f[0].length>d[0].length)){if(d=f,m=v,this.options.backtrack_lexer){if(l=this.test_match(f,g[v]),l!==!1)return l;if(this._backtrack){d=!1;continue}else return!1}else if(!this.options.flex)break}return d?(l=this.test_match(d,g[m]),l!==!1?l:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var d=this.next();return d||this.lex()},begin:function(d){this.conditionStack.push(d)},popState:function(){var d=this.conditionStack.length-1;return d>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(d){return d=this.conditionStack.length-1-Math.abs(d||0),d>=0?this.conditionStack[d]:"INITIAL"},pushState:function(d){this.begin(d)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(d,f,m,g){switch(m){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return h}();a.lexer=u;function p(){this.yy={}}return p.prototype=a,a.Parser=p,new p}();typeof Vi<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(Rs);function Q(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var Os={Root:Q("Root"),Concat:Q("Concat"),Literal:Q("Literal"),Splat:Q("Splat"),Param:Q("Param"),Optional:Q("Optional")},Us=Rs.parser;Us.yy=Os;var Qi=Us,Wi=Object.keys(Os);function Yi(r){return Wi.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var Ns=Yi,Ki=Ns,Ji=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Is(r){this.captures=r.captures,this.re=r.re}Is.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(i,s){typeof t[s+1]>"u"?e[i]=void 0:e[i]=decodeURIComponent(t[s+1])}),e};var Gi=Ki({Concat:function(r){return r.children.reduce((function(t,e){var i=this.visit(e);return{re:t.re+i.re,captures:t.captures.concat(i.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(Ji,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new Is({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Zi=Gi,Xi=Ns,tr=Xi({Concat:function(r,t){var e=r.children.map((function(i){return this.visit(i,t)}).bind(this));return e.some(function(i){return i===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),er=tr,sr=Qi,ir=Zi,rr=er;Et.prototype=Object.create(null);Et.prototype.match=function(r){var t=ir.visit(this.ast),e=t.match(r);return e||!1};Et.prototype.reverse=function(r){return rr.visit(this.ast,r)};function Et(r){var t;if(this?t=this:t=Object.create(Et.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=sr.parse(r),t}var or=Et,nr=or,ar=nr;const cr=Bi(ar);var lr=Object.defineProperty,Ls=(r,t,e,i)=>{for(var s=void 0,o=r.length-1,n;o>=0;o--)(n=r[o])&&(s=n(t,e,s)||s);return s&&lr(t,e,s),s};const Ms=class extends K{constructor(t,e,i=""){super(),this._cases=[],this._fallback=()=>ct` <h1>Not Found</h1> `,this._cases=t.map(s=>({...s,route:new cr(s.path)})),this._historyObserver=new ft(this,e),this._authObserver=new ft(this,i)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ct` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(ps(this,"auth/redirect"),ct` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):ct` <h1>Authenticating</h1> `;if("redirect"in e){const i=e.redirect;if(typeof i=="string")return this.redirect(i),ct` <h1>Redirecting to ${i}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:i}=t,s=new URLSearchParams(e),o=i+e;for(const n of this._cases){const c=n.route.match(o);if(c)return{...n,path:i,params:c,query:s}}}redirect(t){he(this,"history/redirect",{href:t})}};Ms.styles=xi`
    :host,
    main {
      display: contents;
    }
  `;let Lt=Ms;Ls([Ts()],Lt.prototype,"_user");Ls([Ts()],Lt.prototype,"_match");const hr=Object.freeze(Object.defineProperty({__proto__:null,Element:Lt,Switch:Lt},Symbol.toStringTag,{value:"Module"})),ur=class js extends HTMLElement{constructor(){if(super(),Dt(this).template(js.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};ur.template=H`
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
  `;const Hs=class oe extends HTMLElement{constructor(){super(),this._array=[],Dt(this).template(oe.template).styles(oe.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(zs("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const i=new Event("change",{bubbles:!0}),s=e.value,o=e.closest("label");if(o){const n=Array.from(this.children).indexOf(o);this._array[n]=s,this.dispatchEvent(i)}}}),this.addEventListener("click",t=>{ie(t,"button.add")?Ot(t,"input-array:add"):ie(t,"button.remove")&&Ot(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],dr(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const i=Array.from(this.children).indexOf(e);this._array.splice(i,1),e.remove()}}};Hs.template=H`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Hs.styles=fs`
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
  `;function dr(r,t){t.replaceChildren(),r.forEach((e,i)=>t.append(zs(e)))}function zs(r,t){const e=r===void 0?H`<input />`:H`<input value="${r}" />`;return H`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function F(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var pr=Object.defineProperty,fr=Object.getOwnPropertyDescriptor,gr=(r,t,e,i)=>{for(var s=fr(t,e),o=r.length-1,n;o>=0;o--)(n=r[o])&&(s=n(t,e,s)||s);return s&&pr(t,e,s),s};class St extends K{constructor(t){super(),this._pending=[],this._observer=new ft(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([i,s])=>{console.log("Dispatching queued event",s,i),i.dispatchEvent(s)}),e.setEffect(()=>{var i;if(console.log("View effect",this,e,(i=this._context)==null?void 0:i.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const i=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",i),e.dispatchEvent(i)):(console.log("Queueing message event",i),this._pending.push([e,i]))}ref(t){return this.model?this.model[t]:void 0}}gr([Cs()],St.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rt=globalThis,ge=Rt.ShadowRoot&&(Rt.ShadyCSS===void 0||Rt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,me=Symbol(),Je=new WeakMap;let Ds=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==me)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ge&&t===void 0){const i=e!==void 0&&e.length===1;i&&(t=Je.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Je.set(e,t))}return t}toString(){return this.cssText}};const mr=r=>new Ds(typeof r=="string"?r:r+"",void 0,me),O=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((i,s,o)=>i+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+r[o+1],r[0]);return new Ds(e,r,me)},yr=(r,t)=>{if(ge)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const i=document.createElement("style"),s=Rt.litNonce;s!==void 0&&i.setAttribute("nonce",s),i.textContent=e.cssText,r.appendChild(i)}},Ge=ge?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return mr(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:vr,defineProperty:br,getOwnPropertyDescriptor:_r,getOwnPropertyNames:$r,getOwnPropertySymbols:wr,getPrototypeOf:xr}=Object,R=globalThis,Ze=R.trustedTypes,Ar=Ze?Ze.emptyScript:"",Gt=R.reactiveElementPolyfillSupport,dt=(r,t)=>r,Mt={toAttribute(r,t){switch(t){case Boolean:r=r?Ar:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ye=(r,t)=>!vr(r,t),Xe={attribute:!0,type:String,converter:Mt,reflect:!1,hasChanged:ye};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),R.litPropertyMetadata??(R.litPropertyMetadata=new WeakMap);class Y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Xe){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);s!==void 0&&br(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=_r(this.prototype,t)??{get(){return this[e]},set(n){this[e]=n}};return{get(){return s==null?void 0:s.call(this)},set(n){const c=s==null?void 0:s.call(this);o.call(this,n),this.requestUpdate(t,c,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Xe}static _$Ei(){if(this.hasOwnProperty(dt("elementProperties")))return;const t=xr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(dt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(dt("properties"))){const e=this.properties,i=[...$r(e),...wr(e)];for(const s of i)this.createProperty(s,e[s])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[i,s]of e)this.elementProperties.set(i,s)}this._$Eh=new Map;for(const[e,i]of this.elementProperties){const s=this._$Eu(e,i);s!==void 0&&this._$Eh.set(s,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const s of i)e.unshift(Ge(s))}else t!==void 0&&e.push(Ge(t));return e}static _$Eu(t,e){const i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return yr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostConnected)==null?void 0:i.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var i;return(i=e.hostDisconnected)==null?void 0:i.call(e)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EC(t,e){var o;const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(s!==void 0&&i.reflect===!0){const n=(((o=i.converter)==null?void 0:o.toAttribute)!==void 0?i.converter:Mt).toAttribute(e,i.type);this._$Em=t,n==null?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){var o;const i=this.constructor,s=i._$Eh.get(t);if(s!==void 0&&this._$Em!==s){const n=i.getPropertyOptions(s),c=typeof n.converter=="function"?{fromAttribute:n.converter}:((o=n.converter)==null?void 0:o.fromAttribute)!==void 0?n.converter:Mt;this._$Em=s,this[s]=c.fromAttribute(e,n.type),this._$Em=null}}requestUpdate(t,e,i){if(t!==void 0){if(i??(i=this.constructor.getPropertyOptions(t)),!(i.hasChanged??ye)(this[t],e))return;this.P(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,i){this._$AL.has(t)||this._$AL.set(t,e),i.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var i;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[o,n]of this._$Ep)this[o]=n;this._$Ep=void 0}const s=this.constructor.elementProperties;if(s.size>0)for(const[o,n]of s)n.wrapped!==!0||this._$AL.has(o)||this[o]===void 0||this.P(o,this[o],n)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(i=this._$EO)==null||i.forEach(s=>{var o;return(o=s.hostUpdate)==null?void 0:o.call(s)}),this.update(e)):this._$EU()}catch(s){throw t=!1,this._$EU(),s}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(i=>{var s;return(s=i.hostUpdated)==null?void 0:s.call(i)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},Y[dt("elementProperties")]=new Map,Y[dt("finalized")]=new Map,Gt==null||Gt({ReactiveElement:Y}),(R.reactiveElementVersions??(R.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const pt=globalThis,jt=pt.trustedTypes,ts=jt?jt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Fs="$lit$",T=`lit$${Math.random().toFixed(9).slice(2)}$`,qs="?"+T,Er=`<${qs}>`,D=document,yt=()=>D.createComment(""),vt=r=>r===null||typeof r!="object"&&typeof r!="function",ve=Array.isArray,Sr=r=>ve(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Zt=`[ 	
\f\r]`,lt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,es=/-->/g,ss=/>/g,L=RegExp(`>|${Zt}(?:([^\\s"'>=/]+)(${Zt}*=${Zt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),is=/'/g,rs=/"/g,Bs=/^(?:script|style|textarea|title)$/i,kr=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),y=kr(1),et=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),os=new WeakMap,j=D.createTreeWalker(D,129);function Vs(r,t){if(!ve(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return ts!==void 0?ts.createHTML(t):t}const Pr=(r,t)=>{const e=r.length-1,i=[];let s,o=t===2?"<svg>":t===3?"<math>":"",n=lt;for(let c=0;c<e;c++){const a=r[c];let u,p,h=-1,l=0;for(;l<a.length&&(n.lastIndex=l,p=n.exec(a),p!==null);)l=n.lastIndex,n===lt?p[1]==="!--"?n=es:p[1]!==void 0?n=ss:p[2]!==void 0?(Bs.test(p[2])&&(s=RegExp("</"+p[2],"g")),n=L):p[3]!==void 0&&(n=L):n===L?p[0]===">"?(n=s??lt,h=-1):p[1]===void 0?h=-2:(h=n.lastIndex-p[2].length,u=p[1],n=p[3]===void 0?L:p[3]==='"'?rs:is):n===rs||n===is?n=L:n===es||n===ss?n=lt:(n=L,s=void 0);const d=n===L&&r[c+1].startsWith("/>")?" ":"";o+=n===lt?a+Er:h>=0?(i.push(u),a.slice(0,h)+Fs+a.slice(h)+T+d):a+T+(h===-2?c:d)}return[Vs(r,o+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]};class bt{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const c=t.length-1,a=this.parts,[u,p]=Pr(t,e);if(this.el=bt.createElement(u,i),j.currentNode=this.el.content,e===2||e===3){const h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=j.nextNode())!==null&&a.length<c;){if(s.nodeType===1){if(s.hasAttributes())for(const h of s.getAttributeNames())if(h.endsWith(Fs)){const l=p[n++],d=s.getAttribute(h).split(T),f=/([.?@])?(.*)/.exec(l);a.push({type:1,index:o,name:f[2],strings:d,ctor:f[1]==="."?Tr:f[1]==="?"?Rr:f[1]==="@"?Or:qt}),s.removeAttribute(h)}else h.startsWith(T)&&(a.push({type:6,index:o}),s.removeAttribute(h));if(Bs.test(s.tagName)){const h=s.textContent.split(T),l=h.length-1;if(l>0){s.textContent=jt?jt.emptyScript:"";for(let d=0;d<l;d++)s.append(h[d],yt()),j.nextNode(),a.push({type:2,index:++o});s.append(h[l],yt())}}}else if(s.nodeType===8)if(s.data===qs)a.push({type:2,index:o});else{let h=-1;for(;(h=s.data.indexOf(T,h+1))!==-1;)a.push({type:7,index:o}),h+=T.length-1}o++}}static createElement(t,e){const i=D.createElement("template");return i.innerHTML=t,i}}function st(r,t,e=r,i){var n,c;if(t===et)return t;let s=i!==void 0?(n=e._$Co)==null?void 0:n[i]:e._$Cl;const o=vt(t)?void 0:t._$litDirective$;return(s==null?void 0:s.constructor)!==o&&((c=s==null?void 0:s._$AO)==null||c.call(s,!1),o===void 0?s=void 0:(s=new o(r),s._$AT(r,e,i)),i!==void 0?(e._$Co??(e._$Co=[]))[i]=s:e._$Cl=s),s!==void 0&&(t=st(r,s._$AS(r,t.values),s,i)),t}class Cr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=((t==null?void 0:t.creationScope)??D).importNode(e,!0);j.currentNode=s;let o=j.nextNode(),n=0,c=0,a=i[0];for(;a!==void 0;){if(n===a.index){let u;a.type===2?u=new kt(o,o.nextSibling,this,t):a.type===1?u=new a.ctor(o,a.name,a.strings,this,t):a.type===6&&(u=new Ur(o,this,t)),this._$AV.push(u),a=i[++c]}n!==(a==null?void 0:a.index)&&(o=j.nextNode(),n++)}return j.currentNode=D,s}p(t){let e=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class kt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=(s==null?void 0:s.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=st(this,t,e),vt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==et&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Sr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&vt(this._$AH)?this._$AA.nextSibling.data=t:this.T(D.createTextNode(t)),this._$AH=t}$(t){var o;const{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=bt.createElement(Vs(i.h,i.h[0]),this.options)),i);if(((o=this._$AH)==null?void 0:o._$AD)===s)this._$AH.p(e);else{const n=new Cr(s,this),c=n.u(this.options);n.p(e),this.T(c),this._$AH=n}}_$AC(t){let e=os.get(t.strings);return e===void 0&&os.set(t.strings,e=new bt(t)),e}k(t){ve(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new kt(this.O(yt()),this.O(yt()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for((i=this._$AP)==null?void 0:i.call(this,!1,!0,e);t&&t!==this._$AB;){const s=t.nextSibling;t.remove(),t=s}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class qt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=$}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(o===void 0)t=st(this,t,e,0),n=!vt(t)||t!==this._$AH&&t!==et,n&&(this._$AH=t);else{const c=t;let a,u;for(t=o[0],a=0;a<o.length-1;a++)u=st(this,c[i+a],e,a),u===et&&(u=this._$AH[a]),n||(n=!vt(u)||u!==this._$AH[a]),u===$?t=$:t!==$&&(t+=(u??"")+o[a+1]),this._$AH[a]=u}n&&!s&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Tr extends qt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Rr extends qt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Or extends qt{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=st(this,t,e,0)??$)===et)return;const i=this._$AH,s=t===$&&i!==$||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==$&&(i===$||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Ur{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){st(this,t)}}const Xt=pt.litHtmlPolyfillSupport;Xt==null||Xt(bt,kt),(pt.litHtmlVersions??(pt.litHtmlVersions=[])).push("3.2.1");const Nr=(r,t,e)=>{const i=(e==null?void 0:e.renderBefore)??t;let s=i._$litPart$;if(s===void 0){const o=(e==null?void 0:e.renderBefore)??null;i._$litPart$=s=new kt(t.insertBefore(yt(),o),o,void 0,e??{})}return s._$AI(r),s};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let k=class extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Nr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return et}};var ns;k._$litElement$=!0,k.finalized=!0,(ns=globalThis.litElementHydrateSupport)==null||ns.call(globalThis,{LitElement:k});const te=globalThis.litElementPolyfillSupport;te==null||te({LitElement:k});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");const _e=class _e extends k{constructor(){super(...arguments),this.username=""}connectedCallback(){super.connectedCallback(),this.username=localStorage.getItem("username")||""}toggleDarkMode(t){const e=t.target.checked;document.body.classList.toggle("dark-mode",e)}signOut(){localStorage.removeItem("username"),this.username="",this.requestUpdate()}render(){return y`
      <header class="header_layout">
        <h1>AppTrak</h1>
        <nav class="nav_links">
          <a href="../app">Home</a>
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

          <!-- Conditionally render username or login link -->
          <div class="login">
            ${this.username?y`
                  <span>Hello, ${this.username}</span>
                  <button @click="${this.signOut}">Sign Out</button>
                `:y`<a href="../app/login">Login</a>`}
          </div>
        </div>
      </header>
    `}};_e.styles=O`
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
  `;let Ht=_e;F({"all-header":Ht,"mu-auth":xt.Provider});window.relayEvent=pi.relay;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ir={attribute:!0,type:String,converter:Mt,reflect:!1,hasChanged:ye},Lr=(r=Ir,t,e)=>{const{kind:i,metadata:s}=e;let o=globalThis.litPropertyMetadata.get(s);if(o===void 0&&globalThis.litPropertyMetadata.set(s,o=new Map),o.set(e.name,r),i==="accessor"){const{name:n}=e;return{set(c){const a=t.get.call(this);t.set.call(this,c),this.requestUpdate(n,a,r)},init(c){return c!==void 0&&this.P(n,void 0,r),c}}}if(i==="setter"){const{name:n}=e;return function(c){const a=this[n];t.call(this,c),this.requestUpdate(n,a,r)}}throw Error("Unsupported decorator location: "+i)};function be(r){return(t,e)=>typeof e=="object"?Lr(r,t,e):((i,s,o)=>{const n=s.hasOwnProperty(o);return s.constructor.createProperty(o,n?{...i,wrapped:!0}:i),n?Object.getOwnPropertyDescriptor(s,o):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function E(r){return be({...r,state:!0,attribute:!1})}var Mr=Object.defineProperty,jr=(r,t,e,i)=>{for(var s=void 0,o=r.length-1,n;o>=0;o--)(n=r[o])&&(s=n(t,e,s)||s);return s&&Mr(t,e,s),s};const $e=class $e extends St{constructor(){super("guru:model"),this.searchQuery=""}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["applications/load"])}handleSearch(){const t=this.searchQuery.toLowerCase();this.dispatchMessage(["search/item",{query:t}]),this.searchQuery=""}render(){const{applications:t=[]}=this.model,e={total:t.length,pending:t.filter(s=>s.status==="Pending").length,submitted:t.filter(s=>s.status==="Submitted").length,interview:t.filter(s=>s.status==="Interview Scheduled").length,accepted:t.filter(s=>s.status==="Accepted").length,rejected:t.filter(s=>s.status==="Rejected").length},i=t.slice(0,5);return y`
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
            ${i.map(s=>y`
                <div class="app-card">
                  <p><strong>${s.title}</strong></p>
                  <p>Company: ${s.company.name}</p>
                  <p>Status: ${s.status}</p>
                </div>
              `)}
          </div>
        </section>
      </main>
    `}};$e.styles=O`
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
  `;let _t=$e;jr([E()],_t.prototype,"searchQuery");F({"home-view":_t});var Hr=Object.defineProperty,Qs=(r,t,e,i)=>{for(var s=void 0,o=r.length-1,n;o>=0;o--)(n=r[o])&&(s=n(t,e,s)||s);return s&&Hr(t,e,s),s};const we=class we extends k{constructor(){super(...arguments),this.itemId="",this.recipe=null}connectedCallback(){super.connectedCallback(),console.log("ConnectedCallback -> Item ID:",this.itemId),this.itemId?this.hydrate():console.error("Missing itemId for recipe.")}hydrate(){console.log("Fetching recipe with ID:",this.itemId),fetch(`/api/recipes/${this.itemId}`).then(t=>{if(t.ok)return t.json();throw new Error(`Error fetching recipe: ${t.statusText}`)}).then(t=>{this.recipe={...t,ingredients:t.ingredients||[],instructions:t.instructions||[]}}).catch(t=>{console.error("Failed to fetch recipe:",t)})}render(){if(!this.recipe)return y`<p>Loading recipe...</p>`;const{name:t,servings:e,prepTime:i,ingredients:s,instructions:o,notes:n}=this.recipe;return y`
      <main>
        <section class="recipe-section">
          <h2>${t}</h2>
          <p>Store: ${this.recipe.store}</p>
          <p>Servings: ${e}</p>
          <p>Prep Time: ${i}</p>

          <div class="ingredients">
            <h3>Ingredients</h3>
            <ul>
              ${s.map(c=>y`
                <li>${c.quantity} ${c.unit} ${c.itemName}</li>
              `)}
            </ul>
          </div>

          <div class="instructions">
            <h3>Instructions</h3>
            <ol>
              ${o.map(c=>y`<li>${c}</li>`)}
            </ol>
          </div>

          <div class="notes">
            <h3>Notes</h3>
            <p>${n||"No additional notes"}</p>
          </div>
        </section>
      </main>
    `}};we.styles=O`
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
    `;let it=we;Qs([be({type:String})],it.prototype,"itemId");Qs([E()],it.prototype,"recipe");var zr=Object.defineProperty,Dr=(r,t,e,i)=>{for(var s=void 0,o=r.length-1,n;o>=0;o--)(n=r[o])&&(s=n(t,e,s)||s);return s&&zr(t,e,s),s};const xe=class xe extends St{constructor(){super("guru:model"),this.searchQuery=""}handleSearch(){const t=this.searchQuery.toLowerCase();this.dispatchMessage(["recipes/search",{query:t}]),this.searchQuery=""}render(){const{recipes:t=[]}=this.model;return y`
      <main>
        <section class="search-section">
          <h2>Search for Recipes</h2>
          <div class="search-bar">
            <input
              type="text"
              id="recipe-keyword"
              placeholder="Enter recipe keyword..."
              .value="${this.searchQuery}"
              @input="${e=>this.searchQuery=e.target.value}"
            />
            <button @click="${this.handleSearch}">Search</button>
          </div>
        </section>
        <section class="results-section">
          <h2>Search Results</h2>
          ${t.length===0?y`<p>No recipes found.</p>`:y`
                <ul class="recipe-list">
                  ${t.map(e=>y`
                        <li>
                          <a href="recipes/${e.id}">${e.name}</a>
                        </li>
                      `)}
                </ul>
              `}
        </section>
      </main>
    `}};xe.styles=O`
    main {
      padding: 20px;
    }

    .search-section {
      margin-bottom: 20px;
    }
      
    .search-bar {
      display: flex;
    }

    input {
      flex: 1;
      padding: 10px;
      border: 1px solid #ccc;
      border-right: none;
      border-top-left-radius: 25px;
      border-bottom-left-radius: 25px;
      outline: none;
    }

    button {
      padding: 10px 20px;
      cursor: pointer;
      border: 1px solid #ccc;
      border-left: none;
      border-top-right-radius: 25px;
      border-bottom-right-radius: 25px;
      background-color: black;
      color: white;
      transition: background-color 0.3s ease; /* Add this line */
    }

    button:hover {
      background-color: grey;
    }

    .results-section {
      margin-top: 20px;
    }
      
    .recipe-list {
      list-style-type: none;
      padding: 0;
      margin: 10px 0;
    }
      
    .recipe-list li {
      padding: 10px;
      margin-bottom: 5px;
      border: 1px solid #ccc;
      border-radius: 10px; /* Rounded corners */
      background-color: #f9f9f9; /* Subtle background color */
      cursor: pointer; /* Pointer cursor to indicate clickability */
      transition: background-color 0.3s ease, transform 0.2s ease; /* Smooth hover effects */
    }

    .recipe-list li:hover {
      background-color: #e0e0e0; /* Slightly darker background on hover */
      transform: scale(1.02); /* Subtle zoom-in effect */
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Add a shadow for emphasis */
    }

    .recipe-list a {
      text-decoration: none;
      color: black; /* Default color for unvisited links */
      font-weight: bold; /* Make the link text stand out */
      transition: color 0.3s ease; /* Smooth transition for color change */
    }

    .recipe-list a:visited {
      color: purple; /* Change color for visited links */
    }
  `;let $t=xe;Dr([E()],$t.prototype,"searchQuery");F({"recipe-search-view":$t});const Ae=class Ae extends St{constructor(){super("guru:model")}render(){return y`
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
    `}};Ae.styles=O`
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
  `;let zt=Ae;F({"about-view":zt});var Fr=Object.defineProperty,ot=(r,t,e,i)=>{for(var s=void 0,o=r.length-1,n;o>=0;o--)(n=r[o])&&(s=n(t,e,s)||s);return s&&Fr(t,e,s),s};const Ee=class Ee extends k{constructor(){super(...arguments),this.username="",this.password="",this.confirmPassword="",this.errorMessage="",this.successMessage="",this.isRegister=!1}handleLogin(){console.log("Attempting login with:",{username:this.username}),fetch("/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:this.username,password:this.password})}).then(t=>{if(t.ok)console.log("Login successful!"),window.location.href="/";else throw new Error("Invalid username or password")}).catch(t=>{console.error("Login failed:",t),this.errorMessage="Invalid username or password. Please try again."})}handleRegister(){if(console.log("Attempting registration with:",{username:this.username,password:this.password,confirmPassword:this.confirmPassword}),this.password!==this.confirmPassword){this.errorMessage="Passwords do not match!";return}fetch("/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:this.username,password:this.password})}).then(t=>{if(t.ok)console.log("Registration successful!"),this.successMessage="Registration successful! You can now log in.",this.isRegister=!1,this.errorMessage="";else return t.json().then(e=>{throw new Error(e.message||"Registration failed")})}).catch(t=>{console.error("Registration failed:",t),this.errorMessage=t.message||"Registration failed. Please try again."})}toggleView(){this.isRegister=!this.isRegister,this.errorMessage="",this.successMessage="",this.username="",this.password="",this.confirmPassword=""}render(){return y`
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
    `}};Ee.styles=O`
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
  `;let P=Ee;ot([E()],P.prototype,"username");ot([E()],P.prototype,"password");ot([E()],P.prototype,"confirmPassword");ot([E()],P.prototype,"errorMessage");ot([E()],P.prototype,"successMessage");ot([E()],P.prototype,"isRegister");var qr=Object.defineProperty,Ws=(r,t,e,i)=>{for(var s=void 0,o=r.length-1,n;o>=0;o--)(n=r[o])&&(s=n(t,e,s)||s);return s&&qr(t,e,s),s};const Se=class Se extends k{constructor(){super(...arguments),this.itemId="",this.application=null}connectedCallback(){super.connectedCallback(),console.log("ConnectedCallback -> Item ID:",this.itemId),this.itemId?this.hydrate():console.error("Missing itemId for application.")}hydrate(){this.itemId?(console.log("Fetching application with ID:",this.itemId),fetch(`/api/applications/${this.itemId}`).then(t=>{if(t.ok)return t.json();throw new Error(`Error fetching application: ${t.statusText}`)}).then(t=>{this.application={...t,status:t.status||"Not specified"}}).catch(t=>{console.error("Failed to fetch application:",t)})):(console.log("Fetching all applications..."),fetch("/api/applications").then(t=>{if(t.ok)return t.json();throw new Error(`Error fetching applications: ${t.statusText}`)}).then(t=>{console.log("Fetched applications:",t),this.application=t.length>0?t[0]:null}).catch(t=>{console.error("Failed to fetch applications:",t)}))}handleBackButton(){window.history.back()}handleDelete(){this.itemId?fetch(`/api/applications/${this.itemId}`,{method:"DELETE",headers:{"Content-Type":"application/json"}}).then(t=>{if(t.ok)console.log("Application deleted successfully."),window.history.back();else throw new Error(`Error deleting application: ${t.statusText}`)}).catch(t=>{console.error("Failed to delete application:",t)}):console.error("No itemId provided for deletion.")}render(){if(!this.application)return y`<p>Loading application...</p>`;const{title:t,status:e,appliedDate:i,method:s,notes:o,company:n}=this.application,{name:c,state:a,city:u,streetAddress:p}=n,h=new Date(i).toLocaleDateString();return y`
      <main>
        <section class="application-section">
          <!-- Flexbox container for back button and title -->
          <div class="header">
            <button @click="${this.handleBackButton}" class="back-button">← Back</button>
            <h2 class="title">${t}</h2>
          </div>

          <div class="company-info">
            <h3>Company: ${c}</h3>
            <p><strong>Location:</strong> ${u}, ${a}</p>
            <p><strong>Address:</strong> ${p}</p>
          </div>

          <div class="application-details">
            <p><strong>Applied on:</strong> ${h}</p>
            <p><strong>Status:</strong> ${e}</p>
            <p><strong>Application Method:</strong> ${s||"Not specified"}</p>

            <div class="notes">
              <h3>Notes</h3>
              <p>${o||"No notes available"}</p>
            </div>
          </div>

          <!-- Delete button -->
          <div class="action-buttons">
            <button @click="${this.handleDelete}" class="delete-button">Delete Application</button>
          </div>
        </section>
      </main>
    `}};Se.styles=O`
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
    `;let rt=Se;Ws([be({type:String})],rt.prototype,"itemId");Ws([E()],rt.prototype,"application");var Br=Object.defineProperty,Vr=(r,t,e,i)=>{for(var s=void 0,o=r.length-1,n;o>=0;o--)(n=r[o])&&(s=n(t,e,s)||s);return s&&Br(t,e,s),s};const ke=class ke extends St{constructor(){super("guru:model"),this.searchQuery=""}connectedCallback(){super.connectedCallback(),console.log("Component connected. Loading all applications..."),this.loadAllApplications()}loadAllApplications(){this.dispatchMessage(["applications/load"])}handleSearch(){const t=this.searchQuery.toLowerCase();console.log("Search query:",t),this.dispatchMessage(["applications/search",{query:t}]),this.searchQuery=""}render(){const{applications:t=[]}=this.model;return y`
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
    `}};ke.styles=O`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

    main {
      padding: 30px;
      font-family: 'Poppins', sans-serif;
      background-color: #f4f7fa;
      color: #333;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .search-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 30px;
      max-width: 700px;
      width: 100%;
    }

    h2 {
      font-size: 1.8rem;
      color: #444;
      font-weight: 600;
      margin-bottom: 15px;
    }

    .search-bar {
      display: flex;
      width: 100%;
      max-width: 600px;
      border-radius: 30px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    input {
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

    input:focus {
      border-color: #007bff;
    }

    button {
      padding: 15px 20px;
      font-size: 1rem;
      cursor: pointer;
      border: 1px solid #ccc;
      border-left: none;
      border-top-right-radius: 30px;
      border-bottom-right-radius: 30px;
      background-color: #007bff;
      color: white;
      transition: background-color 0.3s ease, transform 0.2s ease;
      margin-left: 10px;
    }

    button:hover {
      background-color: #0056b3;
      transform: scale(1.05);
    }

    .results-section {
      margin-top: 20px;
      width: 100%;
      max-width: 700px;
    }

    .results-section h2 {
      font-size: 1.6rem;
      color: #444;
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
      background-color: white;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
    }

    .application-list li:hover {
      background-color: #f5f5f5;
      transform: scale(1.02);
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

    .application-list a:visited {
      color: #6c757d;
    }

    .search-bar input,
    .search-bar button {
      font-family: 'Poppins', Arial, sans-serif;
      border-radius: 25px;
    }

    @media (max-width: 600px) {
      .search-section {
        margin-bottom: 20px;
      }

      .search-bar {
        flex-direction: column;
        width: 100%;
        max-width: 100%;
      }

      input {
        width: 100%;
        margin-bottom: 10px;
      }

      button {
        width: 100%;
      }

      .application-list {
        padding: 0 10px;
      }
    }
  `;let wt=ke;Vr([E()],wt.prototype,"searchQuery");F({"application-search-view":wt});const Qr={companys:[],cartItems:[],totalCost:0,recipes:[],applications:[]};function Ys(r,t,e){switch(r[0]){case"companys/load":Wr(e).then(c=>t(a=>({...a,companys:c}))).catch(c=>{console.error("Failed to fetch companys:",c)});break;case"search/item":const{query:i}=r[1];t(c=>{const a=i.toLowerCase();let u=null;return c.companys.forEach(p=>{p.items.forEach(h=>{h.name.toLowerCase().includes(a)&&(!u||h.price<u.price)&&(u={id:h.id,name:h.name,price:h.price,companyName:p.name})})}),u!==null?{...c,cartItems:[...c.cartItems,u],totalCost:c.totalCost+u.price}:(console.warn(`No items found for query: ${i}`),c)});break;case"recipes/search":console.log("DISPATCHING SEARCH QUERY:",r[1].query),Kr(r[1].query,t,e);break;case"cart/add":t(c=>({...c,cartItems:[...c.cartItems,r[1].item],totalCost:c.totalCost+r[1].item.price}));break;case"cart/removeItem":const{itemId:s}=r[1];t(c=>{const a=c.cartItems.findIndex(u=>u.id===s);if(a!==-1){const u=[...c.cartItems],[p]=u.splice(a,1),h=c.totalCost-p.price*(p.quantity||1);return{...c,cartItems:u,totalCost:h}}return c});break;case"applications/load":Ks(e).then(c=>t(a=>({...a,applications:c}))).catch(c=>{console.error("Failed to fetch applications:",c)});break;case"applications/search":console.log("DISPATCHING SEARCH QUERY:",r[1].query),Yr(r[1].query,t,e);break;case"applications/delete":const{id:o}=r[1];t(c=>{const a=c.applications.filter(u=>u.id!==o);return{...c,applications:a}});break;default:const n=r[0];throw new Error(`Unhandled Auth message "${n}"`)}}function Wr(r){return fetch("/api/companys",{headers:xt.headers(r)}).then(t=>{if(!t.ok)throw t.status===401?new Error("Unauthorized: User must log in."):new Error(`API error: ${t.statusText}`);return t.json()}).then(t=>{if(Array.isArray(t))return t;throw new Error("Unexpected response format")})}function Ks(r){return fetch("/api/applications",{headers:xt.headers(r)}).then(t=>{if(!t.ok)throw t.status===401?new Error("Unauthorized: User must log in."):new Error(`API error: ${t.statusText}`);return t.json()}).then(t=>{if(Array.isArray(t))return t;throw new Error("Unexpected response format")})}function Yr(r,t,e){Ks(e).then(i=>{console.log("FETCHED APPLICATIONS: ",i);const s=r.toLowerCase(),o=i.filter(n=>n.title.toLowerCase().includes(s));t(n=>({...n,applications:o}))}).catch(i=>{console.error("Failed to fetch applications:",i)})}function Kr(r,t,e){Jr(e).then(i=>{console.log("FETCHED RECIPES: ",i);const s=r.toLowerCase(),o=i.filter(n=>n.name.toLowerCase().includes(s));t(n=>({...n,recipes:o}))}).catch(i=>{console.error("Failed to fetch recipes:",i)})}function Jr(r){return fetch("/api/recipes",{headers:xt.headers(r)}).then(t=>{if(!t.ok)throw t.status===401?new Error("Unauthorized: User must log in."):new Error(`API error: ${t.statusText}`);return t.json()}).then(t=>{if(Array.isArray(t))return t;throw new Error("Unexpected response format")})}const Pe=class Pe extends k{render(){return y`
            <mu-switch></mu-switch>`}connectedCallback(){super.connectedCallback()}};Pe.uses=F({"home-view":_t,"recipe-view":it,"login-view":P,"recipe-search-view":$t,"about-view":zt,"application-view":rt,"application-search-view":wt,"mu-store":class extends ws.Provider{constructor(){super(Ys,Qr,"guru:auth")}}});let ne=Pe;const Gr=[{path:"/app/recipes/:id",view:r=>y`
            <recipe-view itemId="${r.id}"></recipe-view>
        `},{path:"/app/login",view:()=>y`
            <login-view></login-view>`},{path:"/app/recipe-search-view",view:()=>y`
            <recipe-search-view></recipe-search-view>
        `},{path:"/app/about-view",view:()=>y`
            <about-view></about-view>
        `},{path:"/app/applications/:id",view:r=>y`
            <application-view itemId="${r.id}"></application-view>
        `},{path:"/app/application-search-view",view:()=>y`
            <application-search-view></application-search-view>
        `},{path:"/app",view:()=>y`
            <home-view></home-view>
        `},{path:"/",redirect:"/app"}];F({"mu-auth":xt.Provider,"mu-history":bi.Provider,"mu-store":class extends ws.Provider{constructor(){super(Ys,{cartItems:[],companys:[],totalCost:0,recipes:[],applications:[]},"guru:auth")}},"mu-switch":class extends hr.Element{constructor(){super(Gr,"guru:history","guru:auth")}},"grocery-guru-app":ne,"all-header":Ht,"recipe-view":it,"application-view":rt});
