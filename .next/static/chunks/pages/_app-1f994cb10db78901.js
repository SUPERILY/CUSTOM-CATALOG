(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[888],{6840:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return r(930)}])},7183:function(e,t,r){"use strict";let o,a;r.d(t,{V:function(){return em},C:function(){return eh}});var n,s=r(5893),i=r(7294);let l={data:""},c=e=>{if("object"==typeof window){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||l},u=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,d=/\/\*[^]*?\*\/|  +/g,f=/\n+/g,p=(e,t)=>{let r="",o="",a="";for(let n in e){let s=e[n];"@"==n[0]?"i"==n[1]?r=n+" "+s+";":o+="f"==n[1]?p(s,n):n+"{"+p(s,"k"==n[1]?"":t)+"}":"object"==typeof s?o+=p(s,t?t.replace(/([^,])+/g,e=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):n):null!=s&&(n=/^--/.test(n)?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),a+=p.p?p.p(n,s):n+":"+s+";")}return r+(t&&a?t+"{"+a+"}":a)+o},m={},h=e=>{if("object"==typeof e){let t="";for(let r in e)t+=r+h(e[r]);return t}return e},y=(e,t,r,o,a)=>{var n;let s=h(e),i=m[s]||(m[s]=(e=>{let t=0,r=11;for(;t<e.length;)r=101*r+e.charCodeAt(t++)>>>0;return"go"+r})(s));if(!m[i]){let t=s!==e?e:(e=>{let t,r,o=[{}];for(;t=u.exec(e.replace(d,""));)t[4]?o.shift():t[3]?(r=t[3].replace(f," ").trim(),o.unshift(o[0][r]=o[0][r]||{})):o[0][t[1]]=t[2].replace(f," ").trim();return o[0]})(e);m[i]=p(a?{["@keyframes "+i]:t}:t,r?"":"."+i)}let l=r&&m.g?m.g:null;return r&&(m.g=m[i]),n=m[i],l?t.data=t.data.replace(l,n):-1===t.data.indexOf(n)&&(t.data=o?n+t.data:t.data+n),i},g=(e,t,r)=>e.reduce((e,o,a)=>{let n=t[a];if(n&&n.call){let e=n(r),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;n=t?"."+t:e&&"object"==typeof e?e.props?"":p(e,""):!1===e?"":e}return e+o+(null==n?"":n)},"");function x(e){let t=this||{},r=e.call?e(t.p):e;return y(r.unshift?r.raw?g(r,[].slice.call(arguments,1),t.p):r.reduce((e,r)=>Object.assign(e,r&&r.call?r(t.p):r),{}):r,c(t.target),t.g,t.o,t.k)}x.bind({g:1});let b,v,w,j=x.bind({k:1});function k(e,t){let r=this||{};return function(){let o=arguments;function a(n,s){let i=Object.assign({},n),l=i.className||a.className;r.p=Object.assign({theme:v&&v()},i),r.o=/ *go\d+/.test(l),i.className=x.apply(r,o)+(l?" "+l:""),t&&(i.ref=s);let c=e;return e[0]&&(c=i.as||e,delete i.as),w&&c[0]&&w(i),b(c,i)}return t?t(a):a}}var C=e=>"function"==typeof e,E=(e,t)=>C(e)?e(t):e,N=(o=0,()=>(++o).toString()),_=()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a},O="default",A=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:o}=t;return A(e,{type:e.toasts.find(e=>e.id===o.id)?1:0,toast:o});case 3:let{toastId:a}=t;return{...e,toasts:e.toasts.map(e=>e.id===a||void 0===a?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+n}))}}},P=[],M={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},S={},T=(e,t=O)=>{S[t]=A(S[t]||M,e),P.forEach(([e,r])=>{e===t&&r(S[t])})},R=e=>Object.keys(S).forEach(t=>T(e,t)),I=e=>Object.keys(S).find(t=>S[t].toasts.some(t=>t.id===e)),L=(e=O)=>t=>{T(t,e)},$={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},D=(e={},t=O)=>{let[r,o]=(0,i.useState)(S[t]||M),a=(0,i.useRef)(S[t]);(0,i.useEffect)(()=>(a.current!==S[t]&&o(S[t]),P.push([t,o]),()=>{let e=P.findIndex(([e])=>e===t);e>-1&&P.splice(e,1)}),[t]);let n=r.toasts.map(t=>{var r,o,a;return{...e,...e[t.type],...t,removeDelay:t.removeDelay||(null==(r=e[t.type])?void 0:r.removeDelay)||(null==e?void 0:e.removeDelay),duration:t.duration||(null==(o=e[t.type])?void 0:o.duration)||(null==e?void 0:e.duration)||$[t.type],style:{...e.style,...null==(a=e[t.type])?void 0:a.style,...t.style}}});return{...r,toasts:n}},U=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(null==r?void 0:r.id)||N()}),z=e=>(t,r)=>{let o=U(t,e,r);return L(o.toasterId||I(o.id))({type:2,toast:o}),o.id},F=(e,t)=>z("blank")(e,t);F.error=z("error"),F.success=z("success"),F.loading=z("loading"),F.custom=z("custom"),F.dismiss=(e,t)=>{let r={type:3,toastId:e};t?L(t)(r):R(r)},F.dismissAll=e=>F.dismiss(void 0,e),F.remove=(e,t)=>{let r={type:4,toastId:e};t?L(t)(r):R(r)},F.removeAll=e=>F.remove(void 0,e),F.promise=(e,t,r)=>{let o=F.loading(t.loading,{...r,...null==r?void 0:r.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let a=t.success?E(t.success,e):void 0;return a?F.success(a,{id:o,...r,...null==r?void 0:r.success}):F.dismiss(o),e}).catch(e=>{let a=t.error?E(t.error,e):void 0;a?F.error(a,{id:o,...r,...null==r?void 0:r.error}):F.dismiss(o)}),e};var Z=1e3,H=(e,t="default")=>{let{toasts:r,pausedAt:o}=D(e,t),a=(0,i.useRef)(new Map).current,n=(0,i.useCallback)((e,t=Z)=>{if(a.has(e))return;let r=setTimeout(()=>{a.delete(e),s({type:4,toastId:e})},t);a.set(e,r)},[]);(0,i.useEffect)(()=>{if(o)return;let e=Date.now(),a=r.map(r=>{if(r.duration===1/0)return;let o=(r.duration||0)+r.pauseDuration-(e-r.createdAt);if(o<0){r.visible&&F.dismiss(r.id);return}return setTimeout(()=>F.dismiss(r.id,t),o)});return()=>{a.forEach(e=>e&&clearTimeout(e))}},[r,o,t]);let s=(0,i.useCallback)(L(t),[t]),l=(0,i.useCallback)(()=>{s({type:5,time:Date.now()})},[s]),c=(0,i.useCallback)((e,t)=>{s({type:1,toast:{id:e,height:t}})},[s]),u=(0,i.useCallback)(()=>{o&&s({type:6,time:Date.now()})},[o,s]),d=(0,i.useCallback)((e,t)=>{let{reverseOrder:o=!1,gutter:a=8,defaultPosition:n}=t||{},s=r.filter(t=>(t.position||n)===(e.position||n)&&t.height),i=s.findIndex(t=>t.id===e.id),l=s.filter((e,t)=>t<i&&e.visible).length;return s.filter(e=>e.visible).slice(...o?[l+1]:[0,l]).reduce((e,t)=>e+(t.height||0)+a,0)},[r]);return(0,i.useEffect)(()=>{r.forEach(e=>{if(e.dismissed)n(e.id,e.removeDelay);else{let t=a.get(e.id);t&&(clearTimeout(t),a.delete(e.id))}})},[r,n]),{toasts:r,handlers:{updateHeight:c,startPause:l,endPause:u,calculateOffset:d}}},V=j`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,K=j`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,W=j`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,B=k("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${V} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${K} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${W} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Y=j`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,q=k("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${Y} 1s linear infinite;
`,X=j`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,G=j`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,J=k("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${X} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${G} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Q=k("div")`
  position: absolute;
`,ee=k("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,et=j`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,er=k("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${et} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,eo=({toast:e})=>{let{icon:t,type:r,iconTheme:o}=e;return void 0!==t?"string"==typeof t?i.createElement(er,null,t):t:"blank"===r?null:i.createElement(ee,null,i.createElement(q,{...o}),"loading"!==r&&i.createElement(Q,null,"error"===r?i.createElement(B,{...o}):i.createElement(J,{...o})))},ea=e=>`
0% {transform: translate3d(0,${-200*e}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,en=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*e}%,-1px) scale(.6); opacity:0;}
`,es=k("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,ei=k("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,el=(e,t)=>{let r=e.includes("top")?1:-1,[o,a]=_()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[ea(r),en(r)];return{animation:t?`${j(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${j(a)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},ec=i.memo(({toast:e,position:t,style:r,children:o})=>{let a=e.height?el(e.position||t||"top-center",e.visible):{opacity:0},n=i.createElement(eo,{toast:e}),s=i.createElement(ei,{...e.ariaProps},E(e.message,e));return i.createElement(es,{className:e.className,style:{...a,...r,...e.style}},"function"==typeof o?o({icon:n,message:s}):i.createElement(i.Fragment,null,n,s))});n=i.createElement,p.p=void 0,b=n,v=void 0,w=void 0;var eu=({id:e,className:t,style:r,onHeightUpdate:o,children:a})=>{let n=i.useCallback(t=>{if(t){let r=()=>{o(e,t.getBoundingClientRect().height)};r(),new MutationObserver(r).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,o]);return i.createElement("div",{ref:n,className:t,style:r},a)},ed=(e,t)=>{let r=e.includes("top"),o=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:_()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...r?{top:0}:{bottom:0},...o}},ef=x`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,ep=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:o,children:a,toasterId:n,containerStyle:s,containerClassName:l})=>{let{toasts:c,handlers:u}=H(r,n);return i.createElement("div",{"data-rht-toaster":n||"",style:{position:"fixed",zIndex:9999,top:16,left:16,right:16,bottom:16,pointerEvents:"none",...s},className:l,onMouseEnter:u.startPause,onMouseLeave:u.endPause},c.map(r=>{let n=r.position||t,s=ed(n,u.calculateOffset(r,{reverseOrder:e,gutter:o,defaultPosition:t}));return i.createElement(eu,{id:r.id,key:r.id,onHeightUpdate:u.updateHeight,className:r.visible?ef:"",style:s},"custom"===r.type?E(r.message,r):a?a(r):i.createElement(ec,{toast:r,position:n}))}))};let em=e=>{let{children:t}=e;return(0,s.jsxs)(s.Fragment,{children:[t,(0,s.jsx)(ep,{position:"top-right",reverseOrder:!1,gutter:8,toastOptions:{duration:4e3,style:{background:"#fff",color:"#363636",padding:"16px",borderRadius:"8px",boxShadow:"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"},success:{duration:3e3,iconTheme:{primary:"#10b981",secondary:"#fff"}},error:{duration:5e3,iconTheme:{primary:"#ef4444",secondary:"#fff"}}}})]})},eh={success:e=>F.success(e),error:e=>F.error(e),loading:e=>F.loading(e),promise:(e,t)=>F.promise(e,t)}},4566:function(e,t,r){"use strict";r.d(t,{U:function(){return s},s:function(){return i}});var o=r(5893),a=r(7294);let n=(0,a.createContext)(void 0),s=e=>{let{children:t}=e,[r,s]=(0,a.useState)([]),[i,l]=(0,a.useState)(!0);return(0,a.useEffect)(()=>{(async()=>{try{let e=await fetch("/api/stock-status");if(e.ok){let t=await e.json();s(t)}}catch(e){console.error("Failed to fetch stock statuses:",e)}finally{l(!1)}})()},[]),(0,o.jsx)(n.Provider,{value:{statuses:r,getStatusColor:e=>{let t=r.find(t=>t.value===e);return t?t.color:"gray"},getStatusLabel:e=>{let t=r.find(t=>t.value===e);return t?t.label:e},loading:i},children:t})},i=()=>{let e=(0,a.useContext)(n);if(void 0===e)throw Error("useStockStatus must be used within a StockStatusProvider");return e}},5781:function(e,t,r){"use strict";r.d(t,{T:function(){return i},_:function(){return s}});var o=r(5893),a=r(7294);let n=(0,a.createContext)(void 0),s=e=>{let{children:t}=e,[r,s]=(0,a.useState)(null),[i,l]=(0,a.useState)(!0),c=async()=>{try{let e=await fetch("/api/settings");if(e.ok){let t=await e.json();s(t)}}catch(e){console.error("Failed to fetch store settings:",e)}finally{l(!1)}};return(0,a.useEffect)(()=>{c()},[]),(0,o.jsx)(n.Provider,{value:{settings:r,loading:i,refreshSettings:c},children:t})},i=()=>{let e=(0,a.useContext)(n);if(void 0===e)throw Error("useStoreSettings must be used within a StoreSettingsProvider");return e}},1462:function(e,t,r){"use strict";r.d(t,{Z:function(){return d}});var o=r(7294);/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),n=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,t,r)=>r?r.toUpperCase():t.toLowerCase()),s=e=>{let t=n(e);return t.charAt(0).toUpperCase()+t.slice(1)},i=function(){for(var e=arguments.length,t=Array(e),r=0;r<e;r++)t[r]=arguments[r];return t.filter((e,t,r)=>!!e&&""!==e.trim()&&r.indexOf(e)===t).join(" ").trim()},l=e=>{for(let t in e)if(t.startsWith("aria-")||"role"===t||"title"===t)return!0};/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var c={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.554.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let u=(0,o.forwardRef)((e,t)=>{let{color:r="currentColor",size:a=24,strokeWidth:n=2,absoluteStrokeWidth:s,className:u="",children:d,iconNode:f,...p}=e;return(0,o.createElement)("svg",{ref:t,...c,width:a,height:a,stroke:r,strokeWidth:s?24*Number(n)/Number(a):n,className:i("lucide",u),...!d&&!l(p)&&{"aria-hidden":"true"},...p},[...f.map(e=>{let[t,r]=e;return(0,o.createElement)(t,r)}),...Array.isArray(d)?d:[d]])}),d=(e,t)=>{let r=(0,o.forwardRef)((r,n)=>{let{className:l,...c}=r;return(0,o.createElement)(u,{ref:n,iconNode:t,className:i("lucide-".concat(a(s(e))),"lucide-".concat(e),l),...c})});return r.displayName=s(e),r}},3460:function(e,t,r){"use strict";r.d(t,{Z:function(){return o}});let o=(0,r(1462).Z)("lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]])},760:function(e,t,r){"use strict";r.d(t,{Z:function(){return o}});let o=(0,r(1462).Z)("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]])},8154:function(e,t,r){"use strict";r.d(t,{Z:function(){return o}});let o=(0,r(1462).Z)("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]])},6691:function(e,t){"use strict";var r,o,a,n;Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{ACTION_FAST_REFRESH:function(){return d},ACTION_NAVIGATE:function(){return i},ACTION_PREFETCH:function(){return u},ACTION_REFRESH:function(){return s},ACTION_RESTORE:function(){return l},ACTION_SERVER_ACTION:function(){return f},ACTION_SERVER_PATCH:function(){return c},PrefetchCacheEntryStatus:function(){return o},PrefetchKind:function(){return r},isThenable:function(){return p}});let s="refresh",i="navigate",l="restore",c="server-patch",u="prefetch",d="fast-refresh",f="server-action";function p(e){return e&&("object"==typeof e||"function"==typeof e)&&"function"==typeof e.then}(a=r||(r={})).AUTO="auto",a.FULL="full",a.TEMPORARY="temporary",(n=o||(o={})).fresh="fresh",n.reusable="reusable",n.expired="expired",n.stale="stale",("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},4318:function(e,t,r){"use strict";function o(e,t,r,o){return!1}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getDomainLocale",{enumerable:!0,get:function(){return o}}),r(8364),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},9577:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return v}});let o=r(8754),a=r(5893),n=o._(r(7294)),s=r(1401),i=r(2045),l=r(7420),c=r(7201),u=r(1443),d=r(9953),f=r(5320),p=r(2905),m=r(4318),h=r(953),y=r(6691),g=new Set;function x(e,t,r,o,a,n){if(n||(0,i.isLocalURL)(t)){if(!o.bypassPrefetchedCheck){let a=t+"%"+r+"%"+(void 0!==o.locale?o.locale:"locale"in e?e.locale:void 0);if(g.has(a))return;g.add(a)}(async()=>n?e.prefetch(t,a):e.prefetch(t,r,o))().catch(e=>{})}}function b(e){return"string"==typeof e?e:(0,l.formatUrl)(e)}let v=n.default.forwardRef(function(e,t){let r,o;let{href:l,as:g,children:v,prefetch:w=null,passHref:j,replace:k,shallow:C,scroll:E,locale:N,onClick:_,onMouseEnter:O,onTouchStart:A,legacyBehavior:P=!1,...M}=e;r=v,P&&("string"==typeof r||"number"==typeof r)&&(r=(0,a.jsx)("a",{children:r}));let S=n.default.useContext(d.RouterContext),T=n.default.useContext(f.AppRouterContext),R=null!=S?S:T,I=!S,L=!1!==w,$=null===w?y.PrefetchKind.AUTO:y.PrefetchKind.FULL,{href:D,as:U}=n.default.useMemo(()=>{if(!S){let e=b(l);return{href:e,as:g?b(g):e}}let[e,t]=(0,s.resolveHref)(S,l,!0);return{href:e,as:g?(0,s.resolveHref)(S,g):t||e}},[S,l,g]),z=n.default.useRef(D),F=n.default.useRef(U);P&&(o=n.default.Children.only(r));let Z=P?o&&"object"==typeof o&&o.ref:t,[H,V,K]=(0,p.useIntersection)({rootMargin:"200px"}),W=n.default.useCallback(e=>{(F.current!==U||z.current!==D)&&(K(),F.current=U,z.current=D),H(e),Z&&("function"==typeof Z?Z(e):"object"==typeof Z&&(Z.current=e))},[U,Z,D,K,H]);n.default.useEffect(()=>{R&&V&&L&&x(R,D,U,{locale:N},{kind:$},I)},[U,D,V,N,L,null==S?void 0:S.locale,R,I,$]);let B={ref:W,onClick(e){P||"function"!=typeof _||_(e),P&&o.props&&"function"==typeof o.props.onClick&&o.props.onClick(e),R&&!e.defaultPrevented&&function(e,t,r,o,a,s,l,c,u){let{nodeName:d}=e.currentTarget;if("A"===d.toUpperCase()&&(function(e){let t=e.currentTarget.getAttribute("target");return t&&"_self"!==t||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which}(e)||!u&&!(0,i.isLocalURL)(r)))return;e.preventDefault();let f=()=>{let e=null==l||l;"beforePopState"in t?t[a?"replace":"push"](r,o,{shallow:s,locale:c,scroll:e}):t[a?"replace":"push"](o||r,{scroll:e})};u?n.default.startTransition(f):f()}(e,R,D,U,k,C,E,N,I)},onMouseEnter(e){P||"function"!=typeof O||O(e),P&&o.props&&"function"==typeof o.props.onMouseEnter&&o.props.onMouseEnter(e),R&&(L||!I)&&x(R,D,U,{locale:N,priority:!0,bypassPrefetchedCheck:!0},{kind:$},I)},onTouchStart:function(e){P||"function"!=typeof A||A(e),P&&o.props&&"function"==typeof o.props.onTouchStart&&o.props.onTouchStart(e),R&&(L||!I)&&x(R,D,U,{locale:N,priority:!0,bypassPrefetchedCheck:!0},{kind:$},I)}};if((0,c.isAbsoluteUrl)(U))B.href=U;else if(!P||j||"a"===o.type&&!("href"in o.props)){let e=void 0!==N?N:null==S?void 0:S.locale,t=(null==S?void 0:S.isLocaleDomain)&&(0,m.getDomainLocale)(U,e,null==S?void 0:S.locales,null==S?void 0:S.domainLocales);B.href=t||(0,h.addBasePath)((0,u.addLocale)(U,e,null==S?void 0:S.defaultLocale))}return P?n.default.cloneElement(o,B):(0,a.jsx)("a",{...M,...B,children:r})});("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},2905:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"useIntersection",{enumerable:!0,get:function(){return l}});let o=r(7294),a=r(3815),n="function"==typeof IntersectionObserver,s=new Map,i=[];function l(e){let{rootRef:t,rootMargin:r,disabled:l}=e,c=l||!n,[u,d]=(0,o.useState)(!1),f=(0,o.useRef)(null),p=(0,o.useCallback)(e=>{f.current=e},[]);return(0,o.useEffect)(()=>{if(n){if(c||u)return;let e=f.current;if(e&&e.tagName)return function(e,t,r){let{id:o,observer:a,elements:n}=function(e){let t;let r={root:e.root||null,margin:e.rootMargin||""},o=i.find(e=>e.root===r.root&&e.margin===r.margin);if(o&&(t=s.get(o)))return t;let a=new Map;return t={id:r,observer:new IntersectionObserver(e=>{e.forEach(e=>{let t=a.get(e.target),r=e.isIntersecting||e.intersectionRatio>0;t&&r&&t(r)})},e),elements:a},i.push(r),s.set(r,t),t}(r);return n.set(e,t),a.observe(e),function(){if(n.delete(e),a.unobserve(e),0===n.size){a.disconnect(),s.delete(o);let e=i.findIndex(e=>e.root===o.root&&e.margin===o.margin);e>-1&&i.splice(e,1)}}}(e,e=>e&&d(e),{root:null==t?void 0:t.current,rootMargin:r})}else if(!u){let e=(0,a.requestIdleCallback)(()=>d(!0));return()=>(0,a.cancelIdleCallback)(e)}},[c,r,t,u,f.current]),[p,u,(0,o.useCallback)(()=>{d(!1)},[])]}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},930:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return y}});var o=r(5893);r(2318);var a=r(7294),n=r(1664),s=r.n(n),i=r(1163);let l=(0,r(1462).Z)("shopping-bag",[["path",{d:"M16 10a4 4 0 0 1-8 0",key:"1ltviw"}],["path",{d:"M3.103 6.034h17.794",key:"awc11p"}],["path",{d:"M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z",key:"o988cm"}]]);var c=r(3460),u=r(8154),d=r(760),f=r(5781);let p=e=>{let{children:t}=e,r=(0,i.useRouter)(),[n,p]=a.useState(!1),{settings:m}=(0,f.T)();return r.pathname.startsWith("/admin"),(0,o.jsxs)("div",{className:"min-h-screen flex flex-col bg-gray-50",children:[(0,o.jsxs)("header",{className:"bg-white shadow-sm sticky top-0 z-50",children:[(0,o.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:(0,o.jsxs)("div",{className:"flex justify-between h-16",children:[(0,o.jsx)("div",{className:"flex items-center",children:(0,o.jsxs)(s(),{href:"/",className:"flex-shrink-0 flex items-center gap-3 group",children:[(null==m?void 0:m.logoUrl)?(0,o.jsx)("img",{src:m.logoUrl,alt:m.storeName,className:"h-10 w-auto object-contain"}):(0,o.jsx)("div",{className:"bg-gradient-to-br from-yellow-600 to-yellow-800 text-white p-1.5 rounded-lg shadow-sm",children:(0,o.jsx)(l,{className:"h-6 w-6"})}),(0,o.jsxs)("div",{className:"flex flex-col",children:[(0,o.jsx)("span",{className:"font-display font-bold text-xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-800 uppercase leading-none",children:(null==m?void 0:m.storeName)||"Eljarjini"}),!(null==m?void 0:m.logoUrl)&&(0,o.jsx)("span",{className:"font-display italic text-sm text-yellow-600 leading-none self-end -mt-1",children:"Complexe"})]})]})}),(0,o.jsxs)("div",{className:"hidden sm:flex sm:items-center sm:gap-6",children:[(0,o.jsx)(s(),{href:"/",className:"text-gray-600 hover:text-yellow-700 font-medium transition-colors",children:"Catalog"}),(0,o.jsxs)(s(),{href:"/admin",className:"flex items-center gap-1 text-gray-500 hover:text-gray-900 font-medium transition-colors",children:[(0,o.jsx)(c.Z,{className:"h-4 w-4"}),"Admin"]})]}),(0,o.jsx)("div",{className:"flex items-center sm:hidden",children:(0,o.jsx)("button",{onClick:()=>p(!n),className:"inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none",children:n?(0,o.jsx)(u.Z,{className:"h-6 w-6"}):(0,o.jsx)(d.Z,{className:"h-6 w-6"})})})]})}),n&&(0,o.jsx)("div",{className:"sm:hidden bg-white border-t",children:(0,o.jsxs)("div",{className:"pt-2 pb-3 space-y-1",children:[(0,o.jsx)(s(),{href:"/",onClick:()=>p(!1),className:"block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-yellow-500 hover:text-yellow-700",children:"Catalog"}),(0,o.jsx)(s(),{href:"/admin",onClick:()=>p(!1),className:"block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-500 hover:text-gray-700",children:"Admin Console"})]})})]}),(0,o.jsx)("main",{className:"flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8",children:t}),(0,o.jsx)("footer",{className:"bg-white border-t mt-auto",children:(0,o.jsx)("div",{className:"max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8",children:(0,o.jsxs)("p",{className:"text-center text-gray-400 text-sm",children:["\xa9 ",new Date().getFullYear()," Eljarjini Complexe. All rights reserved."]})})})]})};var m=r(7183),h=r(4566),y=function(e){var t;let{Component:r,pageProps:a}=e,n=null!==(t=r.getLayout)&&void 0!==t?t:e=>(0,o.jsx)(p,{children:e});return(0,o.jsx)(m.V,{children:(0,o.jsx)(h.U,{children:(0,o.jsx)(f._,{children:n((0,o.jsx)(r,{...a}))})})})}},2318:function(){},1664:function(e,t,r){e.exports=r(9577)},1163:function(e,t,r){e.exports=r(9090)}},function(e){var t=function(t){return e(e.s=t)};e.O(0,[774,179],function(){return t(6840),t(9090)}),_N_E=e.O()}]);