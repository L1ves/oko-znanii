import React from 'react';
import Head from 'next/head';

import Header from '@/components/landing/sections/Header';
import FirstScreen from '@/components/landing/sections/FirstScreen';
import PlaceTask from '@/components/landing/sections/PlaceTask';
import Advantages from '@/components/landing/sections/Advantages';
import Prices from '@/components/landing/sections/Prices';
import OnlyPro from '@/components/landing/sections/OnlyPro';
import Reviews from '@/components/landing/sections/Reviews';
import LeaveOrder from '@/components/landing/sections/LeaveOrder';
import FAQ from '@/components/landing/sections/FAQ';
import PlaceTaskInfo from '@/components/landing/sections/PlaceTaskInfo';
import Footer from '@/components/landing/sections/Footer';

const LandingPage: React.FC = () => (
  <>
    <Head>
      <title>Око Знаний - Онлайн сервис помощи студентам</title>
      <meta name="description" content="Онлайн сервис помощи студентам: быстро, надёжно, по выгодной цене" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Header />
    <main className="main">
      <FirstScreen />
      <PlaceTask />
      <Advantages />
      <Prices />
      <OnlyPro />
      <Reviews />
      <LeaveOrder />
      <FAQ />
      <PlaceTaskInfo />
    </main>
    <Footer />
  </>
);

export default LandingPage;
