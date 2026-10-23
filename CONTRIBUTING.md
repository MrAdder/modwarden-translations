# Contributing

Thank you for helping translate ModWarden Suite. The [README](README.md) has the rules and the language codes; this page is how to send your work.

## On GitHub's website (no tools needed)

1. Open the file you want to translate, for example `locales/fr/bot.json`. If your language has no folder yet, open `locales/en-US/bot.json` instead.
2. Press the pencil icon (**Edit this file**). GitHub makes your own copy of the repo for you.
3. For a new language, change the file name at the top to your language's folder, for example `locales/fr/bot.json`.
4. Translate the text, keeping every `{placeholder}` and the Discord formatting.
5. Press **Commit changes**, then **Propose changes**, then **Create pull request**.

## With git

```bash
git clone https://github.com/MrAdder/modwarden-translations.git
cd modwarden-translations
cp -r locales/en-US locales/fr   # for a new language
# translate the files, then check them:
node scripts/check.mjs
git checkout -b french
git commit -am "French: bot messages"
git push
```

Then open a pull request.

## The check

Every pull request runs `scripts/check.mjs`. It makes sure:

- each file is valid JSON;
- every key exists in English (no made-up keys);
- each translation keeps the same `{placeholders}` as the English.

Missing keys are fine: they show in English until someone translates them. The check lists them so you know what's left.

## Updating a language

When the English files change, new keys appear in English only. Translate them in your language's files the same way. If the English text of a key you translated has changed, check your translation still says the same thing.

## Questions

Open an issue, or ask in the ModWarden Support Discord server.

By contributing, you agree your translations are released under this repo's [MIT licence](LICENSE).
