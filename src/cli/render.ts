import { computeRenderPlan } from '../core/render-plan';

let input = '';

process.stdin.setEncoding('utf-8');
process.stdin.on('data', (chunk: string) => { input += chunk; });
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const plan = computeRenderPlan(
      data.nodes ?? [],
      data.edges ?? [],
      data.config ?? {},
    );
    process.stdout.write(JSON.stringify(plan));
  } catch (err: any) {
    process.stderr.write(JSON.stringify({ error: err.message }));
    process.exit(1);
  }
});
