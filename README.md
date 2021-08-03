# JS CodeFormer #

JS CodeFormer is a JS refactoring and code automation extension for VS Code. Born from the ashes of JS Refactor, JS CodeFormer answers a new question. Instead of asking "can a JS refactoring tool be made for VS Code", this project aims to answer "how can better tools help to create better software?"

JS CodeFormer is a suite of tools purpose built to simplify the process of creating software in a JavaScript environment.

## Refactoring ##

JS CodeFormer automated refactorings are built upon years of experience to be stable and reliable. Though the project is new, and issues will inevitably arise, the tools in this project are used to support the project itself. In essence, JS CodeFormer is a self-dogfooding project.

Current refactorings:

- Extract Method/Function
- Extract Variable
- Inline Variable

## Actions ##

Not everything we want to do with our code is a refactoring. That doesn't mean we can't automate it. Actions aim to pair with the supported refactorings in order to provide a smooth development experience.

Current Actions:

- Surround with
    - Arrow function
    - Function
    - Try/Catch
    - Variable

## What's Next ##

This project is still in active development, so new refactorings and actions are bound to be added regularly. With that in mind, not all code automation tools will make the cut. The goal is not to be an exhaustive tool, but a carefully designed tool, built to smooth and speed the software development experience.

Current outstanding behavior work:

- Refactorings
    - [ ] Rename (primarily for JS embedded in HTML support)
    - [ ] Extract to parameter
    - [ ] Lift and name anonymous function
- Actions
    - [ ] Change variable type
    - [ ] Convert to arrow function
    - [ ] Convert to function expression
    - [ ] Convert string to template literal
    - [ ] Introduce variable
