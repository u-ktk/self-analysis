import { Navbar, Nav, Container } from 'react-bootstrap'
import styles from '../styles/Header.module.css';
import logo from '../../images/self-analysis-title.png'
import searchActive from '../../images/icon/searchActive.svg';
import searchInactive from '../../images/icon/searchInactive.svg';
import createActive from '../../images/icon/createActive.svg';
import createInactive from '../../images/icon/createInactive.svg';
import historyActive from '../../images/icon/historyActive.svg';
import historyInactive from '../../images/icon/historyInactive.svg';
import helpActive from '../../images/icon/helpActive.svg';
import helpInactive from '../../images/icon/helpInactive.svg';
import myPageActive from '../../images/icon/myPageActive.svg';
import myPageInactive from '../../images/icon/myPageInactive.svg';
import { useLocation } from 'react-router-dom';


type Styles = {
    path: string;
    iconActive: string;
    iconInactive: string;
}


const Header: React.FC = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    // アクセスしているページのリンクとラベルはオレンジ、それ以外はグレー 

    const getIconAndLinkStyle = ({ path, iconActive, iconInactive }: Styles) => {
        const isActivePath = (path: string) => {
            return location.pathname === path;
        }
        return {
            icon: isActivePath(path) ? iconActive : iconInactive,
            linkStyle: isActivePath(path) ? styles.activeLink : styles.inactiveLink,
        };
    }

    const { icon: searchIcon, linkStyle: searchLinkStyle } = getIconAndLinkStyle({
        path: currentPath.startsWith('/questions-list') || currentPath.startsWith('/search') || currentPath.startsWith('/questions/default/') ? currentPath : '',
        iconActive: searchActive,
        iconInactive: searchInactive,
    });

    const { icon: historyIcon, linkStyle: historyLinkStyle } = getIconAndLinkStyle({
        path: currentPath.startsWith('/review-questions') || currentPath.startsWith('/folders') ? currentPath : '',
        iconActive: historyActive,
        iconInactive: historyInactive,
    });

    const { icon: createIcon, linkStyle: createLinkStyle } = getIconAndLinkStyle({
        path: currentPath.startsWith('/create-question') ? currentPath : '/create-question',
        iconActive: createActive,
        iconInactive: createInactive,
    });

    const { icon: helpIcon, linkStyle: helpLinkStyle } = getIconAndLinkStyle({
        path: '/help',
        iconActive: helpActive,
        iconInactive: helpInactive,
    });
    const { icon: myPageIcon, linkStyle: myPageLinkStyle } = getIconAndLinkStyle({
        path: '/myPage',
        iconActive: myPageActive,
        iconInactive: myPageInactive,
    });


    return (
        <Navbar className={styles.navbar}>
            <div className={styles.logoContainer}>
                <img
                    alt="ロゴ画像"
                    src={logo}
                    width="250rem"
                    height="auto"
                    className={styles.logo}
                />
            </div>
            <div className={styles.navItemsContainer}>
                <div>
                    <a href="/questions-list"
                        className={`m-3 ${searchLinkStyle} ${styles.content} ${styles.container}`}>
                        <img alt="質問を探す" src={searchIcon} width="32" height="32"></img>
                        <div>質問を探す</div>
                    </a>
                </div>
                <div>
                    <a href="/review-questions"
                        className={`m-3 ${historyLinkStyle} ${styles.content} ${styles.container}`}>
                        <img alt="回答の履歴" src={historyIcon} width="32" height="32"></img>
                        <div>回答の履歴</div>
                    </a>
                </div>
                <div>
                    <a href="/create-question"
                        className={`m-3 ${createLinkStyle} ${styles.content} ${styles.container}`}>
                        <img alt="質問を作る" src={createIcon} width="32" height="32"></img>
                        <div>質問を作る</div>
                    </a>
                </div>
                <div>
                    <a href="/help"
                        className={`m-3 ${helpLinkStyle} ${styles.content} ${styles.container}`}>
                        <img alt="使い方ガイド" src={helpIcon} width="32" height="32"></img>
                        <div>使い方ガイド</div>
                    </a>
                </div>
                <div>
                    <a href="/myPage"
                        className={`m-3 ${myPageLinkStyle} ${styles.content} ${styles.container}`}>
                        <img alt="マイページ" src={myPageIcon} width="32" height="32"></img>
                        <div>マイページ</div>
                    </a>
                </div>

            </div>
        </Navbar>
    );
}

export default Header;
