(function(a){if(typeof define==="function"&&define.amd){define(["jquery"],a)
}else{a(jQuery)
}}(function(c){c(window).bind("unload.atmosphere",function(){c.atmosphere.unsubscribe()
});
c(window).bind("offline",function(){var d=[].concat(c.atmosphere.requests);
for(var f=0;
f<d.length;
f++){var e=d[f];
e.close();
clearTimeout(e.response.request.id);
if(e.heartbeatTimer){clearTimeout(e.heartbeatTimer)
}}});
c(window).bind("online",function(){if(c.atmosphere.requests.length>0){for(var d=0;
d<c.atmosphere.requests.length;
d++){c.atmosphere.requests[d].execute()
}}});
c(window).keypress(function(d){if(d.keyCode===27){d.preventDefault()
}});
var a=function(e){var d,g=/^(.*?):[ \t]*([^\r\n]*)\r?$/mg,f={};
while(d=g.exec(e)){f[d[1]]=d[2]
}return f
};
c.atmosphere={version:"2.2.4-jquery",uuid:0,requests:[],callbacks:[],onError:function(d){},onClose:function(d){},onOpen:function(d){},onMessage:function(d){},onReconnect:function(e,d){},onMessagePublished:function(d){},onTransportFailure:function(e,d){},onLocalMessage:function(d){},onClientTimeout:function(d){},onFailureToReconnect:function(e,d){},WebsocketApiAdapter:function(e){var d,f;
e.onMessage=function(g){f.onmessage({data:g.responseBody})
};
e.onMessagePublished=function(g){f.onmessage({data:g.responseBody})
};
e.onOpen=function(g){f.onopen(g)
};
f={close:function(){d.close()
},send:function(g){d.push(g)
},onmessage:function(g){},onopen:function(g){},onclose:function(g){},onerror:function(g){}};
d=new $.atmosphere.subscribe(e);
return f
},AtmosphereRequest:function(I){var K={timeout:300000,method:"GET",headers:{},contentType:"",callback:null,url:"",data:"",suspend:true,maxRequest:-1,reconnect:true,maxStreamingLength:10000000,lastIndex:0,logLevel:"info",requestCount:0,fallbackMethod:"GET",fallbackTransport:"streaming",transport:"long-polling",webSocketImpl:null,webSocketBinaryType:null,dispatchUrl:null,webSocketPathDelimiter:"@@",enableXDR:false,rewriteURL:false,attachHeadersAsQueryString:true,executeCallbackBeforeReconnect:false,readyState:0,withCredentials:false,trackMessageLength:false,messageDelimiter:"|",connectTimeout:-1,reconnectInterval:0,dropHeaders:true,uuid:0,shared:false,readResponsesHeaders:false,maxReconnectOnClose:5,enableProtocol:true,pollingInterval:0,heartbeat:{client:null,server:null},ackInterval:0,closeAsync:false,onError:function(ax){},onClose:function(ax){},onOpen:function(ax){},onMessage:function(ax){},onReopen:function(ay,ax){},onReconnect:function(ay,ax){},onMessagePublished:function(ax){},onTransportFailure:function(ay,ax){},onLocalMessage:function(ax){},onFailureToReconnect:function(ay,ax){},onClientTimeout:function(ax){}};
var S={status:200,reasonPhrase:"OK",responseBody:"",messages:[],headers:[],state:"messageReceived",transport:"polling",error:null,request:null,partialMessage:"",errorHandled:false,closedByClientTimeout:false,ffTryingReconnect:false};
var V=null;
var k=null;
var r=null;
var A=null;
var C=null;
var ag=true;
var h=0;
var at=false;
var W=null;
var an;
var m=null;
var F=c.now();
var G;
var aw;
av(I);
function ao(){ag=true;
at=false;
h=0;
V=null;
k=null;
r=null;
A=null
}function w(){ai();
ao()
}function av(ax){w();
K=c.extend(K,ax);
K.mrequest=K.reconnect;
if(!K.reconnect){K.reconnect=true
}}function l(){return K.webSocketImpl!=null||window.WebSocket||window.MozWebSocket
}function O(){return window.EventSource
}function p(){if(K.shared){m=ae(K);
if(m!=null){if(K.logLevel==="debug"){c.atmosphere.debug("Storage service available. All communication will be local")
}if(m.open(K)){return
}}if(K.logLevel==="debug"){c.atmosphere.debug("No Storage service available.")
}m=null
}K.firstMessage=c.atmosphere.uuid==0?true:false;
K.isOpen=false;
K.ctime=c.now();
if(K.uuid===0){K.uuid=c.atmosphere.uuid
}K.closedByClientTimeout=false;
if(K.transport!=="websocket"&&K.transport!=="sse"){o(K)
}else{if(K.transport==="websocket"){if(!l()){M("Websocket is not supported, using request.fallbackTransport ("+K.fallbackTransport+")")
}else{ah(false)
}}else{if(K.transport==="sse"){if(!O()){M("Server Side Events(SSE) is not supported, using request.fallbackTransport ("+K.fallbackTransport+")")
}else{E(false)
}}}}}function ae(aB){var aE,ay,aA,az="atmosphere-"+aB.url,ax={storage:function(){if(!c.atmosphere.supportStorage()){return
}var aH=window.localStorage,aF=function(aI){return c.parseJSON(aH.getItem(az+"-"+aI))
},aG=function(aI,aJ){aH.setItem(az+"-"+aI,c.stringifyJSON(aJ))
};
return{init:function(){aG("children",aF("children").concat([F]));
c(window).on("storage.socket",function(aI){aI=aI.originalEvent;
if(aI.key===az&&aI.newValue){aD(aI.newValue)
}});
return aF("opened")
},signal:function(aI,aJ){aH.setItem(az,c.stringifyJSON({target:"p",type:aI,data:aJ}))
},close:function(){var aI,aJ=aF("children");
c(window).off("storage.socket");
if(aJ){aI=c.inArray(aB.id,aJ);
if(aI>-1){aJ.splice(aI,1);
aG("children",aJ)
}}}}
},windowref:function(){var aF=window.open("",az.replace(/\W/g,""));
if(!aF||aF.closed||!aF.callbacks){return
}return{init:function(){aF.callbacks.push(aD);
aF.children.push(F);
return aF.opened
},signal:function(aG,aH){if(!aF.closed&&aF.fire){aF.fire(c.stringifyJSON({target:"p",type:aG,data:aH}))
}},close:function(){function aG(aJ,aI){var aH=c.inArray(aI,aJ);
if(aH>-1){aJ.splice(aH,1)
}}if(!aA){aG(aF.callbacks,aD);
aG(aF.children,F)
}}}
}};
function aD(aF){var aH=c.parseJSON(aF),aG=aH.data;
if(aH.target==="c"){switch(aH.type){case"open":J("opening","local",K);
break;
case"close":if(!aA){aA=true;
if(aG.reason==="aborted"){ak()
}else{if(aG.heir===F){p()
}else{setTimeout(function(){p()
},100)
}}}break;
case"message":B(aG,"messageReceived",200,aB.transport);
break;
case"localMessage":Z(aG);
break
}}}function aC(){var aF=new RegExp("(?:^|; )("+encodeURIComponent(az)+")=([^;]*)").exec(document.cookie);
if(aF){return c.parseJSON(decodeURIComponent(aF[2]))
}}aE=aC();
if(!aE||c.now()-aE.ts>1000){return
}ay=ax.storage()||ax.windowref();
if(!ay){return
}return{open:function(){var aF;
G=setInterval(function(){var aG=aE;
aE=aC();
if(!aE||aG.ts===aE.ts){aD(c.stringifyJSON({target:"c",type:"close",data:{reason:"error",heir:aG.heir}}))
}},1000);
aF=ay.init();
if(aF){setTimeout(function(){J("opening","local",aB)
},50)
}return aF
},send:function(aF){ay.signal("send",aF)
},localSend:function(aF){ay.signal("localSend",c.stringifyJSON({id:F,event:aF}))
},close:function(){if(!at){clearInterval(G);
ay.signal("close");
ay.close()
}}}
}function aa(){var ay,ax="atmosphere-"+K.url,aC={storage:function(){if(!c.atmosphere.supportStorage()){return
}var aD=window.localStorage;
return{init:function(){c(window).on("storage.socket",function(aE){aE=aE.originalEvent;
if(aE.key===ax&&aE.newValue){az(aE.newValue)
}})
},signal:function(aE,aF){aD.setItem(ax,c.stringifyJSON({target:"c",type:aE,data:aF}))
},get:function(aE){return c.parseJSON(aD.getItem(ax+"-"+aE))
},set:function(aE,aF){aD.setItem(ax+"-"+aE,c.stringifyJSON(aF))
},close:function(){c(window).off("storage.socket");
aD.removeItem(ax);
aD.removeItem(ax+"-opened");
aD.removeItem(ax+"-children")
}}
},windowref:function(){var aD=ax.replace(/\W/g,""),aE=(c('iframe[name="'+aD+'"]')[0]||c('<iframe name="'+aD+'" />').hide().appendTo("body")[0]).contentWindow;
return{init:function(){aE.callbacks=[az];
aE.fire=function(aF){var aG;
for(aG=0;
aG<aE.callbacks.length;
aG++){aE.callbacks[aG](aF)
}}
},signal:function(aF,aG){if(!aE.closed&&aE.fire){aE.fire(c.stringifyJSON({target:"c",type:aF,data:aG}))
}},get:function(aF){return !aE.closed?aE[aF]:null
},set:function(aF,aG){if(!aE.closed){aE[aF]=aG
}},close:function(){}}
}};
function az(aD){var aF=c.parseJSON(aD),aE=aF.data;
if(aF.target==="p"){switch(aF.type){case"send":aj(aE);
break;
case"localSend":Z(aE);
break;
case"close":ak();
break
}}}W=function aB(aD){ay.signal("message",aD)
};
function aA(){document.cookie=aw+"="+encodeURIComponent(c.stringifyJSON({ts:c.now()+1,heir:(ay.get("children")||[])[0]}))+"; path=/"
}ay=aC.storage()||aC.windowref();
ay.init();
if(K.logLevel==="debug"){c.atmosphere.debug("Installed StorageService "+ay)
}ay.set("children",[]);
if(ay.get("opened")!=null&&!ay.get("opened")){ay.set("opened",false)
}aw=encodeURIComponent(ax);
aA();
G=setInterval(aA,1000);
an=ay
}function J(az,aC,ay){if(K.shared&&aC!=="local"){aa()
}if(an!=null){an.set("opened",true)
}ay.close=function(){ak()
};
if(h>0&&az==="re-connecting"){ay.isReopen=true;
ab(S)
}else{if(S.error==null){S.request=ay;
var aA=S.state;
S.state=az;
var ax=S.transport;
S.transport=aC;
var aB=S.responseBody;
y();
S.responseBody=aB;
S.state=aA;
S.transport=ax
}}}function v(az){az.transport="jsonp";
var ay=K;
if((az!=null)&&(typeof(az)!=="undefined")){ay=az
}var ax=ay.url;
if(ay.dispatchUrl!=null){ax+=ay.dispatchUrl
}var aA=ay.data;
if(ay.attachHeadersAsQueryString){ax=T(ay);
if(aA!==""){ax+="&X-Atmosphere-Post-Body="+encodeURIComponent(aA)
}aA=""
}C=c.ajax({url:ax,type:ay.method,dataType:"jsonp",error:function(aB,aD,aC){S.error=true;
if(ay.openId){clearTimeout(ay.openId)
}if(ay.heartbeatTimer){clearTimeout(ay.heartbeatTimer)
}if(ay.reconnect&&h++<ay.maxReconnectOnClose){J("re-connecting",ay.transport,ay);
N(C,ay,ay.reconnectInterval);
ay.openId=setTimeout(function(){al(ay)
},ay.reconnectInterval+1000)
}else{ac(aB.status,aC)
}},jsonp:"jsonpTransport",success:function(aC){if(ay.reconnect){if(ay.maxRequest===-1||ay.requestCount++<ay.maxRequest){ad(C,ay);
if(!ay.executeCallbackBeforeReconnect){N(C,ay,ay.pollingInterval)
}var aE=aC.message;
if(aE!=null&&typeof aE!=="string"){try{aE=c.stringifyJSON(aE)
}catch(aD){}}var aB=t(aE,ay,S);
if(!aB){B(S.responseBody,"messageReceived",200,ay.transport)
}if(ay.executeCallbackBeforeReconnect){N(C,ay,ay.pollingInterval)
}}else{c.atmosphere.log(K.logLevel,["JSONP reconnect maximum try reached "+K.requestCount]);
ac(0,"maxRequest reached")
}}},data:ay.data,beforeSend:function(aB){d(aB,ay,false)
}})
}function X(aA){var ay=K;
if((aA!=null)&&(typeof(aA)!=="undefined")){ay=aA
}var ax=ay.url;
if(ay.dispatchUrl!=null){ax+=ay.dispatchUrl
}var aB=ay.data;
if(ay.attachHeadersAsQueryString){ax=T(ay);
if(aB!==""){ax+="&X-Atmosphere-Post-Body="+encodeURIComponent(aB)
}aB=""
}var az=typeof(ay.async)!=="undefined"?ay.async:true;
C=c.ajax({url:ax,type:ay.method,error:function(aC,aE,aD){S.error=true;
if(aC.status<300){N(C,ay)
}else{ac(aC.status,aD)
}},success:function(aE,aF,aD){if(ay.reconnect){if(ay.maxRequest===-1||ay.requestCount++<ay.maxRequest){if(!ay.executeCallbackBeforeReconnect){N(C,ay,ay.pollingInterval)
}var aC=t(aE,ay,S);
if(!aC){B(S.responseBody,"messageReceived",200,ay.transport)
}if(ay.executeCallbackBeforeReconnect){N(C,ay,ay.pollingInterval)
}}else{c.atmosphere.log(K.logLevel,["AJAX reconnect maximum try reached "+K.requestCount]);
ac(0,"maxRequest reached")
}}},beforeSend:function(aC){d(aC,ay,false)
},crossDomain:ay.enableXDR,async:az})
}function f(ax){if(K.webSocketImpl!=null){return K.webSocketImpl
}else{if(window.WebSocket){return new WebSocket(ax)
}else{return new MozWebSocket(ax)
}}}function g(){var ax=T(K);
return decodeURI(c('<a href="'+ax+'"/>')[0].href.replace(/^http/,"ws"))
}function au(){var ax=T(K);
return ax
}function E(ay){S.transport="sse";
var ax=au(K.url);
if(K.logLevel==="debug"){c.atmosphere.debug("Invoking executeSSE");
c.atmosphere.debug("Using URL: "+ax)
}if(ay&&!K.reconnect){if(k!=null){ai()
}return
}try{k=new EventSource(ax,{withCredentials:K.withCredentials})
}catch(az){ac(0,az);
M("SSE failed. Downgrading to fallback transport and resending");
return
}if(K.connectTimeout>0){K.id=setTimeout(function(){if(!ay){ai()
}},K.connectTimeout)
}k.onopen=function(aA){u(K);
if(K.logLevel==="debug"){c.atmosphere.debug("SSE successfully opened")
}if(!K.enableProtocol){if(!ay){J("opening","sse",K)
}else{J("re-opening","sse",K)
}}else{if(K.isReopen){K.isReopen=false;
J("re-opening",K.transport,K)
}}ay=true;
if(K.method==="POST"){S.state="messageReceived";
k.send(K.data)
}};
k.onmessage=function(aB){u(K);
if(!K.enableXDR&&aB.origin!==window.location.protocol+"//"+window.location.host){c.atmosphere.log(K.logLevel,["Origin was not "+window.location.protocol+"//"+window.location.host]);
return
}S.state="messageReceived";
S.status=200;
aB=aB.data;
var aA=t(aB,K,S);
if(!aA){y();
S.responseBody="";
S.messages=[]
}};
k.onerror=function(aA){clearTimeout(K.id);
if(K.heartbeatTimer){clearTimeout(K.heartbeatTimer)
}if(S.closedByClientTimeout){return
}af(ay);
ai();
if(at){c.atmosphere.log(K.logLevel,["SSE closed normally"])
}else{if(!ay){M("SSE failed. Downgrading to fallback transport and resending")
}else{if(K.reconnect&&(S.transport==="sse")){if(h++<K.maxReconnectOnClose){J("re-connecting",K.transport,K);
if(K.reconnectInterval>0){K.reconnectId=setTimeout(function(){E(true)
},K.reconnectInterval)
}else{E(true)
}S.responseBody="";
S.messages=[]
}else{c.atmosphere.log(K.logLevel,["SSE reconnect maximum try reached "+h]);
ac(0,"maxReconnectOnClose reached")
}}}}}
}function ah(ay){S.transport="websocket";
var ax=g(K.url);
if(K.logLevel==="debug"){c.atmosphere.debug("Invoking executeWebSocket");
c.atmosphere.debug("Using URL: "+ax)
}if(ay&&!K.reconnect){if(V!=null){ai()
}return
}V=f(ax);
if(K.webSocketBinaryType!=null){V.binaryType=K.webSocketBinaryType
}if(K.connectTimeout>0){K.id=setTimeout(function(){if(!ay){var aB={code:1002,reason:"",wasClean:false};
V.onclose(aB);
try{ai()
}catch(aC){}return
}},K.connectTimeout)
}V.onopen=function(aC){u(K);
if(K.logLevel==="debug"){c.atmosphere.debug("Websocket successfully opened")
}var aB=ay;
if(V!=null){V.canSendMessage=true
}if(!K.enableProtocol){ay=true;
if(aB){J("re-opening","websocket",K)
}else{J("opening","websocket",K)
}}if(V!=null){if(K.method==="POST"){S.state="messageReceived";
V.send(K.data)
}}};
V.onmessage=function(aD){u(K);
if(K.enableProtocol){ay=true
}S.state="messageReceived";
S.status=200;
aD=aD.data;
var aB=typeof(aD)==="string";
if(aB){var aC=t(aD,K,S);
if(!aC){y();
S.responseBody="";
S.messages=[]
}}else{aD=q(K,aD);
if(aD===""){return
}S.responseBody=aD;
y();
S.responseBody=null
}};
V.onerror=function(aB){clearTimeout(K.id);
if(K.heartbeatTimer){clearTimeout(K.heartbeatTimer)
}};
V.onclose=function(aB){if(S.state==="closed"){return
}clearTimeout(K.id);
var aC=aB.reason;
if(aC===""){switch(aB.code){case 1000:aC="Normal closure; the connection successfully completed whatever purpose for which it was created.";
break;
case 1001:aC="The endpoint is going away, either because of a server failure or because the browser is navigating away from the page that opened the connection.";
break;
case 1002:aC="The endpoint is terminating the connection due to a protocol error.";
break;
case 1003:aC="The connection is being terminated because the endpoint received data of a type it cannot accept (for example, a text-only endpoint received binary data).";
break;
case 1004:aC="The endpoint is terminating the connection because a data frame was received that is too large.";
break;
case 1005:aC="Unknown: no status code was provided even though one was expected.";
break;
case 1006:aC="Connection was closed abnormally (that is, with no close frame being sent).";
break
}}if(K.logLevel==="warn"){c.atmosphere.warn("Websocket closed, reason: "+aC);
c.atmosphere.warn("Websocket closed, wasClean: "+aB.wasClean)
}if(S.closedByClientTimeout){return
}af(ay);
S.state="closed";
if(at){c.atmosphere.log(K.logLevel,["Websocket closed normally"])
}else{if(!ay){M("Websocket failed. Downgrading to Comet and resending")
}else{if(K.reconnect&&S.transport==="websocket"&&aB.code!==1001){ai();
if(h++<K.maxReconnectOnClose){J("re-connecting",K.transport,K);
if(K.reconnectInterval>0){K.reconnectId=setTimeout(function(){S.responseBody="";
S.messages=[];
ah(true)
},K.reconnectInterval)
}else{S.responseBody="";
S.messages=[];
ah(true)
}}else{c.atmosphere.log(K.logLevel,["Websocket reconnect maximum try reached "+K.requestCount]);
if(K.logLevel==="warn"){c.atmosphere.warn("Websocket error, reason: "+aB.reason)
}ac(0,"maxReconnectOnClose reached")
}}}}};
var az=navigator.userAgent.toLowerCase();
var aA=az.indexOf("android")>-1;
if(aA&&V.url===undefined){V.onclose({reason:"Android 4.1 does not support websockets.",wasClean:false})
}}function q(ay,aF){var aE=aF;
if(ay.transport==="polling"){return aE
}if(c.trim(aF).length!==0&&ay.enableProtocol&&ay.firstMessage){var aD=ay.trackMessageLength?1:0;
var az=aF.split(ay.messageDelimiter);
if(az.length<=aD+1){return aE
}ay.firstMessage=false;
ay.uuid=c.trim(az[aD]);
if(az.length<=aD+2){c.atmosphere.log("error",["Protocol data not sent by the server. If you enable protocol on client side, be sure to install JavascriptProtocol interceptor on server side.Also note that atmosphere-runtime 2.2+ should be used."])
}var ax=parseInt(c.trim(az[aD+1]),10);
var aC=az[aD+2];
if(!isNaN(ax)&&ax>0){var aA=function(){aj(aC);
ay.heartbeatTimer=setTimeout(aA,ax)
};
ay.heartbeatTimer=setTimeout(aA,ax)
}b=false;
if(ay.transport!=="long-polling"){al(ay)
}c.atmosphere.uuid=ay.uuid;
aE="";
aD=ay.trackMessageLength?4:3;
if(az.length>aD+1){for(var aB=aD;
aB<az.length;
aB++){aE+=az[aB];
if(aB+1!==az.length){aE+=ay.messageDelimiter
}}}if(ay.ackInterval!==0){setTimeout(function(){aj("...ACK...")
},ay.ackInterval)
}}else{if(ay.enableProtocol&&ay.firstMessage&&c.browser.msie&&+c.browser.version.split(".")[0]<10){c.atmosphere.log(K.logLevel,["Receiving unexpected data from IE"])
}else{al(ay)
}}return aE
}function u(ax){clearTimeout(ax.id);
if(ax.timeout>0&&ax.transport!=="polling"){ax.id=setTimeout(function(){n(ax);
z();
ai()
},ax.timeout)
}}function n(ax){S.closedByClientTimeout=true;
S.state="closedByClient";
S.responseBody="";
S.status=408;
S.messages=[];
y()
}function ac(ax,ay){ai();
clearTimeout(K.id);
S.state="error";
S.reasonPhrase=ay;
S.responseBody="";
S.status=ax;
S.messages=[];
y()
}function t(aB,aA,ax){aB=q(aA,aB);
if(aB.length===0){return true
}ax.responseBody=aB;
if(aA.trackMessageLength){aB=ax.partialMessage+aB;
var az=[];
var ay=aB.indexOf(aA.messageDelimiter);
while(ay!==-1){var aD=aB.substring(0,ay);
var aC=parseInt(aD,10);
if(isNaN(aC)){throw'message length "'+aD+'" is not a number'
}ay+=aA.messageDelimiter.length;
if(ay+aC>aB.length){ay=-1
}else{az.push(aB.substring(ay,ay+aC));
aB=aB.substring(ay+aC,aB.length);
ay=aB.indexOf(aA.messageDelimiter)
}}ax.partialMessage=aB;
if(az.length!==0){ax.responseBody=az.join(aA.messageDelimiter);
ax.messages=az;
return false
}else{ax.responseBody="";
ax.messages=[];
return true
}}else{ax.responseBody=aB
}return false
}function M(ax){c.atmosphere.log(K.logLevel,[ax]);
if(typeof(K.onTransportFailure)!=="undefined"){K.onTransportFailure(ax,K)
}else{if(typeof(c.atmosphere.onTransportFailure)!=="undefined"){c.atmosphere.onTransportFailure(ax,K)
}}K.transport=K.fallbackTransport;
var ay=K.connectTimeout===-1?0:K.connectTimeout;
if(K.reconnect&&K.transport!=="none"||K.transport==null){K.method=K.fallbackMethod;
S.transport=K.fallbackTransport;
K.fallbackTransport="none";
if(ay>0){K.reconnectId=setTimeout(function(){p()
},ay)
}else{p()
}}else{ac(500,"Unable to reconnect with fallback transport")
}}function T(az,ax){var ay=K;
if((az!=null)&&(typeof(az)!=="undefined")){ay=az
}if(ax==null){ax=ay.url
}if(!ay.attachHeadersAsQueryString){return ax
}if(ax.indexOf("X-Atmosphere-Framework")!==-1){return ax
}ax+=(ax.indexOf("?")!==-1)?"&":"?";
ax+="X-Atmosphere-tracking-id="+ay.uuid;
ax+="&X-Atmosphere-Framework="+c.atmosphere.version;
ax+="&X-Atmosphere-Transport="+ay.transport;
if(ay.trackMessageLength){ax+="&X-Atmosphere-TrackMessageSize=true"
}if(ay.heartbeat!==null&&ay.heartbeat.server!==null){ax+="&X-Heartbeat-Server="+ay.heartbeat.server
}if(ay.contentType!==""){ax+="&Content-Type="+(ay.transport==="websocket"?ay.contentType:encodeURIComponent(ay.contentType))
}if(ay.enableProtocol){ax+="&X-atmo-protocol=true"
}c.each(ay.headers,function(aA,aC){var aB=c.isFunction(aC)?aC.call(this,ay,az,S):aC;
if(aB!=null){ax+="&"+encodeURIComponent(aA)+"="+encodeURIComponent(aB)
}});
return ax
}function al(ax){if(!ax.isOpen){ax.isOpen=true;
J("opening",ax.transport,ax)
}else{if(ax.isReopen){ax.isReopen=false;
J("re-opening",ax.transport,ax)
}}}function o(aA){var ay=K;
if((aA!=null)||(typeof(aA)!=="undefined")){ay=aA
}ay.lastIndex=0;
ay.readyState=0;
if((ay.transport==="jsonp")||((ay.enableXDR)&&(c.atmosphere.checkCORSSupport()))){v(ay);
return
}if(ay.transport==="ajax"){X(aA);
return
}if(c.browser.msie&&+c.browser.version.split(".")[0]<10){if((ay.transport==="streaming")){if(ay.enableXDR&&window.XDomainRequest){L(ay)
}else{ar(ay)
}return
}if((ay.enableXDR)&&(window.XDomainRequest)){L(ay);
return
}}var aB=function(){ay.lastIndex=0;
if(ay.reconnect&&h++<ay.maxReconnectOnClose){S.ffTryingReconnect=true;
J("re-connecting",aA.transport,aA);
N(az,ay,aA.reconnectInterval)
}else{ac(0,"maxReconnectOnClose reached")
}};
var ax=function(){S.errorHandled=true;
ai();
aB()
};
if(ay.reconnect&&(ay.maxRequest===-1||ay.requestCount++<ay.maxRequest)){var az=c.ajaxSettings.xhr();
az.hasData=false;
d(az,ay,true);
if(ay.suspend){r=az
}if(ay.transport!=="polling"){S.transport=ay.transport;
az.onabort=function(){af(true)
};
az.onerror=function(){S.error=true;
S.ffTryingReconnect=true;
try{S.status=XMLHttpRequest.status
}catch(aC){S.status=500
}if(!S.status){S.status=500
}if(!S.errorHandled){ai();
aB()
}}
}az.onreadystatechange=function(){if(at){return
}S.error=null;
var aD=false;
var aJ=false;
if(ay.transport==="streaming"&&ay.readyState>2&&az.readyState===4){ai();
aB();
return
}ay.readyState=az.readyState;
if(ay.transport==="streaming"&&az.readyState>=3){aJ=true
}else{if(ay.transport==="long-polling"&&az.readyState===4){aJ=true
}}u(K);
if(ay.transport!=="polling"){var aC=200;
if(az.readyState===4){aC=az.status>1000?0:az.status
}if(aC>=300||aC===0){ax();
return
}if((!ay.enableProtocol||!aA.firstMessage)&&az.readyState===2){if(c.browser.mozilla&&S.ffTryingReconnect){S.ffTryingReconnect=false;
setTimeout(function(){if(!S.ffTryingReconnect){al(ay)
}},500)
}else{al(ay)
}}}else{if(az.readyState===4){aJ=true
}}if(aJ){var aG=az.responseText;
if(c.trim(aG).length===0&&ay.transport==="long-polling"){if(!az.hasData){ax()
}else{az.hasData=false
}return
}az.hasData=true;
ad(az,K);
if(ay.transport==="streaming"){if(!c.browser.opera){var aF=aG.substring(ay.lastIndex,aG.length);
aD=t(aF,ay,S);
ay.lastIndex=aG.length;
if(aD){return
}}else{c.atmosphere.iterate(function(){if(S.status!==500&&az.responseText.length>ay.lastIndex){try{S.status=az.status;
S.headers=a(az.getAllResponseHeaders());
ad(az,K)
}catch(aL){S.status=404
}u(K);
S.state="messageReceived";
var aK=az.responseText.substring(ay.lastIndex);
ay.lastIndex=az.responseText.length;
aD=t(aK,ay,S);
if(!aD){y()
}if(H(az,ay)){j(az,ay);
return
}}else{if(S.status>400){ay.lastIndex=az.responseText.length;
return false
}}},0)
}}else{aD=t(aG,ay,S)
}var aI=H(az,ay);
try{S.status=az.status;
S.headers=a(az.getAllResponseHeaders());
ad(az,ay)
}catch(aH){S.status=404
}if(ay.suspend){S.state=S.status===0?"closed":"messageReceived"
}else{S.state="messagePublished"
}var aE=!aI&&aA.transport!=="streaming"&&aA.transport!=="polling";
if(aE&&!ay.executeCallbackBeforeReconnect){N(az,ay,ay.pollingInterval)
}if(S.responseBody.length!==0&&!aD){y()
}if(aE&&ay.executeCallbackBeforeReconnect){N(az,ay,ay.pollingInterval)
}if(aI){j(az,ay)
}}};
az.send(ay.data);
ag=true
}else{if(ay.logLevel==="debug"){c.atmosphere.log(ay.logLevel,["Max re-connection reached."])
}ac(0,"maxRequest reached")
}}function j(ay,ax){ak();
at=false;
N(ay,ax,500)
}function d(az,aA,ay){var ax=aA.url;
if(aA.dispatchUrl!=null&&aA.method==="POST"){ax+=aA.dispatchUrl
}ax=T(aA,ax);
ax=c.atmosphere.prepareURL(ax);
if(ay){az.open(aA.method,ax,true);
if(aA.connectTimeout>0){aA.id=setTimeout(function(){if(aA.requestCount===0){ai();
B("Connect timeout","closed",200,aA.transport)
}},aA.connectTimeout)
}}if(K.withCredentials&&K.transport!=="websocket"){if("withCredentials" in az){az.withCredentials=true
}}if(!K.dropHeaders){az.setRequestHeader("X-Atmosphere-Framework",c.atmosphere.version);
az.setRequestHeader("X-Atmosphere-Transport",aA.transport);
if(az.heartbeat!==null&&az.heartbeat.server!==null){az.setRequestHeader("X-Heartbeat-Server",az.heartbeat.server)
}if(aA.trackMessageLength){az.setRequestHeader("X-Atmosphere-TrackMessageSize","true")
}az.setRequestHeader("X-Atmosphere-tracking-id",aA.uuid);
c.each(aA.headers,function(aB,aD){var aC=c.isFunction(aD)?aD.call(this,az,aA,ay,S):aD;
if(aC!=null){az.setRequestHeader(aB,aC)
}})
}if(aA.contentType!==""){az.setRequestHeader("Content-Type",aA.contentType)
}}function N(ay,az,aA){if(az.reconnect||(az.suspend&&ag)){var ax=0;
if(ay.readyState>1){ax=ay.status>1000?0:ay.status
}S.status=ax===0?204:ax;
S.reason=ax===0?"Server resumed the connection or down.":"OK";
clearTimeout(az.id);
if(az.reconnectId){clearTimeout(az.reconnectId);
delete az.reconnectId
}if(aA>0){setTimeout(function(){K.reconnectId=o(az)
},aA)
}else{o(az)
}}}function ab(ax){ax.state="re-connecting";
Y(ax)
}function L(ax){if(ax.transport!=="polling"){A=R(ax);
A.open()
}else{R(ax).open()
}}function R(az){var ay=K;
if((az!=null)&&(typeof(az)!=="undefined")){ay=az
}var aE=ay.transport;
var aD=0;
var ax=new window.XDomainRequest();
var aB=function(){if(ay.transport==="long-polling"&&(ay.reconnect&&(ay.maxRequest===-1||ay.requestCount++<ay.maxRequest))){ax.status=200;
L(ay)
}};
var aC=ay.rewriteURL||function(aG){var aF=/(?:^|;\s*)(JSESSIONID|PHPSESSID)=([^;]*)/.exec(document.cookie);
switch(aF&&aF[1]){case"JSESSIONID":return aG.replace(/;jsessionid=[^\?]*|(\?)|$/,";jsessionid="+aF[2]+"$1");
case"PHPSESSID":return aG.replace(/\?PHPSESSID=[^&]*&?|\?|$/,"?PHPSESSID="+aF[2]+"&").replace(/&$/,"")
}return aG
};
ax.onprogress=function(){aA(ax)
};
ax.onerror=function(){if(ay.transport!=="polling"){ai();
if(h++<ay.maxReconnectOnClose){if(ay.reconnectInterval>0){ay.reconnectId=setTimeout(function(){J("re-connecting",az.transport,az);
L(ay)
},ay.reconnectInterval)
}else{J("re-connecting",az.transport,az);
L(ay)
}}else{ac(0,"maxReconnectOnClose reached")
}}};
ax.onload=function(){};
var aA=function(aF){clearTimeout(ay.id);
var aH=aF.responseText;
aH=aH.substring(aD);
aD+=aH.length;
if(aE!=="polling"){u(ay);
var aG=t(aH,ay,S);
if(aE==="long-polling"&&c.trim(aH).length===0){return
}if(ay.executeCallbackBeforeReconnect){aB()
}if(!aG){B(S.responseBody,"messageReceived",200,aE)
}if(!ay.executeCallbackBeforeReconnect){aB()
}}};
return{open:function(){var aF=ay.url;
if(ay.dispatchUrl!=null){aF+=ay.dispatchUrl
}aF=T(ay,aF);
ax.open(ay.method,aC(aF));
if(ay.method==="GET"){ax.send()
}else{ax.send(ay.data)
}if(ay.connectTimeout>0){ay.id=setTimeout(function(){if(ay.requestCount===0){ai();
B("Connect timeout","closed",200,ay.transport)
}},ay.connectTimeout)
}},close:function(){ax.abort()
}}
}function ar(ax){A=s(ax);
A.open()
}function s(aA){var az=K;
if((aA!=null)&&(typeof(aA)!=="undefined")){az=aA
}var ay;
var aB=new window.ActiveXObject("htmlfile");
aB.open();
aB.close();
var ax=az.url;
if(az.dispatchUrl!=null){ax+=az.dispatchUrl
}if(az.transport!=="polling"){S.transport=az.transport
}return{open:function(){var aC=aB.createElement("iframe");
ax=T(az);
if(az.data!==""){ax+="&X-Atmosphere-Post-Body="+encodeURIComponent(az.data)
}ax=c.atmosphere.prepareURL(ax);
aC.src=ax;
aB.body.appendChild(aC);
var aD=aC.contentDocument||aC.contentWindow.document;
ay=c.atmosphere.iterate(function(){try{if(!aD.firstChild){return
}if(aD.readyState==="complete"){try{c.noop(aD.fileSize)
}catch(aJ){B("Connection Failure","error",500,az.transport);
return false
}}var aG=aD.body?aD.body.lastChild:aD;
var aI=function(){var aL=aG.cloneNode(true);
aL.appendChild(aD.createTextNode("."));
var aK=aL.innerText;
aK=aK.substring(0,aK.length-1);
return aK
};
if(!c.nodeName(aG,"pre")){var aF=aD.head||aD.getElementsByTagName("head")[0]||aD.documentElement||aD;
var aE=aD.createElement("script");
aE.text="document.write('<plaintext>')";
aF.insertBefore(aE,aF.firstChild);
aF.removeChild(aE);
aG=aD.body.lastChild
}if(az.closed){az.isReopen=true
}ay=c.atmosphere.iterate(function(){var aL=aI();
if(aL.length>az.lastIndex){u(K);
S.status=200;
S.error=null;
aG.innerText="";
var aK=t(aL,az,S);
if(aK){return""
}B(S.responseBody,"messageReceived",200,az.transport)
}az.lastIndex=0;
if(aD.readyState==="complete"){af(true);
J("re-connecting",az.transport,az);
if(az.reconnectInterval>0){az.reconnectId=setTimeout(function(){ar(az)
},az.reconnectInterval)
}else{ar(az)
}return false
}},null);
return false
}catch(aH){S.error=true;
J("re-connecting",az.transport,az);
if(h++<az.maxReconnectOnClose){if(az.reconnectInterval>0){az.reconnectId=setTimeout(function(){ar(az)
},az.reconnectInterval)
}else{ar(az)
}}else{ac(0,"maxReconnectOnClose reached")
}aB.execCommand("Stop");
aB.close();
return false
}})
},close:function(){if(ay){ay()
}aB.execCommand("Stop");
af(true)
}}
}function aj(ax){if(m!=null){i(ax)
}else{if(r!=null||k!=null){e(ax)
}else{if(A!=null){U(ax)
}else{if(C!=null){Q(ax)
}else{if(V!=null){D(ax)
}else{ac(0,"No suspended connection available");
c.atmosphere.error("No suspended connection available. Make sure atmosphere.subscribe has been called and request.onOpen invoked before invoking this method")
}}}}}}function i(ax){m.send(ax)
}function x(ay){if(ay.length===0){return
}try{if(m){m.localSend(ay)
}else{if(an){an.signal("localMessage",c.stringifyJSON({id:F,event:ay}))
}}}catch(ax){c.atmosphere.error(ax)
}}function e(ay){var ax=am(ay);
o(ax)
}function U(ay){if(K.enableXDR&&c.atmosphere.checkCORSSupport()){var ax=am(ay);
ax.reconnect=false;
v(ax)
}else{e(ay)
}}function Q(ax){e(ax)
}function P(ax){var ay=ax;
if(typeof(ay)==="object"){ay=ax.data
}return ay
}function am(ay){var az=P(ay);
var ax={connected:false,timeout:60000,method:"POST",url:K.url,contentType:K.contentType,headers:K.headers,reconnect:true,callback:null,data:az,suspend:false,maxRequest:-1,logLevel:"info",requestCount:0,withCredentials:K.withCredentials,transport:"polling",isOpen:true,attachHeadersAsQueryString:true,enableXDR:K.enableXDR,uuid:K.uuid,dispatchUrl:K.dispatchUrl,enableProtocol:false,messageDelimiter:"|",trackMessageLength:K.trackMessageLength,maxReconnectOnClose:K.maxReconnectOnClose,heartbeatTimer:K.heartbeatTimer,heartbeat:K.heartbeat};
if(typeof(ay)==="object"){ax=c.extend(ax,ay)
}return ax
}function D(ax){var aA=c.atmosphere.isBinary(ax)?ax:P(ax);
var ay;
try{if(K.dispatchUrl!=null){ay=K.webSocketPathDelimiter+K.dispatchUrl+K.webSocketPathDelimiter+aA
}else{ay=aA
}if(!V.canSendMessage){c.atmosphere.error("WebSocket not connected.");
return
}V.send(ay)
}catch(az){V.onclose=function(aB){};
ai();
M("Websocket failed. Downgrading to Comet and resending "+ax);
e(ax)
}}function Z(ay){var ax=c.parseJSON(ay);
if(ax.id!==F){if(typeof(K.onLocalMessage)!=="undefined"){K.onLocalMessage(ax.event)
}else{if(typeof(c.atmosphere.onLocalMessage)!=="undefined"){c.atmosphere.onLocalMessage(ax.event)
}}}}function B(aA,ax,ay,az){S.responseBody=aA;
S.transport=az;
S.status=ay;
S.state=ax;
y()
}function ad(ax,az){if(!az.readResponsesHeaders){if(!az.enableProtocol){az.uuid=c.atmosphere.guid()
}}else{try{var ay=ax.getResponseHeader("X-Atmosphere-tracking-id");
if(ay&&ay!=null){az.uuid=ay.split(" ").pop()
}}catch(aA){}}}function Y(ax){aq(ax,K);
aq(ax,c.atmosphere)
}function aq(ay,az){switch(ay.state){case"messageReceived":h=0;
if(typeof(az.onMessage)!=="undefined"){az.onMessage(ay)
}break;
case"error":if(typeof(az.onError)!=="undefined"){az.onError(ay)
}break;
case"opening":delete K.closed;
if(typeof(az.onOpen)!=="undefined"){az.onOpen(ay)
}break;
case"messagePublished":if(typeof(az.onMessagePublished)!=="undefined"){az.onMessagePublished(ay)
}break;
case"re-connecting":if(typeof(az.onReconnect)!=="undefined"){az.onReconnect(K,ay)
}break;
case"closedByClient":if(typeof(az.onClientTimeout)!=="undefined"){az.onClientTimeout(K)
}break;
case"re-opening":delete K.closed;
if(typeof(az.onReopen)!=="undefined"){az.onReopen(K,ay)
}break;
case"fail-to-reconnect":if(typeof(az.onFailureToReconnect)!=="undefined"){az.onFailureToReconnect(K,ay)
}break;
case"unsubscribe":case"closed":var ax=typeof(K.closed)!=="undefined"?K.closed:false;
if(!ax){if(typeof(az.onClose)!=="undefined"){az.onClose(ay)
}}K.closed=true;
break
}}function af(ax){if(S.state!=="closed"){S.state="closed";
S.responseBody="";
S.messages=[];
S.status=!ax?501:200;
y()
}}function y(){var az=function(aC,aD){aD(S)
};
if(m==null&&W!=null){W(S.responseBody)
}K.reconnect=K.mrequest;
var ax=typeof(S.responseBody)==="string";
var aA=(ax&&K.trackMessageLength)?(S.messages.length>0?S.messages:[""]):new Array(S.responseBody);
for(var ay=0;
ay<aA.length;
ay++){if(aA.length>1&&aA[ay].length===0){continue
}S.responseBody=(ax)?c.trim(aA[ay]):aA[ay];
if(m==null&&W!=null){W(S.responseBody)
}if(S.responseBody.length===0&&S.state==="messageReceived"){continue
}Y(S);
if(c.atmosphere.callbacks.length>0){if(K.logLevel==="debug"){c.atmosphere.debug("Invoking "+c.atmosphere.callbacks.length+" global callbacks: "+S.state)
}try{c.each(c.atmosphere.callbacks,az)
}catch(aB){c.atmosphere.log(K.logLevel,["Callback exception"+aB])
}}if(typeof(K.callback)==="function"){if(K.logLevel==="debug"){c.atmosphere.debug("Invoking request callbacks")
}try{K.callback(S)
}catch(aB){c.atmosphere.log(K.logLevel,["Callback exception"+aB])
}}}}function H(ay,ax){if(S.partialMessage===""&&(ax.transport==="streaming")&&(ay.responseText.length>ax.maxStreamingLength)){return true
}return false
}function z(){if(K.enableProtocol&&!K.firstMessage){var ay="X-Atmosphere-Transport=close&X-Atmosphere-tracking-id="+K.uuid;
c.each(K.headers,function(az,aB){var aA=c.isFunction(aB)?aB.call(this,K,K,S):aB;
if(aA!=null){ay+="&"+encodeURIComponent(az)+"="+encodeURIComponent(aA)
}});
var ax=K.url.replace(/([?&])_=[^&]*/,ay);
ax=ax+(ax===K.url?(/\?/.test(K.url)?"&":"?")+ay:"");
if(K.connectTimeout>0){c.ajax({url:ax,async:K.closeAsync,timeout:K.connectTimeout,cache:false,crossDomain:K.enableXDR})
}else{c.ajax({url:ax,async:K.closeAsync,cache:false,crossDomain:K.enableXDR})
}}}function ak(){if(K.reconnectId){clearTimeout(K.reconnectId);
delete K.reconnectId
}if(K.heartbeatTimer){clearTimeout(K.heartbeatTimer)
}K.reconnect=false;
at=true;
S.request=K;
S.state="unsubscribe";
S.responseBody="";
S.status=408;
y();
z();
ai()
}function ai(){S.partialMessage="";
if(K.id){clearTimeout(K.id)
}if(K.heartbeatTimer){clearTimeout(K.heartbeatTimer)
}if(A!=null){A.close();
A=null
}if(C!=null){C.abort();
C=null
}if(r!=null){r.abort();
r=null
}if(V!=null){if(V.canSendMessage){V.close()
}V=null
}if(k!=null){k.close();
k=null
}ap()
}function ap(){if(an!=null){clearInterval(G);
document.cookie=aw+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
an.signal("close",{reason:"",heir:!at?F:(an.get("children")||[])[0]});
an.close()
}if(m!=null){m.close()
}}this.subscribe=function(ax){av(ax);
p()
};
this.execute=function(){p()
};
this.invokeCallback=function(){y()
};
this.close=function(){ak()
};
this.disconnect=function(){z()
};
this.getUrl=function(){return K.url
};
this.push=function(az,ay){if(ay!=null){var ax=K.dispatchUrl;
K.dispatchUrl=ay;
aj(az);
K.dispatchUrl=ax
}else{aj(az)
}};
this.getUUID=function(){return K.uuid
};
this.pushLocal=function(ax){x(ax)
};
this.enableProtocol=function(ax){return K.enableProtocol
};
this.request=K;
this.response=S
},subscribe:function(d,g,f){if(typeof(g)==="function"){c.atmosphere.addCallback(g)
}if(typeof(d)!=="string"){f=d
}else{f.url=d
}c.atmosphere.uuid=((typeof(f)!=="undefined")&&typeof(f.uuid)!=="undefined")?f.uuid:0;
var e=new c.atmosphere.AtmosphereRequest(f);
e.execute();
c.atmosphere.requests[c.atmosphere.requests.length]=e;
return e
},addCallback:function(d){if(c.inArray(d,c.atmosphere.callbacks)===-1){c.atmosphere.callbacks.push(d)
}},removeCallback:function(e){var d=c.inArray(e,c.atmosphere.callbacks);
if(d!==-1){c.atmosphere.callbacks.splice(d,1)
}},unsubscribe:function(){if(c.atmosphere.requests.length>0){var d=[].concat(c.atmosphere.requests);
for(var f=0;
f<d.length;
f++){var e=d[f];
e.close();
clearTimeout(e.response.request.id);
if(e.heartbeatTimer){clearTimeout(e.heartbeatTimer)
}}}c.atmosphere.requests=[];
c.atmosphere.callbacks=[]
},unsubscribeUrl:function(e){var d=-1;
if(c.atmosphere.requests.length>0){for(var g=0;
g<c.atmosphere.requests.length;
g++){var f=c.atmosphere.requests[g];
if(f.getUrl()===e){f.close();
clearTimeout(f.response.request.id);
if(f.heartbeatTimer){clearTimeout(f.heartbeatTimer)
}d=g;
break
}}}if(d>=0){c.atmosphere.requests.splice(d,1)
}},publish:function(e){if(typeof(e.callback)==="function"){c.atmosphere.addCallback(e.callback)
}e.transport="polling";
var d=new c.atmosphere.AtmosphereRequest(e);
c.atmosphere.requests[c.atmosphere.requests.length]=d;
return d
},checkCORSSupport:function(){if(c.browser.msie&&!window.XDomainRequest&&+c.browser.version.split(".")[0]<11){return true
}else{if(c.browser.opera&&+c.browser.version.split(".")[0]<12){return true
}else{if(c.trim(navigator.userAgent).slice(0,16)==="KreaTVWebKit/531"){return true
}else{if(c.trim(navigator.userAgent).slice(-7).toLowerCase()==="kreatel"){return true
}}}}var d=navigator.userAgent.toLowerCase();
var e=d.indexOf("android")>-1;
if(e){return true
}return false
},S4:function(){return(((1+Math.random())*65536)|0).toString(16).substring(1)
},guid:function(){return(c.atmosphere.S4()+c.atmosphere.S4()+"-"+c.atmosphere.S4()+"-"+c.atmosphere.S4()+"-"+c.atmosphere.S4()+"-"+c.atmosphere.S4()+c.atmosphere.S4()+c.atmosphere.S4())
},prepareURL:function(e){var f=c.now();
var d=e.replace(/([?&])_=[^&]*/,"$1_="+f);
return d+(d===e?(/\?/.test(e)?"&":"?")+"_="+f:"")
},param:function(d){return c.param(d,c.ajaxSettings.traditional)
},supportStorage:function(){var f=window.localStorage;
if(f){try{f.setItem("t","t");
f.removeItem("t");
return window.StorageEvent&&!c.browser.msie&&!(c.browser.mozilla&&c.browser.version.split(".")[0]==="1")
}catch(d){}}return false
},iterate:function(f,e){var g;
e=e||0;
(function d(){g=setTimeout(function(){if(f()===false){return
}d()
},e)
})();
return function(){clearTimeout(g)
}
},log:function(f,e){if(window.console){var d=window.console[f];
if(typeof d==="function"){d.apply(window.console,e)
}}},warn:function(){c.atmosphere.log("warn",arguments)
},info:function(){c.atmosphere.log("info",arguments)
},debug:function(){c.atmosphere.log("debug",arguments)
},error:function(){c.atmosphere.log("error",arguments)
},isBinary:function(d){return/^\[object\s(?:Blob|ArrayBuffer|.+Array)\]$/.test(Object.prototype.toString.call(d))
}};
(function(){var d,e;
c.uaMatch=function(g){g=g.toLowerCase();
var f=/(chrome)[ \/]([\w.]+)/.exec(g)||/(webkit)[ \/]([\w.]+)/.exec(g)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(g)||/(msie) ([\w.]+)/.exec(g)||/(trident)(?:.*? rv:([\w.]+)|)/.exec(g)||g.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(g)||[];
return{browser:f[1]||"",version:f[2]||"0"}
};
d=c.uaMatch(navigator.userAgent);
e={};
if(d.browser){e[d.browser]=true;
e.version=d.version
}if(e.chrome){e.webkit=true
}else{if(e.webkit){e.safari=true
}}if(e.trident){e.msie=true
}c.browser=e;
c.sub=function(){function f(i,j){return new f.fn.init(i,j)
}c.extend(true,f,this);
f.superclass=this;
f.fn=f.prototype=this();
f.fn.constructor=f;
f.sub=this.sub;
f.fn.init=function h(i,j){if(j&&j instanceof c&&!(j instanceof f)){j=f(j)
}return c.fn.init.call(this,i,j,g)
};
f.fn.init.prototype=f.fn;
var g=f(document);
return f
}
})();
(function(h){var j=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,g={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};
function d(f){return'"'+f.replace(j,function(k){var l=g[k];
return typeof l==="string"?l:"\\u"+("0000"+k.charCodeAt(0).toString(16)).slice(-4)
})+'"'
}function e(f){return f<10?"0"+f:f
}function i(o,n){var m,l,f,k,q=n[o],p=typeof q;
if(q&&typeof q==="object"&&typeof q.toJSON==="function"){q=q.toJSON(o);
p=typeof q
}switch(p){case"string":return d(q);
case"number":return isFinite(q)?String(q):"null";
case"boolean":return String(q);
case"object":if(!q){return"null"
}switch(Object.prototype.toString.call(q)){case"[object Date]":return isFinite(q.valueOf())?'"'+q.getUTCFullYear()+"-"+e(q.getUTCMonth()+1)+"-"+e(q.getUTCDate())+"T"+e(q.getUTCHours())+":"+e(q.getUTCMinutes())+":"+e(q.getUTCSeconds())+'Z"':"null";
case"[object Array]":f=q.length;
k=[];
for(m=0;
m<f;
m++){k.push(i(m,q)||"null")
}return"["+k.join(",")+"]";
default:k=[];
for(m in q){if(Object.prototype.hasOwnProperty.call(q,m)){l=i(m,q);
if(l){k.push(d(m)+":"+l)
}}}return"{"+k.join(",")+"}"
}}}h.stringifyJSON=function(f){if(window.JSON&&window.JSON.stringify){return window.JSON.stringify(f)
}return i("",{"":f})
}
}(c))
}));