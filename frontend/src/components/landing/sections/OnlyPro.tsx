import React from 'react';

const OnlyPro: React.FC = () => {
  return (
    <section className="only-pro">
      <div className="mcontainer">
        <div className="only-pro__wrapper">
          <figure className="only-pro__teacher">
            <img
              className="only-pro__teacher-image"
              src="/assets/only-pro/only-pro-image.png"
              alt="teacher"
            />
          </figure>

          <div className="only-pro__main">
            <h2 className="only-pro__title">Работают только профи</h2>
            <div className="only-pro__description">ТОП универы, для нас важен диплом эксперта</div>

            <div className="only-pro__logos">
              <figure className="only-pro__logos-item">
                <img
                  className="only-pro__logos-item-image"
                  src="/assets/only-pro/only-pro-icon-1.png"
                  alt="icon"
                />
              </figure>

              <figure className="only-pro__logos-item">
                <img
                  className="only-pro__logos-item-image"
                  src="/assets/only-pro/only-pro-icon-2.png"
                  alt="icon"
                />
              </figure>

              <figure className="only-pro__logos-item">
                <img
                  className="only-pro__logos-item-image"
                  src="/assets/only-pro/only-pro-icon-3.png"
                  alt="icon"
                />
              </figure>

              <figure className="only-pro__logos-item">
                <img
                  className="only-pro__logos-item-image"
                  src="/assets/only-pro/only-pro-icon-4.png"
                  alt="icon"
                />
              </figure>

              <figure className="only-pro__logos-item">
                <img
                  className="only-pro__logos-item-image"
                  src="/assets/only-pro/only-pro-icon-5.png"
                  alt="icon"
                />
              </figure>

              <figure className="only-pro__logos-item">
                <img
                  className="only-pro__logos-item-image"
                  src="/assets/only-pro/only-pro-icon-6.png"
                  alt="icon"
                />
              </figure>

              <figure className="only-pro__logos-item">
                <img
                  className="only-pro__logos-item-image"
                  src="/assets/only-pro/only-pro-icon-7.png"
                  alt="icon"
                />
              </figure>

              <figure className="only-pro__logos-item">
                <img
                  className="only-pro__logos-item-image"
                  src="/assets/only-pro/only-pro-icon-8.png"
                  alt="icon"
                />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnlyPro;
