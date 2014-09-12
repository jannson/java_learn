package com.everhomes;

import javax.servlet.AsyncContext;
import java.io.PrintWriter;
import java.util.Date;

import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.cpr.BroadcasterFactory;
import org.atmosphere.cpr.AtmosphereFramework;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletContext;

public class Executor implements Runnable {
    private AsyncContext ctx = null;
    private final Logger logger = LoggerFactory.getLogger(Executor.class);
    
    public Executor(AsyncContext ctx){
        this.ctx = ctx;
    }

    public void run(){
        try {
        		ServletContext servletContext = ctx.getRequest().getServletContext();
        		AtmosphereFramework framework = (AtmosphereFramework) servletContext.getAttribute("AtmosphereServlet");
        		BroadcasterFactory broadcasterFactory = framework.getBroadcasterFactory();
        		
        		for (Broadcaster broadcaster : broadcasterFactory.lookupAll()) {
        			if (!("/*".equals(broadcaster.getID()))) {
        				logger.info(" async broadcaster is {} factory is {}", broadcaster, broadcasterFactory);
        				
        				broadcaster.broadcast("{\"author\":\"janson\",\"message\":\"haha\"}");
        			}
        		}
        			
            PrintWriter out = ctx.getResponse().getWriter();
            out.println("业务处理完毕的时间：" + new Date() + ".");
            out.flush();
            ctx.complete();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}