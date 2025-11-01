const consts = require('./consts.ts');

async function addSecretToScylla(username) {
    console.log("[addSecretToScylla]: " + consts.spell_cast_api + " " + username);
    let payload = await fetch(
    consts.spell_cast_api,
    {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        'username': username
      })
    }
  );

  if(!payload.ok) {
    console.log("[FAILED FETCH] [addSecretToScylla] " + username)
    return 
  }
  console.log(payload);
  
  let secret = await payload.json();
  return [ secret['key'], secret['spell'] ];
}

async function includeAllServers(username, token, all_ws) {
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
    if(!all_ws.has(sid)) {
      all_ws.set(sid, []);
    }
    all_ws.get(sid).push(sid);
  }

  return token;
}

module.exports = {
  addSecretToScylla,
  includeAllServers
};
 
