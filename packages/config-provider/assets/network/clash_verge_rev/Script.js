// If you want to learn about clash verge config example, please visit:
// https://github.com/MetaCubeX/mihomo/blob/Meta/docs/config.yaml

// eslint-disable-next-line unused-imports/no-unused-vars
function main(config) {
  const { proxies, proxyGroups } = customProxiesAndGroups(config)
  config.proxies = proxies
  config['proxy-groups'] = proxyGroups

  const { dns } = customDns()
  config.dns = dns

  const { ruleProviders, rules } = customProvidersAndRules()
  config['rule-providers'] = ruleProviders
  config.rules = rules

  return config
}

const NO_STANDARD_PROXY_REG = /官网|说明|提示|剩余|套餐|导航/
/**
 * Custom proxy groups
 *
 * @param {object} config Original config object
 * @returns {object} Custom proxy groups
 */
function customProxiesAndGroups(config) {
  // Proxies
  const proxies = (config.proxies ?? []).filter(p => !NO_STANDARD_PROXY_REG.test(p.name))

  // Group options
  const BASIC_GROUP_OPTIONS = {
    'interval': 300,
    'timeout': 3000,
    'url': 'https://www.google.com/generate_204',
    'lazy': true,
    'max-failed-times': 3,
    'hidden': false,
  }
  const BASIC_GROUP_OPTIONS_URL_TEST = {
    ...BASIC_GROUP_OPTIONS,
    'type': 'url-test',
    'tolerance': 50,
    'include-all': true,
  }
  const BASIC_GROUP_OPTIONS_FALLBACK = {
    ...BASIC_GROUP_OPTIONS,
    'type': 'fallback',
    'include-all': true,
  }
  const BASIC_GROUP_OPTIONS_LOAD_BALANCE_HASHING = {
    ...BASIC_GROUP_OPTIONS,
    'type': 'load-balance',
    'strategy': 'consistent-hashing',
    'include-all': true,
  }
  const BASIC_GROUP_OPTIONS_LOAD_BALANCE_ROBIN = {
    ...BASIC_GROUP_OPTIONS,
    'type': 'load-balance',
    'strategy': 'round-robin',
    'include-all': true,
  }

  // Proxy groups
  const COUNTRY_REGION_CONFIG = [
    { name: '🇹🇼 台湾', filter: 'TW|🇹🇼' },
    { name: '🇭🇰 香港', filter: 'HK|🇭🇰' },
    { name: '🇸🇬 新加坡', filter: 'SG|🇸🇬' },
    { name: '🇯🇵 日本', filter: 'JP|🇯🇵' },
    { name: '🇺🇸 美国', filter: 'US|🇺🇸' },
  ]
  // TODO(Lumirelle): Filter proxies by country/region and create groups for them, currently we just create empty groups with different names
  const BASIC_GROUPS = COUNTRY_REGION_CONFIG.flatMap(({ name }) => [{
    ...BASIC_GROUP_OPTIONS_URL_TEST,
    name: `${name}延迟选优`,
  }, {
    ...BASIC_GROUP_OPTIONS_FALLBACK,
    name: `${name}故障转移`,
  }, {
    ...BASIC_GROUP_OPTIONS_LOAD_BALANCE_HASHING,
    name: `${name}负载均衡(散列)`,
  }, {
    ...BASIC_GROUP_OPTIONS_LOAD_BALANCE_ROBIN,
    name: `${name}负载均衡(轮询)`,
  }])
  const BASIC_GROUP_NAMES = BASIC_GROUPS.map(g => g.name)

  const proxyGroups = [
    // Groups for different rulesets
    {
      ...BASIC_GROUP_OPTIONS,
      'name': '节点选择',
      'type': 'select',
      'proxies': ['延迟选优', '故障转移', '负载均衡(散列)', '负载均衡(轮询)', ...BASIC_GROUP_NAMES],
      'include-all': true,
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg',
    },
    {
      ...BASIC_GROUP_OPTIONS,
      'name': '微软服务',
      'type': 'select',
      'proxies': ['全局直连', '节点选择', '延迟选优', '故障转移', '负载均衡(散列)', '负载均衡(轮询)', ...BASIC_GROUP_NAMES],
      'include-all': true,
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/microsoft.svg',
    },
    {
      ...BASIC_GROUP_OPTIONS,
      'name': '谷歌服务',
      'type': 'select',
      'proxies': ['节点选择', '延迟选优', '故障转移', '负载均衡(散列)', '负载均衡(轮询)', '全局直连', ...BASIC_GROUP_NAMES],
      'include-all': true,
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/google.svg',
    },
    {
      ...BASIC_GROUP_OPTIONS,
      'name': '苹果服务',
      'type': 'select',
      'proxies': ['节点选择', '延迟选优', '故障转移', '负载均衡(散列)', '负载均衡(轮询)', '全局直连', ...BASIC_GROUP_NAMES],
      'include-all': true,
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/apple.svg',
    },
    {
      ...BASIC_GROUP_OPTIONS,
      'name': '国外媒体',
      'type': 'select',
      'proxies': ['节点选择', '延迟选优', '故障转移', '负载均衡(散列)', '负载均衡(轮询)', '全局直连', ...BASIC_GROUP_NAMES],
      'include-all': true,
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/youtube.svg',
    },
    {
      ...BASIC_GROUP_OPTIONS,
      'name': '电报消息',
      'type': 'select',
      'proxies': ['节点选择', '延迟选优', '故障转移', '负载均衡(散列)', '负载均衡(轮询)', '全局直连', ...BASIC_GROUP_NAMES],
      'include-all': true,
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/telegram.svg',
    },
    {
      ...BASIC_GROUP_OPTIONS,
      'url': 'https://chatgpt.com',
      'expected-status': '200',
      'name': 'ChatGPT',
      'type': 'select',
      'include-all': true,
      'filter':
        'AD|🇦🇩|AE|🇦🇪|AF|🇦🇫|AG|🇦🇬|AL|🇦🇱|AM|🇦🇲|AO|🇦🇴|AR|🇦🇷|AT|🇦🇹|AU|🇦🇺|AZ|🇦🇿|BA|🇧🇦|BB|🇧🇧|BD|🇧🇩|BE|🇧🇪|BF|🇧🇫|BG|🇧🇬|BH|🇧🇭|BI|🇧🇮|BJ|🇧🇯|BN|🇧🇳|BO|🇧🇴|BR|🇧🇷|BS|🇧🇸|BT|🇧🇹|BW|🇧🇼|BZ|🇧🇿|CA|🇨🇦|CD|🇨🇩|CF|🇨🇫|CG|🇨🇬|CH|🇨🇭|CI|🇨🇮|CL|🇨🇱|CM|🇨🇲|CO|🇨🇴|CR|🇨🇷|CV|🇨🇻|CY|🇨🇾|CZ|🇨🇿|DE|🇩🇪|DJ|🇩🇯|DK|🇩🇰|DM|🇩🇲|DO|🇩🇴|DZ|🇩🇿|EC|🇪🇨|EE|🇪🇪|EG|🇪🇬|ER|🇪🇷|ES|🇪🇸|ET|🇪🇹|FI|🇫🇮|FJ|🇫🇯|FM|🇫🇲|FR|🇫🇷|GA|🇬🇦|GB|🇬🇧|GD|🇬🇩|GE|🇬🇪|GH|🇬🇭|GM|🇬🇲|GN|🇬🇳|GQ|🇬🇶|GR|🇬🇷|GT|🇬🇹|GW|🇬🇼|GY|🇬🇾|HN|🇭🇳|HR|🇭🇷|HT|🇭🇹|HU|🇭🇺|ID|🇮🇩|IE|🇮🇪|IL|🇮🇱|IN|🇮🇳|IQ|🇮🇶|IS|🇮🇸|IT|🇮🇹|JM|🇯🇲|JO|🇯🇴|JP|🇯🇵|KE|🇰🇪|KG|🇰🇬|KH|🇰🇭|KI|🇰🇮|KM|🇰🇲|KN|🇰🇳|KR|🇰🇷|KW|🇰🇼|KZ|🇰🇿|LA|🇱🇦|LB|🇱🇧|LC|🇱🇨|LI|🇱🇮|LK|🇱🇰|LR|🇱🇷|LS|🇱🇸|LT|🇱🇹|LU|🇱🇺|LV|🇱🇻|LY|🇱🇾|MA|🇲🇦|MC|🇲🇨|MD|🇲🇩|ME|🇲🇪|MG|🇲🇬|MH|🇲🇭|MK|🇲🇰|ML|🇲🇱|MM|🇲🇲|MN|🇲🇳|MR|🇲🇷|MT|🇲🇹|MU|🇲🇺|MV|🇲🇻|MW|🇲🇼|MX|🇲🇽|MY|🇲🇾|MZ|🇲🇿|NA|🇳🇦|NE|🇳🇪|NG|🇳🇬|NI|🇳🇮|NL|🇳🇱|NO|🇳🇴|NP|🇳🇵|NR|🇳🇷|NZ|🇳🇿|OM|🇴🇲|PA|🇵🇦|PE|🇵🇪|PG|🇵🇬|PH|🇵🇭|PK|🇵🇰|PL|🇵🇱|PS|🇵🇸|PT|🇵🇹|PW|🇵🇼|PY|🇵🇾|QA|🇶🇦|RO|🇷🇴|RS|🇷🇸|RW|🇷🇼|SA|🇸🇦|SB|🇸🇧|SC|🇸🇨|SD|🇸🇩|SE|🇸🇪|SG|🇸🇬|SI|🇸🇮|SK|🇸🇰|SL|🇸🇱|SM|🇸🇲|SN|🇸🇳|SO|🇸🇴|SR|🇸🇷|SS|🇸🇸|ST|🇸🇹|SV|🇸🇻|SZ|🇸🇿|TD|🇹🇩|TG|🇹🇬|TH|🇹🇭|TJ|🇹🇯|TL|🇹🇱|TM|🇹🇲|TN|🇹🇳|TO|🇹🇴|TR|🇹🇷|TT|🇹🇹|TV|🇹🇻|TW|🇹🇼|TZ|🇹🇿|UA|🇺🇦|UG|🇺🇬|US|🇺🇸|UY|🇺🇾|UZ|🇺🇿|VA|🇻🇦|VC|🇻🇨|VN|🇻🇳|VU|🇻🇺|WS|🇼🇸|YE|🇾🇪|ZA|🇿🇦|ZM|🇿🇲|ZW|🇿🇼',
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/chatgpt.svg',
    },
    {
      ...BASIC_GROUP_OPTIONS,
      'name': '全局直连',
      'type': 'select',
      'proxies': ['DIRECT', '节点选择', '延迟选优', '故障转移', '负载均衡(散列)', '负载均衡(轮询)', ...BASIC_GROUP_NAMES],
      'include-all': true,
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/link.svg',
    },
    {
      ...BASIC_GROUP_OPTIONS,
      name: '全局拦截',
      type: 'select',
      proxies: ['REJECT', 'DIRECT'],
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/block.svg',
    },
    {
      ...BASIC_GROUP_OPTIONS,
      'name': '漏网之鱼',
      'type': 'select',
      'proxies': ['节点选择', '延迟选优', '故障转移', '负载均衡(散列)', '负载均衡(轮询)', '全局直连', ...BASIC_GROUP_NAMES],
      'include-all': true,
      'icon': 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/fish.svg',
    },
    // Basic groups for previous groups
    {
      ...BASIC_GROUP_OPTIONS_URL_TEST,
      name: '延迟选优',
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/speed.svg',
    },
    {
      ...BASIC_GROUP_OPTIONS_FALLBACK,
      name: '故障转移',
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/ambulance.svg',
    },
    {
      ...BASIC_GROUP_OPTIONS_LOAD_BALANCE_HASHING,
      name: '负载均衡(散列)',
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/merry_go.svg',
    },
    {
      ...BASIC_GROUP_OPTIONS_LOAD_BALANCE_ROBIN,
      name: '负载均衡(轮询)',
      icon: 'https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/balance.svg',
    },
    // Basic groups by country
    ...BASIC_GROUPS,
  ]

  return {
    proxies,
    proxyGroups,
  }
}

