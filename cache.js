const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.join(__dirname, ".cache");
const DEFAULT_TTL_MS = 60 * 1000;

function writeCacheFile(username, data){
    if(!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);
    const filepath = getCacheFile(username);
    const payload = {savedAt: Date.now(), data};
    fs.writeFileSync(filepath,JSON.stringify(payload,null,2),"utf8");
}

function getCacheFile(username){
    return path.join(CACHE_DIR, `${username}.json`);
}

function readCache(username){
    try{
        const cacheFile = getCacheFile(username);
        if(!fs.existsSync(cacheFile)){
            return null;
        }
        const raw = fs.readFileSync(cacheFile, "utf-8");
        const cached = JSON.parse(raw);
        
        if(!cached.savedAt || !cached.data) return null;
        
        const age = Date.now() - cached.savedAt;
        if(age > DEFAULT_TTL_MS) return null;
        console.log(`Cache age: ${age/1000} s`);
        return cached.data;
    }catch(err){
        console.error("Error reading cache:", err);
        return null;
    }
}

function clearCache(){
    if(fs.existsSync(CACHE_DIR)){
        fs.rmSync(CACHE_DIR,{recursive: true, force: true});
        return true;
    }
    return false;
}

module.exports = {
    readCache, writeCacheFile,getCacheFile, clearCache,
};