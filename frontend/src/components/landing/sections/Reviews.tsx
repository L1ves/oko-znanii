import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface Review {
  id: number;
  name: string;
  workType: string;
  text: string;
  rating: number;
}

const reviews: Review[] = [
  {
    id: 1,
    name: 'Имя Фамилия',
    workType: 'Дипломная работа',
    text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur',
    rating: 5
  },
  {
    id: 2,
    name: 'Имя Фамилия',
    workType: 'Курсовая работа',
    text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur',
    rating: 5
  },
  {
    id: 3,
    name: 'Имя Фамилия',
    workType: 'Контрольная работа',
    text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur',
    rating: 5
  },
  {
    id: 4,
    name: 'Имя Фамилия',
    workType: 'Реферат',
    text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur',
    rating: 5
  },
  {
    id: 5,
    name: 'Имя Фамилия',
    workType: 'Отчет по практике',
    text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur',
    rating: 5
  },
  {
    id: 6,
    name: 'Имя Фамилия',
    workType: 'Эссе',
    text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur',
    rating: 5
  },
  {
    id: 7,
    name: 'Имя Фамилия',
    workType: 'Лабораторная работа',
    text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur',
    rating: 5
  },
  {
    id: 8,
    name: 'Имя Фамилия',
    workType: 'Чертеж',
    text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur',
    rating: 5
  }
];

const ReviewSlide: React.FC<{ review: Review }> = ({ review }) => (
  <div className="reviews__slider-slide">
    <div className="reviews__slider-slide-name">{review.name}</div>
    <div className="reviews__slider-slide-type">{review.workType}</div>
    <div className="reviews__slider-slide-text">{review.text}</div>
    <div className="reviews__slider-slide-bottom">
      <div className="reviews__slider-slide-rating">
        {[...Array(review.rating)].map((_, index) => (
          <div key={index} className="reviews__slider-slide-rating-star"></div>
        ))}
      </div>
    </div>
  </div>
);

const Reviews: React.FC = () => {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const paginationRef = useRef<HTMLDivElement | null>(null);

  return (
    <section className="reviews" id="reviews">
      <div className="mcontainer">
        <h2 className="reviews__title">
          Око знаний открывает новые горизонты в учёбе. В раздумьях, довериться ли нам?
        </h2>

        <div className="reviews__description">
          Почитай отзывы студентов, которые воспользовались сервисом и решили учится по-новому! 👊🏻
        </div>

        <div className="reviews__slider">
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            onBeforeInit={(swiper) => {
              // @ts-expect-error - Swiper types allow assignment at runtime
              swiper.params.navigation.prevEl = prevRef.current;
              // @ts-expect-error - Swiper types allow assignment at runtime
              swiper.params.navigation.nextEl = nextRef.current;
              // @ts-expect-error - Swiper types allow assignment at runtime
              swiper.params.pagination.el = paginationRef.current;
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            pagination={{
              clickable: true,
              el: paginationRef.current,
              bulletClass: 'swiper-pagination-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active',
            }}
            className="swiper"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id} className="swiper-slide">
                <ReviewSlide review={review} />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="reviews__slider-controls">
            <button ref={prevRef} className="reviews__slider-controls-prev" aria-label="Предыдущий отзыв"></button>
            <div ref={paginationRef} className="reviews__slider-controls-pagination"></div>
            <button ref={nextRef} className="reviews__slider-controls-next" aria-label="Следующий отзыв"></button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;

