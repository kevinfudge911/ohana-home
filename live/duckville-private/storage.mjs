import {files} from './private-route.mjs';
/** Private R2 binding ONLY. No public ASSETS/CDN fallback. Binding must not expose a public URL. */
export async function readDuckvillePrivateFile(env,name){
 if(!Object.hasOwn(files,name))return null;
 const bucket=env.DUCKVILLE_PRIVATE;
 if(!bucket||typeof bucket.get!=='function')throw Error('Private room storage unavailable');
 const object=await bucket.get('ohana-gathering/'+name);
 if(!object)return null;
 return await object.arrayBuffer();
}
