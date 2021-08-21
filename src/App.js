import './App.css';
import Quote from "./Quote";
import {useEffect, useState} from "react";
import { createApi } from "unsplash-js";
import {RiArrowRightSLine} from "react-icons/ri"
import {AiOutlineLoading} from "react-icons/ai"
import Loading from "./Loading";

const unsplash = createApi({
    accessKey: "YOUR_UNSPLASH_ACCESS_KEY",
});

function App() {

    const url = 'https://goquotes-api.herokuapp.com/api/v1/random?count=1';
    const [quote, setQuote] = useState(null);
    const [tag, setTag] = useState(null);
    const [image, setImage] = useState(null);
    const [isLoading,setIsloading] = useState(true);
    const [author, setAuthor] = useState(null);

    const getRandomQuote = async () => {
        setIsloading(true);
        try {
            const response = await fetch(url);
            const jsonResponse = await response.json();

            if (jsonResponse.message === 'success' && jsonResponse.quotes.length === 1) {
                const {text, tag, author} = jsonResponse.quotes[0]
                const unsplashResponse = await unsplash.photos.getRandom({query: tag});
                const unsplashImageData = await unsplashResponse.response;
                setQuote(text)
                setTag(tag)
                setAuthor(author);
                setImage(unsplashImageData.urls.regular);
                setIsloading(false);
            }
        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        getRandomQuote();
    }, []);


    return (
        <div className="App">
            <div className="container">
                <div className="img-container" style={{backgroundImage: "url(" + image + ")"}}>
                </div>
                <div className="quote-container">
                    {isLoading ? <Loading/> : <Quote author={author} quote={quote}/>  }
                    <button className={isLoading ? 'is-loading' : ''} onClick={() => getRandomQuote()}>Get another quote {isLoading ? <AiOutlineLoading/> : <RiArrowRightSLine/> } </button>
                </div>
            </div>
            <div className="container-shadow"></div>
        </div>
    );
}

export default App;
