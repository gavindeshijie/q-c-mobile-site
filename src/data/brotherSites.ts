export type BrotherSite = {
  id: string;
  index: string;
  title: string;
  description: string;
  domain: string;
  url: string;
  enabled: boolean;
  status: string;
  category: string;
  keywords?: string[];
  actionLabel?: string;
  footerNote?: string;
  unavailableMessage?: string;
  accent?: "music" | "football";
};

export const brotherSites: BrotherSite[] = [
  {
    id: "music-site",
    index: "01",
    title: "音乐网站",
    description: "独立音乐网站入口。",
    domain: "YY.Q-C.HK",
    url: "https://yy.q-c.hk",
    enabled: true,
    status: "已上线",
    category: "音乐",
    keywords: ["音乐", "歌曲", "歌单", "music", "yy"],
    actionLabel: "进入网站",
    unavailableMessage: "音乐网站正在准备独立部署，域名将使用 YY.Q-C.HK。",
    accent: "music",
  },
  {
    id: "football-live-site",
    index: "02",
    title: "足球直播 · 足球实况",
    description: "足球赛事直播、即时赛况与胜率自动计算入口。",
    domain: "ZUQIU.GAMES",
    url: "https://zuqiu.games",
    enabled: true,
    status: "已上线",
    category: "体育",
    keywords: ["足球", "直播", "实况", "胜率", "football", "zuqiu"],
    actionLabel: "进入网站",
    footerNote: "实时足球直播 · 胜率自动计算",
    accent: "football",
  },
  ...Array.from({ length: 8 }, (_, index) => {
    const number = String(index + 3).padStart(2, "0");

    return {
      id: `site-${number}`,
      index: number,
      title: `兄弟网站 ${number}`,
      description: "独立网站入口，占位内容，后续替换为真实项目。",
      domain: "",
      url: "",
      enabled: false,
      status: "待配置",
      category: "待配置",
      keywords: ["占位", "预留", "待配置"],
    };
  }),
];
