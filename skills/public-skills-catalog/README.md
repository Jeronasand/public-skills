# Public Skills Catalog

## 用途

这个 skill 用于让 AI 快速读取本仓库当前所有公开 skills，并根据分类、关键词、版本和关联关系选择需要安装或使用的 skill。

它优先读取机器可读 JSON：

```text
skills/catalog.json
skills/categories.json
skills/associations.json
```

## 适用场景

- 需要快速知道本仓库有哪些 public skills。
- 需要按分类查找 skill。
- 需要知道每个 skill 当前固定 tag。
- 需要在安装某个 skill 前判断是否要提示安装相关 skill。
- Codex 新增或更新 skill 时，需要同步维护目录、分类和关联。

## 引用方式

在目标仓库的 `.codex/public-skills.yaml` 中固定版本：

```yaml
skills:
  - name: public-skills-catalog
    repo: git@github.com:Jeronasand/public-skills.git
    ref: public-skills-catalog/v1.0.0
```

## 核心规则

Codex 每次创建或更新 skill 时，必须自己判断分类，并同步：

```text
skills/catalog.json
skills/categories.json
skills/associations.json
```

不要要求用户手动归类。只有在 skill 目的读完仍然不明确时，才向用户提问。

## 环境变量

这个 skill 不需要环境变量。

## 常用校验

```bash
python3 -m json.tool skills/catalog.json >/tmp/public-skills-catalog.json
python3 -m json.tool skills/categories.json >/tmp/public-skills-categories.json
python3 -m json.tool skills/associations.json >/tmp/public-skills-associations.json
```

## 作者和来源

- 作者：`Jeronasand & Codex`
- 来源类型：`original`
- 来源记录：[SOURCE.md](./SOURCE.md)

## 版本

- 当前版本：`public-skills-catalog/v1.0.0`
- `v1.0.0`：新增 public skills 机器可读目录和分类读取 skill。
