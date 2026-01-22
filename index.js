#!/usr/bin/env node

const username = process.argv[2];
const url = `https://api.github.com/users/${username}/events`;
if (!username){
    console.log("Usage : node test.js <username>");
    process.exit(1);
}
const options = {
    headers:{
        "User-Agent": "github-cli"
    }

};

function formatEvent(event){
    const repo = event.repo?.name || "unknown repo";
    switch(event.type){
        case "PushEvent":{
            //const count = event.payload?.size ?? 0;
            return `Pushed a commit to ${repo}`;
        }
        case "IssuesEvent":{
            const action = event.payload?.action || "did something to";
            return `${action} an issue in ${repo}`;
        }
        case "WatchEvent" :{
            return `Starred ${repo}`;
        }
        case "PushEvent" :{
            const commit = event.payload?.size ?? 0;
            return `Pushed ${commit} to ${repo}`;
        }
        case "ForkEvent" :{
            return `Forked ${repo}`; 
        }
        case "PullRequestEvent":{
            return `${event.payload?.action} a pullrequest to ${repo}`;
        }
        case "CreateEvent":{
            return `Created ${event.payload.ref_type} in ${repo} `;
        }
        case "PublicEvent":{
            return `Made ${repo} public`;
        }
    }
}
async function fetchdata() {
    try{
        const res = await fetch(url,options);
        const data = await res.json();
        if(res.status == 404) {
            console.log("User Not Found: ", username);
            return;
        }
        
        if(!res.ok) {
            console.log(`Api error : ${res.status}`);
            return;
        }
        for(const event of data){
            //console.log(JSON.stringify(event, null, 2));

            console.log(formatEvent(event));
        }
    }catch(err){
        console.log(err);
    }
};
fetchdata();