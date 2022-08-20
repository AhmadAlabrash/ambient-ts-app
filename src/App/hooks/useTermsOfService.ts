import { useEffect, useState } from 'react';

export const useTermsOfService = (): [
    string,
    boolean,
    string,
    (date: string) => void,
    (date: string) => void
] => {
    // user data object from local storage
    const [ userData, setUserData ] = useState(JSON.parse(localStorage.getItem('user') as string));
    // boolean agreement status whether user has accepted ToS
    const [ agreement, setAgreement ] = useState(userData?.termsOfService?.agreed);
    // ISO date string representing when the user accepted or rejected ToS
    const [ agreementDate, setAgreementDate ] = useState(userData?.termsOfService?.date);
    // recursive function to query local storage until current user agreement is returned
    useEffect(() => {
        function getUserData() {
            localStorage.user
                ? setUserData(JSON.parse(localStorage.getItem('user') as string))
                : setTimeout(() => getUserData(), 500);
        }
        getUserData();
    }, []);
    // recursive function to set agreement details once user object is received
    useEffect(() => {
        userData && setAgreement(userData.termsOfService.agreed);
        userData && setAgreementDate(userData.termsOfService.date);
    }, [userData]);

    // text of the ToS
    // we may want to put this in its own data file and import it
    const tosText = 'Doug will have to put something here.'

    // function to reflect user accepting ToS
    const agreeToS = (date: string) => {
        // data conformed to shape used in local storage
        const details = {
            agreed: true,
            date: date
        }
        // update agreement status in local state
        setAgreement(details.agreed);
        // update agreement date in local state
        setAgreementDate(details.date);
        // make a local copy of the userData value from local state
        const newUserData = userData;
        // update terms of service in copy of user data object
        newUserData.termsOfService = details;
        // send updated user data to local storage
        localStorage.setItem('user', JSON.stringify(newUserData));
    }

    // function to reflect user rejecting ToS
    // same logic as in the function above
    // this could stand to be more centralized
    const rejectToS = (date: string) => {
        const details = {
            agreed: false,
            date: date
        }
        setAgreement(details.agreed);
        setAgreementDate(details.date);
        const newUserData = userData;
        newUserData.termsOfService = details;
        localStorage.setItem('user', JSON.stringify(newUserData));
    }

    return [
        tosText,
        agreement,
        agreementDate,
        agreeToS,
        rejectToS
    ];
}