import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: 'd8ueP5KTZusXInsSIsOp4K268srtbuBa',
    socket: {
        host: 'redis-11496.crce179.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 11496
    }
});
async function code() {
    
    
    client.on('error', err => console.log('Redis Client Error', err));
    
    await client.connect();
    for (let index = 0; index < 20; index++) {
        
        
        await client.set("java", index);
    }
}
code()
