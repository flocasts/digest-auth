const http = require('http');
const auth = require('http-auth');

const PORT = 1337;

let count = 0;
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

    const badAlgo = auth.digest({
        realm: 'users',
        file: __dirname + '/users.htdigest',
        algorithm: 'bad_algo',
    });

    const cb = (req, res) => {
        return res.end(`Welcome to private area - ${req.user}!`);
    };

    const handle408 = (req, res) => {
        count++;
        let status = 408;
        let msg = 'Request Timeout';
        if (count === 10) {
            status = 200;
            msg = `count=${count}`;
        }
        res.statusCode = status;
        res.write(msg);
        res.end();
    };

    const handle504 = (req, res) => {
        res.writeHead(504, 'Gateway Timeout');
        res.end();
    };

    const handle404 = (req, res) => {
        count++;
        res.writeHead(404, { count });
        res.end();
    };

    const requestListener = (req, res) => {
        let func;
        switch (req.url) {
            case '/md5-sess':
                func = md5Sess.check(cb);
                break;
            case '/bad-algo':
                func = badAlgo.check(cb);
                break;
            case '/four-zero-eight':
                func = handle408;
                break;
            case '/four-zero-four':
                func = handle404;
                break;
            case '/five-zero-four':
                func = handle504;
                break;
            case '/get-count':
                func = (req, res) => {
                    res.write(`${count}`);
                    res.end();
                };
                break;
            case '/reset-count':
                func = (req, res) => {
                    count = 0;
                    res.write(`${count}`);
                    res.end();
                };
                break;
            case '/set-count':
                func = (req, res) => {
                    count = 33;
                    res.end();
                };
                break;
            case '/md5':
            default:
                func = md5.check(cb);
                break;
        }
        func(req, res);
    };

    http.createServer(requestListener).listen(PORT, () => {
        console.log(`listening on port: ${PORT}`);
    });
};

init();

// helper for cleaner log output
function digestToJSON(header) {
    const withoutDigestKeyword = header.replace('Digest ', '');
    let authDetailsString = withoutDigestKeyword
        .replace(/{|}/g, '')
        .split(',')
        .map((val) => {
            const [key, value] = val.split('=');
            return `"${key.trim()}":${value.includes('"') ? value : `"${value}"`}`;
        })
        .join(',');
    authDetailsString = `{${authDetailsString}}`;
    return JSON.parse(authDetailsString);
}
