package com.everhomes;

import org.atmosphere.cpr.AtmosphereHandler;
import org.atmosphere.cpr.AtmosphereRequest;
import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.AtmosphereResourceEvent;
import org.atmosphere.cpr.AtmosphereResponse;
import org.atmosphere.config.service.AtmosphereHandlerService;

import java.io.IOException;
import java.util.Date;

//@AtmosphereHandlerService(path="/everhomes")
public class ChatAtmosphereHandler implements AtmosphereHandler {

    @Override
    public void onRequest(AtmosphereResource r) throws IOException {
    
        AtmosphereRequest req = r.getRequest();
        
        // First, tell Atmosphere to allow bi-directional communication by suspending.
        if (req.getMethod().equalsIgnoreCase("GET")) {
            // We are using HTTP long-polling with an invite timeout
            r.suspend();
        // Second, broadcast message to all connected users.
        } else if (req.getMethod().equalsIgnoreCase("POST")) {
            r.getBroadcaster().broadcast(req.getReader().readLine().trim());
        }   
    }   
    
    @Override
    public void onStateChange(AtmosphereResourceEvent event) throws IOException {
        AtmosphereResource r = event.getResource();
        AtmosphereResponse res = r.getResponse();
        
        if (r.isSuspended()) {
            String body = event.getMessage().toString();
            
            // Simple JSON -- Use Jackson for more complex structure
            // Message looks like { "author" : "foo", "message" : "bar" }
            String author = body.substring(body.indexOf(":") + 2, body.indexOf(",") - 1);
            String message = body.substring(body.lastIndexOf(":") + 2, body.length() - 2);
            
            res.getWriter().write(new Data(author, message).toString());
            switch (r.transport()) {
                case JSONP:
                case LONG_POLLING:
                    event.getResource().resume();
                    break;
                case WEBSOCKET :
                case STREAMING:
                    res.getWriter().flush();
                    break;
            }       
        } else if (!event.isResuming()){
            event.broadcaster().broadcast(new Data("Someone", "say bye bye!").toString());
        }   
    }   
    
    @Override
    public void destroy() {
    }
    
    private final static class Data {
    
        private final String text;
        private final String author;
        
        public Data(String author, String text) {
            this.author = author;
            this.text = text;
        }   
        
        public String toString() {
            return "{ \"text\" : \"" + text 
                  + "\", \"author\" : \"" + author + "\" , \"time\" : " + new Date().getTime() + "}";
        }   
    }   
}   
