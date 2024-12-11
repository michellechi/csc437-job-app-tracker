(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();var q,ke;class lt extends Error{}lt.prototype.name="InvalidTokenError";function Ks(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Js(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Ks(t)}catch{return atob(t)}}function ss(r,t){if(typeof r!="string")throw new lt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new lt(`Invalid token specified: missing part #${e+1}`);let i;try{i=Js(s)}catch(n){throw new lt(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new lt(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Zs="mu:context",Xt=`${Zs}:change`;class Gs{constructor(t,e){this._proxy=Xs(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ne extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Gs(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Xt,t),t}detach(t){this.removeEventListener(Xt,t)}}function Xs(r,t){return new Proxy(r,{get:(s,i,n)=>{if(i==="then")return;const o=Reflect.get(s,i,n);return console.log(`Context['${i}'] => `,o),o},set:(s,i,n,o)=>{const c=r[i];console.log(`Context['${i.toString()}'] <= `,n);const a=Reflect.set(s,i,n,o);if(a){let d=new CustomEvent(Xt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:i,oldValue:c,value:n}),t.dispatchEvent(d)}else console.log(`Context['${i}] was not set to ${n}`);return a}})}function ti(r,t){const e=is(t,r);return new Promise((s,i)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function is(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return is(r,i.host)}class ei extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function rs(r="mu:message"){return(t,...e)=>t.dispatchEvent(new ei(e,r))}class oe{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function si(r){return t=>({...t,...r})}const te="mu:auth:jwt",ns=class os extends oe{constructor(t,e){super((s,i)=>this.update(s,i),t,os.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(ri(s)),Yt(i);case"auth/signout":return e(ni()),Yt(this._redirectForLogin);case"auth/redirect":return Yt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};ns.EVENT_TYPE="auth:message";let as=ns;const cs=rs(as.EVENT_TYPE);function Yt(r,t={}){if(!r)return;const e=window.location.href,s=new URL(r,e);return Object.entries(t).forEach(([i,n])=>s.searchParams.set(i,n)),()=>{console.log("Redirecting to ",r),window.location.assign(s)}}class ii extends ne{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=K.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new as(this.context,this.redirect).attach(this)}}class Q{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(te),t}}class K extends Q{constructor(t){super();const e=ss(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new K(t);return localStorage.setItem(te,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(te);return t?K.authenticate(t):new Q}}function ri(r){return si({user:K.authenticate(r),token:r})}function ni(){return r=>{const t=r.user;return{user:t&&t.authenticated?Q.deauthenticate(t):t,token:""}}}function oi(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function ai(r){return r.authenticated?ss(r.token||""):{}}const It=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:K,Provider:ii,User:Q,dispatch:cs,headers:oi,payload:ai},Symbol.toStringTag,{value:"Module"}));function Pt(r,t,e){const s=r.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,i),s.dispatchEvent(i),r.stopPropagation()}function ee(r,t="*"){return r.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const ci=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:ee,relay:Pt},Symbol.toStringTag,{value:"Module"}));function ls(r,...t){const e=r.map((i,n)=>n?[t[n-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const li=new DOMParser;function j(r,...t){const e=t.map(c),s=r.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),i=li.parseFromString(s,"text/html"),n=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u==null||u.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function c(a,d){if(a===null)return"";switch(typeof a){case"string":return Pe(a);case"bigint":case"boolean":case"number":case"symbol":return Pe(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(c);return f.replaceChildren(...u),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Pe(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function jt(r,t={mode:"open"}){const e=r.attachShadow(t),s={template:i,styles:n};return s;function i(o){const c=o.firstElementChild,a=c&&c.tagName==="TEMPLATE"?c:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}q=class extends HTMLElement{constructor(){super(),this._state={},jt(this).template(q.template).styles(q.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),Pt(r,"mu-form:submit",this._state)})}set init(r){this._state=r||{},hi(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}},q.template=j`
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
  `,q.styles=ls`
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
  `;function hi(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const c=o;c.checked=!!i;break;case"date":o.value=i.toISOString().substr(0,10);break;default:o.value=i;break}}}return r}const hs=class us extends oe{constructor(t){super((e,s)=>this.update(e,s),t,us.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(di(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(pi(s,i));break}}}};hs.EVENT_TYPE="history:message";let ae=hs;class Ce extends ne{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=ui(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ce(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ae(this.context).attach(this)}}function ui(r){const t=r.currentTarget,e=s=>s.tagName=="A"&&s.href;if(r.button===0)if(r.composed){const i=r.composedPath().find(e);return i||void 0}else{for(let s=r.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function di(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function pi(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const ce=rs(ae.EVENT_TYPE),fi=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Ce,Provider:Ce,Service:ae,dispatch:ce},Symbol.toStringTag,{value:"Module"}));class pt{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Te(this._provider,t);this._effects.push(i),e(i)}else ti(this._target,this._contextLabel).then(i=>{const n=new Te(i,t);this._provider=i,this._effects.push(n),i.attach(o=>this._handleChange(o)),e(n)}).catch(i=>console.log(`Observer ${this._contextLabel}: ${i}`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Te{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const ds=class ps extends HTMLElement{constructor(){super(),this._state={},this._user=new Q,this._authObserver=new pt(this,"blazing:auth"),jt(this).template(ps.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;gi(i,this._state,e,this.authorization).then(n=>nt(n,this)).then(n=>{const o=`mu-rest-form:${s}`,c=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:i}});this.dispatchEvent(c)}).catch(n=>{const o="mu-rest-form:error",c=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:i,request:this._state}});this.dispatchEvent(c)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},nt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Oe(this.src,this.authorization).then(e=>{this._state=e,nt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Oe(this.src,this.authorization).then(i=>{this._state=i,nt(i,this)});break;case"new":s&&(this._state={},nt({},this));break}}};ds.observedAttributes=["src","new","action"];ds.template=j`
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
  `;function Oe(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function nt(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const c=o;c.checked=!!i;break;default:o.value=i;break}}}return r}function gi(r,t,e="PUT",s={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const fs=class gs extends oe{constructor(t,e){super(e,t,gs.EVENT_TYPE,!1)}};fs.EVENT_TYPE="mu:message";let ms=fs;class mi extends ne{constructor(t,e,s){super(e),this._user=new Q,this._updateFn=t,this._authObserver=new pt(this,s)}connectedCallback(){const t=new ms(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const ys=Object.freeze(Object.defineProperty({__proto__:null,Provider:mi,Service:ms},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const St=globalThis,le=St.ShadowRoot&&(St.ShadyCSS===void 0||St.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,he=Symbol(),Re=new WeakMap;let vs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==he)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(le&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Re.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Re.set(e,t))}return t}toString(){return this.cssText}};const yi=r=>new vs(typeof r=="string"?r:r+"",void 0,he),vi=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new vs(e,r,he)},_i=(r,t)=>{if(le)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=St.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Ue=le?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return yi(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:bi,defineProperty:$i,getOwnPropertyDescriptor:wi,getOwnPropertyNames:xi,getOwnPropertySymbols:Ai,getPrototypeOf:Ei}=Object,J=globalThis,Ne=J.trustedTypes,Si=Ne?Ne.emptyScript:"",Me=J.reactiveElementPolyfillSupport,ht=(r,t)=>r,Ct={toAttribute(r,t){switch(t){case Boolean:r=r?Si:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ue=(r,t)=>!bi(r,t),Le={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:ue};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),J.litPropertyMetadata??(J.litPropertyMetadata=new WeakMap);let V=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Le){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&$i(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=wi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const c=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Le}static _$Ei(){if(this.hasOwnProperty(ht("elementProperties")))return;const t=Ei(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ht("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ht("properties"))){const e=this.properties,s=[...xi(e),...Ai(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Ue(i))}else t!==void 0&&e.push(Ue(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _i(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:Ct).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=i.getPropertyOptions(n),c=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Ct;this._$Em=n,this[n]=c.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ue)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};V.elementStyles=[],V.shadowRootOptions={mode:"open"},V[ht("elementProperties")]=new Map,V[ht("finalized")]=new Map,Me==null||Me({ReactiveElement:V}),(J.reactiveElementVersions??(J.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tt=globalThis,Ot=Tt.trustedTypes,Ie=Ot?Ot.createPolicy("lit-html",{createHTML:r=>r}):void 0,_s="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,bs="?"+P,ki=`<${bs}>`,H=document,ft=()=>H.createComment(""),gt=r=>r===null||typeof r!="object"&&typeof r!="function",de=Array.isArray,Pi=r=>de(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Qt=`[ 	
\f\r]`,ot=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,je=/-->/g,He=/>/g,N=RegExp(`>|${Qt}(?:([^\\s"'>=/]+)(${Qt}*=${Qt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ze=/'/g,De=/"/g,$s=/^(?:script|style|textarea|title)$/i,Ci=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),at=Ci(1),Z=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),Fe=new WeakMap,L=H.createTreeWalker(H,129);function ws(r,t){if(!de(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ie!==void 0?Ie.createHTML(t):t}const Ti=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=ot;for(let c=0;c<e;c++){const a=r[c];let d,f,u=-1,l=0;for(;l<a.length&&(o.lastIndex=l,f=o.exec(a),f!==null);)l=o.lastIndex,o===ot?f[1]==="!--"?o=je:f[1]!==void 0?o=He:f[2]!==void 0?($s.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=N):f[3]!==void 0&&(o=N):o===N?f[0]===">"?(o=i??ot,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?N:f[3]==='"'?De:ze):o===De||o===ze?o=N:o===je||o===He?o=ot:(o=N,i=void 0);const h=o===N&&r[c+1].startsWith("/>")?" ":"";n+=o===ot?a+ki:u>=0?(s.push(d),a.slice(0,u)+_s+a.slice(u)+P+h):a+P+(u===-2?c:h)}return[ws(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let se=class xs{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const c=t.length-1,a=this.parts,[d,f]=Ti(t,e);if(this.el=xs.createElement(d,s),L.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=L.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(_s)){const l=f[o++],h=i.getAttribute(u).split(P),p=/([.?@])?(.*)/.exec(l);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Ri:p[1]==="?"?Ui:p[1]==="@"?Ni:Ht}),i.removeAttribute(u)}else u.startsWith(P)&&(a.push({type:6,index:n}),i.removeAttribute(u));if($s.test(i.tagName)){const u=i.textContent.split(P),l=u.length-1;if(l>0){i.textContent=Ot?Ot.emptyScript:"";for(let h=0;h<l;h++)i.append(u[h],ft()),L.nextNode(),a.push({type:2,index:++n});i.append(u[l],ft())}}}else if(i.nodeType===8)if(i.data===bs)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(P,u+1))!==-1;)a.push({type:7,index:n}),u+=P.length-1}n++}}static createElement(t,e){const s=H.createElement("template");return s.innerHTML=t,s}};function G(r,t,e=r,s){var i,n;if(t===Z)return t;let o=s!==void 0?(i=e.o)==null?void 0:i[s]:e.l;const c=gt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==c&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),c===void 0?o=void 0:(o=new c(r),o._$AT(r,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=G(r,o._$AS(r,t.values),o,s)),t}class Oi{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??H).importNode(e,!0);L.currentNode=i;let n=L.nextNode(),o=0,c=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new $t(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Mi(n,this,t)),this._$AV.push(d),a=s[++c]}o!==(a==null?void 0:a.index)&&(n=L.nextNode(),o++)}return L.currentNode=H,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class $t{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,i){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),gt(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==Z&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Pi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&gt(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=se.createElement(ws(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new Oi(n,this),c=o.u(this.options);o.p(s),this.T(c),this._$AH=o}}_$AC(t){let e=Fe.get(t.strings);return e===void 0&&Fe.set(t.strings,e=new se(t)),e}k(t){de(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new $t(this.O(ft()),this.O(ft()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Ht{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=G(this,t,e,0),o=!gt(t)||t!==this._$AH&&t!==Z,o&&(this._$AH=t);else{const c=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=G(this,c[s+a],e,a),d===Z&&(d=this._$AH[a]),o||(o=!gt(d)||d!==this._$AH[a]),d===b?t=b:t!==b&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ri extends Ht{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class Ui extends Ht{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Ni extends Ht{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=G(this,t,e,0)??b)===Z)return;const s=this._$AH,i=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==b&&(s===b||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Mi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const qe=Tt.litHtmlPolyfillSupport;qe==null||qe(se,$t),(Tt.litHtmlVersions??(Tt.litHtmlVersions=[])).push("3.2.0");const Li=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new $t(t.insertBefore(ft(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Y=class extends V{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Li(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return Z}};Y._$litElement$=!0,Y.finalized=!0,(ke=globalThis.litElementHydrateSupport)==null||ke.call(globalThis,{LitElement:Y});const Be=globalThis.litElementPolyfillSupport;Be==null||Be({LitElement:Y});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ii={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:ue},ji=(r=Ii,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(c){const a=t.get.call(this);t.set.call(this,c),this.requestUpdate(o,a,r)},init(c){return c!==void 0&&this.P(o,void 0,r),c}}}if(s==="setter"){const{name:o}=e;return function(c){const a=this[o];t.call(this,c),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function As(r){return(t,e)=>typeof e=="object"?ji(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Es(r){return As({...r,state:!0,attribute:!1})}function Hi(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function zi(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ss={};(function(r){var t=function(){var e=function(u,l,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=l);return h},s=[1,9],i=[1,10],n=[1,11],o=[1,12],c=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(l,h,p,m,g,v,Ft){var x=v.length-1;switch(g){case 1:return new m.Root({},[v[x-1]]);case 2:return new m.Root({},[new m.Literal({value:""})]);case 3:this.$=new m.Concat({},[v[x-1],v[x]]);break;case 4:case 5:this.$=v[x];break;case 6:this.$=new m.Literal({value:v[x]});break;case 7:this.$=new m.Splat({name:v[x]});break;case 8:this.$=new m.Param({name:v[x]});break;case 9:this.$=new m.Optional({},[v[x-1]]);break;case 10:this.$=l;break;case 11:case 12:this.$=l.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[2,2]},e(c,[2,4]),e(c,[2,5]),e(c,[2,6]),e(c,[2,7]),e(c,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},e(c,[2,10]),e(c,[2,11]),e(c,[2,12]),{1:[2,1]},e(c,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:n,15:o},e(c,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(l,h){if(h.recoverable)this.trace(l);else{let p=function(m,g){this.message=m,this.hash=g};throw p.prototype=Error,new p(l,h)}},parse:function(l){var h=this,p=[0],m=[null],g=[],v=this.table,Ft="",x=0,Ae=0,Vs=2,Ee=1,Ws=g.slice.call(arguments,1),_=Object.create(this.lexer),R={yy:{}};for(var qt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,qt)&&(R.yy[qt]=this.yy[qt]);_.setInput(l,R.yy),R.yy.lexer=_,R.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var Bt=_.yylloc;g.push(Bt);var Ys=_.options&&_.options.ranges;typeof R.yy.parseError=="function"?this.parseError=R.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Qs=function(){var F;return F=_.lex()||Ee,typeof F!="number"&&(F=h.symbols_[F]||F),F},w,U,A,Vt,D={},At,E,Se,Et;;){if(U=p[p.length-1],this.defaultActions[U]?A=this.defaultActions[U]:((w===null||typeof w>"u")&&(w=Qs()),A=v[U]&&v[U][w]),typeof A>"u"||!A.length||!A[0]){var Wt="";Et=[];for(At in v[U])this.terminals_[At]&&At>Vs&&Et.push("'"+this.terminals_[At]+"'");_.showPosition?Wt="Parse error on line "+(x+1)+`:
`+_.showPosition()+`
Expecting `+Et.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Wt="Parse error on line "+(x+1)+": Unexpected "+(w==Ee?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Wt,{text:_.match,token:this.terminals_[w]||w,line:_.yylineno,loc:Bt,expected:Et})}if(A[0]instanceof Array&&A.length>1)throw new Error("Parse Error: multiple actions possible at state: "+U+", token: "+w);switch(A[0]){case 1:p.push(w),m.push(_.yytext),g.push(_.yylloc),p.push(A[1]),w=null,Ae=_.yyleng,Ft=_.yytext,x=_.yylineno,Bt=_.yylloc;break;case 2:if(E=this.productions_[A[1]][1],D.$=m[m.length-E],D._$={first_line:g[g.length-(E||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(E||1)].first_column,last_column:g[g.length-1].last_column},Ys&&(D._$.range=[g[g.length-(E||1)].range[0],g[g.length-1].range[1]]),Vt=this.performAction.apply(D,[Ft,Ae,x,R.yy,A[1],m,g].concat(Ws)),typeof Vt<"u")return Vt;E&&(p=p.slice(0,-1*E*2),m=m.slice(0,-1*E),g=g.slice(0,-1*E)),p.push(this.productions_[A[1]][0]),m.push(D.$),g.push(D._$),Se=v[p[p.length-2]][p[p.length-1]],p.push(Se);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(l,h){return this.yy=h||this.yy||{},this._input=l,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var l=this._input[0];this.yytext+=l,this.yyleng++,this.offset++,this.match+=l,this.matched+=l;var h=l.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),l},unput:function(l){var h=l.length,p=l.split(/(?:\r\n?|\n)/g);this._input=l+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var m=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===m.length?this.yylloc.first_column:0)+m[m.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(l){this.unput(this.match.slice(l))},pastInput:function(){var l=this.matched.substr(0,this.matched.length-this.match.length);return(l.length>20?"...":"")+l.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var l=this.match;return l.length<20&&(l+=this._input.substr(0,20-l.length)),(l.substr(0,20)+(l.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var l=this.pastInput(),h=new Array(l.length+1).join("-");return l+this.upcomingInput()+`
`+h+"^"},test_match:function(l,h){var p,m,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),m=l[0].match(/(?:\r\n?|\n).*/g),m&&(this.yylineno+=m.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:m?m[m.length-1].length-m[m.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+l[0].length},this.yytext+=l[0],this.match+=l[0],this.matches=l,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(l[0].length),this.matched+=l[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var v in g)this[v]=g[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var l,h,p,m;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),v=0;v<g.length;v++)if(p=this._input.match(this.rules[g[v]]),p&&(!h||p[0].length>h[0].length)){if(h=p,m=v,this.options.backtrack_lexer){if(l=this.test_match(p,g[v]),l!==!1)return l;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(l=this.test_match(h,g[m]),l!==!1?l:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,m,g){switch(m){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof zi<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(Ss);function B(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var ks={Root:B("Root"),Concat:B("Concat"),Literal:B("Literal"),Splat:B("Splat"),Param:B("Param"),Optional:B("Optional")},Ps=Ss.parser;Ps.yy=ks;var Di=Ps,Fi=Object.keys(ks);function qi(r){return Fi.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var Cs=qi,Bi=Cs,Vi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Ts(r){this.captures=r.captures,this.re=r.re}Ts.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var Wi=Bi({Concat:function(r){return r.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(Vi,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new Ts({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Yi=Wi,Qi=Cs,Ki=Qi({Concat:function(r,t){var e=r.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),Ji=Ki,Zi=Di,Gi=Yi,Xi=Ji;wt.prototype=Object.create(null);wt.prototype.match=function(r){var t=Gi.visit(this.ast),e=t.match(r);return e||!1};wt.prototype.reverse=function(r){return Xi.visit(this.ast,r)};function wt(r){var t;if(this?t=this:t=Object.create(wt.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=Zi.parse(r),t}var tr=wt,er=tr,sr=er;const ir=Hi(sr);var rr=Object.defineProperty,Os=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&rr(t,e,i),i};const Rs=class extends Y{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>at` <h1>Not Found</h1> `,this._cases=t.map(i=>({...i,route:new ir(i.path)})),this._historyObserver=new pt(this,e),this._authObserver=new pt(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),at` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(cs(this,"auth/redirect"),at` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):at` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),at` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),n=s+e;for(const o of this._cases){const c=o.route.match(n);if(c)return{...o,path:s,params:c,query:i}}}redirect(t){ce(this,"history/redirect",{href:t})}};Rs.styles=vi`
    :host,
    main {
      display: contents;
    }
  `;let Rt=Rs;Os([Es()],Rt.prototype,"_user");Os([Es()],Rt.prototype,"_match");const nr=Object.freeze(Object.defineProperty({__proto__:null,Element:Rt,Switch:Rt},Symbol.toStringTag,{value:"Module"})),or=class Us extends HTMLElement{constructor(){if(super(),jt(this).template(Us.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};or.template=j`
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
  `;const Ns=class ie extends HTMLElement{constructor(){super(),this._array=[],jt(this).template(ie.template).styles(ie.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Ms("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{ee(t,"button.add")?Pt(t,"input-array:add"):ee(t,"button.remove")&&Pt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],ar(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Ns.template=j`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Ns.styles=ls`
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
  `;function ar(r,t){t.replaceChildren(),r.forEach((e,s)=>t.append(Ms(e)))}function Ms(r,t){const e=r===void 0?j`<input />`:j`<input value="${r}" />`;return j`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function st(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var cr=Object.defineProperty,lr=Object.getOwnPropertyDescriptor,hr=(r,t,e,s)=>{for(var i=lr(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&cr(t,e,i),i};class zt extends Y{constructor(t){super(),this._pending=[],this._observer=new pt(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}hr([As()],zt.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kt=globalThis,pe=kt.ShadowRoot&&(kt.ShadyCSS===void 0||kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,fe=Symbol(),Ve=new WeakMap;let Ls=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==fe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(pe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ve.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ve.set(e,t))}return t}toString(){return this.cssText}};const ur=r=>new Ls(typeof r=="string"?r:r+"",void 0,fe),it=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new Ls(e,r,fe)},dr=(r,t)=>{if(pe)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=kt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},We=pe?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return ur(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:pr,defineProperty:fr,getOwnPropertyDescriptor:gr,getOwnPropertyNames:mr,getOwnPropertySymbols:yr,getPrototypeOf:vr}=Object,T=globalThis,Ye=T.trustedTypes,_r=Ye?Ye.emptyScript:"",Kt=T.reactiveElementPolyfillSupport,ut=(r,t)=>r,Ut={toAttribute(r,t){switch(t){case Boolean:r=r?_r:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ge=(r,t)=>!pr(r,t),Qe={attribute:!0,type:String,converter:Ut,reflect:!1,hasChanged:ge};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),T.litPropertyMetadata??(T.litPropertyMetadata=new WeakMap);class W extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Qe){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&fr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=gr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const c=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,c,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Qe}static _$Ei(){if(this.hasOwnProperty(ut("elementProperties")))return;const t=vr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ut("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ut("properties"))){const e=this.properties,s=[...mr(e),...yr(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(We(i))}else t!==void 0&&e.push(We(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return dr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var n;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Ut).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),c=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:Ut;this._$Em=i,this[i]=c.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ge)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}W.elementStyles=[],W.shadowRootOptions={mode:"open"},W[ut("elementProperties")]=new Map,W[ut("finalized")]=new Map,Kt==null||Kt({ReactiveElement:W}),(T.reactiveElementVersions??(T.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const dt=globalThis,Nt=dt.trustedTypes,Ke=Nt?Nt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Is="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,js="?"+C,br=`<${js}>`,z=document,mt=()=>z.createComment(""),yt=r=>r===null||typeof r!="object"&&typeof r!="function",me=Array.isArray,$r=r=>me(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Jt=`[ 	
\f\r]`,ct=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Je=/-->/g,Ze=/>/g,M=RegExp(`>|${Jt}(?:([^\\s"'>=/]+)(${Jt}*=${Jt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ge=/'/g,Xe=/"/g,Hs=/^(?:script|style|textarea|title)$/i,wr=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),y=wr(1),X=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),ts=new WeakMap,I=z.createTreeWalker(z,129);function zs(r,t){if(!me(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ke!==void 0?Ke.createHTML(t):t}const xr=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=ct;for(let c=0;c<e;c++){const a=r[c];let d,f,u=-1,l=0;for(;l<a.length&&(o.lastIndex=l,f=o.exec(a),f!==null);)l=o.lastIndex,o===ct?f[1]==="!--"?o=Je:f[1]!==void 0?o=Ze:f[2]!==void 0?(Hs.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=M):f[3]!==void 0&&(o=M):o===M?f[0]===">"?(o=i??ct,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?M:f[3]==='"'?Xe:Ge):o===Xe||o===Ge?o=M:o===Je||o===Ze?o=ct:(o=M,i=void 0);const h=o===M&&r[c+1].startsWith("/>")?" ":"";n+=o===ct?a+br:u>=0?(s.push(d),a.slice(0,u)+Is+a.slice(u)+C+h):a+C+(u===-2?c:h)}return[zs(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class vt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const c=t.length-1,a=this.parts,[d,f]=xr(t,e);if(this.el=vt.createElement(d,s),I.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=I.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Is)){const l=f[o++],h=i.getAttribute(u).split(C),p=/([.?@])?(.*)/.exec(l);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Er:p[1]==="?"?Sr:p[1]==="@"?kr:Dt}),i.removeAttribute(u)}else u.startsWith(C)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(Hs.test(i.tagName)){const u=i.textContent.split(C),l=u.length-1;if(l>0){i.textContent=Nt?Nt.emptyScript:"";for(let h=0;h<l;h++)i.append(u[h],mt()),I.nextNode(),a.push({type:2,index:++n});i.append(u[l],mt())}}}else if(i.nodeType===8)if(i.data===js)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(C,u+1))!==-1;)a.push({type:7,index:n}),u+=C.length-1}n++}}static createElement(t,e){const s=z.createElement("template");return s.innerHTML=t,s}}function tt(r,t,e=r,s){var o,c;if(t===X)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=yt(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((c=i==null?void 0:i._$AO)==null||c.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=tt(r,i._$AS(r,t.values),i,s)),t}class Ar{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??z).importNode(e,!0);I.currentNode=i;let n=I.nextNode(),o=0,c=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new xt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Pr(n,this,t)),this._$AV.push(d),a=s[++c]}o!==(a==null?void 0:a.index)&&(n=I.nextNode(),o++)}return I.currentNode=z,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class xt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),yt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==X&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):$r(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&yt(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=vt.createElement(zs(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{const o=new Ar(i,this),c=o.u(this.options);o.p(e),this.T(c),this._$AH=o}}_$AC(t){let e=ts.get(t.strings);return e===void 0&&ts.set(t.strings,e=new vt(t)),e}k(t){me(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new xt(this.O(mt()),this.O(mt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Dt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=tt(this,t,e,0),o=!yt(t)||t!==this._$AH&&t!==X,o&&(this._$AH=t);else{const c=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=tt(this,c[s+a],e,a),d===X&&(d=this._$AH[a]),o||(o=!yt(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Er extends Dt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Sr extends Dt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class kr extends Dt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??$)===X)return;const s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Pr{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const Zt=dt.litHtmlPolyfillSupport;Zt==null||Zt(vt,xt),(dt.litHtmlVersions??(dt.litHtmlVersions=[])).push("3.2.1");const Cr=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new xt(t.insertBefore(mt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let O=class extends W{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Cr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return X}};var es;O._$litElement$=!0,O.finalized=!0,(es=globalThis.litElementHydrateSupport)==null||es.call(globalThis,{LitElement:O});const Gt=globalThis.litElementPolyfillSupport;Gt==null||Gt({LitElement:O});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");const ye=class ye extends O{constructor(){super(...arguments),this.username=""}connectedCallback(){super.connectedCallback(),this.username=localStorage.getItem("username")||""}toggleDarkMode(t){const e=t.target.checked;document.body.classList.toggle("dark-mode",e)}signOut(){localStorage.removeItem("username"),this.username="",this.requestUpdate()}render(){return y`
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

          <!-- Conditionally render username or login link -->
          <div class="login">
            ${this.username?y`
                  <span>Hello, ${this.username}</span>
                  <button @click="${this.signOut}">Sign Out</button>
                `:y`<a href="../app/login">Login</a>`}
          </div>
        </div>
      </header>
    `}};ye.styles=it`
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
  `;let Mt=ye;st({"all-header":Mt,"mu-auth":It.Provider});window.relayEvent=ci.relay;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tr={attribute:!0,type:String,converter:Ut,reflect:!1,hasChanged:ge},Or=(r=Tr,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(c){const a=t.get.call(this);t.set.call(this,c),this.requestUpdate(o,a,r)},init(c){return c!==void 0&&this.P(o,void 0,r),c}}}if(s==="setter"){const{name:o}=e;return function(c){const a=this[o];t.call(this,c),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function Ds(r){return(t,e)=>typeof e=="object"?Or(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function k(r){return Ds({...r,state:!0,attribute:!1})}var Rr=Object.defineProperty,Ur=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Rr(t,e,i),i};const ve=class ve extends zt{constructor(){super("apptrak:model"),this.searchQuery=""}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["applications/load"])}handleSearch(){const t=this.searchQuery.toLowerCase();this.dispatchMessage(["search/item",{query:t}]),this.searchQuery=""}render(){const{applications:t=[]}=this.model,e={total:t.length,pending:t.filter(i=>i.status==="Pending").length,submitted:t.filter(i=>i.status==="Submitted").length,interview:t.filter(i=>i.status==="Interview Scheduled").length,accepted:t.filter(i=>i.status==="Accepted").length,rejected:t.filter(i=>i.status==="Rejected").length},s=t.slice(0,5);return y`
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
    `}};ve.styles=it`
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
  `;let _t=ve;Ur([k()],_t.prototype,"searchQuery");st({"home-view":_t});const _e=class _e extends zt{constructor(){super("apptrak:model")}render(){return y`
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
    `}};_e.styles=it`
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
  `;let Lt=_e;st({"about-view":Lt});var Nr=Object.defineProperty,rt=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Nr(t,e,i),i};const be=class be extends O{constructor(){super(...arguments),this.username="",this.password="",this.confirmPassword="",this.errorMessage="",this.successMessage="",this.isRegister=!1}handleLogin(){console.log("Attempting login with:",{username:this.username}),fetch("/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:this.username,password:this.password})}).then(t=>{if(t.ok)console.log("Login successful!"),window.location.href="/";else throw new Error("Invalid username or password")}).catch(t=>{console.error("Login failed:",t),this.errorMessage="Invalid username or password. Please try again."})}handleRegister(){if(console.log("Attempting registration with:",{username:this.username,password:this.password,confirmPassword:this.confirmPassword}),this.password!==this.confirmPassword){this.errorMessage="Passwords do not match!";return}fetch("/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:this.username,password:this.password})}).then(t=>{if(t.ok)console.log("Registration successful!"),this.successMessage="Registration successful! You can now log in.",this.isRegister=!1,this.errorMessage="";else return t.json().then(e=>{throw new Error(e.message||"Registration failed")})}).catch(t=>{console.error("Registration failed:",t),this.errorMessage=t.message||"Registration failed. Please try again."})}toggleView(){this.isRegister=!this.isRegister,this.errorMessage="",this.successMessage="",this.username="",this.password="",this.confirmPassword=""}render(){return y`
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
    `}};be.styles=it`
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
  `;let S=be;rt([k()],S.prototype,"username");rt([k()],S.prototype,"password");rt([k()],S.prototype,"confirmPassword");rt([k()],S.prototype,"errorMessage");rt([k()],S.prototype,"successMessage");rt([k()],S.prototype,"isRegister");var Mr=Object.defineProperty,Fs=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Mr(t,e,i),i};const $e=class $e extends O{constructor(){super(...arguments),this.itemId="",this.application=null}connectedCallback(){super.connectedCallback(),console.log("ConnectedCallback -> Item ID:",this.itemId),this.itemId?this.hydrate():console.error("Missing itemId for application.")}hydrate(){this.itemId?(console.log("Fetching application with ID:",this.itemId),fetch(`/api/applications/${this.itemId}`).then(t=>{if(t.ok)return t.json();throw new Error(`Error fetching application: ${t.statusText}`)}).then(t=>{this.application={...t,status:t.status||"Not specified"}}).catch(t=>{console.error("Failed to fetch application:",t)})):(console.log("Fetching all applications..."),fetch("/api/applications").then(t=>{if(t.ok)return t.json();throw new Error(`Error fetching applications: ${t.statusText}`)}).then(t=>{console.log("Fetched applications:",t),this.application=t.length>0?t[0]:null}).catch(t=>{console.error("Failed to fetch applications:",t)}))}handleBackButton(){window.history.back()}handleDelete(){this.itemId?fetch(`/api/applications/${this.itemId}`,{method:"DELETE",headers:{"Content-Type":"application/json"}}).then(t=>{if(t.ok)console.log("Application deleted successfully."),window.history.back();else throw new Error(`Error deleting application: ${t.statusText}`)}).catch(t=>{console.error("Failed to delete application:",t)}):console.error("No itemId provided for deletion.")}render(){if(!this.application)return y`<p>Loading application...</p>`;const{title:t,status:e,appliedDate:s,method:i,notes:n,company:o}=this.application,{name:c,state:a,city:d,streetAddress:f}=o,u=new Date(s).toLocaleDateString();return y`
      <main>
        <section class="application-section">
          <!-- Flexbox container for back button and title -->
          <div class="header">
            <button @click="${this.handleBackButton}" class="back-button">← Back</button>
            <h2 class="title">${t}</h2>
          </div>

          <div class="company-info">
            <h3>Company: ${c}</h3>
            <p><strong>Location:</strong> ${d}, ${a}</p>
            <p><strong>Address:</strong> ${f}</p>
          </div>

          <div class="application-details">
            <p><strong>Applied on:</strong> ${u}</p>
            <p><strong>Status:</strong> ${e}</p>
            <p><strong>Application Method:</strong> ${i||"Not specified"}</p>

            <div class="notes">
              <h3>Notes</h3>
              <p>${n||"No notes available"}</p>
            </div>
          </div>

          <!-- Delete button -->
          <div class="action-buttons">
            <button @click="${this.handleDelete}" class="delete-button">Delete Application</button>
          </div>
        </section>
      </main>
    `}};$e.styles=it`
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
    `;let et=$e;Fs([Ds({type:String})],et.prototype,"itemId");Fs([k()],et.prototype,"application");var Lr=Object.defineProperty,Ir=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Lr(t,e,i),i};const we=class we extends zt{constructor(){super("apptrak:model"),this.searchQuery=""}connectedCallback(){super.connectedCallback(),console.log("Component connected. Loading all applications..."),this.loadAllApplications()}loadAllApplications(){this.dispatchMessage(["applications/load"])}handleSearch(){const t=this.searchQuery.toLowerCase();console.log("Search query:",t),this.dispatchMessage(["applications/search",{query:t}]),this.searchQuery=""}render(){const{applications:t=[]}=this.model;return y`
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
    `}};we.styles=it`
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
      border-radius: 40px;
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
  `;let bt=we;Ir([k()],bt.prototype,"searchQuery");st({"application-search-view":bt});const jr={companys:[],totalCost:0,applications:[]};function qs(r,t,e){switch(r[0]){case"companys/load":Hr(e).then(n=>t(o=>({...o,companys:n}))).catch(n=>{console.error("Failed to fetch companys:",n)});break;case"applications/load":Bs(e).then(n=>t(o=>({...o,applications:n}))).catch(n=>{console.error("Failed to fetch applications:",n)});break;case"applications/search":console.log("DISPATCHING SEARCH QUERY:",r[1].query),zr(r[1].query,t,e);break;case"applications/delete":const{id:s}=r[1];t(n=>{const o=n.applications.filter(c=>c.id!==s);return{...n,applications:o}});break;default:const i=r[0];throw new Error(`Unhandled Auth message "${i}"`)}}function Hr(r){return fetch("/api/companys",{headers:It.headers(r)}).then(t=>{if(!t.ok)throw t.status===401?new Error("Unauthorized: User must log in."):new Error(`API error: ${t.statusText}`);return t.json()}).then(t=>{if(Array.isArray(t))return t;throw new Error("Unexpected response format")})}function Bs(r){return fetch("/api/applications",{headers:It.headers(r)}).then(t=>{if(!t.ok)throw t.status===401?new Error("Unauthorized: User must log in."):new Error(`API error: ${t.statusText}`);return t.json()}).then(t=>{if(Array.isArray(t))return t;throw new Error("Unexpected response format")})}function zr(r,t,e){Bs(e).then(s=>{console.log("FETCHED APPLICATIONS: ",s);const i=r.toLowerCase(),n=s.filter(o=>o.title.toLowerCase().includes(i));t(o=>({...o,applications:n}))}).catch(s=>{console.error("Failed to fetch applications:",s)})}const xe=class xe extends O{render(){return y`
            <mu-switch></mu-switch>`}connectedCallback(){super.connectedCallback()}};xe.uses=st({"home-view":_t,"login-view":S,"about-view":Lt,"application-view":et,"application-search-view":bt,"mu-store":class extends ys.Provider{constructor(){super(qs,jr,"apptrak:auth")}}});let re=xe;const Dr=[{path:"/app/login",view:()=>y`
            <login-view></login-view>`},{path:"/app/about-view",view:()=>y`
            <about-view></about-view>
        `},{path:"/app/applications/:id",view:r=>y`
            <application-view itemId="${r.id}"></application-view>
        `},{path:"/app/application-search-view",view:()=>y`
            <application-search-view></application-search-view>
        `},{path:"/app",view:()=>y`
            <home-view></home-view>
        `},{path:"/",redirect:"/app"}];st({"mu-auth":It.Provider,"mu-history":fi.Provider,"mu-store":class extends ys.Provider{constructor(){super(qs,{companys:[],totalCost:0,applications:[]},"apptrak:auth")}},"mu-switch":class extends nr.Element{constructor(){super(Dr,"apptrak:history","apptrak:auth")}},"apptrak-app":re,"all-header":Mt,"application-view":et});
