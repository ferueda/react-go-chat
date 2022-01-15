package main

import (
	"time"

	"github.com/gorilla/websocket"
)

type client struct {
	socket *websocket.Conn
	// send is a channel on which messages are sent.
	send chan *message
	// online is a channel on which online users list is sent.
	online chan []string
	// room is the room this client is chatting in
	room *room
	// user holds information about the user
	user *user
}

type user struct {
	username string
	avatar   string
}

func newClient(s *websocket.Conn, r *room, u *user) *client {
	return &client{
		socket: s,
		send:   make(chan *message),
		online: make(chan []string),
		room:   r,
		user:   u,
	}
}

func (c *client) read() {
	defer c.socket.Close()
	for {
		var msg *message
		err := c.socket.ReadJSON(&msg)
		if err != nil {
			return
		}

		msg.When = time.Now()
		msg.Username = c.user.username
		if c.user.avatar != "" {
			msg.Avatar = c.user.avatar
		}
		c.room.forward <- msg
	}
}

func (c *client) write() {
	defer c.socket.Close()
	for msg := range c.send {
		err := c.socket.WriteJSON(msg)
		if err != nil {
			return
		}
	}
}

func (c *client) newUser() {
	defer c.socket.Close()
	for msg := range c.online {
		err := c.socket.WriteJSON(struct {
			Users []string `json:"users"`
		}{Users: msg})

		if err != nil {
			return
		}
	}
}
