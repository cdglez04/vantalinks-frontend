import '../App.css'
import { TextAnimate } from "@/components/ui/text-animate.jsx"
import { ShimmerButton } from "@/components/ui/shimmer-button.jsx"
import { Link } from "react-router-dom"



function Home() {
  return (
    <>
      <div className='ab-main-container'>
        <div className='ab-login-register-buttons-container'>
            <Link to="/login">
              <button className="ab-login-button">Log In</button>
            </Link>
            <Link to="/register">
              <button className="ab-register-button">Register</button>
            </Link>
        </div>
        <TextAnimate className={"ab-title"} animation="blurInUp" by="character" accessible={false} duration={2}>
          Vanta Links
        </TextAnimate>
        <div className='ab-description-section'>
          <TextAnimate animation="slideUp" by="word" accessible={false}>
            Your quick and reliable URL manager for everyday use.
            All your links, neatly organized and always within reach.
          </TextAnimate>
          <TextAnimate animation="slideUp" by="word" accessible={false}>
            Fast access, effortless management, and always ready when you need it.
          </TextAnimate>
        </div>
        {/*<ShimmerButton className={"ab-button"} shimmerColor="#ffffff" shimmerDuration="3s" shimmerSize="0.05em" borderRadius="100px" background="rgba(0, 0, 0, 1)">How It Works</ShimmerButton>*/}
        <hr className='ab-hr'/>
        <div className='ab-section-1'>
          <video 
            autoPlay 
            muted 
            loop
            className='ab-video-1' 
            type="video/mp4" 
            src="/videos/vantalinks_video.mp4">  
          </video>
          <div className='ab-container-info'>
            <h1 className='ab-section-1-text'>It solves a big problem.</h1>
            <p className='ab-section-1-pharagraph'>
              In a world where we increasingly use digital
              platforms like GitHub, YouTube, and Instagram, 
              it's easy to lose important links.
              <br />
              <br />
              Vanta Links allows you to have access
              to all your links organized, categorized, 
              and accessible from a single place.
            </p>
          </div>
        </div>
      </div>
      <div className='ab-footer'>
        <hr />
        <h1>Credits</h1>
        <div className='ab-footer-links-div'>
          <div>
            <a href="https://www.harvard.edu/" target='_blank' rel='noopener noreferrer'>Harvard U</a><br />
            <a href="https://excalidraw.com/">Excalidraw</a><br />
          </div>
          <div>
            <a href="https://cs50.harvard.edu/web/" target='_blank' rel='noopener noreferrer'>CS50 Web</a><br />
            <a href="https://www.edx.org/cs50" target='_blank' rel='noopener noreferrer'>Edx</a><br />
          </div>
          <div>
            <a href="https://yesicon.app/" target='_blank' rel='noopener noreferrer'>Yesicon</a><br />
            <a href="https://magicui.design/" target='_blank' rel='noopener noreferrer'>Magic UI</a><br />
          </div>
          <div>
            <a href="https://bazaar.it/" target='_blank' rel='noopener noreferrer'>Bazaar.it</a><br />
            <a href="https://www.scrollxui.dev/">ScrollX UI</a>
          </div>
        </div>
     </div>     
    </>

  )
}

export default Home
