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
    description: "独立音乐网站入口，后续将部署为单独项目并绑定独立子域名。",
    domain: "yy.q-c.hk",
    url: "https://yy.q-c.hk",
    enabled: false,
    status: "准备部署",
    actionLabel: "准备部署",
    unavailableMessage: "音乐网站正在准备独立部署，域名将使用 yy.q-c.hk。",
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
