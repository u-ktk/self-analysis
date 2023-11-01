import React from 'react'
import HeadTitle from '../../components/layouts/HeadTitle'
import HowToUse from '../../features/Help/HowToUse';
import AboutThisSite from '../../features/Help/AboutThisSite';
import Exmaple from '../../features/Help/Example';
import { HashLink } from 'react-router-hash-link';

import formStyles from '../../components/styles/Form.module.css';
import styles from '../../components/styles/Common.module.css';
import helpStyles from '../../components/styles/Help.module.css';
import dropDown from '../../images/icon/dropDown.svg';




const HelpPage = () => {
    return (
        <>
            <HeadTitle title='使い方ガイド' />
            <>

                <div className={styles.bg}>
                    <h4 className={styles.title}>目次</h4>

                    <div className={styles.contents}>
                        <div className={helpStyles.outline}>
                            <div className={helpStyles.outlineText}>
                                <HashLink to="#aboutThisSite" smooth className={helpStyles.link}>
                                    <img src={dropDown} alt="クリック" />
                                    <span>このサイトについて</span>
                                </HashLink>
                            </div>
                            <div className={helpStyles.outlineText}>
                                <HashLink to="#howToUse" smooth className={helpStyles.link}>
                                    <img src={dropDown} alt="クリック" />

                                    <span>使い方の流れ</span>
                                </HashLink>
                            </div>
                            <div className={helpStyles.outlineText}>

                                <HashLink to="#example" smooth className={helpStyles.link}>
                                    <img src={dropDown} alt="クリック" />

                                    <span>自己分析を活かす方法</span>
                                </HashLink>
                            </div>

                        </div>
                    </div>
                </div>
                <div id="aboutThisSite">
                    <AboutThisSite />
                </div>
                <div id="howToUse">
                    <HowToUse />
                </div>
                <div id="example">
                    <Exmaple />
                </div>

            </>
        </>
    )

}

export default HelpPage