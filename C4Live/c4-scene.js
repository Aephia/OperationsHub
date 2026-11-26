/* C4 Live galaxy scene. Source: C4Live/scene-src (node C4Live/scene-src/build.mjs). Includes three.js 0.186.1 (MIT License, Copyright 2010-2026 three.js authors, https://github.com/mrdoob/three.js). */
(()=>{var Yn={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},oi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},cf=0,ih=1,hf=2;var vo=1,uf=2,yr=3,as=0,Rn=1,Mi=2,$n=0,Mr=1,Is=2,sh=3,rh=4,Sr=5;var Si=100,ff=101,df=102,pf=103,rl=104,mf=200,Ls=201,gf=202,xf=203,oh=204,br=205,_f=206,vf=207,yf=208,Mf=209,Sf=210,bf=211,wf=212,Tf=213,Af=214,Ra=0,Pa=1,Ia=2,hr=3,La=4,Da=5,Na=6,Fa=7,ah=0,Ef=1,Cf=2,ai=0,yo=1,Mo=2,So=3,Ds=4,bo=5,wo=6,To=7;var lh=300,ls=301,Ns=302,ol=303,al=304,Ao=306,Ua=1e3,_i=1001,Oa=1002,fn=1003,Rf=1004;var Eo=1005;var Ye=1006,ll=1007;var cs=1008;var Hn=1009,ch=1010,hh=1011,wr=1012,cl=1013,li=1014,ci=1015,en=1016,hl=1017,ul=1018,Tr=1020,uh=35902,fh=35899,dh=1021,ph=1022,Mn=1023,vi=1026,hs=1027,mh=1028,fl=1029,us=1030,dl=1031;var pl=1033,Co=33776,Ro=33777,Po=33778,Io=33779,ml=35840,gl=35841,xl=35842,_l=35843,vl=36196,yl=37492,Ml=37496,Sl=37488,bl=37489,Lo=37490,wl=37491,Tl=37808,Al=37809,El=37810,Cl=37811,Rl=37812,Pl=37813,Il=37814,Ll=37815,Dl=37816,Nl=37817,Fl=37818,Ul=37819,Ol=37820,Bl=37821,kl=36492,zl=36494,Vl=36495,Hl=36283,Gl=36284,Do=36285,Wl=36286;var jr=2300,Ba=2301,Aa=2302,Zc=2303,Kc=2400,Jc=2401,jc=2402;var Pf=3200;var gh=0,If=1,Bi="",pn="srgb",Qr="srgb-linear",to="linear",Ee="srgb";var Ea=7680;var Lf=519,Df=512,Nf=513,Ff=514,Xl=515,Uf=516,Of=517,ql=518,Bf=519,kf=35044,xh=35048;var _h="300 es",si=2e3,eo=2001;function Zp(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Kp(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function ur(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function zf(){let i=ur("canvas");return i.style.display="block",i}var Ou={},fr=null;function vh(...i){let t="THREE."+i.shift();fr?fr("log",t,...i):console.log(t,...i)}function Vf(i){let t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function ie(...i){i=Vf(i);let t="THREE."+i.shift();if(fr)fr("warn",t,...i);else{let e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function se(...i){i=Vf(i);let t="THREE."+i.shift();if(fr)fr("error",t,...i);else{let e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function As(...i){let t=i.join(" ");t in Ou||(Ou[t]=!0,ie(...i))}function Hf(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var Gf={[Ra]:Pa,[Ia]:Na,[La]:Fa,[hr]:Da,[Pa]:Ra,[Na]:Ia,[Fa]:La,[Da]:hr},ri=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},xn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Bu=1234567,Kr=Math.PI/180,dr=180/Math.PI;function Ar(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(xn[i&255]+xn[i>>8&255]+xn[i>>16&255]+xn[i>>24&255]+"-"+xn[t&255]+xn[t>>8&255]+"-"+xn[t>>16&15|64]+xn[t>>24&255]+"-"+xn[e&63|128]+xn[e>>8&255]+"-"+xn[e>>16&255]+xn[e>>24&255]+xn[n&255]+xn[n>>8&255]+xn[n>>16&255]+xn[n>>24&255]).toLowerCase()}function xe(i,t,e){return Math.max(t,Math.min(e,i))}function yh(i,t){return(i%t+t)%t}function Jp(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function jp(i,t,e){return i!==t?(e-i)/(t-i):0}function Jr(i,t,e){return(1-e)*i+e*t}function Qp(i,t,e,n){return Jr(i,t,1-Math.exp(-e*n))}function tm(i,t=1){return t-Math.abs(yh(i,t*2)-t)}function em(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function nm(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function im(i,t){return i+Math.floor(Math.random()*(t-i+1))}function sm(i,t){return i+Math.random()*(t-i)}function rm(i){return i*(.5-Math.random())}function om(i){i!==void 0&&(Bu=i);let t=Bu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function am(i){return i*Kr}function lm(i){return i*dr}function cm(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function hm(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function um(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function fm(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),f=r((t-n)/2),u=o((t-n)/2),d=r((n-t)/2),m=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*f,l*u,a*c);break;case"YZY":i.set(l*u,a*h,l*f,a*c);break;case"ZXZ":i.set(l*f,l*u,a*h,a*c);break;case"XZX":i.set(a*h,l*m,l*d,a*c);break;case"YXY":i.set(l*d,a*h,l*m,a*c);break;case"ZYZ":i.set(l*m,l*d,a*h,a*c);break;default:ie("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function lr(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function En(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Mh={DEG2RAD:Kr,RAD2DEG:dr,generateUUID:Ar,clamp:xe,euclideanModulo:yh,mapLinear:Jp,inverseLerp:jp,lerp:Jr,damp:Qp,pingpong:tm,smoothstep:em,smootherstep:nm,randInt:im,randFloat:sm,randFloatSpread:rm,seededRandom:om,degToRad:am,radToDeg:lm,isPowerOfTwo:cm,ceilPowerOfTwo:hm,floorPowerOfTwo:um,setQuaternionFromProperEuler:fm,normalize:En,denormalize:lr},Ah=class Ah{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=xe(this.x,t.x,e.x),this.y=xe(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=xe(this.x,t,e),this.y=xe(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(xe(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(xe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Ah.prototype.isVector2=!0;var Wt=Ah,kn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],f=n[s+3],u=r[o+0],d=r[o+1],m=r[o+2],M=r[o+3];if(f!==M||l!==u||c!==d||h!==m){let x=l*u+c*d+h*m+f*M;x<0&&(u=-u,d=-d,m=-m,M=-M,x=-x);let p=1-a;if(x<.9995){let P=Math.acos(x),U=Math.sin(P);p=Math.sin(p*P)/U,a=Math.sin(a*P)/U,l=l*p+u*a,c=c*p+d*a,h=h*p+m*a,f=f*p+M*a}else{l=l*p+u*a,c=c*p+d*a,h=h*p+m*a,f=f*p+M*a;let P=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=P,c*=P,h*=P,f*=P}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],f=r[o],u=r[o+1],d=r[o+2],m=r[o+3];return t[e]=a*m+h*f+l*d-c*u,t[e+1]=l*m+h*u+c*f-a*d,t[e+2]=c*m+h*d+a*u-l*f,t[e+3]=h*m-a*f-l*u-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),f=a(r/2),u=l(n/2),d=l(s/2),m=l(r/2);switch(o){case"XYZ":this._x=u*h*f+c*d*m,this._y=c*d*f-u*h*m,this._z=c*h*m+u*d*f,this._w=c*h*f-u*d*m;break;case"YXZ":this._x=u*h*f+c*d*m,this._y=c*d*f-u*h*m,this._z=c*h*m-u*d*f,this._w=c*h*f+u*d*m;break;case"ZXY":this._x=u*h*f-c*d*m,this._y=c*d*f+u*h*m,this._z=c*h*m+u*d*f,this._w=c*h*f-u*d*m;break;case"ZYX":this._x=u*h*f-c*d*m,this._y=c*d*f+u*h*m,this._z=c*h*m-u*d*f,this._w=c*h*f+u*d*m;break;case"YZX":this._x=u*h*f+c*d*m,this._y=c*d*f+u*h*m,this._z=c*h*m-u*d*f,this._w=c*h*f-u*d*m;break;case"XZY":this._x=u*h*f-c*d*m,this._y=c*d*f-u*h*m,this._z=c*h*m+u*d*f,this._w=c*h*f+u*d*m;break;default:ie("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],f=e[10],u=n+a+f;if(u>0){let d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(o-s)*d}else if(n>a&&n>f){let d=2*Math.sqrt(1+n-a-f);this._w=(h-l)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+c)/d}else if(a>f){let d=2*Math.sqrt(1+a-n-f);this._w=(r-c)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(l+h)/d}else{let d=2*Math.sqrt(1+f-n-a);this._w=(o-s)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(xe(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Eh=class Eh{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ku.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ku.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),f=2*(r*n-o*e);return this.x=e+l*c+o*f-a*h,this.y=n+l*h+a*c-r*f,this.z=s+l*f+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=xe(this.x,t.x,e.x),this.y=xe(this.y,t.y,e.y),this.z=xe(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=xe(this.x,t,e),this.y=xe(this.y,t,e),this.z=xe(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(xe(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Rc.copy(this).projectOnVector(t),this.sub(Rc)}reflect(t){return this.sub(Rc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(xe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Eh.prototype.isVector3=!0;var G=Eh,Rc=new G,ku=new kn,Ch=class Ch{constructor(t,e,n,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],f=n[7],u=n[2],d=n[5],m=n[8],M=s[0],x=s[3],p=s[6],P=s[1],U=s[4],b=s[7],S=s[2],E=s[5],I=s[8];return r[0]=o*M+a*P+l*S,r[3]=o*x+a*U+l*E,r[6]=o*p+a*b+l*I,r[1]=c*M+h*P+f*S,r[4]=c*x+h*U+f*E,r[7]=c*p+h*b+f*I,r[2]=u*M+d*P+m*S,r[5]=u*x+d*U+m*E,r[8]=u*p+d*b+m*I,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=h*o-a*c,u=a*l-h*r,d=c*r-o*l,m=e*f+n*u+s*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let M=1/m;return t[0]=f*M,t[1]=(s*c-h*n)*M,t[2]=(a*n-s*o)*M,t[3]=u*M,t[4]=(h*e-s*l)*M,t[5]=(s*r-a*e)*M,t[6]=d*M,t[7]=(n*l-c*e)*M,t[8]=(o*e-n*r)*M,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return As("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Pc.makeScale(t,e)),this}rotate(t){return As("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Pc.makeRotation(-t)),this}translate(t,e){return As("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Pc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Ch.prototype.isMatrix3=!0;var oe=Ch,Pc=new oe,zu=new oe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Vu=new oe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function dm(){let i={enabled:!0,workingColorSpace:Qr,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===Ee&&(s.r=Ui(s.r),s.g=Ui(s.g),s.b=Ui(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Ee&&(s.r=cr(s.r),s.g=cr(s.g),s.b=cr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Bi?to:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return As("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return As("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Qr]:{primaries:t,whitePoint:n,transfer:to,toXYZ:zu,fromXYZ:Vu,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:pn},outputColorSpaceConfig:{drawingBufferColorSpace:pn}},[pn]:{primaries:t,whitePoint:n,transfer:Ee,toXYZ:zu,fromXYZ:Vu,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:pn}}}),i}var ge=dm();function Ui(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function cr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var $s,ka=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{$s===void 0&&($s=ur("canvas")),$s.width=t.width,$s.height=t.height;let s=$s.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=$s}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=ur("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ui(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ui(e[n]/255)*255):e[n]=Ui(e[n]);return{data:e,width:t.width,height:t.height}}else return ie("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},pm=0,pr=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:pm++}),this.uuid=Ar(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Ic(s[o].image)):r.push(Ic(s[o]))}else r=Ic(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function Ic(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?ka.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(ie("Texture: Unable to serialize Texture."),{})}var mm=0,Lc=new G,vn=class i extends ri{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=_i,s=_i,r=Ye,o=cs,a=Mn,l=Hn,c=i.DEFAULT_ANISOTROPY,h=Bi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:mm++}),this.uuid=Ar(),this.name="",this.source=new pr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Wt(0,0),this.repeat=new Wt(1,1),this.center=new Wt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new oe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Lc).x}get height(){return this.source.getSize(Lc).y}get depth(){return this.source.getSize(Lc).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){ie(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){ie(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==lh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ua:t.x=t.x-Math.floor(t.x);break;case _i:t.x=t.x<0?0:1;break;case Oa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ua:t.y=t.y-Math.floor(t.y);break;case _i:t.y=t.y<0?0:1;break;case Oa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};vn.DEFAULT_IMAGE=null;vn.DEFAULT_MAPPING=lh;vn.DEFAULT_ANISOTROPY=1;var Rh=class Rh{constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],f=l[8],u=l[1],d=l[5],m=l[9],M=l[2],x=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-M)<.01&&Math.abs(m-x)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+M)<.1&&Math.abs(m+x)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let U=(c+1)/2,b=(d+1)/2,S=(p+1)/2,E=(h+u)/4,I=(f+M)/4,v=(m+x)/4;return U>b&&U>S?U<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(U),s=E/n,r=I/n):b>S?b<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(b),n=E/s,r=v/s):S<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(S),n=I/r,s=v/r),this.set(n,s,r,e),this}let P=Math.sqrt((x-m)*(x-m)+(f-M)*(f-M)+(u-h)*(u-h));return Math.abs(P)<.001&&(P=1),this.x=(x-m)/P,this.y=(f-M)/P,this.z=(u-h)/P,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=xe(this.x,t.x,e.x),this.y=xe(this.y,t.y,e.y),this.z=xe(this.z,t.z,e.z),this.w=xe(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=xe(this.x,t,e),this.y=xe(this.y,t,e),this.z=xe(this.z,t,e),this.w=xe(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(xe(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Rh.prototype.isVector4=!0;var qe=Rh,za=class extends ri{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ye,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new qe(0,0,t,e),this.scissorTest=!1,this.viewport=new qe(0,0,t,e),this.textures=[];let s={width:t,height:e,depth:n.depth},r=new vn(s),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Ye,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new pr(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},$e=class extends za{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},no=class extends vn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=fn,this.minFilter=fn,this.wrapR=_i,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Va=class extends vn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=fn,this.minFilter=fn,this.wrapR=_i,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var sl=class sl{constructor(t,e,n,s,r,o,a,l,c,h,f,u,d,m,M,x){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,f,u,d,m,M,x)}set(t,e,n,s,r,o,a,l,c,h,f,u,d,m,M,x){let p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=u,p[3]=d,p[7]=m,p[11]=M,p[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new sl().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,s=1/Zs.setFromMatrixColumn(t,0).length(),r=1/Zs.setFromMatrixColumn(t,1).length(),o=1/Zs.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){let u=o*h,d=o*f,m=a*h,M=a*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=d+m*c,e[5]=u-M*c,e[9]=-a*l,e[2]=M-u*c,e[6]=m+d*c,e[10]=o*l}else if(t.order==="YXZ"){let u=l*h,d=l*f,m=c*h,M=c*f;e[0]=u+M*a,e[4]=m*a-d,e[8]=o*c,e[1]=o*f,e[5]=o*h,e[9]=-a,e[2]=d*a-m,e[6]=M+u*a,e[10]=o*l}else if(t.order==="ZXY"){let u=l*h,d=l*f,m=c*h,M=c*f;e[0]=u-M*a,e[4]=-o*f,e[8]=m+d*a,e[1]=d+m*a,e[5]=o*h,e[9]=M-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let u=o*h,d=o*f,m=a*h,M=a*f;e[0]=l*h,e[4]=m*c-d,e[8]=u*c+M,e[1]=l*f,e[5]=M*c+u,e[9]=d*c-m,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let u=o*l,d=o*c,m=a*l,M=a*c;e[0]=l*h,e[4]=M-u*f,e[8]=m*f+d,e[1]=f,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=d*f+m,e[10]=u-M*f}else if(t.order==="XZY"){let u=o*l,d=o*c,m=a*l,M=a*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=u*f+M,e[5]=o*h,e[9]=d*f-m,e[2]=m*f-d,e[6]=a*h,e[10]=M*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(gm,t,xm)}lookAt(t,e,n){let s=this.elements;return On.subVectors(t,e),On.lengthSq()===0&&(On.z=1),On.normalize(),qi.crossVectors(n,On),qi.lengthSq()===0&&(Math.abs(n.z)===1?On.x+=1e-4:On.z+=1e-4,On.normalize(),qi.crossVectors(n,On)),qi.normalize(),ra.crossVectors(On,qi),s[0]=qi.x,s[4]=ra.x,s[8]=On.x,s[1]=qi.y,s[5]=ra.y,s[9]=On.y,s[2]=qi.z,s[6]=ra.z,s[10]=On.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],f=n[5],u=n[9],d=n[13],m=n[2],M=n[6],x=n[10],p=n[14],P=n[3],U=n[7],b=n[11],S=n[15],E=s[0],I=s[4],v=s[8],R=s[12],L=s[1],F=s[5],N=s[9],W=s[13],B=s[2],J=s[6],ot=s[10],lt=s[14],vt=s[3],at=s[7],gt=s[11],yt=s[15];return r[0]=o*E+a*L+l*B+c*vt,r[4]=o*I+a*F+l*J+c*at,r[8]=o*v+a*N+l*ot+c*gt,r[12]=o*R+a*W+l*lt+c*yt,r[1]=h*E+f*L+u*B+d*vt,r[5]=h*I+f*F+u*J+d*at,r[9]=h*v+f*N+u*ot+d*gt,r[13]=h*R+f*W+u*lt+d*yt,r[2]=m*E+M*L+x*B+p*vt,r[6]=m*I+M*F+x*J+p*at,r[10]=m*v+M*N+x*ot+p*gt,r[14]=m*R+M*W+x*lt+p*yt,r[3]=P*E+U*L+b*B+S*vt,r[7]=P*I+U*F+b*J+S*at,r[11]=P*v+U*N+b*ot+S*gt,r[15]=P*R+U*W+b*lt+S*yt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],f=t[6],u=t[10],d=t[14],m=t[3],M=t[7],x=t[11],p=t[15],P=l*d-c*u,U=a*d-c*f,b=a*u-l*f,S=o*d-c*h,E=o*u-l*h,I=o*f-a*h;return e*(M*P-x*U+p*b)-n*(m*P-x*S+p*E)+s*(m*U-M*S+p*I)-r*(m*b-M*E+x*I)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],h=t[10];return e*(o*h-a*c)-n*(r*h-a*l)+s*(r*c-o*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=t[9],u=t[10],d=t[11],m=t[12],M=t[13],x=t[14],p=t[15],P=e*a-n*o,U=e*l-s*o,b=e*c-r*o,S=n*l-s*a,E=n*c-r*a,I=s*c-r*l,v=h*M-f*m,R=h*x-u*m,L=h*p-d*m,F=f*x-u*M,N=f*p-d*M,W=u*p-d*x,B=P*W-U*N+b*F+S*L-E*R+I*v;if(B===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let J=1/B;return t[0]=(a*W-l*N+c*F)*J,t[1]=(s*N-n*W-r*F)*J,t[2]=(M*I-x*E+p*S)*J,t[3]=(u*E-f*I-d*S)*J,t[4]=(l*L-o*W-c*R)*J,t[5]=(e*W-s*L+r*R)*J,t[6]=(x*b-m*I-p*U)*J,t[7]=(h*I-u*b+d*U)*J,t[8]=(o*N-a*L+c*v)*J,t[9]=(n*L-e*N-r*v)*J,t[10]=(m*E-M*b+p*P)*J,t[11]=(f*b-h*E-d*P)*J,t[12]=(a*R-o*F-l*v)*J,t[13]=(e*F-n*R+s*v)*J,t[14]=(M*U-m*S-x*P)*J,t[15]=(h*S-f*U+u*P)*J,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,f=a+a,u=r*c,d=r*h,m=r*f,M=o*h,x=o*f,p=a*f,P=l*c,U=l*h,b=l*f,S=n.x,E=n.y,I=n.z;return s[0]=(1-(M+p))*S,s[1]=(d+b)*S,s[2]=(m-U)*S,s[3]=0,s[4]=(d-b)*E,s[5]=(1-(u+p))*E,s[6]=(x+P)*E,s[7]=0,s[8]=(m+U)*I,s[9]=(x-P)*I,s[10]=(1-(u+M))*I,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let o=Zs.set(s[0],s[1],s[2]).length(),a=Zs.set(s[4],s[5],s[6]).length(),l=Zs.set(s[8],s[9],s[10]).length();r<0&&(o=-o),ei.copy(this);let c=1/o,h=1/a,f=1/l;return ei.elements[0]*=c,ei.elements[1]*=c,ei.elements[2]*=c,ei.elements[4]*=h,ei.elements[5]*=h,ei.elements[6]*=h,ei.elements[8]*=f,ei.elements[9]*=f,ei.elements[10]*=f,e.setFromRotationMatrix(ei),n.x=o,n.y=a,n.z=l,this}makePerspective(t,e,n,s,r,o,a=si,l=!1){let c=this.elements,h=2*r/(e-t),f=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s),m,M;if(l)m=r/(o-r),M=o*r/(o-r);else if(a===si)m=-(o+r)/(o-r),M=-2*o*r/(o-r);else if(a===eo)m=-o/(o-r),M=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=M,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=si,l=!1){let c=this.elements,h=2/(e-t),f=2/(n-s),u=-(e+t)/(e-t),d=-(n+s)/(n-s),m,M;if(l)m=1/(o-r),M=o/(o-r);else if(a===si)m=-2/(o-r),M=-(o+r)/(o-r);else if(a===eo)m=-1/(o-r),M=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=m,c[14]=M,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};sl.prototype.isMatrix4=!0;var Xe=sl,Zs=new G,ei=new Xe,gm=new G(0,0,0),xm=new G(1,1,1),qi=new G,ra=new G,On=new G,Hu=new Xe,Gu=new kn,ji=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],f=s[2],u=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(xe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-xe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(xe(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-xe(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(xe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-xe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:ie("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Hu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Hu,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Gu.setFromEuler(this),this.setFromQuaternion(Gu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};ji.DEFAULT_ORDER="XYZ";var mr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},_m=0,Wu=new G,Ks=new kn,Ii=new Xe,oa=new G,qr=new G,vm=new G,ym=new kn,Xu=new G(1,0,0),qu=new G(0,1,0),Yu=new G(0,0,1),$u={type:"added"},Mm={type:"removed"},Js={type:"childadded",child:null},Dc={type:"childremoved",child:null},zn=class i extends ri{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:_m++}),this.uuid=Ar(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new G,e=new ji,n=new kn,s=new G(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Xe},normalMatrix:{value:new oe}}),this.matrix=new Xe,this.matrixWorld=new Xe,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new mr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ks.setFromAxisAngle(t,e),this.quaternion.multiply(Ks),this}rotateOnWorldAxis(t,e){return Ks.setFromAxisAngle(t,e),this.quaternion.premultiply(Ks),this}rotateX(t){return this.rotateOnAxis(Xu,t)}rotateY(t){return this.rotateOnAxis(qu,t)}rotateZ(t){return this.rotateOnAxis(Yu,t)}translateOnAxis(t,e){return Wu.copy(t).applyQuaternion(this.quaternion),this.position.add(Wu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Xu,t)}translateY(t){return this.translateOnAxis(qu,t)}translateZ(t){return this.translateOnAxis(Yu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ii.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?oa.copy(t):oa.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),qr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ii.lookAt(qr,oa,this.up):Ii.lookAt(oa,qr,this.up),this.quaternion.setFromRotationMatrix(Ii),s&&(Ii.extractRotation(s.matrixWorld),Ks.setFromRotationMatrix(Ii),this.quaternion.premultiply(Ks.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(se("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent($u),Js.child=t,this.dispatchEvent(Js),Js.child=null):se("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Mm),Dc.child=t,this.dispatchEvent(Dc),Dc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ii.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ii.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ii),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent($u),Js.child=t,this.dispatchEvent(Js),Js.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qr,t,vm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(qr,ym,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let f=l[c];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),f=o(t.shapes),u=o(t.skeletons),d=o(t.animations),m=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),d.length>0&&(n.animations=d),m.length>0&&(n.nodes=m)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};zn.DEFAULT_UP=new G(0,1,0);zn.DEFAULT_MATRIX_AUTO_UPDATE=!0;zn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ts=class extends zn{constructor(){super(),this.isGroup=!0,this.type="Group"}},Sm={type:"move"},gr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ts,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ts,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ts,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let M of t.hand.values()){let x=e.getJointPose(M,n),p=this._getHandJoint(c,M);x!==null&&(p.matrix.fromArray(x.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=x.radius),p.visible=x!==null}let h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,m=.005;c.inputState.pinching&&u>d+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=d-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Sm)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Ts;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Wf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Yi={h:0,s:0,l:0},aa={h:0,s:0,l:0};function Nc(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var ue=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=pn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ge.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=ge.workingColorSpace){return this.r=t,this.g=e,this.b=n,ge.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=ge.workingColorSpace){if(t=yh(t,1),e=xe(e,0,1),n=xe(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Nc(o,r,t+1/3),this.g=Nc(o,r,t),this.b=Nc(o,r,t-1/3)}return ge.colorSpaceToWorking(this,s),this}setStyle(t,e=pn){function n(r){r!==void 0&&parseFloat(r)<1&&ie("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:ie("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);ie("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=pn){let n=Wf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):ie("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ui(t.r),this.g=Ui(t.g),this.b=Ui(t.b),this}copyLinearToSRGB(t){return this.r=cr(t.r),this.g=cr(t.g),this.b=cr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=pn){return ge.workingToColorSpace(_n.copy(this),t),Math.round(xe(_n.r*255,0,255))*65536+Math.round(xe(_n.g*255,0,255))*256+Math.round(xe(_n.b*255,0,255))}getHexString(t=pn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ge.workingColorSpace){ge.workingToColorSpace(_n.copy(this),e);let n=_n.r,s=_n.g,r=_n.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let f=o-a;switch(c=h<=.5?f/(o+a):f/(2-o-a),o){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=ge.workingColorSpace){return ge.workingToColorSpace(_n.copy(this),e),t.r=_n.r,t.g=_n.g,t.b=_n.b,t}getStyle(t=pn){ge.workingToColorSpace(_n.copy(this),t);let e=_n.r,n=_n.g,s=_n.b;return t!==pn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Yi),this.setHSL(Yi.h+t,Yi.s+e,Yi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Yi),t.getHSL(aa);let n=Jr(Yi.h,aa.h,e),s=Jr(Yi.s,aa.s,e),r=Jr(Yi.l,aa.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},_n=new ue;ue.NAMES=Wf;var io=class extends zn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ji,this.environmentIntensity=1,this.environmentRotation=new ji,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},ni=new G,Li=new G,Fc=new G,Di=new G,js=new G,Qs=new G,Zu=new G,Uc=new G,Oc=new G,Bc=new G,kc=new qe,zc=new qe,Vc=new qe,Ji=class i{constructor(t=new G,e=new G,n=new G){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),ni.subVectors(t,e),s.cross(ni);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){ni.subVectors(s,e),Li.subVectors(n,e),Fc.subVectors(t,e);let o=ni.dot(ni),a=ni.dot(Li),l=ni.dot(Fc),c=Li.dot(Li),h=Li.dot(Fc),f=o*c-a*a;if(f===0)return r.set(0,0,0),null;let u=1/f,d=(c*l-a*h)*u,m=(o*h-a*l)*u;return r.set(1-d-m,m,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Di)===null?!1:Di.x>=0&&Di.y>=0&&Di.x+Di.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,Di)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Di.x),l.addScaledVector(o,Di.y),l.addScaledVector(a,Di.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return kc.setScalar(0),zc.setScalar(0),Vc.setScalar(0),kc.fromBufferAttribute(t,e),zc.fromBufferAttribute(t,n),Vc.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(kc,r.x),o.addScaledVector(zc,r.y),o.addScaledVector(Vc,r.z),o}static isFrontFacing(t,e,n,s){return ni.subVectors(n,e),Li.subVectors(t,e),ni.cross(Li).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return ni.subVectors(this.c,this.b),Li.subVectors(this.a,this.b),ni.cross(Li).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;js.subVectors(s,n),Qs.subVectors(r,n),Uc.subVectors(t,n);let l=js.dot(Uc),c=Qs.dot(Uc);if(l<=0&&c<=0)return e.copy(n);Oc.subVectors(t,s);let h=js.dot(Oc),f=Qs.dot(Oc);if(h>=0&&f<=h)return e.copy(s);let u=l*f-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(js,o);Bc.subVectors(t,r);let d=js.dot(Bc),m=Qs.dot(Bc);if(m>=0&&d<=m)return e.copy(r);let M=d*c-l*m;if(M<=0&&c>=0&&m<=0)return a=c/(c-m),e.copy(n).addScaledVector(Qs,a);let x=h*m-d*f;if(x<=0&&f-h>=0&&d-m>=0)return Zu.subVectors(r,s),a=(f-h)/(f-h+(d-m)),e.copy(s).addScaledVector(Zu,a);let p=1/(x+M+u);return o=M*p,a=u*p,e.copy(n).addScaledVector(js,o).addScaledVector(Qs,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Qi=class{constructor(t=new G(1/0,1/0,1/0),e=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(ii.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(ii.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=ii.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,ii):ii.fromBufferAttribute(r,o),ii.applyMatrix4(t.matrixWorld),this.expandByPoint(ii);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),la.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),la.copy(n.boundingBox)),la.applyMatrix4(t.matrixWorld),this.union(la)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,ii),ii.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Yr),ca.subVectors(this.max,Yr),tr.subVectors(t.a,Yr),er.subVectors(t.b,Yr),nr.subVectors(t.c,Yr),$i.subVectors(er,tr),Zi.subVectors(nr,er),Ms.subVectors(tr,nr);let e=[0,-$i.z,$i.y,0,-Zi.z,Zi.y,0,-Ms.z,Ms.y,$i.z,0,-$i.x,Zi.z,0,-Zi.x,Ms.z,0,-Ms.x,-$i.y,$i.x,0,-Zi.y,Zi.x,0,-Ms.y,Ms.x,0];return!Hc(e,tr,er,nr,ca)||(e=[1,0,0,0,1,0,0,0,1],!Hc(e,tr,er,nr,ca))?!1:(ha.crossVectors($i,Zi),e=[ha.x,ha.y,ha.z],Hc(e,tr,er,nr,ca))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ii).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ii).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ni[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ni[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ni[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ni[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ni[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ni[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ni[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ni[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ni),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Ni=[new G,new G,new G,new G,new G,new G,new G,new G],ii=new G,la=new Qi,tr=new G,er=new G,nr=new G,$i=new G,Zi=new G,Ms=new G,Yr=new G,ca=new G,ha=new G,Ss=new G;function Hc(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Ss.fromArray(i,r);let a=s.x*Math.abs(Ss.x)+s.y*Math.abs(Ss.y)+s.z*Math.abs(Ss.z),l=t.dot(Ss),c=e.dot(Ss),h=n.dot(Ss);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Ke=new G,ua=new Wt,bm=0,un=class extends ri{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:bm++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=kf,this.updateRanges=[],this.gpuType=ci,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ua.fromBufferAttribute(this,e),ua.applyMatrix3(t),this.setXY(e,ua.x,ua.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ke.fromBufferAttribute(this,e),Ke.applyMatrix3(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ke.fromBufferAttribute(this,e),Ke.applyMatrix4(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ke.fromBufferAttribute(this,e),Ke.applyNormalMatrix(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ke.fromBufferAttribute(this,e),Ke.transformDirection(t),this.setXYZ(e,Ke.x,Ke.y,Ke.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=lr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=En(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=lr(e,this.array)),e}setX(t,e){return this.normalized&&(e=En(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=lr(e,this.array)),e}setY(t,e){return this.normalized&&(e=En(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=lr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=En(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=lr(e,this.array)),e}setW(t,e){return this.normalized&&(e=En(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=En(e,this.array),n=En(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=En(e,this.array),n=En(n,this.array),s=En(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=En(e,this.array),n=En(n,this.array),s=En(s,this.array),r=En(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var so=class extends un{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var ro=class extends un{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Cn=class extends un{constructor(t,e,n){super(new Float32Array(t),e,n)}},wm=new Qi,$r=new G,Gc=new G,Es=class{constructor(t=new G,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):wm.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;$r.subVectors(t,this.center);let e=$r.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector($r,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Gc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint($r.copy(t.center).add(Gc)),this.expandByPoint($r.copy(t.center).sub(Gc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},Tm=0,qn=new Xe,Wc=new zn,ir=new G,Bn=new Qi,Zr=new Qi,hn=new G,yn=class i extends ri{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Tm++}),this.uuid=Ar(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Zp(t)?ro:so)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new oe().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return qn.makeRotationFromQuaternion(t),this.applyMatrix4(qn),this}rotateX(t){return qn.makeRotationX(t),this.applyMatrix4(qn),this}rotateY(t){return qn.makeRotationY(t),this.applyMatrix4(qn),this}rotateZ(t){return qn.makeRotationZ(t),this.applyMatrix4(qn),this}translate(t,e,n){return qn.makeTranslation(t,e,n),this.applyMatrix4(qn),this}scale(t,e,n){return qn.makeScale(t,e,n),this.applyMatrix4(qn),this}lookAt(t){return Wc.lookAt(t),Wc.updateMatrix(),this.applyMatrix4(Wc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ir).negate(),this.translate(ir.x,ir.y,ir.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Cn(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&ie("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Qi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){se("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];Bn.setFromBufferAttribute(r),this.morphTargetsRelative?(hn.addVectors(this.boundingBox.min,Bn.min),this.boundingBox.expandByPoint(hn),hn.addVectors(this.boundingBox.max,Bn.max),this.boundingBox.expandByPoint(hn)):(this.boundingBox.expandByPoint(Bn.min),this.boundingBox.expandByPoint(Bn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&se('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Es);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){se("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new G,1/0);return}if(t){let n=this.boundingSphere.center;if(Bn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];Zr.setFromBufferAttribute(a),this.morphTargetsRelative?(hn.addVectors(Bn.min,Zr.min),Bn.expandByPoint(hn),hn.addVectors(Bn.max,Zr.max),Bn.expandByPoint(hn)):(Bn.expandByPoint(Zr.min),Bn.expandByPoint(Zr.max))}Bn.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)hn.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(hn));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)hn.fromBufferAttribute(a,c),l&&(ir.fromBufferAttribute(t,c),hn.add(ir)),s=Math.max(s,n.distanceToSquared(hn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&se('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){se("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new un(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let v=0;v<n.count;v++)a[v]=new G,l[v]=new G;let c=new G,h=new G,f=new G,u=new Wt,d=new Wt,m=new Wt,M=new G,x=new G;function p(v,R,L){c.fromBufferAttribute(n,v),h.fromBufferAttribute(n,R),f.fromBufferAttribute(n,L),u.fromBufferAttribute(r,v),d.fromBufferAttribute(r,R),m.fromBufferAttribute(r,L),h.sub(c),f.sub(c),d.sub(u),m.sub(u);let F=1/(d.x*m.y-m.x*d.y);isFinite(F)&&(M.copy(h).multiplyScalar(m.y).addScaledVector(f,-d.y).multiplyScalar(F),x.copy(f).multiplyScalar(d.x).addScaledVector(h,-m.x).multiplyScalar(F),a[v].add(M),a[R].add(M),a[L].add(M),l[v].add(x),l[R].add(x),l[L].add(x))}let P=this.groups;P.length===0&&(P=[{start:0,count:t.count}]);for(let v=0,R=P.length;v<R;++v){let L=P[v],F=L.start,N=L.count;for(let W=F,B=F+N;W<B;W+=3)p(t.getX(W+0),t.getX(W+1),t.getX(W+2))}let U=new G,b=new G,S=new G,E=new G;function I(v){S.fromBufferAttribute(s,v),E.copy(S);let R=a[v];U.copy(R),U.sub(S.multiplyScalar(S.dot(R))).normalize(),b.crossVectors(E,R);let F=b.dot(l[v])<0?-1:1;o.setXYZW(v,U.x,U.y,U.z,F)}for(let v=0,R=P.length;v<R;++v){let L=P[v],F=L.start,N=L.count;for(let W=F,B=F+N;W<B;W+=3)I(t.getX(W+0)),I(t.getX(W+1)),I(t.getX(W+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new un(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,d=n.count;u<d;u++)n.setXYZ(u,0,0,0);let s=new G,r=new G,o=new G,a=new G,l=new G,c=new G,h=new G,f=new G;if(t)for(let u=0,d=t.count;u<d;u+=3){let m=t.getX(u+0),M=t.getX(u+1),x=t.getX(u+2);s.fromBufferAttribute(e,m),r.fromBufferAttribute(e,M),o.fromBufferAttribute(e,x),h.subVectors(o,r),f.subVectors(s,r),h.cross(f),a.fromBufferAttribute(n,m),l.fromBufferAttribute(n,M),c.fromBufferAttribute(n,x),a.add(h),l.add(h),c.add(h),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(M,l.x,l.y,l.z),n.setXYZ(x,c.x,c.y,c.z)}else for(let u=0,d=e.count;u<d;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),f.subVectors(s,r),h.cross(f),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)hn.fromBufferAttribute(t,e),hn.normalize(),t.setXYZ(e,hn.x,hn.y,hn.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,f=a.normalized,u=new c.constructor(l.length*h),d=0,m=0;for(let M=0,x=l.length;M<x;M++){a.isInterleavedBufferAttribute?d=l[M]*a.data.stride+a.offset:d=l[M]*h;for(let p=0;p<h;p++)u[m++]=c[d++]}return new un(u,h,f)}if(this.index===null)return ie("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,f=c.length;h<f;h++){let u=c[h],d=t(u,n);l.push(d)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){let d=c[f];h.push(d.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],f=r[c];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var Xc=new G,Am=new G,Em=new oe,mn=class{constructor(t=new G(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=Xc.subVectors(n,e).cross(Am.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let s=t.delta(Xc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(s,o)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Em.getNormalMatrix(t),s=this.coplanarPoint(Xc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},Cm=0,ts=class extends ri{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Cm++}),this.uuid=Ar(),this.name="",this.type="Material",this.blending=Mr,this.side=as,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=oh,this.blendDst=br,this.blendEquation=Si,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ue(0,0,0),this.blendAlpha=0,this.depthFunc=hr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Lf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ea,this.stencilZFail=Ea,this.stencilZPass=Ea,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){ie(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){ie(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new ue().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new mn().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Wt().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Wt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var Fi=new G,qc=new G,fa=new G,da=new G,es=class{constructor(t=new G,e=new G(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Fi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Fi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Fi.copy(this.origin).addScaledVector(this.direction,e),Fi.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){qc.copy(t).add(e).multiplyScalar(.5),fa.copy(e).sub(t).normalize(),da.copy(this.origin).sub(qc);let r=t.distanceTo(e)*.5,o=-this.direction.dot(fa),a=da.dot(this.direction),l=-da.dot(fa),c=da.lengthSq(),h=Math.abs(1-o*o),f,u,d,m;if(h>0)if(f=o*l-a,u=o*a-l,m=r*h,f>=0)if(u>=-m)if(u<=m){let M=1/h;f*=M,u*=M,d=f*(f+o*u+2*a)+u*(o*f+u+2*l)+c}else u=r,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*l)+c;else u=-r,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*l)+c;else u<=-m?(f=Math.max(0,-(-o*r+a)),u=f>0?-r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c):u<=m?(f=0,u=Math.min(Math.max(-r,-l),r),d=u*(u+2*l)+c):(f=Math.max(0,-(o*r+a)),u=f>0?r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c);else u=o>0?-r:r,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(qc).addScaledVector(fa,u),d}intersectSphere(t,e){if(t.radius<0)return null;Fi.subVectors(t.center,this.origin);let n=Fi.dot(this.direction),s=Fi.dot(Fi)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),f>=0?(a=(t.min.z-u.z)*f,l=(t.max.z-u.z)*f):(a=(t.max.z-u.z)*f,l=(t.min.z-u.z)*f),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Fi)!==null}intersectTriangle(t,e,n,s,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,f=t.x-o.x,u=t.y-o.y,d=t.z-o.z,m=e.x-o.x,M=e.y-o.y,x=e.z-o.z,p=n.x-o.x,P=n.y-o.y,U=n.z-o.z,b=Math.abs(l),S=Math.abs(c),E=Math.abs(h),I,v,R,L,F,N,W,B,J,ot,lt,vt;if(b>=S&&b>=E?(R=l,N=f,J=m,vt=p,l>=0?(I=c,v=h,L=u,F=d,W=M,B=x,ot=P,lt=U):(I=h,v=c,L=d,F=u,W=x,B=M,ot=U,lt=P)):S>=E?(R=c,N=u,J=M,vt=P,c>=0?(I=h,v=l,L=d,F=f,W=x,B=m,ot=U,lt=p):(I=l,v=h,L=f,F=d,W=m,B=x,ot=p,lt=U)):(R=h,N=d,J=x,vt=U,h>=0?(I=l,v=c,L=f,F=u,W=m,B=M,ot=p,lt=P):(I=c,v=l,L=u,F=f,W=M,B=m,ot=P,lt=p)),R===0)return null;let at=I/R,gt=v/R,yt=1/R,Xt=L-at*N,Gt=F-gt*N,Ce=W-at*J,pe=B-gt*J,Me=ot-at*vt,ct=lt-gt*vt,X=Me*pe-ct*Ce,wt=Xt*ct-Gt*Me,Pt=Ce*Gt-pe*Xt;if(s){if(X<0||wt<0||Pt<0)return null}else if((X<0||wt<0||Pt<0)&&(X>0||wt>0||Pt>0))return null;let xt=X+wt+Pt;if(xt===0)return null;let Ft=yt*(X*N+wt*J+Pt*vt);return(xt>0?Ft<0:Ft>0)?null:this.at(Ft/xt,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Cs=class extends ts{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ji,this.combine=ah,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Ku=new Xe,bs=new es,pa=new Es,Ju=new G,ma=new G,ga=new G,xa=new G,Yc=new G,_a=new G,ju=new G,va=new G,Ge=class extends zn{constructor(t=new yn,e=new Cs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){_a.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],f=r[l];h!==0&&(Yc.fromBufferAttribute(f,t),o?_a.addScaledVector(Yc,h):_a.addScaledVector(Yc.sub(e),h))}e.add(_a)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),pa.copy(n.boundingSphere),pa.applyMatrix4(r),bs.copy(t.ray).recast(t.near),!(pa.containsPoint(bs.origin)===!1&&(bs.intersectSphere(pa,Ju)===null||bs.origin.distanceToSquared(Ju)>(t.far-t.near)**2))&&(Ku.copy(r).invert(),bs.copy(t.ray).applyMatrix4(Ku),!(n.boundingBox!==null&&bs.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,bs)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,u=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,M=u.length;m<M;m++){let x=u[m],p=o[x.materialIndex],P=Math.max(x.start,d.start),U=Math.min(a.count,Math.min(x.start+x.count,d.start+d.count));for(let b=P,S=U;b<S;b+=3){let E=a.getX(b),I=a.getX(b+1),v=a.getX(b+2);s=ya(this,p,t,n,c,h,f,E,I,v),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=x.materialIndex,e.push(s))}}else{let m=Math.max(0,d.start),M=Math.min(a.count,d.start+d.count);for(let x=m,p=M;x<p;x+=3){let P=a.getX(x),U=a.getX(x+1),b=a.getX(x+2);s=ya(this,o,t,n,c,h,f,P,U,b),s&&(s.faceIndex=Math.floor(x/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,M=u.length;m<M;m++){let x=u[m],p=o[x.materialIndex],P=Math.max(x.start,d.start),U=Math.min(l.count,Math.min(x.start+x.count,d.start+d.count));for(let b=P,S=U;b<S;b+=3){let E=b,I=b+1,v=b+2;s=ya(this,p,t,n,c,h,f,E,I,v),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=x.materialIndex,e.push(s))}}else{let m=Math.max(0,d.start),M=Math.min(l.count,d.start+d.count);for(let x=m,p=M;x<p;x+=3){let P=x,U=x+1,b=x+2;s=ya(this,o,t,n,c,h,f,P,U,b),s&&(s.faceIndex=Math.floor(x/3),e.push(s))}}}};function Rm(i,t,e,n,s,r,o,a){let l;if(t.side===Rn?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===as,a),l===null)return null;va.copy(a),va.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(va);return c<e.near||c>e.far?null:{distance:c,point:va.clone(),object:i}}function ya(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,ma),i.getVertexPosition(l,ga),i.getVertexPosition(c,xa);let h=Rm(i,t,e,n,ma,ga,xa,ju);if(h){let f=new G;Ji.getBarycoord(ju,ma,ga,xa,f),s&&(h.uv=Ji.getInterpolatedAttribute(s,a,l,c,f,new Wt)),r&&(h.uv1=Ji.getInterpolatedAttribute(r,a,l,c,f,new Wt)),o&&(h.normal=Ji.getInterpolatedAttribute(o,a,l,c,f,new G),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:l,c,normal:new G,materialIndex:0};Ji.getNormal(ma,ga,xa,u.normal),h.face=u,h.barycoord=f}return h}var ns=class extends vn{constructor(t=null,e=1,n=1,s,r,o,a,l,c=fn,h=fn,f,u){super(null,o,a,l,c,h,s,r,f,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var oo=class extends un{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}};var ws=new Es,Pm=new Wt(.5,.5),Ma=new G,ao=class{constructor(t=new mn,e=new mn,n=new mn,s=new mn,r=new mn,o=new mn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=si,n=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],f=r[5],u=r[6],d=r[7],m=r[8],M=r[9],x=r[10],p=r[11],P=r[12],U=r[13],b=r[14],S=r[15];if(s[0].setComponents(c-o,d-h,p-m,S-P).normalize(),s[1].setComponents(c+o,d+h,p+m,S+P).normalize(),s[2].setComponents(c+a,d+f,p+M,S+U).normalize(),s[3].setComponents(c-a,d-f,p-M,S-U).normalize(),n)s[4].setComponents(l,u,x,b).normalize(),s[5].setComponents(c-l,d-u,p-x,S-b).normalize();else if(s[4].setComponents(c-l,d-u,p-x,S-b).normalize(),e===si)s[5].setComponents(c+l,d+u,p+x,S+b).normalize();else if(e===eo)s[5].setComponents(l,u,x,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),ws.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),ws.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(ws)}intersectsSprite(t){ws.center.set(0,0,0);let e=Pm.distanceTo(t.center);return ws.radius=.7071067811865476+e,ws.applyMatrix4(t.matrixWorld),this.intersectsSphere(ws)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Ma.x=s.normal.x>0?t.max.x:t.min.x,Ma.y=s.normal.y>0?t.max.y:t.min.y,Ma.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Ma)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Ha=class extends ts{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ue(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Qu=new Xe,Qc=new es,Sa=new Es,ba=new G,lo=class extends zn{constructor(t=new yn,e=new Ha){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Sa.copy(n.boundingSphere),Sa.applyMatrix4(s),Sa.radius+=r,t.ray.intersectsSphere(Sa)===!1)return;Qu.copy(s).invert(),Qc.copy(t.ray).applyMatrix4(Qu);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,f=n.attributes.position;if(c!==null){let u=Math.max(0,o.start),d=Math.min(c.count,o.start+o.count);for(let m=u,M=d;m<M;m++){let x=c.getX(m);ba.fromBufferAttribute(f,x),tf(ba,x,l,s,t,e,this)}}else{let u=Math.max(0,o.start),d=Math.min(f.count,o.start+o.count);for(let m=u,M=d;m<M;m++)ba.fromBufferAttribute(f,m),tf(ba,m,l,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function tf(i,t,e,n,s,r,o){let a=Qc.distanceSqToPoint(i);if(a<e){let l=new G;Qc.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var co=class extends vn{constructor(t=[],e=ls,n,s,r,o,a,l,c,h){super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},ho=class extends vn{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var is=class extends vn{constructor(t,e,n=li,s,r,o,a=fn,l=fn,c,h=vi,f=1){if(h!==vi&&h!==hs)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:f};super(u,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new pr(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Ga=class extends is{constructor(t,e=li,n=ls,s,r,o=fn,a=fn,l,c=vi){let h={width:t,height:t,depth:1},f=[h,h,h,h,h,h];super(t,t,e,n,s,r,o,a,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},uo=class extends vn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},xr=class i extends yn{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],f=[],u=0,d=0;m("z","y","x",-1,-1,n,e,t,o,r,0),m("z","y","x",1,-1,n,e,-t,o,r,1),m("x","z","y",1,1,t,n,e,s,o,2),m("x","z","y",1,-1,t,n,-e,s,o,3),m("x","y","z",1,-1,t,e,n,s,r,4),m("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Cn(c,3)),this.setAttribute("normal",new Cn(h,3)),this.setAttribute("uv",new Cn(f,2));function m(M,x,p,P,U,b,S,E,I,v,R){let L=b/I,F=S/v,N=b/2,W=S/2,B=E/2,J=I+1,ot=v+1,lt=0,vt=0,at=new G;for(let gt=0;gt<ot;gt++){let yt=gt*F-W;for(let Xt=0;Xt<J;Xt++){let Gt=Xt*L-N;at[M]=Gt*P,at[x]=yt*U,at[p]=B,c.push(at.x,at.y,at.z),at[M]=0,at[x]=0,at[p]=E>0?1:-1,h.push(at.x,at.y,at.z),f.push(Xt/I),f.push(1-gt/v),lt+=1}}for(let gt=0;gt<v;gt++)for(let yt=0;yt<I;yt++){let Xt=u+yt+J*gt,Gt=u+yt+J*(gt+1),Ce=u+(yt+1)+J*(gt+1),pe=u+(yt+1)+J*gt;l.push(Xt,Gt,pe),l.push(Gt,Ce,pe),vt+=6}a.addGroup(d,vt,R),d+=vt,u+=lt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var Oi=class i extends yn{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,f=t/a,u=e/l,d=[],m=[],M=[],x=[];for(let p=0;p<h;p++){let P=p*u-o;for(let U=0;U<c;U++){let b=U*f-r;m.push(b,-P,0),M.push(0,0,1),x.push(U/a),x.push(1-p/l)}}for(let p=0;p<l;p++)for(let P=0;P<a;P++){let U=P+c*p,b=P+c*(p+1),S=P+1+c*(p+1),E=P+1+c*p;d.push(U,b,E),d.push(b,S,E)}this.setIndex(d),this.setAttribute("position",new Cn(m,3)),this.setAttribute("normal",new Cn(M,3)),this.setAttribute("uv",new Cn(x,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};function Fs(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];if(ef(s))s.isRenderTargetTexture?(ie("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(ef(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function Sn(i){let t={};for(let e=0;e<i.length;e++){let n=Fs(i[e]);for(let s in n)t[s]=n[s]}return t}function ef(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Im(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Sh(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:ge.workingColorSpace}var ki={clone:Fs,merge:Sn},Lm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Dm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,We=class extends ts{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Lm,this.fragmentShader=Dm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Fs(t.uniforms),this.uniformsGroups=Im(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new ue().setHex(s.value);break;case"v2":this.uniforms[n].value=new Wt().fromArray(s.value);break;case"v3":this.uniforms[n].value=new G().fromArray(s.value);break;case"v4":this.uniforms[n].value=new qe().fromArray(s.value);break;case"m3":this.uniforms[n].value=new oe().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Xe().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},_r=class extends We{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var Wa=class extends ts{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Pf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Xa=class extends ts{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function sr(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function $c(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var ss=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},qa=class extends ss{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Kc,endingEnd:Kc}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Jc:r=t,a=2*e-n;break;case jc:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Jc:o=t,l=2*n-e;break;case jc:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,f=this._offsetNext,u=this._weightPrev,d=this._weightNext,m=(n-e)/(s-e),M=m*m,x=M*m,p=-u*x+2*u*M-u*m,P=(1+u)*x+(-1.5-2*u)*M+(-.5+u)*m+1,U=(-1-d)*x+(1.5+d)*M+.5*m,b=d*x-d*M;for(let S=0;S!==a;++S)r[S]=p*o[h+S]+P*o[c+S]+U*o[l+S]+b*o[f+S];return r}},Ya=class extends ss{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(s-e),f=1-h;for(let u=0;u!==a;++u)r[u]=o[c+u]*f+o[l+u]*h;return r}},$a=class extends ss{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Za=class extends ss{interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this.inTangents,f=this.outTangents;if(!h||!f){let m=(n-e)/(s-e),M=1-m;for(let x=0;x!==a;++x)r[x]=o[c+x]*M+o[l+x]*m;return r}let u=a*2,d=t-1;for(let m=0;m!==a;++m){let M=o[c+m],x=o[l+m],p=d*u+m*2,P=f[p],U=f[p+1],b=t*u+m*2,S=h[b],E=h[b+1],I=Fm(n,e,P,S,s);r[m]=Xf(I,M,U,E,x)}return r}};function Xf(i,t,e,n,s){let r=1-i;return r*r*r*t+3*r*r*i*e+3*r*i*i*n+i*i*i*s}function Nm(i,t,e,n,s){let r=1-i;return 3*r*r*(e-t)+6*r*i*(n-e)+3*i*i*(s-n)}function Fm(i,t,e,n,s){let r=(i-t)/(s-t);for(let o=0;o<8;o++){let a=Xf(r,t,e,n,s)-i;if(Math.abs(a)<1e-10)break;let l=Nm(r,t,e,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var Vn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=sr(e,this.TimeBufferType),this.values=sr(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:sr(t.times,Array),values:sr(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s),$c(t.settings)&&(n.settings={inTangents:sr(t.settings.inTangents,Array),outTangents:sr(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new $a(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Ya(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new qa(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new Za(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case jr:e=this.InterpolantFactoryMethodDiscrete;break;case Ba:e=this.InterpolantFactoryMethodLinear;break;case Aa:e=this.InterpolantFactoryMethodSmooth;break;case Zc:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return ie("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return jr;case this.InterpolantFactoryMethodLinear:return Ba;case this.InterpolantFactoryMethodSmooth:return Aa;case this.InterpolantFactoryMethodBezier:return Zc}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t;$c(this.settings)&&(nf(this.settings.inTangents,t),nf(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(se("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(se("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){se("KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){se("KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&Kp(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){se("KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Aa,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let f=a*n,u=f-n,d=f+n;for(let m=0;m!==n;++m){let M=e[f+m];if(M!==e[u+m]||M!==e[d+m]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let f=a*n,u=o*n;for(let d=0;d!==n;++d)e[u+d]=e[f+d]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,$c(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function nf(i,t){for(let e=0,n=i.length;e!==n;e+=2)i[e]*=t}Vn.prototype.ValueTypeName="";Vn.prototype.TimeBufferType=Float32Array;Vn.prototype.ValueBufferType=Float32Array;Vn.prototype.DefaultInterpolation=Ba;var rs=class extends Vn{constructor(t,e,n){super(t,e,n)}};rs.prototype.ValueTypeName="bool";rs.prototype.ValueBufferType=Array;rs.prototype.DefaultInterpolation=jr;rs.prototype.InterpolantFactoryMethodLinear=void 0;rs.prototype.InterpolantFactoryMethodSmooth=void 0;var Ka=class extends Vn{constructor(t,e,n,s){super(t,e,n,s)}};Ka.prototype.ValueTypeName="color";var Ja=class extends Vn{constructor(t,e,n,s){super(t,e,n,s)}};Ja.prototype.ValueTypeName="number";var ja=class extends ss{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)kn.slerpFlat(r,0,o,c-a,o,c,l);return r}},fo=class extends Vn{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new ja(this.times,this.values,this.getValueSize(),t)}};fo.prototype.ValueTypeName="quaternion";fo.prototype.InterpolantFactoryMethodSmooth=void 0;var os=class extends Vn{constructor(t,e,n){super(t,e,n)}};os.prototype.ValueTypeName="string";os.prototype.ValueBufferType=Array;os.prototype.DefaultInterpolation=jr;os.prototype.InterpolantFactoryMethodLinear=void 0;os.prototype.InterpolantFactoryMethodSmooth=void 0;var Qa=class extends Vn{constructor(t,e,n,s){super(t,e,n,s)}};Qa.prototype.ValueTypeName="vector";var Ca={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(sf(i)||(this.files[i]=t))},get:function(i){if(this.enabled!==!1&&!sf(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function sf(i){try{let t=i.slice(i.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch{return!1}}var tl=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,f){return c.push(h,f),this},this.removeHandler=function(h){let f=c.indexOf(h);return f!==-1&&c.splice(f,2),this},this.getHandler=function(h){for(let f=0,u=c.length;f<u;f+=2){let d=c[f],m=c[f+1];if(d.global&&(d.lastIndex=0),d.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},qf=new tl,vr=class{constructor(t){this.manager=t!==void 0?t:qf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};vr.DEFAULT_MATERIAL_NAME="__DEFAULT";var rr=new WeakMap,el=class extends vr{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=Ca.get(`image:${t}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0);else{let f=rr.get(o);f===void 0&&(f=[],rr.set(o,f)),f.push({onLoad:e,onError:s})}return o}let a=ur("img");function l(){h(),e&&e(this);let f=rr.get(this)||[];for(let u=0;u<f.length;u++){let d=f[u];d.onLoad&&d.onLoad(this)}rr.delete(this),r.manager.itemEnd(t)}function c(f){h(),s&&s(f),Ca.remove(`image:${t}`);let u=rr.get(this)||[];for(let d=0;d<u.length;d++){let m=u[d];m.onError&&m.onError(f)}rr.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Ca.add(`image:${t}`,a),r.manager.itemStart(t),a.src=t,a}};var po=class extends vr{constructor(t){super(t)}load(t,e,n,s){let r=new vn,o=new el(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}};var wa=new G,Ta=new kn,xi=new G,mo=class extends zn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Xe,this.projectionMatrix=new Xe,this.projectionMatrixInverse=new Xe,this.coordinateSystem=si,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(wa,Ta,xi),xi.x===1&&xi.y===1&&xi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(wa,Ta,xi.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(wa,Ta,xi),xi.x===1&&xi.y===1&&xi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(wa,Ta,xi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ki=new G,rf=new Wt,of=new Wt,gn=class extends mo{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=dr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Kr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return dr*2*Math.atan(Math.tan(Kr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Ki.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ki.x,Ki.y).multiplyScalar(-t/Ki.z),Ki.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ki.x,Ki.y).multiplyScalar(-t/Ki.z)}getViewSize(t,e){return this.getViewBounds(t,rf,of),e.subVectors(of,rf)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Kr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var Rs=class extends mo{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}};var go=class extends yn{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){let t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}};var or=-90,ar=1,nl=class extends zn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new gn(or,ar,t,e);s.layers=this.layers,this.add(s);let r=new gn(or,ar,t,e);r.layers=this.layers,this.add(r);let o=new gn(or,ar,t,e);o.layers=this.layers,this.add(o);let a=new gn(or,ar,t,e);a.layers=this.layers,this.add(a);let l=new gn(or,ar,t,e);l.layers=this.layers,this.add(l);let c=new gn(or,ar,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===si)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===eo)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let x=!1;t.isWebGLRenderer===!0?x=t.state.buffers.depth.getReversed():x=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),x&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),x&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,s),x&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,s),x&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,s),x&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=M,t.setRenderTarget(n,5,s),x&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(f,u,d),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},il=class extends gn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}},xo=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=Um.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Um(){this._document.hidden===!1&&this.reset()}var bh="\\[\\]\\.:\\/",Om=new RegExp("["+bh+"]","g"),wh="[^"+bh+"]",Bm="[^"+bh.replace("\\.","")+"]",km=/((?:WC+[\/:])*)/.source.replace("WC",wh),zm=/(WCOD+)?/.source.replace("WCOD",Bm),Vm=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",wh),Hm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",wh),Gm=new RegExp("^"+km+zm+Vm+Hm+"$"),Wm=["material","materials","bones","map"],th=class{constructor(t,e,n){let s=n||He.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},He=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Om,"")}static parseTrackName(t){let e=Gm.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Wm.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){ie("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){se("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){se("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){se("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){se("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){se("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){se("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){se("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;se("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){se("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){se("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};He.Composite=th;He.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};He.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};He.prototype.GetterByBindingType=[He.prototype._getValue_direct,He.prototype._getValue_array,He.prototype._getValue_arrayElement,He.prototype._getValue_toArray];He.prototype.SetterByBindingTypeAndVersioning=[[He.prototype._setValue_direct,He.prototype._setValue_direct_setNeedsUpdate,He.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[He.prototype._setValue_array,He.prototype._setValue_array_setNeedsUpdate,He.prototype._setValue_array_setMatrixWorldNeedsUpdate],[He.prototype._setValue_arrayElement,He.prototype._setValue_arrayElement_setNeedsUpdate,He.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[He.prototype._setValue_fromArray,He.prototype._setValue_fromArray_setNeedsUpdate,He.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var aS=new Float32Array(1);var af=new Xe,Ps=class{constructor(t,e,n=0,s=1/0){this.ray=new es(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new mr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):se("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return af.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(af),this}intersectObject(t,e=!0,n=[]){return eh(t,this,n,e),n.sort(lf),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)eh(t[s],this,n,e);return n.sort(lf),n}};function lf(i,t){return i.distance-t.distance}function eh(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)eh(r[o],t,e,!0)}}var yi=class{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=xe(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(xe(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Ph=class Ph{constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}};Ph.prototype.isMatrix2=!0;var nh=Ph;var _o=class extends ri{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function Th(i,t,e,n){let s=Xm(n);switch(e){case dh:return i*t;case mh:return i*t/s.components*s.byteLength;case fl:return i*t/s.components*s.byteLength;case us:return i*t*2/s.components*s.byteLength;case dl:return i*t*2/s.components*s.byteLength;case ph:return i*t*3/s.components*s.byteLength;case Mn:return i*t*4/s.components*s.byteLength;case pl:return i*t*4/s.components*s.byteLength;case Co:case Ro:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Po:case Io:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case gl:case _l:return Math.max(i,16)*Math.max(t,8)/4;case ml:case xl:return Math.max(i,8)*Math.max(t,8)/2;case vl:case yl:case Sl:case bl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ml:case Lo:case wl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Tl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Al:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case El:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Cl:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Rl:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Pl:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Il:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Ll:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Dl:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Nl:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Fl:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Ul:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Ol:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Bl:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case kl:case zl:case Vl:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Hl:case Gl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Do:case Wl:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Xm(i){switch(i){case Hn:case ch:return{byteLength:1,components:1};case wr:case hh:case en:return{byteLength:2,components:1};case hl:case ul:return{byteLength:2,components:4};case li:case cl:case ci:return{byteLength:4,components:1};case uh:case fh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?ie("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function pd(){let i=null,t=!1,e=null,n=null;function s(r,o){n=i.requestAnimationFrame(s),e(r,o)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Ym(i){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,f=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),a.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:f}}function n(a,l,c){let h=l.array,f=l.updateRanges;if(i.bindBuffer(c,a),f.length===0)i.bufferSubData(c,0,h);else{f.sort((d,m)=>d.start-m.start);let u=0;for(let d=1;d<f.length;d++){let m=f[u],M=f[d];M.start<=m.start+m.count+1?m.count=Math.max(m.count,M.start+M.count-m.start):(++u,f[u]=M)}f.length=u+1;for(let d=0,m=f.length;d<m;d++){let M=f[d];i.bufferSubData(c,M.start*h.BYTES_PER_ELEMENT,h,M.start,M.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var $m=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Zm=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Km=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Jm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,jm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Qm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,t0=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,e0=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,n0=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,i0=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,s0=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,r0=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,o0=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,a0=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,l0=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,c0=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,h0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,u0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,f0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,d0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,p0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,m0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,g0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,x0=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,_0=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,v0=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,y0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,M0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,S0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,b0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,w0="gl_FragColor = linearToOutputTexel( gl_FragColor );",T0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,A0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,E0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,C0=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,R0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,P0=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,I0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,L0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,D0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,N0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,F0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,U0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,O0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,B0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,k0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,z0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,V0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,H0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,G0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,W0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,X0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,q0=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Y0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,$0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Z0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,K0=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,J0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,j0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Q0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,tg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,eg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ng=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,ig=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,sg=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,rg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,og=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ag=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,lg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,cg=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hg=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,ug=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,fg=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,dg=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,pg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,mg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,gg=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,xg=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,_g=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,vg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,yg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Mg=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Sg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,bg=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,wg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Tg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ag=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Eg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Cg=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Rg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Pg=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Ig=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Lg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Dg=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Ng=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Fg=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ug=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Og=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Bg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,kg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,zg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Vg=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Hg=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Gg=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Wg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Xg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,qg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Yg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,$g=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Zg=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Jg=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Qg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,tx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,ex=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,nx=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,ix=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,sx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,rx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ox=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,ax=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,lx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,cx=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hx=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ux=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fx=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,dx=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,px=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,mx=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,gx=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xx=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_x=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,vx=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yx=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Mx=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Sx=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,bx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,wx=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Tx=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ax=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ex=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,de={alphahash_fragment:$m,alphahash_pars_fragment:Zm,alphamap_fragment:Km,alphamap_pars_fragment:Jm,alphatest_fragment:jm,alphatest_pars_fragment:Qm,aomap_fragment:t0,aomap_pars_fragment:e0,batching_pars_vertex:n0,batching_vertex:i0,begin_vertex:s0,beginnormal_vertex:r0,bsdfs:o0,iridescence_fragment:a0,bumpmap_pars_fragment:l0,clipping_planes_fragment:c0,clipping_planes_pars_fragment:h0,clipping_planes_pars_vertex:u0,clipping_planes_vertex:f0,color_fragment:d0,color_pars_fragment:p0,color_pars_vertex:m0,color_vertex:g0,common:x0,cube_uv_reflection_fragment:_0,defaultnormal_vertex:v0,displacementmap_pars_vertex:y0,displacementmap_vertex:M0,emissivemap_fragment:S0,emissivemap_pars_fragment:b0,colorspace_fragment:w0,colorspace_pars_fragment:T0,envmap_fragment:A0,envmap_common_pars_fragment:E0,envmap_pars_fragment:C0,envmap_pars_vertex:R0,envmap_physical_pars_fragment:z0,envmap_vertex:P0,fog_vertex:I0,fog_pars_vertex:L0,fog_fragment:D0,fog_pars_fragment:N0,gradientmap_pars_fragment:F0,lightmap_pars_fragment:U0,lights_lambert_fragment:O0,lights_lambert_pars_fragment:B0,lights_pars_begin:k0,lights_toon_fragment:V0,lights_toon_pars_fragment:H0,lights_phong_fragment:G0,lights_phong_pars_fragment:W0,lights_physical_fragment:X0,lights_physical_pars_fragment:q0,lights_fragment_begin:Y0,lights_fragment_maps:$0,lights_fragment_end:Z0,lightprobes_pars_fragment:K0,logdepthbuf_fragment:J0,logdepthbuf_pars_fragment:j0,logdepthbuf_pars_vertex:Q0,logdepthbuf_vertex:tg,map_fragment:eg,map_pars_fragment:ng,map_particle_fragment:ig,map_particle_pars_fragment:sg,metalnessmap_fragment:rg,metalnessmap_pars_fragment:og,morphinstance_vertex:ag,morphcolor_vertex:lg,morphnormal_vertex:cg,morphtarget_pars_vertex:hg,morphtarget_vertex:ug,normal_fragment_begin:fg,normal_fragment_maps:dg,normal_pars_fragment:pg,normal_pars_vertex:mg,normal_vertex:gg,normalmap_pars_fragment:xg,clearcoat_normal_fragment_begin:_g,clearcoat_normal_fragment_maps:vg,clearcoat_pars_fragment:yg,iridescence_pars_fragment:Mg,opaque_fragment:Sg,packing:bg,premultiplied_alpha_fragment:wg,project_vertex:Tg,dithering_fragment:Ag,dithering_pars_fragment:Eg,roughnessmap_fragment:Cg,roughnessmap_pars_fragment:Rg,shadowmap_pars_fragment:Pg,shadowmap_pars_vertex:Ig,shadowmap_vertex:Lg,shadowmask_pars_fragment:Dg,skinbase_vertex:Ng,skinning_pars_vertex:Fg,skinning_vertex:Ug,skinnormal_vertex:Og,specularmap_fragment:Bg,specularmap_pars_fragment:kg,tonemapping_fragment:zg,tonemapping_pars_fragment:Vg,transmission_fragment:Hg,transmission_pars_fragment:Gg,uv_pars_fragment:Wg,uv_pars_vertex:Xg,uv_vertex:qg,worldpos_vertex:Yg,background_vert:$g,background_frag:Zg,backgroundCube_vert:Kg,backgroundCube_frag:Jg,cube_vert:jg,cube_frag:Qg,depth_vert:tx,depth_frag:ex,distance_vert:nx,distance_frag:ix,equirect_vert:sx,equirect_frag:rx,linedashed_vert:ox,linedashed_frag:ax,meshbasic_vert:lx,meshbasic_frag:cx,meshlambert_vert:hx,meshlambert_frag:ux,meshmatcap_vert:fx,meshmatcap_frag:dx,meshnormal_vert:px,meshnormal_frag:mx,meshphong_vert:gx,meshphong_frag:xx,meshphysical_vert:_x,meshphysical_frag:vx,meshtoon_vert:yx,meshtoon_frag:Mx,points_vert:Sx,points_frag:bx,shadow_vert:wx,shadow_frag:Tx,sprite_vert:Ax,sprite_frag:Ex},Dt={common:{diffuse:{value:new ue(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new oe},alphaMap:{value:null},alphaMapTransform:{value:new oe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new oe}},envmap:{envMap:{value:null},envMapRotation:{value:new oe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new oe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new oe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new oe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new oe},normalScale:{value:new Wt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new oe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new oe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new oe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new oe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ue(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new G},probesMax:{value:new G},probesResolution:{value:new G}},points:{diffuse:{value:new ue(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new oe},alphaTest:{value:0},uvTransform:{value:new oe}},sprite:{diffuse:{value:new ue(16777215)},opacity:{value:1},center:{value:new Wt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new oe},alphaMap:{value:null},alphaMapTransform:{value:new oe},alphaTest:{value:0}}},wi={basic:{uniforms:Sn([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.fog]),vertexShader:de.meshbasic_vert,fragmentShader:de.meshbasic_frag},lambert:{uniforms:Sn([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,Dt.lights,{emissive:{value:new ue(0)},envMapIntensity:{value:1}}]),vertexShader:de.meshlambert_vert,fragmentShader:de.meshlambert_frag},phong:{uniforms:Sn([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,Dt.lights,{emissive:{value:new ue(0)},specular:{value:new ue(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:de.meshphong_vert,fragmentShader:de.meshphong_frag},standard:{uniforms:Sn([Dt.common,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.roughnessmap,Dt.metalnessmap,Dt.fog,Dt.lights,{emissive:{value:new ue(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:de.meshphysical_vert,fragmentShader:de.meshphysical_frag},toon:{uniforms:Sn([Dt.common,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.gradientmap,Dt.fog,Dt.lights,{emissive:{value:new ue(0)}}]),vertexShader:de.meshtoon_vert,fragmentShader:de.meshtoon_frag},matcap:{uniforms:Sn([Dt.common,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,{matcap:{value:null}}]),vertexShader:de.meshmatcap_vert,fragmentShader:de.meshmatcap_frag},points:{uniforms:Sn([Dt.points,Dt.fog]),vertexShader:de.points_vert,fragmentShader:de.points_frag},dashed:{uniforms:Sn([Dt.common,Dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:de.linedashed_vert,fragmentShader:de.linedashed_frag},depth:{uniforms:Sn([Dt.common,Dt.displacementmap]),vertexShader:de.depth_vert,fragmentShader:de.depth_frag},normal:{uniforms:Sn([Dt.common,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,{opacity:{value:1}}]),vertexShader:de.meshnormal_vert,fragmentShader:de.meshnormal_frag},sprite:{uniforms:Sn([Dt.sprite,Dt.fog]),vertexShader:de.sprite_vert,fragmentShader:de.sprite_frag},background:{uniforms:{uvTransform:{value:new oe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:de.background_vert,fragmentShader:de.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new oe}},vertexShader:de.backgroundCube_vert,fragmentShader:de.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:de.cube_vert,fragmentShader:de.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:de.equirect_vert,fragmentShader:de.equirect_frag},distance:{uniforms:Sn([Dt.common,Dt.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:de.distance_vert,fragmentShader:de.distance_frag},shadow:{uniforms:Sn([Dt.lights,Dt.fog,{color:{value:new ue(0)},opacity:{value:1}}]),vertexShader:de.shadow_vert,fragmentShader:de.shadow_frag}};wi.physical={uniforms:Sn([wi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new oe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new oe},clearcoatNormalScale:{value:new Wt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new oe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new oe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new oe},sheen:{value:0},sheenColor:{value:new ue(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new oe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new oe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new oe},transmissionSamplerSize:{value:new Wt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new oe},attenuationDistance:{value:0},attenuationColor:{value:new ue(0)},specularColor:{value:new ue(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new oe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new oe},anisotropyVector:{value:new Wt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new oe}}]),vertexShader:de.meshphysical_vert,fragmentShader:de.meshphysical_frag};var Yl={r:0,b:0,g:0},Cx=new Xe,md=new oe;md.set(-1,0,0,0,1,0,0,0,1);function Rx(i,t,e,n,s,r){let o=new ue(0),a=s===!0?0:1,l,c,h=null,f=0,u=null;function d(P){let U=P.isScene===!0?P.background:null;if(U&&U.isTexture){let b=P.backgroundBlurriness>0;U=t.get(U,b)}return U}function m(P){let U=!1,b=d(P);b===null?x(o,a):b&&b.isColor&&(x(b,1),U=!0);let S=i.xr.getEnvironmentBlendMode();S==="additive"?e.buffers.color.setClear(0,0,0,1,r):S==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||U)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function M(P,U){let b=d(U);b&&(b.isCubeTexture||b.mapping===Ao)?(c===void 0&&(c=new Ge(new xr(1,1,1),new We({name:"BackgroundCubeMaterial",uniforms:Fs(wi.backgroundCube.uniforms),vertexShader:wi.backgroundCube.vertexShader,fragmentShader:wi.backgroundCube.fragmentShader,side:Rn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(S,E,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=b,c.material.uniforms.backgroundBlurriness.value=U.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=U.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Cx.makeRotationFromEuler(U.backgroundRotation)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(md),c.material.toneMapped=ge.getTransfer(b.colorSpace)!==Ee,(h!==b||f!==b.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=b,f=b.version,u=i.toneMapping),c.layers.enableAll(),P.unshift(c,c.geometry,c.material,0,0,null)):b&&b.isTexture&&(l===void 0&&(l=new Ge(new Oi(2,2),new We({name:"BackgroundMaterial",uniforms:Fs(wi.background.uniforms),vertexShader:wi.background.vertexShader,fragmentShader:wi.background.fragmentShader,side:as,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=b,l.material.uniforms.backgroundIntensity.value=U.backgroundIntensity,l.material.toneMapped=ge.getTransfer(b.colorSpace)!==Ee,b.matrixAutoUpdate===!0&&b.updateMatrix(),l.material.uniforms.uvTransform.value.copy(b.matrix),(h!==b||f!==b.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=b,f=b.version,u=i.toneMapping),l.layers.enableAll(),P.unshift(l,l.geometry,l.material,0,0,null))}function x(P,U){P.getRGB(Yl,Sh(i)),e.buffers.color.setClear(Yl.r,Yl.g,Yl.b,U,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(P,U=1){o.set(P),a=U,x(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(P){a=P,x(o,a)},render:m,addToRenderList:M,dispose:p}}function Px(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null),r=s,o=!1;function a(F,N,W,B,J){let ot=!1,lt=f(F,B,W,N);r!==lt&&(r=lt,c(r.object)),ot=d(F,B,W,J),ot&&m(F,B,W,J),J!==null&&t.update(J,i.ELEMENT_ARRAY_BUFFER),(ot||o)&&(o=!1,b(F,N,W,B),J!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(J).buffer))}function l(){return i.createVertexArray()}function c(F){return i.bindVertexArray(F)}function h(F){return i.deleteVertexArray(F)}function f(F,N,W,B){let J=B.wireframe===!0,ot=n[N.id];ot===void 0&&(ot={},n[N.id]=ot);let lt=F.isInstancedMesh===!0?F.id:0,vt=ot[lt];vt===void 0&&(vt={},ot[lt]=vt);let at=vt[W.id];at===void 0&&(at={},vt[W.id]=at);let gt=at[J];return gt===void 0&&(gt=u(l()),at[J]=gt),gt}function u(F){let N=[],W=[],B=[];for(let J=0;J<e;J++)N[J]=0,W[J]=0,B[J]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:W,attributeDivisors:B,object:F,attributes:{},index:null}}function d(F,N,W,B){let J=r.attributes,ot=N.attributes,lt=0,vt=W.getAttributes();for(let at in vt)if(vt[at].location>=0){let yt=J[at],Xt=ot[at];if(Xt===void 0&&(at==="instanceMatrix"&&F.instanceMatrix&&(Xt=F.instanceMatrix),at==="instanceColor"&&F.instanceColor&&(Xt=F.instanceColor)),yt===void 0||yt.attribute!==Xt||Xt&&yt.data!==Xt.data)return!0;lt++}return r.attributesNum!==lt||r.index!==B}function m(F,N,W,B){let J={},ot=N.attributes,lt=0,vt=W.getAttributes();for(let at in vt)if(vt[at].location>=0){let yt=ot[at];yt===void 0&&(at==="instanceMatrix"&&F.instanceMatrix&&(yt=F.instanceMatrix),at==="instanceColor"&&F.instanceColor&&(yt=F.instanceColor));let Xt={};Xt.attribute=yt,yt&&yt.data&&(Xt.data=yt.data),J[at]=Xt,lt++}r.attributes=J,r.attributesNum=lt,r.index=B}function M(){let F=r.newAttributes;for(let N=0,W=F.length;N<W;N++)F[N]=0}function x(F){p(F,0)}function p(F,N){let W=r.newAttributes,B=r.enabledAttributes,J=r.attributeDivisors;W[F]=1,B[F]===0&&(i.enableVertexAttribArray(F),B[F]=1),J[F]!==N&&(i.vertexAttribDivisor(F,N),J[F]=N)}function P(){let F=r.newAttributes,N=r.enabledAttributes;for(let W=0,B=N.length;W<B;W++)N[W]!==F[W]&&(i.disableVertexAttribArray(W),N[W]=0)}function U(F,N,W,B,J,ot,lt){lt===!0?i.vertexAttribIPointer(F,N,W,J,ot):i.vertexAttribPointer(F,N,W,B,J,ot)}function b(F,N,W,B){M();let J=B.attributes,ot=W.getAttributes(),lt=N.defaultAttributeValues;for(let vt in ot){let at=ot[vt];if(at.location>=0){let gt=J[vt];if(gt===void 0&&(vt==="instanceMatrix"&&F.instanceMatrix&&(gt=F.instanceMatrix),vt==="instanceColor"&&F.instanceColor&&(gt=F.instanceColor)),gt!==void 0){let yt=gt.normalized,Xt=gt.itemSize,Gt=t.get(gt);if(Gt===void 0)continue;let Ce=Gt.buffer,pe=Gt.type,Me=Gt.bytesPerElement,ct=pe===i.INT||pe===i.UNSIGNED_INT||gt.gpuType===cl;if(gt.isInterleavedBufferAttribute){let X=gt.data,wt=X.stride,Pt=gt.offset;if(X.isInstancedInterleavedBuffer){for(let xt=0;xt<at.locationSize;xt++)p(at.location+xt,X.meshPerAttribute);F.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let xt=0;xt<at.locationSize;xt++)x(at.location+xt);i.bindBuffer(i.ARRAY_BUFFER,Ce);for(let xt=0;xt<at.locationSize;xt++)U(at.location+xt,Xt/at.locationSize,pe,yt,wt*Me,(Pt+Xt/at.locationSize*xt)*Me,ct)}else{if(gt.isInstancedBufferAttribute){for(let X=0;X<at.locationSize;X++)p(at.location+X,gt.meshPerAttribute);F.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=gt.meshPerAttribute*gt.count)}else for(let X=0;X<at.locationSize;X++)x(at.location+X);i.bindBuffer(i.ARRAY_BUFFER,Ce);for(let X=0;X<at.locationSize;X++)U(at.location+X,Xt/at.locationSize,pe,yt,Xt*Me,Xt/at.locationSize*X*Me,ct)}}else if(lt!==void 0){let yt=lt[vt];if(yt!==void 0)switch(yt.length){case 2:i.vertexAttrib2fv(at.location,yt);break;case 3:i.vertexAttrib3fv(at.location,yt);break;case 4:i.vertexAttrib4fv(at.location,yt);break;default:i.vertexAttrib1fv(at.location,yt)}}}}P()}function S(){R();for(let F in n){let N=n[F];for(let W in N){let B=N[W];for(let J in B){let ot=B[J];for(let lt in ot)h(ot[lt].object),delete ot[lt];delete B[J]}}delete n[F]}}function E(F){if(n[F.id]===void 0)return;let N=n[F.id];for(let W in N){let B=N[W];for(let J in B){let ot=B[J];for(let lt in ot)h(ot[lt].object),delete ot[lt];delete B[J]}}delete n[F.id]}function I(F){for(let N in n){let W=n[N];for(let B in W){let J=W[B];if(J[F.id]===void 0)continue;let ot=J[F.id];for(let lt in ot)h(ot[lt].object),delete ot[lt];delete J[F.id]}}}function v(F){for(let N in n){let W=n[N],B=F.isInstancedMesh===!0?F.id:0,J=W[B];if(J!==void 0){for(let ot in J){let lt=J[ot];for(let vt in lt)h(lt[vt].object),delete lt[vt];delete J[ot]}delete W[B],Object.keys(W).length===0&&delete n[N]}}}function R(){L(),o=!0,r!==s&&(r=s,c(r.object))}function L(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:R,resetDefaultState:L,dispose:S,releaseStatesOfGeometry:E,releaseStatesOfObject:v,releaseStatesOfProgram:I,initAttributes:M,enableAttribute:x,disableUnusedAttributes:P}}function Ix(i,t,e){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),e.update(c,n,1)}function o(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function a(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let d=0;d<h;d++)u+=c[d];e.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function Lx(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let I=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(I){return!(I!==Mn&&n.convert(I)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(I){let v=I===en&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(I!==Hn&&I!==ci&&!v&&n.convert(I)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(I){if(I==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(ie("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let f=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&ie("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=i.getParameter(i.MAX_TEXTURE_SIZE),x=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),P=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),U=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),S=i.getParameter(i.MAX_SAMPLES),E=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:m,maxTextureSize:M,maxCubemapSize:x,maxAttributes:p,maxVertexUniforms:P,maxVaryings:U,maxFragmentUniforms:b,maxSamples:S,samples:E}}function Dx(i){let t=this,e=null,n=0,s=!1,r=!1,o=new mn,a=new oe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){let d=f.length!==0||u||n!==0||s;return s=u,n=f.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,u){e=h(f,u,0)},this.setState=function(f,u,d){let m=f.clippingPlanes,M=f.clipIntersection,x=f.clipShadows,p=i.get(f);if(!s||m===null||m.length===0||r&&!x)r?h(null):c();else{let P=r?0:n,U=P*4,b=p.clippingState||null;l.value=b,b=h(m,u,U,d);for(let S=0;S!==U;++S)b[S]=e[S];p.clippingState=b,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=P}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,u,d,m){let M=f!==null?f.length:0,x=null;if(M!==0){if(x=l.value,m!==!0||x===null){let p=d+M*4,P=u.matrixWorldInverse;a.getNormalMatrix(P),(x===null||x.length<p)&&(x=new Float32Array(p));for(let U=0,b=d;U!==M;++U,b+=4)o.copy(f[U]).applyMatrix4(P,a),o.normal.toArray(x,b),x[b+3]=o.constant}l.value=x,l.needsUpdate=!0}return t.numPlanes=M,t.numIntersection=0,x}}var Cr=4,Nx=6,Fx=20,Ux=256,No=new Rs,Yf=new ue,Ih=null,Lh=0,Dh=0,Nh=!1,Ox=new G,Us=new G,Zl=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){let{size:o=256,position:a=Ox}=r;Ih=this._renderer.getRenderTarget(),Lh=this._renderer.getActiveCubeFace(),Dh=this._renderer.getActiveMipmapLevel(),Nh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Kf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Zf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Ih,Lh,Dh),this._renderer.xr.enabled=Nh,t.scissorTest=!1,Er(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ls||t.mapping===Ns?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ih=this._renderer.getRenderTarget(),Lh=this._renderer.getActiveCubeFace(),Dh=this._renderer.getActiveMipmapLevel(),Nh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ye,minFilter:Ye,generateMipmaps:!1,type:en,format:Mn,colorSpace:Qr,depthBuffer:!1},s=$f(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=$f(t,e,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Bx(r)),this._blurMaterial=zx(r,t,e),this._ggxMaterial=kx(r,t,e)}return s}_compileMaterial(t){let e=new Ge(new yn,t);this._renderer.compile(e,No)}_sceneToCubeUV(t,e,n,s,r){let l=new gn(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,u=f.autoClear,d=f.toneMapping;f.getClearColor(Yf),f.toneMapping=ai,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ge(new xr,new Cs({name:"PMREM.Background",side:Rn,depthWrite:!1,depthTest:!1})));let M=this._backgroundBox,x=M.material,p=!1,P=t.background;P?P.isColor&&(x.color.copy(P),t.background=null,p=!0):(x.color.copy(Yf),p=!0);for(let U=0;U<6;U++){let b=U%3;b===0?(l.up.set(0,c[U],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[U],r.y,r.z)):b===1?(l.up.set(0,0,c[U]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[U],r.z)):(l.up.set(0,c[U],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[U]));let S=this._cubeSize;Er(s,b*S,U>2?S:0,S,S),f.setRenderTarget(s),p&&f.render(M,l),f.render(t,l)}f.toneMapping=d,f.autoClear=u,t.background=P}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===ls||t.mapping===Ns;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Kf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Zf());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Er(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,No)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;let l=o.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),f=Math.sqrt(c*c-h*h),u=c*1.25,d=f*u,{_lodMax:m}=this,M=this._sizeLods[n],x=3*M*(n>m-Cr?n-m+Cr:0),p=4*(this._cubeSize-M);l.envMap.value=t.texture,l.roughness.value=d,l.mipInt.value=m-e,Er(r,x,p,3*M,2*M),s.setRenderTarget(r),s.render(a,No),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=m-n,Er(t,x,p,3*M,2*M),s.setRenderTarget(t),s.render(a,No)}_blur(t,e,n,s){let r=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,n,o),this._blurPass(r,t,n,n,o)}_blurPass(t,e,n,s,r){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[s];l.material=a;let c=a.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let h=this._sizeLods[s],f=3*h*(s>this._lodMax-Cr?s-this._lodMax+Cr:0),u=4*(this._cubeSize-h);Er(e,f,u,3*h,2*h),o.setRenderTarget(e),o.render(l,No)}};function Bx(i){let t=[],e=[],n=i,s=i-Cr+1+Nx;for(let r=0;r<s;r++){let o=Math.pow(2,n);t.push(o);let a=1/(o-2),l=-a,c=1+a,h=[l,l,c,l,c,c,l,l,c,c,l,c],f=6,u=6,d=3,m=new Float32Array(d*u*f),M=new Float32Array(d*u*f);for(let p=0;p<f;p++){let P=p%3*2/3-1,U=p>2?0:-1,b=[P,U,0,P+2/3,U,0,P+2/3,U+1,0,P,U,0,P+2/3,U+1,0,P,U+1,0];m.set(b,d*u*p);for(let S=0;S<u;S++){let E=h[S*2]*2-1,I=h[S*2+1]*2-1;p===0?Us.set(1,I,E):p===1?Us.set(-E,1,-I):p===2?Us.set(-E,I,1):p===3?Us.set(-1,I,-E):p===4?Us.set(-E,-1,I):Us.set(E,I,-1),Us.toArray(M,(p*u+S)*d)}}let x=new yn;x.setAttribute("position",new un(m,d)),x.setAttribute("outputDirection",new un(M,d)),e.push(new Ge(x,null)),n>Cr&&n--}return{lodMeshes:e,sizeLods:t}}function $f(i,t,e){let n=new $e(i,t,e);return n.texture.mapping=Ao,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Er(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function kx(i,t,e){return new We({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Ux,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:jl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function zx(i,t,e){return new We({name:"SphericalGaussianBlur",defines:{SAMPLES:Fx,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:jl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function Zf(){return new We({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:jl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function Kf(){return new We({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:jl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:$n,depthTest:!1,depthWrite:!1})}function jl(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Kl=class extends $e{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new co(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new xr(5,5,5),r=new We({name:"CubemapFromEquirect",uniforms:Fs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Rn,blending:$n});r.uniforms.tEquirect.value=e;let o=new Ge(s,r),a=e.minFilter;return e.minFilter===cs&&(e.minFilter=Ye),new nl(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}};function Vx(i){let t=new WeakMap,e=new WeakMap,n=null;function s(u,d=!1){return u==null?null:d?o(u):r(u)}function r(u){if(u&&u.isTexture){let d=u.mapping;if(d===ol||d===al)if(t.has(u)){let m=t.get(u).texture;return a(m,u.mapping)}else{let m=u.image;if(m&&m.height>0){let M=new Kl(m.height);return M.fromEquirectangularTexture(i,u),t.set(u,M),u.addEventListener("dispose",c),a(M.texture,u.mapping)}else return null}}return u}function o(u){if(u&&u.isTexture){let d=u.mapping,m=d===ol||d===al,M=d===ls||d===Ns;if(m||M){let x=e.get(u),p=x!==void 0?x.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return n===null&&(n=new Zl(i)),x=m?n.fromEquirectangular(u,x):n.fromCubemap(u,x),x.texture.pmremVersion=u.pmremVersion,e.set(u,x),x.texture;if(x!==void 0)return x.texture;{let P=u.image;return m&&P&&P.height>0||M&&P&&l(P)?(n===null&&(n=new Zl(i)),x=m?n.fromEquirectangular(u):n.fromCubemap(u),x.texture.pmremVersion=u.pmremVersion,e.set(u,x),u.addEventListener("dispose",h),x.texture):null}}}return u}function a(u,d){return d===ol?u.mapping=ls:d===al&&(u.mapping=Ns),u}function l(u){let d=0,m=6;for(let M=0;M<m;M++)u[M]!==void 0&&d++;return d===m}function c(u){let d=u.target;d.removeEventListener("dispose",c);let m=t.get(d);m!==void 0&&(t.delete(d),m.dispose())}function h(u){let d=u.target;d.removeEventListener("dispose",h);let m=e.get(d);m!==void 0&&(e.delete(d),m.dispose())}function f(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:f}}function Hx(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&As("WebGLRenderer: "+n+" extension not supported."),s}}}function Gx(i,t,e,n){let s={},r=new WeakMap;function o(f){let u=f.target;u.index!==null&&t.remove(u.index);for(let m in u.attributes)t.remove(u.attributes[m]);u.removeEventListener("dispose",o),delete s[u.id];let d=r.get(u);d&&(t.remove(d),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(f,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,e.memory.geometries++),u}function l(f){let u=f.attributes;for(let d in u)t.update(u[d],i.ARRAY_BUFFER)}function c(f){let u=[],d=f.index,m=f.attributes.position,M=0;if(m===void 0)return;if(d!==null){let P=d.array;M=d.version;for(let U=0,b=P.length;U<b;U+=3){let S=P[U+0],E=P[U+1],I=P[U+2];u.push(S,E,E,I,I,S)}}else{let P=m.array;M=m.version;for(let U=0,b=P.length/3-1;U<b;U+=3){let S=U+0,E=U+1,I=U+2;u.push(S,E,E,I,I,S)}}let x=new(m.count>=65535?ro:so)(u,1);x.version=M;let p=r.get(f);p&&t.remove(p),r.set(f,x)}function h(f){let u=r.get(f);if(u){let d=f.index;d!==null&&u.version<d.version&&c(f)}else c(f);return r.get(f)}return{get:a,update:l,getWireframeAttribute:h}}function Wx(i,t,e){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,u){i.drawElements(n,u,r,f*o),e.update(u,n,1)}function c(f,u,d){d!==0&&(i.drawElementsInstanced(n,u,r,f*o,d),e.update(u,n,d))}function h(f,u,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,f,0,d);let M=0;for(let x=0;x<d;x++)M+=u[x];e.update(M,n,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Xx(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:se("WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function qx(i,t,e){let n=new WeakMap,s=new qe;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=h!==void 0?h.length:0,u=n.get(a);if(u===void 0||u.count!==f){let R=function(){I.dispose(),n.delete(a),a.removeEventListener("dispose",R)};u!==void 0&&u.texture.dispose();let d=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,M=a.morphAttributes.color!==void 0,x=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],P=a.morphAttributes.color||[],U=0;d===!0&&(U=1),m===!0&&(U=2),M===!0&&(U=3);let b=a.attributes.position.count*U,S=1;b>t.maxTextureSize&&(S=Math.ceil(b/t.maxTextureSize),b=t.maxTextureSize);let E=new Float32Array(b*S*4*f),I=new no(E,b,S,f);I.type=ci,I.needsUpdate=!0;let v=U*4;for(let L=0;L<f;L++){let F=x[L],N=p[L],W=P[L],B=b*S*4*L;for(let J=0;J<F.count;J++){let ot=J*v;d===!0&&(s.fromBufferAttribute(F,J),E[B+ot+0]=s.x,E[B+ot+1]=s.y,E[B+ot+2]=s.z,E[B+ot+3]=0),m===!0&&(s.fromBufferAttribute(N,J),E[B+ot+4]=s.x,E[B+ot+5]=s.y,E[B+ot+6]=s.z,E[B+ot+7]=0),M===!0&&(s.fromBufferAttribute(W,J),E[B+ot+8]=s.x,E[B+ot+9]=s.y,E[B+ot+10]=s.z,E[B+ot+11]=W.itemSize===4?s.w:1)}}u={count:f,texture:I,size:new Wt(b,S)},n.set(a,u),a.addEventListener("dispose",R)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let d=0;for(let M=0;M<c.length;M++)d+=c[M];let m=a.morphTargetsRelative?1:1-d;l.getUniforms().setValue(i,"morphTargetBaseInfluence",m),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function Yx(i,t,e,n,s){let r=new WeakMap;function o(c){let h=s.render.frame,f=c.geometry,u=t.get(c,f);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let d=c.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return u}function a(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}var $x={[yo]:"LINEAR_TONE_MAPPING",[Mo]:"REINHARD_TONE_MAPPING",[So]:"CINEON_TONE_MAPPING",[Ds]:"ACES_FILMIC_TONE_MAPPING",[wo]:"AGX_TONE_MAPPING",[To]:"NEUTRAL_TONE_MAPPING",[bo]:"CUSTOM_TONE_MAPPING"};function Zx(i,t,e,n,s,r){let o=new $e(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new yn;c.setAttribute("position",new Cn([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Cn([0,2,0,0,2,0],2));let h=new _r({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new Ge(c,h),u=new Rs(-1,1,1,-1,0,1),d=null,m=null,M=!1,x,p=null,P=[],U=!1;this.setSize=function(b,S){o.setSize(b,S),a!==null&&a.setSize(b,S),l!==null&&l.setSize(b,S);for(let E=0;E<P.length;E++){let I=P[E];I.setSize&&I.setSize(b,S)}},this.setEffects=function(b){P=b,U=P.length>0&&P[0].isRenderPass===!0;let S=o.width,E=o.height;P.length>0&&a===null&&(a=new $e(S,E,{type:en,depthBuffer:!1,stencilBuffer:!1}),l=new $e(S,E,{type:en,depthBuffer:!1,stencilBuffer:!1}));for(let I=0;I<P.length;I++){let v=P[I];v.setSize&&v.setSize(S,E)}},this.begin=function(b,S){if(M||b.toneMapping===ai&&P.length===0)return!1;if(p=S,S!==null){let E=S.width,I=S.height;(o.width!==E||o.height!==I)&&this.setSize(E,I)}return U===!1&&b.setRenderTarget(o),x=b.toneMapping,b.toneMapping=ai,!0},this.hasRenderPass=function(){return U},this.end=function(b,S){b.toneMapping=x,M=!0;let E=o,I=a;for(let v=0;v<P.length;v++){let R=P[v];R.enabled!==!1&&(R.render(b,I,E,S),R.needsSwap!==!1&&(E=I,I=I===a?l:a))}if(d!==b.outputColorSpace||m!==b.toneMapping){d=b.outputColorSpace,m=b.toneMapping,h.defines={},ge.getTransfer(d)===Ee&&(h.defines.SRGB_TRANSFER="");let v=$x[m];v&&(h.defines[v]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=E.texture,b.setRenderTarget(p),b.render(f,u),p=null,M=!1},this.isCompositing=function(){return M},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var gd=new vn,Oh=new is(1,1),xd=new no,_d=new Va,vd=new co,Jf=[],jf=[],Qf=new Float32Array(16),td=new Float32Array(9),ed=new Float32Array(4);function Pr(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=Jf[s];if(r===void 0&&(r=new Float32Array(s),Jf[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function nn(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function sn(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Ql(i,t){let e=jf[t];e===void 0&&(e=new Int32Array(t),jf[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Kx(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Jx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(nn(e,t))return;i.uniform2fv(this.addr,t),sn(e,t)}}function jx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(nn(e,t))return;i.uniform3fv(this.addr,t),sn(e,t)}}function Qx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(nn(e,t))return;i.uniform4fv(this.addr,t),sn(e,t)}}function t_(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(nn(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),sn(e,t)}else{if(nn(e,n))return;ed.set(n),i.uniformMatrix2fv(this.addr,!1,ed),sn(e,n)}}function e_(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(nn(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),sn(e,t)}else{if(nn(e,n))return;td.set(n),i.uniformMatrix3fv(this.addr,!1,td),sn(e,n)}}function n_(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(nn(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),sn(e,t)}else{if(nn(e,n))return;Qf.set(n),i.uniformMatrix4fv(this.addr,!1,Qf),sn(e,n)}}function i_(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function s_(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(nn(e,t))return;i.uniform2iv(this.addr,t),sn(e,t)}}function r_(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(nn(e,t))return;i.uniform3iv(this.addr,t),sn(e,t)}}function o_(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(nn(e,t))return;i.uniform4iv(this.addr,t),sn(e,t)}}function a_(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function l_(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(nn(e,t))return;i.uniform2uiv(this.addr,t),sn(e,t)}}function c_(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(nn(e,t))return;i.uniform3uiv(this.addr,t),sn(e,t)}}function h_(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(nn(e,t))return;i.uniform4uiv(this.addr,t),sn(e,t)}}function u_(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Oh.compareFunction=e.isReversedDepthBuffer()?ql:Xl,r=Oh):r=gd,e.setTexture2D(t||r,s)}function f_(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||_d,s)}function d_(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||vd,s)}function p_(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||xd,s)}function m_(i){switch(i){case 5126:return Kx;case 35664:return Jx;case 35665:return jx;case 35666:return Qx;case 35674:return t_;case 35675:return e_;case 35676:return n_;case 5124:case 35670:return i_;case 35667:case 35671:return s_;case 35668:case 35672:return r_;case 35669:case 35673:return o_;case 5125:return a_;case 36294:return l_;case 36295:return c_;case 36296:return h_;case 35678:case 36198:case 36298:case 36306:case 35682:return u_;case 35679:case 36299:case 36307:return f_;case 35680:case 36300:case 36308:case 36293:return d_;case 36289:case 36303:case 36311:case 36292:return p_}}function g_(i,t){i.uniform1fv(this.addr,t)}function x_(i,t){let e=Pr(t,this.size,2);i.uniform2fv(this.addr,e)}function __(i,t){let e=Pr(t,this.size,3);i.uniform3fv(this.addr,e)}function v_(i,t){let e=Pr(t,this.size,4);i.uniform4fv(this.addr,e)}function y_(i,t){let e=Pr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function M_(i,t){let e=Pr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function S_(i,t){let e=Pr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function b_(i,t){i.uniform1iv(this.addr,t)}function w_(i,t){i.uniform2iv(this.addr,t)}function T_(i,t){i.uniform3iv(this.addr,t)}function A_(i,t){i.uniform4iv(this.addr,t)}function E_(i,t){i.uniform1uiv(this.addr,t)}function C_(i,t){i.uniform2uiv(this.addr,t)}function R_(i,t){i.uniform3uiv(this.addr,t)}function P_(i,t){i.uniform4uiv(this.addr,t)}function I_(i,t,e){let n=this.cache,s=t.length,r=Ql(e,s);nn(n,r)||(i.uniform1iv(this.addr,r),sn(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=Oh:o=gd;for(let a=0;a!==s;++a)e.setTexture2D(t[a]||o,r[a])}function L_(i,t,e){let n=this.cache,s=t.length,r=Ql(e,s);nn(n,r)||(i.uniform1iv(this.addr,r),sn(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||_d,r[o])}function D_(i,t,e){let n=this.cache,s=t.length,r=Ql(e,s);nn(n,r)||(i.uniform1iv(this.addr,r),sn(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||vd,r[o])}function N_(i,t,e){let n=this.cache,s=t.length,r=Ql(e,s);nn(n,r)||(i.uniform1iv(this.addr,r),sn(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||xd,r[o])}function F_(i){switch(i){case 5126:return g_;case 35664:return x_;case 35665:return __;case 35666:return v_;case 35674:return y_;case 35675:return M_;case 35676:return S_;case 5124:case 35670:return b_;case 35667:case 35671:return w_;case 35668:case 35672:return T_;case 35669:case 35673:return A_;case 5125:return E_;case 36294:return C_;case 36295:return R_;case 36296:return P_;case 35678:case 36198:case 36298:case 36306:case 35682:return I_;case 35679:case 36299:case 36307:return L_;case 35680:case 36300:case 36308:case 36293:return D_;case 36289:case 36303:case 36311:case 36292:return N_}}var Bh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=m_(e.type)}},kh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=F_(e.type)}},zh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},Fh=/(\w+)(\])?(\[|\.)?/g;function nd(i,t){i.seq.push(t),i.map[t.id]=t}function U_(i,t,e){let n=i.name,s=n.length;for(Fh.lastIndex=0;;){let r=Fh.exec(n),o=Fh.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){nd(e,c===void 0?new Bh(a,i,t):new kh(a,i,t));break}else{let f=e.map[a];f===void 0&&(f=new zh(a),nd(e,f)),e=f}}}var Rr=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);U_(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function id(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var O_=37297,B_=0;function k_(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var sd=new oe;function z_(i){ge._getMatrix(sd,ge.workingColorSpace,i);let t=`mat3( ${sd.elements.map(e=>e.toFixed(4))} )`;switch(ge.getTransfer(i)){case to:return[t,"LinearTransferOETF"];case Ee:return[t,"sRGBTransferOETF"];default:return ie("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function rd(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+k_(i.getShaderSource(t),a)}else return r}function V_(i,t){let e=z_(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var H_={[yo]:"Linear",[Mo]:"Reinhard",[So]:"Cineon",[Ds]:"ACESFilmic",[wo]:"AgX",[To]:"Neutral",[bo]:"Custom"};function G_(i,t){let e=H_[t];return e===void 0?(ie("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var $l=new G;function W_(){ge.getLuminanceCoefficients($l);let i=$l.x.toFixed(4),t=$l.y.toFixed(4),e=$l.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function X_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Uo).join(`
`)}function q_(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Y_(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Uo(i){return i!==""}function od(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function ad(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var $_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Vh(i){return i.replace($_,K_)}var Z_=new Map;function K_(i,t){let e=de[t];if(e===void 0){let n=Z_.get(t);if(n!==void 0)e=de[n],ie('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Vh(e)}var J_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ld(i){return i.replace(J_,j_)}function j_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function cd(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var Q_={[vo]:"SHADOWMAP_TYPE_PCF",[yr]:"SHADOWMAP_TYPE_VSM"};function tv(i){return Q_[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var ev={[ls]:"ENVMAP_TYPE_CUBE",[Ns]:"ENVMAP_TYPE_CUBE",[Ao]:"ENVMAP_TYPE_CUBE_UV"};function nv(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":ev[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var iv={[Ns]:"ENVMAP_MODE_REFRACTION"};function sv(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":iv[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var rv={[ah]:"ENVMAP_BLENDING_MULTIPLY",[Ef]:"ENVMAP_BLENDING_MIX",[Cf]:"ENVMAP_BLENDING_ADD"};function ov(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":rv[i.combine]||"ENVMAP_BLENDING_NONE"}function av(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function lv(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=tv(e),c=nv(e),h=sv(e),f=ov(e),u=av(e),d=X_(e),m=q_(r),M=s.createProgram(),x,p,P=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(x=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Uo).join(`
`),x.length>0&&(x+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Uo).join(`
`),p.length>0&&(p+=`
`)):(x=[cd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Uo).join(`
`),p=[cd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ai?"#define TONE_MAPPING":"",e.toneMapping!==ai?de.tonemapping_pars_fragment:"",e.toneMapping!==ai?G_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",de.colorspace_pars_fragment,V_("linearToOutputTexel",e.outputColorSpace),W_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Uo).join(`
`)),o=Vh(o),o=od(o,e),o=ad(o,e),a=Vh(a),a=od(a,e),a=ad(a,e),o=ld(o),a=ld(a),e.isRawShaderMaterial!==!0&&(P=`#version 300 es
`,x=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,p=["#define varying in",e.glslVersion===_h?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===_h?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let U=P+x+o,b=P+p+a,S=id(s,s.VERTEX_SHADER,U),E=id(s,s.FRAGMENT_SHADER,b);s.attachShader(M,S),s.attachShader(M,E),e.index0AttributeName!==void 0?s.bindAttribLocation(M,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function I(F){if(i.debug.checkShaderErrors){let N=s.getProgramInfoLog(M)||"",W=s.getShaderInfoLog(S)||"",B=s.getShaderInfoLog(E)||"",J=N.trim(),ot=W.trim(),lt=B.trim(),vt=!0,at=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(vt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,M,S,E);else{let gt=rd(s,S,"vertex"),yt=rd(s,E,"fragment");se("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+F.name+`
Material Type: `+F.type+`

Program Info Log: `+J+`
`+gt+`
`+yt)}else J!==""?ie("WebGLProgram: Program Info Log:",J):(ot===""||lt==="")&&(at=!1);at&&(F.diagnostics={runnable:vt,programLog:J,vertexShader:{log:ot,prefix:x},fragmentShader:{log:lt,prefix:p}})}s.deleteShader(S),s.deleteShader(E),v=new Rr(s,M),R=Y_(s,M)}let v;this.getUniforms=function(){return v===void 0&&I(this),v};let R;this.getAttributes=function(){return R===void 0&&I(this),R};let L=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return L===!1&&(L=s.getProgramParameter(M,O_)),L},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=B_++,this.cacheKey=t,this.usedTimes=1,this.program=M,this.vertexShader=S,this.fragmentShader=E,this}var cv=0,Hh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Gh(t),e.set(t,n)),n}},Gh=class{constructor(t){this.id=cv++,this.code=t,this.usedTimes=0}};function hv(i){return i===us||i===Lo||i===Do}function uv(i,t,e,n,s,r){let o=new mr,a=new Hh,l=new Set,c=[],h=new Map,f=n.logarithmicDepthBuffer,u=n.precision,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(v){return l.add(v),v===0?"uv":`uv${v}`}function M(v,R,L,F,N,W){let B=F.fog,J=N.geometry,ot=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?F.environment:null,lt=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,vt=t.get(v.envMap||ot,lt),at=vt&&vt.mapping===Ao?vt.image.height:null,gt=d[v.type];v.precision!==null&&(u=n.getMaxPrecision(v.precision),u!==v.precision&&ie("WebGLProgram.getParameters:",v.precision,"not supported, using",u,"instead."));let yt=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,Xt=yt!==void 0?yt.length:0,Gt=0;J.morphAttributes.position!==void 0&&(Gt=1),J.morphAttributes.normal!==void 0&&(Gt=2),J.morphAttributes.color!==void 0&&(Gt=3);let Ce,pe,Me,ct;if(gt){let Ae=wi[gt];Ce=Ae.vertexShader,pe=Ae.fragmentShader}else{Ce=v.vertexShader,pe=v.fragmentShader;let Ae=a.getVertexShaderStage(v),ve=a.getFragmentShaderStage(v);a.update(v,Ae,ve),Me=Ae.id,ct=ve.id}let X=i.getRenderTarget(),wt=i.state.buffers.depth.getReversed(),Pt=N.isInstancedMesh===!0,xt=N.isBatchedMesh===!0,Ft=!!v.map,jt=!!v.matcap,re=!!vt,ae=!!v.aoMap,Re=!!v.lightMap,Qt=!!v.bumpMap&&v.wireframe===!1,Te=!!v.normalMap,_e=!!v.displacementMap,Ze=!!v.emissiveMap,ce=!!v.metalnessMap,De=!!v.roughnessMap,O=v.anisotropy>0,bt=v.clearcoat>0,At=v.dispersion>0,A=v.retroreflectivity>0,g=v.iridescence>0,H=v.sheen>0,V=v.transmission>0,q=O&&!!v.anisotropyMap,St=bt&&!!v.clearcoatMap,_t=bt&&!!v.clearcoatNormalMap,K=bt&&!!v.clearcoatRoughnessMap,it=g&&!!v.iridescenceMap,D=g&&!!v.iridescenceThicknessMap,ut=H&&!!v.sheenColorMap,Tt=H&&!!v.sheenRoughnessMap,nt=!!v.specularMap,qt=!!v.specularColorMap,$t=!!v.specularIntensityMap,te=V&&!!v.transmissionMap,z=V&&!!v.thicknessMap,Ct=!!v.gradientMap,dt=!!v.alphaMap,Rt=v.alphaTest>0,pt=!!v.alphaHash,Mt=!!v.extensions,Yt=ai;v.toneMapped&&(X===null||X.isXRRenderTarget===!0)&&(Yt=i.toneMapping);let Lt={shaderID:gt,shaderType:v.type,shaderName:v.name,vertexShader:Ce,fragmentShader:pe,defines:v.defines,customVertexShaderID:Me,customFragmentShaderID:ct,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:u,batching:xt,batchingColor:xt&&N._colorsTexture!==null,instancing:Pt,instancingColor:Pt&&N.instanceColor!==null,instancingMorph:Pt&&N.morphTexture!==null,outputColorSpace:X===null?i.outputColorSpace:X.isXRRenderTarget===!0?X.texture.colorSpace:ge.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:Ft,matcap:jt,envMap:re,envMapMode:re&&vt.mapping,envMapCubeUVHeight:at,aoMap:ae,lightMap:Re,bumpMap:Qt,normalMap:Te,displacementMap:_e,emissiveMap:Ze,normalMapObjectSpace:Te&&v.normalMapType===If,normalMapTangentSpace:Te&&v.normalMapType===gh,packedNormalMap:Te&&v.normalMapType===gh&&hv(v.normalMap.format),metalnessMap:ce,roughnessMap:De,anisotropy:O,anisotropyMap:q,clearcoat:bt,clearcoatMap:St,clearcoatNormalMap:_t,clearcoatRoughnessMap:K,dispersion:At,retroreflection:A,iridescence:g,iridescenceMap:it,iridescenceThicknessMap:D,sheen:H,sheenColorMap:ut,sheenRoughnessMap:Tt,specularMap:nt,specularColorMap:qt,specularIntensityMap:$t,transmission:V,transmissionMap:te,thicknessMap:z,gradientMap:Ct,opaque:v.transparent===!1&&v.blending===Mr&&v.alphaToCoverage===!1,alphaMap:dt,alphaTest:Rt,alphaHash:pt,combine:v.combine,mapUv:Ft&&m(v.map.channel),aoMapUv:ae&&m(v.aoMap.channel),lightMapUv:Re&&m(v.lightMap.channel),bumpMapUv:Qt&&m(v.bumpMap.channel),normalMapUv:Te&&m(v.normalMap.channel),displacementMapUv:_e&&m(v.displacementMap.channel),emissiveMapUv:Ze&&m(v.emissiveMap.channel),metalnessMapUv:ce&&m(v.metalnessMap.channel),roughnessMapUv:De&&m(v.roughnessMap.channel),anisotropyMapUv:q&&m(v.anisotropyMap.channel),clearcoatMapUv:St&&m(v.clearcoatMap.channel),clearcoatNormalMapUv:_t&&m(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:K&&m(v.clearcoatRoughnessMap.channel),iridescenceMapUv:it&&m(v.iridescenceMap.channel),iridescenceThicknessMapUv:D&&m(v.iridescenceThicknessMap.channel),sheenColorMapUv:ut&&m(v.sheenColorMap.channel),sheenRoughnessMapUv:Tt&&m(v.sheenRoughnessMap.channel),specularMapUv:nt&&m(v.specularMap.channel),specularColorMapUv:qt&&m(v.specularColorMap.channel),specularIntensityMapUv:$t&&m(v.specularIntensityMap.channel),transmissionMapUv:te&&m(v.transmissionMap.channel),thicknessMapUv:z&&m(v.thicknessMap.channel),alphaMapUv:dt&&m(v.alphaMap.channel),vertexTangents:!!J.attributes.tangent&&(Te||O),vertexNormals:!!J.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!J.attributes.uv&&(Ft||dt),fog:!!B,useFog:v.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||J.attributes.normal===void 0&&Te===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:wt,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:J.attributes.position!==void 0,morphTargets:J.morphAttributes.position!==void 0,morphNormals:J.morphAttributes.normal!==void 0,morphColors:J.morphAttributes.color!==void 0,morphTargetsCount:Xt,morphTextureStride:Gt,numSunLights:R.sun.length,numDirLights:R.directional.length,numPointLights:R.point.length,numSpotLights:R.spot.length,numSpotLightMaps:R.spotLightMap.length,numRectAreaLights:R.rectArea.length,numHemiLights:R.hemi.length,numSunLightShadows:R.sunShadowMap.length,numDirLightShadows:R.directionalShadowMap.length,numPointLightShadows:R.pointShadowMap.length,numSpotLightShadows:R.spotShadowMap.length,numSpotLightShadowsWithMaps:R.numSpotLightShadowsWithMaps,numLightProbes:R.numLightProbes,numLightProbeGrids:W.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&L.length>0,shadowMapType:i.shadowMap.type,toneMapping:Yt,decodeVideoTexture:Ft&&v.map.isVideoTexture===!0&&ge.getTransfer(v.map.colorSpace)===Ee,decodeVideoTextureEmissive:Ze&&v.emissiveMap.isVideoTexture===!0&&ge.getTransfer(v.emissiveMap.colorSpace)===Ee,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Mi,flipSided:v.side===Rn,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:Mt&&v.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Mt&&v.extensions.multiDraw===!0||xt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Lt.vertexUv1s=l.has(1),Lt.vertexUv2s=l.has(2),Lt.vertexUv3s=l.has(3),l.clear(),Lt}function x(v){let R=[];if(v.shaderID?R.push(v.shaderID):(R.push(v.customVertexShaderID),R.push(v.customFragmentShaderID)),v.defines!==void 0)for(let L in v.defines)R.push(L),R.push(v.defines[L]);return v.isRawShaderMaterial===!1&&(p(R,v),P(R,v),R.push(i.outputColorSpace)),R.push(v.customProgramCacheKey),R.join()}function p(v,R){v.push(R.precision),v.push(R.outputColorSpace),v.push(R.envMapMode),v.push(R.envMapCubeUVHeight),v.push(R.mapUv),v.push(R.alphaMapUv),v.push(R.lightMapUv),v.push(R.aoMapUv),v.push(R.bumpMapUv),v.push(R.normalMapUv),v.push(R.displacementMapUv),v.push(R.emissiveMapUv),v.push(R.metalnessMapUv),v.push(R.roughnessMapUv),v.push(R.anisotropyMapUv),v.push(R.clearcoatMapUv),v.push(R.clearcoatNormalMapUv),v.push(R.clearcoatRoughnessMapUv),v.push(R.iridescenceMapUv),v.push(R.iridescenceThicknessMapUv),v.push(R.sheenColorMapUv),v.push(R.sheenRoughnessMapUv),v.push(R.specularMapUv),v.push(R.specularColorMapUv),v.push(R.specularIntensityMapUv),v.push(R.transmissionMapUv),v.push(R.thicknessMapUv),v.push(R.combine),v.push(R.fogExp2),v.push(R.sizeAttenuation),v.push(R.morphTargetsCount),v.push(R.morphAttributeCount),v.push(R.numSunLights),v.push(R.numDirLights),v.push(R.numPointLights),v.push(R.numSpotLights),v.push(R.numSpotLightMaps),v.push(R.numHemiLights),v.push(R.numRectAreaLights),v.push(R.numSunLightShadows),v.push(R.numDirLightShadows),v.push(R.numPointLightShadows),v.push(R.numSpotLightShadows),v.push(R.numSpotLightShadowsWithMaps),v.push(R.numLightProbes),v.push(R.shadowMapType),v.push(R.toneMapping),v.push(R.numClippingPlanes),v.push(R.numClipIntersection),v.push(R.depthPacking)}function P(v,R){o.disableAll(),R.instancing&&o.enable(0),R.instancingColor&&o.enable(1),R.instancingMorph&&o.enable(2),R.matcap&&o.enable(3),R.envMap&&o.enable(4),R.normalMapObjectSpace&&o.enable(5),R.normalMapTangentSpace&&o.enable(6),R.clearcoat&&o.enable(7),R.iridescence&&o.enable(8),R.alphaTest&&o.enable(9),R.vertexColors&&o.enable(10),R.vertexAlphas&&o.enable(11),R.vertexUv1s&&o.enable(12),R.vertexUv2s&&o.enable(13),R.vertexUv3s&&o.enable(14),R.vertexTangents&&o.enable(15),R.anisotropy&&o.enable(16),R.alphaHash&&o.enable(17),R.batching&&o.enable(18),R.dispersion&&o.enable(19),R.retroreflection&&o.enable(24),R.batchingColor&&o.enable(20),R.gradientMap&&o.enable(21),R.packedNormalMap&&o.enable(22),R.vertexNormals&&o.enable(23),v.push(o.mask),o.disableAll(),R.fog&&o.enable(0),R.useFog&&o.enable(1),R.flatShading&&o.enable(2),R.logarithmicDepthBuffer&&o.enable(3),R.reversedDepthBuffer&&o.enable(4),R.skinning&&o.enable(5),R.morphTargets&&o.enable(6),R.morphNormals&&o.enable(7),R.morphColors&&o.enable(8),R.premultipliedAlpha&&o.enable(9),R.shadowMapEnabled&&o.enable(10),R.doubleSided&&o.enable(11),R.flipSided&&o.enable(12),R.useDepthPacking&&o.enable(13),R.dithering&&o.enable(14),R.transmission&&o.enable(15),R.sheen&&o.enable(16),R.opaque&&o.enable(17),R.pointsUvs&&o.enable(18),R.decodeVideoTexture&&o.enable(19),R.decodeVideoTextureEmissive&&o.enable(20),R.alphaToCoverage&&o.enable(21),R.numLightProbeGrids>0&&o.enable(22),R.hasPositionAttribute&&o.enable(23),v.push(o.mask)}function U(v){let R=d[v.type],L;if(R){let F=wi[R];L=ki.clone(F.uniforms)}else L=v.uniforms;return L}function b(v,R){let L=h.get(R);return L!==void 0?++L.usedTimes:(L=new lv(i,R,v,s),c.push(L),h.set(R,L)),L}function S(v){if(--v.usedTimes===0){let R=c.indexOf(v);c[R]=c[c.length-1],c.pop(),h.delete(v.cacheKey),v.destroy()}}function E(v){a.remove(v)}function I(){a.dispose()}return{getParameters:M,getProgramCacheKey:x,getUniforms:U,acquireProgram:b,releaseProgram:S,releaseShaderCache:E,programs:c,dispose:I}}function fv(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function dv(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function hd(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function ud(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u){let d=0;return u.isInstancedMesh&&(d+=2),u.isSkinnedMesh&&(d+=1),d}function a(u,d,m,M,x,p){let P=i[t];return P===void 0?(P={id:u.id,object:u,geometry:d,material:m,materialVariant:o(u),groupOrder:M,renderOrder:u.renderOrder,z:x,group:p},i[t]=P):(P.id=u.id,P.object=u,P.geometry=d,P.material=m,P.materialVariant=o(u),P.groupOrder=M,P.renderOrder=u.renderOrder,P.z=x,P.group=p),t++,P}function l(u,d,m,M,x,p,P){P.reversedDepth===!0&&(x=-x);let U=a(u,d,m,M,x,p);m.transmission>0?n.push(U):m.transparent===!0?s.push(U):e.push(U)}function c(u,d,m,M,x,p){let P=a(u,d,m,M,x,p);m.transmission>0?n.unshift(P):m.transparent===!0?s.unshift(P):e.unshift(P)}function h(u,d){e.length>1&&e.sort(u||dv),n.length>1&&n.sort(d||hd),s.length>1&&s.sort(d||hd)}function f(){for(let u=t,d=i.length;u<d;u++){let m=i[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:f,sort:h}}function pv(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new ud,i.set(n,[o])):s>=r.length?(o=new ud,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function mv(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new G,color:new ue};break;case"SpotLight":e={position:new G,direction:new G,color:new ue,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new G,color:new ue,distance:0,decay:0};break;case"HemisphereLight":e={direction:new G,skyColor:new ue,groundColor:new ue};break;case"RectAreaLight":e={color:new ue,position:new G,halfWidth:new G,halfHeight:new G};break}return i[t.id]=e,e}}}function gv(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Wt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var xv=0;function _v(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function vv(i){let t=new mv,e=gv(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new G);let s=new G,r=new Xe,o=new Xe;function a(c){let h=0,f=0,u=0;for(let N=0;N<9;N++)n.probe[N].set(0,0,0);let d=0,m=0,M=0,x=0,p=0,P=0,U=0,b=0,S=0,E=0,I=0,v=0,R=0,L=0;c.sort(_v);for(let N=0,W=c.length;N<W;N++){let B=c[N],J=B.color,ot=B.intensity,lt=B.distance,vt=null;if(B.shadow&&B.shadow.map&&(B.shadow.map.texture.format===us?vt=B.shadow.map.texture:vt=B.shadow.map.depthTexture||B.shadow.map.texture),B.isAmbientLight)h+=J.r*ot,f+=J.g*ot,u+=J.b*ot;else if(B.isLightProbe){for(let at=0;at<9;at++)n.probe[at].addScaledVector(B.sh.coefficients[at],ot);L++}else if(B.isSunLight){let at=t.get(B);if(at.color.copy(B.color).multiplyScalar(B.intensity),B.castShadow){let gt=B.shadow,yt=e.get(B);yt.shadowIntensity=gt.intensity,yt.shadowBias=gt.bias,yt.shadowNormalBias=gt.normalBias,yt.shadowRadius=gt.radius,yt.shadowMapSize.copy(gt.mapSize).multiply(gt.getFrameExtents()),n.sunShadow[m]=yt,n.sunShadowMap[m]=vt;let Xt=gt.getViewportCount();for(let Gt=0;Gt<Xt;Gt++)n.sunShadowMatrix[M+Gt]=gt.getMatrix(Gt),n.sunShadowCascade[M+Gt]=gt._cascadeData[Gt];M+=Xt,m++}n.sun[d]=at,d++}else if(B.isDirectionalLight){let at=t.get(B);if(at.color.copy(B.color).multiplyScalar(B.intensity),B.castShadow){let gt=B.shadow,yt=e.get(B);yt.shadowIntensity=gt.intensity,yt.shadowBias=gt.bias,yt.shadowNormalBias=gt.normalBias,yt.shadowRadius=gt.radius,yt.shadowMapSize=gt.mapSize,n.directionalShadow[x]=yt,n.directionalShadowMap[x]=vt,n.directionalShadowMatrix[x]=B.shadow.matrix,S++}n.directional[x]=at,x++}else if(B.isSpotLight){let at=t.get(B);at.position.setFromMatrixPosition(B.matrixWorld),at.color.copy(J).multiplyScalar(ot),at.distance=lt,at.coneCos=Math.cos(B.angle),at.penumbraCos=Math.cos(B.angle*(1-B.penumbra)),at.decay=B.decay,n.spot[P]=at;let gt=B.shadow;if(B.map&&(n.spotLightMap[v]=B.map,v++,gt.updateMatrices(B),B.castShadow&&R++),n.spotLightMatrix[P]=gt.matrix,B.castShadow){let yt=e.get(B);yt.shadowIntensity=gt.intensity,yt.shadowBias=gt.bias,yt.shadowNormalBias=gt.normalBias,yt.shadowRadius=gt.radius,yt.shadowMapSize=gt.mapSize,n.spotShadow[P]=yt,n.spotShadowMap[P]=vt,I++}P++}else if(B.isRectAreaLight){let at=t.get(B);at.color.copy(J).multiplyScalar(ot),at.halfWidth.set(B.width*.5,0,0),at.halfHeight.set(0,B.height*.5,0),n.rectArea[U]=at,U++}else if(B.isPointLight){let at=t.get(B);if(at.color.copy(B.color).multiplyScalar(B.intensity),at.distance=B.distance,at.decay=B.decay,B.castShadow){let gt=B.shadow,yt=e.get(B);yt.shadowIntensity=gt.intensity,yt.shadowBias=gt.bias,yt.shadowNormalBias=gt.normalBias,yt.shadowRadius=gt.radius,yt.shadowMapSize=gt.mapSize,yt.shadowCameraNear=gt.camera.near,yt.shadowCameraFar=gt.camera.far,n.pointShadow[p]=yt,n.pointShadowMap[p]=vt,n.pointShadowMatrix[p]=B.shadow.matrix,E++}n.point[p]=at,p++}else if(B.isHemisphereLight){let at=t.get(B);at.skyColor.copy(B.color).multiplyScalar(ot),at.groundColor.copy(B.groundColor).multiplyScalar(ot),n.hemi[b]=at,b++}}U>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Dt.LTC_FLOAT_1,n.rectAreaLTC2=Dt.LTC_FLOAT_2):(n.rectAreaLTC1=Dt.LTC_HALF_1,n.rectAreaLTC2=Dt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=u;let F=n.hash;(F.sunLength!==d||F.directionalLength!==x||F.pointLength!==p||F.spotLength!==P||F.rectAreaLength!==U||F.hemiLength!==b||F.numSunShadows!==m||F.numDirectionalShadows!==S||F.numPointShadows!==E||F.numSpotShadows!==I||F.numSpotMaps!==v||F.numLightProbes!==L)&&(n.sun.length=d,n.directional.length=x,n.spot.length=P,n.rectArea.length=U,n.point.length=p,n.hemi.length=b,n.sunShadow.length=m,n.sunShadowMap.length=m,n.sunShadowMatrix.length=M,n.sunShadowCascade.length=M,n.directionalShadow.length=S,n.directionalShadowMap.length=S,n.directionalShadowMatrix.length=S,n.pointShadow.length=E,n.pointShadowMap.length=E,n.pointShadowMatrix.length=E,n.spotShadow.length=I,n.spotShadowMap.length=I,n.spotLightMatrix.length=I+v-R,n.spotLightMap.length=v,n.numSpotLightShadowsWithMaps=R,n.numLightProbes=L,F.sunLength=d,F.directionalLength=x,F.pointLength=p,F.spotLength=P,F.rectAreaLength=U,F.hemiLength=b,F.numSunShadows=m,F.numDirectionalShadows=S,F.numPointShadows=E,F.numSpotShadows=I,F.numSpotMaps=v,F.numLightProbes=L,n.version=xv++)}function l(c,h){let f=0,u=0,d=0,m=0,M=0,x=0,p=h.matrixWorldInverse;for(let P=0,U=c.length;P<U;P++){let b=c[P];if(b.isSunLight){let S=n.sun[f];S.direction.setFromMatrixPosition(b.matrixWorld),S.direction.transformDirection(p),f++}else if(b.isDirectionalLight){let S=n.directional[u];S.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(p),u++}else if(b.isSpotLight){let S=n.spot[m];S.position.setFromMatrixPosition(b.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(p),m++}else if(b.isRectAreaLight){let S=n.rectArea[M];S.position.setFromMatrixPosition(b.matrixWorld),S.position.applyMatrix4(p),o.identity(),r.copy(b.matrixWorld),r.premultiply(p),o.extractRotation(r),S.halfWidth.set(b.width*.5,0,0),S.halfHeight.set(0,b.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),M++}else if(b.isPointLight){let S=n.point[d];S.position.setFromMatrixPosition(b.matrixWorld),S.position.applyMatrix4(p),d++}else if(b.isHemisphereLight){let S=n.hemi[x];S.direction.setFromMatrixPosition(b.matrixWorld),S.direction.transformDirection(p),x++}}}return{setup:a,setupView:l,state:n}}function fd(i){let t=new vv(i),e=[],n=[],s=[];function r(u){f.camera=u,e.length=0,n.length=0,s.length=0}function o(u){e.push(u)}function a(u){n.push(u)}function l(u){s.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}let f={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function yv(i){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new fd(i),t.set(s,[a])):r>=o.length?(a=new fd(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var Mv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Sv=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,bv=[new G(1,0,0),new G(-1,0,0),new G(0,1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1)],wv=[new G(0,-1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1),new G(0,-1,0),new G(0,-1,0)],dd=new Xe,Fo=new G,Uh=new G;function Tv(i,t,e){let n=new ao,s=new Wt,r=new Wt,o=new qe,a=new Wa,l=new Xa,c={},h=e.maxTextureSize,f={[as]:Rn,[Rn]:as,[Mi]:Mi},u=new We({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Wt},radius:{value:4}},vertexShader:Mv,fragmentShader:Sv}),d=u.clone();d.defines.HORIZONTAL_PASS=1;let m=new yn;m.setAttribute("position",new un(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let M=new Ge(m,u),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=vo;let p=this.type;this.render=function(E,I,v){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||E.length===0)return;this.type===uf&&(ie("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=vo);let R=i.getRenderTarget(),L=i.getActiveCubeFace(),F=i.getActiveMipmapLevel(),N=i.state;N.setBlending($n),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);let W=p!==this.type;W&&I.traverse(function(B){B.material&&(Array.isArray(B.material)?B.material.forEach(J=>J.needsUpdate=!0):B.material.needsUpdate=!0)});for(let B=0,J=E.length;B<J;B++){let ot=E[B],lt=ot.shadow;if(lt===void 0){ie("WebGLShadowMap:",ot,"has no shadow.");continue}if(lt.autoUpdate===!1&&lt.needsUpdate===!1)continue;s.copy(lt.mapSize);let vt=lt.getFrameExtents();s.multiply(vt),r.copy(lt.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/vt.x),s.x=r.x*vt.x,lt.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/vt.y),s.y=r.y*vt.y,lt.mapSize.y=r.y));let at=i.state.buffers.depth.getReversed();if(lt.camera._reversedDepth=at,lt.map===null||W===!0){if(lt.map!==null&&(lt.map.depthTexture!==null&&(lt.map.depthTexture.dispose(),lt.map.depthTexture=null),lt.map.dispose()),this.type===yr){if(ot.isPointLight){ie("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}lt.map=new $e(s.x,s.y,{format:us,type:en,minFilter:Ye,magFilter:Ye,generateMipmaps:!1}),lt.map.texture.name=ot.name+".shadowMap",lt.map.depthTexture=new is(s.x,s.y,ci),lt.map.depthTexture.name=ot.name+".shadowMapDepth",lt.map.depthTexture.format=vi,lt.map.depthTexture.compareFunction=null,lt.map.depthTexture.minFilter=fn,lt.map.depthTexture.magFilter=fn}else ot.isPointLight?(lt.map=new Kl(s.x),lt.map.depthTexture=new Ga(s.x,li)):(lt.map=new $e(s.x,s.y),lt.map.depthTexture=new is(s.x,s.y,li)),lt.map.depthTexture.name=ot.name+".shadowMap",lt.map.depthTexture.format=vi,this.type===vo?(lt.map.depthTexture.compareFunction=at?ql:Xl,lt.map.depthTexture.minFilter=Ye,lt.map.depthTexture.magFilter=Ye):(lt.map.depthTexture.compareFunction=null,lt.map.depthTexture.minFilter=fn,lt.map.depthTexture.magFilter=fn);lt.camera.updateProjectionMatrix()}lt.map.isWebGLCubeRenderTarget!==!0&&(lt.map.width!==s.x||lt.map.height!==s.y)&&lt.map.setSize(s.x,s.y);let gt=lt.map.isWebGLCubeRenderTarget?6:lt.getViewportCount();ot.isPointLight!==!0&&lt.updateMatrices(ot,v);for(let yt=0;yt<gt;yt++){let Xt=lt.getCamera(yt);if(ot.isPointLight){let Gt=lt.camera,Ce=lt.matrix,pe=ot.distance||Gt.far;pe!==Gt.far&&(Gt.far=pe,Gt.updateProjectionMatrix()),Fo.setFromMatrixPosition(ot.matrixWorld),Gt.position.copy(Fo),Uh.copy(Gt.position),Uh.add(bv[yt]),Gt.up.copy(wv[yt]),Gt.lookAt(Uh),Gt.updateMatrixWorld(),Ce.makeTranslation(-Fo.x,-Fo.y,-Fo.z),dd.multiplyMatrices(Gt.projectionMatrix,Gt.matrixWorldInverse),lt._frustum.setFromProjectionMatrix(dd,Gt.coordinateSystem,Gt.reversedDepth)}if(lt.map.isWebGLCubeRenderTarget)i.setRenderTarget(lt.map,yt),i.clear();else{yt===0&&(i.setRenderTarget(lt.map),i.clear());let Gt=lt.getViewport(yt);o.set(r.x*Gt.x,r.y*Gt.y,r.x*Gt.z,r.y*Gt.w),N.viewport(o)}n=lt.getFrustum(yt),b(I,v,Xt,ot,this.type)}lt.isPointLightShadow!==!0&&this.type===yr&&P(lt,v),lt.needsUpdate=!1}p=this.type,x.needsUpdate=!1,i.setRenderTarget(R,L,F)};function P(E,I){let v=t.update(M);u.defines.VSM_SAMPLES!==E.blurSamples&&(u.defines.VSM_SAMPLES=E.blurSamples,d.defines.VSM_SAMPLES=E.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),E.mapPass===null?E.mapPass=new $e(s.x,s.y,{format:us,type:en}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),u.uniforms.shadow_pass.value=E.map.depthTexture,u.uniforms.resolution.value.set(E.map.width,E.map.height),u.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(I,null,v,u,M,null),d.uniforms.shadow_pass.value=E.mapPass.texture,d.uniforms.resolution.value.set(E.map.width,E.map.height),d.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(I,null,v,d,M,null)}function U(E,I,v,R){let L=null,F=v.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(F!==void 0)L=F;else if(L=v.isPointLight===!0?l:a,i.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0||I.alphaToCoverage===!0){let N=L.uuid,W=I.uuid,B=c[N];B===void 0&&(B={},c[N]=B);let J=B[W];J===void 0&&(J=L.clone(),B[W]=J,I.addEventListener("dispose",S)),L=J}if(L.visible=I.visible,L.wireframe=I.wireframe,R===yr?L.side=I.shadowSide!==null?I.shadowSide:I.side:L.side=I.shadowSide!==null?I.shadowSide:f[I.side],L.alphaMap=I.alphaMap,L.alphaTest=I.alphaToCoverage===!0?.5:I.alphaTest,L.map=I.map,L.clipShadows=I.clipShadows,L.clippingPlanes=I.clippingPlanes,L.clipIntersection=I.clipIntersection,L.displacementMap=I.displacementMap,L.displacementScale=I.displacementScale,L.displacementBias=I.displacementBias,L.wireframeLinewidth=I.wireframeLinewidth,L.linewidth=I.linewidth,v.isPointLight===!0&&L.isMeshDistanceMaterial===!0){let N=i.properties.get(L);N.light=v}return L}function b(E,I,v,R,L){if(E.visible===!1)return;if(E.layers.test(I.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&L===yr)&&(!E.frustumCulled||E.intersectsFrustum(n))){E.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,E.matrixWorld);let W=t.update(E),B=E.material;if(Array.isArray(B)){let J=W.groups;for(let ot=0,lt=J.length;ot<lt;ot++){let vt=J[ot],at=B[vt.materialIndex];if(at&&at.visible){let gt=U(E,at,R,L);E.onBeforeShadow(i,E,I,v,W,gt,vt),i.renderBufferDirect(v,null,W,gt,E,vt),E.onAfterShadow(i,E,I,v,W,gt,vt)}}}else if(B.visible){let J=U(E,B,R,L);E.onBeforeShadow(i,E,I,v,W,J,null),i.renderBufferDirect(v,null,W,J,E,null),E.onAfterShadow(i,E,I,v,W,J,null)}}let N=E.children;for(let W=0,B=N.length;W<B;W++)b(N[W],I,v,R,L)}function S(E){E.target.removeEventListener("dispose",S);for(let v in c){let R=c[v],L=E.target.uuid;L in R&&(R[L].dispose(),delete R[L])}}}function Av(i,t){function e(){let z=!1,Ct=new qe,dt=null,Rt=new qe(0,0,0,0);return{setMask:function(pt){dt!==pt&&!z&&(i.colorMask(pt,pt,pt,pt),dt=pt)},setLocked:function(pt){z=pt},setClear:function(pt,Mt,Yt,Lt,Ae){Ae===!0&&(pt*=Lt,Mt*=Lt,Yt*=Lt),Ct.set(pt,Mt,Yt,Lt),Rt.equals(Ct)===!1&&(i.clearColor(pt,Mt,Yt,Lt),Rt.copy(Ct))},reset:function(){z=!1,dt=null,Rt.set(-1,0,0,0)}}}function n(){let z=!1,Ct=!1,dt=null,Rt=null,pt=null;return{setReversed:function(Mt){if(Ct!==Mt){let Yt=t.get("EXT_clip_control");Mt?Yt.clipControlEXT(Yt.LOWER_LEFT_EXT,Yt.ZERO_TO_ONE_EXT):Yt.clipControlEXT(Yt.LOWER_LEFT_EXT,Yt.NEGATIVE_ONE_TO_ONE_EXT),Ct=Mt;let Lt=pt;pt=null,this.setClear(Lt)}},getReversed:function(){return Ct},setTest:function(Mt){Mt?X(i.DEPTH_TEST):wt(i.DEPTH_TEST)},setMask:function(Mt){dt!==Mt&&!z&&(i.depthMask(Mt),dt=Mt)},setFunc:function(Mt){if(Ct&&(Mt=Gf[Mt]),Rt!==Mt){switch(Mt){case Ra:i.depthFunc(i.NEVER);break;case Pa:i.depthFunc(i.ALWAYS);break;case Ia:i.depthFunc(i.LESS);break;case hr:i.depthFunc(i.LEQUAL);break;case La:i.depthFunc(i.EQUAL);break;case Da:i.depthFunc(i.GEQUAL);break;case Na:i.depthFunc(i.GREATER);break;case Fa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Rt=Mt}},setLocked:function(Mt){z=Mt},setClear:function(Mt){pt!==Mt&&(pt=Mt,Ct&&(Mt=1-Mt),i.clearDepth(Mt))},reset:function(){z=!1,dt=null,Rt=null,pt=null,Ct=!1}}}function s(){let z=!1,Ct=null,dt=null,Rt=null,pt=null,Mt=null,Yt=null,Lt=null,Ae=null;return{setTest:function(ve){z||(ve?X(i.STENCIL_TEST):wt(i.STENCIL_TEST))},setMask:function(ve){Ct!==ve&&!z&&(i.stencilMask(ve),Ct=ve)},setFunc:function(ve,an,Nn){(dt!==ve||Rt!==an||pt!==Nn)&&(i.stencilFunc(ve,an,Nn),dt=ve,Rt=an,pt=Nn)},setOp:function(ve,an,Nn){(Mt!==ve||Yt!==an||Lt!==Nn)&&(i.stencilOp(ve,an,Nn),Mt=ve,Yt=an,Lt=Nn)},setLocked:function(ve){z=ve},setClear:function(ve){Ae!==ve&&(i.clearStencil(ve),Ae=ve)},reset:function(){z=!1,Ct=null,dt=null,Rt=null,pt=null,Mt=null,Yt=null,Lt=null,Ae=null}}}let r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},f={},u={},d=new WeakMap,m=[],M=null,x=!1,p=null,P=null,U=null,b=null,S=null,E=null,I=null,v=new ue(0,0,0),R=0,L=!1,F=null,N=null,W=null,B=null,J=null,ot=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),lt=!1,vt=0,at=i.getParameter(i.VERSION);at.indexOf("WebGL")!==-1?(vt=parseFloat(/^WebGL (\d)/.exec(at)[1]),lt=vt>=1):at.indexOf("OpenGL ES")!==-1&&(vt=parseFloat(/^OpenGL ES (\d)/.exec(at)[1]),lt=vt>=2);let gt=null,yt={},Xt=i.getParameter(i.SCISSOR_BOX),Gt=i.getParameter(i.VIEWPORT),Ce=new qe().fromArray(Xt),pe=new qe().fromArray(Gt);function Me(z,Ct,dt,Rt){let pt=new Uint8Array(4),Mt=i.createTexture();i.bindTexture(z,Mt),i.texParameteri(z,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(z,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Yt=0;Yt<dt;Yt++)z===i.TEXTURE_3D||z===i.TEXTURE_2D_ARRAY?i.texImage3D(Ct,0,i.RGBA,1,1,Rt,0,i.RGBA,i.UNSIGNED_BYTE,pt):i.texImage2D(Ct+Yt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,pt);return Mt}let ct={};ct[i.TEXTURE_2D]=Me(i.TEXTURE_2D,i.TEXTURE_2D,1),ct[i.TEXTURE_CUBE_MAP]=Me(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ct[i.TEXTURE_2D_ARRAY]=Me(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ct[i.TEXTURE_3D]=Me(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),X(i.DEPTH_TEST),o.setFunc(hr),Qt(!1),Te(ih),X(i.CULL_FACE),ae($n);function X(z){h[z]!==!0&&(i.enable(z),h[z]=!0)}function wt(z){h[z]!==!1&&(i.disable(z),h[z]=!1)}function Pt(z,Ct){return u[z]!==Ct?(i.bindFramebuffer(z,Ct),u[z]=Ct,z===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=Ct),z===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=Ct),!0):!1}function xt(z,Ct){let dt=m,Rt=!1;if(z){dt=d.get(Ct),dt===void 0&&(dt=[],d.set(Ct,dt));let pt=z.textures;if(dt.length!==pt.length||dt[0]!==i.COLOR_ATTACHMENT0){for(let Mt=0,Yt=pt.length;Mt<Yt;Mt++)dt[Mt]=i.COLOR_ATTACHMENT0+Mt;dt.length=pt.length,Rt=!0}}else dt[0]!==i.BACK&&(dt[0]=i.BACK,Rt=!0);Rt&&i.drawBuffers(dt)}function Ft(z){return M!==z?(i.useProgram(z),M=z,!0):!1}let jt={[Si]:i.FUNC_ADD,[ff]:i.FUNC_SUBTRACT,[df]:i.FUNC_REVERSE_SUBTRACT};jt[pf]=i.MIN,jt[rl]=i.MAX;let re={[mf]:i.ZERO,[Ls]:i.ONE,[gf]:i.SRC_COLOR,[oh]:i.SRC_ALPHA,[Sf]:i.SRC_ALPHA_SATURATE,[yf]:i.DST_COLOR,[_f]:i.DST_ALPHA,[xf]:i.ONE_MINUS_SRC_COLOR,[br]:i.ONE_MINUS_SRC_ALPHA,[Mf]:i.ONE_MINUS_DST_COLOR,[vf]:i.ONE_MINUS_DST_ALPHA,[bf]:i.CONSTANT_COLOR,[wf]:i.ONE_MINUS_CONSTANT_COLOR,[Tf]:i.CONSTANT_ALPHA,[Af]:i.ONE_MINUS_CONSTANT_ALPHA};function ae(z,Ct,dt,Rt,pt,Mt,Yt,Lt,Ae,ve){if(z===$n){x===!0&&(wt(i.BLEND),x=!1);return}if(x===!1&&(X(i.BLEND),x=!0),z!==Sr){if(z!==p||ve!==L){if((P!==Si||S!==Si)&&(i.blendEquation(i.FUNC_ADD),P=Si,S=Si),ve)switch(z){case Mr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Is:i.blendFunc(i.ONE,i.ONE);break;case sh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case rh:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:se("WebGLState: Invalid blending: ",z);break}else switch(z){case Mr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Is:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case sh:se("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case rh:se("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:se("WebGLState: Invalid blending: ",z);break}U=null,b=null,E=null,I=null,v.set(0,0,0),R=0,p=z,L=ve}return}pt=pt||Ct,Mt=Mt||dt,Yt=Yt||Rt,(Ct!==P||pt!==S)&&(i.blendEquationSeparate(jt[Ct],jt[pt]),P=Ct,S=pt),(dt!==U||Rt!==b||Mt!==E||Yt!==I)&&(i.blendFuncSeparate(re[dt],re[Rt],re[Mt],re[Yt]),U=dt,b=Rt,E=Mt,I=Yt),(Lt.equals(v)===!1||Ae!==R)&&(i.blendColor(Lt.r,Lt.g,Lt.b,Ae),v.copy(Lt),R=Ae),p=z,L=!1}function Re(z,Ct){z.side===Mi?wt(i.CULL_FACE):X(i.CULL_FACE);let dt=z.side===Rn;Ct&&(dt=!dt),Qt(dt),z.blending===Mr&&z.transparent===!1?ae($n):ae(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),o.setFunc(z.depthFunc),o.setTest(z.depthTest),o.setMask(z.depthWrite),r.setMask(z.colorWrite);let Rt=z.stencilWrite;a.setTest(Rt),Rt&&(a.setMask(z.stencilWriteMask),a.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),a.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),Ze(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?X(i.SAMPLE_ALPHA_TO_COVERAGE):wt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Qt(z){F!==z&&(z?i.frontFace(i.CW):i.frontFace(i.CCW),F=z)}function Te(z){z!==cf?(X(i.CULL_FACE),z!==N&&(z===ih?i.cullFace(i.BACK):z===hf?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):wt(i.CULL_FACE),N=z}function _e(z){z!==W&&(lt&&i.lineWidth(z),W=z)}function Ze(z,Ct,dt){z?(X(i.POLYGON_OFFSET_FILL),(B!==Ct||J!==dt)&&(B=Ct,J=dt,o.getReversed()&&(Ct=-Ct),i.polygonOffset(Ct,dt))):wt(i.POLYGON_OFFSET_FILL)}function ce(z){z?X(i.SCISSOR_TEST):wt(i.SCISSOR_TEST)}function De(z){z===void 0&&(z=i.TEXTURE0+ot-1),gt!==z&&(i.activeTexture(z),gt=z)}function O(z,Ct,dt){dt===void 0&&(gt===null?dt=i.TEXTURE0+ot-1:dt=gt);let Rt=yt[dt];Rt===void 0&&(Rt={type:void 0,texture:void 0},yt[dt]=Rt),(Rt.type!==z||Rt.texture!==Ct)&&(gt!==dt&&(i.activeTexture(dt),gt=dt),i.bindTexture(z,Ct||ct[z]),Rt.type=z,Rt.texture=Ct)}function bt(){let z=yt[gt];z!==void 0&&z.type!==void 0&&(i.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function At(){try{i.compressedTexImage2D(...arguments)}catch(z){se("WebGLState:",z)}}function A(){try{i.compressedTexImage3D(...arguments)}catch(z){se("WebGLState:",z)}}function g(){try{i.texSubImage2D(...arguments)}catch(z){se("WebGLState:",z)}}function H(){try{i.texSubImage3D(...arguments)}catch(z){se("WebGLState:",z)}}function V(){try{i.compressedTexSubImage2D(...arguments)}catch(z){se("WebGLState:",z)}}function q(){try{i.compressedTexSubImage3D(...arguments)}catch(z){se("WebGLState:",z)}}function St(){try{i.texStorage2D(...arguments)}catch(z){se("WebGLState:",z)}}function _t(){try{i.texStorage3D(...arguments)}catch(z){se("WebGLState:",z)}}function K(){try{i.texImage2D(...arguments)}catch(z){se("WebGLState:",z)}}function it(){try{i.texImage3D(...arguments)}catch(z){se("WebGLState:",z)}}function D(z){return f[z]!==void 0?f[z]:i.getParameter(z)}function ut(z,Ct){f[z]!==Ct&&(i.pixelStorei(z,Ct),f[z]=Ct)}function Tt(z){Ce.equals(z)===!1&&(i.scissor(z.x,z.y,z.z,z.w),Ce.copy(z))}function nt(z){pe.equals(z)===!1&&(i.viewport(z.x,z.y,z.z,z.w),pe.copy(z))}function qt(z,Ct){let dt=c.get(Ct);dt===void 0&&(dt=new WeakMap,c.set(Ct,dt));let Rt=dt.get(z);Rt===void 0&&(Rt=i.getUniformBlockIndex(Ct,z.name),dt.set(z,Rt))}function $t(z,Ct){let Rt=c.get(Ct).get(z);l.get(Ct)!==Rt&&(i.uniformBlockBinding(Ct,Rt,z.__bindingPointIndex),l.set(Ct,Rt))}function te(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},f={},gt=null,yt={},u={},d=new WeakMap,m=[],M=null,x=!1,p=null,P=null,U=null,b=null,S=null,E=null,I=null,v=new ue(0,0,0),R=0,L=!1,F=null,N=null,W=null,B=null,J=null,Ce.set(0,0,i.canvas.width,i.canvas.height),pe.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:X,disable:wt,bindFramebuffer:Pt,drawBuffers:xt,useProgram:Ft,setBlending:ae,setMaterial:Re,setFlipSided:Qt,setCullFace:Te,setLineWidth:_e,setPolygonOffset:Ze,setScissorTest:ce,activeTexture:De,bindTexture:O,unbindTexture:bt,compressedTexImage2D:At,compressedTexImage3D:A,texImage2D:K,texImage3D:it,pixelStorei:ut,getParameter:D,updateUBOMapping:qt,uniformBlockBinding:$t,texStorage2D:St,texStorage3D:_t,texSubImage2D:g,texSubImage3D:H,compressedTexSubImage2D:V,compressedTexSubImage3D:q,scissor:Tt,viewport:nt,reset:te}}function Ev(i,t,e,n,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Wt,h=new WeakMap,f=new Set,u,d=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function M(A,g){return m?new OffscreenCanvas(A,g):ur("canvas")}function x(A,g,H){let V=1,q=At(A);if((q.width>H||q.height>H)&&(V=H/Math.max(q.width,q.height)),V<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){let St=Math.floor(V*q.width),_t=Math.floor(V*q.height);u===void 0&&(u=M(St,_t));let K=g?M(St,_t):u;return K.width=St,K.height=_t,K.getContext("2d").drawImage(A,0,0,St,_t),ie("WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+St+"x"+_t+")."),K}else return"data"in A&&ie("WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),A;return A}function p(A){return A.generateMipmaps}function P(A){i.generateMipmap(A)}function U(A){return A.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?i.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(A,g,H,V,q,St=!1){if(A!==null){if(i[A]!==void 0)return i[A];ie("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let _t;V&&(_t=t.get("EXT_texture_norm16"),_t||ie("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let K=g;if(g===i.RED&&(H===i.FLOAT&&(K=i.R32F),H===i.HALF_FLOAT&&(K=i.R16F),H===i.UNSIGNED_BYTE&&(K=i.R8),H===i.UNSIGNED_SHORT&&_t&&(K=_t.R16_EXT),H===i.SHORT&&_t&&(K=_t.R16_SNORM_EXT)),g===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(K=i.R8UI),H===i.UNSIGNED_SHORT&&(K=i.R16UI),H===i.UNSIGNED_INT&&(K=i.R32UI),H===i.BYTE&&(K=i.R8I),H===i.SHORT&&(K=i.R16I),H===i.INT&&(K=i.R32I)),g===i.RG&&(H===i.FLOAT&&(K=i.RG32F),H===i.HALF_FLOAT&&(K=i.RG16F),H===i.UNSIGNED_BYTE&&(K=i.RG8),H===i.UNSIGNED_SHORT&&_t&&(K=_t.RG16_EXT),H===i.SHORT&&_t&&(K=_t.RG16_SNORM_EXT)),g===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(K=i.RG8UI),H===i.UNSIGNED_SHORT&&(K=i.RG16UI),H===i.UNSIGNED_INT&&(K=i.RG32UI),H===i.BYTE&&(K=i.RG8I),H===i.SHORT&&(K=i.RG16I),H===i.INT&&(K=i.RG32I)),g===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(K=i.RGB8UI),H===i.UNSIGNED_SHORT&&(K=i.RGB16UI),H===i.UNSIGNED_INT&&(K=i.RGB32UI),H===i.BYTE&&(K=i.RGB8I),H===i.SHORT&&(K=i.RGB16I),H===i.INT&&(K=i.RGB32I)),g===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(K=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(K=i.RGBA16UI),H===i.UNSIGNED_INT&&(K=i.RGBA32UI),H===i.BYTE&&(K=i.RGBA8I),H===i.SHORT&&(K=i.RGBA16I),H===i.INT&&(K=i.RGBA32I)),g===i.RGB&&(H===i.UNSIGNED_SHORT&&_t&&(K=_t.RGB16_EXT),H===i.SHORT&&_t&&(K=_t.RGB16_SNORM_EXT),H===i.UNSIGNED_INT_5_9_9_9_REV&&(K=i.RGB9_E5),H===i.UNSIGNED_INT_10F_11F_11F_REV&&(K=i.R11F_G11F_B10F)),g===i.RGBA){let it=St?to:ge.getTransfer(q);H===i.FLOAT&&(K=i.RGBA32F),H===i.HALF_FLOAT&&(K=i.RGBA16F),H===i.UNSIGNED_BYTE&&(K=it===Ee?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT&&_t&&(K=_t.RGBA16_EXT),H===i.SHORT&&_t&&(K=_t.RGBA16_SNORM_EXT),H===i.UNSIGNED_SHORT_4_4_4_4&&(K=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(K=i.RGB5_A1)}return(K===i.R16F||K===i.R32F||K===i.RG16F||K===i.RG32F||K===i.RGBA16F||K===i.RGBA32F)&&t.get("EXT_color_buffer_float"),K}function S(A,g){let H;return A?g===null||g===li||g===Tr?H=i.DEPTH24_STENCIL8:g===ci?H=i.DEPTH32F_STENCIL8:g===wr&&(H=i.DEPTH24_STENCIL8,ie("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===li||g===Tr?H=i.DEPTH_COMPONENT24:g===ci?H=i.DEPTH_COMPONENT32F:g===wr&&(H=i.DEPTH_COMPONENT16),H}function E(A,g){return p(A)===!0||A.isFramebufferTexture&&A.minFilter!==fn&&A.minFilter!==Ye?Math.log2(Math.max(g.width,g.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?g.mipmaps.length:1}function I(A){let g=A.target;g.removeEventListener("dispose",I),R(g),g.isVideoTexture&&h.delete(g),g.isHTMLTexture&&f.delete(g)}function v(A){let g=A.target;g.removeEventListener("dispose",v),F(g)}function R(A){let g=n.get(A);if(g.__webglInit===void 0)return;let H=A.source,V=d.get(H);if(V){let q=V[g.__cacheKey];q.usedTimes--,q.usedTimes===0&&L(A),Object.keys(V).length===0&&d.delete(H)}n.remove(A)}function L(A){let g=n.get(A);i.deleteTexture(g.__webglTexture);let H=A.source,V=d.get(H);delete V[g.__cacheKey],o.memory.textures--}function F(A){let g=n.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),n.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let V=0;V<6;V++){if(Array.isArray(g.__webglFramebuffer[V]))for(let q=0;q<g.__webglFramebuffer[V].length;q++)i.deleteFramebuffer(g.__webglFramebuffer[V][q]);else i.deleteFramebuffer(g.__webglFramebuffer[V]);g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer[V])}else{if(Array.isArray(g.__webglFramebuffer))for(let V=0;V<g.__webglFramebuffer.length;V++)i.deleteFramebuffer(g.__webglFramebuffer[V]);else i.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&i.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let V=0;V<g.__webglColorRenderbuffer.length;V++)g.__webglColorRenderbuffer[V]&&i.deleteRenderbuffer(g.__webglColorRenderbuffer[V]);g.__webglDepthRenderbuffer&&i.deleteRenderbuffer(g.__webglDepthRenderbuffer)}let H=A.textures;for(let V=0,q=H.length;V<q;V++){let St=n.get(H[V]);St.__webglTexture&&(i.deleteTexture(St.__webglTexture),o.memory.textures--),n.remove(H[V])}n.remove(A)}let N=0;function W(){N=0}function B(){return N}function J(A){N=A}function ot(){let A=N;return A>=s.maxTextures&&ie("WebGLTextures: Trying to use "+(A+1)+" texture units while this GPU supports only "+s.maxTextures),N+=1,A}function lt(A){let g=[];return g.push(A.wrapS),g.push(A.wrapT),g.push(A.wrapR||0),g.push(A.magFilter),g.push(A.minFilter),g.push(A.anisotropy),g.push(A.internalFormat),g.push(A.format),g.push(A.type),g.push(A.generateMipmaps),g.push(A.premultiplyAlpha),g.push(A.flipY),g.push(A.unpackAlignment),g.push(A.colorSpace),g.join()}function vt(A,g){let H=n.get(A);if(A.isVideoTexture&&O(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&H.__version!==A.version){let V=A.image;if(V===null)ie("WebGLRenderer: Texture marked for update but no image data found.");else if(V.complete===!1)ie("WebGLRenderer: Texture marked for update but image is incomplete");else{wt(H,A,g);return}}else A.isExternalTexture&&(H.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+g)}function at(A,g){let H=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&H.__version!==A.version){wt(H,A,g);return}else A.isExternalTexture&&(H.__webglTexture=A.sourceTexture?A.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+g)}function gt(A,g){let H=n.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&H.__version!==A.version){wt(H,A,g);return}e.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+g)}function yt(A,g){let H=n.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&H.__version!==A.version){Pt(H,A,g);return}e.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+g)}let Xt={[Ua]:i.REPEAT,[_i]:i.CLAMP_TO_EDGE,[Oa]:i.MIRRORED_REPEAT},Gt={[fn]:i.NEAREST,[Rf]:i.NEAREST_MIPMAP_NEAREST,[Eo]:i.NEAREST_MIPMAP_LINEAR,[Ye]:i.LINEAR,[ll]:i.LINEAR_MIPMAP_NEAREST,[cs]:i.LINEAR_MIPMAP_LINEAR},Ce={[Df]:i.NEVER,[Bf]:i.ALWAYS,[Nf]:i.LESS,[Xl]:i.LEQUAL,[Ff]:i.EQUAL,[ql]:i.GEQUAL,[Uf]:i.GREATER,[Of]:i.NOTEQUAL};function pe(A,g){if(g.type===ci&&t.has("OES_texture_float_linear")===!1&&(g.magFilter===Ye||g.magFilter===ll||g.magFilter===Eo||g.magFilter===cs||g.minFilter===Ye||g.minFilter===ll||g.minFilter===Eo||g.minFilter===cs)&&ie("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(A,i.TEXTURE_WRAP_S,Xt[g.wrapS]),i.texParameteri(A,i.TEXTURE_WRAP_T,Xt[g.wrapT]),(A===i.TEXTURE_3D||A===i.TEXTURE_2D_ARRAY)&&i.texParameteri(A,i.TEXTURE_WRAP_R,Xt[g.wrapR]),i.texParameteri(A,i.TEXTURE_MAG_FILTER,Gt[g.magFilter]),i.texParameteri(A,i.TEXTURE_MIN_FILTER,Gt[g.minFilter]),g.compareFunction&&(i.texParameteri(A,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(A,i.TEXTURE_COMPARE_FUNC,Ce[g.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===fn||g.minFilter!==Eo&&g.minFilter!==cs||g.type===ci&&t.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||n.get(g).__currentAnisotropy){let H=t.get("EXT_texture_filter_anisotropic");i.texParameterf(A,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,s.getMaxAnisotropy())),n.get(g).__currentAnisotropy=g.anisotropy}}}function Me(A,g){let H=!1;A.__webglInit===void 0&&(A.__webglInit=!0,g.addEventListener("dispose",I));let V=g.source,q=d.get(V);q===void 0&&(q={},d.set(V,q));let St=lt(g);if(St!==A.__cacheKey){q[St]===void 0&&(q[St]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,H=!0),q[St].usedTimes++;let _t=q[A.__cacheKey];_t!==void 0&&(q[A.__cacheKey].usedTimes--,_t.usedTimes===0&&L(g)),A.__cacheKey=St,A.__webglTexture=q[St].texture}return H}function ct(A,g,H){return Math.floor(Math.floor(A/H)/g)}function X(A,g,H,V){let St=A.updateRanges;if(St.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,g.width,g.height,H,V,g.data);else{St.sort((ut,Tt)=>ut.start-Tt.start);let _t=0;for(let ut=1;ut<St.length;ut++){let Tt=St[_t],nt=St[ut],qt=Tt.start+Tt.count,$t=ct(nt.start,g.width,4),te=ct(Tt.start,g.width,4);nt.start<=qt+1&&$t===te&&ct(nt.start+nt.count-1,g.width,4)===$t?Tt.count=Math.max(Tt.count,nt.start+nt.count-Tt.start):(++_t,St[_t]=nt)}St.length=_t+1;let K=e.getParameter(i.UNPACK_ROW_LENGTH),it=e.getParameter(i.UNPACK_SKIP_PIXELS),D=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,g.width);for(let ut=0,Tt=St.length;ut<Tt;ut++){let nt=St[ut],qt=Math.floor(nt.start/4),$t=Math.ceil(nt.count/4),te=qt%g.width,z=Math.floor(qt/g.width),Ct=$t,dt=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,te),e.pixelStorei(i.UNPACK_SKIP_ROWS,z),e.texSubImage2D(i.TEXTURE_2D,0,te,z,Ct,dt,H,V,g.data)}A.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,K),e.pixelStorei(i.UNPACK_SKIP_PIXELS,it),e.pixelStorei(i.UNPACK_SKIP_ROWS,D)}}function wt(A,g,H){let V=i.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(V=i.TEXTURE_2D_ARRAY),g.isData3DTexture&&(V=i.TEXTURE_3D);let q=Me(A,g),St=g.source;e.bindTexture(V,A.__webglTexture,i.TEXTURE0+H);let _t=n.get(St);if(St.version!==_t.__version||q===!0){if(e.activeTexture(i.TEXTURE0+H),(typeof ImageBitmap<"u"&&g.image instanceof ImageBitmap)===!1){let dt=ge.getPrimaries(ge.workingColorSpace),Rt=g.colorSpace===Bi?null:ge.getPrimaries(g.colorSpace),pt=g.colorSpace===Bi||dt===Rt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,pt)}e.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment);let it=x(g.image,!1,s.maxTextureSize);it=bt(g,it);let D=r.convert(g.format,g.colorSpace),ut=r.convert(g.type),Tt=b(g.internalFormat,D,ut,g.normalized,g.colorSpace,g.isVideoTexture);pe(V,g);let nt,qt=g.mipmaps,$t=g.isVideoTexture!==!0,te=_t.__version===void 0||q===!0,z=St.dataReady,Ct=E(g,it);if(g.isDepthTexture)Tt=S(g.format===hs,g.type),te&&($t?e.texStorage2D(i.TEXTURE_2D,1,Tt,it.width,it.height):e.texImage2D(i.TEXTURE_2D,0,Tt,it.width,it.height,0,D,ut,null));else if(g.isDataTexture)if(qt.length>0){$t&&te&&e.texStorage2D(i.TEXTURE_2D,Ct,Tt,qt[0].width,qt[0].height);for(let dt=0,Rt=qt.length;dt<Rt;dt++)nt=qt[dt],$t?z&&e.texSubImage2D(i.TEXTURE_2D,dt,0,0,nt.width,nt.height,D,ut,nt.data):e.texImage2D(i.TEXTURE_2D,dt,Tt,nt.width,nt.height,0,D,ut,nt.data);g.generateMipmaps=!1}else $t?(te&&e.texStorage2D(i.TEXTURE_2D,Ct,Tt,it.width,it.height),z&&X(g,it,D,ut)):e.texImage2D(i.TEXTURE_2D,0,Tt,it.width,it.height,0,D,ut,it.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){$t&&te&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ct,Tt,qt[0].width,qt[0].height,it.depth);for(let dt=0,Rt=qt.length;dt<Rt;dt++)if(nt=qt[dt],g.format!==Mn)if(D!==null)if($t){if(z)if(g.layerUpdates.size>0){let pt=Th(nt.width,nt.height,g.format,g.type);for(let Mt of g.layerUpdates){let Yt=nt.data.subarray(Mt*pt/nt.data.BYTES_PER_ELEMENT,(Mt+1)*pt/nt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,dt,0,0,Mt,nt.width,nt.height,1,D,Yt)}}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,dt,0,0,0,nt.width,nt.height,it.depth,D,nt.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,dt,Tt,nt.width,nt.height,it.depth,0,nt.data,0,0);else ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else $t?z&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,dt,0,0,0,nt.width,nt.height,it.depth,D,ut,nt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,dt,Tt,nt.width,nt.height,it.depth,0,D,ut,nt.data);g.layerUpdates.size>0&&g.clearLayerUpdates()}else{$t&&te&&e.texStorage2D(i.TEXTURE_2D,Ct,Tt,qt[0].width,qt[0].height);for(let dt=0,Rt=qt.length;dt<Rt;dt++)nt=qt[dt],g.format!==Mn?D!==null?$t?z&&e.compressedTexSubImage2D(i.TEXTURE_2D,dt,0,0,nt.width,nt.height,D,nt.data):e.compressedTexImage2D(i.TEXTURE_2D,dt,Tt,nt.width,nt.height,0,nt.data):ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):$t?z&&e.texSubImage2D(i.TEXTURE_2D,dt,0,0,nt.width,nt.height,D,ut,nt.data):e.texImage2D(i.TEXTURE_2D,dt,Tt,nt.width,nt.height,0,D,ut,nt.data)}else if(g.isDataArrayTexture)if($t){if(te&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ct,Tt,it.width,it.height,it.depth),z)if(g.layerUpdates.size>0){let dt=Th(it.width,it.height,g.format,g.type);for(let Rt of g.layerUpdates){let pt=it.data.subarray(Rt*dt/it.data.BYTES_PER_ELEMENT,(Rt+1)*dt/it.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Rt,it.width,it.height,1,D,ut,pt)}g.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,it.width,it.height,it.depth,D,ut,it.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Tt,it.width,it.height,it.depth,0,D,ut,it.data);else if(g.isData3DTexture)$t?(te&&e.texStorage3D(i.TEXTURE_3D,Ct,Tt,it.width,it.height,it.depth),z&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,it.width,it.height,it.depth,D,ut,it.data)):e.texImage3D(i.TEXTURE_3D,0,Tt,it.width,it.height,it.depth,0,D,ut,it.data);else if(g.isFramebufferTexture){if(te)if($t)e.texStorage2D(i.TEXTURE_2D,Ct,Tt,it.width,it.height);else{let dt=it.width,Rt=it.height;for(let pt=0;pt<Ct;pt++)e.texImage2D(i.TEXTURE_2D,pt,Tt,dt,Rt,0,D,ut,null),dt>>=1,Rt>>=1}}else if(g.isHTMLTexture){if("texElementImage2D"in i){let dt=i.canvas;if(dt.hasAttribute("layoutsubtree")||dt.setAttribute("layoutsubtree","true"),it.parentNode!==dt){dt.appendChild(it),f.add(g),dt.onpaint=Rt=>{let pt=Rt.changedElements;for(let Mt of f)pt.includes(Mt.image)&&(Mt.needsUpdate=!0)},dt.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,it);else{let pt=i.RGBA,Mt=i.RGBA,Yt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,pt,Mt,Yt,it)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(qt.length>0){if($t&&te){let dt=At(qt[0]);e.texStorage2D(i.TEXTURE_2D,Ct,Tt,dt.width,dt.height)}for(let dt=0,Rt=qt.length;dt<Rt;dt++)nt=qt[dt],$t?z&&e.texSubImage2D(i.TEXTURE_2D,dt,0,0,D,ut,nt):e.texImage2D(i.TEXTURE_2D,dt,Tt,D,ut,nt);g.generateMipmaps=!1}else if($t){if(te){let dt=At(it);e.texStorage2D(i.TEXTURE_2D,Ct,Tt,dt.width,dt.height)}z&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,D,ut,it)}else e.texImage2D(i.TEXTURE_2D,0,Tt,D,ut,it);p(g)&&P(V),_t.__version=St.version,g.onUpdate&&g.onUpdate(g)}A.__version=g.version}function Pt(A,g,H){if(g.image.length!==6)return;let V=Me(A,g),q=g.source;e.bindTexture(i.TEXTURE_CUBE_MAP,A.__webglTexture,i.TEXTURE0+H);let St=n.get(q);if(q.version!==St.__version||V===!0){e.activeTexture(i.TEXTURE0+H);let _t=ge.getPrimaries(ge.workingColorSpace),K=g.colorSpace===Bi?null:ge.getPrimaries(g.colorSpace),it=g.colorSpace===Bi||_t===K?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,it);let D=g.isCompressedTexture||g.image[0].isCompressedTexture,ut=g.image[0]&&g.image[0].isDataTexture,Tt=[];for(let Mt=0;Mt<6;Mt++)!D&&!ut?Tt[Mt]=x(g.image[Mt],!0,s.maxCubemapSize):Tt[Mt]=ut?g.image[Mt].image:g.image[Mt],Tt[Mt]=bt(g,Tt[Mt]);let nt=Tt[0],qt=r.convert(g.format,g.colorSpace),$t=r.convert(g.type),te=b(g.internalFormat,qt,$t,g.normalized,g.colorSpace),z=g.isVideoTexture!==!0,Ct=St.__version===void 0||V===!0,dt=q.dataReady,Rt=E(g,nt);pe(i.TEXTURE_CUBE_MAP,g);let pt;if(D){z&&Ct&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Rt,te,nt.width,nt.height);for(let Mt=0;Mt<6;Mt++){pt=Tt[Mt].mipmaps;for(let Yt=0;Yt<pt.length;Yt++){let Lt=pt[Yt];g.format!==Mn?qt!==null?z?dt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,Yt,0,0,Lt.width,Lt.height,qt,Lt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,Yt,te,Lt.width,Lt.height,0,Lt.data):ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):z?dt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,Yt,0,0,Lt.width,Lt.height,qt,$t,Lt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,Yt,te,Lt.width,Lt.height,0,qt,$t,Lt.data)}}}else{if(pt=g.mipmaps,z&&Ct){pt.length>0&&Rt++;let Mt=At(Tt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Rt,te,Mt.width,Mt.height)}for(let Mt=0;Mt<6;Mt++)if(ut){z?dt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,0,0,0,Tt[Mt].width,Tt[Mt].height,qt,$t,Tt[Mt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,0,te,Tt[Mt].width,Tt[Mt].height,0,qt,$t,Tt[Mt].data);for(let Yt=0;Yt<pt.length;Yt++){let Ae=pt[Yt].image[Mt].image;z?dt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,Yt+1,0,0,Ae.width,Ae.height,qt,$t,Ae.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,Yt+1,te,Ae.width,Ae.height,0,qt,$t,Ae.data)}}else{z?dt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,0,0,0,qt,$t,Tt[Mt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,0,te,qt,$t,Tt[Mt]);for(let Yt=0;Yt<pt.length;Yt++){let Lt=pt[Yt];z?dt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,Yt+1,0,0,qt,$t,Lt.image[Mt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Mt,Yt+1,te,qt,$t,Lt.image[Mt])}}}p(g)&&P(i.TEXTURE_CUBE_MAP),St.__version=q.version,g.onUpdate&&g.onUpdate(g)}A.__version=g.version}function xt(A,g,H,V,q,St){let _t=r.convert(H.format,H.colorSpace),K=r.convert(H.type),it=b(H.internalFormat,_t,K,H.normalized,H.colorSpace),D=n.get(g),ut=n.get(H);if(ut.__renderTarget=g,!D.__hasExternalTextures){let Tt=Math.max(1,g.width>>St),nt=Math.max(1,g.height>>St);q===i.TEXTURE_3D||q===i.TEXTURE_2D_ARRAY?e.texImage3D(q,St,it,Tt,nt,g.depth,0,_t,K,null):e.texImage2D(q,St,it,Tt,nt,0,_t,K,null)}e.bindFramebuffer(i.FRAMEBUFFER,A),De(g)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,V,q,ut.__webglTexture,0,ce(g)):(q===i.TEXTURE_2D||q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,V,q,ut.__webglTexture,St),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ft(A,g,H){if(i.bindRenderbuffer(i.RENDERBUFFER,A),g.depthBuffer){let V=g.depthTexture,q=V&&V.isDepthTexture?V.type:null,St=S(g.stencilBuffer,q),_t=g.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;De(g)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ce(g),St,g.width,g.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,ce(g),St,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,St,g.width,g.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,_t,i.RENDERBUFFER,A)}else{let V=g.textures;for(let q=0;q<V.length;q++){let St=V[q],_t=r.convert(St.format,St.colorSpace),K=r.convert(St.type),it=b(St.internalFormat,_t,K,St.normalized,St.colorSpace);De(g)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ce(g),it,g.width,g.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,ce(g),it,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,it,g.width,g.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function jt(A,g,H){let V=g.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,A),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let q=n.get(g.depthTexture);if(q.__renderTarget=g,(!q.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),V){if(q.__webglInit===void 0&&(q.__webglInit=!0,g.depthTexture.addEventListener("dispose",I)),q.__webglTexture===void 0){q.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture),pe(i.TEXTURE_CUBE_MAP,g.depthTexture);let D=r.convert(g.depthTexture.format),ut=r.convert(g.depthTexture.type),Tt;g.depthTexture.format===vi?Tt=i.DEPTH_COMPONENT24:g.depthTexture.format===hs&&(Tt=i.DEPTH24_STENCIL8);for(let nt=0;nt<6;nt++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,Tt,g.width,g.height,0,D,ut,null)}}else vt(g.depthTexture,0);let St=q.__webglTexture,_t=ce(g),K=V?i.TEXTURE_CUBE_MAP_POSITIVE_X+H:i.TEXTURE_2D,it=g.depthTexture.format===hs?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(g.depthTexture.format===vi)De(g)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,it,K,St,0,_t):i.framebufferTexture2D(i.FRAMEBUFFER,it,K,St,0);else if(g.depthTexture.format===hs)De(g)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,it,K,St,0,_t):i.framebufferTexture2D(i.FRAMEBUFFER,it,K,St,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function re(A){let g=n.get(A),H=A.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==A.depthTexture){let V=A.depthTexture;if(g.__depthDisposeCallback&&g.__depthDisposeCallback(),V){let q=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,V.removeEventListener("dispose",q)};V.addEventListener("dispose",q),g.__depthDisposeCallback=q}g.__boundDepthTexture=V}if(A.depthTexture&&!g.__autoAllocateDepthBuffer)if(H)for(let V=0;V<6;V++)jt(g.__webglFramebuffer[V],A,V);else{let V=A.texture.mipmaps;V&&V.length>0?jt(g.__webglFramebuffer[0],A,0):jt(g.__webglFramebuffer,A,0)}else if(H){g.__webglDepthbuffer=[];for(let V=0;V<6;V++)if(e.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[V]),g.__webglDepthbuffer[V]===void 0)g.__webglDepthbuffer[V]=i.createRenderbuffer(),Ft(g.__webglDepthbuffer[V],A,!1);else{let q=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,St=g.__webglDepthbuffer[V];i.bindRenderbuffer(i.RENDERBUFFER,St),i.framebufferRenderbuffer(i.FRAMEBUFFER,q,i.RENDERBUFFER,St)}}else{let V=A.texture.mipmaps;if(V&&V.length>0?e.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=i.createRenderbuffer(),Ft(g.__webglDepthbuffer,A,!1);else{let q=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,St=g.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,St),i.framebufferRenderbuffer(i.FRAMEBUFFER,q,i.RENDERBUFFER,St)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function ae(A,g,H){let V=n.get(A);g!==void 0&&xt(V.__webglFramebuffer,A,A.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&re(A)}function Re(A){let g=A.texture,H=n.get(A),V=n.get(g);A.addEventListener("dispose",v);let q=A.textures,St=A.isWebGLCubeRenderTarget===!0,_t=q.length>1;if(_t||(V.__webglTexture===void 0&&(V.__webglTexture=i.createTexture()),V.__version=g.version,o.memory.textures++),St){H.__webglFramebuffer=[];for(let K=0;K<6;K++)if(g.mipmaps&&g.mipmaps.length>0){H.__webglFramebuffer[K]=[];for(let it=0;it<g.mipmaps.length;it++)H.__webglFramebuffer[K][it]=i.createFramebuffer()}else H.__webglFramebuffer[K]=i.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){H.__webglFramebuffer=[];for(let K=0;K<g.mipmaps.length;K++)H.__webglFramebuffer[K]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(_t)for(let K=0,it=q.length;K<it;K++){let D=n.get(q[K]);D.__webglTexture===void 0&&(D.__webglTexture=i.createTexture(),o.memory.textures++)}if(A.samples>0&&De(A)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let K=0;K<q.length;K++){let it=q[K];H.__webglColorRenderbuffer[K]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[K]);let D=r.convert(it.format,it.colorSpace),ut=r.convert(it.type),Tt=b(it.internalFormat,D,ut,it.normalized,it.colorSpace,A.isXRRenderTarget===!0),nt=ce(A);i.renderbufferStorageMultisample(i.RENDERBUFFER,nt,Tt,A.width,A.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+K,i.RENDERBUFFER,H.__webglColorRenderbuffer[K])}i.bindRenderbuffer(i.RENDERBUFFER,null),A.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),Ft(H.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(St){e.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture),pe(i.TEXTURE_CUBE_MAP,g);for(let K=0;K<6;K++)if(g.mipmaps&&g.mipmaps.length>0)for(let it=0;it<g.mipmaps.length;it++)xt(H.__webglFramebuffer[K][it],A,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+K,it);else xt(H.__webglFramebuffer[K],A,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+K,0);p(g)&&P(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(_t){for(let K=0,it=q.length;K<it;K++){let D=q[K],ut=n.get(D),Tt=i.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(Tt=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Tt,ut.__webglTexture),pe(Tt,D),xt(H.__webglFramebuffer,A,D,i.COLOR_ATTACHMENT0+K,Tt,0),p(D)&&P(Tt)}e.unbindTexture()}else{let K=i.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(K=A.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(K,V.__webglTexture),pe(K,g),g.mipmaps&&g.mipmaps.length>0)for(let it=0;it<g.mipmaps.length;it++)xt(H.__webglFramebuffer[it],A,g,i.COLOR_ATTACHMENT0,K,it);else xt(H.__webglFramebuffer,A,g,i.COLOR_ATTACHMENT0,K,0);p(g)&&P(K),e.unbindTexture()}A.depthBuffer&&re(A)}function Qt(A){let g=A.textures;for(let H=0,V=g.length;H<V;H++){let q=g[H];if(p(q)){let St=U(A),_t=n.get(q).__webglTexture;e.bindTexture(St,_t),P(St),e.unbindTexture()}}}let Te=[],_e=[];function Ze(A){if(A.samples>0){if(De(A)===!1){let g=A.textures,H=A.width,V=A.height,q=i.COLOR_BUFFER_BIT,St=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,_t=n.get(A),K=g.length>1;if(K)for(let D=0;D<g.length;D++)e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+D,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+D,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,_t.__webglMultisampledFramebuffer);let it=A.texture.mipmaps;it&&it.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,_t.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,_t.__webglFramebuffer);for(let D=0;D<g.length;D++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(q|=i.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(q|=i.STENCIL_BUFFER_BIT)),K){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,_t.__webglColorRenderbuffer[D]);let ut=n.get(g[D]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,ut,0)}i.blitFramebuffer(0,0,H,V,0,0,H,V,q,i.NEAREST),l===!0&&(Te.length=0,_e.length=0,Te.push(i.COLOR_ATTACHMENT0+D),A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&(Te.push(St),_e.push(St),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,_e)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Te))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),K)for(let D=0;D<g.length;D++){e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+D,i.RENDERBUFFER,_t.__webglColorRenderbuffer[D]);let ut=n.get(g[D]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+D,i.TEXTURE_2D,ut,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,_t.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.storeMultisampledDepthBuffer===!1&&l){let g=A.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[g])}}}function ce(A){return Math.min(s.maxSamples,A.samples)}function De(A){let g=n.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function O(A){let g=o.render.frame;h.get(A)!==g&&(h.set(A,g),A.update())}function bt(A,g){let H=A.colorSpace,V=A.format,q=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||H!==Qr&&H!==Bi&&(ge.getTransfer(H)===Ee?(V!==Mn||q!==Hn)&&ie("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):se("WebGLTextures: Unsupported texture color space:",H)),g}function At(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=ot,this.resetTextureUnits=W,this.getTextureUnits=B,this.setTextureUnits=J,this.setTexture2D=vt,this.setTexture2DArray=at,this.setTexture3D=gt,this.setTextureCube=yt,this.rebindTextures=ae,this.setupRenderTarget=Re,this.updateRenderTargetMipmap=Qt,this.updateMultisampleRenderTarget=Ze,this.setupDepthRenderbuffer=re,this.setupFrameBufferTexture=xt,this.useMultisampledRTT=De,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function Cv(i,t){function e(n,s=Bi){let r,o=ge.getTransfer(s);if(n===Hn)return i.UNSIGNED_BYTE;if(n===hl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ul)return i.UNSIGNED_SHORT_5_5_5_1;if(n===uh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===fh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===ch)return i.BYTE;if(n===hh)return i.SHORT;if(n===wr)return i.UNSIGNED_SHORT;if(n===cl)return i.INT;if(n===li)return i.UNSIGNED_INT;if(n===ci)return i.FLOAT;if(n===en)return i.HALF_FLOAT;if(n===dh)return i.ALPHA;if(n===ph)return i.RGB;if(n===Mn)return i.RGBA;if(n===vi)return i.DEPTH_COMPONENT;if(n===hs)return i.DEPTH_STENCIL;if(n===mh)return i.RED;if(n===fl)return i.RED_INTEGER;if(n===us)return i.RG;if(n===dl)return i.RG_INTEGER;if(n===pl)return i.RGBA_INTEGER;if(n===Co||n===Ro||n===Po||n===Io)if(o===Ee)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Co)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ro)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Po)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Io)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Co)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ro)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Po)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Io)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ml||n===gl||n===xl||n===_l)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ml)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===gl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===xl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===_l)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===vl||n===yl||n===Ml||n===Sl||n===bl||n===Lo||n===wl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===vl||n===yl)return o===Ee?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ml)return o===Ee?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Sl)return r.COMPRESSED_R11_EAC;if(n===bl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Lo)return r.COMPRESSED_RG11_EAC;if(n===wl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Tl||n===Al||n===El||n===Cl||n===Rl||n===Pl||n===Il||n===Ll||n===Dl||n===Nl||n===Fl||n===Ul||n===Ol||n===Bl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Tl)return o===Ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Al)return o===Ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===El)return o===Ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Cl)return o===Ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Rl)return o===Ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Pl)return o===Ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Il)return o===Ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ll)return o===Ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Dl)return o===Ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Nl)return o===Ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Fl)return o===Ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ul)return o===Ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ol)return o===Ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Bl)return o===Ee?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===kl||n===zl||n===Vl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===kl)return o===Ee?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===zl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Vl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Hl||n===Gl||n===Do||n===Wl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Hl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Gl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Do)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Wl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Tr?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var Rv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Pv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Wh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new uo(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new We({vertexShader:Rv,fragmentShader:Pv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Ge(new Oi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Xh=class extends ri{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,f=null,u=null,d=null,m=null,M=typeof XRWebGLBinding<"u",x=new Wh,p={},P=e.getContextAttributes(),U=null,b=null,S=[],E=[],I=new Wt,v=null,R=null,L=new gn;L.viewport=new qe;let F=new gn;F.viewport=new qe;let N=[L,F],W=new il,B=null,J=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ct){let X=S[ct];return X===void 0&&(X=new gr,S[ct]=X),X.getTargetRaySpace()},this.getControllerGrip=function(ct){let X=S[ct];return X===void 0&&(X=new gr,S[ct]=X),X.getGripSpace()},this.getHand=function(ct){let X=S[ct];return X===void 0&&(X=new gr,S[ct]=X),X.getHandSpace()};function ot(ct){let X=E.indexOf(ct.inputSource);if(X===-1)return;let wt=S[X];wt!==void 0&&(wt.update(ct.inputSource,ct.frame,c||o),wt.dispatchEvent({type:ct.type,data:ct.inputSource}))}function lt(){s.removeEventListener("select",ot),s.removeEventListener("selectstart",ot),s.removeEventListener("selectend",ot),s.removeEventListener("squeeze",ot),s.removeEventListener("squeezestart",ot),s.removeEventListener("squeezeend",ot),s.removeEventListener("end",lt),s.removeEventListener("inputsourceschange",vt);for(let ct=0;ct<S.length;ct++){let X=E[ct];X!==null&&(E[ct]=null,S[ct].disconnect(X))}B=null,J=null,x.reset();for(let ct in p)delete p[ct];if(t.setRenderTarget(U),d=null,u=null,f=null,s=null,b=null,Me.stop(),n.isPresenting=!1,t.setPixelRatio(v),t.setSize(I.width,I.height,!1),R!==null){let ct=R.camera;ct.fov=R.fov,ct.zoom=R.zoom,ct.updateProjectionMatrix(),R=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ct){r=ct,n.isPresenting===!0&&ie("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ct){a=ct,n.isPresenting===!0&&ie("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(ct){c=ct},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f===null&&M&&(f=new XRWebGLBinding(s,e)),f},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(ct){if(s=ct,s!==null){if(U=t.getRenderTarget(),s.addEventListener("select",ot),s.addEventListener("selectstart",ot),s.addEventListener("selectend",ot),s.addEventListener("squeeze",ot),s.addEventListener("squeezestart",ot),s.addEventListener("squeezeend",ot),s.addEventListener("end",lt),s.addEventListener("inputsourceschange",vt),P.xrCompatible!==!0&&await e.makeXRCompatible(),v=t.getPixelRatio(),t.getSize(I),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let wt=null,Pt=null,xt=null;P.depth&&(xt=P.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,wt=P.stencil?hs:vi,Pt=P.stencil?Tr:li);let Ft={colorFormat:e.RGBA8,depthFormat:xt,scaleFactor:r};f=this.getBinding(),u=f.createProjectionLayer(Ft),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),b=new $e(u.textureWidth,u.textureHeight,{format:Mn,type:Hn,depthTexture:new is(u.textureWidth,u.textureHeight,Pt,void 0,void 0,void 0,void 0,void 0,void 0,wt),stencilBuffer:P.stencil,colorSpace:t.outputColorSpace,samples:P.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let wt={antialias:P.antialias,alpha:!0,depth:P.depth,stencil:P.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,wt),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),b=new $e(d.framebufferWidth,d.framebufferHeight,{format:Mn,type:Hn,colorSpace:t.outputColorSpace,stencilBuffer:P.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Me.setContext(s),Me.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function vt(ct){for(let X=0;X<ct.removed.length;X++){let wt=ct.removed[X],Pt=E.indexOf(wt);Pt>=0&&(E[Pt]=null,S[Pt].disconnect(wt))}for(let X=0;X<ct.added.length;X++){let wt=ct.added[X],Pt=E.indexOf(wt);if(Pt===-1){for(let Ft=0;Ft<S.length;Ft++)if(Ft>=E.length){E.push(wt),Pt=Ft;break}else if(E[Ft]===null){E[Ft]=wt,Pt=Ft;break}if(Pt===-1)break}let xt=S[Pt];xt&&xt.connect(wt)}}let at=new G,gt=new G;function yt(ct,X,wt){at.setFromMatrixPosition(X.matrixWorld),gt.setFromMatrixPosition(wt.matrixWorld);let Pt=at.distanceTo(gt),xt=X.projectionMatrix.elements,Ft=wt.projectionMatrix.elements,jt=xt[14]/(xt[10]-1),re=xt[14]/(xt[10]+1),ae=(xt[9]+1)/xt[5],Re=(xt[9]-1)/xt[5],Qt=(xt[8]-1)/xt[0],Te=(Ft[8]+1)/Ft[0],_e=jt*Qt,Ze=jt*Te,ce=Pt/(-Qt+Te),De=ce*-Qt;if(X.matrixWorld.decompose(ct.position,ct.quaternion,ct.scale),ct.translateX(De),ct.translateZ(ce),ct.matrixWorld.compose(ct.position,ct.quaternion,ct.scale),ct.matrixWorldInverse.copy(ct.matrixWorld).invert(),xt[10]===-1)ct.projectionMatrix.copy(X.projectionMatrix),ct.projectionMatrixInverse.copy(X.projectionMatrixInverse);else{let O=jt+ce,bt=re+ce,At=_e-De,A=Ze+(Pt-De),g=ae*re/bt*O,H=Re*re/bt*O;ct.projectionMatrix.makePerspective(At,A,g,H,O,bt),ct.projectionMatrixInverse.copy(ct.projectionMatrix).invert()}}function Xt(ct,X){X===null?ct.matrixWorld.copy(ct.matrix):ct.matrixWorld.multiplyMatrices(X.matrixWorld,ct.matrix),ct.matrixWorldInverse.copy(ct.matrixWorld).invert()}this.updateCamera=function(ct){if(s===null)return;let X=ct.near,wt=ct.far;x.texture!==null&&(x.depthNear>0&&(X=x.depthNear),x.depthFar>0&&(wt=x.depthFar)),W.near=F.near=L.near=X,W.far=F.far=L.far=wt,(B!==W.near||J!==W.far)&&(s.updateRenderState({depthNear:W.near,depthFar:W.far}),B=W.near,J=W.far),W.layers.mask=ct.layers.mask|6,L.layers.mask=W.layers.mask&-5,F.layers.mask=W.layers.mask&-3;let Pt=ct.parent,xt=W.cameras;Xt(W,Pt);for(let Ft=0;Ft<xt.length;Ft++)Xt(xt[Ft],Pt);xt.length===2?yt(W,L,F):W.projectionMatrix.copy(L.projectionMatrix),R===null&&ct.isPerspectiveCamera&&(R={camera:ct,fov:ct.fov,zoom:ct.zoom}),Gt(ct,W,Pt)};function Gt(ct,X,wt){wt===null?ct.matrix.copy(X.matrixWorld):(ct.matrix.copy(wt.matrixWorld),ct.matrix.invert(),ct.matrix.multiply(X.matrixWorld)),ct.matrix.decompose(ct.position,ct.quaternion,ct.scale),ct.updateMatrixWorld(!0),ct.projectionMatrix.copy(X.projectionMatrix),ct.projectionMatrixInverse.copy(X.projectionMatrixInverse),ct.isPerspectiveCamera&&(ct.fov=dr*2*Math.atan(1/ct.projectionMatrix.elements[5]),ct.zoom=1)}this.getCamera=function(){return W},this.getFoveation=function(){if(!(u===null&&d===null))return l},this.setFoveation=function(ct){l=ct,u!==null&&(u.fixedFoveation=ct),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=ct)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(W)},this.getCameraTexture=function(ct){return p[ct]};let Ce=null;function pe(ct,X){if(h=X.getViewerPose(c||o),m=X,h!==null){let wt=h.views;d!==null&&(t.setRenderTargetFramebuffer(b,d.framebuffer),t.setRenderTarget(b));let Pt=!1;wt.length!==W.cameras.length&&(W.cameras.length=0,Pt=!0);for(let re=0;re<wt.length;re++){let ae=wt[re],Re=null;if(d!==null)Re=d.getViewport(ae);else{let Te=f.getViewSubImage(u,ae);Re=Te.viewport,re===0&&(t.setRenderTargetTextures(b,Te.colorTexture,Te.depthStencilTexture),t.setRenderTarget(b))}let Qt=N[re];Qt===void 0&&(Qt=new gn,Qt.layers.enable(re),Qt.viewport=new qe,N[re]=Qt),Qt.matrix.fromArray(ae.transform.matrix),Qt.matrix.decompose(Qt.position,Qt.quaternion,Qt.scale),Qt.projectionMatrix.fromArray(ae.projectionMatrix),Qt.projectionMatrixInverse.copy(Qt.projectionMatrix).invert(),Qt.viewport.set(Re.x,Re.y,Re.width,Re.height),re===0&&(W.matrix.copy(Qt.matrix),W.matrix.decompose(W.position,W.quaternion,W.scale)),Pt===!0&&W.cameras.push(Qt)}let xt=s.enabledFeatures;if(xt&&xt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&M){f=n.getBinding();let re=f.getDepthInformation(wt[0]);re&&re.isValid&&re.texture&&x.init(re,s.renderState)}if(xt&&xt.includes("camera-access")&&M){t.state.unbindTexture(),f=n.getBinding();for(let re=0;re<wt.length;re++){let ae=wt[re].camera;if(ae){let Re=p[ae];Re||(Re=new uo,p[ae]=Re);let Qt=f.getCameraImage(ae);Re.sourceTexture=Qt}}}}for(let wt=0;wt<S.length;wt++){let Pt=E[wt],xt=S[wt];Pt!==null&&xt!==void 0&&xt.update(Pt,X,c||o)}Ce&&Ce(ct,X),X.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:X}),m=null}let Me=new pd;Me.setAnimationLoop(pe),this.setAnimationLoop=function(ct){Ce=ct},this.dispose=function(){}}},Iv=new Xe,yd=new oe;yd.set(-1,0,0,0,1,0,0,0,1);function Lv(i,t){function e(x,p){x.matrixAutoUpdate===!0&&x.updateMatrix(),p.value.copy(x.matrix)}function n(x,p){p.color.getRGB(x.fogColor.value,Sh(i)),p.isFog?(x.fogNear.value=p.near,x.fogFar.value=p.far):p.isFogExp2&&(x.fogDensity.value=p.density)}function s(x,p,P,U,b){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(x,p):p.isMeshLambertMaterial?(r(x,p),p.envMap&&(x.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(x,p),f(x,p)):p.isMeshPhongMaterial?(r(x,p),h(x,p),p.envMap&&(x.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(x,p),u(x,p),p.isMeshPhysicalMaterial&&d(x,p,b)):p.isMeshMatcapMaterial?(r(x,p),m(x,p)):p.isMeshDepthMaterial?r(x,p):p.isMeshDistanceMaterial?(r(x,p),M(x,p)):p.isMeshNormalMaterial?r(x,p):p.isLineBasicMaterial?(o(x,p),p.isLineDashedMaterial&&a(x,p)):p.isPointsMaterial?l(x,p,P,U):p.isSpriteMaterial?c(x,p):p.isShadowMaterial?(x.color.value.copy(p.color),x.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(x,p){x.opacity.value=p.opacity,p.color&&x.diffuse.value.copy(p.color),p.emissive&&x.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(x.map.value=p.map,e(p.map,x.mapTransform)),p.alphaMap&&(x.alphaMap.value=p.alphaMap,e(p.alphaMap,x.alphaMapTransform)),p.bumpMap&&(x.bumpMap.value=p.bumpMap,e(p.bumpMap,x.bumpMapTransform),x.bumpScale.value=p.bumpScale,p.side===Rn&&(x.bumpScale.value*=-1)),p.normalMap&&(x.normalMap.value=p.normalMap,e(p.normalMap,x.normalMapTransform),x.normalScale.value.copy(p.normalScale),p.side===Rn&&x.normalScale.value.negate()),p.displacementMap&&(x.displacementMap.value=p.displacementMap,e(p.displacementMap,x.displacementMapTransform),x.displacementScale.value=p.displacementScale,x.displacementBias.value=p.displacementBias),p.emissiveMap&&(x.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,x.emissiveMapTransform)),p.specularMap&&(x.specularMap.value=p.specularMap,e(p.specularMap,x.specularMapTransform)),p.alphaTest>0&&(x.alphaTest.value=p.alphaTest);let P=t.get(p),U=P.envMap,b=P.envMapRotation;U&&(x.envMap.value=U,x.envMapRotation.value.setFromMatrix4(Iv.makeRotationFromEuler(b)).transpose(),U.isCubeTexture&&U.isRenderTargetTexture===!1&&x.envMapRotation.value.premultiply(yd),x.reflectivity.value=p.reflectivity,x.ior.value=p.ior,x.refractionRatio.value=p.refractionRatio),p.lightMap&&(x.lightMap.value=p.lightMap,x.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,x.lightMapTransform)),p.aoMap&&(x.aoMap.value=p.aoMap,x.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,x.aoMapTransform))}function o(x,p){x.diffuse.value.copy(p.color),x.opacity.value=p.opacity,p.map&&(x.map.value=p.map,e(p.map,x.mapTransform))}function a(x,p){x.dashSize.value=p.dashSize,x.totalSize.value=p.dashSize+p.gapSize,x.scale.value=p.scale}function l(x,p,P,U){x.diffuse.value.copy(p.color),x.opacity.value=p.opacity,x.size.value=p.size*P,x.scale.value=U*.5,p.map&&(x.map.value=p.map,e(p.map,x.uvTransform)),p.alphaMap&&(x.alphaMap.value=p.alphaMap,e(p.alphaMap,x.alphaMapTransform)),p.alphaTest>0&&(x.alphaTest.value=p.alphaTest)}function c(x,p){x.diffuse.value.copy(p.color),x.opacity.value=p.opacity,x.rotation.value=p.rotation,p.map&&(x.map.value=p.map,e(p.map,x.mapTransform)),p.alphaMap&&(x.alphaMap.value=p.alphaMap,e(p.alphaMap,x.alphaMapTransform)),p.alphaTest>0&&(x.alphaTest.value=p.alphaTest)}function h(x,p){x.specular.value.copy(p.specular),x.shininess.value=Math.max(p.shininess,1e-4)}function f(x,p){p.gradientMap&&(x.gradientMap.value=p.gradientMap)}function u(x,p){x.metalness.value=p.metalness,p.metalnessMap&&(x.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,x.metalnessMapTransform)),x.roughness.value=p.roughness,p.roughnessMap&&(x.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,x.roughnessMapTransform)),p.envMap&&(x.envMapIntensity.value=p.envMapIntensity)}function d(x,p,P){x.ior.value=p.ior,p.sheen>0&&(x.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),x.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(x.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,x.sheenColorMapTransform)),p.sheenRoughnessMap&&(x.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,x.sheenRoughnessMapTransform))),p.clearcoat>0&&(x.clearcoat.value=p.clearcoat,x.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(x.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,x.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(x.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Rn&&x.clearcoatNormalScale.value.negate())),p.dispersion>0&&(x.dispersion.value=p.dispersion),p.retroreflectivity>0&&(x.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(x.iridescence.value=p.iridescence,x.iridescenceIOR.value=p.iridescenceIOR,x.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(x.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,x.iridescenceMapTransform)),p.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),p.transmission>0&&(x.transmission.value=p.transmission,x.transmissionSamplerMap.value=P.texture,x.transmissionSamplerSize.value.set(P.width,P.height),p.transmissionMap&&(x.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,x.transmissionMapTransform)),x.thickness.value=p.thickness,p.thicknessMap&&(x.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=p.attenuationDistance,x.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(x.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(x.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=p.specularIntensity,x.specularColor.value.copy(p.specularColor),p.specularColorMap&&(x.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,x.specularColorMapTransform)),p.specularIntensityMap&&(x.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,x.specularIntensityMapTransform))}function m(x,p){p.matcap&&(x.matcap.value=p.matcap)}function M(x,p){let P=t.get(p).light;x.referencePosition.value.setFromMatrixPosition(P.matrixWorld),x.nearDistance.value=P.shadow.camera.near,x.farDistance.value=P.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Dv(i,t,e,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,S){let E=S.program;n.uniformBlockBinding(b,E)}function c(b,S){let E=s[b.id];E===void 0&&(x(b),E=h(b),s[b.id]=E,b.addEventListener("dispose",P));let I=S.program;n.updateUBOMapping(b,I);let v=t.render.frame;r[b.id]!==v&&(u(b),r[b.id]=v)}function h(b){let S=f();b.__bindingPointIndex=S;let E=i.createBuffer(),I=b.__size,v=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,E),i.bufferData(i.UNIFORM_BUFFER,I,v),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,S,E),E}function f(){for(let b=0;b<a;b++)if(o.indexOf(b)===-1)return o.push(b),b;return se("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(b){let S=s[b.id],E=b.uniforms,I=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,S);for(let v=0,R=E.length;v<R;v++){let L=E[v];if(Array.isArray(L))for(let F=0,N=L.length;F<N;F++)d(L[F],v,F,I);else d(L,v,0,I)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(b,S,E,I){if(M(b,S,E,I)===!0){let v=b.__offset,R=b.value;if(Array.isArray(R)){let L=0;for(let F=0;F<R.length;F++){let N=R[F],W=p(N);m(N,b.__data,L),typeof N!="number"&&typeof N!="boolean"&&!N.isMatrix3&&!ArrayBuffer.isView(N)&&(L+=W.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(R,b.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,v,b.__data)}}function m(b,S,E){typeof b=="number"||typeof b=="boolean"?S[0]=b:b.isMatrix3?(S[0]=b.elements[0],S[1]=b.elements[1],S[2]=b.elements[2],S[3]=0,S[4]=b.elements[3],S[5]=b.elements[4],S[6]=b.elements[5],S[7]=0,S[8]=b.elements[6],S[9]=b.elements[7],S[10]=b.elements[8],S[11]=0):ArrayBuffer.isView(b)?S.set(new b.constructor(b.buffer,b.byteOffset,S.length)):b.toArray(S,E)}function M(b,S,E,I){let v=b.value,R=S+"_"+E;if(I[R]===void 0)return typeof v=="number"||typeof v=="boolean"?I[R]=v:ArrayBuffer.isView(v)?I[R]=v.slice():I[R]=v.clone(),!0;{let L=I[R];if(typeof v=="number"||typeof v=="boolean"){if(L!==v)return I[R]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(L.equals(v)===!1)return L.copy(v),!0}}return!1}function x(b){let S=b.uniforms,E=0,I=16;for(let R=0,L=S.length;R<L;R++){let F=Array.isArray(S[R])?S[R]:[S[R]];for(let N=0,W=F.length;N<W;N++){let B=F[N],J=Array.isArray(B.value)?B.value:[B.value];for(let ot=0,lt=J.length;ot<lt;ot++){let vt=J[ot],at=p(vt),gt=E%I,yt=gt%at.boundary,Xt=gt+yt;E+=yt,Xt!==0&&I-Xt<at.storage&&(E+=I-Xt),B.__data=new Float32Array(at.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=E,E+=at.storage}}}let v=E%I;return v>0&&(E+=I-v),b.__size=E,b.__cache={},this}function p(b){let S={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(S.boundary=4,S.storage=4):b.isVector2?(S.boundary=8,S.storage=8):b.isVector3||b.isColor?(S.boundary=16,S.storage=12):b.isVector4?(S.boundary=16,S.storage=16):b.isMatrix3?(S.boundary=48,S.storage=48):b.isMatrix4?(S.boundary=64,S.storage=64):b.isTexture?ie("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(b)?(S.boundary=16,S.storage=b.byteLength):ie("WebGLRenderer: Unsupported uniform value type.",b),S}function P(b){let S=b.target;S.removeEventListener("dispose",P);let E=o.indexOf(S.__bindingPointIndex);o.splice(E,1),i.deleteBuffer(s[S.id]),delete s[S.id],delete r[S.id]}function U(){for(let b in s)i.deleteBuffer(s[b]);o=[],s={},r={}}return{bind:l,update:c,dispose:U}}var Nv=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),bi=null;function Fv(){return bi===null&&(bi=new ns(Nv,16,16,us,en),bi.name="DFG_LUT",bi.minFilter=Ye,bi.magFilter=Ye,bi.wrapS=_i,bi.wrapT=_i,bi.generateMipmaps=!1,bi.needsUpdate=!0),bi}var Jl=class{constructor(t={}){let{canvas:e=zf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1,outputBufferType:d=Hn}=t;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=o;let M=d,x=new Set([pl,dl,fl]),p=new Set([Hn,li,wr,Tr,hl,ul]),P=new Uint32Array(4),U=new Int32Array(4),b=new G,S=null,E=null,I=[],v=[],R=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ai,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let L=this,F=!1,N=null,W=null,B=null,J=null;this._outputColorSpace=pn;let ot=0,lt=0,vt=null,at=-1,gt=null,yt=new qe,Xt=new qe,Gt=null,Ce=new ue(0),pe=0,Me=e.width,ct=e.height,X=1,wt=null,Pt=null,xt=new qe(0,0,Me,ct),Ft=new qe(0,0,Me,ct),jt=!1,re=new ao,ae=!1,Re=!1,Qt=new Xe,Te=new G,_e=new qe,Ze={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ce=!1;function De(){return vt===null?X:1}let O=n;function bt(y,k){return e.getContext(y,k)}let At,A,g,H,V,q,St,_t,K,it,D,ut,Tt,nt,qt,$t,te,z,Ct,dt,Rt,pt,Mt;try{let y={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",Ae,!1),e.addEventListener("webglcontextrestored",ve,!1),e.addEventListener("webglcontextcreationerror",an,!1),O===null){let k="webgl2";if(O=bt(k,y),O===null)throw bt(k)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Yt()}catch(y){throw e.removeEventListener("webglcontextlost",Ae,!1),e.removeEventListener("webglcontextrestored",ve,!1),e.removeEventListener("webglcontextcreationerror",an,!1),se("WebGLRenderer: "+y.message),y}function Yt(){At=new Hx(O),At.init(),Rt=new Cv(O,At),A=new Lx(O,At,t,Rt),g=new Av(O,At),A.reversedDepthBuffer&&u&&g.buffers.depth.setReversed(!0),W=O.createFramebuffer(),B=O.createFramebuffer(),J=O.createFramebuffer(),H=new Xx(O),V=new fv,q=new Ev(O,At,g,V,A,Rt,H),St=new Vx(L),_t=new Ym(O),pt=new Px(O,_t),K=new Gx(O,_t,H,pt),it=new Yx(O,K,_t,pt,H),z=new qx(O,A,q),qt=new Dx(V),D=new uv(L,St,At,A,pt,qt),ut=new Lv(L,V),Tt=new pv,nt=new yv(At),te=new Rx(L,St,g,it,m,l),$t=new Tv(L,it,A),Mt=new Dv(O,H,A,g),Ct=new Ix(O,At,H),dt=new Wx(O,At,H),H.programs=D.programs,L.capabilities=A,L.extensions=At,L.properties=V,L.renderLists=Tt,L.shadowMap=$t,L.state=g,L.info=H}M!==Hn&&(R=new Zx(M,e.width,e.height,a,s,r));let Lt=new Xh(L,O);this.xr=Lt,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){let y=At.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){let y=At.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return X},this.setPixelRatio=function(y){y!==void 0&&(X=y,this.setSize(Me,ct,!1))},this.getSize=function(y){return y.set(Me,ct)},this.setSize=function(y,k,Q=!0){if(Lt.isPresenting){ie("WebGLRenderer: Can't change size while VR device is presenting.");return}Me=y,ct=k,e.width=Math.floor(y*X),e.height=Math.floor(k*X),Q===!0&&(e.style.width=y+"px",e.style.height=k+"px"),R!==null&&R.setSize(e.width,e.height),this.setViewport(0,0,y,k)},this.getDrawingBufferSize=function(y){return y.set(Me*X,ct*X).floor()},this.setDrawingBufferSize=function(y,k,Q){Me=y,ct=k,X=Q,e.width=Math.floor(y*Q),e.height=Math.floor(k*Q),this.setViewport(0,0,y,k)},this.setEffects=function(y){if(M===Hn){se("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let k=0;k<y.length;k++)if(y[k].isOutputPass===!0){ie("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}R.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(yt)},this.getViewport=function(y){return y.copy(xt)},this.setViewport=function(y,k,Q,$){y.isVector4?xt.set(y.x,y.y,y.z,y.w):xt.set(y,k,Q,$),g.viewport(yt.copy(xt).multiplyScalar(X).round())},this.getScissor=function(y){return y.copy(Ft)},this.setScissor=function(y,k,Q,$){y.isVector4?Ft.set(y.x,y.y,y.z,y.w):Ft.set(y,k,Q,$),g.scissor(Xt.copy(Ft).multiplyScalar(X).round())},this.getScissorTest=function(){return jt},this.setScissorTest=function(y){g.setScissorTest(jt=y)},this.setOpaqueSort=function(y){wt=y},this.setTransparentSort=function(y){Pt=y},this.getClearColor=function(y){return y.copy(te.getClearColor())},this.setClearColor=function(){te.setClearColor(...arguments)},this.getClearAlpha=function(){return te.getClearAlpha()},this.setClearAlpha=function(){te.setClearAlpha(...arguments)},this.clear=function(y=!0,k=!0,Q=!0){let $=0;if(y){let Z=!1;if(vt!==null){let It=vt.texture.format;Z=x.has(It)}if(Z){let It=vt.texture.type,Ot=p.has(It),Et=te.getClearColor(),kt=te.getClearAlpha(),Vt=Et.r,ne=Et.g,fe=Et.b;Ot?(P[0]=Vt,P[1]=ne,P[2]=fe,P[3]=kt,O.clearBufferuiv(O.COLOR,0,P)):(U[0]=Vt,U[1]=ne,U[2]=fe,U[3]=kt,O.clearBufferiv(O.COLOR,0,U))}else $|=O.COLOR_BUFFER_BIT}k&&($|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Q&&($|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),$!==0&&O.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),N=y},this.dispose=function(){e.removeEventListener("webglcontextlost",Ae,!1),e.removeEventListener("webglcontextrestored",ve,!1),e.removeEventListener("webglcontextcreationerror",an,!1),te.dispose(),Tt.dispose(),nt.dispose(),V.dispose(),St.dispose(),it.dispose(),pt.dispose(),Mt.dispose(),D.dispose(),Lt.dispose(),Lt.removeEventListener("sessionstart",Gi),Lt.removeEventListener("sessionend",ye),ln.stop()};function Ae(y){y.preventDefault(),vh("WebGLRenderer: Context Lost."),F=!0}function ve(){vh("WebGLRenderer: Context Restored."),F=!1;let y=H.autoReset,k=$t.enabled,Q=$t.autoUpdate,$=$t.needsUpdate,Z=$t.type;Yt(),H.autoReset=y,$t.enabled=k,$t.autoUpdate=Q,$t.needsUpdate=$,$t.type=Z}function an(y){se("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Nn(y){let k=y.target;k.removeEventListener("dispose",Nn),Zn(k)}function Zn(y){Se(y),V.remove(y)}function Se(y){let k=V.get(y).programs;k!==void 0&&(k.forEach(function(Q){D.releaseProgram(Q)}),y.isShaderMaterial&&D.releaseShaderCache(y))}this.renderBufferDirect=function(y,k,Q,$,Z,It){k===null&&(k=Ze);let Ot=Z.isMesh&&Z.matrixWorld.determinantAffine()<0,Et=Vr(y,k,Q,$,Z);g.setMaterial($,Ot);let kt=Q.index,Vt=1;if($.wireframe===!0){if(kt=K.getWireframeAttribute(Q),kt===void 0)return;Vt=2}let ne=Q.drawRange,fe=Q.attributes.position,zt=ne.start*Vt,be=(ne.start+ne.count)*Vt;It!==null&&(zt=Math.max(zt,It.start*Vt),be=Math.min(be,(It.start+It.count)*Vt)),kt!==null?(zt=Math.max(zt,0),be=Math.min(be,kt.count)):fe!=null&&(zt=Math.max(zt,0),be=Math.min(be,fe.count));let ke=be-zt;if(ke<0||ke===1/0)return;pt.setup(Z,$,Et,Q,kt);let Ie,Le=Ct;if(kt!==null&&(Ie=_t.get(kt),Le=dt,Le.setIndex(Ie)),Z.isMesh)$.wireframe===!0?(g.setLineWidth($.wireframeLinewidth*De()),Le.setMode(O.LINES)):Le.setMode(O.TRIANGLES);else if(Z.isLine){let Qe=$.linewidth;Qe===void 0&&(Qe=1),g.setLineWidth(Qe*De()),Z.isLineSegments?Le.setMode(O.LINES):Z.isLineLoop?Le.setMode(O.LINE_LOOP):Le.setMode(O.LINE_STRIP)}else Z.isPoints?Le.setMode(O.POINTS):Z.isSprite&&Le.setMode(O.TRIANGLES);if(Z.isBatchedMesh)if(At.get("WEBGL_multi_draw"))Le.renderMultiDraw(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount);else{let Qe=Z._multiDrawStarts,Ut=Z._multiDrawCounts,tn=Z._multiDrawCount,me=kt?_t.get(kt).bytesPerElement:1,Ue=V.get($).currentProgram.getUniforms();for(let dn=0;dn<tn;dn++)Ue.setValue(O,"_gl_DrawID",dn),Le.render(Qe[dn]/me,Ut[dn])}else if(Z.isInstancedMesh)Le.renderInstances(zt,ke,Z.count);else if(Q.isInstancedBufferGeometry){let Qe=Q._maxInstanceCount!==void 0?Q._maxInstanceCount:1/0,Ut=Math.min(Q.instanceCount,Qe);Le.renderInstances(zt,ke,Ut)}else Le.render(zt,ke)};function le(y,k,Q,$){N!==null&&y.isNodeMaterial&&N.setObject($,y),ae===!0&&qt.setState(y,Q,!1),y.transparent===!0&&y.side===Mi&&y.forceSinglePass===!1?(y.side=Rn,y.needsUpdate=!0,Wi(y,k,$),y.side=as,y.needsUpdate=!0,Wi(y,k,$),y.side=Mi):Wi(y,k,$)}this.compile=function(y,k,Q=null){Q===null&&(Q=y),N!==null&&N.renderStart(y,k,Q),E=nt.get(Q),E.init(k),v.push(E),Q.traverseVisible(function(Z){Z.isLight&&Z.layers.test(k.layers)&&(E.pushLight(Z),Z.castShadow&&E.pushShadow(Z))}),y!==Q&&y.traverseVisible(function(Z){Z.isLight&&Z.layers.test(k.layers)&&(E.pushLight(Z),Z.castShadow&&E.pushShadow(Z))}),E.setupLights(),N!==null&&N.updateLights(E.state.lightsArray),Re=this.localClippingEnabled,ae=qt.init(this.clippingPlanes,Re),ae===!0&&qt.setGlobalState(this.clippingPlanes,k),N!==null&&$t.render(E.state.shadowsArray,Q,k);let $=new Set;return y.traverse(function(Z){if(!(Z.isMesh||Z.isPoints||Z.isLine||Z.isSprite))return;let It=Z.material;if(It)if(Array.isArray(It))for(let Ot=0;Ot<It.length;Ot++){let Et=It[Ot];le(Et,Q,k,Z),$.add(Et)}else le(It,Q,k,Z),$.add(It)}),E=v.pop(),N!==null&&N.renderEnd(),$},this.compileAsync=function(y,k,Q=null){let $=this.compile(y,k,Q);return new Promise(Z=>{function It(){if($.forEach(function(Ot){let kt=V.get(Ot).currentProgram;(kt===void 0||kt.isReady())&&$.delete(Ot)}),$.size===0){Z(y);return}setTimeout(It,10)}At.get("KHR_parallel_shader_compile")!==null?It():setTimeout(It,10)})};let Pe=null;function Kn(y){Pe&&Pe(y)}function Gi(){ln.stop()}function ye(){ln.start()}let ln=new pd;ln.setAnimationLoop(Kn),typeof self<"u"&&ln.setContext(self),this.setAnimationLoop=function(y){Pe=y,Lt.setAnimationLoop(y),y===null?ln.stop():ln.start()},Lt.addEventListener("sessionstart",Gi),Lt.addEventListener("sessionend",ye),this.render=function(y,k){if(k!==void 0&&k.isCamera!==!0){se("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===!0)return;N!==null&&N.renderStart(y,k);let Q=Lt.enabled===!0&&Lt.isPresenting===!0,$=R!==null&&(vt===null||Q)&&R.begin(L,vt);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),Lt.enabled===!0&&Lt.isPresenting===!0&&(R===null||R.isCompositing()===!1)&&(Lt.cameraAutoUpdate===!0&&Lt.updateCamera(k),k=Lt.getCamera()),y.isScene===!0&&y.onBeforeRender(L,y,k,vt),E=nt.get(y,v.length),E.init(k),E.state.textureUnits=q.getTextureUnits(),v.push(E),Qt.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),re.setFromProjectionMatrix(Qt,si,k.reversedDepth),Re=this.localClippingEnabled,ae=qt.init(this.clippingPlanes,Re),S=Tt.get(y,I.length),S.init(),I.push(S),Lt.enabled===!0&&Lt.isPresenting===!0){let Ot=L.xr.getDepthSensingMesh();Ot!==null&&ee(Ot,k,-1/0,L.sortObjects)}ee(y,k,0,L.sortObjects),S.finish(),N!==null&&N.updateLights(E.state.lightsArray),L.sortObjects===!0&&S.sort(wt,Pt),ce=Lt.enabled===!1||Lt.isPresenting===!1||Lt.hasDepthSensing()===!1,ce&&te.addToRenderList(S,y),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ae===!0&&qt.beginShadows();let Z=E.state.shadowsArray;if($t.render(Z,y,k),ae===!0&&qt.endShadows(),($&&R.hasRenderPass())===!1){let Ot=S.opaque,Et=S.transmissive;if(E.setupLights(),k.isArrayCamera){let kt=k.cameras;if(Et.length>0)for(let Vt=0,ne=kt.length;Vt<ne;Vt++){let fe=kt[Vt];bn(Ot,Et,y,fe)}ce&&te.render(y);for(let Vt=0,ne=kt.length;Vt<ne;Vt++){let fe=kt[Vt];cn(S,y,fe,fe.viewport)}}else Et.length>0&&bn(Ot,Et,y,k),ce&&te.render(y),cn(S,y,k)}vt!==null&&lt===0&&(q.updateMultisampleRenderTarget(vt),q.updateRenderTargetMipmap(vt)),$&&R.end(L),y.isScene===!0&&y.onAfterRender(L,y,k),pt.resetDefaultState(),at=-1,gt=null,v.pop(),v.length>0?(E=v[v.length-1],q.setTextureUnits(E.state.textureUnits),ae===!0&&qt.setGlobalState(L.clippingPlanes,E.state.camera)):E=null,I.pop(),I.length>0?S=I[I.length-1]:S=null,N!==null&&N.renderEnd()};function ee(y,k,Q,$){if(y.visible===!1)return;if(y.layers.test(k.layers)){if(y.isGroup)Q=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(k);else if(y.isLightProbeGrid)E.pushLightProbeGrid(y);else if(y.isLight)E.pushLight(y),y.castShadow&&E.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||y.intersectsFrustum(re)){$&&_e.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Qt);let Ot=it.update(y),Et=y.material;Et.visible&&S.push(y,Ot,Et,Q,_e.z,null,k)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||y.intersectsFrustum(re))){let Ot=it.update(y),Et=y.material;if($&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),_e.copy(y.boundingSphere.center)):(Ot.boundingSphere===null&&Ot.computeBoundingSphere(),_e.copy(Ot.boundingSphere.center)),_e.applyMatrix4(y.matrixWorld).applyMatrix4(Qt)),Array.isArray(Et)){let kt=Ot.groups;for(let Vt=0,ne=kt.length;Vt<ne;Vt++){let fe=kt[Vt],zt=Et[fe.materialIndex];zt&&zt.visible&&S.push(y,Ot,zt,Q,_e.z,fe,k)}}else Et.visible&&S.push(y,Ot,Et,Q,_e.z,null,k)}}let It=y.children;for(let Ot=0,Et=It.length;Ot<Et;Ot++)ee(It[Ot],k,Q,$)}function cn(y,k,Q,$){let{opaque:Z,transmissive:It,transparent:Ot}=y;E.setupLightsView(Q),ae===!0&&qt.setGlobalState(L.clippingPlanes,Q),$&&g.viewport(yt.copy($)),Z.length>0&&di(Z,k,Q),It.length>0&&di(It,k,Q),Ot.length>0&&di(Ot,k,Q),g.buffers.depth.setTest(!0),g.buffers.depth.setMask(!0),g.buffers.color.setMask(!0),g.setPolygonOffset(!1)}function bn(y,k,Q,$){if((Q.isScene===!0?Q.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[$.id]===void 0){let zt=At.has("EXT_color_buffer_half_float")||At.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[$.id]=new $e(1,1,{generateMipmaps:!0,type:zt?en:Hn,minFilter:cs,samples:Math.max(4,A.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ge.workingColorSpace})}let It=E.state.transmissionRenderTarget[$.id],Ot=$.viewport||yt;It.setSize(Ot.z*L.transmissionResolutionScale,Ot.w*L.transmissionResolutionScale);let Et=L.getRenderTarget(),kt=L.getActiveCubeFace(),Vt=L.getActiveMipmapLevel();L.setRenderTarget(It),L.getClearColor(Ce),pe=L.getClearAlpha(),pe<1&&L.setClearColor(16777215,.5),L.clear(),ce&&te.render(Q);let ne=L.toneMapping;L.toneMapping=ai;let fe=$.viewport;if($.viewport!==void 0&&($.viewport=void 0),E.setupLightsView($),ae===!0&&qt.setGlobalState(L.clippingPlanes,$),di(y,Q,$),q.updateMultisampleRenderTarget(It),q.updateRenderTargetMipmap(It),At.has("WEBGL_multisampled_render_to_texture")===!1){let zt=!1;for(let be=0,ke=k.length;be<ke;be++){let Ie=k[be],{object:Le,geometry:Qe,material:Ut,group:tn}=Ie;if(Ut.side===Mi&&Le.layers.test($.layers)){let me=Ut.side;Ut.side=Rn,Ut.needsUpdate=!0,qs(Le,Q,$,Qe,Ut,tn),Ut.side=me,Ut.needsUpdate=!0,zt=!0}}zt===!0&&(q.updateMultisampleRenderTarget(It),q.updateRenderTargetMipmap(It))}L.setRenderTarget(Et,kt,Vt),L.setClearColor(Ce,pe),fe!==void 0&&($.viewport=fe),L.toneMapping=ne}function di(y,k,Q){let $=k.isScene===!0?k.overrideMaterial:null;for(let Z=0,It=y.length;Z<It;Z++){let Ot=y[Z],{object:Et,geometry:kt,group:Vt}=Ot,ne=Ot.material;ne.allowOverride===!0&&$!==null&&(ne=$),Et.layers.test(Q.layers)&&qs(Et,k,Q,kt,ne,Vt)}}function qs(y,k,Q,$,Z,It){N!==null&&Z.isNodeMaterial&&N.setObject(y,Z),y.onBeforeRender(L,k,Q,$,Z,It),y.modelViewMatrix.multiplyMatrices(Q.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),Z.onBeforeRender(L,k,Q,$,y,It),Z.transparent===!0&&Z.side===Mi&&Z.forceSinglePass===!1?(Z.side=Rn,Z.needsUpdate=!0,L.renderBufferDirect(Q,k,$,Z,y,It),Z.side=as,Z.needsUpdate=!0,L.renderBufferDirect(Q,k,$,Z,y,It),Z.side=Mi):L.renderBufferDirect(Q,k,$,Z,y,It),y.onAfterRender(L,k,Q,$,Z,It)}function Wi(y,k,Q){k.isScene!==!0&&(k=Ze);let $=V.get(y),Z=E.state.lights,It=E.state.shadowsArray,Ot=Z.state.version,Et=D.getParameters(y,Z.state,It,k,Q,E.state.lightProbeGridArray),kt=D.getProgramCacheKey(Et),Vt=$.programs;$.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?k.environment:null,$.fog=k.fog;let ne=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;$.envMap=St.get(y.envMap||$.environment,ne),$.envMapRotation=$.environment!==null&&y.envMap===null?k.environmentRotation:y.envMapRotation,Vt===void 0&&(y.addEventListener("dispose",Nn),Vt=new Map,$.programs=Vt);let fe=Vt.get(kt);if(fe!==void 0){if($.currentProgram===fe&&$.lightsStateVersion===Ot)return qo(y,Et),fe}else Et.uniforms=D.getUniforms(y),N!==null&&y.isNodeMaterial&&N.build(y,Q,Et),y.onBeforeCompile(Et,L),fe=D.acquireProgram(Et,kt),Vt.set(kt,fe),$.uniforms=Et.uniforms;let zt=$.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(zt.clippingPlanes=qt.uniform),qo(y,Et),$.needsLights=yc(y),$.lightsStateVersion=Ot,$.needsLights&&(zt.ambientLightColor.value=Z.state.ambient,zt.lightProbe.value=Z.state.probe,zt.sunLights.value=Z.state.sun,zt.sunLightShadows.value=Z.state.sunShadow,zt.directionalLights.value=Z.state.directional,zt.directionalLightShadows.value=Z.state.directionalShadow,zt.spotLights.value=Z.state.spot,zt.spotLightShadows.value=Z.state.spotShadow,zt.rectAreaLights.value=Z.state.rectArea,zt.ltc_1.value=Z.state.rectAreaLTC1,zt.ltc_2.value=Z.state.rectAreaLTC2,zt.pointLights.value=Z.state.point,zt.pointLightShadows.value=Z.state.pointShadow,zt.hemisphereLights.value=Z.state.hemi,zt.sunShadowMatrix.value=Z.state.sunShadowMatrix,zt.sunShadowCascade.value=Z.state.sunShadowCascade,zt.directionalShadowMatrix.value=Z.state.directionalShadowMatrix,zt.spotLightMatrix.value=Z.state.spotLightMatrix,zt.spotLightMap.value=Z.state.spotLightMap,zt.pointShadowMatrix.value=Z.state.pointShadowMatrix),$.lightProbeGrid=E.state.lightProbeGridArray.length>0,$.currentProgram=fe,$.uniformsList=null,fe}function pi(y){if(y.uniformsList===null){let k=y.currentProgram.getUniforms();y.uniformsList=Rr.seqWithValue(k.seq,y.uniforms)}return y.uniformsList}function qo(y,k){let Q=V.get(y);Q.outputColorSpace=k.outputColorSpace,Q.batching=k.batching,Q.batchingColor=k.batchingColor,Q.instancing=k.instancing,Q.instancingColor=k.instancingColor,Q.instancingMorph=k.instancingMorph,Q.skinning=k.skinning,Q.morphTargets=k.morphTargets,Q.morphNormals=k.morphNormals,Q.morphColors=k.morphColors,Q.morphTargetsCount=k.morphTargetsCount,Q.numClippingPlanes=k.numClippingPlanes,Q.numIntersection=k.numClipIntersection,Q.vertexAlphas=k.vertexAlphas,Q.vertexTangents=k.vertexTangents,Q.toneMapping=k.toneMapping}function zr(y,k){if(y.length===0)return null;if(y.length===1)return y[0].texture!==null?y[0]:null;b.setFromMatrixPosition(k.matrixWorld);for(let Q=0,$=y.length;Q<$;Q++){let Z=y[Q];if(Z.texture!==null&&Z.boundingBox.containsPoint(b))return Z}return null}function Vr(y,k,Q,$,Z){k.isScene!==!0&&(k=Ze),q.resetTextureUnits();let It=k.fog,Ot=$.isMeshStandardMaterial||$.isMeshLambertMaterial||$.isMeshPhongMaterial?k.environment:null,Et=vt===null?L.outputColorSpace:vt.isXRRenderTarget===!0?vt.texture.colorSpace:ge.workingColorSpace,kt=$.isMeshStandardMaterial||$.isMeshLambertMaterial&&!$.envMap||$.isMeshPhongMaterial&&!$.envMap,Vt=St.get($.envMap||Ot,kt),ne=$.vertexColors===!0&&!!Q.attributes.color&&Q.attributes.color.itemSize===4,fe=!!Q.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),zt=!!Q.morphAttributes.position,be=!!Q.morphAttributes.normal,ke=!!Q.morphAttributes.color,Ie=ai;$.toneMapped&&(vt===null||vt.isXRRenderTarget===!0)&&(Ie=L.toneMapping);let Le=Q.morphAttributes.position||Q.morphAttributes.normal||Q.morphAttributes.color,Qe=Le!==void 0?Le.length:0,Ut=V.get($),tn=E.state.lights;if(ae===!0&&(Re===!0||y!==gt)){let Fe=y===gt&&$.id===at;qt.setState($,y,Fe)}let me=!1;$.version===Ut.__version?(Ut.needsLights&&Ut.lightsStateVersion!==tn.state.version||Ut.outputColorSpace!==Et||Z.isBatchedMesh&&Ut.batching===!1||!Z.isBatchedMesh&&Ut.batching===!0||Z.isBatchedMesh&&Ut.batchingColor===!0&&Z._colorsTexture===null||Z.isBatchedMesh&&Ut.batchingColor===!1&&Z._colorsTexture!==null||Z.isInstancedMesh&&Ut.instancing===!1||!Z.isInstancedMesh&&Ut.instancing===!0||Z.isSkinnedMesh&&Ut.skinning===!1||!Z.isSkinnedMesh&&Ut.skinning===!0||Z.isInstancedMesh&&Ut.instancingColor===!0&&Z.instanceColor===null||Z.isInstancedMesh&&Ut.instancingColor===!1&&Z.instanceColor!==null||Z.isInstancedMesh&&Ut.instancingMorph===!0&&Z.morphTexture===null||Z.isInstancedMesh&&Ut.instancingMorph===!1&&Z.morphTexture!==null||Ut.envMap!==Vt||$.fog===!0&&Ut.fog!==It||Ut.numClippingPlanes!==void 0&&(Ut.numClippingPlanes!==qt.numPlanes||Ut.numIntersection!==qt.numIntersection)||Ut.vertexAlphas!==ne||Ut.vertexTangents!==fe||Ut.morphTargets!==zt||Ut.morphNormals!==be||Ut.morphColors!==ke||Ut.toneMapping!==Ie||Ut.morphTargetsCount!==Qe||!!Ut.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(me=!0):(me=!0,Ut.__version=$.version);let Ue=Ut.currentProgram;me===!0&&(Ue=Wi($,k,Z),N&&$.isNodeMaterial&&N.onUpdateProgram($,Ue,Ut));let dn=!1,Fn=!1,Xi=!1,we=Ue.getUniforms(),ze=Ut.uniforms;if(g.useProgram(Ue.program)&&(dn=!0,Fn=!0,Xi=!0),$.id!==at&&(at=$.id,Fn=!0),Ut.needsLights){let Fe=zr(E.state.lightProbeGridArray,Z);Ut.lightProbeGrid!==Fe&&(Ut.lightProbeGrid=Fe,Fn=!0)}if(dn||gt!==y){g.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),we.setValue(O,"projectionMatrix",y.projectionMatrix),we.setValue(O,"viewMatrix",y.matrixWorldInverse);let gi=we.map.cameraPosition;gi!==void 0&&gi.setValue(O,Te.setFromMatrixPosition(y.matrixWorld)),A.logarithmicDepthBuffer&&we.setValue(O,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&we.setValue(O,"isOrthographic",y.isOrthographicCamera===!0),gt!==y&&(gt=y,Fn=!0,Xi=!0)}if(Ut.needsLights&&(tn.state.sunShadowMap.length>0&&we.setValue(O,"sunShadowMap",tn.state.sunShadowMap,q),tn.state.directionalShadowMap.length>0&&we.setValue(O,"directionalShadowMap",tn.state.directionalShadowMap,q),tn.state.spotShadowMap.length>0&&we.setValue(O,"spotShadowMap",tn.state.spotShadowMap,q),tn.state.pointShadowMap.length>0&&we.setValue(O,"pointShadowMap",tn.state.pointShadowMap,q)),Z.isSkinnedMesh){we.setOptional(O,Z,"bindMatrix"),we.setOptional(O,Z,"bindMatrixInverse");let Fe=Z.skeleton;Fe&&(Fe.boneTexture===null&&Fe.computeBoneTexture(),we.setValue(O,"boneTexture",Fe.boneTexture,q))}Z.isBatchedMesh&&(we.setOptional(O,Z,"batchingTexture"),we.setValue(O,"batchingTexture",Z._matricesTexture,q),we.setOptional(O,Z,"batchingIdTexture"),we.setValue(O,"batchingIdTexture",Z._indirectTexture,q),we.setOptional(O,Z,"batchingColorTexture"),Z._colorsTexture!==null&&we.setValue(O,"batchingColorTexture",Z._colorsTexture,q));let mi=Q.morphAttributes;if((mi.position!==void 0||mi.normal!==void 0||mi.color!==void 0)&&z.update(Z,Q,Ue),(Fn||Ut.receiveShadow!==Z.receiveShadow)&&(Ut.receiveShadow=Z.receiveShadow,we.setValue(O,"receiveShadow",Z.receiveShadow)),($.isMeshStandardMaterial||$.isMeshLambertMaterial||$.isMeshPhongMaterial)&&$.envMap===null&&k.environment!==null&&(ze.envMapIntensity.value=k.environmentIntensity),ze.dfgLUT!==void 0&&(ze.dfgLUT.value=Fv()),Fn){if(we.setValue(O,"toneMappingExposure",L.toneMappingExposure),Ut.needsLights&&Yo(ze,Xi),It&&$.fog===!0&&ut.refreshFogUniforms(ze,It),ut.refreshMaterialUniforms(ze,$,X,ct,E.state.transmissionRenderTarget[y.id]),Ut.needsLights&&Ut.lightProbeGrid){let Fe=Ut.lightProbeGrid;ze.probesSH.value=Fe.texture,ze.probesMin.value.copy(Fe.boundingBox.min),ze.probesMax.value.copy(Fe.boundingBox.max),ze.probesResolution.value.copy(Fe.resolution)}Rr.upload(O,pi(Ut),ze,q)}if($.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(Rr.upload(O,pi(Ut),ze,q),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&we.setValue(O,"center",Z.center),we.setValue(O,"modelViewMatrix",Z.modelViewMatrix),we.setValue(O,"normalMatrix",Z.normalMatrix),we.setValue(O,"modelMatrix",Z.matrixWorld),$.uniformsGroups!==void 0){let Fe=$.uniformsGroups;for(let gi=0,Jn=Fe.length;gi<Jn;gi++){let Hr=Fe[gi];Mt.update(Hr,Ue),Mt.bind(Hr,Ue)}}return Ue}function Yo(y,k){y.ambientLightColor.needsUpdate=k,y.lightProbe.needsUpdate=k,y.sunLights.needsUpdate=k,y.sunLightShadows.needsUpdate=k,y.directionalLights.needsUpdate=k,y.directionalLightShadows.needsUpdate=k,y.pointLights.needsUpdate=k,y.pointLightShadows.needsUpdate=k,y.spotLights.needsUpdate=k,y.spotLightShadows.needsUpdate=k,y.rectAreaLights.needsUpdate=k,y.hemisphereLights.needsUpdate=k}function yc(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return ot},this.getActiveMipmapLevel=function(){return lt},this.getRenderTarget=function(){return vt},this.setRenderTargetTextures=function(y,k,Q){let $=V.get(y);$.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,$.__autoAllocateDepthBuffer===!1&&($.__useRenderToTexture=!1),V.get(y.texture).__webglTexture=k,V.get(y.depthTexture).__webglTexture=$.__autoAllocateDepthBuffer?void 0:Q,$.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,k){let Q=V.get(y);Q.__webglFramebuffer=k,Q.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(y,k=0,Q=0){vt=y,ot=k,lt=Q;let $=null,Z=!1,It=!1;if(y){let Et=V.get(y);if(Et.__useDefaultFramebuffer!==void 0){g.bindFramebuffer(O.FRAMEBUFFER,Et.__webglFramebuffer),yt.copy(y.viewport),Xt.copy(y.scissor),Gt=y.scissorTest,g.viewport(yt),g.scissor(Xt),g.setScissorTest(Gt),at=-1;return}else if(Et.__webglFramebuffer===void 0)q.setupRenderTarget(y);else if(Et.__hasExternalTextures)q.rebindTextures(y,V.get(y.texture).__webglTexture,V.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){let ne=y.depthTexture;if(Et.__boundDepthTexture!==ne){if(ne!==null&&V.has(ne)&&(y.width!==ne.image.width||y.height!==ne.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");q.setupDepthRenderbuffer(y)}}let kt=y.texture;(kt.isData3DTexture||kt.isDataArrayTexture||kt.isCompressedArrayTexture)&&(It=!0);let Vt=V.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Vt[k])?$=Vt[k][Q]:$=Vt[k],Z=!0):y.samples>0&&q.useMultisampledRTT(y)===!1?$=V.get(y).__webglMultisampledFramebuffer:Array.isArray(Vt)?$=Vt[Q]:$=Vt,yt.copy(y.viewport),Xt.copy(y.scissor),Gt=y.scissorTest}else yt.copy(xt).multiplyScalar(X).floor(),Xt.copy(Ft).multiplyScalar(X).floor(),Gt=jt;if(Q!==0&&($=W),g.bindFramebuffer(O.FRAMEBUFFER,$)&&g.drawBuffers(y,$),g.viewport(yt),g.scissor(Xt),g.setScissorTest(Gt),Z){let Et=V.get(y.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+k,Et.__webglTexture,Q)}else if(It){let Et=k;for(let kt=0;kt<y.textures.length;kt++){let Vt=V.get(y.textures[kt]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+kt,Vt.__webglTexture,Q,Et)}}else if(y!==null&&Q!==0){let Et=V.get(y.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Et.__webglTexture,Q)}at=-1};function Xn(y){let k=V.get(y);return(k.__readFormat!==y.format||k.__readType!==y.type)&&(k.__readFormat=y.format,k.__readType=y.type,k.__formatReadable=A.textureFormatReadable(y.format),k.__typeReadable=A.textureTypeReadable(y.type)),k}this.readRenderTargetPixels=function(y,k,Q,$,Z,It,Ot,Et=0){if(!(y&&y.isWebGLRenderTarget)){se("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let kt=V.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Ot!==void 0&&(kt=kt[Ot]),kt){g.bindFramebuffer(O.FRAMEBUFFER,kt);try{let Vt=y.textures[Et],ne=Vt.format,fe=Vt.type;y.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Et);let zt=Xn(Vt);if(zt.__formatReadable===!1){se("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(zt.__typeReadable===!1){se("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=y.width-$&&Q>=0&&Q<=y.height-Z&&O.readPixels(k,Q,$,Z,Rt.convert(ne),Rt.convert(fe),It)}finally{let Vt=vt!==null?V.get(vt).__webglFramebuffer:null;g.bindFramebuffer(O.FRAMEBUFFER,Vt)}}},this.readRenderTargetPixelsAsync=async function(y,k,Q,$,Z,It,Ot,Et=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let kt=V.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Ot!==void 0&&(kt=kt[Ot]),kt)if(k>=0&&k<=y.width-$&&Q>=0&&Q<=y.height-Z){g.bindFramebuffer(O.FRAMEBUFFER,kt);let Vt=y.textures[Et],ne=Vt.format,fe=Vt.type;y.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+Et);let zt=Xn(Vt);if(zt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(zt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let be=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,be),O.bufferData(O.PIXEL_PACK_BUFFER,It.byteLength,O.STREAM_READ),O.readPixels(k,Q,$,Z,Rt.convert(ne),Rt.convert(fe),0),O.bindBuffer(O.PIXEL_PACK_BUFFER,null);let ke=vt!==null?V.get(vt).__webglFramebuffer:null;g.bindFramebuffer(O.FRAMEBUFFER,ke);let Ie=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await Hf(O,Ie,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,be),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,It),O.bindBuffer(O.PIXEL_PACK_BUFFER,null),O.deleteBuffer(be),O.deleteSync(Ie),It}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,k=null,Q=0){let $=Math.pow(2,-Q),Z=Math.floor(y.image.width*$),It=Math.floor(y.image.height*$),Ot=k!==null?k.x:0,Et=k!==null?k.y:0;q.setTexture2D(y,0),O.copyTexSubImage2D(O.TEXTURE_2D,Q,0,0,Ot,Et,Z,It),g.unbindTexture()},this.copyTextureToTexture=function(y,k,Q=null,$=null,Z=0,It=0){let Ot,Et,kt,Vt,ne,fe,zt,be,ke,Ie=y.isCompressedTexture?y.mipmaps[It]:y.image;if(Q!==null)Ot=Q.max.x-Q.min.x,Et=Q.max.y-Q.min.y,kt=Q.isBox3?Q.max.z-Q.min.z:1,Vt=Q.min.x,ne=Q.min.y,fe=Q.isBox3?Q.min.z:0;else{let ze=Math.pow(2,-Z);Ot=Math.floor(Ie.width*ze),Et=Math.floor(Ie.height*ze),y.isDataArrayTexture?kt=Ie.depth:y.isData3DTexture?kt=Math.floor(Ie.depth*ze):kt=1,Vt=0,ne=0,fe=0}$!==null?(zt=$.x,be=$.y,ke=$.z):(zt=0,be=0,ke=0);let Le=Rt.convert(k.format),Qe=Rt.convert(k.type),Ut;k.isData3DTexture?(q.setTexture3D(k,0),Ut=O.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(q.setTexture2DArray(k,0),Ut=O.TEXTURE_2D_ARRAY):(q.setTexture2D(k,0),Ut=O.TEXTURE_2D),g.activeTexture(O.TEXTURE0),g.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,k.flipY),g.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),g.pixelStorei(O.UNPACK_ALIGNMENT,k.unpackAlignment);let tn=g.getParameter(O.UNPACK_ROW_LENGTH),me=g.getParameter(O.UNPACK_IMAGE_HEIGHT),Ue=g.getParameter(O.UNPACK_SKIP_PIXELS),dn=g.getParameter(O.UNPACK_SKIP_ROWS),Fn=g.getParameter(O.UNPACK_SKIP_IMAGES);g.pixelStorei(O.UNPACK_ROW_LENGTH,Ie.width),g.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Ie.height),g.pixelStorei(O.UNPACK_SKIP_PIXELS,Vt),g.pixelStorei(O.UNPACK_SKIP_ROWS,ne),g.pixelStorei(O.UNPACK_SKIP_IMAGES,fe);let Xi=y.isDataArrayTexture||y.isData3DTexture,we=k.isDataArrayTexture||k.isData3DTexture;if(y.isDepthTexture){let ze=V.get(y),mi=V.get(k),Fe=V.get(ze.__renderTarget),gi=V.get(mi.__renderTarget);g.bindFramebuffer(O.READ_FRAMEBUFFER,Fe.__webglFramebuffer),g.bindFramebuffer(O.DRAW_FRAMEBUFFER,gi.__webglFramebuffer);for(let Jn=0;Jn<kt;Jn++)Xi&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,V.get(y).__webglTexture,Z,fe+Jn),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,V.get(k).__webglTexture,It,ke+Jn)),O.blitFramebuffer(Vt,ne,Ot,Et,zt,be,Ot,Et,O.DEPTH_BUFFER_BIT,O.NEAREST);g.bindFramebuffer(O.READ_FRAMEBUFFER,null),g.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(Z!==0||y.isRenderTargetTexture||V.has(y)){let ze=V.get(y),mi=V.get(k);g.bindFramebuffer(O.READ_FRAMEBUFFER,B),g.bindFramebuffer(O.DRAW_FRAMEBUFFER,J);for(let Fe=0;Fe<kt;Fe++)Xi?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,ze.__webglTexture,Z,fe+Fe):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,ze.__webglTexture,Z),we?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,mi.__webglTexture,It,ke+Fe):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,mi.__webglTexture,It),Z!==0?O.blitFramebuffer(Vt,ne,Ot,Et,zt,be,Ot,Et,O.COLOR_BUFFER_BIT,O.NEAREST):we?O.copyTexSubImage3D(Ut,It,zt,be,ke+Fe,Vt,ne,Ot,Et):O.copyTexSubImage2D(Ut,It,zt,be,Vt,ne,Ot,Et);g.bindFramebuffer(O.READ_FRAMEBUFFER,null),g.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else we?y.isDataTexture||y.isData3DTexture?O.texSubImage3D(Ut,It,zt,be,ke,Ot,Et,kt,Le,Qe,Ie.data):k.isCompressedArrayTexture?O.compressedTexSubImage3D(Ut,It,zt,be,ke,Ot,Et,kt,Le,Ie.data):O.texSubImage3D(Ut,It,zt,be,ke,Ot,Et,kt,Le,Qe,Ie):y.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,It,zt,be,Ot,Et,Le,Qe,Ie.data):y.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,It,zt,be,Ie.width,Ie.height,Le,Ie.data):O.texSubImage2D(O.TEXTURE_2D,It,zt,be,Ot,Et,Le,Qe,Ie);g.pixelStorei(O.UNPACK_ROW_LENGTH,tn),g.pixelStorei(O.UNPACK_IMAGE_HEIGHT,me),g.pixelStorei(O.UNPACK_SKIP_PIXELS,Ue),g.pixelStorei(O.UNPACK_SKIP_ROWS,dn),g.pixelStorei(O.UNPACK_SKIP_IMAGES,Fn),It===0&&k.generateMipmaps&&O.generateMipmap(Ut),g.unbindTexture()},this.initRenderTarget=function(y){V.get(y).__webglFramebuffer===void 0&&q.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?q.setTextureCube(y,0):y.isData3DTexture?q.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?q.setTexture2DArray(y,0):q.setTexture2D(y,0),g.unbindTexture()},this.resetState=function(){ot=0,lt=0,vt=null,g.reset(),pt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return si}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=ge._getDrawingBufferColorSpace(t),e.unpackColorSpace=ge._getUnpackColorSpace()}};var Sd={type:"change"},Yh={type:"start"},wd={type:"end"},tc=new es,bd=new mn,Uv=Math.cos(70*Mh.DEG2RAD),rn=new G,Ln=2*Math.PI,Ne={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},qh=1e-6,ec=class extends _o{constructor(t,e=null){super(t,e),this.state=Ne.NONE,this.target=new G,this.cursor=new G,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Yn.ROTATE,MIDDLE:Yn.DOLLY,RIGHT:Yn.PAN},this.touches={ONE:oi.ROTATE,TWO:oi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new G,this._lastQuaternion=new kn,this._lastTargetPosition=new G,this._quat=new kn().setFromUnitVectors(t.up,new G(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new yi,this._sphericalDelta=new yi,this._scale=1,this._panOffset=new G,this._rotateStart=new Wt,this._rotateEnd=new Wt,this._rotateDelta=new Wt,this._panStart=new Wt,this._panEnd=new Wt,this._panDelta=new Wt,this._dollyStart=new Wt,this._dollyEnd=new Wt,this._dollyDelta=new Wt,this._dollyDirection=new G,this._mouse=new Wt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Bv.bind(this),this._onPointerDown=Ov.bind(this),this._onPointerUp=kv.bind(this),this._onContextMenu=qv.bind(this),this._onMouseWheel=Hv.bind(this),this._onKeyDown=Gv.bind(this),this._onTouchStart=Wv.bind(this),this._onTouchMove=Xv.bind(this),this._onMouseDown=zv.bind(this),this._onMouseMove=Vv.bind(this),this._interceptControlDown=Yv.bind(this),this._interceptControlUp=$v.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=Ne.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents();let t=this.domElement.getRootNode();t.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),t.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Sd),this.update(),this.state=Ne.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){let e=this.object.position;rn.copy(e).sub(this.target),rn.applyQuaternion(this._quat),this._spherical.setFromVector3(rn),this.autoRotate&&this.state===Ne.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=Ln:n>Math.PI&&(n-=Ln),s<-Math.PI?s+=Ln:s>Math.PI&&(s-=Ln),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(rn.setFromSpherical(this._spherical),rn.applyQuaternion(this._quatInverse),e.copy(this.target).add(rn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=rn.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new G(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new G(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=rn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(tc.origin.copy(this.object.position),tc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(tc.direction))<Uv?this.object.lookAt(this.target):(bd.setFromNormalAndCoplanarPoint(this.object.up,this.target),tc.intersectPlane(bd,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>qh||8*(1-this._lastQuaternion.dot(this.object.quaternion))>qh||this._lastTargetPosition.distanceToSquared(this.target)>qh?(this.dispatchEvent(Sd),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?Ln/60*this.autoRotateSpeed*t:Ln/60/60*this.autoRotateSpeed}_getZoomScale(t){let e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){rn.setFromMatrixColumn(e,0),rn.multiplyScalar(-t),this._panOffset.add(rn)}_panUp(t,e){this.screenSpacePanning===!0?rn.setFromMatrixColumn(e,1):(rn.setFromMatrixColumn(e,0),rn.crossVectors(this.object.up,rn)),rn.multiplyScalar(t),this._panOffset.add(rn)}_pan(t,e){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;rn.copy(s).sub(this.target);let r=rn.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(Ln*this._rotateDelta.x/e.clientHeight),this._rotateUp(Ln*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(Ln*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-Ln*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(Ln*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-Ln*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(Ln*this._rotateDelta.x/e.clientHeight),this._rotateUp(Ln*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new Wt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){let e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function Ov(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function Bv(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function kv(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(wd),this.state=Ne.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:let t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function zv(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Yn.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=Ne.DOLLY;break;case Yn.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Ne.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Ne.ROTATE}break;case Yn.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Ne.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Ne.PAN}break;default:this.state=Ne.NONE}this.state!==Ne.NONE&&this.dispatchEvent(Yh)}function Vv(i){switch(this.state){case Ne.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case Ne.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case Ne.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function Hv(i){this.enabled===!1||this.enableZoom===!1||this.state!==Ne.NONE||(i.preventDefault(),this.dispatchEvent(Yh),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(wd))}function Gv(i){this.enabled!==!1&&this._handleKeyDown(i)}function Wv(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case oi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=Ne.TOUCH_ROTATE;break;case oi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=Ne.TOUCH_PAN;break;default:this.state=Ne.NONE}break;case 2:switch(this.touches.TWO){case oi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=Ne.TOUCH_DOLLY_PAN;break;case oi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=Ne.TOUCH_DOLLY_ROTATE;break;default:this.state=Ne.NONE}break;default:this.state=Ne.NONE}this.state!==Ne.NONE&&this.dispatchEvent(Yh)}function Xv(i){switch(this._trackPointer(i),this.state){case Ne.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case Ne.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case Ne.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case Ne.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=Ne.NONE}}function qv(i){this.enabled!==!1&&i.preventDefault()}function Yv(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function $v(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var $h=new mn,nc=new Ps,Ir=new Wt,Zh=new G,ic=class extends ec{constructor(t,e){super(t,e),this.screenSpacePanning=!1,this.mouseButtons={LEFT:Yn.PAN,MIDDLE:Yn.DOLLY,RIGHT:Yn.ROTATE},this.touches={ONE:oi.PAN,TWO:oi.DOLLY_ROTATE},this._panWorldStart=new G}_handleMouseDownPan(t){if(super._handleMouseDownPan(t),this._panOffset.set(0,0,0),this.screenSpacePanning===!0)return;$h.setFromNormalAndCoplanarPoint(this.object.up,this.target);let n=this.domElement.getBoundingClientRect();Ir.x=(t.clientX-n.left)/n.width*2-1,Ir.y=-((t.clientY-n.top)/n.height)*2+1,nc.setFromCamera(Ir,this.object),nc.ray.intersectPlane($h,this._panWorldStart)}_handleMouseMovePan(t){if(this.screenSpacePanning===!0){super._handleMouseMovePan(t);return}let n=this.domElement.getBoundingClientRect();Ir.x=(t.clientX-n.left)/n.width*2-1,Ir.y=-((t.clientY-n.top)/n.height)*2+1,nc.setFromCamera(Ir,this.object),nc.ray.intersectPlane($h,Zh)&&(Zh.sub(this._panWorldStart),this._panOffset.copy(Zh).negate(),this.update())}};var Lr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};var Gn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},Zv=new Rs(-1,1,1,-1,0,1),Kh=class extends yn{constructor(){super(),this.setAttribute("position",new Cn([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Cn([0,2,0,0,2,0],2))}},Kv=new Kh,fs=class{constructor(t){this._mesh=new Ge(Kv,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,Zv)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}};var sc=class extends Gn{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof We?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=ki.clone(t.uniforms),this.material=new We({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new fs(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Oo=class extends Gn{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){let s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},rc=class extends Gn{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}};var oc=class{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){let n=t.getSize(new Wt);this._width=n.width,this._height=n.height,e=new $e(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:en}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new sc(Lr),this.copyPass.material.blending=$n,this.timer=new xo}swapBuffers(){let t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){let e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());let e=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Oo!==void 0&&(o instanceof Oo?n=!0:o instanceof rc&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){let e=this.renderer.getSize(new Wt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var ac=class extends Gn{constructor(t,e,n=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new ue}render(t,e,n){let s=t.autoClear;t.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=s}};var Td={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ue(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};var Dr=class i extends Gn{constructor(t,e=1,n,s){super(),this.strength=e,this.radius=n,this.threshold=s,this.resolution=t!==void 0?new Wt(t.x,t.y):new Wt(256,256),this.clearColor=new ue(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new $e(r,o,{type:en,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let f=new $e(r,o,{type:en,depthBuffer:!1});f.texture.name="UnrealBloomPass.h"+h,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);let u=new $e(r,o,{type:en,depthBuffer:!1});u.texture.name="UnrealBloomPass.v"+h,u.texture.generateMipmaps=!1,this.renderTargetsVertical.push(u),r=Math.round(r/2),o=Math.round(o/2)}let a=Td;this.highPassUniforms=ki.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new We({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new Wt(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new G(1,1,1),new G(1,1,1),new G(1,1,1),new G(1,1,1),new G(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=ki.clone(Lr.uniforms),this.blendMaterial=new We({uniforms:this.copyUniforms,vertexShader:Lr.vertexShader,fragmentShader:Lr.fragmentShader,premultipliedAlpha:!0,blending:Is,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new ue,this._oldClearAlpha=1,this._basic=new Cs,this._fsQuad=new fs(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),s=Math.round(e/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new Wt(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(t,e,n,s,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),a=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(t){let e=[],n=t/3;for(let o=0;o<t;o++)e.push(.39894*Math.exp(-.5*o*o/(n*n))/n);let s=[],r=[];for(let o=1;o<t;o+=2){let a=e[o],l=o+1<t?e[o+1]:0,c=a+l;s.push((o*a+(o+1)*l)/c),r.push(c)}return new We({defines:{KERNEL_PAIRS:s.length},uniforms:{colorTexture:{value:null},invSize:{value:new Wt(.5,.5)},direction:{value:new Wt(.5,.5)},centerWeight:{value:e[0]},gaussianOffsets:{value:s},gaussianWeights:{value:r}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(t){return new We({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}};Dr.BlurDirectionX=new Wt(1,0);Dr.BlurDirectionY=new Wt(0,1);var Bo={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};var lc=class extends Gn{constructor(){super(),this.isOutputPass=!0,this.uniforms=ki.clone(Bo.uniforms),this.material=new _r({name:Bo.name,uniforms:this.uniforms,vertexShader:Bo.vertexShader,fragmentShader:Bo.fragmentShader}),this._fsQuad=new fs(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},ge.getTransfer(this._outputColorSpace)===Ee&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===yo?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Mo?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===So?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ds?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===wo?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===To?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===bo&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var zo={mud:"#ff6040",oni:"#3ec8ff",ustur:"#ffcc33",unaligned:"#8a94a6"},Jv=i=>i<=.04045?i/12.92:((i+.055)/1.055)**2.4;var Vi=i=>[1,3,5].map(t=>Jv(parseInt(i.slice(t,t+2),16)/255)),Pd=[1.8,1,.6],Ai=Object.fromEntries(Object.entries(zo).map(([i,t])=>[i,Vi(t)])),jv="#ff5cf0",Vo=Vi(jv),Je=i=>Ai[i]?i:"unaligned",Ad={idle:0,docked:1,mining:2,warp:3,subwarp:4,destroyed:5,respawn:6,claimStakeTransfer:7},Id=i=>i in Ad?Ad[i]:0,tu=i=>i==="warp"||i==="subwarp",Jt=i=>typeof i=="number"&&Number.isFinite(i),Ed=i=>Array.isArray(i)&&i.length>=2&&Jt(i[0])&&Jt(i[1]);function eu(i){let t=i.s||{},e=[Jt(i.x)?i.x:0,Jt(i.y)?i.y:0];return tu(t.kind)&&Ed(t.to)&&Jt(t.departs)&&Jt(t.arrives)?{moving:!0,from:Ed(t.from)?[t.from[0],t.from[1]]:e,to:[t.to[0],t.to[1]],dep:t.departs,arr:t.arrives}:{moving:!1,from:e,to:null,dep:0,arr:0}}function Qv(i,t){if(!i.moving)return 1;let e=i.arr-i.dep;if(!(e>0))return t>=i.dep?1:0;let n=(t-i.dep)/e;return n<0?0:n>1?1:n}function Ld(i,t,e=[0,0]){if(!i.moving)return e[0]=i.from[0],e[1]=i.from[1],e;let n=Qv(i,t);return e[0]=i.from[0]+(i.to[0]-i.from[0])*n,e[1]=i.from[1]+(i.to[1]-i.from[1])*n,e}function Pn(i){let t=2166136261;for(let e=0;e<(i||"").length;e++)t^=i.charCodeAt(e),t=Math.imul(t,16777619);return(t>>>0)%1e5/1e5}var Ho=i=>i&&i.mine&&Array.isArray(i.mine.out)?i.mine.out.reduce((t,e)=>t+(Jt(e.ups)?e.ups:0),0):0;function ty(i){let t=new Map((i.asteroids||[]).map(n=>[n.a,n.sys])),e=new Map;for(let n of i.fleets||[]){if(!n||!n.s||n.s.kind!=="mining")continue;let s=t.get(n.s.asteroid);if(!s)continue;let r=e.get(s);r||(r={ups:0,miners:0,byFa:{},byFilter:{},fa:"unaligned"},e.set(s,r));let o=Ho(n),a=n.npc?"unaligned":Je(n.fa);r.ups+=o,r.miners++,r.byFa[a]=(r.byFa[a]||0)+o;for(let l of ru)ou(n,l)&&(r.byFilter[l]=(r.byFilter[l]||0)+o+1e-9)}for(let n of e.values())n.fa=Object.entries(n.byFa).sort((s,r)=>r[1]-s[1])[0][0];return e}var Dd=["mining","resource","combat","fleets","owners","dacs"],nu="#10b981",Jh=[.55,1.65],ko=.55;function Nd(i,t,e){let n=Jt(i)&&Jt(t)&&Jt(e)&&e>t?Math.min(1,Math.max(0,(i-t)/(e-t))):1;return{t:n,r:Jh[0]+(Jh[1]-Jh[0])*n,b:ko+(1-ko)*n}}var Fd={planet:0,belt:1,both:2},ey={planet:"planets only",belt:"asteroid belt only",both:"planets and asteroid belt"},ny=(i,t)=>i>0&&t>0?"both":i>0?"belt":"planet",Cd=i=>{let t=Math.round(i*100)/100;return String(Jt(t)?t:i)},iy=i=>{let t=Math.round(i*1e6)/1e6;return Jt(t)?t:Jt(i)?i:Number.MAX_VALUE};function sy(i,t,e){let n=new Map((t||[]).filter(r=>r&&Jt(r.x)&&Jt(r.y)).map(r=>[r.a,r])),s=new Map;if(typeof e!="string"||!e)return[];for(let r of i||[]){if(!r||!r.a||!r.sys||!Array.isArray(r.res)||!n.has(r.sys))continue;let o=0;for(let l of r.res)l&&l.r===e&&Jt(l.rich)&&l.rich>o&&(o=l.rich);if(!(o>0))continue;let a=s.get(r.sys);if(!a){let l=n.get(r.sys);a={sys:r.sys,x:l.x,y:l.y,name:l.n||"System",sum:0,best:0,n:0,top:null,belts:0,planets:0},s.set(r.sys,a)}a.sum+=o,a.n++,r.k==="asteroid"?a.belts++:a.planets++,o>a.best&&(a.best=o,a.top=r.a)}for(let r of s.values())r.sum=iy(r.sum),r.where=ny(r.belts,r.planets);return[...s.values()].sort((r,o)=>o.sum-r.sum||o.best-r.best||(r.sys<o.sys?-1:r.sys>o.sys?1:0))}var Wn=" \xB7 ",Ti=(i,t)=>`${i} ${t}${i===1?"":"s"}`;function ry(i){let t=Math.abs(i);return t>=1e6?(i/1e6).toFixed(t>=1e7?0:1)+"M":t>=1e3?(i/1e3).toFixed(t>=1e4?0:1)+"k":t>=10?Math.round(i).toString():i.toFixed(1)}function Rd(i,t){let e=(i.asteroids||[]).map(n=>({k:"asteroid",a:n.a,sys:n.sys}));return uu(i.fleets||[],i.systems||[],e,t)}function Ud(i,t,e,n={}){if(!t||!Array.isArray(t.systems))return[];let s=new Map(t.systems.map(l=>[l.a,l])),r=Jt(t.generatedAt)?t.generatedAt:0,o=r-120,a=[];if(i==="mining")for(let[l,c]of ty(t)){let h=s.get(l);!h||!(c.ups>0)||a.push({key:l,x:h.x,y:h.y,v:c.ups,fa:c.fa,sys:l,name:h.n||"System",line:`${ry(c.ups)} u/s${Wn}${Ti(c.miners,"miner")}`,miners:c.miners})}else if(i==="resource")for(let l of sy(n.bodies,t.systems,n.res))!Jt(l.sum)||!(l.sum>0)||a.push({key:l.sys,x:l.x,y:l.y,v:l.sum,fa:"res",hex:nu,sys:l.sys,name:l.name,line:`${n.res}${Wn}total ${Cd(l.sum)}${Wn}best ${Cd(l.best)}${Wn}${l.n} ${l.n===1?"body":"bodies"}${Wn}${ey[l.where]}`,best:l.best,bodies:l.n,where:l.where,belts:l.belts,planets:l.planets});else if(i==="combat")for(let l of ly(e,t.systems,r,n.windowS||86400,n.faction||null))a.push({key:"hot:"+l.key,x:l.x,y:l.y,v:l.n,fa:"hot",sys:l.sys,name:l.name,line:`${Ti(l.n,"combat event")} 24h${l.destroyed?Wn+Ti(l.destroyed,"kill"):""}`,kills:l.destroyed,heat:l.heat,last:l.last});else if(i==="fleets"){let l=t.fleets||[];for(let[c,h]of Rd(t,o)){let f=s.get(c);if(!f)continue;let u=[...h.docked,...h.mining,...h.cst,...h.idle];if(!u.length)continue;let d={};for(let m of u){let M=l[m].npc?"unaligned":Je(l[m].fa);d[M]=(d[M]||0)+1}a.push({key:c,x:f.x,y:f.y,v:u.length,fa:Object.entries(d).sort((m,M)=>M[1]-m[1])[0][0],sys:c,name:f.n||"System",line:`${Ti(u.length,"fleet")}${h.docked.length?Wn+h.docked.length+" docked":""}${h.mining.length?Wn+h.mining.length+" mining":""}`})}}else if(i==="owners"){let l=t.fleets||[],c=n.owner||null,h=new Map((t.owners||[]).map(m=>[m.p,m.fa])),f=new Map;for(let m of t.stakes||[])if(m&&m.sys&&(!c||m.o===c)){let M=f.get(m.sys)||[];M.push(m),f.set(m.sys,M)}let u=Rd(t,o),d=new Set([...u.keys(),...f.keys()]);for(let m of d){let M=s.get(m);if(!M)continue;let x=u.get(m),p=x?[...x.docked,...x.mining,...x.cst,...x.idle]:[],P=f.get(m)||[];if(c){let U=p.filter(b=>l[b].o===c).length;if(!U&&!P.length)continue;a.push({key:m,x:M.x,y:M.y,v:U+P.length,fa:Je(h.get(c)),sys:m,name:M.n||"System",line:[U?Ti(U,"fleet"):"",P.length?Ti(P.length,"stake"):""].filter(Boolean).join(Wn)})}else{let U=new Set([...p.map(b=>l[b].o),...P.map(b=>b.o)].filter(Boolean));if(!U.size)continue;a.push({key:m,x:M.x,y:M.y,v:U.size,fa:Je(M.f),sys:m,name:M.n||"System",line:Ti(U.size,"owner")+" present"})}}}return i==="combat"||i==="resource"?a:a.sort((l,c)=>c.v-l.v||(l.key<c.key?-1:1))}var oy=12,Od=(i,t)=>i>0?oy*(.08+.92*Math.log10(1+i)/Math.log10(1+Math.max(i,t||i))):0;function Bd(i,t=[0,0]){let e=(.5+.17*Math.sqrt(i))*zi.K,n=i*2.39996323;return t[0]=Math.cos(n)*e,t[1]=Math.sin(n)*e,t}function iu(i,t){let e=eu(i);return e.moving?e.arr<=t?e.to:null:[i.x,i.y]}function kd(i,t=-1/0){let e=new Map;i.forEach((n,s)=>{let r=n.s&&n.s.kind;if(r==="mining")return;let o=iu(n,t);if(!o)return;let a=r==="docked"&&n.s.system?"sys:"+n.s.system:o[0].toFixed(3)+","+o[1].toFixed(3);e.has(a)||e.set(a,[]),e.get(a).push(s)});for(let n of e.values())n.sort((s,r)=>i[s].a<i[r].a?-1:i[s].a>i[r].a?1:0);return e}var zd=i=>.55*(1+.42*Math.log2(Math.max(1,i||1)));function Vd(i){let t=new Map;for(let s of i||[])s&&Number.isInteger(s.id)&&Number.isFinite(s.x)&&Number.isFinite(s.y)&&!t.has(s.id)&&t.set(s.id,s);let e=new Set,n=[];for(let s of t.values())if(Array.isArray(s.to))for(let r of s.to){let o=t.get(r);if(!o||o===s)continue;let a=s.id<o.id?s:o,l=a===s?o:s,c=a.id+">"+l.id;if(e.has(c))continue;e.add(c);let h=Math.hypot(l.x-a.x,l.y-a.y);h>1e-6&&n.push({a:a.a,b:l.a,ia:a.id,ib:l.id,ax:a.x,ay:a.y,bx:l.x,by:l.y,len:h,seed:Pn(a.a+">"+l.a)})}return n.sort((s,r)=>s.ia-r.ia||s.ib-r.ib)}var je={w:.2,minPx:7,maxPx:12,trim:.45,trimShare:.22,gain:.32,hex:"#5fd0ff",seg:24,glowPx:1.8,far:.32,dash:.5,dashFrom:6,every:6,packet:.5,speed:.6,packetGain:1.1},Hd=i=>1.1+Math.max(0,i||0)*.42,su=i=>i.k==="combat"||i.k==="destroyed"||i.k==="starbaseCombat"||i.k==="captured"||i.k==="gone"&&i.afterCombat===!0,Os=i=>i.k==="destroyed"||i.dead===!0;function Gd(i,t,e=86400){let n=new Map,s=new Set;for(let r of i||[]){if(!su(r)||!Jt(r.t)||!Jt(r.x)||!Jt(r.y)||r.t>t||r.t<=t-e)continue;if(Os(r)&&r.f){if(s.has(r.f))continue;s.add(r.f)}let o=Math.round(r.x*2)+","+Math.round(r.y*2),a=n.get(o);a||(a={x:0,y:0,n:0,heat:0,destroyed:0,last:0,fa:{}},n.set(o,a));let l=t-r.t,c=(Os(r)?3:1)*Math.exp(-l/21600);a.x+=r.x,a.y+=r.y,a.n++,a.heat+=c,a.last=Math.max(a.last,r.t),Os(r)&&a.destroyed++;let h=Je(r.fa);a.fa[h]=(a.fa[h]||0)+1,r.npc&&(a.npc=(a.npc||0)+1),r.npc||((a.pf||(a.pf={}))[h]=1)}return[...n.values()].map(r=>({x:r.x/r.n,y:r.y/r.n,n:r.n,heat:r.heat,destroyed:r.destroyed,last:r.last,fa:Object.entries(r.fa).sort((o,a)=>a[1]-o[1])[0][0],npc:r.npc||0,playerFa:Object.keys(r.pf||{})}))}var cc=1.2;var ay=(i,t)=>t.n-i.n||t.last-i.last||(i.key<t.key?-1:i.key>t.key?1:0);function ly(i,t,e,n=86400,s=null){let r=(t||[]).filter(h=>h&&Jt(h.x)&&Jt(h.y)),o=new Map,a=new Set,l=cc*cc;for(let h of i||[]){if(!su(h)||!Jt(h.t)||!Jt(h.x)||!Jt(h.y)||h.t>e||h.t<=e-n||s&&!ou(h,s))continue;if(Os(h)&&h.f){if(a.has(h.f))continue;a.add(h.f)}let f=null,u=l;for(let x of r){let p=(x.x-h.x)**2+(x.y-h.y)**2;(p<u||p===u&&f&&x.a<f.a)&&(u=p,f=x)}let d=f?f.a:"deep:"+Math.round(h.x*2)+","+Math.round(h.y*2),m=o.get(d);m||(m={key:d,sys:f?f.a:null,name:f?f.n||"System":"",x:f?f.x:0,y:f?f.y:0,sx:0,sy:0,n:0,destroyed:0,heat:0,last:0},o.set(d,m));let M=e-h.t;m.n++,m.sx+=h.x,m.sy+=h.y,m.heat+=(Os(h)?3:1)*Math.exp(-M/21600),m.last=Math.max(m.last,h.t),Os(h)&&m.destroyed++}return[...o.values()].map(({sx:h,sy:f,...u})=>(u.sys||(u.x=h/u.n,u.y=f/u.n,u.name=cy(u.x,u.y,r)),u)).sort(ay)}function cy(i,t,e){let n=null,s=1/0;for(let r of e||[]){if(!r||!Jt(r.x)||!Jt(r.y))continue;let o=(r.x-i)**2+(r.y-t)**2;(o<s||o===s&&n&&r.a<n.a)&&(s=o,n=r)}return n?`Deep space near ${n.n||"System"}`:"Deep space"}function Wd(i,t){return t?t==="npc"?i.npc>0:i.playerFa.includes(t):!0}var hc=(i,t)=>["mud","oni","ustur"].includes(t)&&Je(i)!==t,jh=.06,ru=["mud","oni","ustur","npc","unaligned"];function ou(i,t){return t?t==="npc"?!!i.npc:!i.npc&&Je(i.fa)===t:!0}function au(i,t){let e=i.s&&i.s.kind||"idle";return t.owner?i.o===t.owner?2:jh:t.faction&&!ou(i,t.faction)||t.states&&t.states.length&&!t.states.includes(e)?jh:1}function lu(i){if(!i.length)return null;let t=1/0,e=1/0,n=-1/0,s=-1/0;for(let[r,o]of i)r<t&&(t=r),r>n&&(n=r),o<e&&(e=o),o>s&&(s=o);return{x:(t+n)/2,y:(e+s)/2,span:Math.max(n-t,s-e)}}function Xd(i,t,e){if(!e)return null;if(Math.hypot(e[0]-i.x,e[1]-i.y)>=.3)return[e[0],e[1],i.x,i.y];let n=i.vs&&i.vs[t]||{},s=Pn(String(i.f)+String(n.f))*Math.PI*2+t*.9,r=Math.cos(s)*.8,o=Math.sin(s)*.8;return[i.x-r,i.y-o,i.x+r,i.y+o]}var ui={orbit0:.75,orbitStep:.46,starR:.26,sbGap:.5,idleR0:.5},zi={K:.032,rMax:.15,nnShare:.45},Go=i=>(i>0?ui.orbit0+(i-1)*ui.orbitStep:ui.orbit0)+ui.sbGap+.2;function qd(i,t){let e=(i||[]).filter(s=>s&&Jt(s.x)&&Jt(s.y)),n=new Map;for(let s of e){let r=1/0;for(let a of e)if(a!==s){let l=(s.x-a.x)**2+(s.y-a.y)**2;l<r&&(r=l)}r=Math.sqrt(r);let o=Go(t?t(s.a):0);n.set(s.a,Math.min(zi.K,zi.rMax/o,Number.isFinite(r)?zi.nnShare*r/o:zi.K))}return n}function Yd(i,t,e,n,s=[0,0,0,0]){let r=Math.round(t[3]);if(r===1)return s[0]=i[2],s[1]=i[3],s[2]=t[0]-i[2],s[3]=t[1]-i[3],s;let o=t[1]+t[2]*n,a=t[0]*Math.cos(o),l=t[0]*Math.sin(o);if(r===2){let d=Math.atan2(-l,-a)+i[3],m=i[2]*.045,M=a+i[2]*Math.cos(d)+m*Math.sin(n*.6+e*13),x=l+i[2]*Math.sin(d)+m*Math.sin(n*.47+e*7);return s[0]=M,s[1]=x,s[2]=a-M,s[3]=l-x,s}let c=d=>{let m=.5-.5*Math.cos(d*6.2831853),M=Math.sin(d*6.2831853)*.18,x=a-i[2],p=l-i[3],P=Math.hypot(x,p)||1;return[i[2]+x*m-p/P*M*P,i[3]+p*m+x/P*M*P]},h=(n*.04+e)%1,f=c(h),u=c(h+.002);return s[0]=f[0],s[1]=f[1],s[2]=u[0]-f[0],s[3]=u[1]-f[1],s}var hy={oceanic:"oceanic",barren:"barren","gas-giant":"gas","ice-giant":"ice",volcanic:"volcanic",terrestrial:"terrestrial",dark:"dark"},uy=i=>i.k==="asteroid"?"belt":hy[i.sub]||"barren",fy={gas:.2,ice:.18,terrestrial:.15,oceanic:.15,volcanic:.145,barren:.13,dark:.13,belt:.16};function dy(i){let t=String(i||""),e=0;for(let n=0;n<t.length;n++)e=e*31+t.charCodeAt(n)|0;return Math.abs(e)%3}function $d(i){let t=i.slice().sort((n,s)=>n.id-s.id||(n.a<s.a?-1:n.a>s.a?1:0)),e=t.length?Pn(String(t[0].sys)):0;return t.map((n,s)=>{let r=ui.orbit0+s*ui.orbitStep,o=Pn(n.a),a=uy(n),l=e*Math.PI*2+s*2.39996323+(o-.5)*.5;return{b:n,i:s,r,a0:l,w:.06/Math.pow(r,1.5),slug:a,variant:dy(n.n),size:fy[a]}})}function Zd(i,t,e=[0,0]){let n=(t.length?t[t.length-1].r:ui.orbit0)+ui.sbGap,s=Pn(String(i)+":sb")*Math.PI*2;return e[0]=Math.cos(s)*n,e[1]=Math.sin(s)*n,e}function cu(i,t,e,n=[0,0]){let s=t+e*Math.sqrt(i),r=i*2.39996323;return n[0]=Math.cos(r)*s,n[1]=Math.sin(r)*s,n}var py=(i,t=3)=>(i.res||[]).slice().sort((e,n)=>(n.rich||0)-(e.rich||0)||(e.r<n.r?-1:1)).slice(0,t);function Kd(i,t,e){let n=i.k==="asteroid"?"asteroid":(i.sub||"planet").replace("-"," ")+" planet",s=py(i).map(r=>`${r.r} ${r.rich}`).join(", ");return`${i.n} - ${n}${s?" - "+s:""} - ${t} fleet${t===1?"":"s"} mining - ${e} claim stake${e===1?"":"s"} - orbit layout stylised (chain has no in-system positions)`}var ds={r0:1.08,step:.08,rMax:1.3,spacing:.024,beamCap:24};function Jd(i,t,e){let n=Math.min(Math.PI*1.85,Math.PI*.9+t*.03),s=i;for(let r=0;;r++){let o=Math.min(ds.r0+r*ds.step,ds.rMax),a=Math.max(3,Math.floor(n*o*e/ds.spacing)),l=t-(i-s);if(s<a||o>=ds.rMax){let c=o>=ds.rMax?Math.max(1,l):Math.min(a,l),h=((s+.5)/c-.5)*n+(r%2?.5*n/c:0);return{r:o*e,ang:h,layer:r}}s-=a}}var Nr=(i,t)=>i!=null&&typeof t=="string"&&Object.prototype.hasOwnProperty.call(i,t);function uc(i,t,e){if(!i||!i.entries)return-1;let n=Nr(i.configToSlug,t)?i.configToSlug[t]:null;if(n&&Nr(i.aliases,n)&&(n=i.aliases[n]),n&&Nr(i.entries,n))return i.entries[n];let s=i.sizeClass||{};return Nr(s,e)?s[e]:Nr(s,i.fallbackClass)?s[i.fallbackClass]:-1}function jd(i,t,e){let n=uc(i,t,e);if(n<0)return"";let s=Object.entries(i.sizeClass||{}).find(([,o])=>o===n);return s?`generic ${s[0]} hull`:(Object.keys(i.entries).find(o=>i.entries[o]===n)||"").split("-").map(o=>o&&o[0].toUpperCase()+o.slice(1)).join(" ")+" hull"}var Bs={"xx-small":384e-6,"x-small":512e-6,small:704e-6,medium:96e-5,large:.00128,capital:.001664,commander:.00192,titan:.00224},ks=i=>(Nr(Bs,i)?Bs[i]:Bs.medium)/2/.92,hu={galaxy:1,system:1},on={collapse:.75,full:1.5},mT=on.collapse,gT=on.full,zs={subwarp:4,warp:10,max:.0096,wSubwarp:.32,wWarp:.22,fadeS:120};var fc=i=>i>1.5?1.15:1;function uu(i,t,e,n){let s=new Map(e.filter(a=>a.k==="asteroid").map(a=>[a.a,a.sys])),r=new Map,o=a=>{let l=r.get(a);return l||(l={docked:[],mining:[],cst:[],idle:[]},r.set(a,l)),l};return i.forEach((a,l)=>{let c=a.s&&a.s.kind;if(c==="docked"&&a.s.system){o(a.s.system).docked.push(l);return}if(c==="mining"){let d=s.get(a.s.asteroid);d&&o(d).mining.push(l);return}let h=iu(a,n);if(!h)return;let f=null,u=.36;for(let d of t){let m=(d.x-h[0])**2+(d.y-h[1])**2;m<u&&(u=m,f=d.a)}f&&o(f)[c==="claimStakeTransfer"?"cst":"idle"].push(l)}),r}function fu(i,t){i=i||{};let e=(i.systems||[]).filter(d=>d&&Jt(d.x)&&Jt(d.y)),n=new Map((i.systems||[]).filter(d=>d&&d.a).map(d=>[d.a,d])),s=new Map;for(let d of i.asteroids||[])d&&d.a&&d.sys&&s.set(d.a,d.sys);let r=(Jt(i.generatedAt)?i.generatedAt:0)-120,o=new Map;for(let d of t||[])for(let m of d&&d.members||[]){let M=o.get(m)||[];M.includes(d.tag)||M.push(d.tag),o.set(m,M)}let a=new Map,l=(d,m)=>{let M=a.get(d);return M||a.set(d,M={}),M[m]||(M[m]={fleets:0,ships:0,stakes:0,ups:0})};for(let d of i.fleets||[]){if(!d||d.npc||!d.s||!Jt(d.x)||!Jt(d.y))continue;let m=o.get(d.o);if(!m)continue;let M=Qd(d,e,s,r);if(!M)continue;let x=Ho(d);for(let p of m){let P=l(M,p);P.fleets++,P.ships+=d.ships||0,P.ups+=x}}for(let d of i.stakes||[]){let m=d&&d.sys?o.get(d.o):null;if(m)for(let M of m)l(d.sys,M).stakes++}let c=(d,m)=>m.fleets-d.fleets||m.stakes-d.stakes||m.ups-d.ups||(d.a<m.a?-1:d.a>m.a?1:0),h=d=>Object.values(d).reduce((m,M)=>({fleets:m.fleets+M.fleets,stakes:m.stakes+M.stakes,ups:m.ups+M.ups}),{fleets:0,stakes:0,ups:0}),f=[...a].map(([d,m])=>{let M=n.get(d)||{};return{a:d,n:M.n||null,x:M.x,y:M.y,byDac:m}}).sort((d,m)=>c({a:d.a,...h(d.byDac)},{a:m.a,...h(m.byDac)})),u={};for(let d of t||[])u[d.tag]=f.filter(m=>m.byDac[d.tag]).map(m=>({a:m.a,n:m.n,x:m.x,y:m.y,...m.byDac[d.tag]})).sort(c);return{systems:f,byDac:u}}function Qd(i,t,e,n){let s=i.s.kind;if(s==="docked"&&i.s.system)return i.s.system;if(s==="mining")return e.get(i.s.asteroid)||null;let r=iu(i,n);if(!r)return null;let o=null,a=.36;for(let l of t){let c=(l.x-r[0])**2+(l.y-r[1])**2;c<a&&(a=c,o=l.a)}return o}var tp="#8a94a6",my=/^#[0-9a-fA-F]{6}$/,dc=i=>typeof i=="string"&&my.test(i)?i.toLowerCase():tp,hi=i=>i?i.fleets+i.stakes:0;function gy(i,t){let e=null;for(let n of t){let s=i[n];!s||hi(s)<=0||(!e||hi(s)>hi(i[e])||hi(s)===hi(i[e])&&s.ups>i[e].ups)&&(e=n)}return e}function ep(i,t,e){let n=(t||[]).filter(f=>f&&typeof f.tag=="string"&&f.tag);if(!i||!n.length)return{cols:[],halos:[]};let s=fu(i,n),r=n.map(f=>f.tag),o=new Map(n.map(f=>[f.tag,dc(f.color)])),a=e&&o.has(e)?e:null,l=[],c=[],h=0;for(let f of s.systems)for(let u of r)h=Math.max(h,hi(f.byDac[u]));for(let f of s.systems){if(!Jt(f.x)||!Jt(f.y))continue;let u=r.reduce((x,p)=>x+hi(f.byDac[p]),0);if(u<=0)continue;for(let x of r){let p=f.byDac[x],P=hi(p);P<=0||c.push({sys:f.a,tag:x,x:f.x,y:f.y,hex:o.get(x),share:P/u,w:P,wmax:h,dim:a&&x!==a})}let d=a||gy(f.byDac,r),m=d&&f.byDac[d];if(!m||hi(m)<=0)continue;let M=r.filter(x=>x!==d&&hi(f.byDac[x])>0).length;l.push({key:"dac:"+f.a,x:f.x,y:f.y,v:a?hi(m):u,fa:"dac",hex:o.get(d),tag:d,sys:f.a,name:f.n||"System",line:`${d}${Wn}${Ti(m.fleets,"fleet")}${Wn}${Ti(m.stakes,"stake")}${M?`${Wn}+${M} DAC${M===1?"":"s"}`:""}`,fleets:m.fleets,stakes:m.stakes})}return l.sort((f,u)=>u.v-f.v||(f.key<u.key?-1:1)),{cols:l,halos:c,inf:s}}var du=["mining","stakes","combat","fleets"];function np(i,t,e,n,s){i=i||{};let r=(e||[]).filter(S=>S&&typeof S.tag=="string"&&S.tag),o=[...new Set(r.map(S=>S.tag))],a=typeof s=="string"&&o.includes(s)?[s]:o,l=du.filter(S=>Array.isArray(n)&&n.includes(S)),c=(i.systems||[]).filter(S=>S&&typeof S.a=="string"&&Jt(S.x)&&Jt(S.y)),h=new Map;for(let S of i.asteroids||[])S&&S.a&&S.sys&&h.set(S.a,S.sys);let f=Jt(i.generatedAt)?i.generatedAt:0,u=f-120,d=new Map;for(let S of r)if(a.includes(S.tag))for(let E of S.members||[]){let I=d.get(E)||[];I.includes(S.tag)||I.push(S.tag),d.set(E,I)}let m=new Map,M=(S,E,I,v,R)=>{let L=m.get(S);L||m.set(S,L={});let F=L[E]||(L[E]={T:0,v:{}});F.T+=v;let N=R?d.get(I):null;if(N)for(let W of N)F.v[W]=(F.v[W]||0)+v},x=l.includes("mining"),p=l.includes("fleets");if(x||p)for(let S of i.fleets||[]){if(!S||!S.s||!Jt(S.x)||!Jt(S.y))continue;let E=Qd(S,c,h,u);E&&(x&&M(E,"mining",S.o,Ho(S),!S.npc),p&&M(E,"fleets",S.o,Jt(S.ships)?S.ships:0,!S.npc))}if(l.includes("stakes"))for(let S of i.stakes||[])S&&typeof S.sys=="string"&&M(S.sys,"stakes",S.o,1,!0);if(l.includes("combat")){let S=new Set,E=cc*cc,I=new Map;for(let v of i.fleets||[])v&&v.a&&I.set(v.a,v.o);for(let v of t||[]){if(!v||!su(v)||!Jt(v.t)||!Jt(v.x)||!Jt(v.y)||v.t>f||v.t<=f-86400)continue;if(Os(v)&&v.f){if(S.has(v.f))continue;S.add(v.f)}let R=null,L=E;for(let F of c){let N=(F.x-v.x)**2+(F.y-v.y)**2;(N<L||N===L&&R&&F.a<R.a)&&(L=N,R=F)}R&&M(R.a,"combat",typeof v.o=="string"?v.o:I.get(v.f),1,v.npc!==!0)}}let P=[],U=Object.fromEntries(a.map(S=>[S,0])),b=0;for(let S of c.slice().sort((E,I)=>E.a<I.a?-1:E.a>I.a?1:0)){let E=m.get(S.a);if(!E)continue;let I={},v=0;for(let N of l){let W=E[N];if(!(!W||!(W.T>0))){v++;for(let B of a)W.v[B]>0&&(I[B]=(I[B]||0)+W.v[B]/W.T)}}if(!v)continue;let R=null,L=0;for(let N of a)I[N]>L&&(L=I[N],R=N);let F=!!R&&a.some(N=>N!==R&&I[N]>0&&Math.abs(I[N]-L)<=1e-9);F?b++:R&&U[R]++,P.push({a:S.a,n:S.n||null,x:S.x,y:S.y,winner:F?null:R,contested:F,strength:R&&!F?L/v:0,scores:I})}return{systems:P,byDac:U,contested:b}}function ip(i,t){let e=new Map((t||[]).filter(h=>h&&typeof h.tag=="string").map(h=>[h.tag,dc(h.color)])),n=i&&i.byDac||{},s=[];for(let h of i&&i.systems||[]){if(!h||!h.winner||!Jt(h.x)||!Jt(h.y))continue;let f=Math.round(Math.max(0,Math.min(1,h.strength))*100),u=n[h.winner]||0;s.push({key:"dac:"+h.a,x:h.x,y:h.y,v:Math.max(1,f),fa:"dac",hex:e.get(h.winner)||tp,tag:h.winner,sys:h.a,name:h.n||"System",line:`${h.winner}${Wn}conquers ${Ti(u,"system")}`,strength:h.strength,won:u,callout:!1})}let r=(h,f)=>f.v-h.v||(h.key<f.key?-1:h.key>f.key?1:0);s.sort(r);let o=new Map;for(let h of s){let f=o.get(h.tag)||[0,0];f[0]+=h.strength,f[1]++,o.set(h.tag,f)}let a=[],l=new Set;for(let h of s)l.has(h.tag)||(l.add(h.tag),h.callout=!0,a.push(h));let c=h=>{let f=o.get(h);return f[0]/f[1]};return a.sort((h,f)=>f.won-h.won||c(f.tag)-c(h.tag)||(h.tag<f.tag?-1:h.tag>f.tag?1:0)),a.concat(s.filter(h=>!h.callout))}function sp(i){let t=i.s&&i.s.kind||"idle";return`${i.n||"Fleet"} - ${i.ships||0} ship${i.ships===1?"":"s"} - ${t}${i.npc?" (NPC)":""}`}var rp=i=>`${i.n||"System"} - ${Je(i.f)} starbase lvl ${i.lvl||0}`,op=i=>`${i.sysName||"Asteroid"} asteroid - ${i.fleets||0} fleets - ${(i.ups||0).toFixed(1)} u/s`,xy=3.3,_y=.35,vy=2,yy=3.5,Qh=["mud","oni","ustur"];function My(i){let t=(i||[]).filter(n=>n&&Jt(n.x)&&Jt(n.y)),e=new Set(t.filter(n=>Qh.includes(n.f)&&n.r!=null).map(n=>n.r));return t.filter(n=>!Qh.includes(n.f)&&n.r!=null&&!e.has(n.r))}function ap(i,t,e,n,s){let r=t*t,o=[new Float32Array(r),new Float32Array(r),new Float32Array(r)],a=t/e,l=xy*a,c=Math.ceil(l*3),h=1/(2*l*l),f=b=>(b-(n-e/2))*a,u=b=>(b-(s-e/2))*a,d=[];for(let b of i||[]){if(!b||!Jt(b.x)||!Jt(b.y))continue;let S=Qh.indexOf(b.f);if(S<0)continue;let E=f(b.x),I=u(b.y),v=.6+(b.lvl||0)*.4,R=o[S];d.push(E,I);for(let L=Math.max(0,Math.floor(I-c));L<=Math.min(t-1,Math.ceil(I+c));L++){let F=L+.5-I;for(let N=Math.max(0,Math.floor(E-c));N<=Math.min(t-1,Math.ceil(E+c));N++){let W=N+.5-E;R[L*t+N]+=v*Math.exp(-(W*W+F*F)*h)}}}let m=My(i);if(!m.length||!d.length)return o;let M=yy*a,x=vy*a,p=Math.ceil(M),P=new Float32Array(r).fill(1/0);for(let b of m){let S=f(b.x),E=u(b.y);for(let I=Math.max(0,Math.floor(E-p));I<=Math.min(t-1,Math.ceil(E+p));I++){let v=I+.5-E;for(let R=Math.max(0,Math.floor(S-p));R<=Math.min(t-1,Math.ceil(S+p));R++){let L=R+.5-S,F=Math.sqrt(L*L+v*v),N=I*t+R;F<P[N]&&(P[N]=F)}}}let U=_y*a;for(let b=0;b<r;b++){let S=P[b];if(!(S<M)||!(o[0][b]>0||o[1][b]>0||o[2][b]>0))continue;let E=b%t+.5,I=Math.floor(b/t)+.5,v=1/0;for(let W=0;W<d.length;W+=2){let B=d[W]-E,J=d[W+1]-I,ot=B*B+J*J;ot<v&&(v=ot)}let R=1/(1+Math.exp(-(S-Math.sqrt(v))/U)),L=Math.min(1,Math.max(0,(S-x)/(M-x))),F=1-L*L*(3-2*L),N=1-(1-R)*F;o[0][b]*=N,o[1][b]*=N,o[2][b]*=N}return o}var Vs=[.8,3.2],Hs=[3.5,14],Ei=[2.5,10],Gs=[1,4],cp=[.8,3.2],hp=12,Sy=.4,Fr=384,Or=6,fp=5,by=["gas","ice","terrestrial","oceanic","volcanic","barren","dark"],Ur=[...by.flatMap(i=>[0,1,2].map(t=>`${i}_${t}_384.webp`)),...[0,1,2,3,4].map(i=>`star_${i}_384.webp`)],up={gas:[.85,.7,.5],ice:[.55,.82,1],terrestrial:[.45,.75,.45],oceanic:[.2,.5,1],volcanic:[1,.45,.2],barren:[.62,.6,.58],dark:[.35,.35,.55],belt:[.6,.55,.5]},ps=`
uniform float uViewH;
vec3 relOf(vec2 c, vec2 loc) { return vec3((c.x - cameraPosition.x) + loc.x, -cameraPosition.y, (-c.y - cameraPosition.z) - loc.y); }
vec3 viewOf(vec3 r) { return mat3(viewMatrix) * r; }
float lodS(float a, float b, float x) { return smoothstep(log2(a), log2(b), log2(max(x, 1e-6))); } // LOD fade by log px (v11)
float ppuOf(vec3 v) { return projectionMatrix[1][1] * 0.5 * uViewH / max(-v.z, 1e-7); }
vec4 clipOf(vec3 v) { return projectionMatrix * vec4(v, 1.0); }
#define COLLAPSE { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
`,wy=ps+`
uniform float uAnim; uniform float uTime; uniform float uHiId;
attribute vec4 iP;  // (system x, y, orbit radius world, a0)
attribute vec4 iQ;  // (angular speed, disc radius world, kind 0 planet / 1 asteroid / 2 star, art cell or -1)
attribute vec3 iC;  // placeholder colour
attribute vec4 iW;  // worked rock: (miners, rate 0..1, hull px at this zoom computed here, seed)
attribute vec3 iWC; // its faction colour
attribute float iArt; // uTime when the render arrived (cross-fade), -1 = none yet
varying vec2 vP; varying vec3 vCol; varying float vKind; varying float vCell; varying float vA; varying float vArtK; varying float vQs;
varying vec4 vW; varying vec3 vWC; varying float vHi; varying float vSeed; varying float vShips;
void main() {
  float a = iP.w + iQ.x * uAnim;
  vec2 loc = iP.z * vec2(cos(a), sin(a));
  vec3 v = viewOf(relOf(iP.xy, loc));
  float ppu = ppuOf(v), rpx = iQ.y * ppu;
  int kind = int(iQ.z + 0.5);
  float al = kind == 2 ? lodS(${Ei[0].toFixed(2)}, ${Ei[1].toFixed(2)}, rpx) : lodS(${Vs[0].toFixed(2)}, ${Vs[1].toFixed(2)}, rpx);
  if (al < 0.002) COLLAPSE
  // quad half-size in disc radii: room for the star's corona / the hover ring / a worked rock's indicator ring
  float qs = kind == 2 ? 2.6 : (iW.x > 0.5 ? 1.75 : 1.25);
  // the renders are lit from screen angle 145 deg (upper-left): turn the sprite so that side faces the star (kind 2: none)
  float ang = 0.0;
  if (kind != 2) { vec3 ts = mat3(viewMatrix) * vec3(-loc.x, 0.0, loc.y); if (dot(ts.xy, ts.xy) > 1e-20) ang = atan(ts.y, ts.x + 1e-12) - 2.5307274; }
  float c = cos(ang), s = sin(ang);
  vec2 q = position.xy; vec2 rq = vec2(c * q.x - s * q.y, s * q.x + c * q.y);
  vP = position.xy * 2.0; vQs = qs; vCol = iC; vKind = float(kind); vCell = iQ.w; vA = al;
  vArtK = iArt < 0.0 ? 0.0 : clamp((uTime - iArt) / ${Sy.toFixed(2)}, 0.0, 1.0);
  vW = iW; vWC = iWC; vHi = abs(float(gl_InstanceID) - uHiId) < 0.5 ? 1.0 : 0.0; vSeed = iW.w;
  // the miners' hulls on this rock: a medium hull's px here (the indicator dims as the ships themselves show)
  vShips = smoothstep(1.5, 4.0, ${Bs.medium.toFixed(6)} / 0.92 * ppu);
  gl_Position = clipOf(v + vec3(rq * iQ.y * qs * 2.0, 0.0));
}`,Ty=`
uniform sampler2D uArt; uniform float uAnim;
varying vec2 vP; varying vec3 vCol; varying float vKind; varying float vCell; varying float vA; varying float vArtK; varying float vQs;
varying vec4 vW; varying vec3 vWC; varying float vHi; varying float vSeed; varying float vShips;
vec4 artAt(vec2 uv) {
  float cell = floor(vCell + 0.5), cx = mod(cell, ${Or.toFixed(1)}), cy = floor(cell / ${Or.toFixed(1)});
  vec4 t = texture2D(uArt, vec2((cx + uv.x) / ${Or.toFixed(1)}, 1.0 - (cy + 1.0 - uv.y) / ${fp.toFixed(1)}));
  return vec4(t.rgb * t.a, t.a);
}
void main() {
  vec2 p = vP * vQs; float r = length(p); float fw = max(fwidth(r), 1e-4);
  vec4 t = vec4(0.0);
  int kind = int(vKind + 0.5);
  if (kind == 2) {
    // star: a hot core + corona until the render arrives (disc = 0.3846 of the render's half-size)
    vec4 ph = vec4(vCol * (exp(-r * r * 1.2) * 1.5 + exp(-r * 1.6) * 0.35) * smoothstep(${2.6.toFixed(1)}, 1.6, r), 0.0);
    vec2 uv = 0.5 + 0.5 * p * 0.3846;
    vec4 art = (vCell >= 0.0 && max(abs(uv.x - 0.5), abs(uv.y - 0.5)) < 0.5) ? artAt(uv) : vec4(0.0);
    t = mix(ph, art, vArtK);
  } else if (kind == 1) {
    // asteroid: a lumpy, cratered rock lit from the sprite's upper-left (= the star after the turn)
    float an = atan(p.y, p.x);
    float edge = 1.0 + 0.11 * sin(an * 3.0 + vSeed * 40.0) + 0.06 * sin(an * 7.0 + vSeed * 17.0);
    float a = 1.0 - smoothstep(edge - fw, edge + fw, r);
    vec2 s = p / edge; float rs = min(length(s), 1.0);
    vec3 n = normalize(vec3(s + 0.18 * vec2(sin(s.y * 9.0 + vSeed * 30.0), sin(s.x * 8.0 + vSeed * 12.0)), sqrt(max(0.0, 1.0 - rs * rs)) + 0.05));
    float l = clamp(dot(n, normalize(vec3(-0.6, 0.5, 0.65))), 0.0, 1.0);
    float crater = smoothstep(0.16, 0.1, length(s - vec2(0.3, -0.2) * (0.5 + vSeed))) * 0.35 + smoothstep(0.12, 0.07, length(s + vec2(0.35, 0.1))) * 0.3;
    t = vec4(vCol * 0.55 * (0.08 + 1.05 * l) * (1.0 - crater) * a, a);
  } else {
    float a = 1.0 - smoothstep(1.0 - fw, 1.0 + fw, r);
    vec3 n = vec3(p, sqrt(max(0.0, 1.0 - r * r)));
    float l = clamp(dot(n, normalize(vec3(-0.6, 0.5, 0.65))), 0.0, 1.0);
    vec4 ph = vec4(vCol * (0.12 + 0.88 * l) * a, a);
    vec2 uv = 0.5 + 0.5 * p * 0.6803;
    vec4 art = (vCell >= 0.0 && max(abs(uv.x - 0.5), abs(uv.y - 0.5)) < 0.5) ? artAt(uv) : vec4(0.0);
    t = mix(ph, art, vArtK);
  }
  // hover ring
  t.rgb += vec3(0.75, 1.0, 1.0) * (1.0 - smoothstep(0.0, fw * 1.5, abs(r - 1.16))) * vHi * 0.9;
  // worked rock (task #32): one dash per miner (capped 48) on a ring at 1.5 R, turning, faction-coloured, brightness by
  // the live u/s; it dims to 35 % while the ships themselves show
  if (vW.x > 0.5) {
    float ang = atan(p.y, p.x + 1e-5) / 6.2831853 + 0.5;
    float u = fract(ang - uAnim * 0.035 + vSeed);
    float dash = step(fract(u * min(vW.x, 48.0)), 0.55);
    float ring = (1.0 - smoothstep(0.0, fw * 1.5, abs(r - 1.5))) * dash;
    float halo = exp(-pow((r - 1.5) / 0.18, 2.0)) * (0.12 + 0.3 * vW.y);
    t.rgb += vWC * (ring * (0.9 + 0.8 * vW.y) + halo) * mix(1.0, 0.35, vShips);
  }
  gl_FragColor = t * vA;
}`,Ay=ps+`
attribute vec4 iP; // (system x, y, orbit radius world, belt 0/1)
varying vec2 vP; varying float vA; varying float vBelt;
void main() {
  vec3 c = viewOf(relOf(iP.xy, vec2(0.0)));
  float rpx = iP.z * ppuOf(c);
  float al = lodS(${Hs[0].toFixed(2)}, ${Hs[1].toFixed(2)}, rpx);
  if (al < 0.002) COLLAPSE
  vP = position.xy * 2.0; vA = al; vBelt = iP.w;
  gl_Position = clipOf(viewOf(relOf(iP.xy, position.xy * 2.0 * iP.z)));
}`,Ey=`
varying vec2 vP; varying float vA; varying float vBelt;
void main() {
  float d = length(vP), fw = max(fwidth(d), 1e-6);
  float line = 1.0 - smoothstep(0.0, fw * 1.3, abs(d - 1.0));
  vec3 c = vec3(0.05, 0.17, 0.22) * line;
  if (vBelt > 0.5) {
    // an asteroid's orbit: world-scale rubble - two round grains per angular cell (720 cells), scattered +-2.5 % of the
    // radius about the orbit; a grain thinner than a pixel is drawn 1 px wide with its alpha scaled down (no shimmer)
    float an = atan(vP.y, vP.x) / 6.2831853 * 720.0, ci = floor(an);
    for (int j = 0; j < 2; j++) {
      float fj = float(j);
      float h1 = fract(sin(ci * 12.9898 + fj * 4.1) * 43758.5453), h2 = fract(sin(ci * 78.233 + fj * 9.7) * 24634.6345), h3 = fract(sin(ci * 37.719 + fj * 2.3) * 12345.678);
      vec2 g = vec2((fract(an) - 0.15 - 0.7 * h2) * 6.2831853 / 720.0 * d, d - (1.0 + (h1 - 0.5) * 0.05));
      float gs = 0.0007 + 0.0016 * h3, ge = max(gs, fw * 0.6);
      float gd = (1.0 - smoothstep(ge - fw * 0.5, ge + fw * 0.5, length(g))) * gs / ge;
      c += vec3(0.55, 0.5, 0.45) * gd * (0.35 + 0.4 * h3);
    }
  }
  gl_FragColor = vec4(c * vA, 1.0);
}`,Cy=ps+`
attribute vec4 iP; // (system x, y, station local x, y world)
attribute vec4 iQ; // (half-size world, level, 0, 0)
attribute vec3 iC;
uniform float uHiSys;
varying vec2 vP; varying vec3 vCol; varying float vLvl; varying float vA; varying float vHi;
void main() {
  vec3 v = viewOf(relOf(iP.xy, iP.zw));
  float px = iQ.x * ppuOf(v);
  float al = lodS(${Gs[0].toFixed(2)}, ${Gs[1].toFixed(2)}, px);
  if (al < 0.002) COLLAPSE
  vP = position.xy * 2.0; vCol = iC; vLvl = iQ.y; vA = al; vHi = abs(float(gl_InstanceID) - uHiSys) < 0.5 ? 1.0 : 0.0;
  gl_Position = clipOf(v + vec3(position.xy * iQ.x * 2.0, 0.0));
}`,Ry=`
uniform float uAnim;
varying vec2 vP; varying vec3 vCol; varying float vLvl; varying float vA; varying float vHi;
void main() {
  vec2 p = vP; vec2 q = abs(p); float r = length(p);
  float hx = max(q.x * 0.8660254 + q.y * 0.5, q.y);
  float ring = smoothstep(0.05, 0.0, abs(hx - 0.55));
  float fill = smoothstep(0.57, 0.52, hx);
  float ang = atan(p.y, p.x + 1e-5) + 3.14159265;
  float seg = floor(ang / 6.2831853 * 6.0);
  float ticks = step(seg, vLvl - 0.5) * smoothstep(0.04, 0.0, abs(r - 0.8)) * step(0.2, fract(ang / 6.2831853 * 6.0));
  float pulse = 0.75 + 0.25 * sin(uAnim * 2.0);
  vec3 c = vCol * (ring * 1.5 + fill * 0.35 + ticks * 1.2) * pulse + vec3(1.0) * exp(-r * r * 40.0) * 0.6;
  c += vec3(0.75, 1.0, 1.0) * smoothstep(0.03, 0.0, abs(r - 0.95)) * vHi;
  gl_FragColor = vec4(c, fill * 0.85) * vA;
}`,Py=ps+`
uniform float uAnim;
attribute vec4 iP; // (system x, y, planet orbit radius world, a0)
attribute vec4 iQ; // (angular speed, slot angle, ring radius world, half-size world)
attribute vec3 iC;
varying vec2 vP; varying vec3 vCol; varying float vA;
void main() {
  float a = iP.w + iQ.x * uAnim;
  vec2 loc = iP.z * vec2(cos(a), sin(a)) + iQ.z * vec2(cos(iQ.y), sin(iQ.y));
  vec3 v = viewOf(relOf(iP.xy, loc));
  float px = iQ.w * ppuOf(v);
  float al = lodS(${cp[0].toFixed(2)}, ${cp[1].toFixed(2)}, px);
  if (al < 0.002) COLLAPSE
  vP = position.xy * 2.0; vCol = iC; vA = al;
  gl_Position = clipOf(v + vec3(position.xy * iQ.w * 2.0, 0.0));
}`,Iy=`
varying vec2 vP; varying vec3 vCol; varying float vA;
void main() {
  float d = abs(vP.x) + abs(vP.y);
  float body = smoothstep(0.62, 0.56, d), edge = smoothstep(0.08, 0.0, abs(d - 0.62)), flag = smoothstep(0.32, 0.26, d);
  vec3 c = mix(vec3(0.02), vCol * 1.3, body) + vCol * edge * 0.8 + vec3(1.0) * flag * 0.35;
  float a = smoothstep(0.7, 0.62, d);
  gl_FragColor = vec4(c * a, a * 0.95) * vA;
}`;function dp(i){let{scene:t,camera:e,U:n,quadGeometry:s,instanceAttrs:r,shaderMat:o,assetBase:a}=i,l=document.createElement("canvas");l.width=Or*Fr,l.height=fp*Fr;let c=l.getContext("2d"),h=new ho(l);h.colorSpace=pn,h.anisotropy=4;let f=Ur.map(()=>0),u=0,d=0,m=0,M=!1,x=0,p=new Map(Ur.map((X,wt)=>[X,wt])),P=s(),U=s(),b=s(),S=s(),E={uAnim:n.uAnim,uTime:n.uTime,uViewH:n.uViewH,uArt:{value:h},uHiId:{value:-1}},I=new Ge(P,o(wy,Ty,E,null,"premult")),v=new Ge(U,o(Ay,Ey,{uViewH:n.uViewH},null,"add")),R={uAnim:n.uAnim,uViewH:n.uViewH,uHiSys:{value:-1}},L=new Ge(b,o(Cy,Ry,R,null,"premult")),F=new Ge(S,o(Py,Iy,{uAnim:n.uAnim,uViewH:n.uViewH},null,"premult"));for(let[X,wt]of[[v,3.4],[L,4.2],[I,4.4],[F,4.6]])X.frustumCulled=!1,X.renderOrder=wt,t.add(X);let N=null,W=[["iP",4],["iQ",4],["iC",3],["iW",4],["iWC",3],["iArt",1]];function B(X){let wt=X.systems,Pt=X.bodiesBySys||new Map,xt=qd(wt,bt=>(Pt.get(bt)||[]).length),Ft=[],jt=[],re=new Map;for(let bt=0;bt<wt.length;bt++){let At=wt[bt],A=$d(Pt.get(At.a)||[]),g=xt.get(At.a)||zi.K,H=Zd(At.a,A),V={s:At,si:bt,k:g,layout:A,ext:Go(A.length)*g,sb:[H[0]*g,H[1]*g],sbHalf:.16*g,starR:ui.starR*g,starCell:p.get(`star_${Math.floor(Pn(String(At.a)+":star")*5)}_384.webp`),b0:jt.length,nb:A.length,members:null,worked:new Map,stakeN:new Map,sx:0,sy:0,ppu:0,extPx:0,on:!1};for(let q of A){let St=q.slug==="belt"?-1:p.get(`${q.slug}_${q.variant}_384.webp`);jt.push({si:bt,L:q,r:q.r*g,R:q.size*g,a0:q.a0,w:q.w,kind:q.b.k==="asteroid"?1:0,cell:St??-1})}Ft.push(V),re.set(At.a,V)}let ae=jt.length,Re=ae+Ft.length,Qt=new Map(jt.map((bt,At)=>[bt.L.b.a,At])),Te=new Array(X.fleets.length).fill(null);for(let bt of Ft){let At=X.members&&X.members.get(bt.s.a);if(!At)continue;bt.members=At;let A=bt.k,g=bt.s.x,H=bt.s.y,V=[0,0];At.docked.forEach((_t,K)=>{cu(K,.07,.016,V),Te[_t]={mode:1,A:[g,H,bt.sb[0]+V[0]*A,bt.sb[1]+V[1]*A],O:[bt.sb[0],bt.sb[1],0,1],T:[0,0],si:bt.si,role:"docked"}}),At.idle.forEach((_t,K)=>{cu(K,ui.idleR0,.02,V);let it=V[0]*A,D=V[1]*A;Te[_t]={mode:1,A:[g,H,it,D],O:[it,D,0,1],T:[0,0],si:bt.si,role:"idle"}});let q=new Map,St=[];for(let _t of At.mining){let K=Qt.get(X.fleets[_t].s.asteroid);if(K==null||jt[K].si!==bt.si)continue;let it=q.get(K)||0;q.set(K,it+1),St.push({i:_t,bi:K,j:it})}for(let _t of St){let K=jt[_t.bi];_t.slot=Jd(_t.j,q.get(_t.bi),K.L.size)}St.slice().sort((_t,K)=>_t.slot.layer-K.slot.layer||_t.j-K.j||_t.bi-K.bi).forEach((_t,K)=>{_t.beam=K<ds.beamCap});for(let _t of St){let K=jt[_t.bi];Te[_t.i]={mode:2,A:[g,H,_t.slot.r*A,_t.slot.ang],O:[K.r,K.a0,K.w,2],T:[K.R,_t.beam?1:0],si:bt.si,role:"mining",bi:_t.bi};let it=X.fleets[_t.i],D=it.npc?"unaligned":Je(it.fa),ut=Ho(it),Tt=bt.worked.get(_t.bi);Tt||bt.worked.set(_t.bi,Tt={n:0,ups:0,byFa:{}}),Tt.n++,Tt.ups+=ut,Tt.byFa[D]=(Tt.byFa[D]||0)+ut+1e-9}for(let _t of At.cst){let K=X.fleets[_t],it=(X.stakes||[]).find(ut=>ut.o===K.o&&Qt.has(ut.body)&&jt[Qt.get(ut.body)].si===bt.si),D=it?Qt.get(it.body):-1;if(D<0){let ut=bt.layout.find(Tt=>Tt.b.k==="planet"&&Tt.b.claimed)||bt.layout.find(Tt=>Tt.b.k==="planet");ut&&(D=Qt.get(ut.b.a))}Te[_t]=D>=0?{mode:3,A:[g,H,bt.sb[0],bt.sb[1]],O:[jt[D].r,jt[D].a0,jt[D].w,3],T:[0,0],si:bt.si,role:"cst",bi:D}:{mode:1,A:[g,H,bt.sb[0],bt.sb[1]],O:[bt.sb[0],bt.sb[1],0,1],T:[0,0],si:bt.si,role:"cst"}}}let _e=r(P,W,Re);for(let bt=0;bt<ae;bt++){let At=jt[bt],A=Ft[At.si].s;_e.iP.array.set([A.x,A.y,At.r,At.a0],bt*4),_e.iQ.array.set([At.w,At.R,At.kind,f[At.cell]===2?At.cell:-1],bt*4),_e.iC.array.set(up[At.L.slug]||up.barren,bt*3);let g=Ft[At.si].worked.get(bt);if(g){let H=Object.entries(g.byFa).sort((V,q)=>q[1]-V[1])[0][0];_e.iW.array.set([g.n,Math.min(1,Math.log10(1+g.ups)/3.2),0,Pn(At.L.b.a)],bt*4),_e.iWC.array.set(Ai[H],bt*3),At.work={n:g.n,ups:g.ups,fa:H}}else _e.iW.array.set([0,0,0,Pn(At.L.b.a)],bt*4),_e.iWC.array.set([0,0,0],bt*3),At.work=null;_e.iArt.array[bt]=f[At.cell]===2?-1e3:-1}for(let bt=0;bt<Ft.length;bt++){let At=Ft[bt],A=ae+bt;_e.iP.array.set([At.s.x,At.s.y,0,0],A*4),_e.iQ.array.set([0,At.starR,2,f[At.starCell]===2?At.starCell:-1],A*4),_e.iC.array.set([1,.8,.45],A*3),_e.iW.array.set([0,0,0,0],A*4),_e.iWC.array.set([0,0,0],A*3),_e.iArt.array[A]=f[At.starCell]===2?-1e3:-1}for(let bt in _e)_e[bt].needsUpdate=!0;let Ze=r(U,[["iP",4]],ae);for(let bt=0;bt<ae;bt++){let At=jt[bt],A=Ft[At.si].s;Ze.iP.array.set([A.x,A.y,At.r,At.kind],bt*4)}Ze.iP.needsUpdate=!0;let ce=r(b,[["iP",4],["iQ",4],["iC",3]],Ft.length);Ft.forEach((bt,At)=>{ce.iP.array.set([bt.s.x,bt.s.y,bt.sb[0],bt.sb[1]],At*4),ce.iQ.array.set([bt.sbHalf,bt.s.lvl||0,0,0],At*4),ce.iC.array.set(Ai[Je(bt.s.f)],At*3)});for(let bt in ce)ce[bt].needsUpdate=!0;let De=[];for(let bt of X.stakes||[]){let At=Qt.get(bt.body);if(At==null)continue;let A=Ft[jt[At].si],g=A.stakeN.get(At)||0;A.stakeN.set(At,g+1),De.push({st:bt,bi:At,k:g,fa:X.ownerFa&&X.ownerFa.get(bt.o)||"unaligned"})}let O=r(S,[["iP",4],["iQ",4],["iC",3]],De.length);De.forEach((bt,At)=>{let A=jt[bt.bi],g=Ft[A.si].s,H=Ft[A.si].k;O.iP.array.set([g.x,g.y,A.r,A.a0],At*4),O.iQ.array.set([A.w,bt.k*1.1+.6,A.R*1.35,.024*H],At*4),O.iC.array.set(X.mine&&X.mine.has(bt.st.o)?Vo:Ai[Je(bt.fa)],At*3)});for(let bt in O)O[bt].needsUpdate=!0;return N={infos:Ft,bodyAt:jt,byAddr:re,bodyIdx:Qt,place:Te,nb:ae,stakeList:De},Xt(),N}function J(X){if(X==null||X<0||f[X])return;f[X]=1,u++;let wt=new Image;wt.onload=()=>{if(!N)return;c.drawImage(wt,X%Or*Fr,Math.floor(X/Or)*Fr,Fr,Fr),f[X]=2,d++,M=!0;let Pt=P.getAttribute("iQ"),xt=P.getAttribute("iArt");for(let Ft=0;Ft<N.bodyAt.length;Ft++)N.bodyAt[Ft].cell===X&&(Pt.array[Ft*4+3]=X,xt.array[Ft]=n.uTime.value);N.infos.forEach((Ft,jt)=>{Ft.starCell===X&&(Pt.array[(N.nb+jt)*4+3]=X,xt.array[N.nb+jt]=n.uTime.value)}),Pt.needsUpdate=xt.needsUpdate=!0},wt.onerror=()=>{f[X]=3,m++,console.warn("C4Scene: planet render failed to load, using the placeholder sphere:",Ur[X])},wt.src=a+Ur[X]}function ot(X){M&&X-x>200&&(h.needsUpdate=!0,M=!1,x=X)}function lt(X,wt,Pt=[0,0]){let xt=N.bodyAt[X],Ft=N.infos[xt.si].s,jt=xt.a0+xt.w*wt;return Pt[0]=Ft.x+xt.r*Math.cos(jt),Pt[1]=Ft.y+xt.r*Math.sin(jt),Pt}let vt=new G,at=new G;function gt(X,wt){if(!N)return;let Pt=e.projectionMatrix.elements[5];for(let xt of N.infos){at.set(xt.s.x,0,-xt.s.y).applyMatrix4(e.matrixWorldInverse);let Ft=-at.z;if(Ft<=1e-6){xt.on=!1,xt.extPx=0;continue}if(vt.set(xt.s.x,0,-xt.s.y).project(e),xt.sx=(vt.x+1)/2*X,xt.sy=(1-vt.y)/2*wt,xt.ppu=Pt*.5*wt/Ft,xt.extPx=xt.ext*xt.ppu,xt.on=xt.sx>-xt.extPx-40&&xt.sx<X+xt.extPx+40&&xt.sy>-xt.extPx-40&&xt.sy<wt+xt.extPx+40,!(!xt.on||xt.extPx<20)){xt.starR*xt.ppu>=hp&&J(xt.starCell);for(let jt=xt.b0;jt<xt.b0+xt.nb;jt++)N.bodyAt[jt].R*xt.ppu>=hp&&J(N.bodyAt[jt].cell)}}}let yt=!0;function Xt(){if(!N)return;let X=P.getAttribute("iW");for(let wt=0;wt<N.nb;wt++){let Pt=N.bodyAt[wt];X.array[wt*4]=Pt.work&&yt?Pt.work.n:0}X.needsUpdate=!0}function Gt(X,wt){yt=!!wt,Xt()}function Ce(X){I.visible=v.visible=L.visible=F.visible=!!X}function pe(X,wt){E.uHiId.value=X??-1,R.uHiSys.value=wt??-1}function Me(){for(let X of[I,v,L,F])t.remove(X),X.geometry.dispose(),X.material.dispose();h.dispose(),N=null}function ct(X){let wt=N&&N.stakeList&&S.getAttribute("iC");wt&&(N.stakeList.forEach((Pt,xt)=>wt.array.set(X&&X.has(Pt.st.o)?Vo:Ai[Je(Pt.fa)],xt*3)),wt.needsUpdate=!0)}return{build:B,paintStakes:ct,lod:gt,bodyPos:lt,requestArt:J,flushArt:ot,setLayers:Gt,setVisible:Ce,setHover:pe,dispose:Me,get world(){return N},texStats:()=>({texRequested:u,texLoaded:d,texFailed:m,atlasCells:Ur.length}),artFiles:Ur}}var mu=["systems","fleets","mining","routes","gates","combat","territory","labels"],In={x:.5,y:.5,dist:128,polar:.72},Ly={combat:0,destroyed:1,starbaseCombat:2,captured:3,newFleet:4,gone:5},Dy=[3,6,4.5,9,2.6,1.6],Ny=[[1,.55,.2],[1,.3,.15],[1,.78,.32],null,null,[.55,.66,.85]],pc=64,mc=48,Fy=3,Br=42,Uy=40,pp=.01,Oy=2500,By=2.5,ky=10,zy=20,Vy=20,Hy=.35,Gy=.22,Xo=ps+`
uniform float uNow; uniform float uAnim; uniform float uZoom;
attribute vec4 iA; attribute vec2 iT; attribute vec3 iC; attribute vec4 iM;
attribute vec2 iX; // (ship silhouette atlas cell or -1, size-class scale)
attribute float iY; // 1 = the visitor's own fleet (api.setMine): a larger ringed dot, a ring round the hull
attribute vec4 iO; // member placement: (orbit r, a0, w, mode); mode 0 = outside any system (iA = from, to)
int kindOf() { return int(iM.y + 0.5); }
int modeOf() { return int(iO.w + 0.5); }
bool transit(int k) { return k == 3 || k == 4; }
float fleetProg() {
  int k = kindOf();
  if (!transit(k) || modeOf() != 0) return 1.0;
  float span = iT.y - iT.x;
  if (span <= 0.0) return uNow >= iT.x ? 1.0 : 0.0;
  return clamp((uNow - iT.x) / span, 0.0, 1.0);
}
vec2 fleetPos(float prog) {
  int k = kindOf();
  if (transit(k)) return mix(iA.xy, iA.zw, prog);
  return iA.xy;
}
vec2 cstAt(float t, vec2 b) {
  float ph = 0.5 - 0.5 * cos(t * 6.2831853), side = sin(t * 6.2831853) * 0.18;
  vec2 d = b - iA.zw;
  return iA.zw + d * ph + vec2(-d.y, d.x) * side;
}
// c = a float32-exact map point, loc = world-unit offset from it, hd = heading (0 = none). The SAME maths as placeMember.
void place(out vec2 c, out vec2 loc, out vec2 hd) {
  int mode = modeOf();
  if (mode == 0) { c = fleetPos(fleetProg()); loc = vec2(0.0); hd = iA.zw - iA.xy; return; }
  c = iA.xy;
  if (mode == 1) { loc = iA.zw; hd = iO.xy - iA.zw; return; }
  float a = iO.y + iO.z * uAnim; vec2 b = iO.x * vec2(cos(a), sin(a));
  if (mode == 2) {
    float ang = atan(-b.y, -b.x) + iA.w, amp = iA.z * 0.045;
    loc = b + iA.z * vec2(cos(ang), sin(ang)) + amp * vec2(sin(uAnim * 0.6 + iM.w * 13.0), sin(uAnim * 0.47 + iM.w * 7.0));
    hd = b - loc; return;
  }
  float t = fract(uAnim * 0.04 + iM.w);
  loc = cstAt(t, b); hd = cstAt(t + 0.002, b) - loc;
}
`,Wy=Xo+`
uniform float uSil; uniform float uHasAtlas; uniform float uShipBase;
varying vec2 vP; varying vec3 vCol; varying float vKind; varying float vVis; varying float vSeed; varying float vSil; varying float vCell; varying float vFade; varying float vMine;
void main() {
  if (iM.z < 0.001) COLLAPSE
  int k = kindOf(), mode = modeOf();
  vec2 c, loc, hd; place(c, loc, hd);
  bool flying = mode == 0 && transit(k) && fleetProg() < 1.0 && dot(hd, hd) > 1e-16;
  // silhouette LOD (task #22): wrecks keep the X; no atlas or no cell = the glyph
  float sil = (uHasAtlas > 0.5 && iX.x >= 0.0 && k != 5) ? uSil : 0.0;
  // heading: transit along from->to; otherwise, once silhouettes show, the placement's heading when set (nose to the
  // rock / toward the station / along a stake loop) or a seeded angle (idle)
  float sa = iM.w * 6.2831853;
  vec2 dir = flying ? normalize(hd) : (sil > 0.5 ? (dot(hd, hd) > 1e-16 ? normalize(hd) : vec2(cos(sa), sin(sa))) : vec2(0.0, 1.0));
  vec2 side = vec2(dir.y, -dir.x);
  float focus = iM.z > 1.5 ? 1.15 : 1.0;
  // World-proportional hulls (task #22b / #23, owner rule c4-ships-world-scale): a fixed world half-size by flagship
  // class, NO zoom compensation and NO px floor. The glyph fallback (no atlas) is drawn 1.8x (it fills less of the quad).
  float size = uShipBase * iX.y * focus * mix(1.8, 1.0, sil);
  vec3 v = viewOf(relOf(c, loc));
  float px = size * 2.0 * ppuOf(v); // projected hull quad length, px
  if (px < ${on.collapse.toFixed(2)}) COLLAPSE
  vFade = smoothstep(${on.collapse.toFixed(2)}, ${on.full.toFixed(2)}, px); // fades out below HULL_PX.full instead of a floor
  vec2 w = (side * position.x + dir * position.y) * size * 2.0;
  vP = position.xy * 2.0; vCol = iC; vVis = iM.z; vSeed = iM.w; vSil = sil; vCell = iX.x; vMine = iY;
  vKind = mode == 2 || mode == 3 ? 4.0 : (mode == 0 && transit(k) && !flying) ? 0.0 : float(k);
  gl_Position = clipOf(viewOf(relOf(c, loc + w)));
}`,Xy=3.2,mp=[1.5,4],qy=2.6,Yy=Xo+`
uniform float uSil; uniform float uHasAtlas; uniform float uShipBase; uniform float uDots;
varying vec2 vP; varying vec3 vCol; varying float vA; varying float vMine;
void main() {
  if (uDots < 0.5 || iM.z < 0.5) COLLAPSE   // filtered-out fleets: a dimmed dot stacks back to full brightness in a pile
  int k = kindOf();
  vec2 c, loc, hd; place(c, loc, hd);
  float sil = (uHasAtlas > 0.5 && iX.x >= 0.0 && k != 5) ? uSil : 0.0;
  float size = uShipBase * iX.y * (iM.z > 1.5 ? 1.15 : 1.0) * mix(1.8, 1.0, sil);
  float ppu = ppuOf(viewOf(relOf(c, loc)));
  vA = min(iM.z, 1.0) * (1.0 - smoothstep(${mp[0].toFixed(2)}, ${mp[1].toFixed(2)}, size * 2.0 * ppu));
  if (vA < 0.004) COLLAPSE
  vP = position.xy * 2.0; vCol = iC; vMine = iY;
  gl_Position = clipOf(viewOf(relOf(c, loc + position.xy * ${Xy.toFixed(2)} * (iY > 0.5 ? ${qy.toFixed(1)} : 1.0) / ppu)));
}`,$y=`
varying vec2 vP; varying vec3 vCol; varying float vA; varying float vMine;
void main() {
  float r = length(vP);
  // the visitor's own fleet: a full-bright core inside a ring, on a dot MINE_DOT times the size
  if (vMine > 0.5) { float m = max(smoothstep(0.5, 0.36, r), smoothstep(0.14, 0.02, abs(r - 0.8))) * vA; gl_FragColor = vec4(vCol * m, m); return; }
  float a = smoothstep(1.0, 0.7, r) * vA;
  gl_FragColor = vec4(vCol * 0.8 * a, a);   // under 1.0 so the bloom pass keeps the faction hue on such a small mark
}`,Zy=`
uniform float uAnim; uniform sampler2D uAtlas; uniform float uCols; uniform float uRows;
varying vec2 vP; varying vec3 vCol; varying float vKind; varying float vVis; varying float vSeed; varying float vSil; varying float vCell; varying float vFade; varying float vMine;
void main() {
  vec2 p = vP; float r = length(p); int k = int(vKind + 0.5);
  float d; float gain = 1.0; vec3 col = vCol; float hot = 0.0;
  if (k == 3 || k == 4) {
    vec2 q = vec2(abs(p.x), p.y);
    d = max((p.y - (0.6 - 2.5 * q.x)) / 2.69, ((-0.2 - 0.595 * q.x) - p.y) / 1.16);
    hot = 0.45; gain = 1.25;
  } else if (k == 1) { d = r - 0.22; gain = 0.32; }
  else if (k == 2) { d = r - 0.28; hot = 0.2; }
  else if (k == 5) {
    d = max(min(abs(p.x - p.y), abs(p.x + p.y)) * 0.7071 - 0.06, r - 0.42);
    col = mix(col, vec3(0.75, 0.22, 0.16), 0.65); gain = 0.5;
  } else if (k == 6) { d = abs(r - 0.33) - 0.05; gain = 0.55 + 0.45 * step(0.5, fract(uAnim * 0.8 + vSeed)); }
  else { d = (abs(p.x) + abs(p.y) - 0.34) * 0.7071; gain = 0.7; }
  float fill = smoothstep(0.035, -0.035, d);
  float halo = exp(-max(d, 0.0) * 11.0) * 0.16;
  vec3 c = col * (fill * 1.05 + halo) * gain + vec3(1.0) * fill * hot;
  if (k == 2) {
    float t = fract(uAnim * 0.45 + vSeed);
    c += col * smoothstep(0.06, 0.0, abs(r - (0.3 + t * 0.62))) * (1.0 - t) * 0.9;
  }
  float alpha = fill * 0.92;
  if (vSil > 0.001) {
    // the flagship's top-down render: cell vCell of the atlas, nose = +y of this quad = the heading; white hull with
    // baked shading, tinted by faction (multiply, a little white kept so the rim light survives)
    vec2 uv = clamp(p * 0.5 + 0.5, 0.0, 1.0);
    // round first: an interpolated 48.0 can arrive as 47.9999 (speckled hulls on cell multiples of 8 - seen on gen-small)
    float cell = floor(vCell + 0.5);
    float cx = mod(cell, uCols), cy = floor(cell / uCols);
    vec4 t = texture2D(uAtlas, vec2((cx + uv.x) / uCols, 1.0 - (cy + 1.0 - uv.y) / uRows));
    vec3 sc = t.rgb * mix(vCol, vec3(1.0), 0.22) * 1.3 * t.a;
    c = mix(c, sc, vSil); alpha = mix(alpha, t.a * 0.95, vSil);
    fill = mix(fill, t.a, vSil);
  }
  if (vVis > 1.5) {
    float ring = smoothstep(0.03, 0.0, abs(r - 0.62)) * (0.55 + 0.45 * sin(uAnim * 4.0));
    c += vec3(0.85, 1.0, 1.0) * ring * 0.55 + col * fill * 0.3;
  }
  // the visitor's own fleet: a steady ring in its colour (the focus ring above is white and pulses)
  if (vMine > 0.5) c += vCol * smoothstep(0.04, 0.0, abs(r - 0.76)) * 1.1;
  float v = min(vVis, 1.0) * smoothstep(1.0, 0.82, r);
  // premultiplied 'over': the body (alpha = fill) occludes what is under it, the halo and rings (alpha 0) add light.
  gl_FragColor = vec4(c * v, alpha * v) * vFade;
}`,Ky=Xo+`
uniform float uSil; uniform float uHasAtlas; uniform float uShipBase;
varying float vU; varying float vX; varying vec3 vCol; varying float vA; varying float vWarp;
void main() {
  int k = kindOf();
  float fade = 1.0 - smoothstep(0.0, ${zs.fadeS.toFixed(1)}, uNow - iT.y);
  if (modeOf() != 0 || !transit(k) || iM.z < 0.5 || fade <= 0.0 || uNow < iT.x) COLLAPSE
  float prog = fleetProg();
  vec2 p = fleetPos(prog); vec2 d = iA.zw - iA.xy; float L = length(d);
  if (L < 1e-6) COLLAPSE
  float sil = (uHasAtlas > 0.5 && iX.x >= 0.0) ? uSil : 0.0;
  float size = uShipBase * iX.y * (iM.z > 1.5 ? 1.15 : 1.0) * mix(1.8, 1.0, sil);
  vec3 vc = viewOf(relOf(p, vec2(0.0)));
  float ppu = ppuOf(vc), px = size * 2.0 * ppu;
  if (px < ${on.collapse.toFixed(2)}) COLLAPSE
  float hl = uShipBase * iX.y * 1.84; // HULL_LEN of the class (sizeScale = HULL_LEN / 2 / 0.92)
  vec2 dir = d / L;
  float tl = min(L * prog, min(${zs.max.toFixed(5)}, hl * (k == 3 ? ${zs.warp.toFixed(1)} : ${zs.subwarp.toFixed(1)}))) * fade; // retracts as it fades after arrival
  if (tl < 1e-7) COLLAPSE
  vec2 side = vec2(dir.y, -dir.x);
  float u = position.y + 0.5;
  // width in world units off the hull; floored at 1 CSS px (thinner would shimmer) with the alpha scaled down to match
  float wdt = hl * (k == 3 ? ${zs.wWarp.toFixed(2)} : ${zs.wSubwarp.toFixed(2)});
  float wd = max(wdt, 1.0 / ppu);
  vU = u; vX = position.x * 2.0; vCol = iC; vWarp = k == 3 ? 1.0 : 0.0;
  vA = fade * min(iM.z, 1.0) * (wdt / wd) * smoothstep(${on.collapse.toFixed(2)}, ${on.full.toFixed(2)}, px);
  gl_Position = clipOf(viewOf(relOf(p, mix(-dir * tl, vec2(0.0), u) + side * position.x * wd)));
}`,Jy=`
uniform float uAnim;
varying float vU; varying float vX; varying vec3 vCol; varying float vA; varying float vWarp;
void main() {
  float a = pow(clamp(vU, 0.0, 1.0), 1.7) * (1.0 - vX * vX);
  vec3 col = mix(vCol, vec3(0.65, 0.95, 1.0), vWarp * 0.6);
  float shimmer = 0.82 + 0.18 * sin(vU * 46.0 - uAnim * 18.0);
  gl_FragColor = vec4(col * a * vA * shimmer * 1.3, 1.0);
}`,Sp=4,jy=Xo+`
varying float vU; varying float vX; varying vec3 vCol; varying float vLen; varying float vA;
void main() {
  int k = kindOf();
  if (modeOf() != 0 || !transit(k) || iM.z < 0.001) COLLAPSE
  float prog = fleetProg();
  if (prog >= 1.0) COLLAPSE
  vec2 p = fleetPos(prog); vec2 d = iA.zw - p; float L = length(d);
  if (L < 1e-5) COLLAPSE
  vec2 dir = d / L; vec2 side = vec2(dir.y, -dir.x);
  float u = position.y + 0.5;
  vec2 c = mix(p, iA.zw, u);
  // world units per CSS px at this point's depth: the quad is ROUTE_PX px wide wherever it is
  float upx = 1.0 / ppuOf(viewOf(relOf(c, vec2(0.0))));
  vU = u; vX = position.x * 2.0; vCol = iC; vLen = L; vA = min(iM.z, 1.0);
  gl_Position = clipOf(viewOf(relOf(c, side * position.x * ${Sp.toFixed(1)} * upx)));
}`,Qy=`
uniform float uAnim;
varying float vU; varying float vX; varying vec3 vCol; varying float vLen; varying float vA;
void main() {
  float xp = vX * ${(Sp/2).toFixed(1)};                 // CSS px from the centre line
  float prof = exp(-xp * xp * 2.0) + exp(-xp * xp * 0.6) * 0.12;  // crisp ~1.2 px core + faint halo
  float f = fract(vU * vLen / 1.6 - uAnim * 0.35);
  float flow = 0.55 + 0.45 * smoothstep(0.0, 0.45, f) * smoothstep(1.0, 0.55, f); // soft travelling pulses, no hard dashes
  float a = prof * flow * (0.3 + 0.45 * vU) * vA;
  gl_FragColor = vec4(mix(vCol, vec3(0.55, 0.7, 0.85), 0.15) * a * 0.42, 1.0);
}`,tM=ps+`
attribute vec4 iE; // (ax, ay, bx, by)
attribute vec2 iG; // (seed 0..1, length in map units)
varying float vS; varying float vX; varying float vL; varying float vSeed; varying float vPpu; varying float vHalf;
void main() {
  float L = iG.y;
  if (L < 1e-5) COLLAPSE
  vec2 dir = (iE.zw - iE.xy) / L; vec2 side = vec2(dir.y, -dir.x);
  float u = position.y + 0.5;
  vec2 c = mix(iE.xy, iE.zw, u);
  float ppu = ppuOf(viewOf(relOf(c, vec2(0.0))));
  float wpx = clamp(${je.w.toFixed(3)} * ppu, ${je.minPx.toFixed(1)}, ${je.maxPx.toFixed(1)});
  vS = u * L; vX = position.x * 2.0; vL = L; vSeed = iG.x; vPpu = ppu; vHalf = wpx * 0.5;
  gl_Position = clipOf(viewOf(relOf(c, side * position.x * wpx / ppu)));
}`,eM=`
uniform float uAnim; uniform vec3 uCol; uniform float uGain;
varying float vS; varying float vX; varying float vL; varying float vSeed; varying float vPpu; varying float vHalf;
void main() {
  float px = abs(vX) * vHalf;                                   // CSS px from the centre line
  float core = 1.0 - smoothstep(0.35, 1.05, px);
  float glow = exp(-px * px / ${(je.glowPx*je.glowPx).toFixed(2)}) * (1.0 - smoothstep(0.7, 1.0, abs(vX)));
  float near = smoothstep(${je.dashFrom.toFixed(1)}, ${(je.dashFrom*3).toFixed(1)}, vPpu); // dashes only once they are a few px long
  float d = fract(vS / ${je.dash.toFixed(3)} + vSeed);
  float dash = mix(1.0, 0.35 + 0.65 * smoothstep(0.0, 0.06, d) * (1.0 - smoothstep(0.62, 0.68, d)), near);
  float ph = fract((vS - uAnim * ${je.speed.toFixed(3)}) / ${je.every.toFixed(2)} + vSeed * 7.0);
  float packet = smoothstep(0.0, 0.012, ph) * (1.0 - smoothstep(0.012, ${(je.packet/je.every).toFixed(4)}, ph));
  float T = min(${je.trim.toFixed(3)}, ${je.trimShare.toFixed(3)} * vL);
  float ends = smoothstep(0.0, T, vS) * smoothstep(0.0, T, vL - vS);
  float zoomDim = mix(${je.far.toFixed(2)}, 1.0, near);
  float a = ((core * 0.6 + glow * 0.22) * dash * zoomDim + packet * (core + glow * 0.5) * ${je.packetGain.toFixed(2)}) * ends;
  gl_FragColor = vec4(uCol * a * uGain, 1.0);
}`,nM=Xo+`
uniform float uShipBase;
varying float vU; varying float vX; varying vec3 vCol; varying float vLen; varying float vSeed; varying float vA;
void main() {
  if (modeOf() != 2 || iT.y < 0.5 || iM.z < 0.001) COLLAPSE
  vec2 c, loc, hd; place(c, loc, hd);
  float a = iO.y + iO.z * uAnim; vec2 b = iO.x * vec2(cos(a), sin(a));
  vec2 d = b - loc; float L = length(d);
  if (L < 1e-9) COLLAPSE
  vec2 dir = d / L, side = vec2(dir.y, -dir.x);
  float hz = uShipBase * iX.y;
  float px = hz * 2.0 * ppuOf(viewOf(relOf(c, loc)));
  if (px < ${on.collapse.toFixed(2)}) COLLAPSE
  vec2 e0 = b - dir * iT.x * 0.92, e1 = loc + dir * hz * 0.9; // rock surface (u 0) -> ship nose (u 1)
  float u = position.y + 0.5;
  vU = u; vX = position.x * 2.0; vCol = iC; vLen = length(e1 - e0) / (hz * 2.0) * 0.3; vSeed = iM.w;
  vA = min(iM.z, 1.0) * smoothstep(${on.collapse.toFixed(2)}, ${on.full.toFixed(2)}, px);
  gl_Position = clipOf(viewOf(relOf(c, mix(e0, e1, u) + side * position.x * hz * 0.24)));
}`,iM=`
uniform float uAnim; uniform float uBeamGain;
varying float vU; varying float vX; varying vec3 vCol; varying float vLen; varying float vSeed; varying float vA;
void main() {
  float f = fract(vU * vLen * 1.6 - uAnim * 1.4 + vSeed * 7.0);
  float bead = smoothstep(0.22, 0.0, abs(f - 0.5));
  float a = (0.22 + bead * 0.95) * (1.0 - vX * vX) * smoothstep(0.0, 0.2, vU) * vA;
  gl_FragColor = vec4(mix(vec3(1.0, 0.84, 0.42), vCol, 0.35) * a * 0.42 * uBeamGain, 1.0);
}`,sM=ps+`
uniform float uSysZoom; uniform float uGlyphK;
attribute vec4 iS; attribute vec3 iC; attribute vec4 iM;
varying vec2 vP; varying vec3 vCol; varying float vLvl; varying float vVis; varying float vSeed; varying float vCo;
void main() {
  vec3 v = viewOf(relOf(iS.xy, vec2(0.0)));
  float ppu = ppuOf(v);
  float vis = iM.x * (1.0 - lodS(${Ei[0].toFixed(2)}, ${Ei[1].toFixed(2)}, iM.w * ppu));
  if (vis < 0.001) COLLAPSE
  float s = iS.z * uSysZoom * uGlyphK;
  vP = position.xy * 2.0; vCol = iC; vLvl = iS.w; vVis = vis; vSeed = iM.y; vCo = iM.z;
  gl_Position = clipOf(v + vec3(position.xy * s * 2.0, 0.0));
}`,rM=`
uniform float uAnim; uniform float uDim; uniform float uSysCover; uniform float uResDim;
varying vec2 vP; varying vec3 vCol; varying float vLvl; varying float vVis; varying float vSeed; varying float vCo;
void main() {
  // task #55 (owner 2026-11-07: "I feel we dont need them"): NO starbase rings. The level reads only as a slight size +
  // brightness step of the star core and glow: the quad is systemSize(lvl) = 1.1 + 0.42 lvl wide, so r is rescaled to a
  // visible star of 1.1 x (1 + 0.08 lvl) - lvl 5 draws 1.4x a lvl 0 star - and the core brightens 5 % per level.
  float lv = clamp(vLvl, 0.0, 6.0);
  float r = length(vP) * (1.1 + lv * 0.42) / (1.1 * (1.0 + 0.08 * lv)); float r2 = r * r;
  float twinkle = 0.86 + 0.14 * sin(uAnim * 1.7 + vSeed * 40.0);
  float core = exp(-r2 * 160.0) * 1.15 * (1.0 + 0.05 * lv);
  // the house-coloured glow (0.42, task #58: USTUR drifted to 73 % at 0.3)
  float glow = exp(-r2 * 22.0) * 0.42 * (1.0 + 0.06 * lv) + exp(-r * 7.0) * 0.03;
  vec3 c = mix(vec3(1.0), vCol, smoothstep(0.0, 0.035, r)) * core + vCol * glow;
  // the Resource layer (round 2): a system that does not hold the chosen resource (vCo 0) steps back to uResDim
  float k = min(vVis, 1.0) * uDim * smoothstep(1.0, 0.86, r) * mix(1.0, uResDim, 1.0 - vCo);
  c *= twinkle * k;
  // premultiplied: the halo partly covers the blue-violet nebula under it (bloom hue check, task #18)
  gl_FragColor = vec4(c, clamp(exp(-r2 * 18.0) * uSysCover, 0.0, 1.0) * k);
}`,Ws=0,oM=.3,xc=2.2,aM=8,lM=400,cM=.5,hM=3,uM=`
uniform float uStatH; uniform float uStatW; uniform float uGrow; uniform float uMinH;
attribute vec4 iS; attribute vec3 iC; attribute vec4 iM;
varying vec2 vQ; varying vec3 vCol; varying float vVis; varying float vSeed; varying float vH; varying float vHot;
void main() {
  if (iM.x < 0.001 || iS.z <= 0.0 || uGrow <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  vec3 r = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 right = normalize(vec3(r.x, 0.0, r.z) + vec3(1e-5, 0.0, 0.0));
  // task #50: a minimum on-screen height (uMinH = STAT_MIN_PX in world units at this zoom) and a ~400 ms rise on a
  // layer change (uGrow 0 -> 1). The SAME formula is in statTopH() (callouts, statColumnScreen).
  float h = max(iS.z * uStatH, uMinH) * uGrow, wd = iS.w * uStatW;
  vec3 base = vec3(iS.x, ${Ws.toFixed(2)}, -iS.y); // the system glyph's own plane: the column rises from its centre
  // the quad is STAT_GLOW x the body width: the body stays thin (owner), the extra is a soft glow either side
  vec3 w = base + right * position.x * wd * ${xc.toFixed(1)} + vec3(0.0, 1.0, 0.0) * (position.y + 0.5) * h;
  vQ = vec2(position.x * 2.0 * ${xc.toFixed(1)}, position.y + 0.5); vCol = iC; vVis = iM.x; vSeed = iM.y; vH = h; vHot = iM.w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}`,fM=`
uniform float uAnim;
varying vec2 vQ; varying vec3 vCol; varying float vVis; varying float vSeed; varying float vH; varying float vHot;
void main() {
  float x = abs(vQ.x), y = vQ.y;
  float core = exp(-x * x * 3.0) * 0.55 + exp(-x * x * 40.0) * 0.45;   // body + bright filament (v4 energy: bloom must not light the rings)
  float halo = exp(-x * x * 0.6) * 0.12;                                 // soft glow outside the body
  float sweep = exp(-pow((fract(uAnim * 0.12 + vSeed) - y) * 6.0, 2.0)) * 0.35;
  float cap = smoothstep(0.04, 0.0, abs(y - 0.985)) * 1.4;
  float fade = mix(1.0, 0.45, y) * smoothstep(1.0, 0.97, y);
  vec3 c = vCol * ((core + halo) * (fade + sweep) + cap * core * 0.6) + vec3(1.0) * cap * exp(-x * x * 8.0) * 0.2;
  c *= min(vVis, 1.0) * smoothstep(${xc.toFixed(1)}, ${(xc*.7).toFixed(2)}, x) * (vHot > 0.5 ? 1.1 : 1.0);
  gl_FragColor = vec4(c, 1.0);
}`,dM=`
uniform float uStatW; uniform float uGrow; uniform float uViewH;
attribute vec4 iS; attribute vec3 iC; attribute vec4 iM;
varying vec2 vQ; varying vec3 vCol; varying float vVis;
void main() {
  if (iM.x < 0.001 || iS.z <= 0.0 || uGrow <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  // quad 1.6 x the body width; the dot ~1.2 x the body width (r 0.73 in vQ = 0.365 wd), so it shows below the column at any
  // zoom. v11: a galaxy MARKER (not a world object), so the dot keeps >= 3 px radius - a far column's dot (~1 px) hid
  // under its own column foot (#50 base disc: 4 of 12 columns had no light below the base point)
  vec4 vc = viewMatrix * vec4(iS.x, ${Ws.toFixed(2)} - 0.001, -iS.y, 1.0);
  float ppu = projectionMatrix[1][1] * 0.5 * uViewH / max(-vc.z, 1e-6);
  float wd = max(iS.w * uStatW * 1.6, 3.0 / (0.365 * ppu));
  vec3 w = vec3(iS.x + position.x * wd, ${Ws.toFixed(2)} - 0.001, -(iS.y + position.y * wd));
  vQ = position.xy * 2.0; vCol = iC; vVis = iM.x * min(1.0, uGrow * 2.0);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}`,pM=`
varying vec2 vQ; varying vec3 vCol; varying float vVis;
void main() {
  float r = length(vQ);
  float d = smoothstep(0.8, 0.66, r) * 0.45;  // a solid dot ~1.2 x the body width, no halo (it must not light the starbase rings - #44)
  gl_FragColor = vec4(vCol * d * min(vVis, 1.0), 1.0);
}`,mM=.3,bp=.06,gM=.15,xM=1.5,wp=1.24,Tp=4.5,_M=7,vM=10,yM=1.25,MM=`
uniform float uGrow; uniform float uViewH; uniform float uZoom;
attribute vec4 iS; attribute float iK;
varying vec2 vQ; varying float vR; varying float vB; varying float vT; varying float vK;
void main() {
  if (iS.z <= 0.0 || uGrow <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  vT = clamp((iS.w - ${ko.toFixed(3)}) / ${(1-ko).toFixed(3)}, 0.0, 1.0); // richness t back from the brightness
  float R = iS.z * clamp(uZoom, 0.6, 1.3) * uGrow;
  vec4 vc = viewMatrix * vec4(iS.x, 0.0, -iS.y, 1.0);
  float ppu = projectionMatrix[1][1] * 0.5 * uViewH / max(-vc.z, 1e-6);
  // room for the stroke's px floor + its edge; a 'both' ring also needs its outer dotted ring (and that ring's px floor)
  float outer = iK > 1.5 ? ${wp.toFixed(2)} : 1.0, pad = (iK > 1.5 ? ${(Tp+4).toFixed(1)} : 4.0) / max(ppu, 1e-6);
  float hs = R * outer * (1.0 + ${bp.toFixed(2)}) + pad;
  vQ = position.xy * 2.0 * hs; vR = R; vB = iS.w * min(1.0, uGrow * 1.5); vK = iK;
  gl_Position = projectionMatrix * viewMatrix * vec4(iS.x + vQ.x, 0.001, -(iS.y + vQ.y), 1.0);
}`,SM=`
uniform vec3 uCol;
varying vec2 vQ; varying float vR; varying float vB; varying float vT; varying float vK;
// 1 on a dot, 0 in a gap, for the ring of radius r (map units) at this fragment: n dots round the ring, soft edges of 1 px
float dots(float r, float px) {
  float n = max(${vM.toFixed(1)}, floor(6.2831853 * r / (px * ${_M.toFixed(1)})));
  float f = fract(atan(vQ.y, vQ.x) / 6.2831853 * n + 0.25);
  float w = clamp(n * px / (6.2831853 * max(r, 1e-6)), 0.0, 0.2);   // 1 px as a fraction of one dot + gap
  return smoothstep(0.0, w, f) * (1.0 - smoothstep(0.5, 0.5 + w, f));
}
void main() {
  float d = length(vQ), px = max(fwidth(d), 1e-6);   // map units per screen px here (tilt-aware)
  // stroke: ~1.4 px on the poorest ring up to ~3.6 px on the richest, so a rich ring reads at the home view by weight too
  float hw = max(vR * ${(bp/2).toFixed(3)}, px * (0.7 + 1.1 * vT)), e = abs(d - vR);
  float line = 1.0 - smoothstep(hw, hw + px, e);
  // soft glow inside the stroke, strongest at it and gone by ~45 % of the radius (the system dot stays clear)
  float q = clamp(d / max(vR, 1e-6), 0.0, 1.0);
  float glow = smoothstep(0.45, 1.0, q) * q * q * (1.0 - smoothstep(vR - px * 0.5, vR + px * 0.5, d)) * ${gM.toFixed(2)};
  float beltOnly = step(0.5, vK) * (1.0 - step(1.5, vK)), both = step(1.5, vK);
  // asteroid belt only: the ring itself is dotted
  line *= mix(1.0, dots(vR, px) * ${yM.toFixed(2)}, beltOnly);
  // planets AND a belt: a second, dotted ring just outside the solid one
  float r2 = max(vR * ${wp.toFixed(2)}, vR + px * ${Tp.toFixed(1)});
  float hw2 = max(hw * 0.8, px * 0.8);
  float line2 = both * (1.0 - smoothstep(hw2, hw2 + px, abs(d - r2))) * dots(r2, px);
  gl_FragColor = vec4(uCol * vB * ${xM.toFixed(2)} * (max(line, line2) * 0.85 + glow), 1.0);
}`,bM=.42,wM=.55,TM=.12,AM=.32,EM=.28,gp=.62,CM=40,RM=16,gc=12,PM=`
uniform float uHaloK;
attribute vec4 iS; attribute vec3 iC; attribute vec4 iM;
varying vec2 vQ; varying vec3 vCol; varying float vA;
void main() {
  if (iM.x < 0.001) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  float r = iS.z * uHaloK;
  vec3 w = vec3(iS.x + position.x * r * 2.0, 0.0, -(iS.y + position.y * r * 2.0));
  vQ = position.xy * 2.0; vCol = iC; vA = iM.x;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}`,IM=`
varying vec2 vQ; varying vec3 vCol; varying float vA;
void main() {
  float q = length(vQ);
  float core = exp(-q * q * 3.2) * 0.8 + 0.2 * smoothstep(1.0, 0.55, q);
  float rim = exp(-pow((q - 0.86) * 16.0, 2.0)) * 0.35;
  gl_FragColor = vec4(vCol * (core + rim) * smoothstep(1.0, 0.92, q) * vA * ${AM.toFixed(2)}, 1.0);
}`,Wo="#8a94a6",LM=`
uniform sampler2D uConq; uniform sampler2D uConqX; uniform float uConqFill; uniform float uConqDim;
varying vec2 vUv; varying vec2 vW;
void main() {
  vec4 q = texture2D(uConq, vUv);
  vec3 xq = texture2D(uConqX, vUv).rgb;
  float m = q.a, x = xq.r, mid = xq.g, str = xq.b;
  vec3 col = pow(max(q.rgb, vec3(0.0)), vec3(2.2));
  col *= clamp(0.42 / max(dot(col, vec3(0.2126, 0.7152, 0.0722)), 1e-3), 0.45, 1.8); // equal brightness per DAC colour (like TERR_GAIN)
  float own = 1.0 - x;                                          // 1 = a DAC's space, 0 = contested
  float fwm = max(fwidth(m), 1e-5);
  float dpx = (m - 0.16) / fwm;                                 // signed screen px from the border, > 0 inside
  float inside = smoothstep(-0.8, 0.8, dpx);
  float rim = (exp(-dpx * dpx * 0.7) * 0.4 + exp(-abs(dpx) * 0.4) * 0.04) * own;
  vec2 hp = vW / 1.4;
  vec2 hs = vec2(1.0, 1.7320508), ha = mod(hp, hs) - hs * 0.5, hb = mod(hp - hs * 0.5, hs) - hs * 0.5;
  vec2 hg = abs(dot(ha, ha) < dot(hb, hb) ? ha : hb);
  float he = 0.5 - max(dot(hg, vec2(0.5, 0.8660254)), hg.x);
  float hfw = fwidth(hp.x);
  float hex = (1.0 - smoothstep(0.0, hfw * 1.5, he)) * smoothstep(0.09, 0.04, hfw);
  float infl = inside * (0.55 + 0.45 * (1.0 - smoothstep(0.16, 0.6, m)));
  float fill = infl * uConqFill * (0.5 + 0.5 * str) * (1.0 + hex * 0.7) * own;
  float dfm = (m - mid) / max(fwidth(m - mid), 1e-5);           // the seam between two channels, constant px
  float front = exp(-dfm * dfm * 0.7) * smoothstep(0.08, 0.3, mid) * inside;
  // contested: a faint neutral hatch, no edge - its weight follows the field smoothly (soft patch)
  float hh = (vW.x + vW.y) / 1.8;
  float hhw = fwidth(hh);
  float hatch = (1.0 - smoothstep(hhw * 0.6, hhw * 1.6, abs(fract(hh + 0.5) - 0.5))) * smoothstep(0.35, 0.15, hhw); // thin constant-px lines
  float soft = smoothstep(0.06, 0.5, m) * x;
  vec3 neutral = vec3(0.26, 0.29, 0.37);
  vec3 c = col * (fill + rim) + mix(col, neutral, x) * front * 0.45 + neutral * hatch * 0.22 * soft;
  gl_FragColor = vec4(c, inside * smoothstep(0.16, 0.5, m) * own * uConqDim * (0.55 + 0.45 * str));
}`,Ap=`#define COLLAPSE { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
`,DM=Ap+`
uniform float uZoom;
attribute vec4 iS; attribute vec4 iM;
varying vec2 vP; varying vec4 vM; varying float vHeat;
void main() {
  if (iM.w < 0.001) COLLAPSE
  vec2 w = iS.xy + position.xy * iS.z * 2.0 * clamp(uZoom, 0.6, 1.3);
  vP = position.xy * 2.0; vM = iM; vHeat = iS.w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w.x, 0.0, -w.y, 1.0);
}`,NM=`
uniform float uAnim;
varying vec2 vP; varying vec4 vM; varying float vHeat;
void main() {
  float r = length(vP); float ang = atan(vP.y, vP.x + 1e-5);
  float throb = 0.72 + 0.28 * sin(uAnim * 3.0 + vM.y * 20.0);
  float h = clamp(vHeat, 0.15, 1.6);
  vec3 hotc = mix(vec3(1.0, 0.36, 0.1), vec3(1.0, 0.12, 0.08), vM.x);
  vec3 c = mix(hotc, vec3(1.0, 0.9, 0.6), exp(-r * r * 60.0)) * (exp(-r * r * 12.0) * 0.3 * h * throb + exp(-r * r * 90.0) * 0.4);
  float seg = step(0.55, fract(ang * 0.6366 + uAnim * 0.06));
  c += hotc * smoothstep(0.015, 0.0, abs(r - 0.6)) * seg * (0.15 + 0.4 * vM.z);
  c *= min(vM.w, 1.0) * smoothstep(1.0, 0.88, r);
  gl_FragColor = vec4(c, 1.0);
}`,FM=Ap+`
uniform float uTime;
attribute vec4 iS; attribute vec3 iC; attribute float iK;
varying vec2 vP; varying vec3 vCol; varying float vT; varying float vK;
void main() {
  float dur = iK > 0.5 && iK < 1.5 ? 3.2 : iK > 4.5 ? 1.8 : 2.4;
  float age = uTime - iS.w;
  if (age < 0.0 || age > dur) COLLAPSE
  vec2 w = iS.xy + position.xy * iS.z * 2.3;
  vP = position.xy * 2.3; vCol = iC; vT = age / dur; vK = iK;
  gl_Position = projectionMatrix * viewMatrix * vec4(w.x, 0.0, -w.y, 1.0);
}`,UM=`
uniform float uReduced;
varying vec2 vP; varying vec3 vCol; varying float vT; varying float vK;
void main() {
  float r = length(vP); float t = vT; float e = 1.0 - pow(clamp(1.0 - t, 0.0, 1.0), 3.0);
  float rr = uReduced > 0.5 ? 0.6 : (vK > 3.5 ? 1.0 - e : e);
  float w = 0.04 + 0.06 * t;
  float ring = smoothstep(w, 0.0, abs(r - rr)) * (1.0 - t);
  float ring2 = 0.0;
  if (vK > 0.5 && vK < 3.5) {
    float t2 = clamp((t - 0.16) / 0.84, 0.0, 1.0);
    float rr2 = uReduced > 0.5 ? 0.35 : (1.0 - pow(1.0 - t2, 3.0)) * 0.72;
    ring2 = smoothstep(0.035, 0.0, abs(r - rr2)) * (1.0 - t2) * step(0.001, t2) * 0.7;
  }
  float flash = exp(-r * r * 26.0) * exp(-t * 7.0) * 2.6;
  float sparks = 0.0;
  if (vK > 0.5 && vK < 1.5) {
    float ang = atan(vP.y, vP.x + 1e-5);
    sparks = pow(max(0.0, sin(ang * 13.0 + 1.7)), 24.0) * smoothstep(rr + 0.02, rr - 0.25, r) * step(0.05, r) * (1.0 - t) * 1.3;
  }
  vec3 c = vCol * (ring * 1.6 + ring2 + sparks) + mix(vCol, vec3(1.0), 0.6) * flash;
  if (vK > 4.5) {
    // gone (an NPC closed on death): no shockwave - a cool, flickering glow that fades and shrinks to nothing
    float flick = uReduced > 0.5 ? 1.0 : 0.65 + 0.35 * step(0.5, fract(t * 11.0));
    float rad = mix(0.55, 0.08, uReduced > 0.5 ? 0.5 : e);
    c = vCol * (exp(-r * r / (rad * rad) * 2.0) * 1.1 * flick + smoothstep(0.03, 0.0, abs(r - rad)) * 0.5) * (1.0 - t);
  }
  gl_FragColor = vec4(c * smoothstep(1.15, 1.0, r), 1.0);
}`,OM=`
uniform float uTime; uniform float uZoom;
attribute vec4 iE; attribute vec3 iC; attribute vec3 iC2; attribute vec2 iS;
varying float vU; varying float vX; varying vec3 vA; varying vec3 vB; varying float vT; varying float vSeed; varying float vLen;
void main() {
  float age = uTime - iS.x;
  if (age < 0.0 || age > 1.8) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  vec2 a = iE.xy; vec2 b = iE.zw; vec2 d = b - a; float L = length(d);
  if (L < 1e-4) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  vec2 dir = d / L; vec2 side = vec2(dir.y, -dir.x);
  float u = position.y + 0.5;
  vec2 w = mix(a - dir * 0.15, b + dir * 0.15, u) + side * position.x * 0.22 * clamp(uZoom, 0.6, 1.4);
  vU = u; vX = position.x * 2.0; vA = iC; vB = iC2; vT = age / 1.8; vSeed = iS.y; vLen = L + 0.3;
  gl_Position = projectionMatrix * viewMatrix * vec4(w.x, 0.0, -w.y, 1.0);
}`,BM=`
uniform float uReduced;
varying float vU; varying float vX; varying vec3 vA; varying vec3 vB; varying float vT; varying float vSeed; varying float vLen;
void main() {
  float core = 1.0 - vX * vX;
  float fade = 1.0 - vT;
  float bl = 0.35 / vLen; // bolt length in u
  float c1 = 0.0, c2 = 0.0;
  if (uReduced < 0.5) {
    for (int i = 0; i < 3; i++) {
      float ph = fract(vT * 2.6 + float(i) / 3.0 + vSeed);
      c1 += smoothstep(bl, 0.0, abs(vU - ph)) * step(vU, ph);
      float ph2 = 1.0 - fract(vT * 2.3 + float(i) / 3.0 + vSeed * 1.7);
      c2 += smoothstep(bl, 0.0, abs(vU - ph2)) * step(ph2, vU);
    }
  }
  vec3 beam = mix(vA, vB, vU) * 0.12 * (uReduced > 0.5 ? 2.5 : 1.0);
  vec3 c = (mix(vA, vec3(1.0), 0.35) * c1 + mix(vB, vec3(1.0), 0.35) * c2) * 1.4 + beam;
  gl_FragColor = vec4(c * core * fade, 1.0);
}`,xp=`
varying vec2 vUv; varying vec2 vW;
void main() { vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = vec2(w.x, -w.z); gl_Position = projectionMatrix * viewMatrix * w; }`,kM=`
uniform sampler2D uTex; uniform float uTerr; uniform float uTerrStat; uniform float uTerrLens; uniform float uTerrDim; uniform float uTerrFill; uniform float uAnim; uniform vec3 uFa0; uniform vec3 uFa1; uniform vec3 uFa2; uniform vec3 uFaW;
varying vec2 vUv; varying vec2 vW;
void main() {
  // Territory geometry (fill, rim, contested front, coverage) comes from the RAW weights; the faction filter is applied
  // afterwards as a strength. Scaling the weights themselves by uFaW (the pre-#14 code) pushed a filtered faction's
  // interior to m ~ 0.15, which sits inside the rim band (m ~ 0.16), so the whole region lit up as a bright blob.
  vec3 w = texture2D(uTex, vUv).rgb;
  float m = max(w.r, max(w.g, w.b));
  float mid = w.r + w.g + w.b - m - min(w.r, min(w.g, w.b));
  vec3 col = (uFa0 * w.r * w.r + uFa1 * w.g * w.g + uFa2 * w.b * w.b) / max(dot(w, w), 1e-4);
  vec3 vis = clamp((uFaW - 0.15) / 0.85, 0.0, 1.0);       // 1 = shown, 0 = filtered out (uFaW is 1 or 0.15)
  float share = dot(w, vis) / max(w.r + w.g + w.b, 1e-4); // how much of this pixel's territory is shown
  float k = mix(0.15, 1.0, share);                          // filtered factions keep a faint outline for context
  // Task #50 "influence, not a blob": the border (the m = 0.16 iso-line) is measured in SCREEN px (m / fwidth(m)), so the
  // edge is a ~1.5 px crisp line with a gentle glow at EVERY zoom (v4's band in m-space grew into a thick glowing worm at
  // mid zoom). Inside, the fill is densest along the border and thins toward the core (a soft falloff in world units, like
  // the field), with a faint hex lattice that fades out before it would alias; the fill alpha is lower overall.
  float fwm = max(fwidth(m), 1e-5);
  float dpx = (m - 0.16) / fwm;                                 // signed screen px from the border, > 0 inside
  float inside = smoothstep(-0.8, 0.8, dpx);
  float rim = (exp(-dpx * dpx * 0.7) * 0.22 + exp(-abs(dpx) * 0.4) * 0.03) * k;
  vec2 hp = vW / 1.4;
  vec2 hs = vec2(1.0, 1.7320508), ha = mod(hp, hs) - hs * 0.5, hb = mod(hp - hs * 0.5, hs) - hs * 0.5;
  vec2 hg = abs(dot(ha, ha) < dot(hb, hb) ? ha : hb);
  float he = 0.5 - max(dot(hg, vec2(0.5, 0.8660254)), hg.x);    // distance to the cell edge (cell units)
  float hfw = fwidth(hp.x);
  float hex = (1.0 - smoothstep(0.0, hfw * 1.5, he)) * smoothstep(0.09, 0.04, hfw);
  float infl = inside * (0.55 + 0.45 * (1.0 - smoothstep(0.16, 0.55, m)));
  float fill = infl * uTerrFill * share * (1.0 + hex * 0.6);
  float dfm = (m - mid) / max(fwidth(m - mid), 1e-5);           // contested front, also a constant-px seam
  float front = exp(-dfm * dfm * 0.7) * smoothstep(0.08, 0.3, mid) * k;
  float ang = atan(vW.y, vW.x + 1e-5);
  float da = mod(uAnim * 0.22 - ang, 6.2831853);
  float sweep = exp(-da * 2.2);
  vec3 c = col * (fill + rim + front * 0.3) * (1.0 + sweep * 0.6) * uTerr * uTerrStat * uTerrLens; // dimmer while a stat layer leads
  float rr = length(vW);
  float gfade = 1.0 - smoothstep(52.0, 78.0, rr);
  vec2 g = abs(fract(vW / 10.0 + 0.5) - 0.5) * 10.0;
  vec2 fw = fwidth(vW);
  float line = 1.0 - smoothstep(0.0, max(fw.x, fw.y) * 1.2, min(g.x, g.y));
  float rd = abs(fract(rr / 20.0 + 0.5) - 0.5) * 20.0;
  float ring = 1.0 - smoothstep(0.0, length(fw) * 1.4, rd);
  float sweepLine = smoothstep(0.02, 0.0, da) * 0.6 + sweep * 0.05;
  // the cyan grid steps back inside a shown territory (task #50: with the lower fill it pulled gold toward green)
  c += vec3(0.16, 0.6, 0.75) * (line * 0.045 + ring * 0.07 + sweepLine * 0.35) * gfade * (1.0 - 0.8 * inside * share * uTerr * uTerrLens);
  // Premultiplied 'over' (blend ONE, ONE_MINUS_SRC_ALPHA): alpha = territory coverage dims the blue-violet nebula under
  // a faction's space, so the faint fill composites to the house hue instead of being pulled toward magenta / blue
  // (E2E pixel check, task #13). Rim, front, grid and sweep keep adding light on top; outside territory alpha is 0,
  // which is plain additive as before.
  // Weighted by the faction filter (reviewer P3, task #14): a filtered-out faction must not dim the backdrop either,
  // so coverage is the raw coverage times the shown share.
  float cover = inside * smoothstep(0.16, 0.5, m) * share * uTerrDim * uTerr * uTerrStat * uTerrLens;
  gl_FragColor = vec4(c, cover);
}`,zM=`
varying vec2 vW;
void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xz; gl_Position = projectionMatrix * viewMatrix * w; }`,VM=`
uniform float uAnim; varying vec2 vW;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + vec2(17.1, 9.2); a *= 0.5; } return v; }
void main() {
  vec2 p = vW * 0.011;
  float n = fbm(p + vec2(uAnim * 0.004, 0.0));
  float n2 = fbm(p * 1.7 - vec2(0.0, uAnim * 0.003) + n * 1.6);
  vec3 c = vec3(0.006, 0.014, 0.024)
    + vec3(0.03, 0.14, 0.19) * smoothstep(0.42, 0.9, n2) * 0.3
    + vec3(0.16, 0.04, 0.24) * smoothstep(0.5, 0.95, n) * 0.2
    + vec3(0.2, 0.08, 0.03) * smoothstep(0.62, 0.95, n2 * n * 1.6) * 0.12;
  c *= 1.0 - smoothstep(140.0, 560.0, length(vW)) * 0.8;
  gl_FragColor = vec4(c, 1.0);
}`,_p=.5,HM=62,GM=72,WM=`
uniform float uAnim; uniform float uPR;
attribute float aSize; attribute vec3 aCol; attribute float aSeed;
varying vec3 vCol;
void main() {
  // task #56 add-on: a star whose line of sight (camera -> star) crosses the map plane y = 0 inside the map footprint is
  // BEHIND the map - hidden (owner: under-map stars read as fleets). Footprint: radius MAP_R0 around the map centre,
  // faded out to MAP_R1 (systems reach 58.6). Map y = -world z.
  vec4 wp = modelMatrix * vec4(position, 1.0);
  float behind = 1.0;
  if (cameraPosition.y > 0.0 && wp.y < 0.0) {
    vec3 hit = mix(cameraPosition, wp.xyz, cameraPosition.y / (cameraPosition.y - wp.y));
    behind = smoothstep(${HM.toFixed(1)}, ${GM.toFixed(1)}, distance(vec2(hit.x, -hit.z), vec2(${_p.toFixed(2)}, ${_p.toFixed(2)})));
  }
  if (behind < 0.001) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float tw = 0.75 + 0.25 * sin(uAnim * (0.6 + aSeed * 2.0) + aSeed * 50.0);
  vCol = aCol * tw * behind;
  gl_PointSize = clamp(aSize * uPR * 260.0 / -mv.z, 1.0, 6.0 * uPR);
  gl_Position = projectionMatrix * mv;
}`,XM=`
varying vec3 vCol;
void main() { vec2 q = gl_PointCoord * 2.0 - 1.0; float r2 = dot(q, q); gl_FragColor = vec4(vCol * exp(-r2 * 4.0), 1.0); }`;function Ci(i=1){let t=new Oi(1,1,1,i),e=new go;return e.index=t.index,e.setAttribute("position",t.getAttribute("position")),e.setAttribute("uv",t.getAttribute("uv")),e.instanceCount=0,e}function Ri(i,t,e){let n=i.getAttribute(t[0][0]);if(!n||n.count<e){let r=Math.max(64,2**Math.ceil(Math.log2(Math.max(1,e))));n&&i.dispose();for(let[o,a]of t){let l=new oo(new Float32Array(r*a),a);l.setUsage(xh),i.setAttribute(o,l)}}i.instanceCount=e;let s={};for(let[r]of t)s[r]=i.getAttribute(r);return s}function ms(i,t,e,n,s="add"){n&&(e.uFade=n);let r=new We({vertexShader:i,uniforms:e,transparent:!0,depthWrite:!1,depthTest:!1,blending:Is,fragmentShader:n?t.replace("void main()","void main0()")+`
uniform float uFade;
void main() { main0(); gl_FragColor *= uFade; }`:t});return s==="premult"&&Object.assign(r,{blending:Sr,blendSrc:Ls,blendDst:br,blendEquation:Si}),s==="max"&&Object.assign(r,{blending:Sr,blendSrc:Ls,blendDst:Ls,blendEquation:rl}),r}var fi=(i,t,e,n)=>ms(i,t,e,n,"add"),vp=typeof document<"u"&&document.currentScript&&document.currentScript.src||"";function Dn(i,t,e){let n=new Ge(i,t);return n.frustumCulled=!1,n.renderOrder=e,n}var qM=i=>i<.5?4*i*i*i:1-(-2*i+2)**3/2,YM=i=>Ai[Je(i)];function $M(i){let t=i>>>0;return()=>(t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296)}var Xs=256,kr=140,_c=.5,vc=.5;function ZM(i,t){let e=ap(i,Xs,kr,_c,vc);for(let n=0;n<Xs*Xs;n++){for(let s=0;s<3;s++)t[n*4+s]=Math.round(255*(1-Math.exp(-e[s][n]*.9)));t[n*4+3]=255}}var Hi=512,KM=3,JM=1.2,jM=2.5,yp=.5,QM=.7,Mp=.9,tS=.09,eS=.25,Ep=1.7,nS=7,pu=null;function iS(i,t){if(pu)return pu;let e=(l,c,h)=>{let f=Math.sin(l*127.1+c*311.7+h*74.7)*43758.5453;return f-Math.floor(f)},n=(l,c,h)=>{let f=Math.floor(l),u=Math.floor(c),d=l-f,m=c-u,M=d*d*(3-2*d),x=m*m*(3-2*m);return(e(f,u,h)*(1-M)+e(f+1,u,h)*M)*(1-x)+(e(f,u+1,h)*(1-M)+e(f+1,u+1,h)*M)*x},s=new Float32Array(i*i),r=new Float32Array(i*i),o=1/(nS*t),a=Ep*t;for(let l=0;l<i;l++)for(let c=0;c<i;c++){let h=c*o,f=l*o;s[l*i+c]=a*(2*(.65*n(h,f,1)+.35*n(h*2.1,f*2.1,3))-1),r[l*i+c]=a*(2*(.65*n(h,f,2)+.35*n(h*2.1,f*2.1,4))-1)}return pu=[s,r]}function sS(i,t,e,n){let s=Hi,r=s*s,o=s/kr,[a,l]=iS(s,o),c=[...new Set(i.filter(E=>E.winner).map(E=>E.winner))],h=new Map(c.map((E,I)=>[E,I])),f=c.length+1,u=c.length,d=Array.from({length:f},()=>new Float32Array(r)),m=new Float32Array(r),M=new Float32Array(r),x=c.map(E=>t(E)).concat(Wo).map(E=>[1,3,5].map(I=>parseInt(E.slice(I,I+2),16))),p=KM*o,P=JM*o,U=Math.ceil(p*3+Ep*o),b=1/(2*p*p),S=1/(2*P*P);for(let E of i){let I=E.winner?Math.min(1,Math.max(0,E.strength||0)):0,v=E.winner?yp+(1-yp)*I:QM,R=d[E.winner?h.get(E.winner):u],L=(E.x-(_c-kr/2))*o,F=(E.y-(vc-kr/2))*o;for(let N=Math.max(0,Math.floor(F-U));N<=Math.min(s-1,Math.ceil(F+U));N++)for(let W=Math.max(0,Math.floor(L-U));W<=Math.min(s-1,Math.ceil(L+U));W++){let B=N*s+W,J=W+.5-L,ot=N+.5-F,lt=J+a[B],vt=ot+l[B],at=lt*lt+vt*vt,gt=Math.exp(-at*b);R[B]+=v*(gt+jM*Math.exp(-(J*J+ot*ot)*S)),E.winner&&(m[B]+=gt,M[B]+=gt*(.3+.7*I))}}for(let E=0;E<r;E++){let I=-1,v=0,R=0;for(let N=0;N<f;N++){let W=d[N][E];W>v?(R=v,v=W,I=N):W>R&&(R=W)}let L=E*4;if(I<0||v<1e-4){e[L]=e[L+1]=e[L+2]=e[L+3]=0,n[L]=n[L+1]=n[L+2]=0,n[L+3]=255;continue}let F=x[I];e[L]=F[0],e[L+1]=F[1],e[L+2]=F[2],e[L+3]=Math.round(255*(1-Math.exp(-v*Mp))),n[L]=I===u?255:0,n[L+1]=Math.round(255*(1-Math.exp(-R*Mp))),n[L+2]=Math.round(255*(m[E]>1e-6?M[E]/m[E]:0)),n[L+3]=255}}function rS(i,t){let e=document.createElement("div");e.textContent="Galaxy map unavailable: "+t,e.style.cssText="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#7fa;font:13px system-ui;opacity:.7",i.appendChild(e);let n=()=>{};return{ok:!1,reason:t,setData:()=>!1,setMine:()=>0,setFilter:n,focusOwner:()=>0,focusPoint:n,pulseEvent:n,focusSystem:()=>!1,bodyScreen:()=>null,setStatLayer:()=>!1,setStatResource:()=>!1,setInsets:()=>({left:0,right:0,top:0,bottom:0}),fleetScreen:()=>null,fleetPixelSize:()=>null,fleetCell:()=>null,on:()=>n,setLayer:()=>!1,screenOf:()=>null,getStats:()=>({ok:!1,reason:t}),dispose:()=>e.remove()}}function oS(i,t={}){if(!i||!i.appendChild)throw new TypeError("C4Scene.mount needs a container element");let e=t.reducedMotion!=null?!!t.reducedMotion:!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches),n=typeof t.clock=="function"?t.clock:()=>Date.now()/1e3;getComputedStyle(i).position==="static"&&(i.style.position="relative");let s;try{s=new Jl({antialias:!1,powerPreference:"high-performance",alpha:!1})}catch(_){return rS(i,"WebGL is not available ("+(_&&_.message?_.message:_)+")")}let r=Math.min(window.devicePixelRatio||1,1.5);s.setPixelRatio(r),s.toneMapping=Ds,s.toneMappingExposure=1.1,s.setClearColor(0,1),s.info.autoReset=!1;let o=s.domElement;o.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;outline:none",i.appendChild(o);let a=document.createElement("div");a.style.cssText="position:absolute;inset:0;overflow:hidden;pointer-events:none;contain:strict",i.appendChild(a);let l=document.createElement("div");l.className="c4-stat-layer",l.style.cssText="position:absolute;inset:0;overflow:hidden;pointer-events:none;contain:strict;display:none",i.appendChild(l);let c=new io,h=new gn(Br,1,.5,Oy),f=new ic(h,o);f.enableDamping=!0,f.dampingFactor=.08,f.screenSpacePanning=!1,f.minDistance=.03,f.maxDistance=240,f.maxPolarAngle=1.15,f.zoomSpeed=1.2,f.autoRotateSpeed=.12,f.zoomToCursor=!1;let u={uNow:{value:0},uAnim:{value:0},uTime:{value:0},uZoom:{value:1},uSysZoom:{value:1},uDim:{value:1},uReduced:{value:e?1:0},uPR:{value:r},uGal:{value:1},uGlyphK:{value:1},uSil:{value:1},uViewH:{value:1},uHasAtlas:{value:0},uAtlas:{value:null},uCols:{value:8},uRows:{value:8}},d=new Ge(new Oi(1600,1600).rotateX(-Math.PI/2),new We({vertexShader:zM,fragmentShader:VM,uniforms:{uAnim:u.uAnim},depthWrite:!1,depthTest:!1}));d.position.y=-70,d.renderOrder=-10,d.frustumCulled=!1,c.add(d);let m=new yn;{let _=$M(7),C=4200,T=new Float32Array(C*3),w=new Float32Array(C),Y=new Float32Array(C*3),tt=new Float32Array(C);for(let st=0;st<C;st++){let rt=40+_()*460,ft=_()*Math.PI*2;T[st*3]=Math.cos(ft)*rt,T[st*3+2]=Math.sin(ft)*rt,T[st*3+1]=-12-_()*50,w[st]=.6+_()**3*2.4;let mt=_(),j=.35+_()*.65;Y[st*3]=j*(mt<.2?1:.75+mt*.2),Y[st*3+1]=j*.88,Y[st*3+2]=j*(mt>.7?1:.85),tt[st]=_()}m.setAttribute("position",new un(T,3)),m.setAttribute("aSize",new un(w,1)),m.setAttribute("aCol",new un(Y,3)),m.setAttribute("aSeed",new un(tt,1))}let M=new lo(m,fi(WM,XM,{uAnim:u.uAnim,uPR:u.uPR}));M.renderOrder=-9,M.frustumCulled=!1,c.add(M);let x=new Uint8Array(Xs*Xs*4),p=new ns(x,Xs,Xs,Mn);p.magFilter=Ye,p.minFilter=Ye,p.needsUpdate=!0;let P={uTex:{value:p},uTerr:{value:1},uTerrStat:{value:1},uTerrLens:{value:1},uTerrDim:{value:.88},uTerrFill:{value:.034},uAnim:u.uAnim,uFaW:{value:new G(1,1,1)},uFa0:{value:new G},uFa1:{value:new G},uFa2:{value:new G}},U=(_,C=!1)=>{let T=w=>C?Vi(Wo).map(Y=>Y*.5):Ai[w];P.uFa0.value.set(...T("mud").map(w=>w*(C?1:_[0]))),P.uFa1.value.set(...T("oni").map(w=>w*(C?1:_[1]))),P.uFa2.value.set(...T("ustur").map(w=>w*(C?1:_[2])))},b=Pd.slice();U(b);let S=new Ge(new Oi(kr,kr).rotateX(-Math.PI/2),Object.assign(ms(xp,kM,P,null,"add"),{blending:Sr,blendSrc:Ls,blendDst:br,blendEquation:Si}));S.position.set(_c,0,-vc),S.renderOrder=0,S.frustumCulled=!1,c.add(S),e&&(P.uAnim={value:0});let E=new Uint8Array(Hi*Hi*4),I=new Uint8Array(Hi*Hi*4),v=new ns(E,Hi,Hi,Mn),R=new ns(I,Hi,Hi,Mn);for(let _ of[v,R])_.magFilter=Ye,_.minFilter=Ye,_.needsUpdate=!0;let L=new Ge(S.geometry,ms(xp,LM,{uConq:{value:v},uConqX:{value:R},uConqFill:{value:tS},uConqDim:{value:eS}},null,"premult"));L.position.set(_c,.01,-vc),L.renderOrder=.5,L.frustumCulled=!1,L.visible=!1,c.add(L);let F=Ci(),N=Ci(),W=Ci(),B=Ci(),J=[["iA",4],["iT",2],["iC",3],["iM",4],["iX",2],["iO",4],["iY",1]],ot={uNow:u.uNow,uAnim:u.uAnim,uZoom:u.uZoom,uBeamGain:{value:2.6},uSil:u.uSil,uHasAtlas:u.uHasAtlas,uAtlas:u.uAtlas,uCols:u.uCols,uRows:u.uRows,uShipBase:{value:hu.galaxy},uViewH:u.uViewH,uDots:{value:1}},lt=Dn(F,fi(jy,Qy,ot,null),2),vt=Dn(W,fi(DM,NM,{uZoom:u.uZoom,uAnim:u.uAnim},u.uGal),2),at=Dn(F,fi(Ky,Jy,ot,null),3),gt={value:1},yt={value:2.5},Xt=Dn(N,ms(sM,rM,{uSysZoom:u.uSysZoom,uGlyphK:u.uGlyphK,uViewH:u.uViewH,uAnim:u.uAnim,uDim:u.uDim,uSysCover:yt,uResDim:gt},null,"premult"),4),Gt=Dn(F,fi(nM,iM,ot,null),4.8),Ce=Dn(F,ms(Wy,Zy,ot,null,"premult"),5),pe=Dn(F,ms(Yy,$y,ot,null,"premult"),4.6),Me=Dn(B,fi(FM,UM,{uTime:u.uTime,uReduced:u.uReduced},u.uGal),6),ct=Ci(),X=Dn(ct,fi(OM,BM,{uTime:u.uTime,uZoom:u.uZoom,uReduced:u.uReduced},u.uGal),6),wt=Ci(),Pt={uAnim:u.uAnim,uStatH:{value:1},uStatW:{value:1},uGrow:{value:1},uMinH:{value:0}},xt=Dn(wt,fi(uM,fM,Pt,u.uGal),7),Ft=Dn(wt,fi(dM,pM,{uStatW:Pt.uStatW,uGrow:Pt.uGrow,uViewH:u.uViewH},u.uGal),7);xt.visible=Ft.visible=!1;let jt=Ci(),re=Dn(jt,ms(MM,SM,{uGrow:Pt.uGrow,uViewH:u.uViewH,uZoom:u.uZoom,uCol:{value:new G(...Vi(nu))}},u.uGal,"max"),4.2);re.visible=!1,c.add(re);let ae=Ci(),Re={uHaloK:{value:1}},Qt=Dn(ae,fi(PM,IM,Re,u.uGal),1);Qt.visible=!1,c.add(Qt);let Te=Ci(je.seg),_e={uAnim:u.uAnim,uViewH:u.uViewH,uGain:{value:je.gain},uCol:{value:new G(...Vi(je.hex))}},Ze=Dn(Te,fi(tM,eM,_e,null),1.5);c.add(Ze),c.add(lt,vt,at,Xt,Gt,pe,Ce,Me,X,Ft,xt);let ce=Ri(ct,[["iE",4],["iC",3],["iC2",3],["iS",2]],mc);for(let _=0;_<mc;_++)ce.iS.array[_*2]=-1e9;let De=0,O=Ri(B,[["iS",4],["iC",3],["iK",1]],pc);O.iS.array.fill(-1e9);for(let _=0;_<pc;_++)O.iS.array[_*4+3]=-1e9;let bt=0,At={systems:[Xt],fleets:[Ce,pe,at],mining:[],routes:[lt],gates:[Ze],combat:[]},A=Object.fromEntries(mu.map(_=>[_,!0])),g=()=>{Gt.visible=A.fleets&&A.mining},H=t.assetBase||new URL("../Images/planets/",vp||location.href).href,V=dp({scene:c,camera:h,U:u,quadGeometry:Ci,instanceAttrs:Ri,shaderMat:ms,assetBase:H}),q={addr:null,framed:null,frameD:0,frac:0},St={nearK:pp,domIn:Hy,domOut:Gy,dcOut:1.25},_t=new $e(1,1,{type:en,samples:4}),K=new oc(s,_t);K.addPass(new ac(c,h));let it=new Dr(new Wt(1,1),.4,.2,.85);K.addPass(it),K.addPass(new lc);let D=null,ut={name:null,cols:[],callouts:[],dirty:!1,vmax:0,growAt:0,res:null},Tt=()=>{vt.visible=A.combat&&ut.name==="combat"};Tt();let nt={dacs:[],example:!1,focus:null,halos:[],mark:null,markBox:null,lens:{on:!1,metrics:[],scope:null},conq:null,lensKey:""},qt=Vi(Wo),$t=_=>nt.lens.on?qt:YM(_),te=new Set,z=_=>!_.npc&&te.has(_.o)?Vo:$t(_.fa),Ct=_=>nt.lens.on?Wo:zo[Je(_)],dt=_=>Math.max(_.h*Pt.uStatH.value,Pt.uMinH.value)*Pt.uGrow.value,Rt=_=>le/(2*Math.tan(Br*Math.PI/360)*Math.max(.001,_)),pt={left:0,right:0,top:0,bottom:0},Mt={left:0,right:0,top:0,bottom:0},Yt=!1,Lt={faction:null,states:null,owner:null},Ae={pick:new Set,hover:new Set,systemView:new Set},ve=[],an=null,Nn=t.shipAtlasBase||new URL("../Images/ships/silhouettes/",vp||location.href).href;fetch(Nn+"atlas.json").then(_=>_.ok?_.json():Promise.reject(new Error("HTTP "+_.status))).then(_=>{let C=(window.devicePixelRatio||1)>1.25&&_.image2x?_.image2x:_.image;new po().load(Nn+C,T=>{if(sa){T.dispose();return}T.colorSpace=pn,T.anisotropy=4,an=_,u.uAtlas.value=T,u.uHasAtlas.value=1,u.uCols.value=_.cols||8,u.uRows.value=_.rows||8,D&&be()},void 0,()=>console.warn("C4Scene: ship atlas image failed to load; keeping the glyphs"))}).catch(_=>console.warn("C4Scene: ship atlas unavailable; keeping the glyphs",_&&_.message));let Zn=(_,C)=>{for(let T of Ae[_])try{T(C)}catch(w){console.error("C4Scene "+_+" handler",w)}},Se=1,le=1,Pe={left:0,top:0},Kn=performance.now(),Gi=new Map,ye={on:!1,t:0,dur:1,fx:0,fz:0,tx:0,tz:0,fr:1,tr:1,fp:0,tp:0,th:0},ln=new yi,ee=new G,cn=[0,0],bn=new Float32Array(16),di=[];function qs(){let _=i.getBoundingClientRect(),C=Se+"x"+le;Se=Math.max(1,Math.round(_.width)),le=Math.max(1,Math.round(_.height)),s.setSize(Se,le,!1),K.setPixelRatio(r),K.setSize(Se,le),h.aspect=Se/le,u.uViewH.value=le,f.minDistance=Bs.medium*.5*le/Math.tan(Br*Math.PI/360)/Uy,Wi(),Pe=o.getBoundingClientRect(),bn[0]=NaN,Se+"x"+le!==C&&(Gi.clear(),ze())}function Wi(){Object.assign(pt,Mt),pt.left+pt.right>Se-40&&(pt.left=pt.right=0),pt.top+pt.bottom>le-40&&(pt.top=pt.bottom=0);let _=(pt.right-pt.left)/2,C=(pt.bottom-pt.top)/2;_||C?h.setViewOffset(Se,le,_,C,Se,le):(h.clearViewOffset(),h.updateProjectionMatrix())}let pi=[],qo=(_,C)=>pi.some(T=>_>=T.left&&_<=T.right&&C>=T.top&&C<=T.bottom),zr=(_,C)=>_<pt.left||_>Se-pt.right||C<pt.top||C>le-pt.bottom||qo(_,C),Vr=(_,C,T,w)=>_>=pt.left+2&&C>=pt.top+2&&T<=Se-pt.right-2&&w<=le-pt.bottom-2&&!pi.some(Y=>_<Y.right&&T>Y.left&&C<Y.bottom&&w>Y.top),Yo=new ResizeObserver(qs);Yo.observe(i);function yc(_,C,T,w,Y){f.target.set(_,0,-C),ln.set(T,w,Y),h.position.setFromSpherical(ln).add(f.target),h.lookAt(f.target)}function Xn(_,C,T,w,Y=1.6){q.framed=null,Kn=performance.now(),ee.copy(h.position).sub(f.target),ln.setFromVector3(ee),Object.assign(ye,{on:!0,t:0,dur:Y,fx:f.target.x,fz:f.target.z,tx:_,tz:-C,fr:ln.radius,tr:Math.min(f.maxDistance,Math.max(f.minDistance,T)),fp:ln.phi,tp:w,th:ln.theta}),(e||Y<=0)&&(ye.t=ye.dur=1,y(0))}function y(_){ye.t=Math.min(ye.dur,ye.t+_);let C=qM(ye.t/ye.dur),T=Math.exp(Math.log(ye.fr)+(Math.log(ye.tr)-Math.log(ye.fr))*C),w=ye.tr<ye.fr?1-(1-C)*T/ye.fr:C*T/ye.tr;f.target.set(ye.fx+(ye.tx-ye.fx)*w,0,ye.fz+(ye.tz-ye.fz)*w),ln.set(T,ye.fp+(ye.tp-ye.fp)*C,ye.th),h.position.setFromSpherical(ln).add(f.target),h.lookAt(f.target),ye.t>=ye.dur&&(ye.on=!1)}let k=.9,Q={x:0,y:0},$=new G,Z=new G,It=new G,Ot=new mn(new G(0,1,0),0),Et={x:0,y:0,on:!1},kt=new Ps,Vt=new Wt,ne=0,fe=_=>{if(!f.enabled)return;_.preventDefault(),_.stopPropagation();let C=_.deltaY*(_.deltaMode===1?33:_.deltaMode===2?le:1);ne+=Math.log(k)*(-C/100),ne=Math.max(-6,Math.min(6,ne)),Q.x=_.clientX,Q.y=_.clientY,_.target===o&&(Et.x=_.clientX,Et.y=_.clientY,Et.on=!0),q.framed=null,ye.on=!1,Kn=performance.now(),f._sphericalDelta&&typeof f._sphericalDelta.set=="function"&&f._sphericalDelta.set(0,0,0),f._panOffset&&typeof f._panOffset.set=="function"&&f._panOffset.set(0,0,0),f.autoRotate=!1};i.addEventListener("wheel",fe,{capture:!0,passive:!1});function zt(_){if(Math.abs(ne)<1e-4){ne=0;return}let C=e?ne:ne*(1-Math.exp(-_*14)),T=h.position.distanceTo(f.target),w=T*Math.exp(C),Y=Math.min(f.maxDistance,Math.max(f.minDistance,w)),tt=Y/T;if(ne=Y===w?ne-C:0,tt===1)return;Vt.set((Q.x-Pe.left)/Se*2-1,-((Q.y-Pe.top)/le)*2+1),kt.setFromCamera(Vt,h),(!kt.ray.intersectPlane(Ot,$)||$.distanceTo(h.position)>T*8)&&$.copy(f.target),h.getWorldDirection(It),Z.copy(h.position).sub($).multiplyScalar(tt),h.position.copy($).add(Z),It.y<-.001?f.target.copy(h.position).addScaledVector(It,-h.position.y/It.y):(Z.copy(f.target).sub($).multiplyScalar(tt),f.target.copy($).add(Z)),Kn=performance.now()}f.addEventListener("start",()=>{ye.on=!1,Kn=performance.now(),q.framed=null}),f.addEventListener("end",()=>{Kn=performance.now()}),yc(In.x,In.y,e?In.dist:300,e?In.polar:.25,e?0:-.6);function be(){let _=D.fleets,C=_.length,T=Ri(F,J,C),w=T.iA.array,Y=T.iT.array,tt=T.iC.array,st=T.iM.array,rt=T.iX.array,ft=T.iO.array,mt=T.iY.array;for(let j=0;j<C;j++){let Nt=_[j],Zt=D.paths[j],Bt=z(Nt),Kt=D.anchors[j],ht=D.place[j];ht?(w.set(ht.A,j*4),ft.set(ht.O,j*4),Y[j*2]=ht.T[0],Y[j*2+1]=ht.T[1]):(ft[j*4]=ft[j*4+1]=ft[j*4+2]=ft[j*4+3]=0,Zt.moving&&(D.kinds[j]===3||D.kinds[j]===4)?(w[j*4]=Zt.from[0],w[j*4+1]=Zt.from[1],w[j*4+2]=Zt.to[0],w[j*4+3]=Zt.to[1],Y[j*2]=Zt.dep-D.tBase,Y[j*2+1]=Zt.arr-D.tBase):(w[j*4]=Kt[0],w[j*4+1]=Kt[1],w[j*4+2]=D.targets[j][0],w[j*4+3]=D.targets[j][1],Y[j*2]=0,Y[j*2+1]=0)),tt[j*3]=Bt[0],tt[j*3+1]=Bt[1],tt[j*3+2]=Bt[2],st[j*4]=zd(Nt.ships),st[j*4+1]=D.kinds[j],st[j*4+2]=ke(j),st[j*4+3]=D.seeds[j],rt[j*2]=uc(an,Nt.flag,Nt.flagSize),rt[j*2+1]=ks(Nt.flagSize),mt[j]=!Nt.npc&&te.has(Nt.o)?1:0}for(let j in T)T[j].needsUpdate=!0}let ke=_=>!A.mining&&D.fleets[_].s.kind==="mining"?0:D.vis[_];function Ie(){if(!D)return;let _=F.getAttribute("iM"),C=N.getAttribute("iM"),T=W.getAttribute("iM");for(let Y=0;Y<D.fleets.length;Y++)D.vis[Y]=au(D.fleets[Y],Lt),_.array[Y*4+2]=ke(Y);_.needsUpdate=!0;for(let Y=0;Y<D.systems.length;Y++)C.array[Y*4]=hc(D.systems[Y].f,Lt.faction)?.22:1;C.needsUpdate=!0;for(let Y=0;Y<D.hot.length;Y++)T.array[Y*4+3]=Wd(D.hot[Y],Lt.faction)?1:.15;T.needsUpdate=!0,Le(),(ut.name==="owners"||ut.name==="combat")&&(ut.dirty=!0),u.uDim.value=Lt.owner?.4:1,P.uFaW.value.set(...["mud","oni","ustur"].map(Y=>hc(Y,Lt.faction)?.15:1)),bn[0]=NaN}function Le(){if(!D)return;let _=ut.name&&ut.colSys,C=N.getAttribute("iM");if(C&&D.systems){for(let T=0;T<D.systems.length;T++)C.array[T*4+2]=_&&_.has(D.systems[T].a)?1:0;C.needsUpdate=!0}}function Qe(){let _=nt.lens.on;if(U(b,_),P.uTerrLens.value=_?0:1,nt.conq=_&&D?np(D.latest,D.events,nt.dacs,nt.lens.metrics,nt.lens.scope):null,nt.conq){let C=new Map(nt.dacs.map(T=>[T.tag,T.color]));sS(nt.conq.systems.filter(T=>T.winner||T.contested),T=>C.get(T)||Wo,E,I),v.needsUpdate=R.needsUpdate=!0}if(L.visible=!!nt.conq,D){let C=F.getAttribute("iC"),T=N.getAttribute("iC");C&&(D.fleets.forEach((w,Y)=>C.array.set(z(w),Y*3)),C.needsUpdate=!0),T&&(D.systems.forEach((w,Y)=>T.array.set($t(w.f),Y*3)),T.needsUpdate=!0),_u(),bn[0]=NaN}ut.name==="dacs"&&(ut.dirty=!0)}function Ut(_,C,T){if(!_||!Array.isArray(_.fleets)||!Array.isArray(_.systems))return console.error("C4Scene.setData: latest.json shape not recognised (need fleets[] and systems[])"),!1;let w=Number.isFinite(_.generatedAt)?_.generatedAt:Math.floor(n()),Y=new Map((_.asteroids||[]).map(ht=>[ht.a,ht])),tt=new Map(_.systems.map(ht=>[ht.a,ht])),st=_.fleets.filter(ht=>ht&&ht.s&&Number.isFinite(ht.x)&&Number.isFinite(ht.y)),rt=st.length;D={latest:_,events:Array.isArray(C)?C:[],tBase:w,fleets:st,systems:_.systems.filter(ht=>Number.isFinite(ht.x)&&Number.isFinite(ht.y)),asteroids:(_.asteroids||[]).filter(ht=>Number.isFinite(ht.x)&&Number.isFinite(ht.y)),paths:new Array(rt),anchors:new Array(rt),targets:new Array(rt),seeds:new Float32Array(rt),kinds:new Float32Array(rt),vis:new Float32Array(rt),hot:[],index:new Map(st.map((ht,et)=>[ht.a,et]))};for(let ht=0;ht<rt;ht++){let et=st[ht],Ht=et.s,he=Pn(et.a),Be=Ht.kind;D.paths[ht]=eu(et),D.seeds[ht]=he,D.kinds[ht]=Id(Be);let Ve=[et.x,et.y],wn=Ve;if(Be==="mining"){let Tn=Y.get(Ht.asteroid);Tn&&(Ve=[Tn.x,Tn.y]),wn=Ve}else if(Be==="docked"){let Tn=tt.get(Ht.system);Tn&&(Ve=[Tn.x,Tn.y]),wn=Ve}D.anchors[ht]=Ve,D.targets[ht]=wn,tu(Be)&&!D.paths[ht].moving&&(D.kinds[ht]=0)}let ft=w-120,mt=[0,0];for(let ht=0;ht<rt;ht++){let et=D.paths[ht];et.moving&&et.arr<=ft&&(D.kinds[ht]=0,D.anchors[ht]=D.targets[ht]=[et.to[0],et.to[1]])}for(let ht=0;ht<rt;ht++)D.vis[ht]=au(st[ht],Lt);Array.isArray(T)&&(ve=T.filter(ht=>ht&&ht.a&&ht.sys)),D.bodiesBySys=new Map,Gi.clear();for(let ht of ve){let et=D.bodiesBySys.get(ht.sys);et||D.bodiesBySys.set(ht.sys,et=[]),et.push(ht)}D.members=uu(st,D.systems,ve,ft),D.sysByAddr=new Map(D.systems.map(ht=>[ht.a,ht])),D.ownerFa=new Map((_.owners||[]).map(ht=>[ht.p,ht.fa])),D.stakes=(_.stakes||[]).filter(ht=>ht&&ht.body),D.mine=te,D.place=V.build(D).place;for(let ht of kd(st,ft).values()){let et=ht.filter(Ht=>!D.place[Ht]);et.length<2||et.forEach((Ht,he)=>{Bd(he,mt);let Be=D.anchors[Ht];D.anchors[Ht]=D.targets[Ht]=[Be[0]+mt[0],Be[1]+mt[1]]})}be();let j=D.systems,Nt=Ri(N,[["iS",4],["iC",3],["iM",4]],j.length),Zt=V.world.infos;for(let ht=0;ht<j.length;ht++){let et=j[ht],Ht=$t(et.f);Nt.iS.array.set([et.x,et.y,Hd(et.lvl),et.lvl||0],ht*4),Nt.iC.array.set(Ht,ht*3),Nt.iM.array.set([1,Pn(et.a),0,Zt[ht].starR],ht*4)}for(let ht in Nt)Nt[ht].needsUpdate=!0;D.gates=Vd(D.systems);let Bt=Ri(Te,[["iE",4],["iG",2]],D.gates.length);for(let ht=0;ht<D.gates.length;ht++){let et=D.gates[ht];Bt.iE.array.set([et.ax,et.ay,et.bx,et.by],ht*4),Bt.iG.array.set([et.seed,et.len],ht*2)}for(let ht in Bt)Bt[ht].needsUpdate=!0;D.hot=Gd(Array.isArray(C)?C:[],w);let Kt=Ri(W,[["iS",4],["iM",4]],D.hot.length);for(let ht=0;ht<D.hot.length;ht++){let et=D.hot[ht],Ht=Math.exp(-(w-et.last)/7200);Kt.iS.array.set([et.x,et.y,.8+Math.log2(1+et.n)*.5,Math.min(1.6,.35+et.heat*.35)],ht*4),Kt.iM.array.set([et.destroyed?Math.min(1,et.destroyed/et.n+.4):0,Pn(et.x+","+et.y),Ht,1],ht*4)}for(let ht in Kt)Kt[ht].needsUpdate=!0;if(ZM(D.systems,x),p.needsUpdate=!0,_u(),Ie(),nt.lens.on&&Qe(),ut.dirty=!!ut.name,q.addr=q.addr&&D.sysByAddr.has(q.addr)?q.addr:(q.addr&&Zn("systemView",null),null),q.framed){let ht=D.sysByAddr.get(q.framed);ht&&!(Math.abs(we(ht)-q.frameD)<=.01*q.frameD)&&ze()}return bn[0]=NaN,Yt||(Yt=!0,!e&&!ye.on&&Xn(In.x,In.y,In.dist,In.polar,2.6)),!0}let tn=.8,me=26,Ue=new gn(Br,1,.5,2500),dn=new G,Fn=new yi,Xi=_=>{let C=V.world,T=C&&C.byAddr.get(_);return T?T.ext:Go(0)*zi.K};function we(_){let C=Gi.get(_.a);if(C!==void 0)return C;let T=Xi(_.a),w=(ee.copy(h.position).sub(f.target),ln.setFromVector3(ee).theta);Ue.copy(h),Ue.near=Math.max(1e-5,f.minDistance*pp),Ue.updateProjectionMatrix(),dn.set(_.x,0,-_.y);let Y=pt.left+me,tt=Se-pt.right-me,st=pt.top+me,rt=le-pt.bottom-me,ft=Nt=>{Fn.set(Nt,tn,w),Ue.position.setFromSpherical(Fn).add(dn),Ue.lookAt(dn),Ue.updateMatrixWorld();for(let Zt=0;Zt<48;Zt++){let Bt=Zt/48*Math.PI*2;ee.set(_.x+Math.cos(Bt)*T,0,-(_.y+Math.sin(Bt)*T)).project(Ue);let Kt=(ee.x+1)/2*Se,ht=(1-ee.y)/2*le;if(ee.z>=1||Kt<Y||Kt>tt||ht<st||ht>rt)return!1}return!0},mt=f.minDistance,j=f.maxDistance;if(tt-Y<40||rt-st<40||!ft(j))C=j;else if(ft(mt))C=mt;else{for(let Nt=0;Nt<40;Nt++){let Zt=Math.sqrt(mt*j);ft(Zt)?j=Zt:mt=Zt}C=j}return Gi.set(_.a,C),C}function ze(){let _=q.framed;if(!_||!D)return;let C=D.sysByAddr.get(_);C&&(Xn(C.x,C.y,we(C),tn,e?0:.6),q.framed=_,q.frameD=we(C))}function mi(){let _=V.world;if(!_||!D)return;let C=pt.left,T=Se-pt.right,w=pt.top,Y=le-pt.bottom,tt=Math.max(40,Math.min(T-C,Y-w)),st=(C+T)/2,rt=(w+Y)/2,ft=et=>et.on?2*et.extPx/tt:0,mt=et=>Math.hypot(et.sx-st,et.sy-rt)/Math.max(1e-6,et.extPx),j=f.target,Nt=h.position.distanceTo(j),Zt=le/(Math.tan(Br*Math.PI/360)*tt),Bt=(et,Ht,he)=>Math.hypot(j.x-et.s.x,-j.z-et.s.y)<=Ht*et.ext&&Nt*he<=et.ext*Zt,Kt=null;if(q.addr){let et=_.byAddr.get(q.addr);et&&(et.on?ft(et)>=St.domOut&&mt(et)<=St.dcOut:Bt(et,St.dcOut,St.domOut))&&(Kt=et)}if(!Kt){let et=1/0;for(let Ht of _.infos)if(Ht.on){if(ft(Ht)<St.domIn)continue;let he=mt(Ht);he<=1&&he<et&&(et=he,Kt=Ht)}else if(Bt(Ht,1,St.domIn)){let he=Math.hypot(j.x-Ht.s.x,-j.z-Ht.s.y)/Ht.ext;he<et&&(et=he,Kt=Ht)}}q.frac=Kt?ft(Kt):0;let ht=Kt?Kt.s.a:null;ht!==q.addr&&(q.addr=ht,Zn("systemView",Kt?{sys:Kt.s.a,name:Kt.s.n}:null))}function Fe(){Pi&&(Pi="",o.style.cursor="",Zn("hover",null)),V.setHover(null,null)}let gi=140,Jn=1,Hr="opacity .22s ease-out",$o=[],Cp=(_,C,T,w)=>{for(let Y of $o)if(_<Y[2]+Jn&&T>Y[0]-Jn&&C<Y[3]+Jn&&w>Y[1]-Jn)return!0;return!1};function Rp(_,C){if(_.sort((T,w)=>w.prio-T.prio||T.ord-w.ord),$o.length=0,C)for(let T of C)$o.push(T);for(let T of _){let w=T.spots.length,Y=T.cand,tt=-1,st=!1;for(let rt=-1;rt<w&&tt<0;rt++){let ft=rt<0?0:rt===0?Y:rt;if(ft==null||ft<0||ft>=w||rt>0&&ft===Y||rt===0&&ft===0)continue;let mt=T.spots[ft][0],j=T.spots[ft][1],Nt=mt+T.w,Zt=j+T.h;Vr(mt,j,Nt,Zt)&&(st=!0,Cp(mt,j,Nt,Zt)||(tt=ft))}T.cand=tt,T.hide=tt>=0?"":st?"collide":"covered",tt>=0&&$o.push([T.spots[tt][0],T.spots[tt][1],T.spots[tt][0]+T.w,T.spots[tt][1]+T.h])}}function Pp(_,C,T,w,Y,tt,st,rt){let ft=(rt.length===4||(rt.length=0,rt.push([0,0],[0,0],[0,0],[0,0])),rt);return ft[0][0]=_+T-tt/2,ft[0][1]=C+w-Y-st,ft[1][0]=_+T-tt/2,ft[1][1]=C+Y+5,ft[2][0]=_+Y+8,ft[2][1]=C-st/2,ft[3][0]=_-Y-8-tt,ft[3][1]=C-st/2,rt}let Ip=5,Lp=3,gu=110,gs=new Map,Zo=0,Ko=0;function xu(_,C,T,w,Y){let tt=document.createElement("div");return tt.textContent=_,tt.className=C,tt.style.cssText=`position:absolute;left:0;top:0;display:none;white-space:nowrap;font:600 ${T}px/1.2 "Segoe UI",system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:${w};text-shadow:0 0 6px #000,0 0 2px #000;will-change:transform;opacity:0;transition:${Hr};${Y||""}`,a.appendChild(tt),tt}function _u(){a.textContent="",gs.clear(),Zo=0;let _=document.createDocumentFragment();di=D.systems.map((C,T)=>{let w=document.createElement("div");w.textContent=C.n||"",w.className="c4-sys-label";let Y=Ct(C.f);return w.style.cssText='position:absolute;left:0;top:0;display:none;white-space:nowrap;font:600 10px/1 "Segoe UI",system-ui,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:#d8f4ff;text-shadow:0 0 6px '+Y+",0 0 2px #000;will-change:transform;border-left:2px solid "+Y+";padding-left:4px;opacity:0;transition:"+Hr,(C.lvl||0)>=5&&(w.style.fontSize="12px",w.style.color="#ffffff"),_.appendChild(w),{el:w,s:C,si:T,ord:T,shown:!1,vis:!1,w:0,h:0,spots:[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],cand:void 0,hide:""}}),a.appendChild(_),bn[0]=NaN}function Dp(_){let C=V.world,T=C.bodyAt[_],w=C.infos[T.si],Y=T.L,tt=Y.b.k==="asteroid"?"asteroid":(Y.b.sub||"planet").replace("-"," "),st=T.work?T.work.n:0,rt=w.stakeN.get(_)||0;return`${Y.b.n} - ${tt}${st?" - "+st+" mining":""}${rt?" - "+rt+" stake"+(rt>1?"s":""):""}`}function vu(_,C){let T=gs.get(_);return T||(T=C(),T.key=_,T.spots=[],T.cand=void 0,T.hide="",T.on=!1,T.w=0,T.h=0,T.ord=1e5+gs.size,gs.set(_,T)),T}let yu=0,Mc=!1,Jo=[],Ys=[0,0];function Mu(_,C){if(a.style.display=A.labels?"":"none",!A.labels||!D)return;let T=V.world;C&&(Jo.length=0),Ko++;for(let w of di){let Y=w.s.lvl||0,tt=T&&T.infos[w.si],st=Y>=5?400:Y>=2?110:Y>=1?58:30,rt=A.systems&&_<st&&tt&&tt.ppu>0;if(rt){let ft=tt.sx,mt=tt.sy;if(rt=tt.on&&ft>-.025*Se&&ft<1.025*Se&&mt>-.025*le&&mt<1.025*le,rt){w.shown||(w.el.style.display="block",w.shown=!0),w.w||(w.w=w.el.offsetWidth,w.h=w.el.offsetHeight);let j=Math.max(0,tt.starR*tt.ppu*1.1),Nt=w.w,Zt=w.h,Bt=w.spots;Bt[0][0]=ft+9+j,Bt[0][1]=mt-5,Bt[1][0]=ft-9-j-Nt,Bt[1][1]=mt-5,Bt[2][0]=ft+5,Bt[2][1]=mt-8-j-Zt,Bt[3][0]=ft+5,Bt[3][1]=mt+6+j,Bt[4][0]=ft-5-Nt,Bt[4][1]=mt-8-j-Zt,Bt[5][0]=ft-5-Nt,Bt[5][1]=mt+6+j;let Kt=hc(w.s.f,Lt.faction);w.op=(Kt?.25:.88)*Math.min(1,(st-_)/(st*.25)),w.prio=(Pi==="system:"+w.s.a?1e3:0)+(tt.extPx>=gu?400:0)+(Kt?0:100)+Y*10,C&&Jo.push(w)}}!rt&&w.shown&&(w.el.style.display="none",w.shown=!1,w.vis=!1,w.cand=void 0,w.el.style.opacity=w.opW="0")}if(Zo=0,T)for(let w of T.infos){if(!w.on||w.extPx<24)continue;let Y=w.extPx>=gu?200:0;if(A.systems&&w.sbHalf*w.ppu>=Lp){let tt=vu("sb:"+w.s.a,()=>({kind:"sb",si:w.si,el:xu(`starbase lvl ${w.s.lvl||0} - ${w.members?w.members.docked.length:0} docked`,"c4-body-label",10,zo[Je(w.s.f)])}));ee.set(w.s.x+w.sb[0],0,-(w.s.y+w.sb[1])).project(h),tt.ax=(ee.x+1)/2*Se,tt.ay=(1-ee.y)/2*le,tt.r=w.sbHalf*w.ppu,tt.prio=90+Y,tt.seen=Ko}for(let tt=w.b0;tt<w.b0+w.nb;tt++){let st=T.bodyAt[tt],rt=st.R*w.ppu;if(rt<Ip)continue;let ft=vu("body:"+st.L.b.a,()=>({kind:"body",bi:tt,el:xu(Dp(tt),"c4-body-label",10,"#cfe8f2")}));V.bodyPos(tt,u.uAnim.value,Ys),ee.set(Ys[0],0,-Ys[1]).project(h),!(ee.z>=1)&&(ft.ax=(ee.x+1)/2*Se,ft.ay=(1-ee.y)/2*le,ft.r=rt,ft.seen=Ko,ft.prio=(st.L.b.k==="asteroid"?30:50)+Math.min(9,Math.round((st.L.size||0)*20))+(w.stakeN.get(tt)?5:0)+Y)}}for(let w of gs.values()){if(w.seen!==Ko){w.on&&(w.on=!1,w.el.style.display="none",w.cand=void 0,w.opW="0",w.el.style.opacity="0");continue}w.on||(w.el.style.display="block",w.on=!0),!(!w.w&&(w.w=w.el.offsetWidth,w.h=w.el.offsetHeight,!w.w))&&(Pp(w.ax,w.ay,w.kind==="sb"?14:0,w.kind==="sb"?-4:-6,w.r,w.w,w.h,w.spots),Zo++,Pi&&w.key===Pi&&(w.prio+=1e3),C&&Jo.push(w))}C&&(yu=performance.now(),Rp(Jo));for(let w of di){if(!w.shown)continue;w.vis=w.cand!=null&&w.cand>=0;let Y=w.spots[w.vis?w.cand:0];w.el.style.transform=`translate(${Y[0].toFixed(1)}px,${Y[1].toFixed(1)}px)`,w.x0=Y[0],w.y0=Y[1];let tt=w.vis?w.op.toFixed(2):"0";w.opW!==tt&&(w.el.style.opacity=tt,w.opW=tt),w.prioW!==w.prio&&(w.prioW=w.prio,w.el.dataset.prio=String(w.prio)),w.hideW!==(w.hide||"")&&(w.hideW=w.hide||"",w.el.dataset.hide=w.hideW)}for(let w of gs.values()){if(!w.on||!w.w)continue;let Y=w.cand!=null&&w.cand>=0,tt=w.spots[Y?w.cand:0];w.el.style.transform=`translate(${tt[0].toFixed(1)}px,${tt[1].toFixed(1)}px)`;let st=Y?"1":"0";w.opW!==st&&(w.el.style.opacity=st,w.opW=st),w.prioW!==w.prio&&(w.prioW=w.prio,w.el.dataset.prio=String(w.prio)),w.hideW!==(w.hide||"")&&(w.hideW=w.hide||"",w.el.dataset.hide=w.hideW)}}let Np=[1,.32,.08],Su=6,Fp=_=>_.hex?Vi(_.hex):_.fa==="hot"?Np:Ai[Je(_.fa)],Up=_=>_.hex?_.hex:_.fa==="hot"?"#ff7a3c":zo[Je(_.fa)];function Sc(_){nt.halos=_;let C=Ri(ae,[["iS",4],["iC",3],["iM",4]],_.length);_.forEach((T,w)=>{C.iS.array.set([T.x,T.y,bM+wM*Math.sqrt(T.wmax?T.w/T.wmax:0),0],w*4),C.iC.array.set(Vi(T.hex),w*3),C.iM.array.set([T.share*(T.dim?TM:1),0,0,0],w*4)});for(let T in C)C[T].needsUpdate=!0;Qt.visible=_.length>0}function bu(){ut.dirty=!1,l.textContent="",ut.callouts=[],nt.mark=null,nt.markBox=null,nt.mw=0;let _=ut.name,C;if(_==="dacs"&&nt.conq)C=ip(nt.conq,nt.dacs),Sc([]);else if(_==="dacs"){let rt=D?ep(D.latest,nt.dacs,nt.focus):{cols:[],halos:[]};C=rt.cols,Sc(rt.halos)}else C=_&&D?Ud(_,D.latest,D.events,{owner:Lt.owner,faction:Lt.faction,res:ut.res,bodies:ve}):[],(Qt.visible||nt.halos.length)&&Sc([]);ut.cols=C,ut.vmax=C.reduce((rt,ft)=>Math.max(rt,ft.v),0);let T=Ri(wt,[["iS",4],["iC",3],["iM",4]],C.length);C.forEach((rt,ft)=>{let mt=Od(rt.v,ut.vmax),j=ut.vmax?rt.v/ut.vmax:0;T.iS.array.set([rt.x,rt.y,mt,.75+.5*Math.sqrt(j)],ft*4),T.iC.array.set(Fp(rt),ft*3),T.iM.array.set([1,Pn(rt.key),j,rt.fa==="hot"?1:0],ft*4),rt.h=mt});for(let rt in T)T[rt].needsUpdate=!0;let w=_==="resource",Y=C.reduce((rt,ft)=>Math.min(rt,ft.v),1/0),tt=Ri(jt,[["iS",4],["iK",1]],w?C.length:0);w&&C.forEach((rt,ft)=>{let mt=Nd(rt.v,Y,ut.vmax);rt.rr=mt.r,rt.rb=mt.b,tt.iS.array.set([rt.x,rt.y,mt.r,mt.b],ft*4),tt.iK.array[ft]=Fd[rt.where]||0}),tt.iS.needsUpdate=tt.iK.needsUpdate=!0,re.visible=w&&C.length>0,ut.rings=re.visible?C.length:0,gt.value=ut.rings?mM:1,xt.visible=Ft.visible=!w&&C.length>0,P.uTerrStat.value=C.length?_==="dacs"?EM:cM:1,ut.colSys=new Set(C.map(rt=>rt.sys).filter(Boolean)),Le();let st=document.createDocumentFragment();if(C.filter(rt=>rt.callout!==!1).slice(0,Su).forEach((rt,ft)=>{let mt=Up(rt),j=ft/(Su-1),Nt=ft===0?2:ft<3?1.5:1,Zt=Math.round(4-1.2*j),Bt=document.createElement("div"),Kt=document.createElement("div"),ht=document.createElement("div");Bt.style.cssText=`position:absolute;left:0;top:${-Nt/2}px;height:${Nt}px;transform-origin:0 50%;background:linear-gradient(90deg,${mt},${mt}66);box-shadow:0 0 ${Math.round(9-6*j)}px ${mt};opacity:${(1-.3*j).toFixed(2)};will-change:transform`,Kt.style.cssText=`position:absolute;left:${-Zt}px;top:${-Zt}px;width:${Zt*2}px;height:${Zt*2}px;border-radius:50%;background:${mt};box-shadow:0 0 ${Math.round(12-6*j)}px ${mt},0 0 2px #fff;will-change:transform`,ht.className="c4-stat-callout",ht.dataset.rank=String(ft+1),ht.style.cssText=`position:absolute;left:0;top:0;white-space:nowrap;padding:${ft===0?"6px 12px 7px 11px":"4px 9px 5px 8px"};border-left:${Math.round(4-2*j)}px solid ${mt};border-radius:0 6px 6px 0;border-top:1px solid ${mt}${ft===0?"55":"2a"};border-right:1px solid ${mt}${ft===0?"33":"1a"};border-bottom:1px solid rgba(0,0,0,.4);background:linear-gradient(90deg,rgba(6,10,22,${ft===0?".92":".86"}),rgba(6,10,22,.62));backdrop-filter:blur(6px) saturate(140%);-webkit-backdrop-filter:blur(6px) saturate(140%);color:#e8f8ff;text-shadow:0 0 6px #000;box-shadow:0 0 ${Math.round(24-16*j)}px ${mt}${ft===0?"66":ft<3?"40":"24"},0 4px 14px rgba(0,0,0,.45);opacity:${(1-.2*j).toFixed(2)};will-change:transform;pointer-events:auto;cursor:pointer`;let et=document.createElement("div");et.textContent=rt.name.toUpperCase(),et.style.cssText=`font:${ft===0?700:600} ${(12.5-2.5*j).toFixed(1)}px/1.25 Orbitron,"Segoe UI",system-ui,sans-serif;letter-spacing:.08em;color:#fff`;let Ht=document.createElement("div");Ht.textContent=rt.line,Ht.style.cssText=`font:${ft<3?700:600} ${(17-5*j).toFixed(1)}px/1.2 Rajdhani,"Segoe UI",system-ui,sans-serif;color:${mt};letter-spacing:.03em;`+(ft===0?`text-shadow:0 0 10px ${mt}88,0 0 4px #000`:""),ht.append(et,Ht),rt.sys?(ht.dataset.sys=rt.sys,ht.addEventListener("pointerdown",he=>he.stopPropagation()),ht.addEventListener("click",he=>{he.stopPropagation(),Zn("pick",{type:"system",id:rt.sys,source:"callout"})})):Number.isFinite(rt.x)&&Number.isFinite(rt.y)&&(ht.dataset.point=rt.x+","+rt.y,ht.addEventListener("pointerdown",he=>he.stopPropagation()),ht.addEventListener("click",he=>{he.stopPropagation(),Zn("pick",{type:"point",x:rt.x,y:rt.y,source:"callout"}),Cc.focusPoint(rt.x,rt.y,hM)})),st.append(Bt,Kt,ht),ut.callouts.push({c:rt,el:ht,line:Bt,dot:Kt,w:0,h:0,rank:ft})}),_==="dacs"&&nt.example&&C.length){let rt=document.createElement("div");rt.className="c4-dac-example-mark",rt.textContent="EXAMPLE",rt.style.cssText='position:absolute;left:0;top:0;white-space:nowrap;pointer-events:none;font:700 22px/1 Orbitron,"Segoe UI",system-ui,sans-serif;letter-spacing:.42em;color:rgba(232,248,255,.16);text-shadow:0 0 12px rgba(0,0,0,.6);will-change:transform',st.append(rt),nt.mark=rt}l.appendChild(st),document.fonts&&document.fonts.status!=="loaded"&&document.fonts.ready.then(()=>{for(let rt of ut.callouts)rt.w=0;nt.mw=0,bn[0]=NaN}),bn[0]=NaN}let Op=()=>Math.min(1.3,Math.max(.6,u.uZoom.value)),wu=_=>{let C=_.rr*Op()*Pt.uGrow.value;ee.set(_.x,0,-_.y).project(h);let T=(ee.x+1)/2*Se,w=(1-ee.y)/2*le,Y=ee.z,tt=T,st=w,rt=0;for(let ft=0;ft<16;ft++){let mt=ft*Math.PI/8;ee.set(_.x+C*Math.cos(mt),0,-(_.y+C*Math.sin(mt))).project(h);let j=(ee.x+1)/2*Se,Nt=(1-ee.y)/2*le;rt=Math.max(rt,Math.hypot(j-T,Nt-w)),Nt<st&&(tt=j,st=Nt)}return ee.z=Y,{cx:T,cy:w,tx:tt,ty:st,rad:rt}},Bp=_=>{let C=wu(_);return[C.tx,C.ty]},jo=[],kp=[60,90,125,165,210,260,320,390],Qo=120,zp=[-40,-140,40,140,-90,90,0,180,-65,-115,65,115,-15,-165,15,165].map(_=>_*Math.PI/180);function Vp(_){ut.dirty&&bu();let C=Math.min(1.3,Math.max(.3,_/90));Pt.uStatH.value=C,Pt.uStatW.value=oM*Math.min(1.6,Math.max(.35,_/100)),Re.uHaloK.value=Math.min(3.2,Math.max(1,_/40)),ee.subVectors(f.target,h.position).normalize(),Pt.uMinH.value=aM/(Rt(_)*Math.max(.2,Math.sqrt(1-ee.y*ee.y)));let T=!!ut.callouts.length&&u.uGal.value>.05;if(l.style.display=T?"":"none",!T)return;l.style.opacity=u.uGal.value<.999?u.uGal.value.toFixed(2):"",jo.length=0;let w=[];if(a.style.display!=="none")for(let st of di)!st.vis||st.x0===void 0||(st.w||(st.w=st.el.offsetWidth,st.h=st.el.offsetHeight),st.w&&w.push([st.x0,st.y0,st.x0+st.w,st.y0+st.h,st.w*st.h]));let Y=(st,rt,ft,mt)=>{let j=0;for(let Nt of w){let Zt=Math.min(ft,Nt[2])-Math.max(st,Nt[0]),Bt=Math.min(mt,Nt[3])-Math.max(rt,Nt[1]);Zt>0&&Bt>0&&(j=Math.max(j,Zt*Bt/Nt[4]))}return j};for(let st of ut.callouts){let rt,ft;st.c.rr?[rt,ft]=Bp(st.c):(ee.set(st.c.x,Ws+dt(st.c),-st.c.y).project(h),rt=(ee.x+1)/2*Se,ft=(1-ee.y)/2*le);let mt=ee.z<1&&rt>=-Qo&&rt<=Se+Qo&&ft>=-Qo&&ft<=le+Qo;if(st.vis=!1,st.under=!1,!mt){st.el.style.display=st.line.style.display=st.dot.style.display="none";continue}let j=Math.min(Se,Math.max(0,rt)),Nt=Math.min(le,Math.max(0,ft));st.el.style.display="",st.w||(st.w=st.el.offsetWidth,st.h=st.el.offsetHeight);let Zt=st.w,Bt=st.h,Kt=j!==rt||Nt!==ft||zr(j,Nt),ht=[[j+22,Nt-30-Bt],[j-22-Zt,Nt-30-Bt],[j+22,Nt+16],[j-22-Zt,Nt+16],[j+34,Nt-64-Bt],[j-34-Zt,Nt-64-Bt],[j+34,Nt+50],[j-34-Zt,Nt+50]];for(let Un of kp)for(let An of zp){let ti=Math.cos(An),ys=j+Un*ti,$p=Nt+Un*Math.sin(An);ht.push([ti>=0?ys:ys-Zt,$p-Bt/2])}let et=null,Ht=null,he=1/0;for(let[Un,An]of ht){if(!Vr(Un,An,Un+Zt,An+Bt)||jo.some(ys=>Un<ys[2]&&Un+Zt>ys[0]&&An<ys[3]&&An+Bt>ys[1]))continue;let ti=Y(Un,An,Un+Zt,An+Bt);if(ti<=.03){et=[Un,An];break}ti<he&&(he=ti,Ht=[Un,An])}if(et=et||Ht,!et){st.el.style.display=st.line.style.display=st.dot.style.display="none";continue}st.line.style.display=st.dot.style.display="",st.vis=!0,st.under=Kt;let[Be,Ve]=et;jo.push([Be-4,Ve-4,Be+Zt+4,Ve+Bt+4]),st.el.style.transform=`translate(${Be.toFixed(1)}px,${Ve.toFixed(1)}px)`;let wn=Be+Zt/2>=j?Be:Be+Zt,Tn=Ve+Bt/2,jn=j,Qn=Nt;if(Kt){let Un=Math.hypot(wn-j,Tn-Nt),An=Math.max(1,Math.ceil(Un/2));for(let ti=1;ti<=An&&(jn=j+(wn-j)*ti/An,Qn=Nt+(Tn-Nt)*ti/An,!!zr(jn,Qn));ti++);}st.mx=jn,st.my=Qn,st.dot.style.transform=`translate(${jn.toFixed(1)}px,${Qn.toFixed(1)}px)`;let qp=Math.hypot(wn-jn,Tn-Qn),Yp=Math.atan2(Tn-Qn,wn-jn);st.line.style.width=qp.toFixed(1)+"px",st.line.style.transform=`translate(${jn.toFixed(1)}px,${Qn.toFixed(1)}px) rotate(${Yp.toFixed(4)}rad)`}let tt=nt.mark;if(tt){nt.mw||(tt.style.display="",nt.mw=tt.offsetWidth,nt.mh=tt.offsetHeight);let st=nt.mw,rt=nt.mh,ft=18,mt=pt.left+ft,j=Se-pt.right-ft-st,Nt=pt.top+ft,Zt=le-pt.bottom-ft-rt,Bt=[[mt,Zt],[j,Zt],[mt,Nt],[j,Nt],[(mt+j)/2,Zt],[(mt+j)/2,Nt]].find(([Kt,ht])=>Vr(Kt,ht,Kt+st,ht+rt)&&!jo.some(et=>Kt<et[2]&&Kt+st>et[0]&&ht<et[3]&&ht+rt>et[1]));nt.markBox=Bt?{left:Bt[0],top:Bt[1],right:Bt[0]+st,bottom:Bt[1]+rt}:null,tt.style.display=Bt?"":"none",Bt&&(tt.style.transform=`translate(${Bt[0].toFixed(1)}px,${Bt[1].toFixed(1)}px)`)}}let bc=[0,0,0,0];function Gr(_,C){let T=D.place&&D.place[_];if(T)return Yd(T.A,T.O,D.seeds[_],u.uAnim.value,bc),C[0]=T.A[0]+bc[0],C[1]=T.A[1]+bc[1],C;let w=D.paths[_],Y=D.kinds[_];if(w.moving&&(Y===3||Y===4))return Ld(w,n(),C);let tt=D.anchors[_];return C[0]=tt[0],C[1]=tt[1],C}let Tu=new G,Wr=(_,C,T)=>(Tu.set(_,0,-C).applyMatrix4(h.matrixWorldInverse),T*2*h.projectionMatrix.elements[5]*.5*le/Math.max(1e-9,-Tu.z));function xs(_,C,T){return ee.set(_,T,-C).project(h),ee.z<1?[(ee.x+1)/2*Se,(1-ee.y)/2*le]:null}let Au=(Vs[0]+Vs[1])/2,Hp=(Gs[0]+Gs[1])/2;function wc(_,C){if(!D)return null;let T=_-Pe.left,w=C-Pe.top,Y=V.world,tt=u.uAnim.value,st=-1,rt=1/0;if(A.fleets)for(let et=0;et<D.fleets.length;et++){if(D.vis[et]<.5||ke(et)<.5)continue;Gr(et,cn);let Ht=Wr(cn[0],cn[1],hu.galaxy*ks(D.fleets[et].flagSize)*fc(D.vis[et]));if(Ht<on.collapse)continue;let he=xs(cn[0],cn[1],0);if(!he)continue;let Be=Math.hypot(he[0]-T,he[1]-w);Be<=Math.max(6,Ht*.6)&&Be<rt&&(rt=Be,st=et)}let ft=null,mt=1/0,j=null,Nt=1/0;if(Y&&A.systems)for(let et of Y.infos){if(!et.on||et.ppu<=0)continue;let Ht=Math.hypot(et.sx-T,et.sy-w);if(Ht>et.extPx+16&&Ht>12)continue;for(let Ve=et.b0;Ve<et.b0+et.nb;Ve++){let wn=Y.bodyAt[Ve],Tn=wn.R*et.ppu;if(Tn<Au)continue;V.bodyPos(Ve,tt,Ys);let jn=xs(Ys[0],Ys[1],0);if(!jn)continue;let Qn=Math.hypot(jn[0]-T,jn[1]-w);Qn<=Math.max(6,Tn*(wn.kind===1?1.2:1.05))&&Qn<mt&&(mt=Qn,ft={type:"body",bi:Ve})}let he=et.sbHalf*et.ppu;if(he>=Hp){let Ve=xs(et.s.x+et.sb[0],et.s.y+et.sb[1],0),wn=Ve?Math.hypot(Ve[0]-T,Ve[1]-w):1/0;wn<=Math.max(8,he*1.1)&&wn<mt&&(mt=wn,ft={type:"sb",info:et})}let Be=et.starR*et.ppu;Ht<=Math.max(10,Be*1.1)&&Ht<Nt&&(Nt=Ht,j=et)}let Zt=()=>{let et=D.fleets[st],Ht=an?jd(an,et.flag,et.flagSize):"";return{type:"fleet",id:et.a,ownerProfile:et.o,label:sp(et)+(Ht?" - "+Ht:"")}};if(ft){if(st>=0&&rt<=4)return Zt();if(ft.type==="body"){let Ht=Y.bodyAt[ft.bi],he=Y.infos[Ht.si];return{type:"body",id:Ht.L.b.a,sys:Ht.L.b.sys,j:ft.bi,label:Kd(Ht.L.b,Ht.work?Ht.work.n:0,he.stakeN.get(ft.bi)||0)}}let et=ft.info.s;return{type:"system",id:et.a,sb:ft.info.si,label:`${et.n} starbase - ${Je(et.f)} lvl ${et.lvl||0} - ${ft.info.members?ft.info.members.docked.length:0} fleets docked`}}let Bt=null,Kt=1/0;st>=0&&rt-3<Kt&&(Kt=rt-3,Bt="fleet");let ht=-1;if(A.mining)for(let et=0;et<D.asteroids.length;et++){let Ht=D.asteroids[et],he=Y?Y.bodyIdx.get(Ht.a):void 0;if(he!=null&&Y.bodyAt[he].R*Y.infos[Y.bodyAt[he].si].ppu>=Au)continue;let Be=xs(Ht.x,Ht.y,0);if(!Be||j&&Math.hypot(Be[0]-j.sx,Be[1]-j.sy)<=Math.max(10,j.starR*j.ppu*1.1))continue;let Ve=Math.hypot(Be[0]-T,Be[1]-w);Ve<=12&&Ve-1<Kt&&(Kt=Ve-1,Bt="asteroid",ht=et)}if(j&&Nt<Kt&&(Kt=Nt,Bt="system"),Bt==="fleet")return Zt();if(Bt==="asteroid"){let et=D.asteroids[ht];return{type:"asteroid",id:et.a,label:op(et)}}if(Bt==="system"){let et=j.s,Ht=j.starR*j.ppu>=Ei[0];return{type:"system",id:et.a,label:Ht?`${et.n} - star - ${j.nb} bodies (orbit layout stylised: the chain has no in-system positions)`:rp(et)}}return null}let Xr=null,Pi="",_s=null,ta=new Map,ea=(_,C)=>{if(_.pointerType==="touch"){if(C){ta.delete(_.pointerId);return}if(ta.set(_.pointerId,[_.clientX,_.clientY]),ta.size>=2){let[T,w]=ta.values();Et.x=(T[0]+w[0])/2,Et.y=(T[1]+w[1])/2,Et.on=!0}}},Eu=_=>{Xr={x:_.clientX,y:_.clientY},Et.x=_.clientX,Et.y=_.clientY,Et.on=!0,Kn=performance.now(),ea(_)},Cu=_=>ea(_,!0),Ru=()=>{Xr=null,Et.on=!1,Pi&&(Pi="",o.style.cursor="",Zn("hover",null))},Pu=_=>{_s={x:_.clientX,y:_.clientY,b:_.button},Kn=performance.now(),ea(_)},Iu=_=>{if(ea(_,!0),!_s||_s.b!==0||Math.hypot(_.clientX-_s.x,_.clientY-_s.y)>5){_s=null;return}_s=null;let C=wc(_.clientX,_.clientY);C&&Zn("pick",C.type==="fleet"?{type:C.type,id:C.id,ownerProfile:C.ownerProfile}:C.type==="body"?{type:"body",id:C.id,sys:C.sys}:{type:C.type,id:C.id})};o.addEventListener("pointermove",Eu),o.addEventListener("pointerleave",Ru),o.addEventListener("pointerdown",Pu),o.addEventListener("pointerup",Iu),o.addEventListener("pointercancel",Cu);function Gp(){if(!Xr)return;let{x:_,y:C}=Xr;Xr=null;let T=wc(_,C),w=T?T.type+":"+T.id:"";o.style.cursor=T?"pointer":"",V.setHover(T&&T.type==="body"?T.j:null,T&&T.sb!=null?T.sb:null),T?Zn("hover",{type:T.type,id:T.id,label:T.label,ownerProfile:T.ownerProfile,sys:T.sys,clientX:_,clientY:C}):Pi&&Zn("hover",null),Pi=w}let Tc=0,na=0,ia=!1,sa=!1,Lu=1,Oe={fps:0,frameMs:0,frames:0,acc:0,n:0,slow:0,cpuAcc:0,cpuMs:0},vs=(_,C,T)=>Wp(Math.log2(_),Math.log2(C),Math.log2(Math.max(T,1e-6))),Wp=(_,C,T)=>{let w=Math.min(1,Math.max(0,(T-_)/(C-_)));return w*w*(3-2*w)};function Du(_){Tc=requestAnimationFrame(Du);let C=performance.now(),T=na?Math.min(.1,Math.max(0,(_-na)/1e3)):0;na=_,u.uTime.value+=T,e||(u.uAnim.value+=T),u.uNow.value=D?n()-D.tBase:0,ye.on?(y(T),Kn=performance.now()):(zt(T),f.autoRotate=!e&&h.position.distanceTo(f.target)>zy&&performance.now()-Kn>12e3,f.update(T));let w=f.target;(Math.abs(w.x)>70||Math.abs(w.z)>70)&&(w.x=Math.max(-70,Math.min(70,w.x)),w.z=Math.max(-70,Math.min(70,w.z))),h.updateMatrixWorld();let Y=h.position.distanceTo(w),tt=Math.max(1e-6,Y*St.nearK);Math.abs(h.near-tt)>tt*.02&&(h.near=tt,Wi()),u.uZoom.value=Math.min(1.5,Math.max(.5,Y/110)),u.uSysZoom.value=Math.min(2,Math.max(.6,Y/85)),u.uGlyphK.value=Math.min(1,Y/Vy),u.uGal.value=vs(By,ky,Y);let st=h.matrixWorld.elements,rt=!1;for(let mt=0;mt<16;mt++)bn[mt]!==st[mt]&&(rt=!0,bn[mt]=st[mt]);if(rt&&D&&(V.lod(Se,le),mi()),V.flushArt(performance.now()),(rt||Zo)&&D){let mt=performance.now()-yu>=gi;Mu(Y,mt),Mc=!mt}else Mc&&D&&(Mu(Y,!0),Mc=!1);let ft=!1;if(ut.growAt){let mt=Math.min(1,(performance.now()-ut.growAt)/lM);Pt.uGrow.value=1-(1-mt)**3,ft=!0,mt>=1&&(ut.growAt=0)}else Pt.uGrow.value=1;ut.name&&D&&(rt||ft||ut.dirty||u.uGal.value!==Lu||l.style.display==="none"&&u.uGal.value>.05)?Vp(Y):!ut.name&&l.style.display!=="none"&&(l.style.display="none"),Lu=u.uGal.value,Gp(),s.info.reset(),K.render(T),Oe.frames++,Oe.acc+=T,Oe.n++,Oe.cpuAcc+=performance.now()-C,Oe.acc>=1&&(Oe.fps=Oe.n/Oe.acc,Oe.frameMs=1e3*Oe.acc/Oe.n,Oe.cpuMs=Oe.cpuAcc/Oe.n,Oe.acc=0,Oe.n=0,Oe.cpuAcc=0,Oe.slow=Oe.fps<45?Oe.slow+1:0,Oe.slow>=3&&r>1&&(r=1,s.setPixelRatio(1),u.uPR.value=1,qs(),Oe.slow=0))}function Ac(){ia||sa||(ia=!0,na=0,Tc=requestAnimationFrame(Du))}function Ec(){ia=!1,cancelAnimationFrame(Tc)}let Nu=()=>document.hidden?Ec():Ac();document.addEventListener("visibilitychange",Nu);let Fu=_=>{_.preventDefault(),Ec()},Uu=()=>{document.hidden||Ac()};o.addEventListener("webglcontextlost",Fu),o.addEventListener("webglcontextrestored",Uu),qs(),document.hidden||Ac();function Xp(_){let C=V.world,T=C&&C.byAddr.get(_);if(!T)return null;let w=T.members||{docked:[],mining:[],cst:[],idle:[]},Y=[...w.docked,...w.mining,...w.cst,...w.idle],tt=C.bodyAt.slice(T.b0,T.b0+T.nb),st=T.layout.length?T.layout[T.layout.length-1].r*T.k:0,rt=mt=>{let j=ks(mt)*2*T.ppu;return Math.min(1,Math.max(0,(j-on.collapse)/(on.full-on.collapse)))},ft=mt=>Math.round(mt*1e3)/1e3;return{sys:_,name:T.s.n,sb:[T.s.x+T.sb[0],T.s.y+T.sb[1]],bodies:T.nb,planets:tt.filter(mt=>mt.kind===0).length,asteroids:tt.filter(mt=>mt.kind===1).length,fleets:Y.length,roles:{docked:w.docked.length,mining:w.mining.length,cst:w.cst.length,idle:w.idle.length},stakes:[...T.stakeN.values()].reduce((mt,j)=>mt+j,0),beams:Y.filter(mt=>D.place[mt]&&D.place[mt].T[1]>.5).length,shipHalfMax:Y.reduce((mt,j)=>Math.max(mt,ks(D.fleets[j].flagSize)),0),bodyRMin:tt.length?Math.min(...tt.map(mt=>mt.R)):0,worked:tt.filter(mt=>mt.work).map(mt=>({id:mt.L.b.a,name:mt.L.b.n,miners:mt.work.n,ups:Math.round(mt.work.ups*10)/10,fa:mt.work.fa,fade:ft(rt("medium")),ring:A.mining})),scale:T.k,footprint:ft(T.ext),extPx:Math.round(T.extPx),frac:ft(q.frac),fade:ft(st?vs(Hs[0],Hs[1],st*T.ppu):Math.min(1,T.extPx/20)),...V.texStats()}}let Cc={ok:!0,setData:Ut,setMine(_){te.clear();for(let C of Array.isArray(_)?_:[])typeof C=="string"&&C&&te.add(C);return D&&(be(),V.paintStakes(te),bn[0]=NaN),te.size},setFilter(_={}){"faction"in _&&(Lt.faction=ru.includes(_.faction)?_.faction:null),"states"in _&&(Lt.states=Array.isArray(_.states)&&_.states.length?_.states.slice():null),"owner"in _&&(Lt.owner=_.owner||null),Ie()},focusOwner(_){if(Lt.owner=_||null,Ie(),!_||!D)return Xn(In.x,In.y,In.dist,In.polar),0;let C=[];for(let w=0;w<D.fleets.length;w++)D.fleets[w].o===_&&C.push(Gr(w,[0,0]));let T=lu(C);return T&&Xn(T.x,T.y,Math.max(16,(T.span*1.35+4)/(2*Math.tan(Br*Math.PI/360))),.62),C.length},focusPoint(_,C,T=3){!Number.isFinite(_)||!Number.isFinite(C)||Xn(_,C,In.dist/Math.max(.5,T||3),.62)},focusSystem(_){if(_==null){let T=q.addr&&D&&D.sysByAddr.get(q.addr);return T?Xn(T.x,T.y,42,In.polar,e?0:1.4):Xn(f.target.x,-f.target.z,Math.max(42,h.position.distanceTo(f.target)),In.polar,e?0:1.4),!0}let C=D&&D.sysByAddr.get(_);return C?(Xn(C.x,C.y,we(C),tn,e?0:1.8),q.framed=_,q.frameD=we(C),!0):!1},bodyScreen(_){let C=V.world,T=C&&C.bodyIdx.get(_);if(T==null)return null;let w=V.bodyPos(T,u.uAnim.value,[0,0]);if(h.updateMatrixWorld(),ee.set(w[0],0,-w[1]).project(h),ee.z>=1)return null;let Y=(ee.x+1)/2*Se,tt=(1-ee.y)/2*le;return{x:w[0],y:w[1],clientX:Y+Pe.left,clientY:tt+Pe.top,visible:Y>=0&&Y<=Se&&tt>=0&&tt<=le}},pulseEvent(_){if(!_||!Number.isFinite(_.x)||!Number.isFinite(_.y))return!1;let C=Ly[_.k]??0,T=bt;bt=(bt+1)%pc;let w=Ny[C]||$t(_.fa);if(O.iS.array.set([_.x,_.y,Dy[C],u.uTime.value],T*4),O.iC.array.set(w,T*3),O.iK.array[T]=C,O.iS.needsUpdate=O.iC.needsUpdate=O.iK.needsUpdate=!0,_.k==="combat"&&Array.isArray(_.vs)){let Y=$t(_.fa);for(let tt=0;tt<Math.min(_.vs.length,Fy);tt++){let st=_.vs[tt];if(!st)continue;let rt=D&&D.index.get(st.f),ft=Xd(_,tt,rt!=null?Gr(rt,[0,0]):null);if(!ft)continue;let mt=De;De=(De+1)%mc,ce.iE.array.set(ft,mt*4),ce.iC.array.set($t(st.fa),mt*3),ce.iC2.array.set(Y,mt*3),ce.iS.array[mt*2]=u.uTime.value,ce.iS.array[mt*2+1]=Pn(String(st.f)),ce.iE.needsUpdate=ce.iC.needsUpdate=ce.iC2.needsUpdate=ce.iS.needsUpdate=!0}}return!0},on(_,C){return!Ae[_]||typeof C!="function"?()=>{}:(Ae[_].add(C),()=>Ae[_].delete(C))},setLayer(_,C){if(!mu.includes(_))return console.warn("C4Scene.setLayer: unknown layer",_),!1;A[_]=!!C;for(let T of At[_]||[])T.visible=!!C;return _==="territory"&&(P.uTerr.value=C?1:0),_==="systems"&&V.setVisible(C),_==="combat"&&Tt(),(_==="fleets"||_==="mining")&&(V.setLayers(A.fleets,A.mining),g(),_==="mining"&&D&&Ie()),bn[0]=NaN,!0},screenOf(_,C,T=0){h.updateMatrixWorld();let w=xs(_,C,Number.isFinite(T)?T:0);return w?{clientX:w[0]+Pe.left,clientY:w[1]+Pe.top,visible:w[0]>=0&&w[0]<=Se&&w[1]>=0&&w[1]<=le,covered:zr(w[0],w[1])}:null},_starfield(_){return M.visible=!!_,!0},_backdrop(_){return M.visible=d.visible=!!_,!0},_world(_){return V.setVisible(_),!0},bodyPixelSize(_){let C=V.world,T=C&&C.bodyIdx.get(_);if(T==null)return null;h.updateMatrixWorld();let w=V.bodyPos(T,u.uAnim.value,[0,0]);return Wr(w[0],w[1],C.bodyAt[T].R)/2},ppuAt(_,C){return h.updateMatrixWorld(),Wr(_,C,.5)},lodProbe(){let _=V.world;if(!_)return null;let C=(pt.left+Se-pt.right)/2,T=(pt.top+le-pt.bottom)/2,w=null,Y=1/0;for(let j of _.infos){if(!j.on)continue;let Nt=Math.hypot(j.sx-C,j.sy-T);Nt<Y&&(Y=Nt,w=j)}if(!w)return null;let tt=w,st=tt.starR*tt.ppu,rt=tt.layout.length?tt.layout[tt.layout.length-1].r*tt.k*tt.ppu:0,ft=0;for(let j=tt.b0;j<tt.b0+tt.nb;j++)ft=Math.max(ft,vs(Vs[0],Vs[1],_.bodyAt[j].R*tt.ppu));let mt=j=>Math.round(j*1e3)/1e3;return{sys:tt.s.n,starPx:mt(st),extPx:mt(tt.extPx),glyph:mt(1-vs(Ei[0],Ei[1],st)),star:mt(vs(Ei[0],Ei[1],st)),rings:mt(vs(Hs[0],Hs[1],rt)),bodies:mt(ft),station:mt(vs(Gs[0],Gs[1],tt.sbHalf*tt.ppu)),markers:mt(u.uGal.value)}},setStatLayer(_){let C=_==null||_===""?null:String(_);return C!==null&&!Dd.includes(C)?(console.warn("C4Scene.setStatLayer: unknown stat layer",_),!1):(C&&C!==ut.name&&(ut.growAt=e?0:performance.now()),(C!==ut.name||C)&&(ut.name=C,ut.dirty=!0),Tt(),C||bu(),!0)},setStatResource(_){let C=typeof _=="string"&&_?_.slice(0,80):null;return C===ut.res||(ut.res=C,ut.name==="resource"&&(ut.growAt=e?0:performance.now(),ut.dirty=!0)),!0},setDacs(_={}){let C=new Set;nt.dacs=(Array.isArray(_&&_.dacs)?_.dacs:[]).filter(Y=>Y&&typeof Y.tag=="string"&&Y.tag&&!C.has(Y.tag)&&C.add(Y.tag)).map(Y=>({tag:Y.tag.slice(0,24),color:dc(Y.color),members:(Array.isArray(Y.members)?Y.members:[]).filter(tt=>typeof tt=="string"&&tt)})),nt.example=!!(_&&_.example),nt.focus=_&&typeof _.focus=="string"&&nt.dacs.some(Y=>Y.tag===_.focus)?_.focus:null;let T=_&&_.lens&&typeof _.lens=="object"?_.lens:{},w=nt.lens.on;return nt.lens={on:T.on===!0,metrics:du.filter(Y=>Array.isArray(T.metrics)&&T.metrics.includes(Y)),scope:typeof T.scope=="string"&&nt.dacs.some(Y=>Y.tag===T.scope)?T.scope:null},(nt.lens.on||w)&&Qe(),ut.name==="dacs"&&(ut.dirty=!0),!0},focusDac(_){if(!D||typeof _!="string")return!1;let C=nt.dacs.find(Kt=>Kt.tag===_);if(!C)return!1;let T=(fu(D.latest,[C]).byDac[_]||[]).filter(Kt=>Number.isFinite(Kt.x)&&Number.isFinite(Kt.y));if(!T.length)return!1;let w=lu(T.map(Kt=>[Kt.x,Kt.y])),Y=(ee.copy(h.position).sub(f.target),ln.setFromVector3(ee).theta);Ue.copy(h),Ue.updateProjectionMatrix(),dn.set(w.x,0,-w.y);let tt=CM,st=pt.left+tt,rt=Se-pt.right-tt,ft=pt.top+tt,mt=le-pt.bottom-tt,j=Kt=>{Fn.set(Kt,gp,Y),Ue.position.setFromSpherical(Fn).add(dn),Ue.lookAt(dn),Ue.updateMatrixWorld();for(let ht of T){ee.set(ht.x,Ws,-ht.y).project(Ue);let et=(ee.x+1)/2*Se,Ht=(1-ee.y)/2*le;if(ee.z>=1||et<st||et>rt||Ht<ft||Ht>mt||pi.some(he=>et>he.left-gc&&et<he.right+gc&&Ht>he.top-gc&&Ht<he.bottom+gc))return!1}return!0},Nt=RM,Zt=f.maxDistance,Bt;if(j(Nt))Bt=Nt;else if(!j(Zt))Bt=Zt;else{for(let Kt=0;Kt<22;Kt++){let ht=(Nt+Zt)/2;j(ht)?Zt=ht:Nt=ht}Bt=Zt}return Xn(w.x,w.y,Bt,gp),!0},setInsets(_={}){let C=w=>Number.isFinite(w)&&w>0?w:0,T=[pt.left,pt.right,pt.top,pt.bottom].join();if(Object.assign(Mt,{left:C(_.left),right:C(_.right),top:C(_.top),bottom:C(_.bottom)}),pi.length=0,Array.isArray(_.avoid))for(let w of _.avoid)!w||![w.left,w.top,w.right,w.bottom].every(Number.isFinite)||w.right<=w.left||w.bottom<=w.top||pi.push({left:w.left,top:w.top,right:w.right,bottom:w.bottom});return Wi(),h.updateMatrixWorld(),bn[0]=NaN,[pt.left,pt.right,pt.top,pt.bottom].join()!==T&&(Gi.clear(),ze()),{...pt,avoid:pi.map(w=>({...w}))}},fleetScreen(_){if(!D)return null;let C=D.fleets.findIndex(tt=>tt.a===_);if(C<0)return null;h.updateMatrixWorld(),Gr(C,cn);let T=D.fleets[C],w=Wr(cn[0],cn[1],ks(T.flagSize)*fc(D.vis[C])),Y=ke(C)<.001?0:Math.min(1,Math.max(0,(w-on.collapse)/(on.full-on.collapse)));return{x:cn[0],y:cn[1],inSystem:!!(D.place&&D.place[C]),shown:Y,...Cc.screenOf(cn[0],cn[1])}},statColumnScreen(_){let C=ut.cols[_];if(!C)return null;h.updateMatrixWorld();let T=xs(C.x,C.y,Ws),w=xs(C.x,C.y,Ws+dt(C));return T&&w?{key:C.key,sys:C.sys,x:C.x,y:C.y,base:{clientX:T[0]+Pe.left,clientY:T[1]+Pe.top},top:{clientX:w[0]+Pe.left,clientY:w[1]+Pe.top},widthWorld:(.75+.5*Math.sqrt(ut.vmax?C.v/ut.vmax:0))*Pt.uStatW.value}:null},statRingScreen(_){let C=ut.cols[_];if(!C||!C.rr||!re.visible)return null;h.updateMatrixWorld();let T=wu(C);return{key:C.key,sys:C.sys,x:C.x,y:C.y,v:C.v,r:C.rr,b:C.rb,centre:{clientX:T.cx+Pe.left,clientY:T.cy+Pe.top},top:{clientX:T.tx+Pe.left,clientY:T.ty+Pe.top},radiusPx:T.rad}},labelLayout(){let _=(T,w,Y)=>[+(T[0]+Pe.left).toFixed(1),+(T[1]+Pe.top).toFixed(1),+(T[0]+w+Pe.left).toFixed(1),+(T[1]+Y+Pe.top).toFixed(1)],C=(T,w,Y,tt)=>({n:w,prio:Y,vis:tt,hide:T.hide||"",def:_(T.spots[0],T.w,T.h),box:_(T.spots[tt?T.cand:0],T.w,T.h)});return{galaxy:di.filter(T=>T.shown&&T.w).map(T=>C(T,T.s.n,T.prio,!!T.vis)),system:[...gs.values()].filter(T=>T.on&&T.w).map(T=>C(T,T.el.textContent,T.prio,T.cand!=null&&T.cand>=0))}},pickAt(_,C){h.updateMatrixWorld();let T=wc(_,C);return T?{type:T.type,id:T.id,sys:T.sys}:null},tune(_={}){return typeof _.fleetDots=="boolean"&&(ot.uDots.value=_.fleetDots?1:0),Number.isFinite(_.strength)&&(it.strength=_.strength),Number.isFinite(_.radius)&&(it.radius=_.radius),Number.isFinite(_.threshold)&&(it.threshold=_.threshold),Number.isFinite(_.exposure)&&(s.toneMappingExposure=_.exposure),Number.isFinite(_.terrDim)&&(P.uTerrDim.value=_.terrDim),Number.isFinite(_.terrFill)&&(P.uTerrFill.value=_.terrFill),Number.isFinite(_.conqFill)&&(L.material.uniforms.uConqFill.value=_.conqFill),Number.isFinite(_.conqDim)&&(L.material.uniforms.uConqDim.value=_.conqDim),Array.isArray(_.terrGain)&&_.terrGain.length===3&&(b=_.terrGain.slice(),U(b,nt.lens.on)),Number.isFinite(_.sysCover)&&(yt.value=_.sysCover),Number.isFinite(_.nearK)&&_.nearK>0&&(St.nearK=_.nearK,h.near=0),Number.isFinite(_.domIn)&&(St.domIn=_.domIn),Number.isFinite(_.domOut)&&(St.domOut=_.domOut),Number.isFinite(_.dcOut)&&(St.dcOut=_.dcOut),{terrDim:P.uTerrDim.value,strength:it.strength,radius:it.radius,threshold:it.threshold,exposure:s.toneMappingExposure}},fleetPixelSize(_){if(!D)return null;let C=D.fleets.findIndex(Y=>Y.a===_);if(C<0)return null;let T=D.fleets[C],w=ks(T.flagSize)*fc(D.vis[C]);return h.updateMatrixWorld(),Gr(C,cn),Wr(cn[0],cn[1],w)},fleetCell(_){let C=D&&D.fleets.find(T=>T.a===_);return C?uc(an,C.flag,C.flagSize):null},gateLinks(){return D?D.gates.map(_=>({a:_.a,b:_.b,ax:_.ax,ay:_.ay,bx:_.bx,by:_.by,len:_.len})):[]},getStats(){return{ok:!0,fps:Math.round(Oe.fps*10)/10,frameMs:Math.round(Oe.frameMs*100)/100,frames:Oe.frames,pixelRatio:r,drawCalls:s.info.render.calls,fleets:D?D.fleets.length:0,systems:D?D.systems.length:0,hotSpots:D?D.hot.length:0,reducedMotion:e,bodies:ve.length,gates:D?D.gates.length:0,systemView:q.addr?Xp(q.addr):null,galaxyFade:Math.round(u.uGal.value*1e3)/1e3,camera:(()=>{ee.copy(h.position).sub(f.target);let _=new yi().setFromVector3(ee);return{dist:_.radius,polar:_.phi,azimuth:_.theta,tx:f.target.x,ty:-f.target.z,min:f.minDistance,near:h.near}})(),textures:V.texStats(),ships:{atlas:!!an,sil:Math.round(u.uSil.value*1e3)/1e3},activeFx:(()=>{let _=u.uTime.value,C=0,T=0;for(let w=0;w<pc;w++){let Y=_-O.iS.array[w*4+3],tt=O.iK.array[w];Y>=-.001&&Y<=(tt===1?3.2:tt===5?1.8:2.4)&&C++}for(let w=0;w<mc;w++){let Y=_-ce.iS.array[w*2];Y>=-.001&&Y<=1.8&&T++}return{pulses:C,tracers:T}})(),running:ia,layers:{...A},filter:{...Lt},flying:ye.on,autoRotating:f.autoRotate,cpuMs:Math.round(Oe.cpuMs*100)/100,statLayer:{name:ut.name,res:ut.res,growing:!!ut.growAt,columns:xt.visible?ut.cols.length:0,rings:ut.rings||0,combatRings:{n:W.instanceCount||0,drawn:vt.visible},callouts:ut.callouts.map(_=>({sys:_.c.sys,name:_.c.name,line:_.c.line,v:_.c.v,shown:_.el.style.display!=="none"&&l.style.display!=="none",rank:_.rank+1,under:!!_.under,marker:_.vis?[+(_.mx+Pe.left).toFixed(1),+(_.my+Pe.top).toFixed(1)]:null}))},dacs:{n:nt.dacs.length,example:nt.example,focus:nt.focus,halos:nt.halos.length,drawn:Qt.visible,lens:{...nt.lens,metrics:nt.lens.metrics.slice(),drawn:L.visible,byDac:nt.conq?{...nt.conq.byDac}:{},contested:nt.conq?nt.conq.contested:0,systems:nt.conq?nt.conq.systems.map(_=>({a:_.a,winner:_.winner,contested:_.contested,strength:_.strength})):[]},cols:ut.name==="dacs"?ut.cols.map(_=>({sys:_.sys,tag:_.tag,hex:_.hex,v:_.v})):[],mark:nt.mark&&nt.markBox&&nt.mark.style.display!=="none"&&l.style.display!=="none"?{left:nt.markBox.left+Pe.left,top:nt.markBox.top+Pe.top,right:nt.markBox.right+Pe.left,bottom:nt.markBox.bottom+Pe.top}:null},insets:{...pt,avoid:pi.map(_=>({..._}))}}},dispose(){sa||(sa=!0,Ec(),Yo.disconnect(),document.removeEventListener("visibilitychange",Nu),i.removeEventListener("wheel",fe,{capture:!0}),o.removeEventListener("pointermove",Eu),o.removeEventListener("pointerleave",Ru),o.removeEventListener("pointerdown",Pu),o.removeEventListener("pointerup",Iu),o.removeEventListener("pointercancel",Cu),o.removeEventListener("webglcontextlost",Fu),o.removeEventListener("webglcontextrestored",Uu),f.dispose(),V.dispose(),c.traverse(_=>{_.geometry&&_.geometry.dispose(),_.material&&_.material.dispose()}),p.dispose(),K.dispose(),_t.dispose(),s.dispose(),o.remove(),a.remove(),l.remove(),Ae.pick.clear(),Ae.hover.clear(),D=null)}};return Cc}window.C4Scene={mount:oS,version:"1.0.0",layers:mu.slice()};})();
