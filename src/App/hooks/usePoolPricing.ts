import { ChainSpec, CrocEnv, toDisplayPrice } from '@crocswap-libs/sdk';
import { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../utils/hooks/reduxToolkit';
import {
    setLimitTick,
    setPoolPriceNonDisplay,
} from '../../utils/state/tradeDataSlice';
import { SpotPriceFn } from '../../ambient-utils/dataLayer';
import { CrocEnvContext } from '../../contexts/CrocEnvContext';
import { TradeDataContext } from '../../contexts/TradeDataContext';
import { RangeContext } from '../../contexts/RangeContext';
import { CachedDataContext } from '../../contexts/CachedDataContext';
import { CACHE_UPDATE_FREQ_IN_MS } from '../../ambient-utils/constants';

interface PoolPricingPropsIF {
    crocEnv?: CrocEnv;
    pathname: string;
    baseTokenAddress: string;
    quoteTokenAddress: string;
    baseTokenDecimals: number;
    quoteTokenDecimals: number;
    chainData: ChainSpec;
    receiptCount: number;
    isUserLoggedIn: boolean;
    lastBlockNumber: number;
    isServerEnabled: boolean;
    cachedQuerySpotPrice: SpotPriceFn;
}

/* Hooks to pull the pricing data for a given pool, including spot price and 24-hour direction change */
export function usePoolPricing(props: PoolPricingPropsIF) {
    const dispatch = useAppDispatch();
    const tradeData = useAppSelector((state) => state.tradeData);
    const { isDenomBase, setDidUserFlipDenom } = useContext(TradeDataContext);
    const { setPrimaryQuantityRange } = useContext(RangeContext);
    const { activeNetwork } = useContext(CrocEnvContext);

    const { cachedGet24hChange } = useContext(CachedDataContext);

    // value for whether a pool exists on current chain and token pair
    // ... true => pool exists
    // ... false => pool does not exist
    // ... null => no crocEnv to check if pool exists
    const [isPoolInitialized, setIsPoolInitialized] = useState<
        boolean | undefined
    >();

    const [poolPriceDisplay, setPoolPriceDisplay] = useState<
        number | undefined
    >();

    const [poolPriceChangePercent, setPoolPriceChangePercent] = useState<
        string | undefined
    >();
    const [isPoolPriceChangePositive, setIsPoolPriceChangePositive] =
        useState<boolean>(true);

    const getDisplayPrice = (spotPrice: number) => {
        return toDisplayPrice(
            spotPrice,
            props.baseTokenDecimals,
            props.quoteTokenDecimals,
        );
    };

    const getSpotPrice = async (
        baseTokenAddress: string,
        quoteTokenAddress: string,
    ) => {
        if (!props.crocEnv) {
            return;
        }
        return await props.cachedQuerySpotPrice(
            props.crocEnv,
            baseTokenAddress,
            quoteTokenAddress,
            props.chainData.chainId,
            props.lastBlockNumber,
        );
    };

    // Reset pricing states that require asynchronous updates when pool changes
    useEffect(() => {
        setPoolPriceDisplay(0);
        setIsPoolInitialized(undefined);
        setPrimaryQuantityRange('');
        setPoolPriceDisplay(undefined);
        setDidUserFlipDenom(false); // reset so a new token pair is re-evaluated for price > 1
        setPoolPriceChangePercent(undefined);
        if (!props.pathname.includes('limitTick')) {
            dispatch(setLimitTick(undefined));
        }
    }, [
        props.baseTokenAddress,
        props.quoteTokenAddress,
        props.chainData.chainId,
    ]);

    // hook to update `poolExists` when pool or crocEnv changes, or a new transaction receipt arrives
    useEffect(() => {
        if (
            props.crocEnv &&
            props.baseTokenAddress &&
            props.quoteTokenAddress
        ) {
            if (
                props.baseTokenAddress.toLowerCase() ===
                props.quoteTokenAddress.toLowerCase()
            )
                return;
            // token pair has an initialized pool on-chain
            // returns a promise object
            const doesPoolExist = props.crocEnv
                // TODO: make this function pill addresses directly from URL params
                .pool(props.baseTokenAddress, props.quoteTokenAddress)
                .isInit();
            // resolve the promise object to see if pool exists
            Promise.resolve(doesPoolExist)
                // track whether pool exists on state (can be undefined)
                .then((res) => setIsPoolInitialized(res));
        }
    }, [
        props.crocEnv,
        props.baseTokenAddress,
        props.quoteTokenAddress,
        props.chainData.chainId,
        props.receiptCount,
    ]);

    // useEffect to asyncronously query spot price when tokens change and block updates
    useEffect(() => {
        if (
            props.crocEnv &&
            props.baseTokenAddress &&
            props.quoteTokenAddress &&
            props.lastBlockNumber !== 0
        ) {
            (async () => {
                const spotPrice = await getSpotPrice(
                    props.baseTokenAddress,
                    props.quoteTokenAddress,
                );
                if (spotPrice) {
                    const newDisplayPrice = getDisplayPrice(spotPrice);
                    if (newDisplayPrice !== poolPriceDisplay) {
                        setPoolPriceDisplay(newDisplayPrice);
                    }
                }
                if (spotPrice && spotPrice !== tradeData.poolPriceNonDisplay) {
                    dispatch(setPoolPriceNonDisplay(spotPrice));
                }
            })();
        }
    }, [
        props.lastBlockNumber,
        props.baseTokenAddress,
        props.quoteTokenAddress,
        props.baseTokenDecimals,
        props.quoteTokenDecimals,
        !!props.crocEnv,
        tradeData.poolPriceNonDisplay === 0,
        props.isUserLoggedIn,
    ]);

    // Hook to asynchronously query the previous 24 hour cache change for the pool
    useEffect(() => {
        (async () => {
            if (
                props.isServerEnabled &&
                props.baseTokenAddress &&
                props.quoteTokenAddress
            ) {
                try {
                    const priceChangeResult = await cachedGet24hChange(
                        props.chainData.chainId,
                        props.baseTokenAddress,
                        props.quoteTokenAddress,
                        props.chainData.poolIndex,
                        isDenomBase,
                        activeNetwork.graphCacheUrl,
                        Math.floor(Date.now() / CACHE_UPDATE_FREQ_IN_MS),
                    );

                    if (!priceChangeResult) {
                        setPoolPriceChangePercent(undefined);
                        setIsPoolPriceChangePositive(true);
                        return;
                    }
                    if (
                        priceChangeResult > -0.0001 &&
                        priceChangeResult < 0.0001
                    ) {
                        setPoolPriceChangePercent('No Change');
                        setIsPoolPriceChangePositive(true);
                    } else {
                        priceChangeResult > 0
                            ? setIsPoolPriceChangePositive(true)
                            : setIsPoolPriceChangePositive(false);

                        const priceChangePercent = priceChangeResult * 100;

                        const priceChangeString =
                            priceChangePercent > 0
                                ? '+' +
                                  priceChangePercent.toLocaleString('en-US', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                  }) +
                                  '%'
                                : priceChangePercent.toLocaleString('en-US', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                  }) + '%';
                        setPoolPriceChangePercent(priceChangeString);
                    }
                } catch (error) {
                    setPoolPriceChangePercent(undefined);
                }
            }
        })();
    }, [
        props.isServerEnabled,
        isDenomBase,
        props.baseTokenAddress,
        props.quoteTokenAddress,
        props.lastBlockNumber,
    ]);

    return {
        poolPriceDisplay, // Display price based on user-selected denomination
        isPoolInitialized, // Whether the pool is initialized on-chain
        poolPriceChangePercent, // Previous 24-hour price change
        isPoolPriceChangePositive, // True if previous 24-hour price change is green
    };
}
