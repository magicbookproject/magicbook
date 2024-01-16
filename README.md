# The Magic Book Project

_This project is still working towards a 1.0.0 release, which means that the API is in active development. EPUB and MOBI formats are still not supported. We encourage developers to try the releases and report any issues in the issue tracker._

The Magic Book Project is an open source project funded by New York University's Interactive Telecommunications Program. It aims to be the best free tool for creating print and digital books from a single source.

This project is for you, if:

- [x] You want to write your book in plain text (Markdown or HTML)
- [x] You want to export to a static website
- [x] You want to export to a printable PDF
- [ ] You want to export to EPUB (Apple Books, etc)
- [ ] You want to export to MOBI (Kindle)
- [x] You want your source to be free of format-specific hacks
- [x] You want to use CSS to design the look of your book
- [x] You want to use JavaScript to add interactivity to digital formats
- [x] You want to use a command-line tool for all of this
- [x] You want that command-line tool be be written in Node-only. No more XSLT.

Although a small number of open source publishing frameworks already exists, it's hard to find any that are flexible enough to create modern, interactive books for the web while also doing print-ready PDF export.

Much of the functionality of `magicbook` exists in the form of plugins, so if you can't find specific functionality in the core, perhaps it exists in the [plugin list](https://www.npmjs.com/browse/keyword/magicbook-plugin).

## Getting Started

First install the `magicbook` package:

```bash
npm install magicbook -g
```

Then run the new project generator:

```bash
magicbook new myproject
```

This will give you a very basic project folder with a `magicbook.json` configuration file. Now `cd` into the new project and build the book.

```bash
cd myproject
magicbook build
```

You now have a `myproject/build` directory with two builds: a website and a PDF. This is of course a very basic setup. Consult the rest of this README for all the available functionality.

## Configuration

To specify configuration for your project, `magicbook` uses a file called `magicbook.json` in your project folder. When you run `magicbook build`, the configuration file will automatically be detected. If you wish to have a custom name and location for the configuration file, you can use the `--config` command line argument.

```bash
magicbook build --config=myfolder/myconfig.json
```

## Source files

