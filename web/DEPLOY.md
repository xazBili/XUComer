# 发布到 GitHub

全程用 `gh` 命令行（已安装 v2.101），比手点网页快得多。

## 0. 前置检查

```bash
gh auth status          # 看是否登录
git ls-files exe/       # 必须为空，exe 不入库
```

`exe/x64`、`exe/x86` 已被 `.gitignore` 挡住。如果哪天不小心被追踪：

```bash
git rm -r --cached exe
```

GitHub 单文件上限 100 MB。当前最大的 zip 是 45 MB，安全。

## 1. 登录（唯一要手动做的一步）

```bash
gh auth login
```

按提示选 `GitHub.com` → `HTTPS` → `Login with a web browser`，终端会给出一个
一次性码，复制到打开的浏览器页面完成授权。

## 2. 填用户名占位符

`index.html` 和 `guide.html` 里的 `YOUR_USERNAME` 全换成你的 GitHub 用户名：

```bash
$name = "你的用户名"
(Get-Content index.html) -replace 'YOUR_USERNAME', $name | Set-Content index.html
```

## 3. 建仓库并推送

```bash
git add -A
git commit -m "发布官网"
gh repo create XUComer --public --source=. --remote=origin --push
```

`gh repo create` 会一次性建好远程仓库 + 关联 + 推送。

## 4. 开启 GitHub Pages

网站源码在 `web/` 子目录，Pages 根目录必须指过去：

```bash
gh api -X POST repos/{owner}/{repo}/pages \
  -f source[branch]=master -f source[path]=/web
```

启用要几十秒，查状态：

```bash
gh api repos/{owner}/{repo}/pages --jq .status
```

返回 `built` 就上线了，地址是 `https://<用户名>.github.io/XUComer/`。

## 5. 发 Release

两个 zip **必须**叫这个名字，官网下载链接写死的：

```bash
gh release create v1.0 ^
  exe/x64/XUComer-win-x64.zip ^
  exe/x86/XUComer-win-x86.zip ^
  --title "XUComer v1.0" ^
  --generate-notes
```

（CMD 用 `^` 换行，PowerShell 用反引号 `` ` ``）

## 6. 验证

```bash
gh browse                    # 打开仓库页
curl -sIL https://github.com/<用户名>/XUComer/releases/latest/download/XUComer-win-x64.zip
```

最后一次重定向返回 `200` 说明下载链接通了。

## 常见坑

| 现象 | 原因 |
|---|---|
| Pages 打开是 README 源码 | 忘了把 `source[path]` 设成 `/web` |
| 下载 404 | zip 名字不对，或多套了一层文件夹 |
| push 被拒：文件超 100 MB | exe 混进去了，用 `git rm --cached` 清掉 |
| Pages 404 但仓库正常 | 还没 build 完，等一分钟再刷 |
| 改了 index.html 但网页没变 | Pages 有缓存，强制刷新 Ctrl+F5 |
