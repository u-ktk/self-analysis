import React from 'react'
import HeadTitle from '../../components/layouts/HeadTitle'
import HowToUse from '../../features/Help/HowToUse';
import AboutThisSite from '../../features/Help/AboutThisSite';

import formStyles from '../../components/styles/Form.module.css';
import styles from '../../components/styles/Common.module.css';




const HelpPage = () => {
    return (
        <>
            <HeadTitle title='使い方ガイド' />
            <>
                <AboutThisSite />
                <HowToUse />

            </>
        </>
    )

}

export default HelpPage