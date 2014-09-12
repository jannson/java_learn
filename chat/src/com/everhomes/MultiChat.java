package com.everhomes;

import org.atmosphere.config.service.DeliverTo;
import org.atmosphere.config.service.Disconnect;
import org.atmosphere.config.service.ManagedService;
import org.atmosphere.config.service.Message;
import org.atmosphere.config.service.PathParam;
import org.atmosphere.config.service.Ready;
import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.AtmosphereResourceEvent;
import org.atmosphere.cpr.AtmosphereResourceFactory;
import org.atmosphere.cpr.BroadcasterFactory;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;


//@ManagedService(path = "/mchat/{room: [a-zA-Z][a-zA-Z_0-9]*}")
public class MultiChat {
	private final Logger logger = LoggerFactory.getLogger(MultiChat.class);
	//private final ObjectMapper mapper = new ObjectMapper();
	private final static String CHAT = "/mchat/";
	
	@PathParam("room")
	private String chatroomName;
	
	private BroadcasterFactory factory;
	
	private AtmosphereResourceFactory resourceFactory;
	
	@Ready(encoders = {com.everhomes.JacksonEncoder.class})
    @DeliverTo(DeliverTo.DELIVER_TO.ALL)
    public Data onReady(final AtmosphereResource r) {
        logger.info("Browser {} connected.", r.uuid());

        factory = r.getAtmosphereConfig().getBroadcasterFactory();
        resourceFactory = r.getAtmosphereConfig().resourcesFactory();
        
        //for (StackTraceElement ste : Thread.currentThread().getStackTrace()) {
        //        System.out.println(ste);
            //}
        
        Data d = new Data(r.uuid(), "new connected" );
        //logger.info("mydata {}", d);
        //return "{\"author\":\"hello\",\"message\":\"hahah\"}";
        return d;
    }
    
    @Disconnect
    public void onDisconnect(AtmosphereResourceEvent event) {
        if (event.isCancelled()) {
            logger.info("Browser {} unexpectedly disconnected", event.getResource().uuid());
        } else if (event.isClosedByClient()) {
            logger.info("Browser {} closed the connection", event.getResource().uuid());
        }
    }
    
    /**
     * Simple annotated class that demonstrate how {@link org.atmosphere.config.managed.Encoder} and {@link org.atmosphere.config.managed.Decoder
     * can be used.
     *
     * @param message an instance of {@link ChatProtocol }
     * @return
     * @throws IOException
     */
//    @Message(encoders = {JacksonEncoder.class}, decoders = {ProtocolDecoder.class})
//    public Data onMessage(Data message) throws IOException {
//    	logger.info("onMessage {} {}", message.getAuthor(), message.getMessage() );
//        logger.info("{} just send {}", message.getAuthor(), message.getMessage());
//        
//      //for (StackTraceElement ste : Thread.currentThread().getStackTrace()) {
//      //        System.out.println(ste);
//        //}
//        
//      //ProtocolDecoder p = new ProtocolDecoder();
//      //JacksonEncoder en = new JacksonEncoder();
//      //logger.info("mydecoder is :{}", p.decode(mapper.writeValueAsString(message)));
//      
//      Data d = new Data(message.getAuthor(), "reply: "+message.getMessage());
//      
//      //logger.info("mydata {}", d);
//      //return "{\"author\":\"hello\",\"message\":\"hahah\"}";
//      return d;
//    }

	 @Message(decoders = {ProtocolDecoder.class})
    public void onPrivateMessage(Data user) throws IOException {
    	logger.info("onPrivateMessage");
      
    	AtmosphereResource first = null;
    	for(AtmosphereResource r : resourceFactory.findAll()) {
    		logger.info("resourceFactory: {}", r);
    		if(null == first) {
    			first = r;
    		}
    	}
      factory.lookup(CHAT + chatroomName).broadcast("{\"author\":\"hello\",\"message\":\"hahah\"}", first);
    }
}
