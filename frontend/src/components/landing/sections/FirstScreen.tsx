import React from 'react';

const FirstScreen: React.FC = () => (
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
            <button className="first-screen__content-buttons-task button">
              Разместить задание
            </button>
            <button className="first-screen__content-buttons-expert button">Стать экспертом</button>
          </div>
        </div>

        <figure className="first-screen__figure">
          <img
            className="first-screen__figure-image"
            src="/assets/first-screen/first-screen-students.png"
            alt="students"
          />
        </figure>
      </div>
    </div>
  </section>
);

export default FirstScreen;



