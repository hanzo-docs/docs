# Lab: Trade CRM

## Objective
Implement an autonomous agent to monitor market signals and manage trade workflows.

## Steps
1. **Initialize Template**
   ```bash
   hanzo template install trade-crm
   cd trade-crm
   hanzo up
   ```
2. **Configure Agents**
   - Edit `src/agents/LeadAgent.ts` to define your trading strategy and risk parameters.
3. **Verify**
   ```bash
   hanzo run trade-crm --verify
   ```
4. **Certification**
   - Use `hanzo.market` to verify your trade automation performance metrics.
