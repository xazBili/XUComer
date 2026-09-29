# 发布到 GitHub

## 1. 登录

```bash
gh auth login
```

选 `GitHub.com` → `HTTPS` → `Login with a web browser`，把终端给的一次性码填进浏览器。

## 2. 填用户名

把 `index.html` 和 `guide.html` 里的 `YOUR_USERNAME` 换成你的 GitHub 用户名。

## 3. 建仓库并推送

```bash
git add -A
git commit -m "发布官网"
gh repo create XUComer --public --source=. --remote=origin --push
```

## 4. 开启 Pages

```bash
gh api -X POST repos/{owner}/{repo}/pages -f source[branch]=master -f source[path]=/web
```

## 5. 发 Release

```bash
gh release create v1.0 exe/x64/XUComer-win-x64.zip exe/x86/XUComer-win-x86.zip --generate-notes
```

网站地址：`https://<用户名>.github.io/XUComer/`
