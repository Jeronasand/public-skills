---
name: public-skills-catalog
description: "Read and use the public-skills machine-readable catalog, category, and association JSON files. Use when Codex needs to quickly discover all available public skills, choose skills by category, inspect latest tags, understand optional related skills, or maintain catalog metadata when creating or updating skills."
---

# Public Skills Catalog

Use this skill when working with the `public-skills` repository or when another repository needs to discover which public skills are available.

## Primary Files

Read these files first:

```text
skills/catalog.json
skills/categories.json
skills/associations.json
```

Use `skills/README.md` only as the human-readable index after reading the JSON files.

## Discovery Workflow

1. Read `skills/catalog.json`.
   - Find available skills by `name`, `description`, `keywords`, or `categories`.
   - Use `tag` as the fixed install version.
   - Use `requiresEnv` to decide whether to mention local env setup.

2. Read `skills/categories.json`.
   - Group skills by user intent.
   - If a task maps to more than one category, present the likely category and any alternatives.

3. Read `skills/associations.json`.
   - If the selected skill appears as `primary` or `related`, explain the association to the user.
   - Ask whether to install related skills before adding them to the installation plan.

4. Open the chosen skill's `SKILL.md`.
   - Follow that skill's instructions for execution.
   - Use its `README.md` only for user-facing reference details.

## Maintenance Workflow

When creating or updating a public skill:

1. Decide the skill category yourself from its actual purpose.
2. Update `skills/categories.json` if the skill is new or its category changes.
3. Update `skills/catalog.json` with the latest version, tag, paths, flags, description, keywords, author, and source type.
4. Update `skills/associations.json` if the skill overlaps with, depends on, follows, or optionally enhances another skill.
5. Validate all JSON before committing.

Do not ask the user to choose a category unless the skill purpose is genuinely ambiguous after reading the skill content.

## Validation

Before committing catalog changes, validate JSON syntax and references:

```bash
python3 -m json.tool skills/catalog.json >/tmp/public-skills-catalog.json
python3 -m json.tool skills/categories.json >/tmp/public-skills-categories.json
python3 -m json.tool skills/associations.json >/tmp/public-skills-associations.json
```

Also verify every catalog skill exists on disk and every category skill exists in the catalog.
