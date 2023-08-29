import { Navbar, Nav, Container } from 'react-bootstrap'
import Link from 'next/link'
import styles from './Header.module.css'
import Image from 'next/image'
import logo from "@/images/self-analysis-title.png";


const Header = () => {
  return (
    <Navbar bg="body-bg" >
      <Container>
      <Image
                alt="ロゴ画像"
                src={logo}
                width="345"
                height="40"
                className="pt-3 mx-auto d-inline-block align-top"
              />
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
      <Nav className={styles.navbar}>
            <Link href="/questions-list" className="m-5">質問リスト</Link>
            <Link href="/answer-history" className="m-5">回答履歴</Link>
            <Link href="/folder-list" className="m-5">フォルダ一覧</Link>
            <Link href="/settings" className="m-5">設定</Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
