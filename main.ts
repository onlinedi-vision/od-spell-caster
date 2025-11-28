const consts = require('./consts.ts');
const util = require('./util.ts');

let spell_key = '';
let all_ws = {'1313': []};
let connected_ws = [];
let secrets = [];

console.log("Starting Websockets Server on port: " + consts.port);

async function includeAllServers(username, token, ws) {
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
		get_user_servers_payload['s_list'].forEach((sid) => {
			console.log(sid);
			if(!Object.keys(all_ws).includes(sid)) {
				all_ws[sid]= new Array();
			}
			all_ws[sid].push(ws);
		});

		return token;
}

async function updateUserServers(username, token, sid, ws) {
	  let payload = await fetch(
			consts.am_i_in_server_api,
			{
				method: 'POST',
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify({
					'username': username,
					'sid': sid,
					'token': token
				})
			}
		);
		if(!payload.ok) {
			console.log(payload);
			return;
		}

		if(payload.body.localeCompare("Yes you are part of the server.") == 0) {
			if(!Object.keys(all_ws).includes(sid)) {
				all_ws[sid]= new Array();
			}
			if(!all_ws[sid].includes(ws)) {
				all_ws.push(ws);
			}
		}
  
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
    idleTimeout: 60 * 5,
    async message(ws, message) {
      console.log('[LOG] [message]');
      
      if(!connected_ws.includes(ws) && secrets.includes(message)) {
        connected_ws.push(ws);
        ws.send("CONNECTED");
        return;
      } 

      if(message.startsWith("TOKEN:")) {
        let token = await includeAllServers(ws.data.username, message.split(":")[1], ws);

        ws.send(token);
        return;
      }

      if(message == "PING") {
        ws.send("PONG");
        return;
      }

      if(message.startsWith("UPDATE:")) {
      	let m_split = message.split(':');
      	let token = m_split[0];
      	let sid = m_split[1];

				await updateUserServers(ws.data.username, token, sid, ws); 
      	return;
      }

      let key = message.split(':')[0];
        if(all_ws[key].includes(ws)) {
          all_ws[key].forEach((kws) => {
            kws.send(message);
          });
        }

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
