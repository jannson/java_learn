package com.everhomes;

public class ChatInfo {
	private String from_user;
	private String to_user;
	private String message;
	
	public ChatInfo(String from, String to, String msg){
		this.from_user = from;
		this.to_user = to;
		this.message = msg;
	}
	
	public ChatInfo(){
		
	}
	
	public String getFromUser(){
		return this.from_user;
	}
	
	public String getMessage(){
		return this.message;
	}
	
	public String getToUser(){
		return this.to_user;
	}
	
	public void setFromUser(String from){
		this.from_user = from;
	}
	
	public void setToUser(String to){
		this.to_user = to;
	}
	
	public void setMessage(String msg){
		this.message = msg;
	}
}
