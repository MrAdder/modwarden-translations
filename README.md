# ModWarden Suite translations

Translations for [ModWarden Suite](https://www.mwsbot.app), the moderation, welcome and safety bot for Discord: the bot's messages and the web panel.

Anyone can help. You don't need to be a developer, or to know GitHub.

## Translate on Crowdin

**The easiest way to help: [crowdin.com/project/modwarden](https://crowdin.com/project/modwarden)**

1. Open the project and sign in (or make a free Crowdin account).
2. Choose your language, then a file: `bot.json` for what the bot says in Discord, `panel.json` for the web panel.
3. Translate a string at a time, in your browser. Crowdin shows the English, highlights the `{placeholders}` to keep, and saves as you go.

Your translations come back to this repo by themselves. Please read [the rules](#the-rules) below first; they're also in the project's style guide on Crowdin.

## What's here

```
locales/
  en-US/          English, the source. Only the maintainer changes it.
    bot.json      What the bot says in Discord.
    panel.json    The web panel at mwsbot.app.
  de/             One folder per language, named with Discord's language code.
    bot.json
    panel.json
```

Each file is a list of keys and text:

```json
{
  "levels.levelUp": "{user} reached **level {level}**!"
}
```

The key (`levels.levelUp`) stays exactly as it is. Only the text after it is translated.

## The rules

1. **Keep every `{placeholder}` exactly as it is.** `{user}`, `{level}`, `{server}` and the rest are filled in by the bot. You can move them around in the sentence, but don't translate or rename them.
2. **Keep Discord formatting.** `**bold**`, `*italic*`, `` `code` `` and links like `[text](https://...)` should stay, around the matching translated words.
3. **Don't translate the keys,** and don't add or remove any. A key missing from your file shows in English until it's translated.
4. **Keep it the same length or close.** Some text appears on buttons and in menus with little room.
5. **Write the way the bot speaks:** plain, friendly and short. Use the informal "you" where your language has one, unless that would sound rude for a moderation tool.

## Your language isn't on Crowdin?

Ask for it: open an issue saying which language you'd like to help with, or ask in the ModWarden Support Discord server, and it will be added to [the Crowdin project](https://crowdin.com/project/modwarden).

## Translating on GitHub instead

If you'd rather edit the files directly, you can:

1. Find your language's code in the table below.
2. Copy the `locales/en-US` folder and name the copy with that code, for example `locales/fr`, or edit your language's files if they exist.
3. Translate the text in each file.
4. Open a pull request. The check on the pull request tells you if a placeholder went missing or the file isn't valid JSON.

Translations made here are picked up by Crowdin too, so the two stay in step. [CONTRIBUTING.md](CONTRIBUTING.md) has the steps.

## Language codes

These are the languages Discord itself supports, so the bot can match each member's Discord language.

| Code | Language | Code | Language |
| --- | --- | --- | --- |
| `bg` | Bulgarian | `ja` | Japanese |
| `cs` | Czech | `ko` | Korean |
| `da` | Danish | `lt` | Lithuanian |
| `de` | German | `nl` | Dutch |
| `el` | Greek | `no` | Norwegian |
| `en-GB` | English (UK) | `pl` | Polish |
| `es-ES` | Spanish | `pt-BR` | Portuguese (Brazil) |
| `es-419` | Spanish (Latin America) | `ro` | Romanian |
| `fi` | Finnish | `ru` | Russian |
| `fr` | French | `sv-SE` | Swedish |
| `hi` | Hindi | `th` | Thai |
| `hr` | Croatian | `tr` | Turkish |
| `hu` | Hungarian | `uk` | Ukrainian |
| `id` | Indonesian | `vi` | Vietnamese |
| `it` | Italian | `zh-CN` | Chinese (Simplified) |
|  |  | `zh-TW` | Chinese (Traditional) |

## When translations appear

The English files grow as more of the bot and panel are made translatable, so expect new keys over time. A language goes live once most of it is translated. Server admins will then be able to choose their server's language in the panel.

## Licence

Translations are under the [MIT licence](LICENSE). By contributing, you agree your translations are released under it, so they can be used in ModWarden Suite, including its paid plan.
