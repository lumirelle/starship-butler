export interface Device {
  name: string
  width: number
  height: number
  dpr: number
  userAgent: string
  type: 'mobile' | 'mobile (no touch)' | 'desktop' | 'desktop (touch)'
}

export const DEVICES: Device[] = [
  {
    name: '1 Mobile Min 375 (9 : 16)',
    width: 375,
    height: 667,
    dpr: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    type: 'mobile',
  },
  {
    name: '2 Mobile Max 767 (9 : 16)',
    width: 767,
    height: 1364,
    dpr: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    type: 'mobile',
  },
  {
    name: '3 Pad Min 768 (3 : 4)',
    width: 768,
    height: 1024,
    dpr: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    type: 'mobile',
  },
  {
    name: '4 Pad Max 1023 (3 : 4)',
    width: 1023,
    height: 1364,
    dpr: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    type: 'mobile',
  },
  {
    name: '5 Laptop Min 1024 (16 : 9)',
    width: 1024,
    height: 576,
    dpr: 2,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    type: 'desktop',
  },
  {
    name: '6 Laptop Max 1279 (16 : 9)',
    width: 1279,
    height: 719,
    dpr: 2,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    type: 'desktop',
  },
  {
    name: '7 Desktop Min 1280 (16 : 9)',
    width: 1280,
    height: 720,
    dpr: 2,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    type: 'desktop',
  },
  {
    name: '8 Desktop 2k-1dpr 2560 (16 : 9)',
    width: 2560,
    height: 1440,
    dpr: 1,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    type: 'desktop',
  },
]
