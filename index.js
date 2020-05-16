
const magicproxy = require('magic-reverse-proxy');
const Waf = require('mini-waf/wafbase');
const rules = require('mini-waf/wafrules');

const proxy_cfg = {
    enable_hsts: true,
    allow_unknown_host: true,
    http: {
        port: 80,
        enabled: true,
        start_callback: function () {
            console.log('Started HTTP service in port 80.');
        },
        middlewares: [
            Waf.WafMiddleware(rules.DefaultSettings)
        ]
    },
    https: {
        port: 443,
        enabled: true,
        start_callback: function () { 
            console.log('Started HTTPS service in port 443.');
        },
        middlewares: [
            Waf.WafMiddleware(rules.DefaultSettings)
        ],
        sslkey: '',
        sslcert: '',
        sslchain: ''
    },
    proxies: [
        {
            domain: 'api-covid.fun',
            timeout: 10000,
            round: 0,
            destination: ['http://192.168.0.107:14400/']
        },
        {
            domain: '*.api-covid.fun',
            timeout: 10000,
            round: 0,
            destination: ['http://192.168.0.107:14400/']
        },
        {
            domain: '*.muryllo.com.br',
            timeout: 10000,
            round: 0,
            destination: ['http://192.168.0.107:7070/']
        },
        {
            domain: 'muryllo.com.br',
            timeout: 10000,
            round: 0,
            destination: ['http://192.168.0.107:7070/']
        },
    ],
    default_proxy: {
        destination: ['http://192.168.0.107:7070'],
        timeout: 10000,
        round: 0
    }
};

const proxy = magicproxy(proxy_cfg);

proxy.bind();