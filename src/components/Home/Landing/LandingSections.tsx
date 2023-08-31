import liquidityImage from '../../../assets/images/home/liquidity.png';
import orderImage from '../../../assets/images/home/orders.png';
import Investors from './Investors';
import Footer from '../../Footer/Footer';
import TradeNowButton from './TradeNowButton/TradeNowButton';
import bg1 from '../../../assets/images/home/home2.png';
import bg2 from '../../../assets/images/home/home3.png';
import bg3 from '../../../assets/images/home/home4.png';
import useMediaQuery from '../../../utils/hooks/useMediaQuery';
import {
    SlideContainer,
    RowContainer,
    FasterSection,
    BGImage,
} from './LandingSections.styles';

export default function LandingSections() {
    const showMobileVersion = useMediaQuery('(max-width: 600px)');

    const secondRow = (
        // TODO: height can probaly be simplified - compare to figma
        <SlideContainer tabletHeight='medium' style={{ height: '500px' }}>
            <RowContainer>
                <FasterSection>
                    <h1 tabIndex={0}>
                        Zero-to-One Decentralized Trading Protocol
                    </h1>
                    <h2 tabIndex={0}>Faster, Easier, and Cheaper</h2>
                    <p tabIndex={0}>
                        Ambient runs the entire DEX inside a single smart
                        contract, allowing for low-fee transactions, greater
                        liquidity rewards, and a fairer trading experience.
                    </p>
                    <TradeNowButton />
                </FasterSection>
            </RowContainer>
        </SlideContainer>
    );

    const thirdRow = (
        <SlideContainer tabletHeight='large'>
            <RowContainer>
                <img
                    src={liquidityImage}
                    alt='concentrated and ambient liquidity'
                    width='331px'
                    height='420px'
                />
                <FasterSection>
                    <h2 tabIndex={0}>Deep, Diversified Liquidity</h2>
                    <p tabIndex={0}>
                        Ambient is built for diversified, sustainable liquidity
                        that fixes the broken LP economics of AMMs. It is also
                        the only DEX to support concentrated (‘V3’), ambient
                        (‘V2’) and knock-out liquidity in the same liquidity
                        pool.
                    </p>
                </FasterSection>
            </RowContainer>
        </SlideContainer>
    );

    const fourthRow = (
        <SlideContainer tabletHeight='large'>
            <RowContainer>
                <FasterSection>
                    <h2 tabIndex={0}>
                        Bridge the Gap Between Trading and LP’ing
                    </h2>
                    <p tabIndex={0}>
                        Make your LP position a trading position – and vice
                        versa – using our range and limit orders.
                    </p>
                    <p tabIndex={0}>
                        Ambient combines liquidity in a single pool, allowing
                        for greater rewards for liquidity providers, and less
                        impact for traders.
                    </p>
                </FasterSection>
                <img
                    src={orderImage}
                    alt='range and limit orders'
                    width='240px'
                    height='420px'
                />
            </RowContainer>
        </SlideContainer>
    );

    const fifthRow = (
        <SlideContainer tabletHeight='large'>
            <RowContainer>
                <div />
                <FasterSection>
                    <h2 tabIndex={0}>Better than CEX</h2>
                    <p tabIndex={0}>
                        Built for traders and market makers of all kinds,
                        Ambient introduces novel DeFi-native features and an
                        array of quality-of-life improvements allowing for a
                        best-in-class user experience.
                    </p>
                    <TradeNowButton />
                </FasterSection>
            </RowContainer>
        </SlideContainer>
    );

    return (
        <div style={{ position: 'relative' }}>
            <BGImage src={bg1} alt='bg1' height={600} top={100} />
            <BGImage src={bg2} alt='bg2' height={500} top={870} />
            <BGImage src={bg3} alt='bg3' height={600} top={1750} />

            {secondRow}
            {thirdRow}
            {fourthRow}

            {fifthRow}

            {!showMobileVersion && <Investors />}
            <Footer />
        </div>
    );
}
