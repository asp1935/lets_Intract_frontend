import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router'
import ThemeSection from '../components/Portfolio/ThemeSection';
import Hero from '../components/Portfolio/Hero';
import About from '../components/Portfolio/About';
import Services from '../components/Portfolio/Services';
import Clients from '../components/Portfolio/Clients';
import Gallery from '../components/Portfolio/Gallery';
import '../portfolio.css';
function Portfolio() {
    const { userName } = useParams();
    const [portfolio, setPortfolio] = useState(null);
    const [isloading, setIsLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [primaryColor, setPrimaryColor] = useState('#3498db');


    const apiUrl = import.meta.env.VITE_API_URL

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const responce = await axios.get(`${apiUrl}/portfolio/user-portfolio/${userName}`)
                if (responce?.data) {
                    setPortfolio(responce.data.data);

                    setPrimaryColor(responce.data.data.theme)
                    setTimeout(() => {
                        setIsLoading(false)
                    }, 1000)
                } else {
                    setNotFound(true);
                }

            } catch (err) {
                if (err.response?.status === 404) {
                    setNotFound(true)
                } else {
                    console.log('Failed To Find Portfolio');
                }
            }
        }
        fetchPortfolio();
    }, [apiUrl, userName])

    useEffect(() => {
        // Simulate API fetch
        document.documentElement.style.setProperty('--primary-color', primaryColor);
    }, [primaryColor]);

    if (notFound) return <Navigate to="/404" />;
    if (isloading) return <div className='w-full h-screen  flex justify-center items-center'><img src="/loading.gif" alt="" /></div>;
    const theme = ["#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6"]
    return (
        <div className='w-screen'>
            <div className="fixed top-0  w-full z-50  bg-white shadow-sm">
                <ThemeSection
                    themes={theme}
                    onThemeChange={(color) => setPrimaryColor(color)}
                />
            </div>
            {/* Main content with padding to account for fixed header */}
            <div className="pt-16"> {/* Adjust this padding based on your ThemeSection height */}
                {/* <Header businessInfo={data.businessInfo} /> */}
                {/* <Profile businessInfo={data.businessInfo}/> */}
                <Hero businessInfo={portfolio} />
                <About businessInfo={portfolio} />
                {portfolio.services.length > 0 && (
                    <Services services={portfolio.services} />
                )}
                {portfolio.clients.length > 0 && (
                    <Clients clients={portfolio.clients} />
                )}
                {portfolio.gallery.length > 0 && (
                    <Gallery galleryItems={portfolio.gallery} />
                )}
                {/* <Contact contactInfo={data.businessInfo.contact} /> */}
            </div>
        </div>
    )
}

export default Portfolio
