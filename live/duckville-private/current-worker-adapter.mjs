import {createPrivateDuckvilleHandler} from './private-route.mjs';
/** Exact table/membership/deleted-room policy from current memoriesApi at a7371d3.
 * Pass existing worker auth function (9770); no new credentials or auth scheme.
 * privateRead is an explicitly reviewed private binding, not public env.ASSETS.
 */
export function bindCurrentWorker({auth,privateRead,approvedRoomId}){
 const valid=Number.isSafeInteger(Number(approvedRoomId))&&Number(approvedRoomId)>0;
 return createPrivateDuckvilleHandler({
  configuredRoomId:valid?String(Number(approvedRoomId)):null,
  authenticate:auth,
  canEnterRoom:async(env,me,roomId)=>!!await env.DB.prepare("SELECT r.id FROM rooms r JOIN room_members rm ON rm.room_id=r.id WHERE r.id=? AND rm.member_id=? AND NOT EXISTS(SELECT 1 FROM settings WHERE key='room_deleted_'||r.id AND value<>'')").bind(Number(roomId),me.id).first(),
  readPrivateFile:privateRead
 });
}
