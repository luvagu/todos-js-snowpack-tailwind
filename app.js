function U0(){throw new Error("setTimeout has not been defined")}function _0(){throw new Error("clearTimeout has not been defined")}var U=U0,_=_0,G;typeof window!="undefined"?G=window:typeof self!="undefined"?G=self:G={};typeof G.setTimeout=="function"&&(U=setTimeout);typeof G.clearTimeout=="function"&&(_=clearTimeout);function O0(a){if(U===setTimeout)return setTimeout(a,0);if((U===U0||!U)&&setTimeout)return U=setTimeout,setTimeout(a,0);try{return U(a,0)}catch(d){try{return U.call(null,a,0)}catch(o){return U.call(this,a,0)}}}function ce(a){if(_===clearTimeout)return clearTimeout(a);if((_===_0||!_)&&clearTimeout)return _=clearTimeout,clearTimeout(a);try{return _(a)}catch(d){try{return _.call(null,a)}catch(o){return _.call(this,a)}}}var C=[],X=!1,$,e0=-1;function de(){!X||!$||(X=!1,$.length?C=$.concat(C):e0=-1,C.length&&S0())}function S0(){if(!X){var a=O0(de);X=!0;for(var d=C.length;d;){for($=C,C=[];++e0<d;)$&&$[e0].run();e0=-1,d=C.length}$=null,X=!1,ce(a)}}function oe(a){var d=new Array(arguments.length-1);if(arguments.length>1)for(var o=1;o<arguments.length;o++)d[o-1]=arguments[o];C.push(new $0(a,d)),C.length===1&&!X&&O0(S0)}function $0(a,d){this.fun=a,this.array=d}$0.prototype.run=function(){this.fun.apply(null,this.array)};var re="browser",ie="browser",se=!0,be=[],le="",ue={},me={},ge={};function B(){}var he=B,pe=B,ve=B,ye=B,we=B,Te=B,Ee=B;function Le(a){throw new Error("process.binding is not supported")}function Ie(){return"/"}function ke(a){throw new Error("process.chdir is not supported")}function Fe(){return 0}var Y=G.performance||{},Ne=Y.now||Y.mozNow||Y.msNow||Y.oNow||Y.webkitNow||function(){return new Date().getTime()};function De(a){var d=Ne.call(Y)*.001,o=Math.floor(d),l=Math.floor(d%1*1e9);return a&&(o=o-a[0],l=l-a[1],l<0&&(o--,l+=1e9)),[o,l]}var Ce=new Date;function Ae(){var a=new Date,d=a-Ce;return d/1e3}var t0={nextTick:oe,title:re,browser:se,env:{NODE_ENV:"production"},argv:be,version:le,versions:ue,on:he,addListener:pe,once:ve,off:ye,removeListener:we,removeAllListeners:Te,emit:Ee,binding:Le,cwd:Ie,chdir:ke,umask:Fe,hrtime:De,platform:ie,release:me,config:ge,uptime:Ae},Ue=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{};function _e(a,d,o){return o={path:d,exports:{},require:function(l,s){return B0(l,s==null?o.path:s)}},a(o,o.exports),o.exports}function B0(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}var Oe={},Se=_e(function(a){(function(d,o){typeof B0=="function"&&!0&&a&&a.exports?a.exports=o():(d.dcodeIO=d.dcodeIO||{}).bcrypt=o()})(Ue,function(){var d={},o=null;function l(f){if(a&&a.exports)try{return Oe.randomBytes(f)}catch(x){}try{var n;return(self.crypto||self.msCrypto).getRandomValues(n=new Uint32Array(f)),Array.prototype.slice.call(n)}catch(x){}if(!o)throw Error("Neither WebCryptoAPI nor a crypto module is available. Use bcrypt.setRandomFallback to set an alternative");return o(f)}var s=!1;try{l(1),s=!0}catch(f){}o=null,d.setRandomFallback=function(f){o=f},d.genSaltSync=function(f,n){if(f=f||o0,typeof f!="number")throw Error("Illegal arguments: "+typeof f+", "+typeof n);f<4?f=4:f>31&&(f=31);var x=[];return x.push("$2a$"),f<10&&x.push("0"),x.push(f.toString()),x.push("$"),x.push(S(l(Z),Z)),x.join("")},d.genSalt=function(f,n,x){if(typeof n=="function"&&(x=n,n=void 0),typeof f=="function"&&(x=f,f=void 0),typeof f=="undefined")f=o0;else if(typeof f!="number")throw Error("illegal arguments: "+typeof f);function t(e){h(function(){try{e(null,d.genSaltSync(f))}catch(c){e(c)}})}if(x){if(typeof x!="function")throw Error("Illegal callback: "+typeof x);t(x)}else return new Promise(function(e,c){t(function(r,u){if(r){c(r);return}e(u)})})},d.hashSync=function(f,n){if(typeof n=="undefined"&&(n=o0),typeof n=="number"&&(n=d.genSaltSync(n)),typeof f!="string"||typeof n!="string")throw Error("Illegal arguments: "+typeof f+", "+typeof n);return r0(f,n)},d.hash=function(f,n,x,t){function e(c){typeof f=="string"&&typeof n=="number"?d.genSalt(n,function(r,u){r0(f,u,c,t)}):typeof f=="string"&&typeof n=="string"?r0(f,n,c,t):h(c.bind(this,Error("Illegal arguments: "+typeof f+", "+typeof n)))}if(x){if(typeof x!="function")throw Error("Illegal callback: "+typeof x);e(x)}else return new Promise(function(c,r){e(function(u,i){if(u){r(u);return}c(i)})})};function p(f,n){for(var x=0,t=0,e=0,c=f.length;e<c;++e)f.charCodeAt(e)===n.charCodeAt(e)?++x:++t;return x<0?!1:t===0}d.compareSync=function(f,n){if(typeof f!="string"||typeof n!="string")throw Error("Illegal arguments: "+typeof f+", "+typeof n);return n.length!==60?!1:p(d.hashSync(f,n.substr(0,n.length-31)),n)},d.compare=function(f,n,x,t){function e(c){if(typeof f!="string"||typeof n!="string"){h(c.bind(this,Error("Illegal arguments: "+typeof f+", "+typeof n)));return}if(n.length!==60){h(c.bind(this,null,!1));return}d.hash(f,n.substr(0,29),function(r,u){r?c(r):c(null,p(u,n))},t)}if(x){if(typeof x!="function")throw Error("Illegal callback: "+typeof x);e(x)}else return new Promise(function(c,r){e(function(u,i){if(u){r(u);return}c(i)})})},d.getRounds=function(f){if(typeof f!="string")throw Error("Illegal arguments: "+typeof f);return parseInt(f.split("$")[2],10)},d.getSalt=function(f){if(typeof f!="string")throw Error("Illegal arguments: "+typeof f);if(f.length!==60)throw Error("Illegal hash length: "+f.length+" != 60");return f.substring(0,29)};var h=typeof t0!="undefined"&&t0&&typeof t0.nextTick=="function"?typeof setImmediate=="function"?setImmediate:t0.nextTick:setTimeout;function L(f){var n=[],x=0;return ae.encodeUTF16toUTF8(function(){return x>=f.length?null:f.charCodeAt(x++)},function(t){n.push(t)}),n}var T="./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""),F=[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,54,55,56,57,58,59,60,61,62,63,-1,-1,-1,-1,-1,-1,-1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,-1,-1,-1,-1,-1,-1,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,-1,-1,-1,-1,-1],A=String.fromCharCode;function S(f,n){var x=0,t=[],e,c;if(n<=0||n>f.length)throw Error("Illegal len: "+n);for(;x<n;){if(e=f[x++]&255,t.push(T[e>>2&63]),e=(e&3)<<4,x>=n){t.push(T[e&63]);break}if(c=f[x++]&255,e|=c>>4&15,t.push(T[e&63]),e=(c&15)<<2,x>=n){t.push(T[e&63]);break}c=f[x++]&255,e|=c>>6&3,t.push(T[e&63]),t.push(T[c&63])}return t.join("")}function k0(f,n){var x=0,t=f.length,e=0,c=[],r,u,i,m,g,v;if(n<=0)throw Error("Illegal len: "+n);for(;x<t-1&&e<n&&(v=f.charCodeAt(x++),r=v<F.length?F[v]:-1,v=f.charCodeAt(x++),u=v<F.length?F[v]:-1,!(r==-1||u==-1||(g=r<<2>>>0,g|=(u&48)>>4,c.push(A(g)),++e>=n||x>=t)||(v=f.charCodeAt(x++),i=v<F.length?F[v]:-1,i==-1)||(g=(u&15)<<4>>>0,g|=(i&60)>>2,c.push(A(g)),++e>=n||x>=t)));)v=f.charCodeAt(x++),m=v<F.length?F[v]:-1,g=(i&3)<<6>>>0,g|=m,c.push(A(g)),++e;var D=[];for(x=0;x<e;x++)D.push(c[x].charCodeAt(0));return D}var ae=function(){var f={};return f.MAX_CODEPOINT=1114111,f.encodeUTF8=function(n,x){var t=null;for(typeof n=="number"&&(t=n,n=function(){return null});t!==null||(t=n())!==null;)t<128?x(t&127):t<2048?(x(t>>6&31|192),x(t&63|128)):t<65536?(x(t>>12&15|224),x(t>>6&63|128),x(t&63|128)):(x(t>>18&7|240),x(t>>12&63|128),x(t>>6&63|128),x(t&63|128)),t=null},f.decodeUTF8=function(n,x){for(var t,e,c,r,u=function(i){i=i.slice(0,i.indexOf(null));var m=Error(i.toString());throw m.name="TruncatedError",m.bytes=i,m};(t=n())!==null;)if((t&128)==0)x(t);else if((t&224)==192)(e=n())===null&&u([t,e]),x((t&31)<<6|e&63);else if((t&240)==224)((e=n())===null||(c=n())===null)&&u([t,e,c]),x((t&15)<<12|(e&63)<<6|c&63);else if((t&248)==240)((e=n())===null||(c=n())===null||(r=n())===null)&&u([t,e,c,r]),x((t&7)<<18|(e&63)<<12|(c&63)<<6|r&63);else throw RangeError("Illegal starting byte: "+t)},f.UTF16toUTF8=function(n,x){for(var t,e=null;(t=e!==null?e:n())!==null;){if(t>=55296&&t<=57343&&(e=n())!==null&&e>=56320&&e<=57343){x((t-55296)*1024+e-56320+65536),e=null;continue}x(t)}e!==null&&x(e)},f.UTF8toUTF16=function(n,x){var t=null;for(typeof n=="number"&&(t=n,n=function(){return null});t!==null||(t=n())!==null;)t<=65535?x(t):(t-=65536,x((t>>10)+55296),x(t%1024+56320)),t=null},f.encodeUTF16toUTF8=function(n,x){f.UTF16toUTF8(n,function(t){f.encodeUTF8(t,x)})},f.decodeUTF8toUTF16=function(n,x){f.decodeUTF8(n,function(t){f.UTF8toUTF16(t,x)})},f.calculateCodePoint=function(n){return n<128?1:n<2048?2:n<65536?3:4},f.calculateUTF8=function(n){for(var x,t=0;(x=n())!==null;)t+=f.calculateCodePoint(x);return t},f.calculateUTF16asUTF8=function(n){var x=0,t=0;return f.UTF16toUTF8(n,function(e){++x,t+=f.calculateCodePoint(e)}),[x,t]},f}();Date.now=Date.now||function(){return+new Date};var Z=16,o0=10,xe=16,ne=100,F0=[608135816,2242054355,320440878,57701188,2752067618,698298832,137296536,3964562569,1160258022,953160567,3193202383,887688300,3232508343,3380367581,1065670069,3041331479,2450970073,2306472731],N0=[3509652390,2564797868,805139163,3491422135,3101798381,1780907670,3128725573,4046225305,614570311,3012652279,134345442,2240740374,1667834072,1901547113,2757295779,4103290238,227898511,1921955416,1904987480,2182433518,2069144605,3260701109,2620446009,720527379,3318853667,677414384,3393288472,3101374703,2390351024,1614419982,1822297739,2954791486,3608508353,3174124327,2024746970,1432378464,3864339955,2857741204,1464375394,1676153920,1439316330,715854006,3033291828,289532110,2706671279,2087905683,3018724369,1668267050,732546397,1947742710,3462151702,2609353502,2950085171,1814351708,2050118529,680887927,999245976,1800124847,3300911131,1713906067,1641548236,4213287313,1216130144,1575780402,4018429277,3917837745,3693486850,3949271944,596196993,3549867205,258830323,2213823033,772490370,2760122372,1774776394,2652871518,566650946,4142492826,1728879713,2882767088,1783734482,3629395816,2517608232,2874225571,1861159788,326777828,3124490320,2130389656,2716951837,967770486,1724537150,2185432712,2364442137,1164943284,2105845187,998989502,3765401048,2244026483,1075463327,1455516326,1322494562,910128902,469688178,1117454909,936433444,3490320968,3675253459,1240580251,122909385,2157517691,634681816,4142456567,3825094682,3061402683,2540495037,79693498,3249098678,1084186820,1583128258,426386531,1761308591,1047286709,322548459,995290223,1845252383,2603652396,3431023940,2942221577,3202600964,3727903485,1712269319,422464435,3234572375,1170764815,3523960633,3117677531,1434042557,442511882,3600875718,1076654713,1738483198,4213154764,2393238008,3677496056,1014306527,4251020053,793779912,2902807211,842905082,4246964064,1395751752,1040244610,2656851899,3396308128,445077038,3742853595,3577915638,679411651,2892444358,2354009459,1767581616,3150600392,3791627101,3102740896,284835224,4246832056,1258075500,768725851,2589189241,3069724005,3532540348,1274779536,3789419226,2764799539,1660621633,3471099624,4011903706,913787905,3497959166,737222580,2514213453,2928710040,3937242737,1804850592,3499020752,2949064160,2386320175,2390070455,2415321851,4061277028,2290661394,2416832540,1336762016,1754252060,3520065937,3014181293,791618072,3188594551,3933548030,2332172193,3852520463,3043980520,413987798,3465142937,3030929376,4245938359,2093235073,3534596313,375366246,2157278981,2479649556,555357303,3870105701,2008414854,3344188149,4221384143,3956125452,2067696032,3594591187,2921233993,2428461,544322398,577241275,1471733935,610547355,4027169054,1432588573,1507829418,2025931657,3646575487,545086370,48609733,2200306550,1653985193,298326376,1316178497,3007786442,2064951626,458293330,2589141269,3591329599,3164325604,727753846,2179363840,146436021,1461446943,4069977195,705550613,3059967265,3887724982,4281599278,3313849956,1404054877,2845806497,146425753,1854211946,1266315497,3048417604,3681880366,3289982499,290971e4,1235738493,2632868024,2414719590,3970600049,1771706367,1449415276,3266420449,422970021,1963543593,2690192192,3826793022,1062508698,1531092325,1804592342,2583117782,2714934279,4024971509,1294809318,4028980673,1289560198,2221992742,1669523910,35572830,157838143,1052438473,1016535060,1802137761,1753167236,1386275462,3080475397,2857371447,1040679964,2145300060,2390574316,1461121720,2956646967,4031777805,4028374788,33600511,2920084762,1018524850,629373528,3691585981,3515945977,2091462646,2486323059,586499841,988145025,935516892,3367335476,2599673255,2839830854,265290510,3972581182,2759138881,3795373465,1005194799,847297441,406762289,1314163512,1332590856,1866599683,4127851711,750260880,613907577,1450815602,3165620655,3734664991,3650291728,3012275730,3704569646,1427272223,778793252,1343938022,2676280711,2052605720,1946737175,3164576444,3914038668,3967478842,3682934266,1661551462,3294938066,4011595847,840292616,3712170807,616741398,312560963,711312465,1351876610,322626781,1910503582,271666773,2175563734,1594956187,70604529,3617834859,1007753275,1495573769,4069517037,2549218298,2663038764,504708206,2263041392,3941167025,2249088522,1514023603,1998579484,1312622330,694541497,2582060303,2151582166,1382467621,776784248,2618340202,3323268794,2497899128,2784771155,503983604,4076293799,907881277,423175695,432175456,1378068232,4145222326,3954048622,3938656102,3820766613,2793130115,2977904593,26017576,3274890735,3194772133,1700274565,1756076034,4006520079,3677328699,720338349,1533947780,354530856,688349552,3973924725,1637815568,332179504,3949051286,53804574,2852348879,3044236432,1282449977,3583942155,3416972820,4006381244,1617046695,2628476075,3002303598,1686838959,431878346,2686675385,1700445008,1080580658,1009431731,832498133,3223435511,2605976345,2271191193,2516031870,1648197032,4164389018,2548247927,300782431,375919233,238389289,3353747414,2531188641,2019080857,1475708069,455242339,2609103871,448939670,3451063019,1395535956,2413381860,1841049896,1491858159,885456874,4264095073,4001119347,1565136089,3898914787,1108368660,540939232,1173283510,2745871338,3681308437,4207628240,3343053890,4016749493,1699691293,1103962373,3625875870,2256883143,3830138730,1031889488,3479347698,1535977030,4236805024,3251091107,2132092099,1774941330,1199868427,1452454533,157007616,2904115357,342012276,595725824,1480756522,206960106,497939518,591360097,863170706,2375253569,3596610801,1814182875,2094937945,3421402208,1082520231,3463918190,2785509508,435703966,3908032597,1641649973,2842273706,3305899714,1510255612,2148256476,2655287854,3276092548,4258621189,236887753,3681803219,274041037,1734335097,3815195456,3317970021,1899903192,1026095262,4050517792,356393447,2410691914,3873677099,3682840055,3913112168,2491498743,4132185628,2489919796,1091903735,1979897079,3170134830,3567386728,3557303409,857797738,1136121015,1342202287,507115054,2535736646,337727348,3213592640,1301675037,2528481711,1895095763,1721773893,3216771564,62756741,2142006736,835421444,2531993523,1442658625,3659876326,2882144922,676362277,1392781812,170690266,3921047035,1759253602,3611846912,1745797284,664899054,1329594018,3901205900,3045908486,2062866102,2865634940,3543621612,3464012697,1080764994,553557557,3656615353,3996768171,991055499,499776247,1265440854,648242737,3940784050,980351604,3713745714,1749149687,3396870395,4211799374,3640570775,1161844396,3125318951,1431517754,545492359,4268468663,3499529547,1437099964,2702547544,3433638243,2581715763,2787789398,1060185593,1593081372,2418618748,4260947970,69676912,2159744348,86519011,2512459080,3838209314,1220612927,3339683548,133810670,1090789135,1078426020,1569222167,845107691,3583754449,4072456591,1091646820,628848692,1613405280,3757631651,526609435,236106946,48312990,2942717905,3402727701,1797494240,859738849,992217954,4005476642,2243076622,3870952857,3732016268,765654824,3490871365,2511836413,1685915746,3888969200,1414112111,2273134842,3281911079,4080962846,172450625,2569994100,980381355,4109958455,2819808352,2716589560,2568741196,3681446669,3329971472,1835478071,660984891,3704678404,4045999559,3422617507,3040415634,1762651403,1719377915,3470491036,2693910283,3642056355,3138596744,1364962596,2073328063,1983633131,926494387,3423689081,2150032023,4096667949,1749200295,3328846651,309677260,2016342300,1779581495,3079819751,111262694,1274766160,443224088,298511866,1025883608,3806446537,1145181785,168956806,3641502830,3584813610,1689216846,3666258015,3200248200,1692713982,2646376535,4042768518,1618508792,1610833997,3523052358,4130873264,2001055236,3610705100,2202168115,4028541809,2961195399,1006657119,2006996926,3186142756,1430667929,3210227297,1314452623,4074634658,4101304120,2273951170,1399257539,3367210612,3027628629,1190975929,2062231137,2333990788,2221543033,2438960610,1181637006,548689776,2362791313,3372408396,3104550113,3145860560,296247880,1970579870,3078560182,3769228297,1714227617,3291629107,3898220290,166772364,1251581989,493813264,448347421,195405023,2709975567,677966185,3703036547,1463355134,2715995803,1338867538,1343315457,2802222074,2684532164,233230375,2599980071,2000651841,3277868038,1638401717,4028070440,3237316320,6314154,819756386,300326615,590932579,1405279636,3267499572,3150704214,2428286686,3959192993,3461946742,1862657033,1266418056,963775037,2089974820,2263052895,1917689273,448879540,3550394620,3981727096,150775221,3627908307,1303187396,508620638,2975983352,2726630617,1817252668,1876281319,1457606340,908771278,3720792119,3617206836,2455994898,1729034894,1080033504,976866871,3556439503,2881648439,1522871579,1555064734,1336096578,3548522304,2579274686,3574697629,3205460757,3593280638,3338716283,3079412587,564236357,2993598910,1781952180,1464380207,3163844217,3332601554,1699332808,1393555694,1183702653,3581086237,1288719814,691649499,2847557200,2895455976,3193889540,2717570544,1781354906,1676643554,2592534050,3230253752,1126444790,2770207658,2633158820,2210423226,2615765581,2414155088,3127139286,673620729,2805611233,1269405062,4015350505,3341807571,4149409754,1057255273,2012875353,2162469141,2276492801,2601117357,993977747,3918593370,2654263191,753973209,36408145,2530585658,25011837,3520020182,2088578344,530523599,2918365339,1524020338,1518925132,3760827505,3759777254,1202760957,3985898139,3906192525,674977740,4174734889,2031300136,2019492241,3983892565,4153806404,3822280332,352677332,2297720250,60907813,90501309,3286998549,1016092578,2535922412,2839152426,457141659,509813237,4120667899,652014361,1966332200,2975202805,55981186,2327461051,676427537,3255491064,2882294119,3433927263,1307055953,942726286,933058658,2468411793,3933900994,4215176142,1361170020,2001714738,2830558078,3274259782,1222529897,1679025792,2729314320,3714953764,1770335741,151462246,3013232138,1682292957,1483529935,471910574,1539241949,458788160,3436315007,1807016891,3718408830,978976581,1043663428,3165965781,1927990952,4200891579,2372276910,3208408903,3533431907,1412390302,2931980059,4132332400,1947078029,3881505623,4168226417,2941484381,1077988104,1320477388,886195818,18198404,3786409e3,2509781533,112762804,3463356488,1866414978,891333506,18488651,661792760,1628790961,3885187036,3141171499,876946877,2693282273,1372485963,791857591,2686433993,3759982718,3167212022,3472953795,2716379847,445679433,3561995674,3504004811,3574258232,54117162,3331405415,2381918588,3769707343,4154350007,1140177722,4074052095,668550556,3214352940,367459370,261225585,2610173221,4209349473,3468074219,3265815641,314222801,3066103646,3808782860,282218597,3406013506,3773591054,379116347,1285071038,846784868,2669647154,3771962079,3550491691,2305946142,453669953,1268987020,3317592352,3279303384,3744833421,2610507566,3859509063,266596637,3847019092,517658769,3462560207,3443424879,370717030,4247526661,2224018117,4143653529,4112773975,2788324899,2477274417,1456262402,2901442914,1517677493,1846949527,2295493580,3734397586,2176403920,1280348187,1908823572,3871786941,846861322,1172426758,3287448474,3383383037,1655181056,3139813346,901632758,1897031941,2986607138,3066810236,3447102507,1393639104,373351379,950779232,625454576,3124240540,4148612726,2007998917,544563296,2244738638,2330496472,2058025392,1291430526,424198748,50039436,29584100,3605783033,2429876329,2791104160,1057563949,3255363231,3075367218,3463963227,1469046755,985887462],D0=[1332899944,1700884034,1701343084,1684370003,1668446532,1869963892];function K(f,n,x,t){var e,c=f[n],r=f[n+1];return c^=x[0],e=t[c>>>24],e+=t[256|c>>16&255],e^=t[512|c>>8&255],e+=t[768|c&255],r^=e^x[1],e=t[r>>>24],e+=t[256|r>>16&255],e^=t[512|r>>8&255],e+=t[768|r&255],c^=e^x[2],e=t[c>>>24],e+=t[256|c>>16&255],e^=t[512|c>>8&255],e+=t[768|c&255],r^=e^x[3],e=t[r>>>24],e+=t[256|r>>16&255],e^=t[512|r>>8&255],e+=t[768|r&255],c^=e^x[4],e=t[c>>>24],e+=t[256|c>>16&255],e^=t[512|c>>8&255],e+=t[768|c&255],r^=e^x[5],e=t[r>>>24],e+=t[256|r>>16&255],e^=t[512|r>>8&255],e+=t[768|r&255],c^=e^x[6],e=t[c>>>24],e+=t[256|c>>16&255],e^=t[512|c>>8&255],e+=t[768|c&255],r^=e^x[7],e=t[r>>>24],e+=t[256|r>>16&255],e^=t[512|r>>8&255],e+=t[768|r&255],c^=e^x[8],e=t[c>>>24],e+=t[256|c>>16&255],e^=t[512|c>>8&255],e+=t[768|c&255],r^=e^x[9],e=t[r>>>24],e+=t[256|r>>16&255],e^=t[512|r>>8&255],e+=t[768|r&255],c^=e^x[10],e=t[c>>>24],e+=t[256|c>>16&255],e^=t[512|c>>8&255],e+=t[768|c&255],r^=e^x[11],e=t[r>>>24],e+=t[256|r>>16&255],e^=t[512|r>>8&255],e+=t[768|r&255],c^=e^x[12],e=t[c>>>24],e+=t[256|c>>16&255],e^=t[512|c>>8&255],e+=t[768|c&255],r^=e^x[13],e=t[r>>>24],e+=t[256|r>>16&255],e^=t[512|r>>8&255],e+=t[768|r&255],c^=e^x[14],e=t[c>>>24],e+=t[256|c>>16&255],e^=t[512|c>>8&255],e+=t[768|c&255],r^=e^x[15],e=t[r>>>24],e+=t[256|r>>16&255],e^=t[512|r>>8&255],e+=t[768|r&255],c^=e^x[16],f[n]=r^x[xe+1],f[n+1]=c,f}function J(f,n){for(var x=0,t=0;x<4;++x)t=t<<8|f[n]&255,n=(n+1)%f.length;return{key:t,offp:n}}function C0(f,n,x){for(var t=0,e=[0,0],c=n.length,r=x.length,u,i=0;i<c;i++)u=J(f,t),t=u.offp,n[i]=n[i]^u.key;for(i=0;i<c;i+=2)e=K(e,0,n,x),n[i]=e[0],n[i+1]=e[1];for(i=0;i<r;i+=2)e=K(e,0,n,x),x[i]=e[0],x[i+1]=e[1]}function fe(f,n,x,t){for(var e=0,c=[0,0],r=x.length,u=t.length,i,m=0;m<r;m++)i=J(n,e),e=i.offp,x[m]=x[m]^i.key;for(e=0,m=0;m<r;m+=2)i=J(f,e),e=i.offp,c[0]^=i.key,i=J(f,e),e=i.offp,c[1]^=i.key,c=K(c,0,x,t),x[m]=c[0],x[m+1]=c[1];for(m=0;m<u;m+=2)i=J(f,e),e=i.offp,c[0]^=i.key,i=J(f,e),e=i.offp,c[1]^=i.key,c=K(c,0,x,t),t[m]=c[0],t[m+1]=c[1]}function A0(f,n,x,t,e){var c=D0.slice(),r=c.length,u;if(x<4||x>31)if(u=Error("Illegal number of rounds (4-31): "+x),t){h(t.bind(this,u));return}else throw u;if(n.length!==Z)if(u=Error("Illegal salt length: "+n.length+" != "+Z),t){h(t.bind(this,u));return}else throw u;x=1<<x>>>0;var i,m,g=0,v;Int32Array?(i=new Int32Array(F0),m=new Int32Array(N0)):(i=F0.slice(),m=N0.slice()),fe(n,f,i,m);function D(){if(e&&e(g/x),g<x)for(var H=Date.now();g<x&&(g=g+1,C0(f,i,m),C0(n,i,m),!(Date.now()-H>ne)););else{for(g=0;g<64;g++)for(v=0;v<r>>1;v++)K(c,v<<1,i,m);var E=[];for(g=0;g<r;g++)E.push((c[g]>>24&255)>>>0),E.push((c[g]>>16&255)>>>0),E.push((c[g]>>8&255)>>>0),E.push((c[g]&255)>>>0);if(t){t(null,E);return}else return E}t&&h(D)}if(typeof t!="undefined")D();else for(var Q;;)if(typeof(Q=D())!="undefined")return Q||[]}function r0(f,n,x,t){var e;if(typeof f!="string"||typeof n!="string")if(e=Error("Invalid string / salt: Not a string"),x){h(x.bind(this,e));return}else throw e;var c,r;if(n.charAt(0)!=="$"||n.charAt(1)!=="2")if(e=Error("Invalid salt version: "+n.substring(0,2)),x){h(x.bind(this,e));return}else throw e;if(n.charAt(2)==="$")c=String.fromCharCode(0),r=3;else{if(c=n.charAt(2),c!=="a"&&c!=="b"&&c!=="y"||n.charAt(3)!=="$")if(e=Error("Invalid salt revision: "+n.substring(2,4)),x){h(x.bind(this,e));return}else throw e;r=4}if(n.charAt(r+2)>"$")if(e=Error("Missing salt rounds"),x){h(x.bind(this,e));return}else throw e;var u=parseInt(n.substring(r,r+1),10)*10,i=parseInt(n.substring(r+1,r+2),10),m=u+i,g=n.substring(r+3,r+25);f+=c>="a"?"\0":"";var v=L(f),D=k0(g,Z);function Q(H){var E=[];return E.push("$2"),c>="a"&&E.push(c),E.push("$"),m<10&&E.push("0"),E.push(m.toString()),E.push("$"),E.push(S(D,D.length)),E.push(S(H,D0.length*4-1)),E.join("")}if(typeof x=="undefined")return Q(A0(v,D,m));A0(v,D,m,function(H,E){H?x(H,null):x(null,Q(E))},t)}return d.encodeBase64=S,d.decodeBase64=k0,d})}),a0=Se;var I,V="",y={},w=[],k=null,x0="todos.sessionToken",M="todos.user_",n0="todoLists",f0="selectedListId",i0=JSON.parse(localStorage.getItem(x0))||null,b=a=>document.querySelector(a),R=a=>document.querySelectorAll(a),$e=b("#home-link"),Be=R("[data-logged-out]"),Me=R("[data-logged-in]"),q=b("#mobile-menu"),s0=b("#mobile-menu-open"),Re=b("#mobile-menu-close"),c0=b("#sidebar"),M0=b("#sidebar-overlay"),qe=b("#sidebar-open"),je=b("#add-todo-sidebar"),b0=b("#enable-notifications"),ze=b("#dropdown-toggle"),Je=R("[data-signup-button]"),He=R("[data-login-button]"),l0=R("[data-dashboard-button]"),u0=R("[data-account-button]"),Ge=R("[data-logout-button]"),R0=b("#home-component"),q0=b("#signup-component"),j0=b("#login-component"),z0=b("#account-component"),J0=b("#dashboard-component"),H0=b("#signup-form"),G0=b("#login-form"),Xe=b("#account-form"),Ye=b("[data-user-name]"),m0=b("[data-todos]"),Ve=b("[data-new-todo-form]"),g0=b("[data-new-todo-input]"),X0=b("[data-todo-display-tasks]"),N=b("[data-todo-title]"),h0=b("[data-save-list-name]"),Ze=b("[data-todo-count]"),d0=b("[data-tasks]"),Ke=b("[data-new-task-form]"),Y0=b("[data-new-task-input]"),Qe=b("#task-template"),We=b("[data-clear-complete-tasks]"),Pe=b("[data-delete-todo-list]");$e.addEventListener("click",a=>{a.preventDefault(),j(),I?(v0(),W("dashboard")):p0()});Je.forEach(a=>a.addEventListener("click",d=>{d.preventDefault(),j(),et(),q.classList.contains("hidden")||z()}));He.forEach(a=>a.addEventListener("click",d=>{d.preventDefault(),j(),tt(),q.classList.contains("hidden")||z()}));Ge.forEach(a=>a.addEventListener("click",d=>{d.preventDefault(),at(),q.classList.contains("hidden")||z()}));l0.forEach(a=>a.addEventListener("click",d=>{d.preventDefault(),j(),v0(),W("dashboard"),q.classList.contains("hidden")||z()}));u0.forEach(a=>a.addEventListener("click",d=>{d.preventDefault(),b("#account-form > #errMsg").classList.add("hidden"),b("#account-form > #successMsg").classList.add("hidden");let o=JSON.parse(localStorage.getItem(M+I))||null;b("#account-form #email-address-account").value=o.email,b("#account-form #first-name-account").value=o.firstName,b("#account-form #last-name-account").value=o.lastName,j(),xt(),W("account"),q.classList.contains("hidden")||z()}));s0.addEventListener("click",z);Re.addEventListener("click",z);qe.addEventListener("click",P);M0.addEventListener("click",P);je.addEventListener("click",a=>{a.preventDefault(),c0.classList.contains("hidden")&&P(),g0.focus()});b0.addEventListener("click",nt);ze.addEventListener("click",y0);H0.addEventListener("submit",w0);G0.addEventListener("submit",w0);Xe.addEventListener("submit",w0);function z(a){q.classList.toggle("hidden"),q.classList.contains("hidden")?s0.setAttribute("aria-expanded","false"):s0.setAttribute("aria-expanded","true")}function P(a){c0.classList.toggle("hidden"),M0.classList.toggle("hidden")}function y0(a){b("#dropdown-tools").classList.toggle("hidden")}function w0(a){a.preventDefault();let d=a.target.id,o=b(`#${d} > #errMsg`),l=b("#account-form > #successMsg");o.classList.add("hidden"),l.classList.add("hidden");let s={},p=a.target.elements;for(let h=0;h<p.length;h++){let L=p[h];L.type!=="submit"&&(s[L.name]=L.type=="checkbox"?L.checked:L.value.trim())}if(!ft(s,d)){o.classList.remove("hidden"),o.innerText="Missing or invalid field(s) supplied";return}if(I=s.email,d=="signup-form"){if(!ct(I)){o.classList.remove("hidden"),o.innerText="A user with that email address already exists",I=void 0;return}s.password=Z0(s.password),s.todoLists=[],s.selectedListId=null,localStorage.setItem(M+I,JSON.stringify(s)),y=s,w=y[n0],k=y[f0],V=s.firstName;let h={id:Date.now(),user:I};localStorage.setItem(x0,JSON.stringify(h)),T0()}if(d=="login-form"){V0(),V=y.firstName;let h=y.password!==void 0?y.password:"";if(dt(s.password,h)){let L={id:Date.now(),user:I};localStorage.setItem(x0,JSON.stringify(L)),T0()}else{o.classList.remove("hidden"),o.innerText="Incorrect email and/or password",I=void 0;return}}d=="account-form"&&(y.firstName=s.firstName,y.lastName=s.lastName,V=s.firstName,K0(),s.password!==""&&(y.password=Z0(s.password)),localStorage.setItem(M+I,JSON.stringify(y)),l.classList.remove("hidden"),l.innerText="Update successful",b("#account-form #password-account").value=""),H0.reset(),G0.reset(),o.classList.add("hidden")}function V0(){y=localStorage.getItem(M+I)!==null?JSON.parse(localStorage.getItem(M+I)):{},w=y[n0]!==void 0?y[n0]:[],k=y[f0]!==void 0?y[f0]:null}function ft(a,d){return a=typeof a=="object"&&a!==null?a:!1,d=typeof d=="string"&&d.trim().length>0?d.trim():!1,a&&d=="signup-form"?typeof a.firstName=="string"&&a.firstName.length>0&&typeof a.lastName=="string"&&a.lastName.length>0&&typeof a.email=="string"&&E0(a.email)&&typeof a.password=="string"&&a.password.length>=4&&typeof a.tosAgreement=="boolean"&&a.tosAgreement!==!1:a&&d=="login-form"?typeof a.email=="string"&&E0(a.email)&&typeof a.password=="string"&&a.password.length>=4:a&&d=="account-form"?typeof a.firstName=="string"&&a.firstName.length>0&&typeof a.lastName=="string"&&a.lastName.length>0&&typeof a.email=="string"&&E0(a.email)&&typeof a.password=="string"&&(a.password===""||a.password.length>=4):!1}function E0(a){a=typeof a=="string"&&a.length>=6?a:!1;let d=/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,4})(\]?)$/;return a?d.test(a):!1}function ct(a){return localStorage[M+a]==null}function Z0(a){let d=a0.genSaltSync(10);return a0.hashSync(a,d)}function dt(a,d){return a0.compareSync(a,d)}function W(a){l0.forEach(d=>d.classList.remove("bg-indigo-200")),u0.forEach(d=>d.classList.remove("bg-indigo-200")),!(a==null||a==null)&&(a==="dashboard"&&l0.forEach(d=>d.classList.add("bg-indigo-200")),a==="account"&&u0.forEach(d=>d.classList.add("bg-indigo-200")))}function p0(){R0.classList.remove("hidden")}function et(){q0.classList.remove("hidden")}function tt(){j0.classList.remove("hidden")}function xt(){z0.classList.remove("hidden")}function v0(){J0.classList.remove("hidden")}function j(){R0.classList.add("hidden"),q0.classList.add("hidden"),j0.classList.add("hidden"),z0.classList.add("hidden"),J0.classList.add("hidden")}function Q0(){Be.forEach(a=>a.classList.toggle("hidden")),Me.forEach(a=>a.classList.toggle("hidden"))}function K0(){Ye.innerText=`${V.charAt(0).toUpperCase()}'s Todo Lists`}function T0(){Q0(),K0(),j(),v0(),W("dashboard"),L0()}function at(){Q0(),j(),p0(),W(void 0),localStorage.removeItem(x0),y={},w=[],k=null,I=void 0}function ot(){i0!==null&&i0.user!==void 0?(I=i0.user,V0(),V=y.firstName,T0(),L0()):p0()}Ve.addEventListener("submit",a=>{a.preventDefault();let d=g0.value.trim();if(d==null||d===""||w.some(l=>l.name==d))return;let o=rt(d);g0.value=null,w.push(o),k=o.id,O(),c0.classList.contains("hidden")||P()});m0.addEventListener("click",a=>{a.preventDefault(),a.target.tagName.toLowerCase()==="a"&&(k=a.target.dataset.todoId,O(),c0.classList.contains("hidden")||P())});Ke.addEventListener("submit",a=>{a.preventDefault();let d=Y0.value;if(d==null||d==="")return;let o=it(d);Y0.value=null,w.find(s=>s.id===k).tasks.push(o),O()});d0.addEventListener("click",a=>{if(a.target.name==="task-checkbox"){let d=w.find(l=>l.id===k),o=d.tasks.find(l=>l.id===a.target.id);o.completed=a.target.checked,P0(),W0(d)}"toggleAlarmForm"in a.target.dataset&&(a.preventDefault(),b(`[data-form-id-${a.target.dataset.targetformId}]`).classList.toggle("hidden"))});d0.addEventListener("submit",a=>{a.preventDefault();let d=a.target.dataset.taskId,o,l;if(Array.from(a.target.elements).forEach(p=>{p.name==="alarm-date"&&(o=p.value),p.name==="alarm-time"&&(l=p.value)}),!d||!o||!l)return;let s=w.find(({id:p})=>p===k).tasks.find(({id:p})=>p===d);s.alarmDate=o,s.alarmTime=l,s.notified=!1,s.completed=!1,O(),a.target.classList.toggle("hidden")});N.addEventListener("click",a=>{h0.classList.remove("hidden"),N.style.backgroundColor="white",N.style.padding="0 5px"});N.addEventListener("input",a=>{a.preventDefault();let d=N.dataset.todoId,o=N.textContent.replace(`
`,"").trim();o.length>=1&&!w.some(l=>l.name==o)&&st(d,o)});h0.addEventListener("click",a=>{N.style.backgroundColor="transparent",N.style.padding="0",N.blur(),h0.classList.add("hidden"),O()});We.addEventListener("click",a=>{a.preventDefault();let d=w.find(o=>o.id===k);d.tasks=d.tasks.filter(o=>!o.completed),O(),y0()});Pe.addEventListener("click",a=>{a.preventDefault(),w=w.filter(d=>d.id!==k),k=null,O(),y0()});function rt(a){return{id:Date.now().toString(),name:a,tasks:[]}}function it(a){return{id:Date.now().toString(),name:a,completed:!1,alarmDate:"",alarmTime:"",notified:!1}}function L0(){ee(m0),bt();let a=w.find(d=>d.id===k);k==null||w.length<1?(b("[data-todo-display-empty]").classList.remove("hidden"),X0.style.display="none"):(b("[data-todo-display-empty]").classList.add("hidden"),X0.style.display="",N.innerText=a.name!==void 0?a.name:"",N.setAttribute("contenteditable","true"),N.dataset.todoId=a.id,W0(a),ee(d0),lt(a))}function bt(){w.forEach(a=>{let d=`
            <svg class="h-6 w-6 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
            </svg>
            <span class="ml-3 pointer-events-none">${a.name}</span>
        `,o=["flex","items-center","mb-2","p-2","text-base","text-indigo-700","bg-gray-200","rounded"],l=["flex","items-center","mb-2","p-2","text-base","text-gray-600","hover:text-gray-700","hover:bg-gray-200","rounded"],s=document.createElement("a");s.href="#",s.dataset.todoId=a.id,s.innerHTML=d,s.dataset.todoId===k?s.classList.add(...o):s.classList.add(...l),m0.appendChild(s)})}function st(a,d){let o=w.find(l=>l.id==a);o.name=d}function W0(a){let d=a.tasks.filter(l=>!l.completed).length,o=d===1?"task":"tasks";Ze.innerText=`${d} ${o} remaining`}function lt(a){a.tasks.forEach(d=>{let{id:o,name:l,alarmDate:s,alarmTime:p,completed:h,notified:L}=d,T=document.importNode(Qe.content,!0);T.querySelector("form").setAttribute(`data-form-id-${o}`,""),T.querySelector("form").dataset.taskId=o,T.querySelector("input[name=alarm-date]").value=s,T.querySelector("input[name=alarm-time]").value=p,T.querySelector("[data-toggle-alarm-form]").dataset.targetformId=o;let F=T.querySelector("input[name=task-checkbox]");F.id=o,F.checked=h;let A=T.querySelector("label");A.htmlFor=o,A.append(l);let S=T.querySelector("[data-due-text]");S.innerText=!L&&s&&p?`Task due on ${new Date(`${s} ${p}`).toLocaleString()}`:L?"Task overdue, marked as complete!":"",L&&S.classList.add("text-pink-400"),d0.appendChild(T)})}function ee(a){for(;a.firstChild;)a.removeChild(a.firstChild)}function P0(){y[n0]=w,y[f0]=k,localStorage.setItem(M+I,JSON.stringify(y))}function O(){P0(),L0()}function nt(){"Notification"in window?ut()?Notification.requestPermission().then(()=>I0()):Notification.requestPermission(()=>I0()):console.log("This browser does not support notifications.")}function ut(){try{Notification.requestPermission().then()}catch(a){return!1}return!0}function I0(){te()?b0.classList.add("hidden"):b0.classList.remove("hidden")}function te(){return!(Notification.permission==="denied"||Notification.permission==="default")}function mt(){if(w.length){let a=0,d=o=>{let{alarmDate:l,alarmTime:s,name:p,notified:h}=o;if(!h&&l&&s){let L=Date.parse(`${l} ${s}`),T=Date.now(),F="/img/icon-alarm-clock-96.png",A=`Hey ${V}! Your task "${p}" is now overdue and has been marked as completed.`;T>L&&(new Notification("To-Do's JS",{body:A,icon:F}),o.completed=!0,o.notified=!0,a++)}return o};w=w.map(o=>(o.tasks.length&&o.tasks.map(d),o)),a&&O()}}window.onload=()=>{ot(),I0(),setInterval(()=>{te()&&mt()},3e3)};
/**
 * @license bcrypt.js (c) 2013 Daniel Wirtz <dcode@dcode.io>
 * Released under the Apache License, Version 2.0
 * see: https://github.com/dcodeIO/bcrypt.js for details
 */
