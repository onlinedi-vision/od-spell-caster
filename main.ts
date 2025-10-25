const consts = require('./consts.ts');
const util = require('./util.ts');

let spell_key = '';
let all_ws = {'1313': []};
let connected_ws = [];
let secrets = [];

console.log("Starting Websockets Server on port: " + consts.port);

Bun.serve({
  port: consts.port,
  
  fetch(req, server) {

    console.log('[LOG] [Bun.serve] Upgrading ' + req);
    
    server.upgrade(req,{
      data: {
        username: new URL(req.url).searchParams.get('username')
      } 
    }); 
    return new Response("Upgrade failed", { status: 500 });
  },
  
  websocket: {
    async message(ws, message) {
      console.log('[LOG] [message]');
      
      if(!connected_ws.includes(ws) && secrets.includes(message)) {
        connected_ws.push(ws);
        if(payload.ok) {
          ws.send("CONNECTED");
        } else {
          ws.send("ERROR");
        }
        return;
      } 

      if(message.startsWith("TOKEN:")) {
        let token = await util.includeAllServers(data.username, message.split(":")[1]);

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
      let res = await util.addSecretToScylla(data['username']);
      let [ key, spell ] = res;
      secrets.push(spell);
      ws.send(key);
    },
    
    async close(ws, code, message) {}, 

    async drain(ws) {}, 

  },
});
