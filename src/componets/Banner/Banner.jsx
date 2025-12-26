import React, { useState, useEffect, useContext } from "react";
import axios from "../../axios";
import { imageUrl } from "../../Constants/Constance";
import { PopUpContext } from "../../Context/moviePopUpContext";
import { Fade } from "react-reveal";
import StarRatings from "react-star-ratings";
import MoviePopUp from "../PopUp/MoviePopUp";
import usePlayMovie from "../../CustomHooks/usePlayMovie";

function Banner({ url }) {
  const { showModal, setShowModal } = useContext(PopUpContext);
  const { playMovie } = usePlayMovie();

  const [movie, setMovie] = useState(null);
  const [moviePopupInfo, setMoviePopupInfo] = useState(null);
  const [videoId, setVideoId] = useState(null);

  // Fetch banner movie
  useEffect(() => {
    let isMounted = true;

    axios.get(url).then((response) => {
      if (!isMounted) return;

      const randomMovie =
        response.data.results[
        Math.floor(Math.random() * response.data.results.length)
        ];

      setMovie(randomMovie);
    });

    return () => {
      isMounted = false;
    };
  }, [url]);

  // Handle popup + trailer fetch
  const handleMoviePopup = async (movieInfo) => {
    setMoviePopupInfo(movieInfo);
    setShowModal(true);

    try {
      const response = await axios.get(
        `/movie/${movieInfo.id}/videos`,
        {
          params: {
            api_key: import.meta.env.VITE_TMDB_API_KEY,
            language: "en-US",
          },
        }
      );

      if (response.data.results.length > 0) {
        setVideoId(response.data.results[0]);
      }
    } catch (error) {
      console.error("Failed to fetch trailer", error);
    }
  };

  return (
    <>
      <div
        style={{
          backgroundImage: movie
            ? `linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 40%), 
               url(${imageUrl}${movie.backdrop_path})`
            : "none",
        }}
        className="h-[50rem] md:h-[55rem] bg-cover bg-center grid items-center"
      >
        <div className="mx-4 sm:ml-12 mt-[70%] sm:mt-52">
          <Fade bottom>
            {movie ? (
              <>
                <h1 className="text-white text-4xl sm:text-6xl font-bold mb-5 border-l-8 pl-4 border-accent">
                  {movie.title || movie.name}
                </h1>

                <div className="flex items-center gap-4 mb-3">
                  {movie.vote_average && (
                    <StarRatings
                      rating={movie.vote_average / 2}
                      starRatedColor="#facc15"
                      numberOfStars={5}
                      starDimension="1.1rem"
                      starSpacing="0.2rem"
                    />
                  )}

                  <span className="text-white font-semibold">
                    {movie.release_date || movie.first_air_date}
                  </span>

                  <span className="px-2 py-0.5 bg-black/60 border border-gray-500 rounded text-white">
                    HD
                  </span>
                </div>

                <p className="text-white text-lg max-w-xl line-clamp-3 mb-6">
                  {movie.overview}
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => playMovie(movie)}
                    className="flex items-center gap-2 bg-accent hover:bg-accentDark text-white font-semibold px-8 py-2 rounded-md transition"
                  >
                    ▶ Play
                  </button>

                  <button
                    onClick={() => handleMoviePopup(movie)}
                    className="flex items-center gap-2 bg-white/20 hover:bg-white hover:text-black text-white font-semibold px-6 py-2 rounded-md transition"
                  >
                    ℹ More Info
                  </button>
                </div>
              </>
            ) : (
              <div className="animate-pulse w-96 h-48 bg-neutral-800 rounded-md" />
            )}
          </Fade>
        </div>

        <div className="h-80 mt-auto bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {showModal && (
        <MoviePopUp data1={moviePopupInfo} data2={videoId} />
      )}
    </>
  );
}

export default Banner;
