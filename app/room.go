package main

import (
	"log"
	"net/http"

	"github.com/ferueda/react-go-chat/trace"
	"github.com/gorilla/websocket"
)

const (
	socketBufferSize  = 1024
	messageBufferSize = 256
)

type room struct {
	// forward is a channel that holds incoming messages
	// that should be forwarded to the clients.
	forward chan *message
	// join is a channel for clients wishing to join the room.
	join chan *client
	// leave is a channel for clients wishing to leave the room.
	leave chan *client
	// clients holds all current clients in this room.
	clients map[string]*client
	// tracer will receive trace information of activity
	// in the room.
	tracer trace.Tracer
}

func (r *room) run() {
	for {
		select {
		case client := <-r.join:
			r.clients[client.user.username] = client
			users := r.getOnlineUsers()
			for _, c := range r.clients {
				c.online <- users
			}
			r.tracer.Trace("New client joined")
		case client := <-r.leave:
			delete(r.clients, client.user.username)
			close(client.send)
			users := r.getOnlineUsers()
			for _, c := range r.clients {
				c.online <- users
			}
			r.tracer.Trace("New client left")
		case msg := <-r.forward:
			r.tracer.Trace("Message received: ", string(msg.Message))
			for _, c := range r.clients {
				c.send <- msg
				r.tracer.Trace(" -- sent to client")
			}
		}
	}
}

func newRoom() *room {
	return &room{
		forward: make(chan *message),
		join:    make(chan *client),
		leave:   make(chan *client),
		clients: make(map[string]*client),
		tracer:  trace.Off(),
	}
}

var upgrader = &websocket.Upgrader{
	ReadBufferSize:  socketBufferSize,
	WriteBufferSize: socketBufferSize,
	CheckOrigin:     func(r *http.Request) bool { return true }}

func (r *room) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	socket, err := upgrader.Upgrade(w, req, nil)
	if err != nil {
		log.Fatal("ServeHTTP:", err)
		return
	}

	claims, err := getClaims(req.URL.Query().Get("t"))
	if err != nil {
		log.Fatal("Error getting claims", err)
		return
	}

	var username string
	if u, ok := claims["username"]; ok {
		username = u.(string)
	}

	if _, ok := r.clients[username]; ok {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	var avatar string
	if a, ok := claims["avatar"]; ok {
		avatar = a.(string)
	}

	client := newClient(socket, r, &user{username: username, avatar: avatar})

	r.join <- client
	defer func() { r.leave <- client }()

	go client.write()
	go client.newUser()

	client.read()
}

func (r *room) getOnlineUsers() []string {
	users := make([]string, 0, len(r.clients))
	for u := range r.clients {
		users = append(users, u)
	}
	return users
}
