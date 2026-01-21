/**
 * If you want to learn about clash verge config example, please visit:
 * https://github.com/MetaCubeX/mihomo/blob/Meta/docs/config.yaml
 */

/**
 * Custom DNS configuration
 */
function customDns() {
  // Default nameservers, used to resolve other dns servers
  const defaultNameservers = [
    '223.5.5.5', // AliDNS
    '119.29.29.29', // DNSPod
    '114.114.114.114', // 114DNS
    '1.1.1.1', // Cloudflare DNS
    '8.8.8.8', // Google DNS
  ]
  // Nameservers
  const nameservers = [
    'https://dns.alidns.com/dns-query', // AliDNS DoH
    'https://doh.pub/dns-query', // DNSPod DoH
    'https://dns.cloudflare.com/dns-query', // Cloudflare DoH
    'https://dns.google/dns-query', // Google DoH
    'tls://dns.alidns.com:853', // AliDNS DoT
    'tls://dot.pub:853', // DNSPod DoT
    'tls://dns.cloudflare.com:853', // Cloudflare DoT
    'tls://dns.google:853', // Google DoT
  ]
  // DNS configuration
  const dns = {
    'enable': true,
    'cache-algorithm': 'arc',
    'ipv6': true,
    // Response fake ip for dns queries
    'enhanced-mode': 'fake-ip',
    // Range of responsed fake ips
    'fake-ip-range': '198.18.0.1/16',
    // Domains that should not use fake ip
    'fake-ip-filter': [
      // Local network
      '+.lan',
      '+.local',
      '+.internal',
      // Microsoft NCSI
      '+.msftconnecttest.com',
      '+.msftncsi.com',
      // QQ quick login check
      'localhost.ptlogin2.qq.com',
      'localhost.sec.qq.com',
      // WeChat quick login check
      'localhost.work.weixin.qq.com',
      // NTP
      '+.ntp.org',
      '+.ntp.org.cn',
      'time.windows.com',
    ],
    // Default nameservers, used to resolve other dns servers
    'default-nameserver': defaultNameservers,
    // Nameservers
    'nameserver': nameservers,
    // We can also use `nameserver-policy` and `fallback` to customize dns servers
  }
  return {
    dns,
  }
}

/**
 * Custom proxy groups
 */
