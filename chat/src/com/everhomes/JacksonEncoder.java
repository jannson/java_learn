package com.everhomes;

import org.atmosphere.config.managed.Encoder;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

/**
 * Encode a {@link ChatProtocol} into a String
 */
public class JacksonEncoder implements Encoder<JacksonEncoder.Encodable, String> {
	//private final Logger logger = LoggerFactory.getLogger(JacksonEncoder.class);
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public String encode(Encodable m) {
        try {
        	//logger.info("what is m: {}", m);
            String s = mapper.writeValueAsString(m);
            //logger.info(" s is : {} ", s);
            return s;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Marker interface for Jackson.
     */
    public static interface Encodable {
    }
}
