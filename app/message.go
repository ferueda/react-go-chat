package main

import "time"

type message struct {
	Username string    `json:"username"`
	Avatar   string    `json:"avatar"`
	Message  string    `json:"message"`
	When     time.Time `json:"when"`
}
