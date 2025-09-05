import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

const PlaceTaskInfo: React.FC = () => {
  const router = useRouter();
  return (
    <section className="place-task-info">
      <div className="mcontainer">
        <div className="place-task-info__wrapper">
          <div className="place-task-info__client">
            <div className="place-task-info__client-title">Для заказчика</div>
            <button className="place-task-info__client-button button" onClick={() => router.push('/client/orders')}>Разместить задание</button>
          </div>

          <div className="place-task-info__expert">
            <div className="place-task-info__expert-title">Для экспертов</div>
            <button className="place-task-info__expert-button button" onClick={() => router.push('/expert/dashboard')}>Стать экспертом</button>
          </div>

          <figure className="place-task-info__photo">
            <Image className="place-task-info__photo-image" src="/assets/place-task-info/place-task-info-photo.png" alt="teacher" width={695} height={560} priority />
          </figure>
        </div>
      </div>
    </section>
  );
};

export default PlaceTaskInfo;



