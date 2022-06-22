// START: Import React and Dongles
import { FiSettings } from 'react-icons/fi';

// START: Import React Functional Components
import ContentHeader from '../../../Global/ContentHeader/ContentHeader';

// START: Import Local Files
import styles from './LimitHeader.module.css';
import { TokenPairIF } from '../../../../utils/interfaces/exports';
import settingsIcon from '../../../../assets/images/icons/settings.svg';

// interface for component props
interface LimitHeaderPropsIF {
    tokenPair: TokenPairIF;
    isDenomBase: boolean;
}

// central react functional component
export default function LimitHeader(props: LimitHeaderPropsIF) {
    const { tokenPair, isDenomBase } = props;

    return (
        <ContentHeader>
            <span />
            <div className={styles.token_info}>
                {isDenomBase ? tokenPair.dataTokenA.symbol : tokenPair.dataTokenB.symbol} /{' '}
                {isDenomBase ? tokenPair.dataTokenB.symbol : tokenPair.dataTokenA.symbol}
            </div>
            <div>
                <img src={settingsIcon} alt='settings' />
            </div>
        </ContentHeader>
    );
}
