export const brotherSites = Array.from({ length: 10 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");

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
});

export type BrotherSite = (typeof brotherSites)[number];
