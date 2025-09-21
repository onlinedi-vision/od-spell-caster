package main

type users map[string][]string
// [type users] = {
// 	"username1": [
// 		"server1",
// 		"server2"
// 	],
// 	"username2": [
// 		"server2",
// 		"server3"
// 	]
// }
func new() users{
	return make(map[string][]string)
}
func (self *users) newUser(username string) []string{
	// TODO: call API for username's servers
	//       & add them to the list
	self[username] = make([])
}

type connection_layout struct {
	layout map[string][]Addr
	users users
}
// [type connection_layout] = {
// 	"server1": [
// 		Addr("151.4.x.x")
// 	],
// 	"server2": [
// 		Addr("142.2.y.z"),
// 		Addr("151.4.w.x")
// 	]
// 	"server3": [
// 		...
// 	],
// 	...
// }
func (self *connection_layout) new() {
	self.layout = make(map[string][]Addr)
	self.users = users.new()
}

func (self *connection_layout) newConnection(username string, userAddr Addr) {
	self.users.newUser()
	for index, server := range self.users[username] {
		if val, ok := self.layout[server]; ok {
			self.layout[server] = append(self.layout[server], userAddr)
		} else {
			self.layout[server] = make([]Addr)
			self.layout[server] = append(self.layout[server], userAddr)
		}
	}
}
