# 🚀 NewsNow 一键部署指南

## 📋 部署前准备清单

### 必需账户
- ✅ GitHub账户（已有）
- ⏳ Cloudflare账户（免费注册）

### 预计时间
- 🕐 总计：15-20分钟
- 📱 简单部署：5分钟
- 🔧 完整功能：15分钟

---

## 🎯 方案一：快速部署（推荐新手）

### 特点
- ✅ 无需配置，即开即用
- ✅ 支持所有新闻功能
- ❌ 无用户登录
- ❌ 无个性化缓存

### 部署步骤

1. **访问 Cloudflare Pages**
   - 打开：https://dash.cloudflare.com/
   - 注册/登录你的账户

2. **创建新项目**
   - 点击 `Pages` → `创建项目`
   - 选择 `连接到Git`
   - 授权GitHub访问权限

3. **选择仓库**
   - 找到 `cy0007/newsnow`
   - 点击 `开始设置`

4. **配置构建设置**
   ```
   项目名称: newsnow-[你的名字]
   生产分支: main
   构建命令: pnpm run build
   输出目录: dist/output/public
   ```

5. **部署**
   - 点击 `保存并部署`
   - 等待3-5分钟完成构建

6. **访问网站**
   - 获得网址：`https://newsnow-[你的名字].pages.dev`

---

## 🔧 方案二：完整功能部署

### 特点
- ✅ 支持用户登录
- ✅ 个性化新闻缓存
- ✅ 数据同步功能
- 🔧 需要额外配置

### 第一步：创建GitHub OAuth应用

1. **访问GitHub设置**
   - 打开：https://github.com/settings/applications/new

2. **填写应用信息**
   ```
   应用名称: NewsNow
   主页URL: https://newsnow-[你的名字].pages.dev
   应用描述: 个人新闻阅读应用
   授权回调URL: https://newsnow-[你的名字].pages.dev/api/oauth/github
   ```

3. **创建应用**
   - 点击 `注册应用`
   - **重要**：保存 `Client ID` 和 `Client Secret`

### 第二步：创建Cloudflare D1数据库

1. **进入Cloudflare控制台**
   - 访问：https://dash.cloudflare.com
   - 点击 `Workers & Pages` → `D1`

2. **创建数据库**
   ```
   数据库名称: newsnow-db
   ```
   - 点击 `创建`
   - **重要**：记录数据库ID

### 第三步：配置环境变量

在Cloudflare Pages项目设置中添加：

```env
G_CLIENT_ID=你的GitHub_Client_ID
G_CLIENT_SECRET=你的GitHub_Client_Secret  
JWT_SECRET=你的GitHub_Client_Secret
INIT_TABLE=true
ENABLE_CACHE=true
```

### 第四步：配置数据库绑定

需要创建 `wrangler.toml` 配置文件（我来帮你创建）

---

## 🆘 遇到问题？

### 常见错误解决

**构建失败**
- 检查构建命令是否为：`pnpm run build`
- 检查输出目录是否为：`dist/output/public`

**登录功能无效**
- 检查GitHub OAuth回调URL是否正确
- 确认环境变量是否正确配置

**数据库连接失败**
- 确认D1数据库已创建并绑定
- 检查 `INIT_TABLE=true` 是否设置

---

## 📞 获取帮助

如果遇到任何问题，请告诉我具体的错误信息，我会立即帮你解决！

**下一步：选择你想要的部署方案 👆** 