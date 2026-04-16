import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: React.ElementType;
}

export default function GlassCard({
  children,
  className,
  hover = false,
  as: Tag = 'div',
}: GlassCardProps) {
  return (
    <Tag className={cn('glass-card', hover && 'glass-card-hover', className)}>
      {children}
    </Tag>
  );
}
