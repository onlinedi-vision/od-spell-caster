const spell_cast_api = 'https://onlinedi.vision/api/spell/cast';

let spell_key = '';
let all_ws = {'1313': []};
let connected_ws = [];
let secrets = [];

async function addSecretToScylla(username) {
  let payload = await fetch(
    spell_cast_api,
    {
      method: 'POST',
      body: {
        'username': username
      }
    }
  );

  if(!payload.ok) {
    console.log("[FAILED FETCH] [addSecretToScylla]" + username)
    return 
  }
  
  let secret = JSON.parse(await payload.json());
  return [ secret['key'], secret['spell'] ];
}

async function includeAllServers(username) {}

async function registerSpellKey() {}

Bun.serve({
  
  fetch(req, server) {
    server.upgrade(req,{
      data: {
        username: new URL(req.url).searchParams.get('username')
      } 
    })); 
    return new Response("Upgrade failed", { status: 500 });
  },
  
  websocket: {
    data,
    async message(ws, message) {
      console.log(all_ws);

      if(!connected_ws.includes(ws) && secrets.includes(message)) {
        connected_ws.push(ws);
        console.log(connected_ws);

        let payload = await includeAllServers(data['username']);
        if(payload.ok) {
          ws.send("CONNECTED");
          return
        } else {
          ws.send("ERROR");
        }
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
      let res = await addSecretToScylla(data['username']);
      let [ key, spell ] = res;
      secrets.push(spell);
      ws.send(key);
    },
    
    async close(ws, code, message) {}, 

    async drain(ws) {}, 

  },
});
