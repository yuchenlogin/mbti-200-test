# MBTI · 200题人格偏好测试

一个无需构建工具的静态 MBTI 测试网站，题目来自《权威完整版200道MBTI人格测试题》，按四个维度各 50 题计分：

- E / I：能量来源
- S / N：信息方式
- T / F：决策偏好
- J / P：生活节奏

## 本地运行

```bash
python3 -m http.server 4173
```

打开 <http://127.0.0.1:4173/> 即可。

## GitHub Pages

仓库使用根目录静态文件，直接在 GitHub 的 **Settings → Pages** 中选择 `Deploy from a branch`，分支选择 `main`、目录选择 `/ (root)` 即可发布。

> 这是参考性自我探索工具，不替代专业心理评估。
