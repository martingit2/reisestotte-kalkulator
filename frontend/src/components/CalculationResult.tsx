import React from 'react';
import styles from './CalculationResult.module.css';
import { IconCircleCheck  } from '@tabler/icons-react';

interface CalculationResultProps {
  amount: number | null;
  onClose: () => void;
}

const CalculationResult: React.FC<CalculationResultProps> = ({ amount, onClose }) => {
  if (amount === null) {
    return null;
  }

  const isPositiveSupport = amount > 0;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <IconCircleCheck size={48} className={styles.icon} />
          <h2>Beregning Fullført</h2>
        </div>
        <div className={styles.content}>
          <p className={styles.label}>Estimert reisestøtte:</p>
          <p className={`${styles.amount} ${isPositiveSupport ? styles.positive : styles.zero}`}>
            {amount.toFixed(2)} kr
          </p>
          {isPositiveSupport ? (
            <p className={styles.info}>Beløpet er basert på de oppgitte reisedataene og et forenklet regelsett.</p>
          ) : (
            <p className={styles.info}>Reisen kvalifiserer ikke for støtte, sannsynligvis på grunn av for kort avstand eller at reisekostnaden er lavere enn egenandelen.</p>
          )}
        </div>
        <button onClick={onClose} className={styles.closeButton}>Lukk</button>
      </div>
    </div>
  );
};

export default CalculationResult;