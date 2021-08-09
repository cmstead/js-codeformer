# JS CodeFormer #

JS CodeFormer is a JS refactoring and code automation extension for VS Code. Born from the ashes of JS Refactor, JS CodeFormer answers a new question. Instead of asking "can a JS refactoring tool be made for VS Code", this project aims to answer "how can better tools help to create better software?"

JS CodeFormer is a suite of tools purpose built to simplify the process of creating software in a JavaScript environment.

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

## Conversions ##

Conversions may or may not introduce a different behavior. This means they are in a class of their own. The following conversions are currently available:

- Convert to Arrow Function
    - convert a function expression or declaration to an arrow function
    - no keybinding
- Convert to Function Expression
    - convert a function declaration or arrow function to a function expression
    - no keybinding
- Convert to Function Declaration
    - convert a function assigned to a variable declaration to a function declaration
    - no keybinding

## Actions ##

Not everything we want to do with our code is a refactoring. That doesn't mean we can't automate it. Actions aim to pair with the supported refactorings in order to provide a smooth development experience.

Current Actions:

- Surround with
    - Keybindings (hot keys)
        - Windows: ctrl+shift+j, w
        - Mac: cmd+shift+j, w
    - Available templates
        - Arrow function
        - Function
        - Try/Catch
        - Variable

- Select Action (Action Palette)
    - Windows: ctrl+shift+j, p
    - Mac: cmd+shift+j, p

## What's Next ##

This project is still in active development, so new refactorings and actions are bound to be added regularly. With that in mind, not all code automation tools will make the cut. The goal is not to be an exhaustive tool, but a carefully designed tool, built to smooth and speed the software development experience.

Current outstanding behavior work:

- Refactorings
    - [ ] Rename (primarily for JS embedded in HTML support)
    - [x] Extract to parameter
- Conversions
    - [x] Convert to arrow function
    - [x] Convert to function expression
    - [x] Convert to function declaration
    - [ ] Convert string to template literal
- Actions
    - [ ] Change variable type
    - [ ] Introduce variable
    - [ ] Lift and name anonymous function