You can write your book in `.md`, `.html`, or both. `magicbook` uses a very simple layer on top of HTML5 called [HTMLBook](http://oreillymedia.github.io/HTMLBook) to define the various elements in a book. This mostly means using a few `data-type` attributes to specify chapters and sections, and it's very easy to learn. It is also what makes it possible `magicbook` to do its magic when generating table of contents, etc.

### Writing in Markdown

If you chose to write your book in Markdown, `magicbook` will automatically convert your markdown to HTMLBook. A simple file like the following...

```md
# Chapter title

## Sect 1

### Sect 2
```

... will be converted to the following HTMLBook markup.

```html
<section data-type="chapter">
  <h1>Chapter Title</h1>
  <section data-type="sect1">
    <h1>Sect 1</h1>
    <section data-type="sect2"><h2>Sect 2</h2></section>
  </section>
</section>
```

### Writing in HTML

If you choose to write in HTML, you will need to make sure that you're using the HTMLBook `data-type` attributes. `magicbook` will not break if you don't use them, but it won't be possible to generate a table of contents, etc.

### The files array

You can specify the files to build by adding a `files` array to your `magicbook.json` file. If you do not have a `files` array, it will look for all markdown files in `content/*.md`.

You can set the files property to be a single glob.

```json
{
  "files": "content/*.md"
}
```

You can set the files property to be an array of globs.

```json
{
  "files": ["content/chapter1/*.md", "content/chapter2/*.md"]
}
```

Using an array, you can also specify each of the files you want to build.

```json
{
  "files": [
    "content/first-file.md",
    "content/second-file.md",
    "content/third-file.md"
  ]
}
```

If you are **not** using the `permalink` setting, your glob structure will determine the output path in the build folder. If your glob uses wildcards `*`, the folders will be preserved in the build folder.

If you are using this approach, you can use numbers in folders and filenames to order your files, as the build process will **remove leading numbers, dashes and underscores from folders and filenames**. Take the following files:

```
contents/
  01-first-chapter/
    01-first-file.md
    02-second-file.md
```

... and this configuration file:

```json
{
  "files": ["contents/**/*.md"]
}
```

... will by default create a `html` build that looks like this:

```
build1/
  first-chapter/
    first-file.html
    second-file.html
```

If you want to have more control over folders and filenames, use the `permalink` setting.

### Parts

You can use a special object syntax to group your files into parts and sub-parts. The following example demonstrates a book with an introduction and two parts with several chapters in each. These parts will automatically be added to the table of contents, and the labels will be used in the slug when using the `permalinks` setting with the `:parts` variable.

```json
{
  "files": [
    "introduction.md",
    {
      "label": "Part 1",
      "files": ["first-chapter.md", "second-chapter.md"]
    },
    {
      "label": "Part 2",
      "files": ["third-chapter.md", "fourth-chapter.md"]
    }
  ]
}
```

You can also have sub-parts, which is demonstrated in the following:

```json
{
  "files": [
    {
      "label": "Part",
      "files": [
        "first-chapter.md",
        {
          "label": "Sub Part",
          "files": ["second-chapter.md"]
        }
      ]
    }
  ]
}
```

If you add extra properties to a part, it will be accessible as a liquid variable in the files. The following demonstrates a very simple use case, where "Hello" is inserted into a file.

```json
{
  "files" : [
    {
      "label" : "Part",
      "files" : [ ... ],
      "myVariable" : "Hello"
    }
  ]
}
```

```html
This is my file. {{ part.myVariable }}
```

## Builds

You must add a `builds` array to your configuration that as a minimum defines the format of each build. Here's a simple example with the bare minimum configuration to build your book into a website.

```json
{
  "builds": [{ "format": "html" }]
}
```

The `builds` array is a very powerful concept, as it allows you to specify settings for each build. For example, here's a book that uses a different introduction for the HTML and PDF builds. **All settings in `magicbook` can be specified as either a global setting or a build setting**.

```json
{
  "builds": [
    {
      "format": "pdf",
      "files": [
        "content/print-introduction.md",
        "content/chapter-1.md",
        "content/chapter-2.md"
      ]
    },
    {
      "format": "html",
      "files": [
        "content/web-introduction.md",
        "content/chapter-1.md",
        "content/chapter-2.md"
      ]
    }
  ]
}
```

Using the `builds` array, you can have several builds that uses the same format. This is useful if you want to e.g. generate a PDF with hyperlinks, and another PDF for print that doesn't have hyperlinks.

### Build destination

`destination` specifies where to put the builds. Because you can have many builds, the default destination is `build/:build`, which will create a build folder within `build` for each build (`build/build1`, `build/build2`, etc).

You can change this setting in your configuration file.

```json
{
  "destination": "my/custom/folder/:build"
}
```

### Build Format

`magicbook` has the following built-in formats.

#### HTML

The `html` format will save all source files as separate `.html` files as a static website.

#### PDF

The `pdf` format will combine all source files, bundle them into a single `.html` file, and generate a PDF in the format destination folder. Currently this process uses Prince XML for PDF generation, as it's one of the few applications that can do print-ready PDF files from HTML. You will need a Prince XML license to use it without a watermark.

You can define settings for Prince XML.

```json
{
  "prince": {
    "log": "myfile.txt",
    "license": "license.dat",
    "timeout": 300000
  }
}
```

#### EPUB (TODO)

#### MOBI (TODO)

## Permalinks

You can use the `permalink` setting to override the default glob-controlled build paths. Any occurrence of the string `:title` will be replaced with the original filename, so the following configuration can be used to make "pretty" permalinks.

```json
{
  "permalink": "chapters/:title/index.html"
}
```

Any occurrence of the string `:parts` will be replaced by the parts that the file belongs to, so if a file belongs to a sub-part, `:parts/:title.html` will result in a build file located in `part/sub-part/filename.html`.

## Links

`magicbook` can automatically resolve cross references. If you're writing in Markdown, simply create an ID in your destination document:

```html
<a id="mytarget"></a>
```

... and then link to that ID from any file:

```md
[Go to my target](#mytarget)
```

The same is true if you're writing in HTML, but you need your link to have a the `xref` HTMLBook `data-type`:

```html
<a href="#mytarget" data-type="xref">Go to my target</a>
```

`magicbook` will automatically figure out whether or not to insert the destination file into the `href`, depending on the build settings.

If you want to insert page numbers in link text for print, it's [easy with Prince XML and CSS](http://www.princexml.com/doc/7.1/cross-references/).

## Auto-generated ID's

By default, `magicbook` will add an auto-generated ID on every section with a HTMLBook `data-type` attribute. This is used internally to generate the table of contents. If you add an ID to a section, this ID will override the auto-generated ID.

You can rely on these ID's for internal references, as they are persistent across builds for documents that don't change. However, if you change the order of the sections, the ID's will change.

## Footnotes

`magicbook` will automatically parse Markdown or HTMLBook footnotes in your content, and give you the ability to render a custom footnotes section to your liking. First, write footnotes in Markdown.

```md
Denmark has 5 million people.^[I made that up]
```

... or HTML

````html
<p>
  Denmark has 5 million people.<span data-type="footnote">I made that up</span>
</p>
`` Then add a liquid variable where ever you want your compiled footnotes to
appear. ```liquid {{ footnotes }}
````

As liquid templates are evaluated before markdown conversion, and the footnotes are compiled after markdown conversion, `magicbook` will first insert a placeholder string during the liquid processing, and then later in the build process replace this placeholder with the output of a special include named `footnotes.html`. To generate a footnotes, you must have this include in your includes folder. The include will have access to the following array of footnotes:

```js
[
  {
    id: "fn1",
    label: "Text of footnotes"
  }
];
```

All projects created with `magicbook new` will have a `footnotes.html` include, and that's a good reference to see what's possible.

## Images

When you want to insert an image, simply create a folder called `images` in your book, save your image into this folder, and create an image tag using the name of your image.

For an image saved to `images/myimage.jpg`, the following would be the appropriate markup.

```md
![This is an image](myimage.jpg)
```

or

```html
<img src="myimage.jpg" alt="This is an image" />
```

During the build process, `magicbook` will transfer all files located in `images` to the `asset` folder of each build and replace the image src attribute appropriately.

### Source files

You can change where `magicbook` looks for images by supplying an array of globs, just like the general `files` array. The default pattern is `images/**/*.*`.

```json
{
  "images": {
    "files": "custom/images/folder/**/*.jpg"
  }
}
```

### Destination folder

It is also possible to control where the images are stored in the build. You can specify a custom destination folder by using the `destination` property. It defaults to `assets`.

```json
{
  "images": {
    "destination": "custom/assets/folder"
  }
}
```

### Digest

The `digest` option will add a md5 checksum of the image content to the filename, to allow you to set long caching headers for a production website.

```json
{
  "images": {
    "digest": true
  }
}
```

### Colorspace

You can specify the output images' `colorspace`. All images defined in the source files will be transformed utilizing [sharp](https://sharp.pixelplumbing.com/api-colour#tocolourspace).

```json
{
  "images": {
    "colorspace": "b-w"
  }
}
```

## Stylesheets

You can style all your builds using CSS or SCSS. The `stylesheets` configuration allows you to specify an array of `.css` or `.scss` files to include in the build. The following example shows a configuration file specifying two stylesheets to include in all builds.

```json
{
  "stylesheets": {
    "files": ["css/first.css", "css/second.scss"]
  }
}
```

You can insert the compiled CSS in the layout using the `{{ stylesheets }}` liquid variable tag. This will insert each file as a separate `<link>` element.

```html
<html>
  <head>
    {{ stylesheets }}
  </head>
  <body>
    {{ content }}
  </body>
</html>
```

By using different files for each format, you can have a book that looks very different across formats. To share styles between the formats, you can use SCSS `@import`.

### Destination

It is also possible to control where these stylesheets are stored in the build. You can specify a custom destination folder by using the `destination` property. It defaults to `assets`.

```json
{
  "stylesheets": {
    "destination": "customfolder"
  }
}
```

### Compress

The `compress` property will remove whitespace from the CSS file, resulting in much smaller file sizes.

```json
{
  "stylesheets": {
    "compress": true
  }
}
```

### Bundle

The `bundle` option will combine all the files in the `stylesheets` array into a single CSS file in the output. This, combined with the `compress` option, is recommended to improve the loading speed of a production website. You can set it to `true` or the desired name of the bundle.

```json
{
  "stylesheets": {
    "bundle": "mybundle.css"
  }
}
```

### Digest

The `digest` option will add the md5 checksum of the file content to the filename, to allow you to set long caching headers for a production website.

```json
{
  "stylesheets": {
    "digest": true
  }
}
```

## JavaScripts

The `javascripts` configuration allows you to specify an array of `.js` files to include in the build. The following example shows a configuration file specifying two JavaScript files to include in all builds.

```json
{
  "javascripts": {
    "files": ["css/first.js", "css/second.js"]
  }
}
```

You can insert links to the JavaScript files in the layout using the `{{ javascripts }}` liquid variable tag. This will insert each file as a separate `<script>` element.

```html
<html>
  <head>
    {{ javascripts }}
  </head>
  <body>
    {{ content }}
  </body>
</html>
```

As this is available as a build setting, you can easily add JavaScript files to some builds, while keeping other builds static.

### Destination

It is also possible to control where these JavaScript files are stored in the build. You can specify a custom destination folder by using the `destination` property. It defaults to `assets`.

```json
{
  "javascripts": {
    "destination": "customfolder"
  }
}
```

### Compress

The `compress` property will remove whitespace from the JavaScript files using UglifyJS, resulting in much smaller file sizes.

```json
{
  "javascripts": {
    "compress": true
  }
}
```

### Bundle

The `bundle` option will combine all the files in the `javascripts` array into a single JS file in the output. This, combined with the `compress` option, is recommended to improve the loading speed of a production website. You can set it to `true` or the desired name of the bundle.

```json
{
  "javascripts": {
    "bundle": "mybundle.js"
  }
}
```

### Digest

The `digest` option will add the md5 checksum of the file content to the filename, to allow you to set long caching headers for a production website.

```json
{
  "javascripts": {
    "digest": true
  }
}
```

## Fonts

When you want to use webfonts, simply create a folder called `fonts` in your book repo, save your fonts into this folder, and reference the font file using the `font-path()` scss helper function in your CSS.

```css
@font-face {
  font-family: "MyFont";
  src: font-path("MyFont.eot");
  src: font-path("MyFont.eot?#iefix") format("embedded-opentype"), font-path(
        "MyFont.woff"
      ) format("woff"), font-path("MyFont.ttf") format("truetype"), font-path(
        "MyFont.svg#robotobold"
      ) format("svg");
  font-weight: normal;
  font-style: normal;
}
```

### Source files

You can change where `magicbook` looks for fonts by supplying an array of globs, just like the general `files` array. The default pattern is `fonts/**/*.*`.

```json
{
  "fonts": {
    "files": "custom/fonts/folder/**/*.ttf"
  }
}
```

### Destination folder

By default, fonts will end up in the `assets` folder in each build. You can change this destination by using the `destination` property. The `font-path()` SCSS helper will automatically update the relative URL to the font.

```json
{
  "fonts": {
    "destination": "custom/assets/folder"
  }
}
```

## Table of Contents

There are often big limitations to auto-generated TOC markup, so instead of trying to guess what type of markup you want for your book, `magicbook` allows you to use liquid includes to generate your own TOC HTML.

`magicbook` will automatically parse all HTMLBook sections in your builds, and give you the ability to render a custom table of contents to your liking. First you need to add a liquid variable where ever you want your table of contents to appear. This can be in both a layout or content file.

```liquid
{{ toc }}
```

As liquid templates are evaluated before markdown conversion, and the table of contents structure is generated after markdown conversion, `magicbook` will first insert a placeholder string during the liquid processing, and then later in the build process replace this placeholder with the output of a special include named `toc.html`. To generate a table of contents, you must have this include in your includes folder. The include will have access to the following object tree:

```js
{
  id: "#id-of-the-section",
  type: "Type of HTMLBook section",
  label: "Title for section",
  children: [] // array of child sections
}
```

All projects created with `magicbook new` will have a `toc.html` include, and that's a good reference to see what's possible.

## Navigation

You can use the liquid `navigation` variable to create links that guides the reader through the pages. This is mostly used for `html` builds, where the liquid markup is used in the layout file.

```liquid
{% if navigation.prev %}
<a id="prev-link" href="{{ navigation.prev.href }}">Previous: {{navigation.prev.label}}</a>
{% endif %}

{% if navigation.next %}
<a id="next-link" href="{{ navigation.next.href }}">Next: {{navigation.next.label}}</a>
{% endif %}
```

## Layouts

Like most web frameworks, `magicbook` has the ability to wrap your content in a layout file. The liquid templating language is used for this, and this is what a layout file might look like:

```html
<html>
  <head>
    <title>My Book</title>
  </head>
  <body>
    {{ content }}
  </body>
</html>
```

To specify a layout to use, you can use the `layout` property in the JSON config.

```json
{
  "layout": "layouts/main.html"
}
```

Layouts support the use of liquid includes (even when the `liquid` plugin has been disabled). See more information under the `liquid` plugin. You can also control the layout per file via YAML frontmatter as explained below.

## Liquid

It is also possible to use Liquid templating in your source files. By default, each file has access to the following variables:

- `format` is a string with the name of the build format.
- `config` is an object with all the configuration settings for the specific format.
- `page` is an object with the YAML frontmatter variables from the particular file.

Using these variables, you can create books that have different markup in the different formats. Here's a simple file example.

```md
{% if format == 'pdf' %}
Here's some text for the PDF
{% else %}
Here's some text for all the other formats
{% endif %}
```

### Includes

You can use Liquid includes to re-use the same markup without copy/pasting. By default, `magicbook` will search for includes in the `includes` folder, so without any configuration settings, you can create a file in `includes/myview.html` that looks like this:

```html
<p>This is my include</p>
```

... and use the include in any files like this:

```md
{% include myview %}
```

If you want to pass variables to the include, you can add an attribute list to the `include` command, and those variables will be available in the include in `include.VARIABLENAME`.

```md
{% include myview onevar="This is one variable" anothervar="This is another variable" %}
```

You can change where `magicbook` looks for includes with the `includes` configuration setting.

```json
{
  "liquid": {
    "includes": "my/include/folder"
  }
}
```

This makes it possible to either have different includes for each format, or have a single include for all formats where the `format` liquid variable is used to generate specific template markup.

## YAML Frontmatter

You can specify YAML frontmatter in each file, and make those variables available as liquid variables in the file content. Here's a quick example of how this works.

```markdown
---
name: Rune Madsen
---

# About the author

The author, {{ name }}, was born in Denmark.
```

The YAML Frontmatter also allows you to override some configuration for each file. For example, you can specify a custom layout for a file. This will override any settings in the configuration file. You can set the layout to `none` if you wish to disable layouts for a single file.

```markdown
---
layout: layouts/introduction.html
---
```

This only works for the following configuration variables:

- `layout`
- `includes`

## Plugins

All functionality in `magicbook` is written via plugins. This makes it both possible to disable almost any functionality that you don't want, as well as easily adding new functionality in a custom plugin.

### Adding plugins

It's easy to write custom plugins for your book. You can place a file in your book repo and reference it in the plugins array. The following will try to load a file located at `plugins/myplugin.js` in the book folder.

```json
{
  "addPlugins": ["plugins/myplugin"]
}
```

You can also create plugins as NPM packages, simply using the name of the package.

```json
{
  "addPlugins": ["mypackage"]
}
```

Each plugin can hook into the build pipeline by registering in the plugin registry via the `add()`, `before()` and `after()` functions. Consult the `src/plugins/blank.js` file to see a vanilla plugin, or browse through the native plugin to see how they are implemented. To print the order of all plugin functions, run `magicbook build --verbose`.

If you create a custom plugin, please add the `magicbook-plugin` keyword, so it shows up on the [plugin list](https://www.npmjs.com/browse/keyword/magicbook-plugin).

### Removing plugins

If you want to remove native plugins, you can use the `disablePlugins` property. By using this property, you can disable almost all functionality in `magicbook`. To figure out what plugins you can disable, run `magicbook build --verbose`, which will output a list of all plugins. You should use the names before the `:`.

```json
{
  "disablePlugins": ["markdown"]
}
```

### Resetting plugins

If you want complete control over all plugins and their order, you can use the `plugins` setting. This specifies the exact order of all plugins, and plugins not present in the array will be disabled. The following will completely disable all plugins in `magicbook`.

```json
{
  "plugins": []
}
```

Using the `plugins` array is not recommended unless you know what you're doing.

## Command line

### `build`

Builds the book.

```bash
magicbook build
```

You can specify the path to a configuration file by using the `--config` argument.

```bash
magicbook build --config=myconfig.json
```

To automatically build your book whenever a file changes, use the `--watch` flag.

```bash
magicbook build --watch
```

To see extra debug info, use the `--verbose` flag.

```bash
magicbook build --verbose
```

## Running the tests

Run the jasmine tests:

`npm test`

Run a V8 profiling build of the example folder:

`npm run benchmark`
