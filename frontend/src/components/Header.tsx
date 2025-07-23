import React from 'react';
import styles from './Header.module.css';
import { IconPuzzle } from '@tabler/icons-react';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  return (
    <header className={styles.appHeader}>
      <div className={styles.logoContainer}>
        <IconPuzzle size={28} stroke={1.5} />
        <span>Reisestøtte</span>
      </div>
      <div className={styles.navLinks}>
        {/* Her kunne man hatt linker som "Om", "Kontakt", etc. i en større app */}
      </div>
      <LanguageSwitcher />
    </header>
  );
};

export default Header;