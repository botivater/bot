# Event Flow
## Table of Contents
- [Event Flow](#event-flow)
  - [Table of Contents](#table-of-contents)
  - [Architecture](#architecture)
  - [Triggers](#triggers)
  - [Conditions](#conditions)
  - [Actions](#actions)

## Architecture
We store so called "event flows" in the database. These relate to customizable flows that an admin can create.  
An event flow has 3 main parts:
- Triggers
- Conditions
- Actions

## Triggers
A trigger can be anything, a message, a reaction, a new user....

## Conditions
A condition is an prerequiste for the actions to run.  
For example, a new reaction has been added to a message, we may want to send a message based on which reaction has been added. For that we can make use of conditions.

## Actions
An action is the actual execution of the flow. It will do things like send a message, add a role, remove a role....
