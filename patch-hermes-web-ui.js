const fs = require("fs");
const path = "/usr/local/lib/node_modules/hermes-web-ui/dist/server/index.js";

let source = fs.readFileSync(path, "utf8");

const patterns = [
  {
    original:
      'O=U?.models?.length?[...U.models]:[i.model];if(!U&&i.api_key)try{let S=await _2(k,i.api_key);S.length>0&&(O=[...new Set([i.model,...S])])}catch{}',
    replacement:
      'O=U?.models?.length?[...U.models]:Array.from(new Set([i.model,...Object.keys(i.models||{})]));if(!U&&i.api_key)try{let S=await _2(k,i.api_key);S.length>0&&(O=[...new Set([i.model,...Object.keys(i.models||{}),...S])])}catch{}',
  },
  {
    original:
      'O=U?.models?.length?[...U.models]:[i.model];if(!U&&i.api_key)try{let f=await q2(k,i.api_key);f.length>0&&(O=[...new Set([i.model,...f])])}catch{}',
    replacement:
      'O=U?.models?.length?[...U.models]:Array.from(new Set([i.model,...Object.keys(i.models||{})]));if(!U&&i.api_key)try{let f=await q2(k,i.api_key);f.length>0&&(O=[...new Set([i.model,...Object.keys(i.models||{}),...f])])}catch{}',
  },
  {
    original:
      'C=[r.model];if(r.api_key)try{let x=await YR(L,r.api_key);x.length>0&&(C=[...new Set([r.model,...x])])}catch{}',
    replacement:
      'C=Array.from(new Set([r.model,...Object.keys(r.models||{})]));if(r.api_key)try{let x=await YR(L,r.api_key);x.length>0&&(C=[...new Set([r.model,...Object.keys(r.models||{}),...x])])}catch{}',
  },
  {
    original:
      'function nY(I){let l="",G=[],c=I.model;typeof c=="object"&&c!==null?l=String(c.default||"").trim():typeof c=="string"&&(l=c.trim());let b=I.custom_providers;if(Array.isArray(b)){let Z=[];for(let d of b)if(d&&typeof d=="object"){let W=String(d.name||"").trim(),m=String(d.model||"").trim();W&&m&&Z.push({id:m,label:`${W}: ${m}`})}Z.length>0&&G.push({provider:"Custom",models:Z})}return{default:l,groups:G}}',
    replacement:
      'function nY(I){let l="",G=[],c=I.model;typeof c=="object"&&c!==null?l=String(c.default||"").trim():typeof c=="string"&&(l=c.trim());let b=I.custom_providers;if(Array.isArray(b)){let Z=[];for(let d of b)if(d&&typeof d=="object"){let W=String(d.name||"").trim(),m=String(d.model||"").trim();if(W){let a=[m,...Object.keys(d.models||{})].map(N=>String(N||"").trim()).filter(Boolean);for(let N of new Set(a))Z.push({id:N,label:`${W}: ${N}`})}}Z.length>0&&G.push({provider:"Custom",models:Z})}return{default:l,groups:G}}',
  },
  {
    original:
      'let F=UL(p.name),H=p.base_url.replace(/\\/+$/,""),o=[p.model].filter(Boolean);if(p.api_key){let i=await BL(l,H,p.api_key);i.length>0&&(o=[...new Set([...o,...i])])}return{providerKey:F,label:p.name,base_url:H,models:o,api_key:p.api_key||""}}));',
    replacement:
      'let F=UL(p.name),H=p.base_url.replace(/\\/+$/,""),o=[p.model,...Object.keys(p.models||{})].map(i=>String(i||"").trim()).filter(Boolean);if(p.api_key){let i=await BL(l,H,p.api_key);i.length>0&&(o=[...new Set([...o,...i])])}return{providerKey:F,label:p.name,base_url:H,models:o,api_key:p.api_key||""}}));',
  },
  {
    original:
      'function UY(I){let l="",G=[],c=I.model;typeof c=="object"&&c!==null?l=String(c.default||"").trim():typeof c=="string"&&(l=c.trim());let b=I.custom_providers;if(Array.isArray(b)){let Z=[];for(let d of b)if(d&&typeof d=="object"){let W=String(d.name||"").trim(),a=String(d.model||"").trim();W&&a&&Z.push({id:a,label:`${W}: ${a}`})}Z.length>0&&G.push({provider:"Custom",models:Z})}return{default:l,groups:G}}',
    replacement:
      'function UY(I){let l="",G=[],c=I.model;typeof c=="object"&&c!==null?l=String(c.default||"").trim():typeof c=="string"&&(l=c.trim());let b=I.custom_providers;if(Array.isArray(b)){let Z=[];for(let d of b)if(d&&typeof d=="object"){let W=String(d.name||"").trim(),a=String(d.model||"").trim();if(W){let m=[a,...Object.keys(d.models||{})].map(e=>String(e||"").trim()).filter(Boolean);for(let e of new Set(m))Z.push({id:e,label:`${W}: ${e}`})}}Z.length>0&&G.push({provider:"Custom",models:Z})}return{default:l,groups:G}}',
  },
  {
    original:
      'function aY(I){let l="",G=[],c=I.model;typeof c=="object"&&c!==null?l=String(c.default||"").trim():typeof c=="string"&&(l=c.trim());let b=I.custom_providers;if(Array.isArray(b)){let Z=[];for(let d of b)if(d&&typeof d=="object"){let W=String(d.name||"").trim(),a=String(d.model||"").trim();W&&a&&Z.push({id:a,label:`${W}: ${a}`})}Z.length>0&&G.push({provider:"Custom",models:Z})}return{default:l,groups:G}}',
    replacement:
      'function aY(I){let l="",G=[],c=I.model;typeof c=="object"&&c!==null?l=String(c.default||"").trim():typeof c=="string"&&(l=c.trim());let b=I.custom_providers;if(Array.isArray(b)){let Z=[];for(let d of b)if(d&&typeof d=="object"){let W=String(d.name||"").trim(),a=String(d.model||"").trim();if(W){let m=[a,...Object.keys(d.models||{})].map(e=>String(e||"").trim()).filter(Boolean);for(let e of new Set(m))Z.push({id:e,label:`${W}: ${e}`})}}Z.length>0&&G.push({provider:"Custom",models:Z})}return{default:l,groups:G}}',
  },
  {
    original:
      'function CY(I){let l="",G=[],c=I.model;typeof c=="object"&&c!==null?l=String(c.default||"").trim():typeof c=="string"&&(l=c.trim());let b=I.custom_providers;if(Array.isArray(b)){let Z=[];for(let d of b)if(d&&typeof d=="object"){let W=String(d.name||"").trim(),a=String(d.model||"").trim();W&&a&&Z.push({id:a,label:`${W}: ${a}`})}Z.length>0&&G.push({provider:"Custom",models:Z})}return{default:l,groups:G}}',
    replacement:
      'function CY(I){let l="",G=[],c=I.model;typeof c=="object"&&c!==null?l=String(c.default||"").trim():typeof c=="string"&&(l=c.trim());let b=I.custom_providers;if(Array.isArray(b)){let Z=[];for(let d of b)if(d&&typeof d=="object"){let W=String(d.name||"").trim(),a=String(d.model||"").trim();if(W){let m=[a,...Object.keys(d.models||{})].map(e=>String(e||"").trim()).filter(Boolean);for(let e of new Set(m))Z.push({id:e,label:`${W}: ${e}`})}}Z.length>0&&G.push({provider:"Custom",models:Z})}return{default:l,groups:G}}',
  },
  {
    original:
      'let p=Array.isArray(c.custom_providers)?c.custom_providers:[],F=await Promise.allSettled(p.map(async u=>{if(!u.base_url)return null;let X=qk(u.name),o=u.base_url.replace(/\\/+$/,""),i=[u.model].filter(Boolean);if(u.api_key){let r=await Pk(l,o,u.api_key);r.length>0&&(i=[...new Set([...i,...r])])}return{providerKey:X,label:u.name,base_url:o,models:i,api_key:u.api_key||""}}));',
    replacement:
      'let p=Array.isArray(c.custom_providers)?c.custom_providers:[],F=await Promise.allSettled(p.map(async u=>{if(!u.base_url)return null;let X=qk(u.name),o=u.base_url.replace(/\\/+$/,""),i=[u.model,...Object.keys(u.models||{})].map(r=>String(r||"").trim()).filter(Boolean);if(u.api_key){let r=await Pk(l,o,u.api_key);r.length>0&&(i=[...new Set([...i,...r])])}return{providerKey:X,label:u.name,base_url:o,models:i,api_key:u.api_key||""}}));',
  },
  {
    original:
      'let R=Array.isArray(c.custom_providers)?c.custom_providers:[],p=await Promise.allSettled(R.map(async F=>{if(!F.base_url)return null;let o=_3(F.name),X=F.base_url.replace(/\\/+$/,""),i=[F.model].filter(Boolean);if(F.api_key){let r=await $3(l,X,F.api_key);r.length>0&&(i=[...new Set([...i,...r])])}return{providerKey:o,label:F.name,base_url:X,models:i,api_key:F.api_key||""}}));',
    replacement:
      'let R=Array.isArray(c.custom_providers)?c.custom_providers:[],p=await Promise.allSettled(R.map(async F=>{if(!F.base_url)return null;let o=_3(F.name),X=F.base_url.replace(/\\/+$/,""),i=[F.model,...Object.keys(F.models||{})].map(r=>String(r||"").trim()).filter(Boolean);if(F.api_key){let r=await $3(l,X,F.api_key);r.length>0&&(i=[...new Set([...i,...r])])}return{providerKey:o,label:F.name,base_url:X,models:i,api_key:F.api_key||""}}));',
  },
  {
    original:
      'let R=Array.isArray(c.custom_providers)?c.custom_providers:[],p=await Promise.allSettled(R.map(async u=>{if(!u.base_url)return null;let o=Kx(u.name),H=u.base_url.replace(/\\/+$/,""),X=[u.model].filter(Boolean);if(u.api_key){let i=await fx(l,H,u.api_key);i.length>0&&(X=[...new Set([...X,...i])])}return{providerKey:o,label:u.name,base_url:H,models:X,api_key:u.api_key||"",builtin:Px(o)}}));',
    replacement:
      'let R=Array.isArray(c.custom_providers)?c.custom_providers:[],p=await Promise.allSettled(R.map(async u=>{if(!u.base_url)return null;let o=Kx(u.name),H=u.base_url.replace(/\\/+$/,""),X=[u.model,...Object.keys(u.models||{})].map(i=>String(i||"").trim()).filter(Boolean);if(u.api_key){let i=await fx(l,H,u.api_key);i.length>0&&(X=[...new Set([...X,...i])])}return{providerKey:o,label:u.name,base_url:H,models:X,api_key:u.api_key||"",builtin:Px(o)}}));',
  },
];

let matched = false;

for (const { original, replacement } of patterns) {
  if (source.includes(original)) {
    source = source.replace(original, replacement);
    matched = true;
    console.log("patched hermes-web-ui custom provider model expansion block");
    continue;
  }
  if (source.includes(replacement)) {
    matched = true;
    console.log("hermes-web-ui custom provider model expansion block already patched");
  }
}

if (!matched) {
  throw new Error("hermes-web-ui custom provider model block was not found");
}

fs.writeFileSync(path, source);
