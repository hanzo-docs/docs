# Level 1: Introduction to Autonomous Stacks

## Why?
To move from manual workflows to autonomous execution, we need to treat agents as first-class citizens. Autonomous stacks reduce latency between intent and action, enabling complex, multi-step operations without constant human intervention.

## How?
By defining clear CRM schemas and using the Hanzo Agent SDK, we can bootstrap autonomous agents that handle tasks based on pre-defined triggers.

### Technical Implementation
```bash
# Initialize a new Hanzo Stack project
hanzo up --template job
```

The stack includes:
- Autonomous agent container
- CRM schema integration
- Monitoring & logging via `hanzo.market`