/**
 * Custom DNS configuration
 *
 * @returns {object} DNS configuration
 */
function customDns() {
  const DEFAULT_NAMESERVERS = [
    // AliDNS
    '223.5.5.5',
    // DNSPod
    '119.29.29.29',
    // 114DNS
    '114.114.114.114',
    // Cloudflare DNS
    '1.1.1.1',
    // Google DNS
    '8.8.8.8',
  ]
  const NAMESERVERS = [
    // AliDNS DoH
    'https://dns.alidns.com/dns-query',
    // DNSPod DoH
    'https://doh.pub/dns-query',
    // Cloudflare DoH
    'https://dns.cloudflare.com/dns-query',
    // Google DoH
    'https://dns.google/dns-query',
    // AliDNS DoT
    'tls://dns.alidns.com:853',
    // DNSPod DoT
    'tls://dot.pub:853',
    // Cloudflare DoT
    'tls://dns.cloudflare.com:853',
    // Google DoT
    'tls://dns.google:853',
  ]
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
    'default-nameserver': DEFAULT_NAMESERVERS,
    // Nameservers
    'nameserver': NAMESERVERS,
    // We can also use `nameserver-policy` and `fallback` to customize dns servers
  }
  return {
    dns,
  }
}

/**
 * Custom rule providers & rules
 *
 * @returns {object} Custom rule providers & rules
 */
