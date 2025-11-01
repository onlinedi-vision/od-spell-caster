const consts = require('./consts.ts');
const util = require('./util.ts');

let spell_key = '';
let all_ws = {'1313': []};
let connected_ws = [];
let secrets = [];

console.log("Starting Websockets Server on port: " + consts.port);

async function includeAllServers(username, token) {
	  console.log('ALL_WS: ' + all_ws);
	  let payload = await fetch(
			consts.get_user_servers_api,
			{
				method: 'POST',
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					'username': username,
					'token': token
				})
			}
		);
		if(!payload.ok) {
			console.log(payload);
			return;
		}

		let get_user_servers_payload = await payload.json();

		for (let sid in get_user_servers_payload['s_list']) {
			if(!all_ws.keys().has(sid)) {
				all_ws.set(sid, []);
			}
			all_ws.get(sid).push(sid);
		}

		return token;
}



Bun.serve({
  port: consts.port,
  fetch(req, server) {

    console.log('[LOG] [Bun.serve] Upgrading ' + req);
    const url = new URL(req.url);
    if(url.pathname === "/wss") {
      server.upgrade(req,{
        data: {
          username: url.searchParams.get('username')
        } 
      });
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  
  websocket: {
    data: {},  
    async message(ws, message) {
      console.log('[LOG] [message]');
      
      if(!connected_ws.includes(ws) && secrets.includes(message)) {
        connected_ws.push(ws);
          ws.send("CONNECTED");
        return;
      } 

      if(message.startsWith("TOKEN:")) {
        let token = await includeAllServers(ws.data.username, message.split(":")[1]);

        ws.send(token);
        return;
      }
    
      Object.keys(all_ws).forEach((key) => {
        if(all_ws[key].includes(ws)) {
          all_ws[key].forEach((kws) => {
            kws.send(message);
          });
        }
      })

    },
    
    async open(ws) {
      let res = await util.addSecretToScylla(ws.data['username']);
      let [ key, spell ] = res;
      secrets.push(spell);
      ws.send(key);
    },
    
    async close(ws, code, message) {}, 

    async drain(ws) {}, 

  },
});
