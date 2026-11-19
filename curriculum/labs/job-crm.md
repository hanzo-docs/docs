# Lab: Job CRM (Freelance-Ops)

## Objective
Automate your freelance operations and job application pipeline using the Hanzo Stack.

## Steps
1. **Initialize Template**
   ```bash
   hanzo template install Freelance-Ops
   cd Freelance-Ops
   hanzo up
   ```
2. **Configure Pipeline**
   - Edit `src/agents/PipelineAgent.ts` to connect your preferred job sources.
3. **Verify**
   ```bash
   hanzo run Freelance-Ops --verify
   ```
4. **Certification**
   - Submit metrics to `hanzo.market` to verify your autonomous job tracker.
