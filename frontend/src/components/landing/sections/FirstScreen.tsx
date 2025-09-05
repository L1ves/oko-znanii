import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const FirstScreen: React.FC = () => {
  const router = useRouter();
  return (
    <section className="first-screen">
      <div className="mcontainer">
        <div className="first-screen__wrapper">
          <div className="first-screen__content">
            <h1 className="first-screen__content-title">
              Онлайн сервис помощи студентам: быстро, надёжно, по выгодной цене
            </h1>
            <div className="first-screen__content-descripton">
              Экономьте время: Разместите задание, и эксперт быстро поможет с консультацией
            </div>
            <div className="first-screen__content-buttons">
              <button className="first-screen__content-buttons-task button" onClick={() => router.push('/client/orders')}>
                Разместить задание
              </button>
              <button className="first-screen__content-buttons-expert button" onClick={() => router.push('/expert/dashboard')}>Стать экспертом</button>
            </div>
          </div>

          <figure className="first-screen__figure">
            <Image
              className="first-screen__figure-image"
              src="/assets/first-screen/first-screen-students.png"
              alt="students"
              width={811}
              height={879}
              priority
            />
          </figure>
        </div>
      </div>
    </section>
  );
};

export default FirstScreen;



