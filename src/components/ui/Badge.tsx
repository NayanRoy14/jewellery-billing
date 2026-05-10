interface Props {
  online: boolean;
}

export function OnlineBadge({ online }: Props) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
        online ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700',
      ].join(' ')}
    >
      <span
        className={[
          'w-1.5 h-1.5 rounded-full',
          online ? 'bg-green-500' : 'bg-orange-500',
        ].join(' ')}
      />
      {online ? 'Online' : 'Offline'}
    </span>
  );
}

interface SyncBadgeProps {
  status: 'pending' | 'synced' | 'error';
}

export function SyncBadge({ status }: SyncBadgeProps) {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-700',
    synced: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
  };
  const labels = {
    pending: 'Pending sync',
    synced: 'Synced',
    error: 'Sync error',
  };

  return (
    <span className={['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', styles[status]].join(' ')}>
      {labels[status]}
    </span>
  );
}
