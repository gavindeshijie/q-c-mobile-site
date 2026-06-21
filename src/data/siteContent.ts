export const siteContent = {
  domain: "q-c.hk",
  name: "Q-C",
  logoText: "Q-C",
  tagline: "Thailand Market Hub",
  fullTagline: "Thailand Market Supply & Technology Hub",
  chineseTagline: "泰国市场一站式供应与技术服务平台",
  menuLabel: "菜单",
  desktopNotice: "请使用手机浏览",
  hero: {
    eyebrow: "Thailand Market Supply & Technology Hub",
    title: "泰国市场一站式供应与技术服务平台",
    subtitle:
      "连接商品、技术、电商、软硬件与资源销售，帮助商家更快进入泰国市场。",
    primaryAction: {
      label: "了解合作",
      href: "#contact",
    },
    secondaryAction: {
      label: "查看业务",
      href: "#business",
    },
    nodes: [
      {
        title: "网站与软件定制",
        thai: "รับทำเว็บไซต์และซอฟต์แวร์",
        subtitle: "WEB / SOFTWARE",
      },
      {
        title: "软件与硬件结合开发",
        thai: "พัฒนาซอฟต์แวร์และฮาร์ดแวร์",
        subtitle: "SOFTWARE / HARDWARE",
      },
      {
        title: "潮流科技小商品供应",
        thai: "จัดหาสินค้าเทคโนโลยียอดนิยม",
        subtitle: "TREND TECH SUPPLY",
      },
      {
        title: "本地资源整合与销售",
        thai: "รวมทรัพยากรท้องถิ่นและการขาย",
        subtitle: "LOCAL RESOURCE / SALES",
      },
      {
        title: "泰国本土网店一条龙服务",
        thai: "บริการครบวงจรร้านค้าออนไลน์ไทย",
        subtitle: "THAI SHOP FULL SERVICE",
      },
    ],
    highlights: ["Thailand", "Supply", "Technology", "Sales"],
  },
  businessesIntro: {
    title: "五大核心业务",
    subtitle: "围绕泰国市场，提供从商品、技术到渠道资源的一站式支持。",
  },
  businesses: [
    {
      icon: "shoppingBag",
      title: "潮流商品供应",
      english: "Trend Products Supply",
      description: "精选市面热门商品，提供稳定货源、批量供货与销售支持。",
      accent: "cyan",
    },
    {
      icon: "code",
      title: "网站与软件定制",
      english: "Web & Software Development",
      description: "根据业务需求开发网站、商城系统、管理后台、小程序与自动化工具。",
      accent: "violet",
    },
    {
      icon: "store",
      title: "泰国网店协助",
      english: "Thailand E-Commerce Support",
      description: "协助商家进入泰国本地电商平台，提供开店指导、商品供货与运营支持。",
      accent: "gold",
    },
    {
      icon: "cpu",
      title: "软硬件定制开发",
      english: "Software & Hardware Solutions",
      description: "提供软件系统、智能设备、硬件方案、数据采集与行业工具定制。",
      accent: "blue",
    },
    {
      icon: "network",
      title: "资源整合与销售",
      english: "Resources Integration & Sales",
      description:
        "整合泰国本地渠道、商品资源、达人资源、商家资源与推广资源，提升成交效率。",
      accent: "silver",
      featured: true,
    },
  ],
  capabilitiesIntro: {
    title: "我们能为你解决什么",
  },
  capabilities: [
    {
      number: "01",
      title: "从货源到销售",
      description: "帮助商家快速找到合适商品、供货方案与销售渠道。",
      icon: "package",
    },
    {
      number: "02",
      title: "从想法到系统",
      description: "把业务想法转化为网站、软件、工具或自动化系统。",
      icon: "lightbulb",
    },
    {
      number: "03",
      title: "从中国到泰国市场",
      description: "协助商品、项目和资源更顺畅地进入泰国本地市场。",
      icon: "mapPin",
    },
  ],
  processIntro: {
    title: "合作流程",
  },
  process: [
    {
      number: "01",
      title: "需求沟通",
      description: "了解你的商品、项目、技术或资源需求。",
    },
    {
      number: "02",
      title: "方案整理",
      description: "根据泰国市场方向，整理供应、开发或资源对接方案。",
    },
    {
      number: "03",
      title: "执行落地",
      description: "进行网站开发、系统搭建、供货协助或渠道整合。",
    },
    {
      number: "04",
      title: "后续支持",
      description: "根据实际反馈持续优化内容、产品、渠道和系统。",
    },
  ],
  cta: {
    id: "contact",
    title: "准备进入泰国市场？",
    description:
      "无论你需要商品供货、网站软件开发、网店协助、软硬件定制，还是本地资源整合，都可以从一次沟通开始。",
    action: {
      label: "立即咨询",
      href: "mailto:contact@q-c.hk",
    },
  },
  footer: {
    title: "Q-C",
    subtitle: "Thailand Market Supply & Technology Hub",
    scope: "商品供应 / 定制开发 / 泰国网店 / 软硬件方案 / 资源整合",
    copyright: "© 2026 Q-C. All rights reserved.",
  },
} as const;

export type SiteContent = typeof siteContent;
