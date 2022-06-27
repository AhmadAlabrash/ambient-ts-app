import styles from './EditPriceInfo.module.css';
// import { TokenPairIF } from '../../../../../utils/interfaces/exports';

interface EditPriceInfoIF {
    quoteTokenSymbol: string;
    tokenAQtyDisplay: string;
    tokenBQtyDisplay: string;
    baseTokenSymbol: string;
    ambient: boolean;
    lowRangeDisplay: string;
    highRangeDisplay: string;
}

export default function EditPriceInfo(props: EditPriceInfoIF) {
    // JSX frag to display the pool price for the current pair
    const currentPrice = (
        <div className={styles.price_info_row}>
            <span>Current Price</span>
            <span>2,800</span>
        </div>
    );

    // JSX frag to display the estimated APY of the position
    const estimatedAPY = (
        <div className={styles.price_info_row}>
            <span>Est.APY</span>
            <span className='primary_apy'>35.68%</span>
        </div>
    );

    // JSX frag to display text for the table head
    const tableHead = (
        <thead>
            <tr>
                <th></th>
                <th>Current</th>
                <th>Repositioned To</th>
            </tr>
        </thead>
    );

    // JSX frag to display the balance of Token A
    const balanceTokenA = (
        <tr>
            <td data-column='Target: '>{props.baseTokenSymbol} Balance</td>
            <td data-column='Current'>{props.tokenAQtyDisplay}</td>
            <td data-column='Repositioned To'>0.69</td>
        </tr>
    );

    // JSX frag to display the balance of Token B
    const balanceTokenB = (
        <tr>
            <td data-column='Target: '>{props.quoteTokenSymbol} Balance</td>
            <td data-column='Current'>{props.tokenBQtyDisplay}</td>
            <td data-column='Repositioned To'>500.0</td>
        </tr>
    );

    // JSX frag to display the upper price limit of the position
    const rangeUpperLimit = (
        <tr>
            <td data-column='Target: '>Range Upper Limit</td>
            <td data-column='Current'>{props.highRangeDisplay}</td>
            <td data-column='Repositioned To'>2,1210.0</td>
        </tr>
    );

    // JSX frag to display the lower price limit of the position
    const rangeLowerLimit = (
        <tr>
            <td data-column='Target: '>Range Lower Limit</td>
            <td data-column='Current'>{props.lowRangeDisplay}</td>
            <td data-column='Repositioned To'>3,200.0</td>
        </tr>
    );

    return (
        <div className={styles.price_info_container}>
            <div className={styles.price_info_content}>
                {currentPrice}
                {estimatedAPY}
                <div className={styles.advanced_table_display}>
                    <table>
                        {tableHead}
                        <tbody>
                            {balanceTokenA}
                            {balanceTokenB}
                            {props.ambient == false && rangeUpperLimit}
                            {props.ambient == false && rangeLowerLimit}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