function customProxyGroups(config) {
  const reg = /剩余|套餐|导航/
  const proxies = (config.proxies ?? []).filter(p => !reg.test(p.name))
  const groupBaseOption = {
    'interval': 300,
    'timeout': 3000,
    'url': 'https://www.google.com/generate_204',
    'lazy': true,
    'max-failed-times': 3,
    'hidden': false,
  }
  const proxyGroups = [
    {
      ...groupBaseOption,
      'name': '节点选择',
      'type': 'select',
      'proxies': ['延迟选优', '故障转移', '负载均衡(散列)', '负载均衡(轮询)'],
      'include-all': true,
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg',
    },
    {
      ...groupBaseOption,
      'name': '延迟选优',
      'type': 'url-test',
      'tolerance': 100,
      'include-all': true,
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speed.svg',
    },
    {
      ...groupBaseOption,
      'name': '故障转移',
      'type': 'fallback',
      'include-all': true,
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/ambulance.svg',
    },
    {
      ...groupBaseOption,
      'name': '负载均衡(散列)',
      'type': 'load-balance',
      'strategy': 'consistent-hashing',
      'include-all': true,
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/merry_go.svg',
    },
    {
      ...groupBaseOption,
      'name': '负载均衡(轮询)',
      'type': 'load-balance',
      'strategy': 'round-robin',
      'include-all': true,
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/balance.svg',
    },
    {
      ...groupBaseOption,
      'name': '谷歌服务',
      'type': 'select',
      'proxies': ['节点选择', '延迟选优', '故障转移', '负载均衡(散列)', '负载均衡(轮询)', '全局直连'],
      'include-all': true,
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/google.svg',
    },
    {
      ...groupBaseOption,
      'name': '国外媒体',
      'type': 'select',
      'proxies': ['节点选择', '延迟选优', '故障转移', '负载均衡(散列)', '负载均衡(轮询)', '全局直连'],
      'include-all': true,
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/youtube.svg',
    },
    {
      ...groupBaseOption,
      'name': '电报消息',
      'type': 'select',
      'proxies': ['节点选择', '延迟选优', '故障转移', '负载均衡(散列)', '负载均衡(轮询)', '全局直连'],
      'include-all': true,
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/telegram.svg',
    },
    {
      ...groupBaseOption,
      'url': 'https://chatgpt.com',
      'expected-status': '200',
      'name': 'ChatGPT',
      'type': 'select',
      'include-all': true,
      'filter': 'AD|🇦🇩|AE|🇦🇪|AF|🇦🇫|AG|🇦🇬|AL|🇦🇱|AM|🇦🇲|AO|🇦🇴|AR|🇦🇷|AT|🇦🇹|AU|🇦🇺|AZ|🇦🇿|BA|🇧🇦|BB|🇧🇧|BD|🇧🇩|BE|🇧🇪|BF|🇧🇫|BG|🇧🇬|BH|🇧🇭|BI|🇧🇮|BJ|🇧🇯|BN|🇧🇳|BO|🇧🇴|BR|🇧🇷|BS|🇧🇸|BT|🇧🇹|BW|🇧🇼|BZ|🇧🇿|CA|🇨🇦|CD|🇨🇩|CF|🇨🇫|CG|🇨🇬|CH|🇨🇭|CI|🇨🇮|CL|🇨🇱|CM|🇨🇲|CO|🇨🇴|CR|🇨🇷|CV|🇨🇻|CY|🇨🇾|CZ|🇨🇿|DE|🇩🇪|DJ|🇩🇯|DK|🇩🇰|DM|🇩🇲|DO|🇩🇴|DZ|🇩🇿|EC|🇪🇨|EE|🇪🇪|EG|🇪🇬|ER|🇪🇷|ES|🇪🇸|ET|🇪🇹|FI|🇫🇮|FJ|🇫🇯|FM|🇫🇲|FR|🇫🇷|GA|🇬🇦|GB|🇬🇧|GD|🇬🇩|GE|🇬🇪|GH|🇬🇭|GM|🇬🇲|GN|🇬🇳|GQ|🇬🇶|GR|🇬🇷|GT|🇬🇹|GW|🇬🇼|GY|🇬🇾|HN|🇭🇳|HR|🇭🇷|HT|🇭🇹|HU|🇭🇺|ID|🇮🇩|IE|🇮🇪|IL|🇮🇱|IN|🇮🇳|IQ|🇮🇶|IS|🇮🇸|IT|🇮🇹|JM|🇯🇲|JO|🇯🇴|JP|🇯🇵|KE|🇰🇪|KG|🇰🇬|KH|🇰🇭|KI|🇰🇮|KM|🇰🇲|KN|🇰🇳|KR|🇰🇷|KW|🇰🇼|KZ|🇰🇿|LA|🇱🇦|LB|🇱🇧|LC|🇱🇨|LI|🇱🇮|LK|🇱🇰|LR|🇱🇷|LS|🇱🇸|LT|🇱🇹|LU|🇱🇺|LV|🇱🇻|LY|🇱🇾|MA|🇲🇦|MC|🇲🇨|MD|🇲🇩|ME|🇲🇪|MG|🇲🇬|MH|🇲🇭|MK|🇲🇰|ML|🇲🇱|MM|🇲🇲|MN|🇲🇳|MR|🇲🇷|MT|🇲🇹|MU|🇲🇺|MV|🇲🇻|MW|🇲🇼|MX|🇲🇽|MY|🇲🇾|MZ|🇲🇿|NA|🇳🇦|NE|🇳🇪|NG|🇳🇬|NI|🇳🇮|NL|🇳🇱|NO|🇳🇴|NP|🇳🇵|NR|🇳🇷|NZ|🇳🇿|OM|🇴🇲|PA|🇵🇦|PE|🇵🇪|PG|🇵🇬|PH|🇵🇭|PK|🇵🇰|PL|🇵🇱|PS|🇵🇸|PT|🇵🇹|PW|🇵🇼|PY|🇵🇾|QA|🇶🇦|RO|🇷🇴|RS|🇷🇸|RW|🇷🇼|SA|🇸🇦|SB|🇸🇧|SC|🇸🇨|SD|🇸🇩|SE|🇸🇪|SG|🇸🇬|SI|🇸🇮|SK|🇸🇰|SL|🇸🇱|SM|🇸🇲|SN|🇸🇳|SO|🇸🇴|SR|🇸🇷|SS|🇸🇸|ST|🇸🇹|SV|🇸🇻|SZ|🇸🇿|TD|🇹🇩|TG|🇹🇬|TH|🇹🇭|TJ|🇹🇯|TL|🇹🇱|TM|🇹🇲|TN|🇹🇳|TO|🇹🇴|TR|🇹🇷|TT|🇹🇹|TV|🇹🇻|TW|🇹🇼|TZ|🇹🇿|UA|🇺🇦|UG|🇺🇬|US|🇺🇸|UY|🇺🇾|UZ|🇺🇿|VA|🇻🇦|VC|🇻🇨|VN|🇻🇳|VU|🇻🇺|WS|🇼🇸|YE|🇾🇪|ZA|🇿🇦|ZM|🇿🇲|ZW|🇿🇼',
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/chatgpt.svg',
    },
    {
      ...groupBaseOption,
      'name': '微软服务',
      'type': 'select',
      'proxies': ['全局直连', '节点选择', '延迟选优', '故障转移', '负载均衡(散列)', '负载均衡(轮询)'],
      'include-all': true,
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/microsoft.svg',
    },
    {
      ...groupBaseOption,
      'name': '苹果服务',
      'type': 'select',
      'proxies': ['节点选择', '延迟选优', '故障转移', '负载均衡(散列)', '负载均衡(轮询)', '全局直连'],
      'include-all': true,
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/apple.svg',
    },
    {
      ...groupBaseOption,
      'name': '全局直连',
      'type': 'select',
      'proxies': ['DIRECT', '节点选择', '延迟选优', '故障转移', '负载均衡(散列)', '负载均衡(轮询)'],
      'include-all': true,
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/link.svg',
    },
    {
      ...groupBaseOption,
      name: '全局拦截',
      type: 'select',
      proxies: ['REJECT', 'DIRECT'],
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/block.svg',
    },
    {
      ...groupBaseOption,
      'name': '漏网之鱼',
      'type': 'select',
      'proxies': ['节点选择', '延迟选优', '故障转移', '负载均衡(散列)', '负载均衡(轮询)', '全局直连'],
      'include-all': true,
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg',
    },
  ]
  return {
    proxies,
    proxyGroups,
  }
}

