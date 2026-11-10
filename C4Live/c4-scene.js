/* C4 Live galaxy scene. Source: C4Live/scene-src (node C4Live/scene-src/build.mjs). Includes three.js 0.186.1 (MIT License, Copyright 2010-2026 three.js authors, https://github.com/mrdoob/three.js). */
(()=>{var kn={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},jn={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Ju=0,Jc=1,ju=2;var go=1,Qu=2,vr=3,ji=0,Sn=1,fi=2,zn=0,yr=1,As=2,jc=3,Qc=4,xo=5;var di=100,tf=101,ef=102,nf=103,sf=104,rf=200,_o=201,of=202,af=203,th=204,Mr=205,lf=206,cf=207,hf=208,uf=209,ff=210,df=211,pf=212,mf=213,gf=214,wa=0,Ta=1,Aa=2,cr=3,Ea=4,Ca=5,Ra=6,Pa=7,eh=0,xf=1,_f=2,Qn=0,vo=1,yo=2,Mo=3,Es=4,So=5,bo=6,wo=7;var nh=300,Qi=301,Cs=302,tl=303,el=304,To=306,Ia=1e3,ci=1001,La=1002,rn=1003,vf=1004;var Ao=1005;var Xe=1006,nl=1007;var ts=1008;var Un=1009,ih=1010,sh=1011,Sr=1012,il=1013,ti=1014,ei=1015,Ke=1016,sl=1017,rl=1018,br=1020,rh=35902,oh=35899,ah=1021,lh=1022,mn=1023,hi=1026,es=1027,ch=1028,ol=1029,ns=1030,al=1031;var ll=1033,Eo=33776,Co=33777,Ro=33778,Po=33779,cl=35840,hl=35841,ul=35842,fl=35843,dl=36196,pl=37492,ml=37496,gl=37488,xl=37489,Io=37490,_l=37491,vl=37808,yl=37809,Ml=37810,Sl=37811,bl=37812,wl=37813,Tl=37814,Al=37815,El=37816,Cl=37817,Rl=37818,Pl=37819,Il=37820,Ll=37821,Dl=36492,Nl=36494,Ul=36495,Fl=36283,Ol=36284,Lo=36285,Bl=36286;var Zr=2300,Da=2301,Ma=2302,Gc=2303,Wc=2400,Xc=2401,qc=2402;var yf=3200;var hh=0,Mf=1,Ii="",ln="srgb",Kr="srgb-linear",Jr="linear",be="srgb";var Sa=7680;var Sf=519,bf=512,wf=513,Tf=514,kl=515,Af=516,Ef=517,zl=518,Cf=519,Rf=35044,uh=35048;var fh="300 es",Kn=2e3,jr=2001;function wp(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Tp(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function hr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Pf(){let i=hr("canvas");return i.style.display="block",i}var Au={},ur=null;function dh(...i){let t="THREE."+i.shift();ur?ur("log",t,...i):console.log(t,...i)}function If(i){let t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function Qt(...i){i=If(i);let t="THREE."+i.shift();if(ur)ur("warn",t,...i);else{let e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function te(...i){i=If(i);let t="THREE."+i.shift();if(ur)ur("error",t,...i);else{let e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function Ms(...i){let t=i.join(" ");t in Au||(Au[t]=!0,Qt(...i))}function Lf(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var Df={[wa]:Ta,[Aa]:Ra,[Ea]:Pa,[cr]:Ca,[Ta]:wa,[Ra]:Aa,[Pa]:Ea,[Ca]:cr},Jn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},un=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Eu=1234567,Yr=Math.PI/180,fr=180/Math.PI;function wr(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(un[i&255]+un[i>>8&255]+un[i>>16&255]+un[i>>24&255]+"-"+un[t&255]+un[t>>8&255]+"-"+un[t>>16&15|64]+un[t>>24&255]+"-"+un[e&63|128]+un[e>>8&255]+"-"+un[e>>16&255]+un[e>>24&255]+un[n&255]+un[n>>8&255]+un[n>>16&255]+un[n>>24&255]).toLowerCase()}function me(i,t,e){return Math.max(t,Math.min(e,i))}function ph(i,t){return(i%t+t)%t}function Ap(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Ep(i,t,e){return i!==t?(e-i)/(t-i):0}function $r(i,t,e){return(1-e)*i+e*t}function Cp(i,t,e,n){return $r(i,t,1-Math.exp(-e*n))}function Rp(i,t=1){return t-Math.abs(ph(i,t*2)-t)}function Pp(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Ip(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Lp(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Dp(i,t){return i+Math.random()*(t-i)}function Np(i){return i*(.5-Math.random())}function Up(i){i!==void 0&&(Eu=i);let t=Eu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Fp(i){return i*Yr}function Op(i){return i*fr}function Bp(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function kp(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function zp(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Vp(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),f=r((t-n)/2),u=o((t-n)/2),d=r((n-t)/2),m=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*f,l*u,a*c);break;case"YZY":i.set(l*u,a*h,l*f,a*c);break;case"ZXZ":i.set(l*f,l*u,a*h,a*c);break;case"XZX":i.set(a*h,l*m,l*d,a*c);break;case"YXY":i.set(l*d,a*h,l*m,a*c);break;case"ZYZ":i.set(l*m,l*d,a*h,a*c);break;default:Qt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function ar(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function yn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var mh={DEG2RAD:Yr,RAD2DEG:fr,generateUUID:wr,clamp:me,euclideanModulo:ph,mapLinear:Ap,inverseLerp:Ep,lerp:$r,damp:Cp,pingpong:Rp,smoothstep:Pp,smootherstep:Ip,randInt:Lp,randFloat:Dp,randFloatSpread:Np,seededRandom:Up,degToRad:Fp,radToDeg:Op,isPowerOfTwo:Bp,ceilPowerOfTwo:kp,floorPowerOfTwo:zp,setQuaternionFromProperEuler:Vp,normalize:yn,denormalize:ar},yh=class yh{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=me(this.x,t.x,e.x),this.y=me(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=me(this.x,t,e),this.y=me(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(me(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(me(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};yh.prototype.isVector2=!0;var qt=yh,Ln=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],f=n[s+3],u=r[o+0],d=r[o+1],m=r[o+2],M=r[o+3];if(f!==M||l!==u||c!==d||h!==m){let g=l*u+c*d+h*m+f*M;g<0&&(u=-u,d=-d,m=-m,M=-M,g=-g);let p=1-a;if(g<.9995){let I=Math.acos(g),F=Math.sin(I);p=Math.sin(p*I)/F,a=Math.sin(a*I)/F,l=l*p+u*a,c=c*p+d*a,h=h*p+m*a,f=f*p+M*a}else{l=l*p+u*a,c=c*p+d*a,h=h*p+m*a,f=f*p+M*a;let I=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=I,c*=I,h*=I,f*=I}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],f=r[o],u=r[o+1],d=r[o+2],m=r[o+3];return t[e]=a*m+h*f+l*d-c*u,t[e+1]=l*m+h*u+c*f-a*d,t[e+2]=c*m+h*d+a*u-l*f,t[e+3]=h*m-a*f-l*u-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),f=a(r/2),u=l(n/2),d=l(s/2),m=l(r/2);switch(o){case"XYZ":this._x=u*h*f+c*d*m,this._y=c*d*f-u*h*m,this._z=c*h*m+u*d*f,this._w=c*h*f-u*d*m;break;case"YXZ":this._x=u*h*f+c*d*m,this._y=c*d*f-u*h*m,this._z=c*h*m-u*d*f,this._w=c*h*f+u*d*m;break;case"ZXY":this._x=u*h*f-c*d*m,this._y=c*d*f+u*h*m,this._z=c*h*m+u*d*f,this._w=c*h*f-u*d*m;break;case"ZYX":this._x=u*h*f-c*d*m,this._y=c*d*f+u*h*m,this._z=c*h*m-u*d*f,this._w=c*h*f+u*d*m;break;case"YZX":this._x=u*h*f+c*d*m,this._y=c*d*f+u*h*m,this._z=c*h*m-u*d*f,this._w=c*h*f-u*d*m;break;case"XZY":this._x=u*h*f-c*d*m,this._y=c*d*f-u*h*m,this._z=c*h*m+u*d*f,this._w=c*h*f+u*d*m;break;default:Qt("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],f=e[10],u=n+a+f;if(u>0){let d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(o-s)*d}else if(n>a&&n>f){let d=2*Math.sqrt(1+n-a-f);this._w=(h-l)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+c)/d}else if(a>f){let d=2*Math.sqrt(1+a-n-f);this._w=(r-c)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(l+h)/d}else{let d=2*Math.sqrt(1+f-n-a);this._w=(o-s)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(me(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Mh=class Mh{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Cu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Cu.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),f=2*(r*n-o*e);return this.x=e+l*c+o*f-a*h,this.y=n+l*h+a*c-r*f,this.z=s+l*f+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=me(this.x,t.x,e.x),this.y=me(this.y,t.y,e.y),this.z=me(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=me(this.x,t,e),this.y=me(this.y,t,e),this.z=me(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(me(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return bc.copy(this).projectOnVector(t),this.sub(bc)}reflect(t){return this.sub(bc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(me(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Mh.prototype.isVector3=!0;var G=Mh,bc=new G,Cu=new Ln,Sh=class Sh{constructor(t,e,n,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],f=n[7],u=n[2],d=n[5],m=n[8],M=s[0],g=s[3],p=s[6],I=s[1],F=s[4],A=s[7],b=s[2],T=s[5],D=s[8];return r[0]=o*M+a*I+l*b,r[3]=o*g+a*F+l*T,r[6]=o*p+a*A+l*D,r[1]=c*M+h*I+f*b,r[4]=c*g+h*F+f*T,r[7]=c*p+h*A+f*D,r[2]=u*M+d*I+m*b,r[5]=u*g+d*F+m*T,r[8]=u*p+d*A+m*D,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=h*o-a*c,u=a*l-h*r,d=c*r-o*l,m=e*f+n*u+s*d;if(m===0)return this.set(0,0,0,0,0,0,0,0,0);let M=1/m;return t[0]=f*M,t[1]=(s*c-h*n)*M,t[2]=(a*n-s*o)*M,t[3]=u*M,t[4]=(h*e-s*l)*M,t[5]=(s*r-a*e)*M,t[6]=d*M,t[7]=(n*l-c*e)*M,t[8]=(o*e-n*r)*M,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return Ms("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(wc.makeScale(t,e)),this}rotate(t){return Ms("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(wc.makeRotation(-t)),this}translate(t,e){return Ms("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(wc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Sh.prototype.isMatrix3=!0;var re=Sh,wc=new re,Ru=new re().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Pu=new re().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Hp(){let i={enabled:!0,workingColorSpace:Kr,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===be&&(s.r=Ri(s.r),s.g=Ri(s.g),s.b=Ri(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===be&&(s.r=lr(s.r),s.g=lr(s.g),s.b=lr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ii?Jr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ms("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ms("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Kr]:{primaries:t,whitePoint:n,transfer:Jr,toXYZ:Ru,fromXYZ:Pu,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:ln},outputColorSpaceConfig:{drawingBufferColorSpace:ln}},[ln]:{primaries:t,whitePoint:n,transfer:be,toXYZ:Ru,fromXYZ:Pu,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:ln}}}),i}var pe=Hp();function Ri(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function lr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Ys,Na=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ys===void 0&&(Ys=hr("canvas")),Ys.width=t.width,Ys.height=t.height;let s=Ys.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Ys}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=hr("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ri(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ri(e[n]/255)*255):e[n]=Ri(e[n]);return{data:e,width:t.width,height:t.height}}else return Qt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Gp=0,dr=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Gp++}),this.uuid=wr(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Tc(s[o].image)):r.push(Tc(s[o]))}else r=Tc(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function Tc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Na.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Qt("Texture: Unable to serialize Texture."),{})}var Wp=0,Ac=new G,dn=class i extends Jn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=ci,s=ci,r=Xe,o=ts,a=mn,l=Un,c=i.DEFAULT_ANISOTROPY,h=Ii){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wp++}),this.uuid=wr(),this.name="",this.source=new dr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new qt(0,0),this.repeat=new qt(1,1),this.center=new qt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new re,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Ac).x}get height(){return this.source.getSize(Ac).y}get depth(){return this.source.getSize(Ac).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){Qt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Qt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==nh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ia:t.x=t.x-Math.floor(t.x);break;case ci:t.x=t.x<0?0:1;break;case La:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ia:t.y=t.y-Math.floor(t.y);break;case ci:t.y=t.y<0?0:1;break;case La:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};dn.DEFAULT_IMAGE=null;dn.DEFAULT_MAPPING=nh;dn.DEFAULT_ANISOTROPY=1;var bh=class bh{constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],f=l[8],u=l[1],d=l[5],m=l[9],M=l[2],g=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-M)<.01&&Math.abs(m-g)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+M)<.1&&Math.abs(m+g)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let F=(c+1)/2,A=(d+1)/2,b=(p+1)/2,T=(h+u)/4,D=(f+M)/4,v=(m+g)/4;return F>A&&F>b?F<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(F),s=T/n,r=D/n):A>b?A<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(A),n=T/s,r=v/s):b<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),n=D/r,s=v/r),this.set(n,s,r,e),this}let I=Math.sqrt((g-m)*(g-m)+(f-M)*(f-M)+(u-h)*(u-h));return Math.abs(I)<.001&&(I=1),this.x=(g-m)/I,this.y=(f-M)/I,this.z=(u-h)/I,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=me(this.x,t.x,e.x),this.y=me(this.y,t.y,e.y),this.z=me(this.z,t.z,e.z),this.w=me(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=me(this.x,t,e),this.y=me(this.y,t,e),this.z=me(this.z,t,e),this.w=me(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(me(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};bh.prototype.isVector4=!0;var He=bh,Ua=class extends Jn{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Xe,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new He(0,0,t,e),this.scissorTest=!1,this.viewport=new He(0,0,t,e),this.textures=[];let s={width:t,height:e,depth:n.depth},r=new dn(s),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Xe,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new dr(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},qe=class extends Ua{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Qr=class extends dn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=rn,this.minFilter=rn,this.wrapR=ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Fa=class extends dn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=rn,this.minFilter=rn,this.wrapR=ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var Qa=class Qa{constructor(t,e,n,s,r,o,a,l,c,h,f,u,d,m,M,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,f,u,d,m,M,g)}set(t,e,n,s,r,o,a,l,c,h,f,u,d,m,M,g){let p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=u,p[3]=d,p[7]=m,p[11]=M,p[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Qa().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,s=1/$s.setFromMatrixColumn(t,0).length(),r=1/$s.setFromMatrixColumn(t,1).length(),o=1/$s.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){let u=o*h,d=o*f,m=a*h,M=a*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=d+m*c,e[5]=u-M*c,e[9]=-a*l,e[2]=M-u*c,e[6]=m+d*c,e[10]=o*l}else if(t.order==="YXZ"){let u=l*h,d=l*f,m=c*h,M=c*f;e[0]=u+M*a,e[4]=m*a-d,e[8]=o*c,e[1]=o*f,e[5]=o*h,e[9]=-a,e[2]=d*a-m,e[6]=M+u*a,e[10]=o*l}else if(t.order==="ZXY"){let u=l*h,d=l*f,m=c*h,M=c*f;e[0]=u-M*a,e[4]=-o*f,e[8]=m+d*a,e[1]=d+m*a,e[5]=o*h,e[9]=M-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let u=o*h,d=o*f,m=a*h,M=a*f;e[0]=l*h,e[4]=m*c-d,e[8]=u*c+M,e[1]=l*f,e[5]=M*c+u,e[9]=d*c-m,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let u=o*l,d=o*c,m=a*l,M=a*c;e[0]=l*h,e[4]=M-u*f,e[8]=m*f+d,e[1]=f,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=d*f+m,e[10]=u-M*f}else if(t.order==="XZY"){let u=o*l,d=o*c,m=a*l,M=a*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=u*f+M,e[5]=o*h,e[9]=d*f-m,e[2]=m*f-d,e[6]=a*h,e[10]=M*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Xp,t,qp)}lookAt(t,e,n){let s=this.elements;return Pn.subVectors(t,e),Pn.lengthSq()===0&&(Pn.z=1),Pn.normalize(),Oi.crossVectors(n,Pn),Oi.lengthSq()===0&&(Math.abs(n.z)===1?Pn.x+=1e-4:Pn.z+=1e-4,Pn.normalize(),Oi.crossVectors(n,Pn)),Oi.normalize(),ta.crossVectors(Pn,Oi),s[0]=Oi.x,s[4]=ta.x,s[8]=Pn.x,s[1]=Oi.y,s[5]=ta.y,s[9]=Pn.y,s[2]=Oi.z,s[6]=ta.z,s[10]=Pn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],f=n[5],u=n[9],d=n[13],m=n[2],M=n[6],g=n[10],p=n[14],I=n[3],F=n[7],A=n[11],b=n[15],T=s[0],D=s[4],v=s[8],P=s[12],N=s[1],O=s[5],B=s[9],q=s[13],V=s[2],K=s[6],lt=s[10],at=s[14],pt=s[3],ot=s[7],ut=s[11],dt=s[15];return r[0]=o*T+a*N+l*V+c*pt,r[4]=o*D+a*O+l*K+c*ot,r[8]=o*v+a*B+l*lt+c*ut,r[12]=o*P+a*q+l*at+c*dt,r[1]=h*T+f*N+u*V+d*pt,r[5]=h*D+f*O+u*K+d*ot,r[9]=h*v+f*B+u*lt+d*ut,r[13]=h*P+f*q+u*at+d*dt,r[2]=m*T+M*N+g*V+p*pt,r[6]=m*D+M*O+g*K+p*ot,r[10]=m*v+M*B+g*lt+p*ut,r[14]=m*P+M*q+g*at+p*dt,r[3]=I*T+F*N+A*V+b*pt,r[7]=I*D+F*O+A*K+b*ot,r[11]=I*v+F*B+A*lt+b*ut,r[15]=I*P+F*q+A*at+b*dt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],f=t[6],u=t[10],d=t[14],m=t[3],M=t[7],g=t[11],p=t[15],I=l*d-c*u,F=a*d-c*f,A=a*u-l*f,b=o*d-c*h,T=o*u-l*h,D=o*f-a*h;return e*(M*I-g*F+p*A)-n*(m*I-g*b+p*T)+s*(m*F-M*b+p*D)-r*(m*A-M*T+g*D)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],h=t[10];return e*(o*h-a*c)-n*(r*h-a*l)+s*(r*c-o*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=t[9],u=t[10],d=t[11],m=t[12],M=t[13],g=t[14],p=t[15],I=e*a-n*o,F=e*l-s*o,A=e*c-r*o,b=n*l-s*a,T=n*c-r*a,D=s*c-r*l,v=h*M-f*m,P=h*g-u*m,N=h*p-d*m,O=f*g-u*M,B=f*p-d*M,q=u*p-d*g,V=I*q-F*B+A*O+b*N-T*P+D*v;if(V===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let K=1/V;return t[0]=(a*q-l*B+c*O)*K,t[1]=(s*B-n*q-r*O)*K,t[2]=(M*D-g*T+p*b)*K,t[3]=(u*T-f*D-d*b)*K,t[4]=(l*N-o*q-c*P)*K,t[5]=(e*q-s*N+r*P)*K,t[6]=(g*A-m*D-p*F)*K,t[7]=(h*D-u*A+d*F)*K,t[8]=(o*B-a*N+c*v)*K,t[9]=(n*N-e*B-r*v)*K,t[10]=(m*T-M*A+p*I)*K,t[11]=(f*A-h*T-d*I)*K,t[12]=(a*P-o*O-l*v)*K,t[13]=(e*O-n*P+s*v)*K,t[14]=(M*F-m*b-g*I)*K,t[15]=(h*b-f*F+u*I)*K,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,f=a+a,u=r*c,d=r*h,m=r*f,M=o*h,g=o*f,p=a*f,I=l*c,F=l*h,A=l*f,b=n.x,T=n.y,D=n.z;return s[0]=(1-(M+p))*b,s[1]=(d+A)*b,s[2]=(m-F)*b,s[3]=0,s[4]=(d-A)*T,s[5]=(1-(u+p))*T,s[6]=(g+I)*T,s[7]=0,s[8]=(m+F)*D,s[9]=(g-I)*D,s[10]=(1-(u+M))*D,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let o=$s.set(s[0],s[1],s[2]).length(),a=$s.set(s[4],s[5],s[6]).length(),l=$s.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Yn.copy(this);let c=1/o,h=1/a,f=1/l;return Yn.elements[0]*=c,Yn.elements[1]*=c,Yn.elements[2]*=c,Yn.elements[4]*=h,Yn.elements[5]*=h,Yn.elements[6]*=h,Yn.elements[8]*=f,Yn.elements[9]*=f,Yn.elements[10]*=f,e.setFromRotationMatrix(Yn),n.x=o,n.y=a,n.z=l,this}makePerspective(t,e,n,s,r,o,a=Kn,l=!1){let c=this.elements,h=2*r/(e-t),f=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s),m,M;if(l)m=r/(o-r),M=o*r/(o-r);else if(a===Kn)m=-(o+r)/(o-r),M=-2*o*r/(o-r);else if(a===jr)m=-o/(o-r),M=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=M,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=Kn,l=!1){let c=this.elements,h=2/(e-t),f=2/(n-s),u=-(e+t)/(e-t),d=-(n+s)/(n-s),m,M;if(l)m=1/(o-r),M=o/(o-r);else if(a===Kn)m=-2/(o-r),M=-(o+r)/(o-r);else if(a===jr)m=-1/(o-r),M=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=m,c[14]=M,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};Qa.prototype.isMatrix4=!0;var Ve=Qa,$s=new G,Yn=new Ve,Xp=new G(0,0,0),qp=new G(1,1,1),Oi=new G,ta=new G,Pn=new G,Iu=new Ve,Lu=new Ln,Gi=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],f=s[2],u=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(me(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-me(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(me(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-me(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(me(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-me(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:Qt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Iu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Iu,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Lu.setFromEuler(this),this.setFromQuaternion(Lu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Gi.DEFAULT_ORDER="XYZ";var pr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Yp=0,Du=new G,Zs=new Ln,wi=new Ve,ea=new G,Gr=new G,$p=new G,Zp=new Ln,Nu=new G(1,0,0),Uu=new G(0,1,0),Fu=new G(0,0,1),Ou={type:"added"},Kp={type:"removed"},Ks={type:"childadded",child:null},Ec={type:"childremoved",child:null},Dn=class i extends Jn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Yp++}),this.uuid=wr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new G,e=new Gi,n=new Ln,s=new G(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ve},normalMatrix:{value:new re}}),this.matrix=new Ve,this.matrixWorld=new Ve,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new pr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Zs.setFromAxisAngle(t,e),this.quaternion.multiply(Zs),this}rotateOnWorldAxis(t,e){return Zs.setFromAxisAngle(t,e),this.quaternion.premultiply(Zs),this}rotateX(t){return this.rotateOnAxis(Nu,t)}rotateY(t){return this.rotateOnAxis(Uu,t)}rotateZ(t){return this.rotateOnAxis(Fu,t)}translateOnAxis(t,e){return Du.copy(t).applyQuaternion(this.quaternion),this.position.add(Du.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Nu,t)}translateY(t){return this.translateOnAxis(Uu,t)}translateZ(t){return this.translateOnAxis(Fu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(wi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ea.copy(t):ea.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Gr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?wi.lookAt(Gr,ea,this.up):wi.lookAt(ea,Gr,this.up),this.quaternion.setFromRotationMatrix(wi),s&&(wi.extractRotation(s.matrixWorld),Zs.setFromRotationMatrix(wi),this.quaternion.premultiply(Zs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(te("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Ou),Ks.child=t,this.dispatchEvent(Ks),Ks.child=null):te("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Kp),Ec.child=t,this.dispatchEvent(Ec),Ec.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),wi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),wi.multiply(t.parent.matrixWorld)),t.applyMatrix4(wi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Ou),Ks.child=t,this.dispatchEvent(Ks),Ks.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gr,t,$p),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gr,Zp,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let f=l[c];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),f=o(t.shapes),u=o(t.skeletons),d=o(t.animations),m=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),d.length>0&&(n.animations=d),m.length>0&&(n.nodes=m)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Dn.DEFAULT_UP=new G(0,1,0);Dn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Dn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ys=class extends Dn{constructor(){super(),this.isGroup=!0,this.type="Group"}},Jp={type:"move"},mr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ys,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ys,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ys,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let M of t.hand.values()){let g=e.getJointPose(M,n),p=this._getHandJoint(c,M);g!==null&&(p.matrix.fromArray(g.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=g.radius),p.visible=g!==null}let h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,m=.005;c.inputState.pinching&&u>d+m?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=d-m&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Jp)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new ys;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Nf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Bi={h:0,s:0,l:0},na={h:0,s:0,l:0};function Cc(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var ce=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ln){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,pe.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=pe.workingColorSpace){return this.r=t,this.g=e,this.b=n,pe.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=pe.workingColorSpace){if(t=ph(t,1),e=me(e,0,1),n=me(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Cc(o,r,t+1/3),this.g=Cc(o,r,t),this.b=Cc(o,r,t-1/3)}return pe.colorSpaceToWorking(this,s),this}setStyle(t,e=ln){function n(r){r!==void 0&&parseFloat(r)<1&&Qt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Qt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);Qt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ln){let n=Nf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Qt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ri(t.r),this.g=Ri(t.g),this.b=Ri(t.b),this}copyLinearToSRGB(t){return this.r=lr(t.r),this.g=lr(t.g),this.b=lr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ln){return pe.workingToColorSpace(fn.copy(this),t),Math.round(me(fn.r*255,0,255))*65536+Math.round(me(fn.g*255,0,255))*256+Math.round(me(fn.b*255,0,255))}getHexString(t=ln){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=pe.workingColorSpace){pe.workingToColorSpace(fn.copy(this),e);let n=fn.r,s=fn.g,r=fn.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let f=o-a;switch(c=h<=.5?f/(o+a):f/(2-o-a),o){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=pe.workingColorSpace){return pe.workingToColorSpace(fn.copy(this),e),t.r=fn.r,t.g=fn.g,t.b=fn.b,t}getStyle(t=ln){pe.workingToColorSpace(fn.copy(this),t);let e=fn.r,n=fn.g,s=fn.b;return t!==ln?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Bi),this.setHSL(Bi.h+t,Bi.s+e,Bi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Bi),t.getHSL(na);let n=$r(Bi.h,na.h,e),s=$r(Bi.s,na.s,e),r=$r(Bi.l,na.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},fn=new ce;ce.NAMES=Nf;var to=class extends Dn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Gi,this.environmentIntensity=1,this.environmentRotation=new Gi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},$n=new G,Ti=new G,Rc=new G,Ai=new G,Js=new G,js=new G,Bu=new G,Pc=new G,Ic=new G,Lc=new G,Dc=new He,Nc=new He,Uc=new He,Hi=class i{constructor(t=new G,e=new G,n=new G){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),$n.subVectors(t,e),s.cross($n);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){$n.subVectors(s,e),Ti.subVectors(n,e),Rc.subVectors(t,e);let o=$n.dot($n),a=$n.dot(Ti),l=$n.dot(Rc),c=Ti.dot(Ti),h=Ti.dot(Rc),f=o*c-a*a;if(f===0)return r.set(0,0,0),null;let u=1/f,d=(c*l-a*h)*u,m=(o*h-a*l)*u;return r.set(1-d-m,m,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Ai)===null?!1:Ai.x>=0&&Ai.y>=0&&Ai.x+Ai.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,Ai)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Ai.x),l.addScaledVector(o,Ai.y),l.addScaledVector(a,Ai.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return Dc.setScalar(0),Nc.setScalar(0),Uc.setScalar(0),Dc.fromBufferAttribute(t,e),Nc.fromBufferAttribute(t,n),Uc.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Dc,r.x),o.addScaledVector(Nc,r.y),o.addScaledVector(Uc,r.z),o}static isFrontFacing(t,e,n,s){return $n.subVectors(n,e),Ti.subVectors(t,e),$n.cross(Ti).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return $n.subVectors(this.c,this.b),Ti.subVectors(this.a,this.b),$n.cross(Ti).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;Js.subVectors(s,n),js.subVectors(r,n),Pc.subVectors(t,n);let l=Js.dot(Pc),c=js.dot(Pc);if(l<=0&&c<=0)return e.copy(n);Ic.subVectors(t,s);let h=Js.dot(Ic),f=js.dot(Ic);if(h>=0&&f<=h)return e.copy(s);let u=l*f-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Js,o);Lc.subVectors(t,r);let d=Js.dot(Lc),m=js.dot(Lc);if(m>=0&&d<=m)return e.copy(r);let M=d*c-l*m;if(M<=0&&c>=0&&m<=0)return a=c/(c-m),e.copy(n).addScaledVector(js,a);let g=h*m-d*f;if(g<=0&&f-h>=0&&d-m>=0)return Bu.subVectors(r,s),a=(f-h)/(f-h+(d-m)),e.copy(s).addScaledVector(Bu,a);let p=1/(g+M+u);return o=M*p,a=u*p,e.copy(n).addScaledVector(Js,o).addScaledVector(js,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Wi=class{constructor(t=new G(1/0,1/0,1/0),e=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Zn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Zn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Zn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Zn):Zn.fromBufferAttribute(r,o),Zn.applyMatrix4(t.matrixWorld),this.expandByPoint(Zn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ia.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ia.copy(n.boundingBox)),ia.applyMatrix4(t.matrixWorld),this.union(ia)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Zn),Zn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Wr),sa.subVectors(this.max,Wr),Qs.subVectors(t.a,Wr),tr.subVectors(t.b,Wr),er.subVectors(t.c,Wr),ki.subVectors(tr,Qs),zi.subVectors(er,tr),gs.subVectors(Qs,er);let e=[0,-ki.z,ki.y,0,-zi.z,zi.y,0,-gs.z,gs.y,ki.z,0,-ki.x,zi.z,0,-zi.x,gs.z,0,-gs.x,-ki.y,ki.x,0,-zi.y,zi.x,0,-gs.y,gs.x,0];return!Fc(e,Qs,tr,er,sa)||(e=[1,0,0,0,1,0,0,0,1],!Fc(e,Qs,tr,er,sa))?!1:(ra.crossVectors(ki,zi),e=[ra.x,ra.y,ra.z],Fc(e,Qs,tr,er,sa))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Zn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Zn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ei[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ei[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ei[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ei[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ei[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ei[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ei[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ei[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ei),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Ei=[new G,new G,new G,new G,new G,new G,new G,new G],Zn=new G,ia=new Wi,Qs=new G,tr=new G,er=new G,ki=new G,zi=new G,gs=new G,Wr=new G,sa=new G,ra=new G,xs=new G;function Fc(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){xs.fromArray(i,r);let a=s.x*Math.abs(xs.x)+s.y*Math.abs(xs.y)+s.z*Math.abs(xs.z),l=t.dot(xs),c=e.dot(xs),h=n.dot(xs);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var $e=new G,oa=new qt,jp=0,sn=class extends Jn{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:jp++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Rf,this.updateRanges=[],this.gpuType=ei,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)oa.fromBufferAttribute(this,e),oa.applyMatrix3(t),this.setXY(e,oa.x,oa.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)$e.fromBufferAttribute(this,e),$e.applyMatrix3(t),this.setXYZ(e,$e.x,$e.y,$e.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)$e.fromBufferAttribute(this,e),$e.applyMatrix4(t),this.setXYZ(e,$e.x,$e.y,$e.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)$e.fromBufferAttribute(this,e),$e.applyNormalMatrix(t),this.setXYZ(e,$e.x,$e.y,$e.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)$e.fromBufferAttribute(this,e),$e.transformDirection(t),this.setXYZ(e,$e.x,$e.y,$e.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=ar(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=yn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=ar(e,this.array)),e}setX(t,e){return this.normalized&&(e=yn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=ar(e,this.array)),e}setY(t,e){return this.normalized&&(e=yn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=ar(e,this.array)),e}setZ(t,e){return this.normalized&&(e=yn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=ar(e,this.array)),e}setW(t,e){return this.normalized&&(e=yn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=yn(e,this.array),n=yn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=yn(e,this.array),n=yn(n,this.array),s=yn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=yn(e,this.array),n=yn(n,this.array),s=yn(s,this.array),r=yn(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var eo=class extends sn{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var no=class extends sn{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Mn=class extends sn{constructor(t,e,n){super(new Float32Array(t),e,n)}},Qp=new Wi,Xr=new G,Oc=new G,Ss=class{constructor(t=new G,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Qp.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Xr.subVectors(t,this.center);let e=Xr.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Xr,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Oc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Xr.copy(t.center).add(Oc)),this.expandByPoint(Xr.copy(t.center).sub(Oc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},tm=0,Bn=new Ve,Bc=new Dn,nr=new G,In=new Wi,qr=new Wi,nn=new G,pn=class i extends Jn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:tm++}),this.uuid=wr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(wp(t)?no:eo)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new re().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Bn.makeRotationFromQuaternion(t),this.applyMatrix4(Bn),this}rotateX(t){return Bn.makeRotationX(t),this.applyMatrix4(Bn),this}rotateY(t){return Bn.makeRotationY(t),this.applyMatrix4(Bn),this}rotateZ(t){return Bn.makeRotationZ(t),this.applyMatrix4(Bn),this}translate(t,e,n){return Bn.makeTranslation(t,e,n),this.applyMatrix4(Bn),this}scale(t,e,n){return Bn.makeScale(t,e,n),this.applyMatrix4(Bn),this}lookAt(t){return Bc.lookAt(t),Bc.updateMatrix(),this.applyMatrix4(Bc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(nr).negate(),this.translate(nr.x,nr.y,nr.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Mn(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Qt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Wi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){te("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];In.setFromBufferAttribute(r),this.morphTargetsRelative?(nn.addVectors(this.boundingBox.min,In.min),this.boundingBox.expandByPoint(nn),nn.addVectors(this.boundingBox.max,In.max),this.boundingBox.expandByPoint(nn)):(this.boundingBox.expandByPoint(In.min),this.boundingBox.expandByPoint(In.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&te('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ss);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){te("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new G,1/0);return}if(t){let n=this.boundingSphere.center;if(In.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];qr.setFromBufferAttribute(a),this.morphTargetsRelative?(nn.addVectors(In.min,qr.min),In.expandByPoint(nn),nn.addVectors(In.max,qr.max),In.expandByPoint(nn)):(In.expandByPoint(qr.min),In.expandByPoint(qr.max))}In.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)nn.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(nn));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)nn.fromBufferAttribute(a,c),l&&(nr.fromBufferAttribute(t,c),nn.add(nr)),s=Math.max(s,n.distanceToSquared(nn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&te('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){te("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new sn(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let v=0;v<n.count;v++)a[v]=new G,l[v]=new G;let c=new G,h=new G,f=new G,u=new qt,d=new qt,m=new qt,M=new G,g=new G;function p(v,P,N){c.fromBufferAttribute(n,v),h.fromBufferAttribute(n,P),f.fromBufferAttribute(n,N),u.fromBufferAttribute(r,v),d.fromBufferAttribute(r,P),m.fromBufferAttribute(r,N),h.sub(c),f.sub(c),d.sub(u),m.sub(u);let O=1/(d.x*m.y-m.x*d.y);isFinite(O)&&(M.copy(h).multiplyScalar(m.y).addScaledVector(f,-d.y).multiplyScalar(O),g.copy(f).multiplyScalar(d.x).addScaledVector(h,-m.x).multiplyScalar(O),a[v].add(M),a[P].add(M),a[N].add(M),l[v].add(g),l[P].add(g),l[N].add(g))}let I=this.groups;I.length===0&&(I=[{start:0,count:t.count}]);for(let v=0,P=I.length;v<P;++v){let N=I[v],O=N.start,B=N.count;for(let q=O,V=O+B;q<V;q+=3)p(t.getX(q+0),t.getX(q+1),t.getX(q+2))}let F=new G,A=new G,b=new G,T=new G;function D(v){b.fromBufferAttribute(s,v),T.copy(b);let P=a[v];F.copy(P),F.sub(b.multiplyScalar(b.dot(P))).normalize(),A.crossVectors(T,P);let O=A.dot(l[v])<0?-1:1;o.setXYZW(v,F.x,F.y,F.z,O)}for(let v=0,P=I.length;v<P;++v){let N=I[v],O=N.start,B=N.count;for(let q=O,V=O+B;q<V;q+=3)D(t.getX(q+0)),D(t.getX(q+1)),D(t.getX(q+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new sn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,d=n.count;u<d;u++)n.setXYZ(u,0,0,0);let s=new G,r=new G,o=new G,a=new G,l=new G,c=new G,h=new G,f=new G;if(t)for(let u=0,d=t.count;u<d;u+=3){let m=t.getX(u+0),M=t.getX(u+1),g=t.getX(u+2);s.fromBufferAttribute(e,m),r.fromBufferAttribute(e,M),o.fromBufferAttribute(e,g),h.subVectors(o,r),f.subVectors(s,r),h.cross(f),a.fromBufferAttribute(n,m),l.fromBufferAttribute(n,M),c.fromBufferAttribute(n,g),a.add(h),l.add(h),c.add(h),n.setXYZ(m,a.x,a.y,a.z),n.setXYZ(M,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let u=0,d=e.count;u<d;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),f.subVectors(s,r),h.cross(f),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)nn.fromBufferAttribute(t,e),nn.normalize(),t.setXYZ(e,nn.x,nn.y,nn.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,f=a.normalized,u=new c.constructor(l.length*h),d=0,m=0;for(let M=0,g=l.length;M<g;M++){a.isInterleavedBufferAttribute?d=l[M]*a.data.stride+a.offset:d=l[M]*h;for(let p=0;p<h;p++)u[m++]=c[d++]}return new sn(u,h,f)}if(this.index===null)return Qt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,f=c.length;h<f;h++){let u=c[h],d=t(u,n);l.push(d)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){let d=c[f];h.push(d.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],f=r[c];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var kc=new G,em=new G,nm=new re,cn=class{constructor(t=new G(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=kc.subVectors(n,e).cross(em.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let s=t.delta(kc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(s,o)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||nm.getNormalMatrix(t),s=this.coplanarPoint(kc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},im=0,Xi=class extends Jn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:im++}),this.uuid=wr(),this.name="",this.type="Material",this.blending=yr,this.side=ji,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=th,this.blendDst=Mr,this.blendEquation=di,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ce(0,0,0),this.blendAlpha=0,this.depthFunc=cr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Sf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Sa,this.stencilZFail=Sa,this.stencilZPass=Sa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){Qt(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Qt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new ce().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new cn().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new qt().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new qt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var Ci=new G,zc=new G,aa=new G,la=new G,qi=class{constructor(t=new G,e=new G(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ci)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Ci.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ci.copy(this.origin).addScaledVector(this.direction,e),Ci.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){zc.copy(t).add(e).multiplyScalar(.5),aa.copy(e).sub(t).normalize(),la.copy(this.origin).sub(zc);let r=t.distanceTo(e)*.5,o=-this.direction.dot(aa),a=la.dot(this.direction),l=-la.dot(aa),c=la.lengthSq(),h=Math.abs(1-o*o),f,u,d,m;if(h>0)if(f=o*l-a,u=o*a-l,m=r*h,f>=0)if(u>=-m)if(u<=m){let M=1/h;f*=M,u*=M,d=f*(f+o*u+2*a)+u*(o*f+u+2*l)+c}else u=r,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*l)+c;else u=-r,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*l)+c;else u<=-m?(f=Math.max(0,-(-o*r+a)),u=f>0?-r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c):u<=m?(f=0,u=Math.min(Math.max(-r,-l),r),d=u*(u+2*l)+c):(f=Math.max(0,-(o*r+a)),u=f>0?r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c);else u=o>0?-r:r,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(zc).addScaledVector(aa,u),d}intersectSphere(t,e){if(t.radius<0)return null;Ci.subVectors(t.center,this.origin);let n=Ci.dot(this.direction),s=Ci.dot(Ci)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),f>=0?(a=(t.min.z-u.z)*f,l=(t.max.z-u.z)*f):(a=(t.max.z-u.z)*f,l=(t.min.z-u.z)*f),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Ci)!==null}intersectTriangle(t,e,n,s,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,f=t.x-o.x,u=t.y-o.y,d=t.z-o.z,m=e.x-o.x,M=e.y-o.y,g=e.z-o.z,p=n.x-o.x,I=n.y-o.y,F=n.z-o.z,A=Math.abs(l),b=Math.abs(c),T=Math.abs(h),D,v,P,N,O,B,q,V,K,lt,at,pt;if(A>=b&&A>=T?(P=l,B=f,K=m,pt=p,l>=0?(D=c,v=h,N=u,O=d,q=M,V=g,lt=I,at=F):(D=h,v=c,N=d,O=u,q=g,V=M,lt=F,at=I)):b>=T?(P=c,B=u,K=M,pt=I,c>=0?(D=h,v=l,N=d,O=f,q=g,V=m,lt=F,at=p):(D=l,v=h,N=f,O=d,q=m,V=g,lt=p,at=F)):(P=h,B=d,K=g,pt=F,h>=0?(D=l,v=c,N=f,O=u,q=m,V=M,lt=p,at=I):(D=c,v=l,N=u,O=f,q=M,V=m,lt=I,at=p)),P===0)return null;let ot=D/P,ut=v/P,dt=1/P,$t=N-ot*B,Xt=O-ut*B,we=q-ot*K,fe=V-ut*K,ve=lt-ot*pt,W=at-ut*pt,tt=ve*fe-W*we,Mt=$t*W-Xt*ve,bt=we*Xt-fe*$t;if(s){if(tt<0||Mt<0||bt<0)return null}else if((tt<0||Mt<0||bt<0)&&(tt>0||Mt>0||bt>0))return null;let xt=tt+Mt+bt;if(xt===0)return null;let Bt=dt*(tt*B+Mt*K+bt*pt);return(xt>0?Bt<0:Bt>0)?null:this.at(Bt/xt,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},bs=class extends Xi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ce(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Gi,this.combine=eh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},ku=new Ve,_s=new qi,ca=new Ss,zu=new G,ha=new G,ua=new G,fa=new G,Vc=new G,da=new G,Vu=new G,pa=new G,Oe=class extends Dn{constructor(t=new pn,e=new bs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){da.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],f=r[l];h!==0&&(Vc.fromBufferAttribute(f,t),o?da.addScaledVector(Vc,h):da.addScaledVector(Vc.sub(e),h))}e.add(da)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ca.copy(n.boundingSphere),ca.applyMatrix4(r),_s.copy(t.ray).recast(t.near),!(ca.containsPoint(_s.origin)===!1&&(_s.intersectSphere(ca,zu)===null||_s.origin.distanceToSquared(zu)>(t.far-t.near)**2))&&(ku.copy(r).invert(),_s.copy(t.ray).applyMatrix4(ku),!(n.boundingBox!==null&&_s.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,_s)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,u=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let m=0,M=u.length;m<M;m++){let g=u[m],p=o[g.materialIndex],I=Math.max(g.start,d.start),F=Math.min(a.count,Math.min(g.start+g.count,d.start+d.count));for(let A=I,b=F;A<b;A+=3){let T=a.getX(A),D=a.getX(A+1),v=a.getX(A+2);s=ma(this,p,t,n,c,h,f,T,D,v),s&&(s.faceIndex=Math.floor(A/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let m=Math.max(0,d.start),M=Math.min(a.count,d.start+d.count);for(let g=m,p=M;g<p;g+=3){let I=a.getX(g),F=a.getX(g+1),A=a.getX(g+2);s=ma(this,o,t,n,c,h,f,I,F,A),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let m=0,M=u.length;m<M;m++){let g=u[m],p=o[g.materialIndex],I=Math.max(g.start,d.start),F=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let A=I,b=F;A<b;A+=3){let T=A,D=A+1,v=A+2;s=ma(this,p,t,n,c,h,f,T,D,v),s&&(s.faceIndex=Math.floor(A/3),s.face.materialIndex=g.materialIndex,e.push(s))}}else{let m=Math.max(0,d.start),M=Math.min(l.count,d.start+d.count);for(let g=m,p=M;g<p;g+=3){let I=g,F=g+1,A=g+2;s=ma(this,o,t,n,c,h,f,I,F,A),s&&(s.faceIndex=Math.floor(g/3),e.push(s))}}}};function sm(i,t,e,n,s,r,o,a){let l;if(t.side===Sn?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===ji,a),l===null)return null;pa.copy(a),pa.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(pa);return c<e.near||c>e.far?null:{distance:c,point:pa.clone(),object:i}}function ma(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,ha),i.getVertexPosition(l,ua),i.getVertexPosition(c,fa);let h=sm(i,t,e,n,ha,ua,fa,Vu);if(h){let f=new G;Hi.getBarycoord(Vu,ha,ua,fa,f),s&&(h.uv=Hi.getInterpolatedAttribute(s,a,l,c,f,new qt)),r&&(h.uv1=Hi.getInterpolatedAttribute(r,a,l,c,f,new qt)),o&&(h.normal=Hi.getInterpolatedAttribute(o,a,l,c,f,new G),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:l,c,normal:new G,materialIndex:0};Hi.getNormal(ha,ua,fa,u.normal),h.face=u,h.barycoord=f}return h}var Yi=class extends dn{constructor(t=null,e=1,n=1,s,r,o,a,l,c=rn,h=rn,f,u){super(null,o,a,l,c,h,s,r,f,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var io=class extends sn{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}};var vs=new Ss,rm=new qt(.5,.5),ga=new G,so=class{constructor(t=new cn,e=new cn,n=new cn,s=new cn,r=new cn,o=new cn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Kn,n=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],f=r[5],u=r[6],d=r[7],m=r[8],M=r[9],g=r[10],p=r[11],I=r[12],F=r[13],A=r[14],b=r[15];if(s[0].setComponents(c-o,d-h,p-m,b-I).normalize(),s[1].setComponents(c+o,d+h,p+m,b+I).normalize(),s[2].setComponents(c+a,d+f,p+M,b+F).normalize(),s[3].setComponents(c-a,d-f,p-M,b-F).normalize(),n)s[4].setComponents(l,u,g,A).normalize(),s[5].setComponents(c-l,d-u,p-g,b-A).normalize();else if(s[4].setComponents(c-l,d-u,p-g,b-A).normalize(),e===Kn)s[5].setComponents(c+l,d+u,p+g,b+A).normalize();else if(e===jr)s[5].setComponents(l,u,g,A).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),vs.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),vs.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(vs)}intersectsSprite(t){vs.center.set(0,0,0);let e=rm.distanceTo(t.center);return vs.radius=.7071067811865476+e,vs.applyMatrix4(t.matrixWorld),this.intersectsSphere(vs)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(ga.x=s.normal.x>0?t.max.x:t.min.x,ga.y=s.normal.y>0?t.max.y:t.min.y,ga.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ga)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Oa=class extends Xi{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ce(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Hu=new Ve,Yc=new qi,xa=new Ss,_a=new G,ro=class extends Dn{constructor(t=new pn,e=new Oa){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),xa.copy(n.boundingSphere),xa.applyMatrix4(s),xa.radius+=r,t.ray.intersectsSphere(xa)===!1)return;Hu.copy(s).invert(),Yc.copy(t.ray).applyMatrix4(Hu);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,f=n.attributes.position;if(c!==null){let u=Math.max(0,o.start),d=Math.min(c.count,o.start+o.count);for(let m=u,M=d;m<M;m++){let g=c.getX(m);_a.fromBufferAttribute(f,g),Gu(_a,g,l,s,t,e,this)}}else{let u=Math.max(0,o.start),d=Math.min(f.count,o.start+o.count);for(let m=u,M=d;m<M;m++)_a.fromBufferAttribute(f,m),Gu(_a,m,l,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Gu(i,t,e,n,s,r,o){let a=Yc.distanceSqToPoint(i);if(a<e){let l=new G;Yc.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var oo=class extends dn{constructor(t=[],e=Qi,n,s,r,o,a,l,c,h){super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},ao=class extends dn{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var $i=class extends dn{constructor(t,e,n=ti,s,r,o,a=rn,l=rn,c,h=hi,f=1){if(h!==hi&&h!==es)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:f};super(u,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new dr(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Ba=class extends $i{constructor(t,e=ti,n=Qi,s,r,o=rn,a=rn,l,c=hi){let h={width:t,height:t,depth:1},f=[h,h,h,h,h,h];super(t,t,e,n,s,r,o,a,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},lo=class extends dn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},gr=class i extends pn{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],f=[],u=0,d=0;m("z","y","x",-1,-1,n,e,t,o,r,0),m("z","y","x",1,-1,n,e,-t,o,r,1),m("x","z","y",1,1,t,n,e,s,o,2),m("x","z","y",1,-1,t,n,-e,s,o,3),m("x","y","z",1,-1,t,e,n,s,r,4),m("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Mn(c,3)),this.setAttribute("normal",new Mn(h,3)),this.setAttribute("uv",new Mn(f,2));function m(M,g,p,I,F,A,b,T,D,v,P){let N=A/D,O=b/v,B=A/2,q=b/2,V=T/2,K=D+1,lt=v+1,at=0,pt=0,ot=new G;for(let ut=0;ut<lt;ut++){let dt=ut*O-q;for(let $t=0;$t<K;$t++){let Xt=$t*N-B;ot[M]=Xt*I,ot[g]=dt*F,ot[p]=V,c.push(ot.x,ot.y,ot.z),ot[M]=0,ot[g]=0,ot[p]=T>0?1:-1,h.push(ot.x,ot.y,ot.z),f.push($t/D),f.push(1-ut/v),at+=1}}for(let ut=0;ut<v;ut++)for(let dt=0;dt<D;dt++){let $t=u+dt+K*ut,Xt=u+dt+K*(ut+1),we=u+(dt+1)+K*(ut+1),fe=u+(dt+1)+K*ut;l.push($t,Xt,fe),l.push(Xt,we,fe),pt+=6}a.addGroup(d,pt,P),d+=pt,u+=at}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var Pi=class i extends pn{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,f=t/a,u=e/l,d=[],m=[],M=[],g=[];for(let p=0;p<h;p++){let I=p*u-o;for(let F=0;F<c;F++){let A=F*f-r;m.push(A,-I,0),M.push(0,0,1),g.push(F/a),g.push(1-p/l)}}for(let p=0;p<l;p++)for(let I=0;I<a;I++){let F=I+c*p,A=I+c*(p+1),b=I+1+c*(p+1),T=I+1+c*p;d.push(F,A,T),d.push(A,b,T)}this.setIndex(d),this.setAttribute("position",new Mn(m,3)),this.setAttribute("normal",new Mn(M,3)),this.setAttribute("uv",new Mn(g,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};function Rs(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];if(Wu(s))s.isRenderTargetTexture?(Qt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(Wu(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function gn(i){let t={};for(let e=0;e<i.length;e++){let n=Rs(i[e]);for(let s in n)t[s]=n[s]}return t}function Wu(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function om(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function gh(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:pe.workingColorSpace}var Li={clone:Rs,merge:gn},am=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,lm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Be=class extends Xi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=am,this.fragmentShader=lm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Rs(t.uniforms),this.uniformsGroups=om(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new ce().setHex(s.value);break;case"v2":this.uniforms[n].value=new qt().fromArray(s.value);break;case"v3":this.uniforms[n].value=new G().fromArray(s.value);break;case"v4":this.uniforms[n].value=new He().fromArray(s.value);break;case"m3":this.uniforms[n].value=new re().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Ve().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},xr=class extends Be{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var ka=class extends Xi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=yf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},za=class extends Xi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function ir(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function Hc(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var Zi=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Va=class extends Zi{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Wc,endingEnd:Wc}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Xc:r=t,a=2*e-n;break;case qc:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Xc:o=t,l=2*n-e;break;case qc:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,f=this._offsetNext,u=this._weightPrev,d=this._weightNext,m=(n-e)/(s-e),M=m*m,g=M*m,p=-u*g+2*u*M-u*m,I=(1+u)*g+(-1.5-2*u)*M+(-.5+u)*m+1,F=(-1-d)*g+(1.5+d)*M+.5*m,A=d*g-d*M;for(let b=0;b!==a;++b)r[b]=p*o[h+b]+I*o[c+b]+F*o[l+b]+A*o[f+b];return r}},Ha=class extends Zi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(s-e),f=1-h;for(let u=0;u!==a;++u)r[u]=o[c+u]*f+o[l+u]*h;return r}},Ga=class extends Zi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},Wa=class extends Zi{interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this.inTangents,f=this.outTangents;if(!h||!f){let m=(n-e)/(s-e),M=1-m;for(let g=0;g!==a;++g)r[g]=o[c+g]*M+o[l+g]*m;return r}let u=a*2,d=t-1;for(let m=0;m!==a;++m){let M=o[c+m],g=o[l+m],p=d*u+m*2,I=f[p],F=f[p+1],A=t*u+m*2,b=h[A],T=h[A+1],D=hm(n,e,I,b,s);r[m]=Uf(D,M,F,T,g)}return r}};function Uf(i,t,e,n,s){let r=1-i;return r*r*r*t+3*r*r*i*e+3*r*i*i*n+i*i*i*s}function cm(i,t,e,n,s){let r=1-i;return 3*r*r*(e-t)+6*r*i*(n-e)+3*i*i*(s-n)}function hm(i,t,e,n,s){let r=(i-t)/(s-t);for(let o=0;o<8;o++){let a=Uf(r,t,e,n,s)-i;if(Math.abs(a)<1e-10)break;let l=cm(r,t,e,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var Nn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=ir(e,this.TimeBufferType),this.values=ir(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:ir(t.times,Array),values:ir(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s),Hc(t.settings)&&(n.settings={inTangents:ir(t.settings.inTangents,Array),outTangents:ir(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Ga(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Ha(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Va(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new Wa(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Zr:e=this.InterpolantFactoryMethodDiscrete;break;case Da:e=this.InterpolantFactoryMethodLinear;break;case Ma:e=this.InterpolantFactoryMethodSmooth;break;case Gc:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return Qt("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Zr;case this.InterpolantFactoryMethodLinear:return Da;case this.InterpolantFactoryMethodSmooth:return Ma;case this.InterpolantFactoryMethodBezier:return Gc}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t;Hc(this.settings)&&(Xu(this.settings.inTangents,t),Xu(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(te("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(te("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){te("KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){te("KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&Tp(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){te("KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Ma,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let f=a*n,u=f-n,d=f+n;for(let m=0;m!==n;++m){let M=e[f+m];if(M!==e[u+m]||M!==e[d+m]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let f=a*n,u=o*n;for(let d=0;d!==n;++d)e[u+d]=e[f+d]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,Hc(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Xu(i,t){for(let e=0,n=i.length;e!==n;e+=2)i[e]*=t}Nn.prototype.ValueTypeName="";Nn.prototype.TimeBufferType=Float32Array;Nn.prototype.ValueBufferType=Float32Array;Nn.prototype.DefaultInterpolation=Da;var Ki=class extends Nn{constructor(t,e,n){super(t,e,n)}};Ki.prototype.ValueTypeName="bool";Ki.prototype.ValueBufferType=Array;Ki.prototype.DefaultInterpolation=Zr;Ki.prototype.InterpolantFactoryMethodLinear=void 0;Ki.prototype.InterpolantFactoryMethodSmooth=void 0;var Xa=class extends Nn{constructor(t,e,n,s){super(t,e,n,s)}};Xa.prototype.ValueTypeName="color";var qa=class extends Nn{constructor(t,e,n,s){super(t,e,n,s)}};qa.prototype.ValueTypeName="number";var Ya=class extends Zi{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)Ln.slerpFlat(r,0,o,c-a,o,c,l);return r}},co=class extends Nn{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new Ya(this.times,this.values,this.getValueSize(),t)}};co.prototype.ValueTypeName="quaternion";co.prototype.InterpolantFactoryMethodSmooth=void 0;var Ji=class extends Nn{constructor(t,e,n){super(t,e,n)}};Ji.prototype.ValueTypeName="string";Ji.prototype.ValueBufferType=Array;Ji.prototype.DefaultInterpolation=Zr;Ji.prototype.InterpolantFactoryMethodLinear=void 0;Ji.prototype.InterpolantFactoryMethodSmooth=void 0;var $a=class extends Nn{constructor(t,e,n,s){super(t,e,n,s)}};$a.prototype.ValueTypeName="vector";var ba={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(qu(i)||(this.files[i]=t))},get:function(i){if(this.enabled!==!1&&!qu(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function qu(i){try{let t=i.slice(i.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch{return!1}}var Za=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,f){return c.push(h,f),this},this.removeHandler=function(h){let f=c.indexOf(h);return f!==-1&&c.splice(f,2),this},this.getHandler=function(h){for(let f=0,u=c.length;f<u;f+=2){let d=c[f],m=c[f+1];if(d.global&&(d.lastIndex=0),d.test(h))return m}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Ff=new Za,_r=class{constructor(t){this.manager=t!==void 0?t:Ff,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};_r.DEFAULT_MATERIAL_NAME="__DEFAULT";var sr=new WeakMap,Ka=class extends _r{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=ba.get(`image:${t}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0);else{let f=sr.get(o);f===void 0&&(f=[],sr.set(o,f)),f.push({onLoad:e,onError:s})}return o}let a=hr("img");function l(){h(),e&&e(this);let f=sr.get(this)||[];for(let u=0;u<f.length;u++){let d=f[u];d.onLoad&&d.onLoad(this)}sr.delete(this),r.manager.itemEnd(t)}function c(f){h(),s&&s(f),ba.remove(`image:${t}`);let u=sr.get(this)||[];for(let d=0;d<u.length;d++){let m=u[d];m.onError&&m.onError(f)}sr.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),ba.add(`image:${t}`,a),r.manager.itemStart(t),a.src=t,a}};var ho=class extends _r{constructor(t){super(t)}load(t,e,n,s){let r=new dn,o=new Ka(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}};var va=new G,ya=new Ln,li=new G,uo=class extends Dn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ve,this.projectionMatrix=new Ve,this.projectionMatrixInverse=new Ve,this.coordinateSystem=Kn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(va,ya,li),li.x===1&&li.y===1&&li.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(va,ya,li.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(va,ya,li),li.x===1&&li.y===1&&li.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(va,ya,li.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Vi=new G,Yu=new qt,$u=new qt,hn=class extends uo{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=fr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Yr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return fr*2*Math.atan(Math.tan(Yr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Vi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Vi.x,Vi.y).multiplyScalar(-t/Vi.z),Vi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Vi.x,Vi.y).multiplyScalar(-t/Vi.z)}getViewSize(t,e){return this.getViewBounds(t,Yu,$u),e.subVectors($u,Yu)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Yr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var ws=class extends uo{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}};var fo=class extends pn{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){let t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}};var rr=-90,or=1,Ja=class extends Dn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new hn(rr,or,t,e);s.layers=this.layers,this.add(s);let r=new hn(rr,or,t,e);r.layers=this.layers,this.add(r);let o=new hn(rr,or,t,e);o.layers=this.layers,this.add(o);let a=new hn(rr,or,t,e);a.layers=this.layers,this.add(a);let l=new hn(rr,or,t,e);l.layers=this.layers,this.add(l);let c=new hn(rr,or,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===Kn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===jr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),m=t.xr.enabled;t.xr.enabled=!1;let M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;t.isWebGLRenderer===!0?g=t.state.buffers.depth.getReversed():g=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=M,t.setRenderTarget(n,5,s),g&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(f,u,d),t.xr.enabled=m,n.texture.needsPMREMUpdate=!0}},ja=class extends hn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}},po=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=um.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function um(){this._document.hidden===!1&&this.reset()}var xh="\\[\\]\\.:\\/",fm=new RegExp("["+xh+"]","g"),_h="[^"+xh+"]",dm="[^"+xh.replace("\\.","")+"]",pm=/((?:WC+[\/:])*)/.source.replace("WC",_h),mm=/(WCOD+)?/.source.replace("WCOD",dm),gm=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",_h),xm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",_h),_m=new RegExp("^"+pm+mm+gm+xm+"$"),vm=["material","materials","bones","map"],$c=class{constructor(t,e,n){let s=n||Fe.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Fe=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(fm,"")}static parseTrackName(t){let e=_m.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);vm.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Qt("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){te("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){te("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){te("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){te("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){te("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){te("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){te("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;te("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){te("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){te("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Fe.Composite=$c;Fe.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Fe.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Fe.prototype.GetterByBindingType=[Fe.prototype._getValue_direct,Fe.prototype._getValue_array,Fe.prototype._getValue_arrayElement,Fe.prototype._getValue_toArray];Fe.prototype.SetterByBindingTypeAndVersioning=[[Fe.prototype._setValue_direct,Fe.prototype._setValue_direct_setNeedsUpdate,Fe.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Fe.prototype._setValue_array,Fe.prototype._setValue_array_setNeedsUpdate,Fe.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Fe.prototype._setValue_arrayElement,Fe.prototype._setValue_arrayElement_setNeedsUpdate,Fe.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Fe.prototype._setValue_fromArray,Fe.prototype._setValue_fromArray_setNeedsUpdate,Fe.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var mM=new Float32Array(1);var Zu=new Ve,Ts=class{constructor(t,e,n=0,s=1/0){this.ray=new qi(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new pr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):te("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Zu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Zu),this}intersectObject(t,e=!0,n=[]){return Zc(t,this,n,e),n.sort(Ku),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Zc(t[s],this,n,e);return n.sort(Ku),n}};function Ku(i,t){return i.distance-t.distance}function Zc(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)Zc(r[o],t,e,!0)}}var ui=class{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=me(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(me(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var wh=class wh{constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}};wh.prototype.isMatrix2=!0;var Kc=wh;var mo=class extends Jn{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function vh(i,t,e,n){let s=ym(n);switch(e){case ah:return i*t;case ch:return i*t/s.components*s.byteLength;case ol:return i*t/s.components*s.byteLength;case ns:return i*t*2/s.components*s.byteLength;case al:return i*t*2/s.components*s.byteLength;case lh:return i*t*3/s.components*s.byteLength;case mn:return i*t*4/s.components*s.byteLength;case ll:return i*t*4/s.components*s.byteLength;case Eo:case Co:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ro:case Po:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case hl:case fl:return Math.max(i,16)*Math.max(t,8)/4;case cl:case ul:return Math.max(i,8)*Math.max(t,8)/2;case dl:case pl:case gl:case xl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case ml:case Io:case _l:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case vl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case yl:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Ml:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Sl:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case bl:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case wl:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Tl:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Al:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case El:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Cl:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Rl:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Pl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Il:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Ll:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Dl:case Nl:case Ul:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Fl:case Ol:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Lo:case Bl:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function ym(i){switch(i){case Un:case ih:return{byteLength:1,components:1};case Sr:case sh:case Ke:return{byteLength:2,components:1};case sl:case rl:return{byteLength:2,components:4};case ti:case il:case ei:return{byteLength:4,components:1};case rh:case oh:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Qt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function sd(){let i=null,t=!1,e=null,n=null;function s(r,o){n=i.requestAnimationFrame(s),e(r,o)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Sm(i){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,f=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),a.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:f}}function n(a,l,c){let h=l.array,f=l.updateRanges;if(i.bindBuffer(c,a),f.length===0)i.bufferSubData(c,0,h);else{f.sort((d,m)=>d.start-m.start);let u=0;for(let d=1;d<f.length;d++){let m=f[u],M=f[d];M.start<=m.start+m.count+1?m.count=Math.max(m.count,M.start+M.count-m.start):(++u,f[u]=M)}f.length=u+1;for(let d=0,m=f.length;d<m;d++){let M=f[d];i.bufferSubData(c,M.start*h.BYTES_PER_ELEMENT,h,M.start,M.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var bm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,wm=`#ifdef USE_ALPHAHASH
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
#endif`,Tm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Am=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Em=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Cm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Rm=`#ifdef USE_AOMAP
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
#endif`,Pm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Im=`#ifdef USE_BATCHING
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
#endif`,Lm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Dm=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Nm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Um=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Fm=`#ifdef USE_IRIDESCENCE
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
#endif`,Om=`#ifdef USE_BUMPMAP
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
#endif`,Bm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,km=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,zm=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Vm=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Hm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Gm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Wm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Xm=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,qm=`#define PI 3.141592653589793
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
} // validated`,Ym=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,$m=`vec3 transformedNormal = objectNormal;
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
#endif`,Zm=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Km=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Jm=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,jm=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Qm="gl_FragColor = linearToOutputTexel( gl_FragColor );",t0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,e0=`#ifdef USE_ENVMAP
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
#endif`,n0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,i0=`#ifdef USE_ENVMAP
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
#endif`,s0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,r0=`#ifdef USE_ENVMAP
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
#endif`,o0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,a0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,l0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,c0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,h0=`#ifdef USE_GRADIENTMAP
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
}`,u0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,f0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,d0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,p0=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,m0=`#ifdef USE_ENVMAP
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
#endif`,g0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,x0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,_0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,v0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,y0=`PhysicalMaterial material;
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
#endif`,M0=`uniform sampler2D dfgLUT;
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
}`,S0=`
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
#endif`,b0=`#if defined( RE_IndirectDiffuse )
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
#endif`,w0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,T0=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,A0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,E0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,C0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,R0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,P0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,I0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,L0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,D0=`#if defined( USE_POINTS_UV )
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
#endif`,N0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,U0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,F0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,O0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,B0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,k0=`#ifdef USE_MORPHTARGETS
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
#endif`,z0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,V0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,H0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,G0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,W0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,X0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,q0=`#ifdef USE_NORMALMAP
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
#endif`,Y0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,$0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Z0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,K0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,J0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,j0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Q0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,tg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,eg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ng=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ig=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,sg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,rg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,og=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,ag=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,lg=`float getShadowMask() {
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
}`,cg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,hg=`#ifdef USE_SKINNING
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
#endif`,ug=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,fg=`#ifdef USE_SKINNING
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
#endif`,dg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,pg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,mg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,gg=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,xg=`#ifdef USE_TRANSMISSION
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
#endif`,_g=`#ifdef USE_TRANSMISSION
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
#endif`,vg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,yg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Mg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Sg=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,bg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,wg=`uniform sampler2D t2D;
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
}`,Tg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ag=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Eg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Cg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Rg=`#include <common>
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
}`,Pg=`#if DEPTH_PACKING == 3200
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
}`,Ig=`#define DISTANCE
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
}`,Lg=`#define DISTANCE
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
}`,Dg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ng=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ug=`uniform float scale;
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
}`,Fg=`uniform vec3 diffuse;
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
}`,Og=`#include <common>
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
}`,Bg=`uniform vec3 diffuse;
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
}`,kg=`#define LAMBERT
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
}`,zg=`#define LAMBERT
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
}`,Vg=`#define MATCAP
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
}`,Hg=`#define MATCAP
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
}`,Gg=`#define NORMAL
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
}`,Wg=`#define NORMAL
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
}`,Xg=`#define PHONG
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
}`,qg=`#define PHONG
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
}`,Yg=`#define STANDARD
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
}`,$g=`#define STANDARD
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
}`,Zg=`#define TOON
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
}`,Kg=`#define TOON
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
}`,Jg=`uniform float size;
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
}`,jg=`uniform vec3 diffuse;
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
}`,Qg=`#include <common>
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
}`,tx=`uniform vec3 color;
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
}`,ex=`uniform float rotation;
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
}`,nx=`uniform vec3 diffuse;
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
}`,ue={alphahash_fragment:bm,alphahash_pars_fragment:wm,alphamap_fragment:Tm,alphamap_pars_fragment:Am,alphatest_fragment:Em,alphatest_pars_fragment:Cm,aomap_fragment:Rm,aomap_pars_fragment:Pm,batching_pars_vertex:Im,batching_vertex:Lm,begin_vertex:Dm,beginnormal_vertex:Nm,bsdfs:Um,iridescence_fragment:Fm,bumpmap_pars_fragment:Om,clipping_planes_fragment:Bm,clipping_planes_pars_fragment:km,clipping_planes_pars_vertex:zm,clipping_planes_vertex:Vm,color_fragment:Hm,color_pars_fragment:Gm,color_pars_vertex:Wm,color_vertex:Xm,common:qm,cube_uv_reflection_fragment:Ym,defaultnormal_vertex:$m,displacementmap_pars_vertex:Zm,displacementmap_vertex:Km,emissivemap_fragment:Jm,emissivemap_pars_fragment:jm,colorspace_fragment:Qm,colorspace_pars_fragment:t0,envmap_fragment:e0,envmap_common_pars_fragment:n0,envmap_pars_fragment:i0,envmap_pars_vertex:s0,envmap_physical_pars_fragment:m0,envmap_vertex:r0,fog_vertex:o0,fog_pars_vertex:a0,fog_fragment:l0,fog_pars_fragment:c0,gradientmap_pars_fragment:h0,lightmap_pars_fragment:u0,lights_lambert_fragment:f0,lights_lambert_pars_fragment:d0,lights_pars_begin:p0,lights_toon_fragment:g0,lights_toon_pars_fragment:x0,lights_phong_fragment:_0,lights_phong_pars_fragment:v0,lights_physical_fragment:y0,lights_physical_pars_fragment:M0,lights_fragment_begin:S0,lights_fragment_maps:b0,lights_fragment_end:w0,lightprobes_pars_fragment:T0,logdepthbuf_fragment:A0,logdepthbuf_pars_fragment:E0,logdepthbuf_pars_vertex:C0,logdepthbuf_vertex:R0,map_fragment:P0,map_pars_fragment:I0,map_particle_fragment:L0,map_particle_pars_fragment:D0,metalnessmap_fragment:N0,metalnessmap_pars_fragment:U0,morphinstance_vertex:F0,morphcolor_vertex:O0,morphnormal_vertex:B0,morphtarget_pars_vertex:k0,morphtarget_vertex:z0,normal_fragment_begin:V0,normal_fragment_maps:H0,normal_pars_fragment:G0,normal_pars_vertex:W0,normal_vertex:X0,normalmap_pars_fragment:q0,clearcoat_normal_fragment_begin:Y0,clearcoat_normal_fragment_maps:$0,clearcoat_pars_fragment:Z0,iridescence_pars_fragment:K0,opaque_fragment:J0,packing:j0,premultiplied_alpha_fragment:Q0,project_vertex:tg,dithering_fragment:eg,dithering_pars_fragment:ng,roughnessmap_fragment:ig,roughnessmap_pars_fragment:sg,shadowmap_pars_fragment:rg,shadowmap_pars_vertex:og,shadowmap_vertex:ag,shadowmask_pars_fragment:lg,skinbase_vertex:cg,skinning_pars_vertex:hg,skinning_vertex:ug,skinnormal_vertex:fg,specularmap_fragment:dg,specularmap_pars_fragment:pg,tonemapping_fragment:mg,tonemapping_pars_fragment:gg,transmission_fragment:xg,transmission_pars_fragment:_g,uv_pars_fragment:vg,uv_pars_vertex:yg,uv_vertex:Mg,worldpos_vertex:Sg,background_vert:bg,background_frag:wg,backgroundCube_vert:Tg,backgroundCube_frag:Ag,cube_vert:Eg,cube_frag:Cg,depth_vert:Rg,depth_frag:Pg,distance_vert:Ig,distance_frag:Lg,equirect_vert:Dg,equirect_frag:Ng,linedashed_vert:Ug,linedashed_frag:Fg,meshbasic_vert:Og,meshbasic_frag:Bg,meshlambert_vert:kg,meshlambert_frag:zg,meshmatcap_vert:Vg,meshmatcap_frag:Hg,meshnormal_vert:Gg,meshnormal_frag:Wg,meshphong_vert:Xg,meshphong_frag:qg,meshphysical_vert:Yg,meshphysical_frag:$g,meshtoon_vert:Zg,meshtoon_frag:Kg,points_vert:Jg,points_frag:jg,shadow_vert:Qg,shadow_frag:tx,sprite_vert:ex,sprite_frag:nx},Dt={common:{diffuse:{value:new ce(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new re},alphaMap:{value:null},alphaMapTransform:{value:new re},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new re}},envmap:{envMap:{value:null},envMapRotation:{value:new re},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new re}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new re}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new re},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new re},normalScale:{value:new qt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new re},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new re}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new re}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new re}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ce(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new G},probesMax:{value:new G},probesResolution:{value:new G}},points:{diffuse:{value:new ce(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new re},alphaTest:{value:0},uvTransform:{value:new re}},sprite:{diffuse:{value:new ce(16777215)},opacity:{value:1},center:{value:new qt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new re},alphaMap:{value:null},alphaMapTransform:{value:new re},alphaTest:{value:0}}},mi={basic:{uniforms:gn([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.fog]),vertexShader:ue.meshbasic_vert,fragmentShader:ue.meshbasic_frag},lambert:{uniforms:gn([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,Dt.lights,{emissive:{value:new ce(0)},envMapIntensity:{value:1}}]),vertexShader:ue.meshlambert_vert,fragmentShader:ue.meshlambert_frag},phong:{uniforms:gn([Dt.common,Dt.specularmap,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,Dt.lights,{emissive:{value:new ce(0)},specular:{value:new ce(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ue.meshphong_vert,fragmentShader:ue.meshphong_frag},standard:{uniforms:gn([Dt.common,Dt.envmap,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.roughnessmap,Dt.metalnessmap,Dt.fog,Dt.lights,{emissive:{value:new ce(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ue.meshphysical_vert,fragmentShader:ue.meshphysical_frag},toon:{uniforms:gn([Dt.common,Dt.aomap,Dt.lightmap,Dt.emissivemap,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.gradientmap,Dt.fog,Dt.lights,{emissive:{value:new ce(0)}}]),vertexShader:ue.meshtoon_vert,fragmentShader:ue.meshtoon_frag},matcap:{uniforms:gn([Dt.common,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,Dt.fog,{matcap:{value:null}}]),vertexShader:ue.meshmatcap_vert,fragmentShader:ue.meshmatcap_frag},points:{uniforms:gn([Dt.points,Dt.fog]),vertexShader:ue.points_vert,fragmentShader:ue.points_frag},dashed:{uniforms:gn([Dt.common,Dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ue.linedashed_vert,fragmentShader:ue.linedashed_frag},depth:{uniforms:gn([Dt.common,Dt.displacementmap]),vertexShader:ue.depth_vert,fragmentShader:ue.depth_frag},normal:{uniforms:gn([Dt.common,Dt.bumpmap,Dt.normalmap,Dt.displacementmap,{opacity:{value:1}}]),vertexShader:ue.meshnormal_vert,fragmentShader:ue.meshnormal_frag},sprite:{uniforms:gn([Dt.sprite,Dt.fog]),vertexShader:ue.sprite_vert,fragmentShader:ue.sprite_frag},background:{uniforms:{uvTransform:{value:new re},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ue.background_vert,fragmentShader:ue.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new re}},vertexShader:ue.backgroundCube_vert,fragmentShader:ue.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ue.cube_vert,fragmentShader:ue.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ue.equirect_vert,fragmentShader:ue.equirect_frag},distance:{uniforms:gn([Dt.common,Dt.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ue.distance_vert,fragmentShader:ue.distance_frag},shadow:{uniforms:gn([Dt.lights,Dt.fog,{color:{value:new ce(0)},opacity:{value:1}}]),vertexShader:ue.shadow_vert,fragmentShader:ue.shadow_frag}};mi.physical={uniforms:gn([mi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new re},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new re},clearcoatNormalScale:{value:new qt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new re},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new re},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new re},sheen:{value:0},sheenColor:{value:new ce(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new re},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new re},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new re},transmissionSamplerSize:{value:new qt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new re},attenuationDistance:{value:0},attenuationColor:{value:new ce(0)},specularColor:{value:new ce(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new re},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new re},anisotropyVector:{value:new qt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new re}}]),vertexShader:ue.meshphysical_vert,fragmentShader:ue.meshphysical_frag};var Vl={r:0,b:0,g:0},ix=new Ve,rd=new re;rd.set(-1,0,0,0,1,0,0,0,1);function sx(i,t,e,n,s,r){let o=new ce(0),a=s===!0?0:1,l,c,h=null,f=0,u=null;function d(I){let F=I.isScene===!0?I.background:null;if(F&&F.isTexture){let A=I.backgroundBlurriness>0;F=t.get(F,A)}return F}function m(I){let F=!1,A=d(I);A===null?g(o,a):A&&A.isColor&&(g(A,1),F=!0);let b=i.xr.getEnvironmentBlendMode();b==="additive"?e.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||F)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function M(I,F){let A=d(F);A&&(A.isCubeTexture||A.mapping===To)?(c===void 0&&(c=new Oe(new gr(1,1,1),new Be({name:"BackgroundCubeMaterial",uniforms:Rs(mi.backgroundCube.uniforms),vertexShader:mi.backgroundCube.vertexShader,fragmentShader:mi.backgroundCube.fragmentShader,side:Sn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,T,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=A,c.material.uniforms.backgroundBlurriness.value=F.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=F.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(ix.makeRotationFromEuler(F.backgroundRotation)).transpose(),A.isCubeTexture&&A.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(rd),c.material.toneMapped=pe.getTransfer(A.colorSpace)!==be,(h!==A||f!==A.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=A,f=A.version,u=i.toneMapping),c.layers.enableAll(),I.unshift(c,c.geometry,c.material,0,0,null)):A&&A.isTexture&&(l===void 0&&(l=new Oe(new Pi(2,2),new Be({name:"BackgroundMaterial",uniforms:Rs(mi.background.uniforms),vertexShader:mi.background.vertexShader,fragmentShader:mi.background.fragmentShader,side:ji,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=A,l.material.uniforms.backgroundIntensity.value=F.backgroundIntensity,l.material.toneMapped=pe.getTransfer(A.colorSpace)!==be,A.matrixAutoUpdate===!0&&A.updateMatrix(),l.material.uniforms.uvTransform.value.copy(A.matrix),(h!==A||f!==A.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=A,f=A.version,u=i.toneMapping),l.layers.enableAll(),I.unshift(l,l.geometry,l.material,0,0,null))}function g(I,F){I.getRGB(Vl,gh(i)),e.buffers.color.setClear(Vl.r,Vl.g,Vl.b,F,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(I,F=1){o.set(I),a=F,g(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(I){a=I,g(o,a)},render:m,addToRenderList:M,dispose:p}}function rx(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null),r=s,o=!1;function a(O,B,q,V,K){let lt=!1,at=f(O,V,q,B);r!==at&&(r=at,c(r.object)),lt=d(O,V,q,K),lt&&m(O,V,q,K),K!==null&&t.update(K,i.ELEMENT_ARRAY_BUFFER),(lt||o)&&(o=!1,A(O,B,q,V),K!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(K).buffer))}function l(){return i.createVertexArray()}function c(O){return i.bindVertexArray(O)}function h(O){return i.deleteVertexArray(O)}function f(O,B,q,V){let K=V.wireframe===!0,lt=n[B.id];lt===void 0&&(lt={},n[B.id]=lt);let at=O.isInstancedMesh===!0?O.id:0,pt=lt[at];pt===void 0&&(pt={},lt[at]=pt);let ot=pt[q.id];ot===void 0&&(ot={},pt[q.id]=ot);let ut=ot[K];return ut===void 0&&(ut=u(l()),ot[K]=ut),ut}function u(O){let B=[],q=[],V=[];for(let K=0;K<e;K++)B[K]=0,q[K]=0,V[K]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:B,enabledAttributes:q,attributeDivisors:V,object:O,attributes:{},index:null}}function d(O,B,q,V){let K=r.attributes,lt=B.attributes,at=0,pt=q.getAttributes();for(let ot in pt)if(pt[ot].location>=0){let dt=K[ot],$t=lt[ot];if($t===void 0&&(ot==="instanceMatrix"&&O.instanceMatrix&&($t=O.instanceMatrix),ot==="instanceColor"&&O.instanceColor&&($t=O.instanceColor)),dt===void 0||dt.attribute!==$t||$t&&dt.data!==$t.data)return!0;at++}return r.attributesNum!==at||r.index!==V}function m(O,B,q,V){let K={},lt=B.attributes,at=0,pt=q.getAttributes();for(let ot in pt)if(pt[ot].location>=0){let dt=lt[ot];dt===void 0&&(ot==="instanceMatrix"&&O.instanceMatrix&&(dt=O.instanceMatrix),ot==="instanceColor"&&O.instanceColor&&(dt=O.instanceColor));let $t={};$t.attribute=dt,dt&&dt.data&&($t.data=dt.data),K[ot]=$t,at++}r.attributes=K,r.attributesNum=at,r.index=V}function M(){let O=r.newAttributes;for(let B=0,q=O.length;B<q;B++)O[B]=0}function g(O){p(O,0)}function p(O,B){let q=r.newAttributes,V=r.enabledAttributes,K=r.attributeDivisors;q[O]=1,V[O]===0&&(i.enableVertexAttribArray(O),V[O]=1),K[O]!==B&&(i.vertexAttribDivisor(O,B),K[O]=B)}function I(){let O=r.newAttributes,B=r.enabledAttributes;for(let q=0,V=B.length;q<V;q++)B[q]!==O[q]&&(i.disableVertexAttribArray(q),B[q]=0)}function F(O,B,q,V,K,lt,at){at===!0?i.vertexAttribIPointer(O,B,q,K,lt):i.vertexAttribPointer(O,B,q,V,K,lt)}function A(O,B,q,V){M();let K=V.attributes,lt=q.getAttributes(),at=B.defaultAttributeValues;for(let pt in lt){let ot=lt[pt];if(ot.location>=0){let ut=K[pt];if(ut===void 0&&(pt==="instanceMatrix"&&O.instanceMatrix&&(ut=O.instanceMatrix),pt==="instanceColor"&&O.instanceColor&&(ut=O.instanceColor)),ut!==void 0){let dt=ut.normalized,$t=ut.itemSize,Xt=t.get(ut);if(Xt===void 0)continue;let we=Xt.buffer,fe=Xt.type,ve=Xt.bytesPerElement,W=fe===i.INT||fe===i.UNSIGNED_INT||ut.gpuType===il;if(ut.isInterleavedBufferAttribute){let tt=ut.data,Mt=tt.stride,bt=ut.offset;if(tt.isInstancedInterleavedBuffer){for(let xt=0;xt<ot.locationSize;xt++)p(ot.location+xt,tt.meshPerAttribute);O.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let xt=0;xt<ot.locationSize;xt++)g(ot.location+xt);i.bindBuffer(i.ARRAY_BUFFER,we);for(let xt=0;xt<ot.locationSize;xt++)F(ot.location+xt,$t/ot.locationSize,fe,dt,Mt*ve,(bt+$t/ot.locationSize*xt)*ve,W)}else{if(ut.isInstancedBufferAttribute){for(let tt=0;tt<ot.locationSize;tt++)p(ot.location+tt,ut.meshPerAttribute);O.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=ut.meshPerAttribute*ut.count)}else for(let tt=0;tt<ot.locationSize;tt++)g(ot.location+tt);i.bindBuffer(i.ARRAY_BUFFER,we);for(let tt=0;tt<ot.locationSize;tt++)F(ot.location+tt,$t/ot.locationSize,fe,dt,$t*ve,$t/ot.locationSize*tt*ve,W)}}else if(at!==void 0){let dt=at[pt];if(dt!==void 0)switch(dt.length){case 2:i.vertexAttrib2fv(ot.location,dt);break;case 3:i.vertexAttrib3fv(ot.location,dt);break;case 4:i.vertexAttrib4fv(ot.location,dt);break;default:i.vertexAttrib1fv(ot.location,dt)}}}}I()}function b(){P();for(let O in n){let B=n[O];for(let q in B){let V=B[q];for(let K in V){let lt=V[K];for(let at in lt)h(lt[at].object),delete lt[at];delete V[K]}}delete n[O]}}function T(O){if(n[O.id]===void 0)return;let B=n[O.id];for(let q in B){let V=B[q];for(let K in V){let lt=V[K];for(let at in lt)h(lt[at].object),delete lt[at];delete V[K]}}delete n[O.id]}function D(O){for(let B in n){let q=n[B];for(let V in q){let K=q[V];if(K[O.id]===void 0)continue;let lt=K[O.id];for(let at in lt)h(lt[at].object),delete lt[at];delete K[O.id]}}}function v(O){for(let B in n){let q=n[B],V=O.isInstancedMesh===!0?O.id:0,K=q[V];if(K!==void 0){for(let lt in K){let at=K[lt];for(let pt in at)h(at[pt].object),delete at[pt];delete K[lt]}delete q[V],Object.keys(q).length===0&&delete n[B]}}}function P(){N(),o=!0,r!==s&&(r=s,c(r.object))}function N(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:P,resetDefaultState:N,dispose:b,releaseStatesOfGeometry:T,releaseStatesOfObject:v,releaseStatesOfProgram:D,initAttributes:M,enableAttribute:g,disableUnusedAttributes:I}}function ox(i,t,e){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),e.update(c,n,1)}function o(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function a(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let d=0;d<h;d++)u+=c[d];e.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function ax(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let D=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(D.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(D){return!(D!==mn&&n.convert(D)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(D){let v=D===Ke&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(D!==Un&&D!==ei&&!v&&n.convert(D)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(D){if(D==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";D="mediump"}return D==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(Qt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let f=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&Qt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),I=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),F=i.getParameter(i.MAX_VARYING_VECTORS),A=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=i.getParameter(i.MAX_SAMPLES),T=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:m,maxTextureSize:M,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:I,maxVaryings:F,maxFragmentUniforms:A,maxSamples:b,samples:T}}function lx(i){let t=this,e=null,n=0,s=!1,r=!1,o=new cn,a=new re,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){let d=f.length!==0||u||n!==0||s;return s=u,n=f.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,u){e=h(f,u,0)},this.setState=function(f,u,d){let m=f.clippingPlanes,M=f.clipIntersection,g=f.clipShadows,p=i.get(f);if(!s||m===null||m.length===0||r&&!g)r?h(null):c();else{let I=r?0:n,F=I*4,A=p.clippingState||null;l.value=A,A=h(m,u,F,d);for(let b=0;b!==F;++b)A[b]=e[b];p.clippingState=A,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=I}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,u,d,m){let M=f!==null?f.length:0,g=null;if(M!==0){if(g=l.value,m!==!0||g===null){let p=d+M*4,I=u.matrixWorldInverse;a.getNormalMatrix(I),(g===null||g.length<p)&&(g=new Float32Array(p));for(let F=0,A=d;F!==M;++F,A+=4)o.copy(f[F]).applyMatrix4(I,a),o.normal.toArray(g,A),g[A+3]=o.constant}l.value=g,l.needsUpdate=!0}return t.numPlanes=M,t.numIntersection=0,g}}var Ar=4,cx=6,hx=20,ux=256,Do=new ws,Of=new ce,Th=null,Ah=0,Eh=0,Ch=!1,fx=new G,Ps=new G,Gl=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){let{size:o=256,position:a=fx}=r;Th=this._renderer.getRenderTarget(),Ah=this._renderer.getActiveCubeFace(),Eh=this._renderer.getActiveMipmapLevel(),Ch=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=zf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=kf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Th,Ah,Eh),this._renderer.xr.enabled=Ch,t.scissorTest=!1,Tr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Qi||t.mapping===Cs?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Th=this._renderer.getRenderTarget(),Ah=this._renderer.getActiveCubeFace(),Eh=this._renderer.getActiveMipmapLevel(),Ch=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Xe,minFilter:Xe,generateMipmaps:!1,type:Ke,format:mn,colorSpace:Kr,depthBuffer:!1},s=Bf(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Bf(t,e,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=dx(r)),this._blurMaterial=mx(r,t,e),this._ggxMaterial=px(r,t,e)}return s}_compileMaterial(t){let e=new Oe(new pn,t);this._renderer.compile(e,Do)}_sceneToCubeUV(t,e,n,s,r){let l=new hn(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,u=f.autoClear,d=f.toneMapping;f.getClearColor(Of),f.toneMapping=Qn,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Oe(new gr,new bs({name:"PMREM.Background",side:Sn,depthWrite:!1,depthTest:!1})));let M=this._backgroundBox,g=M.material,p=!1,I=t.background;I?I.isColor&&(g.color.copy(I),t.background=null,p=!0):(g.color.copy(Of),p=!0);for(let F=0;F<6;F++){let A=F%3;A===0?(l.up.set(0,c[F],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[F],r.y,r.z)):A===1?(l.up.set(0,0,c[F]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[F],r.z)):(l.up.set(0,c[F],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[F]));let b=this._cubeSize;Tr(s,A*b,F>2?b:0,b,b),f.setRenderTarget(s),p&&f.render(M,l),f.render(t,l)}f.toneMapping=d,f.autoClear=u,t.background=I}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Qi||t.mapping===Cs;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=zf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=kf());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Tr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Do)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;let l=o.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),f=Math.sqrt(c*c-h*h),u=c*1.25,d=f*u,{_lodMax:m}=this,M=this._sizeLods[n],g=3*M*(n>m-Ar?n-m+Ar:0),p=4*(this._cubeSize-M);l.envMap.value=t.texture,l.roughness.value=d,l.mipInt.value=m-e,Tr(r,g,p,3*M,2*M),s.setRenderTarget(r),s.render(a,Do),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=m-n,Tr(t,g,p,3*M,2*M),s.setRenderTarget(t),s.render(a,Do)}_blur(t,e,n,s){let r=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,n,o),this._blurPass(r,t,n,n,o)}_blurPass(t,e,n,s,r){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[s];l.material=a;let c=a.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let h=this._sizeLods[s],f=3*h*(s>this._lodMax-Ar?s-this._lodMax+Ar:0),u=4*(this._cubeSize-h);Tr(e,f,u,3*h,2*h),o.setRenderTarget(e),o.render(l,Do)}};function dx(i){let t=[],e=[],n=i,s=i-Ar+1+cx;for(let r=0;r<s;r++){let o=Math.pow(2,n);t.push(o);let a=1/(o-2),l=-a,c=1+a,h=[l,l,c,l,c,c,l,l,c,c,l,c],f=6,u=6,d=3,m=new Float32Array(d*u*f),M=new Float32Array(d*u*f);for(let p=0;p<f;p++){let I=p%3*2/3-1,F=p>2?0:-1,A=[I,F,0,I+2/3,F,0,I+2/3,F+1,0,I,F,0,I+2/3,F+1,0,I,F+1,0];m.set(A,d*u*p);for(let b=0;b<u;b++){let T=h[b*2]*2-1,D=h[b*2+1]*2-1;p===0?Ps.set(1,D,T):p===1?Ps.set(-T,1,-D):p===2?Ps.set(-T,D,1):p===3?Ps.set(-1,D,-T):p===4?Ps.set(-T,-1,D):Ps.set(T,D,-1),Ps.toArray(M,(p*u+b)*d)}}let g=new pn;g.setAttribute("position",new sn(m,d)),g.setAttribute("outputDirection",new sn(M,d)),e.push(new Oe(g,null)),n>Ar&&n--}return{lodMeshes:e,sizeLods:t}}function Bf(i,t,e){let n=new qe(i,t,e);return n.texture.mapping=To,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Tr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function px(i,t,e){return new Be({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:ux,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ql(),fragmentShader:`

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
		`,blending:zn,depthTest:!1,depthWrite:!1})}function mx(i,t,e){return new Be({name:"SphericalGaussianBlur",defines:{SAMPLES:hx,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:ql(),fragmentShader:`

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
		`,blending:zn,depthTest:!1,depthWrite:!1})}function kf(){return new Be({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ql(),fragmentShader:`

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
		`,blending:zn,depthTest:!1,depthWrite:!1})}function zf(){return new Be({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ql(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:zn,depthTest:!1,depthWrite:!1})}function ql(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Wl=class extends qe{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new oo(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new gr(5,5,5),r=new Be({name:"CubemapFromEquirect",uniforms:Rs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Sn,blending:zn});r.uniforms.tEquirect.value=e;let o=new Oe(s,r),a=e.minFilter;return e.minFilter===ts&&(e.minFilter=Xe),new Ja(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}};function gx(i){let t=new WeakMap,e=new WeakMap,n=null;function s(u,d=!1){return u==null?null:d?o(u):r(u)}function r(u){if(u&&u.isTexture){let d=u.mapping;if(d===tl||d===el)if(t.has(u)){let m=t.get(u).texture;return a(m,u.mapping)}else{let m=u.image;if(m&&m.height>0){let M=new Wl(m.height);return M.fromEquirectangularTexture(i,u),t.set(u,M),u.addEventListener("dispose",c),a(M.texture,u.mapping)}else return null}}return u}function o(u){if(u&&u.isTexture){let d=u.mapping,m=d===tl||d===el,M=d===Qi||d===Cs;if(m||M){let g=e.get(u),p=g!==void 0?g.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return n===null&&(n=new Gl(i)),g=m?n.fromEquirectangular(u,g):n.fromCubemap(u,g),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),g.texture;if(g!==void 0)return g.texture;{let I=u.image;return m&&I&&I.height>0||M&&I&&l(I)?(n===null&&(n=new Gl(i)),g=m?n.fromEquirectangular(u):n.fromCubemap(u),g.texture.pmremVersion=u.pmremVersion,e.set(u,g),u.addEventListener("dispose",h),g.texture):null}}}return u}function a(u,d){return d===tl?u.mapping=Qi:d===el&&(u.mapping=Cs),u}function l(u){let d=0,m=6;for(let M=0;M<m;M++)u[M]!==void 0&&d++;return d===m}function c(u){let d=u.target;d.removeEventListener("dispose",c);let m=t.get(d);m!==void 0&&(t.delete(d),m.dispose())}function h(u){let d=u.target;d.removeEventListener("dispose",h);let m=e.get(d);m!==void 0&&(e.delete(d),m.dispose())}function f(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:f}}function xx(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&Ms("WebGLRenderer: "+n+" extension not supported."),s}}}function _x(i,t,e,n){let s={},r=new WeakMap;function o(f){let u=f.target;u.index!==null&&t.remove(u.index);for(let m in u.attributes)t.remove(u.attributes[m]);u.removeEventListener("dispose",o),delete s[u.id];let d=r.get(u);d&&(t.remove(d),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(f,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,e.memory.geometries++),u}function l(f){let u=f.attributes;for(let d in u)t.update(u[d],i.ARRAY_BUFFER)}function c(f){let u=[],d=f.index,m=f.attributes.position,M=0;if(m===void 0)return;if(d!==null){let I=d.array;M=d.version;for(let F=0,A=I.length;F<A;F+=3){let b=I[F+0],T=I[F+1],D=I[F+2];u.push(b,T,T,D,D,b)}}else{let I=m.array;M=m.version;for(let F=0,A=I.length/3-1;F<A;F+=3){let b=F+0,T=F+1,D=F+2;u.push(b,T,T,D,D,b)}}let g=new(m.count>=65535?no:eo)(u,1);g.version=M;let p=r.get(f);p&&t.remove(p),r.set(f,g)}function h(f){let u=r.get(f);if(u){let d=f.index;d!==null&&u.version<d.version&&c(f)}else c(f);return r.get(f)}return{get:a,update:l,getWireframeAttribute:h}}function vx(i,t,e){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,u){i.drawElements(n,u,r,f*o),e.update(u,n,1)}function c(f,u,d){d!==0&&(i.drawElementsInstanced(n,u,r,f*o,d),e.update(u,n,d))}function h(f,u,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,f,0,d);let M=0;for(let g=0;g<d;g++)M+=u[g];e.update(M,n,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function yx(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:te("WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Mx(i,t,e){let n=new WeakMap,s=new He;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=h!==void 0?h.length:0,u=n.get(a);if(u===void 0||u.count!==f){let P=function(){D.dispose(),n.delete(a),a.removeEventListener("dispose",P)};u!==void 0&&u.texture.dispose();let d=a.morphAttributes.position!==void 0,m=a.morphAttributes.normal!==void 0,M=a.morphAttributes.color!==void 0,g=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],I=a.morphAttributes.color||[],F=0;d===!0&&(F=1),m===!0&&(F=2),M===!0&&(F=3);let A=a.attributes.position.count*F,b=1;A>t.maxTextureSize&&(b=Math.ceil(A/t.maxTextureSize),A=t.maxTextureSize);let T=new Float32Array(A*b*4*f),D=new Qr(T,A,b,f);D.type=ei,D.needsUpdate=!0;let v=F*4;for(let N=0;N<f;N++){let O=g[N],B=p[N],q=I[N],V=A*b*4*N;for(let K=0;K<O.count;K++){let lt=K*v;d===!0&&(s.fromBufferAttribute(O,K),T[V+lt+0]=s.x,T[V+lt+1]=s.y,T[V+lt+2]=s.z,T[V+lt+3]=0),m===!0&&(s.fromBufferAttribute(B,K),T[V+lt+4]=s.x,T[V+lt+5]=s.y,T[V+lt+6]=s.z,T[V+lt+7]=0),M===!0&&(s.fromBufferAttribute(q,K),T[V+lt+8]=s.x,T[V+lt+9]=s.y,T[V+lt+10]=s.z,T[V+lt+11]=q.itemSize===4?s.w:1)}}u={count:f,texture:D,size:new qt(A,b)},n.set(a,u),a.addEventListener("dispose",P)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let d=0;for(let M=0;M<c.length;M++)d+=c[M];let m=a.morphTargetsRelative?1:1-d;l.getUniforms().setValue(i,"morphTargetBaseInfluence",m),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function Sx(i,t,e,n,s){let r=new WeakMap;function o(c){let h=s.render.frame,f=c.geometry,u=t.get(c,f);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let d=c.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return u}function a(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}var bx={[vo]:"LINEAR_TONE_MAPPING",[yo]:"REINHARD_TONE_MAPPING",[Mo]:"CINEON_TONE_MAPPING",[Es]:"ACES_FILMIC_TONE_MAPPING",[bo]:"AGX_TONE_MAPPING",[wo]:"NEUTRAL_TONE_MAPPING",[So]:"CUSTOM_TONE_MAPPING"};function wx(i,t,e,n,s,r){let o=new qe(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new pn;c.setAttribute("position",new Mn([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Mn([0,2,0,0,2,0],2));let h=new xr({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),f=new Oe(c,h),u=new ws(-1,1,1,-1,0,1),d=null,m=null,M=!1,g,p=null,I=[],F=!1;this.setSize=function(A,b){o.setSize(A,b),a!==null&&a.setSize(A,b),l!==null&&l.setSize(A,b);for(let T=0;T<I.length;T++){let D=I[T];D.setSize&&D.setSize(A,b)}},this.setEffects=function(A){I=A,F=I.length>0&&I[0].isRenderPass===!0;let b=o.width,T=o.height;I.length>0&&a===null&&(a=new qe(b,T,{type:Ke,depthBuffer:!1,stencilBuffer:!1}),l=new qe(b,T,{type:Ke,depthBuffer:!1,stencilBuffer:!1}));for(let D=0;D<I.length;D++){let v=I[D];v.setSize&&v.setSize(b,T)}},this.begin=function(A,b){if(M||A.toneMapping===Qn&&I.length===0)return!1;if(p=b,b!==null){let T=b.width,D=b.height;(o.width!==T||o.height!==D)&&this.setSize(T,D)}return F===!1&&A.setRenderTarget(o),g=A.toneMapping,A.toneMapping=Qn,!0},this.hasRenderPass=function(){return F},this.end=function(A,b){A.toneMapping=g,M=!0;let T=o,D=a;for(let v=0;v<I.length;v++){let P=I[v];P.enabled!==!1&&(P.render(A,D,T,b),P.needsSwap!==!1&&(T=D,D=D===a?l:a))}if(d!==A.outputColorSpace||m!==A.toneMapping){d=A.outputColorSpace,m=A.toneMapping,h.defines={},pe.getTransfer(d)===be&&(h.defines.SRGB_TRANSFER="");let v=bx[m];v&&(h.defines[v]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=T.texture,A.setRenderTarget(p),A.render(f,u),p=null,M=!1},this.isCompositing=function(){return M},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var od=new dn,Ih=new $i(1,1),ad=new Qr,ld=new Fa,cd=new oo,Vf=[],Hf=[],Gf=new Float32Array(16),Wf=new Float32Array(9),Xf=new Float32Array(4);function Cr(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=Vf[s];if(r===void 0&&(r=new Float32Array(s),Vf[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function Je(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function je(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Yl(i,t){let e=Hf[t];e===void 0&&(e=new Int32Array(t),Hf[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Tx(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Ax(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Je(e,t))return;i.uniform2fv(this.addr,t),je(e,t)}}function Ex(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Je(e,t))return;i.uniform3fv(this.addr,t),je(e,t)}}function Cx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Je(e,t))return;i.uniform4fv(this.addr,t),je(e,t)}}function Rx(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Je(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),je(e,t)}else{if(Je(e,n))return;Xf.set(n),i.uniformMatrix2fv(this.addr,!1,Xf),je(e,n)}}function Px(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Je(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),je(e,t)}else{if(Je(e,n))return;Wf.set(n),i.uniformMatrix3fv(this.addr,!1,Wf),je(e,n)}}function Ix(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Je(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),je(e,t)}else{if(Je(e,n))return;Gf.set(n),i.uniformMatrix4fv(this.addr,!1,Gf),je(e,n)}}function Lx(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Dx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Je(e,t))return;i.uniform2iv(this.addr,t),je(e,t)}}function Nx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Je(e,t))return;i.uniform3iv(this.addr,t),je(e,t)}}function Ux(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Je(e,t))return;i.uniform4iv(this.addr,t),je(e,t)}}function Fx(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Ox(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Je(e,t))return;i.uniform2uiv(this.addr,t),je(e,t)}}function Bx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Je(e,t))return;i.uniform3uiv(this.addr,t),je(e,t)}}function kx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Je(e,t))return;i.uniform4uiv(this.addr,t),je(e,t)}}function zx(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Ih.compareFunction=e.isReversedDepthBuffer()?zl:kl,r=Ih):r=od,e.setTexture2D(t||r,s)}function Vx(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||ld,s)}function Hx(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||cd,s)}function Gx(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||ad,s)}function Wx(i){switch(i){case 5126:return Tx;case 35664:return Ax;case 35665:return Ex;case 35666:return Cx;case 35674:return Rx;case 35675:return Px;case 35676:return Ix;case 5124:case 35670:return Lx;case 35667:case 35671:return Dx;case 35668:case 35672:return Nx;case 35669:case 35673:return Ux;case 5125:return Fx;case 36294:return Ox;case 36295:return Bx;case 36296:return kx;case 35678:case 36198:case 36298:case 36306:case 35682:return zx;case 35679:case 36299:case 36307:return Vx;case 35680:case 36300:case 36308:case 36293:return Hx;case 36289:case 36303:case 36311:case 36292:return Gx}}function Xx(i,t){i.uniform1fv(this.addr,t)}function qx(i,t){let e=Cr(t,this.size,2);i.uniform2fv(this.addr,e)}function Yx(i,t){let e=Cr(t,this.size,3);i.uniform3fv(this.addr,e)}function $x(i,t){let e=Cr(t,this.size,4);i.uniform4fv(this.addr,e)}function Zx(i,t){let e=Cr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Kx(i,t){let e=Cr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Jx(i,t){let e=Cr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function jx(i,t){i.uniform1iv(this.addr,t)}function Qx(i,t){i.uniform2iv(this.addr,t)}function t_(i,t){i.uniform3iv(this.addr,t)}function e_(i,t){i.uniform4iv(this.addr,t)}function n_(i,t){i.uniform1uiv(this.addr,t)}function i_(i,t){i.uniform2uiv(this.addr,t)}function s_(i,t){i.uniform3uiv(this.addr,t)}function r_(i,t){i.uniform4uiv(this.addr,t)}function o_(i,t,e){let n=this.cache,s=t.length,r=Yl(e,s);Je(n,r)||(i.uniform1iv(this.addr,r),je(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=Ih:o=od;for(let a=0;a!==s;++a)e.setTexture2D(t[a]||o,r[a])}function a_(i,t,e){let n=this.cache,s=t.length,r=Yl(e,s);Je(n,r)||(i.uniform1iv(this.addr,r),je(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||ld,r[o])}function l_(i,t,e){let n=this.cache,s=t.length,r=Yl(e,s);Je(n,r)||(i.uniform1iv(this.addr,r),je(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||cd,r[o])}function c_(i,t,e){let n=this.cache,s=t.length,r=Yl(e,s);Je(n,r)||(i.uniform1iv(this.addr,r),je(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||ad,r[o])}function h_(i){switch(i){case 5126:return Xx;case 35664:return qx;case 35665:return Yx;case 35666:return $x;case 35674:return Zx;case 35675:return Kx;case 35676:return Jx;case 5124:case 35670:return jx;case 35667:case 35671:return Qx;case 35668:case 35672:return t_;case 35669:case 35673:return e_;case 5125:return n_;case 36294:return i_;case 36295:return s_;case 36296:return r_;case 35678:case 36198:case 36298:case 36306:case 35682:return o_;case 35679:case 36299:case 36307:return a_;case 35680:case 36300:case 36308:case 36293:return l_;case 36289:case 36303:case 36311:case 36292:return c_}}var Lh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Wx(e.type)}},Dh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=h_(e.type)}},Nh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},Rh=/(\w+)(\])?(\[|\.)?/g;function qf(i,t){i.seq.push(t),i.map[t.id]=t}function u_(i,t,e){let n=i.name,s=n.length;for(Rh.lastIndex=0;;){let r=Rh.exec(n),o=Rh.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){qf(e,c===void 0?new Lh(a,i,t):new Dh(a,i,t));break}else{let f=e.map[a];f===void 0&&(f=new Nh(a),qf(e,f)),e=f}}}var Er=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);u_(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function Yf(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var f_=37297,d_=0;function p_(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var $f=new re;function m_(i){pe._getMatrix($f,pe.workingColorSpace,i);let t=`mat3( ${$f.elements.map(e=>e.toFixed(4))} )`;switch(pe.getTransfer(i)){case Jr:return[t,"LinearTransferOETF"];case be:return[t,"sRGBTransferOETF"];default:return Qt("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function Zf(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+p_(i.getShaderSource(t),a)}else return r}function g_(i,t){let e=m_(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var x_={[vo]:"Linear",[yo]:"Reinhard",[Mo]:"Cineon",[Es]:"ACESFilmic",[bo]:"AgX",[wo]:"Neutral",[So]:"Custom"};function __(i,t){let e=x_[t];return e===void 0?(Qt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var Hl=new G;function v_(){pe.getLuminanceCoefficients(Hl);let i=Hl.x.toFixed(4),t=Hl.y.toFixed(4),e=Hl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function y_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Uo).join(`
`)}function M_(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function S_(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Uo(i){return i!==""}function Kf(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Jf(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var b_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Uh(i){return i.replace(b_,T_)}var w_=new Map;function T_(i,t){let e=ue[t];if(e===void 0){let n=w_.get(t);if(n!==void 0)e=ue[n],Qt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Uh(e)}var A_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function jf(i){return i.replace(A_,E_)}function E_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Qf(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}var C_={[go]:"SHADOWMAP_TYPE_PCF",[vr]:"SHADOWMAP_TYPE_VSM"};function R_(i){return C_[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var P_={[Qi]:"ENVMAP_TYPE_CUBE",[Cs]:"ENVMAP_TYPE_CUBE",[To]:"ENVMAP_TYPE_CUBE_UV"};function I_(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":P_[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var L_={[Cs]:"ENVMAP_MODE_REFRACTION"};function D_(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":L_[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var N_={[eh]:"ENVMAP_BLENDING_MULTIPLY",[xf]:"ENVMAP_BLENDING_MIX",[_f]:"ENVMAP_BLENDING_ADD"};function U_(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":N_[i.combine]||"ENVMAP_BLENDING_NONE"}function F_(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function O_(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=R_(e),c=I_(e),h=D_(e),f=U_(e),u=F_(e),d=y_(e),m=M_(r),M=s.createProgram(),g,p,I=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(g=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Uo).join(`
`),g.length>0&&(g+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m].filter(Uo).join(`
`),p.length>0&&(p+=`
`)):(g=[Qf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Uo).join(`
`),p=[Qf(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,m,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Qn?"#define TONE_MAPPING":"",e.toneMapping!==Qn?ue.tonemapping_pars_fragment:"",e.toneMapping!==Qn?__("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ue.colorspace_pars_fragment,g_("linearToOutputTexel",e.outputColorSpace),v_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Uo).join(`
`)),o=Uh(o),o=Kf(o,e),o=Jf(o,e),a=Uh(a),a=Kf(a,e),a=Jf(a,e),o=jf(o),a=jf(a),e.isRawShaderMaterial!==!0&&(I=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,p=["#define varying in",e.glslVersion===fh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===fh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let F=I+g+o,A=I+p+a,b=Yf(s,s.VERTEX_SHADER,F),T=Yf(s,s.FRAGMENT_SHADER,A);s.attachShader(M,b),s.attachShader(M,T),e.index0AttributeName!==void 0?s.bindAttribLocation(M,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function D(O){if(i.debug.checkShaderErrors){let B=s.getProgramInfoLog(M)||"",q=s.getShaderInfoLog(b)||"",V=s.getShaderInfoLog(T)||"",K=B.trim(),lt=q.trim(),at=V.trim(),pt=!0,ot=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(pt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,M,b,T);else{let ut=Zf(s,b,"vertex"),dt=Zf(s,T,"fragment");te("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+O.name+`
Material Type: `+O.type+`

Program Info Log: `+K+`
`+ut+`
`+dt)}else K!==""?Qt("WebGLProgram: Program Info Log:",K):(lt===""||at==="")&&(ot=!1);ot&&(O.diagnostics={runnable:pt,programLog:K,vertexShader:{log:lt,prefix:g},fragmentShader:{log:at,prefix:p}})}s.deleteShader(b),s.deleteShader(T),v=new Er(s,M),P=S_(s,M)}let v;this.getUniforms=function(){return v===void 0&&D(this),v};let P;this.getAttributes=function(){return P===void 0&&D(this),P};let N=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return N===!1&&(N=s.getProgramParameter(M,f_)),N},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=d_++,this.cacheKey=t,this.usedTimes=1,this.program=M,this.vertexShader=b,this.fragmentShader=T,this}var B_=0,Fh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Oh(t),e.set(t,n)),n}},Oh=class{constructor(t){this.id=B_++,this.code=t,this.usedTimes=0}};function k_(i){return i===ns||i===Io||i===Lo}function z_(i,t,e,n,s,r){let o=new pr,a=new Fh,l=new Set,c=[],h=new Map,f=n.logarithmicDepthBuffer,u=n.precision,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(v){return l.add(v),v===0?"uv":`uv${v}`}function M(v,P,N,O,B,q){let V=O.fog,K=B.geometry,lt=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?O.environment:null,at=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,pt=t.get(v.envMap||lt,at),ot=pt&&pt.mapping===To?pt.image.height:null,ut=d[v.type];v.precision!==null&&(u=n.getMaxPrecision(v.precision),u!==v.precision&&Qt("WebGLProgram.getParameters:",v.precision,"not supported, using",u,"instead."));let dt=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,$t=dt!==void 0?dt.length:0,Xt=0;K.morphAttributes.position!==void 0&&(Xt=1),K.morphAttributes.normal!==void 0&&(Xt=2),K.morphAttributes.color!==void 0&&(Xt=3);let we,fe,ve,W;if(ut){let ye=mi[ut];we=ye.vertexShader,fe=ye.fragmentShader}else{we=v.vertexShader,fe=v.fragmentShader;let ye=a.getVertexShaderStage(v),Me=a.getFragmentShaderStage(v);a.update(v,ye,Me),ve=ye.id,W=Me.id}let tt=i.getRenderTarget(),Mt=i.state.buffers.depth.getReversed(),bt=B.isInstancedMesh===!0,xt=B.isBatchedMesh===!0,Bt=!!v.map,Ne=!!v.matcap,jt=!!pt,ne=!!v.aoMap,de=!!v.lightMap,Jt=!!v.bumpMap&&v.wireframe===!1,ie=!!v.normalMap,ke=!!v.displacementMap,xe=!!v.emissiveMap,Te=!!v.metalnessMap,Pe=!!v.roughnessMap,C=v.anisotropy>0,gt=v.clearcoat>0,It=v.dispersion>0,R=v.retroreflectivity>0,x=v.iridescence>0,H=v.sheen>0,E=v.transmission>0,X=C&&!!v.anisotropyMap,ft=gt&&!!v.clearcoatMap,Y=gt&&!!v.clearcoatNormalMap,nt=gt&&!!v.clearcoatRoughnessMap,it=x&&!!v.iridescenceMap,wt=x&&!!v.iridescenceThicknessMap,Nt=H&&!!v.sheenColorMap,Pt=H&&!!v.sheenRoughnessMap,ct=!!v.specularMap,Yt=!!v.specularColorMap,Kt=!!v.specularIntensityMap,Zt=E&&!!v.transmissionMap,z=E&&!!v.thicknessMap,At=!!v.gradientMap,ht=!!v.alphaMap,Ct=v.alphaTest>0,Et=!!v.alphaHash,st=!!v.extensions,yt=Qn;v.toneMapped&&(tt===null||tt.isXRRenderTarget===!0)&&(yt=i.toneMapping);let Tt={shaderID:ut,shaderType:v.type,shaderName:v.name,vertexShader:we,fragmentShader:fe,defines:v.defines,customVertexShaderID:ve,customFragmentShaderID:W,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:u,batching:xt,batchingColor:xt&&B._colorsTexture!==null,instancing:bt,instancingColor:bt&&B.instanceColor!==null,instancingMorph:bt&&B.morphTexture!==null,outputColorSpace:tt===null?i.outputColorSpace:tt.isXRRenderTarget===!0?tt.texture.colorSpace:pe.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:Bt,matcap:Ne,envMap:jt,envMapMode:jt&&pt.mapping,envMapCubeUVHeight:ot,aoMap:ne,lightMap:de,bumpMap:Jt,normalMap:ie,displacementMap:ke,emissiveMap:xe,normalMapObjectSpace:ie&&v.normalMapType===Mf,normalMapTangentSpace:ie&&v.normalMapType===hh,packedNormalMap:ie&&v.normalMapType===hh&&k_(v.normalMap.format),metalnessMap:Te,roughnessMap:Pe,anisotropy:C,anisotropyMap:X,clearcoat:gt,clearcoatMap:ft,clearcoatNormalMap:Y,clearcoatRoughnessMap:nt,dispersion:It,retroreflection:R,iridescence:x,iridescenceMap:it,iridescenceThicknessMap:wt,sheen:H,sheenColorMap:Nt,sheenRoughnessMap:Pt,specularMap:ct,specularColorMap:Yt,specularIntensityMap:Kt,transmission:E,transmissionMap:Zt,thicknessMap:z,gradientMap:At,opaque:v.transparent===!1&&v.blending===yr&&v.alphaToCoverage===!1,alphaMap:ht,alphaTest:Ct,alphaHash:Et,combine:v.combine,mapUv:Bt&&m(v.map.channel),aoMapUv:ne&&m(v.aoMap.channel),lightMapUv:de&&m(v.lightMap.channel),bumpMapUv:Jt&&m(v.bumpMap.channel),normalMapUv:ie&&m(v.normalMap.channel),displacementMapUv:ke&&m(v.displacementMap.channel),emissiveMapUv:xe&&m(v.emissiveMap.channel),metalnessMapUv:Te&&m(v.metalnessMap.channel),roughnessMapUv:Pe&&m(v.roughnessMap.channel),anisotropyMapUv:X&&m(v.anisotropyMap.channel),clearcoatMapUv:ft&&m(v.clearcoatMap.channel),clearcoatNormalMapUv:Y&&m(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:nt&&m(v.clearcoatRoughnessMap.channel),iridescenceMapUv:it&&m(v.iridescenceMap.channel),iridescenceThicknessMapUv:wt&&m(v.iridescenceThicknessMap.channel),sheenColorMapUv:Nt&&m(v.sheenColorMap.channel),sheenRoughnessMapUv:Pt&&m(v.sheenRoughnessMap.channel),specularMapUv:ct&&m(v.specularMap.channel),specularColorMapUv:Yt&&m(v.specularColorMap.channel),specularIntensityMapUv:Kt&&m(v.specularIntensityMap.channel),transmissionMapUv:Zt&&m(v.transmissionMap.channel),thicknessMapUv:z&&m(v.thicknessMap.channel),alphaMapUv:ht&&m(v.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(ie||C),vertexNormals:!!K.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!K.attributes.uv&&(Bt||ht),fog:!!V,useFog:v.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||K.attributes.normal===void 0&&ie===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Mt,skinning:B.isSkinnedMesh===!0,hasPositionAttribute:K.attributes.position!==void 0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:$t,morphTextureStride:Xt,numSunLights:P.sun.length,numDirLights:P.directional.length,numPointLights:P.point.length,numSpotLights:P.spot.length,numSpotLightMaps:P.spotLightMap.length,numRectAreaLights:P.rectArea.length,numHemiLights:P.hemi.length,numSunLightShadows:P.sunShadowMap.length,numDirLightShadows:P.directionalShadowMap.length,numPointLightShadows:P.pointShadowMap.length,numSpotLightShadows:P.spotShadowMap.length,numSpotLightShadowsWithMaps:P.numSpotLightShadowsWithMaps,numLightProbes:P.numLightProbes,numLightProbeGrids:q.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&N.length>0,shadowMapType:i.shadowMap.type,toneMapping:yt,decodeVideoTexture:Bt&&v.map.isVideoTexture===!0&&pe.getTransfer(v.map.colorSpace)===be,decodeVideoTextureEmissive:xe&&v.emissiveMap.isVideoTexture===!0&&pe.getTransfer(v.emissiveMap.colorSpace)===be,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===fi,flipSided:v.side===Sn,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:st&&v.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(st&&v.extensions.multiDraw===!0||xt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Tt.vertexUv1s=l.has(1),Tt.vertexUv2s=l.has(2),Tt.vertexUv3s=l.has(3),l.clear(),Tt}function g(v){let P=[];if(v.shaderID?P.push(v.shaderID):(P.push(v.customVertexShaderID),P.push(v.customFragmentShaderID)),v.defines!==void 0)for(let N in v.defines)P.push(N),P.push(v.defines[N]);return v.isRawShaderMaterial===!1&&(p(P,v),I(P,v),P.push(i.outputColorSpace)),P.push(v.customProgramCacheKey),P.join()}function p(v,P){v.push(P.precision),v.push(P.outputColorSpace),v.push(P.envMapMode),v.push(P.envMapCubeUVHeight),v.push(P.mapUv),v.push(P.alphaMapUv),v.push(P.lightMapUv),v.push(P.aoMapUv),v.push(P.bumpMapUv),v.push(P.normalMapUv),v.push(P.displacementMapUv),v.push(P.emissiveMapUv),v.push(P.metalnessMapUv),v.push(P.roughnessMapUv),v.push(P.anisotropyMapUv),v.push(P.clearcoatMapUv),v.push(P.clearcoatNormalMapUv),v.push(P.clearcoatRoughnessMapUv),v.push(P.iridescenceMapUv),v.push(P.iridescenceThicknessMapUv),v.push(P.sheenColorMapUv),v.push(P.sheenRoughnessMapUv),v.push(P.specularMapUv),v.push(P.specularColorMapUv),v.push(P.specularIntensityMapUv),v.push(P.transmissionMapUv),v.push(P.thicknessMapUv),v.push(P.combine),v.push(P.fogExp2),v.push(P.sizeAttenuation),v.push(P.morphTargetsCount),v.push(P.morphAttributeCount),v.push(P.numSunLights),v.push(P.numDirLights),v.push(P.numPointLights),v.push(P.numSpotLights),v.push(P.numSpotLightMaps),v.push(P.numHemiLights),v.push(P.numRectAreaLights),v.push(P.numSunLightShadows),v.push(P.numDirLightShadows),v.push(P.numPointLightShadows),v.push(P.numSpotLightShadows),v.push(P.numSpotLightShadowsWithMaps),v.push(P.numLightProbes),v.push(P.shadowMapType),v.push(P.toneMapping),v.push(P.numClippingPlanes),v.push(P.numClipIntersection),v.push(P.depthPacking)}function I(v,P){o.disableAll(),P.instancing&&o.enable(0),P.instancingColor&&o.enable(1),P.instancingMorph&&o.enable(2),P.matcap&&o.enable(3),P.envMap&&o.enable(4),P.normalMapObjectSpace&&o.enable(5),P.normalMapTangentSpace&&o.enable(6),P.clearcoat&&o.enable(7),P.iridescence&&o.enable(8),P.alphaTest&&o.enable(9),P.vertexColors&&o.enable(10),P.vertexAlphas&&o.enable(11),P.vertexUv1s&&o.enable(12),P.vertexUv2s&&o.enable(13),P.vertexUv3s&&o.enable(14),P.vertexTangents&&o.enable(15),P.anisotropy&&o.enable(16),P.alphaHash&&o.enable(17),P.batching&&o.enable(18),P.dispersion&&o.enable(19),P.retroreflection&&o.enable(24),P.batchingColor&&o.enable(20),P.gradientMap&&o.enable(21),P.packedNormalMap&&o.enable(22),P.vertexNormals&&o.enable(23),v.push(o.mask),o.disableAll(),P.fog&&o.enable(0),P.useFog&&o.enable(1),P.flatShading&&o.enable(2),P.logarithmicDepthBuffer&&o.enable(3),P.reversedDepthBuffer&&o.enable(4),P.skinning&&o.enable(5),P.morphTargets&&o.enable(6),P.morphNormals&&o.enable(7),P.morphColors&&o.enable(8),P.premultipliedAlpha&&o.enable(9),P.shadowMapEnabled&&o.enable(10),P.doubleSided&&o.enable(11),P.flipSided&&o.enable(12),P.useDepthPacking&&o.enable(13),P.dithering&&o.enable(14),P.transmission&&o.enable(15),P.sheen&&o.enable(16),P.opaque&&o.enable(17),P.pointsUvs&&o.enable(18),P.decodeVideoTexture&&o.enable(19),P.decodeVideoTextureEmissive&&o.enable(20),P.alphaToCoverage&&o.enable(21),P.numLightProbeGrids>0&&o.enable(22),P.hasPositionAttribute&&o.enable(23),v.push(o.mask)}function F(v){let P=d[v.type],N;if(P){let O=mi[P];N=Li.clone(O.uniforms)}else N=v.uniforms;return N}function A(v,P){let N=h.get(P);return N!==void 0?++N.usedTimes:(N=new O_(i,P,v,s),c.push(N),h.set(P,N)),N}function b(v){if(--v.usedTimes===0){let P=c.indexOf(v);c[P]=c[c.length-1],c.pop(),h.delete(v.cacheKey),v.destroy()}}function T(v){a.remove(v)}function D(){a.dispose()}return{getParameters:M,getProgramCacheKey:g,getUniforms:F,acquireProgram:A,releaseProgram:b,releaseShaderCache:T,programs:c,dispose:D}}function V_(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function H_(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function td(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function ed(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u){let d=0;return u.isInstancedMesh&&(d+=2),u.isSkinnedMesh&&(d+=1),d}function a(u,d,m,M,g,p){let I=i[t];return I===void 0?(I={id:u.id,object:u,geometry:d,material:m,materialVariant:o(u),groupOrder:M,renderOrder:u.renderOrder,z:g,group:p},i[t]=I):(I.id=u.id,I.object=u,I.geometry=d,I.material=m,I.materialVariant=o(u),I.groupOrder=M,I.renderOrder=u.renderOrder,I.z=g,I.group=p),t++,I}function l(u,d,m,M,g,p,I){I.reversedDepth===!0&&(g=-g);let F=a(u,d,m,M,g,p);m.transmission>0?n.push(F):m.transparent===!0?s.push(F):e.push(F)}function c(u,d,m,M,g,p){let I=a(u,d,m,M,g,p);m.transmission>0?n.unshift(I):m.transparent===!0?s.unshift(I):e.unshift(I)}function h(u,d){e.length>1&&e.sort(u||H_),n.length>1&&n.sort(d||td),s.length>1&&s.sort(d||td)}function f(){for(let u=t,d=i.length;u<d;u++){let m=i[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:f,sort:h}}function G_(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new ed,i.set(n,[o])):s>=r.length?(o=new ed,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function W_(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new G,color:new ce};break;case"SpotLight":e={position:new G,direction:new G,color:new ce,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new G,color:new ce,distance:0,decay:0};break;case"HemisphereLight":e={direction:new G,skyColor:new ce,groundColor:new ce};break;case"RectAreaLight":e={color:new ce,position:new G,halfWidth:new G,halfHeight:new G};break}return i[t.id]=e,e}}}function X_(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new qt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new qt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new qt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var q_=0;function Y_(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function $_(i){let t=new W_,e=X_(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new G);let s=new G,r=new Ve,o=new Ve;function a(c){let h=0,f=0,u=0;for(let B=0;B<9;B++)n.probe[B].set(0,0,0);let d=0,m=0,M=0,g=0,p=0,I=0,F=0,A=0,b=0,T=0,D=0,v=0,P=0,N=0;c.sort(Y_);for(let B=0,q=c.length;B<q;B++){let V=c[B],K=V.color,lt=V.intensity,at=V.distance,pt=null;if(V.shadow&&V.shadow.map&&(V.shadow.map.texture.format===ns?pt=V.shadow.map.texture:pt=V.shadow.map.depthTexture||V.shadow.map.texture),V.isAmbientLight)h+=K.r*lt,f+=K.g*lt,u+=K.b*lt;else if(V.isLightProbe){for(let ot=0;ot<9;ot++)n.probe[ot].addScaledVector(V.sh.coefficients[ot],lt);N++}else if(V.isSunLight){let ot=t.get(V);if(ot.color.copy(V.color).multiplyScalar(V.intensity),V.castShadow){let ut=V.shadow,dt=e.get(V);dt.shadowIntensity=ut.intensity,dt.shadowBias=ut.bias,dt.shadowNormalBias=ut.normalBias,dt.shadowRadius=ut.radius,dt.shadowMapSize.copy(ut.mapSize).multiply(ut.getFrameExtents()),n.sunShadow[m]=dt,n.sunShadowMap[m]=pt;let $t=ut.getViewportCount();for(let Xt=0;Xt<$t;Xt++)n.sunShadowMatrix[M+Xt]=ut.getMatrix(Xt),n.sunShadowCascade[M+Xt]=ut._cascadeData[Xt];M+=$t,m++}n.sun[d]=ot,d++}else if(V.isDirectionalLight){let ot=t.get(V);if(ot.color.copy(V.color).multiplyScalar(V.intensity),V.castShadow){let ut=V.shadow,dt=e.get(V);dt.shadowIntensity=ut.intensity,dt.shadowBias=ut.bias,dt.shadowNormalBias=ut.normalBias,dt.shadowRadius=ut.radius,dt.shadowMapSize=ut.mapSize,n.directionalShadow[g]=dt,n.directionalShadowMap[g]=pt,n.directionalShadowMatrix[g]=V.shadow.matrix,b++}n.directional[g]=ot,g++}else if(V.isSpotLight){let ot=t.get(V);ot.position.setFromMatrixPosition(V.matrixWorld),ot.color.copy(K).multiplyScalar(lt),ot.distance=at,ot.coneCos=Math.cos(V.angle),ot.penumbraCos=Math.cos(V.angle*(1-V.penumbra)),ot.decay=V.decay,n.spot[I]=ot;let ut=V.shadow;if(V.map&&(n.spotLightMap[v]=V.map,v++,ut.updateMatrices(V),V.castShadow&&P++),n.spotLightMatrix[I]=ut.matrix,V.castShadow){let dt=e.get(V);dt.shadowIntensity=ut.intensity,dt.shadowBias=ut.bias,dt.shadowNormalBias=ut.normalBias,dt.shadowRadius=ut.radius,dt.shadowMapSize=ut.mapSize,n.spotShadow[I]=dt,n.spotShadowMap[I]=pt,D++}I++}else if(V.isRectAreaLight){let ot=t.get(V);ot.color.copy(K).multiplyScalar(lt),ot.halfWidth.set(V.width*.5,0,0),ot.halfHeight.set(0,V.height*.5,0),n.rectArea[F]=ot,F++}else if(V.isPointLight){let ot=t.get(V);if(ot.color.copy(V.color).multiplyScalar(V.intensity),ot.distance=V.distance,ot.decay=V.decay,V.castShadow){let ut=V.shadow,dt=e.get(V);dt.shadowIntensity=ut.intensity,dt.shadowBias=ut.bias,dt.shadowNormalBias=ut.normalBias,dt.shadowRadius=ut.radius,dt.shadowMapSize=ut.mapSize,dt.shadowCameraNear=ut.camera.near,dt.shadowCameraFar=ut.camera.far,n.pointShadow[p]=dt,n.pointShadowMap[p]=pt,n.pointShadowMatrix[p]=V.shadow.matrix,T++}n.point[p]=ot,p++}else if(V.isHemisphereLight){let ot=t.get(V);ot.skyColor.copy(V.color).multiplyScalar(lt),ot.groundColor.copy(V.groundColor).multiplyScalar(lt),n.hemi[A]=ot,A++}}F>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Dt.LTC_FLOAT_1,n.rectAreaLTC2=Dt.LTC_FLOAT_2):(n.rectAreaLTC1=Dt.LTC_HALF_1,n.rectAreaLTC2=Dt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=u;let O=n.hash;(O.sunLength!==d||O.directionalLength!==g||O.pointLength!==p||O.spotLength!==I||O.rectAreaLength!==F||O.hemiLength!==A||O.numSunShadows!==m||O.numDirectionalShadows!==b||O.numPointShadows!==T||O.numSpotShadows!==D||O.numSpotMaps!==v||O.numLightProbes!==N)&&(n.sun.length=d,n.directional.length=g,n.spot.length=I,n.rectArea.length=F,n.point.length=p,n.hemi.length=A,n.sunShadow.length=m,n.sunShadowMap.length=m,n.sunShadowMatrix.length=M,n.sunShadowCascade.length=M,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=T,n.pointShadowMap.length=T,n.pointShadowMatrix.length=T,n.spotShadow.length=D,n.spotShadowMap.length=D,n.spotLightMatrix.length=D+v-P,n.spotLightMap.length=v,n.numSpotLightShadowsWithMaps=P,n.numLightProbes=N,O.sunLength=d,O.directionalLength=g,O.pointLength=p,O.spotLength=I,O.rectAreaLength=F,O.hemiLength=A,O.numSunShadows=m,O.numDirectionalShadows=b,O.numPointShadows=T,O.numSpotShadows=D,O.numSpotMaps=v,O.numLightProbes=N,n.version=q_++)}function l(c,h){let f=0,u=0,d=0,m=0,M=0,g=0,p=h.matrixWorldInverse;for(let I=0,F=c.length;I<F;I++){let A=c[I];if(A.isSunLight){let b=n.sun[f];b.direction.setFromMatrixPosition(A.matrixWorld),b.direction.transformDirection(p),f++}else if(A.isDirectionalLight){let b=n.directional[u];b.direction.setFromMatrixPosition(A.matrixWorld),s.setFromMatrixPosition(A.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(p),u++}else if(A.isSpotLight){let b=n.spot[m];b.position.setFromMatrixPosition(A.matrixWorld),b.position.applyMatrix4(p),b.direction.setFromMatrixPosition(A.matrixWorld),s.setFromMatrixPosition(A.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(p),m++}else if(A.isRectAreaLight){let b=n.rectArea[M];b.position.setFromMatrixPosition(A.matrixWorld),b.position.applyMatrix4(p),o.identity(),r.copy(A.matrixWorld),r.premultiply(p),o.extractRotation(r),b.halfWidth.set(A.width*.5,0,0),b.halfHeight.set(0,A.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),M++}else if(A.isPointLight){let b=n.point[d];b.position.setFromMatrixPosition(A.matrixWorld),b.position.applyMatrix4(p),d++}else if(A.isHemisphereLight){let b=n.hemi[g];b.direction.setFromMatrixPosition(A.matrixWorld),b.direction.transformDirection(p),g++}}}return{setup:a,setupView:l,state:n}}function nd(i){let t=new $_(i),e=[],n=[],s=[];function r(u){f.camera=u,e.length=0,n.length=0,s.length=0}function o(u){e.push(u)}function a(u){n.push(u)}function l(u){s.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}let f={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function Z_(i){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new nd(i),t.set(s,[a])):r>=o.length?(a=new nd(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var K_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,J_=`uniform sampler2D shadow_pass;
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
}`,j_=[new G(1,0,0),new G(-1,0,0),new G(0,1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1)],Q_=[new G(0,-1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1),new G(0,-1,0),new G(0,-1,0)],id=new Ve,No=new G,Ph=new G;function tv(i,t,e){let n=new so,s=new qt,r=new qt,o=new He,a=new ka,l=new za,c={},h=e.maxTextureSize,f={[ji]:Sn,[Sn]:ji,[fi]:fi},u=new Be({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new qt},radius:{value:4}},vertexShader:K_,fragmentShader:J_}),d=u.clone();d.defines.HORIZONTAL_PASS=1;let m=new pn;m.setAttribute("position",new sn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let M=new Oe(m,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=go;let p=this.type;this.render=function(T,D,v){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;this.type===Qu&&(Qt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=go);let P=i.getRenderTarget(),N=i.getActiveCubeFace(),O=i.getActiveMipmapLevel(),B=i.state;B.setBlending(zn),B.buffers.depth.getReversed()===!0?B.buffers.color.setClear(0,0,0,0):B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);let q=p!==this.type;q&&D.traverse(function(V){V.material&&(Array.isArray(V.material)?V.material.forEach(K=>K.needsUpdate=!0):V.material.needsUpdate=!0)});for(let V=0,K=T.length;V<K;V++){let lt=T[V],at=lt.shadow;if(at===void 0){Qt("WebGLShadowMap:",lt,"has no shadow.");continue}if(at.autoUpdate===!1&&at.needsUpdate===!1)continue;s.copy(at.mapSize);let pt=at.getFrameExtents();s.multiply(pt),r.copy(at.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/pt.x),s.x=r.x*pt.x,at.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/pt.y),s.y=r.y*pt.y,at.mapSize.y=r.y));let ot=i.state.buffers.depth.getReversed();if(at.camera._reversedDepth=ot,at.map===null||q===!0){if(at.map!==null&&(at.map.depthTexture!==null&&(at.map.depthTexture.dispose(),at.map.depthTexture=null),at.map.dispose()),this.type===vr){if(lt.isPointLight){Qt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}at.map=new qe(s.x,s.y,{format:ns,type:Ke,minFilter:Xe,magFilter:Xe,generateMipmaps:!1}),at.map.texture.name=lt.name+".shadowMap",at.map.depthTexture=new $i(s.x,s.y,ei),at.map.depthTexture.name=lt.name+".shadowMapDepth",at.map.depthTexture.format=hi,at.map.depthTexture.compareFunction=null,at.map.depthTexture.minFilter=rn,at.map.depthTexture.magFilter=rn}else lt.isPointLight?(at.map=new Wl(s.x),at.map.depthTexture=new Ba(s.x,ti)):(at.map=new qe(s.x,s.y),at.map.depthTexture=new $i(s.x,s.y,ti)),at.map.depthTexture.name=lt.name+".shadowMap",at.map.depthTexture.format=hi,this.type===go?(at.map.depthTexture.compareFunction=ot?zl:kl,at.map.depthTexture.minFilter=Xe,at.map.depthTexture.magFilter=Xe):(at.map.depthTexture.compareFunction=null,at.map.depthTexture.minFilter=rn,at.map.depthTexture.magFilter=rn);at.camera.updateProjectionMatrix()}at.map.isWebGLCubeRenderTarget!==!0&&(at.map.width!==s.x||at.map.height!==s.y)&&at.map.setSize(s.x,s.y);let ut=at.map.isWebGLCubeRenderTarget?6:at.getViewportCount();lt.isPointLight!==!0&&at.updateMatrices(lt,v);for(let dt=0;dt<ut;dt++){let $t=at.getCamera(dt);if(lt.isPointLight){let Xt=at.camera,we=at.matrix,fe=lt.distance||Xt.far;fe!==Xt.far&&(Xt.far=fe,Xt.updateProjectionMatrix()),No.setFromMatrixPosition(lt.matrixWorld),Xt.position.copy(No),Ph.copy(Xt.position),Ph.add(j_[dt]),Xt.up.copy(Q_[dt]),Xt.lookAt(Ph),Xt.updateMatrixWorld(),we.makeTranslation(-No.x,-No.y,-No.z),id.multiplyMatrices(Xt.projectionMatrix,Xt.matrixWorldInverse),at._frustum.setFromProjectionMatrix(id,Xt.coordinateSystem,Xt.reversedDepth)}if(at.map.isWebGLCubeRenderTarget)i.setRenderTarget(at.map,dt),i.clear();else{dt===0&&(i.setRenderTarget(at.map),i.clear());let Xt=at.getViewport(dt);o.set(r.x*Xt.x,r.y*Xt.y,r.x*Xt.z,r.y*Xt.w),B.viewport(o)}n=at.getFrustum(dt),A(D,v,$t,lt,this.type)}at.isPointLightShadow!==!0&&this.type===vr&&I(at,v),at.needsUpdate=!1}p=this.type,g.needsUpdate=!1,i.setRenderTarget(P,N,O)};function I(T,D){let v=t.update(M);u.defines.VSM_SAMPLES!==T.blurSamples&&(u.defines.VSM_SAMPLES=T.blurSamples,d.defines.VSM_SAMPLES=T.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),T.mapPass===null?T.mapPass=new qe(s.x,s.y,{format:ns,type:Ke}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),u.uniforms.shadow_pass.value=T.map.depthTexture,u.uniforms.resolution.value.set(T.map.width,T.map.height),u.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(D,null,v,u,M,null),d.uniforms.shadow_pass.value=T.mapPass.texture,d.uniforms.resolution.value.set(T.map.width,T.map.height),d.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(D,null,v,d,M,null)}function F(T,D,v,P){let N=null,O=v.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(O!==void 0)N=O;else if(N=v.isPointLight===!0?l:a,i.localClippingEnabled&&D.clipShadows===!0&&Array.isArray(D.clippingPlanes)&&D.clippingPlanes.length!==0||D.displacementMap&&D.displacementScale!==0||D.alphaMap&&D.alphaTest>0||D.map&&D.alphaTest>0||D.alphaToCoverage===!0){let B=N.uuid,q=D.uuid,V=c[B];V===void 0&&(V={},c[B]=V);let K=V[q];K===void 0&&(K=N.clone(),V[q]=K,D.addEventListener("dispose",b)),N=K}if(N.visible=D.visible,N.wireframe=D.wireframe,P===vr?N.side=D.shadowSide!==null?D.shadowSide:D.side:N.side=D.shadowSide!==null?D.shadowSide:f[D.side],N.alphaMap=D.alphaMap,N.alphaTest=D.alphaToCoverage===!0?.5:D.alphaTest,N.map=D.map,N.clipShadows=D.clipShadows,N.clippingPlanes=D.clippingPlanes,N.clipIntersection=D.clipIntersection,N.displacementMap=D.displacementMap,N.displacementScale=D.displacementScale,N.displacementBias=D.displacementBias,N.wireframeLinewidth=D.wireframeLinewidth,N.linewidth=D.linewidth,v.isPointLight===!0&&N.isMeshDistanceMaterial===!0){let B=i.properties.get(N);B.light=v}return N}function A(T,D,v,P,N){if(T.visible===!1)return;if(T.layers.test(D.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&N===vr)&&(!T.frustumCulled||T.intersectsFrustum(n))){T.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,T.matrixWorld);let q=t.update(T),V=T.material;if(Array.isArray(V)){let K=q.groups;for(let lt=0,at=K.length;lt<at;lt++){let pt=K[lt],ot=V[pt.materialIndex];if(ot&&ot.visible){let ut=F(T,ot,P,N);T.onBeforeShadow(i,T,D,v,q,ut,pt),i.renderBufferDirect(v,null,q,ut,T,pt),T.onAfterShadow(i,T,D,v,q,ut,pt)}}}else if(V.visible){let K=F(T,V,P,N);T.onBeforeShadow(i,T,D,v,q,K,null),i.renderBufferDirect(v,null,q,K,T,null),T.onAfterShadow(i,T,D,v,q,K,null)}}let B=T.children;for(let q=0,V=B.length;q<V;q++)A(B[q],D,v,P,N)}function b(T){T.target.removeEventListener("dispose",b);for(let v in c){let P=c[v],N=T.target.uuid;N in P&&(P[N].dispose(),delete P[N])}}}function ev(i,t){function e(){let z=!1,At=new He,ht=null,Ct=new He(0,0,0,0);return{setMask:function(Et){ht!==Et&&!z&&(i.colorMask(Et,Et,Et,Et),ht=Et)},setLocked:function(Et){z=Et},setClear:function(Et,st,yt,Tt,ye){ye===!0&&(Et*=Tt,st*=Tt,yt*=Tt),At.set(Et,st,yt,Tt),Ct.equals(At)===!1&&(i.clearColor(Et,st,yt,Tt),Ct.copy(At))},reset:function(){z=!1,ht=null,Ct.set(-1,0,0,0)}}}function n(){let z=!1,At=!1,ht=null,Ct=null,Et=null;return{setReversed:function(st){if(At!==st){let yt=t.get("EXT_clip_control");st?yt.clipControlEXT(yt.LOWER_LEFT_EXT,yt.ZERO_TO_ONE_EXT):yt.clipControlEXT(yt.LOWER_LEFT_EXT,yt.NEGATIVE_ONE_TO_ONE_EXT),At=st;let Tt=Et;Et=null,this.setClear(Tt)}},getReversed:function(){return At},setTest:function(st){st?tt(i.DEPTH_TEST):Mt(i.DEPTH_TEST)},setMask:function(st){ht!==st&&!z&&(i.depthMask(st),ht=st)},setFunc:function(st){if(At&&(st=Df[st]),Ct!==st){switch(st){case wa:i.depthFunc(i.NEVER);break;case Ta:i.depthFunc(i.ALWAYS);break;case Aa:i.depthFunc(i.LESS);break;case cr:i.depthFunc(i.LEQUAL);break;case Ea:i.depthFunc(i.EQUAL);break;case Ca:i.depthFunc(i.GEQUAL);break;case Ra:i.depthFunc(i.GREATER);break;case Pa:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Ct=st}},setLocked:function(st){z=st},setClear:function(st){Et!==st&&(Et=st,At&&(st=1-st),i.clearDepth(st))},reset:function(){z=!1,ht=null,Ct=null,Et=null,At=!1}}}function s(){let z=!1,At=null,ht=null,Ct=null,Et=null,st=null,yt=null,Tt=null,ye=null;return{setTest:function(Me){z||(Me?tt(i.STENCIL_TEST):Mt(i.STENCIL_TEST))},setMask:function(Me){At!==Me&&!z&&(i.stencilMask(Me),At=Me)},setFunc:function(Me,se,Ye){(ht!==Me||Ct!==se||Et!==Ye)&&(i.stencilFunc(Me,se,Ye),ht=Me,Ct=se,Et=Ye)},setOp:function(Me,se,Ye){(st!==Me||yt!==se||Tt!==Ye)&&(i.stencilOp(Me,se,Ye),st=Me,yt=se,Tt=Ye)},setLocked:function(Me){z=Me},setClear:function(Me){ye!==Me&&(i.clearStencil(Me),ye=Me)},reset:function(){z=!1,At=null,ht=null,Ct=null,Et=null,st=null,yt=null,Tt=null,ye=null}}}let r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},f={},u={},d=new WeakMap,m=[],M=null,g=!1,p=null,I=null,F=null,A=null,b=null,T=null,D=null,v=new ce(0,0,0),P=0,N=!1,O=null,B=null,q=null,V=null,K=null,lt=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),at=!1,pt=0,ot=i.getParameter(i.VERSION);ot.indexOf("WebGL")!==-1?(pt=parseFloat(/^WebGL (\d)/.exec(ot)[1]),at=pt>=1):ot.indexOf("OpenGL ES")!==-1&&(pt=parseFloat(/^OpenGL ES (\d)/.exec(ot)[1]),at=pt>=2);let ut=null,dt={},$t=i.getParameter(i.SCISSOR_BOX),Xt=i.getParameter(i.VIEWPORT),we=new He().fromArray($t),fe=new He().fromArray(Xt);function ve(z,At,ht,Ct){let Et=new Uint8Array(4),st=i.createTexture();i.bindTexture(z,st),i.texParameteri(z,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(z,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let yt=0;yt<ht;yt++)z===i.TEXTURE_3D||z===i.TEXTURE_2D_ARRAY?i.texImage3D(At,0,i.RGBA,1,1,Ct,0,i.RGBA,i.UNSIGNED_BYTE,Et):i.texImage2D(At+yt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Et);return st}let W={};W[i.TEXTURE_2D]=ve(i.TEXTURE_2D,i.TEXTURE_2D,1),W[i.TEXTURE_CUBE_MAP]=ve(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),W[i.TEXTURE_2D_ARRAY]=ve(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),W[i.TEXTURE_3D]=ve(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),tt(i.DEPTH_TEST),o.setFunc(cr),Jt(!1),ie(Jc),tt(i.CULL_FACE),ne(zn);function tt(z){h[z]!==!0&&(i.enable(z),h[z]=!0)}function Mt(z){h[z]!==!1&&(i.disable(z),h[z]=!1)}function bt(z,At){return u[z]!==At?(i.bindFramebuffer(z,At),u[z]=At,z===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=At),z===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=At),!0):!1}function xt(z,At){let ht=m,Ct=!1;if(z){ht=d.get(At),ht===void 0&&(ht=[],d.set(At,ht));let Et=z.textures;if(ht.length!==Et.length||ht[0]!==i.COLOR_ATTACHMENT0){for(let st=0,yt=Et.length;st<yt;st++)ht[st]=i.COLOR_ATTACHMENT0+st;ht.length=Et.length,Ct=!0}}else ht[0]!==i.BACK&&(ht[0]=i.BACK,Ct=!0);Ct&&i.drawBuffers(ht)}function Bt(z){return M!==z?(i.useProgram(z),M=z,!0):!1}let Ne={[di]:i.FUNC_ADD,[tf]:i.FUNC_SUBTRACT,[ef]:i.FUNC_REVERSE_SUBTRACT};Ne[nf]=i.MIN,Ne[sf]=i.MAX;let jt={[rf]:i.ZERO,[_o]:i.ONE,[of]:i.SRC_COLOR,[th]:i.SRC_ALPHA,[ff]:i.SRC_ALPHA_SATURATE,[hf]:i.DST_COLOR,[lf]:i.DST_ALPHA,[af]:i.ONE_MINUS_SRC_COLOR,[Mr]:i.ONE_MINUS_SRC_ALPHA,[uf]:i.ONE_MINUS_DST_COLOR,[cf]:i.ONE_MINUS_DST_ALPHA,[df]:i.CONSTANT_COLOR,[pf]:i.ONE_MINUS_CONSTANT_COLOR,[mf]:i.CONSTANT_ALPHA,[gf]:i.ONE_MINUS_CONSTANT_ALPHA};function ne(z,At,ht,Ct,Et,st,yt,Tt,ye,Me){if(z===zn){g===!0&&(Mt(i.BLEND),g=!1);return}if(g===!1&&(tt(i.BLEND),g=!0),z!==xo){if(z!==p||Me!==N){if((I!==di||b!==di)&&(i.blendEquation(i.FUNC_ADD),I=di,b=di),Me)switch(z){case yr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case As:i.blendFunc(i.ONE,i.ONE);break;case jc:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Qc:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:te("WebGLState: Invalid blending: ",z);break}else switch(z){case yr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case As:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case jc:te("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Qc:te("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:te("WebGLState: Invalid blending: ",z);break}F=null,A=null,T=null,D=null,v.set(0,0,0),P=0,p=z,N=Me}return}Et=Et||At,st=st||ht,yt=yt||Ct,(At!==I||Et!==b)&&(i.blendEquationSeparate(Ne[At],Ne[Et]),I=At,b=Et),(ht!==F||Ct!==A||st!==T||yt!==D)&&(i.blendFuncSeparate(jt[ht],jt[Ct],jt[st],jt[yt]),F=ht,A=Ct,T=st,D=yt),(Tt.equals(v)===!1||ye!==P)&&(i.blendColor(Tt.r,Tt.g,Tt.b,ye),v.copy(Tt),P=ye),p=z,N=!1}function de(z,At){z.side===fi?Mt(i.CULL_FACE):tt(i.CULL_FACE);let ht=z.side===Sn;At&&(ht=!ht),Jt(ht),z.blending===yr&&z.transparent===!1?ne(zn):ne(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),o.setFunc(z.depthFunc),o.setTest(z.depthTest),o.setMask(z.depthWrite),r.setMask(z.colorWrite);let Ct=z.stencilWrite;a.setTest(Ct),Ct&&(a.setMask(z.stencilWriteMask),a.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),a.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),xe(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?tt(i.SAMPLE_ALPHA_TO_COVERAGE):Mt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Jt(z){O!==z&&(z?i.frontFace(i.CW):i.frontFace(i.CCW),O=z)}function ie(z){z!==Ju?(tt(i.CULL_FACE),z!==B&&(z===Jc?i.cullFace(i.BACK):z===ju?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Mt(i.CULL_FACE),B=z}function ke(z){z!==q&&(at&&i.lineWidth(z),q=z)}function xe(z,At,ht){z?(tt(i.POLYGON_OFFSET_FILL),(V!==At||K!==ht)&&(V=At,K=ht,o.getReversed()&&(At=-At),i.polygonOffset(At,ht))):Mt(i.POLYGON_OFFSET_FILL)}function Te(z){z?tt(i.SCISSOR_TEST):Mt(i.SCISSOR_TEST)}function Pe(z){z===void 0&&(z=i.TEXTURE0+lt-1),ut!==z&&(i.activeTexture(z),ut=z)}function C(z,At,ht){ht===void 0&&(ut===null?ht=i.TEXTURE0+lt-1:ht=ut);let Ct=dt[ht];Ct===void 0&&(Ct={type:void 0,texture:void 0},dt[ht]=Ct),(Ct.type!==z||Ct.texture!==At)&&(ut!==ht&&(i.activeTexture(ht),ut=ht),i.bindTexture(z,At||W[z]),Ct.type=z,Ct.texture=At)}function gt(){let z=dt[ut];z!==void 0&&z.type!==void 0&&(i.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function It(){try{i.compressedTexImage2D(...arguments)}catch(z){te("WebGLState:",z)}}function R(){try{i.compressedTexImage3D(...arguments)}catch(z){te("WebGLState:",z)}}function x(){try{i.texSubImage2D(...arguments)}catch(z){te("WebGLState:",z)}}function H(){try{i.texSubImage3D(...arguments)}catch(z){te("WebGLState:",z)}}function E(){try{i.compressedTexSubImage2D(...arguments)}catch(z){te("WebGLState:",z)}}function X(){try{i.compressedTexSubImage3D(...arguments)}catch(z){te("WebGLState:",z)}}function ft(){try{i.texStorage2D(...arguments)}catch(z){te("WebGLState:",z)}}function Y(){try{i.texStorage3D(...arguments)}catch(z){te("WebGLState:",z)}}function nt(){try{i.texImage2D(...arguments)}catch(z){te("WebGLState:",z)}}function it(){try{i.texImage3D(...arguments)}catch(z){te("WebGLState:",z)}}function wt(z){return f[z]!==void 0?f[z]:i.getParameter(z)}function Nt(z,At){f[z]!==At&&(i.pixelStorei(z,At),f[z]=At)}function Pt(z){we.equals(z)===!1&&(i.scissor(z.x,z.y,z.z,z.w),we.copy(z))}function ct(z){fe.equals(z)===!1&&(i.viewport(z.x,z.y,z.z,z.w),fe.copy(z))}function Yt(z,At){let ht=c.get(At);ht===void 0&&(ht=new WeakMap,c.set(At,ht));let Ct=ht.get(z);Ct===void 0&&(Ct=i.getUniformBlockIndex(At,z.name),ht.set(z,Ct))}function Kt(z,At){let Ct=c.get(At).get(z);l.get(At)!==Ct&&(i.uniformBlockBinding(At,Ct,z.__bindingPointIndex),l.set(At,Ct))}function Zt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},f={},ut=null,dt={},u={},d=new WeakMap,m=[],M=null,g=!1,p=null,I=null,F=null,A=null,b=null,T=null,D=null,v=new ce(0,0,0),P=0,N=!1,O=null,B=null,q=null,V=null,K=null,we.set(0,0,i.canvas.width,i.canvas.height),fe.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:tt,disable:Mt,bindFramebuffer:bt,drawBuffers:xt,useProgram:Bt,setBlending:ne,setMaterial:de,setFlipSided:Jt,setCullFace:ie,setLineWidth:ke,setPolygonOffset:xe,setScissorTest:Te,activeTexture:Pe,bindTexture:C,unbindTexture:gt,compressedTexImage2D:It,compressedTexImage3D:R,texImage2D:nt,texImage3D:it,pixelStorei:Nt,getParameter:wt,updateUBOMapping:Yt,uniformBlockBinding:Kt,texStorage2D:ft,texStorage3D:Y,texSubImage2D:x,texSubImage3D:H,compressedTexSubImage2D:E,compressedTexSubImage3D:X,scissor:Pt,viewport:ct,reset:Zt}}function nv(i,t,e,n,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new qt,h=new WeakMap,f=new Set,u,d=new WeakMap,m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function M(R,x){return m?new OffscreenCanvas(R,x):hr("canvas")}function g(R,x,H){let E=1,X=It(R);if((X.width>H||X.height>H)&&(E=H/Math.max(X.width,X.height)),E<1)if(typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&R instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&R instanceof ImageBitmap||typeof VideoFrame<"u"&&R instanceof VideoFrame){let ft=Math.floor(E*X.width),Y=Math.floor(E*X.height);u===void 0&&(u=M(ft,Y));let nt=x?M(ft,Y):u;return nt.width=ft,nt.height=Y,nt.getContext("2d").drawImage(R,0,0,ft,Y),Qt("WebGLRenderer: Texture has been resized from ("+X.width+"x"+X.height+") to ("+ft+"x"+Y+")."),nt}else return"data"in R&&Qt("WebGLRenderer: Image in DataTexture is too big ("+X.width+"x"+X.height+")."),R;return R}function p(R){return R.generateMipmaps}function I(R){i.generateMipmap(R)}function F(R){return R.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:R.isWebGL3DRenderTarget?i.TEXTURE_3D:R.isWebGLArrayRenderTarget||R.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function A(R,x,H,E,X,ft=!1){if(R!==null){if(i[R]!==void 0)return i[R];Qt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+R+"'")}let Y;E&&(Y=t.get("EXT_texture_norm16"),Y||Qt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let nt=x;if(x===i.RED&&(H===i.FLOAT&&(nt=i.R32F),H===i.HALF_FLOAT&&(nt=i.R16F),H===i.UNSIGNED_BYTE&&(nt=i.R8),H===i.UNSIGNED_SHORT&&Y&&(nt=Y.R16_EXT),H===i.SHORT&&Y&&(nt=Y.R16_SNORM_EXT)),x===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(nt=i.R8UI),H===i.UNSIGNED_SHORT&&(nt=i.R16UI),H===i.UNSIGNED_INT&&(nt=i.R32UI),H===i.BYTE&&(nt=i.R8I),H===i.SHORT&&(nt=i.R16I),H===i.INT&&(nt=i.R32I)),x===i.RG&&(H===i.FLOAT&&(nt=i.RG32F),H===i.HALF_FLOAT&&(nt=i.RG16F),H===i.UNSIGNED_BYTE&&(nt=i.RG8),H===i.UNSIGNED_SHORT&&Y&&(nt=Y.RG16_EXT),H===i.SHORT&&Y&&(nt=Y.RG16_SNORM_EXT)),x===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(nt=i.RG8UI),H===i.UNSIGNED_SHORT&&(nt=i.RG16UI),H===i.UNSIGNED_INT&&(nt=i.RG32UI),H===i.BYTE&&(nt=i.RG8I),H===i.SHORT&&(nt=i.RG16I),H===i.INT&&(nt=i.RG32I)),x===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(nt=i.RGB8UI),H===i.UNSIGNED_SHORT&&(nt=i.RGB16UI),H===i.UNSIGNED_INT&&(nt=i.RGB32UI),H===i.BYTE&&(nt=i.RGB8I),H===i.SHORT&&(nt=i.RGB16I),H===i.INT&&(nt=i.RGB32I)),x===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(nt=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(nt=i.RGBA16UI),H===i.UNSIGNED_INT&&(nt=i.RGBA32UI),H===i.BYTE&&(nt=i.RGBA8I),H===i.SHORT&&(nt=i.RGBA16I),H===i.INT&&(nt=i.RGBA32I)),x===i.RGB&&(H===i.UNSIGNED_SHORT&&Y&&(nt=Y.RGB16_EXT),H===i.SHORT&&Y&&(nt=Y.RGB16_SNORM_EXT),H===i.UNSIGNED_INT_5_9_9_9_REV&&(nt=i.RGB9_E5),H===i.UNSIGNED_INT_10F_11F_11F_REV&&(nt=i.R11F_G11F_B10F)),x===i.RGBA){let it=ft?Jr:pe.getTransfer(X);H===i.FLOAT&&(nt=i.RGBA32F),H===i.HALF_FLOAT&&(nt=i.RGBA16F),H===i.UNSIGNED_BYTE&&(nt=it===be?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT&&Y&&(nt=Y.RGBA16_EXT),H===i.SHORT&&Y&&(nt=Y.RGBA16_SNORM_EXT),H===i.UNSIGNED_SHORT_4_4_4_4&&(nt=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(nt=i.RGB5_A1)}return(nt===i.R16F||nt===i.R32F||nt===i.RG16F||nt===i.RG32F||nt===i.RGBA16F||nt===i.RGBA32F)&&t.get("EXT_color_buffer_float"),nt}function b(R,x){let H;return R?x===null||x===ti||x===br?H=i.DEPTH24_STENCIL8:x===ei?H=i.DEPTH32F_STENCIL8:x===Sr&&(H=i.DEPTH24_STENCIL8,Qt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===ti||x===br?H=i.DEPTH_COMPONENT24:x===ei?H=i.DEPTH_COMPONENT32F:x===Sr&&(H=i.DEPTH_COMPONENT16),H}function T(R,x){return p(R)===!0||R.isFramebufferTexture&&R.minFilter!==rn&&R.minFilter!==Xe?Math.log2(Math.max(x.width,x.height))+1:R.mipmaps!==void 0&&R.mipmaps.length>0?R.mipmaps.length:R.isCompressedTexture&&Array.isArray(R.image)?x.mipmaps.length:1}function D(R){let x=R.target;x.removeEventListener("dispose",D),P(x),x.isVideoTexture&&h.delete(x),x.isHTMLTexture&&f.delete(x)}function v(R){let x=R.target;x.removeEventListener("dispose",v),O(x)}function P(R){let x=n.get(R);if(x.__webglInit===void 0)return;let H=R.source,E=d.get(H);if(E){let X=E[x.__cacheKey];X.usedTimes--,X.usedTimes===0&&N(R),Object.keys(E).length===0&&d.delete(H)}n.remove(R)}function N(R){let x=n.get(R);i.deleteTexture(x.__webglTexture);let H=R.source,E=d.get(H);delete E[x.__cacheKey],o.memory.textures--}function O(R){let x=n.get(R);if(R.depthTexture&&(R.depthTexture.dispose(),n.remove(R.depthTexture)),R.isWebGLCubeRenderTarget)for(let E=0;E<6;E++){if(Array.isArray(x.__webglFramebuffer[E]))for(let X=0;X<x.__webglFramebuffer[E].length;X++)i.deleteFramebuffer(x.__webglFramebuffer[E][X]);else i.deleteFramebuffer(x.__webglFramebuffer[E]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[E])}else{if(Array.isArray(x.__webglFramebuffer))for(let E=0;E<x.__webglFramebuffer.length;E++)i.deleteFramebuffer(x.__webglFramebuffer[E]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let E=0;E<x.__webglColorRenderbuffer.length;E++)x.__webglColorRenderbuffer[E]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[E]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let H=R.textures;for(let E=0,X=H.length;E<X;E++){let ft=n.get(H[E]);ft.__webglTexture&&(i.deleteTexture(ft.__webglTexture),o.memory.textures--),n.remove(H[E])}n.remove(R)}let B=0;function q(){B=0}function V(){return B}function K(R){B=R}function lt(){let R=B;return R>=s.maxTextures&&Qt("WebGLTextures: Trying to use "+(R+1)+" texture units while this GPU supports only "+s.maxTextures),B+=1,R}function at(R){let x=[];return x.push(R.wrapS),x.push(R.wrapT),x.push(R.wrapR||0),x.push(R.magFilter),x.push(R.minFilter),x.push(R.anisotropy),x.push(R.internalFormat),x.push(R.format),x.push(R.type),x.push(R.generateMipmaps),x.push(R.premultiplyAlpha),x.push(R.flipY),x.push(R.unpackAlignment),x.push(R.colorSpace),x.join()}function pt(R,x){let H=n.get(R);if(R.isVideoTexture&&C(R),R.isRenderTargetTexture===!1&&R.isExternalTexture!==!0&&R.version>0&&H.__version!==R.version){let E=R.image;if(E===null)Qt("WebGLRenderer: Texture marked for update but no image data found.");else if(E.complete===!1)Qt("WebGLRenderer: Texture marked for update but image is incomplete");else{Mt(H,R,x);return}}else R.isExternalTexture&&(H.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+x)}function ot(R,x){let H=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&H.__version!==R.version){Mt(H,R,x);return}else R.isExternalTexture&&(H.__webglTexture=R.sourceTexture?R.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+x)}function ut(R,x){let H=n.get(R);if(R.isRenderTargetTexture===!1&&R.version>0&&H.__version!==R.version){Mt(H,R,x);return}e.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+x)}function dt(R,x){let H=n.get(R);if(R.isCubeDepthTexture!==!0&&R.version>0&&H.__version!==R.version){bt(H,R,x);return}e.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+x)}let $t={[Ia]:i.REPEAT,[ci]:i.CLAMP_TO_EDGE,[La]:i.MIRRORED_REPEAT},Xt={[rn]:i.NEAREST,[vf]:i.NEAREST_MIPMAP_NEAREST,[Ao]:i.NEAREST_MIPMAP_LINEAR,[Xe]:i.LINEAR,[nl]:i.LINEAR_MIPMAP_NEAREST,[ts]:i.LINEAR_MIPMAP_LINEAR},we={[bf]:i.NEVER,[Cf]:i.ALWAYS,[wf]:i.LESS,[kl]:i.LEQUAL,[Tf]:i.EQUAL,[zl]:i.GEQUAL,[Af]:i.GREATER,[Ef]:i.NOTEQUAL};function fe(R,x){if(x.type===ei&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===Xe||x.magFilter===nl||x.magFilter===Ao||x.magFilter===ts||x.minFilter===Xe||x.minFilter===nl||x.minFilter===Ao||x.minFilter===ts)&&Qt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(R,i.TEXTURE_WRAP_S,$t[x.wrapS]),i.texParameteri(R,i.TEXTURE_WRAP_T,$t[x.wrapT]),(R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY)&&i.texParameteri(R,i.TEXTURE_WRAP_R,$t[x.wrapR]),i.texParameteri(R,i.TEXTURE_MAG_FILTER,Xt[x.magFilter]),i.texParameteri(R,i.TEXTURE_MIN_FILTER,Xt[x.minFilter]),x.compareFunction&&(i.texParameteri(R,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(R,i.TEXTURE_COMPARE_FUNC,we[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===rn||x.minFilter!==Ao&&x.minFilter!==ts||x.type===ei&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){let H=t.get("EXT_texture_filter_anisotropic");i.texParameterf(R,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function ve(R,x){let H=!1;R.__webglInit===void 0&&(R.__webglInit=!0,x.addEventListener("dispose",D));let E=x.source,X=d.get(E);X===void 0&&(X={},d.set(E,X));let ft=at(x);if(ft!==R.__cacheKey){X[ft]===void 0&&(X[ft]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,H=!0),X[ft].usedTimes++;let Y=X[R.__cacheKey];Y!==void 0&&(X[R.__cacheKey].usedTimes--,Y.usedTimes===0&&N(x)),R.__cacheKey=ft,R.__webglTexture=X[ft].texture}return H}function W(R,x,H){return Math.floor(Math.floor(R/H)/x)}function tt(R,x,H,E){let ft=R.updateRanges;if(ft.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,x.width,x.height,H,E,x.data);else{ft.sort((Nt,Pt)=>Nt.start-Pt.start);let Y=0;for(let Nt=1;Nt<ft.length;Nt++){let Pt=ft[Y],ct=ft[Nt],Yt=Pt.start+Pt.count,Kt=W(ct.start,x.width,4),Zt=W(Pt.start,x.width,4);ct.start<=Yt+1&&Kt===Zt&&W(ct.start+ct.count-1,x.width,4)===Kt?Pt.count=Math.max(Pt.count,ct.start+ct.count-Pt.start):(++Y,ft[Y]=ct)}ft.length=Y+1;let nt=e.getParameter(i.UNPACK_ROW_LENGTH),it=e.getParameter(i.UNPACK_SKIP_PIXELS),wt=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,x.width);for(let Nt=0,Pt=ft.length;Nt<Pt;Nt++){let ct=ft[Nt],Yt=Math.floor(ct.start/4),Kt=Math.ceil(ct.count/4),Zt=Yt%x.width,z=Math.floor(Yt/x.width),At=Kt,ht=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,Zt),e.pixelStorei(i.UNPACK_SKIP_ROWS,z),e.texSubImage2D(i.TEXTURE_2D,0,Zt,z,At,ht,H,E,x.data)}R.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,nt),e.pixelStorei(i.UNPACK_SKIP_PIXELS,it),e.pixelStorei(i.UNPACK_SKIP_ROWS,wt)}}function Mt(R,x,H){let E=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(E=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(E=i.TEXTURE_3D);let X=ve(R,x),ft=x.source;e.bindTexture(E,R.__webglTexture,i.TEXTURE0+H);let Y=n.get(ft);if(ft.version!==Y.__version||X===!0){if(e.activeTexture(i.TEXTURE0+H),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){let ht=pe.getPrimaries(pe.workingColorSpace),Ct=x.colorSpace===Ii?null:pe.getPrimaries(x.colorSpace),Et=x.colorSpace===Ii||ht===Ct?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Et)}e.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment);let it=g(x.image,!1,s.maxTextureSize);it=gt(x,it);let wt=r.convert(x.format,x.colorSpace),Nt=r.convert(x.type),Pt=A(x.internalFormat,wt,Nt,x.normalized,x.colorSpace,x.isVideoTexture);fe(E,x);let ct,Yt=x.mipmaps,Kt=x.isVideoTexture!==!0,Zt=Y.__version===void 0||X===!0,z=ft.dataReady,At=T(x,it);if(x.isDepthTexture)Pt=b(x.format===es,x.type),Zt&&(Kt?e.texStorage2D(i.TEXTURE_2D,1,Pt,it.width,it.height):e.texImage2D(i.TEXTURE_2D,0,Pt,it.width,it.height,0,wt,Nt,null));else if(x.isDataTexture)if(Yt.length>0){Kt&&Zt&&e.texStorage2D(i.TEXTURE_2D,At,Pt,Yt[0].width,Yt[0].height);for(let ht=0,Ct=Yt.length;ht<Ct;ht++)ct=Yt[ht],Kt?z&&e.texSubImage2D(i.TEXTURE_2D,ht,0,0,ct.width,ct.height,wt,Nt,ct.data):e.texImage2D(i.TEXTURE_2D,ht,Pt,ct.width,ct.height,0,wt,Nt,ct.data);x.generateMipmaps=!1}else Kt?(Zt&&e.texStorage2D(i.TEXTURE_2D,At,Pt,it.width,it.height),z&&tt(x,it,wt,Nt)):e.texImage2D(i.TEXTURE_2D,0,Pt,it.width,it.height,0,wt,Nt,it.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Kt&&Zt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,At,Pt,Yt[0].width,Yt[0].height,it.depth);for(let ht=0,Ct=Yt.length;ht<Ct;ht++)if(ct=Yt[ht],x.format!==mn)if(wt!==null)if(Kt){if(z)if(x.layerUpdates.size>0){let Et=vh(ct.width,ct.height,x.format,x.type);for(let st of x.layerUpdates){let yt=ct.data.subarray(st*Et/ct.data.BYTES_PER_ELEMENT,(st+1)*Et/ct.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ht,0,0,st,ct.width,ct.height,1,wt,yt)}}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ht,0,0,0,ct.width,ct.height,it.depth,wt,ct.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ht,Pt,ct.width,ct.height,it.depth,0,ct.data,0,0);else Qt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Kt?z&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,ht,0,0,0,ct.width,ct.height,it.depth,wt,Nt,ct.data):e.texImage3D(i.TEXTURE_2D_ARRAY,ht,Pt,ct.width,ct.height,it.depth,0,wt,Nt,ct.data);x.layerUpdates.size>0&&x.clearLayerUpdates()}else{Kt&&Zt&&e.texStorage2D(i.TEXTURE_2D,At,Pt,Yt[0].width,Yt[0].height);for(let ht=0,Ct=Yt.length;ht<Ct;ht++)ct=Yt[ht],x.format!==mn?wt!==null?Kt?z&&e.compressedTexSubImage2D(i.TEXTURE_2D,ht,0,0,ct.width,ct.height,wt,ct.data):e.compressedTexImage2D(i.TEXTURE_2D,ht,Pt,ct.width,ct.height,0,ct.data):Qt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Kt?z&&e.texSubImage2D(i.TEXTURE_2D,ht,0,0,ct.width,ct.height,wt,Nt,ct.data):e.texImage2D(i.TEXTURE_2D,ht,Pt,ct.width,ct.height,0,wt,Nt,ct.data)}else if(x.isDataArrayTexture)if(Kt){if(Zt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,At,Pt,it.width,it.height,it.depth),z)if(x.layerUpdates.size>0){let ht=vh(it.width,it.height,x.format,x.type);for(let Ct of x.layerUpdates){let Et=it.data.subarray(Ct*ht/it.data.BYTES_PER_ELEMENT,(Ct+1)*ht/it.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Ct,it.width,it.height,1,wt,Nt,Et)}x.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,it.width,it.height,it.depth,wt,Nt,it.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Pt,it.width,it.height,it.depth,0,wt,Nt,it.data);else if(x.isData3DTexture)Kt?(Zt&&e.texStorage3D(i.TEXTURE_3D,At,Pt,it.width,it.height,it.depth),z&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,it.width,it.height,it.depth,wt,Nt,it.data)):e.texImage3D(i.TEXTURE_3D,0,Pt,it.width,it.height,it.depth,0,wt,Nt,it.data);else if(x.isFramebufferTexture){if(Zt)if(Kt)e.texStorage2D(i.TEXTURE_2D,At,Pt,it.width,it.height);else{let ht=it.width,Ct=it.height;for(let Et=0;Et<At;Et++)e.texImage2D(i.TEXTURE_2D,Et,Pt,ht,Ct,0,wt,Nt,null),ht>>=1,Ct>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in i){let ht=i.canvas;if(ht.hasAttribute("layoutsubtree")||ht.setAttribute("layoutsubtree","true"),it.parentNode!==ht){ht.appendChild(it),f.add(x),ht.onpaint=Ct=>{let Et=Ct.changedElements;for(let st of f)Et.includes(st.image)&&(st.needsUpdate=!0)},ht.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,it);else{let Et=i.RGBA,st=i.RGBA,yt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,Et,st,yt,it)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Yt.length>0){if(Kt&&Zt){let ht=It(Yt[0]);e.texStorage2D(i.TEXTURE_2D,At,Pt,ht.width,ht.height)}for(let ht=0,Ct=Yt.length;ht<Ct;ht++)ct=Yt[ht],Kt?z&&e.texSubImage2D(i.TEXTURE_2D,ht,0,0,wt,Nt,ct):e.texImage2D(i.TEXTURE_2D,ht,Pt,wt,Nt,ct);x.generateMipmaps=!1}else if(Kt){if(Zt){let ht=It(it);e.texStorage2D(i.TEXTURE_2D,At,Pt,ht.width,ht.height)}z&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,wt,Nt,it)}else e.texImage2D(i.TEXTURE_2D,0,Pt,wt,Nt,it);p(x)&&I(E),Y.__version=ft.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function bt(R,x,H){if(x.image.length!==6)return;let E=ve(R,x),X=x.source;e.bindTexture(i.TEXTURE_CUBE_MAP,R.__webglTexture,i.TEXTURE0+H);let ft=n.get(X);if(X.version!==ft.__version||E===!0){e.activeTexture(i.TEXTURE0+H);let Y=pe.getPrimaries(pe.workingColorSpace),nt=x.colorSpace===Ii?null:pe.getPrimaries(x.colorSpace),it=x.colorSpace===Ii||Y===nt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,it);let wt=x.isCompressedTexture||x.image[0].isCompressedTexture,Nt=x.image[0]&&x.image[0].isDataTexture,Pt=[];for(let st=0;st<6;st++)!wt&&!Nt?Pt[st]=g(x.image[st],!0,s.maxCubemapSize):Pt[st]=Nt?x.image[st].image:x.image[st],Pt[st]=gt(x,Pt[st]);let ct=Pt[0],Yt=r.convert(x.format,x.colorSpace),Kt=r.convert(x.type),Zt=A(x.internalFormat,Yt,Kt,x.normalized,x.colorSpace),z=x.isVideoTexture!==!0,At=ft.__version===void 0||E===!0,ht=X.dataReady,Ct=T(x,ct);fe(i.TEXTURE_CUBE_MAP,x);let Et;if(wt){z&&At&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Ct,Zt,ct.width,ct.height);for(let st=0;st<6;st++){Et=Pt[st].mipmaps;for(let yt=0;yt<Et.length;yt++){let Tt=Et[yt];x.format!==mn?Yt!==null?z?ht&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,yt,0,0,Tt.width,Tt.height,Yt,Tt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,yt,Zt,Tt.width,Tt.height,0,Tt.data):Qt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):z?ht&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,yt,0,0,Tt.width,Tt.height,Yt,Kt,Tt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,yt,Zt,Tt.width,Tt.height,0,Yt,Kt,Tt.data)}}}else{if(Et=x.mipmaps,z&&At){Et.length>0&&Ct++;let st=It(Pt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,Ct,Zt,st.width,st.height)}for(let st=0;st<6;st++)if(Nt){z?ht&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,Pt[st].width,Pt[st].height,Yt,Kt,Pt[st].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,Zt,Pt[st].width,Pt[st].height,0,Yt,Kt,Pt[st].data);for(let yt=0;yt<Et.length;yt++){let ye=Et[yt].image[st].image;z?ht&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,yt+1,0,0,ye.width,ye.height,Yt,Kt,ye.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,yt+1,Zt,ye.width,ye.height,0,Yt,Kt,ye.data)}}else{z?ht&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,0,0,Yt,Kt,Pt[st]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,0,Zt,Yt,Kt,Pt[st]);for(let yt=0;yt<Et.length;yt++){let Tt=Et[yt];z?ht&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,yt+1,0,0,Yt,Kt,Tt.image[st]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+st,yt+1,Zt,Yt,Kt,Tt.image[st])}}}p(x)&&I(i.TEXTURE_CUBE_MAP),ft.__version=X.version,x.onUpdate&&x.onUpdate(x)}R.__version=x.version}function xt(R,x,H,E,X,ft){let Y=r.convert(H.format,H.colorSpace),nt=r.convert(H.type),it=A(H.internalFormat,Y,nt,H.normalized,H.colorSpace),wt=n.get(x),Nt=n.get(H);if(Nt.__renderTarget=x,!wt.__hasExternalTextures){let Pt=Math.max(1,x.width>>ft),ct=Math.max(1,x.height>>ft);X===i.TEXTURE_3D||X===i.TEXTURE_2D_ARRAY?e.texImage3D(X,ft,it,Pt,ct,x.depth,0,Y,nt,null):e.texImage2D(X,ft,it,Pt,ct,0,Y,nt,null)}e.bindFramebuffer(i.FRAMEBUFFER,R),Pe(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,E,X,Nt.__webglTexture,0,Te(x)):(X===i.TEXTURE_2D||X>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&X<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,E,X,Nt.__webglTexture,ft),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Bt(R,x,H){if(i.bindRenderbuffer(i.RENDERBUFFER,R),x.depthBuffer){let E=x.depthTexture,X=E&&E.isDepthTexture?E.type:null,ft=b(x.stencilBuffer,X),Y=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Pe(x)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Te(x),ft,x.width,x.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,Te(x),ft,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,ft,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Y,i.RENDERBUFFER,R)}else{let E=x.textures;for(let X=0;X<E.length;X++){let ft=E[X],Y=r.convert(ft.format,ft.colorSpace),nt=r.convert(ft.type),it=A(ft.internalFormat,Y,nt,ft.normalized,ft.colorSpace);Pe(x)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Te(x),it,x.width,x.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,Te(x),it,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,it,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ne(R,x,H){let E=x.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,R),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let X=n.get(x.depthTexture);if(X.__renderTarget=x,(!X.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),E){if(X.__webglInit===void 0&&(X.__webglInit=!0,x.depthTexture.addEventListener("dispose",D)),X.__webglTexture===void 0){X.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),fe(i.TEXTURE_CUBE_MAP,x.depthTexture);let wt=r.convert(x.depthTexture.format),Nt=r.convert(x.depthTexture.type),Pt;x.depthTexture.format===hi?Pt=i.DEPTH_COMPONENT24:x.depthTexture.format===es&&(Pt=i.DEPTH24_STENCIL8);for(let ct=0;ct<6;ct++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,Pt,x.width,x.height,0,wt,Nt,null)}}else pt(x.depthTexture,0);let ft=X.__webglTexture,Y=Te(x),nt=E?i.TEXTURE_CUBE_MAP_POSITIVE_X+H:i.TEXTURE_2D,it=x.depthTexture.format===es?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(x.depthTexture.format===hi)Pe(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,it,nt,ft,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,it,nt,ft,0);else if(x.depthTexture.format===es)Pe(x)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,it,nt,ft,0,Y):i.framebufferTexture2D(i.FRAMEBUFFER,it,nt,ft,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function jt(R){let x=n.get(R),H=R.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==R.depthTexture){let E=R.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),E){let X=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,E.removeEventListener("dispose",X)};E.addEventListener("dispose",X),x.__depthDisposeCallback=X}x.__boundDepthTexture=E}if(R.depthTexture&&!x.__autoAllocateDepthBuffer)if(H)for(let E=0;E<6;E++)Ne(x.__webglFramebuffer[E],R,E);else{let E=R.texture.mipmaps;E&&E.length>0?Ne(x.__webglFramebuffer[0],R,0):Ne(x.__webglFramebuffer,R,0)}else if(H){x.__webglDepthbuffer=[];for(let E=0;E<6;E++)if(e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[E]),x.__webglDepthbuffer[E]===void 0)x.__webglDepthbuffer[E]=i.createRenderbuffer(),Bt(x.__webglDepthbuffer[E],R,!1);else{let X=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ft=x.__webglDepthbuffer[E];i.bindRenderbuffer(i.RENDERBUFFER,ft),i.framebufferRenderbuffer(i.FRAMEBUFFER,X,i.RENDERBUFFER,ft)}}else{let E=R.texture.mipmaps;if(E&&E.length>0?e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),Bt(x.__webglDepthbuffer,R,!1);else{let X=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ft=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ft),i.framebufferRenderbuffer(i.FRAMEBUFFER,X,i.RENDERBUFFER,ft)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function ne(R,x,H){let E=n.get(R);x!==void 0&&xt(E.__webglFramebuffer,R,R.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&jt(R)}function de(R){let x=R.texture,H=n.get(R),E=n.get(x);R.addEventListener("dispose",v);let X=R.textures,ft=R.isWebGLCubeRenderTarget===!0,Y=X.length>1;if(Y||(E.__webglTexture===void 0&&(E.__webglTexture=i.createTexture()),E.__version=x.version,o.memory.textures++),ft){H.__webglFramebuffer=[];for(let nt=0;nt<6;nt++)if(x.mipmaps&&x.mipmaps.length>0){H.__webglFramebuffer[nt]=[];for(let it=0;it<x.mipmaps.length;it++)H.__webglFramebuffer[nt][it]=i.createFramebuffer()}else H.__webglFramebuffer[nt]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){H.__webglFramebuffer=[];for(let nt=0;nt<x.mipmaps.length;nt++)H.__webglFramebuffer[nt]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(Y)for(let nt=0,it=X.length;nt<it;nt++){let wt=n.get(X[nt]);wt.__webglTexture===void 0&&(wt.__webglTexture=i.createTexture(),o.memory.textures++)}if(R.samples>0&&Pe(R)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let nt=0;nt<X.length;nt++){let it=X[nt];H.__webglColorRenderbuffer[nt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[nt]);let wt=r.convert(it.format,it.colorSpace),Nt=r.convert(it.type),Pt=A(it.internalFormat,wt,Nt,it.normalized,it.colorSpace,R.isXRRenderTarget===!0),ct=Te(R);i.renderbufferStorageMultisample(i.RENDERBUFFER,ct,Pt,R.width,R.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+nt,i.RENDERBUFFER,H.__webglColorRenderbuffer[nt])}i.bindRenderbuffer(i.RENDERBUFFER,null),R.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),Bt(H.__webglDepthRenderbuffer,R,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ft){e.bindTexture(i.TEXTURE_CUBE_MAP,E.__webglTexture),fe(i.TEXTURE_CUBE_MAP,x);for(let nt=0;nt<6;nt++)if(x.mipmaps&&x.mipmaps.length>0)for(let it=0;it<x.mipmaps.length;it++)xt(H.__webglFramebuffer[nt][it],R,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,it);else xt(H.__webglFramebuffer[nt],R,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0);p(x)&&I(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Y){for(let nt=0,it=X.length;nt<it;nt++){let wt=X[nt],Nt=n.get(wt),Pt=i.TEXTURE_2D;(R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(Pt=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Pt,Nt.__webglTexture),fe(Pt,wt),xt(H.__webglFramebuffer,R,wt,i.COLOR_ATTACHMENT0+nt,Pt,0),p(wt)&&I(Pt)}e.unbindTexture()}else{let nt=i.TEXTURE_2D;if((R.isWebGL3DRenderTarget||R.isWebGLArrayRenderTarget)&&(nt=R.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(nt,E.__webglTexture),fe(nt,x),x.mipmaps&&x.mipmaps.length>0)for(let it=0;it<x.mipmaps.length;it++)xt(H.__webglFramebuffer[it],R,x,i.COLOR_ATTACHMENT0,nt,it);else xt(H.__webglFramebuffer,R,x,i.COLOR_ATTACHMENT0,nt,0);p(x)&&I(nt),e.unbindTexture()}R.depthBuffer&&jt(R)}function Jt(R){let x=R.textures;for(let H=0,E=x.length;H<E;H++){let X=x[H];if(p(X)){let ft=F(R),Y=n.get(X).__webglTexture;e.bindTexture(ft,Y),I(ft),e.unbindTexture()}}}let ie=[],ke=[];function xe(R){if(R.samples>0){if(Pe(R)===!1){let x=R.textures,H=R.width,E=R.height,X=i.COLOR_BUFFER_BIT,ft=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Y=n.get(R),nt=x.length>1;if(nt)for(let wt=0;wt<x.length;wt++)e.bindFramebuffer(i.FRAMEBUFFER,Y.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+wt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Y.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+wt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Y.__webglMultisampledFramebuffer);let it=R.texture.mipmaps;it&&it.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Y.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Y.__webglFramebuffer);for(let wt=0;wt<x.length;wt++){if(R.resolveDepthBuffer&&(R.depthBuffer&&(X|=i.DEPTH_BUFFER_BIT),R.stencilBuffer&&R.resolveStencilBuffer&&(X|=i.STENCIL_BUFFER_BIT)),nt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Y.__webglColorRenderbuffer[wt]);let Nt=n.get(x[wt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Nt,0)}i.blitFramebuffer(0,0,H,E,0,0,H,E,X,i.NEAREST),l===!0&&(ie.length=0,ke.length=0,ie.push(i.COLOR_ATTACHMENT0+wt),R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&(ie.push(ft),ke.push(ft),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ke)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ie))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),nt)for(let wt=0;wt<x.length;wt++){e.bindFramebuffer(i.FRAMEBUFFER,Y.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+wt,i.RENDERBUFFER,Y.__webglColorRenderbuffer[wt]);let Nt=n.get(x[wt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Y.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+wt,i.TEXTURE_2D,Nt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Y.__webglMultisampledFramebuffer)}else if(R.depthBuffer&&R.storeMultisampledDepthBuffer===!1&&l){let x=R.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function Te(R){return Math.min(s.maxSamples,R.samples)}function Pe(R){let x=n.get(R);return R.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function C(R){let x=o.render.frame;h.get(R)!==x&&(h.set(R,x),R.update())}function gt(R,x){let H=R.colorSpace,E=R.format,X=R.type;return R.isCompressedTexture===!0||R.isVideoTexture===!0||H!==Kr&&H!==Ii&&(pe.getTransfer(H)===be?(E!==mn||X!==Un)&&Qt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):te("WebGLTextures: Unsupported texture color space:",H)),x}function It(R){return typeof HTMLImageElement<"u"&&R instanceof HTMLImageElement?(c.width=R.naturalWidth||R.width,c.height=R.naturalHeight||R.height):typeof VideoFrame<"u"&&R instanceof VideoFrame?(c.width=R.displayWidth,c.height=R.displayHeight):(c.width=R.width,c.height=R.height),c}this.allocateTextureUnit=lt,this.resetTextureUnits=q,this.getTextureUnits=V,this.setTextureUnits=K,this.setTexture2D=pt,this.setTexture2DArray=ot,this.setTexture3D=ut,this.setTextureCube=dt,this.rebindTextures=ne,this.setupRenderTarget=de,this.updateRenderTargetMipmap=Jt,this.updateMultisampleRenderTarget=xe,this.setupDepthRenderbuffer=jt,this.setupFrameBufferTexture=xt,this.useMultisampledRTT=Pe,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function iv(i,t){function e(n,s=Ii){let r,o=pe.getTransfer(s);if(n===Un)return i.UNSIGNED_BYTE;if(n===sl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===rl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===rh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===oh)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===ih)return i.BYTE;if(n===sh)return i.SHORT;if(n===Sr)return i.UNSIGNED_SHORT;if(n===il)return i.INT;if(n===ti)return i.UNSIGNED_INT;if(n===ei)return i.FLOAT;if(n===Ke)return i.HALF_FLOAT;if(n===ah)return i.ALPHA;if(n===lh)return i.RGB;if(n===mn)return i.RGBA;if(n===hi)return i.DEPTH_COMPONENT;if(n===es)return i.DEPTH_STENCIL;if(n===ch)return i.RED;if(n===ol)return i.RED_INTEGER;if(n===ns)return i.RG;if(n===al)return i.RG_INTEGER;if(n===ll)return i.RGBA_INTEGER;if(n===Eo||n===Co||n===Ro||n===Po)if(o===be)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Eo)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Co)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ro)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Po)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Eo)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Co)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ro)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Po)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===cl||n===hl||n===ul||n===fl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===cl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===hl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ul)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===fl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===dl||n===pl||n===ml||n===gl||n===xl||n===Io||n===_l)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===dl||n===pl)return o===be?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ml)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===gl)return r.COMPRESSED_R11_EAC;if(n===xl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Io)return r.COMPRESSED_RG11_EAC;if(n===_l)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===vl||n===yl||n===Ml||n===Sl||n===bl||n===wl||n===Tl||n===Al||n===El||n===Cl||n===Rl||n===Pl||n===Il||n===Ll)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===vl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===yl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ml)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Sl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===bl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===wl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Tl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Al)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===El)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Cl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Rl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Pl)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Il)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ll)return o===be?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Dl||n===Nl||n===Ul)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Dl)return o===be?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Nl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ul)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Fl||n===Ol||n===Lo||n===Bl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Fl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Ol)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Lo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Bl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===br?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var sv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,rv=`
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

}`,Bh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new lo(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new Be({vertexShader:sv,fragmentShader:rv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Oe(new Pi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},kh=class extends Jn{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,f=null,u=null,d=null,m=null,M=typeof XRWebGLBinding<"u",g=new Bh,p={},I=e.getContextAttributes(),F=null,A=null,b=[],T=[],D=new qt,v=null,P=null,N=new hn;N.viewport=new He;let O=new hn;O.viewport=new He;let B=[N,O],q=new ja,V=null,K=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let tt=b[W];return tt===void 0&&(tt=new mr,b[W]=tt),tt.getTargetRaySpace()},this.getControllerGrip=function(W){let tt=b[W];return tt===void 0&&(tt=new mr,b[W]=tt),tt.getGripSpace()},this.getHand=function(W){let tt=b[W];return tt===void 0&&(tt=new mr,b[W]=tt),tt.getHandSpace()};function lt(W){let tt=T.indexOf(W.inputSource);if(tt===-1)return;let Mt=b[tt];Mt!==void 0&&(Mt.update(W.inputSource,W.frame,c||o),Mt.dispatchEvent({type:W.type,data:W.inputSource}))}function at(){s.removeEventListener("select",lt),s.removeEventListener("selectstart",lt),s.removeEventListener("selectend",lt),s.removeEventListener("squeeze",lt),s.removeEventListener("squeezestart",lt),s.removeEventListener("squeezeend",lt),s.removeEventListener("end",at),s.removeEventListener("inputsourceschange",pt);for(let W=0;W<b.length;W++){let tt=T[W];tt!==null&&(T[W]=null,b[W].disconnect(tt))}V=null,K=null,g.reset();for(let W in p)delete p[W];if(t.setRenderTarget(F),d=null,u=null,f=null,s=null,A=null,ve.stop(),n.isPresenting=!1,t.setPixelRatio(v),t.setSize(D.width,D.height,!1),P!==null){let W=P.camera;W.fov=P.fov,W.zoom=P.zoom,W.updateProjectionMatrix(),P=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){r=W,n.isPresenting===!0&&Qt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){a=W,n.isPresenting===!0&&Qt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(W){c=W},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f===null&&M&&(f=new XRWebGLBinding(s,e)),f},this.getFrame=function(){return m},this.getSession=function(){return s},this.setSession=async function(W){if(s=W,s!==null){if(F=t.getRenderTarget(),s.addEventListener("select",lt),s.addEventListener("selectstart",lt),s.addEventListener("selectend",lt),s.addEventListener("squeeze",lt),s.addEventListener("squeezestart",lt),s.addEventListener("squeezeend",lt),s.addEventListener("end",at),s.addEventListener("inputsourceschange",pt),I.xrCompatible!==!0&&await e.makeXRCompatible(),v=t.getPixelRatio(),t.getSize(D),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let Mt=null,bt=null,xt=null;I.depth&&(xt=I.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Mt=I.stencil?es:hi,bt=I.stencil?br:ti);let Bt={colorFormat:e.RGBA8,depthFormat:xt,scaleFactor:r};f=this.getBinding(),u=f.createProjectionLayer(Bt),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),A=new qe(u.textureWidth,u.textureHeight,{format:mn,type:Un,depthTexture:new $i(u.textureWidth,u.textureHeight,bt,void 0,void 0,void 0,void 0,void 0,void 0,Mt),stencilBuffer:I.stencil,colorSpace:t.outputColorSpace,samples:I.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let Mt={antialias:I.antialias,alpha:!0,depth:I.depth,stencil:I.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,Mt),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),A=new qe(d.framebufferWidth,d.framebufferHeight,{format:mn,type:Un,colorSpace:t.outputColorSpace,stencilBuffer:I.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}A.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),ve.setContext(s),ve.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function pt(W){for(let tt=0;tt<W.removed.length;tt++){let Mt=W.removed[tt],bt=T.indexOf(Mt);bt>=0&&(T[bt]=null,b[bt].disconnect(Mt))}for(let tt=0;tt<W.added.length;tt++){let Mt=W.added[tt],bt=T.indexOf(Mt);if(bt===-1){for(let Bt=0;Bt<b.length;Bt++)if(Bt>=T.length){T.push(Mt),bt=Bt;break}else if(T[Bt]===null){T[Bt]=Mt,bt=Bt;break}if(bt===-1)break}let xt=b[bt];xt&&xt.connect(Mt)}}let ot=new G,ut=new G;function dt(W,tt,Mt){ot.setFromMatrixPosition(tt.matrixWorld),ut.setFromMatrixPosition(Mt.matrixWorld);let bt=ot.distanceTo(ut),xt=tt.projectionMatrix.elements,Bt=Mt.projectionMatrix.elements,Ne=xt[14]/(xt[10]-1),jt=xt[14]/(xt[10]+1),ne=(xt[9]+1)/xt[5],de=(xt[9]-1)/xt[5],Jt=(xt[8]-1)/xt[0],ie=(Bt[8]+1)/Bt[0],ke=Ne*Jt,xe=Ne*ie,Te=bt/(-Jt+ie),Pe=Te*-Jt;if(tt.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(Pe),W.translateZ(Te),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert(),xt[10]===-1)W.projectionMatrix.copy(tt.projectionMatrix),W.projectionMatrixInverse.copy(tt.projectionMatrixInverse);else{let C=Ne+Te,gt=jt+Te,It=ke-Pe,R=xe+(bt-Pe),x=ne*jt/gt*C,H=de*jt/gt*C;W.projectionMatrix.makePerspective(It,R,x,H,C,gt),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}}function $t(W,tt){tt===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(tt.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(s===null)return;let tt=W.near,Mt=W.far;g.texture!==null&&(g.depthNear>0&&(tt=g.depthNear),g.depthFar>0&&(Mt=g.depthFar)),q.near=O.near=N.near=tt,q.far=O.far=N.far=Mt,(V!==q.near||K!==q.far)&&(s.updateRenderState({depthNear:q.near,depthFar:q.far}),V=q.near,K=q.far),q.layers.mask=W.layers.mask|6,N.layers.mask=q.layers.mask&-5,O.layers.mask=q.layers.mask&-3;let bt=W.parent,xt=q.cameras;$t(q,bt);for(let Bt=0;Bt<xt.length;Bt++)$t(xt[Bt],bt);xt.length===2?dt(q,N,O):q.projectionMatrix.copy(N.projectionMatrix),P===null&&W.isPerspectiveCamera&&(P={camera:W,fov:W.fov,zoom:W.zoom}),Xt(W,q,bt)};function Xt(W,tt,Mt){Mt===null?W.matrix.copy(tt.matrixWorld):(W.matrix.copy(Mt.matrixWorld),W.matrix.invert(),W.matrix.multiply(tt.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(tt.projectionMatrix),W.projectionMatrixInverse.copy(tt.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=fr*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return q},this.getFoveation=function(){if(!(u===null&&d===null))return l},this.setFoveation=function(W){l=W,u!==null&&(u.fixedFoveation=W),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=W)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(q)},this.getCameraTexture=function(W){return p[W]};let we=null;function fe(W,tt){if(h=tt.getViewerPose(c||o),m=tt,h!==null){let Mt=h.views;d!==null&&(t.setRenderTargetFramebuffer(A,d.framebuffer),t.setRenderTarget(A));let bt=!1;Mt.length!==q.cameras.length&&(q.cameras.length=0,bt=!0);for(let jt=0;jt<Mt.length;jt++){let ne=Mt[jt],de=null;if(d!==null)de=d.getViewport(ne);else{let ie=f.getViewSubImage(u,ne);de=ie.viewport,jt===0&&(t.setRenderTargetTextures(A,ie.colorTexture,ie.depthStencilTexture),t.setRenderTarget(A))}let Jt=B[jt];Jt===void 0&&(Jt=new hn,Jt.layers.enable(jt),Jt.viewport=new He,B[jt]=Jt),Jt.matrix.fromArray(ne.transform.matrix),Jt.matrix.decompose(Jt.position,Jt.quaternion,Jt.scale),Jt.projectionMatrix.fromArray(ne.projectionMatrix),Jt.projectionMatrixInverse.copy(Jt.projectionMatrix).invert(),Jt.viewport.set(de.x,de.y,de.width,de.height),jt===0&&(q.matrix.copy(Jt.matrix),q.matrix.decompose(q.position,q.quaternion,q.scale)),bt===!0&&q.cameras.push(Jt)}let xt=s.enabledFeatures;if(xt&&xt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&M){f=n.getBinding();let jt=f.getDepthInformation(Mt[0]);jt&&jt.isValid&&jt.texture&&g.init(jt,s.renderState)}if(xt&&xt.includes("camera-access")&&M){t.state.unbindTexture(),f=n.getBinding();for(let jt=0;jt<Mt.length;jt++){let ne=Mt[jt].camera;if(ne){let de=p[ne];de||(de=new lo,p[ne]=de);let Jt=f.getCameraImage(ne);de.sourceTexture=Jt}}}}for(let Mt=0;Mt<b.length;Mt++){let bt=T[Mt],xt=b[Mt];bt!==null&&xt!==void 0&&xt.update(bt,tt,c||o)}we&&we(W,tt),tt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:tt}),m=null}let ve=new sd;ve.setAnimationLoop(fe),this.setAnimationLoop=function(W){we=W},this.dispose=function(){}}},ov=new Ve,hd=new re;hd.set(-1,0,0,0,1,0,0,0,1);function av(i,t){function e(g,p){g.matrixAutoUpdate===!0&&g.updateMatrix(),p.value.copy(g.matrix)}function n(g,p){p.color.getRGB(g.fogColor.value,gh(i)),p.isFog?(g.fogNear.value=p.near,g.fogFar.value=p.far):p.isFogExp2&&(g.fogDensity.value=p.density)}function s(g,p,I,F,A){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(g,p):p.isMeshLambertMaterial?(r(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(g,p),f(g,p)):p.isMeshPhongMaterial?(r(g,p),h(g,p),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(g,p),u(g,p),p.isMeshPhysicalMaterial&&d(g,p,A)):p.isMeshMatcapMaterial?(r(g,p),m(g,p)):p.isMeshDepthMaterial?r(g,p):p.isMeshDistanceMaterial?(r(g,p),M(g,p)):p.isMeshNormalMaterial?r(g,p):p.isLineBasicMaterial?(o(g,p),p.isLineDashedMaterial&&a(g,p)):p.isPointsMaterial?l(g,p,I,F):p.isSpriteMaterial?c(g,p):p.isShadowMaterial?(g.color.value.copy(p.color),g.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(g,p){g.opacity.value=p.opacity,p.color&&g.diffuse.value.copy(p.color),p.emissive&&g.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.bumpMap&&(g.bumpMap.value=p.bumpMap,e(p.bumpMap,g.bumpMapTransform),g.bumpScale.value=p.bumpScale,p.side===Sn&&(g.bumpScale.value*=-1)),p.normalMap&&(g.normalMap.value=p.normalMap,e(p.normalMap,g.normalMapTransform),g.normalScale.value.copy(p.normalScale),p.side===Sn&&g.normalScale.value.negate()),p.displacementMap&&(g.displacementMap.value=p.displacementMap,e(p.displacementMap,g.displacementMapTransform),g.displacementScale.value=p.displacementScale,g.displacementBias.value=p.displacementBias),p.emissiveMap&&(g.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,g.emissiveMapTransform)),p.specularMap&&(g.specularMap.value=p.specularMap,e(p.specularMap,g.specularMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest);let I=t.get(p),F=I.envMap,A=I.envMapRotation;F&&(g.envMap.value=F,g.envMapRotation.value.setFromMatrix4(ov.makeRotationFromEuler(A)).transpose(),F.isCubeTexture&&F.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(hd),g.reflectivity.value=p.reflectivity,g.ior.value=p.ior,g.refractionRatio.value=p.refractionRatio),p.lightMap&&(g.lightMap.value=p.lightMap,g.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,g.lightMapTransform)),p.aoMap&&(g.aoMap.value=p.aoMap,g.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,g.aoMapTransform))}function o(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform))}function a(g,p){g.dashSize.value=p.dashSize,g.totalSize.value=p.dashSize+p.gapSize,g.scale.value=p.scale}function l(g,p,I,F){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.size.value=p.size*I,g.scale.value=F*.5,p.map&&(g.map.value=p.map,e(p.map,g.uvTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function c(g,p){g.diffuse.value.copy(p.color),g.opacity.value=p.opacity,g.rotation.value=p.rotation,p.map&&(g.map.value=p.map,e(p.map,g.mapTransform)),p.alphaMap&&(g.alphaMap.value=p.alphaMap,e(p.alphaMap,g.alphaMapTransform)),p.alphaTest>0&&(g.alphaTest.value=p.alphaTest)}function h(g,p){g.specular.value.copy(p.specular),g.shininess.value=Math.max(p.shininess,1e-4)}function f(g,p){p.gradientMap&&(g.gradientMap.value=p.gradientMap)}function u(g,p){g.metalness.value=p.metalness,p.metalnessMap&&(g.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,g.metalnessMapTransform)),g.roughness.value=p.roughness,p.roughnessMap&&(g.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,g.roughnessMapTransform)),p.envMap&&(g.envMapIntensity.value=p.envMapIntensity)}function d(g,p,I){g.ior.value=p.ior,p.sheen>0&&(g.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),g.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(g.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,g.sheenColorMapTransform)),p.sheenRoughnessMap&&(g.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,g.sheenRoughnessMapTransform))),p.clearcoat>0&&(g.clearcoat.value=p.clearcoat,g.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(g.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,g.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(g.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Sn&&g.clearcoatNormalScale.value.negate())),p.dispersion>0&&(g.dispersion.value=p.dispersion),p.retroreflectivity>0&&(g.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(g.iridescence.value=p.iridescence,g.iridescenceIOR.value=p.iridescenceIOR,g.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(g.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,g.iridescenceMapTransform)),p.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),p.transmission>0&&(g.transmission.value=p.transmission,g.transmissionSamplerMap.value=I.texture,g.transmissionSamplerSize.value.set(I.width,I.height),p.transmissionMap&&(g.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,g.transmissionMapTransform)),g.thickness.value=p.thickness,p.thicknessMap&&(g.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=p.attenuationDistance,g.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(g.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(g.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=p.specularIntensity,g.specularColor.value.copy(p.specularColor),p.specularColorMap&&(g.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,g.specularColorMapTransform)),p.specularIntensityMap&&(g.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,g.specularIntensityMapTransform))}function m(g,p){p.matcap&&(g.matcap.value=p.matcap)}function M(g,p){let I=t.get(p).light;g.referencePosition.value.setFromMatrixPosition(I.matrixWorld),g.nearDistance.value=I.shadow.camera.near,g.farDistance.value=I.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function lv(i,t,e,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(A,b){let T=b.program;n.uniformBlockBinding(A,T)}function c(A,b){let T=s[A.id];T===void 0&&(g(A),T=h(A),s[A.id]=T,A.addEventListener("dispose",I));let D=b.program;n.updateUBOMapping(A,D);let v=t.render.frame;r[A.id]!==v&&(u(A),r[A.id]=v)}function h(A){let b=f();A.__bindingPointIndex=b;let T=i.createBuffer(),D=A.__size,v=A.usage;return i.bindBuffer(i.UNIFORM_BUFFER,T),i.bufferData(i.UNIFORM_BUFFER,D,v),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,T),T}function f(){for(let A=0;A<a;A++)if(o.indexOf(A)===-1)return o.push(A),A;return te("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(A){let b=s[A.id],T=A.uniforms,D=A.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let v=0,P=T.length;v<P;v++){let N=T[v];if(Array.isArray(N))for(let O=0,B=N.length;O<B;O++)d(N[O],v,O,D);else d(N,v,0,D)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(A,b,T,D){if(M(A,b,T,D)===!0){let v=A.__offset,P=A.value;if(Array.isArray(P)){let N=0;for(let O=0;O<P.length;O++){let B=P[O],q=p(B);m(B,A.__data,N),typeof B!="number"&&typeof B!="boolean"&&!B.isMatrix3&&!ArrayBuffer.isView(B)&&(N+=q.storage/Float32Array.BYTES_PER_ELEMENT)}}else m(P,A.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,v,A.__data)}}function m(A,b,T){typeof A=="number"||typeof A=="boolean"?b[0]=A:A.isMatrix3?(b[0]=A.elements[0],b[1]=A.elements[1],b[2]=A.elements[2],b[3]=0,b[4]=A.elements[3],b[5]=A.elements[4],b[6]=A.elements[5],b[7]=0,b[8]=A.elements[6],b[9]=A.elements[7],b[10]=A.elements[8],b[11]=0):ArrayBuffer.isView(A)?b.set(new A.constructor(A.buffer,A.byteOffset,b.length)):A.toArray(b,T)}function M(A,b,T,D){let v=A.value,P=b+"_"+T;if(D[P]===void 0)return typeof v=="number"||typeof v=="boolean"?D[P]=v:ArrayBuffer.isView(v)?D[P]=v.slice():D[P]=v.clone(),!0;{let N=D[P];if(typeof v=="number"||typeof v=="boolean"){if(N!==v)return D[P]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(N.equals(v)===!1)return N.copy(v),!0}}return!1}function g(A){let b=A.uniforms,T=0,D=16;for(let P=0,N=b.length;P<N;P++){let O=Array.isArray(b[P])?b[P]:[b[P]];for(let B=0,q=O.length;B<q;B++){let V=O[B],K=Array.isArray(V.value)?V.value:[V.value];for(let lt=0,at=K.length;lt<at;lt++){let pt=K[lt],ot=p(pt),ut=T%D,dt=ut%ot.boundary,$t=ut+dt;T+=dt,$t!==0&&D-$t<ot.storage&&(T+=D-$t),V.__data=new Float32Array(ot.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=T,T+=ot.storage}}}let v=T%D;return v>0&&(T+=D-v),A.__size=T,A.__cache={},this}function p(A){let b={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(b.boundary=4,b.storage=4):A.isVector2?(b.boundary=8,b.storage=8):A.isVector3||A.isColor?(b.boundary=16,b.storage=12):A.isVector4?(b.boundary=16,b.storage=16):A.isMatrix3?(b.boundary=48,b.storage=48):A.isMatrix4?(b.boundary=64,b.storage=64):A.isTexture?Qt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(A)?(b.boundary=16,b.storage=A.byteLength):Qt("WebGLRenderer: Unsupported uniform value type.",A),b}function I(A){let b=A.target;b.removeEventListener("dispose",I);let T=o.indexOf(b.__bindingPointIndex);o.splice(T,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function F(){for(let A in s)i.deleteBuffer(s[A]);o=[],s={},r={}}return{bind:l,update:c,dispose:F}}var cv=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),pi=null;function hv(){return pi===null&&(pi=new Yi(cv,16,16,ns,Ke),pi.name="DFG_LUT",pi.minFilter=Xe,pi.magFilter=Xe,pi.wrapS=ci,pi.wrapT=ci,pi.generateMipmaps=!1,pi.needsUpdate=!0),pi}var Xl=class{constructor(t={}){let{canvas:e=Pf(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1,outputBufferType:d=Un}=t;this.isWebGLRenderer=!0;let m;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=n.getContextAttributes().alpha}else m=o;let M=d,g=new Set([ll,al,ol]),p=new Set([Un,ti,Sr,br,sl,rl]),I=new Uint32Array(4),F=new Int32Array(4),A=new G,b=null,T=null,D=[],v=[],P=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Qn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let N=this,O=!1,B=null,q=null,V=null,K=null;this._outputColorSpace=ln;let lt=0,at=0,pt=null,ot=-1,ut=null,dt=new He,$t=new He,Xt=null,we=new ce(0),fe=0,ve=e.width,W=e.height,tt=1,Mt=null,bt=null,xt=new He(0,0,ve,W),Bt=new He(0,0,ve,W),Ne=!1,jt=new so,ne=!1,de=!1,Jt=new Ve,ie=new G,ke=new He,xe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Te=!1;function Pe(){return pt===null?tt:1}let C=n;function gt(y,k){return e.getContext(y,k)}let It,R,x,H,E,X,ft,Y,nt,it,wt,Nt,Pt,ct,Yt,Kt,Zt,z,At,ht,Ct,Et,st;try{let y={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",ye,!1),e.addEventListener("webglcontextrestored",Me,!1),e.addEventListener("webglcontextcreationerror",se,!1),C===null){let k="webgl2";if(C=gt(k,y),C===null)throw gt(k)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}yt()}catch(y){throw e.removeEventListener("webglcontextlost",ye,!1),e.removeEventListener("webglcontextrestored",Me,!1),e.removeEventListener("webglcontextcreationerror",se,!1),te("WebGLRenderer: "+y.message),y}function yt(){It=new xx(C),It.init(),Ct=new iv(C,It),R=new ax(C,It,t,Ct),x=new ev(C,It),R.reversedDepthBuffer&&u&&x.buffers.depth.setReversed(!0),q=C.createFramebuffer(),V=C.createFramebuffer(),K=C.createFramebuffer(),H=new yx(C),E=new V_,X=new nv(C,It,x,E,R,Ct,H),ft=new gx(N),Y=new Sm(C),Et=new rx(C,Y),nt=new _x(C,Y,H,Et),it=new Sx(C,nt,Y,Et,H),z=new Mx(C,R,X),Yt=new lx(E),wt=new z_(N,ft,It,R,Et,Yt),Nt=new av(N,E),Pt=new G_,ct=new Z_(It),Zt=new sx(N,ft,x,it,m,l),Kt=new tv(N,it,R),st=new lv(C,H,R,x),At=new ox(C,It,H),ht=new vx(C,It,H),H.programs=wt.programs,N.capabilities=R,N.extensions=It,N.properties=E,N.renderLists=Pt,N.shadowMap=Kt,N.state=x,N.info=H}M!==Un&&(P=new wx(M,e.width,e.height,a,s,r));let Tt=new kh(N,C);this.xr=Tt,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){let y=It.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){let y=It.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return tt},this.setPixelRatio=function(y){y!==void 0&&(tt=y,this.setSize(ve,W,!1))},this.getSize=function(y){return y.set(ve,W)},this.setSize=function(y,k,J=!0){if(Tt.isPresenting){Qt("WebGLRenderer: Can't change size while VR device is presenting.");return}ve=y,W=k,e.width=Math.floor(y*tt),e.height=Math.floor(k*tt),J===!0&&(e.style.width=y+"px",e.style.height=k+"px"),P!==null&&P.setSize(e.width,e.height),this.setViewport(0,0,y,k)},this.getDrawingBufferSize=function(y){return y.set(ve*tt,W*tt).floor()},this.setDrawingBufferSize=function(y,k,J){ve=y,W=k,tt=J,e.width=Math.floor(y*J),e.height=Math.floor(k*J),this.setViewport(0,0,y,k)},this.setEffects=function(y){if(M===Un){te("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let k=0;k<y.length;k++)if(y[k].isOutputPass===!0){Qt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}P.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(dt)},this.getViewport=function(y){return y.copy(xt)},this.setViewport=function(y,k,J,$){y.isVector4?xt.set(y.x,y.y,y.z,y.w):xt.set(y,k,J,$),x.viewport(dt.copy(xt).multiplyScalar(tt).round())},this.getScissor=function(y){return y.copy(Bt)},this.setScissor=function(y,k,J,$){y.isVector4?Bt.set(y.x,y.y,y.z,y.w):Bt.set(y,k,J,$),x.scissor($t.copy(Bt).multiplyScalar(tt).round())},this.getScissorTest=function(){return Ne},this.setScissorTest=function(y){x.setScissorTest(Ne=y)},this.setOpaqueSort=function(y){Mt=y},this.setTransparentSort=function(y){bt=y},this.getClearColor=function(y){return y.copy(Zt.getClearColor())},this.setClearColor=function(){Zt.setClearColor(...arguments)},this.getClearAlpha=function(){return Zt.getClearAlpha()},this.setClearAlpha=function(){Zt.setClearAlpha(...arguments)},this.clear=function(y=!0,k=!0,J=!0){let $=0;if(y){let Z=!1;if(pt!==null){let Lt=pt.texture.format;Z=g.has(Lt)}if(Z){let Lt=pt.texture.type,Ut=p.has(Lt),Rt=Zt.getClearColor(),Ht=Zt.getClearAlpha(),Gt=Rt.r,ae=Rt.g,le=Rt.b;Ut?(I[0]=Gt,I[1]=ae,I[2]=le,I[3]=Ht,C.clearBufferuiv(C.COLOR,0,I)):(F[0]=Gt,F[1]=ae,F[2]=le,F[3]=Ht,C.clearBufferiv(C.COLOR,0,F))}else $|=C.COLOR_BUFFER_BIT}k&&($|=C.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),J&&($|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),$!==0&&C.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),B=y},this.dispose=function(){e.removeEventListener("webglcontextlost",ye,!1),e.removeEventListener("webglcontextrestored",Me,!1),e.removeEventListener("webglcontextcreationerror",se,!1),Zt.dispose(),Pt.dispose(),ct.dispose(),E.dispose(),ft.dispose(),it.dispose(),Et.dispose(),st.dispose(),wt.dispose(),Tt.dispose(),Tt.removeEventListener("sessionstart",Vs),Tt.removeEventListener("sessionend",si),yi.stop()};function ye(y){y.preventDefault(),dh("WebGLRenderer: Context Lost."),O=!0}function Me(){dh("WebGLRenderer: Context Restored."),O=!1;let y=H.autoReset,k=Kt.enabled,J=Kt.autoUpdate,$=Kt.needsUpdate,Z=Kt.type;yt(),H.autoReset=y,Kt.enabled=k,Kt.autoUpdate=J,Kt.needsUpdate=$,Kt.type=Z}function se(y){te("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Ye(y){let k=y.target;k.removeEventListener("dispose",Ye),he(k)}function he(y){on(y),E.remove(y)}function on(y){let k=E.get(y).programs;k!==void 0&&(k.forEach(function(J){wt.releaseProgram(J)}),y.isShaderMaterial&&wt.releaseShaderCache(y))}this.renderBufferDirect=function(y,k,J,$,Z,Lt){k===null&&(k=xe);let Ut=Z.isMesh&&Z.matrixWorld.determinantAffine()<0,Rt=Ws(y,k,J,$,Z);x.setMaterial($,Ut);let Ht=J.index,Gt=1;if($.wireframe===!0){if(Ht=nt.getWireframeAttribute(J),Ht===void 0)return;Gt=2}let ae=J.drawRange,le=J.attributes.position,zt=ae.start*Gt,oe=(ae.start+ae.count)*Gt;Lt!==null&&(zt=Math.max(zt,Lt.start*Gt),oe=Math.min(oe,(Lt.start+Lt.count)*Gt)),Ht!==null?(zt=Math.max(zt,0),oe=Math.min(oe,Ht.count)):le!=null&&(zt=Math.max(zt,0),oe=Math.min(oe,le.count));let Le=oe-zt;if(Le<0||Le===1/0)return;Et.setup(Z,$,Rt,J,Ht);let Ae,Ce=At;if(Ht!==null&&(Ae=Y.get(Ht),Ce=ht,Ce.setIndex(Ae)),Z.isMesh)$.wireframe===!0?(x.setLineWidth($.wireframeLinewidth*Pe()),Ce.setMode(C.LINES)):Ce.setMode(C.TRIANGLES);else if(Z.isLine){let Ge=$.linewidth;Ge===void 0&&(Ge=1),x.setLineWidth(Ge*Pe()),Z.isLineSegments?Ce.setMode(C.LINES):Z.isLineLoop?Ce.setMode(C.LINE_LOOP):Ce.setMode(C.LINE_STRIP)}else Z.isPoints?Ce.setMode(C.POINTS):Z.isSprite&&Ce.setMode(C.TRIANGLES);if(Z.isBatchedMesh)if(It.get("WEBGL_multi_draw"))Ce.renderMultiDraw(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount);else{let Ge=Z._multiDrawStarts,Ft=Z._multiDrawCounts,an=Z._multiDrawCount,Se=Ht?Y.get(Ht).bytesPerElement:1,Tn=E.get($).currentProgram.getUniforms();for(let _n=0;_n<an;_n++)Tn.setValue(C,"_gl_DrawID",_n),Ce.render(Ge[_n]/Se,Ft[_n])}else if(Z.isInstancedMesh)Ce.renderInstances(zt,Le,Z.count);else if(J.isInstancedBufferGeometry){let Ge=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,Ft=Math.min(J.instanceCount,Ge);Ce.renderInstances(zt,Le,Ft)}else Ce.render(zt,Le)};function wn(y,k,J,$){B!==null&&y.isNodeMaterial&&B.setObject($,y),ne===!0&&Yt.setState(y,J,!1),y.transparent===!0&&y.side===fi&&y.forceSinglePass===!1?(y.side=Sn,y.needsUpdate=!0,cs(y,k,$),y.side=ji,y.needsUpdate=!0,cs(y,k,$),y.side=fi):cs(y,k,$)}this.compile=function(y,k,J=null){J===null&&(J=y),B!==null&&B.renderStart(y,k,J),T=ct.get(J),T.init(k),v.push(T),J.traverseVisible(function(Z){Z.isLight&&Z.layers.test(k.layers)&&(T.pushLight(Z),Z.castShadow&&T.pushShadow(Z))}),y!==J&&y.traverseVisible(function(Z){Z.isLight&&Z.layers.test(k.layers)&&(T.pushLight(Z),Z.castShadow&&T.pushShadow(Z))}),T.setupLights(),B!==null&&B.updateLights(T.state.lightsArray),de=this.localClippingEnabled,ne=Yt.init(this.clippingPlanes,de),ne===!0&&Yt.setGlobalState(this.clippingPlanes,k),B!==null&&Kt.render(T.state.shadowsArray,J,k);let $=new Set;return y.traverse(function(Z){if(!(Z.isMesh||Z.isPoints||Z.isLine||Z.isSprite))return;let Lt=Z.material;if(Lt)if(Array.isArray(Lt))for(let Ut=0;Ut<Lt.length;Ut++){let Rt=Lt[Ut];wn(Rt,J,k,Z),$.add(Rt)}else wn(Lt,J,k,Z),$.add(Lt)}),T=v.pop(),B!==null&&B.renderEnd(),$},this.compileAsync=function(y,k,J=null){let $=this.compile(y,k,J);return new Promise(Z=>{function Lt(){if($.forEach(function(Ut){let Ht=E.get(Ut).currentProgram;(Ht===void 0||Ht.isReady())&&$.delete(Ut)}),$.size===0){Z(y);return}setTimeout(Lt,10)}It.get("KHR_parallel_shader_compile")!==null?Lt():setTimeout(Lt,10)})};let vi=null;function Br(y){vi&&vi(y)}function Vs(){yi.stop()}function si(){yi.start()}let yi=new sd;yi.setAnimationLoop(Br),typeof self<"u"&&yi.setContext(self),this.setAnimationLoop=function(y){vi=y,Tt.setAnimationLoop(y),y===null?yi.stop():yi.start()},Tt.addEventListener("sessionstart",Vs),Tt.addEventListener("sessionend",si),this.render=function(y,k){if(k!==void 0&&k.isCamera!==!0){te("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(O===!0)return;B!==null&&B.renderStart(y,k);let J=Tt.enabled===!0&&Tt.isPresenting===!0,$=P!==null&&(pt===null||J)&&P.begin(N,pt);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),Tt.enabled===!0&&Tt.isPresenting===!0&&(P===null||P.isCompositing()===!1)&&(Tt.cameraAutoUpdate===!0&&Tt.updateCamera(k),k=Tt.getCamera()),y.isScene===!0&&y.onBeforeRender(N,y,k,pt),T=ct.get(y,v.length),T.init(k),T.state.textureUnits=X.getTextureUnits(),v.push(T),Jt.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),jt.setFromProjectionMatrix(Jt,Kn,k.reversedDepth),de=this.localClippingEnabled,ne=Yt.init(this.clippingPlanes,de),b=Pt.get(y,D.length),b.init(),D.push(b),Tt.enabled===!0&&Tt.isPresenting===!0){let Ut=N.xr.getDepthSensingMesh();Ut!==null&&ls(Ut,k,-1/0,N.sortObjects)}ls(y,k,0,N.sortObjects),b.finish(),B!==null&&B.updateLights(T.state.lightsArray),N.sortObjects===!0&&b.sort(Mt,bt),Te=Tt.enabled===!1||Tt.isPresenting===!1||Tt.hasDepthSensing()===!1,Te&&Zt.addToRenderList(b,y),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ne===!0&&Yt.beginShadows();let Z=T.state.shadowsArray;if(Kt.render(Z,y,k),ne===!0&&Yt.endShadows(),($&&P.hasRenderPass())===!1){let Ut=b.opaque,Rt=b.transmissive;if(T.setupLights(),k.isArrayCamera){let Ht=k.cameras;if(Rt.length>0)for(let Gt=0,ae=Ht.length;Gt<ae;Gt++){let le=Ht[Gt];kr(Ut,Rt,y,le)}Te&&Zt.render(y);for(let Gt=0,ae=Ht.length;Gt<ae;Gt++){let le=Ht[Gt];Hs(b,y,le,le.viewport)}}else Rt.length>0&&kr(Ut,Rt,y,k),Te&&Zt.render(y),Hs(b,y,k)}pt!==null&&at===0&&(X.updateMultisampleRenderTarget(pt),X.updateRenderTargetMipmap(pt)),$&&P.end(N),y.isScene===!0&&y.onAfterRender(N,y,k),Et.resetDefaultState(),ot=-1,ut=null,v.pop(),v.length>0?(T=v[v.length-1],X.setTextureUnits(T.state.textureUnits),ne===!0&&Yt.setGlobalState(N.clippingPlanes,T.state.camera)):T=null,D.pop(),D.length>0?b=D[D.length-1]:b=null,B!==null&&B.renderEnd()};function ls(y,k,J,$){if(y.visible===!1)return;if(y.layers.test(k.layers)){if(y.isGroup)J=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(k);else if(y.isLightProbeGrid)T.pushLightProbeGrid(y);else if(y.isLight)T.pushLight(y),y.castShadow&&T.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||y.intersectsFrustum(jt)){$&&ke.setFromMatrixPosition(y.matrixWorld).applyMatrix4(Jt);let Ut=it.update(y),Rt=y.material;Rt.visible&&b.push(y,Ut,Rt,J,ke.z,null,k)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||y.intersectsFrustum(jt))){let Ut=it.update(y),Rt=y.material;if($&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),ke.copy(y.boundingSphere.center)):(Ut.boundingSphere===null&&Ut.computeBoundingSphere(),ke.copy(Ut.boundingSphere.center)),ke.applyMatrix4(y.matrixWorld).applyMatrix4(Jt)),Array.isArray(Rt)){let Ht=Ut.groups;for(let Gt=0,ae=Ht.length;Gt<ae;Gt++){let le=Ht[Gt],zt=Rt[le.materialIndex];zt&&zt.visible&&b.push(y,Ut,zt,J,ke.z,le,k)}}else Rt.visible&&b.push(y,Ut,Rt,J,ke.z,null,k)}}let Lt=y.children;for(let Ut=0,Rt=Lt.length;Ut<Rt;Ut++)ls(Lt[Ut],k,J,$)}function Hs(y,k,J,$){let{opaque:Z,transmissive:Lt,transparent:Ut}=y;T.setupLightsView(J),ne===!0&&Yt.setGlobalState(N.clippingPlanes,J),$&&x.viewport(dt.copy($)),Z.length>0&&Gs(Z,k,J),Lt.length>0&&Gs(Lt,k,J),Ut.length>0&&Gs(Ut,k,J),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function kr(y,k,J,$){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[$.id]===void 0){let zt=It.has("EXT_color_buffer_half_float")||It.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[$.id]=new qe(1,1,{generateMipmaps:!0,type:zt?Ke:Un,minFilter:ts,samples:Math.max(4,R.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:pe.workingColorSpace})}let Lt=T.state.transmissionRenderTarget[$.id],Ut=$.viewport||dt;Lt.setSize(Ut.z*N.transmissionResolutionScale,Ut.w*N.transmissionResolutionScale);let Rt=N.getRenderTarget(),Ht=N.getActiveCubeFace(),Gt=N.getActiveMipmapLevel();N.setRenderTarget(Lt),N.getClearColor(we),fe=N.getClearAlpha(),fe<1&&N.setClearColor(16777215,.5),N.clear(),Te&&Zt.render(J);let ae=N.toneMapping;N.toneMapping=Qn;let le=$.viewport;if($.viewport!==void 0&&($.viewport=void 0),T.setupLightsView($),ne===!0&&Yt.setGlobalState(N.clippingPlanes,$),Gs(y,J,$),X.updateMultisampleRenderTarget(Lt),X.updateRenderTargetMipmap(Lt),It.has("WEBGL_multisampled_render_to_texture")===!1){let zt=!1;for(let oe=0,Le=k.length;oe<Le;oe++){let Ae=k[oe],{object:Ce,geometry:Ge,material:Ft,group:an}=Ae;if(Ft.side===fi&&Ce.layers.test($.layers)){let Se=Ft.side;Ft.side=Sn,Ft.needsUpdate=!0,On(Ce,J,$,Ge,Ft,an),Ft.side=Se,Ft.needsUpdate=!0,zt=!0}}zt===!0&&(X.updateMultisampleRenderTarget(Lt),X.updateRenderTargetMipmap(Lt))}N.setRenderTarget(Rt,Ht,Gt),N.setClearColor(we,fe),le!==void 0&&($.viewport=le),N.toneMapping=ae}function Gs(y,k,J){let $=k.isScene===!0?k.overrideMaterial:null;for(let Z=0,Lt=y.length;Z<Lt;Z++){let Ut=y[Z],{object:Rt,geometry:Ht,group:Gt}=Ut,ae=Ut.material;ae.allowOverride===!0&&$!==null&&(ae=$),Rt.layers.test(J.layers)&&On(Rt,k,J,Ht,ae,Gt)}}function On(y,k,J,$,Z,Lt){B!==null&&Z.isNodeMaterial&&B.setObject(y,Z),y.onBeforeRender(N,k,J,$,Z,Lt),y.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),Z.onBeforeRender(N,k,J,$,y,Lt),Z.transparent===!0&&Z.side===fi&&Z.forceSinglePass===!1?(Z.side=Sn,Z.needsUpdate=!0,N.renderBufferDirect(J,k,$,Z,y,Lt),Z.side=ji,Z.needsUpdate=!0,N.renderBufferDirect(J,k,$,Z,y,Lt),Z.side=fi):N.renderBufferDirect(J,k,$,Z,y,Lt),y.onAfterRender(N,k,J,$,Z,Lt)}function cs(y,k,J){k.isScene!==!0&&(k=xe);let $=E.get(y),Z=T.state.lights,Lt=T.state.shadowsArray,Ut=Z.state.version,Rt=wt.getParameters(y,Z.state,Lt,k,J,T.state.lightProbeGridArray),Ht=wt.getProgramCacheKey(Rt),Gt=$.programs;$.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?k.environment:null,$.fog=k.fog;let ae=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;$.envMap=ft.get(y.envMap||$.environment,ae),$.envMapRotation=$.environment!==null&&y.envMap===null?k.environmentRotation:y.envMapRotation,Gt===void 0&&(y.addEventListener("dispose",Ye),Gt=new Map,$.programs=Gt);let le=Gt.get(Ht);if(le!==void 0){if($.currentProgram===le&&$.lightsStateVersion===Ut)return hs(y,Rt),le}else Rt.uniforms=wt.getUniforms(y),B!==null&&y.isNodeMaterial&&B.build(y,J,Rt),y.onBeforeCompile(Rt,N),le=wt.acquireProgram(Rt,Ht),Gt.set(Ht,le),$.uniforms=Rt.uniforms;let zt=$.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(zt.clippingPlanes=Yt.uniform),hs(y,Rt),$.needsLights=pc(y),$.lightsStateVersion=Ut,$.needsLights&&(zt.ambientLightColor.value=Z.state.ambient,zt.lightProbe.value=Z.state.probe,zt.sunLights.value=Z.state.sun,zt.sunLightShadows.value=Z.state.sunShadow,zt.directionalLights.value=Z.state.directional,zt.directionalLightShadows.value=Z.state.directionalShadow,zt.spotLights.value=Z.state.spot,zt.spotLightShadows.value=Z.state.spotShadow,zt.rectAreaLights.value=Z.state.rectArea,zt.ltc_1.value=Z.state.rectAreaLTC1,zt.ltc_2.value=Z.state.rectAreaLTC2,zt.pointLights.value=Z.state.point,zt.pointLightShadows.value=Z.state.pointShadow,zt.hemisphereLights.value=Z.state.hemi,zt.sunShadowMatrix.value=Z.state.sunShadowMatrix,zt.sunShadowCascade.value=Z.state.sunShadowCascade,zt.directionalShadowMatrix.value=Z.state.directionalShadowMatrix,zt.spotLightMatrix.value=Z.state.spotLightMatrix,zt.spotLightMap.value=Z.state.spotLightMap,zt.pointShadowMatrix.value=Z.state.pointShadowMatrix),$.lightProbeGrid=T.state.lightProbeGridArray.length>0,$.currentProgram=le,$.uniformsList=null,le}function Go(y){if(y.uniformsList===null){let k=y.currentProgram.getUniforms();y.uniformsList=Er.seqWithValue(k.seq,y.uniforms)}return y.uniformsList}function hs(y,k){let J=E.get(y);J.outputColorSpace=k.outputColorSpace,J.batching=k.batching,J.batchingColor=k.batchingColor,J.instancing=k.instancing,J.instancingColor=k.instancingColor,J.instancingMorph=k.instancingMorph,J.skinning=k.skinning,J.morphTargets=k.morphTargets,J.morphNormals=k.morphNormals,J.morphColors=k.morphColors,J.morphTargetsCount=k.morphTargetsCount,J.numClippingPlanes=k.numClippingPlanes,J.numIntersection=k.numClipIntersection,J.vertexAlphas=k.vertexAlphas,J.vertexTangents=k.vertexTangents,J.toneMapping=k.toneMapping}function Mi(y,k){if(y.length===0)return null;if(y.length===1)return y[0].texture!==null?y[0]:null;A.setFromMatrixPosition(k.matrixWorld);for(let J=0,$=y.length;J<$;J++){let Z=y[J];if(Z.texture!==null&&Z.boundingBox.containsPoint(A))return Z}return null}function Ws(y,k,J,$,Z){k.isScene!==!0&&(k=xe),X.resetTextureUnits();let Lt=k.fog,Ut=$.isMeshStandardMaterial||$.isMeshLambertMaterial||$.isMeshPhongMaterial?k.environment:null,Rt=pt===null?N.outputColorSpace:pt.isXRRenderTarget===!0?pt.texture.colorSpace:pe.workingColorSpace,Ht=$.isMeshStandardMaterial||$.isMeshLambertMaterial&&!$.envMap||$.isMeshPhongMaterial&&!$.envMap,Gt=ft.get($.envMap||Ut,Ht),ae=$.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,le=!!J.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),zt=!!J.morphAttributes.position,oe=!!J.morphAttributes.normal,Le=!!J.morphAttributes.color,Ae=Qn;$.toneMapped&&(pt===null||pt.isXRRenderTarget===!0)&&(Ae=N.toneMapping);let Ce=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,Ge=Ce!==void 0?Ce.length:0,Ft=E.get($),an=T.state.lights;if(ne===!0&&(de===!0||y!==ut)){let Ie=y===ut&&$.id===ot;Yt.setState($,y,Ie)}let Se=!1;$.version===Ft.__version?(Ft.needsLights&&Ft.lightsStateVersion!==an.state.version||Ft.outputColorSpace!==Rt||Z.isBatchedMesh&&Ft.batching===!1||!Z.isBatchedMesh&&Ft.batching===!0||Z.isBatchedMesh&&Ft.batchingColor===!0&&Z._colorsTexture===null||Z.isBatchedMesh&&Ft.batchingColor===!1&&Z._colorsTexture!==null||Z.isInstancedMesh&&Ft.instancing===!1||!Z.isInstancedMesh&&Ft.instancing===!0||Z.isSkinnedMesh&&Ft.skinning===!1||!Z.isSkinnedMesh&&Ft.skinning===!0||Z.isInstancedMesh&&Ft.instancingColor===!0&&Z.instanceColor===null||Z.isInstancedMesh&&Ft.instancingColor===!1&&Z.instanceColor!==null||Z.isInstancedMesh&&Ft.instancingMorph===!0&&Z.morphTexture===null||Z.isInstancedMesh&&Ft.instancingMorph===!1&&Z.morphTexture!==null||Ft.envMap!==Gt||$.fog===!0&&Ft.fog!==Lt||Ft.numClippingPlanes!==void 0&&(Ft.numClippingPlanes!==Yt.numPlanes||Ft.numIntersection!==Yt.numIntersection)||Ft.vertexAlphas!==ae||Ft.vertexTangents!==le||Ft.morphTargets!==zt||Ft.morphNormals!==oe||Ft.morphColors!==Le||Ft.toneMapping!==Ae||Ft.morphTargetsCount!==Ge||!!Ft.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(Se=!0):(Se=!0,Ft.__version=$.version);let Tn=Ft.currentProgram;Se===!0&&(Tn=cs($,k,Z),B&&$.isNodeMaterial&&B.onUpdateProgram($,Tn,Ft));let _n=!1,Hn=!1,Gn=!1,Ee=Tn.getUniforms(),ze=Ft.uniforms;if(x.useProgram(Tn.program)&&(_n=!0,Hn=!0,Gn=!0),$.id!==ot&&(ot=$.id,Hn=!0),Ft.needsLights){let Ie=Mi(T.state.lightProbeGridArray,Z);Ft.lightProbeGrid!==Ie&&(Ft.lightProbeGrid=Ie,Hn=!0)}if(_n||ut!==y){x.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),Ee.setValue(C,"projectionMatrix",y.projectionMatrix),Ee.setValue(C,"viewMatrix",y.matrixWorldInverse);let oi=Ee.map.cameraPosition;oi!==void 0&&oi.setValue(C,ie.setFromMatrixPosition(y.matrixWorld)),R.logarithmicDepthBuffer&&Ee.setValue(C,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&Ee.setValue(C,"isOrthographic",y.isOrthographicCamera===!0),ut!==y&&(ut=y,Hn=!0,Gn=!0)}if(Ft.needsLights&&(an.state.sunShadowMap.length>0&&Ee.setValue(C,"sunShadowMap",an.state.sunShadowMap,X),an.state.directionalShadowMap.length>0&&Ee.setValue(C,"directionalShadowMap",an.state.directionalShadowMap,X),an.state.spotShadowMap.length>0&&Ee.setValue(C,"spotShadowMap",an.state.spotShadowMap,X),an.state.pointShadowMap.length>0&&Ee.setValue(C,"pointShadowMap",an.state.pointShadowMap,X)),Z.isSkinnedMesh){Ee.setOptional(C,Z,"bindMatrix"),Ee.setOptional(C,Z,"bindMatrixInverse");let Ie=Z.skeleton;Ie&&(Ie.boneTexture===null&&Ie.computeBoneTexture(),Ee.setValue(C,"boneTexture",Ie.boneTexture,X))}Z.isBatchedMesh&&(Ee.setOptional(C,Z,"batchingTexture"),Ee.setValue(C,"batchingTexture",Z._matricesTexture,X),Ee.setOptional(C,Z,"batchingIdTexture"),Ee.setValue(C,"batchingIdTexture",Z._indirectTexture,X),Ee.setOptional(C,Z,"batchingColorTexture"),Z._colorsTexture!==null&&Ee.setValue(C,"batchingColorTexture",Z._colorsTexture,X));let ri=J.morphAttributes;if((ri.position!==void 0||ri.normal!==void 0||ri.color!==void 0)&&z.update(Z,J,Tn),(Hn||Ft.receiveShadow!==Z.receiveShadow)&&(Ft.receiveShadow=Z.receiveShadow,Ee.setValue(C,"receiveShadow",Z.receiveShadow)),($.isMeshStandardMaterial||$.isMeshLambertMaterial||$.isMeshPhongMaterial)&&$.envMap===null&&k.environment!==null&&(ze.envMapIntensity.value=k.environmentIntensity),ze.dfgLUT!==void 0&&(ze.dfgLUT.value=hv()),Hn){if(Ee.setValue(C,"toneMappingExposure",N.toneMappingExposure),Ft.needsLights&&Xs(ze,Gn),Lt&&$.fog===!0&&Nt.refreshFogUniforms(ze,Lt),Nt.refreshMaterialUniforms(ze,$,tt,W,T.state.transmissionRenderTarget[y.id]),Ft.needsLights&&Ft.lightProbeGrid){let Ie=Ft.lightProbeGrid;ze.probesSH.value=Ie.texture,ze.probesMin.value.copy(Ie.boundingBox.min),ze.probesMax.value.copy(Ie.boundingBox.max),ze.probesResolution.value.copy(Ie.resolution)}Er.upload(C,Go(Ft),ze,X)}if($.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(Er.upload(C,Go(Ft),ze,X),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&Ee.setValue(C,"center",Z.center),Ee.setValue(C,"modelViewMatrix",Z.modelViewMatrix),Ee.setValue(C,"normalMatrix",Z.normalMatrix),Ee.setValue(C,"modelMatrix",Z.matrixWorld),$.uniformsGroups!==void 0){let Ie=$.uniformsGroups;for(let oi=0,Si=Ie.length;oi<Si;oi++){let ai=Ie[oi];st.update(ai,Tn),st.bind(ai,Tn)}}return Tn}function Xs(y,k){y.ambientLightColor.needsUpdate=k,y.lightProbe.needsUpdate=k,y.sunLights.needsUpdate=k,y.sunLightShadows.needsUpdate=k,y.directionalLights.needsUpdate=k,y.directionalLightShadows.needsUpdate=k,y.pointLights.needsUpdate=k,y.pointLightShadows.needsUpdate=k,y.spotLights.needsUpdate=k,y.spotLightShadows.needsUpdate=k,y.rectAreaLights.needsUpdate=k,y.hemisphereLights.needsUpdate=k}function pc(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return lt},this.getActiveMipmapLevel=function(){return at},this.getRenderTarget=function(){return pt},this.setRenderTargetTextures=function(y,k,J){let $=E.get(y);$.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,$.__autoAllocateDepthBuffer===!1&&($.__useRenderToTexture=!1),E.get(y.texture).__webglTexture=k,E.get(y.depthTexture).__webglTexture=$.__autoAllocateDepthBuffer?void 0:J,$.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,k){let J=E.get(y);J.__webglFramebuffer=k,J.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(y,k=0,J=0){pt=y,lt=k,at=J;let $=null,Z=!1,Lt=!1;if(y){let Rt=E.get(y);if(Rt.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(C.FRAMEBUFFER,Rt.__webglFramebuffer),dt.copy(y.viewport),$t.copy(y.scissor),Xt=y.scissorTest,x.viewport(dt),x.scissor($t),x.setScissorTest(Xt),ot=-1;return}else if(Rt.__webglFramebuffer===void 0)X.setupRenderTarget(y);else if(Rt.__hasExternalTextures)X.rebindTextures(y,E.get(y.texture).__webglTexture,E.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){let ae=y.depthTexture;if(Rt.__boundDepthTexture!==ae){if(ae!==null&&E.has(ae)&&(y.width!==ae.image.width||y.height!==ae.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");X.setupDepthRenderbuffer(y)}}let Ht=y.texture;(Ht.isData3DTexture||Ht.isDataArrayTexture||Ht.isCompressedArrayTexture)&&(Lt=!0);let Gt=E.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Gt[k])?$=Gt[k][J]:$=Gt[k],Z=!0):y.samples>0&&X.useMultisampledRTT(y)===!1?$=E.get(y).__webglMultisampledFramebuffer:Array.isArray(Gt)?$=Gt[J]:$=Gt,dt.copy(y.viewport),$t.copy(y.scissor),Xt=y.scissorTest}else dt.copy(xt).multiplyScalar(tt).floor(),$t.copy(Bt).multiplyScalar(tt).floor(),Xt=Ne;if(J!==0&&($=q),x.bindFramebuffer(C.FRAMEBUFFER,$)&&x.drawBuffers(y,$),x.viewport(dt),x.scissor($t),x.setScissorTest(Xt),Z){let Rt=E.get(y.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+k,Rt.__webglTexture,J)}else if(Lt){let Rt=k;for(let Ht=0;Ht<y.textures.length;Ht++){let Gt=E.get(y.textures[Ht]);C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0+Ht,Gt.__webglTexture,J,Rt)}}else if(y!==null&&J!==0){let Rt=E.get(y.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,Rt.__webglTexture,J)}ot=-1};function Cn(y){let k=E.get(y);return(k.__readFormat!==y.format||k.__readType!==y.type)&&(k.__readFormat=y.format,k.__readType=y.type,k.__formatReadable=R.textureFormatReadable(y.format),k.__typeReadable=R.textureTypeReadable(y.type)),k}this.readRenderTargetPixels=function(y,k,J,$,Z,Lt,Ut,Rt=0){if(!(y&&y.isWebGLRenderTarget)){te("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ht=E.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Ut!==void 0&&(Ht=Ht[Ut]),Ht){x.bindFramebuffer(C.FRAMEBUFFER,Ht);try{let Gt=y.textures[Rt],ae=Gt.format,le=Gt.type;y.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+Rt);let zt=Cn(Gt);if(zt.__formatReadable===!1){te("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(zt.__typeReadable===!1){te("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=y.width-$&&J>=0&&J<=y.height-Z&&C.readPixels(k,J,$,Z,Ct.convert(ae),Ct.convert(le),Lt)}finally{let Gt=pt!==null?E.get(pt).__webglFramebuffer:null;x.bindFramebuffer(C.FRAMEBUFFER,Gt)}}},this.readRenderTargetPixelsAsync=async function(y,k,J,$,Z,Lt,Ut,Rt=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ht=E.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&Ut!==void 0&&(Ht=Ht[Ut]),Ht)if(k>=0&&k<=y.width-$&&J>=0&&J<=y.height-Z){x.bindFramebuffer(C.FRAMEBUFFER,Ht);let Gt=y.textures[Rt],ae=Gt.format,le=Gt.type;y.textures.length>1&&C.readBuffer(C.COLOR_ATTACHMENT0+Rt);let zt=Cn(Gt);if(zt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(zt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let oe=C.createBuffer();C.bindBuffer(C.PIXEL_PACK_BUFFER,oe),C.bufferData(C.PIXEL_PACK_BUFFER,Lt.byteLength,C.STREAM_READ),C.readPixels(k,J,$,Z,Ct.convert(ae),Ct.convert(le),0),C.bindBuffer(C.PIXEL_PACK_BUFFER,null);let Le=pt!==null?E.get(pt).__webglFramebuffer:null;x.bindFramebuffer(C.FRAMEBUFFER,Le);let Ae=C.fenceSync(C.SYNC_GPU_COMMANDS_COMPLETE,0);return C.flush(),await Lf(C,Ae,4),C.bindBuffer(C.PIXEL_PACK_BUFFER,oe),C.getBufferSubData(C.PIXEL_PACK_BUFFER,0,Lt),C.bindBuffer(C.PIXEL_PACK_BUFFER,null),C.deleteBuffer(oe),C.deleteSync(Ae),Lt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,k=null,J=0){let $=Math.pow(2,-J),Z=Math.floor(y.image.width*$),Lt=Math.floor(y.image.height*$),Ut=k!==null?k.x:0,Rt=k!==null?k.y:0;X.setTexture2D(y,0),C.copyTexSubImage2D(C.TEXTURE_2D,J,0,0,Ut,Rt,Z,Lt),x.unbindTexture()},this.copyTextureToTexture=function(y,k,J=null,$=null,Z=0,Lt=0){let Ut,Rt,Ht,Gt,ae,le,zt,oe,Le,Ae=y.isCompressedTexture?y.mipmaps[Lt]:y.image;if(J!==null)Ut=J.max.x-J.min.x,Rt=J.max.y-J.min.y,Ht=J.isBox3?J.max.z-J.min.z:1,Gt=J.min.x,ae=J.min.y,le=J.isBox3?J.min.z:0;else{let ze=Math.pow(2,-Z);Ut=Math.floor(Ae.width*ze),Rt=Math.floor(Ae.height*ze),y.isDataArrayTexture?Ht=Ae.depth:y.isData3DTexture?Ht=Math.floor(Ae.depth*ze):Ht=1,Gt=0,ae=0,le=0}$!==null?(zt=$.x,oe=$.y,Le=$.z):(zt=0,oe=0,Le=0);let Ce=Ct.convert(k.format),Ge=Ct.convert(k.type),Ft;k.isData3DTexture?(X.setTexture3D(k,0),Ft=C.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(X.setTexture2DArray(k,0),Ft=C.TEXTURE_2D_ARRAY):(X.setTexture2D(k,0),Ft=C.TEXTURE_2D),x.activeTexture(C.TEXTURE0),x.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,k.flipY),x.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),x.pixelStorei(C.UNPACK_ALIGNMENT,k.unpackAlignment);let an=x.getParameter(C.UNPACK_ROW_LENGTH),Se=x.getParameter(C.UNPACK_IMAGE_HEIGHT),Tn=x.getParameter(C.UNPACK_SKIP_PIXELS),_n=x.getParameter(C.UNPACK_SKIP_ROWS),Hn=x.getParameter(C.UNPACK_SKIP_IMAGES);x.pixelStorei(C.UNPACK_ROW_LENGTH,Ae.width),x.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Ae.height),x.pixelStorei(C.UNPACK_SKIP_PIXELS,Gt),x.pixelStorei(C.UNPACK_SKIP_ROWS,ae),x.pixelStorei(C.UNPACK_SKIP_IMAGES,le);let Gn=y.isDataArrayTexture||y.isData3DTexture,Ee=k.isDataArrayTexture||k.isData3DTexture;if(y.isDepthTexture){let ze=E.get(y),ri=E.get(k),Ie=E.get(ze.__renderTarget),oi=E.get(ri.__renderTarget);x.bindFramebuffer(C.READ_FRAMEBUFFER,Ie.__webglFramebuffer),x.bindFramebuffer(C.DRAW_FRAMEBUFFER,oi.__webglFramebuffer);for(let Si=0;Si<Ht;Si++)Gn&&(C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,E.get(y).__webglTexture,Z,le+Si),C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,E.get(k).__webglTexture,Lt,Le+Si)),C.blitFramebuffer(Gt,ae,Ut,Rt,zt,oe,Ut,Rt,C.DEPTH_BUFFER_BIT,C.NEAREST);x.bindFramebuffer(C.READ_FRAMEBUFFER,null),x.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else if(Z!==0||y.isRenderTargetTexture||E.has(y)){let ze=E.get(y),ri=E.get(k);x.bindFramebuffer(C.READ_FRAMEBUFFER,V),x.bindFramebuffer(C.DRAW_FRAMEBUFFER,K);for(let Ie=0;Ie<Ht;Ie++)Gn?C.framebufferTextureLayer(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,ze.__webglTexture,Z,le+Ie):C.framebufferTexture2D(C.READ_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,ze.__webglTexture,Z),Ee?C.framebufferTextureLayer(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,ri.__webglTexture,Lt,Le+Ie):C.framebufferTexture2D(C.DRAW_FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_2D,ri.__webglTexture,Lt),Z!==0?C.blitFramebuffer(Gt,ae,Ut,Rt,zt,oe,Ut,Rt,C.COLOR_BUFFER_BIT,C.NEAREST):Ee?C.copyTexSubImage3D(Ft,Lt,zt,oe,Le+Ie,Gt,ae,Ut,Rt):C.copyTexSubImage2D(Ft,Lt,zt,oe,Gt,ae,Ut,Rt);x.bindFramebuffer(C.READ_FRAMEBUFFER,null),x.bindFramebuffer(C.DRAW_FRAMEBUFFER,null)}else Ee?y.isDataTexture||y.isData3DTexture?C.texSubImage3D(Ft,Lt,zt,oe,Le,Ut,Rt,Ht,Ce,Ge,Ae.data):k.isCompressedArrayTexture?C.compressedTexSubImage3D(Ft,Lt,zt,oe,Le,Ut,Rt,Ht,Ce,Ae.data):C.texSubImage3D(Ft,Lt,zt,oe,Le,Ut,Rt,Ht,Ce,Ge,Ae):y.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,Lt,zt,oe,Ut,Rt,Ce,Ge,Ae.data):y.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,Lt,zt,oe,Ae.width,Ae.height,Ce,Ae.data):C.texSubImage2D(C.TEXTURE_2D,Lt,zt,oe,Ut,Rt,Ce,Ge,Ae);x.pixelStorei(C.UNPACK_ROW_LENGTH,an),x.pixelStorei(C.UNPACK_IMAGE_HEIGHT,Se),x.pixelStorei(C.UNPACK_SKIP_PIXELS,Tn),x.pixelStorei(C.UNPACK_SKIP_ROWS,_n),x.pixelStorei(C.UNPACK_SKIP_IMAGES,Hn),Lt===0&&k.generateMipmaps&&C.generateMipmap(Ft),x.unbindTexture()},this.initRenderTarget=function(y){E.get(y).__webglFramebuffer===void 0&&X.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?X.setTextureCube(y,0):y.isData3DTexture?X.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?X.setTexture2DArray(y,0):X.setTexture2D(y,0),x.unbindTexture()},this.resetState=function(){lt=0,at=0,pt=null,x.reset(),Et.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Kn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=pe._getDrawingBufferColorSpace(t),e.unpackColorSpace=pe._getUnpackColorSpace()}};var fd={type:"change"},Vh={type:"start"},pd={type:"end"},$l=new qi,dd=new cn,uv=Math.cos(70*mh.DEG2RAD),Qe=new G,An=2*Math.PI,Re={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},zh=1e-6,Zl=class extends mo{constructor(t,e=null){super(t,e),this.state=Re.NONE,this.target=new G,this.cursor=new G,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:kn.ROTATE,MIDDLE:kn.DOLLY,RIGHT:kn.PAN},this.touches={ONE:jn.ROTATE,TWO:jn.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new G,this._lastQuaternion=new Ln,this._lastTargetPosition=new G,this._quat=new Ln().setFromUnitVectors(t.up,new G(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new ui,this._sphericalDelta=new ui,this._scale=1,this._panOffset=new G,this._rotateStart=new qt,this._rotateEnd=new qt,this._rotateDelta=new qt,this._panStart=new qt,this._panEnd=new qt,this._panDelta=new qt,this._dollyStart=new qt,this._dollyEnd=new qt,this._dollyDelta=new qt,this._dollyDirection=new G,this._mouse=new qt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=dv.bind(this),this._onPointerDown=fv.bind(this),this._onPointerUp=pv.bind(this),this._onContextMenu=Mv.bind(this),this._onMouseWheel=xv.bind(this),this._onKeyDown=_v.bind(this),this._onTouchStart=vv.bind(this),this._onTouchMove=yv.bind(this),this._onMouseDown=mv.bind(this),this._onMouseMove=gv.bind(this),this._interceptControlDown=Sv.bind(this),this._interceptControlUp=bv.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=Re.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents();let t=this.domElement.getRootNode();t.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),t.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(fd),this.update(),this.state=Re.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){let e=this.object.position;Qe.copy(e).sub(this.target),Qe.applyQuaternion(this._quat),this._spherical.setFromVector3(Qe),this.autoRotate&&this.state===Re.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=An:n>Math.PI&&(n-=An),s<-Math.PI?s+=An:s>Math.PI&&(s-=An),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Qe.setFromSpherical(this._spherical),Qe.applyQuaternion(this._quatInverse),e.copy(this.target).add(Qe),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=Qe.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new G(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new G(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=Qe.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):($l.origin.copy(this.object.position),$l.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot($l.direction))<uv?this.object.lookAt(this.target):(dd.setFromNormalAndCoplanarPoint(this.object.up,this.target),$l.intersectPlane(dd,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>zh||8*(1-this._lastQuaternion.dot(this.object.quaternion))>zh||this._lastTargetPosition.distanceToSquared(this.target)>zh?(this.dispatchEvent(fd),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?An/60*this.autoRotateSpeed*t:An/60/60*this.autoRotateSpeed}_getZoomScale(t){let e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Qe.setFromMatrixColumn(e,0),Qe.multiplyScalar(-t),this._panOffset.add(Qe)}_panUp(t,e){this.screenSpacePanning===!0?Qe.setFromMatrixColumn(e,1):(Qe.setFromMatrixColumn(e,0),Qe.crossVectors(this.object.up,Qe)),Qe.multiplyScalar(t),this._panOffset.add(Qe)}_pan(t,e){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;Qe.copy(s).sub(this.target);let r=Qe.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(An*this._rotateDelta.x/e.clientHeight),this._rotateUp(An*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(An*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-An*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(An*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-An*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(An*this._rotateDelta.x/e.clientHeight),this._rotateUp(An*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new qt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){let e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function fv(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function dv(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function pv(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(pd),this.state=Re.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:let t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function mv(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case kn.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=Re.DOLLY;break;case kn.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Re.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Re.ROTATE}break;case kn.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Re.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Re.PAN}break;default:this.state=Re.NONE}this.state!==Re.NONE&&this.dispatchEvent(Vh)}function gv(i){switch(this.state){case Re.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case Re.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case Re.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function xv(i){this.enabled===!1||this.enableZoom===!1||this.state!==Re.NONE||(i.preventDefault(),this.dispatchEvent(Vh),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(pd))}function _v(i){this.enabled!==!1&&this._handleKeyDown(i)}function vv(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case jn.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=Re.TOUCH_ROTATE;break;case jn.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=Re.TOUCH_PAN;break;default:this.state=Re.NONE}break;case 2:switch(this.touches.TWO){case jn.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=Re.TOUCH_DOLLY_PAN;break;case jn.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=Re.TOUCH_DOLLY_ROTATE;break;default:this.state=Re.NONE}break;default:this.state=Re.NONE}this.state!==Re.NONE&&this.dispatchEvent(Vh)}function yv(i){switch(this._trackPointer(i),this.state){case Re.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case Re.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case Re.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case Re.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=Re.NONE}}function Mv(i){this.enabled!==!1&&i.preventDefault()}function Sv(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function bv(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var Hh=new cn,Kl=new Ts,Rr=new qt,Gh=new G,Jl=class extends Zl{constructor(t,e){super(t,e),this.screenSpacePanning=!1,this.mouseButtons={LEFT:kn.PAN,MIDDLE:kn.DOLLY,RIGHT:kn.ROTATE},this.touches={ONE:jn.PAN,TWO:jn.DOLLY_ROTATE},this._panWorldStart=new G}_handleMouseDownPan(t){if(super._handleMouseDownPan(t),this._panOffset.set(0,0,0),this.screenSpacePanning===!0)return;Hh.setFromNormalAndCoplanarPoint(this.object.up,this.target);let n=this.domElement.getBoundingClientRect();Rr.x=(t.clientX-n.left)/n.width*2-1,Rr.y=-((t.clientY-n.top)/n.height)*2+1,Kl.setFromCamera(Rr,this.object),Kl.ray.intersectPlane(Hh,this._panWorldStart)}_handleMouseMovePan(t){if(this.screenSpacePanning===!0){super._handleMouseMovePan(t);return}let n=this.domElement.getBoundingClientRect();Rr.x=(t.clientX-n.left)/n.width*2-1,Rr.y=-((t.clientY-n.top)/n.height)*2+1,Kl.setFromCamera(Rr,this.object),Kl.ray.intersectPlane(Hh,Gh)&&(Gh.sub(this._panWorldStart),this._panOffset.copy(Gh).negate(),this.update())}};var Pr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};var Fn=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},wv=new ws(-1,1,1,-1,0,1),Wh=class extends pn{constructor(){super(),this.setAttribute("position",new Mn([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Mn([0,2,0,0,2,0],2))}},Tv=new Wh,is=class{constructor(t){this._mesh=new Oe(Tv,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,wv)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}};var jl=class extends Fn{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof Be?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Li.clone(t.uniforms),this.material=new Be({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new is(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Fo=class extends Fn{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){let s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},Ql=class extends Fn{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}};var tc=class{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){let n=t.getSize(new qt);this._width=n.width,this._height=n.height,e=new qe(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Ke}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new jl(Pr),this.copyPass.material.blending=zn,this.timer=new po}swapBuffers(){let t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){let e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());let e=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}Fo!==void 0&&(o instanceof Fo?n=!0:o instanceof Ql&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){let e=this.renderer.getSize(new qt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var ec=class extends Fn{constructor(t,e,n=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new ce}render(t,e,n){let s=t.autoClear;t.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=s}};var md={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ce(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};var Ir=class i extends Fn{constructor(t,e=1,n,s){super(),this.strength=e,this.radius=n,this.threshold=s,this.resolution=t!==void 0?new qt(t.x,t.y):new qt(256,256),this.clearColor=new ce(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new qe(r,o,{type:Ke,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let f=new qe(r,o,{type:Ke,depthBuffer:!1});f.texture.name="UnrealBloomPass.h"+h,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);let u=new qe(r,o,{type:Ke,depthBuffer:!1});u.texture.name="UnrealBloomPass.v"+h,u.texture.generateMipmaps=!1,this.renderTargetsVertical.push(u),r=Math.round(r/2),o=Math.round(o/2)}let a=md;this.highPassUniforms=Li.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Be({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new qt(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new G(1,1,1),new G(1,1,1),new G(1,1,1),new G(1,1,1),new G(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Li.clone(Pr.uniforms),this.blendMaterial=new Be({uniforms:this.copyUniforms,vertexShader:Pr.vertexShader,fragmentShader:Pr.fragmentShader,premultipliedAlpha:!0,blending:As,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new ce,this._oldClearAlpha=1,this._basic=new bs,this._fsQuad=new is(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),s=Math.round(e/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new qt(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(t,e,n,s,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),a=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(t){let e=[],n=t/3;for(let o=0;o<t;o++)e.push(.39894*Math.exp(-.5*o*o/(n*n))/n);let s=[],r=[];for(let o=1;o<t;o+=2){let a=e[o],l=o+1<t?e[o+1]:0,c=a+l;s.push((o*a+(o+1)*l)/c),r.push(c)}return new Be({defines:{KERNEL_PAIRS:s.length},uniforms:{colorTexture:{value:null},invSize:{value:new qt(.5,.5)},direction:{value:new qt(.5,.5)},centerWeight:{value:e[0]},gaussianOffsets:{value:s},gaussianWeights:{value:r}},vertexShader:`

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

				}`})}_getCompositeMaterial(t){return new Be({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}};Ir.BlurDirectionX=new qt(1,0);Ir.BlurDirectionY=new qt(0,1);var Oo={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};var nc=class extends Fn{constructor(){super(),this.isOutputPass=!0,this.uniforms=Li.clone(Oo.uniforms),this.material=new xr({name:Oo.name,uniforms:this.uniforms,vertexShader:Oo.vertexShader,fragmentShader:Oo.fragmentShader}),this._fsQuad=new is(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},pe.getTransfer(this._outputColorSpace)===be&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===vo?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===yo?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Mo?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Es?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===bo?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===wo?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===So&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Bo={mud:"#ff6040",oni:"#3ec8ff",ustur:"#ffcc33",unaligned:"#8a94a6"},Av=i=>i<=.04045?i/12.92:((i+.055)/1.055)**2.4;var Dr=i=>[1,3,5].map(t=>Av(parseInt(i.slice(t,t+2),16)/255)),vd=[1.8,1,.6],Ui=Object.fromEntries(Object.entries(Bo).map(([i,t])=>[i,Dr(t)])),tn=i=>Ui[i]?i:"unaligned",gd={idle:0,docked:1,mining:2,warp:3,subwarp:4,destroyed:5,respawn:6,claimStakeTransfer:7},yd=i=>i in gd?gd[i]:0,qh=i=>i==="warp"||i==="subwarp",ge=i=>typeof i=="number"&&Number.isFinite(i),xd=i=>Array.isArray(i)&&i.length>=2&&ge(i[0])&&ge(i[1]);function Yh(i){let t=i.s||{},e=[ge(i.x)?i.x:0,ge(i.y)?i.y:0];return qh(t.kind)&&xd(t.to)&&ge(t.departs)&&ge(t.arrives)?{moving:!0,from:xd(t.from)?[t.from[0],t.from[1]]:e,to:[t.to[0],t.to[1]],dep:t.departs,arr:t.arrives}:{moving:!1,from:e,to:null,dep:0,arr:0}}function Ev(i,t){if(!i.moving)return 1;let e=i.arr-i.dep;if(!(e>0))return t>=i.dep?1:0;let n=(t-i.dep)/e;return n<0?0:n>1?1:n}function Md(i,t,e=[0,0]){if(!i.moving)return e[0]=i.from[0],e[1]=i.from[1],e;let n=Ev(i,t);return e[0]=i.from[0]+(i.to[0]-i.from[0])*n,e[1]=i.from[1]+(i.to[1]-i.from[1])*n,e}function En(i){let t=2166136261;for(let e=0;e<(i||"").length;e++)t^=i.charCodeAt(e),t=Math.imul(t,16777619);return(t>>>0)%1e5/1e5}var ko=i=>i&&i.mine&&Array.isArray(i.mine.out)?i.mine.out.reduce((t,e)=>t+(ge(e.ups)?e.ups:0),0):0;function Cv(i){let t=new Map((i.asteroids||[]).map(n=>[n.a,n.sys])),e=new Map;for(let n of i.fleets||[]){if(!n||!n.s||n.s.kind!=="mining")continue;let s=t.get(n.s.asteroid);if(!s)continue;let r=e.get(s);r||(r={ups:0,miners:0,byFa:{},byFilter:{},fa:"unaligned"},e.set(s,r));let o=ko(n),a=n.npc?"unaligned":tn(n.fa);r.ups+=o,r.miners++,r.byFa[a]=(r.byFa[a]||0)+o;for(let l of Kh)Jh(n,l)&&(r.byFilter[l]=(r.byFilter[l]||0)+o+1e-9)}for(let n of e.values())n.fa=Object.entries(n.byFa).sort((s,r)=>r[1]-s[1])[0][0];return e}var Sd=["mining","combat","fleets","owners","dacs"],Di=" \xB7 ",gi=(i,t)=>`${i} ${t}${i===1?"":"s"}`;function Rv(i){let t=Math.abs(i);return t>=1e6?(i/1e6).toFixed(t>=1e7?0:1)+"M":t>=1e3?(i/1e3).toFixed(t>=1e4?0:1)+"k":t>=10?Math.round(i).toString():i.toFixed(1)}function _d(i,t){let e=(i.asteroids||[]).map(n=>({k:"asteroid",a:n.a,sys:n.sys}));return nu(i.fleets||[],i.systems||[],e,t)}function bd(i,t,e,n={}){if(!t||!Array.isArray(t.systems))return[];let s=new Map(t.systems.map(l=>[l.a,l])),r=ge(t.generatedAt)?t.generatedAt:0,o=r-120,a=[];if(i==="mining")for(let[l,c]of Cv(t)){let h=s.get(l);!h||!(c.ups>0)||a.push({key:l,x:h.x,y:h.y,v:c.ups,fa:c.fa,sys:l,name:h.n||"System",line:`${Rv(c.ups)} u/s${Di}${gi(c.miners,"miner")}`,miners:c.miners})}else if(i==="combat")for(let l of Lv(e,t.systems,r,n.windowS||86400,n.faction||null))a.push({key:"hot:"+l.key,x:l.x,y:l.y,v:l.n,fa:"hot",sys:l.sys,name:l.name,line:`${gi(l.n,"combat event")} 24h${l.destroyed?Di+gi(l.destroyed,"kill"):""}`,kills:l.destroyed,heat:l.heat,last:l.last});else if(i==="fleets"){let l=t.fleets||[];for(let[c,h]of _d(t,o)){let f=s.get(c);if(!f)continue;let u=[...h.docked,...h.mining,...h.cst,...h.idle];if(!u.length)continue;let d={};for(let m of u){let M=l[m].npc?"unaligned":tn(l[m].fa);d[M]=(d[M]||0)+1}a.push({key:c,x:f.x,y:f.y,v:u.length,fa:Object.entries(d).sort((m,M)=>M[1]-m[1])[0][0],sys:c,name:f.n||"System",line:`${gi(u.length,"fleet")}${h.docked.length?Di+h.docked.length+" docked":""}${h.mining.length?Di+h.mining.length+" mining":""}`})}}else if(i==="owners"){let l=t.fleets||[],c=n.owner||null,h=new Map((t.owners||[]).map(m=>[m.p,m.fa])),f=new Map;for(let m of t.stakes||[])if(m&&m.sys&&(!c||m.o===c)){let M=f.get(m.sys)||[];M.push(m),f.set(m.sys,M)}let u=_d(t,o),d=new Set([...u.keys(),...f.keys()]);for(let m of d){let M=s.get(m);if(!M)continue;let g=u.get(m),p=g?[...g.docked,...g.mining,...g.cst,...g.idle]:[],I=f.get(m)||[];if(c){let F=p.filter(A=>l[A].o===c).length;if(!F&&!I.length)continue;a.push({key:m,x:M.x,y:M.y,v:F+I.length,fa:tn(h.get(c)),sys:m,name:M.n||"System",line:[F?gi(F,"fleet"):"",I.length?gi(I.length,"stake"):""].filter(Boolean).join(Di)})}else{let F=new Set([...p.map(A=>l[A].o),...I.map(A=>A.o)].filter(Boolean));if(!F.size)continue;a.push({key:m,x:M.x,y:M.y,v:F.size,fa:tn(M.f),sys:m,name:M.n||"System",line:gi(F.size,"owner")+" present"})}}}return i==="combat"?a:a.sort((l,c)=>c.v-l.v||(l.key<c.key?-1:1))}var Pv=12,wd=(i,t)=>i>0?Pv*(.08+.92*Math.log10(1+i)/Math.log10(1+Math.max(i,t||i))):0;function Td(i,t=[0,0]){let e=(.5+.17*Math.sqrt(i))*Ni.K,n=i*2.39996323;return t[0]=Math.cos(n)*e,t[1]=Math.sin(n)*e,t}function $h(i,t){let e=Yh(i);return e.moving?e.arr<=t?e.to:null:[i.x,i.y]}function Ad(i,t=-1/0){let e=new Map;i.forEach((n,s)=>{let r=n.s&&n.s.kind;if(r==="mining")return;let o=$h(n,t);if(!o)return;let a=r==="docked"&&n.s.system?"sys:"+n.s.system:o[0].toFixed(3)+","+o[1].toFixed(3);e.has(a)||e.set(a,[]),e.get(a).push(s)});for(let n of e.values())n.sort((s,r)=>i[s].a<i[r].a?-1:i[s].a>i[r].a?1:0);return e}var Ed=i=>.55*(1+.42*Math.log2(Math.max(1,i||1))),Cd=i=>1.1+Math.max(0,i||0)*.42,Zh=i=>i.k==="combat"||i.k==="destroyed"||i.k==="starbaseCombat"||i.k==="captured"||i.k==="gone"&&i.afterCombat===!0,Is=i=>i.k==="destroyed"||i.dead===!0;function Rd(i,t,e=86400){let n=new Map,s=new Set;for(let r of i||[]){if(!Zh(r)||!ge(r.t)||!ge(r.x)||!ge(r.y)||r.t>t||r.t<=t-e)continue;if(Is(r)&&r.f){if(s.has(r.f))continue;s.add(r.f)}let o=Math.round(r.x*2)+","+Math.round(r.y*2),a=n.get(o);a||(a={x:0,y:0,n:0,heat:0,destroyed:0,last:0,fa:{}},n.set(o,a));let l=t-r.t,c=(Is(r)?3:1)*Math.exp(-l/21600);a.x+=r.x,a.y+=r.y,a.n++,a.heat+=c,a.last=Math.max(a.last,r.t),Is(r)&&a.destroyed++;let h=tn(r.fa);a.fa[h]=(a.fa[h]||0)+1,r.npc&&(a.npc=(a.npc||0)+1),r.npc||((a.pf||(a.pf={}))[h]=1)}return[...n.values()].map(r=>({x:r.x/r.n,y:r.y/r.n,n:r.n,heat:r.heat,destroyed:r.destroyed,last:r.last,fa:Object.entries(r.fa).sort((o,a)=>a[1]-o[1])[0][0],npc:r.npc||0,playerFa:Object.keys(r.pf||{})}))}var ic=1.2;var Iv=(i,t)=>t.n-i.n||t.last-i.last||(i.key<t.key?-1:i.key>t.key?1:0);function Lv(i,t,e,n=86400,s=null){let r=(t||[]).filter(h=>h&&ge(h.x)&&ge(h.y)),o=new Map,a=new Set,l=ic*ic;for(let h of i||[]){if(!Zh(h)||!ge(h.t)||!ge(h.x)||!ge(h.y)||h.t>e||h.t<=e-n||s&&!Jh(h,s))continue;if(Is(h)&&h.f){if(a.has(h.f))continue;a.add(h.f)}let f=null,u=l;for(let g of r){let p=(g.x-h.x)**2+(g.y-h.y)**2;(p<u||p===u&&f&&g.a<f.a)&&(u=p,f=g)}let d=f?f.a:"deep:"+Math.round(h.x*2)+","+Math.round(h.y*2),m=o.get(d);m||(m={key:d,sys:f?f.a:null,name:f?f.n||"System":"",x:f?f.x:0,y:f?f.y:0,sx:0,sy:0,n:0,destroyed:0,heat:0,last:0},o.set(d,m));let M=e-h.t;m.n++,m.sx+=h.x,m.sy+=h.y,m.heat+=(Is(h)?3:1)*Math.exp(-M/21600),m.last=Math.max(m.last,h.t),Is(h)&&m.destroyed++}return[...o.values()].map(({sx:h,sy:f,...u})=>(u.sys||(u.x=h/u.n,u.y=f/u.n,u.name=Dv(u.x,u.y,r)),u)).sort(Iv)}function Dv(i,t,e){let n=null,s=1/0;for(let r of e||[]){if(!r||!ge(r.x)||!ge(r.y))continue;let o=(r.x-i)**2+(r.y-t)**2;(o<s||o===s&&n&&r.a<n.a)&&(s=o,n=r)}return n?`Deep space near ${n.n||"System"}`:"Deep space"}function Pd(i,t){return t?t==="npc"?i.npc>0:i.playerFa.includes(t):!0}var sc=(i,t)=>["mud","oni","ustur"].includes(t)&&tn(i)!==t,Xh=.06,Kh=["mud","oni","ustur","npc","unaligned"];function Jh(i,t){return t?t==="npc"?!!i.npc:!i.npc&&tn(i.fa)===t:!0}function jh(i,t){let e=i.s&&i.s.kind||"idle";return t.owner?i.o===t.owner?2:Xh:t.faction&&!Jh(i,t.faction)||t.states&&t.states.length&&!t.states.includes(e)?Xh:1}function Qh(i){if(!i.length)return null;let t=1/0,e=1/0,n=-1/0,s=-1/0;for(let[r,o]of i)r<t&&(t=r),r>n&&(n=r),o<e&&(e=o),o>s&&(s=o);return{x:(t+n)/2,y:(e+s)/2,span:Math.max(n-t,s-e)}}function Id(i,t,e){if(!e)return null;if(Math.hypot(e[0]-i.x,e[1]-i.y)>=.3)return[e[0],e[1],i.x,i.y];let n=i.vs&&i.vs[t]||{},s=En(String(i.f)+String(n.f))*Math.PI*2+t*.9,r=Math.cos(s)*.8,o=Math.sin(s)*.8;return[i.x-r,i.y-o,i.x+r,i.y+o]}var ii={orbit0:.75,orbitStep:.46,starR:.26,sbGap:.5,idleR0:.5},Ni={K:.032,rMax:.15,nnShare:.45},zo=i=>(i>0?ii.orbit0+(i-1)*ii.orbitStep:ii.orbit0)+ii.sbGap+.2;function Ld(i,t){let e=(i||[]).filter(s=>s&&ge(s.x)&&ge(s.y)),n=new Map;for(let s of e){let r=1/0;for(let a of e)if(a!==s){let l=(s.x-a.x)**2+(s.y-a.y)**2;l<r&&(r=l)}r=Math.sqrt(r);let o=zo(t?t(s.a):0);n.set(s.a,Math.min(Ni.K,Ni.rMax/o,Number.isFinite(r)?Ni.nnShare*r/o:Ni.K))}return n}function Dd(i,t,e,n,s=[0,0,0,0]){let r=Math.round(t[3]);if(r===1)return s[0]=i[2],s[1]=i[3],s[2]=t[0]-i[2],s[3]=t[1]-i[3],s;let o=t[1]+t[2]*n,a=t[0]*Math.cos(o),l=t[0]*Math.sin(o);if(r===2){let d=Math.atan2(-l,-a)+i[3],m=i[2]*.045,M=a+i[2]*Math.cos(d)+m*Math.sin(n*.6+e*13),g=l+i[2]*Math.sin(d)+m*Math.sin(n*.47+e*7);return s[0]=M,s[1]=g,s[2]=a-M,s[3]=l-g,s}let c=d=>{let m=.5-.5*Math.cos(d*6.2831853),M=Math.sin(d*6.2831853)*.18,g=a-i[2],p=l-i[3],I=Math.hypot(g,p)||1;return[i[2]+g*m-p/I*M*I,i[3]+p*m+g/I*M*I]},h=(n*.04+e)%1,f=c(h),u=c(h+.002);return s[0]=f[0],s[1]=f[1],s[2]=u[0]-f[0],s[3]=u[1]-f[1],s}var Nv={oceanic:"oceanic",barren:"barren","gas-giant":"gas","ice-giant":"ice",volcanic:"volcanic",terrestrial:"terrestrial",dark:"dark"},Uv=i=>i.k==="asteroid"?"belt":Nv[i.sub]||"barren",Fv={gas:.2,ice:.18,terrestrial:.15,oceanic:.15,volcanic:.145,barren:.13,dark:.13,belt:.16};function Ov(i){let t=String(i||""),e=0;for(let n=0;n<t.length;n++)e=e*31+t.charCodeAt(n)|0;return Math.abs(e)%3}function Nd(i){let t=i.slice().sort((n,s)=>n.id-s.id||(n.a<s.a?-1:n.a>s.a?1:0)),e=t.length?En(String(t[0].sys)):0;return t.map((n,s)=>{let r=ii.orbit0+s*ii.orbitStep,o=En(n.a),a=Uv(n),l=e*Math.PI*2+s*2.39996323+(o-.5)*.5;return{b:n,i:s,r,a0:l,w:.06/Math.pow(r,1.5),slug:a,variant:Ov(n.n),size:Fv[a]}})}function Ud(i,t,e=[0,0]){let n=(t.length?t[t.length-1].r:ii.orbit0)+ii.sbGap,s=En(String(i)+":sb")*Math.PI*2;return e[0]=Math.cos(s)*n,e[1]=Math.sin(s)*n,e}function tu(i,t,e,n=[0,0]){let s=t+e*Math.sqrt(i),r=i*2.39996323;return n[0]=Math.cos(r)*s,n[1]=Math.sin(r)*s,n}var Bv=(i,t=3)=>(i.res||[]).slice().sort((e,n)=>(n.rich||0)-(e.rich||0)||(e.r<n.r?-1:1)).slice(0,t);function Fd(i,t,e){let n=i.k==="asteroid"?"asteroid":(i.sub||"planet").replace("-"," ")+" planet",s=Bv(i).map(r=>`${r.r} ${r.rich}`).join(", ");return`${i.n} - ${n}${s?" - "+s:""} - ${t} fleet${t===1?"":"s"} mining - ${e} claim stake${e===1?"":"s"} - orbit layout stylised (chain has no in-system positions)`}var ss={r0:1.08,step:.08,rMax:1.3,spacing:.024,beamCap:24};function Od(i,t,e){let n=Math.min(Math.PI*1.85,Math.PI*.9+t*.03),s=i;for(let r=0;;r++){let o=Math.min(ss.r0+r*ss.step,ss.rMax),a=Math.max(3,Math.floor(n*o*e/ss.spacing)),l=t-(i-s);if(s<a||o>=ss.rMax){let c=o>=ss.rMax?Math.max(1,l):Math.min(a,l),h=((s+.5)/c-.5)*n+(r%2?.5*n/c:0);return{r:o*e,ang:h,layer:r}}s-=a}}var Lr=(i,t)=>i!=null&&typeof t=="string"&&Object.prototype.hasOwnProperty.call(i,t);function rc(i,t,e){if(!i||!i.entries)return-1;let n=Lr(i.configToSlug,t)?i.configToSlug[t]:null;if(n&&Lr(i.aliases,n)&&(n=i.aliases[n]),n&&Lr(i.entries,n))return i.entries[n];let s=i.sizeClass||{};return Lr(s,e)?s[e]:Lr(s,i.fallbackClass)?s[i.fallbackClass]:-1}function Bd(i,t,e){let n=rc(i,t,e);if(n<0)return"";let s=Object.entries(i.sizeClass||{}).find(([,o])=>o===n);return s?`generic ${s[0]} hull`:(Object.keys(i.entries).find(o=>i.entries[o]===n)||"").split("-").map(o=>o&&o[0].toUpperCase()+o.slice(1)).join(" ")+" hull"}var Ls={"xx-small":384e-6,"x-small":512e-6,small:704e-6,medium:96e-5,large:.00128,capital:.001664,commander:.00192,titan:.00224},Ds=i=>(Lr(Ls,i)?Ls[i]:Ls.medium)/2/.92,eu={galaxy:1,system:1},en={collapse:.75,full:1.5},bw=en.collapse,ww=en.full,Ns={subwarp:4,warp:10,max:.0096,wSubwarp:.32,wWarp:.22,fadeS:120};var oc=i=>i>1.5?1.15:1;function nu(i,t,e,n){let s=new Map(e.filter(a=>a.k==="asteroid").map(a=>[a.a,a.sys])),r=new Map,o=a=>{let l=r.get(a);return l||(l={docked:[],mining:[],cst:[],idle:[]},r.set(a,l)),l};return i.forEach((a,l)=>{let c=a.s&&a.s.kind;if(c==="docked"&&a.s.system){o(a.s.system).docked.push(l);return}if(c==="mining"){let d=s.get(a.s.asteroid);d&&o(d).mining.push(l);return}let h=$h(a,n);if(!h)return;let f=null,u=.36;for(let d of t){let m=(d.x-h[0])**2+(d.y-h[1])**2;m<u&&(u=m,f=d.a)}f&&o(f)[c==="claimStakeTransfer"?"cst":"idle"].push(l)}),r}function iu(i,t){i=i||{};let e=(i.systems||[]).filter(d=>d&&ge(d.x)&&ge(d.y)),n=new Map((i.systems||[]).filter(d=>d&&d.a).map(d=>[d.a,d])),s=new Map;for(let d of i.asteroids||[])d&&d.a&&d.sys&&s.set(d.a,d.sys);let r=(ge(i.generatedAt)?i.generatedAt:0)-120,o=new Map;for(let d of t||[])for(let m of d&&d.members||[]){let M=o.get(m)||[];M.includes(d.tag)||M.push(d.tag),o.set(m,M)}let a=new Map,l=(d,m)=>{let M=a.get(d);return M||a.set(d,M={}),M[m]||(M[m]={fleets:0,ships:0,stakes:0,ups:0})};for(let d of i.fleets||[]){if(!d||d.npc||!d.s||!ge(d.x)||!ge(d.y))continue;let m=o.get(d.o);if(!m)continue;let M=kd(d,e,s,r);if(!M)continue;let g=ko(d);for(let p of m){let I=l(M,p);I.fleets++,I.ships+=d.ships||0,I.ups+=g}}for(let d of i.stakes||[]){let m=d&&d.sys?o.get(d.o):null;if(m)for(let M of m)l(d.sys,M).stakes++}let c=(d,m)=>m.fleets-d.fleets||m.stakes-d.stakes||m.ups-d.ups||(d.a<m.a?-1:d.a>m.a?1:0),h=d=>Object.values(d).reduce((m,M)=>({fleets:m.fleets+M.fleets,stakes:m.stakes+M.stakes,ups:m.ups+M.ups}),{fleets:0,stakes:0,ups:0}),f=[...a].map(([d,m])=>{let M=n.get(d)||{};return{a:d,n:M.n||null,x:M.x,y:M.y,byDac:m}}).sort((d,m)=>c({a:d.a,...h(d.byDac)},{a:m.a,...h(m.byDac)})),u={};for(let d of t||[])u[d.tag]=f.filter(m=>m.byDac[d.tag]).map(m=>({a:m.a,n:m.n,x:m.x,y:m.y,...m.byDac[d.tag]})).sort(c);return{systems:f,byDac:u}}function kd(i,t,e,n){let s=i.s.kind;if(s==="docked"&&i.s.system)return i.s.system;if(s==="mining")return e.get(i.s.asteroid)||null;let r=$h(i,n);if(!r)return null;let o=null,a=.36;for(let l of t){let c=(l.x-r[0])**2+(l.y-r[1])**2;c<a&&(a=c,o=l.a)}return o}var zd="#8a94a6",kv=/^#[0-9a-fA-F]{6}$/,ac=i=>typeof i=="string"&&kv.test(i)?i.toLowerCase():zd,ni=i=>i?i.fleets+i.stakes:0;function zv(i,t){let e=null;for(let n of t){let s=i[n];!s||ni(s)<=0||(!e||ni(s)>ni(i[e])||ni(s)===ni(i[e])&&s.ups>i[e].ups)&&(e=n)}return e}function Vd(i,t,e){let n=(t||[]).filter(f=>f&&typeof f.tag=="string"&&f.tag);if(!i||!n.length)return{cols:[],halos:[]};let s=iu(i,n),r=n.map(f=>f.tag),o=new Map(n.map(f=>[f.tag,ac(f.color)])),a=e&&o.has(e)?e:null,l=[],c=[],h=0;for(let f of s.systems)for(let u of r)h=Math.max(h,ni(f.byDac[u]));for(let f of s.systems){if(!ge(f.x)||!ge(f.y))continue;let u=r.reduce((g,p)=>g+ni(f.byDac[p]),0);if(u<=0)continue;for(let g of r){let p=f.byDac[g],I=ni(p);I<=0||c.push({sys:f.a,tag:g,x:f.x,y:f.y,hex:o.get(g),share:I/u,w:I,wmax:h,dim:a&&g!==a})}let d=a||zv(f.byDac,r),m=d&&f.byDac[d];if(!m||ni(m)<=0)continue;let M=r.filter(g=>g!==d&&ni(f.byDac[g])>0).length;l.push({key:"dac:"+f.a,x:f.x,y:f.y,v:a?ni(m):u,fa:"dac",hex:o.get(d),tag:d,sys:f.a,name:f.n||"System",line:`${d}${Di}${gi(m.fleets,"fleet")}${Di}${gi(m.stakes,"stake")}${M?`${Di}+${M} DAC${M===1?"":"s"}`:""}`,fleets:m.fleets,stakes:m.stakes})}return l.sort((f,u)=>u.v-f.v||(f.key<u.key?-1:1)),{cols:l,halos:c,inf:s}}var su=["mining","stakes","combat","fleets"];function Hd(i,t,e,n,s){i=i||{};let r=(e||[]).filter(b=>b&&typeof b.tag=="string"&&b.tag),o=[...new Set(r.map(b=>b.tag))],a=typeof s=="string"&&o.includes(s)?[s]:o,l=su.filter(b=>Array.isArray(n)&&n.includes(b)),c=(i.systems||[]).filter(b=>b&&typeof b.a=="string"&&ge(b.x)&&ge(b.y)),h=new Map;for(let b of i.asteroids||[])b&&b.a&&b.sys&&h.set(b.a,b.sys);let f=ge(i.generatedAt)?i.generatedAt:0,u=f-120,d=new Map;for(let b of r)if(a.includes(b.tag))for(let T of b.members||[]){let D=d.get(T)||[];D.includes(b.tag)||D.push(b.tag),d.set(T,D)}let m=new Map,M=(b,T,D,v,P)=>{let N=m.get(b);N||m.set(b,N={});let O=N[T]||(N[T]={T:0,v:{}});O.T+=v;let B=P?d.get(D):null;if(B)for(let q of B)O.v[q]=(O.v[q]||0)+v},g=l.includes("mining"),p=l.includes("fleets");if(g||p)for(let b of i.fleets||[]){if(!b||!b.s||!ge(b.x)||!ge(b.y))continue;let T=kd(b,c,h,u);T&&(g&&M(T,"mining",b.o,ko(b),!b.npc),p&&M(T,"fleets",b.o,ge(b.ships)?b.ships:0,!b.npc))}if(l.includes("stakes"))for(let b of i.stakes||[])b&&typeof b.sys=="string"&&M(b.sys,"stakes",b.o,1,!0);if(l.includes("combat")){let b=new Set,T=ic*ic,D=new Map;for(let v of i.fleets||[])v&&v.a&&D.set(v.a,v.o);for(let v of t||[]){if(!v||!Zh(v)||!ge(v.t)||!ge(v.x)||!ge(v.y)||v.t>f||v.t<=f-86400)continue;if(Is(v)&&v.f){if(b.has(v.f))continue;b.add(v.f)}let P=null,N=T;for(let O of c){let B=(O.x-v.x)**2+(O.y-v.y)**2;(B<N||B===N&&P&&O.a<P.a)&&(N=B,P=O)}P&&M(P.a,"combat",typeof v.o=="string"?v.o:D.get(v.f),1,v.npc!==!0)}}let I=[],F=Object.fromEntries(a.map(b=>[b,0])),A=0;for(let b of c.slice().sort((T,D)=>T.a<D.a?-1:T.a>D.a?1:0)){let T=m.get(b.a);if(!T)continue;let D={},v=0;for(let B of l){let q=T[B];if(!(!q||!(q.T>0))){v++;for(let V of a)q.v[V]>0&&(D[V]=(D[V]||0)+q.v[V]/q.T)}}if(!v)continue;let P=null,N=0;for(let B of a)D[B]>N&&(N=D[B],P=B);let O=!!P&&a.some(B=>B!==P&&D[B]>0&&Math.abs(D[B]-N)<=1e-9);O?A++:P&&F[P]++,I.push({a:b.a,n:b.n||null,x:b.x,y:b.y,winner:O?null:P,contested:O,strength:P&&!O?N/v:0,scores:D})}return{systems:I,byDac:F,contested:A}}function Gd(i,t){let e=new Map((t||[]).filter(h=>h&&typeof h.tag=="string").map(h=>[h.tag,ac(h.color)])),n=i&&i.byDac||{},s=[];for(let h of i&&i.systems||[]){if(!h||!h.winner||!ge(h.x)||!ge(h.y))continue;let f=Math.round(Math.max(0,Math.min(1,h.strength))*100),u=n[h.winner]||0;s.push({key:"dac:"+h.a,x:h.x,y:h.y,v:Math.max(1,f),fa:"dac",hex:e.get(h.winner)||zd,tag:h.winner,sys:h.a,name:h.n||"System",line:`${h.winner}${Di}conquers ${gi(u,"system")}`,strength:h.strength,won:u,callout:!1})}let r=(h,f)=>f.v-h.v||(h.key<f.key?-1:h.key>f.key?1:0);s.sort(r);let o=new Map;for(let h of s){let f=o.get(h.tag)||[0,0];f[0]+=h.strength,f[1]++,o.set(h.tag,f)}let a=[],l=new Set;for(let h of s)l.has(h.tag)||(l.add(h.tag),h.callout=!0,a.push(h));let c=h=>{let f=o.get(h);return f[0]/f[1]};return a.sort((h,f)=>f.won-h.won||c(f.tag)-c(h.tag)||(h.tag<f.tag?-1:h.tag>f.tag?1:0)),a.concat(s.filter(h=>!h.callout))}function Wd(i){let t=i.s&&i.s.kind||"idle";return`${i.n||"Fleet"} - ${i.ships||0} ship${i.ships===1?"":"s"} - ${t}${i.npc?" (NPC)":""}`}var Xd=i=>`${i.n||"System"} - ${tn(i.f)} starbase lvl ${i.lvl||0}`,qd=i=>`${i.sysName||"Asteroid"} asteroid - ${i.fleets||0} fleets - ${(i.ups||0).toFixed(1)} u/s`;var Us=[.8,3.2],Fs=[3.5,14],xi=[2.5,10],Os=[1,4],$d=[.8,3.2],Zd=12,Vv=.4,Nr=384,Fr=6,Jd=5,Hv=["gas","ice","terrestrial","oceanic","volcanic","barren","dark"],Ur=[...Hv.flatMap(i=>[0,1,2].map(t=>`${i}_${t}_384.webp`)),...[0,1,2,3,4].map(i=>`star_${i}_384.webp`)],Kd={gas:[.85,.7,.5],ice:[.55,.82,1],terrestrial:[.45,.75,.45],oceanic:[.2,.5,1],volcanic:[1,.45,.2],barren:[.62,.6,.58],dark:[.35,.35,.55],belt:[.6,.55,.5]},Bs=`
uniform float uViewH;
vec3 relOf(vec2 c, vec2 loc) { return vec3((c.x - cameraPosition.x) + loc.x, -cameraPosition.y, (-c.y - cameraPosition.z) - loc.y); }
vec3 viewOf(vec3 r) { return mat3(viewMatrix) * r; }
float lodS(float a, float b, float x) { return smoothstep(log2(a), log2(b), log2(max(x, 1e-6))); } // LOD fade by log px (v11)
float ppuOf(vec3 v) { return projectionMatrix[1][1] * 0.5 * uViewH / max(-v.z, 1e-7); }
vec4 clipOf(vec3 v) { return projectionMatrix * vec4(v, 1.0); }
#define COLLAPSE { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
`,Gv=Bs+`
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
  float al = kind == 2 ? lodS(${xi[0].toFixed(2)}, ${xi[1].toFixed(2)}, rpx) : lodS(${Us[0].toFixed(2)}, ${Us[1].toFixed(2)}, rpx);
  if (al < 0.002) COLLAPSE
  // quad half-size in disc radii: room for the star's corona / the hover ring / a worked rock's indicator ring
  float qs = kind == 2 ? 2.6 : (iW.x > 0.5 ? 1.75 : 1.25);
  // the renders are lit from screen angle 145 deg (upper-left): turn the sprite so that side faces the star (kind 2: none)
  float ang = 0.0;
  if (kind != 2) { vec3 ts = mat3(viewMatrix) * vec3(-loc.x, 0.0, loc.y); if (dot(ts.xy, ts.xy) > 1e-20) ang = atan(ts.y, ts.x + 1e-12) - 2.5307274; }
  float c = cos(ang), s = sin(ang);
  vec2 q = position.xy; vec2 rq = vec2(c * q.x - s * q.y, s * q.x + c * q.y);
  vP = position.xy * 2.0; vQs = qs; vCol = iC; vKind = float(kind); vCell = iQ.w; vA = al;
  vArtK = iArt < 0.0 ? 0.0 : clamp((uTime - iArt) / ${Vv.toFixed(2)}, 0.0, 1.0);
  vW = iW; vWC = iWC; vHi = abs(float(gl_InstanceID) - uHiId) < 0.5 ? 1.0 : 0.0; vSeed = iW.w;
  // the miners' hulls on this rock: a medium hull's px here (the indicator dims as the ships themselves show)
  vShips = smoothstep(1.5, 4.0, ${Ls.medium.toFixed(6)} / 0.92 * ppu);
  gl_Position = clipOf(v + vec3(rq * iQ.y * qs * 2.0, 0.0));
}`,Wv=`
uniform sampler2D uArt; uniform float uAnim;
varying vec2 vP; varying vec3 vCol; varying float vKind; varying float vCell; varying float vA; varying float vArtK; varying float vQs;
varying vec4 vW; varying vec3 vWC; varying float vHi; varying float vSeed; varying float vShips;
vec4 artAt(vec2 uv) {
  float cell = floor(vCell + 0.5), cx = mod(cell, ${Fr.toFixed(1)}), cy = floor(cell / ${Fr.toFixed(1)});
  vec4 t = texture2D(uArt, vec2((cx + uv.x) / ${Fr.toFixed(1)}, 1.0 - (cy + 1.0 - uv.y) / ${Jd.toFixed(1)}));
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
}`,Xv=Bs+`
attribute vec4 iP; // (system x, y, orbit radius world, belt 0/1)
varying vec2 vP; varying float vA; varying float vBelt;
void main() {
  vec3 c = viewOf(relOf(iP.xy, vec2(0.0)));
  float rpx = iP.z * ppuOf(c);
  float al = lodS(${Fs[0].toFixed(2)}, ${Fs[1].toFixed(2)}, rpx);
  if (al < 0.002) COLLAPSE
  vP = position.xy * 2.0; vA = al; vBelt = iP.w;
  gl_Position = clipOf(viewOf(relOf(iP.xy, position.xy * 2.0 * iP.z)));
}`,qv=`
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
}`,Yv=Bs+`
attribute vec4 iP; // (system x, y, station local x, y world)
attribute vec4 iQ; // (half-size world, level, 0, 0)
attribute vec3 iC;
uniform float uHiSys;
varying vec2 vP; varying vec3 vCol; varying float vLvl; varying float vA; varying float vHi;
void main() {
  vec3 v = viewOf(relOf(iP.xy, iP.zw));
  float px = iQ.x * ppuOf(v);
  float al = lodS(${Os[0].toFixed(2)}, ${Os[1].toFixed(2)}, px);
  if (al < 0.002) COLLAPSE
  vP = position.xy * 2.0; vCol = iC; vLvl = iQ.y; vA = al; vHi = abs(float(gl_InstanceID) - uHiSys) < 0.5 ? 1.0 : 0.0;
  gl_Position = clipOf(v + vec3(position.xy * iQ.x * 2.0, 0.0));
}`,$v=`
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
}`,Zv=Bs+`
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
  float al = lodS(${$d[0].toFixed(2)}, ${$d[1].toFixed(2)}, px);
  if (al < 0.002) COLLAPSE
  vP = position.xy * 2.0; vCol = iC; vA = al;
  gl_Position = clipOf(v + vec3(position.xy * iQ.w * 2.0, 0.0));
}`,Kv=`
varying vec2 vP; varying vec3 vCol; varying float vA;
void main() {
  float d = abs(vP.x) + abs(vP.y);
  float body = smoothstep(0.62, 0.56, d), edge = smoothstep(0.08, 0.0, abs(d - 0.62)), flag = smoothstep(0.32, 0.26, d);
  vec3 c = mix(vec3(0.02), vCol * 1.3, body) + vCol * edge * 0.8 + vec3(1.0) * flag * 0.35;
  float a = smoothstep(0.7, 0.62, d);
  gl_FragColor = vec4(c * a, a * 0.95) * vA;
}`;function jd(i){let{scene:t,camera:e,U:n,quadGeometry:s,instanceAttrs:r,shaderMat:o,assetBase:a}=i,l=document.createElement("canvas");l.width=Fr*Nr,l.height=Jd*Nr;let c=l.getContext("2d"),h=new ao(l);h.colorSpace=ln,h.anisotropy=4;let f=Ur.map(()=>0),u=0,d=0,m=0,M=!1,g=0,p=new Map(Ur.map((W,tt)=>[W,tt])),I=s(),F=s(),A=s(),b=s(),T={uAnim:n.uAnim,uTime:n.uTime,uViewH:n.uViewH,uArt:{value:h},uHiId:{value:-1}},D=new Oe(I,o(Gv,Wv,T,null,"premult")),v=new Oe(F,o(Xv,qv,{uViewH:n.uViewH},null,"add")),P={uAnim:n.uAnim,uViewH:n.uViewH,uHiSys:{value:-1}},N=new Oe(A,o(Yv,$v,P,null,"premult")),O=new Oe(b,o(Zv,Kv,{uAnim:n.uAnim,uViewH:n.uViewH},null,"premult"));for(let[W,tt]of[[v,3.4],[N,4.2],[D,4.4],[O,4.6]])W.frustumCulled=!1,W.renderOrder=tt,t.add(W);let B=null,q=[["iP",4],["iQ",4],["iC",3],["iW",4],["iWC",3],["iArt",1]];function V(W){let tt=W.systems,Mt=W.bodiesBySys||new Map,bt=Ld(tt,C=>(Mt.get(C)||[]).length),xt=[],Bt=[],Ne=new Map;for(let C=0;C<tt.length;C++){let gt=tt[C],It=Nd(Mt.get(gt.a)||[]),R=bt.get(gt.a)||Ni.K,x=Ud(gt.a,It),H={s:gt,si:C,k:R,layout:It,ext:zo(It.length)*R,sb:[x[0]*R,x[1]*R],sbHalf:.16*R,starR:ii.starR*R,starCell:p.get(`star_${Math.floor(En(String(gt.a)+":star")*5)}_384.webp`),b0:Bt.length,nb:It.length,members:null,worked:new Map,stakeN:new Map,sx:0,sy:0,ppu:0,extPx:0,on:!1};for(let E of It){let X=E.slug==="belt"?-1:p.get(`${E.slug}_${E.variant}_384.webp`);Bt.push({si:C,L:E,r:E.r*R,R:E.size*R,a0:E.a0,w:E.w,kind:E.b.k==="asteroid"?1:0,cell:X??-1})}xt.push(H),Ne.set(gt.a,H)}let jt=Bt.length,ne=jt+xt.length,de=new Map(Bt.map((C,gt)=>[C.L.b.a,gt])),Jt=new Array(W.fleets.length).fill(null);for(let C of xt){let gt=W.members&&W.members.get(C.s.a);if(!gt)continue;C.members=gt;let It=C.k,R=C.s.x,x=C.s.y,H=[0,0];gt.docked.forEach((ft,Y)=>{tu(Y,.07,.016,H),Jt[ft]={mode:1,A:[R,x,C.sb[0]+H[0]*It,C.sb[1]+H[1]*It],O:[C.sb[0],C.sb[1],0,1],T:[0,0],si:C.si,role:"docked"}}),gt.idle.forEach((ft,Y)=>{tu(Y,ii.idleR0,.02,H);let nt=H[0]*It,it=H[1]*It;Jt[ft]={mode:1,A:[R,x,nt,it],O:[nt,it,0,1],T:[0,0],si:C.si,role:"idle"}});let E=new Map,X=[];for(let ft of gt.mining){let Y=de.get(W.fleets[ft].s.asteroid);if(Y==null||Bt[Y].si!==C.si)continue;let nt=E.get(Y)||0;E.set(Y,nt+1),X.push({i:ft,bi:Y,j:nt})}for(let ft of X){let Y=Bt[ft.bi];ft.slot=Od(ft.j,E.get(ft.bi),Y.L.size)}X.slice().sort((ft,Y)=>ft.slot.layer-Y.slot.layer||ft.j-Y.j||ft.bi-Y.bi).forEach((ft,Y)=>{ft.beam=Y<ss.beamCap});for(let ft of X){let Y=Bt[ft.bi];Jt[ft.i]={mode:2,A:[R,x,ft.slot.r*It,ft.slot.ang],O:[Y.r,Y.a0,Y.w,2],T:[Y.R,ft.beam?1:0],si:C.si,role:"mining",bi:ft.bi};let nt=W.fleets[ft.i],it=nt.npc?"unaligned":tn(nt.fa),wt=ko(nt),Nt=C.worked.get(ft.bi);Nt||C.worked.set(ft.bi,Nt={n:0,ups:0,byFa:{}}),Nt.n++,Nt.ups+=wt,Nt.byFa[it]=(Nt.byFa[it]||0)+wt+1e-9}for(let ft of gt.cst){let Y=W.fleets[ft],nt=(W.stakes||[]).find(wt=>wt.o===Y.o&&de.has(wt.body)&&Bt[de.get(wt.body)].si===C.si),it=nt?de.get(nt.body):-1;if(it<0){let wt=C.layout.find(Nt=>Nt.b.k==="planet"&&Nt.b.claimed)||C.layout.find(Nt=>Nt.b.k==="planet");wt&&(it=de.get(wt.b.a))}Jt[ft]=it>=0?{mode:3,A:[R,x,C.sb[0],C.sb[1]],O:[Bt[it].r,Bt[it].a0,Bt[it].w,3],T:[0,0],si:C.si,role:"cst",bi:it}:{mode:1,A:[R,x,C.sb[0],C.sb[1]],O:[C.sb[0],C.sb[1],0,1],T:[0,0],si:C.si,role:"cst"}}}let ie=r(I,q,ne);for(let C=0;C<jt;C++){let gt=Bt[C],It=xt[gt.si].s;ie.iP.array.set([It.x,It.y,gt.r,gt.a0],C*4),ie.iQ.array.set([gt.w,gt.R,gt.kind,f[gt.cell]===2?gt.cell:-1],C*4),ie.iC.array.set(Kd[gt.L.slug]||Kd.barren,C*3);let R=xt[gt.si].worked.get(C);if(R){let x=Object.entries(R.byFa).sort((H,E)=>E[1]-H[1])[0][0];ie.iW.array.set([R.n,Math.min(1,Math.log10(1+R.ups)/3.2),0,En(gt.L.b.a)],C*4),ie.iWC.array.set(Ui[x],C*3),gt.work={n:R.n,ups:R.ups,fa:x}}else ie.iW.array.set([0,0,0,En(gt.L.b.a)],C*4),ie.iWC.array.set([0,0,0],C*3),gt.work=null;ie.iArt.array[C]=f[gt.cell]===2?-1e3:-1}for(let C=0;C<xt.length;C++){let gt=xt[C],It=jt+C;ie.iP.array.set([gt.s.x,gt.s.y,0,0],It*4),ie.iQ.array.set([0,gt.starR,2,f[gt.starCell]===2?gt.starCell:-1],It*4),ie.iC.array.set([1,.8,.45],It*3),ie.iW.array.set([0,0,0,0],It*4),ie.iWC.array.set([0,0,0],It*3),ie.iArt.array[It]=f[gt.starCell]===2?-1e3:-1}for(let C in ie)ie[C].needsUpdate=!0;let ke=r(F,[["iP",4]],jt);for(let C=0;C<jt;C++){let gt=Bt[C],It=xt[gt.si].s;ke.iP.array.set([It.x,It.y,gt.r,gt.kind],C*4)}ke.iP.needsUpdate=!0;let xe=r(A,[["iP",4],["iQ",4],["iC",3]],xt.length);xt.forEach((C,gt)=>{xe.iP.array.set([C.s.x,C.s.y,C.sb[0],C.sb[1]],gt*4),xe.iQ.array.set([C.sbHalf,C.s.lvl||0,0,0],gt*4),xe.iC.array.set(Ui[tn(C.s.f)],gt*3)});for(let C in xe)xe[C].needsUpdate=!0;let Te=[];for(let C of W.stakes||[]){let gt=de.get(C.body);if(gt==null)continue;let It=xt[Bt[gt].si],R=It.stakeN.get(gt)||0;It.stakeN.set(gt,R+1),Te.push({st:C,bi:gt,k:R,fa:W.ownerFa&&W.ownerFa.get(C.o)||"unaligned"})}let Pe=r(b,[["iP",4],["iQ",4],["iC",3]],Te.length);Te.forEach((C,gt)=>{let It=Bt[C.bi],R=xt[It.si].s,x=xt[It.si].k;Pe.iP.array.set([R.x,R.y,It.r,It.a0],gt*4),Pe.iQ.array.set([It.w,C.k*1.1+.6,It.R*1.35,.024*x],gt*4),Pe.iC.array.set(Ui[tn(C.fa)],gt*3)});for(let C in Pe)Pe[C].needsUpdate=!0;return B={infos:xt,bodyAt:Bt,byAddr:Ne,bodyIdx:de,place:Jt,nb:jt,stakeList:Te},$t(),B}function K(W){if(W==null||W<0||f[W])return;f[W]=1,u++;let tt=new Image;tt.onload=()=>{if(!B)return;c.drawImage(tt,W%Fr*Nr,Math.floor(W/Fr)*Nr,Nr,Nr),f[W]=2,d++,M=!0;let Mt=I.getAttribute("iQ"),bt=I.getAttribute("iArt");for(let xt=0;xt<B.bodyAt.length;xt++)B.bodyAt[xt].cell===W&&(Mt.array[xt*4+3]=W,bt.array[xt]=n.uTime.value);B.infos.forEach((xt,Bt)=>{xt.starCell===W&&(Mt.array[(B.nb+Bt)*4+3]=W,bt.array[B.nb+Bt]=n.uTime.value)}),Mt.needsUpdate=bt.needsUpdate=!0},tt.onerror=()=>{f[W]=3,m++,console.warn("C4Scene: planet render failed to load, using the placeholder sphere:",Ur[W])},tt.src=a+Ur[W]}function lt(W){M&&W-g>200&&(h.needsUpdate=!0,M=!1,g=W)}function at(W,tt,Mt=[0,0]){let bt=B.bodyAt[W],xt=B.infos[bt.si].s,Bt=bt.a0+bt.w*tt;return Mt[0]=xt.x+bt.r*Math.cos(Bt),Mt[1]=xt.y+bt.r*Math.sin(Bt),Mt}let pt=new G,ot=new G;function ut(W,tt){if(!B)return;let Mt=e.projectionMatrix.elements[5];for(let bt of B.infos){ot.set(bt.s.x,0,-bt.s.y).applyMatrix4(e.matrixWorldInverse);let xt=-ot.z;if(xt<=1e-6){bt.on=!1,bt.extPx=0;continue}if(pt.set(bt.s.x,0,-bt.s.y).project(e),bt.sx=(pt.x+1)/2*W,bt.sy=(1-pt.y)/2*tt,bt.ppu=Mt*.5*tt/xt,bt.extPx=bt.ext*bt.ppu,bt.on=bt.sx>-bt.extPx-40&&bt.sx<W+bt.extPx+40&&bt.sy>-bt.extPx-40&&bt.sy<tt+bt.extPx+40,!(!bt.on||bt.extPx<20)){bt.starR*bt.ppu>=Zd&&K(bt.starCell);for(let Bt=bt.b0;Bt<bt.b0+bt.nb;Bt++)B.bodyAt[Bt].R*bt.ppu>=Zd&&K(B.bodyAt[Bt].cell)}}}let dt=!0;function $t(){if(!B)return;let W=I.getAttribute("iW");for(let tt=0;tt<B.nb;tt++){let Mt=B.bodyAt[tt];W.array[tt*4]=Mt.work&&dt?Mt.work.n:0}W.needsUpdate=!0}function Xt(W,tt){dt=!!tt,$t()}function we(W){D.visible=v.visible=N.visible=O.visible=!!W}function fe(W,tt){T.uHiId.value=W??-1,P.uHiSys.value=tt??-1}function ve(){for(let W of[D,v,N,O])t.remove(W),W.geometry.dispose(),W.material.dispose();h.dispose(),B=null}return{build:V,lod:ut,bodyPos:at,requestArt:K,flushArt:lt,setLayers:Xt,setVisible:we,setHover:fe,dispose:ve,get world(){return B},texStats:()=>({texRequested:u,texLoaded:d,texFailed:m,atlasCells:Ur.length}),artFiles:Ur}}var ou=["systems","fleets","mining","routes","combat","territory","labels"],bn={x:.5,y:.5,dist:128,polar:.72},Jv={combat:0,destroyed:1,starbaseCombat:2,captured:3,newFleet:4,gone:5},jv=[3,6,4.5,9,2.6,1.6],Qv=[[1,.55,.2],[1,.3,.15],[1,.78,.32],null,null,[.55,.66,.85]],lc=64,cc=48,ty=3,Or=42,ey=40,Qd=.01,ny=2500,iy=2.5,sy=10,ry=20,oy=20,ay=.35,ly=.22,Ho=Bs+`
uniform float uNow; uniform float uAnim; uniform float uZoom;
attribute vec4 iA; attribute vec2 iT; attribute vec3 iC; attribute vec4 iM;
attribute vec2 iX; // (ship silhouette atlas cell or -1, size-class scale)
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
`,cy=Ho+`
uniform float uSil; uniform float uHasAtlas; uniform float uShipBase;
varying vec2 vP; varying vec3 vCol; varying float vKind; varying float vVis; varying float vSeed; varying float vSil; varying float vCell; varying float vFade;
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
  if (px < ${en.collapse.toFixed(2)}) COLLAPSE
  vFade = smoothstep(${en.collapse.toFixed(2)}, ${en.full.toFixed(2)}, px); // fades out below HULL_PX.full instead of a floor
  vec2 w = (side * position.x + dir * position.y) * size * 2.0;
  vP = position.xy * 2.0; vCol = iC; vVis = iM.z; vSeed = iM.w; vSil = sil; vCell = iX.x;
  vKind = mode == 2 || mode == 3 ? 4.0 : (mode == 0 && transit(k) && !flying) ? 0.0 : float(k);
  gl_Position = clipOf(viewOf(relOf(c, loc + w)));
}`,hy=3.2,tp=[1.5,4],uy=Ho+`
uniform float uSil; uniform float uHasAtlas; uniform float uShipBase; uniform float uDots;
varying vec2 vP; varying vec3 vCol; varying float vA;
void main() {
  if (uDots < 0.5 || iM.z < 0.5) COLLAPSE   // filtered-out fleets: a dimmed dot stacks back to full brightness in a pile
  int k = kindOf();
  vec2 c, loc, hd; place(c, loc, hd);
  float sil = (uHasAtlas > 0.5 && iX.x >= 0.0 && k != 5) ? uSil : 0.0;
  float size = uShipBase * iX.y * (iM.z > 1.5 ? 1.15 : 1.0) * mix(1.8, 1.0, sil);
  float ppu = ppuOf(viewOf(relOf(c, loc)));
  vA = min(iM.z, 1.0) * (1.0 - smoothstep(${tp[0].toFixed(2)}, ${tp[1].toFixed(2)}, size * 2.0 * ppu));
  if (vA < 0.004) COLLAPSE
  vP = position.xy * 2.0; vCol = iC;
  gl_Position = clipOf(viewOf(relOf(c, loc + position.xy * ${hy.toFixed(2)} / ppu)));
}`,fy=`
varying vec2 vP; varying vec3 vCol; varying float vA;
void main() {
  float a = smoothstep(1.0, 0.7, length(vP)) * vA;
  gl_FragColor = vec4(vCol * 0.8 * a, a);   // under 1.0 so the bloom pass keeps the faction hue on such a small mark
}`,dy=`
uniform float uAnim; uniform sampler2D uAtlas; uniform float uCols; uniform float uRows;
varying vec2 vP; varying vec3 vCol; varying float vKind; varying float vVis; varying float vSeed; varying float vSil; varying float vCell; varying float vFade;
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
  float v = min(vVis, 1.0) * smoothstep(1.0, 0.82, r);
  // premultiplied 'over': the body (alpha = fill) occludes what is under it, the halo and rings (alpha 0) add light.
  gl_FragColor = vec4(c * v, alpha * v) * vFade;
}`,py=Ho+`
uniform float uSil; uniform float uHasAtlas; uniform float uShipBase;
varying float vU; varying float vX; varying vec3 vCol; varying float vA; varying float vWarp;
void main() {
  int k = kindOf();
  float fade = 1.0 - smoothstep(0.0, ${Ns.fadeS.toFixed(1)}, uNow - iT.y);
  if (modeOf() != 0 || !transit(k) || iM.z < 0.5 || fade <= 0.0 || uNow < iT.x) COLLAPSE
  float prog = fleetProg();
  vec2 p = fleetPos(prog); vec2 d = iA.zw - iA.xy; float L = length(d);
  if (L < 1e-6) COLLAPSE
  float sil = (uHasAtlas > 0.5 && iX.x >= 0.0) ? uSil : 0.0;
  float size = uShipBase * iX.y * (iM.z > 1.5 ? 1.15 : 1.0) * mix(1.8, 1.0, sil);
  vec3 vc = viewOf(relOf(p, vec2(0.0)));
  float ppu = ppuOf(vc), px = size * 2.0 * ppu;
  if (px < ${en.collapse.toFixed(2)}) COLLAPSE
  float hl = uShipBase * iX.y * 1.84; // HULL_LEN of the class (sizeScale = HULL_LEN / 2 / 0.92)
  vec2 dir = d / L;
  float tl = min(L * prog, min(${Ns.max.toFixed(5)}, hl * (k == 3 ? ${Ns.warp.toFixed(1)} : ${Ns.subwarp.toFixed(1)}))) * fade; // retracts as it fades after arrival
  if (tl < 1e-7) COLLAPSE
  vec2 side = vec2(dir.y, -dir.x);
  float u = position.y + 0.5;
  // width in world units off the hull; floored at 1 CSS px (thinner would shimmer) with the alpha scaled down to match
  float wdt = hl * (k == 3 ? ${Ns.wWarp.toFixed(2)} : ${Ns.wSubwarp.toFixed(2)});
  float wd = max(wdt, 1.0 / ppu);
  vU = u; vX = position.x * 2.0; vCol = iC; vWarp = k == 3 ? 1.0 : 0.0;
  vA = fade * min(iM.z, 1.0) * (wdt / wd) * smoothstep(${en.collapse.toFixed(2)}, ${en.full.toFixed(2)}, px);
  gl_Position = clipOf(viewOf(relOf(p, mix(-dir * tl, vec2(0.0), u) + side * position.x * wd)));
}`,my=`
uniform float uAnim;
varying float vU; varying float vX; varying vec3 vCol; varying float vA; varying float vWarp;
void main() {
  float a = pow(clamp(vU, 0.0, 1.0), 1.7) * (1.0 - vX * vX);
  vec3 col = mix(vCol, vec3(0.65, 0.95, 1.0), vWarp * 0.6);
  float shimmer = 0.82 + 0.18 * sin(vU * 46.0 - uAnim * 18.0);
  gl_FragColor = vec4(col * a * vA * shimmer * 1.3, 1.0);
}`,ap=4,gy=Ho+`
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
  gl_Position = clipOf(viewOf(relOf(c, side * position.x * ${ap.toFixed(1)} * upx)));
}`,xy=`
uniform float uAnim;
varying float vU; varying float vX; varying vec3 vCol; varying float vLen; varying float vA;
void main() {
  float xp = vX * ${(ap/2).toFixed(1)};                 // CSS px from the centre line
  float prof = exp(-xp * xp * 2.0) + exp(-xp * xp * 0.6) * 0.12;  // crisp ~1.2 px core + faint halo
  float f = fract(vU * vLen / 1.6 - uAnim * 0.35);
  float flow = 0.55 + 0.45 * smoothstep(0.0, 0.45, f) * smoothstep(1.0, 0.55, f); // soft travelling pulses, no hard dashes
  float a = prof * flow * (0.3 + 0.45 * vU) * vA;
  gl_FragColor = vec4(mix(vCol, vec3(0.55, 0.7, 0.85), 0.15) * a * 0.42, 1.0);
}`,_y=Ho+`
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
  if (px < ${en.collapse.toFixed(2)}) COLLAPSE
  vec2 e0 = b - dir * iT.x * 0.92, e1 = loc + dir * hz * 0.9; // rock surface (u 0) -> ship nose (u 1)
  float u = position.y + 0.5;
  vU = u; vX = position.x * 2.0; vCol = iC; vLen = length(e1 - e0) / (hz * 2.0) * 0.3; vSeed = iM.w;
  vA = min(iM.z, 1.0) * smoothstep(${en.collapse.toFixed(2)}, ${en.full.toFixed(2)}, px);
  gl_Position = clipOf(viewOf(relOf(c, mix(e0, e1, u) + side * position.x * hz * 0.24)));
}`,vy=`
uniform float uAnim; uniform float uBeamGain;
varying float vU; varying float vX; varying vec3 vCol; varying float vLen; varying float vSeed; varying float vA;
void main() {
  float f = fract(vU * vLen * 1.6 - uAnim * 1.4 + vSeed * 7.0);
  float bead = smoothstep(0.22, 0.0, abs(f - 0.5));
  float a = (0.22 + bead * 0.95) * (1.0 - vX * vX) * smoothstep(0.0, 0.2, vU) * vA;
  gl_FragColor = vec4(mix(vec3(1.0, 0.84, 0.42), vCol, 0.35) * a * 0.42 * uBeamGain, 1.0);
}`,yy=Bs+`
uniform float uSysZoom; uniform float uGlyphK;
attribute vec4 iS; attribute vec3 iC; attribute vec4 iM;
varying vec2 vP; varying vec3 vCol; varying float vLvl; varying float vVis; varying float vSeed; varying float vCo;
void main() {
  vec3 v = viewOf(relOf(iS.xy, vec2(0.0)));
  float ppu = ppuOf(v);
  float vis = iM.x * (1.0 - lodS(${xi[0].toFixed(2)}, ${xi[1].toFixed(2)}, iM.w * ppu));
  if (vis < 0.001) COLLAPSE
  float s = iS.z * uSysZoom * uGlyphK;
  vP = position.xy * 2.0; vCol = iC; vLvl = iS.w; vVis = vis; vSeed = iM.y; vCo = iM.z;
  gl_Position = clipOf(v + vec3(position.xy * s * 2.0, 0.0));
}`,My=`
uniform float uAnim; uniform float uDim; uniform float uSysCover;
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
  float k = min(vVis, 1.0) * uDim * smoothstep(1.0, 0.86, r);
  c *= twinkle * k;
  // premultiplied: the halo partly covers the blue-violet nebula under it (bloom hue check, task #18)
  gl_FragColor = vec4(c, clamp(exp(-r2 * 18.0) * uSysCover, 0.0, 1.0) * k);
}`,zs=0,Sy=.3,uc=2.2,by=8,wy=400,Ty=.5,Ay=3,Ey=`
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
  vec3 base = vec3(iS.x, ${zs.toFixed(2)}, -iS.y); // the system glyph's own plane: the column rises from its centre
  // the quad is STAT_GLOW x the body width: the body stays thin (owner), the extra is a soft glow either side
  vec3 w = base + right * position.x * wd * ${uc.toFixed(1)} + vec3(0.0, 1.0, 0.0) * (position.y + 0.5) * h;
  vQ = vec2(position.x * 2.0 * ${uc.toFixed(1)}, position.y + 0.5); vCol = iC; vVis = iM.x; vSeed = iM.y; vH = h; vHot = iM.w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}`,Cy=`
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
  c *= min(vVis, 1.0) * smoothstep(${uc.toFixed(1)}, ${(uc*.7).toFixed(2)}, x) * (vHot > 0.5 ? 1.1 : 1.0);
  gl_FragColor = vec4(c, 1.0);
}`,Ry=`
uniform float uStatW; uniform float uGrow; uniform float uViewH;
attribute vec4 iS; attribute vec3 iC; attribute vec4 iM;
varying vec2 vQ; varying vec3 vCol; varying float vVis;
void main() {
  if (iM.x < 0.001 || iS.z <= 0.0 || uGrow <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  // quad 1.6 x the body width; the dot ~1.2 x the body width (r 0.73 in vQ = 0.365 wd), so it shows below the column at any
  // zoom. v11: a galaxy MARKER (not a world object), so the dot keeps >= 3 px radius - a far column's dot (~1 px) hid
  // under its own column foot (#50 base disc: 4 of 12 columns had no light below the base point)
  vec4 vc = viewMatrix * vec4(iS.x, ${zs.toFixed(2)} - 0.001, -iS.y, 1.0);
  float ppu = projectionMatrix[1][1] * 0.5 * uViewH / max(-vc.z, 1e-6);
  float wd = max(iS.w * uStatW * 1.6, 3.0 / (0.365 * ppu));
  vec3 w = vec3(iS.x + position.x * wd, ${zs.toFixed(2)} - 0.001, -(iS.y + position.y * wd));
  vQ = position.xy * 2.0; vCol = iC; vVis = iM.x * min(1.0, uGrow * 2.0);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}`,Py=`
varying vec2 vQ; varying vec3 vCol; varying float vVis;
void main() {
  float r = length(vQ);
  float d = smoothstep(0.8, 0.66, r) * 0.45;  // a solid dot ~1.2 x the body width, no halo (it must not light the starbase rings - #44)
  gl_FragColor = vec4(vCol * d * min(vVis, 1.0), 1.0);
}`,Iy=.42,Ly=.55,Dy=.12,Ny=.32,Uy=.28,ep=.62,Fy=40,Oy=16,hc=12,By=`
uniform float uHaloK;
attribute vec4 iS; attribute vec3 iC; attribute vec4 iM;
varying vec2 vQ; varying vec3 vCol; varying float vA;
void main() {
  if (iM.x < 0.001) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  float r = iS.z * uHaloK;
  vec3 w = vec3(iS.x + position.x * r * 2.0, 0.0, -(iS.y + position.y * r * 2.0));
  vQ = position.xy * 2.0; vCol = iC; vA = iM.x;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}`,ky=`
varying vec2 vQ; varying vec3 vCol; varying float vA;
void main() {
  float q = length(vQ);
  float core = exp(-q * q * 3.2) * 0.8 + 0.2 * smoothstep(1.0, 0.55, q);
  float rim = exp(-pow((q - 0.86) * 16.0, 2.0)) * 0.35;
  gl_FragColor = vec4(vCol * (core + rim) * smoothstep(1.0, 0.92, q) * vA * ${Ny.toFixed(2)}, 1.0);
}`,Vo="#8a94a6",zy=`
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
}`,lp=`#define COLLAPSE { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
`,Vy=lp+`
uniform float uZoom;
attribute vec4 iS; attribute vec4 iM;
varying vec2 vP; varying vec4 vM; varying float vHeat;
void main() {
  if (iM.w < 0.001) COLLAPSE
  vec2 w = iS.xy + position.xy * iS.z * 2.0 * clamp(uZoom, 0.6, 1.3);
  vP = position.xy * 2.0; vM = iM; vHeat = iS.w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w.x, 0.0, -w.y, 1.0);
}`,Hy=`
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
}`,Gy=lp+`
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
}`,Wy=`
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
}`,Xy=`
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
}`,qy=`
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
}`,np=`
varying vec2 vUv; varying vec2 vW;
void main() { vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = vec2(w.x, -w.z); gl_Position = projectionMatrix * viewMatrix * w; }`,Yy=`
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
}`,$y=`
varying vec2 vW;
void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xz; gl_Position = projectionMatrix * viewMatrix * w; }`,Zy=`
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
}`,ip=.5,Ky=62,Jy=72,jy=`
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
    behind = smoothstep(${Ky.toFixed(1)}, ${Jy.toFixed(1)}, distance(vec2(hit.x, -hit.z), vec2(${ip.toFixed(2)}, ${ip.toFixed(2)})));
  }
  if (behind < 0.001) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float tw = 0.75 + 0.25 * sin(uAnim * (0.6 + aSeed * 2.0) + aSeed * 50.0);
  vCol = aCol * tw * behind;
  gl_PointSize = clamp(aSize * uPR * 260.0 / -mv.z, 1.0, 6.0 * uPR);
  gl_Position = projectionMatrix * mv;
}`,Qy=`
varying vec3 vCol;
void main() { vec2 q = gl_PointCoord * 2.0 - 1.0; float r2 = dot(q, q); gl_FragColor = vec4(vCol * exp(-r2 * 4.0), 1.0); }`;function rs(){let i=new Pi(1,1),t=new fo;return t.index=i.index,t.setAttribute("position",i.getAttribute("position")),t.setAttribute("uv",i.getAttribute("uv")),t.instanceCount=0,t}function os(i,t,e){let n=i.getAttribute(t[0][0]);if(!n||n.count<e){let r=Math.max(64,2**Math.ceil(Math.log2(Math.max(1,e))));n&&i.dispose();for(let[o,a]of t){let l=new io(new Float32Array(r*a),a);l.setUsage(uh),i.setAttribute(o,l)}}i.instanceCount=e;let s={};for(let[r]of t)s[r]=i.getAttribute(r);return s}function ks(i,t,e,n,s="add"){n&&(e.uFade=n);let r=new Be({vertexShader:i,uniforms:e,transparent:!0,depthWrite:!1,depthTest:!1,blending:As,fragmentShader:n?t.replace("void main()","void main0()")+`
uniform float uFade;
void main() { main0(); gl_FragColor *= uFade; }`:t});return s==="premult"&&Object.assign(r,{blending:xo,blendSrc:_o,blendDst:Mr,blendEquation:di}),r}var _i=(i,t,e,n)=>ks(i,t,e,n,"add"),sp=typeof document<"u"&&document.currentScript&&document.currentScript.src||"";function Vn(i,t,e){let n=new Oe(i,t);return n.frustumCulled=!1,n.renderOrder=e,n}var tM=i=>i<.5?4*i*i*i:1-(-2*i+2)**3/2,eM=i=>Ui[tn(i)];function nM(i){let t=i>>>0;return()=>(t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296)}var xn=256,as=140,fc=.5,dc=.5;function iM(i,t){let e=[new Float32Array(xn*xn),new Float32Array(xn*xn),new Float32Array(xn*xn)],n=xn/as,s=3.3*n,r=Math.ceil(s*3),o=1/(2*s*s);for(let a of i){let l=a.f==="mud"?0:a.f==="oni"?1:a.f==="ustur"?2:-1;if(l<0)continue;let c=(a.x-(fc-as/2))*n,h=(a.y-(dc-as/2))*n,f=.6+(a.lvl||0)*.4,u=e[l];for(let d=Math.max(0,Math.floor(h-r));d<=Math.min(xn-1,Math.ceil(h+r));d++){let m=d+.5-h;for(let M=Math.max(0,Math.floor(c-r));M<=Math.min(xn-1,Math.ceil(c+r));M++){let g=M+.5-c;u[d*xn+M]+=f*Math.exp(-(g*g+m*m)*o)}}}for(let a=0;a<xn*xn;a++){for(let l=0;l<3;l++)t[a*4+l]=Math.round(255*(1-Math.exp(-e[l][a]*.9)));t[a*4+3]=255}}var Fi=512,sM=3,rM=1.2,oM=2.5,rp=.5,aM=.7,op=.9,lM=.09,cM=.25,cp=1.7,hM=7,ru=null;function uM(i,t){if(ru)return ru;let e=(l,c,h)=>{let f=Math.sin(l*127.1+c*311.7+h*74.7)*43758.5453;return f-Math.floor(f)},n=(l,c,h)=>{let f=Math.floor(l),u=Math.floor(c),d=l-f,m=c-u,M=d*d*(3-2*d),g=m*m*(3-2*m);return(e(f,u,h)*(1-M)+e(f+1,u,h)*M)*(1-g)+(e(f,u+1,h)*(1-M)+e(f+1,u+1,h)*M)*g},s=new Float32Array(i*i),r=new Float32Array(i*i),o=1/(hM*t),a=cp*t;for(let l=0;l<i;l++)for(let c=0;c<i;c++){let h=c*o,f=l*o;s[l*i+c]=a*(2*(.65*n(h,f,1)+.35*n(h*2.1,f*2.1,3))-1),r[l*i+c]=a*(2*(.65*n(h,f,2)+.35*n(h*2.1,f*2.1,4))-1)}return ru=[s,r]}function fM(i,t,e,n){let s=Fi,r=s*s,o=s/as,[a,l]=uM(s,o),c=[...new Set(i.filter(T=>T.winner).map(T=>T.winner))],h=new Map(c.map((T,D)=>[T,D])),f=c.length+1,u=c.length,d=Array.from({length:f},()=>new Float32Array(r)),m=new Float32Array(r),M=new Float32Array(r),g=c.map(T=>t(T)).concat(Vo).map(T=>[1,3,5].map(D=>parseInt(T.slice(D,D+2),16))),p=sM*o,I=rM*o,F=Math.ceil(p*3+cp*o),A=1/(2*p*p),b=1/(2*I*I);for(let T of i){let D=T.winner?Math.min(1,Math.max(0,T.strength||0)):0,v=T.winner?rp+(1-rp)*D:aM,P=d[T.winner?h.get(T.winner):u],N=(T.x-(fc-as/2))*o,O=(T.y-(dc-as/2))*o;for(let B=Math.max(0,Math.floor(O-F));B<=Math.min(s-1,Math.ceil(O+F));B++)for(let q=Math.max(0,Math.floor(N-F));q<=Math.min(s-1,Math.ceil(N+F));q++){let V=B*s+q,K=q+.5-N,lt=B+.5-O,at=K+a[V],pt=lt+l[V],ot=at*at+pt*pt,ut=Math.exp(-ot*A);P[V]+=v*(ut+oM*Math.exp(-(K*K+lt*lt)*b)),T.winner&&(m[V]+=ut,M[V]+=ut*(.3+.7*D))}}for(let T=0;T<r;T++){let D=-1,v=0,P=0;for(let B=0;B<f;B++){let q=d[B][T];q>v?(P=v,v=q,D=B):q>P&&(P=q)}let N=T*4;if(D<0||v<1e-4){e[N]=e[N+1]=e[N+2]=e[N+3]=0,n[N]=n[N+1]=n[N+2]=0,n[N+3]=255;continue}let O=g[D];e[N]=O[0],e[N+1]=O[1],e[N+2]=O[2],e[N+3]=Math.round(255*(1-Math.exp(-v*op))),n[N]=D===u?255:0,n[N+1]=Math.round(255*(1-Math.exp(-P*op))),n[N+2]=Math.round(255*(m[T]>1e-6?M[T]/m[T]:0)),n[N+3]=255}}function dM(i,t){let e=document.createElement("div");e.textContent="Galaxy map unavailable: "+t,e.style.cssText="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#7fa;font:13px system-ui;opacity:.7",i.appendChild(e);let n=()=>{};return{ok:!1,reason:t,setData:()=>!1,setFilter:n,focusOwner:()=>0,focusPoint:n,pulseEvent:n,focusSystem:()=>!1,bodyScreen:()=>null,setStatLayer:()=>!1,setInsets:()=>({left:0,right:0,top:0,bottom:0}),fleetScreen:()=>null,fleetPixelSize:()=>null,fleetCell:()=>null,on:()=>n,setLayer:()=>!1,screenOf:()=>null,getStats:()=>({ok:!1,reason:t}),dispose:()=>e.remove()}}function pM(i,t={}){if(!i||!i.appendChild)throw new TypeError("C4Scene.mount needs a container element");let e=t.reducedMotion!=null?!!t.reducedMotion:!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches),n=typeof t.clock=="function"?t.clock:()=>Date.now()/1e3;getComputedStyle(i).position==="static"&&(i.style.position="relative");let s;try{s=new Xl({antialias:!1,powerPreference:"high-performance",alpha:!1})}catch(_){return dM(i,"WebGL is not available ("+(_&&_.message?_.message:_)+")")}let r=Math.min(window.devicePixelRatio||1,1.5);s.setPixelRatio(r),s.toneMapping=Es,s.toneMappingExposure=1.1,s.setClearColor(0,1),s.info.autoReset=!1;let o=s.domElement;o.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;outline:none",i.appendChild(o);let a=document.createElement("div");a.style.cssText="position:absolute;inset:0;overflow:hidden;pointer-events:none;contain:strict",i.appendChild(a);let l=document.createElement("div");l.className="c4-stat-layer",l.style.cssText="position:absolute;inset:0;overflow:hidden;pointer-events:none;contain:strict;display:none",i.appendChild(l);let c=new to,h=new hn(Or,1,.5,ny),f=new Jl(h,o);f.enableDamping=!0,f.dampingFactor=.08,f.screenSpacePanning=!1,f.minDistance=.03,f.maxDistance=240,f.maxPolarAngle=1.15,f.zoomSpeed=1.2,f.autoRotateSpeed=.12,f.zoomToCursor=!1;let u={uNow:{value:0},uAnim:{value:0},uTime:{value:0},uZoom:{value:1},uSysZoom:{value:1},uDim:{value:1},uReduced:{value:e?1:0},uPR:{value:r},uGal:{value:1},uGlyphK:{value:1},uSil:{value:1},uViewH:{value:1},uHasAtlas:{value:0},uAtlas:{value:null},uCols:{value:8},uRows:{value:8}},d=new Oe(new Pi(1600,1600).rotateX(-Math.PI/2),new Be({vertexShader:$y,fragmentShader:Zy,uniforms:{uAnim:u.uAnim},depthWrite:!1,depthTest:!1}));d.position.y=-70,d.renderOrder=-10,d.frustumCulled=!1,c.add(d);let m=new pn;{let _=nM(7),L=4200,w=new Float32Array(L*3),S=new Float32Array(L),U=new Float32Array(L*3),j=new Float32Array(L);for(let et=0;et<L;et++){let St=40+_()*460,vt=_()*Math.PI*2;w[et*3]=Math.cos(vt)*St,w[et*3+2]=Math.sin(vt)*St,w[et*3+1]=-12-_()*50,S[et]=.6+_()**3*2.4;let Q=_(),_t=.35+_()*.65;U[et*3]=_t*(Q<.2?1:.75+Q*.2),U[et*3+1]=_t*.88,U[et*3+2]=_t*(Q>.7?1:.85),j[et]=_()}m.setAttribute("position",new sn(w,3)),m.setAttribute("aSize",new sn(S,1)),m.setAttribute("aCol",new sn(U,3)),m.setAttribute("aSeed",new sn(j,1))}let M=new ro(m,_i(jy,Qy,{uAnim:u.uAnim,uPR:u.uPR}));M.renderOrder=-9,M.frustumCulled=!1,c.add(M);let g=new Uint8Array(xn*xn*4),p=new Yi(g,xn,xn,mn);p.magFilter=Xe,p.minFilter=Xe,p.needsUpdate=!0;let I={uTex:{value:p},uTerr:{value:1},uTerrStat:{value:1},uTerrLens:{value:1},uTerrDim:{value:.88},uTerrFill:{value:.034},uAnim:u.uAnim,uFaW:{value:new G(1,1,1)},uFa0:{value:new G},uFa1:{value:new G},uFa2:{value:new G}},F=(_,L=!1)=>{let w=S=>L?Dr(Vo).map(U=>U*.5):Ui[S];I.uFa0.value.set(...w("mud").map(S=>S*(L?1:_[0]))),I.uFa1.value.set(...w("oni").map(S=>S*(L?1:_[1]))),I.uFa2.value.set(...w("ustur").map(S=>S*(L?1:_[2])))},A=vd.slice();F(A);let b=new Oe(new Pi(as,as).rotateX(-Math.PI/2),Object.assign(ks(np,Yy,I,null,"add"),{blending:xo,blendSrc:_o,blendDst:Mr,blendEquation:di}));b.position.set(fc,0,-dc),b.renderOrder=0,b.frustumCulled=!1,c.add(b),e&&(I.uAnim={value:0});let T=new Uint8Array(Fi*Fi*4),D=new Uint8Array(Fi*Fi*4),v=new Yi(T,Fi,Fi,mn),P=new Yi(D,Fi,Fi,mn);for(let _ of[v,P])_.magFilter=Xe,_.minFilter=Xe,_.needsUpdate=!0;let N=new Oe(b.geometry,ks(np,zy,{uConq:{value:v},uConqX:{value:P},uConqFill:{value:lM},uConqDim:{value:cM}},null,"premult"));N.position.set(fc,.01,-dc),N.renderOrder=.5,N.frustumCulled=!1,N.visible=!1,c.add(N);let O=rs(),B=rs(),q=rs(),V=rs(),K=[["iA",4],["iT",2],["iC",3],["iM",4],["iX",2],["iO",4]],lt={uNow:u.uNow,uAnim:u.uAnim,uZoom:u.uZoom,uBeamGain:{value:2.6},uSil:u.uSil,uHasAtlas:u.uHasAtlas,uAtlas:u.uAtlas,uCols:u.uCols,uRows:u.uRows,uShipBase:{value:eu.galaxy},uViewH:u.uViewH,uDots:{value:1}},at=Vn(O,_i(gy,xy,lt,null),2),pt=Vn(q,_i(Vy,Hy,{uZoom:u.uZoom,uAnim:u.uAnim},u.uGal),2),ot=Vn(O,_i(py,my,lt,null),3),ut={value:2.5},dt=Vn(B,ks(yy,My,{uSysZoom:u.uSysZoom,uGlyphK:u.uGlyphK,uViewH:u.uViewH,uAnim:u.uAnim,uDim:u.uDim,uSysCover:ut},null,"premult"),4),$t=Vn(O,_i(_y,vy,lt,null),4.8),Xt=Vn(O,ks(cy,dy,lt,null,"premult"),5),we=Vn(O,ks(uy,fy,lt,null,"premult"),4.6),fe=Vn(V,_i(Gy,Wy,{uTime:u.uTime,uReduced:u.uReduced},u.uGal),6),ve=rs(),W=Vn(ve,_i(Xy,qy,{uTime:u.uTime,uZoom:u.uZoom,uReduced:u.uReduced},u.uGal),6),tt=rs(),Mt={uAnim:u.uAnim,uStatH:{value:1},uStatW:{value:1},uGrow:{value:1},uMinH:{value:0}},bt=Vn(tt,_i(Ey,Cy,Mt,u.uGal),7),xt=Vn(tt,_i(Ry,Py,{uStatW:Mt.uStatW,uGrow:Mt.uGrow,uViewH:u.uViewH},u.uGal),7);bt.visible=xt.visible=!1;let Bt=rs(),Ne={uHaloK:{value:1}},jt=Vn(Bt,_i(By,ky,Ne,u.uGal),1);jt.visible=!1,c.add(jt),c.add(at,pt,ot,dt,$t,we,Xt,fe,W,xt,bt);let ne=os(ve,[["iE",4],["iC",3],["iC2",3],["iS",2]],cc);for(let _=0;_<cc;_++)ne.iS.array[_*2]=-1e9;let de=0,Jt=os(V,[["iS",4],["iC",3],["iK",1]],lc);Jt.iS.array.fill(-1e9);for(let _=0;_<lc;_++)Jt.iS.array[_*4+3]=-1e9;let ie=0,ke={systems:[dt],fleets:[Xt,we,ot],mining:[],routes:[at],combat:[]},xe=Object.fromEntries(ou.map(_=>[_,!0])),Te=()=>{$t.visible=xe.fleets&&xe.mining},Pe=t.assetBase||new URL("../Images/planets/",sp||location.href).href,C=jd({scene:c,camera:h,U:u,quadGeometry:rs,instanceAttrs:os,shaderMat:ks,assetBase:Pe}),gt={addr:null,framed:null,frameD:0,frac:0},It={nearK:Qd,domIn:ay,domOut:ly,dcOut:1.25},R=new qe(1,1,{type:Ke,samples:4}),x=new tc(s,R);x.addPass(new ec(c,h));let H=new Ir(new qt(1,1),.4,.2,.85);x.addPass(H),x.addPass(new nc);let E=null,X={name:null,cols:[],callouts:[],dirty:!1,vmax:0,growAt:0},ft=()=>{pt.visible=xe.combat&&X.name==="combat"};ft();let Y={dacs:[],example:!1,focus:null,halos:[],mark:null,markBox:null,lens:{on:!1,metrics:[],scope:null},conq:null,lensKey:""},nt=Dr(Vo),it=_=>Y.lens.on?nt:eM(_),wt=_=>Y.lens.on?Vo:Bo[tn(_)],Nt=_=>Math.max(_.h*Mt.uStatH.value,Mt.uMinH.value)*Mt.uGrow.value,Pt=_=>yt/(2*Math.tan(Or*Math.PI/360)*Math.max(.001,_)),ct={left:0,right:0,top:0,bottom:0},Yt={left:0,right:0,top:0,bottom:0},Kt=!1,Zt={faction:null,states:null,owner:null},z={pick:new Set,hover:new Set,systemView:new Set},At=[],ht=null,Ct=t.shipAtlasBase||new URL("../Images/ships/silhouettes/",sp||location.href).href;fetch(Ct+"atlas.json").then(_=>_.ok?_.json():Promise.reject(new Error("HTTP "+_.status))).then(_=>{let L=(window.devicePixelRatio||1)>1.25&&_.image2x?_.image2x:_.image;new ho().load(Ct+L,w=>{if(Qo){w.dispose();return}w.colorSpace=ln,w.anisotropy=4,ht=_,u.uAtlas.value=w,u.uHasAtlas.value=1,u.uCols.value=_.cols||8,u.uRows.value=_.rows||8,E&&Lt()},void 0,()=>console.warn("C4Scene: ship atlas image failed to load; keeping the glyphs"))}).catch(_=>console.warn("C4Scene: ship atlas unavailable; keeping the glyphs",_&&_.message));let Et=(_,L)=>{for(let w of z[_])try{w(L)}catch(S){console.error("C4Scene "+_+" handler",S)}},st=1,yt=1,Tt={left:0,top:0},ye=performance.now(),Me=new Map,se={on:!1,t:0,dur:1,fx:0,fz:0,tx:0,tz:0,fr:1,tr:1,fp:0,tp:0,th:0},Ye=new ui,he=new G,on=[0,0],wn=new Float32Array(16),vi=[];function Br(){let _=i.getBoundingClientRect(),L=st+"x"+yt;st=Math.max(1,Math.round(_.width)),yt=Math.max(1,Math.round(_.height)),s.setSize(st,yt,!1),x.setPixelRatio(r),x.setSize(st,yt),h.aspect=st/yt,u.uViewH.value=yt,f.minDistance=Ls.medium*.5*yt/Math.tan(Or*Math.PI/360)/ey,Vs(),Tt=o.getBoundingClientRect(),wn[0]=NaN,st+"x"+yt!==L&&(Me.clear(),Ft())}function Vs(){Object.assign(ct,Yt),ct.left+ct.right>st-40&&(ct.left=ct.right=0),ct.top+ct.bottom>yt-40&&(ct.top=ct.bottom=0);let _=(ct.right-ct.left)/2,L=(ct.bottom-ct.top)/2;_||L?h.setViewOffset(st,yt,_,L,st,yt):(h.clearViewOffset(),h.updateProjectionMatrix())}let si=[],yi=(_,L)=>si.some(w=>_>=w.left&&_<=w.right&&L>=w.top&&L<=w.bottom),ls=(_,L)=>_<ct.left||_>st-ct.right||L<ct.top||L>yt-ct.bottom||yi(_,L),Hs=(_,L,w,S)=>_>=ct.left+2&&L>=ct.top+2&&w<=st-ct.right-2&&S<=yt-ct.bottom-2&&!si.some(U=>_<U.right&&w>U.left&&L<U.bottom&&S>U.top),kr=new ResizeObserver(Br);kr.observe(i);function Gs(_,L,w,S,U){f.target.set(_,0,-L),Ye.set(w,S,U),h.position.setFromSpherical(Ye).add(f.target),h.lookAt(f.target)}function On(_,L,w,S,U=1.6){gt.framed=null,ye=performance.now(),he.copy(h.position).sub(f.target),Ye.setFromVector3(he),Object.assign(se,{on:!0,t:0,dur:U,fx:f.target.x,fz:f.target.z,tx:_,tz:-L,fr:Ye.radius,tr:Math.min(f.maxDistance,Math.max(f.minDistance,w)),fp:Ye.phi,tp:S,th:Ye.theta}),(e||U<=0)&&(se.t=se.dur=1,cs(0))}function cs(_){se.t=Math.min(se.dur,se.t+_);let L=tM(se.t/se.dur),w=Math.exp(Math.log(se.fr)+(Math.log(se.tr)-Math.log(se.fr))*L),S=se.tr<se.fr?1-(1-L)*w/se.fr:L*w/se.tr;f.target.set(se.fx+(se.tx-se.fx)*S,0,se.fz+(se.tz-se.fz)*S),Ye.set(w,se.fp+(se.tp-se.fp)*L,se.th),h.position.setFromSpherical(Ye).add(f.target),h.lookAt(f.target),se.t>=se.dur&&(se.on=!1)}let Go=.9,hs={x:0,y:0},Mi=new G,Ws=new G,Xs=new G,pc=new cn(new G(0,1,0),0),Cn={x:0,y:0,on:!1},y=new Ts,k=new qt,J=0,$=_=>{if(!f.enabled)return;_.preventDefault(),_.stopPropagation();let L=_.deltaY*(_.deltaMode===1?33:_.deltaMode===2?yt:1);J+=Math.log(Go)*(-L/100),J=Math.max(-6,Math.min(6,J)),hs.x=_.clientX,hs.y=_.clientY,_.target===o&&(Cn.x=_.clientX,Cn.y=_.clientY,Cn.on=!0),gt.framed=null,se.on=!1,ye=performance.now(),f._sphericalDelta&&typeof f._sphericalDelta.set=="function"&&f._sphericalDelta.set(0,0,0),f._panOffset&&typeof f._panOffset.set=="function"&&f._panOffset.set(0,0,0),f.autoRotate=!1};i.addEventListener("wheel",$,{capture:!0,passive:!1});function Z(_){if(Math.abs(J)<1e-4){J=0;return}let L=e?J:J*(1-Math.exp(-_*14)),w=h.position.distanceTo(f.target),S=w*Math.exp(L),U=Math.min(f.maxDistance,Math.max(f.minDistance,S)),j=U/w;if(J=U===S?J-L:0,j===1)return;k.set((hs.x-Tt.left)/st*2-1,-((hs.y-Tt.top)/yt)*2+1),y.setFromCamera(k,h),(!y.ray.intersectPlane(pc,Mi)||Mi.distanceTo(h.position)>w*8)&&Mi.copy(f.target),h.getWorldDirection(Xs),Ws.copy(h.position).sub(Mi).multiplyScalar(j),h.position.copy(Mi).add(Ws),Xs.y<-.001?f.target.copy(h.position).addScaledVector(Xs,-h.position.y/Xs.y):(Ws.copy(f.target).sub(Mi).multiplyScalar(j),f.target.copy(Mi).add(Ws)),ye=performance.now()}f.addEventListener("start",()=>{se.on=!1,ye=performance.now(),gt.framed=null}),f.addEventListener("end",()=>{ye=performance.now()}),Gs(bn.x,bn.y,e?bn.dist:300,e?bn.polar:.25,e?0:-.6);function Lt(){let _=E.fleets,L=_.length,w=os(O,K,L),S=w.iA.array,U=w.iT.array,j=w.iC.array,et=w.iM.array,St=w.iX.array,vt=w.iO.array;for(let Q=0;Q<L;Q++){let _t=_[Q],Ot=E.paths[Q],Wt=it(_t.fa),Vt=E.anchors[Q],rt=E.place[Q];rt?(S.set(rt.A,Q*4),vt.set(rt.O,Q*4),U[Q*2]=rt.T[0],U[Q*2+1]=rt.T[1]):(vt[Q*4]=vt[Q*4+1]=vt[Q*4+2]=vt[Q*4+3]=0,Ot.moving&&(E.kinds[Q]===3||E.kinds[Q]===4)?(S[Q*4]=Ot.from[0],S[Q*4+1]=Ot.from[1],S[Q*4+2]=Ot.to[0],S[Q*4+3]=Ot.to[1],U[Q*2]=Ot.dep-E.tBase,U[Q*2+1]=Ot.arr-E.tBase):(S[Q*4]=Vt[0],S[Q*4+1]=Vt[1],S[Q*4+2]=E.targets[Q][0],S[Q*4+3]=E.targets[Q][1],U[Q*2]=0,U[Q*2+1]=0)),j[Q*3]=Wt[0],j[Q*3+1]=Wt[1],j[Q*3+2]=Wt[2],et[Q*4]=Ed(_t.ships),et[Q*4+1]=E.kinds[Q],et[Q*4+2]=Ut(Q),et[Q*4+3]=E.seeds[Q],St[Q*2]=rc(ht,_t.flag,_t.flagSize),St[Q*2+1]=Ds(_t.flagSize)}for(let Q in w)w[Q].needsUpdate=!0}let Ut=_=>!xe.mining&&E.fleets[_].s.kind==="mining"?0:E.vis[_];function Rt(){if(!E)return;let _=O.getAttribute("iM"),L=B.getAttribute("iM"),w=q.getAttribute("iM");for(let U=0;U<E.fleets.length;U++)E.vis[U]=jh(E.fleets[U],Zt),_.array[U*4+2]=Ut(U);_.needsUpdate=!0;for(let U=0;U<E.systems.length;U++)L.array[U*4]=sc(E.systems[U].f,Zt.faction)?.22:1;L.needsUpdate=!0;for(let U=0;U<E.hot.length;U++)w.array[U*4+3]=Pd(E.hot[U],Zt.faction)?1:.15;w.needsUpdate=!0,Ht(),(X.name==="owners"||X.name==="combat")&&(X.dirty=!0),u.uDim.value=Zt.owner?.4:1,I.uFaW.value.set(...["mud","oni","ustur"].map(U=>sc(U,Zt.faction)?.15:1)),wn[0]=NaN}function Ht(){if(!E)return;let _=X.name&&X.colSys,L=B.getAttribute("iM");if(L&&E.systems){for(let w=0;w<E.systems.length;w++)L.array[w*4+2]=_&&_.has(E.systems[w].a)?1:0;L.needsUpdate=!0}}function Gt(){let _=Y.lens.on;if(F(A,_),I.uTerrLens.value=_?0:1,Y.conq=_&&E?Hd(E.latest,E.events,Y.dacs,Y.lens.metrics,Y.lens.scope):null,Y.conq){let L=new Map(Y.dacs.map(w=>[w.tag,w.color]));fM(Y.conq.systems.filter(w=>w.winner||w.contested),w=>L.get(w)||Vo,T,D),v.needsUpdate=P.needsUpdate=!0}if(N.visible=!!Y.conq,E){let L=O.getAttribute("iC"),w=B.getAttribute("iC");L&&(E.fleets.forEach((S,U)=>L.array.set(it(S.fa),U*3)),L.needsUpdate=!0),w&&(E.systems.forEach((S,U)=>w.array.set(it(S.f),U*3)),w.needsUpdate=!0),lu(),wn[0]=NaN}X.name==="dacs"&&(X.dirty=!0)}function ae(_,L,w){if(!_||!Array.isArray(_.fleets)||!Array.isArray(_.systems))return console.error("C4Scene.setData: latest.json shape not recognised (need fleets[] and systems[])"),!1;let S=Number.isFinite(_.generatedAt)?_.generatedAt:Math.floor(n()),U=new Map((_.asteroids||[]).map(rt=>[rt.a,rt])),j=new Map(_.systems.map(rt=>[rt.a,rt])),et=_.fleets.filter(rt=>rt&&rt.s&&Number.isFinite(rt.x)&&Number.isFinite(rt.y)),St=et.length;E={latest:_,events:Array.isArray(L)?L:[],tBase:S,fleets:et,systems:_.systems.filter(rt=>Number.isFinite(rt.x)&&Number.isFinite(rt.y)),asteroids:(_.asteroids||[]).filter(rt=>Number.isFinite(rt.x)&&Number.isFinite(rt.y)),paths:new Array(St),anchors:new Array(St),targets:new Array(St),seeds:new Float32Array(St),kinds:new Float32Array(St),vis:new Float32Array(St),hot:[],index:new Map(et.map((rt,kt)=>[rt.a,kt]))};for(let rt=0;rt<St;rt++){let kt=et[rt],mt=kt.s,ee=En(kt.a),_e=mt.kind;E.paths[rt]=Yh(kt),E.seeds[rt]=ee,E.kinds[rt]=yd(_e);let Ue=[kt.x,kt.y],We=Ue;if(_e==="mining"){let Ze=U.get(mt.asteroid);Ze&&(Ue=[Ze.x,Ze.y]),We=Ue}else if(_e==="docked"){let Ze=j.get(mt.system);Ze&&(Ue=[Ze.x,Ze.y]),We=Ue}E.anchors[rt]=Ue,E.targets[rt]=We,qh(_e)&&!E.paths[rt].moving&&(E.kinds[rt]=0)}let vt=S-120,Q=[0,0];for(let rt=0;rt<St;rt++){let kt=E.paths[rt];kt.moving&&kt.arr<=vt&&(E.kinds[rt]=0,E.anchors[rt]=E.targets[rt]=[kt.to[0],kt.to[1]])}for(let rt=0;rt<St;rt++)E.vis[rt]=jh(et[rt],Zt);Array.isArray(w)&&(At=w.filter(rt=>rt&&rt.a&&rt.sys)),E.bodiesBySys=new Map,Me.clear();for(let rt of At){let kt=E.bodiesBySys.get(rt.sys);kt||E.bodiesBySys.set(rt.sys,kt=[]),kt.push(rt)}E.members=nu(et,E.systems,At,vt),E.sysByAddr=new Map(E.systems.map(rt=>[rt.a,rt])),E.ownerFa=new Map((_.owners||[]).map(rt=>[rt.p,rt.fa])),E.stakes=(_.stakes||[]).filter(rt=>rt&&rt.body),E.place=C.build(E).place;for(let rt of Ad(et,vt).values()){let kt=rt.filter(mt=>!E.place[mt]);kt.length<2||kt.forEach((mt,ee)=>{Td(ee,Q);let _e=E.anchors[mt];E.anchors[mt]=E.targets[mt]=[_e[0]+Q[0],_e[1]+Q[1]]})}Lt();let _t=E.systems,Ot=os(B,[["iS",4],["iC",3],["iM",4]],_t.length),Wt=C.world.infos;for(let rt=0;rt<_t.length;rt++){let kt=_t[rt],mt=it(kt.f);Ot.iS.array.set([kt.x,kt.y,Cd(kt.lvl),kt.lvl||0],rt*4),Ot.iC.array.set(mt,rt*3),Ot.iM.array.set([1,En(kt.a),0,Wt[rt].starR],rt*4)}for(let rt in Ot)Ot[rt].needsUpdate=!0;E.hot=Rd(Array.isArray(L)?L:[],S);let Vt=os(q,[["iS",4],["iM",4]],E.hot.length);for(let rt=0;rt<E.hot.length;rt++){let kt=E.hot[rt],mt=Math.exp(-(S-kt.last)/7200);Vt.iS.array.set([kt.x,kt.y,.8+Math.log2(1+kt.n)*.5,Math.min(1.6,.35+kt.heat*.35)],rt*4),Vt.iM.array.set([kt.destroyed?Math.min(1,kt.destroyed/kt.n+.4):0,En(kt.x+","+kt.y),mt,1],rt*4)}for(let rt in Vt)Vt[rt].needsUpdate=!0;if(iM(E.systems,g),p.needsUpdate=!0,lu(),Rt(),Y.lens.on&&Gt(),X.dirty=!!X.name,gt.addr=gt.addr&&E.sysByAddr.has(gt.addr)?gt.addr:(gt.addr&&Et("systemView",null),null),gt.framed){let rt=E.sysByAddr.get(gt.framed);rt&&!(Math.abs(Ge(rt)-gt.frameD)<=.01*gt.frameD)&&Ft()}return wn[0]=NaN,Kt||(Kt=!0,!e&&!se.on&&On(bn.x,bn.y,bn.dist,bn.polar,2.6)),!0}let le=.8,zt=26,oe=new hn(Or,1,.5,2500),Le=new G,Ae=new ui,Ce=_=>{let L=C.world,w=L&&L.byAddr.get(_);return w?w.ext:zo(0)*Ni.K};function Ge(_){let L=Me.get(_.a);if(L!==void 0)return L;let w=Ce(_.a),S=(he.copy(h.position).sub(f.target),Ye.setFromVector3(he).theta);oe.copy(h),oe.near=Math.max(1e-5,f.minDistance*Qd),oe.updateProjectionMatrix(),Le.set(_.x,0,-_.y);let U=ct.left+zt,j=st-ct.right-zt,et=ct.top+zt,St=yt-ct.bottom-zt,vt=Ot=>{Ae.set(Ot,le,S),oe.position.setFromSpherical(Ae).add(Le),oe.lookAt(Le),oe.updateMatrixWorld();for(let Wt=0;Wt<48;Wt++){let Vt=Wt/48*Math.PI*2;he.set(_.x+Math.cos(Vt)*w,0,-(_.y+Math.sin(Vt)*w)).project(oe);let rt=(he.x+1)/2*st,kt=(1-he.y)/2*yt;if(he.z>=1||rt<U||rt>j||kt<et||kt>St)return!1}return!0},Q=f.minDistance,_t=f.maxDistance;if(j-U<40||St-et<40||!vt(_t))L=_t;else if(vt(Q))L=Q;else{for(let Ot=0;Ot<40;Ot++){let Wt=Math.sqrt(Q*_t);vt(Wt)?_t=Wt:Q=Wt}L=_t}return Me.set(_.a,L),L}function Ft(){let _=gt.framed;if(!_||!E)return;let L=E.sysByAddr.get(_);L&&(On(L.x,L.y,Ge(L),le,e?0:.6),gt.framed=_,gt.frameD=Ge(L))}function an(){let _=C.world;if(!_||!E)return;let L=ct.left,w=st-ct.right,S=ct.top,U=yt-ct.bottom,j=Math.max(40,Math.min(w-L,U-S)),et=(L+w)/2,St=(S+U)/2,vt=mt=>mt.on?2*mt.extPx/j:0,Q=mt=>Math.hypot(mt.sx-et,mt.sy-St)/Math.max(1e-6,mt.extPx),_t=f.target,Ot=h.position.distanceTo(_t),Wt=yt/(Math.tan(Or*Math.PI/360)*j),Vt=(mt,ee,_e)=>Math.hypot(_t.x-mt.s.x,-_t.z-mt.s.y)<=ee*mt.ext&&Ot*_e<=mt.ext*Wt,rt=null;if(gt.addr){let mt=_.byAddr.get(gt.addr);mt&&(mt.on?vt(mt)>=It.domOut&&Q(mt)<=It.dcOut:Vt(mt,It.dcOut,It.domOut))&&(rt=mt)}if(!rt){let mt=1/0;for(let ee of _.infos)if(ee.on){if(vt(ee)<It.domIn)continue;let _e=Q(ee);_e<=1&&_e<mt&&(mt=_e,rt=ee)}else if(Vt(ee,1,It.domIn)){let _e=Math.hypot(_t.x-ee.s.x,-_t.z-ee.s.y)/ee.ext;_e<mt&&(mt=_e,rt=ee)}}gt.frac=rt?vt(rt):0;let kt=rt?rt.s.a:null;kt!==gt.addr&&(gt.addr=kt,Et("systemView",rt?{sys:rt.s.a,name:rt.s.n}:null))}function Se(){bi&&(bi="",o.style.cursor="",Et("hover",null)),C.setHover(null,null)}let Tn=140,_n=1,Hn="opacity .22s ease-out",Gn=[],Ee=(_,L,w,S)=>{for(let U of Gn)if(_<U[2]+_n&&w>U[0]-_n&&L<U[3]+_n&&S>U[1]-_n)return!0;return!1};function ze(_,L){if(_.sort((w,S)=>S.prio-w.prio||w.ord-S.ord),Gn.length=0,L)for(let w of L)Gn.push(w);for(let w of _){let S=w.spots.length,U=w.cand,j=-1,et=!1;for(let St=-1;St<S&&j<0;St++){let vt=St<0?0:St===0?U:St;if(vt==null||vt<0||vt>=S||St>0&&vt===U||St===0&&vt===0)continue;let Q=w.spots[vt][0],_t=w.spots[vt][1],Ot=Q+w.w,Wt=_t+w.h;Hs(Q,_t,Ot,Wt)&&(et=!0,Ee(Q,_t,Ot,Wt)||(j=vt))}w.cand=j,w.hide=j>=0?"":et?"collide":"covered",j>=0&&Gn.push([w.spots[j][0],w.spots[j][1],w.spots[j][0]+w.w,w.spots[j][1]+w.h])}}function ri(_,L,w,S,U,j,et,St){let vt=(St.length===4||(St.length=0,St.push([0,0],[0,0],[0,0],[0,0])),St);return vt[0][0]=_+w-j/2,vt[0][1]=L+S-U-et,vt[1][0]=_+w-j/2,vt[1][1]=L+U+5,vt[2][0]=_+U+8,vt[2][1]=L-et/2,vt[3][0]=_-U-8-j,vt[3][1]=L-et/2,St}let Ie=5,oi=3,Si=110,ai=new Map,Wo=0,Xo=0;function au(_,L,w,S,U){let j=document.createElement("div");return j.textContent=_,j.className=L,j.style.cssText=`position:absolute;left:0;top:0;display:none;white-space:nowrap;font:600 ${w}px/1.2 "Segoe UI",system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:${S};text-shadow:0 0 6px #000,0 0 2px #000;will-change:transform;opacity:0;transition:${Hn};${U||""}`,a.appendChild(j),j}function lu(){a.textContent="",ai.clear(),Wo=0;let _=document.createDocumentFragment();vi=E.systems.map((L,w)=>{let S=document.createElement("div");S.textContent=L.n||"",S.className="c4-sys-label";let U=wt(L.f);return S.style.cssText='position:absolute;left:0;top:0;display:none;white-space:nowrap;font:600 10px/1 "Segoe UI",system-ui,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:#d8f4ff;text-shadow:0 0 6px '+U+",0 0 2px #000;will-change:transform;border-left:2px solid "+U+";padding-left:4px;opacity:0;transition:"+Hn,(L.lvl||0)>=5&&(S.style.fontSize="12px",S.style.color="#ffffff"),_.appendChild(S),{el:S,s:L,si:w,ord:w,shown:!1,vis:!1,w:0,h:0,spots:[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],cand:void 0,hide:""}}),a.appendChild(_),wn[0]=NaN}function hp(_){let L=C.world,w=L.bodyAt[_],S=L.infos[w.si],U=w.L,j=U.b.k==="asteroid"?"asteroid":(U.b.sub||"planet").replace("-"," "),et=w.work?w.work.n:0,St=S.stakeN.get(_)||0;return`${U.b.n} - ${j}${et?" - "+et+" mining":""}${St?" - "+St+" stake"+(St>1?"s":""):""}`}function cu(_,L){let w=ai.get(_);return w||(w=L(),w.key=_,w.spots=[],w.cand=void 0,w.hide="",w.on=!1,w.w=0,w.h=0,w.ord=1e5+ai.size,ai.set(_,w)),w}let hu=0,mc=!1,qo=[],qs=[0,0];function uu(_,L){if(a.style.display=xe.labels?"":"none",!xe.labels||!E)return;let w=C.world;L&&(qo.length=0),Xo++;for(let S of vi){let U=S.s.lvl||0,j=w&&w.infos[S.si],et=U>=5?400:U>=2?110:U>=1?58:30,St=xe.systems&&_<et&&j&&j.ppu>0;if(St){let vt=j.sx,Q=j.sy;if(St=j.on&&vt>-.025*st&&vt<1.025*st&&Q>-.025*yt&&Q<1.025*yt,St){S.shown||(S.el.style.display="block",S.shown=!0),S.w||(S.w=S.el.offsetWidth,S.h=S.el.offsetHeight);let _t=Math.max(0,j.starR*j.ppu*1.1),Ot=S.w,Wt=S.h,Vt=S.spots;Vt[0][0]=vt+9+_t,Vt[0][1]=Q-5,Vt[1][0]=vt-9-_t-Ot,Vt[1][1]=Q-5,Vt[2][0]=vt+5,Vt[2][1]=Q-8-_t-Wt,Vt[3][0]=vt+5,Vt[3][1]=Q+6+_t,Vt[4][0]=vt-5-Ot,Vt[4][1]=Q-8-_t-Wt,Vt[5][0]=vt-5-Ot,Vt[5][1]=Q+6+_t;let rt=sc(S.s.f,Zt.faction);S.op=(rt?.25:.88)*Math.min(1,(et-_)/(et*.25)),S.prio=(bi==="system:"+S.s.a?1e3:0)+(j.extPx>=Si?400:0)+(rt?0:100)+U*10,L&&qo.push(S)}}!St&&S.shown&&(S.el.style.display="none",S.shown=!1,S.vis=!1,S.cand=void 0,S.el.style.opacity=S.opW="0")}if(Wo=0,w)for(let S of w.infos){if(!S.on||S.extPx<24)continue;let U=S.extPx>=Si?200:0;if(xe.systems&&S.sbHalf*S.ppu>=oi){let j=cu("sb:"+S.s.a,()=>({kind:"sb",si:S.si,el:au(`starbase lvl ${S.s.lvl||0} - ${S.members?S.members.docked.length:0} docked`,"c4-body-label",10,Bo[tn(S.s.f)])}));he.set(S.s.x+S.sb[0],0,-(S.s.y+S.sb[1])).project(h),j.ax=(he.x+1)/2*st,j.ay=(1-he.y)/2*yt,j.r=S.sbHalf*S.ppu,j.prio=90+U,j.seen=Xo}for(let j=S.b0;j<S.b0+S.nb;j++){let et=w.bodyAt[j],St=et.R*S.ppu;if(St<Ie)continue;let vt=cu("body:"+et.L.b.a,()=>({kind:"body",bi:j,el:au(hp(j),"c4-body-label",10,"#cfe8f2")}));C.bodyPos(j,u.uAnim.value,qs),he.set(qs[0],0,-qs[1]).project(h),!(he.z>=1)&&(vt.ax=(he.x+1)/2*st,vt.ay=(1-he.y)/2*yt,vt.r=St,vt.seen=Xo,vt.prio=(et.L.b.k==="asteroid"?30:50)+Math.min(9,Math.round((et.L.size||0)*20))+(S.stakeN.get(j)?5:0)+U)}}for(let S of ai.values()){if(S.seen!==Xo){S.on&&(S.on=!1,S.el.style.display="none",S.cand=void 0,S.opW="0",S.el.style.opacity="0");continue}S.on||(S.el.style.display="block",S.on=!0),!(!S.w&&(S.w=S.el.offsetWidth,S.h=S.el.offsetHeight,!S.w))&&(ri(S.ax,S.ay,S.kind==="sb"?14:0,S.kind==="sb"?-4:-6,S.r,S.w,S.h,S.spots),Wo++,bi&&S.key===bi&&(S.prio+=1e3),L&&qo.push(S))}L&&(hu=performance.now(),ze(qo));for(let S of vi){if(!S.shown)continue;S.vis=S.cand!=null&&S.cand>=0;let U=S.spots[S.vis?S.cand:0];S.el.style.transform=`translate(${U[0].toFixed(1)}px,${U[1].toFixed(1)}px)`,S.x0=U[0],S.y0=U[1];let j=S.vis?S.op.toFixed(2):"0";S.opW!==j&&(S.el.style.opacity=j,S.opW=j),S.prioW!==S.prio&&(S.prioW=S.prio,S.el.dataset.prio=String(S.prio)),S.hideW!==(S.hide||"")&&(S.hideW=S.hide||"",S.el.dataset.hide=S.hideW)}for(let S of ai.values()){if(!S.on||!S.w)continue;let U=S.cand!=null&&S.cand>=0,j=S.spots[U?S.cand:0];S.el.style.transform=`translate(${j[0].toFixed(1)}px,${j[1].toFixed(1)}px)`;let et=U?"1":"0";S.opW!==et&&(S.el.style.opacity=et,S.opW=et),S.prioW!==S.prio&&(S.prioW=S.prio,S.el.dataset.prio=String(S.prio)),S.hideW!==(S.hide||"")&&(S.hideW=S.hide||"",S.el.dataset.hide=S.hideW)}}let up=[1,.32,.08],fu=6,fp=_=>_.hex?Dr(_.hex):_.fa==="hot"?up:Ui[tn(_.fa)],dp=_=>_.hex?_.hex:_.fa==="hot"?"#ff7a3c":Bo[tn(_.fa)];function gc(_){Y.halos=_;let L=os(Bt,[["iS",4],["iC",3],["iM",4]],_.length);_.forEach((w,S)=>{L.iS.array.set([w.x,w.y,Iy+Ly*Math.sqrt(w.wmax?w.w/w.wmax:0),0],S*4),L.iC.array.set(Dr(w.hex),S*3),L.iM.array.set([w.share*(w.dim?Dy:1),0,0,0],S*4)});for(let w in L)L[w].needsUpdate=!0;jt.visible=_.length>0}function du(){X.dirty=!1,l.textContent="",X.callouts=[],Y.mark=null,Y.markBox=null,Y.mw=0;let _=X.name,L;if(_==="dacs"&&Y.conq)L=Gd(Y.conq,Y.dacs),gc([]);else if(_==="dacs"){let U=E?Vd(E.latest,Y.dacs,Y.focus):{cols:[],halos:[]};L=U.cols,gc(U.halos)}else L=_&&E?bd(_,E.latest,E.events,{owner:Zt.owner,faction:Zt.faction}):[],(jt.visible||Y.halos.length)&&gc([]);X.cols=L,X.vmax=L.reduce((U,j)=>Math.max(U,j.v),0);let w=os(tt,[["iS",4],["iC",3],["iM",4]],L.length);L.forEach((U,j)=>{let et=wd(U.v,X.vmax),St=X.vmax?U.v/X.vmax:0;w.iS.array.set([U.x,U.y,et,.75+.5*Math.sqrt(St)],j*4),w.iC.array.set(fp(U),j*3),w.iM.array.set([1,En(U.key),St,U.fa==="hot"?1:0],j*4),U.h=et});for(let U in w)w[U].needsUpdate=!0;bt.visible=xt.visible=L.length>0,I.uTerrStat.value=L.length?_==="dacs"?Uy:Ty:1,X.colSys=new Set(L.map(U=>U.sys).filter(Boolean)),Ht();let S=document.createDocumentFragment();if(L.filter(U=>U.callout!==!1).slice(0,fu).forEach((U,j)=>{let et=dp(U),St=j/(fu-1),vt=j===0?2:j<3?1.5:1,Q=Math.round(4-1.2*St),_t=document.createElement("div"),Ot=document.createElement("div"),Wt=document.createElement("div");_t.style.cssText=`position:absolute;left:0;top:${-vt/2}px;height:${vt}px;transform-origin:0 50%;background:linear-gradient(90deg,${et},${et}66);box-shadow:0 0 ${Math.round(9-6*St)}px ${et};opacity:${(1-.3*St).toFixed(2)};will-change:transform`,Ot.style.cssText=`position:absolute;left:${-Q}px;top:${-Q}px;width:${Q*2}px;height:${Q*2}px;border-radius:50%;background:${et};box-shadow:0 0 ${Math.round(12-6*St)}px ${et},0 0 2px #fff;will-change:transform`,Wt.className="c4-stat-callout",Wt.dataset.rank=String(j+1),Wt.style.cssText=`position:absolute;left:0;top:0;white-space:nowrap;padding:${j===0?"6px 12px 7px 11px":"4px 9px 5px 8px"};border-left:${Math.round(4-2*St)}px solid ${et};border-radius:0 6px 6px 0;border-top:1px solid ${et}${j===0?"55":"2a"};border-right:1px solid ${et}${j===0?"33":"1a"};border-bottom:1px solid rgba(0,0,0,.4);background:linear-gradient(90deg,rgba(6,10,22,${j===0?".92":".86"}),rgba(6,10,22,.62));backdrop-filter:blur(6px) saturate(140%);-webkit-backdrop-filter:blur(6px) saturate(140%);color:#e8f8ff;text-shadow:0 0 6px #000;box-shadow:0 0 ${Math.round(24-16*St)}px ${et}${j===0?"66":j<3?"40":"24"},0 4px 14px rgba(0,0,0,.45);opacity:${(1-.2*St).toFixed(2)};will-change:transform;pointer-events:auto;cursor:pointer`;let Vt=document.createElement("div");Vt.textContent=U.name.toUpperCase(),Vt.style.cssText=`font:${j===0?700:600} ${(12.5-2.5*St).toFixed(1)}px/1.25 Orbitron,"Segoe UI",system-ui,sans-serif;letter-spacing:.08em;color:#fff`;let rt=document.createElement("div");rt.textContent=U.line,rt.style.cssText=`font:${j<3?700:600} ${(17-5*St).toFixed(1)}px/1.2 Rajdhani,"Segoe UI",system-ui,sans-serif;color:${et};letter-spacing:.03em;`+(j===0?`text-shadow:0 0 10px ${et}88,0 0 4px #000`:""),Wt.append(Vt,rt),U.sys?(Wt.dataset.sys=U.sys,Wt.addEventListener("pointerdown",kt=>kt.stopPropagation()),Wt.addEventListener("click",kt=>{kt.stopPropagation(),Et("pick",{type:"system",id:U.sys,source:"callout"})})):Number.isFinite(U.x)&&Number.isFinite(U.y)&&(Wt.dataset.point=U.x+","+U.y,Wt.addEventListener("pointerdown",kt=>kt.stopPropagation()),Wt.addEventListener("click",kt=>{kt.stopPropagation(),Et("pick",{type:"point",x:U.x,y:U.y,source:"callout"}),Sc.focusPoint(U.x,U.y,Ay)})),S.append(_t,Ot,Wt),X.callouts.push({c:U,el:Wt,line:_t,dot:Ot,w:0,h:0,rank:j})}),_==="dacs"&&Y.example&&L.length){let U=document.createElement("div");U.className="c4-dac-example-mark",U.textContent="EXAMPLE",U.style.cssText='position:absolute;left:0;top:0;white-space:nowrap;pointer-events:none;font:700 22px/1 Orbitron,"Segoe UI",system-ui,sans-serif;letter-spacing:.42em;color:rgba(232,248,255,.16);text-shadow:0 0 12px rgba(0,0,0,.6);will-change:transform',S.append(U),Y.mark=U}l.appendChild(S),document.fonts&&document.fonts.status!=="loaded"&&document.fonts.ready.then(()=>{for(let U of X.callouts)U.w=0;Y.mw=0,wn[0]=NaN}),wn[0]=NaN}let Yo=[],pp=[60,90,125,165,210,260,320,390],$o=120,mp=[-40,-140,40,140,-90,90,0,180,-65,-115,65,115,-15,-165,15,165].map(_=>_*Math.PI/180);function gp(_){X.dirty&&du();let L=Math.min(1.3,Math.max(.3,_/90));Mt.uStatH.value=L,Mt.uStatW.value=Sy*Math.min(1.6,Math.max(.35,_/100)),Ne.uHaloK.value=Math.min(3.2,Math.max(1,_/40)),he.subVectors(f.target,h.position).normalize(),Mt.uMinH.value=by/(Pt(_)*Math.max(.2,Math.sqrt(1-he.y*he.y)));let w=!!X.callouts.length&&u.uGal.value>.05;if(l.style.display=w?"":"none",!w)return;l.style.opacity=u.uGal.value<.999?u.uGal.value.toFixed(2):"",Yo.length=0;let S=[];if(a.style.display!=="none")for(let et of vi)!et.vis||et.x0===void 0||(et.w||(et.w=et.el.offsetWidth,et.h=et.el.offsetHeight),et.w&&S.push([et.x0,et.y0,et.x0+et.w,et.y0+et.h,et.w*et.h]));let U=(et,St,vt,Q)=>{let _t=0;for(let Ot of S){let Wt=Math.min(vt,Ot[2])-Math.max(et,Ot[0]),Vt=Math.min(Q,Ot[3])-Math.max(St,Ot[1]);Wt>0&&Vt>0&&(_t=Math.max(_t,Wt*Vt/Ot[4]))}return _t};for(let et of X.callouts){he.set(et.c.x,zs+Nt(et.c),-et.c.y).project(h);let St=(he.x+1)/2*st,vt=(1-he.y)/2*yt,Q=he.z<1&&St>=-$o&&St<=st+$o&&vt>=-$o&&vt<=yt+$o;if(et.vis=!1,et.under=!1,!Q){et.el.style.display=et.line.style.display=et.dot.style.display="none";continue}let _t=Math.min(st,Math.max(0,St)),Ot=Math.min(yt,Math.max(0,vt));et.el.style.display="",et.w||(et.w=et.el.offsetWidth,et.h=et.el.offsetHeight);let Wt=et.w,Vt=et.h,rt=_t!==St||Ot!==vt||ls(_t,Ot),kt=[[_t+22,Ot-30-Vt],[_t-22-Wt,Ot-30-Vt],[_t+22,Ot+16],[_t-22-Wt,Ot+16],[_t+34,Ot-64-Vt],[_t-34-Wt,Ot-64-Vt],[_t+34,Ot+50],[_t-34-Wt,Ot+50]];for(let Rn of pp)for(let vn of mp){let qn=Math.cos(vn),ms=_t+Rn*qn,bp=Ot+Rn*Math.sin(vn);kt.push([qn>=0?ms:ms-Wt,bp-Vt/2])}let mt=null,ee=null,_e=1/0;for(let[Rn,vn]of kt){if(!Hs(Rn,vn,Rn+Wt,vn+Vt)||Yo.some(ms=>Rn<ms[2]&&Rn+Wt>ms[0]&&vn<ms[3]&&vn+Vt>ms[1]))continue;let qn=U(Rn,vn,Rn+Wt,vn+Vt);if(qn<=.03){mt=[Rn,vn];break}qn<_e&&(_e=qn,ee=[Rn,vn])}if(mt=mt||ee,!mt){et.el.style.display=et.line.style.display=et.dot.style.display="none";continue}et.line.style.display=et.dot.style.display="",et.vis=!0,et.under=rt;let[Ue,We]=mt;Yo.push([Ue-4,We-4,Ue+Wt+4,We+Vt+4]),et.el.style.transform=`translate(${Ue.toFixed(1)}px,${We.toFixed(1)}px)`;let Ze=Ue+Wt/2>=_t?Ue:Ue+Wt,ps=We+Vt/2,Wn=_t,Xn=Ot;if(rt){let Rn=Math.hypot(Ze-_t,ps-Ot),vn=Math.max(1,Math.ceil(Rn/2));for(let qn=1;qn<=vn&&(Wn=_t+(Ze-_t)*qn/vn,Xn=Ot+(ps-Ot)*qn/vn,!!ls(Wn,Xn));qn++);}et.mx=Wn,et.my=Xn,et.dot.style.transform=`translate(${Wn.toFixed(1)}px,${Xn.toFixed(1)}px)`;let Mp=Math.hypot(Ze-Wn,ps-Xn),Sp=Math.atan2(ps-Xn,Ze-Wn);et.line.style.width=Mp.toFixed(1)+"px",et.line.style.transform=`translate(${Wn.toFixed(1)}px,${Xn.toFixed(1)}px) rotate(${Sp.toFixed(4)}rad)`}let j=Y.mark;if(j){Y.mw||(j.style.display="",Y.mw=j.offsetWidth,Y.mh=j.offsetHeight);let et=Y.mw,St=Y.mh,vt=18,Q=ct.left+vt,_t=st-ct.right-vt-et,Ot=ct.top+vt,Wt=yt-ct.bottom-vt-St,Vt=[[Q,Wt],[_t,Wt],[Q,Ot],[_t,Ot],[(Q+_t)/2,Wt],[(Q+_t)/2,Ot]].find(([rt,kt])=>Hs(rt,kt,rt+et,kt+St)&&!Yo.some(mt=>rt<mt[2]&&rt+et>mt[0]&&kt<mt[3]&&kt+St>mt[1]));Y.markBox=Vt?{left:Vt[0],top:Vt[1],right:Vt[0]+et,bottom:Vt[1]+St}:null,j.style.display=Vt?"":"none",Vt&&(j.style.transform=`translate(${Vt[0].toFixed(1)}px,${Vt[1].toFixed(1)}px)`)}}let xc=[0,0,0,0];function zr(_,L){let w=E.place&&E.place[_];if(w)return Dd(w.A,w.O,E.seeds[_],u.uAnim.value,xc),L[0]=w.A[0]+xc[0],L[1]=w.A[1]+xc[1],L;let S=E.paths[_],U=E.kinds[_];if(S.moving&&(U===3||U===4))return Md(S,n(),L);let j=E.anchors[_];return L[0]=j[0],L[1]=j[1],L}let pu=new G,Vr=(_,L,w)=>(pu.set(_,0,-L).applyMatrix4(h.matrixWorldInverse),w*2*h.projectionMatrix.elements[5]*.5*yt/Math.max(1e-9,-pu.z));function us(_,L,w){return he.set(_,w,-L).project(h),he.z<1?[(he.x+1)/2*st,(1-he.y)/2*yt]:null}let mu=(Us[0]+Us[1])/2,xp=(Os[0]+Os[1])/2;function _c(_,L){if(!E)return null;let w=_-Tt.left,S=L-Tt.top,U=C.world,j=u.uAnim.value,et=-1,St=1/0;if(xe.fleets)for(let mt=0;mt<E.fleets.length;mt++){if(E.vis[mt]<.5||Ut(mt)<.5)continue;zr(mt,on);let ee=Vr(on[0],on[1],eu.galaxy*Ds(E.fleets[mt].flagSize)*oc(E.vis[mt]));if(ee<en.collapse)continue;let _e=us(on[0],on[1],0);if(!_e)continue;let Ue=Math.hypot(_e[0]-w,_e[1]-S);Ue<=Math.max(6,ee*.6)&&Ue<St&&(St=Ue,et=mt)}let vt=null,Q=1/0,_t=null,Ot=1/0;if(U&&xe.systems)for(let mt of U.infos){if(!mt.on||mt.ppu<=0)continue;let ee=Math.hypot(mt.sx-w,mt.sy-S);if(ee>mt.extPx+16&&ee>12)continue;for(let We=mt.b0;We<mt.b0+mt.nb;We++){let Ze=U.bodyAt[We],ps=Ze.R*mt.ppu;if(ps<mu)continue;C.bodyPos(We,j,qs);let Wn=us(qs[0],qs[1],0);if(!Wn)continue;let Xn=Math.hypot(Wn[0]-w,Wn[1]-S);Xn<=Math.max(6,ps*(Ze.kind===1?1.2:1.05))&&Xn<Q&&(Q=Xn,vt={type:"body",bi:We})}let _e=mt.sbHalf*mt.ppu;if(_e>=xp){let We=us(mt.s.x+mt.sb[0],mt.s.y+mt.sb[1],0),Ze=We?Math.hypot(We[0]-w,We[1]-S):1/0;Ze<=Math.max(8,_e*1.1)&&Ze<Q&&(Q=Ze,vt={type:"sb",info:mt})}let Ue=mt.starR*mt.ppu;ee<=Math.max(10,Ue*1.1)&&ee<Ot&&(Ot=ee,_t=mt)}let Wt=()=>{let mt=E.fleets[et],ee=ht?Bd(ht,mt.flag,mt.flagSize):"";return{type:"fleet",id:mt.a,ownerProfile:mt.o,label:Wd(mt)+(ee?" - "+ee:"")}};if(vt){if(et>=0&&St<=4)return Wt();if(vt.type==="body"){let ee=U.bodyAt[vt.bi],_e=U.infos[ee.si];return{type:"body",id:ee.L.b.a,sys:ee.L.b.sys,j:vt.bi,label:Fd(ee.L.b,ee.work?ee.work.n:0,_e.stakeN.get(vt.bi)||0)}}let mt=vt.info.s;return{type:"system",id:mt.a,sb:vt.info.si,label:`${mt.n} starbase - ${tn(mt.f)} lvl ${mt.lvl||0} - ${vt.info.members?vt.info.members.docked.length:0} fleets docked`}}let Vt=null,rt=1/0;et>=0&&St-3<rt&&(rt=St-3,Vt="fleet");let kt=-1;if(xe.mining)for(let mt=0;mt<E.asteroids.length;mt++){let ee=E.asteroids[mt],_e=U?U.bodyIdx.get(ee.a):void 0;if(_e!=null&&U.bodyAt[_e].R*U.infos[U.bodyAt[_e].si].ppu>=mu)continue;let Ue=us(ee.x,ee.y,0);if(!Ue||_t&&Math.hypot(Ue[0]-_t.sx,Ue[1]-_t.sy)<=Math.max(10,_t.starR*_t.ppu*1.1))continue;let We=Math.hypot(Ue[0]-w,Ue[1]-S);We<=12&&We-1<rt&&(rt=We-1,Vt="asteroid",kt=mt)}if(_t&&Ot<rt&&(rt=Ot,Vt="system"),Vt==="fleet")return Wt();if(Vt==="asteroid"){let mt=E.asteroids[kt];return{type:"asteroid",id:mt.a,label:qd(mt)}}if(Vt==="system"){let mt=_t.s,ee=_t.starR*_t.ppu>=xi[0];return{type:"system",id:mt.a,label:ee?`${mt.n} - star - ${_t.nb} bodies (orbit layout stylised: the chain has no in-system positions)`:Xd(mt)}}return null}let Hr=null,bi="",fs=null,Zo=new Map,Ko=(_,L)=>{if(_.pointerType==="touch"){if(L){Zo.delete(_.pointerId);return}if(Zo.set(_.pointerId,[_.clientX,_.clientY]),Zo.size>=2){let[w,S]=Zo.values();Cn.x=(w[0]+S[0])/2,Cn.y=(w[1]+S[1])/2,Cn.on=!0}}},gu=_=>{Hr={x:_.clientX,y:_.clientY},Cn.x=_.clientX,Cn.y=_.clientY,Cn.on=!0,ye=performance.now(),Ko(_)},xu=_=>Ko(_,!0),_u=()=>{Hr=null,Cn.on=!1,bi&&(bi="",o.style.cursor="",Et("hover",null))},vu=_=>{fs={x:_.clientX,y:_.clientY,b:_.button},ye=performance.now(),Ko(_)},yu=_=>{if(Ko(_,!0),!fs||fs.b!==0||Math.hypot(_.clientX-fs.x,_.clientY-fs.y)>5){fs=null;return}fs=null;let L=_c(_.clientX,_.clientY);L&&Et("pick",L.type==="fleet"?{type:L.type,id:L.id,ownerProfile:L.ownerProfile}:L.type==="body"?{type:"body",id:L.id,sys:L.sys}:{type:L.type,id:L.id})};o.addEventListener("pointermove",gu),o.addEventListener("pointerleave",_u),o.addEventListener("pointerdown",vu),o.addEventListener("pointerup",yu),o.addEventListener("pointercancel",xu);function _p(){if(!Hr)return;let{x:_,y:L}=Hr;Hr=null;let w=_c(_,L),S=w?w.type+":"+w.id:"";o.style.cursor=w?"pointer":"",C.setHover(w&&w.type==="body"?w.j:null,w&&w.sb!=null?w.sb:null),w?Et("hover",{type:w.type,id:w.id,label:w.label,ownerProfile:w.ownerProfile,sys:w.sys,clientX:_,clientY:L}):bi&&Et("hover",null),bi=S}let vc=0,Jo=0,jo=!1,Qo=!1,Mu=1,De={fps:0,frameMs:0,frames:0,acc:0,n:0,slow:0,cpuAcc:0,cpuMs:0},ds=(_,L,w)=>vp(Math.log2(_),Math.log2(L),Math.log2(Math.max(w,1e-6))),vp=(_,L,w)=>{let S=Math.min(1,Math.max(0,(w-_)/(L-_)));return S*S*(3-2*S)};function Su(_){vc=requestAnimationFrame(Su);let L=performance.now(),w=Jo?Math.min(.1,Math.max(0,(_-Jo)/1e3)):0;Jo=_,u.uTime.value+=w,e||(u.uAnim.value+=w),u.uNow.value=E?n()-E.tBase:0,se.on?(cs(w),ye=performance.now()):(Z(w),f.autoRotate=!e&&h.position.distanceTo(f.target)>ry&&performance.now()-ye>12e3,f.update(w));let S=f.target;(Math.abs(S.x)>70||Math.abs(S.z)>70)&&(S.x=Math.max(-70,Math.min(70,S.x)),S.z=Math.max(-70,Math.min(70,S.z))),h.updateMatrixWorld();let U=h.position.distanceTo(S),j=Math.max(1e-6,U*It.nearK);Math.abs(h.near-j)>j*.02&&(h.near=j,Vs()),u.uZoom.value=Math.min(1.5,Math.max(.5,U/110)),u.uSysZoom.value=Math.min(2,Math.max(.6,U/85)),u.uGlyphK.value=Math.min(1,U/oy),u.uGal.value=ds(iy,sy,U);let et=h.matrixWorld.elements,St=!1;for(let Q=0;Q<16;Q++)wn[Q]!==et[Q]&&(St=!0,wn[Q]=et[Q]);if(St&&E&&(C.lod(st,yt),an()),C.flushArt(performance.now()),(St||Wo)&&E){let Q=performance.now()-hu>=Tn;uu(U,Q),mc=!Q}else mc&&E&&(uu(U,!0),mc=!1);let vt=!1;if(X.growAt){let Q=Math.min(1,(performance.now()-X.growAt)/wy);Mt.uGrow.value=1-(1-Q)**3,vt=!0,Q>=1&&(X.growAt=0)}else Mt.uGrow.value=1;X.name&&E&&(St||vt||X.dirty||u.uGal.value!==Mu||l.style.display==="none"&&u.uGal.value>.05)?gp(U):!X.name&&l.style.display!=="none"&&(l.style.display="none"),Mu=u.uGal.value,_p(),s.info.reset(),x.render(w),De.frames++,De.acc+=w,De.n++,De.cpuAcc+=performance.now()-L,De.acc>=1&&(De.fps=De.n/De.acc,De.frameMs=1e3*De.acc/De.n,De.cpuMs=De.cpuAcc/De.n,De.acc=0,De.n=0,De.cpuAcc=0,De.slow=De.fps<45?De.slow+1:0,De.slow>=3&&r>1&&(r=1,s.setPixelRatio(1),u.uPR.value=1,Br(),De.slow=0))}function yc(){jo||Qo||(jo=!0,Jo=0,vc=requestAnimationFrame(Su))}function Mc(){jo=!1,cancelAnimationFrame(vc)}let bu=()=>document.hidden?Mc():yc();document.addEventListener("visibilitychange",bu);let wu=_=>{_.preventDefault(),Mc()},Tu=()=>{document.hidden||yc()};o.addEventListener("webglcontextlost",wu),o.addEventListener("webglcontextrestored",Tu),Br(),document.hidden||yc();function yp(_){let L=C.world,w=L&&L.byAddr.get(_);if(!w)return null;let S=w.members||{docked:[],mining:[],cst:[],idle:[]},U=[...S.docked,...S.mining,...S.cst,...S.idle],j=L.bodyAt.slice(w.b0,w.b0+w.nb),et=w.layout.length?w.layout[w.layout.length-1].r*w.k:0,St=Q=>{let _t=Ds(Q)*2*w.ppu;return Math.min(1,Math.max(0,(_t-en.collapse)/(en.full-en.collapse)))},vt=Q=>Math.round(Q*1e3)/1e3;return{sys:_,name:w.s.n,sb:[w.s.x+w.sb[0],w.s.y+w.sb[1]],bodies:w.nb,planets:j.filter(Q=>Q.kind===0).length,asteroids:j.filter(Q=>Q.kind===1).length,fleets:U.length,roles:{docked:S.docked.length,mining:S.mining.length,cst:S.cst.length,idle:S.idle.length},stakes:[...w.stakeN.values()].reduce((Q,_t)=>Q+_t,0),beams:U.filter(Q=>E.place[Q]&&E.place[Q].T[1]>.5).length,shipHalfMax:U.reduce((Q,_t)=>Math.max(Q,Ds(E.fleets[_t].flagSize)),0),bodyRMin:j.length?Math.min(...j.map(Q=>Q.R)):0,worked:j.filter(Q=>Q.work).map(Q=>({id:Q.L.b.a,name:Q.L.b.n,miners:Q.work.n,ups:Math.round(Q.work.ups*10)/10,fa:Q.work.fa,fade:vt(St("medium")),ring:xe.mining})),scale:w.k,footprint:vt(w.ext),extPx:Math.round(w.extPx),frac:vt(gt.frac),fade:vt(et?ds(Fs[0],Fs[1],et*w.ppu):Math.min(1,w.extPx/20)),...C.texStats()}}let Sc={ok:!0,setData:ae,setFilter(_={}){"faction"in _&&(Zt.faction=Kh.includes(_.faction)?_.faction:null),"states"in _&&(Zt.states=Array.isArray(_.states)&&_.states.length?_.states.slice():null),"owner"in _&&(Zt.owner=_.owner||null),Rt()},focusOwner(_){if(Zt.owner=_||null,Rt(),!_||!E)return On(bn.x,bn.y,bn.dist,bn.polar),0;let L=[];for(let S=0;S<E.fleets.length;S++)E.fleets[S].o===_&&L.push(zr(S,[0,0]));let w=Qh(L);return w&&On(w.x,w.y,Math.max(16,(w.span*1.35+4)/(2*Math.tan(Or*Math.PI/360))),.62),L.length},focusPoint(_,L,w=3){!Number.isFinite(_)||!Number.isFinite(L)||On(_,L,bn.dist/Math.max(.5,w||3),.62)},focusSystem(_){if(_==null){let w=gt.addr&&E&&E.sysByAddr.get(gt.addr);return w?On(w.x,w.y,42,bn.polar,e?0:1.4):On(f.target.x,-f.target.z,Math.max(42,h.position.distanceTo(f.target)),bn.polar,e?0:1.4),!0}let L=E&&E.sysByAddr.get(_);return L?(On(L.x,L.y,Ge(L),le,e?0:1.8),gt.framed=_,gt.frameD=Ge(L),!0):!1},bodyScreen(_){let L=C.world,w=L&&L.bodyIdx.get(_);if(w==null)return null;let S=C.bodyPos(w,u.uAnim.value,[0,0]);if(h.updateMatrixWorld(),he.set(S[0],0,-S[1]).project(h),he.z>=1)return null;let U=(he.x+1)/2*st,j=(1-he.y)/2*yt;return{x:S[0],y:S[1],clientX:U+Tt.left,clientY:j+Tt.top,visible:U>=0&&U<=st&&j>=0&&j<=yt}},pulseEvent(_){if(!_||!Number.isFinite(_.x)||!Number.isFinite(_.y))return!1;let L=Jv[_.k]??0,w=ie;ie=(ie+1)%lc;let S=Qv[L]||it(_.fa);if(Jt.iS.array.set([_.x,_.y,jv[L],u.uTime.value],w*4),Jt.iC.array.set(S,w*3),Jt.iK.array[w]=L,Jt.iS.needsUpdate=Jt.iC.needsUpdate=Jt.iK.needsUpdate=!0,_.k==="combat"&&Array.isArray(_.vs)){let U=it(_.fa);for(let j=0;j<Math.min(_.vs.length,ty);j++){let et=_.vs[j];if(!et)continue;let St=E&&E.index.get(et.f),vt=Id(_,j,St!=null?zr(St,[0,0]):null);if(!vt)continue;let Q=de;de=(de+1)%cc,ne.iE.array.set(vt,Q*4),ne.iC.array.set(it(et.fa),Q*3),ne.iC2.array.set(U,Q*3),ne.iS.array[Q*2]=u.uTime.value,ne.iS.array[Q*2+1]=En(String(et.f)),ne.iE.needsUpdate=ne.iC.needsUpdate=ne.iC2.needsUpdate=ne.iS.needsUpdate=!0}}return!0},on(_,L){return!z[_]||typeof L!="function"?()=>{}:(z[_].add(L),()=>z[_].delete(L))},setLayer(_,L){if(!ou.includes(_))return console.warn("C4Scene.setLayer: unknown layer",_),!1;xe[_]=!!L;for(let w of ke[_]||[])w.visible=!!L;return _==="territory"&&(I.uTerr.value=L?1:0),_==="systems"&&C.setVisible(L),_==="combat"&&ft(),(_==="fleets"||_==="mining")&&(C.setLayers(xe.fleets,xe.mining),Te(),_==="mining"&&E&&Rt()),wn[0]=NaN,!0},screenOf(_,L,w=0){h.updateMatrixWorld();let S=us(_,L,Number.isFinite(w)?w:0);return S?{clientX:S[0]+Tt.left,clientY:S[1]+Tt.top,visible:S[0]>=0&&S[0]<=st&&S[1]>=0&&S[1]<=yt,covered:ls(S[0],S[1])}:null},_starfield(_){return M.visible=!!_,!0},_backdrop(_){return M.visible=d.visible=!!_,!0},_world(_){return C.setVisible(_),!0},bodyPixelSize(_){let L=C.world,w=L&&L.bodyIdx.get(_);if(w==null)return null;h.updateMatrixWorld();let S=C.bodyPos(w,u.uAnim.value,[0,0]);return Vr(S[0],S[1],L.bodyAt[w].R)/2},ppuAt(_,L){return h.updateMatrixWorld(),Vr(_,L,.5)},lodProbe(){let _=C.world;if(!_)return null;let L=(ct.left+st-ct.right)/2,w=(ct.top+yt-ct.bottom)/2,S=null,U=1/0;for(let _t of _.infos){if(!_t.on)continue;let Ot=Math.hypot(_t.sx-L,_t.sy-w);Ot<U&&(U=Ot,S=_t)}if(!S)return null;let j=S,et=j.starR*j.ppu,St=j.layout.length?j.layout[j.layout.length-1].r*j.k*j.ppu:0,vt=0;for(let _t=j.b0;_t<j.b0+j.nb;_t++)vt=Math.max(vt,ds(Us[0],Us[1],_.bodyAt[_t].R*j.ppu));let Q=_t=>Math.round(_t*1e3)/1e3;return{sys:j.s.n,starPx:Q(et),extPx:Q(j.extPx),glyph:Q(1-ds(xi[0],xi[1],et)),star:Q(ds(xi[0],xi[1],et)),rings:Q(ds(Fs[0],Fs[1],St)),bodies:Q(vt),station:Q(ds(Os[0],Os[1],j.sbHalf*j.ppu)),markers:Q(u.uGal.value)}},setStatLayer(_){let L=_==null||_===""?null:String(_);return L!==null&&!Sd.includes(L)?(console.warn("C4Scene.setStatLayer: unknown stat layer",_),!1):(L&&L!==X.name&&(X.growAt=e?0:performance.now()),(L!==X.name||L)&&(X.name=L,X.dirty=!0),ft(),L||du(),!0)},setDacs(_={}){let L=new Set;Y.dacs=(Array.isArray(_&&_.dacs)?_.dacs:[]).filter(U=>U&&typeof U.tag=="string"&&U.tag&&!L.has(U.tag)&&L.add(U.tag)).map(U=>({tag:U.tag.slice(0,24),color:ac(U.color),members:(Array.isArray(U.members)?U.members:[]).filter(j=>typeof j=="string"&&j)})),Y.example=!!(_&&_.example),Y.focus=_&&typeof _.focus=="string"&&Y.dacs.some(U=>U.tag===_.focus)?_.focus:null;let w=_&&_.lens&&typeof _.lens=="object"?_.lens:{},S=Y.lens.on;return Y.lens={on:w.on===!0,metrics:su.filter(U=>Array.isArray(w.metrics)&&w.metrics.includes(U)),scope:typeof w.scope=="string"&&Y.dacs.some(U=>U.tag===w.scope)?w.scope:null},(Y.lens.on||S)&&Gt(),X.name==="dacs"&&(X.dirty=!0),!0},focusDac(_){if(!E||typeof _!="string")return!1;let L=Y.dacs.find(rt=>rt.tag===_);if(!L)return!1;let w=(iu(E.latest,[L]).byDac[_]||[]).filter(rt=>Number.isFinite(rt.x)&&Number.isFinite(rt.y));if(!w.length)return!1;let S=Qh(w.map(rt=>[rt.x,rt.y])),U=(he.copy(h.position).sub(f.target),Ye.setFromVector3(he).theta);oe.copy(h),oe.updateProjectionMatrix(),Le.set(S.x,0,-S.y);let j=Fy,et=ct.left+j,St=st-ct.right-j,vt=ct.top+j,Q=yt-ct.bottom-j,_t=rt=>{Ae.set(rt,ep,U),oe.position.setFromSpherical(Ae).add(Le),oe.lookAt(Le),oe.updateMatrixWorld();for(let kt of w){he.set(kt.x,zs,-kt.y).project(oe);let mt=(he.x+1)/2*st,ee=(1-he.y)/2*yt;if(he.z>=1||mt<et||mt>St||ee<vt||ee>Q||si.some(_e=>mt>_e.left-hc&&mt<_e.right+hc&&ee>_e.top-hc&&ee<_e.bottom+hc))return!1}return!0},Ot=Oy,Wt=f.maxDistance,Vt;if(_t(Ot))Vt=Ot;else if(!_t(Wt))Vt=Wt;else{for(let rt=0;rt<22;rt++){let kt=(Ot+Wt)/2;_t(kt)?Wt=kt:Ot=kt}Vt=Wt}return On(S.x,S.y,Vt,ep),!0},setInsets(_={}){let L=S=>Number.isFinite(S)&&S>0?S:0,w=[ct.left,ct.right,ct.top,ct.bottom].join();if(Object.assign(Yt,{left:L(_.left),right:L(_.right),top:L(_.top),bottom:L(_.bottom)}),si.length=0,Array.isArray(_.avoid))for(let S of _.avoid)!S||![S.left,S.top,S.right,S.bottom].every(Number.isFinite)||S.right<=S.left||S.bottom<=S.top||si.push({left:S.left,top:S.top,right:S.right,bottom:S.bottom});return Vs(),h.updateMatrixWorld(),wn[0]=NaN,[ct.left,ct.right,ct.top,ct.bottom].join()!==w&&(Me.clear(),Ft()),{...ct,avoid:si.map(S=>({...S}))}},fleetScreen(_){if(!E)return null;let L=E.fleets.findIndex(j=>j.a===_);if(L<0)return null;h.updateMatrixWorld(),zr(L,on);let w=E.fleets[L],S=Vr(on[0],on[1],Ds(w.flagSize)*oc(E.vis[L])),U=Ut(L)<.001?0:Math.min(1,Math.max(0,(S-en.collapse)/(en.full-en.collapse)));return{x:on[0],y:on[1],inSystem:!!(E.place&&E.place[L]),shown:U,...Sc.screenOf(on[0],on[1])}},statColumnScreen(_){let L=X.cols[_];if(!L)return null;h.updateMatrixWorld();let w=us(L.x,L.y,zs),S=us(L.x,L.y,zs+Nt(L));return w&&S?{key:L.key,sys:L.sys,x:L.x,y:L.y,base:{clientX:w[0]+Tt.left,clientY:w[1]+Tt.top},top:{clientX:S[0]+Tt.left,clientY:S[1]+Tt.top},widthWorld:(.75+.5*Math.sqrt(X.vmax?L.v/X.vmax:0))*Mt.uStatW.value}:null},labelLayout(){let _=(w,S,U)=>[+(w[0]+Tt.left).toFixed(1),+(w[1]+Tt.top).toFixed(1),+(w[0]+S+Tt.left).toFixed(1),+(w[1]+U+Tt.top).toFixed(1)],L=(w,S,U,j)=>({n:S,prio:U,vis:j,hide:w.hide||"",def:_(w.spots[0],w.w,w.h),box:_(w.spots[j?w.cand:0],w.w,w.h)});return{galaxy:vi.filter(w=>w.shown&&w.w).map(w=>L(w,w.s.n,w.prio,!!w.vis)),system:[...ai.values()].filter(w=>w.on&&w.w).map(w=>L(w,w.el.textContent,w.prio,w.cand!=null&&w.cand>=0))}},pickAt(_,L){h.updateMatrixWorld();let w=_c(_,L);return w?{type:w.type,id:w.id,sys:w.sys}:null},tune(_={}){return typeof _.fleetDots=="boolean"&&(lt.uDots.value=_.fleetDots?1:0),Number.isFinite(_.strength)&&(H.strength=_.strength),Number.isFinite(_.radius)&&(H.radius=_.radius),Number.isFinite(_.threshold)&&(H.threshold=_.threshold),Number.isFinite(_.exposure)&&(s.toneMappingExposure=_.exposure),Number.isFinite(_.terrDim)&&(I.uTerrDim.value=_.terrDim),Number.isFinite(_.terrFill)&&(I.uTerrFill.value=_.terrFill),Number.isFinite(_.conqFill)&&(N.material.uniforms.uConqFill.value=_.conqFill),Number.isFinite(_.conqDim)&&(N.material.uniforms.uConqDim.value=_.conqDim),Array.isArray(_.terrGain)&&_.terrGain.length===3&&(A=_.terrGain.slice(),F(A,Y.lens.on)),Number.isFinite(_.sysCover)&&(ut.value=_.sysCover),Number.isFinite(_.nearK)&&_.nearK>0&&(It.nearK=_.nearK,h.near=0),Number.isFinite(_.domIn)&&(It.domIn=_.domIn),Number.isFinite(_.domOut)&&(It.domOut=_.domOut),Number.isFinite(_.dcOut)&&(It.dcOut=_.dcOut),{terrDim:I.uTerrDim.value,strength:H.strength,radius:H.radius,threshold:H.threshold,exposure:s.toneMappingExposure}},fleetPixelSize(_){if(!E)return null;let L=E.fleets.findIndex(U=>U.a===_);if(L<0)return null;let w=E.fleets[L],S=Ds(w.flagSize)*oc(E.vis[L]);return h.updateMatrixWorld(),zr(L,on),Vr(on[0],on[1],S)},fleetCell(_){let L=E&&E.fleets.find(w=>w.a===_);return L?rc(ht,L.flag,L.flagSize):null},getStats(){return{ok:!0,fps:Math.round(De.fps*10)/10,frameMs:Math.round(De.frameMs*100)/100,frames:De.frames,pixelRatio:r,drawCalls:s.info.render.calls,fleets:E?E.fleets.length:0,systems:E?E.systems.length:0,hotSpots:E?E.hot.length:0,reducedMotion:e,bodies:At.length,systemView:gt.addr?yp(gt.addr):null,galaxyFade:Math.round(u.uGal.value*1e3)/1e3,camera:(()=>{he.copy(h.position).sub(f.target);let _=new ui().setFromVector3(he);return{dist:_.radius,polar:_.phi,azimuth:_.theta,tx:f.target.x,ty:-f.target.z,min:f.minDistance,near:h.near}})(),textures:C.texStats(),ships:{atlas:!!ht,sil:Math.round(u.uSil.value*1e3)/1e3},activeFx:(()=>{let _=u.uTime.value,L=0,w=0;for(let S=0;S<lc;S++){let U=_-Jt.iS.array[S*4+3],j=Jt.iK.array[S];U>=-.001&&U<=(j===1?3.2:j===5?1.8:2.4)&&L++}for(let S=0;S<cc;S++){let U=_-ne.iS.array[S*2];U>=-.001&&U<=1.8&&w++}return{pulses:L,tracers:w}})(),running:jo,layers:{...xe},filter:{...Zt},flying:se.on,autoRotating:f.autoRotate,cpuMs:Math.round(De.cpuMs*100)/100,statLayer:{name:X.name,columns:X.cols.length,callouts:X.callouts.map(_=>({sys:_.c.sys,name:_.c.name,line:_.c.line,v:_.c.v,shown:_.el.style.display!=="none"&&l.style.display!=="none",rank:_.rank+1,under:!!_.under,marker:_.vis?[+(_.mx+Tt.left).toFixed(1),+(_.my+Tt.top).toFixed(1)]:null}))},dacs:{n:Y.dacs.length,example:Y.example,focus:Y.focus,halos:Y.halos.length,drawn:jt.visible,lens:{...Y.lens,metrics:Y.lens.metrics.slice(),drawn:N.visible,byDac:Y.conq?{...Y.conq.byDac}:{},contested:Y.conq?Y.conq.contested:0,systems:Y.conq?Y.conq.systems.map(_=>({a:_.a,winner:_.winner,contested:_.contested,strength:_.strength})):[]},cols:X.name==="dacs"?X.cols.map(_=>({sys:_.sys,tag:_.tag,hex:_.hex,v:_.v})):[],mark:Y.mark&&Y.markBox&&Y.mark.style.display!=="none"&&l.style.display!=="none"?{left:Y.markBox.left+Tt.left,top:Y.markBox.top+Tt.top,right:Y.markBox.right+Tt.left,bottom:Y.markBox.bottom+Tt.top}:null},insets:{...ct,avoid:si.map(_=>({..._}))}}},dispose(){Qo||(Qo=!0,Mc(),kr.disconnect(),document.removeEventListener("visibilitychange",bu),i.removeEventListener("wheel",$,{capture:!0}),o.removeEventListener("pointermove",gu),o.removeEventListener("pointerleave",_u),o.removeEventListener("pointerdown",vu),o.removeEventListener("pointerup",yu),o.removeEventListener("pointercancel",xu),o.removeEventListener("webglcontextlost",wu),o.removeEventListener("webglcontextrestored",Tu),f.dispose(),C.dispose(),c.traverse(_=>{_.geometry&&_.geometry.dispose(),_.material&&_.material.dispose()}),p.dispose(),x.dispose(),R.dispose(),s.dispose(),o.remove(),a.remove(),l.remove(),z.pick.clear(),z.hover.clear(),E=null)}};return Sc}window.C4Scene={mount:pM,version:"1.0.0",layers:ou.slice()};})();
