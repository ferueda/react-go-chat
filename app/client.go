package main

import (
	"time"

	"github.com/gorilla/websocket"
)

type client struct {
	socket *websocket.Conn
	// send is a channel on which messages are sent.
	send chan *message
	// room is the room this client is chatting in
	room *room
	// user holds information about the user
	user map[string]interface{}
}

func newClient(s *websocket.Conn, r *room, username string) *client {
	return &client{
		socket: s,
		send:   make(chan *message),
		room:   r,
		user:   map[string]interface{}{"username": username},
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
		msg.Username = c.user["username"].(string)
		if avatar, ok := c.user["avatar"]; ok {
			msg.Avatar = avatar.(string)
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
