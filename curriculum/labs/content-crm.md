# Lab: Content-Creator CRM

## Objective
Automate your content production pipeline—from idea generation to distribution—using autonomous agents.

## Steps
1. **Initialize Template**
   ```bash
   hanzo template install content-crm
   cd content-crm
   hanzo up
   ```
2. **Configure Pipeline**
   - Edit `src/agents/ContentAgent.ts` to connect your social platforms and content sources.
3. **Verify**
   ```bash
   hanzo run content-crm --verify
   ```
4. **Certification**
   - Verify your content agent with `hanzo.market` to ensure it meets production standards.