function customProvidersAndRules() {
  // Rule providers
  const BASIC_RULE_PROVIDER_OPTIONS = {
    type: 'http',
    format: 'yaml',
    interval: 86_400,
  }
  const ruleProviders = {
    'reject': {
      ...BASIC_RULE_PROVIDER_OPTIONS,
      behavior: 'domain',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/reject.txt',
      path: './ruleset/loyalsoldier/reject.yaml',
    },
    'icloud': {
      ...BASIC_RULE_PROVIDER_OPTIONS,
      behavior: 'domain',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/icloud.txt',
      path: './ruleset/loyalsoldier/icloud.yaml',
    },
    'apple': {
      ...BASIC_RULE_PROVIDER_OPTIONS,
      behavior: 'domain',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/apple.txt',
      path: './ruleset/loyalsoldier/apple.yaml',
    },
    'google': {
      ...BASIC_RULE_PROVIDER_OPTIONS,
      behavior: 'domain',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/google.txt',
      path: './ruleset/loyalsoldier/google.yaml',
    },
    'proxy': {
      ...BASIC_RULE_PROVIDER_OPTIONS,
      behavior: 'domain',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/proxy.txt',
      path: './ruleset/loyalsoldier/proxy.yaml',
    },
    'direct': {
      ...BASIC_RULE_PROVIDER_OPTIONS,
      behavior: 'domain',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/direct.txt',
      path: './ruleset/loyalsoldier/direct.yaml',
    },
    'private': {
      ...BASIC_RULE_PROVIDER_OPTIONS,
      behavior: 'domain',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/private.txt',
      path: './ruleset/loyalsoldier/private.yaml',
    },
    'gfw': {
      ...BASIC_RULE_PROVIDER_OPTIONS,
      behavior: 'domain',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt',
      path: './ruleset/loyalsoldier/gfw.yaml',
    },
    'tld-not-cn': {
      ...BASIC_RULE_PROVIDER_OPTIONS,
      behavior: 'domain',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/tld-not-cn.txt',
      path: './ruleset/loyalsoldier/tld-not-cn.yaml',
    },
    'telegramcidr': {
      ...BASIC_RULE_PROVIDER_OPTIONS,
      behavior: 'ipcidr',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/telegramcidr.txt',
      path: './ruleset/loyalsoldier/telegramcidr.yaml',
    },
    'cncidr': {
      ...BASIC_RULE_PROVIDER_OPTIONS,
      behavior: 'ipcidr',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/cncidr.txt',
      path: './ruleset/loyalsoldier/cncidr.yaml',
    },
    'lancidr': {
      ...BASIC_RULE_PROVIDER_OPTIONS,
      behavior: 'ipcidr',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/lancidr.txt',
      path: './ruleset/loyalsoldier/lancidr.yaml',
    },
    'applications': {
      ...BASIC_RULE_PROVIDER_OPTIONS,
      behavior: 'classical',
      url: 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/applications.txt',
      path: './ruleset/loyalsoldier/applications.yaml',
    },
    'openai': {
      ...BASIC_RULE_PROVIDER_OPTIONS,
      behavior: 'classical',
      url: 'https://fastly.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/OpenAI/OpenAI.yaml',
      path: './ruleset/blackmatrix7/openai.yaml',
    },
  }
  // Rules
  const rules = [
    // Forza Horizon 4
    'PROCESS-NAME,ForzaHorizon4.exe,全局直连',
    // half-life launcher
    'PROCESS-NAME,hl.exe,全局直连',
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
