import React from 'react';
import { IconCar, IconBus, IconTrain, IconPlane, IconQuestionMark } from '@tabler/icons-react';
import styles from './TransportSelector.module.css';

const transportOptions = [
  { name: 'Egen bil', icon: IconCar },
  { name: 'Kollektivtransport', icon: IconBus },
  { name: 'Tog', icon: IconTrain },
  { name: 'Fly', icon: IconPlane },
  { name: 'Annet', icon: IconQuestionMark },
];

interface TransportSelectorProps {
  selectedValue: string;
  onSelect: (value: string) => void;
}

const TransportSelector: React.FC<TransportSelectorProps> = ({ selectedValue, onSelect }) => {
  return (
    <div className={styles.selectorContainer}>
      {transportOptions.map(option => (
        <button
          key={option.name}
          type="button"
          className={`${styles.optionButton} ${selectedValue === option.name ? styles.selected : ''}`}
          onClick={() => onSelect(option.name)}
        >
          <option.icon size={20} stroke={1.5} />
          <span>{option.name}</span>
        </button>
      ))}
    </div>
  );
};

export default TransportSelector;