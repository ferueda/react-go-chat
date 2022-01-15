package main

import (
	"flag"
	"log"
	"net/http"
	"os"

	"github.com/ferueda/react-go-chat/trace"
)

const (
	accessSecret = "secret"
)

func main() {
	addr := flag.String("addr", ":8080", "addr of the application.")
	flag.Parse() // parse the flags

	r := newRoom()
	r.tracer = trace.New(os.Stdout)

	http.Handle("/room", MustAuth(r))
	http.HandleFunc("/token", tokenHandler(r))

	go r.run()

	// start the web server
	log.Println("Starting web server on", *addr)
	if err := http.ListenAndServe(*addr, nil); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
