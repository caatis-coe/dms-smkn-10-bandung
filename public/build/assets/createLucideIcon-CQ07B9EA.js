import{r as l,j as p}from"./app-pdqx5I1V.js";function m(e,t){if(typeof e=="function")return e(t);e!=null&&(e.current=t)}function y(...e){return t=>{let r=!1;const o=e.map(n=>{const s=m(n,t);return!r&&typeof s=="function"&&(r=!0),s});if(r)return()=>{for(let n=0;n<o.length;n++){const s=o[n];typeof s=="function"?s():m(e[n],null)}}}}function L(...e){return l.useCallback(y(...e),e)}function b(e){const t=E(e),r=l.forwardRef((o,n)=>{const{children:s,...i}=o,a=l.Children.toArray(s),c=a.find(S);if(c){const u=c.props.children,f=a.map(d=>d===c?l.Children.count(u)>1?l.Children.only(null):l.isValidElement(u)?u.props.children:null:d);return p.jsx(t,{...i,ref:n,children:l.isValidElement(u)?l.cloneElement(u,void 0,f):null})}return p.jsx(t,{...i,ref:n,children:s})});return r.displayName=`${e}.Slot`,r}var P=b("Slot");function E(e){const t=l.forwardRef((r,o)=>{const{children:n,...s}=r;if(l.isValidElement(n)){const i=x(n),a=w(s,n.props);return n.type!==l.Fragment&&(a.ref=o?y(o,i):i),l.cloneElement(n,a)}return l.Children.count(n)>1?l.Children.only(null):null});return t.displayName=`${e}.SlotClone`,t}var g=Symbol("radix.slottable");function W(e){const t=({children:r})=>p.jsx(p.Fragment,{children:r});return t.displayName=`${e}.Slottable`,t.__radixId=g,t}function S(e){return l.isValidElement(e)&&typeof e.type=="function"&&"__radixId"in e.type&&e.type.__radixId===g}function w(e,t){const r={...t};for(const o in t){const n=e[o],s=t[o];/^on[A-Z]/.test(o)?n&&s?r[o]=(...a)=>{const c=s(...a);return n(...a),c}:n&&(r[o]=n):o==="style"?r[o]={...n,...s}:o==="className"&&(r[o]=[n,s].filter(Boolean).join(" "))}return{...e,...r}}function x(e){let t=Object.getOwnPropertyDescriptor(e.props,"ref")?.get,r=t&&"isReactWarning"in t&&t.isReactWarning;return r?e.ref:(t=Object.getOwnPropertyDescriptor(e,"ref")?.get,r=t&&"isReactWarning"in t&&t.isReactWarning,r?e.props.ref:e.props.ref||e.ref)}/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),A=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,r,o)=>o?o.toUpperCase():r.toLowerCase()),C=e=>{const t=A(e);return t.charAt(0).toUpperCase()+t.slice(1)},h=(...e)=>e.filter((t,r,o)=>!!t&&t.trim()!==""&&o.indexOf(t)===r).join(" ").trim(),j=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0};/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var v={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=l.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:r=2,absoluteStrokeWidth:o,className:n="",children:s,iconNode:i,...a},c)=>l.createElement("svg",{ref:c,...v,width:t,height:t,stroke:e,strokeWidth:o?Number(r)*24/Number(t):r,className:h("lucide",n),...!s&&!j(a)&&{"aria-hidden":"true"},...a},[...i.map(([u,f])=>l.createElement(u,f)),...Array.isArray(s)?s:[s]]));/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=(e,t)=>{const r=l.forwardRef(({className:o,...n},s)=>l.createElement(I,{ref:s,iconNode:t,className:h(`lucide-${R(C(e))}`,`lucide-${e}`,o),...n}));return r.displayName=C(e),r};export{P as S,W as a,b,$ as c,y as d,L as u};
