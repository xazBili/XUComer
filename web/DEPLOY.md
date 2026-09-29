# XUComer 上线 GitHub Pages

从零到全世界能访问，一共四步：**推代码 → 发 Release → 开 Pages → 换链接**。
不想敲命令就用方案 A（图形界面），想用命令就走方案 B。

> 网页在 `web/` 目录，是纯静态的（HTML + CSS + JS），不需要服务器、不需要数据库，
> GitHub Pages 免费托管，还能自动配 HTTPS。

---

## 0. 开工前先替换用户名

网页里的 GitHub 链接现在是占位符。全局搜索 `web/index.html` 里的 **`YOUR_USERNAME`**
（共 7 处），替换成你的 GitHub 用户名。

例如用户名叫 `zhangsan`，那么：

```
https://github.com/YOUR_USERNAME/XUComer           →  https://github.com/zhangsan/XUComer
.../XUComer/releases/latest/download/XUComer-win-x64.zip （同上，把用户名换掉）
```

仓库名建议就叫 `XUComer`，和链接保持一致就不用改后半段。

---

## 1. 注册与安装

1. 注册 <https://github.com>（用户名会变成你的网址前缀，认真取）
2. 装一个 [GitHub Desktop](https://desktop.github.com/)（推荐，全程鼠标点）
   或者 [Git](https://git-scm.com/)（走命令行方案 B）

---

## 2. 推代码到 GitHub

### 方案 A：GitHub Desktop（推荐新手）

1. 打开 GitHub Desktop → `File → Add Local Repository`，选择 `新建文件夹` 这个目录
2. 左下角填 Summary（比如 `first commit`）→ `Commit to main`
3. 右上角 `Publish repository`
   - Name 填 `XUComer`
   - **勾选 `Keep this code private` 不要勾**（要公开才能用免费的 Pages 和让下载链接生效）
   - 点 `Publish repository`

> 仓库根目录建议放 `code/` 的内容。**如果你直接把整个 `新建文件夹` 当仓库**，
> 仓库里会是 `code/`、`web/`、`exe/` 三块，GitHub Pages 需要多一步指定目录（见第 5 节），
> 但 `.gitignore` 已经把 `exe/` 排除了，不会误传 200MB 的安装包进去。

### 方案 B：命令行

```bash
cd "C:/Users/Administrator/Desktop/新建文件夹"

# 只在第一次需要
git config --global user.name  "你的名字"
git config --global user.email "你的邮箱"

git remote add origin https://github.com/<你的用户名>/XUComer.git
git branch -M main
git push -u origin main
```

`.gitignore` 里已经排除了 `exe/`、`__pycache__/`、`.workbuddy/`，所以只有源码和网页会被传上去。

---

## 3. 发 Release（下载按钮的文件从这里来）

网页上的两个下载按钮指向 Release 里的附件，所以 **zip 文件名必须一字不差**：

```
XUComer-win-x64.zip
XUComer-win-x86.zip
```

打包方式：

```
exe/x64/  整个文件夹  →  XUComer-win-x64.zip
exe/x86/  整个文件夹  →  XUComer-win-x86.zip
```

（zip 解压后里面直接是 `XUComer.exe` 和 `_internal/`，不要再多套一层 `XUComer/` 目录。
现在 `exe/x64/` 已经是扁平结构了，直接全选压缩即可。）

发布步骤：

1. 仓库页面右侧 `Releases` → `Create a new release`
2. `Choose a tag` 填 `v1.0.0`，勾选 `Set as latest release`
3. 标题写 `XUComer 1.0.0`，描述写更新内容
4. 把上面两个 zip 拖进 `Attach binaries` 上传
5. 点 `Publish release`

这样 `.../releases/latest/download/XUComer-win-x64.zip` 这个永久链接就生效了，
以后重新发 Release 只要 tag 更大，`latest` 会自动指向新版，网页不用改。

---

## 4. 开启 GitHub Pages

1. 仓库顶部 `Settings` → 左侧 `Pages`
2. `Build and deployment` → `Source` 选 **`Deploy from a branch`**
3. `Branch` 选 `main`，文件夹选 **`web`**（如果你的仓库根目录就是 `web/` 的内容，选 `/ (root)`）
4. `Save`
5. 等 1～3 分钟，页面顶部会出现网址：

```
https://<你的用户名>.github.io/XUComer/
```

每次 `git push` 之后，GitHub Actions 会自动重新部署，一般几十秒生效。

---

## 5. 两个可选优化

**自定义域名**：Pages 设置里 `Custom domain` 填你的域名，然后去域名服务商加一条
`CNAME` 记录指向 `<你的用户名>.github.io`，勾上 `Enforce HTTPS`。

**本地预览**（改了网页想先看效果）：

```bash
cd web
python -m http.server 8000
# 浏览器打开 http://localhost:8000
```

---

## 6. 以后要更新怎么办

| 改了什么 | 怎么做 |
| --- | --- |
| 网页文案 / 样式 | 改 `web/` → commit → push，Pages 自动更新 |
| 软件本体 | 重新打包 → 打 zip → 发新 Release（tag 递增） |
| 源码 | 改 `code/` → commit → push |

---

## 7. 容易踩的坑

- **仓库要公开**：Private 仓库的 Release 附件需要登录才能下，别人点下载会 404
- **别把 exe 直接 commit 进仓库**：体积大、还容易被当病毒库样本；走 Release 附件分发
- **zip 不要多套一层目录**：解压后应该直接看到 `XUComer.exe`
- **`latest` 链接依赖 release**：没发 Release 之前，两个下载按钮是 404
- **音效素材的授权**：内置音效素材遵循各自原始许可，仓库里的 `code/音效来源.txt` 写了出处，
  别人二次分发时需要一并保留
