<h1 align="center">Kompacted - Simple Component Manager</h1>
<br>
<p align="center">
  <em>Kompacted is a library meant to facilitate the production of web applications
    <br> using JavaScript by implementing client-side components.</em>
  <br>
  <br>
  <a href="https://github.com/AxelBilla/Kompacted/releases/"><img src="https://img.shields.io/github/release/AxelBilla/Kompacted?include_prereleases=&sort=semver&color=blue" alt="GitHub release"></a>
  <a href="#license"><img src="https://img.shields.io/badge/License-CC_BY--SA_4.0-blue" alt="License"></a>
  <a href="https://github.com/AxelBilla/Kompacted/issues"><img src="https://img.shields.io/github/issues/AxelBilla/Kompacted" alt="issues - Kompacted"></a>
</p>
<br>
<br>
<h1 align="center">Documentation</h1>
<br>
<h2 align="center">Basics</h2>
<p align="right">? = Optional</p>

### `Kompacted.new(templates, ?scope, ?deep)` : `void`
    (func)        [templates]: Collection of Kompacted.add() wrapped in a function.
    (HTMLElement) [scope]: Element from which to start a Kompacted.load().
    (boolean)     [depth]: Whether Komps should be children of their Kompact/Foreach or replace them.
  <p align="center">Wrapper to harmonize the creation of Komps (template), automatically loads Komps if given a scope.</p>
  <br>
<h2 align="center"></h2>

### `Kompacted.add(name, html, ?type, ?func)` : `Kompacted.template`
    (string)      [name]: Identifier of the Komp (template), to be referenced in the "as" attribute of Kompact/Foreach tags.
    (string)      [html]: HTML content of the Komp (template).
    (string)      [type]: Type of event the Komp will listen to upon being loaded.
    (func)        [func]: Function to execute when the Komp's listened event is triggered.
    
  <p align="center">Creates a Komp template and registers it in its instance of Kompacted's template list.</p>
  <br>
<h2 align="center"></h2>

### `Kompacted.edit(name, html, ?type, ?func)` : `void`
    (string)      [name]: Identifier of the Komp (template) to be edited.
    (string)      [html]: HTML content of the Komp (template).
    (string)      [type]: Type of event the Komp will listen to upon being loaded.
    (func)        [func]: Function to execute when the Komp's listened event is triggered.
    
  <p align="center">Edits an already existing Komp template (runtime).</p>
  <br>
<h2 align="center"></h2>

### `Kompacted.set(id, data_array)` : `void`
    (key)         [id]: Identifier of the data.
    (object)      [data_array]: JSON/Array object accessible in Kompact/Foreach tags via its ID.
    
  <p align="center">Sets a set of data to a given identifier, to be referenced in the "src" attribute of Kompact/Foreach tags.</p>
  <br>
<h2 align="center"></h2>

### `Kompacted.load(?scope, ?depth)` : `void`
    (HTMLElement) [scope]: Element from which to start loading Komps recursively from (defaults to document).
    (boolean)     [depth]: Whether Komps should be children of their Kompact/Foreach or replace them.
    
  <p align="center">Loads all Komps of its Kompacted instance.</p>
  <br>
<h2 align="center"></h2>

### `[STATIC]` `Kompacted.load(scope, depth, kompacted)` : `void`
    (HTMLElement) [scope]: Element from which to start loading Komps recursively from.
    (boolean)     [depth]: Whether Komps should be children of their Kompact/Foreach or replace them.
    (object)      [kompacted]: List of Kompacted instances to load Komps from.
    
  <p align="center">Allows users to load Komps from different instances of Kompacted at once.</p>
  <br>
<br>
<br>
<br>
<h2 align="center">Advanced</h2>
w.I.P.
