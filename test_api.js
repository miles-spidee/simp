const axios = require('axios');

async function test() {
    try {
        const res = await axios.get('http://127.0.0.1:8000/api/v1/student/', {
            headers: { 'Authorization': 'Bearer ' } // Wait, I don't have a token.
        });
        console.log(res.data);
    } catch(e) { console.log(e.response?.status); }
}
test();
