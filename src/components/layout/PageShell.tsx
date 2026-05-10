import type { ReactNode } from 'react';

interface Props {
  title?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function PageShell({ title, children, action }: Props) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {title && (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 safe-top">
          <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto w-full">
            <h1 className="text-lg font-bold text-gray-900">{title}</h1>
            {action && <div>{action}</div>}
          </div>
        </header>
      )}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-lg mx-auto w-full px-4 py-4">
          {children}
        </div>
      </main>
    </div>
  );
}
