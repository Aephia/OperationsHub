/* C4 Live galaxy scene. Source: C4Live/scene-src (node C4Live/scene-src/build.mjs). Includes three.js 0.186.1 (MIT License, Copyright 2010-2026 three.js authors, https://github.com/mrdoob/three.js). */
(()=>{var Gn={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},ti={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},rf=0,th=1,of=2;var go=1,af=2,Mr=3,es=0,bn=1,fi=2,Wn=0,Sr=1,Ps=2,eh=3,nh=4,br=5;var di=100,lf=101,cf=102,hf=103,nl=104,uf=200,Is=201,ff=202,df=203,ih=204,wr=205,pf=206,mf=207,gf=208,xf=209,_f=210,vf=211,yf=212,Mf=213,Sf=214,Aa=0,Ea=1,Ca=2,ur=3,Ra=4,Pa=5,Ia=6,La=7,sh=0,bf=1,wf=2,ei=0,xo=1,_o=2,vo=3,Ls=4,yo=5,Mo=6,So=7;var rh=300,ns=301,Ds=302,il=303,sl=304,bo=306,Da=1e3,ci=1001,Na=1002,on=1003,Tf=1004;var wo=1005;var qe=1006,rl=1007;var is=1008;var Fn=1009,oh=1010,ah=1011,Tr=1012,ol=1013,ni=1014,ii=1015,Je=1016,al=1017,ll=1018,Ar=1020,lh=35902,ch=35899,hh=1021,uh=1022,xn=1023,hi=1026,ss=1027,fh=1028,cl=1029,rs=1030,hl=1031;var ul=1033,To=33776,Ao=33777,Eo=33778,Co=33779,fl=35840,dl=35841,pl=35842,ml=35843,gl=36196,xl=37492,_l=37496,vl=37488,yl=37489,Ro=37490,Ml=37491,Sl=37808,bl=37809,wl=37810,Tl=37811,Al=37812,El=37813,Cl=37814,Rl=37815,Pl=37816,Il=37817,Ll=37818,Dl=37819,Nl=37820,Ul=37821,Fl=36492,Ol=36494,Bl=36495,kl=36283,zl=36284,Po=36285,Vl=36286;var Zr=2300,Ua=2301,ba=2302,qc=2303,Yc=2400,$c=2401,Zc=2402;var Af=3200;var dh=0,Ef=1,Ri="",cn="srgb",Kr="srgb-linear",Jr="linear",Ae="srgb";var wa=7680;var Cf=519,Rf=512,Pf=513,If=514,Hl=515,Lf=516,Df=517,Gl=518,Nf=519,Uf=35044,ph=35048;var mh="300 es",jn=2e3,jr=2001;function kp(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function zp(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function fr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ff(){let i=fr("canvas");return i.style.display="block",i}var Du={},dr=null;function gh(...i){let t="THREE."+i.shift();dr?dr("log",t,...i):console.log(t,...i)}function Of(i){let t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function ie(...i){i=Of(i);let t="THREE."+i.shift();if(dr)dr("warn",t,...i);else{let e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function se(...i){i=Of(i);let t="THREE."+i.shift();if(dr)dr("error",t,...i);else{let e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function Ts(...i){let t=i.join(" ");t in Du||(Du[t]=!0,ie(...i))}function Bf(i,t,e){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}var kf={[Aa]:Ea,[Ca]:Ia,[Ra]:La,[ur]:Pa,[Ea]:Aa,[Ia]:Ca,[La]:Ra,[Pa]:ur},Qn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},dn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Nu=1234567,Yr=Math.PI/180,pr=180/Math.PI;function Er(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(dn[i&255]+dn[i>>8&255]+dn[i>>16&255]+dn[i>>24&255]+"-"+dn[t&255]+dn[t>>8&255]+"-"+dn[t>>16&15|64]+dn[t>>24&255]+"-"+dn[e&63|128]+dn[e>>8&255]+"-"+dn[e>>16&255]+dn[e>>24&255]+dn[n&255]+dn[n>>8&255]+dn[n>>16&255]+dn[n>>24&255]).toLowerCase()}function _e(i,t,e){return Math.max(t,Math.min(e,i))}function xh(i,t){return(i%t+t)%t}function Vp(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Hp(i,t,e){return i!==t?(e-i)/(t-i):0}function $r(i,t,e){return(1-e)*i+e*t}function Gp(i,t,e,n){return $r(i,t,1-Math.exp(-e*n))}function Wp(i,t=1){return t-Math.abs(xh(i,t*2)-t)}function Xp(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function qp(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Yp(i,t){return i+Math.floor(Math.random()*(t-i+1))}function $p(i,t){return i+Math.random()*(t-i)}function Zp(i){return i*(.5-Math.random())}function Kp(i){i!==void 0&&(Nu=i);let t=Nu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Jp(i){return i*Yr}function jp(i){return i*pr}function Qp(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function tm(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function em(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function nm(i,t,e,n,s){let r=Math.cos,o=Math.sin,a=r(e/2),l=o(e/2),c=r((t+n)/2),h=o((t+n)/2),f=r((t-n)/2),u=o((t-n)/2),d=r((n-t)/2),g=o((n-t)/2);switch(s){case"XYX":i.set(a*h,l*f,l*u,a*c);break;case"YZY":i.set(l*u,a*h,l*f,a*c);break;case"ZXZ":i.set(l*f,l*u,a*h,a*c);break;case"XZX":i.set(a*h,l*g,l*d,a*c);break;case"YXY":i.set(l*d,a*h,l*g,a*c);break;case"ZYZ":i.set(l*g,l*d,a*h,a*c);break;default:ie("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function cr(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:case Uint8ClampedArray:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Mn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var _h={DEG2RAD:Yr,RAD2DEG:pr,generateUUID:Er,clamp:_e,euclideanModulo:xh,mapLinear:Vp,inverseLerp:Hp,lerp:$r,damp:Gp,pingpong:Wp,smoothstep:Xp,smootherstep:qp,randInt:Yp,randFloat:$p,randFloatSpread:Zp,seededRandom:Kp,degToRad:Jp,radToDeg:jp,isPowerOfTwo:Qp,ceilPowerOfTwo:tm,floorPowerOfTwo:em,setQuaternionFromProperEuler:nm,normalize:Mn,denormalize:cr},bh=class bh{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=_e(this.x,t.x,e.x),this.y=_e(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=_e(this.x,t,e),this.y=_e(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(_e(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(_e(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*s+t.x,this.y=r*s+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};bh.prototype.isVector2=!0;var qt=bh,Dn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,o,a){let l=n[s+0],c=n[s+1],h=n[s+2],f=n[s+3],u=r[o+0],d=r[o+1],g=r[o+2],M=r[o+3];if(f!==M||l!==u||c!==d||h!==g){let x=l*u+c*d+h*g+f*M;x<0&&(u=-u,d=-d,g=-g,M=-M,x=-x);let p=1-a;if(x<.9995){let I=Math.acos(x),U=Math.sin(I);p=Math.sin(p*I)/U,a=Math.sin(a*I)/U,l=l*p+u*a,c=c*p+d*a,h=h*p+g*a,f=f*p+M*a}else{l=l*p+u*a,c=c*p+d*a,h=h*p+g*a,f=f*p+M*a;let I=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=I,c*=I,h*=I,f*=I}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,r,o){let a=n[s],l=n[s+1],c=n[s+2],h=n[s+3],f=r[o],u=r[o+1],d=r[o+2],g=r[o+3];return t[e]=a*g+h*f+l*d-c*u,t[e+1]=l*g+h*u+c*f-a*d,t[e+2]=c*g+h*d+a*u-l*f,t[e+3]=h*g-a*f-l*u-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),h=a(s/2),f=a(r/2),u=l(n/2),d=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=u*h*f+c*d*g,this._y=c*d*f-u*h*g,this._z=c*h*g+u*d*f,this._w=c*h*f-u*d*g;break;case"YXZ":this._x=u*h*f+c*d*g,this._y=c*d*f-u*h*g,this._z=c*h*g-u*d*f,this._w=c*h*f+u*d*g;break;case"ZXY":this._x=u*h*f-c*d*g,this._y=c*d*f+u*h*g,this._z=c*h*g+u*d*f,this._w=c*h*f-u*d*g;break;case"ZYX":this._x=u*h*f-c*d*g,this._y=c*d*f+u*h*g,this._z=c*h*g-u*d*f,this._w=c*h*f+u*d*g;break;case"YZX":this._x=u*h*f+c*d*g,this._y=c*d*f+u*h*g,this._z=c*h*g-u*d*f,this._w=c*h*f-u*d*g;break;case"XZY":this._x=u*h*f-c*d*g,this._y=c*d*f-u*h*g,this._z=c*h*g+u*d*f,this._w=c*h*f+u*d*g;break;default:ie("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],f=e[10],u=n+a+f;if(u>0){let d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(o-s)*d}else if(n>a&&n>f){let d=2*Math.sqrt(1+n-a-f);this._w=(h-l)/d,this._x=.25*d,this._y=(s+o)/d,this._z=(r+c)/d}else if(a>f){let d=2*Math.sqrt(1+a-n-f);this._w=(r-c)/d,this._x=(s+o)/d,this._y=.25*d,this._z=(l+h)/d}else{let d=2*Math.sqrt(1+f-n-a);this._w=(o-s)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(_e(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-n*c,this._z=r*h+o*c+n*l-s*a,this._w=o*h-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,s=-s,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},wh=class wh{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Uu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Uu.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*n),h=2*(a*e-r*s),f=2*(r*n-o*e);return this.x=e+l*c+o*f-a*h,this.y=n+l*h+a*c-r*f,this.z=s+l*f+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=_e(this.x,t.x,e.x),this.y=_e(this.y,t.y,e.y),this.z=_e(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=_e(this.x,t,e),this.y=_e(this.y,t,e),this.z=_e(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(_e(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ac.copy(this).projectOnVector(t),this.sub(Ac)}reflect(t){return this.sub(Ac.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(_e(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};wh.prototype.isVector3=!0;var G=wh,Ac=new G,Uu=new Dn,Th=class Th{constructor(t,e,n,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c)}set(t,e,n,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=n,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],h=n[4],f=n[7],u=n[2],d=n[5],g=n[8],M=s[0],x=s[3],p=s[6],I=s[1],U=s[4],E=s[7],b=s[2],A=s[5],L=s[8];return r[0]=o*M+a*I+l*b,r[3]=o*x+a*U+l*A,r[6]=o*p+a*E+l*L,r[1]=c*M+h*I+f*b,r[4]=c*x+h*U+f*A,r[7]=c*p+h*E+f*L,r[2]=u*M+d*I+g*b,r[5]=u*x+d*U+g*A,r[8]=u*p+d*E+g*L,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-n*r*h+n*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=h*o-a*c,u=a*l-h*r,d=c*r-o*l,g=e*f+n*u+s*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let M=1/g;return t[0]=f*M,t[1]=(s*c-h*n)*M,t[2]=(a*n-s*o)*M,t[3]=u*M,t[4]=(h*e-s*l)*M,t[5]=(s*r-a*e)*M,t[6]=d*M,t[7]=(n*l-c*e)*M,t[8]=(o*e-n*r)*M,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return Ts("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Ec.makeScale(t,e)),this}rotate(t){return Ts("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Ec.makeRotation(-t)),this}translate(t,e){return Ts("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Ec.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Th.prototype.isMatrix3=!0;var ce=Th,Ec=new ce,Fu=new ce().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ou=new ce().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function im(){let i={enabled:!0,workingColorSpace:Kr,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===Ae&&(s.r=Ei(s.r),s.g=Ei(s.g),s.b=Ei(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===Ae&&(s.r=hr(s.r),s.g=hr(s.g),s.b=hr(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Ri?Jr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ts("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ts("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Kr]:{primaries:t,whitePoint:n,transfer:Jr,toXYZ:Fu,fromXYZ:Ou,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:cn},outputColorSpaceConfig:{drawingBufferColorSpace:cn}},[cn]:{primaries:t,whitePoint:n,transfer:Ae,toXYZ:Fu,fromXYZ:Ou,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:cn}}}),i}var xe=im();function Ei(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function hr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Zs,Fa=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Zs===void 0&&(Zs=fr("canvas")),Zs.width=t.width,Zs.height=t.height;let s=Zs.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Zs}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=fr("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ei(r[o]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ei(e[n]/255)*255):e[n]=Ei(e[n]);return{data:e,width:t.width,height:t.height}}else return ie("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},sm=0,mr=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:sm++}),this.uuid=Er(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Cc(s[o].image)):r.push(Cc(s[o]))}else r=Cc(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function Cc(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Fa.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(ie("Texture: Unable to serialize Texture."),{})}var rm=0,Rc=new G,mn=class i extends Qn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=ci,s=ci,r=qe,o=is,a=xn,l=Fn,c=i.DEFAULT_ANISOTROPY,h=Ri){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:rm++}),this.uuid=Er(),this.name="",this.source=new mr(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new qt(0,0),this.repeat=new qt(1,1),this.center=new qt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ce,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Rc).x}get height(){return this.source.getSize(Rc).y}get depth(){return this.source.getSize(Rc).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){ie(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){ie(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==rh)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Da:t.x=t.x-Math.floor(t.x);break;case ci:t.x=t.x<0?0:1;break;case Na:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Da:t.y=t.y-Math.floor(t.y);break;case ci:t.y=t.y<0?0:1;break;case Na:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};mn.DEFAULT_IMAGE=null;mn.DEFAULT_MAPPING=rh;mn.DEFAULT_ANISOTROPY=1;var Ah=class Ah{constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,c=l[0],h=l[4],f=l[8],u=l[1],d=l[5],g=l[9],M=l[2],x=l[6],p=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-M)<.01&&Math.abs(g-x)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+M)<.1&&Math.abs(g+x)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let U=(c+1)/2,E=(d+1)/2,b=(p+1)/2,A=(h+u)/4,L=(f+M)/4,v=(g+x)/4;return U>E&&U>b?U<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(U),s=A/n,r=L/n):E>b?E<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(E),n=A/s,r=v/s):b<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(b),n=L/r,s=v/r),this.set(n,s,r,e),this}let I=Math.sqrt((x-g)*(x-g)+(f-M)*(f-M)+(u-h)*(u-h));return Math.abs(I)<.001&&(I=1),this.x=(x-g)/I,this.y=(f-M)/I,this.z=(u-h)/I,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=_e(this.x,t.x,e.x),this.y=_e(this.y,t.y,e.y),this.z=_e(this.z,t.z,e.z),this.w=_e(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=_e(this.x,t,e),this.y=_e(this.y,t,e),this.z=_e(this.z,t,e),this.w=_e(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(_e(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Ah.prototype.isVector4=!0;var We=Ah,Oa=class extends Qn{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:qe,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new We(0,0,t,e),this.scissorTest=!1,this.viewport=new We(0,0,t,e),this.textures=[];let s={width:t,height:e,depth:n.depth},r=new mn(s),o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:qe,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new mr(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ye=class extends Oa{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Qr=class extends mn{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=on,this.minFilter=on,this.wrapR=ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var Ba=class extends mn{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=on,this.minFilter=on,this.wrapR=ci,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var el=class el{constructor(t,e,n,s,r,o,a,l,c,h,f,u,d,g,M,x){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,o,a,l,c,h,f,u,d,g,M,x)}set(t,e,n,s,r,o,a,l,c,h,f,u,d,g,M,x){let p=this.elements;return p[0]=t,p[4]=e,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=h,p[10]=f,p[14]=u,p[3]=d,p[7]=g,p[11]=M,p[15]=x,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new el().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,s=1/Ks.setFromMatrixColumn(t,0).length(),r=1/Ks.setFromMatrixColumn(t,1).length(),o=1/Ks.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){let u=o*h,d=o*f,g=a*h,M=a*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=d+g*c,e[5]=u-M*c,e[9]=-a*l,e[2]=M-u*c,e[6]=g+d*c,e[10]=o*l}else if(t.order==="YXZ"){let u=l*h,d=l*f,g=c*h,M=c*f;e[0]=u+M*a,e[4]=g*a-d,e[8]=o*c,e[1]=o*f,e[5]=o*h,e[9]=-a,e[2]=d*a-g,e[6]=M+u*a,e[10]=o*l}else if(t.order==="ZXY"){let u=l*h,d=l*f,g=c*h,M=c*f;e[0]=u-M*a,e[4]=-o*f,e[8]=g+d*a,e[1]=d+g*a,e[5]=o*h,e[9]=M-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let u=o*h,d=o*f,g=a*h,M=a*f;e[0]=l*h,e[4]=g*c-d,e[8]=u*c+M,e[1]=l*f,e[5]=M*c+u,e[9]=d*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let u=o*l,d=o*c,g=a*l,M=a*c;e[0]=l*h,e[4]=M-u*f,e[8]=g*f+d,e[1]=f,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=d*f+g,e[10]=u-M*f}else if(t.order==="XZY"){let u=o*l,d=o*c,g=a*l,M=a*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=u*f+M,e[5]=o*h,e[9]=d*f-g,e[2]=g*f-d,e[6]=a*h,e[10]=M*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(om,t,am)}lookAt(t,e,n){let s=this.elements;return In.subVectors(t,e),In.lengthSq()===0&&(In.z=1),In.normalize(),zi.crossVectors(n,In),zi.lengthSq()===0&&(Math.abs(n.z)===1?In.x+=1e-4:In.z+=1e-4,In.normalize(),zi.crossVectors(n,In)),zi.normalize(),na.crossVectors(In,zi),s[0]=zi.x,s[4]=na.x,s[8]=In.x,s[1]=zi.y,s[5]=na.y,s[9]=In.y,s[2]=zi.z,s[6]=na.z,s[10]=In.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],h=n[1],f=n[5],u=n[9],d=n[13],g=n[2],M=n[6],x=n[10],p=n[14],I=n[3],U=n[7],E=n[11],b=n[15],A=s[0],L=s[4],v=s[8],P=s[12],N=s[1],F=s[5],O=s[9],Y=s[13],z=s[2],j=s[6],ht=s[10],ct=s[14],gt=s[3],ot=s[7],dt=s[11],xt=s[15];return r[0]=o*A+a*N+l*z+c*gt,r[4]=o*L+a*F+l*j+c*ot,r[8]=o*v+a*O+l*ht+c*dt,r[12]=o*P+a*Y+l*ct+c*xt,r[1]=h*A+f*N+u*z+d*gt,r[5]=h*L+f*F+u*j+d*ot,r[9]=h*v+f*O+u*ht+d*dt,r[13]=h*P+f*Y+u*ct+d*xt,r[2]=g*A+M*N+x*z+p*gt,r[6]=g*L+M*F+x*j+p*ot,r[10]=g*v+M*O+x*ht+p*dt,r[14]=g*P+M*Y+x*ct+p*xt,r[3]=I*A+U*N+E*z+b*gt,r[7]=I*L+U*F+E*j+b*ot,r[11]=I*v+U*O+E*ht+b*dt,r[15]=I*P+U*Y+E*ct+b*xt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],f=t[6],u=t[10],d=t[14],g=t[3],M=t[7],x=t[11],p=t[15],I=l*d-c*u,U=a*d-c*f,E=a*u-l*f,b=o*d-c*h,A=o*u-l*h,L=o*f-a*h;return e*(M*I-x*U+p*E)-n*(g*I-x*b+p*A)+s*(g*U-M*b+p*L)-r*(g*E-M*A+x*L)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],h=t[10];return e*(o*h-a*c)-n*(r*h-a*l)+s*(r*c-o*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=t[9],u=t[10],d=t[11],g=t[12],M=t[13],x=t[14],p=t[15],I=e*a-n*o,U=e*l-s*o,E=e*c-r*o,b=n*l-s*a,A=n*c-r*a,L=s*c-r*l,v=h*M-f*g,P=h*x-u*g,N=h*p-d*g,F=f*x-u*M,O=f*p-d*M,Y=u*p-d*x,z=I*Y-U*O+E*F+b*N-A*P+L*v;if(z===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let j=1/z;return t[0]=(a*Y-l*O+c*F)*j,t[1]=(s*O-n*Y-r*F)*j,t[2]=(M*L-x*A+p*b)*j,t[3]=(u*A-f*L-d*b)*j,t[4]=(l*N-o*Y-c*P)*j,t[5]=(e*Y-s*N+r*P)*j,t[6]=(x*E-g*L-p*U)*j,t[7]=(h*L-u*E+d*U)*j,t[8]=(o*O-a*N+c*v)*j,t[9]=(n*N-e*O-r*v)*j,t[10]=(g*A-M*E+p*I)*j,t[11]=(f*E-h*A-d*I)*j,t[12]=(a*P-o*F-l*v)*j,t[13]=(e*F-n*P+s*v)*j,t[14]=(M*U-g*b-x*I)*j,t[15]=(h*b-f*U+u*I)*j,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+n,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,o){return this.set(1,n,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,f=a+a,u=r*c,d=r*h,g=r*f,M=o*h,x=o*f,p=a*f,I=l*c,U=l*h,E=l*f,b=n.x,A=n.y,L=n.z;return s[0]=(1-(M+p))*b,s[1]=(d+E)*b,s[2]=(g-U)*b,s[3]=0,s[4]=(d-E)*A,s[5]=(1-(u+p))*A,s[6]=(x+I)*A,s[7]=0,s[8]=(g+U)*L,s[9]=(x-I)*L,s[10]=(1-(u+M))*L,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let o=Ks.set(s[0],s[1],s[2]).length(),a=Ks.set(s[4],s[5],s[6]).length(),l=Ks.set(s[8],s[9],s[10]).length();r<0&&(o=-o),Zn.copy(this);let c=1/o,h=1/a,f=1/l;return Zn.elements[0]*=c,Zn.elements[1]*=c,Zn.elements[2]*=c,Zn.elements[4]*=h,Zn.elements[5]*=h,Zn.elements[6]*=h,Zn.elements[8]*=f,Zn.elements[9]*=f,Zn.elements[10]*=f,e.setFromRotationMatrix(Zn),n.x=o,n.y=a,n.z=l,this}makePerspective(t,e,n,s,r,o,a=jn,l=!1){let c=this.elements,h=2*r/(e-t),f=2*r/(n-s),u=(e+t)/(e-t),d=(n+s)/(n-s),g,M;if(l)g=r/(o-r),M=o*r/(o-r);else if(a===jn)g=-(o+r)/(o-r),M=-2*o*r/(o-r);else if(a===jr)g=-o/(o-r),M=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=M,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,o,a=jn,l=!1){let c=this.elements,h=2/(e-t),f=2/(n-s),u=-(e+t)/(e-t),d=-(n+s)/(n-s),g,M;if(l)g=1/(o-r),M=o/(o-r);else if(a===jn)g=-2/(o-r),M=-(o+r)/(o-r);else if(a===jr)g=-1/(o-r),M=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=g,c[14]=M,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};el.prototype.isMatrix4=!0;var Ge=el,Ks=new G,Zn=new Ge,om=new G(0,0,0),am=new G(1,1,1),zi=new G,na=new G,In=new G,Bu=new Ge,ku=new Dn,qi=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],f=s[2],u=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(_e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-_e(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(_e(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-_e(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(_e(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-_e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:ie("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Bu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Bu,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ku.setFromEuler(this),this.setFromQuaternion(ku,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};qi.DEFAULT_ORDER="XYZ";var gr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},lm=0,zu=new G,Js=new Dn,Si=new Ge,ia=new G,Gr=new G,cm=new G,hm=new Dn,Vu=new G(1,0,0),Hu=new G(0,1,0),Gu=new G(0,0,1),Wu={type:"added"},um={type:"removed"},js={type:"childadded",child:null},Pc={type:"childremoved",child:null},Nn=class i extends Qn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:lm++}),this.uuid=Er(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new G,e=new qi,n=new Dn,s=new G(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Ge},normalMatrix:{value:new ce}}),this.matrix=new Ge,this.matrixWorld=new Ge,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new gr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Js.setFromAxisAngle(t,e),this.quaternion.multiply(Js),this}rotateOnWorldAxis(t,e){return Js.setFromAxisAngle(t,e),this.quaternion.premultiply(Js),this}rotateX(t){return this.rotateOnAxis(Vu,t)}rotateY(t){return this.rotateOnAxis(Hu,t)}rotateZ(t){return this.rotateOnAxis(Gu,t)}translateOnAxis(t,e){return zu.copy(t).applyQuaternion(this.quaternion),this.position.add(zu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Vu,t)}translateY(t){return this.translateOnAxis(Hu,t)}translateZ(t){return this.translateOnAxis(Gu,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Si.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ia.copy(t):ia.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),Gr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Si.lookAt(Gr,ia,this.up):Si.lookAt(ia,Gr,this.up),this.quaternion.setFromRotationMatrix(Si),s&&(Si.extractRotation(s.matrixWorld),Js.setFromRotationMatrix(Si),this.quaternion.premultiply(Js.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(se("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Wu),js.child=t,this.dispatchEvent(js),js.child=null):se("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(um),Pc.child=t,this.dispatchEvent(Pc),Pc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Si.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Si.multiply(t.parent.matrixWorld)),t.applyMatrix4(Si),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Wu),js.child=t,this.dispatchEvent(js),js.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gr,t,cm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gr,hm,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*s,r[13]+=n-r[1]*e-r[5]*n-r[9]*s,r[14]+=s-r[2]*e-r[6]*n-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let f=l[c];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),f=o(t.shapes),u=o(t.skeletons),d=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Nn.DEFAULT_UP=new G(0,1,0);Nn.DEFAULT_MATRIX_AUTO_UPDATE=!0;Nn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ws=class extends Nn{constructor(){super(),this.isGroup=!0,this.type="Group"}},fm={type:"move"},xr=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ws,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ws,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new G,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new G),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ws,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new G,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new G,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let M of t.hand.values()){let x=e.getJointPose(M,n),p=this._getHandJoint(c,M);x!==null&&(p.matrix.fromArray(x.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=x.radius),p.visible=x!==null}let h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,g=.005;c.inputState.pinching&&u>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(fm)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new ws;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},zf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Vi={h:0,s:0,l:0},sa={h:0,s:0,l:0};function Ic(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var ue=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=cn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,xe.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=xe.workingColorSpace){return this.r=t,this.g=e,this.b=n,xe.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=xe.workingColorSpace){if(t=xh(t,1),e=_e(e,0,1),n=_e(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=Ic(o,r,t+1/3),this.g=Ic(o,r,t),this.b=Ic(o,r,t-1/3)}return xe.colorSpaceToWorking(this,s),this}setStyle(t,e=cn){function n(r){r!==void 0&&parseFloat(r)<1&&ie("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:ie("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);ie("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=cn){let n=zf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):ie("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ei(t.r),this.g=Ei(t.g),this.b=Ei(t.b),this}copyLinearToSRGB(t){return this.r=hr(t.r),this.g=hr(t.g),this.b=hr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=cn){return xe.workingToColorSpace(pn.copy(this),t),Math.round(_e(pn.r*255,0,255))*65536+Math.round(_e(pn.g*255,0,255))*256+Math.round(_e(pn.b*255,0,255))}getHexString(t=cn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=xe.workingColorSpace){xe.workingToColorSpace(pn.copy(this),e);let n=pn.r,s=pn.g,r=pn.b,o=Math.max(n,s,r),a=Math.min(n,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let f=o-a;switch(c=h<=.5?f/(o+a):f/(2-o-a),o){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=xe.workingColorSpace){return xe.workingToColorSpace(pn.copy(this),e),t.r=pn.r,t.g=pn.g,t.b=pn.b,t}getStyle(t=cn){xe.workingToColorSpace(pn.copy(this),t);let e=pn.r,n=pn.g,s=pn.b;return t!==cn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Vi),this.setHSL(Vi.h+t,Vi.s+e,Vi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Vi),t.getHSL(sa);let n=$r(Vi.h,sa.h,e),s=$r(Vi.s,sa.s,e),r=$r(Vi.l,sa.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},pn=new ue;ue.NAMES=zf;var to=class extends Nn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new qi,this.environmentIntensity=1,this.environmentRotation=new qi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},Kn=new G,bi=new G,Lc=new G,wi=new G,Qs=new G,tr=new G,Xu=new G,Dc=new G,Nc=new G,Uc=new G,Fc=new We,Oc=new We,Bc=new We,Xi=class i{constructor(t=new G,e=new G,n=new G){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Kn.subVectors(t,e),s.cross(Kn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Kn.subVectors(s,e),bi.subVectors(n,e),Lc.subVectors(t,e);let o=Kn.dot(Kn),a=Kn.dot(bi),l=Kn.dot(Lc),c=bi.dot(bi),h=bi.dot(Lc),f=o*c-a*a;if(f===0)return r.set(0,0,0),null;let u=1/f,d=(c*l-a*h)*u,g=(o*h-a*l)*u;return r.set(1-d-g,g,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,wi)===null?!1:wi.x>=0&&wi.y>=0&&wi.x+wi.y<=1}static getInterpolation(t,e,n,s,r,o,a,l){return this.getBarycoord(t,e,n,s,wi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,wi.x),l.addScaledVector(o,wi.y),l.addScaledVector(a,wi.z),l)}static getInterpolatedAttribute(t,e,n,s,r,o){return Fc.setScalar(0),Oc.setScalar(0),Bc.setScalar(0),Fc.fromBufferAttribute(t,e),Oc.fromBufferAttribute(t,n),Bc.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(Fc,r.x),o.addScaledVector(Oc,r.y),o.addScaledVector(Bc,r.z),o}static isFrontFacing(t,e,n,s){return Kn.subVectors(n,e),bi.subVectors(t,e),Kn.cross(bi).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Kn.subVectors(this.c,this.b),bi.subVectors(this.a,this.b),Kn.cross(bi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,o,a;Qs.subVectors(s,n),tr.subVectors(r,n),Dc.subVectors(t,n);let l=Qs.dot(Dc),c=tr.dot(Dc);if(l<=0&&c<=0)return e.copy(n);Nc.subVectors(t,s);let h=Qs.dot(Nc),f=tr.dot(Nc);if(h>=0&&f<=h)return e.copy(s);let u=l*f-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(n).addScaledVector(Qs,o);Uc.subVectors(t,r);let d=Qs.dot(Uc),g=tr.dot(Uc);if(g>=0&&d<=g)return e.copy(r);let M=d*c-l*g;if(M<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(tr,a);let x=h*g-d*f;if(x<=0&&f-h>=0&&d-g>=0)return Xu.subVectors(r,s),a=(f-h)/(f-h+(d-g)),e.copy(s).addScaledVector(Xu,a);let p=1/(x+M+u);return o=M*p,a=u*p,e.copy(n).addScaledVector(Qs,o).addScaledVector(tr,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Yi=class{constructor(t=new G(1/0,1/0,1/0),e=new G(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Jn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Jn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Jn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Jn):Jn.fromBufferAttribute(r,o),Jn.applyMatrix4(t.matrixWorld),this.expandByPoint(Jn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ra.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ra.copy(n.boundingBox)),ra.applyMatrix4(t.matrixWorld),this.union(ra)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Jn),Jn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Wr),oa.subVectors(this.max,Wr),er.subVectors(t.a,Wr),nr.subVectors(t.b,Wr),ir.subVectors(t.c,Wr),Hi.subVectors(nr,er),Gi.subVectors(ir,nr),ys.subVectors(er,ir);let e=[0,-Hi.z,Hi.y,0,-Gi.z,Gi.y,0,-ys.z,ys.y,Hi.z,0,-Hi.x,Gi.z,0,-Gi.x,ys.z,0,-ys.x,-Hi.y,Hi.x,0,-Gi.y,Gi.x,0,-ys.y,ys.x,0];return!kc(e,er,nr,ir,oa)||(e=[1,0,0,0,1,0,0,0,1],!kc(e,er,nr,ir,oa))?!1:(aa.crossVectors(Hi,Gi),e=[aa.x,aa.y,aa.z],kc(e,er,nr,ir,oa))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Jn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Jn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Ti[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Ti[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Ti[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Ti[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Ti[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Ti[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Ti[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Ti[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Ti),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Ti=[new G,new G,new G,new G,new G,new G,new G,new G],Jn=new G,ra=new Yi,er=new G,nr=new G,ir=new G,Hi=new G,Gi=new G,ys=new G,Wr=new G,oa=new G,aa=new G,Ms=new G;function kc(i,t,e,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Ms.fromArray(i,r);let a=s.x*Math.abs(Ms.x)+s.y*Math.abs(Ms.y)+s.z*Math.abs(Ms.z),l=t.dot(Ms),c=e.dot(Ms),h=n.dot(Ms);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var Ze=new G,la=new qt,dm=0,rn=class extends Qn{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:dm++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Uf,this.updateRanges=[],this.gpuType=ii,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)la.fromBufferAttribute(this,e),la.applyMatrix3(t),this.setXY(e,la.x,la.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ze.fromBufferAttribute(this,e),Ze.applyMatrix3(t),this.setXYZ(e,Ze.x,Ze.y,Ze.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ze.fromBufferAttribute(this,e),Ze.applyMatrix4(t),this.setXYZ(e,Ze.x,Ze.y,Ze.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ze.fromBufferAttribute(this,e),Ze.applyNormalMatrix(t),this.setXYZ(e,Ze.x,Ze.y,Ze.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ze.fromBufferAttribute(this,e),Ze.transformDirection(t),this.setXYZ(e,Ze.x,Ze.y,Ze.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=cr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Mn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=cr(e,this.array)),e}setX(t,e){return this.normalized&&(e=Mn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=cr(e,this.array)),e}setY(t,e){return this.normalized&&(e=Mn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=cr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Mn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=cr(e,this.array)),e}setW(t,e){return this.normalized&&(e=Mn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Mn(e,this.array),n=Mn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Mn(e,this.array),n=Mn(n,this.array),s=Mn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Mn(e,this.array),n=Mn(n,this.array),s=Mn(s,this.array),r=Mn(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var eo=class extends rn{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var no=class extends rn{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Sn=class extends rn{constructor(t,e,n){super(new Float32Array(t),e,n)}},pm=new Yi,Xr=new G,zc=new G,As=class{constructor(t=new G,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):pm.setFromPoints(t).getCenter(n);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Xr.subVectors(t,this.center);let e=Xr.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(Xr,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(zc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Xr.copy(t.center).add(zc)),this.expandByPoint(Xr.copy(t.center).sub(zc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},mm=0,Hn=new Ge,Vc=new Nn,sr=new G,Ln=new Yi,qr=new Yi,sn=new G,gn=class i extends Qn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:mm++}),this.uuid=Er(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(kp(t)?no:eo)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new ce().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Hn.makeRotationFromQuaternion(t),this.applyMatrix4(Hn),this}rotateX(t){return Hn.makeRotationX(t),this.applyMatrix4(Hn),this}rotateY(t){return Hn.makeRotationY(t),this.applyMatrix4(Hn),this}rotateZ(t){return Hn.makeRotationZ(t),this.applyMatrix4(Hn),this}translate(t,e,n){return Hn.makeTranslation(t,e,n),this.applyMatrix4(Hn),this}scale(t,e,n){return Hn.makeScale(t,e,n),this.applyMatrix4(Hn),this}lookAt(t){return Vc.lookAt(t),Vc.updateMatrix(),this.applyMatrix4(Vc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(sr).negate(),this.translate(sr.x,sr.y,sr.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Sn(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&ie("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Yi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){se("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new G(-1/0,-1/0,-1/0),new G(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];Ln.setFromBufferAttribute(r),this.morphTargetsRelative?(sn.addVectors(this.boundingBox.min,Ln.min),this.boundingBox.expandByPoint(sn),sn.addVectors(this.boundingBox.max,Ln.max),this.boundingBox.expandByPoint(sn)):(this.boundingBox.expandByPoint(Ln.min),this.boundingBox.expandByPoint(Ln.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&se('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new As);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){se("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new G,1/0);return}if(t){let n=this.boundingSphere.center;if(Ln.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];qr.setFromBufferAttribute(a),this.morphTargetsRelative?(sn.addVectors(Ln.min,qr.min),Ln.expandByPoint(sn),sn.addVectors(Ln.max,qr.max),Ln.expandByPoint(sn)):(Ln.expandByPoint(qr.min),Ln.expandByPoint(qr.max))}Ln.getCenter(n);let s=0;for(let r=0,o=t.count;r<o;r++)sn.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(sn));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)sn.fromBufferAttribute(a,c),l&&(sr.fromBufferAttribute(t,c),sn.add(sr)),s=Math.max(s,n.distanceToSquared(sn))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&se('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){se("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,r=e.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==n.count)&&(o=new rn(new Float32Array(4*n.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let v=0;v<n.count;v++)a[v]=new G,l[v]=new G;let c=new G,h=new G,f=new G,u=new qt,d=new qt,g=new qt,M=new G,x=new G;function p(v,P,N){c.fromBufferAttribute(n,v),h.fromBufferAttribute(n,P),f.fromBufferAttribute(n,N),u.fromBufferAttribute(r,v),d.fromBufferAttribute(r,P),g.fromBufferAttribute(r,N),h.sub(c),f.sub(c),d.sub(u),g.sub(u);let F=1/(d.x*g.y-g.x*d.y);isFinite(F)&&(M.copy(h).multiplyScalar(g.y).addScaledVector(f,-d.y).multiplyScalar(F),x.copy(f).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(F),a[v].add(M),a[P].add(M),a[N].add(M),l[v].add(x),l[P].add(x),l[N].add(x))}let I=this.groups;I.length===0&&(I=[{start:0,count:t.count}]);for(let v=0,P=I.length;v<P;++v){let N=I[v],F=N.start,O=N.count;for(let Y=F,z=F+O;Y<z;Y+=3)p(t.getX(Y+0),t.getX(Y+1),t.getX(Y+2))}let U=new G,E=new G,b=new G,A=new G;function L(v){b.fromBufferAttribute(s,v),A.copy(b);let P=a[v];U.copy(P),U.sub(b.multiplyScalar(b.dot(P))).normalize(),E.crossVectors(A,P);let F=E.dot(l[v])<0?-1:1;o.setXYZW(v,U.x,U.y,U.z,F)}for(let v=0,P=I.length;v<P;++v){let N=I[v],F=N.start,O=N.count;for(let Y=F,z=F+O;Y<z;Y+=3)L(t.getX(Y+0)),L(t.getX(Y+1)),L(t.getX(Y+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new rn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,d=n.count;u<d;u++)n.setXYZ(u,0,0,0);let s=new G,r=new G,o=new G,a=new G,l=new G,c=new G,h=new G,f=new G;if(t)for(let u=0,d=t.count;u<d;u+=3){let g=t.getX(u+0),M=t.getX(u+1),x=t.getX(u+2);s.fromBufferAttribute(e,g),r.fromBufferAttribute(e,M),o.fromBufferAttribute(e,x),h.subVectors(o,r),f.subVectors(s,r),h.cross(f),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,M),c.fromBufferAttribute(n,x),a.add(h),l.add(h),c.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(M,l.x,l.y,l.z),n.setXYZ(x,c.x,c.y,c.z)}else for(let u=0,d=e.count;u<d;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),f.subVectors(s,r),h.cross(f),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)sn.fromBufferAttribute(t,e),sn.normalize(),t.setXYZ(e,sn.x,sn.y,sn.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,f=a.normalized,u=new c.constructor(l.length*h),d=0,g=0;for(let M=0,x=l.length;M<x;M++){a.isInterleavedBufferAttribute?d=l[M]*a.data.stride+a.offset:d=l[M]*h;for(let p=0;p<h;p++)u[g++]=c[d++]}return new rn(u,h,f)}if(this.index===null)return ie("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,n);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,f=c.length;h<f;h++){let u=c[h],d=t(u,n);l.push(d)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){let d=c[f];h.push(d.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],f=r[c];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var Hc=new G,gm=new G,xm=new ce,hn=class{constructor(t=new G(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=Hc.subVectors(n,e).cross(gm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let s=t.delta(Hc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(s,o)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||xm.getNormalMatrix(t),s=this.coplanarPoint(Hc).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},_m=0,$i=class extends Qn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:_m++}),this.uuid=Er(),this.name="",this.type="Material",this.blending=Sr,this.side=es,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ih,this.blendDst=wr,this.blendEquation=di,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ue(0,0,0),this.blendAlpha=0,this.depthFunc=ur,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Cf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=wa,this.stencilZFail=wa,this.stencilZPass=wa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){ie(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){ie(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new ue().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new hn().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new qt().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new qt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var Ai=new G,Gc=new G,ca=new G,ha=new G,Zi=class{constructor(t=new G,e=new G(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ai)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Ai.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ai.copy(this.origin).addScaledVector(this.direction,e),Ai.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Gc.copy(t).add(e).multiplyScalar(.5),ca.copy(e).sub(t).normalize(),ha.copy(this.origin).sub(Gc);let r=t.distanceTo(e)*.5,o=-this.direction.dot(ca),a=ha.dot(this.direction),l=-ha.dot(ca),c=ha.lengthSq(),h=Math.abs(1-o*o),f,u,d,g;if(h>0)if(f=o*l-a,u=o*a-l,g=r*h,f>=0)if(u>=-g)if(u<=g){let M=1/h;f*=M,u*=M,d=f*(f+o*u+2*a)+u*(o*f+u+2*l)+c}else u=r,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*l)+c;else u=-r,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*l)+c;else u<=-g?(f=Math.max(0,-(-o*r+a)),u=f>0?-r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c):u<=g?(f=0,u=Math.min(Math.max(-r,-l),r),d=u*(u+2*l)+c):(f=Math.max(0,-(o*r+a)),u=f>0?r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c);else u=o>0?-r:r,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Gc).addScaledVector(ca,u),d}intersectSphere(t,e){if(t.radius<0)return null;Ai.subVectors(t.center,this.origin);let n=Ai.dot(this.direction),s=Ai.dot(Ai)-n*n,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(n=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(n=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),f>=0?(a=(t.min.z-u.z)*f,l=(t.max.z-u.z)*f):(a=(t.max.z-u.z)*f,l=(t.min.z-u.z)*f),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Ai)!==null}intersectTriangle(t,e,n,s,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,f=t.x-o.x,u=t.y-o.y,d=t.z-o.z,g=e.x-o.x,M=e.y-o.y,x=e.z-o.z,p=n.x-o.x,I=n.y-o.y,U=n.z-o.z,E=Math.abs(l),b=Math.abs(c),A=Math.abs(h),L,v,P,N,F,O,Y,z,j,ht,ct,gt;if(E>=b&&E>=A?(P=l,O=f,j=g,gt=p,l>=0?(L=c,v=h,N=u,F=d,Y=M,z=x,ht=I,ct=U):(L=h,v=c,N=d,F=u,Y=x,z=M,ht=U,ct=I)):b>=A?(P=c,O=u,j=M,gt=I,c>=0?(L=h,v=l,N=d,F=f,Y=x,z=g,ht=U,ct=p):(L=l,v=h,N=f,F=d,Y=g,z=x,ht=p,ct=U)):(P=h,O=d,j=x,gt=U,h>=0?(L=l,v=c,N=f,F=u,Y=g,z=M,ht=p,ct=I):(L=c,v=l,N=u,F=f,Y=M,z=g,ht=I,ct=p)),P===0)return null;let ot=L/P,dt=v/P,xt=1/P,Zt=N-ot*O,Xt=F-dt*O,Ee=Y-ot*j,pe=z-dt*j,Me=ht-ot*gt,W=ct-dt*gt,et=Me*pe-W*Ee,St=Zt*W-Xt*Me,vt=Ee*Xt-pe*Zt;if(s){if(et<0||St<0||vt<0)return null}else if((et<0||St<0||vt<0)&&(et>0||St>0||vt>0))return null;let yt=et+St+vt;if(yt===0)return null;let Ft=xt*(et*O+St*j+vt*gt);return(yt>0?Ft<0:Ft>0)?null:this.at(Ft/yt,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Es=class extends $i{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ue(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new qi,this.combine=sh,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},qu=new Ge,Ss=new Zi,ua=new As,Yu=new G,fa=new G,da=new G,pa=new G,Wc=new G,ma=new G,$u=new G,ga=new G,ze=class extends Nn{constructor(t=new gn,e=new Es){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){ma.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],f=r[l];h!==0&&(Wc.fromBufferAttribute(f,t),o?ma.addScaledVector(Wc,h):ma.addScaledVector(Wc.sub(e),h))}e.add(ma)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ua.copy(n.boundingSphere),ua.applyMatrix4(r),Ss.copy(t.ray).recast(t.near),!(ua.containsPoint(Ss.origin)===!1&&(Ss.intersectSphere(ua,Yu)===null||Ss.origin.distanceToSquared(Yu)>(t.far-t.near)**2))&&(qu.copy(r).invert(),Ss.copy(t.ray).applyMatrix4(qu),!(n.boundingBox!==null&&Ss.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ss)))}_computeIntersections(t,e,n){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,u=r.groups,d=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,M=u.length;g<M;g++){let x=u[g],p=o[x.materialIndex],I=Math.max(x.start,d.start),U=Math.min(a.count,Math.min(x.start+x.count,d.start+d.count));for(let E=I,b=U;E<b;E+=3){let A=a.getX(E),L=a.getX(E+1),v=a.getX(E+2);s=xa(this,p,t,n,c,h,f,A,L,v),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=x.materialIndex,e.push(s))}}else{let g=Math.max(0,d.start),M=Math.min(a.count,d.start+d.count);for(let x=g,p=M;x<p;x+=3){let I=a.getX(x),U=a.getX(x+1),E=a.getX(x+2);s=xa(this,o,t,n,c,h,f,I,U,E),s&&(s.faceIndex=Math.floor(x/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,M=u.length;g<M;g++){let x=u[g],p=o[x.materialIndex],I=Math.max(x.start,d.start),U=Math.min(l.count,Math.min(x.start+x.count,d.start+d.count));for(let E=I,b=U;E<b;E+=3){let A=E,L=E+1,v=E+2;s=xa(this,p,t,n,c,h,f,A,L,v),s&&(s.faceIndex=Math.floor(E/3),s.face.materialIndex=x.materialIndex,e.push(s))}}else{let g=Math.max(0,d.start),M=Math.min(l.count,d.start+d.count);for(let x=g,p=M;x<p;x+=3){let I=x,U=x+1,E=x+2;s=xa(this,o,t,n,c,h,f,I,U,E),s&&(s.faceIndex=Math.floor(x/3),e.push(s))}}}};function vm(i,t,e,n,s,r,o,a){let l;if(t.side===bn?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,t.side===es,a),l===null)return null;ga.copy(a),ga.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(ga);return c<e.near||c>e.far?null:{distance:c,point:ga.clone(),object:i}}function xa(i,t,e,n,s,r,o,a,l,c){i.getVertexPosition(a,fa),i.getVertexPosition(l,da),i.getVertexPosition(c,pa);let h=vm(i,t,e,n,fa,da,pa,$u);if(h){let f=new G;Xi.getBarycoord($u,fa,da,pa,f),s&&(h.uv=Xi.getInterpolatedAttribute(s,a,l,c,f,new qt)),r&&(h.uv1=Xi.getInterpolatedAttribute(r,a,l,c,f,new qt)),o&&(h.normal=Xi.getInterpolatedAttribute(o,a,l,c,f,new G),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:l,c,normal:new G,materialIndex:0};Xi.getNormal(fa,da,pa,u.normal),h.face=u,h.barycoord=f}return h}var Ki=class extends mn{constructor(t=null,e=1,n=1,s,r,o,a,l,c=on,h=on,f,u){super(null,o,a,l,c,h,s,r,f,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var io=class extends rn{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}};var bs=new As,ym=new qt(.5,.5),_a=new G,so=class{constructor(t=new hn,e=new hn,n=new hn,s=new hn,r=new hn,o=new hn){this.planes=[t,e,n,s,r,o]}set(t,e,n,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=jn,n=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],f=r[5],u=r[6],d=r[7],g=r[8],M=r[9],x=r[10],p=r[11],I=r[12],U=r[13],E=r[14],b=r[15];if(s[0].setComponents(c-o,d-h,p-g,b-I).normalize(),s[1].setComponents(c+o,d+h,p+g,b+I).normalize(),s[2].setComponents(c+a,d+f,p+M,b+U).normalize(),s[3].setComponents(c-a,d-f,p-M,b-U).normalize(),n)s[4].setComponents(l,u,x,E).normalize(),s[5].setComponents(c-l,d-u,p-x,b-E).normalize();else if(s[4].setComponents(c-l,d-u,p-x,b-E).normalize(),e===jn)s[5].setComponents(c+l,d+u,p+x,b+E).normalize();else if(e===jr)s[5].setComponents(l,u,x,E).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),bs.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),bs.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(bs)}intersectsSprite(t){bs.center.set(0,0,0);let e=ym.distanceTo(t.center);return bs.radius=.7071067811865476+e,bs.applyMatrix4(t.matrixWorld),this.intersectsSphere(bs)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(_a.x=s.normal.x>0?t.max.x:t.min.x,_a.y=s.normal.y>0?t.max.y:t.min.y,_a.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(_a)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var ka=class extends $i{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new ue(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Zu=new Ge,Kc=new Zi,va=new As,ya=new G,ro=class extends Nn{constructor(t=new gn,e=new ka){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),va.copy(n.boundingSphere),va.applyMatrix4(s),va.radius+=r,t.ray.intersectsSphere(va)===!1)return;Zu.copy(s).invert(),Kc.copy(t.ray).applyMatrix4(Zu);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,f=n.attributes.position;if(c!==null){let u=Math.max(0,o.start),d=Math.min(c.count,o.start+o.count);for(let g=u,M=d;g<M;g++){let x=c.getX(g);ya.fromBufferAttribute(f,x),Ku(ya,x,l,s,t,e,this)}}else{let u=Math.max(0,o.start),d=Math.min(f.count,o.start+o.count);for(let g=u,M=d;g<M;g++)ya.fromBufferAttribute(f,g),Ku(ya,g,l,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Ku(i,t,e,n,s,r,o){let a=Kc.distanceSqToPoint(i);if(a<e){let l=new G;Kc.closestPointToPoint(i,l),l.applyMatrix4(n);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var oo=class extends mn{constructor(t=[],e=ns,n,s,r,o,a,l,c,h){super(t,e,n,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},ao=class extends mn{constructor(t,e,n,s,r,o,a,l,c){super(t,e,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Ji=class extends mn{constructor(t,e,n=ni,s,r,o,a=on,l=on,c,h=hi,f=1){if(h!==hi&&h!==ss)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:f};super(u,s,r,o,a,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new mr(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},za=class extends Ji{constructor(t,e=ni,n=ns,s,r,o=on,a=on,l,c=hi){let h={width:t,height:t,depth:1},f=[h,h,h,h,h,h];super(t,t,e,n,s,r,o,a,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},lo=class extends mn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},_r=class i extends gn{constructor(t=1,e=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],f=[],u=0,d=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,s,o,2),g("x","z","y",1,-1,t,n,-e,s,o,3),g("x","y","z",1,-1,t,e,n,s,r,4),g("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Sn(c,3)),this.setAttribute("normal",new Sn(h,3)),this.setAttribute("uv",new Sn(f,2));function g(M,x,p,I,U,E,b,A,L,v,P){let N=E/L,F=b/v,O=E/2,Y=b/2,z=A/2,j=L+1,ht=v+1,ct=0,gt=0,ot=new G;for(let dt=0;dt<ht;dt++){let xt=dt*F-Y;for(let Zt=0;Zt<j;Zt++){let Xt=Zt*N-O;ot[M]=Xt*I,ot[x]=xt*U,ot[p]=z,c.push(ot.x,ot.y,ot.z),ot[M]=0,ot[x]=0,ot[p]=A>0?1:-1,h.push(ot.x,ot.y,ot.z),f.push(Zt/L),f.push(1-dt/v),ct+=1}}for(let dt=0;dt<v;dt++)for(let xt=0;xt<L;xt++){let Zt=u+xt+j*dt,Xt=u+xt+j*(dt+1),Ee=u+(xt+1)+j*(dt+1),pe=u+(xt+1)+j*dt;l.push(Zt,Xt,pe),l.push(Xt,Ee,pe),gt+=6}a.addGroup(d,gt,P),d+=gt,u+=ct}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var Ci=class i extends gn{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(n),l=Math.floor(s),c=a+1,h=l+1,f=t/a,u=e/l,d=[],g=[],M=[],x=[];for(let p=0;p<h;p++){let I=p*u-o;for(let U=0;U<c;U++){let E=U*f-r;g.push(E,-I,0),M.push(0,0,1),x.push(U/a),x.push(1-p/l)}}for(let p=0;p<l;p++)for(let I=0;I<a;I++){let U=I+c*p,E=I+c*(p+1),b=I+1+c*(p+1),A=I+1+c*p;d.push(U,E,A),d.push(E,b,A)}this.setIndex(d),this.setAttribute("position",new Sn(g,3)),this.setAttribute("normal",new Sn(M,3)),this.setAttribute("uv",new Sn(x,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};function Ns(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];if(Ju(s))s.isRenderTargetTexture?(ie("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(Ju(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();t[e][n]=r}else t[e][n]=s.slice();else t[e][n]=s}}return t}function _n(i){let t={};for(let e=0;e<i.length;e++){let n=Ns(i[e]);for(let s in n)t[s]=n[s]}return t}function Ju(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Mm(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function vh(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:xe.workingColorSpace}var Pi={clone:Ns,merge:_n},Sm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,bm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ve=class extends $i{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Sm,this.fragmentShader=bm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ns(t.uniforms),this.uniformsGroups=Mm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new ue().setHex(s.value);break;case"v2":this.uniforms[n].value=new qt().fromArray(s.value);break;case"v3":this.uniforms[n].value=new G().fromArray(s.value);break;case"v4":this.uniforms[n].value=new We().fromArray(s.value);break;case"m3":this.uniforms[n].value=new ce().fromArray(s.value);break;case"m4":this.uniforms[n].value=new Ge().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},vr=class extends Ve{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var Va=class extends $i{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Af,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Ha=class extends $i{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function rr(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function Xc(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var ji=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(r=s,s=e[++n],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(n=2,r=a);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}o=n,n=0;break e}break n}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=n[r+o];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Ga=class extends ji{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Yc,endingEnd:Yc}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case $c:r=t,a=2*e-n;break;case Zc:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=n}if(l===void 0)switch(this.getSettings_().endingEnd){case $c:o=t,l=2*n-e;break;case Zc:o=1,l=n+s[1]-s[0];break;default:o=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,f=this._offsetNext,u=this._weightPrev,d=this._weightNext,g=(n-e)/(s-e),M=g*g,x=M*g,p=-u*x+2*u*M-u*g,I=(1+u)*x+(-1.5-2*u)*M+(-.5+u)*g+1,U=(-1-d)*x+(1.5+d)*M+.5*g,E=d*x-d*M;for(let b=0;b!==a;++b)r[b]=p*o[h+b]+I*o[c+b]+U*o[l+b]+E*o[f+b];return r}},Wa=class extends ji{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(n-e)/(s-e),f=1-h;for(let u=0;u!==a;++u)r[u]=o[c+u]*f+o[l+u]*h;return r}},Xa=class extends ji{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},qa=class extends ji{interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this.inTangents,f=this.outTangents;if(!h||!f){let g=(n-e)/(s-e),M=1-g;for(let x=0;x!==a;++x)r[x]=o[c+x]*M+o[l+x]*g;return r}let u=a*2,d=t-1;for(let g=0;g!==a;++g){let M=o[c+g],x=o[l+g],p=d*u+g*2,I=f[p],U=f[p+1],E=t*u+g*2,b=h[E],A=h[E+1],L=Tm(n,e,I,b,s);r[g]=Vf(L,M,U,A,x)}return r}};function Vf(i,t,e,n,s){let r=1-i;return r*r*r*t+3*r*r*i*e+3*r*i*i*n+i*i*i*s}function wm(i,t,e,n,s){let r=1-i;return 3*r*r*(e-t)+6*r*i*(n-e)+3*i*i*(s-n)}function Tm(i,t,e,n,s){let r=(i-t)/(s-t);for(let o=0;o<8;o++){let a=Vf(r,t,e,n,s)-i;if(Math.abs(a)<1e-10)break;let l=wm(r,t,e,n,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var Un=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=rr(e,this.TimeBufferType),this.values=rr(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:rr(t.times,Array),values:rr(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s),Xc(t.settings)&&(n.settings={inTangents:rr(t.settings.inTangents,Array),outTangents:rr(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Xa(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Wa(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Ga(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new qa(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Zr:e=this.InterpolantFactoryMethodDiscrete;break;case Ua:e=this.InterpolantFactoryMethodLinear;break;case ba:e=this.InterpolantFactoryMethodSmooth;break;case qc:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return ie("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Zr;case this.InterpolantFactoryMethodLinear:return Ua;case this.InterpolantFactoryMethodSmooth:return ba;case this.InterpolantFactoryMethodBezier:return qc}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t;Xc(this.settings)&&(ju(this.settings.inTangents,t),ju(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,s=n.length,r=0,o=s-1;for(;r!==s&&n[r]<t;)++r;for(;o!==-1&&n[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(se("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(se("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=n[a];if(typeof l=="number"&&isNaN(l)){se("KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){se("KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&zp(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){se("KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===ba,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let f=a*n,u=f-n,d=f+n;for(let g=0;g!==n;++g){let M=e[f+g];if(M!==e[u+g]||M!==e[d+g]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let f=a*n,u=o*n;for(let d=0;d!==n;++d)e[u+d]=e[f+d]}++o}}if(r>0){t[o]=t[r];for(let a=r*n,l=o*n,c=0;c!==n;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,Xc(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function ju(i,t){for(let e=0,n=i.length;e!==n;e+=2)i[e]*=t}Un.prototype.ValueTypeName="";Un.prototype.TimeBufferType=Float32Array;Un.prototype.ValueBufferType=Float32Array;Un.prototype.DefaultInterpolation=Ua;var Qi=class extends Un{constructor(t,e,n){super(t,e,n)}};Qi.prototype.ValueTypeName="bool";Qi.prototype.ValueBufferType=Array;Qi.prototype.DefaultInterpolation=Zr;Qi.prototype.InterpolantFactoryMethodLinear=void 0;Qi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ya=class extends Un{constructor(t,e,n,s){super(t,e,n,s)}};Ya.prototype.ValueTypeName="color";var $a=class extends Un{constructor(t,e,n,s){super(t,e,n,s)}};$a.prototype.ValueTypeName="number";var Za=class extends ji{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(n-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)Dn.slerpFlat(r,0,o,c-a,o,c,l);return r}},co=class extends Un{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new Za(this.times,this.values,this.getValueSize(),t)}};co.prototype.ValueTypeName="quaternion";co.prototype.InterpolantFactoryMethodSmooth=void 0;var ts=class extends Un{constructor(t,e,n){super(t,e,n)}};ts.prototype.ValueTypeName="string";ts.prototype.ValueBufferType=Array;ts.prototype.DefaultInterpolation=Zr;ts.prototype.InterpolantFactoryMethodLinear=void 0;ts.prototype.InterpolantFactoryMethodSmooth=void 0;var Ka=class extends Un{constructor(t,e,n,s){super(t,e,n,s)}};Ka.prototype.ValueTypeName="vector";var Ta={enabled:!1,files:{},add:function(i,t){this.enabled!==!1&&(Qu(i)||(this.files[i]=t))},get:function(i){if(this.enabled!==!1&&!Qu(i))return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};function Qu(i){try{let t=i.slice(i.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch{return!1}}var Ja=class{constructor(t,e,n){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,f){return c.push(h,f),this},this.removeHandler=function(h){let f=c.indexOf(h);return f!==-1&&c.splice(f,2),this},this.getHandler=function(h){for(let f=0,u=c.length;f<u;f+=2){let d=c[f],g=c[f+1];if(d.global&&(d.lastIndex=0),d.test(h))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Hf=new Ja,yr=class{constructor(t){this.manager=t!==void 0?t:Hf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};yr.DEFAULT_MATERIAL_NAME="__DEFAULT";var or=new WeakMap,ja=class extends yr{constructor(t){super(t)}load(t,e,n,s){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let r=this,o=Ta.get(`image:${t}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0);else{let f=or.get(o);f===void 0&&(f=[],or.set(o,f)),f.push({onLoad:e,onError:s})}return o}let a=fr("img");function l(){h(),e&&e(this);let f=or.get(this)||[];for(let u=0;u<f.length;u++){let d=f[u];d.onLoad&&d.onLoad(this)}or.delete(this),r.manager.itemEnd(t)}function c(f){h(),s&&s(f),Ta.remove(`image:${t}`);let u=or.get(this)||[];for(let d=0;d<u.length;d++){let g=u[d];g.onError&&g.onError(f)}or.delete(this),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),Ta.add(`image:${t}`,a),r.manager.itemStart(t),a.src=t,a}};var ho=class extends yr{constructor(t){super(t)}load(t,e,n,s){let r=new mn,o=new ja(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,s),r}};var Ma=new G,Sa=new Dn,li=new G,uo=class extends Nn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ge,this.projectionMatrix=new Ge,this.projectionMatrixInverse=new Ge,this.coordinateSystem=jn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Ma,Sa,li),li.x===1&&li.y===1&&li.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ma,Sa,li.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(Ma,Sa,li),li.x===1&&li.y===1&&li.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ma,Sa,li.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Wi=new G,tf=new qt,ef=new qt,un=class extends uo{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=pr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Yr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return pr*2*Math.atan(Math.tan(Yr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Wi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Wi.x,Wi.y).multiplyScalar(-t/Wi.z),Wi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Wi.x,Wi.y).multiplyScalar(-t/Wi.z)}getViewSize(t,e){return this.getViewBounds(t,tf,ef),e.subVectors(ef,tf)}setViewOffset(t,e,n,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Yr*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var Cs=class extends uo{constructor(t=-1,e=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,o=n+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}};var fo=class extends gn{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){let t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}};var ar=-90,lr=1,Qa=class extends Nn{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new un(ar,lr,t,e);s.layers=this.layers,this.add(s);let r=new un(ar,lr,t,e);r.layers=this.layers,this.add(r);let o=new un(ar,lr,t,e);o.layers=this.layers,this.add(o);let a=new un(ar,lr,t,e);a.layers=this.layers,this.add(a);let l=new un(ar,lr,t,e);l.layers=this.layers,this.add(l);let c=new un(ar,lr,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===jn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===jr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let M=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let x=!1;t.isWebGLRenderer===!0?x=t.state.buffers.depth.getReversed():x=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),x&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,s),x&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,s),x&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,s),x&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,s),x&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=M,t.setRenderTarget(n,5,s),x&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(f,u,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},tl=class extends un{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}},po=class{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=Am.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}};function Am(){this._document.hidden===!1&&this.reset()}var yh="\\[\\]\\.:\\/",Em=new RegExp("["+yh+"]","g"),Mh="[^"+yh+"]",Cm="[^"+yh.replace("\\.","")+"]",Rm=/((?:WC+[\/:])*)/.source.replace("WC",Mh),Pm=/(WCOD+)?/.source.replace("WCOD",Cm),Im=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Mh),Lm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Mh),Dm=new RegExp("^"+Rm+Pm+Im+Lm+"$"),Nm=["material","materials","bones","map"],Jc=class{constructor(t,e,n){let s=n||Oe.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},Oe=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Em,"")}static parseTrackName(t){let e=Dm.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);Nm.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=n(a.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){ie("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){se("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){se("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){se("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){se("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){se("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){se("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){se("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;se("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){se("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){se("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};Oe.Composite=Jc;Oe.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Oe.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Oe.prototype.GetterByBindingType=[Oe.prototype._getValue_direct,Oe.prototype._getValue_array,Oe.prototype._getValue_arrayElement,Oe.prototype._getValue_toArray];Oe.prototype.SetterByBindingTypeAndVersioning=[[Oe.prototype._setValue_direct,Oe.prototype._setValue_direct_setNeedsUpdate,Oe.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Oe.prototype._setValue_array,Oe.prototype._setValue_array_setNeedsUpdate,Oe.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Oe.prototype._setValue_arrayElement,Oe.prototype._setValue_arrayElement_setNeedsUpdate,Oe.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Oe.prototype._setValue_fromArray,Oe.prototype._setValue_fromArray_setNeedsUpdate,Oe.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var HM=new Float32Array(1);var nf=new Ge,Rs=class{constructor(t,e,n=0,s=1/0){this.ray=new Zi(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new gr,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):se("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return nf.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(nf),this}intersectObject(t,e=!0,n=[]){return jc(t,this,n,e),n.sort(sf),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)jc(t[s],this,n,e);return n.sort(sf),n}};function sf(i,t){return i.distance-t.distance}function jc(i,t,e,n){let s=!0;if(i.layers.test(t.layers)&&i.raycast(t,e)===!1&&(s=!1),s===!0&&n===!0){let r=i.children;for(let o=0,a=r.length;o<a;o++)jc(r[o],t,e,!0)}}var ui=class{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=_e(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(_e(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var Eh=class Eh{constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=n,r[3]=s,this}};Eh.prototype.isMatrix2=!0;var Qc=Eh;var mo=class extends Qn{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}};function Sh(i,t,e,n){let s=Um(n);switch(e){case hh:return i*t;case fh:return i*t/s.components*s.byteLength;case cl:return i*t/s.components*s.byteLength;case rs:return i*t*2/s.components*s.byteLength;case hl:return i*t*2/s.components*s.byteLength;case uh:return i*t*3/s.components*s.byteLength;case xn:return i*t*4/s.components*s.byteLength;case ul:return i*t*4/s.components*s.byteLength;case To:case Ao:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Eo:case Co:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case dl:case ml:return Math.max(i,16)*Math.max(t,8)/4;case fl:case pl:return Math.max(i,8)*Math.max(t,8)/2;case gl:case xl:case vl:case yl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case _l:case Ro:case Ml:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Sl:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case bl:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case wl:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Tl:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Al:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case El:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Cl:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case Rl:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case Pl:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Il:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Ll:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Dl:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Nl:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case Ul:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case Fl:case Ol:case Bl:return Math.ceil(i/4)*Math.ceil(t/4)*16;case kl:case zl:return Math.ceil(i/4)*Math.ceil(t/4)*8;case Po:case Vl:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Um(i){switch(i){case Fn:case oh:return{byteLength:1,components:1};case Tr:case ah:case Je:return{byteLength:2,components:1};case al:case ll:return{byteLength:2,components:4};case ni:case ol:case ii:return{byteLength:4,components:1};case lh:case ch:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?ie("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function hd(){let i=null,t=!1,e=null,n=null;function s(r,o){n=i.requestAnimationFrame(s),e(r,o)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Om(i){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,f=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,h),a.onUploadCallback();let d;if(c instanceof Float32Array)d=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=i.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=i.HALF_FLOAT:d=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=i.SHORT;else if(c instanceof Uint32Array)d=i.UNSIGNED_INT;else if(c instanceof Int32Array)d=i.INT;else if(c instanceof Int8Array)d=i.BYTE;else if(c instanceof Uint8Array)d=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:f}}function n(a,l,c){let h=l.array,f=l.updateRanges;if(i.bindBuffer(c,a),f.length===0)i.bufferSubData(c,0,h);else{f.sort((d,g)=>d.start-g.start);let u=0;for(let d=1;d<f.length;d++){let g=f[u],M=f[d];M.start<=g.start+g.count+1?g.count=Math.max(g.count,M.start+M.count-g.start):(++u,f[u]=M)}f.length=u+1;for(let d=0,g=f.length;d<g;d++){let M=f[d];i.bufferSubData(c,M.start*h.BYTES_PER_ELEMENT,h,M.start,M.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(i.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Bm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,km=`#ifdef USE_ALPHAHASH
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
#endif`,zm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Vm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Hm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Gm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Wm=`#ifdef USE_AOMAP
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
#endif`,Xm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,qm=`#ifdef USE_BATCHING
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
#endif`,Ym=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,$m=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Zm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Km=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Jm=`#ifdef USE_IRIDESCENCE
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
#endif`,jm=`#ifdef USE_BUMPMAP
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
#endif`,Qm=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,t0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,e0=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,n0=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,i0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,s0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,r0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,o0=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,a0=`#define PI 3.141592653589793
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
} // validated`,l0=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,c0=`vec3 transformedNormal = objectNormal;
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
#endif`,h0=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,u0=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,f0=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,d0=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,p0="gl_FragColor = linearToOutputTexel( gl_FragColor );",m0=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,g0=`#ifdef USE_ENVMAP
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
#endif`,x0=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,_0=`#ifdef USE_ENVMAP
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
#endif`,v0=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,y0=`#ifdef USE_ENVMAP
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
#endif`,M0=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,S0=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,b0=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,w0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,T0=`#ifdef USE_GRADIENTMAP
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
}`,A0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,E0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,C0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,R0=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,P0=`#ifdef USE_ENVMAP
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
#endif`,I0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,L0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,D0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,N0=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,U0=`PhysicalMaterial material;
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
#endif`,F0=`uniform sampler2D dfgLUT;
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
}`,O0=`
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
#endif`,B0=`#if defined( RE_IndirectDiffuse )
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
#endif`,k0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,z0=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,V0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,H0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,G0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,W0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,X0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,q0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Y0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,$0=`#if defined( USE_POINTS_UV )
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
#endif`,Z0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,K0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,J0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,j0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Q0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,tg=`#ifdef USE_MORPHTARGETS
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
#endif`,eg=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ng=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,ig=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,sg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,rg=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,og=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,ag=`#ifdef USE_NORMALMAP
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
#endif`,lg=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,cg=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,hg=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ug=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,fg=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,dg=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,pg=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,mg=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,gg=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,xg=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,_g=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,vg=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,yg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Mg=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Sg=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,bg=`float getShadowMask() {
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
}`,wg=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Tg=`#ifdef USE_SKINNING
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
#endif`,Ag=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Eg=`#ifdef USE_SKINNING
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
#endif`,Cg=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Rg=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Pg=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Ig=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Lg=`#ifdef USE_TRANSMISSION
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
#endif`,Dg=`#ifdef USE_TRANSMISSION
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
#endif`,Ng=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Ug=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Fg=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Og=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Bg=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,kg=`uniform sampler2D t2D;
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
}`,zg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Vg=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Hg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Gg=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wg=`#include <common>
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
}`,Xg=`#if DEPTH_PACKING == 3200
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
}`,qg=`#define DISTANCE
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
}`,Yg=`#define DISTANCE
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
}`,$g=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Zg=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kg=`uniform float scale;
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
}`,Jg=`uniform vec3 diffuse;
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
}`,jg=`#include <common>
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
}`,Qg=`uniform vec3 diffuse;
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
}`,tx=`#define LAMBERT
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
}`,ex=`#define LAMBERT
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
}`,nx=`#define MATCAP
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
}`,ix=`#define MATCAP
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
}`,sx=`#define NORMAL
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
}`,rx=`#define NORMAL
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
}`,ox=`#define PHONG
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
}`,ax=`#define PHONG
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
}`,lx=`#define STANDARD
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
}`,cx=`#define STANDARD
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
}`,hx=`#define TOON
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
}`,ux=`#define TOON
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
}`,fx=`uniform float size;
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
}`,dx=`uniform vec3 diffuse;
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
}`,px=`#include <common>
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
}`,mx=`uniform vec3 color;
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
}`,gx=`uniform float rotation;
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
}`,xx=`uniform vec3 diffuse;
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
}`,de={alphahash_fragment:Bm,alphahash_pars_fragment:km,alphamap_fragment:zm,alphamap_pars_fragment:Vm,alphatest_fragment:Hm,alphatest_pars_fragment:Gm,aomap_fragment:Wm,aomap_pars_fragment:Xm,batching_pars_vertex:qm,batching_vertex:Ym,begin_vertex:$m,beginnormal_vertex:Zm,bsdfs:Km,iridescence_fragment:Jm,bumpmap_pars_fragment:jm,clipping_planes_fragment:Qm,clipping_planes_pars_fragment:t0,clipping_planes_pars_vertex:e0,clipping_planes_vertex:n0,color_fragment:i0,color_pars_fragment:s0,color_pars_vertex:r0,color_vertex:o0,common:a0,cube_uv_reflection_fragment:l0,defaultnormal_vertex:c0,displacementmap_pars_vertex:h0,displacementmap_vertex:u0,emissivemap_fragment:f0,emissivemap_pars_fragment:d0,colorspace_fragment:p0,colorspace_pars_fragment:m0,envmap_fragment:g0,envmap_common_pars_fragment:x0,envmap_pars_fragment:_0,envmap_pars_vertex:v0,envmap_physical_pars_fragment:P0,envmap_vertex:y0,fog_vertex:M0,fog_pars_vertex:S0,fog_fragment:b0,fog_pars_fragment:w0,gradientmap_pars_fragment:T0,lightmap_pars_fragment:A0,lights_lambert_fragment:E0,lights_lambert_pars_fragment:C0,lights_pars_begin:R0,lights_toon_fragment:I0,lights_toon_pars_fragment:L0,lights_phong_fragment:D0,lights_phong_pars_fragment:N0,lights_physical_fragment:U0,lights_physical_pars_fragment:F0,lights_fragment_begin:O0,lights_fragment_maps:B0,lights_fragment_end:k0,lightprobes_pars_fragment:z0,logdepthbuf_fragment:V0,logdepthbuf_pars_fragment:H0,logdepthbuf_pars_vertex:G0,logdepthbuf_vertex:W0,map_fragment:X0,map_pars_fragment:q0,map_particle_fragment:Y0,map_particle_pars_fragment:$0,metalnessmap_fragment:Z0,metalnessmap_pars_fragment:K0,morphinstance_vertex:J0,morphcolor_vertex:j0,morphnormal_vertex:Q0,morphtarget_pars_vertex:tg,morphtarget_vertex:eg,normal_fragment_begin:ng,normal_fragment_maps:ig,normal_pars_fragment:sg,normal_pars_vertex:rg,normal_vertex:og,normalmap_pars_fragment:ag,clearcoat_normal_fragment_begin:lg,clearcoat_normal_fragment_maps:cg,clearcoat_pars_fragment:hg,iridescence_pars_fragment:ug,opaque_fragment:fg,packing:dg,premultiplied_alpha_fragment:pg,project_vertex:mg,dithering_fragment:gg,dithering_pars_fragment:xg,roughnessmap_fragment:_g,roughnessmap_pars_fragment:vg,shadowmap_pars_fragment:yg,shadowmap_pars_vertex:Mg,shadowmap_vertex:Sg,shadowmask_pars_fragment:bg,skinbase_vertex:wg,skinning_pars_vertex:Tg,skinning_vertex:Ag,skinnormal_vertex:Eg,specularmap_fragment:Cg,specularmap_pars_fragment:Rg,tonemapping_fragment:Pg,tonemapping_pars_fragment:Ig,transmission_fragment:Lg,transmission_pars_fragment:Dg,uv_pars_fragment:Ng,uv_pars_vertex:Ug,uv_vertex:Fg,worldpos_vertex:Og,background_vert:Bg,background_frag:kg,backgroundCube_vert:zg,backgroundCube_frag:Vg,cube_vert:Hg,cube_frag:Gg,depth_vert:Wg,depth_frag:Xg,distance_vert:qg,distance_frag:Yg,equirect_vert:$g,equirect_frag:Zg,linedashed_vert:Kg,linedashed_frag:Jg,meshbasic_vert:jg,meshbasic_frag:Qg,meshlambert_vert:tx,meshlambert_frag:ex,meshmatcap_vert:nx,meshmatcap_frag:ix,meshnormal_vert:sx,meshnormal_frag:rx,meshphong_vert:ox,meshphong_frag:ax,meshphysical_vert:lx,meshphysical_frag:cx,meshtoon_vert:hx,meshtoon_frag:ux,points_vert:fx,points_frag:dx,shadow_vert:px,shadow_frag:mx,sprite_vert:gx,sprite_frag:xx},It={common:{diffuse:{value:new ue(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ce},alphaMap:{value:null},alphaMapTransform:{value:new ce},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ce}},envmap:{envMap:{value:null},envMapRotation:{value:new ce},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ce}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ce}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ce},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ce},normalScale:{value:new qt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ce},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ce}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ce}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ce}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ue(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new G},probesMax:{value:new G},probesResolution:{value:new G}},points:{diffuse:{value:new ue(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ce},alphaTest:{value:0},uvTransform:{value:new ce}},sprite:{diffuse:{value:new ue(16777215)},opacity:{value:1},center:{value:new qt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ce},alphaMap:{value:null},alphaMapTransform:{value:new ce},alphaTest:{value:0}}},mi={basic:{uniforms:_n([It.common,It.specularmap,It.envmap,It.aomap,It.lightmap,It.fog]),vertexShader:de.meshbasic_vert,fragmentShader:de.meshbasic_frag},lambert:{uniforms:_n([It.common,It.specularmap,It.envmap,It.aomap,It.lightmap,It.emissivemap,It.bumpmap,It.normalmap,It.displacementmap,It.fog,It.lights,{emissive:{value:new ue(0)},envMapIntensity:{value:1}}]),vertexShader:de.meshlambert_vert,fragmentShader:de.meshlambert_frag},phong:{uniforms:_n([It.common,It.specularmap,It.envmap,It.aomap,It.lightmap,It.emissivemap,It.bumpmap,It.normalmap,It.displacementmap,It.fog,It.lights,{emissive:{value:new ue(0)},specular:{value:new ue(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:de.meshphong_vert,fragmentShader:de.meshphong_frag},standard:{uniforms:_n([It.common,It.envmap,It.aomap,It.lightmap,It.emissivemap,It.bumpmap,It.normalmap,It.displacementmap,It.roughnessmap,It.metalnessmap,It.fog,It.lights,{emissive:{value:new ue(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:de.meshphysical_vert,fragmentShader:de.meshphysical_frag},toon:{uniforms:_n([It.common,It.aomap,It.lightmap,It.emissivemap,It.bumpmap,It.normalmap,It.displacementmap,It.gradientmap,It.fog,It.lights,{emissive:{value:new ue(0)}}]),vertexShader:de.meshtoon_vert,fragmentShader:de.meshtoon_frag},matcap:{uniforms:_n([It.common,It.bumpmap,It.normalmap,It.displacementmap,It.fog,{matcap:{value:null}}]),vertexShader:de.meshmatcap_vert,fragmentShader:de.meshmatcap_frag},points:{uniforms:_n([It.points,It.fog]),vertexShader:de.points_vert,fragmentShader:de.points_frag},dashed:{uniforms:_n([It.common,It.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:de.linedashed_vert,fragmentShader:de.linedashed_frag},depth:{uniforms:_n([It.common,It.displacementmap]),vertexShader:de.depth_vert,fragmentShader:de.depth_frag},normal:{uniforms:_n([It.common,It.bumpmap,It.normalmap,It.displacementmap,{opacity:{value:1}}]),vertexShader:de.meshnormal_vert,fragmentShader:de.meshnormal_frag},sprite:{uniforms:_n([It.sprite,It.fog]),vertexShader:de.sprite_vert,fragmentShader:de.sprite_frag},background:{uniforms:{uvTransform:{value:new ce},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:de.background_vert,fragmentShader:de.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ce}},vertexShader:de.backgroundCube_vert,fragmentShader:de.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:de.cube_vert,fragmentShader:de.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:de.equirect_vert,fragmentShader:de.equirect_frag},distance:{uniforms:_n([It.common,It.displacementmap,{referencePosition:{value:new G},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:de.distance_vert,fragmentShader:de.distance_frag},shadow:{uniforms:_n([It.lights,It.fog,{color:{value:new ue(0)},opacity:{value:1}}]),vertexShader:de.shadow_vert,fragmentShader:de.shadow_frag}};mi.physical={uniforms:_n([mi.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ce},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ce},clearcoatNormalScale:{value:new qt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ce},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ce},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ce},sheen:{value:0},sheenColor:{value:new ue(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ce},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ce},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ce},transmissionSamplerSize:{value:new qt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ce},attenuationDistance:{value:0},attenuationColor:{value:new ue(0)},specularColor:{value:new ue(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ce},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ce},anisotropyVector:{value:new qt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ce}}]),vertexShader:de.meshphysical_vert,fragmentShader:de.meshphysical_frag};var Wl={r:0,b:0,g:0},_x=new Ge,ud=new ce;ud.set(-1,0,0,0,1,0,0,0,1);function vx(i,t,e,n,s,r){let o=new ue(0),a=s===!0?0:1,l,c,h=null,f=0,u=null;function d(I){let U=I.isScene===!0?I.background:null;if(U&&U.isTexture){let E=I.backgroundBlurriness>0;U=t.get(U,E)}return U}function g(I){let U=!1,E=d(I);E===null?x(o,a):E&&E.isColor&&(x(E,1),U=!0);let b=i.xr.getEnvironmentBlendMode();b==="additive"?e.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(i.autoClear||U)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function M(I,U){let E=d(U);E&&(E.isCubeTexture||E.mapping===bo)?(c===void 0&&(c=new ze(new _r(1,1,1),new Ve({name:"BackgroundCubeMaterial",uniforms:Ns(mi.backgroundCube.uniforms),vertexShader:mi.backgroundCube.vertexShader,fragmentShader:mi.backgroundCube.fragmentShader,side:bn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,A,L){this.matrixWorld.copyPosition(L.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=E,c.material.uniforms.backgroundBlurriness.value=U.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=U.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(_x.makeRotationFromEuler(U.backgroundRotation)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(ud),c.material.toneMapped=xe.getTransfer(E.colorSpace)!==Ae,(h!==E||f!==E.version||u!==i.toneMapping)&&(c.material.needsUpdate=!0,h=E,f=E.version,u=i.toneMapping),c.layers.enableAll(),I.unshift(c,c.geometry,c.material,0,0,null)):E&&E.isTexture&&(l===void 0&&(l=new ze(new Ci(2,2),new Ve({name:"BackgroundMaterial",uniforms:Ns(mi.background.uniforms),vertexShader:mi.background.vertexShader,fragmentShader:mi.background.fragmentShader,side:es,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=E,l.material.uniforms.backgroundIntensity.value=U.backgroundIntensity,l.material.toneMapped=xe.getTransfer(E.colorSpace)!==Ae,E.matrixAutoUpdate===!0&&E.updateMatrix(),l.material.uniforms.uvTransform.value.copy(E.matrix),(h!==E||f!==E.version||u!==i.toneMapping)&&(l.material.needsUpdate=!0,h=E,f=E.version,u=i.toneMapping),l.layers.enableAll(),I.unshift(l,l.geometry,l.material,0,0,null))}function x(I,U){I.getRGB(Wl,vh(i)),e.buffers.color.setClear(Wl.r,Wl.g,Wl.b,U,r)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(I,U=1){o.set(I),a=U,x(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(I){a=I,x(o,a)},render:g,addToRenderList:M,dispose:p}}function yx(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null),r=s,o=!1;function a(F,O,Y,z,j){let ht=!1,ct=f(F,z,Y,O);r!==ct&&(r=ct,c(r.object)),ht=d(F,z,Y,j),ht&&g(F,z,Y,j),j!==null&&t.update(j,i.ELEMENT_ARRAY_BUFFER),(ht||o)&&(o=!1,E(F,O,Y,z),j!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(j).buffer))}function l(){return i.createVertexArray()}function c(F){return i.bindVertexArray(F)}function h(F){return i.deleteVertexArray(F)}function f(F,O,Y,z){let j=z.wireframe===!0,ht=n[O.id];ht===void 0&&(ht={},n[O.id]=ht);let ct=F.isInstancedMesh===!0?F.id:0,gt=ht[ct];gt===void 0&&(gt={},ht[ct]=gt);let ot=gt[Y.id];ot===void 0&&(ot={},gt[Y.id]=ot);let dt=ot[j];return dt===void 0&&(dt=u(l()),ot[j]=dt),dt}function u(F){let O=[],Y=[],z=[];for(let j=0;j<e;j++)O[j]=0,Y[j]=0,z[j]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:Y,attributeDivisors:z,object:F,attributes:{},index:null}}function d(F,O,Y,z){let j=r.attributes,ht=O.attributes,ct=0,gt=Y.getAttributes();for(let ot in gt)if(gt[ot].location>=0){let xt=j[ot],Zt=ht[ot];if(Zt===void 0&&(ot==="instanceMatrix"&&F.instanceMatrix&&(Zt=F.instanceMatrix),ot==="instanceColor"&&F.instanceColor&&(Zt=F.instanceColor)),xt===void 0||xt.attribute!==Zt||Zt&&xt.data!==Zt.data)return!0;ct++}return r.attributesNum!==ct||r.index!==z}function g(F,O,Y,z){let j={},ht=O.attributes,ct=0,gt=Y.getAttributes();for(let ot in gt)if(gt[ot].location>=0){let xt=ht[ot];xt===void 0&&(ot==="instanceMatrix"&&F.instanceMatrix&&(xt=F.instanceMatrix),ot==="instanceColor"&&F.instanceColor&&(xt=F.instanceColor));let Zt={};Zt.attribute=xt,xt&&xt.data&&(Zt.data=xt.data),j[ot]=Zt,ct++}r.attributes=j,r.attributesNum=ct,r.index=z}function M(){let F=r.newAttributes;for(let O=0,Y=F.length;O<Y;O++)F[O]=0}function x(F){p(F,0)}function p(F,O){let Y=r.newAttributes,z=r.enabledAttributes,j=r.attributeDivisors;Y[F]=1,z[F]===0&&(i.enableVertexAttribArray(F),z[F]=1),j[F]!==O&&(i.vertexAttribDivisor(F,O),j[F]=O)}function I(){let F=r.newAttributes,O=r.enabledAttributes;for(let Y=0,z=O.length;Y<z;Y++)O[Y]!==F[Y]&&(i.disableVertexAttribArray(Y),O[Y]=0)}function U(F,O,Y,z,j,ht,ct){ct===!0?i.vertexAttribIPointer(F,O,Y,j,ht):i.vertexAttribPointer(F,O,Y,z,j,ht)}function E(F,O,Y,z){M();let j=z.attributes,ht=Y.getAttributes(),ct=O.defaultAttributeValues;for(let gt in ht){let ot=ht[gt];if(ot.location>=0){let dt=j[gt];if(dt===void 0&&(gt==="instanceMatrix"&&F.instanceMatrix&&(dt=F.instanceMatrix),gt==="instanceColor"&&F.instanceColor&&(dt=F.instanceColor)),dt!==void 0){let xt=dt.normalized,Zt=dt.itemSize,Xt=t.get(dt);if(Xt===void 0)continue;let Ee=Xt.buffer,pe=Xt.type,Me=Xt.bytesPerElement,W=pe===i.INT||pe===i.UNSIGNED_INT||dt.gpuType===ol;if(dt.isInterleavedBufferAttribute){let et=dt.data,St=et.stride,vt=dt.offset;if(et.isInstancedInterleavedBuffer){for(let yt=0;yt<ot.locationSize;yt++)p(ot.location+yt,et.meshPerAttribute);F.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=et.meshPerAttribute*et.count)}else for(let yt=0;yt<ot.locationSize;yt++)x(ot.location+yt);i.bindBuffer(i.ARRAY_BUFFER,Ee);for(let yt=0;yt<ot.locationSize;yt++)U(ot.location+yt,Zt/ot.locationSize,pe,xt,St*Me,(vt+Zt/ot.locationSize*yt)*Me,W)}else{if(dt.isInstancedBufferAttribute){for(let et=0;et<ot.locationSize;et++)p(ot.location+et,dt.meshPerAttribute);F.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=dt.meshPerAttribute*dt.count)}else for(let et=0;et<ot.locationSize;et++)x(ot.location+et);i.bindBuffer(i.ARRAY_BUFFER,Ee);for(let et=0;et<ot.locationSize;et++)U(ot.location+et,Zt/ot.locationSize,pe,xt,Zt*Me,Zt/ot.locationSize*et*Me,W)}}else if(ct!==void 0){let xt=ct[gt];if(xt!==void 0)switch(xt.length){case 2:i.vertexAttrib2fv(ot.location,xt);break;case 3:i.vertexAttrib3fv(ot.location,xt);break;case 4:i.vertexAttrib4fv(ot.location,xt);break;default:i.vertexAttrib1fv(ot.location,xt)}}}}I()}function b(){P();for(let F in n){let O=n[F];for(let Y in O){let z=O[Y];for(let j in z){let ht=z[j];for(let ct in ht)h(ht[ct].object),delete ht[ct];delete z[j]}}delete n[F]}}function A(F){if(n[F.id]===void 0)return;let O=n[F.id];for(let Y in O){let z=O[Y];for(let j in z){let ht=z[j];for(let ct in ht)h(ht[ct].object),delete ht[ct];delete z[j]}}delete n[F.id]}function L(F){for(let O in n){let Y=n[O];for(let z in Y){let j=Y[z];if(j[F.id]===void 0)continue;let ht=j[F.id];for(let ct in ht)h(ht[ct].object),delete ht[ct];delete j[F.id]}}}function v(F){for(let O in n){let Y=n[O],z=F.isInstancedMesh===!0?F.id:0,j=Y[z];if(j!==void 0){for(let ht in j){let ct=j[ht];for(let gt in ct)h(ct[gt].object),delete ct[gt];delete j[ht]}delete Y[z],Object.keys(Y).length===0&&delete n[O]}}}function P(){N(),o=!0,r!==s&&(r=s,c(r.object))}function N(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:P,resetDefaultState:N,dispose:b,releaseStatesOfGeometry:A,releaseStatesOfObject:v,releaseStatesOfProgram:L,initAttributes:M,enableAttribute:x,disableUnusedAttributes:I}}function Mx(i,t,e){let n;function s(l){n=l}function r(l,c){i.drawArrays(n,l,c),e.update(c,n,1)}function o(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function a(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let d=0;d<h;d++)u+=c[d];e.update(u,n,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function Sx(i,t,e,n){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let L=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(L.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(L){return!(L!==xn&&n.convert(L)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(L){let v=L===Je&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(L!==Fn&&L!==ii&&!v&&n.convert(L)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(L){if(L==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";L="mediump"}return L==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(ie("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let f=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&ie("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),M=i.getParameter(i.MAX_TEXTURE_SIZE),x=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),p=i.getParameter(i.MAX_VERTEX_ATTRIBS),I=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),U=i.getParameter(i.MAX_VARYING_VECTORS),E=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),b=i.getParameter(i.MAX_SAMPLES),A=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:g,maxTextureSize:M,maxCubemapSize:x,maxAttributes:p,maxVertexUniforms:I,maxVaryings:U,maxFragmentUniforms:E,maxSamples:b,samples:A}}function bx(i){let t=this,e=null,n=0,s=!1,r=!1,o=new hn,a=new ce,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){let d=f.length!==0||u||n!==0||s;return s=u,n=f.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,u){e=h(f,u,0)},this.setState=function(f,u,d){let g=f.clippingPlanes,M=f.clipIntersection,x=f.clipShadows,p=i.get(f);if(!s||g===null||g.length===0||r&&!x)r?h(null):c();else{let I=r?0:n,U=I*4,E=p.clippingState||null;l.value=E,E=h(g,u,U,d);for(let b=0;b!==U;++b)E[b]=e[b];p.clippingState=E,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=I}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,u,d,g){let M=f!==null?f.length:0,x=null;if(M!==0){if(x=l.value,g!==!0||x===null){let p=d+M*4,I=u.matrixWorldInverse;a.getNormalMatrix(I),(x===null||x.length<p)&&(x=new Float32Array(p));for(let U=0,E=d;U!==M;++U,E+=4)o.copy(f[U]).applyMatrix4(I,a),o.normal.toArray(x,E),x[E+3]=o.constant}l.value=x,l.needsUpdate=!0}return t.numPlanes=M,t.numIntersection=0,x}}var Rr=4,wx=6,Tx=20,Ax=256,Io=new Cs,Gf=new ue,Ch=null,Rh=0,Ph=0,Ih=!1,Ex=new G,Us=new G,ql=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,s=100,r={}){let{size:o=256,position:a=Ex}=r;Ch=this._renderer.getRenderTarget(),Rh=this._renderer.getActiveCubeFace(),Ph=this._renderer.getActiveMipmapLevel(),Ih=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=qf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Xf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Ch,Rh,Ph),this._renderer.xr.enabled=Ih,t.scissorTest=!1,Cr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ns||t.mapping===Ds?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ch=this._renderer.getRenderTarget(),Rh=this._renderer.getActiveCubeFace(),Ph=this._renderer.getActiveMipmapLevel(),Ih=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:qe,minFilter:qe,generateMipmaps:!1,type:Je,format:xn,colorSpace:Kr,depthBuffer:!1},s=Wf(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Wf(t,e,n);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Cx(r)),this._blurMaterial=Px(r,t,e),this._ggxMaterial=Rx(r,t,e)}return s}_compileMaterial(t){let e=new ze(new gn,t);this._renderer.compile(e,Io)}_sceneToCubeUV(t,e,n,s,r){let l=new un(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,u=f.autoClear,d=f.toneMapping;f.getClearColor(Gf),f.toneMapping=ei,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ze(new _r,new Es({name:"PMREM.Background",side:bn,depthWrite:!1,depthTest:!1})));let M=this._backgroundBox,x=M.material,p=!1,I=t.background;I?I.isColor&&(x.color.copy(I),t.background=null,p=!0):(x.color.copy(Gf),p=!0);for(let U=0;U<6;U++){let E=U%3;E===0?(l.up.set(0,c[U],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[U],r.y,r.z)):E===1?(l.up.set(0,0,c[U]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[U],r.z)):(l.up.set(0,c[U],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[U]));let b=this._cubeSize;Cr(s,E*b,U>2?b:0,b,b),f.setRenderTarget(s),p&&f.render(M,l),f.render(t,l)}f.toneMapping=d,f.autoClear=u,t.background=I}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===ns||t.mapping===Ds;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=qf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Xf());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Cr(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Io)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=n}_applyGGXFilter(t,e,n){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;let l=o.uniforms,c=n/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),f=Math.sqrt(c*c-h*h),u=c*1.25,d=f*u,{_lodMax:g}=this,M=this._sizeLods[n],x=3*M*(n>g-Rr?n-g+Rr:0),p=4*(this._cubeSize-M);l.envMap.value=t.texture,l.roughness.value=d,l.mipInt.value=g-e,Cr(r,x,p,3*M,2*M),s.setRenderTarget(r),s.render(a,Io),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,Cr(t,x,p,3*M,2*M),s.setRenderTarget(t),s.render(a,Io)}_blur(t,e,n,s){let r=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,n,o),this._blurPass(r,t,n,n,o)}_blurPass(t,e,n,s,r){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[s];l.material=a;let c=a.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;let h=this._sizeLods[s],f=3*h*(s>this._lodMax-Rr?s-this._lodMax+Rr:0),u=4*(this._cubeSize-h);Cr(e,f,u,3*h,2*h),o.setRenderTarget(e),o.render(l,Io)}};function Cx(i){let t=[],e=[],n=i,s=i-Rr+1+wx;for(let r=0;r<s;r++){let o=Math.pow(2,n);t.push(o);let a=1/(o-2),l=-a,c=1+a,h=[l,l,c,l,c,c,l,l,c,c,l,c],f=6,u=6,d=3,g=new Float32Array(d*u*f),M=new Float32Array(d*u*f);for(let p=0;p<f;p++){let I=p%3*2/3-1,U=p>2?0:-1,E=[I,U,0,I+2/3,U,0,I+2/3,U+1,0,I,U,0,I+2/3,U+1,0,I,U+1,0];g.set(E,d*u*p);for(let b=0;b<u;b++){let A=h[b*2]*2-1,L=h[b*2+1]*2-1;p===0?Us.set(1,L,A):p===1?Us.set(-A,1,-L):p===2?Us.set(-A,L,1):p===3?Us.set(-1,L,-A):p===4?Us.set(-A,-1,L):Us.set(A,L,-1),Us.toArray(M,(p*u+b)*d)}}let x=new gn;x.setAttribute("position",new rn(g,d)),x.setAttribute("outputDirection",new rn(M,d)),e.push(new ze(x,null)),n>Rr&&n--}return{lodMeshes:e,sizeLods:t}}function Wf(i,t,e){let n=new Ye(i,t,e);return n.texture.mapping=bo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Cr(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function Rx(i,t,e){return new Ve({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Ax,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Zl(),fragmentShader:`

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
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function Px(i,t,e){return new Ve({name:"SphericalGaussianBlur",defines:{SAMPLES:Tx,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Zl(),fragmentShader:`

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
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function Xf(){return new Ve({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Zl(),fragmentShader:`

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
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function qf(){return new Ve({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Zl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Wn,depthTest:!1,depthWrite:!1})}function Zl(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Yl=class extends Ye{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new oo(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new _r(5,5,5),r=new Ve({name:"CubemapFromEquirect",uniforms:Ns(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:bn,blending:Wn});r.uniforms.tEquirect.value=e;let o=new ze(s,r),a=e.minFilter;return e.minFilter===is&&(e.minFilter=qe),new Qa(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,s);t.setRenderTarget(r)}};function Ix(i){let t=new WeakMap,e=new WeakMap,n=null;function s(u,d=!1){return u==null?null:d?o(u):r(u)}function r(u){if(u&&u.isTexture){let d=u.mapping;if(d===il||d===sl)if(t.has(u)){let g=t.get(u).texture;return a(g,u.mapping)}else{let g=u.image;if(g&&g.height>0){let M=new Yl(g.height);return M.fromEquirectangularTexture(i,u),t.set(u,M),u.addEventListener("dispose",c),a(M.texture,u.mapping)}else return null}}return u}function o(u){if(u&&u.isTexture){let d=u.mapping,g=d===il||d===sl,M=d===ns||d===Ds;if(g||M){let x=e.get(u),p=x!==void 0?x.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==p)return n===null&&(n=new ql(i)),x=g?n.fromEquirectangular(u,x):n.fromCubemap(u,x),x.texture.pmremVersion=u.pmremVersion,e.set(u,x),x.texture;if(x!==void 0)return x.texture;{let I=u.image;return g&&I&&I.height>0||M&&I&&l(I)?(n===null&&(n=new ql(i)),x=g?n.fromEquirectangular(u):n.fromCubemap(u),x.texture.pmremVersion=u.pmremVersion,e.set(u,x),u.addEventListener("dispose",h),x.texture):null}}}return u}function a(u,d){return d===il?u.mapping=ns:d===sl&&(u.mapping=Ds),u}function l(u){let d=0,g=6;for(let M=0;M<g;M++)u[M]!==void 0&&d++;return d===g}function c(u){let d=u.target;d.removeEventListener("dispose",c);let g=t.get(d);g!==void 0&&(t.delete(d),g.dispose())}function h(u){let d=u.target;d.removeEventListener("dispose",h);let g=e.get(d);g!==void 0&&(e.delete(d),g.dispose())}function f(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:f}}function Lx(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&Ts("WebGLRenderer: "+n+" extension not supported."),s}}}function Dx(i,t,e,n){let s={},r=new WeakMap;function o(f){let u=f.target;u.index!==null&&t.remove(u.index);for(let g in u.attributes)t.remove(u.attributes[g]);u.removeEventListener("dispose",o),delete s[u.id];let d=r.get(u);d&&(t.remove(d),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(f,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,e.memory.geometries++),u}function l(f){let u=f.attributes;for(let d in u)t.update(u[d],i.ARRAY_BUFFER)}function c(f){let u=[],d=f.index,g=f.attributes.position,M=0;if(g===void 0)return;if(d!==null){let I=d.array;M=d.version;for(let U=0,E=I.length;U<E;U+=3){let b=I[U+0],A=I[U+1],L=I[U+2];u.push(b,A,A,L,L,b)}}else{let I=g.array;M=g.version;for(let U=0,E=I.length/3-1;U<E;U+=3){let b=U+0,A=U+1,L=U+2;u.push(b,A,A,L,L,b)}}let x=new(g.count>=65535?no:eo)(u,1);x.version=M;let p=r.get(f);p&&t.remove(p),r.set(f,x)}function h(f){let u=r.get(f);if(u){let d=f.index;d!==null&&u.version<d.version&&c(f)}else c(f);return r.get(f)}return{get:a,update:l,getWireframeAttribute:h}}function Nx(i,t,e){let n;function s(f){n=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,u){i.drawElements(n,u,r,f*o),e.update(u,n,1)}function c(f,u,d){d!==0&&(i.drawElementsInstanced(n,u,r,f*o,d),e.update(u,n,d))}function h(f,u,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,f,0,d);let M=0;for(let x=0;x<d;x++)M+=u[x];e.update(M,n,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Ux(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(r/3);break;case i.LINES:e.lines+=a*(r/2);break;case i.LINE_STRIP:e.lines+=a*(r-1);break;case i.LINE_LOOP:e.lines+=a*r;break;case i.POINTS:e.points+=a*r;break;default:se("WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function Fx(i,t,e){let n=new WeakMap,s=new We;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=h!==void 0?h.length:0,u=n.get(a);if(u===void 0||u.count!==f){let P=function(){L.dispose(),n.delete(a),a.removeEventListener("dispose",P)};u!==void 0&&u.texture.dispose();let d=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,M=a.morphAttributes.color!==void 0,x=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],I=a.morphAttributes.color||[],U=0;d===!0&&(U=1),g===!0&&(U=2),M===!0&&(U=3);let E=a.attributes.position.count*U,b=1;E>t.maxTextureSize&&(b=Math.ceil(E/t.maxTextureSize),E=t.maxTextureSize);let A=new Float32Array(E*b*4*f),L=new Qr(A,E,b,f);L.type=ii,L.needsUpdate=!0;let v=U*4;for(let N=0;N<f;N++){let F=x[N],O=p[N],Y=I[N],z=E*b*4*N;for(let j=0;j<F.count;j++){let ht=j*v;d===!0&&(s.fromBufferAttribute(F,j),A[z+ht+0]=s.x,A[z+ht+1]=s.y,A[z+ht+2]=s.z,A[z+ht+3]=0),g===!0&&(s.fromBufferAttribute(O,j),A[z+ht+4]=s.x,A[z+ht+5]=s.y,A[z+ht+6]=s.z,A[z+ht+7]=0),M===!0&&(s.fromBufferAttribute(Y,j),A[z+ht+8]=s.x,A[z+ht+9]=s.y,A[z+ht+10]=s.z,A[z+ht+11]=Y.itemSize===4?s.w:1)}}u={count:f,texture:L,size:new qt(E,b)},n.set(a,u),a.addEventListener("dispose",P)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,e);else{let d=0;for(let M=0;M<c.length;M++)d+=c[M];let g=a.morphTargetsRelative?1:1-d;l.getUniforms().setValue(i,"morphTargetBaseInfluence",g),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function Ox(i,t,e,n,s){let r=new WeakMap;function o(c){let h=s.render.frame,f=c.geometry,u=t.get(c,f);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let d=c.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return u}function a(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}var Bx={[xo]:"LINEAR_TONE_MAPPING",[_o]:"REINHARD_TONE_MAPPING",[vo]:"CINEON_TONE_MAPPING",[Ls]:"ACES_FILMIC_TONE_MAPPING",[Mo]:"AGX_TONE_MAPPING",[So]:"NEUTRAL_TONE_MAPPING",[yo]:"CUSTOM_TONE_MAPPING"};function kx(i,t,e,n,s,r){let o=new Ye(t,e,{type:i,depthBuffer:s,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new gn;c.setAttribute("position",new Sn([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Sn([0,2,0,0,2,0],2));let h=new vr({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),f=new ze(c,h),u=new Cs(-1,1,1,-1,0,1),d=null,g=null,M=!1,x,p=null,I=[],U=!1;this.setSize=function(E,b){o.setSize(E,b),a!==null&&a.setSize(E,b),l!==null&&l.setSize(E,b);for(let A=0;A<I.length;A++){let L=I[A];L.setSize&&L.setSize(E,b)}},this.setEffects=function(E){I=E,U=I.length>0&&I[0].isRenderPass===!0;let b=o.width,A=o.height;I.length>0&&a===null&&(a=new Ye(b,A,{type:Je,depthBuffer:!1,stencilBuffer:!1}),l=new Ye(b,A,{type:Je,depthBuffer:!1,stencilBuffer:!1}));for(let L=0;L<I.length;L++){let v=I[L];v.setSize&&v.setSize(b,A)}},this.begin=function(E,b){if(M||E.toneMapping===ei&&I.length===0)return!1;if(p=b,b!==null){let A=b.width,L=b.height;(o.width!==A||o.height!==L)&&this.setSize(A,L)}return U===!1&&E.setRenderTarget(o),x=E.toneMapping,E.toneMapping=ei,!0},this.hasRenderPass=function(){return U},this.end=function(E,b){E.toneMapping=x,M=!0;let A=o,L=a;for(let v=0;v<I.length;v++){let P=I[v];P.enabled!==!1&&(P.render(E,L,A,b),P.needsSwap!==!1&&(A=L,L=L===a?l:a))}if(d!==E.outputColorSpace||g!==E.toneMapping){d=E.outputColorSpace,g=E.toneMapping,h.defines={},xe.getTransfer(d)===Ae&&(h.defines.SRGB_TRANSFER="");let v=Bx[g];v&&(h.defines[v]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=A.texture,E.setRenderTarget(p),E.render(f,u),p=null,M=!1},this.isCompositing=function(){return M},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var fd=new mn,Nh=new Ji(1,1),dd=new Qr,pd=new Ba,md=new oo,Yf=[],$f=[],Zf=new Float32Array(16),Kf=new Float32Array(9),Jf=new Float32Array(4);function Ir(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=Yf[s];if(r===void 0&&(r=new Float32Array(s),Yf[s]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(r,a)}return r}function je(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Qe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Kl(i,t){let e=$f[t];e===void 0&&(e=new Int32Array(t),$f[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function zx(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Vx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(je(e,t))return;i.uniform2fv(this.addr,t),Qe(e,t)}}function Hx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(je(e,t))return;i.uniform3fv(this.addr,t),Qe(e,t)}}function Gx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(je(e,t))return;i.uniform4fv(this.addr,t),Qe(e,t)}}function Wx(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(je(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Qe(e,t)}else{if(je(e,n))return;Jf.set(n),i.uniformMatrix2fv(this.addr,!1,Jf),Qe(e,n)}}function Xx(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(je(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Qe(e,t)}else{if(je(e,n))return;Kf.set(n),i.uniformMatrix3fv(this.addr,!1,Kf),Qe(e,n)}}function qx(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(je(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Qe(e,t)}else{if(je(e,n))return;Zf.set(n),i.uniformMatrix4fv(this.addr,!1,Zf),Qe(e,n)}}function Yx(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function $x(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(je(e,t))return;i.uniform2iv(this.addr,t),Qe(e,t)}}function Zx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(je(e,t))return;i.uniform3iv(this.addr,t),Qe(e,t)}}function Kx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(je(e,t))return;i.uniform4iv(this.addr,t),Qe(e,t)}}function Jx(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function jx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(je(e,t))return;i.uniform2uiv(this.addr,t),Qe(e,t)}}function Qx(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(je(e,t))return;i.uniform3uiv(this.addr,t),Qe(e,t)}}function t_(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(je(e,t))return;i.uniform4uiv(this.addr,t),Qe(e,t)}}function e_(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r;this.type===i.SAMPLER_2D_SHADOW?(Nh.compareFunction=e.isReversedDepthBuffer()?Gl:Hl,r=Nh):r=fd,e.setTexture2D(t||r,s)}function n_(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||pd,s)}function i_(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||md,s)}function s_(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||dd,s)}function r_(i){switch(i){case 5126:return zx;case 35664:return Vx;case 35665:return Hx;case 35666:return Gx;case 35674:return Wx;case 35675:return Xx;case 35676:return qx;case 5124:case 35670:return Yx;case 35667:case 35671:return $x;case 35668:case 35672:return Zx;case 35669:case 35673:return Kx;case 5125:return Jx;case 36294:return jx;case 36295:return Qx;case 36296:return t_;case 35678:case 36198:case 36298:case 36306:case 35682:return e_;case 35679:case 36299:case 36307:return n_;case 35680:case 36300:case 36308:case 36293:return i_;case 36289:case 36303:case 36311:case 36292:return s_}}function o_(i,t){i.uniform1fv(this.addr,t)}function a_(i,t){let e=Ir(t,this.size,2);i.uniform2fv(this.addr,e)}function l_(i,t){let e=Ir(t,this.size,3);i.uniform3fv(this.addr,e)}function c_(i,t){let e=Ir(t,this.size,4);i.uniform4fv(this.addr,e)}function h_(i,t){let e=Ir(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function u_(i,t){let e=Ir(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function f_(i,t){let e=Ir(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function d_(i,t){i.uniform1iv(this.addr,t)}function p_(i,t){i.uniform2iv(this.addr,t)}function m_(i,t){i.uniform3iv(this.addr,t)}function g_(i,t){i.uniform4iv(this.addr,t)}function x_(i,t){i.uniform1uiv(this.addr,t)}function __(i,t){i.uniform2uiv(this.addr,t)}function v_(i,t){i.uniform3uiv(this.addr,t)}function y_(i,t){i.uniform4uiv(this.addr,t)}function M_(i,t,e){let n=this.cache,s=t.length,r=Kl(e,s);je(n,r)||(i.uniform1iv(this.addr,r),Qe(n,r));let o;this.type===i.SAMPLER_2D_SHADOW?o=Nh:o=fd;for(let a=0;a!==s;++a)e.setTexture2D(t[a]||o,r[a])}function S_(i,t,e){let n=this.cache,s=t.length,r=Kl(e,s);je(n,r)||(i.uniform1iv(this.addr,r),Qe(n,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||pd,r[o])}function b_(i,t,e){let n=this.cache,s=t.length,r=Kl(e,s);je(n,r)||(i.uniform1iv(this.addr,r),Qe(n,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||md,r[o])}function w_(i,t,e){let n=this.cache,s=t.length,r=Kl(e,s);je(n,r)||(i.uniform1iv(this.addr,r),Qe(n,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||dd,r[o])}function T_(i){switch(i){case 5126:return o_;case 35664:return a_;case 35665:return l_;case 35666:return c_;case 35674:return h_;case 35675:return u_;case 35676:return f_;case 5124:case 35670:return d_;case 35667:case 35671:return p_;case 35668:case 35672:return m_;case 35669:case 35673:return g_;case 5125:return x_;case 36294:return __;case 36295:return v_;case 36296:return y_;case 35678:case 36198:case 36298:case 36306:case 35682:return M_;case 35679:case 36299:case 36307:return S_;case 35680:case 36300:case 36308:case 36293:return b_;case 36289:case 36303:case 36311:case 36292:return w_}}var Uh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=r_(e.type)}},Fh=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=T_(e.type)}},Oh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],n)}}},Lh=/(\w+)(\])?(\[|\.)?/g;function jf(i,t){i.seq.push(t),i.map[t.id]=t}function A_(i,t,e){let n=i.name,s=n.length;for(Lh.lastIndex=0;;){let r=Lh.exec(n),o=Lh.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){jf(e,c===void 0?new Uh(a,i,t):new Fh(a,i,t));break}else{let f=e.map[a];f===void 0&&(f=new Oh(a),jf(e,f)),e=f}}}var Pr=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){let a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);A_(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&n.push(o)}return n}};function Qf(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var E_=37297,C_=0;function R_(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}var td=new ce;function P_(i){xe._getMatrix(td,xe.workingColorSpace,i);let t=`mat3( ${td.elements.map(e=>e.toFixed(4))} )`;switch(xe.getTransfer(i)){case Jr:return[t,"LinearTransferOETF"];case Ae:return[t,"sRGBTransferOETF"];default:return ie("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function ed(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),r=(i.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+R_(i.getShaderSource(t),a)}else return r}function I_(i,t){let e=P_(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var L_={[xo]:"Linear",[_o]:"Reinhard",[vo]:"Cineon",[Ls]:"ACESFilmic",[Mo]:"AgX",[So]:"Neutral",[yo]:"Custom"};function D_(i,t){let e=L_[t];return e===void 0?(ie("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var Xl=new G;function N_(){xe.getLuminanceCoefficients(Xl);let i=Xl.x.toFixed(4),t=Xl.y.toFixed(4),e=Xl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function U_(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Do).join(`
`)}function F_(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function O_(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),o=r.name,a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function Do(i){return i!==""}function nd(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function id(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var B_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Bh(i){return i.replace(B_,z_)}var k_=new Map;function z_(i,t){let e=de[t];if(e===void 0){let n=k_.get(t);if(n!==void 0)e=de[n],ie('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Bh(e)}var V_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function sd(i){return i.replace(V_,H_)}function H_(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function rd(i){let t=`precision ${i.precision} float;
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
#define LOW_PRECISION`),t}var G_={[go]:"SHADOWMAP_TYPE_PCF",[Mr]:"SHADOWMAP_TYPE_VSM"};function W_(i){return G_[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var X_={[ns]:"ENVMAP_TYPE_CUBE",[Ds]:"ENVMAP_TYPE_CUBE",[bo]:"ENVMAP_TYPE_CUBE_UV"};function q_(i){return i.envMap===!1?"ENVMAP_TYPE_CUBE":X_[i.envMapMode]||"ENVMAP_TYPE_CUBE"}var Y_={[Ds]:"ENVMAP_MODE_REFRACTION"};function $_(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":Y_[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var Z_={[sh]:"ENVMAP_BLENDING_MULTIPLY",[bf]:"ENVMAP_BLENDING_MIX",[wf]:"ENVMAP_BLENDING_ADD"};function K_(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":Z_[i.combine]||"ENVMAP_BLENDING_NONE"}function J_(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function j_(i,t,e,n){let s=i.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=W_(e),c=q_(e),h=$_(e),f=K_(e),u=J_(e),d=U_(e),g=F_(r),M=s.createProgram(),x,p,I=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(x=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Do).join(`
`),x.length>0&&(x+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Do).join(`
`),p.length>0&&(p+=`
`)):(x=[rd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Do).join(`
`),p=[rd(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==ei?"#define TONE_MAPPING":"",e.toneMapping!==ei?de.tonemapping_pars_fragment:"",e.toneMapping!==ei?D_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",de.colorspace_pars_fragment,I_("linearToOutputTexel",e.outputColorSpace),N_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Do).join(`
`)),o=Bh(o),o=nd(o,e),o=id(o,e),a=Bh(a),a=nd(a,e),a=id(a,e),o=sd(o),a=sd(a),e.isRawShaderMaterial!==!0&&(I=`#version 300 es
`,x=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,p=["#define varying in",e.glslVersion===mh?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===mh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let U=I+x+o,E=I+p+a,b=Qf(s,s.VERTEX_SHADER,U),A=Qf(s,s.FRAGMENT_SHADER,E);s.attachShader(M,b),s.attachShader(M,A),e.index0AttributeName!==void 0?s.bindAttribLocation(M,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(M,0,"position"),s.linkProgram(M);function L(F){if(i.debug.checkShaderErrors){let O=s.getProgramInfoLog(M)||"",Y=s.getShaderInfoLog(b)||"",z=s.getShaderInfoLog(A)||"",j=O.trim(),ht=Y.trim(),ct=z.trim(),gt=!0,ot=!0;if(s.getProgramParameter(M,s.LINK_STATUS)===!1)if(gt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,M,b,A);else{let dt=ed(s,b,"vertex"),xt=ed(s,A,"fragment");se("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(M,s.VALIDATE_STATUS)+`

Material Name: `+F.name+`
Material Type: `+F.type+`

Program Info Log: `+j+`
`+dt+`
`+xt)}else j!==""?ie("WebGLProgram: Program Info Log:",j):(ht===""||ct==="")&&(ot=!1);ot&&(F.diagnostics={runnable:gt,programLog:j,vertexShader:{log:ht,prefix:x},fragmentShader:{log:ct,prefix:p}})}s.deleteShader(b),s.deleteShader(A),v=new Pr(s,M),P=O_(s,M)}let v;this.getUniforms=function(){return v===void 0&&L(this),v};let P;this.getAttributes=function(){return P===void 0&&L(this),P};let N=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return N===!1&&(N=s.getProgramParameter(M,E_)),N},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(M),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=C_++,this.cacheKey=t,this.usedTimes=1,this.program=M,this.vertexShader=b,this.fragmentShader=A,this}var Q_=0,kh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new zh(t),e.set(t,n)),n}},zh=class{constructor(t){this.id=Q_++,this.code=t,this.usedTimes=0}};function tv(i){return i===rs||i===Ro||i===Po}function ev(i,t,e,n,s,r){let o=new gr,a=new kh,l=new Set,c=[],h=new Map,f=n.logarithmicDepthBuffer,u=n.precision,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(v){return l.add(v),v===0?"uv":`uv${v}`}function M(v,P,N,F,O,Y){let z=F.fog,j=O.geometry,ht=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?F.environment:null,ct=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,gt=t.get(v.envMap||ht,ct),ot=gt&&gt.mapping===bo?gt.image.height:null,dt=d[v.type];v.precision!==null&&(u=n.getMaxPrecision(v.precision),u!==v.precision&&ie("WebGLProgram.getParameters:",v.precision,"not supported, using",u,"instead."));let xt=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,Zt=xt!==void 0?xt.length:0,Xt=0;j.morphAttributes.position!==void 0&&(Xt=1),j.morphAttributes.normal!==void 0&&(Xt=2),j.morphAttributes.color!==void 0&&(Xt=3);let Ee,pe,Me,W;if(dt){let $t=mi[dt];Ee=$t.vertexShader,pe=$t.fragmentShader}else{Ee=v.vertexShader,pe=v.fragmentShader;let $t=a.getVertexShaderStage(v),Bt=a.getFragmentShaderStage(v);a.update(v,$t,Bt),Me=$t.id,W=Bt.id}let et=i.getRenderTarget(),St=i.state.buffers.depth.getReversed(),vt=O.isInstancedMesh===!0,yt=O.isBatchedMesh===!0,Ft=!!v.map,Ne=!!v.matcap,ee=!!gt,ve=!!v.aoMap,ye=!!v.lightMap,re=!!v.bumpMap&&v.wireframe===!1,jt=!!v.normalMap,Ue=!!v.displacementMap,Ce=!!v.emissiveMap,we=!!v.metalnessMap,Ie=!!v.roughnessMap,R=v.anisotropy>0,Pt=v.clearcoat>0,zt=v.dispersion>0,T=v.retroreflectivity>0,m=v.iridescence>0,H=v.sheen>0,X=v.transmission>0,tt=R&&!!v.anisotropyMap,ft=Pt&&!!v.clearcoatMap,D=Pt&&!!v.clearcoatNormalMap,k=Pt&&!!v.clearcoatRoughnessMap,at=m&&!!v.iridescenceMap,Q=m&&!!v.iridescenceThicknessMap,Ut=H&&!!v.sheenColorMap,wt=H&&!!v.sheenRoughnessMap,Et=!!v.specularMap,Yt=!!v.specularColorMap,Qt=!!v.specularIntensityMap,Mt=X&&!!v.transmissionMap,V=X&&!!v.thicknessMap,At=!!v.gradientMap,lt=!!v.alphaMap,bt=v.alphaTest>0,Ct=!!v.alphaHash,pt=!!v.extensions,Kt=ei;v.toneMapped&&(et===null||et.isXRRenderTarget===!0)&&(Kt=i.toneMapping);let Ot={shaderID:dt,shaderType:v.type,shaderName:v.name,vertexShader:Ee,fragmentShader:pe,defines:v.defines,customVertexShaderID:Me,customFragmentShaderID:W,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:u,batching:yt,batchingColor:yt&&O._colorsTexture!==null,instancing:vt,instancingColor:vt&&O.instanceColor!==null,instancingMorph:vt&&O.morphTexture!==null,outputColorSpace:et===null?i.outputColorSpace:et.isXRRenderTarget===!0?et.texture.colorSpace:xe.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:Ft,matcap:Ne,envMap:ee,envMapMode:ee&&gt.mapping,envMapCubeUVHeight:ot,aoMap:ve,lightMap:ye,bumpMap:re,normalMap:jt,displacementMap:Ue,emissiveMap:Ce,normalMapObjectSpace:jt&&v.normalMapType===Ef,normalMapTangentSpace:jt&&v.normalMapType===dh,packedNormalMap:jt&&v.normalMapType===dh&&tv(v.normalMap.format),metalnessMap:we,roughnessMap:Ie,anisotropy:R,anisotropyMap:tt,clearcoat:Pt,clearcoatMap:ft,clearcoatNormalMap:D,clearcoatRoughnessMap:k,dispersion:zt,retroreflection:T,iridescence:m,iridescenceMap:at,iridescenceThicknessMap:Q,sheen:H,sheenColorMap:Ut,sheenRoughnessMap:wt,specularMap:Et,specularColorMap:Yt,specularIntensityMap:Qt,transmission:X,transmissionMap:Mt,thicknessMap:V,gradientMap:At,opaque:v.transparent===!1&&v.blending===Sr&&v.alphaToCoverage===!1,alphaMap:lt,alphaTest:bt,alphaHash:Ct,combine:v.combine,mapUv:Ft&&g(v.map.channel),aoMapUv:ve&&g(v.aoMap.channel),lightMapUv:ye&&g(v.lightMap.channel),bumpMapUv:re&&g(v.bumpMap.channel),normalMapUv:jt&&g(v.normalMap.channel),displacementMapUv:Ue&&g(v.displacementMap.channel),emissiveMapUv:Ce&&g(v.emissiveMap.channel),metalnessMapUv:we&&g(v.metalnessMap.channel),roughnessMapUv:Ie&&g(v.roughnessMap.channel),anisotropyMapUv:tt&&g(v.anisotropyMap.channel),clearcoatMapUv:ft&&g(v.clearcoatMap.channel),clearcoatNormalMapUv:D&&g(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:k&&g(v.clearcoatRoughnessMap.channel),iridescenceMapUv:at&&g(v.iridescenceMap.channel),iridescenceThicknessMapUv:Q&&g(v.iridescenceThicknessMap.channel),sheenColorMapUv:Ut&&g(v.sheenColorMap.channel),sheenRoughnessMapUv:wt&&g(v.sheenRoughnessMap.channel),specularMapUv:Et&&g(v.specularMap.channel),specularColorMapUv:Yt&&g(v.specularColorMap.channel),specularIntensityMapUv:Qt&&g(v.specularIntensityMap.channel),transmissionMapUv:Mt&&g(v.transmissionMap.channel),thicknessMapUv:V&&g(v.thicknessMap.channel),alphaMapUv:lt&&g(v.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(jt||R),vertexNormals:!!j.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!j.attributes.uv&&(Ft||lt),fog:!!z,useFog:v.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||j.attributes.normal===void 0&&jt===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:St,skinning:O.isSkinnedMesh===!0,hasPositionAttribute:j.attributes.position!==void 0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:Zt,morphTextureStride:Xt,numSunLights:P.sun.length,numDirLights:P.directional.length,numPointLights:P.point.length,numSpotLights:P.spot.length,numSpotLightMaps:P.spotLightMap.length,numRectAreaLights:P.rectArea.length,numHemiLights:P.hemi.length,numSunLightShadows:P.sunShadowMap.length,numDirLightShadows:P.directionalShadowMap.length,numPointLightShadows:P.pointShadowMap.length,numSpotLightShadows:P.spotShadowMap.length,numSpotLightShadowsWithMaps:P.numSpotLightShadowsWithMaps,numLightProbes:P.numLightProbes,numLightProbeGrids:Y.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:i.shadowMap.enabled&&N.length>0,shadowMapType:i.shadowMap.type,toneMapping:Kt,decodeVideoTexture:Ft&&v.map.isVideoTexture===!0&&xe.getTransfer(v.map.colorSpace)===Ae,decodeVideoTextureEmissive:Ce&&v.emissiveMap.isVideoTexture===!0&&xe.getTransfer(v.emissiveMap.colorSpace)===Ae,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===fi,flipSided:v.side===bn,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:pt&&v.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(pt&&v.extensions.multiDraw===!0||yt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Ot.vertexUv1s=l.has(1),Ot.vertexUv2s=l.has(2),Ot.vertexUv3s=l.has(3),l.clear(),Ot}function x(v){let P=[];if(v.shaderID?P.push(v.shaderID):(P.push(v.customVertexShaderID),P.push(v.customFragmentShaderID)),v.defines!==void 0)for(let N in v.defines)P.push(N),P.push(v.defines[N]);return v.isRawShaderMaterial===!1&&(p(P,v),I(P,v),P.push(i.outputColorSpace)),P.push(v.customProgramCacheKey),P.join()}function p(v,P){v.push(P.precision),v.push(P.outputColorSpace),v.push(P.envMapMode),v.push(P.envMapCubeUVHeight),v.push(P.mapUv),v.push(P.alphaMapUv),v.push(P.lightMapUv),v.push(P.aoMapUv),v.push(P.bumpMapUv),v.push(P.normalMapUv),v.push(P.displacementMapUv),v.push(P.emissiveMapUv),v.push(P.metalnessMapUv),v.push(P.roughnessMapUv),v.push(P.anisotropyMapUv),v.push(P.clearcoatMapUv),v.push(P.clearcoatNormalMapUv),v.push(P.clearcoatRoughnessMapUv),v.push(P.iridescenceMapUv),v.push(P.iridescenceThicknessMapUv),v.push(P.sheenColorMapUv),v.push(P.sheenRoughnessMapUv),v.push(P.specularMapUv),v.push(P.specularColorMapUv),v.push(P.specularIntensityMapUv),v.push(P.transmissionMapUv),v.push(P.thicknessMapUv),v.push(P.combine),v.push(P.fogExp2),v.push(P.sizeAttenuation),v.push(P.morphTargetsCount),v.push(P.morphAttributeCount),v.push(P.numSunLights),v.push(P.numDirLights),v.push(P.numPointLights),v.push(P.numSpotLights),v.push(P.numSpotLightMaps),v.push(P.numHemiLights),v.push(P.numRectAreaLights),v.push(P.numSunLightShadows),v.push(P.numDirLightShadows),v.push(P.numPointLightShadows),v.push(P.numSpotLightShadows),v.push(P.numSpotLightShadowsWithMaps),v.push(P.numLightProbes),v.push(P.shadowMapType),v.push(P.toneMapping),v.push(P.numClippingPlanes),v.push(P.numClipIntersection),v.push(P.depthPacking)}function I(v,P){o.disableAll(),P.instancing&&o.enable(0),P.instancingColor&&o.enable(1),P.instancingMorph&&o.enable(2),P.matcap&&o.enable(3),P.envMap&&o.enable(4),P.normalMapObjectSpace&&o.enable(5),P.normalMapTangentSpace&&o.enable(6),P.clearcoat&&o.enable(7),P.iridescence&&o.enable(8),P.alphaTest&&o.enable(9),P.vertexColors&&o.enable(10),P.vertexAlphas&&o.enable(11),P.vertexUv1s&&o.enable(12),P.vertexUv2s&&o.enable(13),P.vertexUv3s&&o.enable(14),P.vertexTangents&&o.enable(15),P.anisotropy&&o.enable(16),P.alphaHash&&o.enable(17),P.batching&&o.enable(18),P.dispersion&&o.enable(19),P.retroreflection&&o.enable(24),P.batchingColor&&o.enable(20),P.gradientMap&&o.enable(21),P.packedNormalMap&&o.enable(22),P.vertexNormals&&o.enable(23),v.push(o.mask),o.disableAll(),P.fog&&o.enable(0),P.useFog&&o.enable(1),P.flatShading&&o.enable(2),P.logarithmicDepthBuffer&&o.enable(3),P.reversedDepthBuffer&&o.enable(4),P.skinning&&o.enable(5),P.morphTargets&&o.enable(6),P.morphNormals&&o.enable(7),P.morphColors&&o.enable(8),P.premultipliedAlpha&&o.enable(9),P.shadowMapEnabled&&o.enable(10),P.doubleSided&&o.enable(11),P.flipSided&&o.enable(12),P.useDepthPacking&&o.enable(13),P.dithering&&o.enable(14),P.transmission&&o.enable(15),P.sheen&&o.enable(16),P.opaque&&o.enable(17),P.pointsUvs&&o.enable(18),P.decodeVideoTexture&&o.enable(19),P.decodeVideoTextureEmissive&&o.enable(20),P.alphaToCoverage&&o.enable(21),P.numLightProbeGrids>0&&o.enable(22),P.hasPositionAttribute&&o.enable(23),v.push(o.mask)}function U(v){let P=d[v.type],N;if(P){let F=mi[P];N=Pi.clone(F.uniforms)}else N=v.uniforms;return N}function E(v,P){let N=h.get(P);return N!==void 0?++N.usedTimes:(N=new j_(i,P,v,s),c.push(N),h.set(P,N)),N}function b(v){if(--v.usedTimes===0){let P=c.indexOf(v);c[P]=c[c.length-1],c.pop(),h.delete(v.cacheKey),v.destroy()}}function A(v){a.remove(v)}function L(){a.dispose()}return{getParameters:M,getProgramCacheKey:x,getUniforms:U,acquireProgram:E,releaseProgram:b,releaseShaderCache:A,programs:c,dispose:L}}function nv(){let i=new WeakMap;function t(o){return i.has(o)}function e(o){let a=i.get(o);return a===void 0&&(a={},i.set(o,a)),a}function n(o){i.delete(o)}function s(o,a,l){i.get(o)[a]=l}function r(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:r}}function iv(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function od(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function ad(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function o(u){let d=0;return u.isInstancedMesh&&(d+=2),u.isSkinnedMesh&&(d+=1),d}function a(u,d,g,M,x,p){let I=i[t];return I===void 0?(I={id:u.id,object:u,geometry:d,material:g,materialVariant:o(u),groupOrder:M,renderOrder:u.renderOrder,z:x,group:p},i[t]=I):(I.id=u.id,I.object=u,I.geometry=d,I.material=g,I.materialVariant=o(u),I.groupOrder=M,I.renderOrder=u.renderOrder,I.z=x,I.group=p),t++,I}function l(u,d,g,M,x,p,I){I.reversedDepth===!0&&(x=-x);let U=a(u,d,g,M,x,p);g.transmission>0?n.push(U):g.transparent===!0?s.push(U):e.push(U)}function c(u,d,g,M,x,p){let I=a(u,d,g,M,x,p);g.transmission>0?n.unshift(I):g.transparent===!0?s.unshift(I):e.unshift(I)}function h(u,d){e.length>1&&e.sort(u||iv),n.length>1&&n.sort(d||od),s.length>1&&s.sort(d||od)}function f(){for(let u=t,d=i.length;u<d;u++){let g=i[u];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:l,unshift:c,finish:f,sort:h}}function sv(){let i=new WeakMap;function t(n,s){let r=i.get(n),o;return r===void 0?(o=new ad,i.set(n,[o])):s>=r.length?(o=new ad,r.push(o)):o=r[s],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function rv(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new G,color:new ue};break;case"SpotLight":e={position:new G,direction:new G,color:new ue,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new G,color:new ue,distance:0,decay:0};break;case"HemisphereLight":e={direction:new G,skyColor:new ue,groundColor:new ue};break;case"RectAreaLight":e={color:new ue,position:new G,halfWidth:new G,halfHeight:new G};break}return i[t.id]=e,e}}}function ov(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new qt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new qt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new qt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var av=0;function lv(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function cv(i){let t=new rv,e=ov(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new G);let s=new G,r=new Ge,o=new Ge;function a(c){let h=0,f=0,u=0;for(let O=0;O<9;O++)n.probe[O].set(0,0,0);let d=0,g=0,M=0,x=0,p=0,I=0,U=0,E=0,b=0,A=0,L=0,v=0,P=0,N=0;c.sort(lv);for(let O=0,Y=c.length;O<Y;O++){let z=c[O],j=z.color,ht=z.intensity,ct=z.distance,gt=null;if(z.shadow&&z.shadow.map&&(z.shadow.map.texture.format===rs?gt=z.shadow.map.texture:gt=z.shadow.map.depthTexture||z.shadow.map.texture),z.isAmbientLight)h+=j.r*ht,f+=j.g*ht,u+=j.b*ht;else if(z.isLightProbe){for(let ot=0;ot<9;ot++)n.probe[ot].addScaledVector(z.sh.coefficients[ot],ht);N++}else if(z.isSunLight){let ot=t.get(z);if(ot.color.copy(z.color).multiplyScalar(z.intensity),z.castShadow){let dt=z.shadow,xt=e.get(z);xt.shadowIntensity=dt.intensity,xt.shadowBias=dt.bias,xt.shadowNormalBias=dt.normalBias,xt.shadowRadius=dt.radius,xt.shadowMapSize.copy(dt.mapSize).multiply(dt.getFrameExtents()),n.sunShadow[g]=xt,n.sunShadowMap[g]=gt;let Zt=dt.getViewportCount();for(let Xt=0;Xt<Zt;Xt++)n.sunShadowMatrix[M+Xt]=dt.getMatrix(Xt),n.sunShadowCascade[M+Xt]=dt._cascadeData[Xt];M+=Zt,g++}n.sun[d]=ot,d++}else if(z.isDirectionalLight){let ot=t.get(z);if(ot.color.copy(z.color).multiplyScalar(z.intensity),z.castShadow){let dt=z.shadow,xt=e.get(z);xt.shadowIntensity=dt.intensity,xt.shadowBias=dt.bias,xt.shadowNormalBias=dt.normalBias,xt.shadowRadius=dt.radius,xt.shadowMapSize=dt.mapSize,n.directionalShadow[x]=xt,n.directionalShadowMap[x]=gt,n.directionalShadowMatrix[x]=z.shadow.matrix,b++}n.directional[x]=ot,x++}else if(z.isSpotLight){let ot=t.get(z);ot.position.setFromMatrixPosition(z.matrixWorld),ot.color.copy(j).multiplyScalar(ht),ot.distance=ct,ot.coneCos=Math.cos(z.angle),ot.penumbraCos=Math.cos(z.angle*(1-z.penumbra)),ot.decay=z.decay,n.spot[I]=ot;let dt=z.shadow;if(z.map&&(n.spotLightMap[v]=z.map,v++,dt.updateMatrices(z),z.castShadow&&P++),n.spotLightMatrix[I]=dt.matrix,z.castShadow){let xt=e.get(z);xt.shadowIntensity=dt.intensity,xt.shadowBias=dt.bias,xt.shadowNormalBias=dt.normalBias,xt.shadowRadius=dt.radius,xt.shadowMapSize=dt.mapSize,n.spotShadow[I]=xt,n.spotShadowMap[I]=gt,L++}I++}else if(z.isRectAreaLight){let ot=t.get(z);ot.color.copy(j).multiplyScalar(ht),ot.halfWidth.set(z.width*.5,0,0),ot.halfHeight.set(0,z.height*.5,0),n.rectArea[U]=ot,U++}else if(z.isPointLight){let ot=t.get(z);if(ot.color.copy(z.color).multiplyScalar(z.intensity),ot.distance=z.distance,ot.decay=z.decay,z.castShadow){let dt=z.shadow,xt=e.get(z);xt.shadowIntensity=dt.intensity,xt.shadowBias=dt.bias,xt.shadowNormalBias=dt.normalBias,xt.shadowRadius=dt.radius,xt.shadowMapSize=dt.mapSize,xt.shadowCameraNear=dt.camera.near,xt.shadowCameraFar=dt.camera.far,n.pointShadow[p]=xt,n.pointShadowMap[p]=gt,n.pointShadowMatrix[p]=z.shadow.matrix,A++}n.point[p]=ot,p++}else if(z.isHemisphereLight){let ot=t.get(z);ot.skyColor.copy(z.color).multiplyScalar(ht),ot.groundColor.copy(z.groundColor).multiplyScalar(ht),n.hemi[E]=ot,E++}}U>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=It.LTC_FLOAT_1,n.rectAreaLTC2=It.LTC_FLOAT_2):(n.rectAreaLTC1=It.LTC_HALF_1,n.rectAreaLTC2=It.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=u;let F=n.hash;(F.sunLength!==d||F.directionalLength!==x||F.pointLength!==p||F.spotLength!==I||F.rectAreaLength!==U||F.hemiLength!==E||F.numSunShadows!==g||F.numDirectionalShadows!==b||F.numPointShadows!==A||F.numSpotShadows!==L||F.numSpotMaps!==v||F.numLightProbes!==N)&&(n.sun.length=d,n.directional.length=x,n.spot.length=I,n.rectArea.length=U,n.point.length=p,n.hemi.length=E,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=M,n.sunShadowCascade.length=M,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=A,n.pointShadowMap.length=A,n.pointShadowMatrix.length=A,n.spotShadow.length=L,n.spotShadowMap.length=L,n.spotLightMatrix.length=L+v-P,n.spotLightMap.length=v,n.numSpotLightShadowsWithMaps=P,n.numLightProbes=N,F.sunLength=d,F.directionalLength=x,F.pointLength=p,F.spotLength=I,F.rectAreaLength=U,F.hemiLength=E,F.numSunShadows=g,F.numDirectionalShadows=b,F.numPointShadows=A,F.numSpotShadows=L,F.numSpotMaps=v,F.numLightProbes=N,n.version=av++)}function l(c,h){let f=0,u=0,d=0,g=0,M=0,x=0,p=h.matrixWorldInverse;for(let I=0,U=c.length;I<U;I++){let E=c[I];if(E.isSunLight){let b=n.sun[f];b.direction.setFromMatrixPosition(E.matrixWorld),b.direction.transformDirection(p),f++}else if(E.isDirectionalLight){let b=n.directional[u];b.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(p),u++}else if(E.isSpotLight){let b=n.spot[g];b.position.setFromMatrixPosition(E.matrixWorld),b.position.applyMatrix4(p),b.direction.setFromMatrixPosition(E.matrixWorld),s.setFromMatrixPosition(E.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(p),g++}else if(E.isRectAreaLight){let b=n.rectArea[M];b.position.setFromMatrixPosition(E.matrixWorld),b.position.applyMatrix4(p),o.identity(),r.copy(E.matrixWorld),r.premultiply(p),o.extractRotation(r),b.halfWidth.set(E.width*.5,0,0),b.halfHeight.set(0,E.height*.5,0),b.halfWidth.applyMatrix4(o),b.halfHeight.applyMatrix4(o),M++}else if(E.isPointLight){let b=n.point[d];b.position.setFromMatrixPosition(E.matrixWorld),b.position.applyMatrix4(p),d++}else if(E.isHemisphereLight){let b=n.hemi[x];b.direction.setFromMatrixPosition(E.matrixWorld),b.direction.transformDirection(p),x++}}}return{setup:a,setupView:l,state:n}}function ld(i){let t=new cv(i),e=[],n=[],s=[];function r(u){f.camera=u,e.length=0,n.length=0,s.length=0}function o(u){e.push(u)}function a(u){n.push(u)}function l(u){s.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}let f={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function hv(i){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new ld(i),t.set(s,[a])):r>=o.length?(a=new ld(i),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var uv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,fv=`uniform sampler2D shadow_pass;
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
}`,dv=[new G(1,0,0),new G(-1,0,0),new G(0,1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1)],pv=[new G(0,-1,0),new G(0,-1,0),new G(0,0,1),new G(0,0,-1),new G(0,-1,0),new G(0,-1,0)],cd=new Ge,Lo=new G,Dh=new G;function mv(i,t,e){let n=new so,s=new qt,r=new qt,o=new We,a=new Va,l=new Ha,c={},h=e.maxTextureSize,f={[es]:bn,[bn]:es,[fi]:fi},u=new Ve({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new qt},radius:{value:4}},vertexShader:uv,fragmentShader:fv}),d=u.clone();d.defines.HORIZONTAL_PASS=1;let g=new gn;g.setAttribute("position",new rn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let M=new ze(g,u),x=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=go;let p=this.type;this.render=function(A,L,v){if(x.enabled===!1||x.autoUpdate===!1&&x.needsUpdate===!1||A.length===0)return;this.type===af&&(ie("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=go);let P=i.getRenderTarget(),N=i.getActiveCubeFace(),F=i.getActiveMipmapLevel(),O=i.state;O.setBlending(Wn),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);let Y=p!==this.type;Y&&L.traverse(function(z){z.material&&(Array.isArray(z.material)?z.material.forEach(j=>j.needsUpdate=!0):z.material.needsUpdate=!0)});for(let z=0,j=A.length;z<j;z++){let ht=A[z],ct=ht.shadow;if(ct===void 0){ie("WebGLShadowMap:",ht,"has no shadow.");continue}if(ct.autoUpdate===!1&&ct.needsUpdate===!1)continue;s.copy(ct.mapSize);let gt=ct.getFrameExtents();s.multiply(gt),r.copy(ct.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/gt.x),s.x=r.x*gt.x,ct.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/gt.y),s.y=r.y*gt.y,ct.mapSize.y=r.y));let ot=i.state.buffers.depth.getReversed();if(ct.camera._reversedDepth=ot,ct.map===null||Y===!0){if(ct.map!==null&&(ct.map.depthTexture!==null&&(ct.map.depthTexture.dispose(),ct.map.depthTexture=null),ct.map.dispose()),this.type===Mr){if(ht.isPointLight){ie("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}ct.map=new Ye(s.x,s.y,{format:rs,type:Je,minFilter:qe,magFilter:qe,generateMipmaps:!1}),ct.map.texture.name=ht.name+".shadowMap",ct.map.depthTexture=new Ji(s.x,s.y,ii),ct.map.depthTexture.name=ht.name+".shadowMapDepth",ct.map.depthTexture.format=hi,ct.map.depthTexture.compareFunction=null,ct.map.depthTexture.minFilter=on,ct.map.depthTexture.magFilter=on}else ht.isPointLight?(ct.map=new Yl(s.x),ct.map.depthTexture=new za(s.x,ni)):(ct.map=new Ye(s.x,s.y),ct.map.depthTexture=new Ji(s.x,s.y,ni)),ct.map.depthTexture.name=ht.name+".shadowMap",ct.map.depthTexture.format=hi,this.type===go?(ct.map.depthTexture.compareFunction=ot?Gl:Hl,ct.map.depthTexture.minFilter=qe,ct.map.depthTexture.magFilter=qe):(ct.map.depthTexture.compareFunction=null,ct.map.depthTexture.minFilter=on,ct.map.depthTexture.magFilter=on);ct.camera.updateProjectionMatrix()}ct.map.isWebGLCubeRenderTarget!==!0&&(ct.map.width!==s.x||ct.map.height!==s.y)&&ct.map.setSize(s.x,s.y);let dt=ct.map.isWebGLCubeRenderTarget?6:ct.getViewportCount();ht.isPointLight!==!0&&ct.updateMatrices(ht,v);for(let xt=0;xt<dt;xt++){let Zt=ct.getCamera(xt);if(ht.isPointLight){let Xt=ct.camera,Ee=ct.matrix,pe=ht.distance||Xt.far;pe!==Xt.far&&(Xt.far=pe,Xt.updateProjectionMatrix()),Lo.setFromMatrixPosition(ht.matrixWorld),Xt.position.copy(Lo),Dh.copy(Xt.position),Dh.add(dv[xt]),Xt.up.copy(pv[xt]),Xt.lookAt(Dh),Xt.updateMatrixWorld(),Ee.makeTranslation(-Lo.x,-Lo.y,-Lo.z),cd.multiplyMatrices(Xt.projectionMatrix,Xt.matrixWorldInverse),ct._frustum.setFromProjectionMatrix(cd,Xt.coordinateSystem,Xt.reversedDepth)}if(ct.map.isWebGLCubeRenderTarget)i.setRenderTarget(ct.map,xt),i.clear();else{xt===0&&(i.setRenderTarget(ct.map),i.clear());let Xt=ct.getViewport(xt);o.set(r.x*Xt.x,r.y*Xt.y,r.x*Xt.z,r.y*Xt.w),O.viewport(o)}n=ct.getFrustum(xt),E(L,v,Zt,ht,this.type)}ct.isPointLightShadow!==!0&&this.type===Mr&&I(ct,v),ct.needsUpdate=!1}p=this.type,x.needsUpdate=!1,i.setRenderTarget(P,N,F)};function I(A,L){let v=t.update(M);u.defines.VSM_SAMPLES!==A.blurSamples&&(u.defines.VSM_SAMPLES=A.blurSamples,d.defines.VSM_SAMPLES=A.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),A.mapPass===null?A.mapPass=new Ye(s.x,s.y,{format:rs,type:Je}):(A.mapPass.width!==A.map.width||A.mapPass.height!==A.map.height)&&A.mapPass.setSize(A.map.width,A.map.height),u.uniforms.shadow_pass.value=A.map.depthTexture,u.uniforms.resolution.value.set(A.map.width,A.map.height),u.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(L,null,v,u,M,null),d.uniforms.shadow_pass.value=A.mapPass.texture,d.uniforms.resolution.value.set(A.map.width,A.map.height),d.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(L,null,v,d,M,null)}function U(A,L,v,P){let N=null,F=v.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(F!==void 0)N=F;else if(N=v.isPointLight===!0?l:a,i.localClippingEnabled&&L.clipShadows===!0&&Array.isArray(L.clippingPlanes)&&L.clippingPlanes.length!==0||L.displacementMap&&L.displacementScale!==0||L.alphaMap&&L.alphaTest>0||L.map&&L.alphaTest>0||L.alphaToCoverage===!0){let O=N.uuid,Y=L.uuid,z=c[O];z===void 0&&(z={},c[O]=z);let j=z[Y];j===void 0&&(j=N.clone(),z[Y]=j,L.addEventListener("dispose",b)),N=j}if(N.visible=L.visible,N.wireframe=L.wireframe,P===Mr?N.side=L.shadowSide!==null?L.shadowSide:L.side:N.side=L.shadowSide!==null?L.shadowSide:f[L.side],N.alphaMap=L.alphaMap,N.alphaTest=L.alphaToCoverage===!0?.5:L.alphaTest,N.map=L.map,N.clipShadows=L.clipShadows,N.clippingPlanes=L.clippingPlanes,N.clipIntersection=L.clipIntersection,N.displacementMap=L.displacementMap,N.displacementScale=L.displacementScale,N.displacementBias=L.displacementBias,N.wireframeLinewidth=L.wireframeLinewidth,N.linewidth=L.linewidth,v.isPointLight===!0&&N.isMeshDistanceMaterial===!0){let O=i.properties.get(N);O.light=v}return N}function E(A,L,v,P,N){if(A.visible===!1)return;if(A.layers.test(L.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&N===Mr)&&(!A.frustumCulled||A.intersectsFrustum(n))){A.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,A.matrixWorld);let Y=t.update(A),z=A.material;if(Array.isArray(z)){let j=Y.groups;for(let ht=0,ct=j.length;ht<ct;ht++){let gt=j[ht],ot=z[gt.materialIndex];if(ot&&ot.visible){let dt=U(A,ot,P,N);A.onBeforeShadow(i,A,L,v,Y,dt,gt),i.renderBufferDirect(v,null,Y,dt,A,gt),A.onAfterShadow(i,A,L,v,Y,dt,gt)}}}else if(z.visible){let j=U(A,z,P,N);A.onBeforeShadow(i,A,L,v,Y,j,null),i.renderBufferDirect(v,null,Y,j,A,null),A.onAfterShadow(i,A,L,v,Y,j,null)}}let O=A.children;for(let Y=0,z=O.length;Y<z;Y++)E(O[Y],L,v,P,N)}function b(A){A.target.removeEventListener("dispose",b);for(let v in c){let P=c[v],N=A.target.uuid;N in P&&(P[N].dispose(),delete P[N])}}}function gv(i,t){function e(){let V=!1,At=new We,lt=null,bt=new We(0,0,0,0);return{setMask:function(Ct){lt!==Ct&&!V&&(i.colorMask(Ct,Ct,Ct,Ct),lt=Ct)},setLocked:function(Ct){V=Ct},setClear:function(Ct,pt,Kt,Ot,$t){$t===!0&&(Ct*=Ot,pt*=Ot,Kt*=Ot),At.set(Ct,pt,Kt,Ot),bt.equals(At)===!1&&(i.clearColor(Ct,pt,Kt,Ot),bt.copy(At))},reset:function(){V=!1,lt=null,bt.set(-1,0,0,0)}}}function n(){let V=!1,At=!1,lt=null,bt=null,Ct=null;return{setReversed:function(pt){if(At!==pt){let Kt=t.get("EXT_clip_control");pt?Kt.clipControlEXT(Kt.LOWER_LEFT_EXT,Kt.ZERO_TO_ONE_EXT):Kt.clipControlEXT(Kt.LOWER_LEFT_EXT,Kt.NEGATIVE_ONE_TO_ONE_EXT),At=pt;let Ot=Ct;Ct=null,this.setClear(Ot)}},getReversed:function(){return At},setTest:function(pt){pt?et(i.DEPTH_TEST):St(i.DEPTH_TEST)},setMask:function(pt){lt!==pt&&!V&&(i.depthMask(pt),lt=pt)},setFunc:function(pt){if(At&&(pt=kf[pt]),bt!==pt){switch(pt){case Aa:i.depthFunc(i.NEVER);break;case Ea:i.depthFunc(i.ALWAYS);break;case Ca:i.depthFunc(i.LESS);break;case ur:i.depthFunc(i.LEQUAL);break;case Ra:i.depthFunc(i.EQUAL);break;case Pa:i.depthFunc(i.GEQUAL);break;case Ia:i.depthFunc(i.GREATER);break;case La:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}bt=pt}},setLocked:function(pt){V=pt},setClear:function(pt){Ct!==pt&&(Ct=pt,At&&(pt=1-pt),i.clearDepth(pt))},reset:function(){V=!1,lt=null,bt=null,Ct=null,At=!1}}}function s(){let V=!1,At=null,lt=null,bt=null,Ct=null,pt=null,Kt=null,Ot=null,$t=null;return{setTest:function(Bt){V||(Bt?et(i.STENCIL_TEST):St(i.STENCIL_TEST))},setMask:function(Bt){At!==Bt&&!V&&(i.stencilMask(Bt),At=Bt)},setFunc:function(Bt,me,$e){(lt!==Bt||bt!==me||Ct!==$e)&&(i.stencilFunc(Bt,me,$e),lt=Bt,bt=me,Ct=$e)},setOp:function(Bt,me,$e){(pt!==Bt||Kt!==me||Ot!==$e)&&(i.stencilOp(Bt,me,$e),pt=Bt,Kt=me,Ot=$e)},setLocked:function(Bt){V=Bt},setClear:function(Bt){$t!==Bt&&(i.clearStencil(Bt),$t=Bt)},reset:function(){V=!1,At=null,lt=null,bt=null,Ct=null,pt=null,Kt=null,Ot=null,$t=null}}}let r=new e,o=new n,a=new s,l=new WeakMap,c=new WeakMap,h={},f={},u={},d=new WeakMap,g=[],M=null,x=!1,p=null,I=null,U=null,E=null,b=null,A=null,L=null,v=new ue(0,0,0),P=0,N=!1,F=null,O=null,Y=null,z=null,j=null,ht=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),ct=!1,gt=0,ot=i.getParameter(i.VERSION);ot.indexOf("WebGL")!==-1?(gt=parseFloat(/^WebGL (\d)/.exec(ot)[1]),ct=gt>=1):ot.indexOf("OpenGL ES")!==-1&&(gt=parseFloat(/^OpenGL ES (\d)/.exec(ot)[1]),ct=gt>=2);let dt=null,xt={},Zt=i.getParameter(i.SCISSOR_BOX),Xt=i.getParameter(i.VIEWPORT),Ee=new We().fromArray(Zt),pe=new We().fromArray(Xt);function Me(V,At,lt,bt){let Ct=new Uint8Array(4),pt=i.createTexture();i.bindTexture(V,pt),i.texParameteri(V,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(V,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Kt=0;Kt<lt;Kt++)V===i.TEXTURE_3D||V===i.TEXTURE_2D_ARRAY?i.texImage3D(At,0,i.RGBA,1,1,bt,0,i.RGBA,i.UNSIGNED_BYTE,Ct):i.texImage2D(At+Kt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Ct);return pt}let W={};W[i.TEXTURE_2D]=Me(i.TEXTURE_2D,i.TEXTURE_2D,1),W[i.TEXTURE_CUBE_MAP]=Me(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),W[i.TEXTURE_2D_ARRAY]=Me(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),W[i.TEXTURE_3D]=Me(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),et(i.DEPTH_TEST),o.setFunc(ur),re(!1),jt(th),et(i.CULL_FACE),ve(Wn);function et(V){h[V]!==!0&&(i.enable(V),h[V]=!0)}function St(V){h[V]!==!1&&(i.disable(V),h[V]=!1)}function vt(V,At){return u[V]!==At?(i.bindFramebuffer(V,At),u[V]=At,V===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=At),V===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=At),!0):!1}function yt(V,At){let lt=g,bt=!1;if(V){lt=d.get(At),lt===void 0&&(lt=[],d.set(At,lt));let Ct=V.textures;if(lt.length!==Ct.length||lt[0]!==i.COLOR_ATTACHMENT0){for(let pt=0,Kt=Ct.length;pt<Kt;pt++)lt[pt]=i.COLOR_ATTACHMENT0+pt;lt.length=Ct.length,bt=!0}}else lt[0]!==i.BACK&&(lt[0]=i.BACK,bt=!0);bt&&i.drawBuffers(lt)}function Ft(V){return M!==V?(i.useProgram(V),M=V,!0):!1}let Ne={[di]:i.FUNC_ADD,[lf]:i.FUNC_SUBTRACT,[cf]:i.FUNC_REVERSE_SUBTRACT};Ne[hf]=i.MIN,Ne[nl]=i.MAX;let ee={[uf]:i.ZERO,[Is]:i.ONE,[ff]:i.SRC_COLOR,[ih]:i.SRC_ALPHA,[_f]:i.SRC_ALPHA_SATURATE,[gf]:i.DST_COLOR,[pf]:i.DST_ALPHA,[df]:i.ONE_MINUS_SRC_COLOR,[wr]:i.ONE_MINUS_SRC_ALPHA,[xf]:i.ONE_MINUS_DST_COLOR,[mf]:i.ONE_MINUS_DST_ALPHA,[vf]:i.CONSTANT_COLOR,[yf]:i.ONE_MINUS_CONSTANT_COLOR,[Mf]:i.CONSTANT_ALPHA,[Sf]:i.ONE_MINUS_CONSTANT_ALPHA};function ve(V,At,lt,bt,Ct,pt,Kt,Ot,$t,Bt){if(V===Wn){x===!0&&(St(i.BLEND),x=!1);return}if(x===!1&&(et(i.BLEND),x=!0),V!==br){if(V!==p||Bt!==N){if((I!==di||b!==di)&&(i.blendEquation(i.FUNC_ADD),I=di,b=di),Bt)switch(V){case Sr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ps:i.blendFunc(i.ONE,i.ONE);break;case eh:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case nh:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:se("WebGLState: Invalid blending: ",V);break}else switch(V){case Sr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ps:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case eh:se("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case nh:se("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:se("WebGLState: Invalid blending: ",V);break}U=null,E=null,A=null,L=null,v.set(0,0,0),P=0,p=V,N=Bt}return}Ct=Ct||At,pt=pt||lt,Kt=Kt||bt,(At!==I||Ct!==b)&&(i.blendEquationSeparate(Ne[At],Ne[Ct]),I=At,b=Ct),(lt!==U||bt!==E||pt!==A||Kt!==L)&&(i.blendFuncSeparate(ee[lt],ee[bt],ee[pt],ee[Kt]),U=lt,E=bt,A=pt,L=Kt),(Ot.equals(v)===!1||$t!==P)&&(i.blendColor(Ot.r,Ot.g,Ot.b,$t),v.copy(Ot),P=$t),p=V,N=!1}function ye(V,At){V.side===fi?St(i.CULL_FACE):et(i.CULL_FACE);let lt=V.side===bn;At&&(lt=!lt),re(lt),V.blending===Sr&&V.transparent===!1?ve(Wn):ve(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),o.setFunc(V.depthFunc),o.setTest(V.depthTest),o.setMask(V.depthWrite),r.setMask(V.colorWrite);let bt=V.stencilWrite;a.setTest(bt),bt&&(a.setMask(V.stencilWriteMask),a.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),a.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),Ce(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?et(i.SAMPLE_ALPHA_TO_COVERAGE):St(i.SAMPLE_ALPHA_TO_COVERAGE)}function re(V){F!==V&&(V?i.frontFace(i.CW):i.frontFace(i.CCW),F=V)}function jt(V){V!==rf?(et(i.CULL_FACE),V!==O&&(V===th?i.cullFace(i.BACK):V===of?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):St(i.CULL_FACE),O=V}function Ue(V){V!==Y&&(ct&&i.lineWidth(V),Y=V)}function Ce(V,At,lt){V?(et(i.POLYGON_OFFSET_FILL),(z!==At||j!==lt)&&(z=At,j=lt,o.getReversed()&&(At=-At),i.polygonOffset(At,lt))):St(i.POLYGON_OFFSET_FILL)}function we(V){V?et(i.SCISSOR_TEST):St(i.SCISSOR_TEST)}function Ie(V){V===void 0&&(V=i.TEXTURE0+ht-1),dt!==V&&(i.activeTexture(V),dt=V)}function R(V,At,lt){lt===void 0&&(dt===null?lt=i.TEXTURE0+ht-1:lt=dt);let bt=xt[lt];bt===void 0&&(bt={type:void 0,texture:void 0},xt[lt]=bt),(bt.type!==V||bt.texture!==At)&&(dt!==lt&&(i.activeTexture(lt),dt=lt),i.bindTexture(V,At||W[V]),bt.type=V,bt.texture=At)}function Pt(){let V=xt[dt];V!==void 0&&V.type!==void 0&&(i.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function zt(){try{i.compressedTexImage2D(...arguments)}catch(V){se("WebGLState:",V)}}function T(){try{i.compressedTexImage3D(...arguments)}catch(V){se("WebGLState:",V)}}function m(){try{i.texSubImage2D(...arguments)}catch(V){se("WebGLState:",V)}}function H(){try{i.texSubImage3D(...arguments)}catch(V){se("WebGLState:",V)}}function X(){try{i.compressedTexSubImage2D(...arguments)}catch(V){se("WebGLState:",V)}}function tt(){try{i.compressedTexSubImage3D(...arguments)}catch(V){se("WebGLState:",V)}}function ft(){try{i.texStorage2D(...arguments)}catch(V){se("WebGLState:",V)}}function D(){try{i.texStorage3D(...arguments)}catch(V){se("WebGLState:",V)}}function k(){try{i.texImage2D(...arguments)}catch(V){se("WebGLState:",V)}}function at(){try{i.texImage3D(...arguments)}catch(V){se("WebGLState:",V)}}function Q(V){return f[V]!==void 0?f[V]:i.getParameter(V)}function Ut(V,At){f[V]!==At&&(i.pixelStorei(V,At),f[V]=At)}function wt(V){Ee.equals(V)===!1&&(i.scissor(V.x,V.y,V.z,V.w),Ee.copy(V))}function Et(V){pe.equals(V)===!1&&(i.viewport(V.x,V.y,V.z,V.w),pe.copy(V))}function Yt(V,At){let lt=c.get(At);lt===void 0&&(lt=new WeakMap,c.set(At,lt));let bt=lt.get(V);bt===void 0&&(bt=i.getUniformBlockIndex(At,V.name),lt.set(V,bt))}function Qt(V,At){let bt=c.get(At).get(V);l.get(At)!==bt&&(i.uniformBlockBinding(At,bt,V.__bindingPointIndex),l.set(At,bt))}function Mt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),o.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},f={},dt=null,xt={},u={},d=new WeakMap,g=[],M=null,x=!1,p=null,I=null,U=null,E=null,b=null,A=null,L=null,v=new ue(0,0,0),P=0,N=!1,F=null,O=null,Y=null,z=null,j=null,Ee.set(0,0,i.canvas.width,i.canvas.height),pe.set(0,0,i.canvas.width,i.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:et,disable:St,bindFramebuffer:vt,drawBuffers:yt,useProgram:Ft,setBlending:ve,setMaterial:ye,setFlipSided:re,setCullFace:jt,setLineWidth:Ue,setPolygonOffset:Ce,setScissorTest:we,activeTexture:Ie,bindTexture:R,unbindTexture:Pt,compressedTexImage2D:zt,compressedTexImage3D:T,texImage2D:k,texImage3D:at,pixelStorei:Ut,getParameter:Q,updateUBOMapping:Yt,uniformBlockBinding:Qt,texStorage2D:ft,texStorage3D:D,texSubImage2D:m,texSubImage3D:H,compressedTexSubImage2D:X,compressedTexSubImage3D:tt,scissor:wt,viewport:Et,reset:Mt}}function xv(i,t,e,n,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new qt,h=new WeakMap,f=new Set,u,d=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function M(T,m){return g?new OffscreenCanvas(T,m):fr("canvas")}function x(T,m,H){let X=1,tt=zt(T);if((tt.width>H||tt.height>H)&&(X=H/Math.max(tt.width,tt.height)),X<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){let ft=Math.floor(X*tt.width),D=Math.floor(X*tt.height);u===void 0&&(u=M(ft,D));let k=m?M(ft,D):u;return k.width=ft,k.height=D,k.getContext("2d").drawImage(T,0,0,ft,D),ie("WebGLRenderer: Texture has been resized from ("+tt.width+"x"+tt.height+") to ("+ft+"x"+D+")."),k}else return"data"in T&&ie("WebGLRenderer: Image in DataTexture is too big ("+tt.width+"x"+tt.height+")."),T;return T}function p(T){return T.generateMipmaps}function I(T){i.generateMipmap(T)}function U(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function E(T,m,H,X,tt,ft=!1){if(T!==null){if(i[T]!==void 0)return i[T];ie("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let D;X&&(D=t.get("EXT_texture_norm16"),D||ie("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let k=m;if(m===i.RED&&(H===i.FLOAT&&(k=i.R32F),H===i.HALF_FLOAT&&(k=i.R16F),H===i.UNSIGNED_BYTE&&(k=i.R8),H===i.UNSIGNED_SHORT&&D&&(k=D.R16_EXT),H===i.SHORT&&D&&(k=D.R16_SNORM_EXT)),m===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(k=i.R8UI),H===i.UNSIGNED_SHORT&&(k=i.R16UI),H===i.UNSIGNED_INT&&(k=i.R32UI),H===i.BYTE&&(k=i.R8I),H===i.SHORT&&(k=i.R16I),H===i.INT&&(k=i.R32I)),m===i.RG&&(H===i.FLOAT&&(k=i.RG32F),H===i.HALF_FLOAT&&(k=i.RG16F),H===i.UNSIGNED_BYTE&&(k=i.RG8),H===i.UNSIGNED_SHORT&&D&&(k=D.RG16_EXT),H===i.SHORT&&D&&(k=D.RG16_SNORM_EXT)),m===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(k=i.RG8UI),H===i.UNSIGNED_SHORT&&(k=i.RG16UI),H===i.UNSIGNED_INT&&(k=i.RG32UI),H===i.BYTE&&(k=i.RG8I),H===i.SHORT&&(k=i.RG16I),H===i.INT&&(k=i.RG32I)),m===i.RGB_INTEGER&&(H===i.UNSIGNED_BYTE&&(k=i.RGB8UI),H===i.UNSIGNED_SHORT&&(k=i.RGB16UI),H===i.UNSIGNED_INT&&(k=i.RGB32UI),H===i.BYTE&&(k=i.RGB8I),H===i.SHORT&&(k=i.RGB16I),H===i.INT&&(k=i.RGB32I)),m===i.RGBA_INTEGER&&(H===i.UNSIGNED_BYTE&&(k=i.RGBA8UI),H===i.UNSIGNED_SHORT&&(k=i.RGBA16UI),H===i.UNSIGNED_INT&&(k=i.RGBA32UI),H===i.BYTE&&(k=i.RGBA8I),H===i.SHORT&&(k=i.RGBA16I),H===i.INT&&(k=i.RGBA32I)),m===i.RGB&&(H===i.UNSIGNED_SHORT&&D&&(k=D.RGB16_EXT),H===i.SHORT&&D&&(k=D.RGB16_SNORM_EXT),H===i.UNSIGNED_INT_5_9_9_9_REV&&(k=i.RGB9_E5),H===i.UNSIGNED_INT_10F_11F_11F_REV&&(k=i.R11F_G11F_B10F)),m===i.RGBA){let at=ft?Jr:xe.getTransfer(tt);H===i.FLOAT&&(k=i.RGBA32F),H===i.HALF_FLOAT&&(k=i.RGBA16F),H===i.UNSIGNED_BYTE&&(k=at===Ae?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT&&D&&(k=D.RGBA16_EXT),H===i.SHORT&&D&&(k=D.RGBA16_SNORM_EXT),H===i.UNSIGNED_SHORT_4_4_4_4&&(k=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(k=i.RGB5_A1)}return(k===i.R16F||k===i.R32F||k===i.RG16F||k===i.RG32F||k===i.RGBA16F||k===i.RGBA32F)&&t.get("EXT_color_buffer_float"),k}function b(T,m){let H;return T?m===null||m===ni||m===Ar?H=i.DEPTH24_STENCIL8:m===ii?H=i.DEPTH32F_STENCIL8:m===Tr&&(H=i.DEPTH24_STENCIL8,ie("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):m===null||m===ni||m===Ar?H=i.DEPTH_COMPONENT24:m===ii?H=i.DEPTH_COMPONENT32F:m===Tr&&(H=i.DEPTH_COMPONENT16),H}function A(T,m){return p(T)===!0||T.isFramebufferTexture&&T.minFilter!==on&&T.minFilter!==qe?Math.log2(Math.max(m.width,m.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?m.mipmaps.length:1}function L(T){let m=T.target;m.removeEventListener("dispose",L),P(m),m.isVideoTexture&&h.delete(m),m.isHTMLTexture&&f.delete(m)}function v(T){let m=T.target;m.removeEventListener("dispose",v),F(m)}function P(T){let m=n.get(T);if(m.__webglInit===void 0)return;let H=T.source,X=d.get(H);if(X){let tt=X[m.__cacheKey];tt.usedTimes--,tt.usedTimes===0&&N(T),Object.keys(X).length===0&&d.delete(H)}n.remove(T)}function N(T){let m=n.get(T);i.deleteTexture(m.__webglTexture);let H=T.source,X=d.get(H);delete X[m.__cacheKey],o.memory.textures--}function F(T){let m=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(m.__webglFramebuffer[X]))for(let tt=0;tt<m.__webglFramebuffer[X].length;tt++)i.deleteFramebuffer(m.__webglFramebuffer[X][tt]);else i.deleteFramebuffer(m.__webglFramebuffer[X]);m.__webglDepthbuffer&&i.deleteRenderbuffer(m.__webglDepthbuffer[X])}else{if(Array.isArray(m.__webglFramebuffer))for(let X=0;X<m.__webglFramebuffer.length;X++)i.deleteFramebuffer(m.__webglFramebuffer[X]);else i.deleteFramebuffer(m.__webglFramebuffer);if(m.__webglDepthbuffer&&i.deleteRenderbuffer(m.__webglDepthbuffer),m.__webglMultisampledFramebuffer&&i.deleteFramebuffer(m.__webglMultisampledFramebuffer),m.__webglColorRenderbuffer)for(let X=0;X<m.__webglColorRenderbuffer.length;X++)m.__webglColorRenderbuffer[X]&&i.deleteRenderbuffer(m.__webglColorRenderbuffer[X]);m.__webglDepthRenderbuffer&&i.deleteRenderbuffer(m.__webglDepthRenderbuffer)}let H=T.textures;for(let X=0,tt=H.length;X<tt;X++){let ft=n.get(H[X]);ft.__webglTexture&&(i.deleteTexture(ft.__webglTexture),o.memory.textures--),n.remove(H[X])}n.remove(T)}let O=0;function Y(){O=0}function z(){return O}function j(T){O=T}function ht(){let T=O;return T>=s.maxTextures&&ie("WebGLTextures: Trying to use "+(T+1)+" texture units while this GPU supports only "+s.maxTextures),O+=1,T}function ct(T){let m=[];return m.push(T.wrapS),m.push(T.wrapT),m.push(T.wrapR||0),m.push(T.magFilter),m.push(T.minFilter),m.push(T.anisotropy),m.push(T.internalFormat),m.push(T.format),m.push(T.type),m.push(T.generateMipmaps),m.push(T.premultiplyAlpha),m.push(T.flipY),m.push(T.unpackAlignment),m.push(T.colorSpace),m.join()}function gt(T,m){let H=n.get(T);if(T.isVideoTexture&&R(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&H.__version!==T.version){let X=T.image;if(X===null)ie("WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)ie("WebGLRenderer: Texture marked for update but image is incomplete");else{St(H,T,m);return}}else T.isExternalTexture&&(H.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+m)}function ot(T,m){let H=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&H.__version!==T.version){St(H,T,m);return}else T.isExternalTexture&&(H.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+m)}function dt(T,m){let H=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&H.__version!==T.version){St(H,T,m);return}e.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+m)}function xt(T,m){let H=n.get(T);if(T.isCubeDepthTexture!==!0&&T.version>0&&H.__version!==T.version){vt(H,T,m);return}e.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+m)}let Zt={[Da]:i.REPEAT,[ci]:i.CLAMP_TO_EDGE,[Na]:i.MIRRORED_REPEAT},Xt={[on]:i.NEAREST,[Tf]:i.NEAREST_MIPMAP_NEAREST,[wo]:i.NEAREST_MIPMAP_LINEAR,[qe]:i.LINEAR,[rl]:i.LINEAR_MIPMAP_NEAREST,[is]:i.LINEAR_MIPMAP_LINEAR},Ee={[Rf]:i.NEVER,[Nf]:i.ALWAYS,[Pf]:i.LESS,[Hl]:i.LEQUAL,[If]:i.EQUAL,[Gl]:i.GEQUAL,[Lf]:i.GREATER,[Df]:i.NOTEQUAL};function pe(T,m){if(m.type===ii&&t.has("OES_texture_float_linear")===!1&&(m.magFilter===qe||m.magFilter===rl||m.magFilter===wo||m.magFilter===is||m.minFilter===qe||m.minFilter===rl||m.minFilter===wo||m.minFilter===is)&&ie("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,Zt[m.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,Zt[m.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,Zt[m.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,Xt[m.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,Xt[m.minFilter]),m.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,Ee[m.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(m.magFilter===on||m.minFilter!==wo&&m.minFilter!==is||m.type===ii&&t.has("OES_texture_float_linear")===!1)return;if(m.anisotropy>1||n.get(m).__currentAnisotropy){let H=t.get("EXT_texture_filter_anisotropic");i.texParameterf(T,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(m.anisotropy,s.getMaxAnisotropy())),n.get(m).__currentAnisotropy=m.anisotropy}}}function Me(T,m){let H=!1;T.__webglInit===void 0&&(T.__webglInit=!0,m.addEventListener("dispose",L));let X=m.source,tt=d.get(X);tt===void 0&&(tt={},d.set(X,tt));let ft=ct(m);if(ft!==T.__cacheKey){tt[ft]===void 0&&(tt[ft]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,H=!0),tt[ft].usedTimes++;let D=tt[T.__cacheKey];D!==void 0&&(tt[T.__cacheKey].usedTimes--,D.usedTimes===0&&N(m)),T.__cacheKey=ft,T.__webglTexture=tt[ft].texture}return H}function W(T,m,H){return Math.floor(Math.floor(T/H)/m)}function et(T,m,H,X){let ft=T.updateRanges;if(ft.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,m.width,m.height,H,X,m.data);else{ft.sort((Ut,wt)=>Ut.start-wt.start);let D=0;for(let Ut=1;Ut<ft.length;Ut++){let wt=ft[D],Et=ft[Ut],Yt=wt.start+wt.count,Qt=W(Et.start,m.width,4),Mt=W(wt.start,m.width,4);Et.start<=Yt+1&&Qt===Mt&&W(Et.start+Et.count-1,m.width,4)===Qt?wt.count=Math.max(wt.count,Et.start+Et.count-wt.start):(++D,ft[D]=Et)}ft.length=D+1;let k=e.getParameter(i.UNPACK_ROW_LENGTH),at=e.getParameter(i.UNPACK_SKIP_PIXELS),Q=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,m.width);for(let Ut=0,wt=ft.length;Ut<wt;Ut++){let Et=ft[Ut],Yt=Math.floor(Et.start/4),Qt=Math.ceil(Et.count/4),Mt=Yt%m.width,V=Math.floor(Yt/m.width),At=Qt,lt=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,Mt),e.pixelStorei(i.UNPACK_SKIP_ROWS,V),e.texSubImage2D(i.TEXTURE_2D,0,Mt,V,At,lt,H,X,m.data)}T.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,k),e.pixelStorei(i.UNPACK_SKIP_PIXELS,at),e.pixelStorei(i.UNPACK_SKIP_ROWS,Q)}}function St(T,m,H){let X=i.TEXTURE_2D;(m.isDataArrayTexture||m.isCompressedArrayTexture)&&(X=i.TEXTURE_2D_ARRAY),m.isData3DTexture&&(X=i.TEXTURE_3D);let tt=Me(T,m),ft=m.source;e.bindTexture(X,T.__webglTexture,i.TEXTURE0+H);let D=n.get(ft);if(ft.version!==D.__version||tt===!0){if(e.activeTexture(i.TEXTURE0+H),(typeof ImageBitmap<"u"&&m.image instanceof ImageBitmap)===!1){let lt=xe.getPrimaries(xe.workingColorSpace),bt=m.colorSpace===Ri?null:xe.getPrimaries(m.colorSpace),Ct=m.colorSpace===Ri||lt===bt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,m.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,m.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ct)}e.pixelStorei(i.UNPACK_ALIGNMENT,m.unpackAlignment);let at=x(m.image,!1,s.maxTextureSize);at=Pt(m,at);let Q=r.convert(m.format,m.colorSpace),Ut=r.convert(m.type),wt=E(m.internalFormat,Q,Ut,m.normalized,m.colorSpace,m.isVideoTexture);pe(X,m);let Et,Yt=m.mipmaps,Qt=m.isVideoTexture!==!0,Mt=D.__version===void 0||tt===!0,V=ft.dataReady,At=A(m,at);if(m.isDepthTexture)wt=b(m.format===ss,m.type),Mt&&(Qt?e.texStorage2D(i.TEXTURE_2D,1,wt,at.width,at.height):e.texImage2D(i.TEXTURE_2D,0,wt,at.width,at.height,0,Q,Ut,null));else if(m.isDataTexture)if(Yt.length>0){Qt&&Mt&&e.texStorage2D(i.TEXTURE_2D,At,wt,Yt[0].width,Yt[0].height);for(let lt=0,bt=Yt.length;lt<bt;lt++)Et=Yt[lt],Qt?V&&e.texSubImage2D(i.TEXTURE_2D,lt,0,0,Et.width,Et.height,Q,Ut,Et.data):e.texImage2D(i.TEXTURE_2D,lt,wt,Et.width,Et.height,0,Q,Ut,Et.data);m.generateMipmaps=!1}else Qt?(Mt&&e.texStorage2D(i.TEXTURE_2D,At,wt,at.width,at.height),V&&et(m,at,Q,Ut)):e.texImage2D(i.TEXTURE_2D,0,wt,at.width,at.height,0,Q,Ut,at.data);else if(m.isCompressedTexture)if(m.isCompressedArrayTexture){Qt&&Mt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,At,wt,Yt[0].width,Yt[0].height,at.depth);for(let lt=0,bt=Yt.length;lt<bt;lt++)if(Et=Yt[lt],m.format!==xn)if(Q!==null)if(Qt){if(V)if(m.layerUpdates.size>0){let Ct=Sh(Et.width,Et.height,m.format,m.type);for(let pt of m.layerUpdates){let Kt=Et.data.subarray(pt*Ct/Et.data.BYTES_PER_ELEMENT,(pt+1)*Ct/Et.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,lt,0,0,pt,Et.width,Et.height,1,Q,Kt)}}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,lt,0,0,0,Et.width,Et.height,at.depth,Q,Et.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,lt,wt,Et.width,Et.height,at.depth,0,Et.data,0,0);else ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Qt?V&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,lt,0,0,0,Et.width,Et.height,at.depth,Q,Ut,Et.data):e.texImage3D(i.TEXTURE_2D_ARRAY,lt,wt,Et.width,Et.height,at.depth,0,Q,Ut,Et.data);m.layerUpdates.size>0&&m.clearLayerUpdates()}else{Qt&&Mt&&e.texStorage2D(i.TEXTURE_2D,At,wt,Yt[0].width,Yt[0].height);for(let lt=0,bt=Yt.length;lt<bt;lt++)Et=Yt[lt],m.format!==xn?Q!==null?Qt?V&&e.compressedTexSubImage2D(i.TEXTURE_2D,lt,0,0,Et.width,Et.height,Q,Et.data):e.compressedTexImage2D(i.TEXTURE_2D,lt,wt,Et.width,Et.height,0,Et.data):ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Qt?V&&e.texSubImage2D(i.TEXTURE_2D,lt,0,0,Et.width,Et.height,Q,Ut,Et.data):e.texImage2D(i.TEXTURE_2D,lt,wt,Et.width,Et.height,0,Q,Ut,Et.data)}else if(m.isDataArrayTexture)if(Qt){if(Mt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,At,wt,at.width,at.height,at.depth),V)if(m.layerUpdates.size>0){let lt=Sh(at.width,at.height,m.format,m.type);for(let bt of m.layerUpdates){let Ct=at.data.subarray(bt*lt/at.data.BYTES_PER_ELEMENT,(bt+1)*lt/at.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,bt,at.width,at.height,1,Q,Ut,Ct)}m.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,at.width,at.height,at.depth,Q,Ut,at.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,wt,at.width,at.height,at.depth,0,Q,Ut,at.data);else if(m.isData3DTexture)Qt?(Mt&&e.texStorage3D(i.TEXTURE_3D,At,wt,at.width,at.height,at.depth),V&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,at.width,at.height,at.depth,Q,Ut,at.data)):e.texImage3D(i.TEXTURE_3D,0,wt,at.width,at.height,at.depth,0,Q,Ut,at.data);else if(m.isFramebufferTexture){if(Mt)if(Qt)e.texStorage2D(i.TEXTURE_2D,At,wt,at.width,at.height);else{let lt=at.width,bt=at.height;for(let Ct=0;Ct<At;Ct++)e.texImage2D(i.TEXTURE_2D,Ct,wt,lt,bt,0,Q,Ut,null),lt>>=1,bt>>=1}}else if(m.isHTMLTexture){if("texElementImage2D"in i){let lt=i.canvas;if(lt.hasAttribute("layoutsubtree")||lt.setAttribute("layoutsubtree","true"),at.parentNode!==lt){lt.appendChild(at),f.add(m),lt.onpaint=bt=>{let Ct=bt.changedElements;for(let pt of f)Ct.includes(pt.image)&&(pt.needsUpdate=!0)},lt.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,at);else{let Ct=i.RGBA,pt=i.RGBA,Kt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,Ct,pt,Kt,at)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(Yt.length>0){if(Qt&&Mt){let lt=zt(Yt[0]);e.texStorage2D(i.TEXTURE_2D,At,wt,lt.width,lt.height)}for(let lt=0,bt=Yt.length;lt<bt;lt++)Et=Yt[lt],Qt?V&&e.texSubImage2D(i.TEXTURE_2D,lt,0,0,Q,Ut,Et):e.texImage2D(i.TEXTURE_2D,lt,wt,Q,Ut,Et);m.generateMipmaps=!1}else if(Qt){if(Mt){let lt=zt(at);e.texStorage2D(i.TEXTURE_2D,At,wt,lt.width,lt.height)}V&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Q,Ut,at)}else e.texImage2D(i.TEXTURE_2D,0,wt,Q,Ut,at);p(m)&&I(X),D.__version=ft.version,m.onUpdate&&m.onUpdate(m)}T.__version=m.version}function vt(T,m,H){if(m.image.length!==6)return;let X=Me(T,m),tt=m.source;e.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+H);let ft=n.get(tt);if(tt.version!==ft.__version||X===!0){e.activeTexture(i.TEXTURE0+H);let D=xe.getPrimaries(xe.workingColorSpace),k=m.colorSpace===Ri?null:xe.getPrimaries(m.colorSpace),at=m.colorSpace===Ri||D===k?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,m.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,m.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,m.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,at);let Q=m.isCompressedTexture||m.image[0].isCompressedTexture,Ut=m.image[0]&&m.image[0].isDataTexture,wt=[];for(let pt=0;pt<6;pt++)!Q&&!Ut?wt[pt]=x(m.image[pt],!0,s.maxCubemapSize):wt[pt]=Ut?m.image[pt].image:m.image[pt],wt[pt]=Pt(m,wt[pt]);let Et=wt[0],Yt=r.convert(m.format,m.colorSpace),Qt=r.convert(m.type),Mt=E(m.internalFormat,Yt,Qt,m.normalized,m.colorSpace),V=m.isVideoTexture!==!0,At=ft.__version===void 0||X===!0,lt=tt.dataReady,bt=A(m,Et);pe(i.TEXTURE_CUBE_MAP,m);let Ct;if(Q){V&&At&&e.texStorage2D(i.TEXTURE_CUBE_MAP,bt,Mt,Et.width,Et.height);for(let pt=0;pt<6;pt++){Ct=wt[pt].mipmaps;for(let Kt=0;Kt<Ct.length;Kt++){let Ot=Ct[Kt];m.format!==xn?Yt!==null?V?lt&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Kt,0,0,Ot.width,Ot.height,Yt,Ot.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Kt,Mt,Ot.width,Ot.height,0,Ot.data):ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):V?lt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Kt,0,0,Ot.width,Ot.height,Yt,Qt,Ot.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Kt,Mt,Ot.width,Ot.height,0,Yt,Qt,Ot.data)}}}else{if(Ct=m.mipmaps,V&&At){Ct.length>0&&bt++;let pt=zt(wt[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,bt,Mt,pt.width,pt.height)}for(let pt=0;pt<6;pt++)if(Ut){V?lt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,0,0,wt[pt].width,wt[pt].height,Yt,Qt,wt[pt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,Mt,wt[pt].width,wt[pt].height,0,Yt,Qt,wt[pt].data);for(let Kt=0;Kt<Ct.length;Kt++){let $t=Ct[Kt].image[pt].image;V?lt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Kt+1,0,0,$t.width,$t.height,Yt,Qt,$t.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Kt+1,Mt,$t.width,$t.height,0,Yt,Qt,$t.data)}}else{V?lt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,0,0,Yt,Qt,wt[pt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,0,Mt,Yt,Qt,wt[pt]);for(let Kt=0;Kt<Ct.length;Kt++){let Ot=Ct[Kt];V?lt&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Kt+1,0,0,Yt,Qt,Ot.image[pt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+pt,Kt+1,Mt,Yt,Qt,Ot.image[pt])}}}p(m)&&I(i.TEXTURE_CUBE_MAP),ft.__version=tt.version,m.onUpdate&&m.onUpdate(m)}T.__version=m.version}function yt(T,m,H,X,tt,ft){let D=r.convert(H.format,H.colorSpace),k=r.convert(H.type),at=E(H.internalFormat,D,k,H.normalized,H.colorSpace),Q=n.get(m),Ut=n.get(H);if(Ut.__renderTarget=m,!Q.__hasExternalTextures){let wt=Math.max(1,m.width>>ft),Et=Math.max(1,m.height>>ft);tt===i.TEXTURE_3D||tt===i.TEXTURE_2D_ARRAY?e.texImage3D(tt,ft,at,wt,Et,m.depth,0,D,k,null):e.texImage2D(tt,ft,at,wt,Et,0,D,k,null)}e.bindFramebuffer(i.FRAMEBUFFER,T),Ie(m)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,X,tt,Ut.__webglTexture,0,we(m)):(tt===i.TEXTURE_2D||tt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&tt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,X,tt,Ut.__webglTexture,ft),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ft(T,m,H){if(i.bindRenderbuffer(i.RENDERBUFFER,T),m.depthBuffer){let X=m.depthTexture,tt=X&&X.isDepthTexture?X.type:null,ft=b(m.stencilBuffer,tt),D=m.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;Ie(m)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,we(m),ft,m.width,m.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,we(m),ft,m.width,m.height):i.renderbufferStorage(i.RENDERBUFFER,ft,m.width,m.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,D,i.RENDERBUFFER,T)}else{let X=m.textures;for(let tt=0;tt<X.length;tt++){let ft=X[tt],D=r.convert(ft.format,ft.colorSpace),k=r.convert(ft.type),at=E(ft.internalFormat,D,k,ft.normalized,ft.colorSpace);Ie(m)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,we(m),at,m.width,m.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,we(m),at,m.width,m.height):i.renderbufferStorage(i.RENDERBUFFER,at,m.width,m.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ne(T,m,H){let X=m.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,T),!(m.depthTexture&&m.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let tt=n.get(m.depthTexture);if(tt.__renderTarget=m,(!tt.__webglTexture||m.depthTexture.image.width!==m.width||m.depthTexture.image.height!==m.height)&&(m.depthTexture.image.width=m.width,m.depthTexture.image.height=m.height,m.depthTexture.needsUpdate=!0),X){if(tt.__webglInit===void 0&&(tt.__webglInit=!0,m.depthTexture.addEventListener("dispose",L)),tt.__webglTexture===void 0){tt.__webglTexture=i.createTexture(),e.bindTexture(i.TEXTURE_CUBE_MAP,tt.__webglTexture),pe(i.TEXTURE_CUBE_MAP,m.depthTexture);let Q=r.convert(m.depthTexture.format),Ut=r.convert(m.depthTexture.type),wt;m.depthTexture.format===hi?wt=i.DEPTH_COMPONENT24:m.depthTexture.format===ss&&(wt=i.DEPTH24_STENCIL8);for(let Et=0;Et<6;Et++)i.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Et,0,wt,m.width,m.height,0,Q,Ut,null)}}else gt(m.depthTexture,0);let ft=tt.__webglTexture,D=we(m),k=X?i.TEXTURE_CUBE_MAP_POSITIVE_X+H:i.TEXTURE_2D,at=m.depthTexture.format===ss?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(m.depthTexture.format===hi)Ie(m)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,at,k,ft,0,D):i.framebufferTexture2D(i.FRAMEBUFFER,at,k,ft,0);else if(m.depthTexture.format===ss)Ie(m)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,at,k,ft,0,D):i.framebufferTexture2D(i.FRAMEBUFFER,at,k,ft,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ee(T){let m=n.get(T),H=T.isWebGLCubeRenderTarget===!0;if(m.__boundDepthTexture!==T.depthTexture){let X=T.depthTexture;if(m.__depthDisposeCallback&&m.__depthDisposeCallback(),X){let tt=()=>{delete m.__boundDepthTexture,delete m.__depthDisposeCallback,X.removeEventListener("dispose",tt)};X.addEventListener("dispose",tt),m.__depthDisposeCallback=tt}m.__boundDepthTexture=X}if(T.depthTexture&&!m.__autoAllocateDepthBuffer)if(H)for(let X=0;X<6;X++)Ne(m.__webglFramebuffer[X],T,X);else{let X=T.texture.mipmaps;X&&X.length>0?Ne(m.__webglFramebuffer[0],T,0):Ne(m.__webglFramebuffer,T,0)}else if(H){m.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(e.bindFramebuffer(i.FRAMEBUFFER,m.__webglFramebuffer[X]),m.__webglDepthbuffer[X]===void 0)m.__webglDepthbuffer[X]=i.createRenderbuffer(),Ft(m.__webglDepthbuffer[X],T,!1);else{let tt=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ft=m.__webglDepthbuffer[X];i.bindRenderbuffer(i.RENDERBUFFER,ft),i.framebufferRenderbuffer(i.FRAMEBUFFER,tt,i.RENDERBUFFER,ft)}}else{let X=T.texture.mipmaps;if(X&&X.length>0?e.bindFramebuffer(i.FRAMEBUFFER,m.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,m.__webglFramebuffer),m.__webglDepthbuffer===void 0)m.__webglDepthbuffer=i.createRenderbuffer(),Ft(m.__webglDepthbuffer,T,!1);else{let tt=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ft=m.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,ft),i.framebufferRenderbuffer(i.FRAMEBUFFER,tt,i.RENDERBUFFER,ft)}}e.bindFramebuffer(i.FRAMEBUFFER,null)}function ve(T,m,H){let X=n.get(T);m!==void 0&&yt(X.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&ee(T)}function ye(T){let m=T.texture,H=n.get(T),X=n.get(m);T.addEventListener("dispose",v);let tt=T.textures,ft=T.isWebGLCubeRenderTarget===!0,D=tt.length>1;if(D||(X.__webglTexture===void 0&&(X.__webglTexture=i.createTexture()),X.__version=m.version,o.memory.textures++),ft){H.__webglFramebuffer=[];for(let k=0;k<6;k++)if(m.mipmaps&&m.mipmaps.length>0){H.__webglFramebuffer[k]=[];for(let at=0;at<m.mipmaps.length;at++)H.__webglFramebuffer[k][at]=i.createFramebuffer()}else H.__webglFramebuffer[k]=i.createFramebuffer()}else{if(m.mipmaps&&m.mipmaps.length>0){H.__webglFramebuffer=[];for(let k=0;k<m.mipmaps.length;k++)H.__webglFramebuffer[k]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(D)for(let k=0,at=tt.length;k<at;k++){let Q=n.get(tt[k]);Q.__webglTexture===void 0&&(Q.__webglTexture=i.createTexture(),o.memory.textures++)}if(T.samples>0&&Ie(T)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let k=0;k<tt.length;k++){let at=tt[k];H.__webglColorRenderbuffer[k]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[k]);let Q=r.convert(at.format,at.colorSpace),Ut=r.convert(at.type),wt=E(at.internalFormat,Q,Ut,at.normalized,at.colorSpace,T.isXRRenderTarget===!0),Et=we(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Et,wt,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+k,i.RENDERBUFFER,H.__webglColorRenderbuffer[k])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),Ft(H.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ft){e.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture),pe(i.TEXTURE_CUBE_MAP,m);for(let k=0;k<6;k++)if(m.mipmaps&&m.mipmaps.length>0)for(let at=0;at<m.mipmaps.length;at++)yt(H.__webglFramebuffer[k][at],T,m,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+k,at);else yt(H.__webglFramebuffer[k],T,m,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+k,0);p(m)&&I(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(D){for(let k=0,at=tt.length;k<at;k++){let Q=tt[k],Ut=n.get(Q),wt=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(wt=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(wt,Ut.__webglTexture),pe(wt,Q),yt(H.__webglFramebuffer,T,Q,i.COLOR_ATTACHMENT0+k,wt,0),p(Q)&&I(wt)}e.unbindTexture()}else{let k=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(k=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(k,X.__webglTexture),pe(k,m),m.mipmaps&&m.mipmaps.length>0)for(let at=0;at<m.mipmaps.length;at++)yt(H.__webglFramebuffer[at],T,m,i.COLOR_ATTACHMENT0,k,at);else yt(H.__webglFramebuffer,T,m,i.COLOR_ATTACHMENT0,k,0);p(m)&&I(k),e.unbindTexture()}T.depthBuffer&&ee(T)}function re(T){let m=T.textures;for(let H=0,X=m.length;H<X;H++){let tt=m[H];if(p(tt)){let ft=U(T),D=n.get(tt).__webglTexture;e.bindTexture(ft,D),I(ft),e.unbindTexture()}}}let jt=[],Ue=[];function Ce(T){if(T.samples>0){if(Ie(T)===!1){let m=T.textures,H=T.width,X=T.height,tt=i.COLOR_BUFFER_BIT,ft=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,D=n.get(T),k=m.length>1;if(k)for(let Q=0;Q<m.length;Q++)e.bindFramebuffer(i.FRAMEBUFFER,D.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Q,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,D.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Q,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,D.__webglMultisampledFramebuffer);let at=T.texture.mipmaps;at&&at.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,D.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,D.__webglFramebuffer);for(let Q=0;Q<m.length;Q++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(tt|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(tt|=i.STENCIL_BUFFER_BIT)),k){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,D.__webglColorRenderbuffer[Q]);let Ut=n.get(m[Q]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ut,0)}i.blitFramebuffer(0,0,H,X,0,0,H,X,tt,i.NEAREST),l===!0&&(jt.length=0,Ue.length=0,jt.push(i.COLOR_ATTACHMENT0+Q),T.depthBuffer&&T.storeMultisampledDepthBuffer===!1&&(jt.push(ft),Ue.push(ft),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ue)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,jt))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),k)for(let Q=0;Q<m.length;Q++){e.bindFramebuffer(i.FRAMEBUFFER,D.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Q,i.RENDERBUFFER,D.__webglColorRenderbuffer[Q]);let Ut=n.get(m[Q]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,D.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Q,i.TEXTURE_2D,Ut,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,D.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.storeMultisampledDepthBuffer===!1&&l){let m=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[m])}}}function we(T){return Math.min(s.maxSamples,T.samples)}function Ie(T){let m=n.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&m.__useRenderToTexture!==!1}function R(T){let m=o.render.frame;h.get(T)!==m&&(h.set(T,m),T.update())}function Pt(T,m){let H=T.colorSpace,X=T.format,tt=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||H!==Kr&&H!==Ri&&(xe.getTransfer(H)===Ae?(X!==xn||tt!==Fn)&&ie("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):se("WebGLTextures: Unsupported texture color space:",H)),m}function zt(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=ht,this.resetTextureUnits=Y,this.getTextureUnits=z,this.setTextureUnits=j,this.setTexture2D=gt,this.setTexture2DArray=ot,this.setTexture3D=dt,this.setTextureCube=xt,this.rebindTextures=ve,this.setupRenderTarget=ye,this.updateRenderTargetMipmap=re,this.updateMultisampleRenderTarget=Ce,this.setupDepthRenderbuffer=ee,this.setupFrameBufferTexture=yt,this.useMultisampledRTT=Ie,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function _v(i,t){function e(n,s=Ri){let r,o=xe.getTransfer(s);if(n===Fn)return i.UNSIGNED_BYTE;if(n===al)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ll)return i.UNSIGNED_SHORT_5_5_5_1;if(n===lh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===ch)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===oh)return i.BYTE;if(n===ah)return i.SHORT;if(n===Tr)return i.UNSIGNED_SHORT;if(n===ol)return i.INT;if(n===ni)return i.UNSIGNED_INT;if(n===ii)return i.FLOAT;if(n===Je)return i.HALF_FLOAT;if(n===hh)return i.ALPHA;if(n===uh)return i.RGB;if(n===xn)return i.RGBA;if(n===hi)return i.DEPTH_COMPONENT;if(n===ss)return i.DEPTH_STENCIL;if(n===fh)return i.RED;if(n===cl)return i.RED_INTEGER;if(n===rs)return i.RG;if(n===hl)return i.RG_INTEGER;if(n===ul)return i.RGBA_INTEGER;if(n===To||n===Ao||n===Eo||n===Co)if(o===Ae)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===To)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ao)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Eo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Co)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===To)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ao)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Eo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Co)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===fl||n===dl||n===pl||n===ml)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===fl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===dl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===pl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ml)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===gl||n===xl||n===_l||n===vl||n===yl||n===Ro||n===Ml)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===gl||n===xl)return o===Ae?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===_l)return o===Ae?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===vl)return r.COMPRESSED_R11_EAC;if(n===yl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Ro)return r.COMPRESSED_RG11_EAC;if(n===Ml)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Sl||n===bl||n===wl||n===Tl||n===Al||n===El||n===Cl||n===Rl||n===Pl||n===Il||n===Ll||n===Dl||n===Nl||n===Ul)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Sl)return o===Ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===bl)return o===Ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===wl)return o===Ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Tl)return o===Ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Al)return o===Ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===El)return o===Ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Cl)return o===Ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Rl)return o===Ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Pl)return o===Ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Il)return o===Ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ll)return o===Ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Dl)return o===Ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Nl)return o===Ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ul)return o===Ae?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Fl||n===Ol||n===Bl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Fl)return o===Ae?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ol)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Bl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===kl||n===zl||n===Po||n===Vl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===kl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===zl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Po)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Vl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ar?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var vv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,yv=`
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

}`,Vh=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new lo(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new Ve({vertexShader:vv,fragmentShader:yv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ze(new Ci(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Hh=class extends Qn{constructor(t,e){super();let n=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,f=null,u=null,d=null,g=null,M=typeof XRWebGLBinding<"u",x=new Vh,p={},I=e.getContextAttributes(),U=null,E=null,b=[],A=[],L=new qt,v=null,P=null,N=new un;N.viewport=new We;let F=new un;F.viewport=new We;let O=[N,F],Y=new tl,z=null,j=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let et=b[W];return et===void 0&&(et=new xr,b[W]=et),et.getTargetRaySpace()},this.getControllerGrip=function(W){let et=b[W];return et===void 0&&(et=new xr,b[W]=et),et.getGripSpace()},this.getHand=function(W){let et=b[W];return et===void 0&&(et=new xr,b[W]=et),et.getHandSpace()};function ht(W){let et=A.indexOf(W.inputSource);if(et===-1)return;let St=b[et];St!==void 0&&(St.update(W.inputSource,W.frame,c||o),St.dispatchEvent({type:W.type,data:W.inputSource}))}function ct(){s.removeEventListener("select",ht),s.removeEventListener("selectstart",ht),s.removeEventListener("selectend",ht),s.removeEventListener("squeeze",ht),s.removeEventListener("squeezestart",ht),s.removeEventListener("squeezeend",ht),s.removeEventListener("end",ct),s.removeEventListener("inputsourceschange",gt);for(let W=0;W<b.length;W++){let et=A[W];et!==null&&(A[W]=null,b[W].disconnect(et))}z=null,j=null,x.reset();for(let W in p)delete p[W];if(t.setRenderTarget(U),d=null,u=null,f=null,s=null,E=null,Me.stop(),n.isPresenting=!1,t.setPixelRatio(v),t.setSize(L.width,L.height,!1),P!==null){let W=P.camera;W.fov=P.fov,W.zoom=P.zoom,W.updateProjectionMatrix(),P=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){r=W,n.isPresenting===!0&&ie("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){a=W,n.isPresenting===!0&&ie("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(W){c=W},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f===null&&M&&(f=new XRWebGLBinding(s,e)),f},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(W){if(s=W,s!==null){if(U=t.getRenderTarget(),s.addEventListener("select",ht),s.addEventListener("selectstart",ht),s.addEventListener("selectend",ht),s.addEventListener("squeeze",ht),s.addEventListener("squeezestart",ht),s.addEventListener("squeezeend",ht),s.addEventListener("end",ct),s.addEventListener("inputsourceschange",gt),I.xrCompatible!==!0&&await e.makeXRCompatible(),v=t.getPixelRatio(),t.getSize(L),M&&"createProjectionLayer"in XRWebGLBinding.prototype){let St=null,vt=null,yt=null;I.depth&&(yt=I.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,St=I.stencil?ss:hi,vt=I.stencil?Ar:ni);let Ft={colorFormat:e.RGBA8,depthFormat:yt,scaleFactor:r};f=this.getBinding(),u=f.createProjectionLayer(Ft),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),E=new Ye(u.textureWidth,u.textureHeight,{format:xn,type:Fn,depthTexture:new Ji(u.textureWidth,u.textureHeight,vt,void 0,void 0,void 0,void 0,void 0,void 0,St),stencilBuffer:I.stencil,colorSpace:t.outputColorSpace,samples:I.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let St={antialias:I.antialias,alpha:!0,depth:I.depth,stencil:I.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,St),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),E=new Ye(d.framebufferWidth,d.framebufferHeight,{format:xn,type:Fn,colorSpace:t.outputColorSpace,stencilBuffer:I.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}E.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Me.setContext(s),Me.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function gt(W){for(let et=0;et<W.removed.length;et++){let St=W.removed[et],vt=A.indexOf(St);vt>=0&&(A[vt]=null,b[vt].disconnect(St))}for(let et=0;et<W.added.length;et++){let St=W.added[et],vt=A.indexOf(St);if(vt===-1){for(let Ft=0;Ft<b.length;Ft++)if(Ft>=A.length){A.push(St),vt=Ft;break}else if(A[Ft]===null){A[Ft]=St,vt=Ft;break}if(vt===-1)break}let yt=b[vt];yt&&yt.connect(St)}}let ot=new G,dt=new G;function xt(W,et,St){ot.setFromMatrixPosition(et.matrixWorld),dt.setFromMatrixPosition(St.matrixWorld);let vt=ot.distanceTo(dt),yt=et.projectionMatrix.elements,Ft=St.projectionMatrix.elements,Ne=yt[14]/(yt[10]-1),ee=yt[14]/(yt[10]+1),ve=(yt[9]+1)/yt[5],ye=(yt[9]-1)/yt[5],re=(yt[8]-1)/yt[0],jt=(Ft[8]+1)/Ft[0],Ue=Ne*re,Ce=Ne*jt,we=vt/(-re+jt),Ie=we*-re;if(et.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(Ie),W.translateZ(we),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert(),yt[10]===-1)W.projectionMatrix.copy(et.projectionMatrix),W.projectionMatrixInverse.copy(et.projectionMatrixInverse);else{let R=Ne+we,Pt=ee+we,zt=Ue-Ie,T=Ce+(vt-Ie),m=ve*ee/Pt*R,H=ye*ee/Pt*R;W.projectionMatrix.makePerspective(zt,T,m,H,R,Pt),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}}function Zt(W,et){et===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(et.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(s===null)return;let et=W.near,St=W.far;x.texture!==null&&(x.depthNear>0&&(et=x.depthNear),x.depthFar>0&&(St=x.depthFar)),Y.near=F.near=N.near=et,Y.far=F.far=N.far=St,(z!==Y.near||j!==Y.far)&&(s.updateRenderState({depthNear:Y.near,depthFar:Y.far}),z=Y.near,j=Y.far),Y.layers.mask=W.layers.mask|6,N.layers.mask=Y.layers.mask&-5,F.layers.mask=Y.layers.mask&-3;let vt=W.parent,yt=Y.cameras;Zt(Y,vt);for(let Ft=0;Ft<yt.length;Ft++)Zt(yt[Ft],vt);yt.length===2?xt(Y,N,F):Y.projectionMatrix.copy(N.projectionMatrix),P===null&&W.isPerspectiveCamera&&(P={camera:W,fov:W.fov,zoom:W.zoom}),Xt(W,Y,vt)};function Xt(W,et,St){St===null?W.matrix.copy(et.matrixWorld):(W.matrix.copy(St.matrixWorld),W.matrix.invert(),W.matrix.multiply(et.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(et.projectionMatrix),W.projectionMatrixInverse.copy(et.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=pr*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return Y},this.getFoveation=function(){if(!(u===null&&d===null))return l},this.setFoveation=function(W){l=W,u!==null&&(u.fixedFoveation=W),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=W)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(Y)},this.getCameraTexture=function(W){return p[W]};let Ee=null;function pe(W,et){if(h=et.getViewerPose(c||o),g=et,h!==null){let St=h.views;d!==null&&(t.setRenderTargetFramebuffer(E,d.framebuffer),t.setRenderTarget(E));let vt=!1;St.length!==Y.cameras.length&&(Y.cameras.length=0,vt=!0);for(let ee=0;ee<St.length;ee++){let ve=St[ee],ye=null;if(d!==null)ye=d.getViewport(ve);else{let jt=f.getViewSubImage(u,ve);ye=jt.viewport,ee===0&&(t.setRenderTargetTextures(E,jt.colorTexture,jt.depthStencilTexture),t.setRenderTarget(E))}let re=O[ee];re===void 0&&(re=new un,re.layers.enable(ee),re.viewport=new We,O[ee]=re),re.matrix.fromArray(ve.transform.matrix),re.matrix.decompose(re.position,re.quaternion,re.scale),re.projectionMatrix.fromArray(ve.projectionMatrix),re.projectionMatrixInverse.copy(re.projectionMatrix).invert(),re.viewport.set(ye.x,ye.y,ye.width,ye.height),ee===0&&(Y.matrix.copy(re.matrix),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale)),vt===!0&&Y.cameras.push(re)}let yt=s.enabledFeatures;if(yt&&yt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&M){f=n.getBinding();let ee=f.getDepthInformation(St[0]);ee&&ee.isValid&&ee.texture&&x.init(ee,s.renderState)}if(yt&&yt.includes("camera-access")&&M){t.state.unbindTexture(),f=n.getBinding();for(let ee=0;ee<St.length;ee++){let ve=St[ee].camera;if(ve){let ye=p[ve];ye||(ye=new lo,p[ve]=ye);let re=f.getCameraImage(ve);ye.sourceTexture=re}}}}for(let St=0;St<b.length;St++){let vt=A[St],yt=b[St];vt!==null&&yt!==void 0&&yt.update(vt,et,c||o)}Ee&&Ee(W,et),et.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:et}),g=null}let Me=new hd;Me.setAnimationLoop(pe),this.setAnimationLoop=function(W){Ee=W},this.dispose=function(){}}},Mv=new Ge,gd=new ce;gd.set(-1,0,0,0,1,0,0,0,1);function Sv(i,t){function e(x,p){x.matrixAutoUpdate===!0&&x.updateMatrix(),p.value.copy(x.matrix)}function n(x,p){p.color.getRGB(x.fogColor.value,vh(i)),p.isFog?(x.fogNear.value=p.near,x.fogFar.value=p.far):p.isFogExp2&&(x.fogDensity.value=p.density)}function s(x,p,I,U,E){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?r(x,p):p.isMeshLambertMaterial?(r(x,p),p.envMap&&(x.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(r(x,p),f(x,p)):p.isMeshPhongMaterial?(r(x,p),h(x,p),p.envMap&&(x.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(r(x,p),u(x,p),p.isMeshPhysicalMaterial&&d(x,p,E)):p.isMeshMatcapMaterial?(r(x,p),g(x,p)):p.isMeshDepthMaterial?r(x,p):p.isMeshDistanceMaterial?(r(x,p),M(x,p)):p.isMeshNormalMaterial?r(x,p):p.isLineBasicMaterial?(o(x,p),p.isLineDashedMaterial&&a(x,p)):p.isPointsMaterial?l(x,p,I,U):p.isSpriteMaterial?c(x,p):p.isShadowMaterial?(x.color.value.copy(p.color),x.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(x,p){x.opacity.value=p.opacity,p.color&&x.diffuse.value.copy(p.color),p.emissive&&x.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(x.map.value=p.map,e(p.map,x.mapTransform)),p.alphaMap&&(x.alphaMap.value=p.alphaMap,e(p.alphaMap,x.alphaMapTransform)),p.bumpMap&&(x.bumpMap.value=p.bumpMap,e(p.bumpMap,x.bumpMapTransform),x.bumpScale.value=p.bumpScale,p.side===bn&&(x.bumpScale.value*=-1)),p.normalMap&&(x.normalMap.value=p.normalMap,e(p.normalMap,x.normalMapTransform),x.normalScale.value.copy(p.normalScale),p.side===bn&&x.normalScale.value.negate()),p.displacementMap&&(x.displacementMap.value=p.displacementMap,e(p.displacementMap,x.displacementMapTransform),x.displacementScale.value=p.displacementScale,x.displacementBias.value=p.displacementBias),p.emissiveMap&&(x.emissiveMap.value=p.emissiveMap,e(p.emissiveMap,x.emissiveMapTransform)),p.specularMap&&(x.specularMap.value=p.specularMap,e(p.specularMap,x.specularMapTransform)),p.alphaTest>0&&(x.alphaTest.value=p.alphaTest);let I=t.get(p),U=I.envMap,E=I.envMapRotation;U&&(x.envMap.value=U,x.envMapRotation.value.setFromMatrix4(Mv.makeRotationFromEuler(E)).transpose(),U.isCubeTexture&&U.isRenderTargetTexture===!1&&x.envMapRotation.value.premultiply(gd),x.reflectivity.value=p.reflectivity,x.ior.value=p.ior,x.refractionRatio.value=p.refractionRatio),p.lightMap&&(x.lightMap.value=p.lightMap,x.lightMapIntensity.value=p.lightMapIntensity,e(p.lightMap,x.lightMapTransform)),p.aoMap&&(x.aoMap.value=p.aoMap,x.aoMapIntensity.value=p.aoMapIntensity,e(p.aoMap,x.aoMapTransform))}function o(x,p){x.diffuse.value.copy(p.color),x.opacity.value=p.opacity,p.map&&(x.map.value=p.map,e(p.map,x.mapTransform))}function a(x,p){x.dashSize.value=p.dashSize,x.totalSize.value=p.dashSize+p.gapSize,x.scale.value=p.scale}function l(x,p,I,U){x.diffuse.value.copy(p.color),x.opacity.value=p.opacity,x.size.value=p.size*I,x.scale.value=U*.5,p.map&&(x.map.value=p.map,e(p.map,x.uvTransform)),p.alphaMap&&(x.alphaMap.value=p.alphaMap,e(p.alphaMap,x.alphaMapTransform)),p.alphaTest>0&&(x.alphaTest.value=p.alphaTest)}function c(x,p){x.diffuse.value.copy(p.color),x.opacity.value=p.opacity,x.rotation.value=p.rotation,p.map&&(x.map.value=p.map,e(p.map,x.mapTransform)),p.alphaMap&&(x.alphaMap.value=p.alphaMap,e(p.alphaMap,x.alphaMapTransform)),p.alphaTest>0&&(x.alphaTest.value=p.alphaTest)}function h(x,p){x.specular.value.copy(p.specular),x.shininess.value=Math.max(p.shininess,1e-4)}function f(x,p){p.gradientMap&&(x.gradientMap.value=p.gradientMap)}function u(x,p){x.metalness.value=p.metalness,p.metalnessMap&&(x.metalnessMap.value=p.metalnessMap,e(p.metalnessMap,x.metalnessMapTransform)),x.roughness.value=p.roughness,p.roughnessMap&&(x.roughnessMap.value=p.roughnessMap,e(p.roughnessMap,x.roughnessMapTransform)),p.envMap&&(x.envMapIntensity.value=p.envMapIntensity)}function d(x,p,I){x.ior.value=p.ior,p.sheen>0&&(x.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),x.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(x.sheenColorMap.value=p.sheenColorMap,e(p.sheenColorMap,x.sheenColorMapTransform)),p.sheenRoughnessMap&&(x.sheenRoughnessMap.value=p.sheenRoughnessMap,e(p.sheenRoughnessMap,x.sheenRoughnessMapTransform))),p.clearcoat>0&&(x.clearcoat.value=p.clearcoat,x.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(x.clearcoatMap.value=p.clearcoatMap,e(p.clearcoatMap,x.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(x.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,e(p.clearcoatRoughnessMap,x.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(x.clearcoatNormalMap.value=p.clearcoatNormalMap,e(p.clearcoatNormalMap,x.clearcoatNormalMapTransform),x.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===bn&&x.clearcoatNormalScale.value.negate())),p.dispersion>0&&(x.dispersion.value=p.dispersion),p.retroreflectivity>0&&(x.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(x.iridescence.value=p.iridescence,x.iridescenceIOR.value=p.iridescenceIOR,x.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],x.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(x.iridescenceMap.value=p.iridescenceMap,e(p.iridescenceMap,x.iridescenceMapTransform)),p.iridescenceThicknessMap&&(x.iridescenceThicknessMap.value=p.iridescenceThicknessMap,e(p.iridescenceThicknessMap,x.iridescenceThicknessMapTransform))),p.transmission>0&&(x.transmission.value=p.transmission,x.transmissionSamplerMap.value=I.texture,x.transmissionSamplerSize.value.set(I.width,I.height),p.transmissionMap&&(x.transmissionMap.value=p.transmissionMap,e(p.transmissionMap,x.transmissionMapTransform)),x.thickness.value=p.thickness,p.thicknessMap&&(x.thicknessMap.value=p.thicknessMap,e(p.thicknessMap,x.thicknessMapTransform)),x.attenuationDistance.value=p.attenuationDistance,x.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(x.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(x.anisotropyMap.value=p.anisotropyMap,e(p.anisotropyMap,x.anisotropyMapTransform))),x.specularIntensity.value=p.specularIntensity,x.specularColor.value.copy(p.specularColor),p.specularColorMap&&(x.specularColorMap.value=p.specularColorMap,e(p.specularColorMap,x.specularColorMapTransform)),p.specularIntensityMap&&(x.specularIntensityMap.value=p.specularIntensityMap,e(p.specularIntensityMap,x.specularIntensityMapTransform))}function g(x,p){p.matcap&&(x.matcap.value=p.matcap)}function M(x,p){let I=t.get(p).light;x.referencePosition.value.setFromMatrixPosition(I.matrixWorld),x.nearDistance.value=I.shadow.camera.near,x.farDistance.value=I.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function bv(i,t,e,n){let s={},r={},o=[],a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(E,b){let A=b.program;n.uniformBlockBinding(E,A)}function c(E,b){let A=s[E.id];A===void 0&&(x(E),A=h(E),s[E.id]=A,E.addEventListener("dispose",I));let L=b.program;n.updateUBOMapping(E,L);let v=t.render.frame;r[E.id]!==v&&(u(E),r[E.id]=v)}function h(E){let b=f();E.__bindingPointIndex=b;let A=i.createBuffer(),L=E.__size,v=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,A),i.bufferData(i.UNIFORM_BUFFER,L,v),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,A),A}function f(){for(let E=0;E<a;E++)if(o.indexOf(E)===-1)return o.push(E),E;return se("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(E){let b=s[E.id],A=E.uniforms,L=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let v=0,P=A.length;v<P;v++){let N=A[v];if(Array.isArray(N))for(let F=0,O=N.length;F<O;F++)d(N[F],v,F,L);else d(N,v,0,L)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(E,b,A,L){if(M(E,b,A,L)===!0){let v=E.__offset,P=E.value;if(Array.isArray(P)){let N=0;for(let F=0;F<P.length;F++){let O=P[F],Y=p(O);g(O,E.__data,N),typeof O!="number"&&typeof O!="boolean"&&!O.isMatrix3&&!ArrayBuffer.isView(O)&&(N+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(P,E.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,v,E.__data)}}function g(E,b,A){typeof E=="number"||typeof E=="boolean"?b[0]=E:E.isMatrix3?(b[0]=E.elements[0],b[1]=E.elements[1],b[2]=E.elements[2],b[3]=0,b[4]=E.elements[3],b[5]=E.elements[4],b[6]=E.elements[5],b[7]=0,b[8]=E.elements[6],b[9]=E.elements[7],b[10]=E.elements[8],b[11]=0):ArrayBuffer.isView(E)?b.set(new E.constructor(E.buffer,E.byteOffset,b.length)):E.toArray(b,A)}function M(E,b,A,L){let v=E.value,P=b+"_"+A;if(L[P]===void 0)return typeof v=="number"||typeof v=="boolean"?L[P]=v:ArrayBuffer.isView(v)?L[P]=v.slice():L[P]=v.clone(),!0;{let N=L[P];if(typeof v=="number"||typeof v=="boolean"){if(N!==v)return L[P]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(N.equals(v)===!1)return N.copy(v),!0}}return!1}function x(E){let b=E.uniforms,A=0,L=16;for(let P=0,N=b.length;P<N;P++){let F=Array.isArray(b[P])?b[P]:[b[P]];for(let O=0,Y=F.length;O<Y;O++){let z=F[O],j=Array.isArray(z.value)?z.value:[z.value];for(let ht=0,ct=j.length;ht<ct;ht++){let gt=j[ht],ot=p(gt),dt=A%L,xt=dt%ot.boundary,Zt=dt+xt;A+=xt,Zt!==0&&L-Zt<ot.storage&&(A+=L-Zt),z.__data=new Float32Array(ot.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=A,A+=ot.storage}}}let v=A%L;return v>0&&(A+=L-v),E.__size=A,E.__cache={},this}function p(E){let b={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(b.boundary=4,b.storage=4):E.isVector2?(b.boundary=8,b.storage=8):E.isVector3||E.isColor?(b.boundary=16,b.storage=12):E.isVector4?(b.boundary=16,b.storage=16):E.isMatrix3?(b.boundary=48,b.storage=48):E.isMatrix4?(b.boundary=64,b.storage=64):E.isTexture?ie("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(E)?(b.boundary=16,b.storage=E.byteLength):ie("WebGLRenderer: Unsupported uniform value type.",E),b}function I(E){let b=E.target;b.removeEventListener("dispose",I);let A=o.indexOf(b.__bindingPointIndex);o.splice(A,1),i.deleteBuffer(s[b.id]),delete s[b.id],delete r[b.id]}function U(){for(let E in s)i.deleteBuffer(s[E]);o=[],s={},r={}}return{bind:l,update:c,dispose:U}}var wv=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),pi=null;function Tv(){return pi===null&&(pi=new Ki(wv,16,16,rs,Je),pi.name="DFG_LUT",pi.minFilter=qe,pi.magFilter=qe,pi.wrapS=ci,pi.wrapT=ci,pi.generateMipmaps=!1,pi.needsUpdate=!0),pi}var $l=class{constructor(t={}){let{canvas:e=Ff(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1,outputBufferType:d=Fn}=t;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=o;let M=d,x=new Set([ul,hl,cl]),p=new Set([Fn,ni,Tr,Ar,al,ll]),I=new Uint32Array(4),U=new Int32Array(4),E=new G,b=null,A=null,L=[],v=[],P=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ei,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let N=this,F=!1,O=null,Y=null,z=null,j=null;this._outputColorSpace=cn;let ht=0,ct=0,gt=null,ot=-1,dt=null,xt=new We,Zt=new We,Xt=null,Ee=new ue(0),pe=0,Me=e.width,W=e.height,et=1,St=null,vt=null,yt=new We(0,0,Me,W),Ft=new We(0,0,Me,W),Ne=!1,ee=new so,ve=!1,ye=!1,re=new Ge,jt=new G,Ue=new We,Ce={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},we=!1;function Ie(){return gt===null?et:1}let R=n;function Pt(y,B){return e.getContext(y,B)}let zt,T,m,H,X,tt,ft,D,k,at,Q,Ut,wt,Et,Yt,Qt,Mt,V,At,lt,bt,Ct,pt;try{let y={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",$t,!1),e.addEventListener("webglcontextrestored",Bt,!1),e.addEventListener("webglcontextcreationerror",me,!1),R===null){let B="webgl2";if(R=Pt(B,y),R===null)throw Pt(B)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Kt()}catch(y){throw e.removeEventListener("webglcontextlost",$t,!1),e.removeEventListener("webglcontextrestored",Bt,!1),e.removeEventListener("webglcontextcreationerror",me,!1),se("WebGLRenderer: "+y.message),y}function Kt(){zt=new Lx(R),zt.init(),bt=new _v(R,zt),T=new Sx(R,zt,t,bt),m=new gv(R,zt),T.reversedDepthBuffer&&u&&m.buffers.depth.setReversed(!0),Y=R.createFramebuffer(),z=R.createFramebuffer(),j=R.createFramebuffer(),H=new Ux(R),X=new nv,tt=new xv(R,zt,m,X,T,bt,H),ft=new Ix(N),D=new Om(R),Ct=new yx(R,D),k=new Dx(R,D,H,Ct),at=new Ox(R,k,D,Ct,H),V=new Fx(R,T,tt),Yt=new bx(X),Q=new ev(N,ft,zt,T,Ct,Yt),Ut=new Sv(N,X),wt=new sv,Et=new hv(zt),Mt=new vx(N,ft,m,at,g,l),Qt=new mv(N,at,T),pt=new bv(R,H,T,m),At=new Mx(R,zt,H),lt=new Nx(R,zt,H),H.programs=Q.programs,N.capabilities=T,N.extensions=zt,N.properties=X,N.renderLists=wt,N.shadowMap=Qt,N.state=m,N.info=H}M!==Fn&&(P=new kx(M,e.width,e.height,a,s,r));let Ot=new Hh(N,R);this.xr=Ot,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){let y=zt.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){let y=zt.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return et},this.setPixelRatio=function(y){y!==void 0&&(et=y,this.setSize(Me,W,!1))},this.getSize=function(y){return y.set(Me,W)},this.setSize=function(y,B,J=!0){if(Ot.isPresenting){ie("WebGLRenderer: Can't change size while VR device is presenting.");return}Me=y,W=B,e.width=Math.floor(y*et),e.height=Math.floor(B*et),J===!0&&(e.style.width=y+"px",e.style.height=B+"px"),P!==null&&P.setSize(e.width,e.height),this.setViewport(0,0,y,B)},this.getDrawingBufferSize=function(y){return y.set(Me*et,W*et).floor()},this.setDrawingBufferSize=function(y,B,J){Me=y,W=B,et=J,e.width=Math.floor(y*J),e.height=Math.floor(B*J),this.setViewport(0,0,y,B)},this.setEffects=function(y){if(M===Fn){se("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(y){for(let B=0;B<y.length;B++)if(y[B].isOutputPass===!0){ie("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}P.setEffects(y||[])},this.getCurrentViewport=function(y){return y.copy(xt)},this.getViewport=function(y){return y.copy(yt)},this.setViewport=function(y,B,J,Z){y.isVector4?yt.set(y.x,y.y,y.z,y.w):yt.set(y,B,J,Z),m.viewport(xt.copy(yt).multiplyScalar(et).round())},this.getScissor=function(y){return y.copy(Ft)},this.setScissor=function(y,B,J,Z){y.isVector4?Ft.set(y.x,y.y,y.z,y.w):Ft.set(y,B,J,Z),m.scissor(Zt.copy(Ft).multiplyScalar(et).round())},this.getScissorTest=function(){return Ne},this.setScissorTest=function(y){m.setScissorTest(Ne=y)},this.setOpaqueSort=function(y){St=y},this.setTransparentSort=function(y){vt=y},this.getClearColor=function(y){return y.copy(Mt.getClearColor())},this.setClearColor=function(){Mt.setClearColor(...arguments)},this.getClearAlpha=function(){return Mt.getClearAlpha()},this.setClearAlpha=function(){Mt.setClearAlpha(...arguments)},this.clear=function(y=!0,B=!0,J=!0){let Z=0;if(y){let K=!1;if(gt!==null){let Tt=gt.texture.format;K=x.has(Tt)}if(K){let Tt=gt.texture.type,kt=p.has(Tt),Rt=Mt.getClearColor(),Ht=Mt.getClearAlpha(),Wt=Rt.r,ae=Rt.g,fe=Rt.b;kt?(I[0]=Wt,I[1]=ae,I[2]=fe,I[3]=Ht,R.clearBufferuiv(R.COLOR,0,I)):(U[0]=Wt,U[1]=ae,U[2]=fe,U[3]=Ht,R.clearBufferiv(R.COLOR,0,U))}else Z|=R.COLOR_BUFFER_BIT}B&&(Z|=R.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),J&&(Z|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),Z!==0&&R.clear(Z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(y){y.setRenderer(this),O=y},this.dispose=function(){e.removeEventListener("webglcontextlost",$t,!1),e.removeEventListener("webglcontextrestored",Bt,!1),e.removeEventListener("webglcontextcreationerror",me,!1),Mt.dispose(),wt.dispose(),Et.dispose(),X.dispose(),ft.dispose(),at.dispose(),Ct.dispose(),pt.dispose(),Q.dispose(),Ot.dispose(),Ot.removeEventListener("sessionstart",Tn),Ot.removeEventListener("sessionend",Fi),Xn.stop()};function $t(y){y.preventDefault(),gh("WebGLRenderer: Context Lost."),F=!0}function Bt(){gh("WebGLRenderer: Context Restored."),F=!1;let y=H.autoReset,B=Qt.enabled,J=Qt.autoUpdate,Z=Qt.needsUpdate,K=Qt.type;Kt(),H.autoReset=y,Qt.enabled=B,Qt.autoUpdate=J,Qt.needsUpdate=Z,Qt.type=K}function me(y){se("WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function $e(y){let B=y.target;B.removeEventListener("dispose",$e),hs(B)}function hs(y){Se(y),X.remove(y)}function Se(y){let B=X.get(y).programs;B!==void 0&&(B.forEach(function(J){Q.releaseProgram(J)}),y.isShaderMaterial&&Q.releaseShaderCache(y))}this.renderBufferDirect=function(y,B,J,Z,K,Tt){B===null&&(B=Ce);let kt=K.isMesh&&K.matrixWorld.determinantAffine()<0,Rt=xc(y,B,J,Z,K);m.setMaterial(Z,kt);let Ht=J.index,Wt=1;if(Z.wireframe===!0){if(Ht=k.getWireframeAttribute(J),Ht===void 0)return;Wt=2}let ae=J.drawRange,fe=J.attributes.position,Gt=ae.start*Wt,Te=(ae.start+ae.count)*Wt;Tt!==null&&(Gt=Math.max(Gt,Tt.start*Wt),Te=Math.min(Te,(Tt.start+Tt.count)*Wt)),Ht!==null?(Gt=Math.max(Gt,0),Te=Math.min(Te,Ht.count)):fe!=null&&(Gt=Math.max(Gt,0),Te=Math.min(Te,fe.count));let Be=Te-Gt;if(Be<0||Be===1/0)return;Ct.setup(K,Z,Rt,J,Ht);let Re,he=At;if(Ht!==null&&(Re=D.get(Ht),he=lt,he.setIndex(Re)),K.isMesh)Z.wireframe===!0?(m.setLineWidth(Z.wireframeLinewidth*Ie()),he.setMode(R.LINES)):he.setMode(R.TRIANGLES);else if(K.isLine){let He=Z.linewidth;He===void 0&&(He=1),m.setLineWidth(He*Ie()),K.isLineSegments?he.setMode(R.LINES):K.isLineLoop?he.setMode(R.LINE_LOOP):he.setMode(R.LINE_STRIP)}else K.isPoints?he.setMode(R.POINTS):K.isSprite&&he.setMode(R.TRIANGLES);if(K.isBatchedMesh)if(zt.get("WEBGL_multi_draw"))he.renderMultiDraw(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount);else{let He=K._multiDrawStarts,Nt=K._multiDrawCounts,ln=K._multiDrawCount,ge=Ht?D.get(Ht).bytesPerElement:1,fn=X.get(Z).currentProgram.getUniforms();for(let Vn=0;Vn<ln;Vn++)fn.setValue(R,"_gl_DrawID",Vn),he.render(He[Vn]/ge,Nt[Vn])}else if(K.isInstancedMesh)he.renderInstances(Gt,Be,K.count);else if(J.isInstancedBufferGeometry){let He=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,Nt=Math.min(J.instanceCount,He);he.renderInstances(Gt,Be,Nt)}else he.render(Gt,Be)};function Cn(y,B,J,Z){O!==null&&y.isNodeMaterial&&O.setObject(Z,y),ve===!0&&Yt.setState(y,J,!1),y.transparent===!0&&y.side===fi&&y.forceSinglePass===!1?(y.side=bn,y.needsUpdate=!0,fs(y,B,Z),y.side=es,y.needsUpdate=!0,fs(y,B,Z),y.side=fi):fs(y,B,Z)}this.compile=function(y,B,J=null){J===null&&(J=y),O!==null&&O.renderStart(y,B,J),A=Et.get(J),A.init(B),v.push(A),J.traverseVisible(function(K){K.isLight&&K.layers.test(B.layers)&&(A.pushLight(K),K.castShadow&&A.pushShadow(K))}),y!==J&&y.traverseVisible(function(K){K.isLight&&K.layers.test(B.layers)&&(A.pushLight(K),K.castShadow&&A.pushShadow(K))}),A.setupLights(),O!==null&&O.updateLights(A.state.lightsArray),ye=this.localClippingEnabled,ve=Yt.init(this.clippingPlanes,ye),ve===!0&&Yt.setGlobalState(this.clippingPlanes,B),O!==null&&Qt.render(A.state.shadowsArray,J,B);let Z=new Set;return y.traverse(function(K){if(!(K.isMesh||K.isPoints||K.isLine||K.isSprite))return;let Tt=K.material;if(Tt)if(Array.isArray(Tt))for(let kt=0;kt<Tt.length;kt++){let Rt=Tt[kt];Cn(Rt,J,B,K),Z.add(Rt)}else Cn(Tt,J,B,K),Z.add(Tt)}),A=v.pop(),O!==null&&O.renderEnd(),Z},this.compileAsync=function(y,B,J=null){let Z=this.compile(y,B,J);return new Promise(K=>{function Tt(){if(Z.forEach(function(kt){let Ht=X.get(kt).currentProgram;(Ht===void 0||Ht.isReady())&&Z.delete(kt)}),Z.size===0){K(y);return}setTimeout(Tt,10)}zt.get("KHR_parallel_shader_compile")!==null?Tt():setTimeout(Tt,10)})};let ne=null;function an(y){ne&&ne(y)}function Tn(){Xn.stop()}function Fi(){Xn.start()}let Xn=new hd;Xn.setAnimationLoop(an),typeof self<"u"&&Xn.setContext(self),this.setAnimationLoop=function(y){ne=y,Ot.setAnimationLoop(y),y===null?Xn.stop():Xn.start()},Ot.addEventListener("sessionstart",Tn),Ot.addEventListener("sessionend",Fi),this.render=function(y,B){if(B!==void 0&&B.isCamera!==!0){se("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===!0)return;O!==null&&O.renderStart(y,B);let J=Ot.enabled===!0&&Ot.isPresenting===!0,Z=P!==null&&(gt===null||J)&&P.begin(N,gt);if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),Ot.enabled===!0&&Ot.isPresenting===!0&&(P===null||P.isCompositing()===!1)&&(Ot.cameraAutoUpdate===!0&&Ot.updateCamera(B),B=Ot.getCamera()),y.isScene===!0&&y.onBeforeRender(N,y,B,gt),A=Et.get(y,v.length),A.init(B),A.state.textureUnits=tt.getTextureUnits(),v.push(A),re.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),ee.setFromProjectionMatrix(re,jn,B.reversedDepth),ye=this.localClippingEnabled,ve=Yt.init(this.clippingPlanes,ye),b=wt.get(y,L.length),b.init(),L.push(b),Ot.enabled===!0&&Ot.isPresenting===!0){let kt=N.xr.getDepthSensingMesh();kt!==null&&us(kt,B,-1/0,N.sortObjects)}us(y,B,0,N.sortObjects),b.finish(),O!==null&&O.updateLights(A.state.lightsArray),N.sortObjects===!0&&b.sort(St,vt),we=Ot.enabled===!1||Ot.isPresenting===!1||Ot.hasDepthSensing()===!1,we&&Mt.addToRenderList(b,y),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),ve===!0&&Yt.beginShadows();let K=A.state.shadowsArray;if(Qt.render(K,y,B),ve===!0&&Yt.endShadows(),(Z&&P.hasRenderPass())===!1){let kt=b.opaque,Rt=b.transmissive;if(A.setupLights(),B.isArrayCamera){let Ht=B.cameras;if(Rt.length>0)for(let Wt=0,ae=Ht.length;Wt<ae;Wt++){let fe=Ht[Wt];Ho(kt,Rt,y,fe)}we&&Mt.render(y);for(let Wt=0,ae=Ht.length;Wt<ae;Wt++){let fe=Ht[Wt];oi(b,y,fe,fe.viewport)}}else Rt.length>0&&Ho(kt,Rt,y,B),we&&Mt.render(y),oi(b,y,B)}gt!==null&&ct===0&&(tt.updateMultisampleRenderTarget(gt),tt.updateRenderTargetMipmap(gt)),Z&&P.end(N),y.isScene===!0&&y.onAfterRender(N,y,B),Ct.resetDefaultState(),ot=-1,dt=null,v.pop(),v.length>0?(A=v[v.length-1],tt.setTextureUnits(A.state.textureUnits),ve===!0&&Yt.setGlobalState(N.clippingPlanes,A.state.camera)):A=null,L.pop(),L.length>0?b=L[L.length-1]:b=null,O!==null&&O.renderEnd()};function us(y,B,J,Z){if(y.visible===!1)return;if(y.layers.test(B.layers)){if(y.isGroup)J=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(B);else if(y.isLightProbeGrid)A.pushLightProbeGrid(y);else if(y.isLight)A.pushLight(y),y.castShadow&&A.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||y.intersectsFrustum(ee)){Z&&Ue.setFromMatrixPosition(y.matrixWorld).applyMatrix4(re);let kt=at.update(y),Rt=y.material;Rt.visible&&b.push(y,kt,Rt,J,Ue.z,null,B)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||y.intersectsFrustum(ee))){let kt=at.update(y),Rt=y.material;if(Z&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),Ue.copy(y.boundingSphere.center)):(kt.boundingSphere===null&&kt.computeBoundingSphere(),Ue.copy(kt.boundingSphere.center)),Ue.applyMatrix4(y.matrixWorld).applyMatrix4(re)),Array.isArray(Rt)){let Ht=kt.groups;for(let Wt=0,ae=Ht.length;Wt<ae;Wt++){let fe=Ht[Wt],Gt=Rt[fe.materialIndex];Gt&&Gt.visible&&b.push(y,kt,Gt,J,Ue.z,fe,B)}}else Rt.visible&&b.push(y,kt,Rt,J,Ue.z,null,B)}}let Tt=y.children;for(let kt=0,Rt=Tt.length;kt<Rt;kt++)us(Tt[kt],B,J,Z)}function oi(y,B,J,Z){let{opaque:K,transmissive:Tt,transparent:kt}=y;A.setupLightsView(J),ve===!0&&Yt.setGlobalState(N.clippingPlanes,J),Z&&m.viewport(xt.copy(Z)),K.length>0&&Oi(K,B,J),Tt.length>0&&Oi(Tt,B,J),kt.length>0&&Oi(kt,B,J),m.buffers.depth.setTest(!0),m.buffers.depth.setMask(!0),m.buffers.color.setMask(!0),m.setPolygonOffset(!1)}function Ho(y,B,J,Z){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;if(A.state.transmissionRenderTarget[Z.id]===void 0){let Gt=zt.has("EXT_color_buffer_half_float")||zt.has("EXT_color_buffer_float");A.state.transmissionRenderTarget[Z.id]=new Ye(1,1,{generateMipmaps:!0,type:Gt?Je:Fn,minFilter:is,samples:Math.max(4,T.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:xe.workingColorSpace})}let Tt=A.state.transmissionRenderTarget[Z.id],kt=Z.viewport||xt;Tt.setSize(kt.z*N.transmissionResolutionScale,kt.w*N.transmissionResolutionScale);let Rt=N.getRenderTarget(),Ht=N.getActiveCubeFace(),Wt=N.getActiveMipmapLevel();N.setRenderTarget(Tt),N.getClearColor(Ee),pe=N.getClearAlpha(),pe<1&&N.setClearColor(16777215,.5),N.clear(),we&&Mt.render(J);let ae=N.toneMapping;N.toneMapping=ei;let fe=Z.viewport;if(Z.viewport!==void 0&&(Z.viewport=void 0),A.setupLightsView(Z),ve===!0&&Yt.setGlobalState(N.clippingPlanes,Z),Oi(y,J,Z),tt.updateMultisampleRenderTarget(Tt),tt.updateRenderTargetMipmap(Tt),zt.has("WEBGL_multisampled_render_to_texture")===!1){let Gt=!1;for(let Te=0,Be=B.length;Te<Be;Te++){let Re=B[Te],{object:he,geometry:He,material:Nt,group:ln}=Re;if(Nt.side===fi&&he.layers.test(Z.layers)){let ge=Nt.side;Nt.side=bn,Nt.needsUpdate=!0,qs(he,J,Z,He,Nt,ln),Nt.side=ge,Nt.needsUpdate=!0,Gt=!0}}Gt===!0&&(tt.updateMultisampleRenderTarget(Tt),tt.updateRenderTargetMipmap(Tt))}N.setRenderTarget(Rt,Ht,Wt),N.setClearColor(Ee,pe),fe!==void 0&&(Z.viewport=fe),N.toneMapping=ae}function Oi(y,B,J){let Z=B.isScene===!0?B.overrideMaterial:null;for(let K=0,Tt=y.length;K<Tt;K++){let kt=y[K],{object:Rt,geometry:Ht,group:Wt}=kt,ae=kt.material;ae.allowOverride===!0&&Z!==null&&(ae=Z),Rt.layers.test(J.layers)&&qs(Rt,B,J,Ht,ae,Wt)}}function qs(y,B,J,Z,K,Tt){O!==null&&K.isNodeMaterial&&O.setObject(y,K),y.onBeforeRender(N,B,J,Z,K,Tt),y.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),K.onBeforeRender(N,B,J,Z,y,Tt),K.transparent===!0&&K.side===fi&&K.forceSinglePass===!1?(K.side=bn,K.needsUpdate=!0,N.renderBufferDirect(J,B,Z,K,y,Tt),K.side=es,K.needsUpdate=!0,N.renderBufferDirect(J,B,Z,K,y,Tt),K.side=fi):N.renderBufferDirect(J,B,Z,K,y,Tt),y.onAfterRender(N,B,J,Z,K,Tt)}function fs(y,B,J){B.isScene!==!0&&(B=Ce);let Z=X.get(y),K=A.state.lights,Tt=A.state.shadowsArray,kt=K.state.version,Rt=Q.getParameters(y,K.state,Tt,B,J,A.state.lightProbeGridArray),Ht=Q.getProgramCacheKey(Rt),Wt=Z.programs;Z.environment=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?B.environment:null,Z.fog=B.fog;let ae=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap;Z.envMap=ft.get(y.envMap||Z.environment,ae),Z.envMapRotation=Z.environment!==null&&y.envMap===null?B.environmentRotation:y.envMapRotation,Wt===void 0&&(y.addEventListener("dispose",$e),Wt=new Map,Z.programs=Wt);let fe=Wt.get(Ht);if(fe!==void 0){if(Z.currentProgram===fe&&Z.lightsStateVersion===kt)return zn(y,Rt),fe}else Rt.uniforms=Q.getUniforms(y),O!==null&&y.isNodeMaterial&&O.build(y,J,Rt),y.onBeforeCompile(Rt,N),fe=Q.acquireProgram(Rt,Ht),Wt.set(Ht,fe),Z.uniforms=Rt.uniforms;let Gt=Z.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(Gt.clippingPlanes=Yt.uniform),zn(y,Rt),Z.needsLights=vi(y),Z.lightsStateVersion=kt,Z.needsLights&&(Gt.ambientLightColor.value=K.state.ambient,Gt.lightProbe.value=K.state.probe,Gt.sunLights.value=K.state.sun,Gt.sunLightShadows.value=K.state.sunShadow,Gt.directionalLights.value=K.state.directional,Gt.directionalLightShadows.value=K.state.directionalShadow,Gt.spotLights.value=K.state.spot,Gt.spotLightShadows.value=K.state.spotShadow,Gt.rectAreaLights.value=K.state.rectArea,Gt.ltc_1.value=K.state.rectAreaLTC1,Gt.ltc_2.value=K.state.rectAreaLTC2,Gt.pointLights.value=K.state.point,Gt.pointLightShadows.value=K.state.pointShadow,Gt.hemisphereLights.value=K.state.hemi,Gt.sunShadowMatrix.value=K.state.sunShadowMatrix,Gt.sunShadowCascade.value=K.state.sunShadowCascade,Gt.directionalShadowMatrix.value=K.state.directionalShadowMatrix,Gt.spotLightMatrix.value=K.state.spotLightMatrix,Gt.spotLightMap.value=K.state.spotLightMap,Gt.pointShadowMatrix.value=K.state.pointShadowMatrix),Z.lightProbeGrid=A.state.lightProbeGridArray.length>0,Z.currentProgram=fe,Z.uniformsList=null,fe}function Go(y){if(y.uniformsList===null){let B=y.currentProgram.getUniforms();y.uniformsList=Pr.seqWithValue(B.seq,y.uniforms)}return y.uniformsList}function zn(y,B){let J=X.get(y);J.outputColorSpace=B.outputColorSpace,J.batching=B.batching,J.batchingColor=B.batchingColor,J.instancing=B.instancing,J.instancingColor=B.instancingColor,J.instancingMorph=B.instancingMorph,J.skinning=B.skinning,J.morphTargets=B.morphTargets,J.morphNormals=B.morphNormals,J.morphColors=B.morphColors,J.morphTargetsCount=B.morphTargetsCount,J.numClippingPlanes=B.numClippingPlanes,J.numIntersection=B.numClipIntersection,J.vertexAlphas=B.vertexAlphas,J.vertexTangents=B.vertexTangents,J.toneMapping=B.toneMapping}function Wo(y,B){if(y.length===0)return null;if(y.length===1)return y[0].texture!==null?y[0]:null;E.setFromMatrixPosition(B.matrixWorld);for(let J=0,Z=y.length;J<Z;J++){let K=y[J];if(K.texture!==null&&K.boundingBox.containsPoint(E))return K}return null}function xc(y,B,J,Z,K){B.isScene!==!0&&(B=Ce),tt.resetTextureUnits();let Tt=B.fog,kt=Z.isMeshStandardMaterial||Z.isMeshLambertMaterial||Z.isMeshPhongMaterial?B.environment:null,Rt=gt===null?N.outputColorSpace:gt.isXRRenderTarget===!0?gt.texture.colorSpace:xe.workingColorSpace,Ht=Z.isMeshStandardMaterial||Z.isMeshLambertMaterial&&!Z.envMap||Z.isMeshPhongMaterial&&!Z.envMap,Wt=ft.get(Z.envMap||kt,Ht),ae=Z.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,fe=!!J.attributes.tangent&&(!!Z.normalMap||Z.anisotropy>0),Gt=!!J.morphAttributes.position,Te=!!J.morphAttributes.normal,Be=!!J.morphAttributes.color,Re=ei;Z.toneMapped&&(gt===null||gt.isXRRenderTarget===!0)&&(Re=N.toneMapping);let he=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,He=he!==void 0?he.length:0,Nt=X.get(Z),ln=A.state.lights;if(ve===!0&&(ye===!0||y!==dt)){let Le=y===dt&&Z.id===ot;Yt.setState(Z,y,Le)}let ge=!1;Z.version===Nt.__version?(Nt.needsLights&&Nt.lightsStateVersion!==ln.state.version||Nt.outputColorSpace!==Rt||K.isBatchedMesh&&Nt.batching===!1||!K.isBatchedMesh&&Nt.batching===!0||K.isBatchedMesh&&Nt.batchingColor===!0&&K._colorsTexture===null||K.isBatchedMesh&&Nt.batchingColor===!1&&K._colorsTexture!==null||K.isInstancedMesh&&Nt.instancing===!1||!K.isInstancedMesh&&Nt.instancing===!0||K.isSkinnedMesh&&Nt.skinning===!1||!K.isSkinnedMesh&&Nt.skinning===!0||K.isInstancedMesh&&Nt.instancingColor===!0&&K.instanceColor===null||K.isInstancedMesh&&Nt.instancingColor===!1&&K.instanceColor!==null||K.isInstancedMesh&&Nt.instancingMorph===!0&&K.morphTexture===null||K.isInstancedMesh&&Nt.instancingMorph===!1&&K.morphTexture!==null||Nt.envMap!==Wt||Z.fog===!0&&Nt.fog!==Tt||Nt.numClippingPlanes!==void 0&&(Nt.numClippingPlanes!==Yt.numPlanes||Nt.numIntersection!==Yt.numIntersection)||Nt.vertexAlphas!==ae||Nt.vertexTangents!==fe||Nt.morphTargets!==Gt||Nt.morphNormals!==Te||Nt.morphColors!==Be||Nt.toneMapping!==Re||Nt.morphTargetsCount!==He||!!Nt.lightProbeGrid!=A.state.lightProbeGridArray.length>0)&&(ge=!0):(ge=!0,Nt.__version=Z.version);let fn=Nt.currentProgram;ge===!0&&(fn=fs(Z,B,K),O&&Z.isNodeMaterial&&O.onUpdateProgram(Z,fn,Nt));let Vn=!1,yi=!1,Bi=!1,be=fn.getUniforms(),ke=Nt.uniforms;if(m.useProgram(fn.program)&&(Vn=!0,yi=!0,Bi=!0),Z.id!==ot&&(ot=Z.id,yi=!0),Nt.needsLights){let Le=Wo(A.state.lightProbeGridArray,K);Nt.lightProbeGrid!==Le&&(Nt.lightProbeGrid=Le,yi=!0)}if(Vn||dt!==y){m.buffers.depth.getReversed()&&y.reversedDepth!==!0&&(y._reversedDepth=!0,y.updateProjectionMatrix()),be.setValue(R,"projectionMatrix",y.projectionMatrix),be.setValue(R,"viewMatrix",y.matrixWorldInverse);let ai=be.map.cameraPosition;ai!==void 0&&ai.setValue(R,jt.setFromMatrixPosition(y.matrixWorld)),T.logarithmicDepthBuffer&&be.setValue(R,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(Z.isMeshPhongMaterial||Z.isMeshToonMaterial||Z.isMeshLambertMaterial||Z.isMeshBasicMaterial||Z.isMeshStandardMaterial||Z.isShaderMaterial)&&be.setValue(R,"isOrthographic",y.isOrthographicCamera===!0),dt!==y&&(dt=y,yi=!0,Bi=!0)}if(Nt.needsLights&&(ln.state.sunShadowMap.length>0&&be.setValue(R,"sunShadowMap",ln.state.sunShadowMap,tt),ln.state.directionalShadowMap.length>0&&be.setValue(R,"directionalShadowMap",ln.state.directionalShadowMap,tt),ln.state.spotShadowMap.length>0&&be.setValue(R,"spotShadowMap",ln.state.spotShadowMap,tt),ln.state.pointShadowMap.length>0&&be.setValue(R,"pointShadowMap",ln.state.pointShadowMap,tt)),K.isSkinnedMesh){be.setOptional(R,K,"bindMatrix"),be.setOptional(R,K,"bindMatrixInverse");let Le=K.skeleton;Le&&(Le.boneTexture===null&&Le.computeBoneTexture(),be.setValue(R,"boneTexture",Le.boneTexture,tt))}K.isBatchedMesh&&(be.setOptional(R,K,"batchingTexture"),be.setValue(R,"batchingTexture",K._matricesTexture,tt),be.setOptional(R,K,"batchingIdTexture"),be.setValue(R,"batchingIdTexture",K._indirectTexture,tt),be.setOptional(R,K,"batchingColorTexture"),K._colorsTexture!==null&&be.setValue(R,"batchingColorTexture",K._colorsTexture,tt));let Rn=J.morphAttributes;if((Rn.position!==void 0||Rn.normal!==void 0||Rn.color!==void 0)&&V.update(K,J,fn),(yi||Nt.receiveShadow!==K.receiveShadow)&&(Nt.receiveShadow=K.receiveShadow,be.setValue(R,"receiveShadow",K.receiveShadow)),(Z.isMeshStandardMaterial||Z.isMeshLambertMaterial||Z.isMeshPhongMaterial)&&Z.envMap===null&&B.environment!==null&&(ke.envMapIntensity.value=B.environmentIntensity),ke.dfgLUT!==void 0&&(ke.dfgLUT.value=Tv()),yi){if(be.setValue(R,"toneMappingExposure",N.toneMappingExposure),Nt.needsLights&&Ys(ke,Bi),Tt&&Z.fog===!0&&Ut.refreshFogUniforms(ke,Tt),Ut.refreshMaterialUniforms(ke,Z,et,W,A.state.transmissionRenderTarget[y.id]),Nt.needsLights&&Nt.lightProbeGrid){let Le=Nt.lightProbeGrid;ke.probesSH.value=Le.texture,ke.probesMin.value.copy(Le.boundingBox.min),ke.probesMax.value.copy(Le.boundingBox.max),ke.probesResolution.value.copy(Le.resolution)}Pr.upload(R,Go(Nt),ke,tt)}if(Z.isShaderMaterial&&Z.uniformsNeedUpdate===!0&&(Pr.upload(R,Go(Nt),ke,tt),Z.uniformsNeedUpdate=!1),Z.isSpriteMaterial&&be.setValue(R,"center",K.center),be.setValue(R,"modelViewMatrix",K.modelViewMatrix),be.setValue(R,"normalMatrix",K.normalMatrix),be.setValue(R,"modelMatrix",K.matrixWorld),Z.uniformsGroups!==void 0){let Le=Z.uniformsGroups;for(let ai=0,ki=Le.length;ai<ki;ai++){let Xo=Le[ai];pt.update(Xo,fn),pt.bind(Xo,fn)}}return fn}function Ys(y,B){y.ambientLightColor.needsUpdate=B,y.lightProbe.needsUpdate=B,y.sunLights.needsUpdate=B,y.sunLightShadows.needsUpdate=B,y.directionalLights.needsUpdate=B,y.directionalLightShadows.needsUpdate=B,y.pointLights.needsUpdate=B,y.pointLightShadows.needsUpdate=B,y.spotLights.needsUpdate=B,y.spotLightShadows.needsUpdate=B,y.rectAreaLights.needsUpdate=B,y.hemisphereLights.needsUpdate=B}function vi(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return ht},this.getActiveMipmapLevel=function(){return ct},this.getRenderTarget=function(){return gt},this.setRenderTargetTextures=function(y,B,J){let Z=X.get(y);Z.__autoAllocateDepthBuffer=y.resolveDepthBuffer===!1,Z.__autoAllocateDepthBuffer===!1&&(Z.__useRenderToTexture=!1),X.get(y.texture).__webglTexture=B,X.get(y.depthTexture).__webglTexture=Z.__autoAllocateDepthBuffer?void 0:J,Z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(y,B){let J=X.get(y);J.__webglFramebuffer=B,J.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(y,B=0,J=0){gt=y,ht=B,ct=J;let Z=null,K=!1,Tt=!1;if(y){let Rt=X.get(y);if(Rt.__useDefaultFramebuffer!==void 0){m.bindFramebuffer(R.FRAMEBUFFER,Rt.__webglFramebuffer),xt.copy(y.viewport),Zt.copy(y.scissor),Xt=y.scissorTest,m.viewport(xt),m.scissor(Zt),m.setScissorTest(Xt),ot=-1;return}else if(Rt.__webglFramebuffer===void 0)tt.setupRenderTarget(y);else if(Rt.__hasExternalTextures)tt.rebindTextures(y,X.get(y.texture).__webglTexture,X.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){let ae=y.depthTexture;if(Rt.__boundDepthTexture!==ae){if(ae!==null&&X.has(ae)&&(y.width!==ae.image.width||y.height!==ae.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");tt.setupDepthRenderbuffer(y)}}let Ht=y.texture;(Ht.isData3DTexture||Ht.isDataArrayTexture||Ht.isCompressedArrayTexture)&&(Tt=!0);let Wt=X.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(Wt[B])?Z=Wt[B][J]:Z=Wt[B],K=!0):y.samples>0&&tt.useMultisampledRTT(y)===!1?Z=X.get(y).__webglMultisampledFramebuffer:Array.isArray(Wt)?Z=Wt[J]:Z=Wt,xt.copy(y.viewport),Zt.copy(y.scissor),Xt=y.scissorTest}else xt.copy(yt).multiplyScalar(et).floor(),Zt.copy(Ft).multiplyScalar(et).floor(),Xt=Ne;if(J!==0&&(Z=Y),m.bindFramebuffer(R.FRAMEBUFFER,Z)&&m.drawBuffers(y,Z),m.viewport(xt),m.scissor(Zt),m.setScissorTest(Xt),K){let Rt=X.get(y.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+B,Rt.__webglTexture,J)}else if(Tt){let Rt=B;for(let Ht=0;Ht<y.textures.length;Ht++){let Wt=X.get(y.textures[Ht]);R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0+Ht,Wt.__webglTexture,J,Rt)}}else if(y!==null&&J!==0){let Rt=X.get(y.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Rt.__webglTexture,J)}ot=-1};function ds(y){let B=X.get(y);return(B.__readFormat!==y.format||B.__readType!==y.type)&&(B.__readFormat=y.format,B.__readType=y.type,B.__formatReadable=T.textureFormatReadable(y.format),B.__typeReadable=T.textureTypeReadable(y.type)),B}this.readRenderTargetPixels=function(y,B,J,Z,K,Tt,kt,Rt=0){if(!(y&&y.isWebGLRenderTarget)){se("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ht=X.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&kt!==void 0&&(Ht=Ht[kt]),Ht){m.bindFramebuffer(R.FRAMEBUFFER,Ht);try{let Wt=y.textures[Rt],ae=Wt.format,fe=Wt.type;y.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+Rt);let Gt=ds(Wt);if(Gt.__formatReadable===!1){se("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Gt.__typeReadable===!1){se("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=y.width-Z&&J>=0&&J<=y.height-K&&R.readPixels(B,J,Z,K,bt.convert(ae),bt.convert(fe),Tt)}finally{let Wt=gt!==null?X.get(gt).__webglFramebuffer:null;m.bindFramebuffer(R.FRAMEBUFFER,Wt)}}},this.readRenderTargetPixelsAsync=async function(y,B,J,Z,K,Tt,kt,Rt=0){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ht=X.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&kt!==void 0&&(Ht=Ht[kt]),Ht)if(B>=0&&B<=y.width-Z&&J>=0&&J<=y.height-K){m.bindFramebuffer(R.FRAMEBUFFER,Ht);let Wt=y.textures[Rt],ae=Wt.format,fe=Wt.type;y.textures.length>1&&R.readBuffer(R.COLOR_ATTACHMENT0+Rt);let Gt=ds(Wt);if(Gt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Gt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Te=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,Te),R.bufferData(R.PIXEL_PACK_BUFFER,Tt.byteLength,R.STREAM_READ),R.readPixels(B,J,Z,K,bt.convert(ae),bt.convert(fe),0),R.bindBuffer(R.PIXEL_PACK_BUFFER,null);let Be=gt!==null?X.get(gt).__webglFramebuffer:null;m.bindFramebuffer(R.FRAMEBUFFER,Be);let Re=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);return R.flush(),await Bf(R,Re,4),R.bindBuffer(R.PIXEL_PACK_BUFFER,Te),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,Tt),R.bindBuffer(R.PIXEL_PACK_BUFFER,null),R.deleteBuffer(Te),R.deleteSync(Re),Tt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(y,B=null,J=0){let Z=Math.pow(2,-J),K=Math.floor(y.image.width*Z),Tt=Math.floor(y.image.height*Z),kt=B!==null?B.x:0,Rt=B!==null?B.y:0;tt.setTexture2D(y,0),R.copyTexSubImage2D(R.TEXTURE_2D,J,0,0,kt,Rt,K,Tt),m.unbindTexture()},this.copyTextureToTexture=function(y,B,J=null,Z=null,K=0,Tt=0){let kt,Rt,Ht,Wt,ae,fe,Gt,Te,Be,Re=y.isCompressedTexture?y.mipmaps[Tt]:y.image;if(J!==null)kt=J.max.x-J.min.x,Rt=J.max.y-J.min.y,Ht=J.isBox3?J.max.z-J.min.z:1,Wt=J.min.x,ae=J.min.y,fe=J.isBox3?J.min.z:0;else{let ke=Math.pow(2,-K);kt=Math.floor(Re.width*ke),Rt=Math.floor(Re.height*ke),y.isDataArrayTexture?Ht=Re.depth:y.isData3DTexture?Ht=Math.floor(Re.depth*ke):Ht=1,Wt=0,ae=0,fe=0}Z!==null?(Gt=Z.x,Te=Z.y,Be=Z.z):(Gt=0,Te=0,Be=0);let he=bt.convert(B.format),He=bt.convert(B.type),Nt;B.isData3DTexture?(tt.setTexture3D(B,0),Nt=R.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(tt.setTexture2DArray(B,0),Nt=R.TEXTURE_2D_ARRAY):(tt.setTexture2D(B,0),Nt=R.TEXTURE_2D),m.activeTexture(R.TEXTURE0),m.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,B.flipY),m.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),m.pixelStorei(R.UNPACK_ALIGNMENT,B.unpackAlignment);let ln=m.getParameter(R.UNPACK_ROW_LENGTH),ge=m.getParameter(R.UNPACK_IMAGE_HEIGHT),fn=m.getParameter(R.UNPACK_SKIP_PIXELS),Vn=m.getParameter(R.UNPACK_SKIP_ROWS),yi=m.getParameter(R.UNPACK_SKIP_IMAGES);m.pixelStorei(R.UNPACK_ROW_LENGTH,Re.width),m.pixelStorei(R.UNPACK_IMAGE_HEIGHT,Re.height),m.pixelStorei(R.UNPACK_SKIP_PIXELS,Wt),m.pixelStorei(R.UNPACK_SKIP_ROWS,ae),m.pixelStorei(R.UNPACK_SKIP_IMAGES,fe);let Bi=y.isDataArrayTexture||y.isData3DTexture,be=B.isDataArrayTexture||B.isData3DTexture;if(y.isDepthTexture){let ke=X.get(y),Rn=X.get(B),Le=X.get(ke.__renderTarget),ai=X.get(Rn.__renderTarget);m.bindFramebuffer(R.READ_FRAMEBUFFER,Le.__webglFramebuffer),m.bindFramebuffer(R.DRAW_FRAMEBUFFER,ai.__webglFramebuffer);for(let ki=0;ki<Ht;ki++)Bi&&(R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,X.get(y).__webglTexture,K,fe+ki),R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,X.get(B).__webglTexture,Tt,Be+ki)),R.blitFramebuffer(Wt,ae,kt,Rt,Gt,Te,kt,Rt,R.DEPTH_BUFFER_BIT,R.NEAREST);m.bindFramebuffer(R.READ_FRAMEBUFFER,null),m.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else if(K!==0||y.isRenderTargetTexture||X.has(y)){let ke=X.get(y),Rn=X.get(B);m.bindFramebuffer(R.READ_FRAMEBUFFER,z),m.bindFramebuffer(R.DRAW_FRAMEBUFFER,j);for(let Le=0;Le<Ht;Le++)Bi?R.framebufferTextureLayer(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,ke.__webglTexture,K,fe+Le):R.framebufferTexture2D(R.READ_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,ke.__webglTexture,K),be?R.framebufferTextureLayer(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,Rn.__webglTexture,Tt,Be+Le):R.framebufferTexture2D(R.DRAW_FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_2D,Rn.__webglTexture,Tt),K!==0?R.blitFramebuffer(Wt,ae,kt,Rt,Gt,Te,kt,Rt,R.COLOR_BUFFER_BIT,R.NEAREST):be?R.copyTexSubImage3D(Nt,Tt,Gt,Te,Be+Le,Wt,ae,kt,Rt):R.copyTexSubImage2D(Nt,Tt,Gt,Te,Wt,ae,kt,Rt);m.bindFramebuffer(R.READ_FRAMEBUFFER,null),m.bindFramebuffer(R.DRAW_FRAMEBUFFER,null)}else be?y.isDataTexture||y.isData3DTexture?R.texSubImage3D(Nt,Tt,Gt,Te,Be,kt,Rt,Ht,he,He,Re.data):B.isCompressedArrayTexture?R.compressedTexSubImage3D(Nt,Tt,Gt,Te,Be,kt,Rt,Ht,he,Re.data):R.texSubImage3D(Nt,Tt,Gt,Te,Be,kt,Rt,Ht,he,He,Re):y.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,Tt,Gt,Te,kt,Rt,he,He,Re.data):y.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,Tt,Gt,Te,Re.width,Re.height,he,Re.data):R.texSubImage2D(R.TEXTURE_2D,Tt,Gt,Te,kt,Rt,he,He,Re);m.pixelStorei(R.UNPACK_ROW_LENGTH,ln),m.pixelStorei(R.UNPACK_IMAGE_HEIGHT,ge),m.pixelStorei(R.UNPACK_SKIP_PIXELS,fn),m.pixelStorei(R.UNPACK_SKIP_ROWS,Vn),m.pixelStorei(R.UNPACK_SKIP_IMAGES,yi),Tt===0&&B.generateMipmaps&&R.generateMipmap(Nt),m.unbindTexture()},this.initRenderTarget=function(y){X.get(y).__webglFramebuffer===void 0&&tt.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?tt.setTextureCube(y,0):y.isData3DTexture?tt.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?tt.setTexture2DArray(y,0):tt.setTexture2D(y,0),m.unbindTexture()},this.resetState=function(){ht=0,ct=0,gt=null,m.reset(),Ct.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return jn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=xe._getDrawingBufferColorSpace(t),e.unpackColorSpace=xe._getUnpackColorSpace()}};var _d={type:"change"},Wh={type:"start"},yd={type:"end"},Jl=new Zi,vd=new hn,Av=Math.cos(70*_h.DEG2RAD),tn=new G,An=2*Math.PI,Pe={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Gh=1e-6,jl=class extends mo{constructor(t,e=null){super(t,e),this.state=Pe.NONE,this.target=new G,this.cursor=new G,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Gn.ROTATE,MIDDLE:Gn.DOLLY,RIGHT:Gn.PAN},this.touches={ONE:ti.ROTATE,TWO:ti.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new G,this._lastQuaternion=new Dn,this._lastTargetPosition=new G,this._quat=new Dn().setFromUnitVectors(t.up,new G(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new ui,this._sphericalDelta=new ui,this._scale=1,this._panOffset=new G,this._rotateStart=new qt,this._rotateEnd=new qt,this._rotateDelta=new qt,this._panStart=new qt,this._panEnd=new qt,this._panDelta=new qt,this._dollyStart=new qt,this._dollyEnd=new qt,this._dollyDelta=new qt,this._dollyDirection=new G,this._mouse=new qt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Cv.bind(this),this._onPointerDown=Ev.bind(this),this._onPointerUp=Rv.bind(this),this._onContextMenu=Fv.bind(this),this._onMouseWheel=Lv.bind(this),this._onKeyDown=Dv.bind(this),this._onTouchStart=Nv.bind(this),this._onTouchMove=Uv.bind(this),this._onMouseDown=Pv.bind(this),this._onMouseMove=Iv.bind(this),this._interceptControlDown=Ov.bind(this),this._interceptControlUp=Bv.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=Pe.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents();let t=this.domElement.getRootNode();t.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),t.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(_d),this.update(),this.state=Pe.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){let e=this.object.position;tn.copy(e).sub(this.target),tn.applyQuaternion(this._quat),this._spherical.setFromVector3(tn),this.autoRotate&&this.state===Pe.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(n)&&isFinite(s)&&(n<-Math.PI?n+=An:n>Math.PI&&(n-=An),s<-Math.PI?s+=An:s>Math.PI&&(s-=An),n<=s?this._spherical.theta=Math.max(n,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+s)/2?Math.max(n,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(tn.setFromSpherical(this._spherical),tn.applyQuaternion(this._quatInverse),e.copy(this.target).add(tn),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let a=tn.length();o=this._clampDistance(a*this._scale);let l=a-o;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){let a=new G(this._mouse.x,this._mouse.y,0);a.unproject(this.object);let l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;let c=new G(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(a),this.object.updateMatrixWorld(),o=tn.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(Jl.origin.copy(this.object.position),Jl.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Jl.direction))<Av?this.object.lookAt(this.target):(vd.setFromNormalAndCoplanarPoint(this.object.up,this.target),Jl.intersectPlane(vd,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Gh||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Gh||this._lastTargetPosition.distanceToSquared(this.target)>Gh?(this.dispatchEvent(_d),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?An/60*this.autoRotateSpeed*t:An/60/60*this.autoRotateSpeed}_getZoomScale(t){let e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){tn.setFromMatrixColumn(e,0),tn.multiplyScalar(-t),this._panOffset.add(tn)}_panUp(t,e){this.screenSpacePanning===!0?tn.setFromMatrixColumn(e,1):(tn.setFromMatrixColumn(e,0),tn.crossVectors(this.object.up,tn)),tn.multiplyScalar(t),this._panOffset.add(tn)}_pan(t,e){let n=this.domElement;if(this.object.isPerspectiveCamera){let s=this.object.position;tn.copy(s).sub(this.target);let r=tn.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),s=t-n.left,r=e-n.top,o=n.width,a=n.height;this._mouse.x=s/o*2-1,this._mouse.y=-(r/a)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(An*this._rotateDelta.x/e.clientHeight),this._rotateUp(An*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(An*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-An*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(An*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-An*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._rotateStart.set(n,s)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panStart.set(n,s)}}_handleTouchStartDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{let n=this._getSecondPointerPosition(t),s=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let e=this.domElement;this._rotateLeft(An*this._rotateDelta.x/e.clientHeight),this._rotateUp(An*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{let e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),s=.5*(t.pageY+e.y);this._panEnd.set(n,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){let e=this._getSecondPointerPosition(t),n=t.pageX-e.x,s=t.pageY-e.y,r=Math.sqrt(n*n+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(t.pageX+e.x)*.5,a=(t.pageY+e.y)*.5;this._updateZoomParameters(o,a)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new qt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){let e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){let e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function Ev(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function Cv(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function Rv(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(yd),this.state=Pe.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:let t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function Pv(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Gn.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=Pe.DOLLY;break;case Gn.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Pe.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Pe.ROTATE}break;case Gn.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=Pe.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=Pe.PAN}break;default:this.state=Pe.NONE}this.state!==Pe.NONE&&this.dispatchEvent(Wh)}function Iv(i){switch(this.state){case Pe.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case Pe.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case Pe.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function Lv(i){this.enabled===!1||this.enableZoom===!1||this.state!==Pe.NONE||(i.preventDefault(),this.dispatchEvent(Wh),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(yd))}function Dv(i){this.enabled!==!1&&this._handleKeyDown(i)}function Nv(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case ti.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=Pe.TOUCH_ROTATE;break;case ti.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=Pe.TOUCH_PAN;break;default:this.state=Pe.NONE}break;case 2:switch(this.touches.TWO){case ti.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=Pe.TOUCH_DOLLY_PAN;break;case ti.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=Pe.TOUCH_DOLLY_ROTATE;break;default:this.state=Pe.NONE}break;default:this.state=Pe.NONE}this.state!==Pe.NONE&&this.dispatchEvent(Wh)}function Uv(i){switch(this._trackPointer(i),this.state){case Pe.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case Pe.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case Pe.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case Pe.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=Pe.NONE}}function Fv(i){this.enabled!==!1&&i.preventDefault()}function Ov(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Bv(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var Xh=new hn,Ql=new Rs,Lr=new qt,qh=new G,tc=class extends jl{constructor(t,e){super(t,e),this.screenSpacePanning=!1,this.mouseButtons={LEFT:Gn.PAN,MIDDLE:Gn.DOLLY,RIGHT:Gn.ROTATE},this.touches={ONE:ti.PAN,TWO:ti.DOLLY_ROTATE},this._panWorldStart=new G}_handleMouseDownPan(t){if(super._handleMouseDownPan(t),this._panOffset.set(0,0,0),this.screenSpacePanning===!0)return;Xh.setFromNormalAndCoplanarPoint(this.object.up,this.target);let n=this.domElement.getBoundingClientRect();Lr.x=(t.clientX-n.left)/n.width*2-1,Lr.y=-((t.clientY-n.top)/n.height)*2+1,Ql.setFromCamera(Lr,this.object),Ql.ray.intersectPlane(Xh,this._panWorldStart)}_handleMouseMovePan(t){if(this.screenSpacePanning===!0){super._handleMouseMovePan(t);return}let n=this.domElement.getBoundingClientRect();Lr.x=(t.clientX-n.left)/n.width*2-1,Lr.y=-((t.clientY-n.top)/n.height)*2+1,Ql.setFromCamera(Lr,this.object),Ql.ray.intersectPlane(Xh,qh)&&(qh.sub(this._panWorldStart),this._panOffset.copy(qh).negate(),this.update())}};var Dr={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};var On=class{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}},kv=new Cs(-1,1,1,-1,0,1),Yh=class extends gn{constructor(){super(),this.setAttribute("position",new Sn([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Sn([0,2,0,0,2,0],2))}},zv=new Yh,os=class{constructor(t){this._mesh=new ze(zv,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,kv)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}};var ec=class extends On{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof Ve?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Pi.clone(t.uniforms),this.material=new Ve({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new os(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var No=class extends On{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){let s=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let o,a;this.inverse?(o=0,a=1):(o=1,a=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(s.REPLACE,s.REPLACE,s.REPLACE),r.buffers.stencil.setFunc(s.ALWAYS,o,4294967295),r.buffers.stencil.setClear(a),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(s.EQUAL,1,4294967295),r.buffers.stencil.setOp(s.KEEP,s.KEEP,s.KEEP),r.buffers.stencil.setLocked(!0)}},nc=class extends On{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}};var ic=class{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){let n=t.getSize(new qt);this._width=n.width,this._height=n.height,e=new Ye(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Je}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new ec(Dr),this.copyPass.material.blending=Wn,this.timer=new po}swapBuffers(){let t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){let e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());let e=this.renderer.getRenderTarget(),n=!1;for(let s=0,r=this.passes.length;s<r;s++){let o=this.passes[s];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(s),o.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),o.needsSwap){if(n){let a=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(a.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(a.EQUAL,1,4294967295)}this.swapBuffers()}No!==void 0&&(o instanceof No?n=!0:o instanceof nc&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){let e=this.renderer.getSize(new qt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;let n=this._width*this._pixelRatio,s=this._height*this._pixelRatio;this.renderTarget1.setSize(n,s),this.renderTarget2.setSize(n,s);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,s)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}};var sc=class extends On{constructor(t,e,n=null,s=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=s,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new ue}render(t,e,n){let s=t.autoClear;t.autoClear=!1;let r,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),t.autoClear=s}};var Md={name:"LuminosityHighPassShader",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new ue(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};var Nr=class i extends On{constructor(t,e=1,n,s){super(),this.strength=e,this.radius=n,this.threshold=s,this.resolution=t!==void 0?new qt(t.x,t.y):new qt(256,256),this.clearColor=new ue(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new Ye(r,o,{type:Je,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){let f=new Ye(r,o,{type:Je,depthBuffer:!1});f.texture.name="UnrealBloomPass.h"+h,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);let u=new Ye(r,o,{type:Je,depthBuffer:!1});u.texture.name="UnrealBloomPass.v"+h,u.texture.generateMipmaps=!1,this.renderTargetsVertical.push(u),r=Math.round(r/2),o=Math.round(o/2)}let a=Md;this.highPassUniforms=Pi.clone(a.uniforms),this.highPassUniforms.luminosityThreshold.value=s,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new Ve({uniforms:this.highPassUniforms,vertexShader:a.vertexShader,fragmentShader:a.fragmentShader}),this.separableBlurMaterials=[];let l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new qt(1/r,1/o),r=Math.round(r/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;let c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new G(1,1,1),new G(1,1,1),new G(1,1,1),new G(1,1,1),new G(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Pi.clone(Dr.uniforms),this.blendMaterial=new Ve({uniforms:this.copyUniforms,vertexShader:Dr.vertexShader,fragmentShader:Dr.fragmentShader,premultipliedAlpha:!0,blending:Ps,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new ue,this._oldClearAlpha=1,this._basic=new Es,this._fsQuad=new os(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),s=Math.round(e/2);this.renderTargetBright.setSize(n,s);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,s),this.renderTargetsVertical[r].setSize(n,s),this.separableBlurMaterials[r].uniforms.invSize.value=new qt(1/n,1/s),n=Math.round(n/2),s=Math.round(s/2)}render(t,e,n,s,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();let o=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let a=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=a.texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=i.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),a=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=o}_getSeparableBlurMaterial(t){let e=[],n=t/3;for(let o=0;o<t;o++)e.push(.39894*Math.exp(-.5*o*o/(n*n))/n);let s=[],r=[];for(let o=1;o<t;o+=2){let a=e[o],l=o+1<t?e[o+1]:0,c=a+l;s.push((o*a+(o+1)*l)/c),r.push(c)}return new Ve({defines:{KERNEL_PAIRS:s.length},uniforms:{colorTexture:{value:null},invSize:{value:new qt(.5,.5)},direction:{value:new qt(.5,.5)},centerWeight:{value:e[0]},gaussianOffsets:{value:s},gaussianWeights:{value:r}},vertexShader:`

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

				}`})}_getCompositeMaterial(t){return new Ve({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}};Nr.BlurDirectionX=new qt(1,0);Nr.BlurDirectionY=new qt(0,1);var Uo={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};var rc=class extends On{constructor(){super(),this.isOutputPass=!0,this.uniforms=Pi.clone(Uo.uniforms),this.material=new vr({name:Uo.name,uniforms:this.uniforms,vertexShader:Uo.vertexShader,fragmentShader:Uo.fragmentShader}),this._fsQuad=new os(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},xe.getTransfer(this._outputColorSpace)===Ae&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===xo?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===_o?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===vo?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Ls?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Mo?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===So?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===yo&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}};var Oo={mud:"#ff6040",oni:"#3ec8ff",ustur:"#ffcc33",unaligned:"#8a94a6"},Vv=i=>i<=.04045?i/12.92:((i+.055)/1.055)**2.4;var Bs=i=>[1,3,5].map(t=>Vv(parseInt(i.slice(t,t+2),16)/255)),Ad=[1.8,1,.6],Li=Object.fromEntries(Object.entries(Oo).map(([i,t])=>[i,Bs(t)])),en=i=>Li[i]?i:"unaligned",Sd={idle:0,docked:1,mining:2,warp:3,subwarp:4,destroyed:5,respawn:6,claimStakeTransfer:7},Ed=i=>i in Sd?Sd[i]:0,Kh=i=>i==="warp"||i==="subwarp",oe=i=>typeof i=="number"&&Number.isFinite(i),bd=i=>Array.isArray(i)&&i.length>=2&&oe(i[0])&&oe(i[1]);function Jh(i){let t=i.s||{},e=[oe(i.x)?i.x:0,oe(i.y)?i.y:0];return Kh(t.kind)&&bd(t.to)&&oe(t.departs)&&oe(t.arrives)?{moving:!0,from:bd(t.from)?[t.from[0],t.from[1]]:e,to:[t.to[0],t.to[1]],dep:t.departs,arr:t.arrives}:{moving:!1,from:e,to:null,dep:0,arr:0}}function Hv(i,t){if(!i.moving)return 1;let e=i.arr-i.dep;if(!(e>0))return t>=i.dep?1:0;let n=(t-i.dep)/e;return n<0?0:n>1?1:n}function Cd(i,t,e=[0,0]){if(!i.moving)return e[0]=i.from[0],e[1]=i.from[1],e;let n=Hv(i,t);return e[0]=i.from[0]+(i.to[0]-i.from[0])*n,e[1]=i.from[1]+(i.to[1]-i.from[1])*n,e}function En(i){let t=2166136261;for(let e=0;e<(i||"").length;e++)t^=i.charCodeAt(e),t=Math.imul(t,16777619);return(t>>>0)%1e5/1e5}var Bo=i=>i&&i.mine&&Array.isArray(i.mine.out)?i.mine.out.reduce((t,e)=>t+(oe(e.ups)?e.ups:0),0):0;function Gv(i){let t=new Map((i.asteroids||[]).map(n=>[n.a,n.sys])),e=new Map;for(let n of i.fleets||[]){if(!n||!n.s||n.s.kind!=="mining")continue;let s=t.get(n.s.asteroid);if(!s)continue;let r=e.get(s);r||(r={ups:0,miners:0,byFa:{},byFilter:{},fa:"unaligned"},e.set(s,r));let o=Bo(n),a=n.npc?"unaligned":en(n.fa);r.ups+=o,r.miners++,r.byFa[a]=(r.byFa[a]||0)+o;for(let l of eu)nu(n,l)&&(r.byFilter[l]=(r.byFilter[l]||0)+o+1e-9)}for(let n of e.values())n.fa=Object.entries(n.byFa).sort((s,r)=>r[1]-s[1])[0][0];return e}var Rd=["mining","resource","combat","fleets","owners","dacs"],jh="#10b981",$h=[.55,1.65],Fo=.55;function Pd(i,t,e){let n=oe(i)&&oe(t)&&oe(e)&&e>t?Math.min(1,Math.max(0,(i-t)/(e-t))):1;return{t:n,r:$h[0]+($h[1]-$h[0])*n,b:Fo+(1-Fo)*n}}var Id={planet:0,belt:1,both:2},Wv={planet:"planets only",belt:"asteroid belt only",both:"planets and asteroid belt"},Xv=(i,t)=>i>0&&t>0?"both":i>0?"belt":"planet",wd=i=>{let t=Math.round(i*100)/100;return String(oe(t)?t:i)},qv=i=>{let t=Math.round(i*1e6)/1e6;return oe(t)?t:oe(i)?i:Number.MAX_VALUE};function Yv(i,t,e){let n=new Map((t||[]).filter(r=>r&&oe(r.x)&&oe(r.y)).map(r=>[r.a,r])),s=new Map;if(typeof e!="string"||!e)return[];for(let r of i||[]){if(!r||!r.a||!r.sys||!Array.isArray(r.res)||!n.has(r.sys))continue;let o=0;for(let l of r.res)l&&l.r===e&&oe(l.rich)&&l.rich>o&&(o=l.rich);if(!(o>0))continue;let a=s.get(r.sys);if(!a){let l=n.get(r.sys);a={sys:r.sys,x:l.x,y:l.y,name:l.n||"System",sum:0,best:0,n:0,top:null,belts:0,planets:0},s.set(r.sys,a)}a.sum+=o,a.n++,r.k==="asteroid"?a.belts++:a.planets++,o>a.best&&(a.best=o,a.top=r.a)}for(let r of s.values())r.sum=qv(r.sum),r.where=Xv(r.belts,r.planets);return[...s.values()].sort((r,o)=>o.sum-r.sum||o.best-r.best||(r.sys<o.sys?-1:r.sys>o.sys?1:0))}var Bn=" \xB7 ",gi=(i,t)=>`${i} ${t}${i===1?"":"s"}`;function $v(i){let t=Math.abs(i);return t>=1e6?(i/1e6).toFixed(t>=1e7?0:1)+"M":t>=1e3?(i/1e3).toFixed(t>=1e4?0:1)+"k":t>=10?Math.round(i).toString():i.toFixed(1)}function Td(i,t){let e=(i.asteroids||[]).map(n=>({k:"asteroid",a:n.a,sys:n.sys}));return au(i.fleets||[],i.systems||[],e,t)}function Ld(i,t,e,n={}){if(!t||!Array.isArray(t.systems))return[];let s=new Map(t.systems.map(l=>[l.a,l])),r=oe(t.generatedAt)?t.generatedAt:0,o=r-120,a=[];if(i==="mining")for(let[l,c]of Gv(t)){let h=s.get(l);!h||!(c.ups>0)||a.push({key:l,x:h.x,y:h.y,v:c.ups,fa:c.fa,sys:l,name:h.n||"System",line:`${$v(c.ups)} u/s${Bn}${gi(c.miners,"miner")}`,miners:c.miners})}else if(i==="resource")for(let l of Yv(n.bodies,t.systems,n.res))!oe(l.sum)||!(l.sum>0)||a.push({key:l.sys,x:l.x,y:l.y,v:l.sum,fa:"res",hex:jh,sys:l.sys,name:l.name,line:`${n.res}${Bn}total ${wd(l.sum)}${Bn}best ${wd(l.best)}${Bn}${l.n} ${l.n===1?"body":"bodies"}${Bn}${Wv[l.where]}`,best:l.best,bodies:l.n,where:l.where,belts:l.belts,planets:l.planets});else if(i==="combat")for(let l of Jv(e,t.systems,r,n.windowS||86400,n.faction||null))a.push({key:"hot:"+l.key,x:l.x,y:l.y,v:l.n,fa:"hot",sys:l.sys,name:l.name,line:`${gi(l.n,"combat event")} 24h${l.destroyed?Bn+gi(l.destroyed,"kill"):""}`,kills:l.destroyed,heat:l.heat,last:l.last});else if(i==="fleets"){let l=t.fleets||[];for(let[c,h]of Td(t,o)){let f=s.get(c);if(!f)continue;let u=[...h.docked,...h.mining,...h.cst,...h.idle];if(!u.length)continue;let d={};for(let g of u){let M=l[g].npc?"unaligned":en(l[g].fa);d[M]=(d[M]||0)+1}a.push({key:c,x:f.x,y:f.y,v:u.length,fa:Object.entries(d).sort((g,M)=>M[1]-g[1])[0][0],sys:c,name:f.n||"System",line:`${gi(u.length,"fleet")}${h.docked.length?Bn+h.docked.length+" docked":""}${h.mining.length?Bn+h.mining.length+" mining":""}`})}}else if(i==="owners"){let l=t.fleets||[],c=n.owner||null,h=new Map((t.owners||[]).map(g=>[g.p,g.fa])),f=new Map;for(let g of t.stakes||[])if(g&&g.sys&&(!c||g.o===c)){let M=f.get(g.sys)||[];M.push(g),f.set(g.sys,M)}let u=Td(t,o),d=new Set([...u.keys(),...f.keys()]);for(let g of d){let M=s.get(g);if(!M)continue;let x=u.get(g),p=x?[...x.docked,...x.mining,...x.cst,...x.idle]:[],I=f.get(g)||[];if(c){let U=p.filter(E=>l[E].o===c).length;if(!U&&!I.length)continue;a.push({key:g,x:M.x,y:M.y,v:U+I.length,fa:en(h.get(c)),sys:g,name:M.n||"System",line:[U?gi(U,"fleet"):"",I.length?gi(I.length,"stake"):""].filter(Boolean).join(Bn)})}else{let U=new Set([...p.map(E=>l[E].o),...I.map(E=>E.o)].filter(Boolean));if(!U.size)continue;a.push({key:g,x:M.x,y:M.y,v:U.size,fa:en(M.f),sys:g,name:M.n||"System",line:gi(U.size,"owner")+" present"})}}}return i==="combat"||i==="resource"?a:a.sort((l,c)=>c.v-l.v||(l.key<c.key?-1:1))}var Zv=12,Dd=(i,t)=>i>0?Zv*(.08+.92*Math.log10(1+i)/Math.log10(1+Math.max(i,t||i))):0;function Nd(i,t=[0,0]){let e=(.5+.17*Math.sqrt(i))*Ii.K,n=i*2.39996323;return t[0]=Math.cos(n)*e,t[1]=Math.sin(n)*e,t}function Qh(i,t){let e=Jh(i);return e.moving?e.arr<=t?e.to:null:[i.x,i.y]}function Ud(i,t=-1/0){let e=new Map;i.forEach((n,s)=>{let r=n.s&&n.s.kind;if(r==="mining")return;let o=Qh(n,t);if(!o)return;let a=r==="docked"&&n.s.system?"sys:"+n.s.system:o[0].toFixed(3)+","+o[1].toFixed(3);e.has(a)||e.set(a,[]),e.get(a).push(s)});for(let n of e.values())n.sort((s,r)=>i[s].a<i[r].a?-1:i[s].a>i[r].a?1:0);return e}var Fd=i=>.55*(1+.42*Math.log2(Math.max(1,i||1))),Od=i=>1.1+Math.max(0,i||0)*.42,tu=i=>i.k==="combat"||i.k==="destroyed"||i.k==="starbaseCombat"||i.k==="captured"||i.k==="gone"&&i.afterCombat===!0,Fs=i=>i.k==="destroyed"||i.dead===!0;function Bd(i,t,e=86400){let n=new Map,s=new Set;for(let r of i||[]){if(!tu(r)||!oe(r.t)||!oe(r.x)||!oe(r.y)||r.t>t||r.t<=t-e)continue;if(Fs(r)&&r.f){if(s.has(r.f))continue;s.add(r.f)}let o=Math.round(r.x*2)+","+Math.round(r.y*2),a=n.get(o);a||(a={x:0,y:0,n:0,heat:0,destroyed:0,last:0,fa:{}},n.set(o,a));let l=t-r.t,c=(Fs(r)?3:1)*Math.exp(-l/21600);a.x+=r.x,a.y+=r.y,a.n++,a.heat+=c,a.last=Math.max(a.last,r.t),Fs(r)&&a.destroyed++;let h=en(r.fa);a.fa[h]=(a.fa[h]||0)+1,r.npc&&(a.npc=(a.npc||0)+1),r.npc||((a.pf||(a.pf={}))[h]=1)}return[...n.values()].map(r=>({x:r.x/r.n,y:r.y/r.n,n:r.n,heat:r.heat,destroyed:r.destroyed,last:r.last,fa:Object.entries(r.fa).sort((o,a)=>a[1]-o[1])[0][0],npc:r.npc||0,playerFa:Object.keys(r.pf||{})}))}var oc=1.2;var Kv=(i,t)=>t.n-i.n||t.last-i.last||(i.key<t.key?-1:i.key>t.key?1:0);function Jv(i,t,e,n=86400,s=null){let r=(t||[]).filter(h=>h&&oe(h.x)&&oe(h.y)),o=new Map,a=new Set,l=oc*oc;for(let h of i||[]){if(!tu(h)||!oe(h.t)||!oe(h.x)||!oe(h.y)||h.t>e||h.t<=e-n||s&&!nu(h,s))continue;if(Fs(h)&&h.f){if(a.has(h.f))continue;a.add(h.f)}let f=null,u=l;for(let x of r){let p=(x.x-h.x)**2+(x.y-h.y)**2;(p<u||p===u&&f&&x.a<f.a)&&(u=p,f=x)}let d=f?f.a:"deep:"+Math.round(h.x*2)+","+Math.round(h.y*2),g=o.get(d);g||(g={key:d,sys:f?f.a:null,name:f?f.n||"System":"",x:f?f.x:0,y:f?f.y:0,sx:0,sy:0,n:0,destroyed:0,heat:0,last:0},o.set(d,g));let M=e-h.t;g.n++,g.sx+=h.x,g.sy+=h.y,g.heat+=(Fs(h)?3:1)*Math.exp(-M/21600),g.last=Math.max(g.last,h.t),Fs(h)&&g.destroyed++}return[...o.values()].map(({sx:h,sy:f,...u})=>(u.sys||(u.x=h/u.n,u.y=f/u.n,u.name=jv(u.x,u.y,r)),u)).sort(Kv)}function jv(i,t,e){let n=null,s=1/0;for(let r of e||[]){if(!r||!oe(r.x)||!oe(r.y))continue;let o=(r.x-i)**2+(r.y-t)**2;(o<s||o===s&&n&&r.a<n.a)&&(s=o,n=r)}return n?`Deep space near ${n.n||"System"}`:"Deep space"}function kd(i,t){return t?t==="npc"?i.npc>0:i.playerFa.includes(t):!0}var ac=(i,t)=>["mud","oni","ustur"].includes(t)&&en(i)!==t,Zh=.06,eu=["mud","oni","ustur","npc","unaligned"];function nu(i,t){return t?t==="npc"?!!i.npc:!i.npc&&en(i.fa)===t:!0}function iu(i,t){let e=i.s&&i.s.kind||"idle";return t.owner?i.o===t.owner?2:Zh:t.faction&&!nu(i,t.faction)||t.states&&t.states.length&&!t.states.includes(e)?Zh:1}function su(i){if(!i.length)return null;let t=1/0,e=1/0,n=-1/0,s=-1/0;for(let[r,o]of i)r<t&&(t=r),r>n&&(n=r),o<e&&(e=o),o>s&&(s=o);return{x:(t+n)/2,y:(e+s)/2,span:Math.max(n-t,s-e)}}function zd(i,t,e){if(!e)return null;if(Math.hypot(e[0]-i.x,e[1]-i.y)>=.3)return[e[0],e[1],i.x,i.y];let n=i.vs&&i.vs[t]||{},s=En(String(i.f)+String(n.f))*Math.PI*2+t*.9,r=Math.cos(s)*.8,o=Math.sin(s)*.8;return[i.x-r,i.y-o,i.x+r,i.y+o]}var ri={orbit0:.75,orbitStep:.46,starR:.26,sbGap:.5,idleR0:.5},Ii={K:.032,rMax:.15,nnShare:.45},ko=i=>(i>0?ri.orbit0+(i-1)*ri.orbitStep:ri.orbit0)+ri.sbGap+.2;function Vd(i,t){let e=(i||[]).filter(s=>s&&oe(s.x)&&oe(s.y)),n=new Map;for(let s of e){let r=1/0;for(let a of e)if(a!==s){let l=(s.x-a.x)**2+(s.y-a.y)**2;l<r&&(r=l)}r=Math.sqrt(r);let o=ko(t?t(s.a):0);n.set(s.a,Math.min(Ii.K,Ii.rMax/o,Number.isFinite(r)?Ii.nnShare*r/o:Ii.K))}return n}function Hd(i,t,e,n,s=[0,0,0,0]){let r=Math.round(t[3]);if(r===1)return s[0]=i[2],s[1]=i[3],s[2]=t[0]-i[2],s[3]=t[1]-i[3],s;let o=t[1]+t[2]*n,a=t[0]*Math.cos(o),l=t[0]*Math.sin(o);if(r===2){let d=Math.atan2(-l,-a)+i[3],g=i[2]*.045,M=a+i[2]*Math.cos(d)+g*Math.sin(n*.6+e*13),x=l+i[2]*Math.sin(d)+g*Math.sin(n*.47+e*7);return s[0]=M,s[1]=x,s[2]=a-M,s[3]=l-x,s}let c=d=>{let g=.5-.5*Math.cos(d*6.2831853),M=Math.sin(d*6.2831853)*.18,x=a-i[2],p=l-i[3],I=Math.hypot(x,p)||1;return[i[2]+x*g-p/I*M*I,i[3]+p*g+x/I*M*I]},h=(n*.04+e)%1,f=c(h),u=c(h+.002);return s[0]=f[0],s[1]=f[1],s[2]=u[0]-f[0],s[3]=u[1]-f[1],s}var Qv={oceanic:"oceanic",barren:"barren","gas-giant":"gas","ice-giant":"ice",volcanic:"volcanic",terrestrial:"terrestrial",dark:"dark"},ty=i=>i.k==="asteroid"?"belt":Qv[i.sub]||"barren",ey={gas:.2,ice:.18,terrestrial:.15,oceanic:.15,volcanic:.145,barren:.13,dark:.13,belt:.16};function ny(i){let t=String(i||""),e=0;for(let n=0;n<t.length;n++)e=e*31+t.charCodeAt(n)|0;return Math.abs(e)%3}function Gd(i){let t=i.slice().sort((n,s)=>n.id-s.id||(n.a<s.a?-1:n.a>s.a?1:0)),e=t.length?En(String(t[0].sys)):0;return t.map((n,s)=>{let r=ri.orbit0+s*ri.orbitStep,o=En(n.a),a=ty(n),l=e*Math.PI*2+s*2.39996323+(o-.5)*.5;return{b:n,i:s,r,a0:l,w:.06/Math.pow(r,1.5),slug:a,variant:ny(n.n),size:ey[a]}})}function Wd(i,t,e=[0,0]){let n=(t.length?t[t.length-1].r:ri.orbit0)+ri.sbGap,s=En(String(i)+":sb")*Math.PI*2;return e[0]=Math.cos(s)*n,e[1]=Math.sin(s)*n,e}function ru(i,t,e,n=[0,0]){let s=t+e*Math.sqrt(i),r=i*2.39996323;return n[0]=Math.cos(r)*s,n[1]=Math.sin(r)*s,n}var iy=(i,t=3)=>(i.res||[]).slice().sort((e,n)=>(n.rich||0)-(e.rich||0)||(e.r<n.r?-1:1)).slice(0,t);function Xd(i,t,e){let n=i.k==="asteroid"?"asteroid":(i.sub||"planet").replace("-"," ")+" planet",s=iy(i).map(r=>`${r.r} ${r.rich}`).join(", ");return`${i.n} - ${n}${s?" - "+s:""} - ${t} fleet${t===1?"":"s"} mining - ${e} claim stake${e===1?"":"s"} - orbit layout stylised (chain has no in-system positions)`}var as={r0:1.08,step:.08,rMax:1.3,spacing:.024,beamCap:24};function qd(i,t,e){let n=Math.min(Math.PI*1.85,Math.PI*.9+t*.03),s=i;for(let r=0;;r++){let o=Math.min(as.r0+r*as.step,as.rMax),a=Math.max(3,Math.floor(n*o*e/as.spacing)),l=t-(i-s);if(s<a||o>=as.rMax){let c=o>=as.rMax?Math.max(1,l):Math.min(a,l),h=((s+.5)/c-.5)*n+(r%2?.5*n/c:0);return{r:o*e,ang:h,layer:r}}s-=a}}var Ur=(i,t)=>i!=null&&typeof t=="string"&&Object.prototype.hasOwnProperty.call(i,t);function lc(i,t,e){if(!i||!i.entries)return-1;let n=Ur(i.configToSlug,t)?i.configToSlug[t]:null;if(n&&Ur(i.aliases,n)&&(n=i.aliases[n]),n&&Ur(i.entries,n))return i.entries[n];let s=i.sizeClass||{};return Ur(s,e)?s[e]:Ur(s,i.fallbackClass)?s[i.fallbackClass]:-1}function Yd(i,t,e){let n=lc(i,t,e);if(n<0)return"";let s=Object.entries(i.sizeClass||{}).find(([,o])=>o===n);return s?`generic ${s[0]} hull`:(Object.keys(i.entries).find(o=>i.entries[o]===n)||"").split("-").map(o=>o&&o[0].toUpperCase()+o.slice(1)).join(" ")+" hull"}var Os={"xx-small":384e-6,"x-small":512e-6,small:704e-6,medium:96e-5,large:.00128,capital:.001664,commander:.00192,titan:.00224},ks=i=>(Ur(Os,i)?Os[i]:Os.medium)/2/.92,ou={galaxy:1,system:1},nn={collapse:.75,full:1.5},Kw=nn.collapse,Jw=nn.full,zs={subwarp:4,warp:10,max:.0096,wSubwarp:.32,wWarp:.22,fadeS:120};var cc=i=>i>1.5?1.15:1;function au(i,t,e,n){let s=new Map(e.filter(a=>a.k==="asteroid").map(a=>[a.a,a.sys])),r=new Map,o=a=>{let l=r.get(a);return l||(l={docked:[],mining:[],cst:[],idle:[]},r.set(a,l)),l};return i.forEach((a,l)=>{let c=a.s&&a.s.kind;if(c==="docked"&&a.s.system){o(a.s.system).docked.push(l);return}if(c==="mining"){let d=s.get(a.s.asteroid);d&&o(d).mining.push(l);return}let h=Qh(a,n);if(!h)return;let f=null,u=.36;for(let d of t){let g=(d.x-h[0])**2+(d.y-h[1])**2;g<u&&(u=g,f=d.a)}f&&o(f)[c==="claimStakeTransfer"?"cst":"idle"].push(l)}),r}function lu(i,t){i=i||{};let e=(i.systems||[]).filter(d=>d&&oe(d.x)&&oe(d.y)),n=new Map((i.systems||[]).filter(d=>d&&d.a).map(d=>[d.a,d])),s=new Map;for(let d of i.asteroids||[])d&&d.a&&d.sys&&s.set(d.a,d.sys);let r=(oe(i.generatedAt)?i.generatedAt:0)-120,o=new Map;for(let d of t||[])for(let g of d&&d.members||[]){let M=o.get(g)||[];M.includes(d.tag)||M.push(d.tag),o.set(g,M)}let a=new Map,l=(d,g)=>{let M=a.get(d);return M||a.set(d,M={}),M[g]||(M[g]={fleets:0,ships:0,stakes:0,ups:0})};for(let d of i.fleets||[]){if(!d||d.npc||!d.s||!oe(d.x)||!oe(d.y))continue;let g=o.get(d.o);if(!g)continue;let M=$d(d,e,s,r);if(!M)continue;let x=Bo(d);for(let p of g){let I=l(M,p);I.fleets++,I.ships+=d.ships||0,I.ups+=x}}for(let d of i.stakes||[]){let g=d&&d.sys?o.get(d.o):null;if(g)for(let M of g)l(d.sys,M).stakes++}let c=(d,g)=>g.fleets-d.fleets||g.stakes-d.stakes||g.ups-d.ups||(d.a<g.a?-1:d.a>g.a?1:0),h=d=>Object.values(d).reduce((g,M)=>({fleets:g.fleets+M.fleets,stakes:g.stakes+M.stakes,ups:g.ups+M.ups}),{fleets:0,stakes:0,ups:0}),f=[...a].map(([d,g])=>{let M=n.get(d)||{};return{a:d,n:M.n||null,x:M.x,y:M.y,byDac:g}}).sort((d,g)=>c({a:d.a,...h(d.byDac)},{a:g.a,...h(g.byDac)})),u={};for(let d of t||[])u[d.tag]=f.filter(g=>g.byDac[d.tag]).map(g=>({a:g.a,n:g.n,x:g.x,y:g.y,...g.byDac[d.tag]})).sort(c);return{systems:f,byDac:u}}function $d(i,t,e,n){let s=i.s.kind;if(s==="docked"&&i.s.system)return i.s.system;if(s==="mining")return e.get(i.s.asteroid)||null;let r=Qh(i,n);if(!r)return null;let o=null,a=.36;for(let l of t){let c=(l.x-r[0])**2+(l.y-r[1])**2;c<a&&(a=c,o=l.a)}return o}var Zd="#8a94a6",sy=/^#[0-9a-fA-F]{6}$/,hc=i=>typeof i=="string"&&sy.test(i)?i.toLowerCase():Zd,si=i=>i?i.fleets+i.stakes:0;function ry(i,t){let e=null;for(let n of t){let s=i[n];!s||si(s)<=0||(!e||si(s)>si(i[e])||si(s)===si(i[e])&&s.ups>i[e].ups)&&(e=n)}return e}function Kd(i,t,e){let n=(t||[]).filter(f=>f&&typeof f.tag=="string"&&f.tag);if(!i||!n.length)return{cols:[],halos:[]};let s=lu(i,n),r=n.map(f=>f.tag),o=new Map(n.map(f=>[f.tag,hc(f.color)])),a=e&&o.has(e)?e:null,l=[],c=[],h=0;for(let f of s.systems)for(let u of r)h=Math.max(h,si(f.byDac[u]));for(let f of s.systems){if(!oe(f.x)||!oe(f.y))continue;let u=r.reduce((x,p)=>x+si(f.byDac[p]),0);if(u<=0)continue;for(let x of r){let p=f.byDac[x],I=si(p);I<=0||c.push({sys:f.a,tag:x,x:f.x,y:f.y,hex:o.get(x),share:I/u,w:I,wmax:h,dim:a&&x!==a})}let d=a||ry(f.byDac,r),g=d&&f.byDac[d];if(!g||si(g)<=0)continue;let M=r.filter(x=>x!==d&&si(f.byDac[x])>0).length;l.push({key:"dac:"+f.a,x:f.x,y:f.y,v:a?si(g):u,fa:"dac",hex:o.get(d),tag:d,sys:f.a,name:f.n||"System",line:`${d}${Bn}${gi(g.fleets,"fleet")}${Bn}${gi(g.stakes,"stake")}${M?`${Bn}+${M} DAC${M===1?"":"s"}`:""}`,fleets:g.fleets,stakes:g.stakes})}return l.sort((f,u)=>u.v-f.v||(f.key<u.key?-1:1)),{cols:l,halos:c,inf:s}}var cu=["mining","stakes","combat","fleets"];function Jd(i,t,e,n,s){i=i||{};let r=(e||[]).filter(b=>b&&typeof b.tag=="string"&&b.tag),o=[...new Set(r.map(b=>b.tag))],a=typeof s=="string"&&o.includes(s)?[s]:o,l=cu.filter(b=>Array.isArray(n)&&n.includes(b)),c=(i.systems||[]).filter(b=>b&&typeof b.a=="string"&&oe(b.x)&&oe(b.y)),h=new Map;for(let b of i.asteroids||[])b&&b.a&&b.sys&&h.set(b.a,b.sys);let f=oe(i.generatedAt)?i.generatedAt:0,u=f-120,d=new Map;for(let b of r)if(a.includes(b.tag))for(let A of b.members||[]){let L=d.get(A)||[];L.includes(b.tag)||L.push(b.tag),d.set(A,L)}let g=new Map,M=(b,A,L,v,P)=>{let N=g.get(b);N||g.set(b,N={});let F=N[A]||(N[A]={T:0,v:{}});F.T+=v;let O=P?d.get(L):null;if(O)for(let Y of O)F.v[Y]=(F.v[Y]||0)+v},x=l.includes("mining"),p=l.includes("fleets");if(x||p)for(let b of i.fleets||[]){if(!b||!b.s||!oe(b.x)||!oe(b.y))continue;let A=$d(b,c,h,u);A&&(x&&M(A,"mining",b.o,Bo(b),!b.npc),p&&M(A,"fleets",b.o,oe(b.ships)?b.ships:0,!b.npc))}if(l.includes("stakes"))for(let b of i.stakes||[])b&&typeof b.sys=="string"&&M(b.sys,"stakes",b.o,1,!0);if(l.includes("combat")){let b=new Set,A=oc*oc,L=new Map;for(let v of i.fleets||[])v&&v.a&&L.set(v.a,v.o);for(let v of t||[]){if(!v||!tu(v)||!oe(v.t)||!oe(v.x)||!oe(v.y)||v.t>f||v.t<=f-86400)continue;if(Fs(v)&&v.f){if(b.has(v.f))continue;b.add(v.f)}let P=null,N=A;for(let F of c){let O=(F.x-v.x)**2+(F.y-v.y)**2;(O<N||O===N&&P&&F.a<P.a)&&(N=O,P=F)}P&&M(P.a,"combat",typeof v.o=="string"?v.o:L.get(v.f),1,v.npc!==!0)}}let I=[],U=Object.fromEntries(a.map(b=>[b,0])),E=0;for(let b of c.slice().sort((A,L)=>A.a<L.a?-1:A.a>L.a?1:0)){let A=g.get(b.a);if(!A)continue;let L={},v=0;for(let O of l){let Y=A[O];if(!(!Y||!(Y.T>0))){v++;for(let z of a)Y.v[z]>0&&(L[z]=(L[z]||0)+Y.v[z]/Y.T)}}if(!v)continue;let P=null,N=0;for(let O of a)L[O]>N&&(N=L[O],P=O);let F=!!P&&a.some(O=>O!==P&&L[O]>0&&Math.abs(L[O]-N)<=1e-9);F?E++:P&&U[P]++,I.push({a:b.a,n:b.n||null,x:b.x,y:b.y,winner:F?null:P,contested:F,strength:P&&!F?N/v:0,scores:L})}return{systems:I,byDac:U,contested:E}}function jd(i,t){let e=new Map((t||[]).filter(h=>h&&typeof h.tag=="string").map(h=>[h.tag,hc(h.color)])),n=i&&i.byDac||{},s=[];for(let h of i&&i.systems||[]){if(!h||!h.winner||!oe(h.x)||!oe(h.y))continue;let f=Math.round(Math.max(0,Math.min(1,h.strength))*100),u=n[h.winner]||0;s.push({key:"dac:"+h.a,x:h.x,y:h.y,v:Math.max(1,f),fa:"dac",hex:e.get(h.winner)||Zd,tag:h.winner,sys:h.a,name:h.n||"System",line:`${h.winner}${Bn}conquers ${gi(u,"system")}`,strength:h.strength,won:u,callout:!1})}let r=(h,f)=>f.v-h.v||(h.key<f.key?-1:h.key>f.key?1:0);s.sort(r);let o=new Map;for(let h of s){let f=o.get(h.tag)||[0,0];f[0]+=h.strength,f[1]++,o.set(h.tag,f)}let a=[],l=new Set;for(let h of s)l.has(h.tag)||(l.add(h.tag),h.callout=!0,a.push(h));let c=h=>{let f=o.get(h);return f[0]/f[1]};return a.sort((h,f)=>f.won-h.won||c(f.tag)-c(h.tag)||(h.tag<f.tag?-1:h.tag>f.tag?1:0)),a.concat(s.filter(h=>!h.callout))}function Qd(i){let t=i.s&&i.s.kind||"idle";return`${i.n||"Fleet"} - ${i.ships||0} ship${i.ships===1?"":"s"} - ${t}${i.npc?" (NPC)":""}`}var tp=i=>`${i.n||"System"} - ${en(i.f)} starbase lvl ${i.lvl||0}`,ep=i=>`${i.sysName||"Asteroid"} asteroid - ${i.fleets||0} fleets - ${(i.ups||0).toFixed(1)} u/s`;var Vs=[.8,3.2],Hs=[3.5,14],xi=[2.5,10],Gs=[1,4],ip=[.8,3.2],sp=12,oy=.4,Fr=384,Br=6,op=5,ay=["gas","ice","terrestrial","oceanic","volcanic","barren","dark"],Or=[...ay.flatMap(i=>[0,1,2].map(t=>`${i}_${t}_384.webp`)),...[0,1,2,3,4].map(i=>`star_${i}_384.webp`)],rp={gas:[.85,.7,.5],ice:[.55,.82,1],terrestrial:[.45,.75,.45],oceanic:[.2,.5,1],volcanic:[1,.45,.2],barren:[.62,.6,.58],dark:[.35,.35,.55],belt:[.6,.55,.5]},Ws=`
uniform float uViewH;
vec3 relOf(vec2 c, vec2 loc) { return vec3((c.x - cameraPosition.x) + loc.x, -cameraPosition.y, (-c.y - cameraPosition.z) - loc.y); }
vec3 viewOf(vec3 r) { return mat3(viewMatrix) * r; }
float lodS(float a, float b, float x) { return smoothstep(log2(a), log2(b), log2(max(x, 1e-6))); } // LOD fade by log px (v11)
float ppuOf(vec3 v) { return projectionMatrix[1][1] * 0.5 * uViewH / max(-v.z, 1e-7); }
vec4 clipOf(vec3 v) { return projectionMatrix * vec4(v, 1.0); }
#define COLLAPSE { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
`,ly=Ws+`
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
  float al = kind == 2 ? lodS(${xi[0].toFixed(2)}, ${xi[1].toFixed(2)}, rpx) : lodS(${Vs[0].toFixed(2)}, ${Vs[1].toFixed(2)}, rpx);
  if (al < 0.002) COLLAPSE
  // quad half-size in disc radii: room for the star's corona / the hover ring / a worked rock's indicator ring
  float qs = kind == 2 ? 2.6 : (iW.x > 0.5 ? 1.75 : 1.25);
  // the renders are lit from screen angle 145 deg (upper-left): turn the sprite so that side faces the star (kind 2: none)
  float ang = 0.0;
  if (kind != 2) { vec3 ts = mat3(viewMatrix) * vec3(-loc.x, 0.0, loc.y); if (dot(ts.xy, ts.xy) > 1e-20) ang = atan(ts.y, ts.x + 1e-12) - 2.5307274; }
  float c = cos(ang), s = sin(ang);
  vec2 q = position.xy; vec2 rq = vec2(c * q.x - s * q.y, s * q.x + c * q.y);
  vP = position.xy * 2.0; vQs = qs; vCol = iC; vKind = float(kind); vCell = iQ.w; vA = al;
  vArtK = iArt < 0.0 ? 0.0 : clamp((uTime - iArt) / ${oy.toFixed(2)}, 0.0, 1.0);
  vW = iW; vWC = iWC; vHi = abs(float(gl_InstanceID) - uHiId) < 0.5 ? 1.0 : 0.0; vSeed = iW.w;
  // the miners' hulls on this rock: a medium hull's px here (the indicator dims as the ships themselves show)
  vShips = smoothstep(1.5, 4.0, ${Os.medium.toFixed(6)} / 0.92 * ppu);
  gl_Position = clipOf(v + vec3(rq * iQ.y * qs * 2.0, 0.0));
}`,cy=`
uniform sampler2D uArt; uniform float uAnim;
varying vec2 vP; varying vec3 vCol; varying float vKind; varying float vCell; varying float vA; varying float vArtK; varying float vQs;
varying vec4 vW; varying vec3 vWC; varying float vHi; varying float vSeed; varying float vShips;
vec4 artAt(vec2 uv) {
  float cell = floor(vCell + 0.5), cx = mod(cell, ${Br.toFixed(1)}), cy = floor(cell / ${Br.toFixed(1)});
  vec4 t = texture2D(uArt, vec2((cx + uv.x) / ${Br.toFixed(1)}, 1.0 - (cy + 1.0 - uv.y) / ${op.toFixed(1)}));
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
}`,hy=Ws+`
attribute vec4 iP; // (system x, y, orbit radius world, belt 0/1)
varying vec2 vP; varying float vA; varying float vBelt;
void main() {
  vec3 c = viewOf(relOf(iP.xy, vec2(0.0)));
  float rpx = iP.z * ppuOf(c);
  float al = lodS(${Hs[0].toFixed(2)}, ${Hs[1].toFixed(2)}, rpx);
  if (al < 0.002) COLLAPSE
  vP = position.xy * 2.0; vA = al; vBelt = iP.w;
  gl_Position = clipOf(viewOf(relOf(iP.xy, position.xy * 2.0 * iP.z)));
}`,uy=`
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
}`,fy=Ws+`
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
}`,dy=`
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
}`,py=Ws+`
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
  float al = lodS(${ip[0].toFixed(2)}, ${ip[1].toFixed(2)}, px);
  if (al < 0.002) COLLAPSE
  vP = position.xy * 2.0; vCol = iC; vA = al;
  gl_Position = clipOf(v + vec3(position.xy * iQ.w * 2.0, 0.0));
}`,my=`
varying vec2 vP; varying vec3 vCol; varying float vA;
void main() {
  float d = abs(vP.x) + abs(vP.y);
  float body = smoothstep(0.62, 0.56, d), edge = smoothstep(0.08, 0.0, abs(d - 0.62)), flag = smoothstep(0.32, 0.26, d);
  vec3 c = mix(vec3(0.02), vCol * 1.3, body) + vCol * edge * 0.8 + vec3(1.0) * flag * 0.35;
  float a = smoothstep(0.7, 0.62, d);
  gl_FragColor = vec4(c * a, a * 0.95) * vA;
}`;function ap(i){let{scene:t,camera:e,U:n,quadGeometry:s,instanceAttrs:r,shaderMat:o,assetBase:a}=i,l=document.createElement("canvas");l.width=Br*Fr,l.height=op*Fr;let c=l.getContext("2d"),h=new ao(l);h.colorSpace=cn,h.anisotropy=4;let f=Or.map(()=>0),u=0,d=0,g=0,M=!1,x=0,p=new Map(Or.map((W,et)=>[W,et])),I=s(),U=s(),E=s(),b=s(),A={uAnim:n.uAnim,uTime:n.uTime,uViewH:n.uViewH,uArt:{value:h},uHiId:{value:-1}},L=new ze(I,o(ly,cy,A,null,"premult")),v=new ze(U,o(hy,uy,{uViewH:n.uViewH},null,"add")),P={uAnim:n.uAnim,uViewH:n.uViewH,uHiSys:{value:-1}},N=new ze(E,o(fy,dy,P,null,"premult")),F=new ze(b,o(py,my,{uAnim:n.uAnim,uViewH:n.uViewH},null,"premult"));for(let[W,et]of[[v,3.4],[N,4.2],[L,4.4],[F,4.6]])W.frustumCulled=!1,W.renderOrder=et,t.add(W);let O=null,Y=[["iP",4],["iQ",4],["iC",3],["iW",4],["iWC",3],["iArt",1]];function z(W){let et=W.systems,St=W.bodiesBySys||new Map,vt=Vd(et,R=>(St.get(R)||[]).length),yt=[],Ft=[],Ne=new Map;for(let R=0;R<et.length;R++){let Pt=et[R],zt=Gd(St.get(Pt.a)||[]),T=vt.get(Pt.a)||Ii.K,m=Wd(Pt.a,zt),H={s:Pt,si:R,k:T,layout:zt,ext:ko(zt.length)*T,sb:[m[0]*T,m[1]*T],sbHalf:.16*T,starR:ri.starR*T,starCell:p.get(`star_${Math.floor(En(String(Pt.a)+":star")*5)}_384.webp`),b0:Ft.length,nb:zt.length,members:null,worked:new Map,stakeN:new Map,sx:0,sy:0,ppu:0,extPx:0,on:!1};for(let X of zt){let tt=X.slug==="belt"?-1:p.get(`${X.slug}_${X.variant}_384.webp`);Ft.push({si:R,L:X,r:X.r*T,R:X.size*T,a0:X.a0,w:X.w,kind:X.b.k==="asteroid"?1:0,cell:tt??-1})}yt.push(H),Ne.set(Pt.a,H)}let ee=Ft.length,ve=ee+yt.length,ye=new Map(Ft.map((R,Pt)=>[R.L.b.a,Pt])),re=new Array(W.fleets.length).fill(null);for(let R of yt){let Pt=W.members&&W.members.get(R.s.a);if(!Pt)continue;R.members=Pt;let zt=R.k,T=R.s.x,m=R.s.y,H=[0,0];Pt.docked.forEach((ft,D)=>{ru(D,.07,.016,H),re[ft]={mode:1,A:[T,m,R.sb[0]+H[0]*zt,R.sb[1]+H[1]*zt],O:[R.sb[0],R.sb[1],0,1],T:[0,0],si:R.si,role:"docked"}}),Pt.idle.forEach((ft,D)=>{ru(D,ri.idleR0,.02,H);let k=H[0]*zt,at=H[1]*zt;re[ft]={mode:1,A:[T,m,k,at],O:[k,at,0,1],T:[0,0],si:R.si,role:"idle"}});let X=new Map,tt=[];for(let ft of Pt.mining){let D=ye.get(W.fleets[ft].s.asteroid);if(D==null||Ft[D].si!==R.si)continue;let k=X.get(D)||0;X.set(D,k+1),tt.push({i:ft,bi:D,j:k})}for(let ft of tt){let D=Ft[ft.bi];ft.slot=qd(ft.j,X.get(ft.bi),D.L.size)}tt.slice().sort((ft,D)=>ft.slot.layer-D.slot.layer||ft.j-D.j||ft.bi-D.bi).forEach((ft,D)=>{ft.beam=D<as.beamCap});for(let ft of tt){let D=Ft[ft.bi];re[ft.i]={mode:2,A:[T,m,ft.slot.r*zt,ft.slot.ang],O:[D.r,D.a0,D.w,2],T:[D.R,ft.beam?1:0],si:R.si,role:"mining",bi:ft.bi};let k=W.fleets[ft.i],at=k.npc?"unaligned":en(k.fa),Q=Bo(k),Ut=R.worked.get(ft.bi);Ut||R.worked.set(ft.bi,Ut={n:0,ups:0,byFa:{}}),Ut.n++,Ut.ups+=Q,Ut.byFa[at]=(Ut.byFa[at]||0)+Q+1e-9}for(let ft of Pt.cst){let D=W.fleets[ft],k=(W.stakes||[]).find(Q=>Q.o===D.o&&ye.has(Q.body)&&Ft[ye.get(Q.body)].si===R.si),at=k?ye.get(k.body):-1;if(at<0){let Q=R.layout.find(Ut=>Ut.b.k==="planet"&&Ut.b.claimed)||R.layout.find(Ut=>Ut.b.k==="planet");Q&&(at=ye.get(Q.b.a))}re[ft]=at>=0?{mode:3,A:[T,m,R.sb[0],R.sb[1]],O:[Ft[at].r,Ft[at].a0,Ft[at].w,3],T:[0,0],si:R.si,role:"cst",bi:at}:{mode:1,A:[T,m,R.sb[0],R.sb[1]],O:[R.sb[0],R.sb[1],0,1],T:[0,0],si:R.si,role:"cst"}}}let jt=r(I,Y,ve);for(let R=0;R<ee;R++){let Pt=Ft[R],zt=yt[Pt.si].s;jt.iP.array.set([zt.x,zt.y,Pt.r,Pt.a0],R*4),jt.iQ.array.set([Pt.w,Pt.R,Pt.kind,f[Pt.cell]===2?Pt.cell:-1],R*4),jt.iC.array.set(rp[Pt.L.slug]||rp.barren,R*3);let T=yt[Pt.si].worked.get(R);if(T){let m=Object.entries(T.byFa).sort((H,X)=>X[1]-H[1])[0][0];jt.iW.array.set([T.n,Math.min(1,Math.log10(1+T.ups)/3.2),0,En(Pt.L.b.a)],R*4),jt.iWC.array.set(Li[m],R*3),Pt.work={n:T.n,ups:T.ups,fa:m}}else jt.iW.array.set([0,0,0,En(Pt.L.b.a)],R*4),jt.iWC.array.set([0,0,0],R*3),Pt.work=null;jt.iArt.array[R]=f[Pt.cell]===2?-1e3:-1}for(let R=0;R<yt.length;R++){let Pt=yt[R],zt=ee+R;jt.iP.array.set([Pt.s.x,Pt.s.y,0,0],zt*4),jt.iQ.array.set([0,Pt.starR,2,f[Pt.starCell]===2?Pt.starCell:-1],zt*4),jt.iC.array.set([1,.8,.45],zt*3),jt.iW.array.set([0,0,0,0],zt*4),jt.iWC.array.set([0,0,0],zt*3),jt.iArt.array[zt]=f[Pt.starCell]===2?-1e3:-1}for(let R in jt)jt[R].needsUpdate=!0;let Ue=r(U,[["iP",4]],ee);for(let R=0;R<ee;R++){let Pt=Ft[R],zt=yt[Pt.si].s;Ue.iP.array.set([zt.x,zt.y,Pt.r,Pt.kind],R*4)}Ue.iP.needsUpdate=!0;let Ce=r(E,[["iP",4],["iQ",4],["iC",3]],yt.length);yt.forEach((R,Pt)=>{Ce.iP.array.set([R.s.x,R.s.y,R.sb[0],R.sb[1]],Pt*4),Ce.iQ.array.set([R.sbHalf,R.s.lvl||0,0,0],Pt*4),Ce.iC.array.set(Li[en(R.s.f)],Pt*3)});for(let R in Ce)Ce[R].needsUpdate=!0;let we=[];for(let R of W.stakes||[]){let Pt=ye.get(R.body);if(Pt==null)continue;let zt=yt[Ft[Pt].si],T=zt.stakeN.get(Pt)||0;zt.stakeN.set(Pt,T+1),we.push({st:R,bi:Pt,k:T,fa:W.ownerFa&&W.ownerFa.get(R.o)||"unaligned"})}let Ie=r(b,[["iP",4],["iQ",4],["iC",3]],we.length);we.forEach((R,Pt)=>{let zt=Ft[R.bi],T=yt[zt.si].s,m=yt[zt.si].k;Ie.iP.array.set([T.x,T.y,zt.r,zt.a0],Pt*4),Ie.iQ.array.set([zt.w,R.k*1.1+.6,zt.R*1.35,.024*m],Pt*4),Ie.iC.array.set(Li[en(R.fa)],Pt*3)});for(let R in Ie)Ie[R].needsUpdate=!0;return O={infos:yt,bodyAt:Ft,byAddr:Ne,bodyIdx:ye,place:re,nb:ee,stakeList:we},Zt(),O}function j(W){if(W==null||W<0||f[W])return;f[W]=1,u++;let et=new Image;et.onload=()=>{if(!O)return;c.drawImage(et,W%Br*Fr,Math.floor(W/Br)*Fr,Fr,Fr),f[W]=2,d++,M=!0;let St=I.getAttribute("iQ"),vt=I.getAttribute("iArt");for(let yt=0;yt<O.bodyAt.length;yt++)O.bodyAt[yt].cell===W&&(St.array[yt*4+3]=W,vt.array[yt]=n.uTime.value);O.infos.forEach((yt,Ft)=>{yt.starCell===W&&(St.array[(O.nb+Ft)*4+3]=W,vt.array[O.nb+Ft]=n.uTime.value)}),St.needsUpdate=vt.needsUpdate=!0},et.onerror=()=>{f[W]=3,g++,console.warn("C4Scene: planet render failed to load, using the placeholder sphere:",Or[W])},et.src=a+Or[W]}function ht(W){M&&W-x>200&&(h.needsUpdate=!0,M=!1,x=W)}function ct(W,et,St=[0,0]){let vt=O.bodyAt[W],yt=O.infos[vt.si].s,Ft=vt.a0+vt.w*et;return St[0]=yt.x+vt.r*Math.cos(Ft),St[1]=yt.y+vt.r*Math.sin(Ft),St}let gt=new G,ot=new G;function dt(W,et){if(!O)return;let St=e.projectionMatrix.elements[5];for(let vt of O.infos){ot.set(vt.s.x,0,-vt.s.y).applyMatrix4(e.matrixWorldInverse);let yt=-ot.z;if(yt<=1e-6){vt.on=!1,vt.extPx=0;continue}if(gt.set(vt.s.x,0,-vt.s.y).project(e),vt.sx=(gt.x+1)/2*W,vt.sy=(1-gt.y)/2*et,vt.ppu=St*.5*et/yt,vt.extPx=vt.ext*vt.ppu,vt.on=vt.sx>-vt.extPx-40&&vt.sx<W+vt.extPx+40&&vt.sy>-vt.extPx-40&&vt.sy<et+vt.extPx+40,!(!vt.on||vt.extPx<20)){vt.starR*vt.ppu>=sp&&j(vt.starCell);for(let Ft=vt.b0;Ft<vt.b0+vt.nb;Ft++)O.bodyAt[Ft].R*vt.ppu>=sp&&j(O.bodyAt[Ft].cell)}}}let xt=!0;function Zt(){if(!O)return;let W=I.getAttribute("iW");for(let et=0;et<O.nb;et++){let St=O.bodyAt[et];W.array[et*4]=St.work&&xt?St.work.n:0}W.needsUpdate=!0}function Xt(W,et){xt=!!et,Zt()}function Ee(W){L.visible=v.visible=N.visible=F.visible=!!W}function pe(W,et){A.uHiId.value=W??-1,P.uHiSys.value=et??-1}function Me(){for(let W of[L,v,N,F])t.remove(W),W.geometry.dispose(),W.material.dispose();h.dispose(),O=null}return{build:z,lod:dt,bodyPos:ct,requestArt:j,flushArt:ht,setLayers:Xt,setVisible:Ee,setHover:pe,dispose:Me,get world(){return O},texStats:()=>({texRequested:u,texLoaded:d,texFailed:g,atlasCells:Or.length}),artFiles:Or}}var uu=["systems","fleets","mining","routes","combat","territory","labels"],wn={x:.5,y:.5,dist:128,polar:.72},gy={combat:0,destroyed:1,starbaseCombat:2,captured:3,newFleet:4,gone:5},xy=[3,6,4.5,9,2.6,1.6],_y=[[1,.55,.2],[1,.3,.15],[1,.78,.32],null,null,[.55,.66,.85]],uc=64,fc=48,vy=3,kr=42,yy=40,lp=.01,My=2500,Sy=2.5,by=10,wy=20,Ty=20,Ay=.35,Ey=.22,Vo=Ws+`
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
`,Cy=Vo+`
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
  if (px < ${nn.collapse.toFixed(2)}) COLLAPSE
  vFade = smoothstep(${nn.collapse.toFixed(2)}, ${nn.full.toFixed(2)}, px); // fades out below HULL_PX.full instead of a floor
  vec2 w = (side * position.x + dir * position.y) * size * 2.0;
  vP = position.xy * 2.0; vCol = iC; vVis = iM.z; vSeed = iM.w; vSil = sil; vCell = iX.x;
  vKind = mode == 2 || mode == 3 ? 4.0 : (mode == 0 && transit(k) && !flying) ? 0.0 : float(k);
  gl_Position = clipOf(viewOf(relOf(c, loc + w)));
}`,Ry=3.2,cp=[1.5,4],Py=Vo+`
uniform float uSil; uniform float uHasAtlas; uniform float uShipBase; uniform float uDots;
varying vec2 vP; varying vec3 vCol; varying float vA;
void main() {
  if (uDots < 0.5 || iM.z < 0.5) COLLAPSE   // filtered-out fleets: a dimmed dot stacks back to full brightness in a pile
  int k = kindOf();
  vec2 c, loc, hd; place(c, loc, hd);
  float sil = (uHasAtlas > 0.5 && iX.x >= 0.0 && k != 5) ? uSil : 0.0;
  float size = uShipBase * iX.y * (iM.z > 1.5 ? 1.15 : 1.0) * mix(1.8, 1.0, sil);
  float ppu = ppuOf(viewOf(relOf(c, loc)));
  vA = min(iM.z, 1.0) * (1.0 - smoothstep(${cp[0].toFixed(2)}, ${cp[1].toFixed(2)}, size * 2.0 * ppu));
  if (vA < 0.004) COLLAPSE
  vP = position.xy * 2.0; vCol = iC;
  gl_Position = clipOf(viewOf(relOf(c, loc + position.xy * ${Ry.toFixed(2)} / ppu)));
}`,Iy=`
varying vec2 vP; varying vec3 vCol; varying float vA;
void main() {
  float a = smoothstep(1.0, 0.7, length(vP)) * vA;
  gl_FragColor = vec4(vCol * 0.8 * a, a);   // under 1.0 so the bloom pass keeps the faction hue on such a small mark
}`,Ly=`
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
}`,Dy=Vo+`
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
  if (px < ${nn.collapse.toFixed(2)}) COLLAPSE
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
  vA = fade * min(iM.z, 1.0) * (wdt / wd) * smoothstep(${nn.collapse.toFixed(2)}, ${nn.full.toFixed(2)}, px);
  gl_Position = clipOf(viewOf(relOf(p, mix(-dir * tl, vec2(0.0), u) + side * position.x * wd)));
}`,Ny=`
uniform float uAnim;
varying float vU; varying float vX; varying vec3 vCol; varying float vA; varying float vWarp;
void main() {
  float a = pow(clamp(vU, 0.0, 1.0), 1.7) * (1.0 - vX * vX);
  vec3 col = mix(vCol, vec3(0.65, 0.95, 1.0), vWarp * 0.6);
  float shimmer = 0.82 + 0.18 * sin(vU * 46.0 - uAnim * 18.0);
  gl_FragColor = vec4(col * a * vA * shimmer * 1.3, 1.0);
}`,gp=4,Uy=Vo+`
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
  gl_Position = clipOf(viewOf(relOf(c, side * position.x * ${gp.toFixed(1)} * upx)));
}`,Fy=`
uniform float uAnim;
varying float vU; varying float vX; varying vec3 vCol; varying float vLen; varying float vA;
void main() {
  float xp = vX * ${(gp/2).toFixed(1)};                 // CSS px from the centre line
  float prof = exp(-xp * xp * 2.0) + exp(-xp * xp * 0.6) * 0.12;  // crisp ~1.2 px core + faint halo
  float f = fract(vU * vLen / 1.6 - uAnim * 0.35);
  float flow = 0.55 + 0.45 * smoothstep(0.0, 0.45, f) * smoothstep(1.0, 0.55, f); // soft travelling pulses, no hard dashes
  float a = prof * flow * (0.3 + 0.45 * vU) * vA;
  gl_FragColor = vec4(mix(vCol, vec3(0.55, 0.7, 0.85), 0.15) * a * 0.42, 1.0);
}`,Oy=Vo+`
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
  if (px < ${nn.collapse.toFixed(2)}) COLLAPSE
  vec2 e0 = b - dir * iT.x * 0.92, e1 = loc + dir * hz * 0.9; // rock surface (u 0) -> ship nose (u 1)
  float u = position.y + 0.5;
  vU = u; vX = position.x * 2.0; vCol = iC; vLen = length(e1 - e0) / (hz * 2.0) * 0.3; vSeed = iM.w;
  vA = min(iM.z, 1.0) * smoothstep(${nn.collapse.toFixed(2)}, ${nn.full.toFixed(2)}, px);
  gl_Position = clipOf(viewOf(relOf(c, mix(e0, e1, u) + side * position.x * hz * 0.24)));
}`,By=`
uniform float uAnim; uniform float uBeamGain;
varying float vU; varying float vX; varying vec3 vCol; varying float vLen; varying float vSeed; varying float vA;
void main() {
  float f = fract(vU * vLen * 1.6 - uAnim * 1.4 + vSeed * 7.0);
  float bead = smoothstep(0.22, 0.0, abs(f - 0.5));
  float a = (0.22 + bead * 0.95) * (1.0 - vX * vX) * smoothstep(0.0, 0.2, vU) * vA;
  gl_FragColor = vec4(mix(vec3(1.0, 0.84, 0.42), vCol, 0.35) * a * 0.42 * uBeamGain, 1.0);
}`,ky=Ws+`
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
}`,zy=`
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
}`,Xs=0,Vy=.3,pc=2.2,Hy=8,Gy=400,Wy=.5,Xy=3,qy=`
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
  vec3 base = vec3(iS.x, ${Xs.toFixed(2)}, -iS.y); // the system glyph's own plane: the column rises from its centre
  // the quad is STAT_GLOW x the body width: the body stays thin (owner), the extra is a soft glow either side
  vec3 w = base + right * position.x * wd * ${pc.toFixed(1)} + vec3(0.0, 1.0, 0.0) * (position.y + 0.5) * h;
  vQ = vec2(position.x * 2.0 * ${pc.toFixed(1)}, position.y + 0.5); vCol = iC; vVis = iM.x; vSeed = iM.y; vH = h; vHot = iM.w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}`,Yy=`
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
  c *= min(vVis, 1.0) * smoothstep(${pc.toFixed(1)}, ${(pc*.7).toFixed(2)}, x) * (vHot > 0.5 ? 1.1 : 1.0);
  gl_FragColor = vec4(c, 1.0);
}`,$y=`
uniform float uStatW; uniform float uGrow; uniform float uViewH;
attribute vec4 iS; attribute vec3 iC; attribute vec4 iM;
varying vec2 vQ; varying vec3 vCol; varying float vVis;
void main() {
  if (iM.x < 0.001 || iS.z <= 0.0 || uGrow <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  // quad 1.6 x the body width; the dot ~1.2 x the body width (r 0.73 in vQ = 0.365 wd), so it shows below the column at any
  // zoom. v11: a galaxy MARKER (not a world object), so the dot keeps >= 3 px radius - a far column's dot (~1 px) hid
  // under its own column foot (#50 base disc: 4 of 12 columns had no light below the base point)
  vec4 vc = viewMatrix * vec4(iS.x, ${Xs.toFixed(2)} - 0.001, -iS.y, 1.0);
  float ppu = projectionMatrix[1][1] * 0.5 * uViewH / max(-vc.z, 1e-6);
  float wd = max(iS.w * uStatW * 1.6, 3.0 / (0.365 * ppu));
  vec3 w = vec3(iS.x + position.x * wd, ${Xs.toFixed(2)} - 0.001, -(iS.y + position.y * wd));
  vQ = position.xy * 2.0; vCol = iC; vVis = iM.x * min(1.0, uGrow * 2.0);
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}`,Zy=`
varying vec2 vQ; varying vec3 vCol; varying float vVis;
void main() {
  float r = length(vQ);
  float d = smoothstep(0.8, 0.66, r) * 0.45;  // a solid dot ~1.2 x the body width, no halo (it must not light the starbase rings - #44)
  gl_FragColor = vec4(vCol * d * min(vVis, 1.0), 1.0);
}`,Ky=.3,xp=.06,Jy=.15,jy=1.5,_p=1.24,vp=4.5,Qy=7,tM=10,eM=1.25,nM=`
uniform float uGrow; uniform float uViewH; uniform float uZoom;
attribute vec4 iS; attribute float iK;
varying vec2 vQ; varying float vR; varying float vB; varying float vT; varying float vK;
void main() {
  if (iS.z <= 0.0 || uGrow <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  vT = clamp((iS.w - ${Fo.toFixed(3)}) / ${(1-Fo).toFixed(3)}, 0.0, 1.0); // richness t back from the brightness
  float R = iS.z * clamp(uZoom, 0.6, 1.3) * uGrow;
  vec4 vc = viewMatrix * vec4(iS.x, 0.0, -iS.y, 1.0);
  float ppu = projectionMatrix[1][1] * 0.5 * uViewH / max(-vc.z, 1e-6);
  // room for the stroke's px floor + its edge; a 'both' ring also needs its outer dotted ring (and that ring's px floor)
  float outer = iK > 1.5 ? ${_p.toFixed(2)} : 1.0, pad = (iK > 1.5 ? ${(vp+4).toFixed(1)} : 4.0) / max(ppu, 1e-6);
  float hs = R * outer * (1.0 + ${xp.toFixed(2)}) + pad;
  vQ = position.xy * 2.0 * hs; vR = R; vB = iS.w * min(1.0, uGrow * 1.5); vK = iK;
  gl_Position = projectionMatrix * viewMatrix * vec4(iS.x + vQ.x, 0.001, -(iS.y + vQ.y), 1.0);
}`,iM=`
uniform vec3 uCol;
varying vec2 vQ; varying float vR; varying float vB; varying float vT; varying float vK;
// 1 on a dot, 0 in a gap, for the ring of radius r (map units) at this fragment: n dots round the ring, soft edges of 1 px
float dots(float r, float px) {
  float n = max(${tM.toFixed(1)}, floor(6.2831853 * r / (px * ${Qy.toFixed(1)})));
  float f = fract(atan(vQ.y, vQ.x) / 6.2831853 * n + 0.25);
  float w = clamp(n * px / (6.2831853 * max(r, 1e-6)), 0.0, 0.2);   // 1 px as a fraction of one dot + gap
  return smoothstep(0.0, w, f) * (1.0 - smoothstep(0.5, 0.5 + w, f));
}
void main() {
  float d = length(vQ), px = max(fwidth(d), 1e-6);   // map units per screen px here (tilt-aware)
  // stroke: ~1.4 px on the poorest ring up to ~3.6 px on the richest, so a rich ring reads at the home view by weight too
  float hw = max(vR * ${(xp/2).toFixed(3)}, px * (0.7 + 1.1 * vT)), e = abs(d - vR);
  float line = 1.0 - smoothstep(hw, hw + px, e);
  // soft glow inside the stroke, strongest at it and gone by ~45 % of the radius (the system dot stays clear)
  float q = clamp(d / max(vR, 1e-6), 0.0, 1.0);
  float glow = smoothstep(0.45, 1.0, q) * q * q * (1.0 - smoothstep(vR - px * 0.5, vR + px * 0.5, d)) * ${Jy.toFixed(2)};
  float beltOnly = step(0.5, vK) * (1.0 - step(1.5, vK)), both = step(1.5, vK);
  // asteroid belt only: the ring itself is dotted
  line *= mix(1.0, dots(vR, px) * ${eM.toFixed(2)}, beltOnly);
  // planets AND a belt: a second, dotted ring just outside the solid one
  float r2 = max(vR * ${_p.toFixed(2)}, vR + px * ${vp.toFixed(1)});
  float hw2 = max(hw * 0.8, px * 0.8);
  float line2 = both * (1.0 - smoothstep(hw2, hw2 + px, abs(d - r2))) * dots(r2, px);
  gl_FragColor = vec4(uCol * vB * ${jy.toFixed(2)} * (max(line, line2) * 0.85 + glow), 1.0);
}`,sM=.42,rM=.55,oM=.12,aM=.32,lM=.28,hp=.62,cM=40,hM=16,dc=12,uM=`
uniform float uHaloK;
attribute vec4 iS; attribute vec3 iC; attribute vec4 iM;
varying vec2 vQ; varying vec3 vCol; varying float vA;
void main() {
  if (iM.x < 0.001) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  float r = iS.z * uHaloK;
  vec3 w = vec3(iS.x + position.x * r * 2.0, 0.0, -(iS.y + position.y * r * 2.0));
  vQ = position.xy * 2.0; vCol = iC; vA = iM.x;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}`,fM=`
varying vec2 vQ; varying vec3 vCol; varying float vA;
void main() {
  float q = length(vQ);
  float core = exp(-q * q * 3.2) * 0.8 + 0.2 * smoothstep(1.0, 0.55, q);
  float rim = exp(-pow((q - 0.86) * 16.0, 2.0)) * 0.35;
  gl_FragColor = vec4(vCol * (core + rim) * smoothstep(1.0, 0.92, q) * vA * ${aM.toFixed(2)}, 1.0);
}`,zo="#8a94a6",dM=`
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
}`,yp=`#define COLLAPSE { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
`,pM=yp+`
uniform float uZoom;
attribute vec4 iS; attribute vec4 iM;
varying vec2 vP; varying vec4 vM; varying float vHeat;
void main() {
  if (iM.w < 0.001) COLLAPSE
  vec2 w = iS.xy + position.xy * iS.z * 2.0 * clamp(uZoom, 0.6, 1.3);
  vP = position.xy * 2.0; vM = iM; vHeat = iS.w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w.x, 0.0, -w.y, 1.0);
}`,mM=`
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
}`,gM=yp+`
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
}`,xM=`
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
}`,_M=`
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
}`,vM=`
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
}`,up=`
varying vec2 vUv; varying vec2 vW;
void main() { vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = vec2(w.x, -w.z); gl_Position = projectionMatrix * viewMatrix * w; }`,yM=`
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
}`,MM=`
varying vec2 vW;
void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xz; gl_Position = projectionMatrix * viewMatrix * w; }`,SM=`
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
}`,fp=.5,bM=62,wM=72,TM=`
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
    behind = smoothstep(${bM.toFixed(1)}, ${wM.toFixed(1)}, distance(vec2(hit.x, -hit.z), vec2(${fp.toFixed(2)}, ${fp.toFixed(2)})));
  }
  if (behind < 0.001) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  float tw = 0.75 + 0.25 * sin(uAnim * (0.6 + aSeed * 2.0) + aSeed * 50.0);
  vCol = aCol * tw * behind;
  gl_PointSize = clamp(aSize * uPR * 260.0 / -mv.z, 1.0, 6.0 * uPR);
  gl_Position = projectionMatrix * mv;
}`,AM=`
varying vec3 vCol;
void main() { vec2 q = gl_PointCoord * 2.0 - 1.0; float r2 = dot(q, q); gl_FragColor = vec4(vCol * exp(-r2 * 4.0), 1.0); }`;function Di(){let i=new Ci(1,1),t=new fo;return t.index=i.index,t.setAttribute("position",i.getAttribute("position")),t.setAttribute("uv",i.getAttribute("uv")),t.instanceCount=0,t}function Ni(i,t,e){let n=i.getAttribute(t[0][0]);if(!n||n.count<e){let r=Math.max(64,2**Math.ceil(Math.log2(Math.max(1,e))));n&&i.dispose();for(let[o,a]of t){let l=new io(new Float32Array(r*a),a);l.setUsage(ph),i.setAttribute(o,l)}}i.instanceCount=e;let s={};for(let[r]of t)s[r]=i.getAttribute(r);return s}function ls(i,t,e,n,s="add"){n&&(e.uFade=n);let r=new Ve({vertexShader:i,uniforms:e,transparent:!0,depthWrite:!1,depthTest:!1,blending:Ps,fragmentShader:n?t.replace("void main()","void main0()")+`
uniform float uFade;
void main() { main0(); gl_FragColor *= uFade; }`:t});return s==="premult"&&Object.assign(r,{blending:br,blendSrc:Is,blendDst:wr,blendEquation:di}),s==="max"&&Object.assign(r,{blending:br,blendSrc:Is,blendDst:Is,blendEquation:nl}),r}var _i=(i,t,e,n)=>ls(i,t,e,n,"add"),dp=typeof document<"u"&&document.currentScript&&document.currentScript.src||"";function kn(i,t,e){let n=new ze(i,t);return n.frustumCulled=!1,n.renderOrder=e,n}var EM=i=>i<.5?4*i*i*i:1-(-2*i+2)**3/2,CM=i=>Li[en(i)];function RM(i){let t=i>>>0;return()=>(t=Math.imul(t,1664525)+1013904223>>>0,t/4294967296)}var vn=256,cs=140,mc=.5,gc=.5;function PM(i,t){let e=[new Float32Array(vn*vn),new Float32Array(vn*vn),new Float32Array(vn*vn)],n=vn/cs,s=3.3*n,r=Math.ceil(s*3),o=1/(2*s*s);for(let a of i){let l=a.f==="mud"?0:a.f==="oni"?1:a.f==="ustur"?2:-1;if(l<0)continue;let c=(a.x-(mc-cs/2))*n,h=(a.y-(gc-cs/2))*n,f=.6+(a.lvl||0)*.4,u=e[l];for(let d=Math.max(0,Math.floor(h-r));d<=Math.min(vn-1,Math.ceil(h+r));d++){let g=d+.5-h;for(let M=Math.max(0,Math.floor(c-r));M<=Math.min(vn-1,Math.ceil(c+r));M++){let x=M+.5-c;u[d*vn+M]+=f*Math.exp(-(x*x+g*g)*o)}}}for(let a=0;a<vn*vn;a++){for(let l=0;l<3;l++)t[a*4+l]=Math.round(255*(1-Math.exp(-e[l][a]*.9)));t[a*4+3]=255}}var Ui=512,IM=3,LM=1.2,DM=2.5,pp=.5,NM=.7,mp=.9,UM=.09,FM=.25,Mp=1.7,OM=7,hu=null;function BM(i,t){if(hu)return hu;let e=(l,c,h)=>{let f=Math.sin(l*127.1+c*311.7+h*74.7)*43758.5453;return f-Math.floor(f)},n=(l,c,h)=>{let f=Math.floor(l),u=Math.floor(c),d=l-f,g=c-u,M=d*d*(3-2*d),x=g*g*(3-2*g);return(e(f,u,h)*(1-M)+e(f+1,u,h)*M)*(1-x)+(e(f,u+1,h)*(1-M)+e(f+1,u+1,h)*M)*x},s=new Float32Array(i*i),r=new Float32Array(i*i),o=1/(OM*t),a=Mp*t;for(let l=0;l<i;l++)for(let c=0;c<i;c++){let h=c*o,f=l*o;s[l*i+c]=a*(2*(.65*n(h,f,1)+.35*n(h*2.1,f*2.1,3))-1),r[l*i+c]=a*(2*(.65*n(h,f,2)+.35*n(h*2.1,f*2.1,4))-1)}return hu=[s,r]}function kM(i,t,e,n){let s=Ui,r=s*s,o=s/cs,[a,l]=BM(s,o),c=[...new Set(i.filter(A=>A.winner).map(A=>A.winner))],h=new Map(c.map((A,L)=>[A,L])),f=c.length+1,u=c.length,d=Array.from({length:f},()=>new Float32Array(r)),g=new Float32Array(r),M=new Float32Array(r),x=c.map(A=>t(A)).concat(zo).map(A=>[1,3,5].map(L=>parseInt(A.slice(L,L+2),16))),p=IM*o,I=LM*o,U=Math.ceil(p*3+Mp*o),E=1/(2*p*p),b=1/(2*I*I);for(let A of i){let L=A.winner?Math.min(1,Math.max(0,A.strength||0)):0,v=A.winner?pp+(1-pp)*L:NM,P=d[A.winner?h.get(A.winner):u],N=(A.x-(mc-cs/2))*o,F=(A.y-(gc-cs/2))*o;for(let O=Math.max(0,Math.floor(F-U));O<=Math.min(s-1,Math.ceil(F+U));O++)for(let Y=Math.max(0,Math.floor(N-U));Y<=Math.min(s-1,Math.ceil(N+U));Y++){let z=O*s+Y,j=Y+.5-N,ht=O+.5-F,ct=j+a[z],gt=ht+l[z],ot=ct*ct+gt*gt,dt=Math.exp(-ot*E);P[z]+=v*(dt+DM*Math.exp(-(j*j+ht*ht)*b)),A.winner&&(g[z]+=dt,M[z]+=dt*(.3+.7*L))}}for(let A=0;A<r;A++){let L=-1,v=0,P=0;for(let O=0;O<f;O++){let Y=d[O][A];Y>v?(P=v,v=Y,L=O):Y>P&&(P=Y)}let N=A*4;if(L<0||v<1e-4){e[N]=e[N+1]=e[N+2]=e[N+3]=0,n[N]=n[N+1]=n[N+2]=0,n[N+3]=255;continue}let F=x[L];e[N]=F[0],e[N+1]=F[1],e[N+2]=F[2],e[N+3]=Math.round(255*(1-Math.exp(-v*mp))),n[N]=L===u?255:0,n[N+1]=Math.round(255*(1-Math.exp(-P*mp))),n[N+2]=Math.round(255*(g[A]>1e-6?M[A]/g[A]:0)),n[N+3]=255}}function zM(i,t){let e=document.createElement("div");e.textContent="Galaxy map unavailable: "+t,e.style.cssText="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#7fa;font:13px system-ui;opacity:.7",i.appendChild(e);let n=()=>{};return{ok:!1,reason:t,setData:()=>!1,setFilter:n,focusOwner:()=>0,focusPoint:n,pulseEvent:n,focusSystem:()=>!1,bodyScreen:()=>null,setStatLayer:()=>!1,setStatResource:()=>!1,setInsets:()=>({left:0,right:0,top:0,bottom:0}),fleetScreen:()=>null,fleetPixelSize:()=>null,fleetCell:()=>null,on:()=>n,setLayer:()=>!1,screenOf:()=>null,getStats:()=>({ok:!1,reason:t}),dispose:()=>e.remove()}}function VM(i,t={}){if(!i||!i.appendChild)throw new TypeError("C4Scene.mount needs a container element");let e=t.reducedMotion!=null?!!t.reducedMotion:!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches),n=typeof t.clock=="function"?t.clock:()=>Date.now()/1e3;getComputedStyle(i).position==="static"&&(i.style.position="relative");let s;try{s=new $l({antialias:!1,powerPreference:"high-performance",alpha:!1})}catch(_){return zM(i,"WebGL is not available ("+(_&&_.message?_.message:_)+")")}let r=Math.min(window.devicePixelRatio||1,1.5);s.setPixelRatio(r),s.toneMapping=Ls,s.toneMappingExposure=1.1,s.setClearColor(0,1),s.info.autoReset=!1;let o=s.domElement;o.style.cssText="position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;outline:none",i.appendChild(o);let a=document.createElement("div");a.style.cssText="position:absolute;inset:0;overflow:hidden;pointer-events:none;contain:strict",i.appendChild(a);let l=document.createElement("div");l.className="c4-stat-layer",l.style.cssText="position:absolute;inset:0;overflow:hidden;pointer-events:none;contain:strict;display:none",i.appendChild(l);let c=new to,h=new un(kr,1,.5,My),f=new tc(h,o);f.enableDamping=!0,f.dampingFactor=.08,f.screenSpacePanning=!1,f.minDistance=.03,f.maxDistance=240,f.maxPolarAngle=1.15,f.zoomSpeed=1.2,f.autoRotateSpeed=.12,f.zoomToCursor=!1;let u={uNow:{value:0},uAnim:{value:0},uTime:{value:0},uZoom:{value:1},uSysZoom:{value:1},uDim:{value:1},uReduced:{value:e?1:0},uPR:{value:r},uGal:{value:1},uGlyphK:{value:1},uSil:{value:1},uViewH:{value:1},uHasAtlas:{value:0},uAtlas:{value:null},uCols:{value:8},uRows:{value:8}},d=new ze(new Ci(1600,1600).rotateX(-Math.PI/2),new Ve({vertexShader:MM,fragmentShader:SM,uniforms:{uAnim:u.uAnim},depthWrite:!1,depthTest:!1}));d.position.y=-70,d.renderOrder=-10,d.frustumCulled=!1,c.add(d);let g=new gn;{let _=RM(7),C=4200,w=new Float32Array(C*3),S=new Float32Array(C),q=new Float32Array(C*3),nt=new Float32Array(C);for(let it=0;it<C;it++){let st=40+_()*460,ut=_()*Math.PI*2;w[it*3]=Math.cos(ut)*st,w[it*3+2]=Math.sin(ut)*st,w[it*3+1]=-12-_()*50,S[it]=.6+_()**3*2.4;let $=_(),mt=.35+_()*.65;q[it*3]=mt*($<.2?1:.75+$*.2),q[it*3+1]=mt*.88,q[it*3+2]=mt*($>.7?1:.85),nt[it]=_()}g.setAttribute("position",new rn(w,3)),g.setAttribute("aSize",new rn(S,1)),g.setAttribute("aCol",new rn(q,3)),g.setAttribute("aSeed",new rn(nt,1))}let M=new ro(g,_i(TM,AM,{uAnim:u.uAnim,uPR:u.uPR}));M.renderOrder=-9,M.frustumCulled=!1,c.add(M);let x=new Uint8Array(vn*vn*4),p=new Ki(x,vn,vn,xn);p.magFilter=qe,p.minFilter=qe,p.needsUpdate=!0;let I={uTex:{value:p},uTerr:{value:1},uTerrStat:{value:1},uTerrLens:{value:1},uTerrDim:{value:.88},uTerrFill:{value:.034},uAnim:u.uAnim,uFaW:{value:new G(1,1,1)},uFa0:{value:new G},uFa1:{value:new G},uFa2:{value:new G}},U=(_,C=!1)=>{let w=S=>C?Bs(zo).map(q=>q*.5):Li[S];I.uFa0.value.set(...w("mud").map(S=>S*(C?1:_[0]))),I.uFa1.value.set(...w("oni").map(S=>S*(C?1:_[1]))),I.uFa2.value.set(...w("ustur").map(S=>S*(C?1:_[2])))},E=Ad.slice();U(E);let b=new ze(new Ci(cs,cs).rotateX(-Math.PI/2),Object.assign(ls(up,yM,I,null,"add"),{blending:br,blendSrc:Is,blendDst:wr,blendEquation:di}));b.position.set(mc,0,-gc),b.renderOrder=0,b.frustumCulled=!1,c.add(b),e&&(I.uAnim={value:0});let A=new Uint8Array(Ui*Ui*4),L=new Uint8Array(Ui*Ui*4),v=new Ki(A,Ui,Ui,xn),P=new Ki(L,Ui,Ui,xn);for(let _ of[v,P])_.magFilter=qe,_.minFilter=qe,_.needsUpdate=!0;let N=new ze(b.geometry,ls(up,dM,{uConq:{value:v},uConqX:{value:P},uConqFill:{value:UM},uConqDim:{value:FM}},null,"premult"));N.position.set(mc,.01,-gc),N.renderOrder=.5,N.frustumCulled=!1,N.visible=!1,c.add(N);let F=Di(),O=Di(),Y=Di(),z=Di(),j=[["iA",4],["iT",2],["iC",3],["iM",4],["iX",2],["iO",4]],ht={uNow:u.uNow,uAnim:u.uAnim,uZoom:u.uZoom,uBeamGain:{value:2.6},uSil:u.uSil,uHasAtlas:u.uHasAtlas,uAtlas:u.uAtlas,uCols:u.uCols,uRows:u.uRows,uShipBase:{value:ou.galaxy},uViewH:u.uViewH,uDots:{value:1}},ct=kn(F,_i(Uy,Fy,ht,null),2),gt=kn(Y,_i(pM,mM,{uZoom:u.uZoom,uAnim:u.uAnim},u.uGal),2),ot=kn(F,_i(Dy,Ny,ht,null),3),dt={value:1},xt={value:2.5},Zt=kn(O,ls(ky,zy,{uSysZoom:u.uSysZoom,uGlyphK:u.uGlyphK,uViewH:u.uViewH,uAnim:u.uAnim,uDim:u.uDim,uSysCover:xt,uResDim:dt},null,"premult"),4),Xt=kn(F,_i(Oy,By,ht,null),4.8),Ee=kn(F,ls(Cy,Ly,ht,null,"premult"),5),pe=kn(F,ls(Py,Iy,ht,null,"premult"),4.6),Me=kn(z,_i(gM,xM,{uTime:u.uTime,uReduced:u.uReduced},u.uGal),6),W=Di(),et=kn(W,_i(_M,vM,{uTime:u.uTime,uZoom:u.uZoom,uReduced:u.uReduced},u.uGal),6),St=Di(),vt={uAnim:u.uAnim,uStatH:{value:1},uStatW:{value:1},uGrow:{value:1},uMinH:{value:0}},yt=kn(St,_i(qy,Yy,vt,u.uGal),7),Ft=kn(St,_i($y,Zy,{uStatW:vt.uStatW,uGrow:vt.uGrow,uViewH:u.uViewH},u.uGal),7);yt.visible=Ft.visible=!1;let Ne=Di(),ee=kn(Ne,ls(nM,iM,{uGrow:vt.uGrow,uViewH:u.uViewH,uZoom:u.uZoom,uCol:{value:new G(...Bs(jh))}},u.uGal,"max"),4.2);ee.visible=!1,c.add(ee);let ve=Di(),ye={uHaloK:{value:1}},re=kn(ve,_i(uM,fM,ye,u.uGal),1);re.visible=!1,c.add(re),c.add(ct,gt,ot,Zt,Xt,pe,Ee,Me,et,Ft,yt);let jt=Ni(W,[["iE",4],["iC",3],["iC2",3],["iS",2]],fc);for(let _=0;_<fc;_++)jt.iS.array[_*2]=-1e9;let Ue=0,Ce=Ni(z,[["iS",4],["iC",3],["iK",1]],uc);Ce.iS.array.fill(-1e9);for(let _=0;_<uc;_++)Ce.iS.array[_*4+3]=-1e9;let we=0,Ie={systems:[Zt],fleets:[Ee,pe,ot],mining:[],routes:[ct],combat:[]},R=Object.fromEntries(uu.map(_=>[_,!0])),Pt=()=>{Xt.visible=R.fleets&&R.mining},zt=t.assetBase||new URL("../Images/planets/",dp||location.href).href,T=ap({scene:c,camera:h,U:u,quadGeometry:Di,instanceAttrs:Ni,shaderMat:ls,assetBase:zt}),m={addr:null,framed:null,frameD:0,frac:0},H={nearK:lp,domIn:Ay,domOut:Ey,dcOut:1.25},X=new Ye(1,1,{type:Je,samples:4}),tt=new ic(s,X);tt.addPass(new sc(c,h));let ft=new Nr(new qt(1,1),.4,.2,.85);tt.addPass(ft),tt.addPass(new rc);let D=null,k={name:null,cols:[],callouts:[],dirty:!1,vmax:0,growAt:0,res:null},at=()=>{gt.visible=R.combat&&k.name==="combat"};at();let Q={dacs:[],example:!1,focus:null,halos:[],mark:null,markBox:null,lens:{on:!1,metrics:[],scope:null},conq:null,lensKey:""},Ut=Bs(zo),wt=_=>Q.lens.on?Ut:CM(_),Et=_=>Q.lens.on?zo:Oo[en(_)],Yt=_=>Math.max(_.h*vt.uStatH.value,vt.uMinH.value)*vt.uGrow.value,Qt=_=>Bt/(2*Math.tan(kr*Math.PI/360)*Math.max(.001,_)),Mt={left:0,right:0,top:0,bottom:0},V={left:0,right:0,top:0,bottom:0},At=!1,lt={faction:null,states:null,owner:null},bt={pick:new Set,hover:new Set,systemView:new Set},Ct=[],pt=null,Kt=t.shipAtlasBase||new URL("../Images/ships/silhouettes/",dp||location.href).href;fetch(Kt+"atlas.json").then(_=>_.ok?_.json():Promise.reject(new Error("HTTP "+_.status))).then(_=>{let C=(window.devicePixelRatio||1)>1.25&&_.image2x?_.image2x:_.image;new ho().load(Kt+C,w=>{if(ea){w.dispose();return}w.colorSpace=cn,w.anisotropy=4,pt=_,u.uAtlas.value=w,u.uHasAtlas.value=1,u.uCols.value=_.cols||8,u.uRows.value=_.rows||8,D&&Ht()},void 0,()=>console.warn("C4Scene: ship atlas image failed to load; keeping the glyphs"))}).catch(_=>console.warn("C4Scene: ship atlas unavailable; keeping the glyphs",_&&_.message));let Ot=(_,C)=>{for(let w of bt[_])try{w(C)}catch(S){console.error("C4Scene "+_+" handler",S)}},$t=1,Bt=1,me={left:0,top:0},$e=performance.now(),hs=new Map,Se={on:!1,t:0,dur:1,fx:0,fz:0,tx:0,tz:0,fr:1,tr:1,fp:0,tp:0,th:0},Cn=new ui,ne=new G,an=[0,0],Tn=new Float32Array(16),Fi=[];function Xn(){let _=i.getBoundingClientRect(),C=$t+"x"+Bt;$t=Math.max(1,Math.round(_.width)),Bt=Math.max(1,Math.round(_.height)),s.setSize($t,Bt,!1),tt.setPixelRatio(r),tt.setSize($t,Bt),h.aspect=$t/Bt,u.uViewH.value=Bt,f.minDistance=Os.medium*.5*Bt/Math.tan(kr*Math.PI/360)/yy,us(),me=o.getBoundingClientRect(),Tn[0]=NaN,$t+"x"+Bt!==C&&(hs.clear(),fn())}function us(){Object.assign(Mt,V),Mt.left+Mt.right>$t-40&&(Mt.left=Mt.right=0),Mt.top+Mt.bottom>Bt-40&&(Mt.top=Mt.bottom=0);let _=(Mt.right-Mt.left)/2,C=(Mt.bottom-Mt.top)/2;_||C?h.setViewOffset($t,Bt,_,C,$t,Bt):(h.clearViewOffset(),h.updateProjectionMatrix())}let oi=[],Ho=(_,C)=>oi.some(w=>_>=w.left&&_<=w.right&&C>=w.top&&C<=w.bottom),Oi=(_,C)=>_<Mt.left||_>$t-Mt.right||C<Mt.top||C>Bt-Mt.bottom||Ho(_,C),qs=(_,C,w,S)=>_>=Mt.left+2&&C>=Mt.top+2&&w<=$t-Mt.right-2&&S<=Bt-Mt.bottom-2&&!oi.some(q=>_<q.right&&w>q.left&&C<q.bottom&&S>q.top),fs=new ResizeObserver(Xn);fs.observe(i);function Go(_,C,w,S,q){f.target.set(_,0,-C),Cn.set(w,S,q),h.position.setFromSpherical(Cn).add(f.target),h.lookAt(f.target)}function zn(_,C,w,S,q=1.6){m.framed=null,$e=performance.now(),ne.copy(h.position).sub(f.target),Cn.setFromVector3(ne),Object.assign(Se,{on:!0,t:0,dur:q,fx:f.target.x,fz:f.target.z,tx:_,tz:-C,fr:Cn.radius,tr:Math.min(f.maxDistance,Math.max(f.minDistance,w)),fp:Cn.phi,tp:S,th:Cn.theta}),(e||q<=0)&&(Se.t=Se.dur=1,Wo(0))}function Wo(_){Se.t=Math.min(Se.dur,Se.t+_);let C=EM(Se.t/Se.dur),w=Math.exp(Math.log(Se.fr)+(Math.log(Se.tr)-Math.log(Se.fr))*C),S=Se.tr<Se.fr?1-(1-C)*w/Se.fr:C*w/Se.tr;f.target.set(Se.fx+(Se.tx-Se.fx)*S,0,Se.fz+(Se.tz-Se.fz)*S),Cn.set(w,Se.fp+(Se.tp-Se.fp)*C,Se.th),h.position.setFromSpherical(Cn).add(f.target),h.lookAt(f.target),Se.t>=Se.dur&&(Se.on=!1)}let xc=.9,Ys={x:0,y:0},vi=new G,ds=new G,y=new G,B=new hn(new G(0,1,0),0),J={x:0,y:0,on:!1},Z=new Rs,K=new qt,Tt=0,kt=_=>{if(!f.enabled)return;_.preventDefault(),_.stopPropagation();let C=_.deltaY*(_.deltaMode===1?33:_.deltaMode===2?Bt:1);Tt+=Math.log(xc)*(-C/100),Tt=Math.max(-6,Math.min(6,Tt)),Ys.x=_.clientX,Ys.y=_.clientY,_.target===o&&(J.x=_.clientX,J.y=_.clientY,J.on=!0),m.framed=null,Se.on=!1,$e=performance.now(),f._sphericalDelta&&typeof f._sphericalDelta.set=="function"&&f._sphericalDelta.set(0,0,0),f._panOffset&&typeof f._panOffset.set=="function"&&f._panOffset.set(0,0,0),f.autoRotate=!1};i.addEventListener("wheel",kt,{capture:!0,passive:!1});function Rt(_){if(Math.abs(Tt)<1e-4){Tt=0;return}let C=e?Tt:Tt*(1-Math.exp(-_*14)),w=h.position.distanceTo(f.target),S=w*Math.exp(C),q=Math.min(f.maxDistance,Math.max(f.minDistance,S)),nt=q/w;if(Tt=q===S?Tt-C:0,nt===1)return;K.set((Ys.x-me.left)/$t*2-1,-((Ys.y-me.top)/Bt)*2+1),Z.setFromCamera(K,h),(!Z.ray.intersectPlane(B,vi)||vi.distanceTo(h.position)>w*8)&&vi.copy(f.target),h.getWorldDirection(y),ds.copy(h.position).sub(vi).multiplyScalar(nt),h.position.copy(vi).add(ds),y.y<-.001?f.target.copy(h.position).addScaledVector(y,-h.position.y/y.y):(ds.copy(f.target).sub(vi).multiplyScalar(nt),f.target.copy(vi).add(ds)),$e=performance.now()}f.addEventListener("start",()=>{Se.on=!1,$e=performance.now(),m.framed=null}),f.addEventListener("end",()=>{$e=performance.now()}),Go(wn.x,wn.y,e?wn.dist:300,e?wn.polar:.25,e?0:-.6);function Ht(){let _=D.fleets,C=_.length,w=Ni(F,j,C),S=w.iA.array,q=w.iT.array,nt=w.iC.array,it=w.iM.array,st=w.iX.array,ut=w.iO.array;for(let $=0;$<C;$++){let mt=_[$],Dt=D.paths[$],Jt=wt(mt.fa),Vt=D.anchors[$],rt=D.place[$];rt?(S.set(rt.A,$*4),ut.set(rt.O,$*4),q[$*2]=rt.T[0],q[$*2+1]=rt.T[1]):(ut[$*4]=ut[$*4+1]=ut[$*4+2]=ut[$*4+3]=0,Dt.moving&&(D.kinds[$]===3||D.kinds[$]===4)?(S[$*4]=Dt.from[0],S[$*4+1]=Dt.from[1],S[$*4+2]=Dt.to[0],S[$*4+3]=Dt.to[1],q[$*2]=Dt.dep-D.tBase,q[$*2+1]=Dt.arr-D.tBase):(S[$*4]=Vt[0],S[$*4+1]=Vt[1],S[$*4+2]=D.targets[$][0],S[$*4+3]=D.targets[$][1],q[$*2]=0,q[$*2+1]=0)),nt[$*3]=Jt[0],nt[$*3+1]=Jt[1],nt[$*3+2]=Jt[2],it[$*4]=Fd(mt.ships),it[$*4+1]=D.kinds[$],it[$*4+2]=Wt($),it[$*4+3]=D.seeds[$],st[$*2]=lc(pt,mt.flag,mt.flagSize),st[$*2+1]=ks(mt.flagSize)}for(let $ in w)w[$].needsUpdate=!0}let Wt=_=>!R.mining&&D.fleets[_].s.kind==="mining"?0:D.vis[_];function ae(){if(!D)return;let _=F.getAttribute("iM"),C=O.getAttribute("iM"),w=Y.getAttribute("iM");for(let q=0;q<D.fleets.length;q++)D.vis[q]=iu(D.fleets[q],lt),_.array[q*4+2]=Wt(q);_.needsUpdate=!0;for(let q=0;q<D.systems.length;q++)C.array[q*4]=ac(D.systems[q].f,lt.faction)?.22:1;C.needsUpdate=!0;for(let q=0;q<D.hot.length;q++)w.array[q*4+3]=kd(D.hot[q],lt.faction)?1:.15;w.needsUpdate=!0,fe(),(k.name==="owners"||k.name==="combat")&&(k.dirty=!0),u.uDim.value=lt.owner?.4:1,I.uFaW.value.set(...["mud","oni","ustur"].map(q=>ac(q,lt.faction)?.15:1)),Tn[0]=NaN}function fe(){if(!D)return;let _=k.name&&k.colSys,C=O.getAttribute("iM");if(C&&D.systems){for(let w=0;w<D.systems.length;w++)C.array[w*4+2]=_&&_.has(D.systems[w].a)?1:0;C.needsUpdate=!0}}function Gt(){let _=Q.lens.on;if(U(E,_),I.uTerrLens.value=_?0:1,Q.conq=_&&D?Jd(D.latest,D.events,Q.dacs,Q.lens.metrics,Q.lens.scope):null,Q.conq){let C=new Map(Q.dacs.map(w=>[w.tag,w.color]));kM(Q.conq.systems.filter(w=>w.winner||w.contested),w=>C.get(w)||zo,A,L),v.needsUpdate=P.needsUpdate=!0}if(N.visible=!!Q.conq,D){let C=F.getAttribute("iC"),w=O.getAttribute("iC");C&&(D.fleets.forEach((S,q)=>C.array.set(wt(S.fa),q*3)),C.needsUpdate=!0),w&&(D.systems.forEach((S,q)=>w.array.set(wt(S.f),q*3)),w.needsUpdate=!0),pu(),Tn[0]=NaN}k.name==="dacs"&&(k.dirty=!0)}function Te(_,C,w){if(!_||!Array.isArray(_.fleets)||!Array.isArray(_.systems))return console.error("C4Scene.setData: latest.json shape not recognised (need fleets[] and systems[])"),!1;let S=Number.isFinite(_.generatedAt)?_.generatedAt:Math.floor(n()),q=new Map((_.asteroids||[]).map(rt=>[rt.a,rt])),nt=new Map(_.systems.map(rt=>[rt.a,rt])),it=_.fleets.filter(rt=>rt&&rt.s&&Number.isFinite(rt.x)&&Number.isFinite(rt.y)),st=it.length;D={latest:_,events:Array.isArray(C)?C:[],tBase:S,fleets:it,systems:_.systems.filter(rt=>Number.isFinite(rt.x)&&Number.isFinite(rt.y)),asteroids:(_.asteroids||[]).filter(rt=>Number.isFinite(rt.x)&&Number.isFinite(rt.y)),paths:new Array(st),anchors:new Array(st),targets:new Array(st),seeds:new Float32Array(st),kinds:new Float32Array(st),vis:new Float32Array(st),hot:[],index:new Map(it.map((rt,Lt)=>[rt.a,Lt]))};for(let rt=0;rt<st;rt++){let Lt=it[rt],_t=Lt.s,te=En(Lt.a),le=_t.kind;D.paths[rt]=Jh(Lt),D.seeds[rt]=te,D.kinds[rt]=Ed(le);let Fe=[Lt.x,Lt.y],Xe=Fe;if(le==="mining"){let Ke=q.get(_t.asteroid);Ke&&(Fe=[Ke.x,Ke.y]),Xe=Fe}else if(le==="docked"){let Ke=nt.get(_t.system);Ke&&(Fe=[Ke.x,Ke.y]),Xe=Fe}D.anchors[rt]=Fe,D.targets[rt]=Xe,Kh(le)&&!D.paths[rt].moving&&(D.kinds[rt]=0)}let ut=S-120,$=[0,0];for(let rt=0;rt<st;rt++){let Lt=D.paths[rt];Lt.moving&&Lt.arr<=ut&&(D.kinds[rt]=0,D.anchors[rt]=D.targets[rt]=[Lt.to[0],Lt.to[1]])}for(let rt=0;rt<st;rt++)D.vis[rt]=iu(it[rt],lt);Array.isArray(w)&&(Ct=w.filter(rt=>rt&&rt.a&&rt.sys)),D.bodiesBySys=new Map,hs.clear();for(let rt of Ct){let Lt=D.bodiesBySys.get(rt.sys);Lt||D.bodiesBySys.set(rt.sys,Lt=[]),Lt.push(rt)}D.members=au(it,D.systems,Ct,ut),D.sysByAddr=new Map(D.systems.map(rt=>[rt.a,rt])),D.ownerFa=new Map((_.owners||[]).map(rt=>[rt.p,rt.fa])),D.stakes=(_.stakes||[]).filter(rt=>rt&&rt.body),D.place=T.build(D).place;for(let rt of Ud(it,ut).values()){let Lt=rt.filter(_t=>!D.place[_t]);Lt.length<2||Lt.forEach((_t,te)=>{Nd(te,$);let le=D.anchors[_t];D.anchors[_t]=D.targets[_t]=[le[0]+$[0],le[1]+$[1]]})}Ht();let mt=D.systems,Dt=Ni(O,[["iS",4],["iC",3],["iM",4]],mt.length),Jt=T.world.infos;for(let rt=0;rt<mt.length;rt++){let Lt=mt[rt],_t=wt(Lt.f);Dt.iS.array.set([Lt.x,Lt.y,Od(Lt.lvl),Lt.lvl||0],rt*4),Dt.iC.array.set(_t,rt*3),Dt.iM.array.set([1,En(Lt.a),0,Jt[rt].starR],rt*4)}for(let rt in Dt)Dt[rt].needsUpdate=!0;D.hot=Bd(Array.isArray(C)?C:[],S);let Vt=Ni(Y,[["iS",4],["iM",4]],D.hot.length);for(let rt=0;rt<D.hot.length;rt++){let Lt=D.hot[rt],_t=Math.exp(-(S-Lt.last)/7200);Vt.iS.array.set([Lt.x,Lt.y,.8+Math.log2(1+Lt.n)*.5,Math.min(1.6,.35+Lt.heat*.35)],rt*4),Vt.iM.array.set([Lt.destroyed?Math.min(1,Lt.destroyed/Lt.n+.4):0,En(Lt.x+","+Lt.y),_t,1],rt*4)}for(let rt in Vt)Vt[rt].needsUpdate=!0;if(PM(D.systems,x),p.needsUpdate=!0,pu(),ae(),Q.lens.on&&Gt(),k.dirty=!!k.name,m.addr=m.addr&&D.sysByAddr.has(m.addr)?m.addr:(m.addr&&Ot("systemView",null),null),m.framed){let rt=D.sysByAddr.get(m.framed);rt&&!(Math.abs(ge(rt)-m.frameD)<=.01*m.frameD)&&fn()}return Tn[0]=NaN,At||(At=!0,!e&&!Se.on&&zn(wn.x,wn.y,wn.dist,wn.polar,2.6)),!0}let Be=.8,Re=26,he=new un(kr,1,.5,2500),He=new G,Nt=new ui,ln=_=>{let C=T.world,w=C&&C.byAddr.get(_);return w?w.ext:ko(0)*Ii.K};function ge(_){let C=hs.get(_.a);if(C!==void 0)return C;let w=ln(_.a),S=(ne.copy(h.position).sub(f.target),Cn.setFromVector3(ne).theta);he.copy(h),he.near=Math.max(1e-5,f.minDistance*lp),he.updateProjectionMatrix(),He.set(_.x,0,-_.y);let q=Mt.left+Re,nt=$t-Mt.right-Re,it=Mt.top+Re,st=Bt-Mt.bottom-Re,ut=Dt=>{Nt.set(Dt,Be,S),he.position.setFromSpherical(Nt).add(He),he.lookAt(He),he.updateMatrixWorld();for(let Jt=0;Jt<48;Jt++){let Vt=Jt/48*Math.PI*2;ne.set(_.x+Math.cos(Vt)*w,0,-(_.y+Math.sin(Vt)*w)).project(he);let rt=(ne.x+1)/2*$t,Lt=(1-ne.y)/2*Bt;if(ne.z>=1||rt<q||rt>nt||Lt<it||Lt>st)return!1}return!0},$=f.minDistance,mt=f.maxDistance;if(nt-q<40||st-it<40||!ut(mt))C=mt;else if(ut($))C=$;else{for(let Dt=0;Dt<40;Dt++){let Jt=Math.sqrt($*mt);ut(Jt)?mt=Jt:$=Jt}C=mt}return hs.set(_.a,C),C}function fn(){let _=m.framed;if(!_||!D)return;let C=D.sysByAddr.get(_);C&&(zn(C.x,C.y,ge(C),Be,e?0:.6),m.framed=_,m.frameD=ge(C))}function Vn(){let _=T.world;if(!_||!D)return;let C=Mt.left,w=$t-Mt.right,S=Mt.top,q=Bt-Mt.bottom,nt=Math.max(40,Math.min(w-C,q-S)),it=(C+w)/2,st=(S+q)/2,ut=_t=>_t.on?2*_t.extPx/nt:0,$=_t=>Math.hypot(_t.sx-it,_t.sy-st)/Math.max(1e-6,_t.extPx),mt=f.target,Dt=h.position.distanceTo(mt),Jt=Bt/(Math.tan(kr*Math.PI/360)*nt),Vt=(_t,te,le)=>Math.hypot(mt.x-_t.s.x,-mt.z-_t.s.y)<=te*_t.ext&&Dt*le<=_t.ext*Jt,rt=null;if(m.addr){let _t=_.byAddr.get(m.addr);_t&&(_t.on?ut(_t)>=H.domOut&&$(_t)<=H.dcOut:Vt(_t,H.dcOut,H.domOut))&&(rt=_t)}if(!rt){let _t=1/0;for(let te of _.infos)if(te.on){if(ut(te)<H.domIn)continue;let le=$(te);le<=1&&le<_t&&(_t=le,rt=te)}else if(Vt(te,1,H.domIn)){let le=Math.hypot(mt.x-te.s.x,-mt.z-te.s.y)/te.ext;le<_t&&(_t=le,rt=te)}}m.frac=rt?ut(rt):0;let Lt=rt?rt.s.a:null;Lt!==m.addr&&(m.addr=Lt,Ot("systemView",rt?{sys:rt.s.a,name:rt.s.n}:null))}function yi(){Mi&&(Mi="",o.style.cursor="",Ot("hover",null)),T.setHover(null,null)}let Bi=140,be=1,ke="opacity .22s ease-out",Rn=[],Le=(_,C,w,S)=>{for(let q of Rn)if(_<q[2]+be&&w>q[0]-be&&C<q[3]+be&&S>q[1]-be)return!0;return!1};function ai(_,C){if(_.sort((w,S)=>S.prio-w.prio||w.ord-S.ord),Rn.length=0,C)for(let w of C)Rn.push(w);for(let w of _){let S=w.spots.length,q=w.cand,nt=-1,it=!1;for(let st=-1;st<S&&nt<0;st++){let ut=st<0?0:st===0?q:st;if(ut==null||ut<0||ut>=S||st>0&&ut===q||st===0&&ut===0)continue;let $=w.spots[ut][0],mt=w.spots[ut][1],Dt=$+w.w,Jt=mt+w.h;qs($,mt,Dt,Jt)&&(it=!0,Le($,mt,Dt,Jt)||(nt=ut))}w.cand=nt,w.hide=nt>=0?"":it?"collide":"covered",nt>=0&&Rn.push([w.spots[nt][0],w.spots[nt][1],w.spots[nt][0]+w.w,w.spots[nt][1]+w.h])}}function ki(_,C,w,S,q,nt,it,st){let ut=(st.length===4||(st.length=0,st.push([0,0],[0,0],[0,0],[0,0])),st);return ut[0][0]=_+w-nt/2,ut[0][1]=C+S-q-it,ut[1][0]=_+w-nt/2,ut[1][1]=C+q+5,ut[2][0]=_+q+8,ut[2][1]=C-it/2,ut[3][0]=_-q-8-nt,ut[3][1]=C-it/2,st}let Xo=5,Sp=3,fu=110,ps=new Map,qo=0,Yo=0;function du(_,C,w,S,q){let nt=document.createElement("div");return nt.textContent=_,nt.className=C,nt.style.cssText=`position:absolute;left:0;top:0;display:none;white-space:nowrap;font:600 ${w}px/1.2 "Segoe UI",system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:${S};text-shadow:0 0 6px #000,0 0 2px #000;will-change:transform;opacity:0;transition:${ke};${q||""}`,a.appendChild(nt),nt}function pu(){a.textContent="",ps.clear(),qo=0;let _=document.createDocumentFragment();Fi=D.systems.map((C,w)=>{let S=document.createElement("div");S.textContent=C.n||"",S.className="c4-sys-label";let q=Et(C.f);return S.style.cssText='position:absolute;left:0;top:0;display:none;white-space:nowrap;font:600 10px/1 "Segoe UI",system-ui,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:#d8f4ff;text-shadow:0 0 6px '+q+",0 0 2px #000;will-change:transform;border-left:2px solid "+q+";padding-left:4px;opacity:0;transition:"+ke,(C.lvl||0)>=5&&(S.style.fontSize="12px",S.style.color="#ffffff"),_.appendChild(S),{el:S,s:C,si:w,ord:w,shown:!1,vis:!1,w:0,h:0,spots:[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],cand:void 0,hide:""}}),a.appendChild(_),Tn[0]=NaN}function bp(_){let C=T.world,w=C.bodyAt[_],S=C.infos[w.si],q=w.L,nt=q.b.k==="asteroid"?"asteroid":(q.b.sub||"planet").replace("-"," "),it=w.work?w.work.n:0,st=S.stakeN.get(_)||0;return`${q.b.n} - ${nt}${it?" - "+it+" mining":""}${st?" - "+st+" stake"+(st>1?"s":""):""}`}function mu(_,C){let w=ps.get(_);return w||(w=C(),w.key=_,w.spots=[],w.cand=void 0,w.hide="",w.on=!1,w.w=0,w.h=0,w.ord=1e5+ps.size,ps.set(_,w)),w}let gu=0,_c=!1,$o=[],$s=[0,0];function xu(_,C){if(a.style.display=R.labels?"":"none",!R.labels||!D)return;let w=T.world;C&&($o.length=0),Yo++;for(let S of Fi){let q=S.s.lvl||0,nt=w&&w.infos[S.si],it=q>=5?400:q>=2?110:q>=1?58:30,st=R.systems&&_<it&&nt&&nt.ppu>0;if(st){let ut=nt.sx,$=nt.sy;if(st=nt.on&&ut>-.025*$t&&ut<1.025*$t&&$>-.025*Bt&&$<1.025*Bt,st){S.shown||(S.el.style.display="block",S.shown=!0),S.w||(S.w=S.el.offsetWidth,S.h=S.el.offsetHeight);let mt=Math.max(0,nt.starR*nt.ppu*1.1),Dt=S.w,Jt=S.h,Vt=S.spots;Vt[0][0]=ut+9+mt,Vt[0][1]=$-5,Vt[1][0]=ut-9-mt-Dt,Vt[1][1]=$-5,Vt[2][0]=ut+5,Vt[2][1]=$-8-mt-Jt,Vt[3][0]=ut+5,Vt[3][1]=$+6+mt,Vt[4][0]=ut-5-Dt,Vt[4][1]=$-8-mt-Jt,Vt[5][0]=ut-5-Dt,Vt[5][1]=$+6+mt;let rt=ac(S.s.f,lt.faction);S.op=(rt?.25:.88)*Math.min(1,(it-_)/(it*.25)),S.prio=(Mi==="system:"+S.s.a?1e3:0)+(nt.extPx>=fu?400:0)+(rt?0:100)+q*10,C&&$o.push(S)}}!st&&S.shown&&(S.el.style.display="none",S.shown=!1,S.vis=!1,S.cand=void 0,S.el.style.opacity=S.opW="0")}if(qo=0,w)for(let S of w.infos){if(!S.on||S.extPx<24)continue;let q=S.extPx>=fu?200:0;if(R.systems&&S.sbHalf*S.ppu>=Sp){let nt=mu("sb:"+S.s.a,()=>({kind:"sb",si:S.si,el:du(`starbase lvl ${S.s.lvl||0} - ${S.members?S.members.docked.length:0} docked`,"c4-body-label",10,Oo[en(S.s.f)])}));ne.set(S.s.x+S.sb[0],0,-(S.s.y+S.sb[1])).project(h),nt.ax=(ne.x+1)/2*$t,nt.ay=(1-ne.y)/2*Bt,nt.r=S.sbHalf*S.ppu,nt.prio=90+q,nt.seen=Yo}for(let nt=S.b0;nt<S.b0+S.nb;nt++){let it=w.bodyAt[nt],st=it.R*S.ppu;if(st<Xo)continue;let ut=mu("body:"+it.L.b.a,()=>({kind:"body",bi:nt,el:du(bp(nt),"c4-body-label",10,"#cfe8f2")}));T.bodyPos(nt,u.uAnim.value,$s),ne.set($s[0],0,-$s[1]).project(h),!(ne.z>=1)&&(ut.ax=(ne.x+1)/2*$t,ut.ay=(1-ne.y)/2*Bt,ut.r=st,ut.seen=Yo,ut.prio=(it.L.b.k==="asteroid"?30:50)+Math.min(9,Math.round((it.L.size||0)*20))+(S.stakeN.get(nt)?5:0)+q)}}for(let S of ps.values()){if(S.seen!==Yo){S.on&&(S.on=!1,S.el.style.display="none",S.cand=void 0,S.opW="0",S.el.style.opacity="0");continue}S.on||(S.el.style.display="block",S.on=!0),!(!S.w&&(S.w=S.el.offsetWidth,S.h=S.el.offsetHeight,!S.w))&&(ki(S.ax,S.ay,S.kind==="sb"?14:0,S.kind==="sb"?-4:-6,S.r,S.w,S.h,S.spots),qo++,Mi&&S.key===Mi&&(S.prio+=1e3),C&&$o.push(S))}C&&(gu=performance.now(),ai($o));for(let S of Fi){if(!S.shown)continue;S.vis=S.cand!=null&&S.cand>=0;let q=S.spots[S.vis?S.cand:0];S.el.style.transform=`translate(${q[0].toFixed(1)}px,${q[1].toFixed(1)}px)`,S.x0=q[0],S.y0=q[1];let nt=S.vis?S.op.toFixed(2):"0";S.opW!==nt&&(S.el.style.opacity=nt,S.opW=nt),S.prioW!==S.prio&&(S.prioW=S.prio,S.el.dataset.prio=String(S.prio)),S.hideW!==(S.hide||"")&&(S.hideW=S.hide||"",S.el.dataset.hide=S.hideW)}for(let S of ps.values()){if(!S.on||!S.w)continue;let q=S.cand!=null&&S.cand>=0,nt=S.spots[q?S.cand:0];S.el.style.transform=`translate(${nt[0].toFixed(1)}px,${nt[1].toFixed(1)}px)`;let it=q?"1":"0";S.opW!==it&&(S.el.style.opacity=it,S.opW=it),S.prioW!==S.prio&&(S.prioW=S.prio,S.el.dataset.prio=String(S.prio)),S.hideW!==(S.hide||"")&&(S.hideW=S.hide||"",S.el.dataset.hide=S.hideW)}}let wp=[1,.32,.08],_u=6,Tp=_=>_.hex?Bs(_.hex):_.fa==="hot"?wp:Li[en(_.fa)],Ap=_=>_.hex?_.hex:_.fa==="hot"?"#ff7a3c":Oo[en(_.fa)];function vc(_){Q.halos=_;let C=Ni(ve,[["iS",4],["iC",3],["iM",4]],_.length);_.forEach((w,S)=>{C.iS.array.set([w.x,w.y,sM+rM*Math.sqrt(w.wmax?w.w/w.wmax:0),0],S*4),C.iC.array.set(Bs(w.hex),S*3),C.iM.array.set([w.share*(w.dim?oM:1),0,0,0],S*4)});for(let w in C)C[w].needsUpdate=!0;re.visible=_.length>0}function vu(){k.dirty=!1,l.textContent="",k.callouts=[],Q.mark=null,Q.markBox=null,Q.mw=0;let _=k.name,C;if(_==="dacs"&&Q.conq)C=jd(Q.conq,Q.dacs),vc([]);else if(_==="dacs"){let st=D?Kd(D.latest,Q.dacs,Q.focus):{cols:[],halos:[]};C=st.cols,vc(st.halos)}else C=_&&D?Ld(_,D.latest,D.events,{owner:lt.owner,faction:lt.faction,res:k.res,bodies:Ct}):[],(re.visible||Q.halos.length)&&vc([]);k.cols=C,k.vmax=C.reduce((st,ut)=>Math.max(st,ut.v),0);let w=Ni(St,[["iS",4],["iC",3],["iM",4]],C.length);C.forEach((st,ut)=>{let $=Dd(st.v,k.vmax),mt=k.vmax?st.v/k.vmax:0;w.iS.array.set([st.x,st.y,$,.75+.5*Math.sqrt(mt)],ut*4),w.iC.array.set(Tp(st),ut*3),w.iM.array.set([1,En(st.key),mt,st.fa==="hot"?1:0],ut*4),st.h=$});for(let st in w)w[st].needsUpdate=!0;let S=_==="resource",q=C.reduce((st,ut)=>Math.min(st,ut.v),1/0),nt=Ni(Ne,[["iS",4],["iK",1]],S?C.length:0);S&&C.forEach((st,ut)=>{let $=Pd(st.v,q,k.vmax);st.rr=$.r,st.rb=$.b,nt.iS.array.set([st.x,st.y,$.r,$.b],ut*4),nt.iK.array[ut]=Id[st.where]||0}),nt.iS.needsUpdate=nt.iK.needsUpdate=!0,ee.visible=S&&C.length>0,k.rings=ee.visible?C.length:0,dt.value=k.rings?Ky:1,yt.visible=Ft.visible=!S&&C.length>0,I.uTerrStat.value=C.length?_==="dacs"?lM:Wy:1,k.colSys=new Set(C.map(st=>st.sys).filter(Boolean)),fe();let it=document.createDocumentFragment();if(C.filter(st=>st.callout!==!1).slice(0,_u).forEach((st,ut)=>{let $=Ap(st),mt=ut/(_u-1),Dt=ut===0?2:ut<3?1.5:1,Jt=Math.round(4-1.2*mt),Vt=document.createElement("div"),rt=document.createElement("div"),Lt=document.createElement("div");Vt.style.cssText=`position:absolute;left:0;top:${-Dt/2}px;height:${Dt}px;transform-origin:0 50%;background:linear-gradient(90deg,${$},${$}66);box-shadow:0 0 ${Math.round(9-6*mt)}px ${$};opacity:${(1-.3*mt).toFixed(2)};will-change:transform`,rt.style.cssText=`position:absolute;left:${-Jt}px;top:${-Jt}px;width:${Jt*2}px;height:${Jt*2}px;border-radius:50%;background:${$};box-shadow:0 0 ${Math.round(12-6*mt)}px ${$},0 0 2px #fff;will-change:transform`,Lt.className="c4-stat-callout",Lt.dataset.rank=String(ut+1),Lt.style.cssText=`position:absolute;left:0;top:0;white-space:nowrap;padding:${ut===0?"6px 12px 7px 11px":"4px 9px 5px 8px"};border-left:${Math.round(4-2*mt)}px solid ${$};border-radius:0 6px 6px 0;border-top:1px solid ${$}${ut===0?"55":"2a"};border-right:1px solid ${$}${ut===0?"33":"1a"};border-bottom:1px solid rgba(0,0,0,.4);background:linear-gradient(90deg,rgba(6,10,22,${ut===0?".92":".86"}),rgba(6,10,22,.62));backdrop-filter:blur(6px) saturate(140%);-webkit-backdrop-filter:blur(6px) saturate(140%);color:#e8f8ff;text-shadow:0 0 6px #000;box-shadow:0 0 ${Math.round(24-16*mt)}px ${$}${ut===0?"66":ut<3?"40":"24"},0 4px 14px rgba(0,0,0,.45);opacity:${(1-.2*mt).toFixed(2)};will-change:transform;pointer-events:auto;cursor:pointer`;let _t=document.createElement("div");_t.textContent=st.name.toUpperCase(),_t.style.cssText=`font:${ut===0?700:600} ${(12.5-2.5*mt).toFixed(1)}px/1.25 Orbitron,"Segoe UI",system-ui,sans-serif;letter-spacing:.08em;color:#fff`;let te=document.createElement("div");te.textContent=st.line,te.style.cssText=`font:${ut<3?700:600} ${(17-5*mt).toFixed(1)}px/1.2 Rajdhani,"Segoe UI",system-ui,sans-serif;color:${$};letter-spacing:.03em;`+(ut===0?`text-shadow:0 0 10px ${$}88,0 0 4px #000`:""),Lt.append(_t,te),st.sys?(Lt.dataset.sys=st.sys,Lt.addEventListener("pointerdown",le=>le.stopPropagation()),Lt.addEventListener("click",le=>{le.stopPropagation(),Ot("pick",{type:"system",id:st.sys,source:"callout"})})):Number.isFinite(st.x)&&Number.isFinite(st.y)&&(Lt.dataset.point=st.x+","+st.y,Lt.addEventListener("pointerdown",le=>le.stopPropagation()),Lt.addEventListener("click",le=>{le.stopPropagation(),Ot("pick",{type:"point",x:st.x,y:st.y,source:"callout"}),Tc.focusPoint(st.x,st.y,Xy)})),it.append(Vt,rt,Lt),k.callouts.push({c:st,el:Lt,line:Vt,dot:rt,w:0,h:0,rank:ut})}),_==="dacs"&&Q.example&&C.length){let st=document.createElement("div");st.className="c4-dac-example-mark",st.textContent="EXAMPLE",st.style.cssText='position:absolute;left:0;top:0;white-space:nowrap;pointer-events:none;font:700 22px/1 Orbitron,"Segoe UI",system-ui,sans-serif;letter-spacing:.42em;color:rgba(232,248,255,.16);text-shadow:0 0 12px rgba(0,0,0,.6);will-change:transform',it.append(st),Q.mark=st}l.appendChild(it),document.fonts&&document.fonts.status!=="loaded"&&document.fonts.ready.then(()=>{for(let st of k.callouts)st.w=0;Q.mw=0,Tn[0]=NaN}),Tn[0]=NaN}let Ep=()=>Math.min(1.3,Math.max(.6,u.uZoom.value)),yu=_=>{let C=_.rr*Ep()*vt.uGrow.value;ne.set(_.x,0,-_.y).project(h);let w=(ne.x+1)/2*$t,S=(1-ne.y)/2*Bt,q=ne.z,nt=w,it=S,st=0;for(let ut=0;ut<16;ut++){let $=ut*Math.PI/8;ne.set(_.x+C*Math.cos($),0,-(_.y+C*Math.sin($))).project(h);let mt=(ne.x+1)/2*$t,Dt=(1-ne.y)/2*Bt;st=Math.max(st,Math.hypot(mt-w,Dt-S)),Dt<it&&(nt=mt,it=Dt)}return ne.z=q,{cx:w,cy:S,tx:nt,ty:it,rad:st}},Cp=_=>{let C=yu(_);return[C.tx,C.ty]},Zo=[],Rp=[60,90,125,165,210,260,320,390],Ko=120,Pp=[-40,-140,40,140,-90,90,0,180,-65,-115,65,115,-15,-165,15,165].map(_=>_*Math.PI/180);function Ip(_){k.dirty&&vu();let C=Math.min(1.3,Math.max(.3,_/90));vt.uStatH.value=C,vt.uStatW.value=Vy*Math.min(1.6,Math.max(.35,_/100)),ye.uHaloK.value=Math.min(3.2,Math.max(1,_/40)),ne.subVectors(f.target,h.position).normalize(),vt.uMinH.value=Hy/(Qt(_)*Math.max(.2,Math.sqrt(1-ne.y*ne.y)));let w=!!k.callouts.length&&u.uGal.value>.05;if(l.style.display=w?"":"none",!w)return;l.style.opacity=u.uGal.value<.999?u.uGal.value.toFixed(2):"",Zo.length=0;let S=[];if(a.style.display!=="none")for(let it of Fi)!it.vis||it.x0===void 0||(it.w||(it.w=it.el.offsetWidth,it.h=it.el.offsetHeight),it.w&&S.push([it.x0,it.y0,it.x0+it.w,it.y0+it.h,it.w*it.h]));let q=(it,st,ut,$)=>{let mt=0;for(let Dt of S){let Jt=Math.min(ut,Dt[2])-Math.max(it,Dt[0]),Vt=Math.min($,Dt[3])-Math.max(st,Dt[1]);Jt>0&&Vt>0&&(mt=Math.max(mt,Jt*Vt/Dt[4]))}return mt};for(let it of k.callouts){let st,ut;it.c.rr?[st,ut]=Cp(it.c):(ne.set(it.c.x,Xs+Yt(it.c),-it.c.y).project(h),st=(ne.x+1)/2*$t,ut=(1-ne.y)/2*Bt);let $=ne.z<1&&st>=-Ko&&st<=$t+Ko&&ut>=-Ko&&ut<=Bt+Ko;if(it.vis=!1,it.under=!1,!$){it.el.style.display=it.line.style.display=it.dot.style.display="none";continue}let mt=Math.min($t,Math.max(0,st)),Dt=Math.min(Bt,Math.max(0,ut));it.el.style.display="",it.w||(it.w=it.el.offsetWidth,it.h=it.el.offsetHeight);let Jt=it.w,Vt=it.h,rt=mt!==st||Dt!==ut||Oi(mt,Dt),Lt=[[mt+22,Dt-30-Vt],[mt-22-Jt,Dt-30-Vt],[mt+22,Dt+16],[mt-22-Jt,Dt+16],[mt+34,Dt-64-Vt],[mt-34-Jt,Dt-64-Vt],[mt+34,Dt+50],[mt-34-Jt,Dt+50]];for(let Pn of Rp)for(let yn of Pp){let $n=Math.cos(yn),vs=mt+Pn*$n,Bp=Dt+Pn*Math.sin(yn);Lt.push([$n>=0?vs:vs-Jt,Bp-Vt/2])}let _t=null,te=null,le=1/0;for(let[Pn,yn]of Lt){if(!qs(Pn,yn,Pn+Jt,yn+Vt)||Zo.some(vs=>Pn<vs[2]&&Pn+Jt>vs[0]&&yn<vs[3]&&yn+Vt>vs[1]))continue;let $n=q(Pn,yn,Pn+Jt,yn+Vt);if($n<=.03){_t=[Pn,yn];break}$n<le&&(le=$n,te=[Pn,yn])}if(_t=_t||te,!_t){it.el.style.display=it.line.style.display=it.dot.style.display="none";continue}it.line.style.display=it.dot.style.display="",it.vis=!0,it.under=rt;let[Fe,Xe]=_t;Zo.push([Fe-4,Xe-4,Fe+Jt+4,Xe+Vt+4]),it.el.style.transform=`translate(${Fe.toFixed(1)}px,${Xe.toFixed(1)}px)`;let Ke=Fe+Jt/2>=mt?Fe:Fe+Jt,_s=Xe+Vt/2,qn=mt,Yn=Dt;if(rt){let Pn=Math.hypot(Ke-mt,_s-Dt),yn=Math.max(1,Math.ceil(Pn/2));for(let $n=1;$n<=yn&&(qn=mt+(Ke-mt)*$n/yn,Yn=Dt+(_s-Dt)*$n/yn,!!Oi(qn,Yn));$n++);}it.mx=qn,it.my=Yn,it.dot.style.transform=`translate(${qn.toFixed(1)}px,${Yn.toFixed(1)}px)`;let Fp=Math.hypot(Ke-qn,_s-Yn),Op=Math.atan2(_s-Yn,Ke-qn);it.line.style.width=Fp.toFixed(1)+"px",it.line.style.transform=`translate(${qn.toFixed(1)}px,${Yn.toFixed(1)}px) rotate(${Op.toFixed(4)}rad)`}let nt=Q.mark;if(nt){Q.mw||(nt.style.display="",Q.mw=nt.offsetWidth,Q.mh=nt.offsetHeight);let it=Q.mw,st=Q.mh,ut=18,$=Mt.left+ut,mt=$t-Mt.right-ut-it,Dt=Mt.top+ut,Jt=Bt-Mt.bottom-ut-st,Vt=[[$,Jt],[mt,Jt],[$,Dt],[mt,Dt],[($+mt)/2,Jt],[($+mt)/2,Dt]].find(([rt,Lt])=>qs(rt,Lt,rt+it,Lt+st)&&!Zo.some(_t=>rt<_t[2]&&rt+it>_t[0]&&Lt<_t[3]&&Lt+st>_t[1]));Q.markBox=Vt?{left:Vt[0],top:Vt[1],right:Vt[0]+it,bottom:Vt[1]+st}:null,nt.style.display=Vt?"":"none",Vt&&(nt.style.transform=`translate(${Vt[0].toFixed(1)}px,${Vt[1].toFixed(1)}px)`)}}let yc=[0,0,0,0];function zr(_,C){let w=D.place&&D.place[_];if(w)return Hd(w.A,w.O,D.seeds[_],u.uAnim.value,yc),C[0]=w.A[0]+yc[0],C[1]=w.A[1]+yc[1],C;let S=D.paths[_],q=D.kinds[_];if(S.moving&&(q===3||q===4))return Cd(S,n(),C);let nt=D.anchors[_];return C[0]=nt[0],C[1]=nt[1],C}let Mu=new G,Vr=(_,C,w)=>(Mu.set(_,0,-C).applyMatrix4(h.matrixWorldInverse),w*2*h.projectionMatrix.elements[5]*.5*Bt/Math.max(1e-9,-Mu.z));function ms(_,C,w){return ne.set(_,w,-C).project(h),ne.z<1?[(ne.x+1)/2*$t,(1-ne.y)/2*Bt]:null}let Su=(Vs[0]+Vs[1])/2,Lp=(Gs[0]+Gs[1])/2;function Mc(_,C){if(!D)return null;let w=_-me.left,S=C-me.top,q=T.world,nt=u.uAnim.value,it=-1,st=1/0;if(R.fleets)for(let _t=0;_t<D.fleets.length;_t++){if(D.vis[_t]<.5||Wt(_t)<.5)continue;zr(_t,an);let te=Vr(an[0],an[1],ou.galaxy*ks(D.fleets[_t].flagSize)*cc(D.vis[_t]));if(te<nn.collapse)continue;let le=ms(an[0],an[1],0);if(!le)continue;let Fe=Math.hypot(le[0]-w,le[1]-S);Fe<=Math.max(6,te*.6)&&Fe<st&&(st=Fe,it=_t)}let ut=null,$=1/0,mt=null,Dt=1/0;if(q&&R.systems)for(let _t of q.infos){if(!_t.on||_t.ppu<=0)continue;let te=Math.hypot(_t.sx-w,_t.sy-S);if(te>_t.extPx+16&&te>12)continue;for(let Xe=_t.b0;Xe<_t.b0+_t.nb;Xe++){let Ke=q.bodyAt[Xe],_s=Ke.R*_t.ppu;if(_s<Su)continue;T.bodyPos(Xe,nt,$s);let qn=ms($s[0],$s[1],0);if(!qn)continue;let Yn=Math.hypot(qn[0]-w,qn[1]-S);Yn<=Math.max(6,_s*(Ke.kind===1?1.2:1.05))&&Yn<$&&($=Yn,ut={type:"body",bi:Xe})}let le=_t.sbHalf*_t.ppu;if(le>=Lp){let Xe=ms(_t.s.x+_t.sb[0],_t.s.y+_t.sb[1],0),Ke=Xe?Math.hypot(Xe[0]-w,Xe[1]-S):1/0;Ke<=Math.max(8,le*1.1)&&Ke<$&&($=Ke,ut={type:"sb",info:_t})}let Fe=_t.starR*_t.ppu;te<=Math.max(10,Fe*1.1)&&te<Dt&&(Dt=te,mt=_t)}let Jt=()=>{let _t=D.fleets[it],te=pt?Yd(pt,_t.flag,_t.flagSize):"";return{type:"fleet",id:_t.a,ownerProfile:_t.o,label:Qd(_t)+(te?" - "+te:"")}};if(ut){if(it>=0&&st<=4)return Jt();if(ut.type==="body"){let te=q.bodyAt[ut.bi],le=q.infos[te.si];return{type:"body",id:te.L.b.a,sys:te.L.b.sys,j:ut.bi,label:Xd(te.L.b,te.work?te.work.n:0,le.stakeN.get(ut.bi)||0)}}let _t=ut.info.s;return{type:"system",id:_t.a,sb:ut.info.si,label:`${_t.n} starbase - ${en(_t.f)} lvl ${_t.lvl||0} - ${ut.info.members?ut.info.members.docked.length:0} fleets docked`}}let Vt=null,rt=1/0;it>=0&&st-3<rt&&(rt=st-3,Vt="fleet");let Lt=-1;if(R.mining)for(let _t=0;_t<D.asteroids.length;_t++){let te=D.asteroids[_t],le=q?q.bodyIdx.get(te.a):void 0;if(le!=null&&q.bodyAt[le].R*q.infos[q.bodyAt[le].si].ppu>=Su)continue;let Fe=ms(te.x,te.y,0);if(!Fe||mt&&Math.hypot(Fe[0]-mt.sx,Fe[1]-mt.sy)<=Math.max(10,mt.starR*mt.ppu*1.1))continue;let Xe=Math.hypot(Fe[0]-w,Fe[1]-S);Xe<=12&&Xe-1<rt&&(rt=Xe-1,Vt="asteroid",Lt=_t)}if(mt&&Dt<rt&&(rt=Dt,Vt="system"),Vt==="fleet")return Jt();if(Vt==="asteroid"){let _t=D.asteroids[Lt];return{type:"asteroid",id:_t.a,label:ep(_t)}}if(Vt==="system"){let _t=mt.s,te=mt.starR*mt.ppu>=xi[0];return{type:"system",id:_t.a,label:te?`${_t.n} - star - ${mt.nb} bodies (orbit layout stylised: the chain has no in-system positions)`:tp(_t)}}return null}let Hr=null,Mi="",gs=null,Jo=new Map,jo=(_,C)=>{if(_.pointerType==="touch"){if(C){Jo.delete(_.pointerId);return}if(Jo.set(_.pointerId,[_.clientX,_.clientY]),Jo.size>=2){let[w,S]=Jo.values();J.x=(w[0]+S[0])/2,J.y=(w[1]+S[1])/2,J.on=!0}}},bu=_=>{Hr={x:_.clientX,y:_.clientY},J.x=_.clientX,J.y=_.clientY,J.on=!0,$e=performance.now(),jo(_)},wu=_=>jo(_,!0),Tu=()=>{Hr=null,J.on=!1,Mi&&(Mi="",o.style.cursor="",Ot("hover",null))},Au=_=>{gs={x:_.clientX,y:_.clientY,b:_.button},$e=performance.now(),jo(_)},Eu=_=>{if(jo(_,!0),!gs||gs.b!==0||Math.hypot(_.clientX-gs.x,_.clientY-gs.y)>5){gs=null;return}gs=null;let C=Mc(_.clientX,_.clientY);C&&Ot("pick",C.type==="fleet"?{type:C.type,id:C.id,ownerProfile:C.ownerProfile}:C.type==="body"?{type:"body",id:C.id,sys:C.sys}:{type:C.type,id:C.id})};o.addEventListener("pointermove",bu),o.addEventListener("pointerleave",Tu),o.addEventListener("pointerdown",Au),o.addEventListener("pointerup",Eu),o.addEventListener("pointercancel",wu);function Dp(){if(!Hr)return;let{x:_,y:C}=Hr;Hr=null;let w=Mc(_,C),S=w?w.type+":"+w.id:"";o.style.cursor=w?"pointer":"",T.setHover(w&&w.type==="body"?w.j:null,w&&w.sb!=null?w.sb:null),w?Ot("hover",{type:w.type,id:w.id,label:w.label,ownerProfile:w.ownerProfile,sys:w.sys,clientX:_,clientY:C}):Mi&&Ot("hover",null),Mi=S}let Sc=0,Qo=0,ta=!1,ea=!1,Cu=1,De={fps:0,frameMs:0,frames:0,acc:0,n:0,slow:0,cpuAcc:0,cpuMs:0},xs=(_,C,w)=>Np(Math.log2(_),Math.log2(C),Math.log2(Math.max(w,1e-6))),Np=(_,C,w)=>{let S=Math.min(1,Math.max(0,(w-_)/(C-_)));return S*S*(3-2*S)};function Ru(_){Sc=requestAnimationFrame(Ru);let C=performance.now(),w=Qo?Math.min(.1,Math.max(0,(_-Qo)/1e3)):0;Qo=_,u.uTime.value+=w,e||(u.uAnim.value+=w),u.uNow.value=D?n()-D.tBase:0,Se.on?(Wo(w),$e=performance.now()):(Rt(w),f.autoRotate=!e&&h.position.distanceTo(f.target)>wy&&performance.now()-$e>12e3,f.update(w));let S=f.target;(Math.abs(S.x)>70||Math.abs(S.z)>70)&&(S.x=Math.max(-70,Math.min(70,S.x)),S.z=Math.max(-70,Math.min(70,S.z))),h.updateMatrixWorld();let q=h.position.distanceTo(S),nt=Math.max(1e-6,q*H.nearK);Math.abs(h.near-nt)>nt*.02&&(h.near=nt,us()),u.uZoom.value=Math.min(1.5,Math.max(.5,q/110)),u.uSysZoom.value=Math.min(2,Math.max(.6,q/85)),u.uGlyphK.value=Math.min(1,q/Ty),u.uGal.value=xs(Sy,by,q);let it=h.matrixWorld.elements,st=!1;for(let $=0;$<16;$++)Tn[$]!==it[$]&&(st=!0,Tn[$]=it[$]);if(st&&D&&(T.lod($t,Bt),Vn()),T.flushArt(performance.now()),(st||qo)&&D){let $=performance.now()-gu>=Bi;xu(q,$),_c=!$}else _c&&D&&(xu(q,!0),_c=!1);let ut=!1;if(k.growAt){let $=Math.min(1,(performance.now()-k.growAt)/Gy);vt.uGrow.value=1-(1-$)**3,ut=!0,$>=1&&(k.growAt=0)}else vt.uGrow.value=1;k.name&&D&&(st||ut||k.dirty||u.uGal.value!==Cu||l.style.display==="none"&&u.uGal.value>.05)?Ip(q):!k.name&&l.style.display!=="none"&&(l.style.display="none"),Cu=u.uGal.value,Dp(),s.info.reset(),tt.render(w),De.frames++,De.acc+=w,De.n++,De.cpuAcc+=performance.now()-C,De.acc>=1&&(De.fps=De.n/De.acc,De.frameMs=1e3*De.acc/De.n,De.cpuMs=De.cpuAcc/De.n,De.acc=0,De.n=0,De.cpuAcc=0,De.slow=De.fps<45?De.slow+1:0,De.slow>=3&&r>1&&(r=1,s.setPixelRatio(1),u.uPR.value=1,Xn(),De.slow=0))}function bc(){ta||ea||(ta=!0,Qo=0,Sc=requestAnimationFrame(Ru))}function wc(){ta=!1,cancelAnimationFrame(Sc)}let Pu=()=>document.hidden?wc():bc();document.addEventListener("visibilitychange",Pu);let Iu=_=>{_.preventDefault(),wc()},Lu=()=>{document.hidden||bc()};o.addEventListener("webglcontextlost",Iu),o.addEventListener("webglcontextrestored",Lu),Xn(),document.hidden||bc();function Up(_){let C=T.world,w=C&&C.byAddr.get(_);if(!w)return null;let S=w.members||{docked:[],mining:[],cst:[],idle:[]},q=[...S.docked,...S.mining,...S.cst,...S.idle],nt=C.bodyAt.slice(w.b0,w.b0+w.nb),it=w.layout.length?w.layout[w.layout.length-1].r*w.k:0,st=$=>{let mt=ks($)*2*w.ppu;return Math.min(1,Math.max(0,(mt-nn.collapse)/(nn.full-nn.collapse)))},ut=$=>Math.round($*1e3)/1e3;return{sys:_,name:w.s.n,sb:[w.s.x+w.sb[0],w.s.y+w.sb[1]],bodies:w.nb,planets:nt.filter($=>$.kind===0).length,asteroids:nt.filter($=>$.kind===1).length,fleets:q.length,roles:{docked:S.docked.length,mining:S.mining.length,cst:S.cst.length,idle:S.idle.length},stakes:[...w.stakeN.values()].reduce(($,mt)=>$+mt,0),beams:q.filter($=>D.place[$]&&D.place[$].T[1]>.5).length,shipHalfMax:q.reduce(($,mt)=>Math.max($,ks(D.fleets[mt].flagSize)),0),bodyRMin:nt.length?Math.min(...nt.map($=>$.R)):0,worked:nt.filter($=>$.work).map($=>({id:$.L.b.a,name:$.L.b.n,miners:$.work.n,ups:Math.round($.work.ups*10)/10,fa:$.work.fa,fade:ut(st("medium")),ring:R.mining})),scale:w.k,footprint:ut(w.ext),extPx:Math.round(w.extPx),frac:ut(m.frac),fade:ut(it?xs(Hs[0],Hs[1],it*w.ppu):Math.min(1,w.extPx/20)),...T.texStats()}}let Tc={ok:!0,setData:Te,setFilter(_={}){"faction"in _&&(lt.faction=eu.includes(_.faction)?_.faction:null),"states"in _&&(lt.states=Array.isArray(_.states)&&_.states.length?_.states.slice():null),"owner"in _&&(lt.owner=_.owner||null),ae()},focusOwner(_){if(lt.owner=_||null,ae(),!_||!D)return zn(wn.x,wn.y,wn.dist,wn.polar),0;let C=[];for(let S=0;S<D.fleets.length;S++)D.fleets[S].o===_&&C.push(zr(S,[0,0]));let w=su(C);return w&&zn(w.x,w.y,Math.max(16,(w.span*1.35+4)/(2*Math.tan(kr*Math.PI/360))),.62),C.length},focusPoint(_,C,w=3){!Number.isFinite(_)||!Number.isFinite(C)||zn(_,C,wn.dist/Math.max(.5,w||3),.62)},focusSystem(_){if(_==null){let w=m.addr&&D&&D.sysByAddr.get(m.addr);return w?zn(w.x,w.y,42,wn.polar,e?0:1.4):zn(f.target.x,-f.target.z,Math.max(42,h.position.distanceTo(f.target)),wn.polar,e?0:1.4),!0}let C=D&&D.sysByAddr.get(_);return C?(zn(C.x,C.y,ge(C),Be,e?0:1.8),m.framed=_,m.frameD=ge(C),!0):!1},bodyScreen(_){let C=T.world,w=C&&C.bodyIdx.get(_);if(w==null)return null;let S=T.bodyPos(w,u.uAnim.value,[0,0]);if(h.updateMatrixWorld(),ne.set(S[0],0,-S[1]).project(h),ne.z>=1)return null;let q=(ne.x+1)/2*$t,nt=(1-ne.y)/2*Bt;return{x:S[0],y:S[1],clientX:q+me.left,clientY:nt+me.top,visible:q>=0&&q<=$t&&nt>=0&&nt<=Bt}},pulseEvent(_){if(!_||!Number.isFinite(_.x)||!Number.isFinite(_.y))return!1;let C=gy[_.k]??0,w=we;we=(we+1)%uc;let S=_y[C]||wt(_.fa);if(Ce.iS.array.set([_.x,_.y,xy[C],u.uTime.value],w*4),Ce.iC.array.set(S,w*3),Ce.iK.array[w]=C,Ce.iS.needsUpdate=Ce.iC.needsUpdate=Ce.iK.needsUpdate=!0,_.k==="combat"&&Array.isArray(_.vs)){let q=wt(_.fa);for(let nt=0;nt<Math.min(_.vs.length,vy);nt++){let it=_.vs[nt];if(!it)continue;let st=D&&D.index.get(it.f),ut=zd(_,nt,st!=null?zr(st,[0,0]):null);if(!ut)continue;let $=Ue;Ue=(Ue+1)%fc,jt.iE.array.set(ut,$*4),jt.iC.array.set(wt(it.fa),$*3),jt.iC2.array.set(q,$*3),jt.iS.array[$*2]=u.uTime.value,jt.iS.array[$*2+1]=En(String(it.f)),jt.iE.needsUpdate=jt.iC.needsUpdate=jt.iC2.needsUpdate=jt.iS.needsUpdate=!0}}return!0},on(_,C){return!bt[_]||typeof C!="function"?()=>{}:(bt[_].add(C),()=>bt[_].delete(C))},setLayer(_,C){if(!uu.includes(_))return console.warn("C4Scene.setLayer: unknown layer",_),!1;R[_]=!!C;for(let w of Ie[_]||[])w.visible=!!C;return _==="territory"&&(I.uTerr.value=C?1:0),_==="systems"&&T.setVisible(C),_==="combat"&&at(),(_==="fleets"||_==="mining")&&(T.setLayers(R.fleets,R.mining),Pt(),_==="mining"&&D&&ae()),Tn[0]=NaN,!0},screenOf(_,C,w=0){h.updateMatrixWorld();let S=ms(_,C,Number.isFinite(w)?w:0);return S?{clientX:S[0]+me.left,clientY:S[1]+me.top,visible:S[0]>=0&&S[0]<=$t&&S[1]>=0&&S[1]<=Bt,covered:Oi(S[0],S[1])}:null},_starfield(_){return M.visible=!!_,!0},_backdrop(_){return M.visible=d.visible=!!_,!0},_world(_){return T.setVisible(_),!0},bodyPixelSize(_){let C=T.world,w=C&&C.bodyIdx.get(_);if(w==null)return null;h.updateMatrixWorld();let S=T.bodyPos(w,u.uAnim.value,[0,0]);return Vr(S[0],S[1],C.bodyAt[w].R)/2},ppuAt(_,C){return h.updateMatrixWorld(),Vr(_,C,.5)},lodProbe(){let _=T.world;if(!_)return null;let C=(Mt.left+$t-Mt.right)/2,w=(Mt.top+Bt-Mt.bottom)/2,S=null,q=1/0;for(let mt of _.infos){if(!mt.on)continue;let Dt=Math.hypot(mt.sx-C,mt.sy-w);Dt<q&&(q=Dt,S=mt)}if(!S)return null;let nt=S,it=nt.starR*nt.ppu,st=nt.layout.length?nt.layout[nt.layout.length-1].r*nt.k*nt.ppu:0,ut=0;for(let mt=nt.b0;mt<nt.b0+nt.nb;mt++)ut=Math.max(ut,xs(Vs[0],Vs[1],_.bodyAt[mt].R*nt.ppu));let $=mt=>Math.round(mt*1e3)/1e3;return{sys:nt.s.n,starPx:$(it),extPx:$(nt.extPx),glyph:$(1-xs(xi[0],xi[1],it)),star:$(xs(xi[0],xi[1],it)),rings:$(xs(Hs[0],Hs[1],st)),bodies:$(ut),station:$(xs(Gs[0],Gs[1],nt.sbHalf*nt.ppu)),markers:$(u.uGal.value)}},setStatLayer(_){let C=_==null||_===""?null:String(_);return C!==null&&!Rd.includes(C)?(console.warn("C4Scene.setStatLayer: unknown stat layer",_),!1):(C&&C!==k.name&&(k.growAt=e?0:performance.now()),(C!==k.name||C)&&(k.name=C,k.dirty=!0),at(),C||vu(),!0)},setStatResource(_){let C=typeof _=="string"&&_?_.slice(0,80):null;return C===k.res||(k.res=C,k.name==="resource"&&(k.growAt=e?0:performance.now(),k.dirty=!0)),!0},setDacs(_={}){let C=new Set;Q.dacs=(Array.isArray(_&&_.dacs)?_.dacs:[]).filter(q=>q&&typeof q.tag=="string"&&q.tag&&!C.has(q.tag)&&C.add(q.tag)).map(q=>({tag:q.tag.slice(0,24),color:hc(q.color),members:(Array.isArray(q.members)?q.members:[]).filter(nt=>typeof nt=="string"&&nt)})),Q.example=!!(_&&_.example),Q.focus=_&&typeof _.focus=="string"&&Q.dacs.some(q=>q.tag===_.focus)?_.focus:null;let w=_&&_.lens&&typeof _.lens=="object"?_.lens:{},S=Q.lens.on;return Q.lens={on:w.on===!0,metrics:cu.filter(q=>Array.isArray(w.metrics)&&w.metrics.includes(q)),scope:typeof w.scope=="string"&&Q.dacs.some(q=>q.tag===w.scope)?w.scope:null},(Q.lens.on||S)&&Gt(),k.name==="dacs"&&(k.dirty=!0),!0},focusDac(_){if(!D||typeof _!="string")return!1;let C=Q.dacs.find(rt=>rt.tag===_);if(!C)return!1;let w=(lu(D.latest,[C]).byDac[_]||[]).filter(rt=>Number.isFinite(rt.x)&&Number.isFinite(rt.y));if(!w.length)return!1;let S=su(w.map(rt=>[rt.x,rt.y])),q=(ne.copy(h.position).sub(f.target),Cn.setFromVector3(ne).theta);he.copy(h),he.updateProjectionMatrix(),He.set(S.x,0,-S.y);let nt=cM,it=Mt.left+nt,st=$t-Mt.right-nt,ut=Mt.top+nt,$=Bt-Mt.bottom-nt,mt=rt=>{Nt.set(rt,hp,q),he.position.setFromSpherical(Nt).add(He),he.lookAt(He),he.updateMatrixWorld();for(let Lt of w){ne.set(Lt.x,Xs,-Lt.y).project(he);let _t=(ne.x+1)/2*$t,te=(1-ne.y)/2*Bt;if(ne.z>=1||_t<it||_t>st||te<ut||te>$||oi.some(le=>_t>le.left-dc&&_t<le.right+dc&&te>le.top-dc&&te<le.bottom+dc))return!1}return!0},Dt=hM,Jt=f.maxDistance,Vt;if(mt(Dt))Vt=Dt;else if(!mt(Jt))Vt=Jt;else{for(let rt=0;rt<22;rt++){let Lt=(Dt+Jt)/2;mt(Lt)?Jt=Lt:Dt=Lt}Vt=Jt}return zn(S.x,S.y,Vt,hp),!0},setInsets(_={}){let C=S=>Number.isFinite(S)&&S>0?S:0,w=[Mt.left,Mt.right,Mt.top,Mt.bottom].join();if(Object.assign(V,{left:C(_.left),right:C(_.right),top:C(_.top),bottom:C(_.bottom)}),oi.length=0,Array.isArray(_.avoid))for(let S of _.avoid)!S||![S.left,S.top,S.right,S.bottom].every(Number.isFinite)||S.right<=S.left||S.bottom<=S.top||oi.push({left:S.left,top:S.top,right:S.right,bottom:S.bottom});return us(),h.updateMatrixWorld(),Tn[0]=NaN,[Mt.left,Mt.right,Mt.top,Mt.bottom].join()!==w&&(hs.clear(),fn()),{...Mt,avoid:oi.map(S=>({...S}))}},fleetScreen(_){if(!D)return null;let C=D.fleets.findIndex(nt=>nt.a===_);if(C<0)return null;h.updateMatrixWorld(),zr(C,an);let w=D.fleets[C],S=Vr(an[0],an[1],ks(w.flagSize)*cc(D.vis[C])),q=Wt(C)<.001?0:Math.min(1,Math.max(0,(S-nn.collapse)/(nn.full-nn.collapse)));return{x:an[0],y:an[1],inSystem:!!(D.place&&D.place[C]),shown:q,...Tc.screenOf(an[0],an[1])}},statColumnScreen(_){let C=k.cols[_];if(!C)return null;h.updateMatrixWorld();let w=ms(C.x,C.y,Xs),S=ms(C.x,C.y,Xs+Yt(C));return w&&S?{key:C.key,sys:C.sys,x:C.x,y:C.y,base:{clientX:w[0]+me.left,clientY:w[1]+me.top},top:{clientX:S[0]+me.left,clientY:S[1]+me.top},widthWorld:(.75+.5*Math.sqrt(k.vmax?C.v/k.vmax:0))*vt.uStatW.value}:null},statRingScreen(_){let C=k.cols[_];if(!C||!C.rr||!ee.visible)return null;h.updateMatrixWorld();let w=yu(C);return{key:C.key,sys:C.sys,x:C.x,y:C.y,v:C.v,r:C.rr,b:C.rb,centre:{clientX:w.cx+me.left,clientY:w.cy+me.top},top:{clientX:w.tx+me.left,clientY:w.ty+me.top},radiusPx:w.rad}},labelLayout(){let _=(w,S,q)=>[+(w[0]+me.left).toFixed(1),+(w[1]+me.top).toFixed(1),+(w[0]+S+me.left).toFixed(1),+(w[1]+q+me.top).toFixed(1)],C=(w,S,q,nt)=>({n:S,prio:q,vis:nt,hide:w.hide||"",def:_(w.spots[0],w.w,w.h),box:_(w.spots[nt?w.cand:0],w.w,w.h)});return{galaxy:Fi.filter(w=>w.shown&&w.w).map(w=>C(w,w.s.n,w.prio,!!w.vis)),system:[...ps.values()].filter(w=>w.on&&w.w).map(w=>C(w,w.el.textContent,w.prio,w.cand!=null&&w.cand>=0))}},pickAt(_,C){h.updateMatrixWorld();let w=Mc(_,C);return w?{type:w.type,id:w.id,sys:w.sys}:null},tune(_={}){return typeof _.fleetDots=="boolean"&&(ht.uDots.value=_.fleetDots?1:0),Number.isFinite(_.strength)&&(ft.strength=_.strength),Number.isFinite(_.radius)&&(ft.radius=_.radius),Number.isFinite(_.threshold)&&(ft.threshold=_.threshold),Number.isFinite(_.exposure)&&(s.toneMappingExposure=_.exposure),Number.isFinite(_.terrDim)&&(I.uTerrDim.value=_.terrDim),Number.isFinite(_.terrFill)&&(I.uTerrFill.value=_.terrFill),Number.isFinite(_.conqFill)&&(N.material.uniforms.uConqFill.value=_.conqFill),Number.isFinite(_.conqDim)&&(N.material.uniforms.uConqDim.value=_.conqDim),Array.isArray(_.terrGain)&&_.terrGain.length===3&&(E=_.terrGain.slice(),U(E,Q.lens.on)),Number.isFinite(_.sysCover)&&(xt.value=_.sysCover),Number.isFinite(_.nearK)&&_.nearK>0&&(H.nearK=_.nearK,h.near=0),Number.isFinite(_.domIn)&&(H.domIn=_.domIn),Number.isFinite(_.domOut)&&(H.domOut=_.domOut),Number.isFinite(_.dcOut)&&(H.dcOut=_.dcOut),{terrDim:I.uTerrDim.value,strength:ft.strength,radius:ft.radius,threshold:ft.threshold,exposure:s.toneMappingExposure}},fleetPixelSize(_){if(!D)return null;let C=D.fleets.findIndex(q=>q.a===_);if(C<0)return null;let w=D.fleets[C],S=ks(w.flagSize)*cc(D.vis[C]);return h.updateMatrixWorld(),zr(C,an),Vr(an[0],an[1],S)},fleetCell(_){let C=D&&D.fleets.find(w=>w.a===_);return C?lc(pt,C.flag,C.flagSize):null},getStats(){return{ok:!0,fps:Math.round(De.fps*10)/10,frameMs:Math.round(De.frameMs*100)/100,frames:De.frames,pixelRatio:r,drawCalls:s.info.render.calls,fleets:D?D.fleets.length:0,systems:D?D.systems.length:0,hotSpots:D?D.hot.length:0,reducedMotion:e,bodies:Ct.length,systemView:m.addr?Up(m.addr):null,galaxyFade:Math.round(u.uGal.value*1e3)/1e3,camera:(()=>{ne.copy(h.position).sub(f.target);let _=new ui().setFromVector3(ne);return{dist:_.radius,polar:_.phi,azimuth:_.theta,tx:f.target.x,ty:-f.target.z,min:f.minDistance,near:h.near}})(),textures:T.texStats(),ships:{atlas:!!pt,sil:Math.round(u.uSil.value*1e3)/1e3},activeFx:(()=>{let _=u.uTime.value,C=0,w=0;for(let S=0;S<uc;S++){let q=_-Ce.iS.array[S*4+3],nt=Ce.iK.array[S];q>=-.001&&q<=(nt===1?3.2:nt===5?1.8:2.4)&&C++}for(let S=0;S<fc;S++){let q=_-jt.iS.array[S*2];q>=-.001&&q<=1.8&&w++}return{pulses:C,tracers:w}})(),running:ta,layers:{...R},filter:{...lt},flying:Se.on,autoRotating:f.autoRotate,cpuMs:Math.round(De.cpuMs*100)/100,statLayer:{name:k.name,res:k.res,growing:!!k.growAt,columns:yt.visible?k.cols.length:0,rings:k.rings||0,combatRings:{n:Y.instanceCount||0,drawn:gt.visible},callouts:k.callouts.map(_=>({sys:_.c.sys,name:_.c.name,line:_.c.line,v:_.c.v,shown:_.el.style.display!=="none"&&l.style.display!=="none",rank:_.rank+1,under:!!_.under,marker:_.vis?[+(_.mx+me.left).toFixed(1),+(_.my+me.top).toFixed(1)]:null}))},dacs:{n:Q.dacs.length,example:Q.example,focus:Q.focus,halos:Q.halos.length,drawn:re.visible,lens:{...Q.lens,metrics:Q.lens.metrics.slice(),drawn:N.visible,byDac:Q.conq?{...Q.conq.byDac}:{},contested:Q.conq?Q.conq.contested:0,systems:Q.conq?Q.conq.systems.map(_=>({a:_.a,winner:_.winner,contested:_.contested,strength:_.strength})):[]},cols:k.name==="dacs"?k.cols.map(_=>({sys:_.sys,tag:_.tag,hex:_.hex,v:_.v})):[],mark:Q.mark&&Q.markBox&&Q.mark.style.display!=="none"&&l.style.display!=="none"?{left:Q.markBox.left+me.left,top:Q.markBox.top+me.top,right:Q.markBox.right+me.left,bottom:Q.markBox.bottom+me.top}:null},insets:{...Mt,avoid:oi.map(_=>({..._}))}}},dispose(){ea||(ea=!0,wc(),fs.disconnect(),document.removeEventListener("visibilitychange",Pu),i.removeEventListener("wheel",kt,{capture:!0}),o.removeEventListener("pointermove",bu),o.removeEventListener("pointerleave",Tu),o.removeEventListener("pointerdown",Au),o.removeEventListener("pointerup",Eu),o.removeEventListener("pointercancel",wu),o.removeEventListener("webglcontextlost",Iu),o.removeEventListener("webglcontextrestored",Lu),f.dispose(),T.dispose(),c.traverse(_=>{_.geometry&&_.geometry.dispose(),_.material&&_.material.dispose()}),p.dispose(),tt.dispose(),X.dispose(),s.dispose(),o.remove(),a.remove(),l.remove(),bt.pick.clear(),bt.hover.clear(),D=null)}};return Tc}window.C4Scene={mount:VM,version:"1.0.0",layers:uu.slice()};})();
