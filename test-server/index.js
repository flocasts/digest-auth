const http = require('http');
const auth = require('http-auth');

const PORT = 1337;

const init = () => {
    const digest = auth.digest({
        realm: 'users',
        file: __dirname + '/users.htdigest',
    });

    http.createServer(
        digest.check((req, res) => {
            console.log('Digest-Auth header: ', req.headers.authorization);
            console.log('Response status code: ', res.statusCode);
            return res.end(`Welcome to private area - ${req.user}!`);
        }),
    ).listen(PORT, () => {
        console.log(`listening on port: ${PORT}`);
    });
};

init();
