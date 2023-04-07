STEPS when adding a integration:

1. create extension and add to extensions map
2. create a group including the extension
3. add the group to the settings
4. add necessary things to forge.config.ts
5. create preload file
6. add necessary things to Search.tsx
7. study the html/css and add stuff to the preload (css and js)

## TODO

share stuff between main and preload.

every time the selectedGroup value change, send the new value to the renderer.

how to keep track of the current url for every view?
every extendedView keeps track of their current url.

- start with entryUrl
- listen to did-navigate event on every browserview
  with this in mind, the view will always know the current url
  we have the extensions in order in the pages array

how to send the url to the renderer?

## Bug lists

- when focus is not on mainWindow and tabbing, the focus doesn't land on the input bar in the new tab
- shortcuts including the arrow keys when input field is focused

## History

every search goes through the main process
save query with group id and extension id
