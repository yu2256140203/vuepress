# Markdown Extensions

## Header Anchors

Headers automatically get anchor links applied. Rendering of anchors can be configured using the [`markdown.anchor`](../config/README.md#markdown-anchor) option.

## Links

### Internal Links

Internal links are converted to `<router-link>` for SPA navigation. Also, every `README.md` or `index.md` contained in each sub-directory will automatically be converted to `index.html`, with corresponding url `/`.

Given the following directory structure:

```
.
├─ README.md
├─ foo
│  ├─ README.md
│  ├─ one.md
│  └─ two.md
└─ bar
   ├─ README.md
   ├─ three.md
   └─ four.md
```

And providing you are in `foo/one.md`:

```md
[Home](/) <!-- Sends the user to the root README.md -->
[foo](/foo/) <!-- Sends the user to index.html of directory foo -->
[foo heading](./#heading) <!-- Anchors user to a heading in the foo README file -->
[bar - three](../bar/three.md) <!-- You can append .md (recommended) -->
[bar - four](../bar/four.html) <!-- Or you can append .html -->
```

### Redirection for URLs <Badge text="1.0.0-alpha.37"/>

VuePress supports redirecting to clean links. If a link `/foo` is not found, VuePress will look for a existing `/foo/` or `/foo.html`. Conversely, when one of `/foo/` or `/foo.html` is not found, VuePress will also try the other. With this feature, we can customize your website's urls with the official plugin [vuepress-plugin-clean-urls](https://vuepress.github.io/plugins/clean-urls/).

::: tip
Regardless of whether the permalink and clean-urls plugins are used, your relative path should be defined by the current file structure. In the above example, even though you set the path of `/foo/one.md` to `/foo/one/`, you should still access `/foo/two.md` via `./two.md`.
:::

### External Links

Outbound links automatically gets `target="_blank" rel="noopener noreferrer"`:

- [vuejs.org](https://vuejs.org)
- [VuePress on GitHub](https://github.com/vuejs/vuepress)

You can customize the attributes added to external links by setting [config.markdown.externalLinks](../config/README.md#markdown-externallinks).

## Front Matter

[YAML front matter](https://jekyllrb.com/docs/frontmatter/) is supported out of the box:

``` yaml
---
title: Blogging Like a Hacker
lang: en-US
---
```

This data will be available to the rest of the page, along with all custom and theming components.

For more details, check out the [Front Matter](./frontmatter.md) page.

## GitHub-Style Tables

``` md preview
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |
```

## Emoji :tada:

``` md preview
:tada: :100:
```

A list of all emojis available can be found [here](https://github.com/markdown-it/markdown-it-emoji/blob/master/lib/data/full.json).

## Table of Contents

**Input**

```md
[[toc]]
```

or

```md
<TOC/>
```

**Output**

[[toc]]

Rendering of TOC can be configured using the [`markdown.toc`](../config/README.md#markdown-toc) option, or as props of [TOC component](./using-vue.md#toc), like `<TOC list-type="ol" :include-level="[2, Infinity]"/>`.

## Custom Containers <Badge text="default theme"/>

``` md preview
::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a dangerous warning
:::
```

You can also customize the title of the block:

``` md preview
::: danger STOP
Danger zone, do not proceed
:::
```

**Also see:**

- [vuepress-plugin-container](https://vuepress.github.io/plugins/container/)

## Syntax Highlighting in Code Blocks

VuePress uses [Prism](https://prismjs.com/) to highlight language syntax in markdown code blocks, using coloured text. Prism supports a wide variety of programming languages. All you need to do is append a valid language alias to the beginning backticks for the code block:

```` md preview
``` js
export default {
  name: 'MyComponent',
  // ...
}
```
````

```` md preview
``` html
<ul>
  <li
    v-for="todo in todos"
    :key="todo.id"
  >
    {{ todo.text }}
  </li>
</ul>
```
````

Check out [the list of valid languages](https://prismjs.com/#languages-list) on the Prism website.

## Line Highlighting in Code Blocks

```` md preview
``` js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```
````

## Line Numbers

You can enable line numbers for each code blocks via config:

``` js
module.exports = {
  markdown: {
    lineNumbers: true
  }
}
```

or you can enable/disable line numbers in the frontmatter:

``` yaml
---
lineNumbers: true
---
```

or you can directly enable/disable line numbers in the code block:

```` md preview
``` js {4} line-numbers
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```
````

## Import Code Snippets <Badge text="beta" type="warn"/>

You can import code snippets from existing files via following syntax:

``` md
<<< @/filepath
```

It also supports [line highlighting](#line-highlighting-in-code-blocks):

``` md preview
<<< @/../@vuepress/markdown/__tests__/fragments/snippet.js{2}
```

::: tip
Since the import of the code snippets will be executed before webpack compilation, you can't use the path alias in webpack. The default value of `@` is `process.cwd()`.
:::


## Advanced Configuration

VuePress uses [markdown-it](https://github.com/markdown-it/markdown-it) as the markdown renderer. A lot of the extensions above are implemented via custom plugins. You can further customize the `markdown-it` instance using the `markdown` option in `.vuepress/config.js`:

``` js
module.exports = {
  markdown: {
    // options for markdown-it-anchor
    anchor: { permalink: false },
    // options for markdown-it-toc
    toc: { includeLevel: [1, 2] },
    extendMarkdown: md => {
      // use more markdown-it plugins!
      md.use(require('markdown-it-xxx'))
    }
  }
}
```
