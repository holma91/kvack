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

FROM NOW ON:

- ALL STATE IN MAIN. -> renderer.

## Bug lists

- when focus is not on mainWindow and tabbing, the focus doesn't land on the input bar in the new tab
- shortcuts including the arrow keys when input field is focused

### Context isolation
