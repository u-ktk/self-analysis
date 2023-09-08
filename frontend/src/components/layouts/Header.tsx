import { Navbar, Nav, Container } from 'react-bootstrap'
import styles from './Header.module.css';
import logo from '../../images/self-analysis-title.png'
import { useAuth } from '../auth/Auth';


const Header = () => {
    const { accessToken } = useAuth();
    return (
        <Navbar bg="body-bg" >
            <Container>
                <img
                    alt="ロゴ画像"
                    src={logo}
                    className="pt-3 mx-auto d-inline-block align-top"
                />
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className={styles.navbar}>
                        <a href="/questions-list" className="m-5">質問リスト</a>
                        <a href="/answer-history" className="m-5">回答履歴</a>
                        <a href="/folder-list" className="m-5">フォルダ一覧</a>
                        <a href="/settings" className="m-5">設定</a>
                        {accessToken ? (
                            <a href="/logout" className="m-5">ログアウト</a>
                        ) : (
                            <a href="/login" className="m-5">ログイン</a>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header
