const magicproxy = require('magic-reverse-proxy');
const Waf = require('mini-waf/wafbase');
const rules = require('mini-waf/wafrules');

function is_debugmode() {
  return process.argv[2] == '--test';
}

const HTTP_PORT = (!is_debugmode() ? 80 : 55100);
const HTTPS_PORT = (!is_debugmode() ? 443 : 55101);

const proxy_cfg = {
  enable_hsts: (!is_debugmode() ? true : false),
  allow_unknown_host: false,
  allow_websockets: false,
  http: {
    port: HTTP_PORT,
    enabled: true,
    start_callback: function () {
      console.log(`Started HTTP service in port 80.`);
    },
    middlewares: [
      Waf.WafMiddleware(rules.DefaultSettings),
      Waf.WafSecurityPolicy()
    ]
  },
  https: {
    port: HTTPS_PORT,
    enabled: (!is_debugmode() ? true : false),
    start_callback: function () {
      console.log(`Started HTTPS service in port ${HTTPS_PORT}.`);
    },
    middlewares: [
      Waf.WafMiddleware(rules.DefaultSettings),
      Waf.WafSecurityPolicy()
    ],
    sslkey: '/etc/letsencrypt/live/muryllo.com.br/privkey.pem',
    sslcert: '/etc/letsencrypt/live/muryllo.com.br/cert.pem',
    sslchain: '/etc/letsencrypt/live/muryllo.com.br/chain.pem'
  },
  proxies: [
    {
      domain: 'api-covid.fun',
      timeout: 10000,
      round: 0,
      destination: ['http://192.168.0.100:14400/']
    },
    {
      domain: '*.api-covid.fun',
      timeout: 10000,
      round: 0,
      destination: ['http://192.168.0.100:14400/']
    },
    {
      domain: 'www.muryllo.com.br',
      timeout: 10000,
      round: 0,
      destination: ['http://192.168.0.100:7070/'],
      sockDestination: ['ws://192.168.0.100:14500']
    },
    {
      domain: 'muryllo.com.br',
      timeout: 10000,
      round: 0,
      destination: ['http://192.168.0.100:7070/'],
      sockDestination: ['ws://192.168.0.100:14500']
    },
    {
      domain: 'api-upe.fun',
      timeout: 10000,
      round: 0,
      destination: ['http://192.168.0.100:14500/']
    },
    {
      domain: '*.api-upe.fun',
      timeout: 10000,
      round: 0,
      destination: ['http://192.168.0.100:14500/']
    },
    {
      domain: 'consultas.amstt.com.br',
      timeout: 10000,
      round: 0,
      destination: ['http://200.196.181.164:8082/']
    },
    {
      domain: 'painel.amstt.com.br',
      timeout: 10000,
      round: 0,
      destination: ['http://200.196.181.164:8081/']
    },
    {
      domain: 'api.amstt.com.br',
      timeout: 10000,
      round: 0,
      destination: ['http://200.196.181.164:8080/']
    },
    {
      domain: '*.nav.seg.br',
      timeout: 10000,
      round: 0,
      destination: ['http://192.168.0.100:14200/']
    }
  ],
  default_proxy: {
    timeout: 10000,
    round: 0,
    destination: ['http://192.168.0.100:7070/'],
    sockDestination: ['ws://192.168.0.100:14500']
  }
};

const proxy = magicproxy(proxy_cfg);

proxy.bind();

if (is_debugmode()) {
  process.exit(0);
}
