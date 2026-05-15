const fs = require("fs");
const path = "/usr/local/lib/node_modules/hermes-web-ui/dist/server/index.js";

let source = fs.readFileSync(path, "utf8");

const original =
  'O=U?.models?.length?[...U.models]:[i.model];if(!U&&i.api_key)try{let S=await _2(k,i.api_key);S.length>0&&(O=[...new Set([i.model,...S])])}catch{}';

const replacement =
  'O=U?.models?.length?[...U.models]:Array.from(new Set([i.model,...Object.keys(i.models||{})]));if(!U&&i.api_key)try{let S=await _2(k,i.api_key);S.length>0&&(O=[...new Set([i.model,...Object.keys(i.models||{}),...S])])}catch{}';

if (!source.includes(original)) {
  if (source.includes(replacement)) {
    console.log("hermes-web-ui custom provider model expansion already patched");
    process.exit(0);
  }
  throw new Error("hermes-web-ui custom provider model block was not found");
}

source = source.replace(original, replacement);
fs.writeFileSync(path, source);
console.log("patched hermes-web-ui custom provider model expansion");
