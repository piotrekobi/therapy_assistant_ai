import Header from './components/Header';
import LanguageSelect from './components/LanguageSelect';
import Button from './components/Button';
import Output from './components/Output';
import RandomWordInput from './components/RandomWordInput';
import NotificationLabel from './components/NotificationLabel';
import WidgetContainer from './components/WidgetContainer';
import ShareButton from './components/ShareButton';

export const GeneratorPage = () => (
    <div>
        <Header title="Generator samogłosek, słów i zdań" />
        <div className="button-container">
            <div className="button-row">
                <LanguageSelect />
                <Button text="Losuj samogłoski" />

                <Button text="Losuj słowa" />
            </div>
            <WidgetContainer />
        </div>
        <div className="widget-container centered">
            <RandomWordInput />
        </div>
        <NotificationLabel />
        <Output />
        <ShareButton />
    </div>
);

export default GeneratorPage;
