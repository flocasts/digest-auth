const http = require('http');
const auth = require('http-auth');

const PORT = 1337;

const init = () => {
    const md5 = auth.digest({
        realm: 'users',
        file: __dirname + '/users.htdigest',
        algorithm: 'MD5',
    });
    const md5Sess = auth.digest({
        realm: 'users',
        file: __dirname + '/users.htdigest',
        algorithm: 'MD5-sess',
    });

    const cb = (req, res) => {
        console.log('Digest-Auth header: ', req.headers.authorization);
        console.log('Response status code: ', res.statusCode);
        return res.end(`Welcome to private area - ${req.user}!`);
    };

    const requestListener = (req, res) => {
        let func;
        switch (req.url) {
            case '/md5-sess':
                func = md5Sess.check(cb);
            case '/md5':
            default:
                func = md5.check(cb);
        }
        func(req, res);
    };

    http.createServer(requestListener).listen(PORT, () => {
        console.log(`listening on port: ${PORT}`);
    });
};

init();