/**
 * Custom rule providers & rules
 */
function customRules() {
  const ruleProviderCommon = {
    type: 'http',
    format: 'yaml',
    interval: 86400,
  }
  const ruleProviders = {
    'reject': {
      ...ruleProviderCommon,
      behavior: 'domain',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt',
      path: './ruleset/loyalsoldier/reject.yaml',
    },
    'icloud': {
      ...ruleProviderCommon,
      behavior: 'domain',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt',
      path: './ruleset/loyalsoldier/icloud.yaml',
    },
    'apple': {
      ...ruleProviderCommon,
      behavior: 'domain',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt',
      path: './ruleset/loyalsoldier/apple.yaml',
    },
    'google': {
      ...ruleProviderCommon,
      behavior: 'domain',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt',
      path: './ruleset/loyalsoldier/google.yaml',
    },
    'proxy': {
      ...ruleProviderCommon,
      behavior: 'domain',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt',
      path: './ruleset/loyalsoldier/proxy.yaml',
    },
    'direct': {
      ...ruleProviderCommon,
      behavior: 'domain',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt',
      path: './ruleset/loyalsoldier/direct.yaml',
    },
    'private': {
      ...ruleProviderCommon,
      behavior: 'domain',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt',
      path: './ruleset/loyalsoldier/private.yaml',
    },
    'gfw': {
      ...ruleProviderCommon,
      behavior: 'domain',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt',
      path: './ruleset/loyalsoldier/gfw.yaml',
    },
    'tld-not-cn': {
      ...ruleProviderCommon,
      behavior: 'domain',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt',
      path: './ruleset/loyalsoldier/tld-not-cn.yaml',
    },
    'telegramcidr': {
      ...ruleProviderCommon,
      behavior: 'ipcidr',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt',
      path: './ruleset/loyalsoldier/telegramcidr.yaml',
    },
    'cncidr': {
      ...ruleProviderCommon,
      behavior: 'ipcidr',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt',
      path: './ruleset/loyalsoldier/cncidr.yaml',
    },
    'lancidr': {
      ...ruleProviderCommon,
      behavior: 'ipcidr',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt',
      path: './ruleset/loyalsoldier/lancidr.yaml',
    },
    'applications': {
      ...ruleProviderCommon,
      behavior: 'classical',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt',
      path: './ruleset/loyalsoldier/applications.yaml',
    },
    'openai': {
      ...ruleProviderCommon,
      behavior: 'classical',
      url: 'https://fastly.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/OpenAI/OpenAI.yaml',
      path: './ruleset/blackmatrix7/openai.yaml',
    },
  }
  const rules = [
    // Custom rules
    'PROCESS-NAME,ForzaHorizon4.exe,全局直连',
    // blackmatrix7 rule set
    'RULE-SET,openai,ChatGPT',
    // Loyalsoldier rule set
    'RULE-SET,applications,全局直连',
    'RULE-SET,private,全局直连',
    'RULE-SET,reject,全局拦截',
    'RULE-SET,icloud,微软服务',
    'RULE-SET,apple,苹果服务',
    'RULE-SET,google,谷歌服务',
    'RULE-SET,proxy,节点选择',
    'RULE-SET,gfw,节点选择',
    'RULE-SET,tld-not-cn,节点选择',
    'RULE-SET,direct,全局直连',
    'RULE-SET,lancidr,全局直连,no-resolve',
    'RULE-SET,cncidr,全局直连,no-resolve',
    'RULE-SET,telegramcidr,电报消息,no-resolve',
    // Other rules
    'GEOIP,LAN,全局直连,no-resolve',
    'GEOIP,CN,全局直连,no-resolve',
    'MATCH,漏网之鱼',
  ]
  return {
    ruleProviders,
    rules,
  }
}

// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
function main(config) {
  // -------- Custom Proxies & Proxy Groups --------
  const { proxies, proxyGroups } = customProxyGroups(config)
  config.proxies = proxies
  config['proxy-groups'] = proxyGroups

  // -------- Custom dns --------
  const { dns } = customDns()
  config.dns = dns

  // -------- Rule Providers & Rules --------
  const { ruleProviders, rules } = customRules()
  config['rule-providers'] = ruleProviders
  config.rules = rules

  return config
}
