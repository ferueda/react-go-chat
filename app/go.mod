module github.com/ferueda/react-go-chat

go 1.17

require github.com/gorilla/websocket v1.4.2

require (
	github.com/ferueda/react-go-chat/trace v1.0.0
	github.com/golang-jwt/jwt v3.2.2+incompatible
)

replace github.com/ferueda/react-go-chat/trace v1.0.0 => ../trace
