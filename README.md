# JS CodeFormer #

**Get this extension from the VS Marketplace**

https://marketplace.visualstudio.com/items?itemName=cmstead.js-codeformer

## What and Why ##

JS CodeFormer is a JS refactoring and code automation extension for VS Code. Born from the ashes of JS Refactor, JS CodeFormer answers a new question. Instead of asking "can a JS refactoring tool be made for VS Code", this project aims to answer "how can better tools help to create better software?"

JS CodeFormer is a suite of tools purpose built to simplify the process of creating and editing software in a JavaScript environment.

## Core Principles ##

JS CodeFormer is not just a code refactoring and automation extension, it is an extension which is built upon these core principles:

- **Robustness** -- JS CodeFormer must work reliably and predictably in a broad range of code environments and styles
- **Communication** -- If JS CodeFormer fails, it should provide immediate feedback to the user; the feedback should be as clear as possible
- **Usability** -- It should be easy to find your way around the tool, even at the start
- **Accessibility** -- Clear, direct access to the tooling must be supported for all users regardless of disability 

None of these principles can be treated as "set it and forget it". Every new behavior, and every improvement receives serious thought as to how it will serve, and impact the developer using this tool.

## Language Support ##

The core languages in this list have been tested through active production use of the extension. Frameworks have been, at the least, smoke-tested on example production code.

Languages:

- JavaScript
- TypeScript
- HTML (Embedded Javascript)

Frameworks:

- Angular
- React
- Vue

Framework-specific formats:

- JSX
- TSX
- Vue Single-file components
    - Full Vue support requires the Vetur extension: https://marketplace.visualstudio.com/items?itemName=octref.vetur

Experimental framework support:

- Svelte -- requires the Svelte extension to work
    - https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode

## Refactoring ##

JS CodeFormer automated refactorings are built upon years of experience to be stable and reliable. Though the project is new, and issues will inevitably arise, the tools in this project are used to support the project itself. In essence, JS CodeFormer is a self-dogfooding project.

Current refactorings:

- Extract Method/Function
    - Windows: ctrl+shift+j, m
    - Mac: cmd+shift+j, m
- Extract to Parameter
    - no keybinding
- Extract Variable
    - Windows: ctrl+shift+j, v
    - Mac: cmd+shift+j, v
- Inline Variable
    - Windows: ctrl+shift+j, i
    - Mac: cmd+shift+j, i
- Rename (important for non js/ts files)
    - Windows: ctrl+shift+j, r
    - Mac: cmd+shift+j, r

## Conversions ##

Conversions may or may not introduce a different behavior. This means they are in a class of their own. The following conversions are currently available:

- Select Conversion
    - Windows: ctrl+shift+j, c
    - Mac: cmd+shift+j, c
- Convert to Arrow Function
    - convert a function expression or declaration to an arrow function
    - no keybinding
- Convert to Function Expression
    - convert a function declaration or arrow function to a function expression
    - no keybinding
- Convert to Function Declaration
    - convert a function assigned to a variable declaration to a function declaration
    - no keybinding
- Convert to Method
    - convert a function property on a class to a method declaration
    - no keybinding
- Convert to Template Literal
    - convert a string, or string concatenation to a template literal
    - no keybinding

## Actions ##

Not everything we want to do with our code is a refactoring. That doesn't mean we can't automate it. Actions aim to pair with the supported refactorings in order to provide a smooth development experience.

Current Actions:

- Select Action (Action Palette)
    - Windows: ctrl+shift+j, p
    - Mac: cmd+shift+j, p
- Surround with
    - Keybindings (hot keys)
        - Windows: ctrl+shift+j, w
        - Mac: cmd+shift+j, w
    - There are a significant number of available templates, and the list grows regularly
- Change variable type
    - Change variable declaration type from current type to const, let, or var
    - No keybinding
- Introduce variable
    - Introduce variable declaration into the code from selected variable use
- Introduce function
    - Introduce function declaration into the code from selected function name or call
- Lift and name function expression
    - Lift selected function from its current position and name/rename it

## Contributors and Thanks #

It's important to understand that not all contributions to a project are, or can be committed to the source repository. With that in mind, the following are people who have provided help and insights which might not have a name on a commit:

- [Jenn Zenk](https://github.com/jzenk) -- Accessibility feedback
- [Ashlee Boyer](https://twitter.com/AshleeMBoyer) -- Accessibility feedback

Also, every person who submitted a bug or enhancement on JS Refactor, and those who offer them on this project!

## Find Me ##

The best place to find me is on Twitter: [@cm_stead](https://twitter.com/cm_stead)

## What's Next ##

JS CodeFormer is currently in a "baking in" period where behaviors are being tested and any bugs/shortcomings can be identified and resolved. As it looks like bug discovery has slowed, this will shift to V1.0.0 and the next most valuable piece of work will be identified and introduced.

## Known/Expected Issues ##

Rename:

- Renaming variables do not propagate to template HTML in Vue and Svelte
- Renaming MAY not propagate into JSX nodes within reactjavascript and reacttypescript (not tested)