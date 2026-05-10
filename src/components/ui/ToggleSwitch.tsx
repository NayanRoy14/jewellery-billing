interface Props {
  leftLabel: string;
  rightLabel: string;
  isRight: boolean;
  onToggle: () => void;
  className?: string;
}

export function ToggleSwitch({ leftLabel, rightLabel, isRight, onToggle, className = '' }: Props) {
  return (
    <div
      role="group"
      aria-label="Toggle option"
      className={['flex rounded-xl border border-gray-200 bg-gray-100 p-1 gap-1', className].join(' ')}
    >
      <button
        type="button"
        onClick={() => isRight && onToggle()}
        aria-pressed={!isRight}
        className={[
          'flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all duration-150',
          !isRight
            ? 'bg-gold-600 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-800',
        ].join(' ')}
      >
        {leftLabel}
      </button>
      <button
        type="button"
        onClick={() => !isRight && onToggle()}
        aria-pressed={isRight}
        className={[
          'flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all duration-150',
          isRight
            ? 'bg-gold-600 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-800',
        ].join(' ')}
      >
        {rightLabel}
      </button>
    </div>
  );
}
