import React, { useEffect, useState } from "react";
import axios from "../../axios";
import { imageUrl, imageUrl2 } from "../../Constants/Constance";

import useUpdateMylist from "../../CustomHooks/useUpdateMylist";
import usePlayMovie from "../../CustomHooks/usePlayMovie";
import useUpdateWatchedMovies from "../../CustomHooks/useUpdateWatchedMovies";
import useUpdateLikedMovies from "../../CustomHooks/useUpdateLikedMovies";
import useGenereConverter from "../../CustomHooks/useGenereConverter";

import { Fade } from "react-reveal";
import YouTube from "react-youtube";
import StarRatings from "react-star-ratings";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./RowPostStyles.scss";

function RowPost({ title, url, movieData, islarge, first }) {
  const { addToMyList, PopupMessage } = useUpdateMylist();
  const { playMovie } = usePlayMovie();
  const { removeFromWatchedMovies, removePopupMessage } =
    useUpdateWatchedMovies();
  const { addToLikedMovies } = useUpdateLikedMovies();
  const { convertGenere } = useGenereConverter();

  const [movies, setMovies] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [popupMovie, setPopupMovie] = useState(null);
  const [video, setVideo] = useState(null);
  const [allowPopup, setAllowPopup] = useState(true);

  useEffect(() => {
    if (movieData) {
      setMovies(movieData);
      return;
    }

    const fetchMovies = async () => {
      const response = await axios.get(url);
      setMovies(response.data.results);
    };

    fetchMovies();
  }, [url, movieData]);

  const sliderSettings = {
    breakpoints: {
      1800: { slidesPerView: 6 },
      1536: { slidesPerView: 5 },
      1280: { slidesPerView: 4 },
      768: { slidesPerView: 3 },
      0: { slidesPerView: 2 },
    },
  };

  const youtubeOpts = {
    width: "100%",
    playerVars: { autoplay: 1 },
  };

  const openPopup = async (movie) => {
    if (!allowPopup) return;

    setPopupMovie(movie);
    setShowModal(true);

    const res = await axios.get(`/movie/${movie.id}/videos`, {
      params: {
        api_key: import.meta.env.VITE_TMDB_API_KEY,
        language: "en-US",
      },
    });

    if (res.data.results.length > 0) {
      setVideo(res.data.results[0]);
    }
  };

  return (
    <div
      className="ml-2 lg:ml-11 mb-12 RowContainer"
      style={{ marginTop: first ? "-8rem" : "0" }}
    >
      {PopupMessage}
      {removePopupMessage}

      {movies.length > 0 ? (
        <>
          <h2 className="text-white text-xl md:text-3xl mb-4">{title}</h2>

          <Swiper
            {...sliderSettings}
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={10}
          >
            {movies.map((movie) => (
              <SwiperSlide
                key={movie.id}
                className={islarge ? "large" : ""}
                onClick={() => openPopup(movie)}
              >
                <img
                  loading="lazy"
                  className="rounded-md"
                  src={
                    islarge
                      ? imageUrl + movie.poster_path
                      : movie.backdrop_path
                        ? imageUrl2 + movie.backdrop_path
                        : ""
                  }
                  alt={movie.title || movie.name}
                />

                <div className="content">
                  <Fade bottom>
                    <h3 className="text-white mt-2 font-medium">
                      {movie.title || movie.name}
                    </h3>

                    <StarRatings
                      rating={movie.vote_average / 2}
                      starRatedColor="#facc15"
                      numberOfStars={5}
                      starDimension="0.8rem"
                      starSpacing="0.2rem"
                    />

                    <div className="hidden lg:block text-xs text-gray-400">
                      {convertGenere(movie.genre_ids).slice(0, 3).join(", ")}
                    </div>
                  </Fade>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      ) : (
        <div className="animate-pulse h-64 bg-neutral-900 rounded-md"></div>
      )}

      {/* POPUP */}
      {showModal && popupMovie && (
        <>
          <div className="fixed inset-0 z-50 flex justify-center items-center">
            <Fade>
              <div className="bg-neutral-800 rounded-lg max-w-3xl w-full mx-4 relative">
                <button
                  className="absolute top-4 right-4 text-white"
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>

                {video ? (
                  <YouTube videoId={video.key} opts={youtubeOpts} />
                ) : (
                  <img
                    src={imageUrl + popupMovie.backdrop_path}
                    alt=""
                  />
                )}

                <div className="p-6">
                  <h2 className="text-white text-2xl font-bold">
                    {popupMovie.title || popupMovie.name}
                  </h2>

                  <p className="text-gray-400 mt-3">
                    {popupMovie.overview}
                  </p>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={() => playMovie(popupMovie)}
                      className="bg-accent px-6 py-2 rounded text-white"
                    >
                      ▶ Play
                    </button>

                    <button
                      onClick={() => addToMyList(popupMovie)}
                      className="border px-6 py-2 rounded text-white"
                    >
                      + My List
                    </button>

                    <button
                      onClick={() => addToLikedMovies(popupMovie)}
                      className="border px-6 py-2 rounded text-white"
                    >
                      ❤ Like
                    </button>
                  </div>
                </div>
              </div>
            </Fade>
          </div>

          <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
        </>
      )}
    </div>
  );
}

export default RowPost;
