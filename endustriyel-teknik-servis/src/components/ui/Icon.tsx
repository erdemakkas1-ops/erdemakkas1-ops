import { Cog, Cpu, Gauge, Wrench, Zap, type LucideProps } from 'lucide-react';
import type { ServiceIcon } from '@/data/services';

const map = { zap: Zap, cog: Cog, cpu: Cpu, gauge: Gauge, wrench: Wrench };

export function ServiceIconView({ name, ...props }: { name: ServiceIcon } & LucideProps) {
  const C = map[name];
  return <C aria-hidden="true" {...props} />;
}
