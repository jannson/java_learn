package com.everhomes;

import org.atmosphere.config.managed.Decoder;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

/**
 * Decode a String into a {@link ChatProtocol}.
 */
public class ProtocolDecoder implements Decoder<String, Data> {
	private final Logger logger = LoggerFactory.getLogger(ProtocolDecoder.class);
    private final ObjectMapper mapper = new ObjectMapper();

    @Override
    public Data decode(String s) {
        try {
        	Data d = mapper.readValue(s, Data.class);
        	logger.info("decode is :{}", d);
            return d;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}