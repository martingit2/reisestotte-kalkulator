import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSwitcher.module.css';
import { IconWorld } from '@tabler/icons-react';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={styles.switcherContainer}>
      <IconWorld size={20} stroke={1.5} />
      <button
        onClick={() => changeLanguage('no')}
        className={i18n.language.startsWith('no') ? styles.active : ''}
      >
        Norsk
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={i18n.language.startsWith('en') ? styles.active : ''}
      >
        English
      </button>
    </div>
  );
};

export default LanguageSwitcher;