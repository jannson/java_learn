package com.everhomes;

import org.atmosphere.cpr.Action;
import org.atmosphere.cpr.AtmosphereConfig;
import org.atmosphere.cpr.AtmosphereInterceptorAdapter;
import org.atmosphere.cpr.AtmosphereRequest;
import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.MetaBroadcaster;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.atmosphere.util.IOUtils.isBodyEmpty;
import static org.atmosphere.util.IOUtils.readEntirely;

public class SelectedBroadcasterAtmosphereInterceptor extends AtmosphereInterceptorAdapter {
    private final static Logger logger = LoggerFactory.getLogger(SelectedBroadcasterAtmosphereInterceptor.class);
    private MetaBroadcaster metaBroadcaster = null;
    
    @Override
    public void configure(AtmosphereConfig config) {
    	MetaBroadcaster metabroadcaster = config.metaBroadcaster();
    }


    @Override
    public Action inspect(AtmosphereResource r) {
        return Action.CONTINUE;
    }


    @Override
    public void postInspect(AtmosphereResource r) {
        if (r.getRequest().getMethod().equalsIgnoreCase("POST")) {
            AtmosphereRequest request = r.getRequest();
            Object o = readEntirely(r);
            if (isBodyEmpty(o)) {
                logger.warn("{} received an empty body", request);
                return;
            }
            //logger.info("broadcasted is {} object is {}", r.getBroadcaster(), o);
            r.getBroadcaster().broadcast(o);
        }
    }

}
