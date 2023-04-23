# Changelog

## 0.1.31

* Added Feature: Image color space transformation

## 0.1.30

* `Apple M1` compatibility
* Bumping `prince` version, and switch `node-sass` to `sass`

## 0.1.20

* Fixing path issues on Windows
* Bumping `prince` and `lodash` dependencies

## 0.1.19

* Added ability to debug via `DEBUG=magicbook:* magicbook build`
* Fixed a problem where footnotes would remove layouts
* Added test and README related to disabling layouts

## 0.1.18

* Updating dependencies

## 0.1.17

* Fixing problem with HTML builds having two nested `<html>` tags

## 0.1.16

* Updating `node-sass` to work on newest OSX
* Updating `prince` package

## 0.1.15

* Updating cheerio to rc2
* Removing unnecessary dependencies

## 0.1.14

* Fixing bug where cross references weren't working from files in subfolders
* Fixing bug where cross references weren't working with permalinks

## 0.1.13

* Bumping version of prince package

## 0.1.12

* Speeding up liquid rendering by not adding liquid locals to each file where it's not needed

## 0.1.11

* Fixed table of contents generation so all links are relative to the file the toc is inserted into
