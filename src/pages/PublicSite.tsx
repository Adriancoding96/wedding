import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/sections/Hero'
import OurStory from '../components/sections/OurStory'
import Gallery from '../components/sections/Gallery'
import Location from '../components/sections/Location'
import Schedule from '../components/sections/Schedule'
import FAQ from '../components/sections/FAQ'
import EmailSignup from '../components/sections/EmailSignup'
// import PintChase from '../components/sections/PintChase'

export default function PublicSite() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <OurStory />
        <Gallery />
        <Location />
        <Schedule />
        <FAQ />
        <EmailSignup />
        {/* <PintChase /> */}
      </main>
      <Footer />
    </>
  )
}
