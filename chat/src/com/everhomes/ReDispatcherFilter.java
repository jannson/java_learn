package com.everhomes;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@WebFilter(asyncSupported = true)
public class ReDispatcherFilter implements Filter {
	private final Logger logger = LoggerFactory.getLogger(ReDispatcherFilter.class);
	
	public void destroy() {
		// TODO Auto-generated method stub
	}

	public void doFilter(ServletRequest req, ServletResponse resp
			, FilterChain chain) throws IOException, ServletException {

		HttpServletRequest request = (HttpServletRequest) req;
		String target = request.getRequestURI();
		//logger.info("request the target is {}", target);
		
		String contextPath = request.getContextPath();
		//logger.info("context path is {}", contextPath);
		
		String servletPath = target.substring(contextPath.length());
		//logger.info("servlet path is {}", servletPath);
		
		target = target.lastIndexOf("?") > 0 ? target.substring(
				target.lastIndexOf("/") + 1,
				target.lastIndexOf("?") - target.lastIndexOf("/")) : target
				.substring(target.lastIndexOf("/") + 1);
					
		if(servletPath.startsWith(chatStart)) {
			//logger.info("hear forward");
			RequestDispatcher rdsp = request.getRequestDispatcher(target);
			rdsp.forward(req, resp);	
		} else {
			chain.doFilter(req, resp);
		}
	}

	private String chatStart = "/chat";

	public void init(FilterConfig config) throws ServletException {
		//this.chatStart = config.getInitParameter("includeServlets").trim();
	}

}