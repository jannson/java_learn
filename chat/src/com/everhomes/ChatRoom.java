package com.everhomes;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;

import org.atmosphere.cache.UUIDBroadcasterCache;
import org.atmosphere.client.TrackMessageSizeInterceptor;
import org.atmosphere.config.service.AtmosphereHandlerService;
import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.AtmosphereResourceEvent;
import org.atmosphere.cpr.AtmosphereResourceEventListenerAdapter;
import org.atmosphere.cpr.AtmosphereResourceFactory;
import org.atmosphere.cpr.AtmosphereResponse;
import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.cpr.BroadcasterFactory;
import org.atmosphere.cpr.AtmosphereFramework;
import org.atmosphere.cpr.MetaBroadcaster;
import org.atmosphere.handler.OnMessage;
import org.atmosphere.interceptor.AtmosphereResourceLifecycleInterceptor;
import org.atmosphere.interceptor.BroadcastOnPostAtmosphereInterceptor;
import org.atmosphere.interceptor.HeartbeatInterceptor;
import org.atmosphere.util.SimpleBroadcaster;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@AtmosphereHandlerService(path = "/chat/{room: [a-zA-Z][a-zA-Z_0-9]*}",
        broadcasterCache = UUIDBroadcasterCache.class,
        interceptors = { AtmosphereResourceLifecycleInterceptor.class,
								 SelectedBroadcasterAtmosphereInterceptor.class,
                         TrackMessageSizeInterceptor.class,
                         HeartbeatInterceptor.class
                       })
			//broadcaster = SimpleBroadcaster.class)
public class ChatRoom extends OnMessage<String> {
	private final Logger logger = LoggerFactory.getLogger(ChatRoom.class);
	private final ObjectMapper mapper = new ObjectMapper();
	private static final ConcurrentHashMap<String, String> users = new ConcurrentHashMap<String, String>();
	private String roomName;
	
	private BroadcasterFactory factory;
	private AtmosphereResourceFactory resourceFactory;
	private MetaBroadcaster metaBroadcaster;
	
	@Override
	public void onOpen(final AtmosphereResource r) throws IOException {
		logger.info("onOpen uuid is {}", r.uuid());
		factory = r.getAtmosphereConfig().getBroadcasterFactory();
      resourceFactory = r.getAtmosphereConfig().resourcesFactory();
      AtmosphereFramework framework = r.getAtmosphereConfig().framework();
      metaBroadcaster = framework.metaBroadcaster();
      
      //Broadcaster b = null;
      
      roomName = r.getRequest().getPathInfo();
      
      if(roomName.equalsIgnoreCase("/room3")){
    	   r.addEventListener(new AtmosphereResourceEventListenerAdapter() {
               @Override
               public void onSuspend(AtmosphereResourceEvent event) {
                   r.resume();
                   logger.info("closed connection");
               }
           });
      }
//      else {
//    	  String person_name = roomName.substring(1);
//    	  String bid = "";
//    	  if(person_name.equalsIgnoreCase("room1")){
//    		  bid = "/chat/room2";
//    	  }
//    	  else{
//    		  bid = "/chat/room1";
//    	  }
//    	  
//    	  b = factory.lookup(bid);
//    	  if(null != b){
//    		  ChatInfo chat = new ChatInfo("newer", "to tmp user", "hello every one");
//    		  b.broadcast(mapper.writeValueAsString(chat));
//    	  }
//      }
       
      AtmosphereResponse response = r.getResponse();
      Data d = new Data("onopen", "i am comming");
      response.write(mapper.writeValueAsString(d));
      //response.write("{\"author\":\"onopen\",\"message\":\"i am comming\"}");
      
    //for (StackTraceElement ste : Thread.currentThread().getStackTrace()) {
    //          System.out.println(ste);
      //  }
      
      users.put(roomName.substring(1), r.uuid());
     
    }
	
	@Override
   public void onDisconnect(AtmosphereResponse response) throws IOException {
		AtmosphereResource r = response.resource();
		logger.info("onDisconnect uuid is {} ", r.uuid());
		users.remove(roomName.substring(1));
    }


   @Override
   public void onMessage(AtmosphereResponse response, String message) throws IOException {
	   logger.info("onMessage");
	   //AtmosphereResource resource = response.resource();
	   //logger.info("resource is {}", resource);
	   //logger.info("just send {}", message);
	   
	   //resource.getBroadcaster().broadcast("{\"author\":\"hello\",\"message\":\"hahah\"}");
	   
	   //logger.info("broadcaster is {}", resource.getBroadcaster().getClass());
	   
	   //logger.info("readValue is {}", mapper.readValue(message, Data.class));// get object
	   //logger.info("writeValue is {}", mapper.writeValueAsString(mapper.readValue(message, Data.class))); //object to json
	   
       //for (StackTraceElement ste : Thread.currentThread().getStackTrace()) {
       //        System.out.println(ste);
         //}
	   
//	   if(roomName.equalsIgnoreCase("room1")){
//		   metaBroadcaster.broadcastTo("/chat/room2", message);
//	   }
//	   else {
//		   metaBroadcaster.broadcastTo("/chat/room1", message);
//	   }
	   
	  Data msg = null;
      try {
    	  msg = mapper.readValue(message, Data.class);
      }
     catch (IOException e) {
    	 msg = null;
     }
	  
	  if(null != msg) {	// from client
		  logger.info("from client");
		  
		  Broadcaster b = null;
	 	  String person_name = roomName.substring(1);
	 	  String bid = "";
	 	  String uid = "";
	 	  if(person_name.equalsIgnoreCase("room1")){
	 		  bid = "/chat/room2";
	 		  uid = "room2";
	 	  }
	 	  else{
	 		  bid = "/chat/room1";
	 		 uid = "room1";
	 	  }
		  b = factory.lookup(bid);
		  if(null != b){
			  ChatInfo chat = new ChatInfo(msg.getAuthor(), "to tmp user", "hello every one");
			  logger.info("person is {} uid is {} msg is {} users id {}", person_name, uid, msg.getMessage(), users);
			  
			  if(msg.getMessage().equalsIgnoreCase("all")){
				  chat.setMessage("broadcast to all");
				  metaBroadcaster.broadcastTo("/chat/*", mapper.writeValueAsString(chat));
			  }
			  else {
				  try {
					  String uuid = users.get(uid);
					  AtmosphereResource r = resourceFactory.find(uuid);
					  logger.info("found uuid is {}", r.uuid());
					  b.broadcast(mapper.writeValueAsString(chat), r);  
				  }
				  catch(NullPointerException npe) {
					  
				  }
				  response.write(mapper.writeValueAsString(msg));
			  }
		  } 
		  else {
			  if(msg.getAuthor().equalsIgnoreCase("logout")) {
				  ChatInfo chat = new ChatInfo(msg.getAuthor(), "to tmp user", "logout user");
				  b = factory.get("/chat/room2");
				  b.broadcast(mapper.writeValueAsString(chat));
				  response.write(mapper.writeValueAsString(msg));
			  }
		  }
	  }
	  else {	// from other broadcast
		  logger.info("from other broadcast msg is {}", message);
		  
		  try {
			  ChatInfo chat = mapper.readValue(message, ChatInfo.class);
			  logger.info("get broadcasters message {}", chat);
			  
			  msg = new Data(chat.getFromUser(), chat.getMessage());
			  response.write(mapper.writeValueAsString(msg));			  
		  }
		  catch (IOException e) {
		    	 logger.info("error: {}", e);
		     }

	  }
    }
}