function vapidConfig(env) {
  const privateKey=String(env?.OHANA_VAPID_PRIVATE_KEY||'').trim();
  const publicKey=String(env?.OHANA_VAPID_PUBLIC_KEY||'').trim();
  if(!/^[A-Za-z0-9_-]{43}$/.test(privateKey)||!/^[A-Za-z0-9_-]{87}$/.test(publicKey))throw Error('Push signing is not configured.');
  const privateBytes=b64urlDecode(privateKey),publicBytes=b64urlDecode(publicKey);
  if(privateBytes.length!==32||publicBytes.length!==65||publicBytes[0]!==4)throw Error('Push signing is not configured.');
  return{privateKey,publicKey,privateBytes,publicBytes};
}

