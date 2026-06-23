export type BrotherSite = {
  id: string;
  index: string;
  title: string;
  description: string;
  domain: string;
  url: string;
  enabled: boolean;
  status: string;
  actionLabel?: string;
  unavailableMessage?: string;
  accent?: "music";
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
    actionLabel: "进入网站",
    unavailableMessage: "音乐网站正在准备独立部署，域名将使用 YY.Q-C.HK。",
    accent: "music",
  },
  ...Array.from({ length: 9 }, (_, index) => {
    const number = String(index + 2).padStart(2, "0");

    return {
      id: `site-${number}`,
      index: number,
      title: `兄弟网站 ${number}`,
      description: "独立网站入口，占位内容，后续替换为真实项目。",
      domain: "",
      url: "",
      enabled: false,
      status: "待配置",
    };
  }),
];
