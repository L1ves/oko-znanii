import React from 'react';

const PlaceTaskInfo: React.FC = () => (
  <section className="place-task-info">
    <div className="mcontainer">
      <div className="place-task-info__wrapper">
        <div className="place-task-info__client">
          <div className="place-task-info__client-title">Для заказчика</div>
          <button className="place-task-info__client-button button">Разместить задание</button>
        </div>

        <div className="place-task-info__expert">
          <div className="place-task-info__expert-title">Для экспертов</div>
          <button className="place-task-info__expert-button button">Стать экспертом</button>
        </div>

        <figure className="place-task-info__photo">
          <img className="place-task-info__photo-image" src="/assets/place-task-info/place-task-info-photo.png" alt="teacher" />
        </figure>
      </div>
    </div>
  </section>
);

export default PlaceTaskInfo;



