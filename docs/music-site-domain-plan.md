# 音乐网站域名规划

音乐网站未来域名：

```text
yy.q-c.hk
```

## 项目隔离原则

`q-c.hk` 是当前主网站，只负责品牌主页和兄弟网站入口展示。

音乐网站以后必须作为独立项目部署，不要写进当前 `q-c.hk` 主网站项目，也不要把 `yy.q-c.hk` 绑定到当前主网站的 Vercel 项目。

建议独立项目规划：

```text
GitHub 仓库：q-c-music-site
Vercel 项目：q-c-music-site
正式域名：yy.q-c.hk
```

## 后续部署步骤

1. 创建独立 GitHub 仓库 `q-c-music-site`。
2. 创建独立 Vercel 项目 `q-c-music-site`。
3. 在音乐网站 Vercel 项目的 Domains 页面添加域名 `yy.q-c.hk`。
4. 按 Vercel 提示，在 DNS 添加对应的 CNAME 记录。
5. 等 Vercel 显示 `Valid Configuration`。
6. 回到 `q-c.hk` 当前主网站项目，修改 `src/data/brotherSites.ts`。
7. 把音乐网站入口改成：

```ts
{
  id: "music-site",
  index: "01",
  title: "音乐网站",
  description: "独立音乐网站入口。",
  domain: "yy.q-c.hk",
  url: "https://yy.q-c.hk",
  enabled: true,
  status: "已上线",
}
```

## DNS 注意事项

子域名 `yy.q-c.hk` 通常需要在 DNS 中添加 CNAME 记录。

具体 CNAME 值以音乐网站独立 Vercel 项目的 Domains 页面提示为准，不要提前写死。

不要删除或修改当前 `q-c.hk` 主网站正在使用的 DNS 记录。
