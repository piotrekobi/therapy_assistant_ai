import MenuBar from './MenuBar';
import '../css/Header.css';

const Header = ({ title }) => {
    return (
        <header>
            <h1>{title}</h1>
            <MenuBar />
        </header>
    );
};

export default Header;
