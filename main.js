let all_ws = {'1313': []};
let connected_ws = [];
let secrets = [];

async function addSecretToScylla() {
  return [ 'key', 'secret' ];
}

Bun.serve({
  fetch(req, server) {
    if (server.upgrade(req)) {
      return; 
    }
    return new Response("Upgrade failed", { status: 500 });
  }, 
  websocket: {
    message(ws, message) {
      console.log(all_ws);
      if(!connected_ws.includes(ws) && secrets.includes(message)) {
        connected_ws.push(ws);
        console.log(connected_ws);
      }
      Object.keys(all_ws).forEach((key) => {
        if(all_ws[key].includes(ws)) {
          all_ws[key].forEach((kws) => {
            kws.send(message);
          });
        }
      }) 
    },
    open(ws) {
      addSecretToScylla()
      .then((res) => {
        let [ key, secret ] = res;
        secrets.push(secret);
        ws.send(key);
      });
    }, 
    close(ws, code, message) {}, 
    drain(ws) {}, 
  },
});
