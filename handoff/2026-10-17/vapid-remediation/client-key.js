async function currentPushPublicKey(){
  const result=await api('/api/push/public-key');
  const key=String(result?.publicKey||'');
  if(!/^[A-Za-z0-9_-]{87}$/.test(key)||urlBase64ToUint8Array(key).length!==65)throw Error('Notifications need a configuration update.');
  return key;
}
function pushSubscriptionMatches(subscription,key){
  const stored=subscription?.options?.applicationServerKey;
  if(!stored)return false;
  const a=new Uint8Array(stored),b=urlBase64ToUint8Array(key);
  return a.length===b.length&&a.every((value,index)=>value===b[index]);
}

