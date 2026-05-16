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
];

for (const { original, replacement } of patterns) {
  if (source.includes(original)) {
    source = source.replace(original, replacement);
    fs.writeFileSync(path, source);
    console.log("patched hermes-web-ui custom provider model expansion");
    process.exit(0);
  }
  if (source.includes(replacement)) {
    console.log("hermes-web-ui custom provider model expansion already patched");
    process.exit(0);
  }
}

throw new Error("hermes-web-ui custom provider model block was not found");
