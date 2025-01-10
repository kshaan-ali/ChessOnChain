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
    
    while(true){
        const result = await client.get('java');
        console.log(result)  // >>> bar
    }
        
}
code()
